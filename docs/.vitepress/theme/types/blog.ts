import {
    AsideTabInput,
    NormalizedAsideTabInput,
    DeviceSpecificInput,
    NormalizedDeviceSpecificInput,
    CoverCssConfigInput,
    HeaderTitleTemplateInput,
    ToolbarGithubLinkInput,
    NormalizedToolbarGithubLinkInput,
    ToolbarDownloadInput,
    NormalizedToolbarDownloadInput,
    ToolbarButtonInput,
    NormalizedToolbarButtonInput,
    PageContext
} from "./common";

import {
    VPJBlogLayoutConfig
} from "./layoutBlog"


/**
 * blog系列默认数据配置接口
 *
 * @remarks
 * 此接口定义了同系列blog页默认数据所有可配置项，包括侧边栏，顶部栏，封面配置等内容。
 * 
 * 通过此配置，可以实现以下功能：
 * 
 * - 自定义某个系列的blog页的侧边栏标签页内容，调整标签页顺序，取消默认标签页等。
 * - 自定义某个系列的blog页的顶部栏标题文本，图标，配置默认的GitHub，PDF，markdown按钮信息，添加自定义的工具按钮。
 * - 自定义某个系列的blog页的封面图，配置封面图高度，描述文本，添加自定义的css效果。
 * - 自定义某个系列的blog页的预设标签。
 *
 * 可配置的全部属性如下：
 *
 * 1. **侧边栏配置**  
 * @see {@link SeriesMetaData.asideTabs} 标签页配置
 * 
 * 2. **顶部栏配置**  
 * @see {@link SeriesMetaData.headerTitleTemplate} 标题模板  
 * @see {@link SeriesMetaData.headerIcon} 图标配置  
 * @see {@link SeriesMetaData.github} GitHub按钮  
 * @see {@link SeriesMetaData.md} Markdown下载  
 * @see {@link SeriesMetaData.pdf} PDF下载  
 * @see {@link SeriesMetaData.toolbar} 自定义工具按钮
 * 
 * 3. **封面配置**  
 * @see {@link SeriesMetaData.cover} 封面图路径  
 * @see {@link SeriesMetaData.coverAlt} 描述文本  
 * @see {@link SeriesMetaData.coverHeight} 高度配置  
 * @see {@link SeriesMetaData.coverFade} 渐变过渡  
 * @see {@link SeriesMetaData.coverCss} CSS样式
 * 
 * 4. **页面数据配置**  
 * @see {@link SeriesMetaData.presetTags} 预设标签
 * 
 * 注意事项：
 * - 通过此接口配置会根据键值来为series名称等于此键值的blog页进行配置。
 * - 通过此接口配置了某个系列后，对此系列的blog页此配置在配置合并时比起blog页通用配置（themeConfig.layouts.blog中配置的内容）拥有更高的优先级。
 * - 通过此接口配置的内容在合并中优先级仍然会低于用户在frontmatter中配置的内容，如果你希望定制某个特别页面的内容，请移步至其页面frontmatter设置相应属性。
 * 
 * @example
 * 示例1：配置系列"杂谈收录 其1"的blog页内容，以覆盖配置的通用blog页数据
 * ```ts
 * // config.mjs
 * export default {
 *   themeConfig: {
 *     layouts: {
 *       blog: {
 *         asideTabs: {
 *           tags: {name: "tag展示", order: 1},
 *         },
 *         cover: "/public/path/to/image1.png",
 *       }
 *     },
 *     blog: {
 *       series: {
 *         "杂谈收录 其1": {
 *           asideTabs: {
 *             tags: false,  // 在frontmatter设置了series: "杂谈收录 其1"的blog页面，此处配置覆盖了themeConfig.layouts.blog中的配置，在侧边栏中移除默认的tags页
 *             customTab: {
 *               name: "自定义页面",
 *               component: "CustomComponent",
 *               order: 2
 *             }
 *           },
 *           cover: "/public/path/to/image2.png",  // 在frontmatter设置了series: "杂谈收录 其1"的blog页面，此处配置覆盖了themeConfig.layouts.blog中的配置，将封面图修改为image2.png
 *           coverAlt: "Cover Image",
 *           github: "https://github.com/my-name/my-repositories2"
 *         }
 *       }
 *     }
 *   }
 * }
 * ```
 */
