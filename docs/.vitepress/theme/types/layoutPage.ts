import { DeviceSpecificInput, ImageData, HeaderTitleTemplateInput, FooterInput } from "./common";


/**
 * page 布局的全局配置接口
 * 
 * @remarks
 * 此接口定义了 `page` 布局的所有可配置项，主要用于控制页面内容区域的布局样式，包括边距、宽度与 `<head>` 元信息的处理。
 * 
 * 通过此配置，可以实现以下功能：
 * 
 * - 自定义页面的左右留白、最大宽度、上下边距
 * - 自定义页面的元信息
 * 
 * 可以配置的全部属性如下：
 * 
 * 1. **元信息配置**
 * 
 * @see {@link VPJPageLayoutConfig.titleTemplate} 页面标题模板配置
 * @see {@link VPJPageLayoutConfig.favicon} 页面默认图标
 * @see {@link VPJPageLayoutConfig.description} 页面默认描述
 * 
 * 2. **内容配置**
 * 
 * @see {@link VPJPageLayoutConfig.contentPadding} 内边距
 * @see {@link VPJPageLayoutConfig.contentMaxWidth} 最大宽度
 * @see {@link VPJPageLayoutConfig.contentMarginTop} 顶部边距
 * @see {@link VPJPageLayoutConfig.contentMarginBottom} 底部边距
 * 
 * @example
 * 示例 1：一个简单的配置示例
 * ```ts
 * // config.mjs
 * export default {
 *   themeConfig: {
 *     layouts: {
 *       page: {
 *         titleTemplate: "页面 - :title",
 *         contentPadding: "2rem",
 *         contentMaxWidth: "70rem",
 *         contentMarginTop: "3rem",
 *         contentMarginBottom: "2rem"
 *       }
 *     }
 *   }
 * }
 * ```
 */
export interface VPJPageLayoutConfig {
    /**
     * 页面标题模板
     * @optional
     * 
     * @remarks
     * 该项用于配置所有 `page` 布局页面在 `<head>` 中渲染的 `<title>` 元素，可设置统一的标题格式。
     * 
     * 仅支持以下三种模式：
     * 
     * 1. **字符串模板** - 使用 `:title` 占位符
     * 2. **禁用模式（false）** - 跳过模板计算，直接使用标题
     * 3. **默认模式（true）** - 使用默认模板
     * 
     * 注意事项：
     * 
     * - 不支持函数形式输入
     * - 字符串模板中仅支持 `:title` 占位符
     * - 页面 frontmatter 中的 `titleTemplate` 优先级更高
     * 
     * @example
     * 示例 1：添加统一前缀
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       page: {
     *         titleTemplate: "页面 - :title"
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例 2：完全禁用模板
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       page: {
     *         titleTemplate: false
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link TitleTemplateInput}
     */
    titleTemplate?: string | boolean;

    /**
     * 页面默认图标
     * @optional
     * 
     * @remarks
     * 该项用于配置所有 `page` 布局页面在 `<head>` 中显示的图标，
     * 将被注入为 `<link rel="icon">`，用于控制浏览器标签页的图标显示。
     * 
     * 支持传入字符串路径，或对象形式包含图标描述信息。
     * 
     * 注意事项：
     * - 页面 frontmatter 中的 `favicon` 优先级更高
     * - 若系列也未设置，将使用 `themeConfig.logo` 作为兜底图标
     * 
     * @example
     * 示例 1：设置统一图标
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       page: {
     *         favicon: "/images/page-icon.svg"
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例 2：图标及说明文本
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       page: {
     *         favicon: {
     *           src: "/images/page-icon.svg",
     *           alt: "页面图标"
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link ImageData}
     */
    favicon?: ImageData;

    /**
     * 页面默认描述
     * @optional
     * 
     * @remarks
     * 该项用于配置所有 `page` 布局页面的默认页面描述，
     * 将被注入为 `<meta name="description">`，部分搜索引擎或社交平台会将其作为摘要展示。
     * 
     * 注意事项：
     * - 页面 frontmatter 中的 `description` 优先级更高
     * - 若系列也未提供，将使用 `site.description` 作为最终兜底
     * 
     * @example
     * 示例 1：提供统一页面描述
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       page: {
     *         description: "这是一个静态页面，包含通用信息。"
     *       }
     *     }
     *   }
     * }
     * ```
     */
    description?: string;

    /**
     * 内容区域底部边距配置（page布局）
     * @optional
     * @default "1.5rem"
     * 
     * @remarks
     * 此项用于控制 `page` 布局下内容区域底部的预留间距，支持以下配置方式：
     * 
     * 1. **统一值模式** - 直接使用 CSS 高度值（如 `"2rem"`）
     * 2. **设备响应模式** - 分设备配置移动端 / 平板 / 桌面端高度
     * 3. **禁用模式** - 使用 `false` 取消底部边距
     * 
     * 输入值将被标准化为 {@link NormalizedDeviceSpecificInput} 格式参与合并。
     * 
     * 注意事项：
     * - 可在页面 frontmatter 中配置（如 `contentMarginBottom: "60px"`）
     * - 最终值将被注入为 CSS 变量，用于调整布局留白，请使用合法的 CSS 单位（如 `px`、`vh`、`rem` 等）
     * - 若设为 `false`，则内容区域将与容器底部无间距
     * 
     * @example
     * 示例 1：响应式配置
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       page: {
     *         contentMarginBottom: {
     *           mobile: "1rem",
     *           tablet: "1.5rem",
     *           desktop: "2rem"
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例 2：统一边距配置
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       page: {
     *         contentMarginBottom: "2rem"
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link DeviceSpecificInput}
     * @see {@link NormalizedDeviceSpecificInput}
     */
    contentMarginBottom?: DeviceSpecificInput;

