import type {
    AsideTabData,
    AsideTabInput,
    CoverCssConfigData,
    CoverCssConfigInput,
    DeviceSpecificData,
    DeviceSpecificInput,
    HeaderTitleTemplateInput,
    EditLinkInput,
    FooterInput,
    NormalizedAsideTabInput,
    NormalizedDeviceSpecificInput,
    NormalizedToolbarButtonInput,
    NormalizedToolbarDownloadInput,
    NormalizedToolbarGithubLinkInput,
    NormalizedCoverCssConfigInput,
    NormalizedEditLinkInput,
    NormalizedFooterInput,
    PageContext,
    ToolbarDownloadInput,
    ToolbarDownloadData,
    ToolbarGithubLinkInput,
    ToolbarGithubLinkData,
    ToolbarButtonData,
    ToolbarButtonInput,
    TitleTemplateInput,
    EditLinkData,
    FooterData
} from "../types/common";
import type { PageData, SiteData } from 'vitepress';
import { any2Number } from "./common";


const CssConfigKeyList = [
    "boxShadow",
    "filter",
    "maskImage",
    "objectFit",
    "objectPosition",
    "opacity",
    "transform",
    "transition",
];

// type check
function isAsideTabInput(input: any): input is AsideTabInput {
    return (
        (typeof input === 'string') ||
        (input === false) ||
        (
            typeof input === 'object' &&
            (input !== null) &&
            (typeof input.name === 'string' || input.name === undefined) &&
            (typeof input.component === 'string' || input.component === false || input.component === undefined) &&
            (typeof input.order === 'string' || typeof input.order === 'number' || input.order === undefined)
        )
    );
};

function isToolbarGithubLink(input: any): input is NormalizedToolbarGithubLinkInput {
    return (
        typeof input === 'object' &&
        input !== null &&
        (
            input.url === undefined ||
            input.url === false ||
            typeof input.url === 'string'
        ) &&
        (
            input.tooltip === undefined ||
            input.tooltip === false ||
            typeof input.tooltip === 'string'
        )
    );
};
  
function isToolbarDownload(input: any): input is NormalizedToolbarDownloadInput {
    return (
        typeof input === 'object' &&
        input !== null &&
        (
            input.url === undefined ||
            input.url === false ||
            typeof input.url === 'string'
        ) &&
        (
            input.target === undefined ||
            ['_blank', '_self'].includes(input.target)
        ) &&
        (
            input.tooltip === undefined ||
            input.tooltip === false ||
            typeof input.tooltip === 'string'
        ) &&
        (
            input === undefined ||
            typeof input.download === 'boolean' ||
            typeof input.download === 'string'
        )
    );
};

function isToolbarButtonInput(input: any): input is ToolbarButtonInput {
    return (
        (typeof input === 'string') ||
        (input === false) ||
        (
            typeof input === 'object' &&
            (
                input.icon === undefined ||
                input.icon === false ||
                typeof input.icon === 'string' ||
                (typeof input.icon === 'object' && typeof input.icon.component === 'string')
            ) &&
            (
                input.callback === undefined ||
                typeof input.callback === 'function'
            ) &&
            (
                input.order === undefined ||
                typeof input.order === 'string' ||
                typeof input.order === 'number'
            ) &&
            (
                input.tooltip === undefined ||
                input.tooltip === false ||
                typeof input.tooltip === 'string'
            )
        )
    );
};

// normalize data
function normalizeDeviceInput(
    input?: any
): NormalizedDeviceSpecificInput {
    if (typeof input === 'string' || input === false) {
        return { mobile: input, tablet: input, desktop: input };
    } else if (typeof input === 'object' && input !== null) {
        return {
            mobile: (typeof input.mobile === 'string' || input.mobile === false) ? input.mobile : undefined,
            tablet: (typeof input.tablet === 'string' || input.tablet === false) ? input.tablet : undefined,
            desktop: (typeof input.desktop === 'string' || input.desktop === false) ? input.desktop : undefined,
        };
    } else {
        return {};
    }
};

function normalizeAsideTabInput(
    input: any
): Record<string, NormalizedAsideTabInput> {
    if (typeof input === 'object' && input !== null) {
        return Object.entries(input).reduce((acc, [key, value]) => {
            if (isAsideTabInput(value)) {
                if (typeof value === 'string' || value === false) {
                    acc[key] = { component: value }
                } else {
                    acc[key] = {
                        name: value.name,
                        component: value.component,
                        order: (value.order === undefined) ? undefined : any2Number(value.order)
                    };
                };
            };
            return acc;
        }, {} as Record<string, NormalizedAsideTabInput>);
    }
    return {};
};

