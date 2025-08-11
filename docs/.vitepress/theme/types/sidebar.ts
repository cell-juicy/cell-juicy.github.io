import type { SiteConfig } from "vitepress";

import type { ImageData } from "./common";
import type { ThemeConfig } from ".";


/**
 * 侧边栏基础项配置接口
 * 
 * @remarks
 * 此接口定义了所有侧边栏导航项的基础配置规范，是 {@link NavItem}、{@link FooterItem} 的基类。
 * 
 * 通过此接口，可以实现以下功能：
 * - 定义导航项的文本内容和链接目标
 * - 配置图标展示和悬浮提示
 * - 自定义项的高亮样式
 * 
 * 关键特性：
 * - 所有侧边栏项的公共属性均在此定义
 * - 支持亮/暗模式双图标配置
 * - 高亮样式支持统一或分状态配置
 * 
 * 核心属性：
 * @see {@link SidebarItem.text} 显示文本（必需）
 * @see {@link SidebarItem.link} 目标链接
 * @see {@link SidebarItem.icon} 图标配置
 * @see {@link SidebarItem.tooltip} 悬浮提示
 * @see {@link SidebarItem.highlight} 高亮样式
 * 
 * @example
 * 基础项配置示例：
 * ```ts
 * {
 *   text: "文档",
 *   link: "/docs",
 *   icon: { light: "/icon-light.svg", dark: "/icon-dark.svg" },
 *   highlight: "#42b883"
 * }
 * ```
 */
interface SidebarItem {
    /**
     * 导航项显示文本
     * 
     * @remarks
     * 用于显示在导航项上的主要文字内容。
     * 
     * 注意事项：
     * - 导航项必须包含此属性
     * - 支持多语言文本（需自行实现国际化）
     * 
     * @example
     * ```ts
     * { text: "首页" }
     * ```
     */
    text: string;

    /**
     * 导航项目标链接
     * @optional
     * 
     * @remarks
     * 点击导航项时跳转的目标地址。
     * 
     * 注意事项：
     * - 可以是绝对路径或相对路径
     * - 外部链接会自动添加 `target="_blank"`
     * - 页脚项必须包含此属性
     * 
     * @example
     * ```ts
     * { link: "/getting-started" }
     * ```
     */
    link?: string;

    /**
     * 导航项图标
     * @optional
     * 
     * @remarks
     * 显示在文本左侧的图标，支持多种格式：
     * - 标准图片：`{ light: '...', dark: '...' }`
     * - 自定义组件：`{ component: 'CustomIcon' }`
     * 
     * 注意事项：
     * - 侧边栏收起时仅显示有图标的项
     * - 图片路径相对于 `.vitepress/public` 目录
     * 
     * @example
     * ```ts
     * // 双模式图标
     * { icon: { light: '/icons/sun.svg', dark: '/icons/moon.svg' } }
     * 
     * // 自定义组件
     * { icon: { component: 'UserIcon' } }
     * ```
     */
    icon?:
        | ImageData
        | { component?: string };
    
    /**
     * 导航项悬浮提示
     * @optional
     * 
     * @remarks
     * 鼠标悬停时显示的提示文本。
     * 
     * 注意事项：
     * - 默认使用 `text` 值作为提示
     * - 设为 `false` 禁用提示
     * - 收起状态下提示仍然生效
     * 
     * @example
     * ```ts
     * // 自定义提示
     * { tooltip: "返回主页" }
     * 
     * // 禁用提示
     * { tooltip: false }
     * ```
     */
    tooltip?:
        | string
        | false;
    
    /**
     * 导航项高亮样式
     * @optional
     * 
     * @remarks
     * 控制导航项在不同状态下的图标颜色。
     * 
     * 注意事项：
     * - 支持统一颜色或分状态配置
     * - 颜色值可以是 CSS 颜色名/HEX/RGB 等
     * - 优先级高于全局高亮配置
     * 
     * @example
     * ```ts
     * // 统一颜色
     * { highlight: "#42b883" }
     * 
     * // 分状态配置
     * {
     *   highlight: {
     *     normal: "#34495e",
     *     hover: "#42b883",
     *     active: "#ff5500"
     *   }
     * }
     * ```
     */
    highlight?:
        | string
        | { normal?: string; hover?: string; active?: string };
}