    /**
     * 内容区域顶部边距配置（page布局）
     * @optional
     * @default "1.5rem"
     * 
     * @remarks
     * 此项用于控制 `page` 布局下内容区域顶部的预留间距，支持以下配置方式：
     * 
     * 1. **统一值模式** - 直接使用 CSS 高度值（如 `"2rem"`）
     * 2. **设备响应模式** - 分设备配置移动端 / 平板 / 桌面端高度
     * 3. **禁用模式** - 使用 `false` 取消顶部边距
     * 
     * 输入值将被标准化为 {@link NormalizedDeviceSpecificInput} 格式参与合并。
     * 
     * 注意事项：
     * - 可在页面 frontmatter 中配置（如 `contentMarginTop: "60px"`）
     * - 最终值将被注入为 CSS 变量，用于调整布局留白，请使用合法的 CSS 单位（如 `px`、`vh`、`rem` 等）
     * - 若设为 `false`，则内容区域将紧贴顶部容器
     * 
     * @example
     * 示例 1：响应式配置
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       page: {
     *         contentMarginTop: {
     *           mobile: "1rem",
     *           tablet: "1.5rem",
     *           desktop: "2rem"
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例 2：统一边距配置
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       page: {
     *         contentMarginTop: "2rem"
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link DeviceSpecificInput}
     * @see {@link NormalizedDeviceSpecificInput}
     */
    contentMarginTop?: DeviceSpecificInput;

    /**
     * 内容区域两侧间隔宽度配置（page布局）
     * @optional
     * @default { mobile: "1.5rem", tablet: "1.5rem", desktop: "4rem" }
     * 
     * @remarks
     * 此项用于控制 `page` 布局下内容区域左右间隔，支持以下配置方式：
     * 
     * 1. **统一值模式** - 直接使用 CSS 宽度值（如 `"2rem"`）
     * 2. **设备响应模式** - 分设备配置移动端 / 平板 / 桌面端宽度
     * 3. **禁用模式** - 使用 `false` 取消两侧间隔
     * 
     * 输入值将被标准化为 {@link NormalizedDeviceSpecificInput} 格式参与合并。
     * 
     * 注意事项：
     * - 可在页面 frontmatter 中配置（如 `contentPadding: "4rem"`）
     * - 实际用于设置布局 grid 的左右 `minmax(min(value, 100%), 1fr)` 值
     * - 在桌面端（>1024px）下，若存在侧边栏控制器，会在此基础上增加 48px 用于视觉对称
     * - 若设为 `false`，两侧间隔将为 0
     * 
     * @example
     * 示例 1：响应式配置
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       page: {
     *         contentPadding: {
     *           mobile: "1rem",
     *           tablet: "2rem",
     *           desktop: "4rem"
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例 2：统一值配置
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       page: {
     *         contentPadding: "2rem"
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link DeviceSpecificInput}
     * @see {@link NormalizedDeviceSpecificInput}
     */
    contentPadding?: DeviceSpecificInput;

    /**
     * 内容最大宽度配置（page布局）
     * @optional
     * @default "760px"
     * 
     * @remarks
     * 此项用于控制 `page` 布局下内容区域的最大宽度，支持以下配置方式：
     * 
     * 1. **统一值模式** - 直接使用 CSS 宽度值（如 `"60rem"`）
     * 2. **设备响应模式** - 分设备配置移动端 / 平板 / 桌面端宽度
     * 3. **禁用模式** - 使用 `false` 使内容宽度自适应容器宽度
     * 
     * 输入值将被标准化为 {@link NormalizedDeviceSpecificInput} 格式参与合并。
     * 
     * 注意事项：
     * - 可在页面 frontmatter 中配置（如 `contentMaxWidth: "960px"`）
     * - 实际用于设置布局 grid 的中间列宽度，逻辑为 `minmax(min(2 * padding, 100%), maxWidth)`
     * - 若设为 `false`，将取消最大宽度限制，内容宽度为 100%
     * 
     * @example
     * 示例 1：响应式配置
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       page: {
     *         contentMaxWidth: {
     *           mobile: "400px",
     *           tablet: "540px",
     *           desktop: "680px"
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例 2：统一宽度配置
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       page: {
     *         contentMaxWidth: "48rem"
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link contentPadding} 页面左右间距配置
     * @see {@link DeviceSpecificInput}
     * @see {@link NormalizedDeviceSpecificInput}
     */
    contentMaxWidth?: DeviceSpecificInput;

    /**
     * 页面布局底部信息配置
     * @optional
     *
     * @remarks
     * 用于配置一般页面（page 布局）底部的消息和版权信息。
     *
     * 配置规则：
     * - `false` → 禁用底部信息
     * - 对象形式：
     *   - `message?: string | false` → 底部消息（支持 HTML）
     *   - `copyright?: string | false` → 版权信息（支持 HTML）
     *
     * 注意事项：
     * - 页面 frontmatter 会覆盖此配置
     * - 此布局级配置是所有 page 页面默认值
     *
     * @example
     * 配置 page 布局默认底部信息
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       page: {
     *         footer: {
     *           message: "由 <b>团队 C</b> 维护",
     *           copyright: "© 2025 MyProject"
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     *
     * @example
     * 禁用 page 页面底部信息
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       page: {
     *         footer: false
     *       }
     *     }
     *   }
     * }
     * ```
     */
    footer: FooterInput;
}