function normalizeGithubInput(
    input: any,
    ctx: PageContext
): NormalizedToolbarGithubLinkInput {
    if (typeof input === 'string' || input === false) {
        return {
            url: input,
        };
    } else if (typeof input === 'object' && input !== null) {
        return {
            url: (typeof input.url === 'string' || input.url === false) ? input.url : undefined,
            tooltip: (typeof input.tooltip === 'string' || input.tooltip === false) ? input.tooltip : undefined
        };
    } else if (typeof input === 'function') {
        try {
            return isToolbarGithubLink(input(ctx)) ? input(ctx) : {}
        } catch(e) {
            console.error(`[Juicy Theme]Fail to resolve github link config: ${e}`);
            return {}
        }
    } else {
        return {}
    }
};

function normalizeDownloadInput(
    input: any,
    ctx: PageContext
): NormalizedToolbarDownloadInput {
    if (typeof input === 'string' || input === false) {
        return { url: input };
    } else if (typeof input === 'object' && input !== null) {
        return {
            url: (typeof input.url === 'string' || input.url === false)
                ? input.url
                : undefined,
            target: (input.target === "_blank" || input.target === "_self")
                ? input.target
                : undefined,
            tooltip: (typeof input.tooltip === 'string' || input.tooltip === false)
                ? input.tooltip
                : undefined,
            download: (typeof input.download === 'string' || typeof input.download === 'boolean')
                ? input.download
                : undefined
        };
    } else if (typeof input === 'function') {
        try {
            return isToolbarDownload(input(ctx)) ? input(ctx) : {}
        } catch(e) {
            console.error(`[Juicy Theme]Fail to resolve download link config: ${e}`);
            return {};
        }
    } else {
        return {};
    }
};

function normalizeHeaderTitleTemplateInput(
    input: any,
    ctx: PageContext
): false | string | undefined {
    if (input === false) {
        return input;
    } else if (typeof input === 'string') {
        if (ctx.layoutConfig?.layout === "blog") {
            const series = ctx.layoutConfig.series;
            const order = ctx.layoutConfig.order;
            const title = ctx.layoutConfig.title;
            return input
                .replaceAll(":series", series || "")
                .replaceAll(":title", title || "")
                .replaceAll(":order", order?.toString() || "")
        } else if (ctx.layoutConfig.layout === "doc") {
            const space = ctx.layoutConfig.space;
            const title = ctx.layoutConfig.title;
            return input
                .replaceAll(":space", space || "")
                .replaceAll(":title", title || "")
        } else {
            console.error(`[Juicy Theme]An error occurred while getting Page Context, and the default value undefined was automatically returned`);
            return undefined;
        }
    } else if (typeof input === 'function') {
        try {
            return (typeof input(ctx) === 'string' || input(ctx) === false) ? input(ctx) : undefined
        } catch(e) {
            console.error(`[Juicy Theme]Fail to resolve header title template: ${e}`);
            return undefined;
        }
    } else {
        return undefined;
    }
};

function normalizeTitleTemplateInput(
    input: TitleTemplateInput,
    ctx: PageContext | undefined,
    site: SiteData,
    page: PageData,
): string | undefined {
    if (input === undefined) return undefined;

    if (typeof input === 'function') {
        try {
            const result = ctx ? input(ctx) : undefined;
            if (typeof result === 'string') return result;
        } catch (e) {
            console.error(`[Juicy Theme]Fail to resolve title template: ${e}.`);
        }
        return undefined;
    };

    const title = ctx?.layoutConfig?.title ?? page.title ?? site.title ?? "";

    if (typeof input === 'string') {
        if (ctx) {
            if (ctx.layoutConfig.layout === "blog" &&
                [":series", ":order", ":title"].some(k => input.includes(k))) {
                return input
                    .replace(/:order/g, String(ctx.layoutConfig?.order ?? ""))
                    .replace(/:series/g, ctx.layoutConfig?.series ?? "")
                    .replace(/:title/g, title);
            };
            if (ctx.layoutConfig.layout === "doc" &&
                [":space", ":title"].some(k => input.includes(k))) {
                return input
                    .replace(/:space/g, ctx.layoutConfig?.space ?? "")
                    .replace(/:title/g, title);
            };
        } else if (input.includes(':title')) {
            return input.replace(/:title/g, title);
        };
    };

    let suffix = ` | ${input}`;
    if (input === false) suffix = '';
    if (input === true) suffix = ` | ${site.title}`;
    if (site.title === input) suffix = '';

    if (suffix.startsWith(' | ') && title === suffix.slice(3)) {
        return title;
    }

    return `${title}${suffix}`;
}