/**
 * 导航项配置接口
 * 
 * @remarks
 * 此接口扩展自 {@link SidebarItem}，专门用于配置侧边栏主导航区域的导航项，支持多级嵌套结构。
 * 
 * 通过此配置，可以实现以下功能：
 * - 创建单层或多层级导航菜单
 * - 控制子菜单的初始展开状态
 * - 构建复杂的导航结构（最多6层）
 * 
 * 关键特性：
 * - 支持动态路由匹配
 * - 收起状态智能显示（仅显示带图标的项）
 * - 嵌套层级深度控制
 * 
 * 特有属性：
 * @see {@link NavItem.items} 子导航项列表
 * @see {@link NavItem.collapsed} 子项初始折叠状态
 * 
 * @example
 * 多级导航配置示例：
 * ```ts
 * {
 *   text: "产品",
 *   icon: "package",
 *   collapsed: false, // 初始展开
 *   items: [
 *     { text: "VitePress", link: "/products/vitepress" },
 *     { 
 *       text: "生态系统",
 *       items: [
 *         { text: "Vite", link: "/products/vite" }
 *       ]
 *     }
 *   ]
 * }
 * ```
 */
export interface NavItem extends SidebarItem {
    /**
     * 子导航项列表
     * @optional
     * 
     * @remarks
     * 用于创建多级导航菜单，支持嵌套结构。
     * 
     * 注意事项：
     * - 最多支持 6 层嵌套
     * - 与 `link` 属性互斥（不可同时存在）
     * - 子项继承父项图标样式
     * 
     * @example
     * ```ts
     * items: [
     *   { text: "子项1", link: "/sub1" },
     *   { text: "子项2", link: "/sub2" }
     * ]
     * ```
     */
    items?: NavItem[];

    /**
     * 子项列表初始折叠状态
     * @optional
     * @default true
     * 
     * @remarks
     * 控制子导航项列表是否默认展开。
     * 
     * @example
     * ```ts
     * // 初始展开子项
     * { collapsed: false }
     * ```
     */
    collapsed?: boolean;
}

/**
 * 页脚项配置接口
 * 
 * @remarks
 * 此接口扩展了 {@link SidebarItem}，专门用于配置侧边栏底部的功能链接项。
 * 
 * 通过此配置，可以实现以下功能：
 * - 添加辅助性功能链接（帮助、反馈等）
 * - 控制收起状态下的可见性
 * - 提供与主导航一致但更简洁的交互
 * 
 * 关键约束：
 * - 必须同时包含 `text` 和 `link` 属性
 * - 不支持嵌套结构
 * - 不支持动态路由
 * 
 * 特有属性：
 * @see {@link FooterItem.showOnCollapsed} 收起状态可见性控制
 * 
 * @example
 * 页脚项配置示例：
 * ```ts
 * {
 *   text: "意见反馈",
 *   link: "/feedback",
 *   icon: "message-circle",
 *   showOnCollapsed: true // 收起时仍显示
 * }
 * ```
 */
export interface FooterItem extends SidebarItem {
    /** 
     * 必须提供目标链接
     * @example
     * ```ts
     * { link: "/contact" }
     * ```
     */
    link: string;

    /**
     * 侧边栏收起时是否显示
     * @optional
     * @default true
     * 
     * @remarks
     * 控制页脚项在侧边栏收起状态下的可见性。
     * 
     * @example
     * ```ts
     * // 收起时隐藏此项
     * { showOnCollapsed: false }
     * ```
     */
    showOnCollapsed?: boolean;
}

