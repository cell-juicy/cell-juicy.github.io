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
    ImageData
} from "./common";


/**
 * blog布局的全局配置接口
 *
 * @remarks
 * 此接口定义了blog布局的所有可配置项，包括侧边栏，顶部栏，封面，内容区域等内容。
 * 
 * 通过此配置，可以实现以下功能：
 * 
 * - 自定义侧边栏标签页内容，调整标签页顺序，取消默认标签页等。
 * - 自定义顶部栏标题文本，图标，配置默认的GitHub，PDF，markdown按钮信息，添加自定义的工具按钮。
 * - 自定义封面图，配置封面图高度，描述文本，添加自定义的css效果。
 * - 自定义内容区域的边距，内边距，最大宽度等。
 *
 * 可配置的全部属性如下：
 *
 * 1. **侧边栏配置**  
 * @see {@link VPJBlogLayoutConfig.asideTabs} 标签页配置
 * 
 * 2. **顶部栏配置**  
 * @see {@link VPJBlogLayoutConfig.headerTitleTemplate} 标题模板  
 * @see {@link VPJBlogLayoutConfig.headerIcon} 图标配置  
 * @see {@link VPJBlogLayoutConfig.github} GitHub按钮  
 * @see {@link VPJBlogLayoutConfig.md} Markdown下载  
 * @see {@link VPJBlogLayoutConfig.pdf} PDF下载  
 * @see {@link VPJBlogLayoutConfig.toolbar} 自定义工具按钮
 * 
 * 3. **封面配置**  
 * @see {@link VPJBlogLayoutConfig.cover} 封面图路径  
 * @see {@link VPJBlogLayoutConfig.coverAlt} 描述文本  
 * @see {@link VPJBlogLayoutConfig.coverHeight} 高度配置  
 * @see {@link VPJBlogLayoutConfig.coverFade} 渐变过渡  
 * @see {@link VPJBlogLayoutConfig.coverCss} CSS样式
 * 
 * 4. **内容区配置**  
 * @see {@link VPJBlogLayoutConfig.contentMarginTop} 顶部边距  
 * @see {@link VPJBlogLayoutConfig.contentMarginBottom} 底部边距  
 * @see {@link VPJBlogLayoutConfig.contentPadding} 内边距  
 * @see {@link VPJBlogLayoutConfig.contentMaxWidth} 最大宽度
 * 
 * @example
 * 示例1：配置封面和侧边栏
 * ```ts
 * // config.mjs
 * export default {
 *   themeConfig: {
 *     layouts: {
 *       blog: {
 *         asideTabs: { toc: "CustomToc" },
 *         cover: "/cover.jpg",
 *         coverCss: { filter: "blur(2px)" }
 *       }
 *     }
 *   }
 * }
 * ```
 */