export interface SeriesMetaData {
    /**
     * 侧边栏标签页配置
     * @optional
     * 
     * @remarks
     * 此项用于配置对应系列所有blog页侧边栏显示的标签页内容，支持以下配置方式：
     * 
     * 1. **快捷模式** - 直接使用组件名称字符串替换默认标签页
     * 2. **对象模式** - 通过配置对象指定标签页名称、组件和显示顺序
     * 3. **禁用模式** - 使用`false`完全禁用特定标签页
     * 
     * 具体的支持类型请参考 {@link AsideTabInput} ，输入对象的每一个键上的值都会被标准化为 {@link NormalizedAsideTabInput} 的格式后参与合并。
     * 
     * 注意事项：
     * 
     * - 此项允许在frontmatter中配置，并且拥有合并最高优先级
     * - 此处的配置在主题合并配置时比起themeConfig.layouts.blog中的同名配置（参见 {@link VPJBlogLayoutConfig.asideTabs} ），但合并优先级始终低于页面frontmatter的配置
     * - 只有合并后component属性为字符串的标签页才会被渲染到侧边栏中，否则它们会被视为无效数据在合并后被滤去
     * - 合并后不包含name属性的标签页数据会将component属性的值默认赋予给name属性
     * - 合并后不包含order属性的标签页数据会将其默认值设置为0，order越小则在侧边栏标签栏中位序越靠前，（NaN的输入会被转变为0）
     * - 如果你希望修改默认标签页的数据，你可以通过此项为tags属性或series属性赋值合法的输入来覆盖，例如tags: {order: 1}的输入将会覆盖tags页默认的order: 0。
     * - "VPJBlogAsideSeriesPage"与"VPJBlogAsideTagsPage"是默认的组件名称，即使你已经在全局注册了组件也会被内置的标签页组件覆盖
     * 
     * @example
     * 示例1：替换系列"example series"的默认目录组件
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     blog: {
     *       series: {
     *         "example series": {
     *           asideTabs: {
     *             toc: "CustomToc" // 组件需全局注册
     *           }
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：为系列"example series"添加自定义标签页
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     blog: {
     *       series: {
     *         "example series": {
     *           asideTabs: {
     *             author: {
     *               name: "作者信息",
     *               component: "AuthorProfile",
     *               order: 10
     *             }
     *           }
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例3：覆盖themeConfig.layouts.blog配置
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         asideTabs: { tags: { order: 1 } } // 通用配置
     *     },
     *     blog: {
     *       series: {
     *         "example series": {
     *           asideTabs: { tags: false } // 覆盖通用配置，禁用tags页
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link AsideTabInput} 标签页配置细则
     * @see {@link NormalizedAsideTabInput} 标签页标准化配置
     * @see {@link VPJBlogLayoutConfig.asideTabs} 布局层级的侧边栏配置
     */
    asideTabs?: Record<string, AsideTabInput>;

    /**
     * 顶部栏标题模板配置
     * @optional
     * 
     * @remarks
     * 此项用于配置对应系列所有blog页顶部栏标题的显示格式，支持以下配置方式：
     * 
     * 1. **字符串模板** - 使用`:series`、`:title`等占位符
     * 2. **函数模式** - 基于 {@link PageContext} 动态生成标题
     * 3. **禁用模式** - 使用`false`隐藏标题
     * 
     * 输入数据将被标准化为标题字符串或`false`后参与合并并注入到组件中。
     * 
     * 注意事项：
     * 
     * - 此处的配置在主题合并配置时比起themeConfig.layouts.blog中的同名配置（参见 {@link VPJBlogLayoutConfig.headerTitleTemplate}）拥有更高的优先级，但合并优先级始终低于页面frontmatter的配置
     * - 函数模式下返回值需为字符串或`false`，其他类型将被视为无效输入转为undefined参与合并
     * - 合并结果为false时，标题将被隐藏
     * - 在blog布局下，PageContext的layoutConfig对象包含当前页面的系列、标题、位序、标签列表与layout: blog
     * - 通过字符串输入的情况，支持的占位符包括：
     *   - ":series" : 当前文章所属系列
     *   - ":title" : 当前文章标题，选取原则为页面的第一个h1元素内容文本
     *   - ":order" : 当前文章在系列中的位序
     * 
     * @example
     * 示例1：为系列"example series"添加国际化前缀
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     blog: {
     *       series: {
     *         "example series": {
     *           headerTitleTemplate: "[系列] :series - :title"
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：为系列"example series"设置条件式标题
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     blog: {
     *       series: {
     *         "example series": {
     *           headerTitleTemplate: (ctx) => 
     *             ctx.layoutConfig.series === "tutorial"
     *               ? `教学：${ctx.layoutConfig.title}` 
     *               : false
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例3：覆盖通用布局配置
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         headerTitleTemplate: ":title"  // 通用配置
     *       }
     *     },
     *     blog: {
     *       series: {
     *         "example series": {
     *           headerTitleTemplate: ":series - :title"  // 覆盖为带系列名前缀
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link HeaderTitleTemplateInput} 模板输入类型
     * @see {@link PageContext} 页面上下文类型
     * @see {@link VPJBlogLayoutConfig.headerTitleTemplate} 布局层级的标题模板配置
     */
    headerTitleTemplate?: HeaderTitleTemplateInput;

