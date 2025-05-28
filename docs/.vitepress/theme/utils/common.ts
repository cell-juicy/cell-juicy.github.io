export function any2Number(value: any): number {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
}


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