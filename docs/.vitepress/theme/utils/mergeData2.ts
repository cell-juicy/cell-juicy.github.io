import type {
    PageContext,

    AsideTabInput,
    CoverCssConfigInput,
    DeviceSpecificInput,
    EditLinkInput,
    FooterInput,
    HeaderTitleTemplateInput,
    TitleTemplateInput,
    ToolbarButtonInput,
    ToolbarDownloadInput,
    ToolbarGithubLinkInput,

    NormalizedAsideTabInput,
    NormalizedEditLinkInput,
    NormalizedFooterInput,
    NormalizedToolbarButtonInput,
    NormalizedToolbarDownloadInput,
    NormalizedToolbarGithubLinkInput,
    NormalizedCoverCssConfigInput,

    AsideTabData,
    CoverCssConfigData,
    DeviceSpecificData,
    EditLinkData,
    FooterData,
    ToolbarDownloadData,
    ToolbarGithubLinkData,
    ToolbarButtonData,
} from "../types/common";
import type { PageData, SiteData } from 'vitepress';
import { any2Number, formatTimeLabel } from "./common";


// Const
const AsideTabKey = ["name", "component", "order"] as const;
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
const DeviceSpecificKey = ["mobile", "tablet", "desktop"] as const;
const EditLinkKey = ["link", "text"] as const;
const FooterKey = ["message", "copyright"] as const;
const ToolbarButtonKey = ["icon", "callback", "order", "tooltip"] as const;
const ToolbarDownloadKey = ["url", "target", "tooltip", "download"] as const;
const ToolbarGithubKey = ["url", "tooltip"] as const;


// Tool
const isString = (v: any): v is string => typeof v === 'string';
const isNumber = (v: any): v is number => typeof v === 'number' && !isNaN(v);
const isFalse = (v: any): v is false => v === false;
const isBoolean = (v: any): v is boolean => typeof v === 'boolean';
const isFunction = (v: any): v is Function => typeof v === 'function';
const isObject = (v: any): v is Exclude<object, null> => typeof v === 'object' && v && !Array.isArray(v);

const isStringFalse = (v: any): v is string | false => isString(v) || isFalse(v);
const isStringNumber = (v: any): v is string | number => isString(v) || isNumber(v);

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
        }
    }

    return result;
}


// Type(Normalizer Factory)
interface SimpleNStrategy<T, K extends readonly string[]> {
    validator: (v: any) => v is T;
    mapto?: K;
};

type SimpleOutput<T, K extends readonly string[]> = T | {
    [key in K[number]]: T;
} | undefined | {};

interface ObjectNStrategy<T extends object, O extends Partial<T>> {
    validators: {
        [K in keyof T]: (value: T[K]) => boolean;
    };
    transformers?: {
        [K in keyof T]?: (value: T[K]) => O[K];
    };
};

type ObjectOutput<T, O extends Partial<T>> = {
    [K in keyof O]?: O[K];
};

interface FunctionNStrategy<T, P extends any[]> {
    params: P;
    inspector: (result: any) => result is T;
    fallback?: any;
};

type FunctionOutput<T> = T | undefined;

interface TransformNStrategy<T, P extends any[], O> {
    validator: (v: any) => v is T;
    params: P;
    transformer: (v: T, ...params: P) => any;
    inspector: (v: any) => v is O;
    fallback?: any;
};

type TransformOutput<O> = O | undefined;

interface NormalizerStrategy<
    ST = never, SK extends readonly string[] = never,
    OT extends object = never, OO extends Partial<OT> = OT,
    FT = never, FP extends any[] = [],
    TT = never, TP extends any[] = [], TO = never
> {
    s?: SimpleNStrategy<ST, SK>;
    o?: ObjectNStrategy<OT, OO>;
    f?: FunctionNStrategy<FT, FP>;
    t?: TransformNStrategy<TT, TP, TO>;
};

// Guard(Normalizer Factory)
function isSimpleStrategy(s: any): s is SimpleNStrategy<any, readonly string[]> {
    return (typeof s === 'object' && s) &&
        (typeof s.validator === 'function') &&
        ((Array.isArray(s.mapto) && s.mapto.every((key: any) => typeof key === 'string')) || s.mapto === undefined) 
};