/**
 * 侧边栏资料卡配置接口
 * 
 * @remarks
 * 此接口定义了侧边栏顶部用户资料卡的可配置项，用于展示用户/站点的标识信息和描述。
 * 
 * 通过此配置，可以实现以下功能：
 * - 控制资料卡功能启用状态
 * - 设置资料卡标题和描述文本
 * - 配置不同位置使用的图标/头像
 * - 继承站点全局配置作为默认值
 * 
 * 可以配置的全部属性如下：
 * 
 * 1. **功能控制**
 * @see {@link SidebarProfile.enabled} 资料卡启用开关
 * 
 * 2. **内容配置**
 * @see {@link SidebarProfile.title} 按钮显示标题
 * @see {@link SidebarProfile.logo} 按钮显示图标
 * @see {@link SidebarProfile.cardTitle} 资料卡内标题
 * @see {@link SidebarProfile.cardLogo} 资料卡内图标
 * @see {@link SidebarProfile.description} 资料卡描述内容
 * 
 * @example
 * 基本配置示例：
 * ```ts
 * profile: {
 *   title: "技术博客",
 *   logo: "/avatar.png",
 *   description: "分享前端开发知识"
 * }
 * ```
 */
interface SidebarProfile {
    /**
     * 是否启用资料卡
     * @optional
     * @default true
     * 
     * @remarks
     * 用于控制侧边栏顶部资料卡按钮是否启用。
     * 当设置为 `false` 时，资料卡按钮会被禁用，顶部只显示 logo 和文本，点击不弹出资料卡内容。
     * 默认值为 `true`，表示资料卡功能启用。
     * 
     * @example
     * 在主题配置中禁用资料卡：
     * ```ts
     * export default {
     *   themeConfig: {
     *     sidebar: {
     *       profile: {
     *         enabled: false
     *       }
     *     }
     *   }
     * }
     * ```
     */
    enabled?: boolean;

    /**
     * 资料卡按钮的文本标题
     * @optional
     * 
     * @remarks
     * 用于设置资料卡按钮上显示的文本。
     * 如果未设置此项，会优先使用站点配置中的 {@link SiteData.title}；
     * 若站点标题也未设置，则使用默认字符串 `"VitePress"`。
     * 
     * 该文本通常用于标识用户或站点名称。
     * 
     * @example
     * 设置资料卡按钮的文本标题：
     * ```ts
     * export default {
     *   themeConfig: {
     *     sidebar: {
     *       profile: {
     *         title: "我的博客"
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link SiteData.title} 站点标题
     */
    title?: string;

    /**
     * 资料卡按钮的 logo
     * @optional
     * 
     * @remarks
     * 用于设置资料卡按钮显示的 logo 图标。
     * 如果未设置此项，会优先使用 {@link ThemeConfig.logo} 的配置值；
     * 若 {@link ThemeConfig.logo} 也未设置，则使用主题内置的默认图标。
     * 
     * 支持字符串路径或自定义组件形式。
     * 
     * @example
     * 设置资料卡按钮的 logo：
     * ```ts
     * export default {
     *   themeConfig: {
     *     sidebar: {
     *       profile: {
     *         logo: "/images/my-avatar.png"
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link ImageData} 一般图片输入格式
     * @see {@link ThemeConfig.logo} 主题logo配置
     */
    logo?:
        | ImageData
        | { component?: string };
    
    /**
     * 资料卡顶部显示的标题
     * @optional
     * 
     * @remarks
     * 用于设置资料卡内顶部区域显示的标题。
     * 如果未设置此项，则默认使用 {@link SidebarProfile.title} 的值作为标题。
     * 
     * 此配置主要用于区分按钮文本与资料卡内详细标题的需求。
     * 
     * @example
     * 设置资料卡顶部标题：
     * ```ts
     * export default {
     *   themeConfig: {
     *     sidebar: {
     *       profile: {
     *         cardTitle: "关于我"
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link SidebarProfile.title} 资料卡按钮文本标题
     */
    cardTitle?: string;

