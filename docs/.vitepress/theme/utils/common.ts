import type { PageData, SiteData } from 'vitepress';
import type { PageContext } from '../types/common';


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

export function resolveTitle2(
    ctx: PageContext | undefined,
    site: SiteData,
    page: PageData,
    template: string | boolean | ((ctx: PageContext) => string) | undefined
): string | undefined {
    if (template === undefined) return undefined;

    if (typeof template === 'function') {
        try {
            const result = ctx ? template(ctx) : undefined;
            if (typeof result === 'string') return result;
        } catch (e) {
            console.error(`[Juicy Theme]Fail to resolve header title template: ${e}.`);
        }
        return undefined;
    };

    const title = ctx?.layoutConfig?.title ?? page.title ?? site.title ?? "";

    if (typeof template === 'string') {
        if (ctx) {
            if (ctx.layoutConfig.layout === "blog" &&
                [":series", ":order", ":title"].some(k => template.includes(k))) {
                return template
                    .replace(/:order/g, String(ctx.layoutConfig?.order ?? ""))
                    .replace(/:series/g, ctx.layoutConfig?.series ?? "")
                    .replace(/:title/g, title);
            };
            if (ctx.layoutConfig.layout === "doc" &&
                [":space", ":title"].some(k => template.includes(k))) {
                return template
                    .replace(/:space/g, ctx.layoutConfig?.space ?? "")
                    .replace(/:title/g, title);
            };
        } else if (template.includes(':title')) {
            return template.replace(/:title/g, title);
        };
    };

    let suffix = ` | ${template}`;
    if (template === false) suffix = '';
    if (template === true) suffix = ` | ${site.title}`;
    if (site.title === template) suffix = '';

    if (suffix.startsWith(' | ') && title === suffix.slice(3)) {
        return title;
    }

    return `${title}${suffix}`;
}

