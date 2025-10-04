import type { Route } from "vitepress";
import type { BlogData, DocData } from "../data/pageData";


export type Falsable<T> = false | T;

export type ImageData = 
    | string
    | { src: string; alt?: string };


export type PageContext = {
    route: Route;
    layoutConfig:
        | { layout: "blog"; series?: string; tags?: string[], order: number; title?: string }
        | { layout: "doc"; space?: string; order: number[]; title?: string };
}


export type RawBaseData = {
    title?: string;
    url?: string;
    frontmatter: Record<string, any>;
    lastUpdated?: Falsable<number>;
    createdAt?: Falsable<number>;
};

export type RawPageData = RawBaseData & {
    layout: "page",
};

export type RawArticleData = RawBaseData & {
    layout: "blog" | "doc";
    cover?: Falsable<string>;
    next: Falsable<{ text?: string; link?: string }>;
    prev: Falsable<{ text?: string; link?: string }>;
};

export type RawBlogData = RawArticleData & {
    series?: string;
    order: number;
    tags: string[];
    listTitle?:
        | string
        | ((data: BlogData) => string | undefined);
};

export type RawDocData = RawArticleData & {
    space?: string;
    order: number[];
    resourcesList: (Record<string, ResourceInput> | undefined)[]
    allowVirtualParents?: boolean;
    treeTitle?:
        | string
        | ((data: DocData) => string | undefined);
    inherit?: boolean;
    virtual: boolean;
    children: string[];
    parent?: string;
};


export type DeviceSpecificInput<T> =
    | T
    | {
        mobile?: T;
        tablet?: T;
        desktop?: T;
    };

export type DeviceSpecificData<T> = {
    mobile?: T;
    tablet?: T;
    desktop?: T;
}


export type CoverCssConfigInput = Falsable<NormalizedCoverCssConfigInput>

export type NormalizedCoverCssConfigInput ={
    boxShadow?: Falsable<string>;
    filter?: Falsable<string>;
    maskImage?: Falsable<string>;
    objectFit?: Falsable<string>;
    objectPosition?: Falsable<string>;
    opacity?: Falsable<string>;
    transform?: Falsable<string>;
    transition?: Falsable<string>;
};

export type CoverCssConfigData = Record<keyof NormalizedCoverCssConfigInput, string>;


export type AsideTabInput = 
    | Falsable<string>
    | {
        name?: string;
        component?: Falsable<string>;
        order?:
            | number
            | string;
    };

export type NormalizedAsideTabInput = {
    name?: string;
    component?: Falsable<string>;
    order?: number;
};

export type AsideTabData = {
    name: string;
    component: string;
    order: number;
};


export type BaseToolbarInput = {
    tooltip?: Falsable<string>;
    order?:
        | number
        | string
};

export type BaseNormalizedToolbarInput = {
    tooltip?: Falsable<string>;
    order?: number;
}

export type BaseToolbarData = {
    tooltip?: string;
    order: number;
}


export type ToolbarGithubInput = 
    | Falsable<string>
    | ({ url?: Falsable<string> } & BaseToolbarInput)
    | ((ctx: PageContext) => NormalizedToolbarGithubInput)

export type NormalizedToolbarGithubInput = BaseNormalizedToolbarInput & { url?: Falsable<string> };

export type ToolbarGithubData = BaseToolbarData & { url?: string };
    

export type ToolbarDownloadInput =
    | Falsable<string>
    | ({ url?: Falsable<string>; target?: Falsable<"_blank" | "_self">; download?: boolean | string; } & BaseToolbarInput)
    | ((ctx: PageContext) => NormalizedToolbarDownloadInput)

export type NormalizedToolbarDownloadInput = 
    BaseNormalizedToolbarInput & { url?: Falsable<string>; target?: "_blank" | "_self"; download?: boolean | string; };

export type ToolbarDownloadData =
    BaseToolbarData & { url?: string; target?: "_blank" | "_self"; download?: string; };


export type ToolbarButtonInput = 
    | Falsable<string>
    | (BaseToolbarInput & { icon?: Falsable<string> | { component: string }; callback?: () => void; });

export type NormalizedToolbarButtonInput =
    BaseNormalizedToolbarInput & { icon?: Falsable<string> | { component: string }; callback?: () => void; };

export type ToolbarButtonData =
    BaseToolbarData & { icon?: string | { component: string }; callback?: () => void; };


export type ToolbarFeatureInput =
    | boolean
    | ({ enabled?: boolean } & BaseToolbarInput);

export type NormalizedToolbarFeatureInput = { enabled?: boolean } & BaseNormalizedToolbarInput;

export type ToolbarFeatureData = { enabled?: boolean } & BaseToolbarData;


export type HeaderTitleTemplateInput =
    | Falsable<string>
    | ((ctx: PageContext) => Falsable<string>);


export type TitleTemplateInput =
    | undefined
    | string
    | boolean
    | ((ctx: PageContext) => string)


export type ResourceInput = 
    | Falsable<string>
    | {
        url?: Falsable<string>;
        label?: string;
        icon?:
            | Falsable<string>
            | { component: string };
        order?: number | string;
        download?: boolean | string;
        type?: "file" | "image" | "website" | "download";
    };

export type NormalizedResourceInput = {
    url?: Falsable<string>;
    label?: string;
    icon?:
        | Falsable<string>
        | { component: string };
    order?: number;
    download?: boolean | string;
    type?: "file" | "image" | "website" | "download";
} 

export type ResourceData = {
    url: string;
    label?: string;
    icon?:
        | string
        | { component: string };
    order: number;
    download?: string;
    type?: "file" | "image" | "website" | "download";
}


export type FooterInput = 
    | false
    | NormalizedFooterInput;

export type NormalizedFooterInput = {
    message?: Falsable<string>;
    copyright?: Falsable<string>;
}

export type FooterData = {
    message?: string;
    copyright?: string;
}


export type EditLinkInput = Falsable<{
    pattern?:
        | Falsable<string>
        | ((ctx: PageContext) => string);
    text?: string;
}>;

export type NormalizedEditLinkInput = {
    link?: Falsable<string>;
    text?: string;
}

export type EditLinkData = {
    link?: string;
    text?: string;
}

export type TimeLabelInput = 
    | string
    | ((lastUpdated: Date | undefined, createdAt: Date | undefined) => string | undefined)
    | undefined