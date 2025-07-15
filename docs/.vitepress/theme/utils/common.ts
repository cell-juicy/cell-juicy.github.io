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

/* Resolve Title */
export function resolveTitle(
    siteData: { title?: string; titleTemplate?: boolean | string },
    pageData: { title?: string; titleTemplate?: boolean | string }
) {
    const title = pageData.title || siteData.title || "";
    const template = pageData.titleTemplate ?? siteData.titleTemplate;

    if (typeof template === 'string' && template.includes(':title')) {
        return template.replace(/:title/g, title);
    }

    let suffix: string = ` | ${template}`;
    if (template === false) suffix = '';
    if (template === true || template === undefined) suffix = ` | ${siteData.title}`;
    if (siteData.title === template) suffix = '';

    if (title === suffix.slice(3)) {
        return title;
    };
    
    return `${title}${suffix}`;
}