function normalizeToolbarButtonData(
    input: any
): Record<string, NormalizedToolbarButtonInput> {
    if (typeof input === 'object' && input !== null) {
        return Object.entries(input).reduce((acc, [key, value]) => {
            if (isToolbarButtonInput(value)) {
                if (typeof value === 'string' || value === false) {
                    acc[key] = {icon: value}
                } else {
                    acc[key] = {
                        icon: value.icon,
                        callback: value.callback,
                        order: value.order ? any2Number(value.order) : undefined,
                        tooltip: value.tooltip,
                    };
                };
            };
            return acc;
        }, {} as Record<string, NormalizedToolbarButtonInput>);
    };
    return {};
};

function normalizeCoverCssConfig(
    input: any
): NormalizedCoverCssConfigInput {
    if (typeof input === 'object' && input !== null) {
        const normalized: NormalizedCoverCssConfigInput = {};
        CssConfigKeyList.forEach((key) => {
            if (typeof input[key] === 'string' || input[key] === false) {
                normalized[key] = input[key];
            };
        })
        return normalized;
    };
    return {} as NormalizedCoverCssConfigInput;
};

function normalizeEditLink(ctx: PageContext | undefined, input: any): NormalizedEditLinkInput {
    if (!ctx) return {};
    if (input === false) {
        return { link: false };
    } else if (typeof input === 'object' && input !== null) {
        let link: string | false | undefined = undefined;
        let text: string | undefined = (typeof input.text === 'string') ? input.text : undefined;
        if (input.pattern === false) {
            link = false;
        } else if (typeof input.pattern === 'string') {
            link = input.pattern.replace(/:path/g, ctx.route.data.relativePath)
        } else if (typeof input.pattern === 'function') {
            try {
                link = (typeof input.pattern(ctx) === 'string') ? input.pattern(ctx) : undefined;
            } catch (e) {
                console.error(`[Juicy Theme]Fail to resolve edit link: ${e}`);
                link = undefined;
            };
        };
        return {
            link,
            text,
        };
    };
    return {};
};

function normalizeFooter(input: any): NormalizedFooterInput {
    if (input === false) {
        return { message: false, copyright: false }
    } else if (typeof input === 'object' && input) {
        let message: string | false | undefined = (input.message === false)
            ? false
            : (typeof input.message === 'string')
                ? input.message
                : undefined;
        let copyright: string | false | undefined = (input.copyright === false)
            ? false
            : (typeof input.copyright === 'string')
                ? input.copyright
                : undefined;
        return { message, copyright };
    };
    return { message: undefined, copyright: undefined }
}

// merge data
export function mergeSimpleData<T, C = never>(
    validator: (value: T) => boolean,
    cancel: C,
    ...sources: (T | undefined)[]
): Exclude<T, C> | undefined {
    if (typeof validator === 'function') {
        const merged = sources
            .map(value => (value !== undefined && validator(value)) ? value : undefined)
            .find(value => value !== undefined);
        
        return (merged === cancel) ? undefined : merged as Exclude<T, C> | undefined;
    }
    return undefined;
}

export function mergeDeviceData(
    ...sources: (DeviceSpecificInput | undefined)[]
): DeviceSpecificData {
    if (Array.isArray(sources)) {
        const merged = sources
            .map(normalizeDeviceInput)
            .reduce((acc, cur) => {
                return {
                    mobile: (
                        (typeof cur.mobile === 'string' || cur.mobile === false) &&
                        acc.mobile === undefined
                    )
                        ? cur.mobile
                        : acc.mobile,
                    tablet: (
                        (typeof cur.tablet === 'string' || cur.tablet === false) &&
                        acc.tablet === undefined
                    )
                        ? cur.tablet
                        : acc.tablet,
                    desktop: (
                        (typeof cur.desktop === 'string' || cur.desktop === false) &&
                        acc.desktop === undefined
                    )
                        ? cur.desktop
                        : acc.desktop,
                };
            },
            {} as DeviceSpecificData);
        return {
            mobile: (merged.mobile === false) ? undefined : merged.mobile,
            tablet: (merged.tablet === false) ? undefined : merged.tablet,
            desktop: (merged.desktop === false) ? undefined : merged.desktop,
        };
    };
    return {};
};

