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
 * blog/doc布局页面上下文类型
 * 
 * @remarks
 * 此类型用于在布局处理过程中传递路由信息和布局配置，包含：
 * - 当前路由对象 (route)
 * - 布局配置数据 (layoutConfig)，根据页面布局由对应的pinia store生成：
 *   - blog布局：包括系列名称、标签列表和排序序号
 *   - doc布局：包括命名空间和排序序号数组
 * 
 * @example
 * ```ts
 * const ctx: PageContext = {
 *   route: currentRoute,
 *   layoutConfig: {
 *     layout: "blog",
 *     series: "tutorial",
 *     tags: ["vue", "typescript"]
 *   }
 * };
 * ```
 */
export type PageContext = {
    route: Route;
    layoutConfig:
        | { layout: "blog"; series?: string; tags?: string[], order?: number; title?: string }
        | { layout: "doc"; space?: string; order?: number[]; title?: string };
}

/**
 * 设备特定输入类型
 * 
 * @remarks
 * 用于根据不同设备显示不同的配置值，支持三种形式：
 * 1. 禁用模式：直接使用 false
 * 2. 统一值模式：使用字符串配置
 * 3. 分设备模式：使用对象分别指定移动端/平板/桌面端配置
 * 
 * @example
 * 示例1：统一高度配置
 * ```ts
 * const height: DeviceSpecificInput = "200px";
 * ```
 * 
 * @example
 * 示例2：分设备配置
 * ```ts
 * const height: DeviceSpecificInput = {
 *   mobile: "150px",
 *   desktop: "300px"
 * };
 * ```
 */
export type DeviceSpecificInput =
    | false
    | string
    | {
        mobile?: false | string;
        tablet?: false | string;
        desktop?: false | string;
    };

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
 * blog/doc布局封面图CSS配置输入类型
 * 
 * @remarks
 * 控制封面图样式的配置类型，支持禁用(false)或CSS字符串值。包含以下属性：
 * - boxShadow: 盒子阴影
 * - filter: 滤镜效果
 * - maskImage: 遮罩图像
 * - objectFit: 图片填充方式
 * - objectPosition: 图片定位
 * - opacity: 透明度
 * - transform: 变形效果
 * - transition: 过渡动画
 * 
 * @example
 * 示例：添加阴影和透明度
 * ```ts
 * const coverCss: CoverCssConfigInput = {
 *   boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
 *   opacity: "0.9"
 * };
 * ```
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
 * blog/doc布局侧边栏标签页输入类型
 * 
 * @remarks
 * 配置侧边栏标签页的三种方式：
 * 1. 禁用：使用 false
 * 2. 快捷模式：直接使用组件名称字符串，这被视为等效于输入{ component: "组件名称" }
 * 3. 详细模式：使用配置对象指定名称、组件和排序
 * 
 * @example
 * 示例1：快捷启用组件
 * ```ts
 * const tab: AsideTabInput = "TocTab"; // 等同于 { component: "TocTab" }
 * ```
 * 
 * @example
 * 示例2：详细配置
 * ```ts
 * const tab: AsideTabInput = {
 *   name: "目录",
 *   component: "TocTab",
 *   order: 1
 * };
 * ```
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
 * blog/doc布局工具栏GitHub按钮输入类型
 * 
 * @remarks
 * 配置GitHub按钮的四种方式：
 * 1. 禁用：使用 false
 * 2. 快捷模式：直接使用仓库URL，这被视为等效于输入{ url: "仓库URL" }
 * 3. 对象模式：指定URL和提示文本
 * 4. 动态函数：根据页面上下文生成配置，参见PageContext，ToolbarGithubLinkData类型，只有返回值为ToolbarGithubLinkData的函数才会将返回值参与配置合并
 * 
 * @example
 * 示例：动态生成仓库链接
 * ```ts
 * const github: ToolbarGithubLinkInput = (ctx) => ({
 *   url: ctx.layoutConfig.series === "tutorial" 
 *     ? "https://github.com/tutorials" 
 *     : false
 * });
 * ```
 * 
 * @see {@link PageContext} 页面上下文类型
 * @see {@link ToolbarGithubLinkData} 工具栏GitHub按钮数据类型
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
 * blog/doc布局工具栏下载按钮输入类型
 * 
 * @remarks
 * 配置markdown/pdf下载按钮的四种方式：
 * 1. 禁用：使用 false，这被视为等效于输入{ url: false }
 * 2. 快捷模式：直接使用文件URL，这被视为等效于输入{ url: "文件URL" }
 * 3. 对象模式：指定URL，提示文本，目标窗口和下载属性
 * 4. 动态函数：根据页面上下文生成配置，参见PageContext，ToolbarDownloadData类型，只有返回值为ToolbarDownloadData的函数才会将返回值参与配置合并
 * 
 * @example
 * 示例：动态生成仓库链接
 * ```ts
 * const data: ToolbarDownloadInput = (ctx) => ({
 *   url: ctx.layoutConfig.series === "tutorial"
 *     ? "/file/tutorial.pdf"
 *     : false,
 *   download: true,
 * });
 * ```
 * 
 * @see {@link PageContext} 页面上下文类型
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
 * blog/doc布局工具栏按钮输入类型
 * 
 * @remarks
 * 
 * 配置工具栏按钮的三种方式：
 * 1. 禁用：使用 false，这被视为等效于输入{ icon: false }
 * 2. 快捷模式：直接使用图标名称字符串，这被视为等效于输入{ icon: "图标名称" }
 * 3. 对象模式：指定图标名称，回调函数，排序和提示文本。
 * 注意，只有icon值有效（类型为string或{ component: stirng }）且callback值是一个函数的数据才会被添加到工具栏中，否则会被忽略。
 * 
 * @example
 * 示例1：快捷启用图标
 * ```ts
 * const button: ToolbarButtonInput = "VPJIconApps"; // 等同于 { icon: "VPJIconApps" }
 * ```
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
 * blog/doc布局头部标题模板输入类型
 * 
 * @remarks
 * 配置标题文本的三种方式：
 * 1. 禁用：使用 false
 * 2. 字符串模板：支持动态替换占位符
 *   - blog布局可用: :series, :title, :order
 *   - doc布局可用: :space, :title
 * 3. 动态函数：根据页面上下文生成标题，参见PageContext，只有返回值为string/false的函数才会将返回值参与配置合并
 * 
 * @example
 * 示例：带动态占位符的模板
 * ```ts
 * const template: HeaderTitleTemplateInput = "[系列] :series - :title";
 * ```
 */
export type HeaderTitleTemplateInput =
    | false
    | string
    | ((ctx: PageContext) => string | false)
