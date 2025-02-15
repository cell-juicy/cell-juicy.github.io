import type { ImageData } from "./common";


/**
 * 侧边栏导航项的配置接口
 * 
 * @remarks
 * 此接口定义了单个侧边栏导航项的所有可配置属性，包括图标、文本、链接、提示文本、高亮等。
 * 
 * 可配置的属性列表如下：
 * 
 * 1. 核心属性：
 * @see {@link SidebarNavItemData.icon} 图标配置（必填）
 * @see {@link SidebarNavItemData.text} 文本内容（必填）
 * @see {@link SidebarNavItemData.link} 链接路径（必填）
 * 
 * 2. 交互属性：
 * @see {@link SidebarNavItemData.tooltip} 提示文本配置
 * @see {@link SidebarNavItemData.highlight} 高亮行为配置
 * 
 * 3. 扩展属性：
 * @see {@link SidebarNavItemData.attrs} 额外HTML属性
 * 
 * @example
 * 示例1：基础导航项配置
 * ```ts
 * {
 *   icon: "/home.svg",
 *   text: "首页",
 *   link: "/"
 * }
 * ```
 * 
 * @example
 * 示例2：完整配置
 * ```ts
 * {
 *   icon: { component: "CustomIcon" },
 *   text: "文档",
 *   link: "/docs",
 *   tooltip: "查看文档",
 *   highlight: { normal: "#2c3e50", hover: "#3498db" },
 *   attrs: { target: "_blank" }
 * }
 * ```
 */
export interface SidebarNavItemData {
    /**
     * 侧边栏导航项的图标配置
     * @required
     * 
     * @remarks
     * 该项控制按钮显示的图标，支持三种类型的图标配置：
     * 1. 一个路径字符串，指向图标的位置（建议放在public文件夹下使用）。
     * 2. 一个全局注册的组件名。
     * 3. 一个对象，为图片资源添加更多的扩展属性。
     * 只输入一个字符串时，会检测输入字符串的尾缀是否是png|jpeg|jpg|gif|webp|svg中的一种，如果是，那么这会被判定为图片路径，否则会被判定为全局注册的组件。
     * 
     * @example
     * 示例1：指定图片路径
     * ```ts
     * {..., icon: "/assets/home.svg", ...} // -> <img src="/assets/home.svg"/>
     * ```
     * 
     * @example
     * 示例2：指定组件名
     * ```ts
     * {..., icon: "VPJIconApps", ...} // -> <component is="VPJIconApps"/>
     * ```
     * 
     * @example
     * 示例3：为图片添加alt属性
     * ```ts
     * {..., icon: {src: "/assets/home.svg", alt: "home"}, ...} // -> <img src="/assets/home.svg" alt="home"/>
     * ```
     * 
     * @example
     * 示例4：强制指定组件
     * ```ts
     * {..., icon: {component: "nameEndWithsvg"}, ...} // -> <component is="nameEndWithsvg"/>
     * ```
     * 
     * @see {@link ImageData}
     */
    icon:
        | ImageData
        | { component: string };

    /**
     * 侧边栏导航项的文本配置
     * @required
     * 
     * @remarks
     * 该项控制按钮在侧边栏展开时显示的文本，接受一个字符串作为输入
     * 
     * @example
     * 示例1：为按钮设置文本内容
     * ```ts
     * {..., text: "首页", ...} // -> <span>首页</span>
     * ```
     */
    text: string;

    /**
     * 侧边栏导航项的链接配置
     * @required
     * 
     * @remarks
     * 该项控制按钮链接所指向的路径，接受一个字符串作为路径输入
     * 
     * @example
     * 示例1：为按钮设置链接路径
     * ```ts
     * {..., link: "/", ...} // -> <a href="/">...</a>
     * ```
     */
    link: string;

