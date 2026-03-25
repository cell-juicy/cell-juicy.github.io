import type { Route } from "vitepress";


export interface GiscusOptions {
    repo: string;
    repoId: string;
    category:
        | string
        | {
            dev: string;
            prod: string;
        };
    categoryId:
        | string
        | {
            dev: string;
            prod: string;
        };
    strict?: boolean;
    reactionsEnabled?: boolean;
    emitMetadata?: boolean;
    inputPosition?:
        | "bottom"
        | "top";
    mapping?:
        | "pathname"
        | "url"
        | "title"
        | "og:title"
        | "specific"
        | "number";
    term?:
        | string
        | ((route: Route) => string)
    theme?:
        | string
        | {
            light?: string;
            dark?: string;
        };
    lang?: string;
    lazyLoading?: boolean;
}

export type CommentProviderConfig = {
    provider: "giscus",
    options: GiscusOptions,
}