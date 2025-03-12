/**
 * page布局的全局配置接口
 * 
 * @remarks
 * 此接口定义了page布局的所有可配置项，主要是页面布局相关的配置。
 * 通过此配置，可以实现以下功能：
 * 
 * - 自定义page布局默认的两侧留白宽度与内容区域的宽度。
 * 
 * 可以配置的全部属性如下：
 * 
 * 1. 内容：
 * 
 * @see {@link VPJPageLayoutConfig.contentGutter} 两侧留白宽度
 * @see {@link VPJPageLayoutConfig.contentWidth} 内容区域宽度
 * 
 * @example
 * 示例1：一个简单的配置示例
 * ```ts
 * // config.mjs
 * export default {
 *   themeConfig: {
 *     layouts: {
 *       page: {
 *         contentGutter: "2rem",
 *         contentWidth: "70rem"
 *       }
 *     }
 *   }
 * }
 * ```
 */
export interface VPJPageLayoutConfig {
    /**
     * page布局的两侧留白配置
     * @optional
     * @default {mobile: "1.5rem", tablet: "1.5rem", desktop: "4rem"}
     * 
     * @remarks
     * 该项控制page布局中两侧留白的宽度，支持两种类型的输入：
     * 
     * 1. 一个字符串，作为css变量应用于所有尺寸的设备上。
     * 2. 一个对象，通过键mobile、tablet和desktop分别设置移动端（0\~768px）、平板端（768\~1024px）和桌面端（>1024px）的留白宽度。
     * 
     * 注意事项：
     * 
     * * 该项同样可以在应用了page布局的页面frontmatter中单独设置，具体参考示例。
     * * 自定义的优先级顺序是：页面frontmatter > 主题配置 > 默认值，并且移动端、平板端、桌面端的配置继承独立计算。
     * * 该项并不是直接控制留白宽度，实际布局中留白列占据grid布局的宽度为`minmax(min(contentGutter, 100%), 1fr)`。
     * * 此项的设置对同一个页面下的VPJHeroImage组件同样生效。
     * 
     * @example
     * 示例1：通过主题配置覆盖默认值
     * ```ts
     * // config.mjs，这会在所有尺寸的窗口中应用2rem作为留白宽度
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       page: {
     *         contentGutter: "2rem"
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：不同尺寸屏幕下的不同留白宽度
     * ```ts
     * // config.mjs，这会在0~768px的窗口应用留白宽度2rem，768px~1024px的窗口应用留白宽度2.5rem，>1024px的窗口应用留白宽度5rem
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       page: {
     *         contentGutter: {
     *           mobile: "2rem",
     *           tablet: "2.5rem",
     *           desktop: "5rem"
     *         } // 如果不完全覆盖，则会继承默认值，例如输入为{mobile: "2rem"}，则tablet和desktop尺寸的窗口留白宽度会继承默认值
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例3：在页面frontmatter中单独设置
     * ```markdown
     * // 在你想要单独定制的页面frontmatter中添加如下配置，这会在0~768px的窗口应用留白宽度1rem，768px~1024px的窗口应用留白宽度3rem，>1024px的窗口应用留白宽度5rem
     * ---
     * contentGutter: 
     *   mobile: "1rem"
     *   tablet: "3rem"
     *   desktop: "5rem"
     * ---
     * ```
     * 
     * @example
     * 示例4：不完全覆盖的示例
     * ```markdown
     * // 假设这是a.md页面的frontmatter设置
     * ---
     * contentGutter: 
     *   mobile: "10ch"
     *   tablet: "20ch"
     * ---
     * ```
     * ```ts
     * // config.mjs，假设这是站点主题配置
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       page: {
     *         contentGutter: {
     *           tablet: "24px",
     *           desktop: "48px"
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 最终a.md页面的留白宽度会是：
     * 
     * 1. 0\~768px的窗口应用留白宽度10ch（继承顺序frontmatter(10ch) > theme(undefined) > default(1.5rem)）
     * 2. 768px\~1024px的窗口应用留白宽度20ch（继承顺序frontmatter(20ch) > theme(24px) > default(1.5rem)）
     * 3. \>1024px的窗口应用留白宽度48px（继承顺序frontmatter(undefined) > theme(48px) > default(4rem)）
     */
    contentGutter?:
        | string
        | {
            mobile?: string;
            tablet?: string;
            desktop?: string
        };
    
    /**
     * page布局的内容宽度配置
     * @optional
     * @default "61.25rem"
     * 
     * @remarks
     * 该项控制page布局中页面内容的宽度，支持两种类型的输入：
     * 
     * 1. 一个字符串，作为css变量应用于所有尺寸的设备上。
     * 2. 一个对象，通过键mobile、tablet和desktop分别设置移动端（0\~768px）、平板端（768\~1024px）和桌面端（>1024px）的留白宽度。
     * 
     * 注意事项：
     * 
     * * 该项同样可以在应用了page布局的页面frontmatter中单独设置，具体参考示例。
     * * 自定义的优先级顺序是：页面frontmatter > 主题配置 > 默认值，并且移动端、平板端、桌面端的配置继承独立计算。
     * * 该项并不是直接控制内容宽度，实际布局中内容列占据grid布局的宽度为`minmax(min(calc(2 * contentGutter), 100%), contentWidth)`。
     * * 此项的设置对同一个页面下的VPJHeroImage组件同样生效。
     * 
     * @example
     * 示例1：通过主题配置覆盖默认值
     * ```ts
     * // config.mjs，这会在所有尺寸的窗口中应用600px作为内容宽度
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       page: {
     *         contentWidth: "600px"
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：不同尺寸屏幕下的不同内容宽度
     * ```ts
     * // config.mjs，这会在0~768px的窗口应用内容宽度40rem，768px~1024px的窗口应用内容宽度55rem，>1024px的窗口应用内容宽度65rem
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       page: {
     *         contentWidth: {
     *           mobile: "40rem",
     *           tablet: "55rem",
     *           desktop: "65rem"
     *         } // 如果不完全覆盖，则会继承默认值，例如输入为{mobile: "40rem"}，则tablet和desktop尺寸的窗口内容宽度会继承默认值
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例3：在页面frontmatter中单独设置
     * ```markdown
     * // 在你想要单独定制的页面frontmatter中添加如下配置，这会在0~768px的窗口应用内容宽度490px，768px~1024px的窗口应用内容宽度780px，>1024px的窗口应用内容宽度960px
     * ---
     * contentWidth: 
     *   mobile: "490px"
     *   tablet: "780px"
     *   desktop: "960px"
     * ---
     * ```
     * 
     * @example
     * 示例4：不完全覆盖的示例
     * ```markdown
     * // 假设这是a.md页面的frontmatter设置
     * ---
     * contentGutter: 
     *   mobile: "100ch"
     *   tablet: "200ch"
     * ---
     * ```
     * ```ts
     * // config.mjs，假设这是站点主题配置
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       page: {
     *         contentWidth: {
     *           tablet: "600px",
     *           desktop: "900px"
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 最终a.md页面的内容宽度会是：
     * 
     * 1. 0~768px宽的窗口应用内容宽度100ch（继承顺序frontmatter(100ch) > theme(undefined) > default(61.25rem)）
     * 2. 768px~1024px宽的窗口应用内容宽度20ch（继承顺序frontmatter(200ch) > theme(600px) > default(61.25rem)）
     * 3. \>1024px宽的窗口应用内容宽度48px（继承顺序frontmatter(undefined) > theme(900px) > default(61.25rem)）
     */
    contentWidth?:
        | string
        | {
            mobile?: string;
            tablet?: string;
            desktop?: string
        };
}