    /**
     * 侧边栏导航项的提示文本配置
     * @optional
     * @default item.text 默认直接使用该项的text值作为提示文本
     * 
     * @remarks
     * 该项控制按钮在侧边栏折叠时显示的提示文本，支持两种类型的输入：
     * 1. 一个字符串，作为提示文本的内容。
     * 2. null，表示禁用该项的提示文本。
     * 当配置了非null的内容后，这会使得按钮在侧边栏收起且鼠标悬浮于上方时在按钮右侧区域弹出一个文本提示。
     * 注意事项：
     * * 该项配置仅在侧边栏配置中enableTooltip项设置为true时生效，当sidebar.enableTooltip设置为false时此项会被自动覆盖为null。
     * * 弹出提示的长度被限制不超过120px，超出部分会被截断，并显示省略号（"..."）表示。
     * 
     * @example
     * 示例1：默认情况直接使用项的text值作为提示文本
     * ```ts
     * {..., text: "首页", ...} // -> 提示为"首页"
     * ```
     * 
     * @example
     * 示例2：为按钮设置提示文本
     * ```ts
     * {..., text: "首页", tooltip: "home", ...} // -> 提示为"home"
     * ```
     * 
     * @example
     * 示例3：禁用按钮的提示文本
     * ```ts
     * {..., text: "首页", tooltip: null, ...} // -> 提示文本不会显示
     * ```
     * 
     * @see {@link SidebarNavItemData.text} item.text
     * @see {@link SidebarConfig.enableTooltip} sidebar.enableTooltip
     */
    tooltip?:
        | string
        | null;

    /**
     * 侧边栏导航项的高亮配置
     * @optional
     * @default true 默认启用高亮功能
     * 
     * @remarks
     * 该项控制按钮的高亮行为，当启用了sidebar.enableHighlight时会根据所使用的筛选函数为唯一匹配的侧边栏项的图标添加一个高亮样式，接受三种类型的输入：
     * 1. 一个Boolean值，表示是否启用高亮。
     * 2. 一个字符串，表示高亮时图标的颜色。
     * 3. 一个对象，可以分别指定normal（正常状态）、hover（鼠标悬浮时）和active（激活状态）三种状态下图标的颜色。
     * 注意事项：
     * * 该项配置仅在侧边栏配置中enableHighlight项设置非false的值时生效，当sidebar.enableHighlight设置为false时此项会被自动覆盖为null。
     * * 该项配置只对使用没有指定fill属性的纯svg图标作为图标的侧边栏项有效，如果匹配到的项使用的是图片路径或者指定了fill属性的svg图标，那么只会为此项添加一个highlight类。
     * * 默认情况下，高亮样式的颜色配置是：
     *   - normal: var(--vpj-color-primary-400)
     *   - hover: var(--vpj-color-primary-500)
     *   - active: var(--vpj-color-primary-300)
     * 
     * @example
     * 示例1：启用高亮功能
     * ```ts
     * {..., highlight: true, ...} // -> 启用高亮功能
     * ```
     * 
     * @example
     * 示例2：禁用高亮功能
     * ```ts
     * {..., highlight: false, ...} // -> 禁用高亮功能
     * ```
     * 
     * @example
     * 示例3：指定高亮颜色
     * ```ts
     * {..., highlight: "red", ...} // -> 当项目高亮时，图标始终为红色
     * ```
     * 
     * @example
     * 示例4：分别指定不同状态下的颜色
     * ```ts
     * {..., highlight: {normal: "red", hover: "blue"}, ...} // -> 当项目高亮时，图标在正常状态为红色，鼠标悬浮时为蓝色，激活状态则启用默认的--vpj-color-primary-300值
     * {..., highlight: {normal: "red", hover: "darkred", active: "lightred"}, ...} // -> 使用自己的颜色方案覆盖全部的默认值
     * ```
     * 
     * @see {@link SidebarConfig.enableHighlight} sidebar.enableHighlight
     */
    highlight?:
        | boolean
        | string
        | {normal?: string; hover?: string; active?: string};