    /**
     * 顶部栏图标配置
     * @optional
     * 
     * @remarks
     * 此项用于控制对应系列所有blog页顶部栏标题前的图标显示，支持以下配置方式：
     * 
     * 1. **快捷模式** - 使用全局注册的组件名称或者图片url字符串（只有扩展名为png|jpeg|jpg|gif|webp|svg的字符串被视为url输入）
     * 2. **对象模式** - 通过{ component: "CustomIcon" }指定已全局注册的组件
     * 3. **禁用模式** - 使用`false`隐藏图标
     * 
     * 输入数据将被直接用于参与合并，若合并结果为`false`，则会被视为`undefined`取消图标设置。
     * 
     * 注意事项：
     * 
     * - 此处的配置在主题合并配置时比起themeConfig.layouts.blog中的同名配置（参见 {@link VPJBlogLayoutConfig.headerIcon}）拥有更高优先级，但优先级低于页面frontmatter的配置
     * - 内置图标组件拥有最高优先级，无法被全局注册的同名组件覆盖
     * - 组件必须接受`class`和`style`属性以实现主题样式继承
     * 
     * @example
     * 示例1：为系列"example series"使用图片作为图标
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     blog: {
     *       series: {
     *         "example series": {
     *           headerIcon: "/path/to/series-icon.png"
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：为系列"example series"使用组件作为图标
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     blog: {
     *       series: {
     *         "example series": {
     *           headerIcon: { component: "CustomDocumentIcon" }
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例3：覆盖通用布局配置
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         headerIcon: "/default-icon.png"  // 通用配置
     *       }
     *     },
     *     blog: {
     *       series: {
     *         "example series": {
     *           headerIcon: false  // 覆盖通用配置，隐藏图标
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link VPJBlogLayoutConfig.headerIcon} 布局层级的图标配置
     */
    headerIcon?:
        | false
        | string
        | { component: string };

    /**
     * GitHub 仓库链接配置
     * @optional
     * 
     * @remarks
     * 此项用于配置对应系列所有blog页顶部栏GitHub仓库链接按钮，支持以下配置方式：
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
     * - 此处的配置在主题合并配置时比起themeConfig.layouts.blog中的同名配置（参见 {@link VPJBlogLayoutConfig.github}）拥有更高优先级，但合并优先级始终低于页面frontmatter的配置
     * - 合并结果为`false`的属性会被处理为`undefined`，当url为`undefined`时会隐藏GitHub按钮
     * - 动态函数模式下返回值需符合 {@link NormalizedToolbarGithubLinkInput} 格式，非合法返回值将转为`undefined`
     * - 提示文本（tooltip）会显示在按钮下方
     * 
     * @example
     * 示例1：为系列"example series"动态生成仓库链接
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     blog: {
     *       series: {
     *         "example series": {
     *           github: (ctx) => ({
     *             url: `https://github.com/my-repo/blog/${ctx.layoutConfig.series}/${ctx.layoutConfig.title}.md`,
     *             tooltip: "查看系列源码"  // 动态提示文本
     *           })
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：完全禁用某系列的GitHub按钮
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     blog: {
     *       series: {
     *         "example series": {
     *           github: false  // 覆盖通用配置并隐藏按钮
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例3：覆盖通用配置并自定义提示
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         github: {  // 通用配置
     *           url: "https://github.com/default-repo",
     *           tooltip: "默认仓库"
     *         }
     *       }
     *     },
     *     blog: {
     *       series: {
     *         "example series": {
     *           github: {  // 系列专属配置
     *             url: "https://github.com/special-repo",
     *             tooltip: "专属源码仓库"  // 覆盖提示文本
     *           }
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link ToolbarGithubLinkInput} GitHub链接配置类型
     * @see {@link NormalizedToolbarGithubLinkInput} GitHub链接标准化类型
     * @see {@link VPJBlogLayoutConfig.github} 布局层级的GitHub配置
     */
    github?: ToolbarGithubLinkInput;
    