    /**
     * 资料卡顶部显示的图标
     * @optional
     * 
     * @remarks
     * 用于设置资料卡内顶部区域显示的图标。
     * 如果未设置此项，则默认使用 {@link SidebarProfile.logo} 作为图标。
     * 
     * 支持字符串路径或自定义组件形式，用于个性化资料卡展示。
     * 
     * @example
     * 设置资料卡顶部图标：
     * ```ts
     * export default {
     *   themeConfig: {
     *     sidebar: {
     *       profile: {
     *         cardLogo: "/images/profile-icon.png"
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link ImageData} 一般图片输入格式
     * @see {@link SidebarProfile.logo} 资料卡按钮logo
     */
    cardLogo?:
        | ImageData
        | { component?: string };

    /**
     * 资料卡的描述文本
     * @optional
     * 
     * @remarks
     * 用于设置资料卡内显示的描述信息。
     * 支持字符串或自定义组件形式：
     * - 若为字符串，直接显示文本内容；
     * - 若为 `{ component: string }` 形式，会渲染已注册的 Vue 组件替代文本描述。
     * 
     * 如果未设置此项，则默认使用站点配置中的 {@link SiteData.description}；
     * 若站点描述也未设置，则留空不显示。
     * 
     * @example
     * 设置资料卡描述文本为字符串：
     * ```ts
     * export default {
     *   themeConfig: {
     *     sidebar: {
     *       profile: {
     *         description: "欢迎访问我的博客"
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link SiteData.description}
     */
    description?:
        | string
        | { component?: string };
}

/**
 * 社交媒体链接配置接口
 * 
 * @remarks
 * 此接口定义了社交媒体链接项的配置规范，用于在侧边栏底部添加平台入口。
 * 
 * 通过此配置，可以实现以下功能：
 * - 添加各类社交媒体平台入口
 * - 使用内置图标或自定义图标
 * - 提供无障碍访问支持
 * 
 * 可以配置的全部属性如下：
 * 
 * 1. **必需属性**
 * @see {@link SocialLink.icon} 社交媒体图标
 * @see {@link SocialLink.link} 社交媒体链接
 * 
 * 2. **辅助属性**
 * @see {@link SocialLink.ariaLabel} 无障碍标签
 * 
 * @example
 * 配置示例：
 * ```ts
 * socialLinks: [
 *   { icon: "github", link: "https://github.com" }
 * ]
 * ```
 */
export interface SocialLink {
    /**
     * 社交媒体图标
     * 
     * @example
     * ```ts
     * // 内置图标
     * { icon: 'github' }
     * 
     * // 自定义图标
     * { icon: { component: 'WeChatIcon' } }
     * ```
     */
    icon:
        | ImageData
        | { component?: string };
    
    /**
     * 社交媒体链接
     * 
     * @example
     * ```ts
     * { link: "https://github.com/your-account" }
     * ```
     */
    link: string;

    /**
     * 无障碍标签
     * @optional
     * 
     * @remarks
     * 为图标链接提供描述性文本，增强可访问性。
     * 
     * @example
     * ```ts
     * { ariaLabel: "访问我们的GitHub仓库" }
     * ```
     */
    ariaLabel?: string;
}