    /**
     * 侧边栏导航项的额外属性配置
     * @optional
     * @default {} 默认不添加额外属性
     * 
     * @remarks
     * 该项控制侧边栏导航项的额外属性，接受一个对象，其中的键值对会直接传入到链接上（详情参考[锚元素-MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/a#%E5%B1%9E%E6%80%A7)），需要注意以下键值是无效的：
     * - class
     * - data-tooltip
     * - highlight
     * - href
     * - icon
     * - iconAttrs
     * - isLink
     * - link
     * - style
     * - text
     * - textAttrs
     * - tooltip
     * 
     * @example
     * 示例1：让侧边栏导航项在新标签页打开
     * ```ts
     * {..., attrs: {target: "_blank"}, ...} // -> <a href="..." target="_blank">...</a>
     * ```
     */
    attrs?: Record<string, any>;
};


/**
 * 侧边栏底部链接项的配置接口
 * 
 * @remarks
 * 此接口定义了侧边栏底部链接项的所有可配置属性，包括图标、文本、链接、折叠显示行为等。
 * 
 * 可配置的属性列表如下：
 * 
 * 1. 核心属性：
 * @see {@link SidebarFooterItemData.icon} 图标配置（必填）
 * @see {@link SidebarFooterItemData.text} 文本内容（必填）
 * @see {@link SidebarFooterItemData.link} 链接路径（必填）
 * 
 * 2. 显示控制：
 * @see {@link SidebarFooterItemData.showOnCollapse} 折叠状态显示控制
 * 
 * 3. 扩展属性：
 * @see {@link SidebarFooterItemData.attrs} 额外HTML属性
 * 
 * @example
 * 示例1：基础底部链接配置
 * ```ts
 * {
 *   icon: "VPJIconGithub",
 *   text: "GitHub",
 *   link: "https://github.com"
 * }
 * ```
 * 
 * @example
 * 示例2：完整配置
 * ```ts
 * {
 *   icon: { src: "/social/github.svg", alt: "GitHub Logo" },
 *   text: "源码仓库",
 *   link: "https://github.com",
 *   showOnCollapse: true,
 *   attrs: { rel: "noopener" }
 * }
 * ```
 */
export interface SidebarFooterItemData {
    /**
     * 侧边栏底部链接项的图标配置
     * @required
     * 
     * @remarks
     * 该项控制按钮显示的图标，支持三种类型的图标配置：
     * 1. 一个路径字符串，指向图标的位置（建议放在public文件夹下使用）。
     * 2. 一个全局注册的组件名。
     * 3. 一个对象，为图片资源添加更多的扩展属性。
     * 只输入一个字符串时，会检测输入字符串的尾缀是否是png|jpeg|jpg|gif|webp|svg中的一种，如果是，那么这会被判定为图片路径，否则会被判定为全局注册的组件。
     * 
     * @example
     * 示例1：指定图片路径
     * ```ts
     * {..., icon: "/assets/home.svg", ...} // -> <img src="/assets/home.svg"/>
     * ```
     * 
     * @example
     * 示例2：指定组件名
     * ```ts
     * {..., icon: "VPJIconApps", ...} // -> <component is="VPJIconApps"/>
     * ```
     * 
     * @example
     * 示例3：为图片添加alt属性
     * ```ts
     * {..., icon: {src: "/assets/home.svg", alt: "home"}, ...} // -> <img src="/assets/home.svg" alt="home"/>
     * ```
     * 
     * @example
     * 示例4：强制指定组件
     * ```ts
     * {..., icon: {component: "nameEndWithsvg"}, ...} // -> <component is="nameEndWithsvg"/>
     * ```
     * 
     * @see {@link ImageData}
     */
    icon:
        | ImageData
        | { component: string };

    /**
     * 侧边栏底部链接项的文本配置
     * @required
     * 
     * @remarks
     * 该项控制按钮在侧边栏展开时显示的文本，接受一个字符串作为输入
     * 
     * @example
     * 示例1：为按钮设置文本内容
     * ```ts
     * {..., text: "关于", ...} // -> <span>关于</span>
     * ```
     */
    text: string;

    /**
     * 侧边栏底部链接项的链接配置
     * @required
     * 
     * @remarks
     * 该项控制按钮链接所指向的路径，接受一个字符串作为路径输入
     * 
     * @example
     * 示例1：为按钮设置链接路径
     * ```ts
     * {..., link: "/about/", ...} // -> <a href="/about/">...</a>
     * ```
     */
    link: string;