export function mergeAsideTabData(
    ...sources: (Record<string, AsideTabInput> | undefined)[]
): Record<string, AsideTabData> {
    if (Array.isArray(sources)) {
        const merged = sources
            .map(normalizeAsideTabInput)
            .reduce((acc, cur) => {
                Object.entries(cur).forEach(([key, value]) => {
                    if (!acc[key]) {
                        acc[key] = { ...value };
                    } else {
                        acc[key] = {
                            name: (
                                typeof acc[key].name === 'string' ||
                                value.name === undefined
                            )
                                ? acc[key].name
                                : value.name,
                            component: (
                                typeof acc[key].component === 'string' ||
                                acc[key].component === false ||
                                value.component === undefined
                            )
                                ? acc[key].component
                                : value.component, 
                            order: (
                                typeof acc[key].order === 'number' ||
                                value.order === undefined
                            )
                                ? acc[key].order
                                : value.order,
                        };
                    };
                })
                return acc;
            });
        
        return Object.entries(merged).reduce((result, [key, value]) => {
            if (value.component === false || value.component === undefined) return result;
            
            const name = value.name ?? value.component;
            const order = any2Number(value.order);
            result[key] = { name, component: value.component, order };
            return result;
        }, {} as Record<string, AsideTabData>);
    };
    return {};
};

export function mergeGithubLinkData(
    ctx: PageContext,
    ...sources: (ToolbarGithubLinkInput | undefined)[]
): ToolbarGithubLinkData{
    if (Array.isArray(sources)) {
        const merged = sources
            .map((input) => normalizeGithubInput(input, ctx))
            .reduce((acc, cur) => {
                return {
                    url: (
                        (typeof cur.url === 'string' || cur.url === false) &&
                        acc.url === undefined
                    )
                        ? cur.url
                        : acc.url,
                    tooltip: (
                        (typeof cur.tooltip === 'string' || cur.tooltip === false) &&
                        acc.tooltip === undefined
                    )
                        ? cur.tooltip
                        : acc.tooltip
                }
            }, {} as ToolbarGithubLinkData)
        return {
            url: (merged.url === false) ? undefined : merged.url,
            tooltip: (merged.tooltip === false) ? undefined : merged.tooltip
        };
    };
    return {};
};

export function mergeDownloadData(
    ctx: PageContext,
    ...sources: (ToolbarDownloadInput | undefined)[]
): ToolbarDownloadData {
    if (Array.isArray(sources)) {
        const merged = sources
            .map((input) => normalizeDownloadInput(input, ctx))
            .reduce((acc, cur) => {
                return {
                    download: (
                        (typeof cur.download === 'string' || typeof cur.download === 'boolean') &&
                        acc.download === undefined
                    )
                        ? cur.download
                        : acc.download,
                    target: ( 
                        (cur.target === "_blank" || cur.target === "_self") &&
                        acc.target === undefined
                    )
                        ? cur.target
                        : acc.target,
                    tooltip: (
                        (typeof cur.tooltip === 'string' || cur.tooltip === false) &&
                        acc.tooltip === undefined
                    )
                        ? cur.tooltip
                        : acc.tooltip,
                    url: (
                        (typeof cur.url === 'string' || cur.url === false) &&
                        acc.url === undefined
                    )
                        ? cur.url
                        : acc.url,
                };
            }, {});
        return {
            download: merged.download,
            target: merged.target,
            tooltip: (merged.tooltip === false) ? undefined : merged.tooltip,
            url: (merged.url === false) ? undefined : merged.url,
        };
    };
    return {};
};

export function mergeHeaderTitleTemplateData(
    ctx: PageContext,
    ...sources: (HeaderTitleTemplateInput | undefined)[]
): string | undefined {
    if (Array.isArray(sources)) {
        const merged = sources
            .map((input) => normalizeHeaderTitleTemplateInput(input, ctx))
            .find((value) => value !== undefined)
        return (merged === false) ? undefined : merged
    };
    return undefined;
};