export interface VPJBlogLayoutConfig {
    /**
     * 博客页面标题模板
     * @optional
     * 
     * @remarks
     * 该项用于配置所有 `blog` 布局页面在 `<head>` 中渲染的 `<title>` 元素，
     * 可设置统一的标题格式或基于上下文动态生成标题。
     * 
     * 支持以下三种模式：
     * 
     * 1. **字符串模板** - 使用 `:series`、`:title`、`:order` 等占位符
     * 2. **函数模板** - 基于 {@link PageContext} 提供的上下文动态生成标题
     * 3. **禁用模式（false）** - 跳过模板计算，直接使用上下文中的标题
     * 
     * 此项仅用于标签页标题，不影响页面正文标题或内容渲染。
     * 
     * 注意事项：
     * - 优先级低于 `themeConfig.blog.series` 和页面 frontmatter 中的 `titleTemplate`
     * - 返回字符串将作为最终 `<title>` 使用；返回 `false` 则直接使用上下文标题
     * - 函数返回值必须是字符串，否则将被视为无效输入
     * - 字符串模板支持以下占位符：
     *   - `:series`：当前页面所属系列
     *   - `:title`：页面主标题
     *   - `:order`：系列排序编号
     * 
     * @example
     * 示例 1：统一添加前缀
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         titleTemplate: "[博客] :series - :title"
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
     *       blog: {
     *         titleTemplate: (ctx) =>
     *           ctx.layoutConfig.series === "随笔"
     *             ? `随笔集 · ${ctx.layoutConfig.title}`
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
    titleTemplate?: HeaderTitleTemplateInput;

    /**
     * 博客页面默认图标
     * @optional
     * 
     * @remarks
     * 该项用于配置所有 `blog` 布局页面在 `<head>` 中显示的图标，
     * 将被注入为 `<link rel="icon">`，用于控制浏览器标签页的图标显示。
     * 
     * 支持传入字符串路径，或对象形式包含图标描述信息。
     * 
     * 注意事项：
     * - 页面 frontmatter 中的 `favicon` 优先级更高
     * - 若系列也未设置，将使用 `themeConfig.logo` 作为兜底图标
     * 
     * @example
     * 示例 1：为所有博客页面设置统一图标
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         favicon: "/images/blog-icon.svg"
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
     *       blog: {
     *         favicon: {
     *           src: "/images/blog-icon.svg",
     *           alt: "博客徽标"
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
     * 博客页面默认描述
     * @optional
     * 
     * @remarks
     * 该项用于配置所有 `blog` 布局页面的默认页面描述，
     * 将被注入为 `<meta name="description">`，部分搜索引擎或社交平台会将其作为摘要展示。
     * 
     * 注意事项：
     * - 页面 frontmatter 中的 `description` 优先级更高
     * - 若系列也未提供，将使用 `site.description` 作为最终兜底
     * 
     * @example
     * 示例 1：为所有博客页面提供统一摘要
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         description: "这是我的个人博客，记录技术、生活与思考。"
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
     *   series: { name: "系列", component: "VPJBlogAsideSeriesPage", order: 0 },
     *   tags: { name: "标签", component: "VPJBlogAsideTagsPage", order: 0 }
     * }
     * 
     * @remarks
     * 此项用于配置blog布局侧边栏显示的标签页内容，支持以下配置方式：
     * 
     * 1. **快捷模式** - 直接使用组件名称字符串替换默认标签页
     * 2. **对象模式** - 通过配置对象指定标签页名称、组件和显示顺序
     * 3. **禁用模式** - 使用`false`完全禁用特定标签页
     * 
     * 具体的支持类型请参考 {@link AsideTabInput} ，输入对象的每一个键上的值都会被标准化为 {@link NormalizedAsideTabInput} 的格式后参与合并。
     * 
     * 注意事项：
     * 
     * - 此项允许在frontmatter中配置，并且拥有合并最高优先级。
     * - 只有合并后component属性为字符串的标签页才会被渲染到侧边栏中，否则它们会被视为无效数据在合并后被滤去。
     * - 合并后不包含name属性的标签页数据会将component属性的值默认赋予给name属性。
     * - 合并后不包含order属性的标签页数据会将其默认值设置为0，order越小则在侧边栏标签栏中位序越靠前，（NaN的输入会被转变为0）。
     * - 如果你希望修改默认标签页的数据，你可以通过此项为tags属性或series属性赋值合法的输入来覆盖，例如tags: {order: 1}的输入将会覆盖tags页默认的order: 0。
     * - "VPJBlogAsideSeriesPage"与"VPJBlogAsideTagsPage"是默认的组件名称，即使你已经在全局注册了组件也会被内置的标签页组件覆盖。
     * 
     * @example
     * 示例1：替换默认目录组件
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         asideTabs: {
     *           toc: "CustomToc" // 组件需全局注册
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
     *       blog: {
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
     * @default ":series"
     * 
     * @remarks
     * 此项用于定义顶部栏标题的显示格式，支持以下配置方式：
     * 
     * 1. **字符串模板** - 使用`:series`、`:title`等占位符
     * 2. **函数模式** - 基于 {@link PageContext} 动态生成标题
     * 3. **禁用模式** - 使用`false`隐藏标题
     * 
     * 输入数据将被标准化为标题字符串或`false`后参与合并并注入到组件中。
     * 
     * 注意事项：
     * 
     * - 此项允许在frontmatter中直接配置模板字符串。
     * - 函数模式下返回值需为字符串或`false`，其他类型将被视为无效输入转为undefined参与合并。
     * - 合并结果为false时，标题将被隐藏。
     * - 在blog布局下，PageContext的layoutConfig对象包含当前页面的系列、标题、位序、标签列表与layout: blog。
     * - 通过字符串输入的情况，支持的占位符包括：
     *   - ":series" : 当前文章所属系列。
     *   - ":title" : 当前文章标题，选取原则为页面的第一个h1元素内容文本。
     *   - ":order" : 当前文章在系列中的位序。
     * 
     * @example
     * 示例1：添加国际化前缀
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         headerTitleTemplate: "[系列] :series - :title"
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：条件式标题
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         headerTitleTemplate: (ctx) => 
     *           ctx.layoutConfig.series === "tutorial"
     *             ? `教学：${ctx.layoutConfig.title}` 
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
     * 1. **快捷模式** - 使用全局注册的组件名称或者图片url字符串（只有扩展名为png|jpeg|jpg|gif|webp|svg的字符串被视为url输入）
     * 2. **对象模式** - 通过{ component: "CustomIcon" }指定已全局注册的组件
     * 3. **禁用模式** - 使用`false`隐藏图标
     * 
     * 输入数据将被直接用于参与合并，若合并结果为`false`，则会被视为`undefined`取消图标设置。
     * 
     * 注意事项：
     * 
     * - 此项允许在frontmatter中直接配置组件名称
     * - 内置图标组件拥有最高优先级，无法被全局注册的同名组件覆盖
     * - 组件必须接受`class`和`style`属性以实现主题样式继承
     * 
     * @example
     * 示例1：使用图片作为图标
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         headerIcon: "/path/to/icon.png"
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：使用组件作为图标
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         headerIcon: { component: "CustomDocumentIcon" }
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
     * 此项用于配置顶部栏GitHub仓库链接按钮，支持以下配置方式：
     * 
     * 1. **快捷模式** - 直接使用仓库URL字符串
     * 2. **对象模式** - 配置URL和提示文本细节
     * 3. **禁用模式** - 使用`false`隐藏按钮
     * 4. **动态函数** - 基于 {@link PageContext} 生成配置
     * 
     * 具体支持输入类型参考 {@link ToolbarGithubLinkInput} ，输入数据将被标准化为 {@link NormalizedToolbarGithubLinkInput} 格式参与合并。
     * 
     * 注意事项：
     * 
     * - 此项允许在frontmatter中动态配置（如根据文章显示不同仓库）
     * - 合并结果为`false`的属性会被处理为`undefined`，当url为`undefined`时会隐藏GitHub按钮
     * - 动态函数模式下返回值需符合 {@link NormalizedToolbarGithubLinkInput} 格式才会参与合并，非合法返回值将转为`undefined`取消参与合并
     * - 提示文本（tooltip）会显示在按钮下方
     * 
     * @example
     * 示例1：动态仓库配置
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         github: (ctx) => ({
     *           url: `https://github.com/my-repositories/blog/${ctx.layoutConfig.series}/${ctx.layoutConfig.title}.md`,
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
     *       blog: {
     *         github: {
     *           url: "https://github.com/xxx",
     *           tooltip: "查看项目源码"
     *         }
     *       }
     *     }
     *   }
     * }
     * 
     * ```
     * 
     * @see {@link ToolbarGithubLinkInput} Github链接配置类型
     * @see {@link NormalizedToolbarGithubLinkInput} Github链接标准化类型
     */
    github?: ToolbarGithubLinkInput;
    