    /**
     * 侧边栏底部链接项的显示选项
     * @optional
     * @default true 默认为在侧边栏收起时显示
     * 
     * @remarks
     * 该项控制按钮是否在侧边栏折叠状态下显示（隐藏文本仅显示图标，参考侧边栏导航项的隐藏行为），接受一个Boolean值输入
     * 注意事项：
     * * 此项配置仅在侧边栏配置中的sidebar.showFooterOnCollapse设置为true时生效，当sidebar.showFooterOnCollaspe设置为false时此项会被自动覆盖为false
     * 
     * @example
     * 示例1：为单独一个按钮设置在侧边栏收起时隐藏
     * ```ts
     * {..., showOnCollaspe: false, ...} // -> 按钮会在侧边栏收起时完全隐藏
     * ```
     * 
     * @see {@link SidebarConfig.showFooterOnCollapse}
     */
    showOnCollapse?: boolean;

    /**
     * 侧边栏底部链接项的额外属性配置
     * @optional
     * @default {target: "_blank"}  默认情况下，底部链接项的链接会在新标签页打开
     * 
     * @remarks
     * 该项控制侧边栏导航项的额外属性，接受一个对象，其中的键值对会直接传入到链接上（详情参考[锚元素-MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/a#%E5%B1%9E%E6%80%A7)），需要注意以下键值是无效的：
     * - class
     * - href
     * - icon
     * - iconAttrs
     * - isLink
     * - link
     * - style
     * - text
     * - textAttrs
     * 
     * @example
     * 示例1：添加type属性
     * ```ts
     * {..., attrs:{type: "button"}, ...} // -> <a href="..." type="button">...</a>
     * ```
     */
    attrs?: Record<string, any>;
};


/**
 * 侧边栏的全局配置接口
 * 
 * @remarks
 * 此接口定义了侧边栏的所有可配置项，包括启用状态、标题、Logo、导航项、底部链接等。
 * 通过此配置，可以实现以下功能：
 * 
 * - 控制侧边栏的显示与隐藏
 * - 自定义资料卡按钮的标题和图标
 * - 配置导航项的高亮和提示文本行为
 * - 添加底部链接项（如社交媒体或外部资源链接）
 * 
 * 可以配置的全部属性如下：
 * 
 * 1. 全局：
 * @see {@link SidebarConfig.enable} 启用侧边栏
 * 
 * 2. 头部区域：
 * @see {@link SidebarConfig.headerTitle} 头部标题
 * @see {@link SidebarConfig.headerLogo} 头部Logo
 * @see {@link SidebarConfig.enableProfile} 启用资料卡
 * @see {@link SidebarConfig.profileTitle} 资料卡标题
 * @see {@link SidebarConfig.profileLogo} 资料卡Logo
 * @see {@link SidebarConfig.profileDescription} 资料卡内容
 * 
 * 3. 导航区域：
 * @see {@link SidebarConfig.navLinks} 导航链接列表
 * @see {@link SidebarConfig.enableTooltip} 启用文本提示
 * @see {@link SidebarConfig.enableHighlight} 启用高亮
 * @see {@link SidebarConfig.navContent} 导航附加组件
 * 
 * 4. 底部区域：
 * @see {@link SidebarConfig.showFooterOnCollapse} 底部折叠显示
 * @see {@link SidebarConfig.footerLinks} 底部链接列表
 * 
 * @example
 * 示例1：一个简单的配置示例
 * ```ts
 * // config.mjs
 * export default {
 *   themeConfig: {
 *     sidebar: {
 *       enable: true,
 *       headerTitle: "我的网站",
 *       navLinks: [
 *         { icon: "/home.svg", text: "首页", link: "/" },
 *         { icon: "/book.svg", text: "我的笔记", link: "/" }
 *       ],
 *       footerLinks: [
 *         { icon: "VPJIconGithub", text: "GitHub", link: "https://github.com" }
 *       ]
 *     }
 *   }
 * }
 * ```
 */
