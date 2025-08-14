import {
    DeviceSpecificInput,
    NormalizedDeviceSpecificInput,
    CoverCssConfigInput,
    ToolbarGithubLinkInput,
    NormalizedToolbarGithubLinkInput,
    ToolbarDownloadInput,
    NormalizedToolbarDownloadInput,
    AsideTabInput,
    NormalizedAsideTabInput,
    HeaderTitleTemplateInput,
    ToolbarButtonInput,
    NormalizedToolbarButtonInput,
    PageContext,
    TitleTemplateInput,
    EditLinkInput,
    FooterInput
} from "./common";


/**
 * doc布局的全局配置接口
 *
 * @remarks
 * 此接口定义了doc布局的所有可配置项，包括侧边栏，顶部栏，封面，内容区域等内容。
 * 
 * 通过此配置，可以实现以下功能：
 * 
 * - 自定义侧边栏标签页内容，调整标签页顺序，取消默认标签页等。
 * - 自定义顶部栏标题文本，图标，配置默认的GitHub，PDF，Markdown按钮信息，添加自定义的工具按钮。
 * - 自定义封面图，配置封面图高度，描述文本，添加自定义的CSS样式。
 * - 自定义内容区域的边距，内边距，最大宽度等。
 * - 自定义页面的元信息。
 *
 * 可配置的全部属性如下：
 *
 * 1. **侧边栏配置**  
 * @see {@link VPJDocLayoutConfig.asideTabs} 标签页配置
 * 
 * 2. **顶部栏配置**  
 * @see {@link VPJDocLayoutConfig.headerTitleTemplate} 标题模板  
 * @see {@link VPJDocLayoutConfig.headerIcon} 图标配置  
 * @see {@link VPJDocLayoutConfig.github} GitHub按钮  
 * @see {@link VPJDocLayoutConfig.md} Markdown下载  
 * @see {@link VPJDocLayoutConfig.pdf} PDF下载  
 * @see {@link VPJDocLayoutConfig.toolbar} 自定义工具按钮
 * 
 * 3. **封面配置**  
 * @see {@link VPJDocLayoutConfig.cover} 封面图路径  
 * @see {@link VPJDocLayoutConfig.coverAlt} 描述文本  
 * @see {@link VPJDocLayoutConfig.coverHeight} 高度配置  
 * @see {@link VPJDocLayoutConfig.coverFade} 渐变过渡  
 * @see {@link VPJDocLayoutConfig.coverCss} CSS样式
 * 
 * 4. **内容区配置**  
 * @see {@link VPJDocLayoutConfig.contentMarginTop} 顶部边距  
 * @see {@link VPJDocLayoutConfig.contentMarginBottom} 底部边距  
 * @see {@link VPJDocLayoutConfig.contentPadding} 内边距  
 * @see {@link VPJDocLayoutConfig.contentMaxWidth} 最大宽度
 * 
 * 5. **元信息配置**
 * 
 * @see {@link VPJDocLayoutConfig.titleTemplate} 标题模板
 * @see {@link VPJDocLayoutConfig.favicon} 导航栏图标
 * @see {@link VPJDocLayoutConfig.description} 描述
 * 
 * @example
 * 示例1：配置封面和侧边栏
 * ```ts
 * // config.mjs
 * export default {
 *   themeConfig: {
 *     layouts: {
 *       doc: {
 *         asideTabs: {
 *           tree: { name: "目录", component: "VPJDocAsideTreePage" },
 *           resources: { name: "资源", component: "VPJDocAsideResourcesPage" }
 *         },
 *         cover: "/cover.jpg",
 *         coverCss: { objectFit: "contain", objectPosition: "center top" }
 *       }
 *     }
 *   }
 * }
 * ```
 */
export interface VPJDocLayoutConfig {