    /**
     * Markdown下载按钮配置
     * @optional
     * 
     * @remarks
     * 此项用于配置对应系列所有blog页头部栏中Markdown文件下载按钮的行为，支持以下配置方式：
     * 
     * 1. **快捷模式** - 直接指定文件路径字符串
     * 2. **对象模式** - 配置下载链接、打开方式等细节
     * 3. **禁用模式** - 使用`false`隐藏按钮
     * 4. **动态函数** - 基于 {@link PageContext} 生成配置
     * 
     * 具体支持输入类型参考 {@link ToolbarDownloadInput} ，输入数据将被标准化为 {@link NormalizedToolbarDownloadInput} 格式参与合并。
     * 
     * 注意事项：
     * 
     * - 此处的配置在主题合并配置时比起themeConfig.layouts.blog中的同名配置（参见 {@link VPJBlogLayoutConfig.md}）拥有更高优先级，但合并优先级始终低于页面frontmatter的配置
     * - 合并结果对象中设置为 `false` 的属性会被最终处理为 `undefined`
     * - 对download属性，如果设置为 `false` , 那么渲染出来的按钮不会携带download属性；如果设置为 `true` , 那么渲染出来的按钮会携带download属性，且下载的文件名为url属性的值；如果设置为字符串，那么按钮会被渲染为形如<a ... download="input">...</a>的形式。
     * - 同github按钮一样，markdown按钮的提示条会显示在按钮的下方。
     * 
     * @example
     * 示例1：为系列"example series"设置自定义下载名
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     blog: {
     *       series: {
     *         "example series": {
     *           md: {
     *             url: "/posts/hello.md",
     *             download: "getting-started.md" // 强制指定下载文件名
     *           }
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：动态生成系列专属下载链接
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     blog: {
     *       series: {
     *         "example series": {
     *           md: (ctx) => ({  // 动态配置
     *             url: `/posts/${ctx.layoutConfig.series}.md`,
     *             tooltip: "下载系列专属文档"
     *           })
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例3：覆盖通用配置并新窗口打开文件
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         md: {  // 通用配置
     *           url: "/default.md",
     *           download: true
     *         }
     *       }
     *     },
     *     blog: {
     *       series: {
     *         "example series": {
     *           md: {  // 覆盖配置
     *             url: "/special.md",
     *             target: "_blank",  // 新窗口打开
     *             download: false
     *           }
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link ToolbarDownloadInput} 下载配置类型
     * @see {@link NormalizedToolbarDownloadInput} 下载配置标准化类型
     * @see {@link VPJBlogLayoutConfig.md} 布局层级的Markdown配置
     */
    md?: ToolbarDownloadInput;
    
    /**
     * PDF下载按钮配置
     * @optional
     * 
     * @remarks
     * 此项用于配置对应系列所有blog页PDF文件下载按钮的行为，支持以下配置方式：
     * 
     * 1. **快捷模式** - 直接指定文件路径字符串
     * 2. **对象模式** - 配置下载链接、提示文本等细节
     * 3. **禁用模式** - 使用`false`隐藏按钮
     * 4. **动态函数** - 基于 {@link PageContext} 生成配置
     * 
     * 输入数据将被标准化为 {@link NormalizedToolbarDownloadInput} 格式参与合并。
     * 
     * 注意事项：
     * 
     * - 此处的配置在主题合并配置时比起themeConfig.layouts.blog中的同名配置（参见 {@link VPJBlogLayoutConfig.pdf}）拥有更高优先级，但合并优先级始终低于页面frontmatter的配置
     * - 合并结果对象中设置为 `false` 的属性会被最终处理为 `undefined`
     * - 对download属性，如果设置为 `false` , 那么渲染出来的按钮不会携带download属性；如果设置为 `true` , 那么渲染出来的按钮会携带download属性，且下载的文件名为url属性的值；如果设置为字符串，那么按钮会被渲染为形如<a ... download="input">...</a>的形式。
     * - 通过动态函数可基于页面系列、标签等元数据生成差异化配置
     * 
     * @example
     * 示例1：为系列"example series"添加预览功能
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     blog: {
     *       series: {
     *         "example series": {
     *           pdf: {
     *             url: "/manual.pdf",
     *             tooltip: "在线预览手册",  // 自定义提示文本
     *             target: "_blank",       // 新窗口打开
     *             download: false         // 禁用下载属性
     *           }
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：动态生成系列专属PDF链接
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     blog: {
     *       series: {
     *         "example series": {
     *           pdf: (ctx) => ({
     *             url: `/pdfs/${ctx.layoutConfig.series}-${ctx.layoutConfig.title}.pdf`,  // 根据系列名动态生成路径
     *             tooltip: `${ctx.layoutConfig.series}专属文档`
     *           })
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例3：覆盖通用布局配置
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         pdf: {  // 通用配置
     *           url: "/default.pdf",
     *           tooltip: "下载指南"
     *         }
     *       }
     *     },
     *     blog: {
     *       series: {
     *         "example series": {
     *           pdf: {  // 覆盖配置
     *             url: "/advanced.pdf",
     *             tooltip: "高级教程PDF"  // 专属提示文本
     *           }
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link ToolbarDownloadInput} 下载配置类型
     * @see {@link NormalizedToolbarDownloadInput} 下载配置标准化类型
     * @see {@link VPJBlogLayoutConfig.pdf} 布局层级的PDF配置
     */
    pdf?: ToolbarDownloadInput;