/**
 * 侧边栏全局配置接口
 * 
 * @remarks
 * 此接口定义了侧边栏的所有可配置项，用于控制网站侧边导航区域的展示形式、内容和交互行为。
 * 
 * 通过此配置，可以实现以下功能：
 * - 控制侧边栏整体启用状态和初始折叠状态
 * - 定制顶部资料卡（用户信息展示）
 * - 配置主导航链接和分组结构
 * - 添加底部功能链接和社交媒体入口
 * - 自定义导航项高亮逻辑
 * 
 * 可以配置的全部属性如下：
 * 
 * 1. **基础配置**
 * @see {@link SidebarConfig.enabled} 侧边栏功能开关
 * @see {@link SidebarConfig.collapsed} 初始折叠状态
 * 
 * 2. **资料卡配置**
 * @see {@link SidebarConfig.profile} 顶部资料卡设置
 * 
 * 3. **导航配置**
 * @see {@link SidebarConfig.navLinks} 主导航链接列表
 * @see {@link SidebarConfig.footerLinks} 底部功能链接
 * @see {@link SidebarConfig.socialLinks} 社交媒体链接
 * 
 * 4. **高级功能**
 * @see {@link SidebarConfig.highlight} 自定义高亮逻辑
 * 
 * @example
 * 完整配置示例：
 * ```ts
 * // .vitepress/config.ts
 * import { defineConfig } from 'vitepress'
 * 
 * export default defineConfig({
 *   themeConfig: {
 *     sidebar: {
 *       enabled: true,
 *       collapsed: true,
 *       profile: {
 *         title: "我的博客",
 *         logo: "/logo.png"
 *       },
 *       navLinks: [
 *         { text: "首页", link: "/", icon: "home" }
 *       ],
 *       footerLinks: [
 *         { text: "关于", link: "/about", showOnCollapsed: true }
 *       ],
 *       socialLinks: [
 *         { icon: "github", link: "https://github.com" }
 *       ],
 *       highlight: (path) => path.split('?')[0]
 *     }
 *   }
 * })
 * ```
 */
export interface SidebarConfig {
    /**
     * 侧边栏功能开关
     * @optional
     * @default true
     * 
     * @remarks
     * 该配置项用于控制侧边栏整体功能是否启用。
     * 当设置为 `false` 时，侧边栏将不会被渲染或激活，适用于不需要侧边栏的场景。
     * 默认值为 `true`，即侧边栏默认处于启用状态。
     * 
     * 注意事项：
     * - 该开关控制整个侧边栏的显示和交互逻辑。
     * - 可以通过主题配置或页面级配置进行覆盖。
     * 
     * @example
     * 在主题配置中关闭侧边栏：
     * ```ts
     * export default {
     *   themeConfig: {
     *     sidebar: {
     *       enabled: false
     *     }
     *   }
     * }
     * ```
     */
    enabled?: boolean;

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
     * 
     * @example
     * 主题配置中默认展开侧边栏：
     * ```ts
     * export default {
     *   themeConfig: {
     *     sidebar: {
     *       collapsed: false
     *     }
     *   }
     * }
     * ```
     */
    collapsed?: boolean;

    /**
     * 侧边栏顶部资料卡配置
     * @optional
     * 
     * @remarks
     * 该配置项用于定制侧边栏头部显示的资料卡（Profile Card）部分内容，
     * 包括标题、头像、描述等信息，增强侧边栏的个性化展示。
     * 
     * 资料卡主要用于展示用户或站点的相关信息，通常位于侧边栏顶部。
     * 具体配置详情参见 {@link SidebarProfile} 接口。
     * 
     * @example
     * 简单示例：
     * ```ts
     * export default {
     *   themeConfig: {
     *     sidebar: {
     *       profile: {
     *         enabled: true,
     *         title: "我的博客",
     *         logo: "/avatar.png",
     *         description: "欢迎访问我的博客"
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link SidebarProfile}
     */
    profile?: SidebarProfile;

