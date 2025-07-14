import { ImageData } from "./common";


/**
 * 404页的全局配置接口
 * 
 * @remarks
 * 此接口定义了404页与not-found布局的所有可配置项，包括内容文本，图标，标题等内容。
 * 通过此配置，可以实现以下功能：
 * 
 * - 自定义404页的内容图标，标题，文本等内容
 * 
 * 可以配置的全部属性如下：
 * 
 * 1. 标题栏
 * 
 * @see {@link VPJNotFoundLayoutConfig.title} 标签页标题（未实现）
 * @see {@link VPJNotFoundLayoutConfig.favicon} 标签页图标（未实现）
 * 
 * 2. 内容：
 * 
 * @see {@link VPJNotFoundLayoutConfig.contentIcon} 内容图标
 * @see {@link VPJNotFoundLayoutConfig.contentTitle} 内容标题
 * @see {@link VPJNotFoundLayoutConfig.contentText} 内容文本
 * @see {@link VPJNotFoundLayoutConfig.contentLink} 内容链接
 * 
 * @example
 * 示例1：一个简单的配置示例
 * ```ts
 * // config.mjs
 * export default {
 *   themeConfig: {
 *     layouts: {
 *       notFound: {
 *         contentTitle: "出现了一点问题",
 *         contentText: "你访问的页面不存在",
 *         contentLink: {text: "点我返回主页", link: "/zh/"}
 *       }
 *     }
 *   }
 * }
 * ```
 */
export interface VPJNotFoundLayoutConfig {

    title?: string;

    favicon?: ImageData;

    description?: string;

    /**
     * 404页的内容图标配置
     * @optional
     * @default VPJIconCrossCircle 默认使用主题内置的错误图标
     * 
     * @remarks
     * 该项控制404页内容的图标内容，支持三种类型的图标配置：
     * 
     * 1. 一个路径字符串，指向图标的位置（建议放在public文件夹下使用）。
     * 2. 一个全局注册的组件名。
     * 3. 一个对象，为图片资源添加更多的扩展属性。
     * 
     * 只输入一个字符串时，会检测输入字符串末尾是否包含文件扩展名png|jpeg|jpg|gif|webp|svg中的一种，以此判断是否将此字符串视为文件路径。
     * 
     * 注意事项：
     * 
     * * 如果你提供的是一个没有指定fill属性的svg组件，那么它将会使用主题默认的颜色。（即由主题自带的css确定）。
     * 
     * @example
     * 示例1：通过路径指定图标
     * ```ts
     * // config.mjs，这会使用<img src="/path/to/icon.png">作为图标
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       notFound: {
     *         contentIcon: "/path/to/icon.png"
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：指定更多属性
     * ```ts
     * // config.mjs，这会使用这会使用<img src="/path/to/icon.png" alt="some description">作为图标
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       notFound: {
     *         contentIcon: { src: "/path/to/icon.png", alt: "some description" }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例3：使用自定义的组件作为图标
     * ```ts
     * // config.mjs，这会使用组件CustomIcon组件作为图标
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       notFound: {
     *         contentIcon: "CustomIcon" // 也可以像这样输入 contentIcon: { component: "CustomIcon" }
     *       }
     *     }
     *   }
     * }
     * ```
     */
    contentIcon?:
        | ImageData
        | { component: string };

    /**
     * 404页的内容标题配置
     * @optional
     * @default "页面未找到"
     * 
     * @remarks
     * 该项控制404页内容的标题内容，接受一个字符串作为标题输入（此标题文本在contentIcon控制的图标下方）
     * 
     * @example
     * 示例1：修改标题
     * ```ts
     * // config.mjs，这会使用"404 Error"作为标题
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       notFound: {
     *         contentTitle: "404 Error"
     *       }
     *     }
     *   }
     * }
     * ```
     */
    contentTitle?: string;

    /**
     * 404页的内容文本配置
     * @optional
     * @default "很抱歉，您尝试访问的页面不存在或可能已被删除。"
     * 
     * @remarks
     * 该项控制404页内容的文本内容，接受一个字符串作为标题输入（此文本内容在contentTitle控制的标题文本下方）
     * 
     * @example
     * 示例1：修改标题
     * ```ts
     * // config.mjs，这会使用"An error occurred, please click to return to the home page."作为文本
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       notFound: {
     *         contentText: "An error occurred, please click to return to the home page."
     *       }
     *     }
     *   }
     * }
     * ```
     */
    contentText?: string;

    /**
     * 404页的内容链接配置
     * @optional
     * @default {text: "返回主页", link: "/"} 默认情况或者不通过对象指定link属性时，底部链接会指向站点首页
     * 
     * @remarks
     * 该项控制404页内容的链接内容，支持两种类型的图标配置：
     * 
     * 1. 一个字符串，作为文本直接替换404页中按钮链接的文本。
     * 2. 一个对象，通过text与link关键字指定按钮链接的具体内容。
     * 
     * @example
     * 示例1：快捷修改按钮文本
     * ```ts
     * // config.mjs，这会使用"Home"作为按钮文本
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       notFound: {
     *         contentLink: "Home"
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：完全修改按钮内容
     * ```ts
     * // config.mjs，这会使用<a href="/about/">关于我们</a>作为按钮
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       notFound: {
     *         contentLink: { text: "关于我们", link: "/about/" }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例3：通过对象部分自定义按钮内容
     * ```ts
     * // config.mjs，这会使用<a href="/zh/">返回主页</a>作为按钮
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       notFound: {
     *         contentLink: { link: "/zh/" }
     *       }
     *     }
     *   }
     * }
     * ```
     */
    contentLink?:
        | string
        | { text?: string; link?: string};
}