    /**
     * 自定义工具按钮配置
     * @optional
     * 
     * @remarks
     * 此项用于在对应系列所有blog页顶部栏添加自定义工具按钮，支持以下配置方式：
     * 
     * 1. **快捷模式** - 直接指定图标组件名称
     * 2. **对象模式** - 配置图标、回调函数等完整参数
     * 3. **禁用模式** - 使用`false`隐藏特定按钮
     * 
     * 具体的支持类型请参考 {@link ToolbarButtonInput} ，输入对象的每一个键上的值都会被标准化为 {@link NormalizedToolbarButtonInput} 的格式后参与合并。
     * 
     * 注意事项：
     * 
     * - 此处的配置在主题合并配置时比起themeConfig.layouts.blog中的同名配置（参见 {@link VPJBlogLayoutConfig.toolbar}）拥有更高优先级，但合并优先级始终低于页面frontmatter的配置
     * - 合并后`icon`属性为undefined/false或`callback`属性非函数的数据会被视为无效数据并被过滤
     * - 合并后不包含`order`属性的按钮数据会默认设置为0（NaN输入转为0），order越小则按钮位序越靠左
     * - 工具栏按钮默认显示在GitHub/PDF/MD按钮右侧，与默认按钮间会有分割线
     * - 内置按钮图标无法被全局注册的同名组件覆盖
     * 
     * @example
     * 示例1：为系列"example series"添加打印按钮
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     blog: {
     *       series: {
     *         "example series": {
     *           toolbar: {
     *             print: {
     *               icon: "PrinterIcon",
     *               callback: () => window.print(),
     *               tooltip: "打印页面"
     *             }
     *           }
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：覆盖通用布局配置
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         toolbar: {  // 通用配置
     *           theme: { icon: "MoonIcon", callback: toggleDarkMode }
     *         }
     *       }
     *     },
     *     blog: {
     *       series: {
     *         "example series": {
     *           toolbar: {  // 覆盖配置
     *             theme: false,  // 禁用主题切换按钮
     *             analytics: {  // 添加专属分析按钮
     *               icon: "ChartIcon",
     *               callback: showSeriesAnalytics
     *             }
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
     * @see {@link VPJBlogLayoutConfig.toolbar} 布局层级的工具栏配置
     */
    toolbar?: Record<string, ToolbarButtonInput>;

    /**
     * 封面图路径配置
     * @optional
     * 
     * @remarks
     * 此项用于指定对应系列所有blog页封面图的资源路径，支持以下配置方式：
     * 
     * 1. **快捷模式** - 直接使用图片路径字符串
     * 2. **禁用模式** - 使用`false`隐藏封面图
     * 
     * 注意事项：
     * 
     * - 此处的配置在主题合并配置时比起themeConfig.layouts.blog中的同名配置（参见 {@link VPJBlogLayoutConfig.cover}）拥有更高优先级，但合并优先级始终低于页面frontmatter的配置
     * - 设为`false`时会被处理为`undefined`参与合并，最终结果为`undefined`时将隐藏封面图
     * - 封面图路径需遵循主题资源路径解析规则（支持绝对路径和public目录相对路径）
     * - 封面图数据会被其他内部组件使用（如侧边栏系列页的文章列表预览）
     * - 当同时配置了`coverHeight: false`时，封面图高度将被设置为0但依然参与数据合并
     * 
     * @example
     * 示例1：为系列"example series"设置专属封面
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     blog: {
     *       series: {
     *         "example series": {
     *           cover: "/images/special-cover.jpg"  // 系列专属封面
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：禁用某系列的封面显示
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     blog: {
     *       series: {
     *         "example series": {
     *           cover: false  // 隐藏该系列所有blog页封面
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例3：覆盖通用布局配置
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         cover: "/default-cover.jpg"  // 通用封面
     *       }
     *     },
     *     blog: {
     *       series: {
     *         "example series": {
     *           cover: "/series-cover.png"  // 覆盖为系列专属封面
     *         },
     *         "other series": {
     *           cover: false  // 完全禁用该系列封面
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link VPJBlogLayoutConfig.cover} 布局层级的封面配置
     * @see {@link VPJBlogLayoutConfig.coverHeight} 封面高度配置
     * @see {@link VPJBlogLayoutConfig.coverCss} 封面样式配置
     */
    cover?:
        | false
        | string;