function isObjectStrategy(o: any): o is ObjectNStrategy<any, any> {
    return (typeof o === 'object' && o) &&
        (typeof o.validators === 'object' && o.validators) &&
        Object.values(o.validators).every((v: any) => typeof v === 'function') &&
        (o.transformers ? Object.values(o.transformers).every((v: any) => typeof v === 'function') : true);
};

function isFunctionStrategy(f: any): f is FunctionNStrategy<any, any[]> {
    return (typeof f === 'object' && f) &&
        (Array.isArray(f.params)) &&
        (typeof f.inspector === 'function');
};

function isTransformStrategy(t: any): t is TransformNStrategy<any, any[], any> {
    return (typeof t === 'object' && t) &&
        (typeof t.validator === 'function') &&
        (Array.isArray(t.params)) &&
        (typeof t.transformer === 'function') &&
        (typeof t.inspector === 'function');
};

// Factory(Normalizer Factory)
export function createNormalizer<
    R = never,
    ST = never, SK extends readonly string[] = never,
    OT extends object = never, OO extends Partial<OT> = OT,
    FT = never, FP extends any[] = [],
    TT = never, TP extends any[] = [], TO = never
> (config: NormalizerStrategy<ST, SK, OT, OO, FT, FP, TT, TP, TO>) {
    const sConfig = config.s;
    const oConfig = config.o;
    const fConfig = config.f;
    const tConfig = config.t;

    const sNormalizer = isSimpleStrategy(sConfig) 
        ? (v: any): SimpleOutput<ST, SK> => Array.isArray(sConfig.mapto)
            ? sConfig.validator(v)
                ? Object.fromEntries(sConfig.mapto.map((key) => [key, v])) as SimpleOutput<ST, SK>
                : {}
            : sConfig.validator(v)
                ? v
                : undefined
        : undefined;

    const oNormalizer = isObjectStrategy(oConfig)
        ? (v: any): ObjectOutput<OT, OO> => {
            const result: any = {};
            for (const [key, validator] of Object.entries(oConfig.validators)) {
                if (key in v && validator(v[key])) {
                    const transformer = oConfig.transformers?.[key];
                    result[key] = transformer ? transformer(v[key]) : v[key];
                };
            };
            return result;
        } : undefined;
    
    const fNormalizer = isFunctionStrategy(fConfig)
        ? (v: (...args: any[]) => any): FunctionOutput<FT> => {
            const fallback = ("fallback" in fConfig) ? fConfig.fallback : undefined
            try {
                const result = v(...fConfig.params);
                return fConfig.inspector(result) ? result : fallback;
            } catch(e) {
                console.error(`[Juicy Theme] Function Normalizer catch error: ${e}`);
                return fallback;
            };
        }
        : undefined;
    
    const tNormalizer = isTransformStrategy(tConfig)
        ? (v: any): TransformOutput<TO> => {
            const fallback = ("fallback" in tConfig) ? tConfig.fallback : undefined;
            try {
                const result = tConfig.transformer(v, ...tConfig.params);
                return tConfig.inspector(result) ? result : fallback;
            } catch(e) {
                console.error(`[Juicy Theme] Transform Normalizer catch error: ${e}`);
                return fallback;
            };
        }
        : undefined;

    return (v: any): R => {
        if (isTransformStrategy(tConfig) && tConfig.validator(v) && tNormalizer) return tNormalizer(v) as R;
        if (typeof v === 'function' && fNormalizer) return fNormalizer(v) as R;
        if (isObject(v) && oNormalizer) return oNormalizer(v) as R;
        if (sNormalizer) return sNormalizer(v) as R;
        return undefined as R;
    };
};

export function createRecordNormalizer<T, K extends string = string>(
    singleNormalizer: (v: any) => T,
    allowKeys: K[] = []
) {
    return (v: any): Partial<Record<K, T>> => {
        const result: Partial<Record<K, T>> = {};
        if (!isObject(v)) return result;

        Object.entries(v).forEach(([key, value]) => {
            const allowed = allowKeys.length === 0 || allowKeys.includes(key as K);
            if (!allowed) return;

            const normalized = singleNormalizer(value)
            if (normalized === undefined) return;
            result[key as K] = normalized;
        });

        return result;
    };
};

