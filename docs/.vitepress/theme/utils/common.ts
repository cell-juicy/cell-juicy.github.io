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

    const pad = (n: number) => String(n).padStart(2, "0");

    const map: Record<string, string> = {
        ":lYYYY": lastUpdated ? String(lastUpdated.getFullYear()) : "",
        ":lYY": lastUpdated ? String(lastUpdated.getFullYear()).slice(-2) : "",
        ":lMM": lastUpdated ? pad(lastUpdated.getMonth() + 1) : "",
        ":lM": lastUpdated ? String(lastUpdated.getMonth() + 1) : "",
        ":lDD": lastUpdated ? pad(lastUpdated.getDate()) : "",
        ":lD": lastUpdated ? String(lastUpdated.getDate()) : "",
        ":lhh": lastUpdated ? pad(lastUpdated.getHours()) : "",
        ":lh": lastUpdated ? String(lastUpdated.getHours()) : "",
        ":lmm": lastUpdated ? pad(lastUpdated.getMinutes()) : "",
        ":lm": lastUpdated ? String(lastUpdated.getMinutes()) : "",
        ":lss": lastUpdated ? pad(lastUpdated.getSeconds()) : "",
        ":ls": lastUpdated ? String(lastUpdated.getSeconds()) : "",

        ":cYYYY": createdAt ? String(createdAt.getFullYear()) : "",
        ":cYY": createdAt ? String(createdAt.getFullYear()).slice(-2) : "",
        ":cMM": createdAt ? pad(createdAt.getMonth() + 1) : "",
        ":cM": createdAt ? String(createdAt.getMonth() + 1) : "",
        ":cDD": createdAt ? pad(createdAt.getDate()) : "",
        ":cD": createdAt ? String(createdAt.getDate()) : "",
        ":chh": createdAt ? pad(createdAt.getHours()) : "",
        ":ch": createdAt ? String(createdAt.getHours()) : "",
        ":cmm": createdAt ? pad(createdAt.getMinutes()) : "",
        ":cm": createdAt ? String(createdAt.getMinutes()) : "",
        ":css": createdAt ? pad(createdAt.getSeconds()) : "",
        ":cs": createdAt ? String(createdAt.getSeconds()) : "",
    };

    const re = new RegExp(Object.keys(map).join("|"), "g");

    return pattern.replace(re, match => map[match] || "");
}

export function formatDate(date: Date, pattern: string) {
    if (!date) return undefined;

    const pad = (n: number) => String(n).padStart(2, "0");

    const map: Record<string, string> = {
        ":YYYY": String(date.getFullYear()),
        ":YY": String(date.getFullYear()).slice(-2),
        ":MM": pad(date.getMonth() + 1),
        ":M": String(date.getMonth() + 1),
        ":DD": pad(date.getDate()),
        ":D": String(date.getDate()),
        ":hh": pad(date.getHours()),
        ":h": String(date.getHours()),
        ":mm": pad(date.getMinutes()),
        ":m": String(date.getMinutes()),
        ":ss": pad(date.getSeconds()),
        ":s": String(date.getSeconds()),
    };

    const re = new RegExp(Object.keys(map).join("|"), "g");

    return pattern.replace(re, match => map[match] || "");
}