    /**
     * 文档页面标题模板
     * @optional
     * 
     * @remarks
     * 该项用于配置所有 `doc` 布局页面在 `<head>` 中渲染的 `<title>` 元素，
     * 可设置统一的标题格式或基于上下文动态生成标题。
     * 
     * 支持以下三种模式：
     * 
     * 1. **字符串模板** - 使用 `:space`、`:title`、`:order` 等占位符
     * 2. **函数模板** - 基于 {@link PageContext} 提供的上下文动态生成标题
     * 3. **禁用模式（false）** - 跳过模板计算，直接使用上下文中的标题
     * 
     * 此项仅用于标签页标题，不影响页面正文标题或内容渲染。
     * 
     * 注意事项：
     * - 优先级低于 `themeConfig.doc.space` 和页面 frontmatter 中的 `titleTemplate`
     * - 返回字符串将作为最终 `<title>` 使用；返回 `false` 则直接使用上下文标题
     * - 函数返回值必须是字符串，否则将被视为无效输入
     * - 字符串模板支持以下占位符：
     *   - `:space`：当前页面所属空间
     *   - `:title`：页面主标题
     *   - `:order`：树目录结构中的位置标识（如 '1.2.3'）
     * 
     * @example
     * 示例 1：统一添加前缀
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         titleTemplate: "[文档] :space · :title"
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例 2：动态判断标题结构
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         titleTemplate: (ctx) =>
     *           ctx.layoutConfig.space === "指南"
     *             ? `${ctx.layoutConfig.title} · 使用指南`
     *             : false
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link PageContext}
     * @see {@link HeaderTitleTemplateInput}
     */
    titleTemplate?: TitleTemplateInput;

    /**
     * 文档页面默认图标
     * @optional
     * 
     * @remarks
     * 该项用于配置所有 `doc` 布局页面在 `<head>` 中显示的图标，
     * 将被注入为 `<link rel="icon">`，用于控制浏览器标签页的图标显示。
     * 
     * 支持传入字符串路径，或对象形式包含图标描述信息。
     * 
     * 注意事项：
     * - 页面 frontmatter 中的 `favicon` 优先级更高
     * - 若空间也未设置，将使用 `themeConfig.logo` 作为兜底图标
     * 
     * @example
     * 示例 1：为所有文档页面设置统一图标
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         favicon: "/images/doc-icon.svg"
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例 2：提供图标及其说明文本
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         favicon: {
     *           src: "/images/doc-icon-dark.svg",
     *           alt: "文档空间徽标",
     *           media: "(prefers-color-scheme: dark)"
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
     * 文档页面默认描述
     * @optional
     * 
     * @remarks
     * 该项用于配置所有 `doc` 布局页面的默认页面描述，
     * 将被注入为 `<meta name="description">`，部分搜索引擎或社交平台会将其作为摘要展示。
     * 
     * 注意事项：
     * - 页面 frontmatter 中的 `description` 优先级更高
     * - 若空间也未提供，将使用 `site.description` 作为最终兜底
     * 
     * @example
     * 示例：为技术文档空间设置统一摘要
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         description: "技术文档空间提供完整的API参考和使用指南"
     *       }
     *     }
     *   }
     * }
     * ```
     */
    description?: string;