    /**
     * 封面图描述文本配置
     * @optional
     * 
     * @remarks
     * 此项用于设置对应系列所有blog页封面图的alt描述文本，支持以下配置方式：
     * 
     * 1. **文本模式** - 直接使用描述字符串
     * 2. **禁用模式** - 使用`false`隐藏alt文本
     * 
     * 注意事项：
     * 
     * - 此处的配置在主题合并配置时比起themeConfig.layouts.blog中的同名配置（参见 {@link VPJBlogLayoutConfig.coverAlt}）拥有更高优先级，但合并优先级始终低于页面frontmatter的配置
     * 
     * @example
     * 示例1：为系列"example series"设置专业描述
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     blog: {
     *       series: {
     *         "example series": {
     *           coverAlt: "Vue.js 3.0 核心技术解析系列封面图"  // 系列专属描述
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：禁用某系列封面描述
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     blog: {
     *       series: {
     *         "example series": {
     *           coverAlt: false  // 移除alt属性
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例3：覆盖通用布局配置
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         coverAlt: "默认封面描述"  // 通用配置
     *       }
     *     },
     *     blog: {
     *       series: {
     *         "example series": {
     *           coverAlt: "高级教程系列封面"  // 覆盖为专属描述
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link VPJBlogLayoutConfig.coverAlt} 布局层级的封面描述配置
     * @see {@link VPJBlogLayoutConfig.cover} 封面图路径配置
     */
    coverAlt?:
        | false
        | string;
    
    /**
     * 封面图高度配置
     * @optional
     * 
     * @remarks
     * 此项用于控制对应系列所有blog页封面图的高度显示，支持以下配置方式：
     * 
     * 1. **统一值模式** - 直接使用CSS高度值（如"300px"）
     * 2. **设备响应模式** - 分设备配置移动端/平板/桌面端高度
     * 3. **禁用模式** - 使用`false`将封面图高度设为0（隐藏封面）
     * 
     * 输入数据将被标准化为 {@link NormalizedDeviceSpecificInput} 格式参与合并。
     * 
     * 注意事项：
     * 
     * - 此处的配置在主题合并配置时比起themeConfig.layouts.blog中的同名配置（参见 {@link VPJBlogLayoutConfig.coverHeight}）拥有更高优先级，但合并优先级始终低于页面frontmatter的配置
     * - 填入值将直接作为CSS变量应用（需符合CSS规范，推荐使用px/vh/rem单位）
     * - 设为`false`时会将封面高度设为0（视觉隐藏），但封面数据仍会被其他组件使用（如侧边栏系列页）
     * 
     * @example
     * 示例1：为系列"example series"设置移动端差异化高度
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     blog: {
     *       series: {
     *         "example series": {
     *           coverHeight: {
     *             mobile: "150px",
     *             desktop: "300px"
     *           }
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：为技术教程系列设置视口比例高度
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     blog: {
     *       series: {
     *         "tech-tutorials": {
     *           coverHeight: "50vh"  // 占据视口50%高度
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例3：覆盖通用布局配置
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         coverHeight: "240px"  // 通用默认高度
     *       }
     *     },
     *     blog: {
     *       series: {
     *         "example series": {
     *           coverHeight: {      // 覆盖为响应式配置
     *             mobile: "180px",
     *             tablet: "240px",
     *             desktop: "320px"
     *           }
     *         },
     *         "minimal-series": {
     *           coverHeight: false  // 完全隐藏封面图
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link DeviceSpecificInput} 设备响应式输入类型
     * @see {@link VPJBlogLayoutConfig.coverHeight} 布局层级的封面高度配置
     * @see {@link VPJBlogLayoutConfig.cover} 封面图路径配置
     */
    coverHeight?: DeviceSpecificInput;
    
    /**
     * 封面渐变过渡配置
     * @optional
     * 
     * @remarks
     * 此项为对应系列所有blog页封面图提供底部渐变过渡效果，支持以下配置方式：
     * 
     * 1. **数值模式** - 通过0-1之间的数值设置过渡区域高度比例（如0.3表示30%高度区域渐变）
     * 2. **字符串模式** - 可接受数字字符串（如"0.5"），在合并时自动转换为数值
     * 3. **禁用模式** - 使用`false`关闭过渡效果
     * 
     * 注意事项：
     * 
     * - 此处的配置在主题合并配置时比起themeConfig.layouts.blog中的同名配置（参见 {@link VPJBlogLayoutConfig.coverFade}）拥有更高优先级，但合并优先级始终低于页面frontmatter的配置
     * - 输入值会被规范化为0-1之间的数值，超出范围的值会被钳制（如1.5→1.0，-0.3→0.0）
     * - 实际效果通过CSS的mask-image属性实现，生成格式为：`linear-gradient(to top, transparent 0%, black ${num * 100}%, black)`
     * - 当coverCss的合并结果中显式设置maskImage属性时（参见 {@link SeriesMetaData.coverCss}），本配置将被覆盖
     * 
     * @example
     * 示例1：为设计系列添加中度渐变
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     blog: {
     *       series: {
     *         "design-series": {
     *           coverFade: 0.4 // 底部40%高度区域渐变过渡
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：为技术文档系列禁用渐变
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     blog: {
     *       series: {
     *         "tech-docs": {
     *           coverFade: false // 移除所有渐变效果
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例3：覆盖通用配置并设置强渐变
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         coverFade: 0.2 // 通用弱渐变配置
     *       }
     *     },
     *     blog: {
     *       series: {
     *         "photography": {
     *           coverFade: 0.7 // 覆盖为强渐变效果
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link VPJBlogLayoutConfig.coverFade} 布局层级的渐变配置
     * @see {@link VPJBlogLayoutConfig.coverCss} 布局层级的封面CSS样式配置
     */
    coverFade?:
        | false
        | string
        | number;
    
