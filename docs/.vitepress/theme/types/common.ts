import type { Route } from "vitepress";


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


type BaseToolbarInput = {
    tooltip?: Falsable<string>;
    order?:
        | number
        | string
};

type BaseNormalizedToolbarInput = BaseToolbarInput & { order?: number }

type BaseToolbarData = {
    tooltip?: string;
    order: number;
}


export type ToolbarGithubInput = 
    | Falsable<string>
    | { url?: Falsable<string>, tooltip?: Falsable<string> }
    | ((ctx: PageContext) => NormalizedToolbarGithubInput)

export type NormalizedToolbarGithubInput = {
    url?: Falsable<string>,
    tooltip?: Falsable<string>
}

export type ToolbarGithubData = {
    url?: string;
    tooltip?: string;
}
    

export type ToolbarDownloadInput =
    | Falsable<string>
    | NormalizedToolbarDownloadInput
    | ((ctx: PageContext) => NormalizedToolbarDownloadInput)

export type NormalizedToolbarDownloadInput = {
    url?: Falsable<string>;
    target?: "_blank" | "_self";
    tooltip?: Falsable<string>;
    download?: boolean | string;
}

export type ToolbarDownloadData = {
    url?: string;
    target?: "_blank" | "_self";
    tooltip?: string;
    download?: boolean | string;
}


export type ToolbarButtonInput = 
    | Falsable<string>
    | {
        icon?:
            | Falsable<string>
            | { component: string};
        callback?: () => void;
        order?:
            | number
            | string;
        tooltip?: Falsable<string>;
    };

export type NormalizedToolbarButtonInput = {
    icon?:
        | Falsable<string>
        | { component: string};   
    callback?: () => void;
    order?: number;
    tooltip?: Falsable<string>;
};

export type ToolbarButtonData = {
    icon?:
        | string
        | { component: string};
    callback?: () => void;
    order: number;
    tooltip?: string;
};


export type ToolbarFeatureInput =
    | boolean
    | NormalizedToolbarFeatureInput;

export type NormalizedToolbarFeatureInput = {
    enabled?: boolean;
    tooltip?: Falsable<string>;
    order?:
        | string
        | number
};

export type ToolbarFeatureData = {
    enabled?: boolean;
    tooltip?: string;
    order: number;
};


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
    download?: boolean | string;
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