export interface SidebarConfig {
    /**
     * 是否启用侧边栏
     * @optional
     * @default true 默认启用侧边栏
     * 
     * @remarks
     * 该项控制是否启用侧边栏，接受一个Boolean值输入
     * 
     * @example
     * 示例1：禁用侧边栏
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     sidebar: {
     *       enable: false
     *     }
     *   }
     * }
     * ```
     */
    enable?: boolean;

    /**
     * 侧边栏的标题配置
     * @optional
     * @default site.title | "VitePress" 默认从站点配置继承title，如果此值为空则默认为"VitePress"
     * 
     * @remarks
     * 该项控制侧边栏头部的标题，接受一个字符串作为输入，这个标题会被放置在侧边栏的顶部资料卡按钮中
     * 
     * @example
     * 示例1：自定义资料卡按钮的文本
     * ```ts
     * // config.mjs，文本被设置为"An interesting title"
     * export default {
     *   themeConfig: {
     *     sidebar: {
     *       headerTitle: "An interesting title"
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：当站点配置的标题存在时，不填入值会从site.title继承标题
     * ```ts
     * // config.mjs，文本被设置为"My vitepress site"
     * export default {
     *   title: "My vitepress site",
     *   themeConfig: {
     *     ...
     *   }
     * }
     * ```
     * 
     * @example
     * 示例3：当站点配置的标题不存在时，不填入值会将标题设置为"VitePress"
     * ```ts
     * // config.mjs，文本被设置为"VitePress"
     * export default {
     *   ...,
     *   themeConfig: {
     *     ...
     *   }
     * }
     * ```
     * 
     * @see {@link SiteConfig.title}
     */
    headerTitle?: string;

    /**
     * 侧边栏的logo配置
     * @optional
     * @default theme.logo | defaultAvatar 默认从主题配置继承logo，若未配置则启用主题默认logo
     * 
     * @remarks
     * 该项控制侧边栏资料卡按钮的logo，支持三种类型的图标配置：
     * 1. 一个路径字符串，指向图标的位置（建议放在public文件夹下使用）。
     * 2. 一个全局注册的组件名。
     * 3. 一个对象，为图片资源添加更多的扩展属性。
     * 只输入一个字符串时，会检测输入字符串的尾缀是否是png|jpeg|jpg|gif|webp|svg中的一种，如果是，那么这会被判定为图片路径，否则会被判定为全局注册的组件。
     * 
     * 注意事项：
     * * logo的尺寸通过css限制为24px × 24px
     * 
     * > 默认的logo如下：
     * >
     * > ![defaultAvatar](../assets/avatar.svg)
     * 
     * @example
     * 示例1：指定图片作为logo
     * ```ts
     * // config.mjs，这会使用<img src="/assets/avatar.svg">作为图标
     * export default {
     *   themeConfig: {
     *     sidebar: {
     *       headerLogo: "/assets/avatar.svg" // 也可以用headerLogo: {src: "/assets/avatar.svg", alt: "logo"}这样的输入指定更多信息
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：指定组件名作为logo
     * ```ts
     * // config.mjs，这会使用CustomIconComponent作为图标
     * export default {
     *   themeConfig: {
     *     sidebar: {
     *       headerLogo: "CustomIconComponent" // 也可以用headerLogo: {component: "CustomIconComponent"}这样的输入指定组件（这主要是避免名字以svg这样后缀结尾组件的自动输入误判）
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例3：从theme.logo继承图标
     * ```ts
     * // config.mjs，这会使用<img src="/path/to/logo.png">作为图标
     * export default {
     *   themeConfig: {
     *     logo: "/path/to/logo.png"
     *   }
     * }
     * ```
     * 
     * @example
     * 示例4：完全不指定，使用defaultAvatar作为图标
     * ```ts
     * // config.mjs，这会使用defaultAvatar作为图标
     * export default {
     *   ...,
     *   themeConfig: {
     *     ...
     *   }
     * }
     * 
     * @see {@link ThemeConfig.logo} theme.logo
     */
    headerLogo?: 
        | ImageData
        | { component: string };