    /**
     * 自定义侧边栏高亮项匹配规则
     * @optional
     * @default
     * 默认使用最长路径前缀匹配规则：
     * ```ts
     * (path, allLinks) => {
     *   return allLinks
     *     .filter(link => path.startsWith(link))
     *     .sort((a, b) => b.length - a.length)[0];
     * }
     * ```
     * 
     * @remarks
     * 该函数用于自定义侧边栏导航项的高亮匹配逻辑。系统会收集所有导航项和页脚项的 `link` 组成 `allLinks` 数组，
     * 传入当前路由路径 `path` 和该数组，返回的字符串将作为高亮判据与每个导航项的 `link` 进行**精确匹配**。
     * 匹配成功的项会添加 `.highlight` 类名，其图标会通过 `fill` 属性应用特殊颜色。
     * 
     * 注意事项：
     * - 高亮颜色可通过 {@link SidebarItem.highlight} 属性单独配置
     * - 当页面是 404 状态时，自动跳过匹配
     * - 返回 `undefined` 或非字符串值时，不会高亮任何项
     * - 无匹配项时不会应用高亮
     * - 函数执行错误会被捕获并在控制台输出警告
     * 
     * @param path - 当前路由路径 (来自 `route.path`)
     * @param allLinks - 所有导航项和页脚项的 `link` 组成的数组
     * @returns 用于精确匹配高亮项的链接字符串 或 `undefined`
     * 
     * @example
     * 在 Vitepress 配置文件中实现自定义高亮逻辑：
     * ```ts
     * // .vitepress/config.ts
     * export default {
     *   themeConfig: {
     *     sidebar: {
     *       // 自定义高亮函数：匹配基础路径忽略查询参数
     *       highlight: (path) => path.split('?')[0]
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 匹配动态路由的配置示例：
     * ```ts
     * // .vitepress/config.ts
     * export default {
     *   themeConfig: {
     *     sidebar: {
     *       // 将 /posts/123 高亮为 /posts/[id]
     *       highlight: (path) => path.replace(/\/\d+$/, '/[id]')
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link SidebarItem.highlight} 单独配置项的高亮颜色
     * @see {@link NavItem} 导航项结构
     * @see {@link FooterItem} 页脚项结构
     */
    highlight?: (path: string, allLinks: string[]) => string | undefined;

    /**
     * 侧边栏导航链接配置
     * @optional
     * 
     * @remarks
     * 用于生成侧边栏主导航区的链接列表，支持两种配置模式：
     * 1. **统一模式**：直接使用 `NavItem[]` 数组，所有页面使用同一套导航配置
     * 2. **动态模式**：使用对象 `{ [basePath: string]: NavItem[] }`，根据当前路由前缀动态切换导航配置
     *    - 键为路由前缀（如 `'/guide/'`）
     *    - 值为该前缀下使用的导航项数组
     *    - 匹配规则：选择当前路由最长匹配前缀的配置
     * 
     * 注意事项：
     * - 每个导航项必须包含 `text: string` 属性
     * - 侧边栏收起时：无图标且无子项的项会被隐藏
     * - 悬浮提示默认使用 `text` 值，设为 `false` 可禁用提示
     * - 高亮样式支持统一颜色字符串或分状态（常态/hover/激活）配置
     * - 嵌套层级最多支持 6 层，超出部分会被截断
     * - 子项列表默认折叠，通过 `collapsed: false` 初始展开
     * 
     * @example
     * **完整配置文件示例（统一模式）**：
     * ```ts
     * // .vitepress/config.ts
     * import { defineConfig } from 'vitepress'
     * 
     * export default defineConfig({
     *   themeConfig: {
     *     sidebar: {
     *       navLinks: [
     *         {
     *           text: '首页',
     *           link: '/',
     *           icon: { light: '/icons/home-light.svg', dark: '/icons/home-dark.svg' },
     *           tooltip: '返回首页'  // 自定义提示
     *         },
     *         {
     *           text: '产品',
     *           collapsed: false,    // 初始展开子项
     *           items: [
     *             { 
     *               text: 'VitePress', 
     *               link: '/products/vitepress',
     *               highlight: '#42b883'  // 统一高亮色
     *             },
     *             { 
     *               text: 'Vue', 
     *               link: '/products/vue',
     *               highlight: {        // 分状态高亮
     *                 normal: '#34495e',
     *                 hover: '#42b883',
     *                 active: '#35495e'
     *               }
     *             }
     *           ]
     *         }
     *       ]
     *     }
     *   }
     * })
     * ```
     * 
     * @example
     * **动态模式配置示例**：
     * ```ts
     * // .vitepress/config.ts
     * export default {
     *   themeConfig: {
     *     sidebar: {
     *       navLinks: {
     *         // 中文路径配置
     *         '/zh/': [
     *           { text: "首页", link: "/zh/" },
     *           { text: "文档", link: "/zh/docs/" }
     *         ],
     *         // 英文路径配置
     *         '/en/': [
     *           { text: "Home", link: "/en/" },
     *           { text: "Documentation", link: "/en/docs/" }
     *         ]
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link NavItem} 导航项详细配置
     * @see {@link SidebarConfig.highlight} 全局高亮控制函数
     */
    navLinks?:
        | NavItem[]
        | { [basePath: string]: NavItem[] };
    