export function mergeTitleTemplateData(
    ctx: PageContext | undefined,
    site: SiteData,
    page: PageData,
    ...sources: TitleTemplateInput[]
): string | undefined {
    if (Array.isArray(sources)) {
        const merged = sources
            .map((input) => normalizeTitleTemplateInput(input, ctx, site, page))
            .find((value) => typeof value === 'string')
        return merged
    };
    return undefined;
};

export function mergeToolbarButtonData(
    ...sources: (Record<string, ToolbarButtonInput> | undefined)[]
): Record<string, ToolbarButtonData> {
    if (Array.isArray(sources)) {
        const merged = sources
            .map(normalizeToolbarButtonData)
            .reduce((acc, cur) => {
                Object.entries(cur).forEach(([key, value]) => {
                    if (!acc[key]) {
                        acc[key] = { ...value }
                    } else {
                        acc[key] = {
                            icon: (
                                typeof acc[key].icon === 'string' ||
                                acc[key].icon === false ||
                                (typeof acc[key].icon === 'object' && typeof acc[key].icon.component === 'string') ||
                                value.icon === undefined
                            )
                                ? acc[key].icon
                                : value.icon,
                            callback: (
                                typeof acc[key].callback === 'function' ||
                                value.callback === undefined
                            )
                                ? acc[key].callback
                                : value.callback,
                            order: (
                                typeof acc[key].order === 'number' ||
                                value.order === undefined
                            )
                                ? acc[key].order
                                : value.order,
                            tooltip: (
                                typeof acc[key].tooltip === 'string' ||
                                acc[key].tooltip === false ||
                                value.tooltip === undefined
                            )
                                ? acc[key].tooltip
                                : value.tooltip,
                        };
                    }
                });
                return acc;
            });
        return Object.entries(merged).reduce((result, [key, value]) => {
            // filter invalid items
            if (
                value.icon !== false &&
                value.icon !== undefined &&
                typeof value.callback === 'function'
            ) {
                result[key] = {
                    icon: value.icon,
                    callback: value.callback,
                    order: any2Number(value.order),
                    tooltip: (value.tooltip === false) ? undefined : value.tooltip
                }
            };
            return result;
        }, {} as Record<string, ToolbarButtonData>);
    };
    return {};
};

export function mergeCoverCssConfig(
    ...sources: (CoverCssConfigInput | undefined)[]
): CoverCssConfigData {
    if (Array.isArray(sources)) {
        const merged = sources
            .map(normalizeCoverCssConfig)
            .reduce((acc, cur) => {
                CssConfigKeyList.forEach((key) => {
                    acc[key] = (typeof acc[key] === 'string' || acc[key] === false || cur[key] === undefined)
                        ? acc[key]
                        : cur[key];
                });
                return acc;
            }, {});
        const result: CoverCssConfigData = {};
        CssConfigKeyList.forEach((key) => {    
            result[key] = (merged[key] === false) ? undefined : merged[key];
        });
        return result;
    };
    return {} as CoverCssConfigData;
};

export function mergeEditLinkData(
    ctx: PageContext | undefined,
    ...sources: (EditLinkInput | undefined)[]
): EditLinkData {
    if (Array.isArray(sources)) {
        const merged = sources
            .map((source) => normalizeEditLink(ctx, source))
            .reduce((acc, cur) => {
                return {
                    link: (typeof cur.link === 'string' || cur.link === false) && acc.link === undefined
                        ? cur.link
                        : acc.link,
                    text: (typeof cur.text === 'string') && acc.text === undefined
                        ? cur.text
                        : acc.text,
                };
            });
        return {
            link: (merged.link === false) ? undefined : merged.link,
            text: merged.text
        };
    }
    return {} as EditLinkData;
}

export function mergeFooterData(...sources: (FooterInput | undefined)[]): FooterData {
    if (Array.isArray(sources)) {
        const merged = sources
            .map(normalizeFooter)
            .reduce((acc, cur) => {
                return {
                    message: (typeof cur.message === 'string' || cur.message === false) && acc.message === undefined
                        ? cur.message
                        : acc.message,
                    copyright: (typeof cur.copyright === 'string' || cur.copyright === false) && acc.copyright === undefined
                        ? cur.copyright
                        : acc.copyright,
                }
            });
        return {
            message: merged.message === false ? undefined : merged.message,
            copyright: merged.copyright === false ? undefined : merged.copyright
        }
    }
    return {} as FooterData;
}