    /**
     * 是否启用侧边栏资料卡
     * @optional
     * @default true 默认为true
     * 
     * @remarks
     * 该项控制是否启用侧边栏的资料卡按钮，即点击是否会弹出资料卡。接受一个Boolean值作为输入。
     * 
     * 注意事项：
     * * 该项事实上控制的是是否为资料卡按钮添加disable属性
     * * 资料卡的弹出位置逻辑如下：
     *   - 如果是移动端，那么浮动于页面顶部
     *   - 如果是PC端，那么根据资料卡按钮的位置决定出现位置，如果资料卡按钮下方有超过352px（资料卡的最大高度）的空间，那么卡片浮动于资料卡按钮下方；否则出现在按钮上方的区域）
     * 
     * @example
     * 示例1：禁用资料卡按钮
     * ```ts
     * // config.mjs，这会禁用资料卡按钮
     * export default {
     *   themeConfig: {
     *     sidebar: {
     *       enableProfile: false;
     *     }
     *   }
     * }
     * ```
     */
    enableProfile?: boolean;
    
    /**
     * 侧边栏资料卡的logo配置
     * @optional
     * @default sidebar.headerLogo 默认从侧边栏配置继承headerLogo
     * 
     * @remarks
     * 该项控制侧边栏资料卡的logo，支持三种类型的图标配置：
     * 1. 一个路径字符串，指向图标的位置（建议放在public文件夹下使用）。
     * 2. 一个全局注册的组件名。
     * 3. 一个对象，为图片资源添加更多的扩展属性。
     * 只输入一个字符串时，会检测输入字符串的尾缀是否是png|jpeg|jpg|gif|webp|svg中的一种，如果是，那么这会被判定为图片路径，否则会被判定为全局注册的组件。
     * 注意事项：
     * * 只有侧边栏配置中enableProfile为true的时候此配置项才有意义
     * * logo的尺寸通过css限制为24px × 24px（同headerLogo一样）。
     * 
     * @example
     * 示例1：指定图片作为logo
     * ```ts
     * // config.mjs，这会使用<img src="/assets/avatar.svg">作为图标
     * export default {
     *   themeConfig: {
     *     sidebar: {
     *       profileLogo: "/assets/avatar.svg" // 也可以用profileLogo: {src: "/assets/avatar.svg", alt: "logo"}这样的输入指定更多信息
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：指定组件名作为logo
     * ```ts
     * // config.mjs，这会使用CustomIconComponent作为图标
     * export default {
     *   themeConfig: {
     *     sidebar: {
     *       profileLogo: "CustomIconComponent" // 也可以用profileLogo: {component: "CustomIconComponent"}这样的输入指定组件（这主要是避免名字以svg这样后缀结尾组件的自动输入误判）
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例3：从headerLogo继承图标
     * ```ts
     * // config.mjs，这会使用<img src="/path/to/logo.png">作为图标（如果你不指定headerLogo，那么会按照headerLogo的默认值逻辑往下寻找默认值）
     * export default {
     *   themeConfig: {
     *     headerLogo: "/path/to/logo.png"
     *   }
     * }
     * ```
     * 
     * @see {@link SidebarConfig.headerLogo} sidebar.headerLogo
     * @see {@link SidebarConfig.enableProfile} sidebar.enableProfile
     */
    profileLogo?: 
        | ImageData
        | { component: string };
    
    /**
     * 侧边栏资料卡的标题配置
     * @optional
     * @default sidebar.headerTitle 默认从侧边栏配置里面继承headerTitle
     * 
     * @remarks
     * 该项控制侧边栏资料卡的标题内容，接受一个字符串作为输入
     * 注意事项
     * * 标题长度受限于资料卡的宽度，超出最大长度时超出部分会变成"..."
     * * 当sidebar.headerTitle和本项都没有填入值时，会按照headerTitle的默认值逻辑向下查找默认值，具体内容参考sidebar.headerTitle的注释
     * 
     * @example
     * 示例1：自定义标题
     * ```ts
     * // config.mjs，这会使用"Something for profile card"作为资料卡标题
     * export default {
     *   themeConfig: {
     *     sidebar: {
     *       profileTitle: "Something for profile card"
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：继承sidebar.headerTitle的标题
     * ```ts
     * // config.mjs，这会使用"Something for sidebar header"作为资料卡标题
     * export default {
     *   themeConfig: {
     *     sidebar: {
     *       headerTitle: "Something for sidebar header"
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link SidebarConfig.headerTitle} sidebar.headerTitle
     */
    profileTitle?: string;

