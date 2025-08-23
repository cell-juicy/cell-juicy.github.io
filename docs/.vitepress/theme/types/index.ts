import type {
    FooterInput,
    EditLinkInput,
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
    SeriesMetaData
} from "./blog";

import {
    SpaceMetaData
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
     * @see {@link SeriesMetaData} 系列默认数据配置接口
     */
    blog?: Record<string, SeriesMetaData>;

    /**
     * 文档(doc)页默认数据配置
     * @optional
     * @see {@link SpaceMetaData} 空间默认数据配置接口
     */
    doc?: Record<string, SpaceMetaData>;

    /**
     * 组件默认配置
     * @optional
     * @see {@link ComponentFallbackConfig} 组件默认配置接口
     */
    components?: ComponentFallbackConfig;

    /**
     * 侧边栏初始折叠状态
     * @optional
     * @default true
     * 
     * @remarks
     * 用于设置侧边栏加载时是否默认处于折叠状态。
     * 当设置为 `true` 时，侧边栏初始为收起状态；设置为 `false` 时，初始展开。
     * 
     * 注意事项：
     * - 该配置只影响初始状态，运行时的折叠/展开可由组件内部状态控制。
     * - 可根据页面需求或用户偏好进行配置。
     * - 不建议设置为 `false`，可能影响移动端浏览体验
     * 
     * @example
     * 主题配置中默认展开侧边栏：
     * ```ts
     * export default {
     *   themeConfig: {
     *     sidebarCollapsed: false
     *   }
     * }
     * ```
     */
    sidebarCollapsed?: boolean;

    /**
     * blog/doc布局侧边标签栏初始折叠状态
     * @optional
     * @default true
     * 
     * @remarks
     * 用于设置侧边栏加载时是否默认处于折叠状态。
     * 当设置为 `true` 时，侧边栏初始为收起状态；设置为 `false` 时，初始展开。
     * 
     * 注意事项：
     * - 该配置只影响初始状态，运行时的折叠/展开可由组件内部状态控制。
     * - 可根据页面需求或用户偏好进行配置。
     * - 不建议设置为 `false`，可能影响移动端浏览体验
     * 
     * @example
     * 主题配置中默认展开侧边栏：
     * ```ts
     * export default {
     *   themeConfig: {
     *     asideCollapsed: false
     *   }
     * }
     * ```
     */
    asideCollapsed?: boolean;

    /**
     * 主题级默认「下一页」按钮提示文本
     * @optional
     * @default "Next"
     *
     * @remarks
     * 用于为所有页面提供默认下一页按钮提示文本。
     * 空间级、系列级、布局级和 frontmatter 配置会覆盖此默认值。
     *
     * @example
     * 配置主题级默认下一页提示文本
     * ```ts
     * export default {
     *   themeConfig: {
     *     next: "Next Section"
     *   }
     * }
     * ```
     */
    next?:
            | string
            | false;

    /**
     * 主题级默认「上一页」按钮提示文本
     * @optional
     * @default "Previous"
     *
     * @remarks
     * 用于为所有页面提供默认上一页按钮提示文本。
     * 空间级、系列级、布局级和 frontmatter 配置会覆盖此默认值。
     *
     * @example
     * 配置主题级默认上一页提示文本
     * ```ts
     * export default {
     *   themeConfig: {
     *     prev: "Previous Section"
     *   }
     * }
     * ```
     */
    prev?:
        | string
        | false;

    /**
     * 主题级默认编辑链接配置
     * @optional
     *
     * @remarks
     * 控制所有页面默认的「编辑此页」链接。
     * 空间级、系列级、布局级和 frontmatter 配置会覆盖此默认值。
     *
     * @example
     * 配置主题级默认 GitHub 编辑链接
     * ```ts
     * export default {
     *   themeConfig: {
     *     editLink: {
     *       pattern: "https://github.com/org/repo/edit/main/:path",
     *       text: "Edit this page"
     *     }
     *   }
     * }
     * ```
     */
    editLink?: EditLinkInput;

    /**
     * 主题级默认底部信息配置
     * @optional
     *
     * @remarks
     * 配置所有页面默认的底部消息和版权信息。
     * 空间级、系列级、布局级和 frontmatter 配置会覆盖此默认值。
     *
     * @example
     * 配置主题级默认底部信息
     * ```ts
     * export default {
     *   themeConfig: {
     *     footer: {
     *       message: "由 <b>团队 A</b> 维护",
     *       copyright: "© 2025 MyProject"
     *     }
     *   }
     * }
     * ```
     */
    footer?: FooterInput;

    /**
     * 主题级是否启用虚拟父节点生成逻辑
     * @optional
     * @default false
     *
     * @remarks
     * 此项用于控制文档空间下页面节点缺失父节点时的自动补全行为，作为全局默认值。
     * 生成逻辑基于页面 `order` 推导上级节点的存在性，若上级不存在，则生成虚拟节点占位。
     *
     * 生成逻辑如下：
     *
     * 1. 每个页面节点会检查其是否要求生成虚拟父节点（详见注意事项）。
     * 2. 若要求生成，则根据其 order 从尾部依次截断，构造可能的父节点路径（例如 order: [1, 2, 3] → [1, 2] → [1]）。
     * 3. 逐级查询路径对应父节点是否存在，若不存在则生成虚拟节点添加到数据集中。
     * 4. 找到第一个已存在的父节点或穷尽路径时停止生成。
     *
     * 虚拟节点默认包含字段：
     * - `id`：由 space 与 order 生成的唯一标识
     * - `space`：继承自子节点
     * - `order`：对应的位序
     * - `virtual`：标记为 `true`
     * 
     * 除非通过 {@link SpaceMetaData.nodeMeta} 补充字段，否则不会包含 `title`、`treeTitle`、`cover` 等。
     *
     * 注意事项：
     * - 页面节点若显式设置 `allowVirtualParents`，则优先遵循该设置。
     * - 本主题级配置提供全局默认，空间级配置可覆盖此值。
     * - 虚拟节点在默认目录树组件点击时仅展开/收起子节点，不包含页面内容。
     *
     * @example
     * 全局启用虚拟父节点自动生成
     * ```ts
     * export default {
     *   themeConfig: {
     *     enableVirtual: true
     *   }
     * }
     * ```
     *
     * @see {@link SpaceMetaData.nodeMeta} 用于为虚拟节点补全其他字段
     * @see {@link DocPageData.generateVirtualNodes} 虚拟节点生成逻辑方法
     */
    enableVitrual?: boolean;

    /**
     * 主题级自动生成上一页/下一页链接
     * @optional
     * @default true
     *
     * @remarks
     * 控制是否为所有页面自动生成 `next` / `prev` 链接，作为全局默认值。
     * 空间级、系列级、布局级和 frontmatter 配置会覆盖此默认值。
     *
     * @example
     * 开启主题级自动生成 next/prev
     * ```ts
     * export default {
     *   themeConfig: {
     *     autoNextPrev: true
     *   }
     * }
     * ```
     */
    autoNextPrev?: boolean;


    timeLabel?:
        | string
        | ((lastUpdated: Date | undefined, createdAt: Date | undefined) => string | undefined);
}