    /**
     * 侧边栏标签页配置
     * @optional
     * @default {
     *   tree: { name: "目录", component: "VPJDocAsideTreePage", order: 0 },
     *   resources: { name: "资源", component: "VPJDocAsideResourcesPage", order: 0 },
     *   outline: { name: "大纲", component: "VPJArticleAsideOutlinePage", order: 0 },
     * }
     * 
     * @remarks
     * 此项用于配置 doc 布局中侧边栏显示的标签页内容，支持以下配置方式：
     * 
     * 1. **快捷模式** - 直接使用组件名称字符串替换默认标签页
     * 2. **对象模式** - 通过配置对象指定标签页名称、组件和显示顺序
     * 3. **禁用模式** - 使用 `false` 完全禁用特定标签页
     * 
     * 具体支持的配置类型请参考 {@link AsideTabInput}，每一个键上的值都会被标准化为 {@link NormalizedAsideTabInput} 的格式后参与合并。
     * 
     * 注意事项：
     * 
     * - 此项允许在 frontmatter 中配置，并且拥有合并最高优先级。
     * - 只有合并后 `component` 属性为字符串的标签页才会被渲染到侧边栏中，否则它们会被视为无效数据，在合并后被滤去。
     * - 合并后不包含 `name` 属性的标签页数据会将 `component` 属性的值默认赋予给 `name`。
     * - 合并后不包含 `order` 属性的标签页数据会将其默认值设置为 0，`order` 越小标签越靠前（无效数字将被转化为 0）。
     * - 如果你希望修改默认标签页的配置，可以为 `tree` 或 `resources` 属性赋值合法输入，例如 `tree: { order: 10 }` 将覆盖默认排序。
     * - `"VPJArticleAsideOutlinePage"`，`"VPJDocAsideTreePage"` 与 `"VPJDocAsideResourcesPage"` 是默认的内置组件名称，即使你已经在全局注册了组件，也会被主题内置组件覆盖。
     * 
     * @example
     * 示例1：替换默认目录组件
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         asideTabs: {
     *           tree: "CustomToc" // 组件需全局注册
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：添加自定义标签页
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         asideTabs: {
     *           author: {
     *             name: "作者信息",
     *             component: "AuthorProfile",
     *             order: 10
     *           }
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link AsideTabInput} 标签页配置细则
     * @see {@link NormalizedAsideTabInput} 标签页标准化配置
     */
    asideTabs?: Record<string, AsideTabInput>;

    /**
     * 顶部栏标题模板配置
     * @optional
     * @default ":space"
     * 
     * @remarks
     * 此项用于定义顶部栏标题的显示格式，支持以下配置方式：
     * 
     * 1. **字符串模板** - 使用 `:space`、`:title` 等占位符
     * 2. **函数模式** - 基于 {@link PageContext} 动态生成标题
     * 3. **禁用模式** - 使用 `false` 隐藏标题
     * 
     * 输入数据将被标准化为标题字符串或 `false` 后参与合并并注入到组件中。
     * 
     * 注意事项：
     * 
     * - 此项允许在 frontmatter 中直接配置模板字符串。
     * - 函数模式下返回值需为字符串或 `false`，其他类型将被视为无效输入转为 undefined。
     * - 合并结果为 false 时，标题将被隐藏。
     * - 在 doc 布局下，PageContext 的 layoutConfig 对象包含当前页面的空间名、标题、路径信息与 layout: doc。
     * - 通过字符串输入的情况，支持的占位符包括：
     *   - ":space"：当前页面所属文档空间名。
     *   - ":title"：当前页面标题，选取原则为页面第一个 h1 元素的文本。
     * 
     * @example
     * 示例1：添加国际化前缀
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         headerTitleTemplate: "[文档] :space - :title"
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：条件式标题
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         headerTitleTemplate: (ctx) =>
     *           ctx.layoutConfig.space === "guide"
     *             ? `指南：${ctx.layoutConfig.title}`
     *             : false
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link HeaderTitleTemplateInput} 模板输入类型
     * @see {@link PageContext} 页面上下文类型
     */
    headerTitleTemplate?: HeaderTitleTemplateInput;
    