// Sub Factory(Normalizer Factory)
function createDeviceSpecificNormalizer<T>(
    typeValidator: (v: any) => v is T
) {
    return createNormalizer<
        DeviceSpecificData<T>,
        T, typeof DeviceSpecificKey,
        DeviceSpecificData<T>, DeviceSpecificData<T>
    > ({
        s: { validator: typeValidator, mapto: DeviceSpecificKey },
        o: { validators: Object.fromEntries(DeviceSpecificKey.map((key) => [key, typeValidator])) }
    });
};


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
    CoverCssConfigInput, CoverCssConfigInput
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

export const timeLabelNormalizer = (last: Date, creat: Date) => createNormalizer<
    string | undefined,
    undefined, never,
    never, never,
    string, [Date, Date],
    string, [Date, Date], string
>({
    s: { validator: (v): v is undefined => v === undefined },
    f: { params: [last, creat], inspector: isString },
    t: { validator: isString, params: [last, creat], transformer: formatTimeLabel, inspector: isString }
});

export const titleTemplateNormalizer = (ctx: PageContext, site: SiteData, page: PageData) => createNormalizer<
    string | undefined,
    undefined, never,
    never, never,
    string, [PageContext],
    boolean | string, [PageContext, SiteData, PageData], string
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
    (("target" in v && ["_blank", "_self", undefined].includes(v.target as any)) ||  !("target" in v)) &&
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

const isToolbarGithub = (v: any): v is NormalizedToolbarGithubLinkInput => 
    (isObject(v)) && (("url" in v && (isStringFalse(v.url) || v.url === undefined)) || !("url" in v)) &&
    (("tooltip" in v &&(isStringFalse(v.tooltip) || v.tooltip === undefined)) ||  !("tooltip" in v));
export const toolbarGithubNormalizer = (ctx: PageContext) => createNormalizer<
    NormalizedToolbarGithubLinkInput,
    string | false, ["url"],
    Exclude<ToolbarGithubLinkInput, string | false | Function>, NormalizedToolbarGithubLinkInput,
    NormalizedToolbarGithubLinkInput, [PageContext]
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


// Type (Merger Factory)
interface MergerStrategySimple<
    N = any,
    C = never,
    R = N | undefined
> {
    type: "simple";
    normalizer: (v: any) => N | undefined;
    cancel?: C;
    process?: (v: N | undefined) => R;
}

interface MergerStrategyObject<
    O extends Record<string, any> = any,
    R = Partial<O>
> {
    type: "object";
    normalizer: (v: any) => O | undefined;
    process?: (v: Partial<O>) => R;
}

export type MergerStrategy<N, O extends Record<string, any>, C, R> =
    | MergerStrategySimple<N, C, R>
    | MergerStrategyObject<O, R>;

// Guard (Merger Factory)
function isMergerStrategy(s: any): s is MergerStrategy<any, any, any, any> {
    return (typeof s === "object" && s) &&
        (["simple", "object"].includes(s.type)) &&
        (typeof s.normalizer === "function") &&
        (s.process ? typeof s.process === "function" : true);
}

// Overloads (Merger Factory)
export function createMerger<I, N, C, R>(
    config: MergerStrategySimple<N, C, R>
): (...sources: Array<I | undefined>) => R;

export function createMerger<I, O extends Record<string, any> = any, R = Partial<O>>(
    config: MergerStrategyObject<O, R>
): (...sources: Array<I | undefined>) => R;

// Factory (Merger Factory)
export function createMerger<
    I,
    N = any,
    O extends Record<string, any> = any,
    C = never,
    R = any
