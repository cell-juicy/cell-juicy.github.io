export function any2Number(value: any): number {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
}

/* Order Processing */
export function processBlogOrder(order: any): number {
    return any2Number(order);
}

export function processDocOrder(order: any): number[] {

    if (Array.isArray(order)) {
        return order.map(any2Number);
    }

    if (typeof order === "number") {
        return [any2Number(order)]
    }

    if (typeof order === "string") {
        const separators = /[,，|/:;\s]+/
        const splitResult = order.trim().split(separators).map(any2Number);
        return splitResult.length > 0 ? splitResult : [0];
    }

    return [0];
}

/* Resolve Next & Prev Input */
export function resolveNavigationInput(input: any): { text?: string; link?: string } | { text: false; link: false } {
    if (input === false) return { text: false, link: false };
    if (typeof input === 'object' && input !== null) {
        return {
            text: typeof input.text === 'string' ? input.text : undefined,
            link: typeof input.link === 'string' ? input.link : undefined,
        };
    };
    return {};
}


export function formatTimeLabel(
    lastUpdated: Date | undefined,
    createdAt: Date | undefined,
    pattern: string
): string | undefined {
    if (!lastUpdated && !createdAt) return undefined;
    const pad = (n: number) => (n < 10 ? "0" + n : "" + n);

    const map: Record<string, string> = {
        lYYYY: lastUpdated ? "" + lastUpdated.getFullYear() : "",
        lYY: lastUpdated ? ("" + lastUpdated.getFullYear()).slice(-2) : "",
        lMM: lastUpdated ? pad(lastUpdated.getMonth() + 1) : "",
        lM: lastUpdated ? "" + (lastUpdated.getMonth() + 1) : "",
        lDD: lastUpdated ? pad(lastUpdated.getDate()) : "",
        lD: lastUpdated ? "" + lastUpdated.getDate() : "",
        lhh: lastUpdated ? pad(lastUpdated.getHours()) : "",
        lh: lastUpdated ? "" + lastUpdated.getHours() : "",
        lmm: lastUpdated ? pad(lastUpdated.getMinutes()) : "",
        lm: lastUpdated ? "" + lastUpdated.getMinutes() : "",
        lss: lastUpdated ? pad(lastUpdated.getSeconds()) : "",
        ls: lastUpdated ? "" + lastUpdated.getSeconds() : "",

        cYYYY: createdAt ? "" + createdAt.getFullYear() : "",
        cYY: createdAt ? ("" + createdAt.getFullYear()).slice(-2) : "",
        cMM: createdAt ? pad(createdAt.getMonth() + 1) : "",
        cM: createdAt ? "" + (createdAt.getMonth() + 1) : "",
        cDD: createdAt ? pad(createdAt.getDate()) : "",
        cD: createdAt ? "" + createdAt.getDate() : "",
        chh: createdAt ? pad(createdAt.getHours()) : "",
        ch: createdAt ? "" + createdAt.getHours() : "",
        cmm: createdAt ? pad(createdAt.getMinutes()) : "",
        cm: createdAt ? "" + createdAt.getMinutes() : "",
        css: createdAt ? pad(createdAt.getSeconds()) : "",
        cs: createdAt ? "" + createdAt.getSeconds() : "",
    };

    return pattern.replace(
        /\blYYYY\b|\blYY\b|\blMM\b|\blM\b|\blDD\b|\blD\b|\blhh\b|\blh\b|\blmm\b|\blm\b|\blss\b|\bls\b|\bcYYYY\b|\bcYY\b|\bcMM\b|\bcM\b|\bcDD\b|\bcD\b|\bchh\b|\bch\b|\bcmm\b|\bcm\b|\bcss\b|\bcs\b/g,
        (match) => map[match] || ""
    );
}