    /**
     * 顶部栏图标配置
     * @optional
     * @default undefined
     * 
     * @remarks
     * 此项用于控制顶部栏标题前的图标显示，支持以下配置方式：
     * 
     * 1. **快捷模式** - 使用全局注册的组件名称或图片 URL 字符串（只有扩展名为 png/jpg/jpeg/gif/webp/svg 的字符串会被识别为 URL 输入）
     * 2. **对象模式** - 使用 `{ component: "CustomIcon" }` 形式指定已全局注册的组件
     * 3. **禁用模式** - 使用 `false` 隐藏图标
     * 
     * 输入数据将直接参与合并处理，合并结果为 `false` 的将视为 `undefined`。
     * 
     * 注意事项：
     * 
     * - 此项允许在 frontmatter 中直接配置图标组件或图片路径
     * - 内置图标组件拥有最高优先级，无法被全局注册的同名组件覆盖
     * - 图标组件需支持 `class` 与 `style` 属性以适配主题样式
     * 
     * @example
     * 示例1：使用图片作为图标
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         headerIcon: "/images/icon-doc.png"
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：使用组件作为图标
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         headerIcon: { component: "CustomDocIcon" }
     *       }
     *     }
     *   }
     * }
     * ```
     */
    headerIcon?:
        | false
        | string
        | { component: string };

    /**
     * GitHub 仓库链接配置
     * @optional
     * @default { tooltip: "在Github上查看" }
     * 
     * @remarks
     * 此项用于配置顶部栏 GitHub 仓库链接按钮，支持以下配置方式：
     * 
     * 1. **快捷模式** - 直接使用仓库 URL 字符串
     * 2. **对象模式** - 配置 URL 和提示文本细节
     * 3. **禁用模式** - 使用 `false` 隐藏按钮
     * 4. **动态函数** - 基于 {@link PageContext} 生成配置
     * 
     * 具体支持的输入类型参考 {@link ToolbarGithubLinkInput}，输入数据将被标准化为 {@link NormalizedToolbarGithubLinkInput} 格式参与合并。
     * 
     * 注意事项：
     * 
     * - 此项允许在 frontmatter 中动态配置（如根据页面配置不同仓库）
     * - 合并结果为 `false` 的属性会被处理为 `undefined`，当 URL 为 `undefined` 时会隐藏 GitHub 按钮
     * - 动态函数模式下返回值需符合 {@link NormalizedToolbarGithubLinkInput} 格式才会参与合并，非合法返回值将被忽略
     * - 提示文本（tooltip）会显示在按钮下方
     * 
     * @example
     * 示例1：动态仓库配置
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         github: (ctx) => ({
     *           url: `https://github.com/my-repositories/docs/${ctx.layoutConfig.space}/${ctx.layoutConfig.title}.md`
     *         })
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：自定义提示文本
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         github: {
     *           url: "https://github.com/example/docs",
     *           tooltip: "查看文档源码"
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link ToolbarGithubLinkInput} Github 链接配置类型
     * @see {@link NormalizedToolbarGithubLinkInput} Github 链接标准化类型
     */
    github?: ToolbarGithubLinkInput;
    
    /**
     * Markdown 下载按钮配置
     * @optional
     * @default { tooltip: "以markdown格式下载", download: true }
     * 
     * @remarks
     * 此项用于配置顶部栏中 Markdown 文件下载按钮的行为，支持以下配置方式：
     * 
     * 1. **快捷模式** - 直接指定文件路径字符串
     * 2. **对象模式** - 配置下载链接、打开方式等细节
     * 3. **禁用模式** - 使用 `false` 隐藏按钮
     * 4. **动态函数** - 基于 {@link PageContext} 生成配置
     * 
     * 具体支持输入类型参考 {@link ToolbarDownloadInput}，输入数据将被标准化为 {@link NormalizedToolbarDownloadInput} 格式参与合并。
     * 如果合并结果中的 `url` 属性为 `undefined`，此按钮将不会显示。
     * 
     * 注意事项：
     * 
     * - 此项允许在 frontmatter 中快速配置
     * - 合并结果对象中为 `false` 的属性会被视为未定义
     * - `download` 属性支持以下形式：
     *   - `false`：按钮不会携带 `download` 属性，点击会打开文件
     *   - `true`：按钮将携带 `download` 属性，文件名为 `url` 的最后部分
     *   - `string`：按钮将以指定文件名触发下载
     * - 按钮的提示条（tooltip）将显示在按钮下方
     * 
     * @example
     * 示例1：自定义下载文件名
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         md: {
     *           url: "/docs/intro.md",
     *           download: "introduction.md"
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：新窗口打开文件
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         md: {
     *           url: "/docs/intro.md",
     *           target: "_blank",
     *           download: false
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link ToolbarDownloadInput} 下载配置类型
     * @see {@link NormalizedToolbarDownloadInput} 下载配置标准化类型
     */
    md?: ToolbarDownloadInput;
    
