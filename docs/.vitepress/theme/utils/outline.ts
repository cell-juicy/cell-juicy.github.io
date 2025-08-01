import { onMounted, onUpdated, onUnmounted, nextTick } from 'vue';
import type { Ref } from 'vue';

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

const IGNORE_HEADER = /[-_\s]ignore-header$/;
const store: HeaderData[] = []

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

    store.length = 0;
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

        store.push(node);
        stack.push(node);
    });
    return result;
};

export function useActiveAnchor(outline: Ref<Element | null>, scrollArea: Ref<Element | null>) {
    let prevActiveLink: Element | null = null;
    onMounted(() => {
        nextTick(() => {if (scrollArea.value) {
            scrollArea.value.addEventListener("scroll", setActiveLink);
        };})
    });
    onUpdated(() => {
        activateLink(location.hash);
    });
    onUnmounted(() => {
        if (scrollArea.value) {
            scrollArea.value.removeEventListener("scroll", setActiveLink);
        };
    });
    function setActiveLink() {
        if (!outline.value || !scrollArea.value) return;

        const currTop = scrollArea.value.scrollTop;
        const headers = store.map(({ element, link }) => ({
            link,
            top: getAbsoluteTop(element, (scrollArea.value as Element))
        }))
            .filter(({ top }) => !Number.isNaN(top))
            .sort((a, b) => a.top - b.top);

        if (headers.length === 0) {
            activateLink(null);
            return;
        }

        if (currTop < 1) {
            activateLink(null);
            return;
        };

        if (Math.abs(currTop + scrollArea.value.clientHeight - scrollArea.value.scrollHeight) < 1) {
            activateLink(null);
            return;
        };

        let activeLink: string | null = null;
        for (const { link, top } of headers) {
            if (top > currTop + 1) {
                break;
            }
            activeLink = link;
        }
        activateLink(activeLink);
    }

    function activateLink(hash: string | null) {
        if (!outline.value) return;

        if (prevActiveLink) {
            prevActiveLink.classList.remove("active");
        };

        if (hash === null) {
            prevActiveLink = null;
        } else {
            prevActiveLink = outline.value.querySelector(`a[href="${decodeURIComponent(hash)}"]`);
        };

        const activeLink = prevActiveLink;
        if (activeLink) {
            activeLink.classList.add("active");
        };
    }
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

function getAbsoluteTop(el: Element, root: Element): number {
    let offsetTop: number = 0;
    let curr: Element | null = el;
    while (curr !== root) {
        if (curr === null) {
            return NaN;
        }
        offsetTop += (curr as HTMLElement).offsetTop;
        curr = (curr as HTMLElement).offsetParent;
    };
    return offsetTop;
}