    /**
     * 封面图CSS样式配置
     * @optional
     * 
     * @remarks
     * 此项用于深度定制对应系列所有blog页封面图样式，支持以下CSS属性：
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
     * - 此处的配置在主题合并配置时比起themeConfig.layouts.blog中的同名配置（参见 {@link VPJBlogLayoutConfig.coverCss}）拥有更高优先级，但合并优先级始终低于页面frontmatter的配置
     * - 设置为`false`的属性会被处理为`undefined`（如 `{ boxShadow: false }` 将移除默认阴影）
     * - 当配置`maskImage`属性时，将完全覆盖 {@link VPJBlogLayoutConfig.coverFade} 的渐变效果
     * - 虽然此项允许你自定义封面图的样式，但是在部分内部组件中，此项配置并不会被保留去应用，例如侧边栏的系列页组件中文章列表项的封面图预览只会应用`{ objectFit: "cover", objectPosition: "center center" }`的样式。
     * 
     * @example
     * 示例1：为设计系列添加悬浮效果
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     blog: {
     *       series: {
     *         "design-series": {
     *           coverCss: {
     *             boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
     *             transition: "transform 0.3s ease, box-shadow 0.3s ease",
     *           }
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：禁用默认样式并添加动态效果
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     blog: {
     *       series: {
     *         "animated-series": {
     *           coverCss: {
     *             objectFit: false,  // 移除默认的cover设置
     *             transform: "perspective(800px) rotateX(10deg)",
     *             transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
     *           }
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例3：覆盖通用配置实现高级遮罩
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       blog: {
     *         coverCss: {  // 通用配置
     *           filter: "brightness(0.9)"
     *         }
     *       }
     *     },
     *     blog: {
     *       series: {
     *         "art-series": {
     *           coverCss: {  // 系列专属配置
     *             maskImage: "linear-gradient(to bottom, transparent 0%, black 30%)",  // 自定义遮罩
     *             objectPosition: "center top"  // 覆盖通用滤镜配置
     *           }
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link CoverCssConfigInput} 可配置属性列表
     * @see {@link VPJBlogLayoutConfig.coverCss} 布局层级的样式配置
     * @see {@link VPJBlogLayoutConfig.coverFade} 封面渐变过渡配置
     */
    coverCss?: CoverCssConfigInput;

    /**
     * 预设标签配置
     * @optional
     * 
     * @remarks
     * 此项用于为对应系列所有blog页自动添加预设标签，支持以下配置方式：
     * 
     * 1. **数组模式** - 直接使用标签字符串数组（如 ["Vue", "TypeScript"]）
     * 
     * 注意事项：
     * 
     * - 此处的配置在主题合并配置时比起themeConfig.layouts.blog中可能的全局标签配置拥有更高优先级，但合并优先级始终低于页面frontmatter的`tags`字段
     * - 标签合并逻辑：
     *   1. 优先使用系列级预设标签（seriesTags）
     *   2. 追加页面级自定义标签（pageTags）
     *   3. 通过 `Array.from(new Set(rawTags))` 进行区分大小写的去重
     * - 非列表输入会被忽略，列表输入中的非字符串成员与空字符串也不会被视为标签加入最终标签列表
     * 
     * @example
     * 示例1：为系列"example series"设置技术栈标签
     * ```ts
     * // config.mjs
     * export default {
     *   themeConfig: {
     *     blog: {
     *       series: {
     *         "example series": {
     *           presetTags: ["Vue", "TypeScript", "前端工程化"]  // 自动添加到所有同系列文章
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：覆盖预设标签并追加页面专属标签（假设你已经在config.mjs中使用了示例1的配置）
     * ```ts
     * // 文章frontmatter
     * ---
     * layout: blog
     * series: "example series"
     * tags: ["实战案例"]  // 最终标签列表=["Vue","TypeScript","前端工程化","实战案例"]
     * ---
     * ```
     * 
     * @see {@link BlogDefaultsConfig.series} 系列默认数据配置入口
     * @see {@link VPJBlogLayoutConfig} 布局层级配置容器
     */
    presetTags?: string[];
}