    /**
     * PDF 下载按钮配置
     * @optional
     * @default { tooltip: "以pdf格式下载", download: true }
     * 
     * @remarks
     * 此项用于配置 PDF 文件下载按钮的行为，支持以下配置方式：
     * 
     * 1. **快捷模式** - 直接指定文件路径字符串
     * 2. **对象模式** - 配置下载链接、提示文本等细节
     * 3. **禁用模式** - 使用 `false` 隐藏按钮
     * 4. **动态函数** - 基于 {@link PageContext} 生成配置
     * 
     * 具体支持输入类型参考 {@link ToolbarDownloadInput}，输入数据将被标准化为 {@link NormalizedToolbarDownloadInput} 格式参与合并。
     * 
     * 注意事项：
     * 
     * - 此项允许在 frontmatter 中快速配置
     * - 合并结果对象中为 `false` 的属性将被视为未定义
     * - `download` 属性支持的行为同 Markdown 下载按钮一致
     * - 按钮的提示条（tooltip）将显示在按钮下方
     * 
     * @example
     * 示例1：自定义提示文本
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         pdf: {
     *           url: "/guide/manual.pdf",
     *           tooltip: "下载使用手册"
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：新窗口预览 PDF 文件
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         pdf: {
     *           url: "/guide/tutorial.pdf",
     *           tooltip: "预览教学内容",
     *           target: "_blank",
     *           download: false
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link ToolbarDownloadInput} 下载配置类型
     * @see {@link NormalizedToolbarDownloadInput} 下载配置标准化类型
     */
    pdf?: ToolbarDownloadInput;
    
    /**
     * 自定义工具按钮配置
     * @optional
     * @default {}
     * 
     * @remarks
     * 此项用于在顶部栏添加自定义工具按钮，支持以下配置方式：
     * 
     * 1. **快捷模式** - 直接指定图标组件名称
     * 2. **对象模式** - 配置图标、回调函数等完整参数
     * 3. **禁用模式** - 使用 `false` 隐藏特定按钮
     * 
     * 具体的支持类型请参考 {@link ToolbarButtonInput}，输入对象的每一个键值对将被标准化为 {@link NormalizedToolbarButtonInput} 格式参与合并。
     * 
     * 注意事项：
     * 
     * - 此项允许在 frontmatter 中配置按钮数据
     * - 合并后 `icon` 属性为 `undefined` / `false`，或 `callback` 属性不是函数的按钮数据将被忽略
     * - `order` 属性默认值为 0，数值越小在按钮栏中位置越靠前，`NaN` 输入将被转为 0
     * - 工具按钮会显示在 GitHub / PDF / Markdown 按钮的右侧，中间会有分隔线
     * - 所有工具按钮的提示条（tooltip）均显示在按钮下方
     * 
     * @example
     * 示例1：添加一个打印按钮
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         toolbar: {
     *           print: {
     *             icon: "PrinterIcon",
     *             callback: () => window.print()
     *           }
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link ToolbarButtonInput} 按钮配置类型
     * @see {@link NormalizedToolbarButtonInput} 按钮标准化类型
     */
    toolbar?: Record<string, ToolbarButtonInput>;
    
