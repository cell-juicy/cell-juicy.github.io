import type {
    AsideTabData,
    AsideTabInput,
    DeviceSpecificData,
    DeviceSpecificInput,
    HeaderTitleTemplateInput,
    PageContext,
    ToolbarDownloadInput,
    ToolbarDownloadData,
    ToolbarGithubLinkInput,
    ToolbarGithubLinkData,
    ToolbarButtonData,
    ToolbarButtonInput,
} from "../types/common";
import { processOrder } from "./common";


// type check
function isAsideTabInput(input: any): input is AsideTabInput {
    return (
        typeof input === 'object' &&
        input !== null &&
        (typeof input.name === 'string' || input.name === undefined) &&
        (typeof input.component === 'string' || input.component === null || input.component === undefined) &&
        (typeof input.order === 'string' || typeof input.order === 'number' || input.order === undefined)
    );
};

function isToolbarGithubLink(input: any): input is ToolbarGithubLinkData {
    return (
        typeof input === 'object' &&
        (typeof input.url === 'string' || input.url === undefined) &&
        (typeof input.tooltip === 'string' || input.tooltip === null || input.tooltip === undefined)
    );
};
  
function isToolbarDownload(input: any): input is ToolbarDownloadData {
    return (
        typeof input === 'object' &&
        (typeof input.url === 'string' || input.url === undefined) &&
        ['_blank', '_self'].includes(input.target) &&
        (typeof input.tooltip === 'string' || input.tooltip === null) &&
        (typeof input.download === 'boolean' || typeof input.download === 'string')
    );
};

function isToolbarButtonInput(input: any): input is ToolbarButtonInput {
    return (
        typeof input === 'object' &&
        (typeof input.icon === 'string' || (typeof input.icon === 'object' && typeof input.icon.component === 'string')) &&
        (typeof input.callback === 'function') &&
        (typeof input.order === 'string' || typeof input.order === 'number' || input.order === undefined) &&
        (typeof input.tooltip === 'string' || input.tooltip === undefined)
    );
};

// normalize data
function normalizeDeviceInput(
    input?: DeviceSpecificInput
): DeviceSpecificData {
    if (typeof input === 'string') {
        return { mobile: input, tablet: input, desktop: input };
    } else if (typeof input === 'object') {
        return { mobile: input.mobile, tablet: input.tablet, desktop: input.desktop };
    } else {
        return {};
    }
};

function normalizeAsideTabInput(
    input: Record<string, AsideTabInput> | undefined
): Record<string, AsideTabInput> {
    if (typeof input === 'object') {
        return Object.entries(input).reduce((acc, [key, value]) => {
            if (isAsideTabInput(value)) {
                acc[key] = {
                    name: value.name,
                    component: value.component,
                    order: processOrder(value.order)
                };
            }
            return acc;
        }, {} as Record<string, AsideTabInput>);
    }
    return {};
};

