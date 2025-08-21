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


function formatDate(date: Date, pattern: string): string {
    const pad = (n: number) => n < 10 ? "0" + n : "" + n;
    const replacements: Record<string, string> = {
        ":YYYY": "" + date.getFullYear(),
        ":YY": ("" + date.getFullYear()).slice(-2),
        ":MM": pad(date.getMonth()+1),
        ":M": "" + (date.getMonth()+1),
        ":DD": pad(date.getDate()),
        ":D": "" + date.getDate(),
        ":hh": pad(date.getHours()),
        ":h": "" + date.getHours(),
        ":mm": pad(date.getMinutes()),
        ":m": "" + date.getMinutes(),
        ":ss": pad(date.getSeconds()),
        ":s": "" + date.getSeconds()
    };
    return pattern.replace(/:YYYY|:YY|:MM|:M|:DD|:D|:hh|:h|:mm|:m|:ss|:s/g, match => replacements[match]);
}