    /**
     * 封面图路径配置
     * @optional
     * @default undefined
     * 
     * @remarks
     * 此项用于指定封面图的资源路径，支持以下配置方式：
     * 
     * 1. **快捷模式** - 直接使用图片路径字符串
     * 2. **禁用模式** - 使用 `false` 隐藏封面图
     * 
     * 注意事项：
     * 
     * - 此项允许在 frontmatter 中快速配置图片路径
     * - 设置为 `false` 时会被处理为 `undefined`，合并结果为 `false` 时，封面图将被隐藏
     * - 封面图默认出现在文档内容区域上方，并且会被其他内置组件/组合式函数所使用，如文档目录页与 `useDocData`
     * 
     * @example
     * 示例1：为所有 doc 页面设置默认的封面图
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         cover: "/images/doc-cover.png"
     *       }
     *     }
     *   }
     * }
     * ```
     */
    cover?:
        | false
        | string;
    
    /**
     * 封面图描述文本
     * @optional
     * @default undefined
     * 
     * @remarks
     * 此项用于设置封面图的 alt 文本，支持以下配置方式：
     * 
     * 1. **文本模式** - 直接使用描述字符串
     * 2. **禁用模式** - 使用 `false` 隐藏 alt 文本
     * 
     * 注意事项：
     * 
     * - 此项允许在 frontmatter 中直接配置描述文本
     * 
     * @example
     * 示例1：设置封面图描述
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         coverAlt: "文档封面：深入理解 TypeScript 类型系统"
     *       }
     *     }
     *   }
     * }
     * ```
     */
    coverAlt?:
        | false
        | string;
    
    /**
     * 封面图高度配置
     * @optional
     * @default "300px"
     * 
     * @remarks
     * 此项用于控制封面图的高度显示，支持以下配置方式：
     * 
     * 1. **统一值模式** - 直接使用 CSS 高度值（如 `"300px"`）
     * 2. **设备响应模式** - 分设备配置移动端 / 平板 / 桌面端高度
     * 3. **禁用模式** - 使用 `false` 隐藏封面图
     * 
     * 输入数据将被标准化为 {@link NormalizedDeviceSpecificInput} 格式参与合并。
     * 
     * 注意事项：
     * 
     * - 此项允许在 frontmatter 中快速配置（如 `coverHeight: "180px"`）
     * - 输入值将作为 CSS 变量设置为封面高度，请确保其为合法 CSS 长度值（推荐使用 `px`、`vh`、`rem` 等单位）
     * - 设置为 `false` 时封面高度将为 `0`，但封面图本身仍可参与其他渲染逻辑，如文档系列页封面图显示
     * 
     * @example
     * 示例1：移动端与桌面端差异化配置
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         coverHeight: {
     *           mobile: "160px",
     *           desktop: "320px"
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：统一设备高度设置
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         coverHeight: "50vh"
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link DeviceSpecificInput} 设备响应式输入类型
     * @see {@link NormalizedDeviceSpecificInput} 设备响应式标准化类型
     */
    coverHeight?: DeviceSpecificInput;
    
    /**
     * 封面渐变过渡配置
     * @optional
     * @default undefined
     * 
     * @remarks
     * 此项提供了一个快捷的滤镜效果，根据填入值会为封面图添加一个底部渐变的过渡效果，支持以下配置方式：
     * 
     * 1. **数值模式** - 通过 0–1 之间的数值设置过渡区域高度比例
     * 2. **字符串模式** - 在合并时通过 Number 转换为 0–1 的数值（推荐在 frontmatter 中使用）
     * 3. **禁用模式** - 使用 `false` 关闭过渡效果
     * 
     * 注意事项：
     * 
     * - 此项允许在 frontmatter 中快速配置
     * - 输入值 `num` 会被转换为 `linear-gradient(to top, transparent 0%, black ${num * 100}%, black)` 并添加到封面图的 `mask-image` 样式属性中
     * - 设置为 `false` 时将视为 `undefined` 参与合并，最终结果为 `undefined` 时不会添加任何过渡效果
     * - 若同时设置了 `coverCss.maskImage`，则此项的配置会被覆盖
     * 
     * @example
     * 示例1：添加 50% 高度的渐变效果
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         coverFade: 0.5
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link VPJDocLayoutConfig.coverCss} 封面 CSS 样式配置
     */
    coverFade?:
        | false
        | string
        | number;
    