    /**
     * Markdown下载按钮配置
     * @optional
     * @default { tooltip: "以markdown格式下载", download: true }
     * 
     * @remarks
     * 此项用于配置头部栏中Markdown文件下载按钮的行为，支持以下配置方式：
     * 
     * 1. **快捷模式** - 直接指定文件路径字符串
     * 2. **对象模式** - 配置下载链接、打开方式等细节
     * 3. **禁用模式** - 使用`false`隐藏按钮
     * 4. **动态函数** - 基于 {@link PageContext} 生成配置
     * 
     * 具体支持输入类型参考 {@link ToolbarDownloadInput} ，输入数据将被标准化为 {@link NormalizedToolbarDownloadInput} 格式参与合并，如果合并结果的url属性值为 `undefined` ，那么此按钮不显示。
     * 
     * 注意事项：
     * 
     * - 此项允许在frontmatter中快速配置
     * - 合并结果对象中设置为 `false` 的属性会被最终处理为 `undefined`。
     * - 对download属性，如果设置为 `false` , 那么渲染出来的按钮不会携带download属性；如果设置为 `true` , 那么渲染出来的按钮会携带download属性，且下载的文件名为url属性的值；如果设置为字符串，那么按钮会被渲染为形如<a ... download="input">...</a>的形式。
     * - 同github按钮一样，markdown按钮的提示条会显示在按钮的下方。
     * 
     * @example
     * 示例1：自定义下载文件名
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         md: {
     *           url: "/posts/hello.md",
     *           download: "getting-started.md"
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
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         md: {
     *           url: "/posts/hello.md",
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
     * PDF下载按钮配置
     * @optional
     * @default { tooltip: "以pdf格式下载", download: true }
     * 
     * @remarks
     * 此项用于配置PDF文件下载按钮的行为，支持以下配置方式：
     * 
     * 1. **快捷模式** - 直接指定文件路径字符串
     * 2. **对象模式** - 配置下载链接、提示文本等细节
     * 3. **禁用模式** - 使用`false`隐藏按钮
     * 4. **动态函数** - 基于 {@link PageContext} 生成配置
     * 
     * 具体支持输入类型参考 {@link ToolbarDownloadInput} ，输入数据将被标准化为 {@link NormalizedToolbarDownloadInput} 格式参与合并。
     * 
     * 注意事项：
     * 
     * - 此项允许在frontmatter中快速配置
     * - 合并结果对象中设置为 `false` 的属性会被最终处理为 `undefined`。
     * - 对download属性，如果设置为 `false` , 那么渲染出来的按钮不会携带download属性；如果设置为 `true` , 那么渲染出来的按钮会携带download属性，且下载的文件名为url属性的值；如果设置为字符串，那么按钮会被渲染为形如<a ... download="input">...</a>的形式。
     * - 同github按钮一样，pdf按钮的提示条会显示在按钮的下方。
     * 
     * @example
     * 示例1：自定义提示文本
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         pdf: {
     *           url: "/manual.pdf",
     *           tooltip: "下载用户手册"
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：新窗口预览pdf文件
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         pdf: {
     *           url: "/tutorial.pdf",
     *           tooltip: "预览教程",
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
     * 3. **禁用模式** - 使用`false`隐藏特定按钮
     * 
     * 具体的支持类型请参考 {@link ToolbarButtonInput} ，输入对象的每一个键上的值都会被标准化为 {@link NormalizedToolbarButtonInput} 的格式后参与合并。
     * 
     * 注意事项：
     * 
     * - 此项允许在frontmatter中配置按钮数据
     * - 合并后icon属性为undefined/false或callback属性不是一个函数的按钮数据会被视为无效数据在合并后被滤去。
     * - 合并后不包含order属性的标签页数据会将其默认值设置为0，order越小则在侧边栏标签栏中位序越靠前，（NaN的输入会被转变为0）。
     * - 工具栏按钮会出现在github/pdf/md按钮的右侧，如果你同时配置了此项与github/pdf/md按钮，那么在它们之间会有一个分割线隔断。
     * - 同github按钮一样，工具栏按钮的提示条会显示在按钮的下方。
     * 
     * @example
     * 示例1：添加一个打印按钮
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
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
     * 2. **禁用模式** - 使用`false`隐藏封面图
     * 
     * 注意事项：
     * 
     * - 此项允许在frontmatter中快速配置图片路径
     * - 设为`false`时会被最终处理为`undefined`参与合并，合并结果为`false`时，封面图将被隐藏。
     * - 封面图固定出现在内容区上方的区域，并且此数据在其它主题内置组件/组合式函数中也会被使用，例如侧边栏的系列页组件与useBlogData。
     * 
     * @example
     * 示例1：为所有blog页面设置默认的封面图
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         cover: "/images/blog-cover.jpg"
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
     * 此项用于设置封面图的alt文本，支持以下配置方式：
     * 
     * 1. **文本模式** - 直接使用描述字符串
     * 2. **禁用模式** - 使用`false`隐藏alt文本
     * 
     * 注意事项：
     * 
     * - 此项允许在frontmatter中直接配置描述文本
     * 
     * @example
     * 示例1：设置描述
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         coverAlt: "Vue.js 3.0 核心技术解析封面图"
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
     * @default "240px"
     * 
     * @remarks
     * 此项用于控制封面图的高度显示，支持以下配置方式：
     * 
     * 1. **统一值模式** - 直接使用CSS高度值（如"300px"）
     * 2. **设备响应模式** - 分设备配置移动端/平板/桌面端高度
     * 3. **禁用模式** - 使用`false`隐藏封面图
     * 
     * 输入数据将被标准化为 {@link NormalizedDeviceSpecificInput} 格式参与合并。
     * 
     * 注意事项：
     * 
     * - 此项可在frontmatter中快速配置（如`coverHeight: "180px"`）。
     * - 填入内容将作为css变量直接设置为封面图片的高度，因此需符合CSS规范（推荐使用`px`/`vh`/`rem`）。
     * - 设为`false`时会将封面图高度设置为0（也即不可见），但是这并不意味着cover的设置不再有意义，例如cover仍然会参与侧边栏默认的series页组件的渲染。
     * 
     * @example
     * 示例1：移动端差异化配置
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         coverHeight: {
     *           mobile: "150px",
     *           desktop: "300px"
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：全设备统一高度
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         coverHeight: "50vh" // 视口高度的50%
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
     * 1. **数值模式** - 通过0-1之间的数值设置过渡区域高度比例
     * 2. **字符串模式** - 在合并时通过Number转变为0-1之间的数值，这一项一般只推荐在frontmatter配置中使用，在config.mjs中使用时请直接使用数值模式
     * 3. **禁用模式** - 使用`false`关闭过渡效果
     * 
     * 注意事项：
     * 
     * - 此项允许在frontmatter中快速配置过渡效果。
     * - 此项的配置值num会被转变为`linear-gradient(to top, transparent 0%, black ${num * 100}%, black)`添加到图片元素css的mask-image属性上。
     * - 设为`false`时会被最终处理为`undefined`参与合并，合并结果为`undefined`时不会添加过渡效果。
     * - 如果coverCss的合并结果中设置了maskImage属性，那么此项的配置会被覆盖。
     * 
     * @example
     * 示例1：添加渐变过渡
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         coverFade: 0.5 // 50%高度的区域渐变过渡
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link VPJBlogLayoutConfig.coverCss} 封面css配置
     */
    coverFade?:
        | false
        | string
        | number;
    
