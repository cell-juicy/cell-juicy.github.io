import type {
    ImageData
} from "./common";

import type {
    ComponentFallbackConfig
} from "./component"

import type {
    SidebarConfig
} from "./sidebar";

import type {
    MobileNavConfig
} from "./mobileNav";

import type {
    VPJNotFoundLayoutConfig
} from "./layoutNotFound";

import type {
    VPJPageLayoutConfig
} from "./layoutPage";

import type {
    VPJBlogLayoutConfig
} from "./layoutBlog";

import {
    VPJDocLayoutConfig
} from "./layoutDoc";

import {
    BlogDefaultsConfig
} from "./blog";

import {
    DocDefaultsConfig
} from "./doc";



/**
 * 布局的全局配置接口
 * 
 * @remarks
 * 此接口定义了主题配置中关于布局的配置接口，包括404页布局等布局的配置项。
 * 
 * @see {@link VPJLayoutsConfig.notFound} 404页与not-found布局的配置
 * @see {@link VPJLayoutsConfig.page} page布局的配置
 * @see {@link VPJLayoutsConfig.blog} blog布局的配置
 * 
 * @example
 * 示例1：配置不同布局的参数
 * ```ts
 * // config.ts
 * export default defineConfig({
 *   themeConfig: {
 *     ...,
 *     layouts: {
 *       notFound: { ... },
 *       page: { ... },
 *       ...
 *     },
 *     ...
 *   }
 * })
 * ```
 */
export interface VPJLayoutsConfig {
    /** 
     * 404页与not-found布局配置
     * @see {@link VPJNotFoundLayoutConfig} 404页配置接口
     */
    notFound?: VPJNotFoundLayoutConfig;

    /**
     * page布局配置
     * @see {@link VPJPageLayoutConfig} page布局配置接口
     */
    page?: VPJPageLayoutConfig;

    /**
     * blog布局配置
     * @see {@link VPJBlogLayoutConfig} blog布局配置接口
     */
    blog?: VPJBlogLayoutConfig;

    /**
     * doc布局配置
     * @see {@link VPJDocLayoutConfig} doc布局配置接口
     */
    doc?: VPJDocLayoutConfig;
}


/**
 * 主题全局配置接口
 * 
 * @remarks
 * 此接口定义了主题的所有可配置项，包含以下内容：
 * 
 * @see {@link ThemeConfig.logo} 站点 Logo 配置
 * @see {@link ThemeConfig.sidebar} 侧边栏配置
 * @see {@link ThemeConfig.mobileNav} 移动端导航配置
 * @see {@link ThemeConfig.layouts} 布局配置
 * 
 * @example
 * 示例1：配置主题
 * ```ts
 * // config.ts
 * export default defineConfig({
 *   themeConfig: {
 *     logo: "/logo.svg",
 *     sidebar: { ... },
 *     mobileNav: { ... },
 *     layouts: { ... },
 *     ...
 *   }
 * })
 * ```
 */
export interface ThemeConfig {
    /**
     * 站点 Logo 配置
     * @optional
     * @see {@link ImageData} 支持的格式类型
     * @example
     * ```ts
     * // 简写模式
     * logo: "/logo.png"
     * 
     * // 详写模式
     * logo: { 
     *   src: "/logo.png",
     *   alt: "站点 Logo"
     * }
     * ```
     */
    logo?: ImageData;

    /**
     * 侧边栏全局配置
     * @optional
     * @see {@link SidebarConfig} 完整侧边栏配置接口
     */
    sidebar?: SidebarConfig;

    /**
     * 移动端导航配置
     * @optional
     * @see {@link MobileNavConfig} 移动端导航配置接口
     */
    mobileNav?: MobileNavConfig;

    /**
     * 布局配置
     * @optional
     * @see {@link VPJLayoutsConfig} 布局配置接口
     */
    layouts?: VPJLayoutsConfig;

    /**
     * 博客(blog)页默认数据配置
     * @optional
     * @see {@link BlogDefaultsConfig} 博客页默认数据配置接口
     */
    blog?: BlogDefaultsConfig;

    /**
     * 文档(doc)页默认数据配置
     * @optional
     * @see {@link DocDefaultsConfig} 文档页默认数据配置接口
     */
    doc?: DocDefaultsConfig;

    /**
     * 组件默认配置
     * @optional
     * @see {@link ComponentFallbackConfig} 组件默认配置接口
     */
    components?: ComponentFallbackConfig;
}