    /**
     * 封面图 CSS 样式配置
     * @optional
     * @default { objectFit: "cover", objectPosition: "center center" }
     * 
     * @remarks
     * 此项用于深度定制封面图样式，支持以下 CSS 属性：
     * 
     * - boxShadow: 盒子阴影
     * - filter: 滤镜效果
     * - maskImage: 遮罩图像
     * - objectFit: 图片填充方式
     * - objectPosition: 图片定位
     * - opacity: 透明度
     * - transform: 变形效果
     * - transition: 过渡动画
     * 
     * 注意事项：
     * 
     * - 此项允许在 frontmatter 中快速配置样式
     * - 设置了 `maskImage` 的值将会覆盖 `coverFade` 的渐变设置
     * - 合并结果中为 `false` 的属性将被视为 `undefined`
     * - 尽管支持自定义样式，但某些组件中（如系列封面预览）只会保留默认样式 `{ objectFit: "cover", objectPosition: "center center" }`
     * 
     * @example
     * 示例1：封面图添加浮动阴影和动画
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         coverCss: {
     *           boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
     *           transition: "transform 0.3s ease"
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：移除默认填充样式并设置滤镜
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         coverCss: {
     *           objectFit: false,
     *           filter: "blur(2px)"
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link VPJDocLayoutConfig.coverFade} 封面渐变配置
     * @see {@link CoverCssConfigInput} 可配置样式列表
     */
    coverCss?: CoverCssConfigInput;
    
    /**
     * 内容区域底部边距配置
     * @optional
     * @default "1.5rem"
     * 
     * @remarks
     * 此项用于控制文档内容区域的底部预留高度，支持以下配置方式：
     * 
     * 1. **统一值模式** - 直接使用 CSS 高度值（如 `"2rem"`）
     * 2. **设备响应模式** - 分设备设置 mobile/tablet/desktop 各自的边距
     * 3. **禁用模式** - 使用 `false` 取消边距（实际效果为 margin-bottom 为 0）
     * 
     * 输入值将被标准化为 {@link NormalizedDeviceSpecificInput} 格式参与合并。
     * 
     * 注意事项：
     * 
     * - 此项支持在 frontmatter 中直接配置
     * - 填写的值将转换为 CSS 变量用于内容区底部边距
     * - 设置为 `false` 时底部边距将为 0
     * 
     * @example
     * 示例1：设备响应式底部边距
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         contentMarginBottom: {
     *           mobile: "1rem",
     *           tablet: "2rem",
     *           desktop: "3rem"
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：全设备统一底部间距
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         contentMarginBottom: "1.5rem"
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link DeviceSpecificInput} 响应式配置输入类型
     * @see {@link NormalizedDeviceSpecificInput} 响应式配置标准化类型
     */
    contentMarginBottom?: DeviceSpecificInput;
    
