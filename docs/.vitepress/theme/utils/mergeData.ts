import type {
    PageContext,

    AsideTabInput,
    CoverCssConfigInput,
    DeviceSpecificInput,
    EditLinkInput,
    FooterInput,
    HeaderTitleTemplateInput,
    ResourceInput,
    TitleTemplateInput,
    ToolbarButtonInput,
    ToolbarDownloadInput,
    ToolbarGithubInput,

    NormalizedAsideTabInput,
    NormalizedEditLinkInput,
    NormalizedFooterInput,
    NormalizedResourceInput,
    NormalizedToolbarButtonInput,
    NormalizedToolbarDownloadInput,
    NormalizedToolbarGithubInput,
    NormalizedCoverCssConfigInput,

    AsideTabData,
    CoverCssConfigData,
    DeviceSpecificData,
    EditLinkData,
    FooterData,
    ResourceData,
    ToolbarDownloadData,
    ToolbarGithubData,
    ToolbarButtonData,
    TimeLabelInput,
} from "../types/common";
import type { PageData, SiteData } from 'vitepress';

import {
    any2Number,
    formatTimeLabel,
    isBoolean,
    isString,
    isFalse,
    isFunction,
    isNumber,
    isObject,
    isStringFalse,
    isStringNumber
} from "./common";

import {
    createNormalizer,
    createRecordNormalizer,
    createDeviceSpecificNormalizer,
    createMerger,
    createRecordMerger
} from './factory'


// Const
const CoverCssConfigKey = [
    "boxShadow",
    "filter",
    "maskImage",
    "objectFit",
    "objectPosition",
    "opacity",
    "transform",
    "transition",
] as const;
const FooterKey = ["message", "copyright"] as const;

export function cancelObject<O extends Record<string, any>, K extends keyof O = keyof O>(
    obj: O,
    cancelValue: any,
    keys?: K[]
): Partial<O> {
    const result: Partial<O> = { ...obj };
    const targetKeys = keys ?? (Object.keys(obj) as K[]);

    for (const key of targetKeys) {
        if (result[key] === cancelValue) {
            result[key] = undefined;
        };
    };
    return result;
}


// Products(Normalizer)
const singleAsideTabNormalizer = createNormalizer<
    NormalizedAsideTabInput,
    string | false, ["component"],
    Exclude<AsideTabInput, string | false>, NormalizedAsideTabInput
>({
    s: { validator: isStringFalse, mapto: ["component"] },
    o: { 
        validators: {name: isString, component: isStringFalse, order: isStringNumber},
        transformers: {order: (v) => v === undefined ? undefined : any2Number(v)}
    }
});
export const asideTabNormalizer = createRecordNormalizer<NormalizedAsideTabInput>(singleAsideTabNormalizer);

export const coverCssConfigNormalizer = createNormalizer<
    NormalizedCoverCssConfigInput,
    never, never,
    Exclude<CoverCssConfigInput, false>, NormalizedCoverCssConfigInput
>({ o: { validators: Object.fromEntries(CoverCssConfigKey.map((key) => [key, isStringFalse])) } });

export const deviceSpecificSNormalizer = createDeviceSpecificNormalizer<string | false>(isStringFalse);
export const deviceSpecificBNormalizer = createDeviceSpecificNormalizer<boolean>(isBoolean);

const isEditLinkInput = (v: any): v is Exclude<EditLinkInput, false> => {
    return isObject(v) &&
        (!("pattern" in v) || (isStringFalse(v.pattern) || isFunction(v.pattern) || v.pattern === undefined)) &&
        (!("text" in v) || (isString(v.text) || v.text === undefined))
};
const isNEditLinkInput = (v: any): v is NormalizedEditLinkInput => {
    return isObject(v) &&
        (!("link" in v) || (isStringFalse(v.link) || v.link === undefined)) &&
        (!("text" in v) || (isString(v.text) || v.text === undefined))
};
export const editLinkNormalizer = (ctx: PageContext) => createNormalizer<
    NormalizedEditLinkInput,
    false, ["link"],
    never, never,
    never, never,
    Exclude<EditLinkInput, false>, [PageContext], NormalizedEditLinkInput
