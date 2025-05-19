import type { Route } from "vitepress";

/**
 * 通用的图片数据配置类型
 * 
 * @remarks
 * 此类型用于表示图片资源的配置方式，支持两种形式：
 * 1. 简写：直接使用图片路径字符串。
 * 2. 详写：通过对象指定图片路径及额外属性（如 `alt` 文本）。
 * 
 * 
 * @example
 * 示例1：简写模式（直接使用路径）
 * ```ts
 * const icon: ImageData = "/assets/home.svg";
 * ```
 * 
 * @example
 * 示例2：详细模式（添加 `alt` 属性）
 * ```ts
 * const icon: ImageData = {
 *   src: "/assets/home.svg",
 *   alt: "首页图标"
 * };
 * ```
 */
export type ImageData = 
    | string
    | { src: string; alt?: string };

/**
 * 通用的网页头部图标（Favicon）配置类型
 * 
 * @remarks
 * 此类型用于定义网页头部图标（如浏览器标签页图标、Apple Touch Icon 等），支持两种形式：
 * 1. 简写：直接使用图标路径字符串（自动推断默认属性）。
 * 2. 详写：通过对象指定完整的图标属性（如 `rel`, `sizes`, `type`）。
 * 
 * @example
 * 示例1：简写（默认 `rel="icon"`）
 * ```ts
 * const favicon: HeadFaviconData = "/favicon.ico";
 * ```
 * 
 * @example
 * 示例2：详写（指定 Apple Touch Icon）
 * ```ts
 * const appleIcon: HeadFaviconData = {
 *   src: "/apple-touch-icon.png",
 *   rel: "apple-touch-icon",
 *   sizes: "180x180",
 *   type: "image/png"
 * };
 * ```
 */
export type HeadFaviconData = 
    | string
    | {
        src: string
        rel?: string
        sizes?: string
        type?: 'image/svg+xml' | 'image/png' | 'image/jpeg' | 'image/webp' | 'image/x-icon'
        media?: string
    };

/**
 * 用于动态处理布局的上下文类型
 */
export type PageContext = {
    route: Route;
    layoutConfig:
        | { layout: "blog"; series?: string; tags?: string[], order?: number }
        | { layout: "doc"; space?: string; order?: number[] };
}

/**
 * 设备特定的输入类型，用于根据不同设备显示不同的值。
 */
export type DeviceSpecificInput =
    | false
    | string
    | DeviceSpecificData;

export type NormalizedDeviceSpecificInput = {
    mobile?: false | string;
    tablet?: false | string;
    desktop?: false | string;
}

export type DeviceSpecificData = {
    mobile?: string;
    tablet?: string;
    desktop?: string;
}

/**
 * blog布局与doc布局的封面图css配置类型
 */
export type CoverCssConfigInput ={

    boxShadow?: 
        | false
        | string;

    filter?: 
        | false
        | string;
    
    maskImage?: 
        | false
        | string;

    objectFit?: 
        | false
        | string;

    objectPosition?: 
        | false
        | string;

    opacity?: 
        | false
        | string;

    transform?: 
        | false
        | string;

    transition?: 
        | false
        | string;
};

export type NormalizedCoverCssConfigInput ={

    boxShadow?: 
        | false
        | string;

    filter?: 
        | false
        | string;
    
    maskImage?: 
        | false
        | string;

    objectFit?: 
        | false
        | string;

    objectPosition?: 
        | false
        | string;

    opacity?: 
        | false
        | string;

    transform?: 
        | false
        | string;

    transition?: 
        | false
        | string;
};

export type CoverCssConfigData ={

    boxShadow?: string;

    filter?: string;
    
    maskImage?: string;

    objectFit?: string;

    objectPosition?: string;

    opacity?: string;

    transform?: string;

    transition?: string;
};

/**
 * blog布局与doc布局的侧边栏标签页数据输入类型
 */
export type AsideTabInput = 
    | false
    | string
    | {
        name?: string;
        component?:
            | false
            | string;
        order?:
            | number
            | string;
    };

export type NormalizedAsideTabInput = {
    name?: string;
    component?:
        | false
        | string;
    order?:
        | number;
};

export type AsideTabData = {
    name: string;
    component: string;
    order: number;
};

/**
 * blog布局与doc布局的工具栏github按钮的输入与数据类型
 */
export type ToolbarGithubLinkInput = 
    | false
    | string
    | { url?: string | false, tooltip?: string | false}
    | ((ctx: PageContext) => NormalizedToolbarGithubLinkInput)

export type NormalizedToolbarGithubLinkInput = {
    url?:
        | false
        | string,
    tooltip?:
        | false
        | string
}

export type ToolbarGithubLinkData = {
    url?: string;
    tooltip?: string;
}
    

/**
 * blog布局与doc布局的工具栏下载按钮的配置类型（pdf与md图标按钮）
 */
export type ToolbarDownloadInput =
    | false
    | string
    | {
        url?: string | false;
        target?: "_blank" | "_self";
        tooltip?: string | false;
        download?: boolean | string;
    }
    | ((ctx: PageContext) => NormalizedToolbarDownloadInput)

export type NormalizedToolbarDownloadInput = {
    url?: string | false;
    target?: "_blank" | "_self";
    tooltip?: string | false;
    download?: boolean | string;
}

export type ToolbarDownloadData = {
    url?: string;
    target?: "_blank" | "_self";
    tooltip?: string;
    download?: boolean | string;
}

/**
 * blog布局与doc布局的工具栏按钮数据配置类型
 */
export type ToolbarButtonInput = 
    | false
    | string
    | {
        icon?:
            | false
            | string
            | { component: string};
        
        callback?: () => void;

        order?:
            | number
            | string;

        tooltip?:
            | false
            | string;
    };

export type NormalizedToolbarButtonInput = {
    icon?:
        | false
        | string
        | { component: string};
    
    callback?: () => void;

    order?: number;

    tooltip?:
        | false
        | string;
};

export type ToolbarButtonData = {
    icon?:
        | string
        | { component: string};
    
    callback?: () => void;

    order: number;

    tooltip?: string;
};

/**
 * blog布局与doc布局头部标题配置类型
 */
export type HeaderTitleTemplateInput =
    | false
    | string
    | ((ctx: PageContext) => string | false)
