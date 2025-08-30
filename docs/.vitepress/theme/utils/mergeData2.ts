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
const DeviceSpecificKey = ["mobile", "tablet", "desktop"] as const;


// Tool
const isStringFalse = (v: any): v is string | false => typeof v === 'string' || v === false;
const isObject = (v: any): v is Exclude<object, null> => typeof v === 'object' && v && !Array.isArray(v);


// Type(Normalizer Factory)
interface SimpleNStrategy<T, K extends readonly string[]> {
    validator: (v: any) => v is T;
    mapto: K;
};

type SimpleOutput<T, K extends readonly string[]> = {
    [key in K[number]]: T;
} | {};

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
};

type FunctionOutput<T> = T | undefined;

interface TransformNStrategy<T, P extends any[], O> {
    validator: (v: any) => v is T;
    params: P;
    transformer: (v: T, ...params: P) => any;
    inspector: (v: any) => v is O;
};

type TransformOutput<O> = O | undefined;

interface NormalizerStrategy<
    ST = never, SK extends readonly string[] = [],
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
        (Array.isArray(s.mapto) && s.mapto.every((key: any) => typeof key === 'string')) 
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
    ST = never, SK extends readonly string[] = [],
    OT extends object = never, OO extends Partial<OT> = OT,
    FT = never, FP extends any[] = [],
    TT = never, TP extends any[] = [], TO = never
> (config: NormalizerStrategy<ST, SK, OT, OO, FT, FP, TT, TP, TO>) {
    const sConfig = config.s;
    const oConfig = config.o;
    const fConfig = config.f;
    const tConfig = config.t;

    const sNormalizer = isSimpleStrategy(sConfig) 
        ? (v: any): SimpleOutput<ST, SK> => sConfig.validator(v)
            ? Object.fromEntries(sConfig.mapto.map((key) => [key, v])) as SimpleOutput<ST, SK>
            : {}
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
            try {
                const result = v(...fConfig.params);
                return fConfig.inspector(result) ? result : undefined;
            } catch(e) {
                console.error(`[Juicy Theme] Function Normalizer catch error: ${e}`);
                return undefined;
            };
        }
        : undefined;
    
    const tNormalizer = isTransformStrategy(tConfig)
        ? (v: any): TransformOutput<TO> => {
            try {
                const result = tConfig.transformer(v, ...tConfig.params);
                return tConfig.inspector(result) ? result : undefined;
            } catch(e) {
                console.error(`[Juicy Theme] Transform Normalizer catch error: ${e}`);
                return undefined;
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

            result[key as K] = singleNormalizer(value);
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
        DeviceSpecificData<T>
    > ({
        s: { validator: typeValidator, mapto: DeviceSpecificKey },
        o: { validators: Object.fromEntries(DeviceSpecificKey.map((key) => [key, typeValidator])) }
    });
};


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
    C = never,
    R = Partial<O>
> {
    type: "object";
    normalizer: (v: any) => O | undefined;
    cancel?: C;
    process?: (v: Partial<O>) => R;
}

export type MergerStrategy<N, O extends Record<string, any>, C, R> =
    | MergerStrategySimple<N, C, R>
    | MergerStrategyObject<O, C, R>;

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

export function createMerger<I, O extends Record<string, any> = any, C = never, R = Partial<O>>(
    config: MergerStrategyObject<O, C, R>
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
            Object.entries(merged).forEach(([key, value]) => {
                if (value === config.cancel) merged[key as keyof O] = undefined as any;
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
    K extends string = string,
    R = Partial<Record<K, V | undefined>>
>(
    valueMerger: (...values: Array<I | undefined>) => V | undefined,
    allowKeys: K[] = []
): (...sources: Array<Record<K, I> | undefined>) => R {
    return (...sources: Array<Record<K, I> | undefined>): R => {
        const merged: Partial<Record<K, V | undefined>> = {};
        const keys = new Set<K>();

        for (const s of sources) {
            if (!s || typeof s !== "object") continue;
            for (const k in s) {
                if (allowKeys.length !== 0 && !allowKeys.includes(k as K)) continue;
                keys.add(k as K);
            };
        };
        
        for (const k of keys) {
            const vals = sources.map(src => (src ? src[k] : undefined));
            const v = valueMerger(...vals);
            if (v !== undefined) merged[k] = v;
        };

        return merged as R;
    };
};