    /**
     * 侧边栏资料卡的描述配置
     * @optional
     * @default site.description | "" 默认从站点配置继承description
     * 
     * @remarks
     * 侧边栏资料卡的描述，支持两种类型的图标配置：
     * 1. 一个字符串，直接作为文本填入
     * 2. 一个全局注册的组件名，这会直接替换description原本的div元素直接插入资料卡组件
     * 注意事项：
     * * 资料卡最大限制高度为352px，如果填入的描述内容超过了这个高度，那么会启用滚动条将描述变成滚动区域。但是这对自定义组件无效，因此如果填入自定义组件可能需要考虑溢出内容的问题。
     * 
     * @example
     * 示例1：自定义资料卡的内容
     * ```ts
     * // config.mjs，这会使用"Welcome to my vitepress site"作为资料卡的内容
     * export default {
     *   themeConfig: {
     *     sidebar: {
     *       profileDescription: "Welcome to my vitepress site"
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：使用自定义的组件作为资料卡的内容
     * ```ts
     * // config.mjs，这会使用组件SomeAmazingComponent作为资料卡的内容
     * export default {
     *   themeConfig: {
     *     sidebar: {
     *       profileDescription: { component: "SomeAmazingComponent" }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例3：继承站点配置
     * ```ts
     * // config.mjs，这会使用"Summary of the website"作为资料卡的描述
     * export default {
     *   themeConfig: {
     *     description: "Summary of the website"
     *   }
     * }
     * ```
     * 
     * @see {@link SiteConfig.description} site.description
     */
    profileDescription?: 
        | string
        | { component: string };

    /**
     * 侧边栏的导航项列表配置
     * @optional
     * @default [] 默认情况下没有导航项
     * 
     * @remarks
     * 该项控制侧边栏中导航链接列表，通过配置此项可以在侧边栏导航区域中设置链接按钮。具体的可配置内容请参考SidebarNavItemData的内容
     * 
     * @example
     * 示例1：添加三个导航链接，分别通往/docs/，/blogs/和主页/
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     sidebar: {
     *       navLinks: [
     *         {icon: "VPJIconHome", text: "我的主页", link: "/", tooltip: "主页"},
     *         {icon: "VPJIconBlogPencil", text: "我的博客", link: "/blogs/", tooltip: "博客"},
     *         {icon: "VPJIconBookBookmark", text: "我的笔记", link: "/docs/", tooltip: "笔记"}
     *       ],
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link SidebarNavItemData} SidebarNavItemData
     */
    navLinks?: SidebarNavItemData[];

    /**
     * 侧边栏导航项的提示文本全局配置
     * @optional
     * @default true 默认为启用提示文本
     * 
     * @remarks
     * 该项控制是否启用侧边栏导航项的提示文本，接受一个Boolean值作为输入。当此项设置为false时，会覆盖所有sidebar.navLinks中项的tooltip配置。
     * 
     * 注意事项：
     * 
     * * 如果你只希望单独控制某一项的提示文本，你应该在sidebar.navLinks的输入中为此项配置tooltip属性而不是更改此项内容，详情请移步SidebarNavItemData的注释。
     * 
     * @example
     * 示例1：关闭全体导航项的提示文本功能
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     sidebar: {
     *       enableTooltip: false
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link SidebarConfig.navLinks} sidebar.navLinks
     * @see {@link SidebarNavItemData} SidebarNavItemData
     */
    enableTooltip?: boolean;