>({
    s: { validator: isFalse, mapto: ["link"] },
    t: { validator: isEditLinkInput, params: [ctx], transformer(input, ctx) {
        let link: string | false | undefined = undefined;
        if (input.pattern === false) {
            link = false;
        } else if (isString(input.pattern)) {
            link = input.pattern.replace(/:path/g, ctx.route.data.relativePath)
        } else if (isFunction(input.pattern)) {
            link = isString(input.pattern(ctx)) ? input.pattern(ctx) : undefined;
        };
        return { link, text: isString(input.text) ? input.text : undefined };
    }, inspector: isNEditLinkInput, fallback: {}}
});

export const footerNormalizer = createNormalizer<
    NormalizedFooterInput,
    false, typeof FooterKey,
    Exclude<FooterInput, false>, NormalizedFooterInput
>({
    s: { validator: isFalse, mapto: FooterKey },
    o: { validators: Object.fromEntries(FooterKey.map((key) => [key, isStringFalse])) }
});

export const headerTitleTemplateNormalizer = (ctx: PageContext) => createNormalizer<
    string | false | undefined,
    false, never,
    never, never,
    string | false, [PageContext],
    string, [PageContext], string | false
>({
    s: { validator: isFalse },
    f: { params: [ctx], inspector: isStringFalse },
    t: { validator: isString, params: [ctx], transformer(input, ctx) {
        if (!isString(input)) return undefined;
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
        };
    }, inspector: isStringFalse, fallback: undefined }
});

const singleResourceNormalizer = createNormalizer<
    NormalizedResourceInput,
    string | false, ["url"],
    Exclude<ResourceInput, string | false>, NormalizedResourceInput
>({
    s: { validator: isStringFalse, mapto: ["url"] },
    o: {
        validators: {
            url: isStringFalse,
            label: isString,
            icon: (v) => isStringFalse(v) || (isObject(v) && isString(v.component)),
            order: (v) => isString(v) || isNumber(v),
            download: (v) => isBoolean(v) || isString(v),
            type: (v) => isString(v) && ["file", "image", "website", "download"].includes(v)
        },
        transformers: {
            order: (v) => v === undefined ? undefined : any2Number(v)
        }
    }
});
export const resourceNormalizer = createRecordNormalizer(singleResourceNormalizer);

export const timeLabelNormalizer = (last: Date | undefined, creat: Date | undefined) => createNormalizer<
    string | undefined,
    undefined, never,
    never, never,
    string, [Date | undefined, Date | undefined],
    string, [Date | undefined, Date | undefined], string
>({
    s: { validator: (v): v is undefined => v === undefined },
    f: { params: [last, creat], inspector: isString },
    t: { validator: isString, params: [last, creat], transformer: formatTimeLabel, inspector: isString }
});

export const titleTemplateNormalizer = (ctx: PageContext|undefined, site: SiteData, page: PageData) => createNormalizer<
    string | undefined,
    undefined, never,
    never, never,
    string, [PageContext|undefined],
    boolean | string, [PageContext|undefined, SiteData, PageData], string