    /**
     * 内容区域顶部边距配置
     * @optional
     * @default "1.5rem"
     * 
     * @remarks
     * 此项用于控制内容区域顶部预留宽度，支持以下配置方式：
     * 
     * 1. **统一值模式** - 直接使用 CSS 高度值（如 "2rem"）
     * 2. **设备响应模式** - 分设备配置移动端/平板/桌面端高度
     * 3. **禁用模式** - 使用 `false` 取消顶部边距
     * 
     * 输入数据将被标准化为 {@link NormalizedDeviceSpecificInput} 格式参与合并。
     * 
     * 注意事项：
     * 
     * - 支持在 frontmatter 中快速配置（如 `contentMarginTop: "60px"`）
     * - 填写的值将作为 CSS 变量直接设置为内容区顶部边距，需符合 CSS 规范（推荐使用 `px`/`vh`/`rem`）
     * - 设置为 `false` 时，顶部边距将回退为 0
     * 
     * @example
     * 示例1：设备响应式顶部边距
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
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
     * 示例2：统一固定顶部边距
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         contentMarginTop: "1rem"
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link DeviceSpecificInput} 设备响应式输入类型
     * @see {@link NormalizedDeviceSpecificInput} 设备响应式标准化类型
     */
    contentMarginTop?: DeviceSpecificInput;
    
    /**
     * page 布局两侧间隔宽度配置
     * @optional
     * @default { mobile: "1.5rem", tablet: "1.5rem", desktop: "4rem" }
     * 
     * @remarks
     * 此项用于控制内容区域两侧的间隔宽度，支持以下配置方式：
     * 
     * 1. **统一值模式** - 直接使用 CSS 宽度值（如 "2rem"）
     * 2. **设备响应模式** - 分设备配置移动端/平板/桌面端宽度
     * 3. **禁用模式** - 使用 `false` 取消两侧间隔
     * 
     * 输入数据将被标准化为 {@link NormalizedDeviceSpecificInput} 格式参与合并。
     * 
     * 注意事项：
     * 
     * - 支持在 frontmatter 中快速配置（如 `contentPadding: "4rem"`）
     * - 实际为设置内容区域 Grid 布局两侧列宽，宽度调整为 `minmax(min(input, 100%), 1fr)`
     * - 设置为 `false` 时两侧间隔宽度回退为 0
     * - 在桌面端（宽度 > 1024px）出于布局对称考虑，会在 grid 基础上增加 48px 间隔宽度以配合侧边栏
     * 
     * @example
     * 示例1：设备响应式两侧间隔
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         contentPadding: {
     *           mobile: "2rem",
     *           tablet: "2.5rem"
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：统一固定两侧间隔
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         contentPadding: "2rem"
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link DeviceSpecificInput} 设备响应式输入类型
     * @see {@link NormalizedDeviceSpecificInput} 设备响应式标准化类型
     */
    contentPadding?: DeviceSpecificInput;
    
    /**
     * doc 布局内容最大宽度配置
     * @optional
     * @default "820px"
     * 
     * @remarks
     * 此项用于控制内容最大宽度，支持以下配置方式：
     * 
     * 1. **统一值模式** - 直接使用 CSS 宽度值（如 "60rem"）
     * 2. **设备响应模式** - 分设备配置移动端/平板/桌面端宽度
     * 3. **禁用模式** - 使用 `false` 取消最大宽度限制（默认撑满）
     * 
     * 输入数据将被标准化为 {@link NormalizedDeviceSpecificInput} 格式参与合并。
     * 
     * 注意事项：
     * 
     * - 支持在 frontmatter 中快速配置
     * - 实际为设置内容区域 Grid 布局中间列最大宽度，宽度调整为 `minmax(min(2 * padding, 100%), input)`，其中 `padding` 来源于 {@link VPJDocLayoutConfig.contentPadding}
     * - 设为 `false` 时最大宽度退回到 100%
     * 
     * @example
     * 示例1：设备响应式最大宽度
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
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
     * 示例2：统一固定最大宽度
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         contentMaxWidth: "48rem"
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link VPJDocLayoutConfig.contentPadding} 内容两侧间隔宽度配置
     * @see {@link DeviceSpecificInput} 设备响应式输入类型
     * @see {@link NormalizedDeviceSpecificInput} 设备响应式标准化类型
     */
    contentMaxWidth?: DeviceSpecificInput;

    next?:
        | string
        | false;

    prev?:
        | string
        | false;
    
    editLink?: EditLinkInput;

    footer?: FooterInput;
}