    /**
     * 侧边栏导航项的高亮全局配置
     * 是否高亮当前页面最接近的父路径，这会为当前路由匹配到的最近父路径项的图标添加一个高亮样式。也可以输入一个接受函数来自定义高亮项的逻辑
     * @optional
     * @default true 默认为启用高亮功能
     * 
     * @remarks
     * 该项控制侧边栏导航链接列表的高亮功能配置，支持两种类型的输入：
     * 
     * 1. 一个Boolean值，表示是否启用高亮功能。
     * 2. 一个参数为当前链接与导航项链接数组，且返回值为需要高亮的导航项链接或者undefined的高亮逻辑函数。
     * 
     * 默认情况下（即只填入Boolean值时），高亮导航项的逻辑是从导航链接列表中找出与当前路径匹配的最长父路径。
     * 
     * 注意事项：
     * 
     * * 所有链接路径与高亮逻辑函数返回值一致的项都会被视为高亮项。
     * * 高亮项实质上是为该项添加一个highlight类，默认情况下，它会通过css在项目的图标上发生作用（前提是使用了未指定fill属性的svg图标）。
     * * 虽然理论上自己指定高亮逻辑时可以通过返回奇怪的路径来取消高亮，但是仍然建议返回undefined。
     * * 如果你想要定制项的高亮效果，请移步到SidebarNavItemData.highlight属性的注释。
     * 
     * @example
     * 示例1：关闭侧边栏导航项列表的高亮功能
     * ```ts
     * // config.mjs，这会关闭高亮
     * export default {
     *   themeConfig: {
     *     sidebar: {
     *       enableHighlight: false;
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：使用自定义的高亮逻辑
     * ```ts
     * // path/to/function.js
     * export function customHighlight(curr, navList) {
     *   ... // 编写你的逻辑
     * }
     * 
     * // config.mjs，这会使用customHighlight覆盖掉默认的高亮逻辑
     * import { customHighlight } from "path/to/function.js"
     * 
     * export default {
     *   themeConfig: {
     *     sidebar: {
     *       enableHighlight: customHighlight;
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link SidebarNavItemData.highlight} SidebarNavItemData.highlight
     */
    enableHighlight?:
        | boolean
        | ((currentPath: string, navLinkList: string[]) => string | undefined);

    /**
     * 侧边栏的额外内容配置
     * @optional
     * @default undefined 默认情况下不填入内容
     * 
     * @remarks
     * 该项控制侧边栏中导航栏链接列表下方区域内容，接受一个已经在全局注册的组件名作为额外内容填入。
     * 
     * 注意事项：
     * * 填入的组件只有在侧边栏展开时才会显示。
     * 
     * @example
     * 示例1：使用注册的组件CustomMenu插入侧边栏导航区
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     sidebar: {
     *       navContent: "CustomMenu"
     *     }
     *   }
     * }
     * ```
     */
    navContent?: string;

    /**
     * 
     * 是否在侧边栏折叠时显示底部内容
     * @optional
     * @default false 默认隐藏底部内容
     * 
     * @remarks
     * 该项控制侧边栏底部区域在侧边栏收起时是否显示，接受一个Boolean值作为输入。
     * 
     * 注意事项：
     * * 部分内容的配置只有在此项为true时才有意义，例如sidebar.footerLinks列表项中的showOnCollapse属性。
     * 
     * @example
     * 示例1：在侧边栏折叠时显示底部内容
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     sidebar: {
     *       showFooterOnCollapse: true
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link SidebarConfig.footerLinks} sidebar.footerLinks
     * @see {@link SidebarFooterItemData.showOnCollaspe} showOnColllapse
     */
    showFooterOnCollapse?: boolean;

    /**
     * 侧边栏底部的链接列表配置
     * @optional
     * @default [] 默认情况下没有底部链接项
     * 
     * @remarks
     * 该项控制侧边栏中底部链接列表，通过配置此项可以在侧边栏导航区域中设置链接按钮，行为上类似于sidebar.navLinks导航栏列表。具体的可配置内容请参考SidebarFooterItemData的内容
     * 
     * @example
     * 示例1：添加两个链接，分别通往/about/与https://github.com/
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     sidebar: {
     *       footerLinks: [
     *         {icon: "VPJIconInfo", text: "关于我们", link: "/about/", target: "_self"},
     *         {icon: "VPJIconGithub", text: "Github", link: "https://github.com/", showOnCollapse: false},
     *       ]
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link SidebarFooterItemData} SidebarFooterItemData
     */
    footerLinks?: SidebarFooterItemData[]
}