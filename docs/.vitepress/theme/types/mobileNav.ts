import type { SidebarConfig } from "./sidebar";


/**
 * 移动端顶部导航栏的全局配置接口
 * 
 * @remarks
 * 此接口定义了移动端顶部导航栏的所有可配置项，包括启用状态，标题等。
 * 通过此配置，可以实现以下功能：
 * 
 * - 控制移动端顶部导航栏的显示与隐藏
 * - 自定义移动端顶部导航栏的标题文本
 * 
 * 可以配置的全部属性如下：
 * 
 * 1. 全局：
 * 
 * @see {@link MobileNavConfig.enable} 启用导航栏
 * @see {@link MobileNavConfig.title} 导航栏标题
 * 
 * @example
 * 示例1：一个简单的配置示例
 * ```ts
 * // config.mjs
 * export default {
 *   themeConfig: {
 *     mobileNav: {
 *       enable: true,
 *       title: "我的网站"
 *     }
 *   }
 * }
 * ```
 */
export interface MobileNavConfig {
    /**
     * 是否启用移动端顶部导航栏
     * @optional
     * @default true 默认为true
     * 
     * @remarks
     * 该项控制是否启用移动端的顶部导航栏。接受一个Boolean值输入。
     * 
     * 注意事项：
     * 
     * 1. 在PC端此导航栏是强制隐藏的。
     * 2. 如果希望在移动端使用侧边栏的功能，那么建议开启此项，因为在不自定义的情况下，主题内没有提供其它的组件可以呼出隐藏的侧边栏。
     * 
     * @example
     * 示例1：禁用顶部导航栏
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     mobileNav: {
     *       enable: false
     *     }
     *   }
     * }
     * ```
     */
    enable?: boolean;

    /**
     * 移动端顶部导航栏的标题配置项
     * @optional
     * @default sidebar.headerTitle 默认从侧边栏配置里面继承headerTitle
     * 
     * @remarks
     * 该项控制移动端顶部导航栏的标题文本，接受两种类型的输入：
     * 
     * 1. 一个字符串，直接作为标题的文本。
     * 2. 一个对象，通过component键值指定一个全局注册的组件名。
     * 
     * 注意事项：
     * 
     * * 顶部导航栏的高度被强制限制为48px，如果使用自定义组件作为标题，那么可能需要考虑溢出文本的问题。
     * * 当sidebar.headerTitle和本项都没有填入值时，会按照headerTitle的默认值逻辑向下查找默认值，具体内容参考sidebar.headerTitle的注释。
     * 
     * @example
     * 示例1：自定义顶部栏的文本
     * ```ts
     * // config.mjs，这会使用"Custom Title"作为标题
     * export default {
     *   themeConfig: {
     *     mobileNav: {
     *       title: "Custom Title"
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：使用自定义的组件作为标题
     * ```ts
     * // config.mjs，这会使用组件"CustomComponent"替换原本的标题元素
     * export default {
     *   themeConfig: {
     *     mobileNav: {
     *       title: { component: "CustomComponent" }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例3：使用sidebar.headerTitle作为默认值
     * ```ts
     * // config.mjs，这会使用"Custom Sidebar HeaderTitle"作为标题
     * export default {
     *   themeConfig: {
     *     sidebar: {
     *       headerTitle: "Custom Sidebar HeaderTitle"
     *     },
     *     mobileNav: {
     *       ... // 不指定title
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link SidebarConfig.headerTitle} sidebar.headerTitle
     */
    title?:
        | string
        | { component: string };
}