function normalizeGithubInput(
    input: ToolbarGithubLinkInput | undefined,
    ctx: PageContext
): ToolbarGithubLinkData {
    if (typeof input === 'string') {
        return {
            url: input,
            tooltip: undefined
        };
    } else if (typeof input === 'object') {
        return {
            url: input.url,
            tooltip: input.tooltip
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
    input: ToolbarDownloadInput,
    ctx: PageContext
): ToolbarDownloadData {
    if (typeof input === 'string') {
        return {
            url: input,
            target: "_self",
            download: true
        }
    } else if (typeof input === 'object') {
        return {
            url: input.url,
            target: (input.target === "_blank" || input.target === "_self")
                ? input.target
                : "_self",
            tooltip: (typeof input.tooltip === 'string' || input.tooltip === null)
                ? input.tooltip
                : undefined,
            download: (typeof input.download === 'string' || typeof input.download === 'boolean')
                ? input.download :
                true
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
    input: HeaderTitleTemplateInput,
    ctx: PageContext
): string | undefined {
    if (typeof input === 'string') {
        if (ctx.layoutConfig.layout === "blog") {
            const series = ctx.layoutConfig.series;
            const order = ctx.layoutConfig.order;
            const title = ctx.route.data.title;
            return input
                .replaceAll(":series", series || "")
                .replaceAll(":title", title || "")
                .replaceAll(":order", order?.toString() || "")
        } else if (ctx.layoutConfig.layout === "doc") {
            const space = ctx.layoutConfig.space;
            const title = ctx.route.data.title;
            return input
                .replaceAll(":space", space || "")
                .replaceAll(":title", title || "")
        } else {
            console.error(`[Juicy Theme]An error occurred while getting Page Context, and the default value undefined was automatically returned`);
            return undefined;
        }
    } else if (typeof input === 'function') {
        try {
            return (typeof input(ctx) === 'string') ? input(ctx) : undefined
        } catch(e) {
            console.error(`[Juicy Theme]Fail to resolve header title template: ${e}`);
            return undefined;
        }
    } else {
        return undefined
    }
};

function normalizeToolbarButtonData(
    input: Record<string, ToolbarButtonInput> | undefined
): Record<string, ToolbarButtonData> {
    if (typeof input === 'object') {
        return Object.entries(input).reduce((acc, [key, value]) => {
            if (isToolbarButtonInput(value)) {
                acc[key] = {
                    icon: value.icon,
                    callback: value.callback,
                    order: processOrder(value.order),
                    tooltip: value.tooltip,
                };
            }
            return acc;
        }, {} as Record<string,ToolbarButtonData>);
    }
    return {};
};

// merge data
export function mergeDeviceData(
    ...sources: DeviceSpecificInput[]
): DeviceSpecificData {
    if (Array.isArray(sources)) {
        return sources
            .map(normalizeDeviceInput)
            .reduce((acc, cur) => {
                const result = { ...acc as DeviceSpecificData };
                if (typeof cur.mobile === 'string' && !result.mobile) {
                    result.mobile = cur.mobile
                };
                if (typeof cur.tablet === 'string' && !result.tablet) {
                    result.tablet = cur.tablet
                }
                if (typeof cur.desktop === 'string' && !result.desktop) {
                    result.desktop = cur.desktop
                }
                return result;
            },
            {} as DeviceSpecificData)
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
                        acc[key] = { ...value }
                    } else {
                        acc[key] = {
                            name: (typeof acc[key].name === 'string' || value.name === undefined)
                                ? acc[key].name
                                : value.name,
                            component: (
                                (typeof acc[key].component === 'string' || acc[key].component === null)
                                || value.component === undefined)
                                ? acc[key].component
                                : value.name, 
                            order: acc[key].order,
                        }
                    }
                })
                return acc;
            });
        
        return Object.entries(merged).reduce((result, [key, value]) => {
            // filter invalid items
            if (value.component === null || value.component === undefined) return result;
            // provide default name
            const name = value.name ?? value.component;
            const order = processOrder(value.order);
            result[key] = { name, component: value.component, order };
            return result;
        }, {} as Record<string, AsideTabData>);
    }
    return {};
};

export function mergeGithubLinkData(
    ctx: PageContext,
    ...sources: ToolbarGithubLinkInput[]
): ToolbarGithubLinkData{
    if (Array.isArray(sources)) {
        return sources
            .map((input) => normalizeGithubInput(input, ctx))
            .reduce((acc, cur) => {
                const result = { ...acc };
                if (typeof cur.url === 'string' && !result.url) {
                    result.url = cur.url;
                };
                if (
                    (typeof cur.tooltip === 'string' || cur.tooltip === null) &&
                    result.tooltip === undefined
                ) {
                    result.tooltip = cur.tooltip;
                };
                return result
            }, {} as ToolbarGithubLinkData)
    }
    return {};
};

export function mergeDownloadData(
    ctx: PageContext,
    ...sources: ToolbarDownloadInput[]
): ToolbarDownloadData {
    if (Array.isArray(sources)) {
        return sources
            .map((input) => normalizeDownloadInput(input, ctx))
            .reduce((acc, cur) => {
                const result = { ...acc };
                if (typeof cur.url === 'string' && !result.url) {
                    result.url = cur.url;
                };
                if ( 
                    (cur.target === "_blank" || cur.target === "_self") &&
                    result.target === undefined
                ) {
                    result.target = cur.target;
                }
                if (
                    (typeof cur.tooltip === 'string' || cur.tooltip === null) &&
                    result.tooltip === undefined
                ) {
                    result.tooltip = cur.tooltip;
                };
                if (
                    (typeof cur.download === 'string' || typeof cur.download === 'boolean') &&
                    result.download === undefined
                ) {
                    result.download = cur.download;
                }
                return result;
            }, {});
    }
    return {};
};

export function mergeHeaderTitleTemplateData(
    ctx: PageContext,
    ...sources: HeaderTitleTemplateInput[]
): string | undefined {
    if (Array.isArray(sources)) {
        return sources
            .map((input) => normalizeHeaderTitleTemplateInput(input, ctx))
            .reduce((acc, cur) => {
                if (typeof cur === 'string' && cur.length > 0 && !acc) {
                    return cur;
                };
                return acc;
            });
    };
    return undefined;
};

export function mergeToolbarButtonData(
    ...sources: (Record<string, ToolbarButtonInput> | undefined)[]
): Record<string, ToolbarButtonData> {
    if (Array.isArray(sources)) {
        return sources
            .map(normalizeToolbarButtonData)
            .reduce((acc, cur) => {
                Object.entries(cur).forEach(([key, value]) => {
                    if (!acc[key]) {
                        acc[key] = { ...value }
                    } else if (!acc[key].tooltip) {
                        acc[key].tooltip = value.tooltip
                    }
                })
                return acc;
            });
    }
    return {};
};