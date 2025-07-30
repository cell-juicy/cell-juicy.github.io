interface HeaderData {
    element: Element;
    title: string;
    link: string;
    level: number;
    children: HeaderData[];
}

interface IgnoreNode {
    level: number;
    shouldIgnore: boolean;
};

const IGNORE_HEADER = /[-_\s]ignore-header$/

export function getHeaders(
    content: HTMLElement,
    range: number | [number, number] | "deep" | undefined,
    ignore: string | RegExp
) {
    const headers = [
        ...content.querySelectorAll(":where(h1,h2,h3,h4,h5,h6)")
    ]
        .filter((el) => el.id && el.hasChildNodes())
        .map((el) => {
            const level = Number(el.tagName[1]);
            return {
                element: el,
                title: serializeHeader(el, ignore),
                link: "#" + el.id,
                level
            };
        });
    
    const [low, high] = resolveRange(range);
    
    const result: HeaderData[] = [];
    const stack: (HeaderData | IgnoreNode)[] = [];

    headers.forEach((item) => {
        const node: HeaderData = { ...item, children: [] };
        let parent = stack[stack.length - 1];

        while (parent && parent.level >= node.level) {
            stack.pop();
            parent = stack[stack.length - 1];
        };

        if (node.level > high || node.level < low) return;
        if (
            IGNORE_HEADER.test(node.element.id) ||
            (parent && "shouldIgnore" in parent)
        ) {
            stack.push({ level: node.level, shouldIgnore: true });
            return;
        };

        if (parent) {
            parent.children.push(node);
        } else {
            result.push(node);
        };

        stack.push(node);
    });
    return result;
}

function resolveRange(range: number | [number, number] | "deep" | undefined): [number, number] {
    if (typeof range === "number") {
        return [range, range];
    } else if (Array.isArray(range)) {
        return [Math.min(...range), Math.max(...range)]
    } else if (range === "deep") {
        return [2, 6];
    };
    return [2, 6];
}

function serializeHeader(h: Element, ignoreRE: RegExp | string) {
    let ret = "";
    const pattern = (typeof ignoreRE === 'string') ? new RegExp(ignoreRE) : ignoreRE;
    for (const node of h.childNodes) {
        if (node.nodeType === 1) {
            if (pattern.test((node as Element).className)) continue;
            ret += node.textContent;
        } else if (node.nodeType === 3) {
            ret += node.textContent;
        };
    };
    return ret.trim();
}