/**
 * blog全局配置接口
 * 
 * @remarks
 * 此接口定义了blog页相关的可配置项，包含根据系列配置不同blog页的默认数据，以及全局注册组件VPJTag的配置内容。
 * 
 * 通过此配置，可以实现以下功能：
 * 
 * - 根据系列为不同系列的blog页配置不同的默认配置。
 * - 为所有默认组件中的VPJTag组件设置属性，包括修改回调函数，添加文本处理函数。
 * 
 * 可配置的全部属性如下：
 * 
 * @see {@link BlogDefaultsConfig.tag} Tag配置
 * @see {@link BlogDefaultsConfig.series} 系列默认数据配置
 * 
 * @example
 * 示例1：配置blog
 * ```ts
 * // config.ts
 * export default defineConfig({
 *   themeConfig: {
 *     blog: {
 *       tag: {
 *         defaultCallback(tag) {console.log(tag)},
 *         textProcessor: (tag) => `#${tag}` 
 *       },
 *       series: {
 *         "杂谈收录 其1": {
 *           asideTabs: {
 *             tags: false,
 *             customTab: {
 *               name: "自定义页面",
 *               component: "CustomComponent",
 *               order: 2
 *             }
 *           },
 *           cover: "/public/path/to/image2.png",
 *           github: "https://github.com/my-name/my-repositories2"
 *         }
 *       }
 *     }
 *   }
 * })
 * ```
 */
export interface BlogDefaultsConfig {
    /**
     * 系列默认配置
     * @see {@link SeriesMetaData} blog系列默认数据接口
     */
    series?: Record<string, SeriesMetaData>;

    /**
     * VPJTag默认配置
     * 
     * @remarks
     * 此接口定义了VPJTag组件默认配置的所有可配置项，包括通用文本转换以及回调函数等内容。
     * 
     * 通过此项配置，可以实现以下功能：
     * 
     * - 配置所有默认组件中VPJTag的回调函数
     * - 配置所有默认组件中VPJTag的文字二次处理函数
     * 
     * @example
     * 示例1：配置VPJTag
     * ```ts
     * // config.ts
     * export default defineConfig({
     *   themeConfig: {
     *     blog: {
     *       tag: {
     *         defaultCallback(tag) {console.log(tag)},
     *         textProcessor: (tag) => `#${tag}` 
     *       },
     *     }
     *   }
     * })
     * ```
     */
    tag?: {
        /**
         * 全局标签点击回调函数
         * @optional
         * 
         * @param tag 
         * @returns 
         * 
         * @remarks
         * 此项用于配置对应所有VPJTag的默认回调函数，支持以下配置方式：
         * 
         * 1. **函数模式**：根据tag执行相应操作。
         * 
         * 注意事项：
         * 
         * - 根据传入的callback函数，实际执行的点击回调函数为：
         * 
         *   ```
         *   function clickCallback(event) {
         *     event.preventDefault();
         *     event.stopPropagation();
         *     callback(tag);
         *   }
         *   ```
         * 
         * @example
         * 示例1：配置所有的VPJTag默认在点击时在控制台打印其tag值
         * ```ts
         * // config.ts
         * export default defineConfig({
         *   themeConfig: {
         *     blog: {
         *       tag: {
         *         defaultCallback(tag) {console.log(tag)},
         *       },
         *     }
         *   }
         * })
         * ```
         * 
         */
        defaultCallback?: (tag: string) => void;
        
        /**
         * 全局标签文本处理函数
         * @optional
         * 
         * @param tag 
         * @returns 
         * 
         * @remarks
         * 此项用于配置对应所有VPJTag的默认文本处理函数，支持以下配置方式：
         * 
         * 1. **函数模式**：根据tag执行返回对应的字符串。
         * 
         * 注意事项：
         * 
         * - 根据传入的processor函数，实际Tag组件上的文本为：
         * 
         *   ```
         *   (typeof processor(tag) === "string" && processor(tag).length > 0) ? processor(tag) : tag
         *   ```
         * 
         * @example
         * 示例1：配置所有的VPJTag默认显示文本改成“#tag”的形式
         * ```ts
         * // config.ts
         * export default defineConfig({
         *   themeConfig: {
         *     blog: {
         *       tag: {
         *         textProcessor(tag) {return `#${tag}`},
         *       },
         *     }
         *   }
         * })
         * ```
         * 
         */
        textProcessor?: (tag: string) => string;
    };
}