    /**
     * 侧边栏页脚链接配置
     * @optional
     * 
     * @remarks
     * 用于配置侧边栏底部的固定链接区域，提供额外的导航或功能入口。
     * 与导航链接不同，页脚链接：
     * - 不支持嵌套结构（无 `items` 属性）
     * - 不支持动态路由配置
     * - 仅支持单层链接列表
     * 
     * 注意事项：
     * - 必须同时包含 `text` 和 `link` 属性才被视为有效项
     * - 默认在侧边栏收缩时显示（可通过 `showOnCollapsed: false` 隐藏）
     * - 图标和悬浮提示行为与导航项一致
     * - 高亮配置方式与 {@link NavItem.highlight} 相同
     * - 无效项会被静默过滤
     * 
     * @example
     * **完整配置文件示例**：
     * ```ts
     * // .vitepress/config.ts
     * import { defineConfig } from 'vitepress'
     * 
     * export default defineConfig({
     *   themeConfig: {
     *     sidebar: {
     *       footerLinks: [
     *         {
     *           text: '意见反馈',
     *           link: 'https://feedback.example.com',
     *           icon: { 
     *             light: '/icons/feedback-light.svg', 
     *             dark: '/icons/feedback-dark.svg' 
     *           },
     *           showOnCollapsed: true  // 收缩时仍显示（默认）
     *         },
     *         {
     *           text: 'GitHub',
     *           link: 'https://github.com/your-repo',
     *           tooltip: '访问源码仓库',
     *           highlight: '#6e5494'  // GitHub 主题紫色
     *         },
     *         {
     *           text: '联系我们',
     *           link: '/contact',
     *           showOnCollapsed: false  // 收缩时隐藏此项
     *         }
     *       ]
     *     }
     *   }
     * })
     * ```
     * 
     * @see {@link FooterItem} 页脚项详细配置
     * @see {@link NavItem} 导航项配置参考
     */
    footerLinks?: FooterItem[];

    /**
     * 社交媒体链接配置
     * @optional
     * 
     * @remarks
     * 用于在侧边栏底部（页脚链接下方）添加社交媒体图标链接。
     * 这些链接以图标按钮形式展示，提供快速访问社交媒体账号的入口。
     * 
     * 注意事项：
     * - **侧边栏收起时会隐藏整个社交链接区域**
     * - 必须同时提供有效的 `icon` 和 `link` 属性才被视为有效项
     * - 图标支持图片路径或自定义组件
     * - 建议为每个链接添加 `ariaLabel` 提升可访问性
     * - 无效项会被静默过滤
     * 
     * @example
     * **完整配置文件示例**：
     * ```ts
     * // .vitepress/config.ts
     * import { defineConfig } from 'vitepress'
     * 
     * export default defineConfig({
     *   themeConfig: {
     *     sidebar: {
     *       socialLinks: [
     *         {
     *           icon: 'github',  // 使用内置图标名称
     *           link: 'https://github.com/your-account',
     *           ariaLabel: 'GitHub 仓库'
     *         },
     *         {
     *           icon: { 
     *             light: '/icons/twitter-light.svg',
     *             dark: '/icons/twitter-dark.svg'
     *           },
     *           link: 'https://twitter.com/your-account'
     *         },
     *         {
     *           icon: { component: 'CustomWeChatIcon' }, // 自定义组件
     *           link: '/wechat-contact',
     *           ariaLabel: '微信联系'
     *         }
     *       ]
     *     }
     *   }
     * })
     * ```
     * 
     * @see {@link SocialLink} 社交链接项详细配置
     * @see {@link ImageData} 图标图片格式
     */
    socialLinks?: SocialLink[];
}