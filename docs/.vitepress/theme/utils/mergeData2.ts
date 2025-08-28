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


// Type(Normalizer Factory)
interface SimpleStrategy<T, K extends readonly string[]> {
    validator: (v: any) => v is T;
    mapto: K;
};

type SimpleOutput<T, K extends readonly string[]> = {
    [key in K[number]]: T;
} | {};

interface ObjectStrategy<T extends object, O extends Partial<T>> {
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

interface FunctionStrategy<T, P extends any[]> {
    params: P;
    inspector: (result: any) => result is T;
};

type FunctionOutput<T> = T | undefined;

interface TransformStrategy<T, P extends any[], O> {
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
    s?: SimpleStrategy<ST, SK>;
    o?: ObjectStrategy<OT, OO>;
    f?: FunctionStrategy<FT, FP>;
    t?: TransformStrategy<TT, TP, TO>;
};

// Guard(Normalizer Factory)
function isSimpleStrategy(s: any): s is SimpleStrategy<any, readonly string[]> {
    return (typeof s === 'object' && s) &&
        (typeof s.validator === 'function') &&
        (Array.isArray(s.mapto) && s.mapto.every((key: any) => typeof key === 'string')) 
};

function isObjectStrategy(o: any): o is ObjectStrategy<any, any> {
    return (typeof o === 'object' && o) &&
        (typeof o.validators === 'object' && o.validators) &&
        Object.values(o.validators).every((v: any) => typeof v === 'function') &&
        (o.transformers ? Object.values(o.transformers).every((v: any) => typeof v === 'function') : true);
};

function isFunctionStrategy(f: any): f is FunctionStrategy<any, any[]> {
    return (typeof f === 'object' && f) &&
        (Array.isArray(f.params)) &&
        (typeof f.inspector === 'function');
};

function isTransformStrategy(t: any): t is TransformStrategy<any, any[], any> {
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
        if (typeof v === 'object' && v && oNormalizer) return oNormalizer(v) as R;
        if (sNormalizer) return sNormalizer(v) as R;
        return undefined as R;
    };
};

// Sub Factory(Normalizer Factory)
function createDeviceSpecificNormalizer<T>(
    typeValidator: (v: any) => v is T
) {
    createNormalizer<
        DeviceSpecificData<T>,
        T, typeof DeviceSpecificKey,
        DeviceSpecificData<T>
    > ({
        s: { validator: typeValidator, mapto: DeviceSpecificKey },
        o: { validators: Object.fromEntries(DeviceSpecificKey.map((key) => [key, typeValidator])) }
    });
}