>(
    config: MergerStrategy<N, O, C, R>
) {
    if (config.type === "object") {
        return (...sources: Array<I | undefined>) => {
            const merged: Partial<O> = {};
            sources
                .map(config.normalizer)
                .forEach((obj) => {
                    if (!isObject(obj)) return;
                    Object.entries(obj).forEach(([key, value]) => {
                        if (!(key in merged)) merged[key as keyof O] = value as any;
                    });
                });
            return config.process ? config.process(merged) : merged;
        };
    };
    return (...sources: Array<I | undefined>) => {
        const result = sources
            .map(config.normalizer)
            .find((value) => value !== undefined);
        const cancelled = (result === config.cancel) ? undefined : result;
        return config.process ? config.process(cancelled as any) : cancelled;
    };
};

export function createRecordMerger<
    I = any,
    V = any,
    R = Partial<Record<string, V | undefined>>
>(
    valueMerger: (...values: Array<I | undefined>) => V | undefined,
    normalizer: (source: any) => Partial<Record<string, I>>,
    process?: (v: Partial<Record<string, V | undefined>>) => R
): (...sources: Array<Record<string, I> | undefined>) => R {
    return (...sources: Array<Record<string, I> | undefined>): R => {
        const merged: Partial<Record<string, V | undefined>> = {};
        const keys = new Set<string>();
        const normalized = sources.map(normalizer)

        for (const s of normalized) {
            if (!s || typeof s !== "object") continue;
            for (const k in s) { keys.add(k); };
        };
        
        for (const k of keys) {
            const vals = normalized.map(src => (src ? src[k] : undefined));
            const v = valueMerger(...vals);
            if (v !== undefined) merged[k] = v;
        };

        return process ? process(merged) as R : merged as R;
    };
};


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
    createMerger({
        type: "object", normalizer: singleAsideTabNormalizer, process(v) {
            const canceled = cancelObject(v, false);
            canceled.order = any2Number(canceled.order);
            return canceled;
        },
    }),
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
>({
    type: "object", normalizer: deviceSpecificSNormalizer, process: (v) => cancelObject(v, false) as DeviceSpecificData<string>
});

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

export const simpleMerger = <T, C = never>(validator: (value: any) => value is T, cancel: C, ...sources: (T | undefined)[]) => {
    const merger = createMerger<
        T|undefined, T, C,
        C extends undefined ? Exclude<T,C> : Exclude<T,C>|undefined
    >({ type: "simple", normalizer: (v) => validator(v) ? v : undefined, cancel });
    return merger(...sources)
};

export const timeLabelMerger = (last: Date, creat: Date, ...sources: (
    | string
    | ((lastUpdated: Date | undefined, createdAt: Date | undefined) => string | undefined)
    | undefined
)[]) => {
    const merger = createMerger<string | ((l: Date | undefined, c: Date | undefined) => string | undefined), string | undefined, never, string | undefined>({
        type: "simple", normalizer: timeLabelNormalizer(last, creat)
    });
    return merger(...sources);
};

export const titleMeger = (ctx: PageContext, site: SiteData, page: PageData, ...sources: (TitleTemplateInput|undefined)[]) => {
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
    createMerger<ToolbarButtonInput, NormalizedToolbarButtonInput, ToolbarButtonData>({
        type: "object", normalizer: singleToolbarButtonNormalizer, process(v) {
            const canceled = cancelObject(v, false, ["tooltip", "icon"]);
            canceled.order = any2Number(canceled.order);
            return canceled as ToolbarButtonData;
        }
    }),
    toolbarButtonNormalizer,
    toolbarButtonProcessor
);

export const toolbarDownloadMerger = (ctx: PageContext, ...sources: (ToolbarDownloadInput|undefined)[]) => {
    const merger = createMerger<ToolbarDownloadInput, NormalizedToolbarDownloadInput, ToolbarDownloadData>({
        type: "object", normalizer: toolbarDownloadNormalizer(ctx), process: (v) => cancelObject(v, false) as ToolbarDownloadData
    });
    return merger(...sources);
};

export const toolbarGithubMerger = (ctx: PageContext, ...sources: (ToolbarGithubLinkInput|undefined)[]) => {
    const merger = createMerger<ToolbarGithubLinkInput, NormalizedToolbarGithubLinkInput, ToolbarGithubLinkData>({
        type: "object", normalizer: toolbarGithubNormalizer(ctx), process: (v) => cancelObject(v, false) as ToolbarGithubLinkData
    });
    return merger(...sources);
};