    /**
     * 封面图CSS样式配置
     * @optional
     * @default { objectFit: "cover", objectPosition: "center center" }
     * 
     * @remarks
     * 此项用于深度定制封面图样式，支持以下CSS属性：
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
     * - 此项允许在frontmatter中快速配置样式。
     * - 通过配置此项中的maskImage属性，你可以覆盖coverFade的配置。
     * - 合并结果中设置为`false`的属性会被最终处理为`undefined`。
     * - 虽然此项允许你自定义封面图的样式，但是在部分内部组件中，此项配置并不会被保留去应用，例如侧边栏的系列页组件中文章列表项的封面图预览只会应用`{ objectFit: "cover", objectPosition: "center center" }`的样式。
     * 
     * @example
     * 示例1：添加悬浮效果
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         coverCss: {
     *           boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
     *           transition: "transform 0.3s ease"
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：重置默认样式
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         coverCss: {
     *           objectFit: false,  // 移除默认cover设置
     *           filter: "grayscale(50%)"
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link VPJBlogLayoutConfig.coverFade} 渐变过渡配置
     * @see {@link CoverCssConfigInput} 可配置属性列表
     */
    coverCss?: CoverCssConfigInput;
    
    /**
     * 内容区域底部边距配置
     * @optional
     * @default "1.5rem"
     * 
     * @remarks
     * 此项用于控制内容区域底部预留宽度，支持以下配置方式：
     * 
     * 1. **统一值模式** - 直接使用CSS高度值（如"2rem"）
     * 2. **设备响应模式** - 分设备配置移动端/平板/桌面端高度
     * 3. **禁用模式** - 使用`false`取消底部边距
     * 
     * 输入数据将被标准化为 {@link NormalizedDeviceSpecificInput} 格式参与合并。
     * 
     * 注意事项：
     * 
     * - 此项可在frontmatter中快速配置（如`contentMarginBottom: "60px"`）。
     * - 填入内容将作为css变量直接设置为封面图片的高度，因此需符合CSS规范（推荐使用`px`/`vh`/`rem`）。
     * - 设为`false`时会将底部边距回退到0。
     * 
     * @example
     * 示例1：移动端差异化配置
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
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
     * 示例2：全设备统一高度
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         contentMarginBottom: "1rem" // 1rem的底部边距
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link DeviceSpecificInput} 设备响应式输入类型
     * @see {@link NormalizedDeviceSpecificInput} 设备响应式标准化类型
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
     * 1. **统一值模式** - 直接使用CSS高度值（如"2rem"）
     * 2. **设备响应模式** - 分设备配置移动端/平板/桌面端高度
     * 3. **禁用模式** - 使用`false`取消底部边距
     * 
     * 输入数据将被标准化为 {@link NormalizedDeviceSpecificInput} 格式参与合并。
     * 
     * 注意事项：
     * 
     * - 此项可在frontmatter中快速配置（如`contentMarginTop: "60px"`）。
     * - 填入内容将作为css变量直接设置为封面图片的高度，因此需符合CSS规范（推荐使用`px`/`vh`/`rem`）。
     * - 设为`false`时会将顶部边距回退到0。
     * 
     * @example
     * 示例1：移动端差异化配置
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
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
     * 示例2：全设备统一高度
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         contentMarginTop: "1rem" // 1rem的固定顶部边距
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
     * page布局的两侧间隔宽度配置
     * @optional
     * @default {mobile: "1.5rem", tablet: "1.5rem", desktop: "4rem"}
     * 
     * @remarks
     * 此项用于控制内容区域两侧间隔宽度，支持以下配置方式：
     * 
     * 1. **统一值模式** - 直接使用CSS宽度值（如"2rem"）。
     * 2. **设备响应模式** - 分设备配置移动端/平板/桌面端高度。
     * 3. **禁用模式** - 使用`false`取消底部边距。
     * 
     * 输入数据将被标准化为 {@link NormalizedDeviceSpecificInput} 格式参与合并。
     * 
     * 注意事项：
     * 
     * - 此项可在frontmatter中快速配置（如`contentPadding: "4rem"`）。
     * - 此项实际为设置内容区域grid布局左右两侧宽度，根据输入值input将宽度调整为`minmax(min(input, 100%), 1fr)`。
     * - 设为`false`时会将两侧间隔宽度回退到0。
     * - 在桌面端（宽度大于1024px的屏幕）下，由于侧边栏控制组件的占位，因此出于对称布局的考虑实际间隔宽度会在grid布局的基础上增加48px。
     * 
     * @example
     * 示例1：移动端差异化配置
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         contentPadding: {
     *           mobile: "2rem",
     *           tablet: "2.5rem",
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：全设备统一高度
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         contentPadding: "2rem" // 2rem的固定间隔宽度
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
     * blog布局内容最大宽度配置
     * @optional
     * @default "760px"
     * 
     * @remarks
     * 此项用于控制内容最大宽度，支持以下配置方式：
     * 
     * 1. **统一值模式** - 直接使用CSS宽度值（如"60rem"）。
     * 2. **设备响应模式** - 分设备配置移动端/平板/桌面端高度。
     * 3. **禁用模式** - 使用`false`取消底部边距。
     * 
     * 输入数据将被标准化为 {@link NormalizedDeviceSpecificInput} 格式参与合并。
     * 
     * 注意事项：
     * 
     * - 此项可在frontmatter中快速配置（如`contentPadding: "4rem"`）。
     * - 此项实际为设置内容区域grid布局中间列的宽度，根据输入值input将宽度调整为`minmax(min(2 * padding, 100%), input)`，其中padding是contentPadding的值，参考 {@link VPJBlogLayoutConfig.contentPadding} 。
     * - 设为`false`时会将最大宽度回退到100%。
     * 
     * @example
     * 示例1：移动端差异化配置
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
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
     * 示例2：全设备统一高度
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         contentMaxWidth: "48rem" // 2rem的固定间隔宽度
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link VPJBlogLayoutConfig.contentPadding} 内容区域两侧间隔宽度配置
     * @see {@link DeviceSpecificInput} 设备响应式输入类型
     * @see {@link NormalizedDeviceSpecificInput} 设备响应式标准化类型
     */
    contentMaxWidth?: DeviceSpecificInput;
}