>({
    s: { validator: (v): v is undefined => v === undefined },
    f: { params: [ctx], inspector: isString },
    t: { validator: (v) => isString(v) || isBoolean(v), params: [ctx, site, page], transformer(input, ctx, site, page) {
        const title = ctx?.layoutConfig?.title ?? page.title ?? site.title ?? "";

        if (isString(input)) {
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
    }, inspector: isString, fallback: undefined}
});

const singleToolbarButtonNormalizer = createNormalizer<
    NormalizedToolbarButtonInput,
    string | false, ["icon"],
    Exclude<ToolbarButtonInput, string | false>, NormalizedToolbarButtonInput
>({
    s: { validator: isStringFalse, mapto: ["icon"] },
    o: {
        validators: {
            icon: (v) => isStringFalse(v) || (isObject(v) && isString(v.component)),
            callback: isFunction,
            order: isStringNumber,
            tooltip: isStringFalse,
        },
        transformers: {
            order:(v) => v === undefined ? undefined : any2Number(v)
        }
    },
});
export const toolbarButtonNormalizer = createRecordNormalizer<NormalizedToolbarButtonInput>(singleToolbarButtonNormalizer)

const isToolbarDownload = (v: any): v is NormalizedToolbarDownloadInput => 
    (isObject(v)) && (("url" in v && (isStringFalse(v.url) || v.url === undefined)) || !("url" in v)) &&
    (("target" in v && isString(v.target) && ["_blank", "_self", undefined].includes(v.target)) ||  !("target" in v)) &&
    (("tooltip" in v &&(isStringFalse(v.tooltip) || v.tooltip === undefined)) ||  !("tooltip" in v)) &&
    (("download" in v &&(isString(v.download) || isBoolean(v.download) || v.download === undefined)) ||  !("download" in v));
export const toolbarDownloadNormalizer = (ctx: PageContext) => createNormalizer<
    NormalizedToolbarDownloadInput,
    string | false, ["url"],
    Exclude<ToolbarDownloadInput, string | false | Function>, NormalizedToolbarDownloadInput,
    NormalizedToolbarDownloadInput, [PageContext]
>({
    s: { validator: isStringFalse, mapto: ["url"] },
    o: {
        validators: {
            url: isStringFalse,
            target: (v: any): v is "_blank" | "_self" => ["_blank", "_self"].includes(v),
            tooltip: isStringFalse,
            download: (v) => isString(v) || isBoolean(v)
        },
    },
    f: { params: [ctx], inspector: isToolbarDownload, fallback: {} }
});

const isToolbarGithub = (v: any): v is NormalizedToolbarGithubInput => 
    (isObject(v)) && (("url" in v && (isStringFalse(v.url) || v.url === undefined)) || !("url" in v)) &&
    (("tooltip" in v &&(isStringFalse(v.tooltip) || v.tooltip === undefined)) ||  !("tooltip" in v));
export const toolbarGithubNormalizer = (ctx: PageContext) => createNormalizer<
    NormalizedToolbarGithubInput,
    string | false, ["url"],
    Exclude<ToolbarGithubInput, string | false | Function>, NormalizedToolbarGithubInput,
    NormalizedToolbarGithubInput, [PageContext]
>({
    s: { validator: isStringFalse, mapto: ["url"] },
    o: {
        validators: {
            url: isStringFalse,
            tooltip: isStringFalse,
        },
    },
    f: { params: [ctx], inspector: isToolbarGithub, fallback: {} }
});


// Products(Merger)
const asideTabProcessor = (v: Partial<Record<string, NormalizedAsideTabInput>>): Record<string, AsideTabData> => 
    Object.entries(v).reduce((result, [key, value]) => {
        if (!value || value.component === false || value.component === undefined) return result;
            
        const name = value.name ?? value.component;
        const order = any2Number(value.order);
        result[key] = { name, component: value.component, order };
        return result;
    }, {} as Record<string, AsideTabData>);
export const asideTabMerger = createRecordMerger<AsideTabInput, NormalizedAsideTabInput, Record<string, AsideTabData>>(
    createMerger({ type: "object", normalizer: singleAsideTabNormalizer, process(v) {
        const canceled = cancelObject(v, false);
        canceled.order = any2Number(canceled.order);
        return canceled;
    }}),
    asideTabNormalizer,
    asideTabProcessor
);

export const coverCssConfigMerger = createMerger<CoverCssConfigInput, NormalizedCoverCssConfigInput, CoverCssConfigData>({
    type: "object", normalizer: coverCssConfigNormalizer, process: (v) => cancelObject(v, false) as CoverCssConfigData
});

export const deviceSpecificSMerger = createMerger<
    DeviceSpecificInput<string|false>,
    DeviceSpecificData<string|false>,
    DeviceSpecificData<string>
>({ type: "object", normalizer: deviceSpecificSNormalizer, process: (v) => cancelObject(v, false) as DeviceSpecificData<string> });

export const editLinkMerger = (ctx: PageContext, ...sources: (EditLinkInput|undefined)[]) => {
    const merger = createMerger<EditLinkInput, NormalizedEditLinkInput, EditLinkData>({
        type: "object", normalizer: editLinkNormalizer(ctx), process: (v) => cancelObject(v, false) as EditLinkData
    });
    return merger(...sources);
};

export const footerMerger = createMerger<FooterInput, NormalizedFooterInput, FooterData>({
    type: "object", normalizer: footerNormalizer, process: (v) => cancelObject(v, false) as FooterData
});

export const headerTitleMeger = (ctx: PageContext, ...sources: (HeaderTitleTemplateInput|undefined)[]) => {
    const merger = createMerger<HeaderTitleTemplateInput, string | false, false, string | undefined>({
        type: "simple", normalizer: headerTitleTemplateNormalizer(ctx), cancel: false
    });
    return merger(...sources);
};

const resourceProcessor = (v: Partial<Record<string, NormalizedResourceInput>>): Record<string, ResourceData> =>
    Object.entries(v).reduce((result, [key, value]) => {
        if (!value || typeof value.url !== 'string') return result;
            
        const label = value.label ?? value.url;
        const order = any2Number(value.order);
        const icon = value.icon === false ? undefined : value.icon;
        result[key] = { ...value, label, order, url: value.url, icon };
        return result;
    }, {} as Record<string, ResourceData>);
export const resourceMerger = createRecordMerger<ResourceInput, NormalizedResourceInput, Record<string, ResourceData>>(
    createMerger({ type: "object", normalizer: singleResourceNormalizer, process(v) {
        const canceled = cancelObject(v, false, ["url", "icon"]);
        canceled.order = any2Number(canceled.order);
        return canceled;
    } }),
    resourceNormalizer,
    resourceProcessor
);

export const simpleMerger = <T, C = never>(validator: (value: any) => value is T, cancel: C, ...sources: (T | undefined)[]) => {
    const merger = createMerger<
        T|undefined, T, C,
        C extends undefined ? Exclude<T,C> : Exclude<T,C>|undefined
    >({ type: "simple", normalizer: (v) => validator(v) ? v : undefined, cancel });
    return merger(...sources)
};

export const timeLabelMerger = (last: Date|undefined, creat: Date|undefined, ...sources: (TimeLabelInput)[]) => {
    const merger = createMerger<TimeLabelInput, string | undefined, never, string | undefined>({
        type: "simple", normalizer: timeLabelNormalizer(last, creat)
    });
    return merger(...sources);
};

export const titleMeger = (ctx: PageContext | undefined, site: SiteData, page: PageData, ...sources: (TitleTemplateInput|undefined)[]) => {
    const merger = createMerger<TitleTemplateInput, string | undefined, never, string | undefined>({
        type: "simple", normalizer: titleTemplateNormalizer(ctx, site, page)
    });
    return merger(...sources);
};

const toolbarButtonProcessor = (v: Partial<Record<string, NormalizedToolbarButtonInput>>): Record<string, ToolbarButtonData> => 
    Object.entries(v).reduce((result, [key, value]) => {
        if (value && value.icon !== false && value.icon !== undefined && typeof value.callback === 'function') {
            result[key] = {
                icon: value.icon,
                callback: value.callback,
                order: any2Number(value.order),
                tooltip: (value.tooltip === false) ? undefined : value.tooltip
            };
        };
        return result;
    }, {} as Record<string, ToolbarButtonData>);
export const toolbarButtonMerger = createRecordMerger<ToolbarButtonInput, NormalizedToolbarButtonInput, Record<string, ToolbarDownloadData>>(
    createMerger<ToolbarButtonInput, NormalizedToolbarButtonInput, ToolbarButtonData>({ type: "object", normalizer: singleToolbarButtonNormalizer, process(v) {
        const canceled = cancelObject(v, false, ["tooltip", "icon"]);
        canceled.order = any2Number(canceled.order);
        return canceled as ToolbarButtonData;
    } }),
    toolbarButtonNormalizer,
    toolbarButtonProcessor
);

export const toolbarDownloadMerger = (ctx: PageContext, ...sources: (ToolbarDownloadInput|undefined)[]) => {
    const merger = createMerger<ToolbarDownloadInput, NormalizedToolbarDownloadInput, ToolbarDownloadData>({
        type: "object", normalizer: toolbarDownloadNormalizer(ctx), process: (v) => cancelObject(v, false) as ToolbarDownloadData
    });
    return merger(...sources);
};

export const toolbarGithubMerger = (ctx: PageContext, ...sources: (ToolbarGithubInput|undefined)[]) => {
    const merger = createMerger<ToolbarGithubInput, NormalizedToolbarGithubInput, ToolbarGithubData>({
        type: "object", normalizer: toolbarGithubNormalizer(ctx), process: (v) => cancelObject(v, false) as ToolbarGithubData
    });
    return merger(...sources);
};