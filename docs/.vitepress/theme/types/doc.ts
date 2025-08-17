import type {
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
    PageContext,
    ResourceInput,
    TitleTemplateInput,
    EditLinkInput,
    FooterInput
} from "./common";

import type {
    VPJDocLayoutConfig
} from "./layoutDoc";

import type {
    DocPageData
} from "../composables/useDocData"


/**
 * 节点元数据配置
 * 
 * @remarks
 * 此接口用于为文档页面节点（包括真实页面与虚拟节点）提供补充信息，通常通过 {@link SpaceMetaData.nodeMeta} 中的 `global` 或 `order` 定位配置项设置。其主要目的是为节点添加或覆盖特定属性，以支持目录结构构建、资源继承、节点展示等功能。
 * 
 * 除了显式设置页面 frontmatter 外，你还可以通过此结构集中式为多个节点设置统一元数据，或为无法直接设置 frontmatter 的虚拟节点补充所需信息。
 * 
 * 配置项说明如下：
 * 
 * - `title`：用于覆盖或补充页面标题，优先级低于 frontmatter。
 * - `treeTitle`：用于替代页面在默认的目录树组件中的显示文本，支持函数动态生成。
 * - `cover`：覆盖页面封面图路径，支持图片地址或设置为 `false` 隐藏。
 * - `resources`：页面相关的资源信息（如下载链接、视频地址等）。
 * - `inherit`：设置该节点是否启用资源继承机制，从其父节点继承 `cover` 和 `resources`，默认情况下所有节点的继承都是关闭的。
 * 
 * 注意事项：
 * 
 * - 所有字段仅在页面数据中对应字段未设置时才会生效。
 * - 当用于补充虚拟节点信息时（如通过 `enableVirtual` 自动生成的），这些配置是唯一可为其赋予标题、资源等内容的方式。
 * - `treeTitle` 为函数时会接收该节点对应的 {@link DocPageData} 实例作为参数，返回字符串作为目录树的显示文本（如果返回的类型不是字符串，则会采用默认文本逻辑）。
 * 
 * @example
 * 为 `1/2` 节点补充标题并启用继承
 * ```ts
 * export default {
 *   themeConfig: {
 *     doc: {
 *       space: {
 *         "guides": {
 *           nodeMeta: {
 *             "1/2": {
 *               title: "入门指引",
 *               inherit: true
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
 * 为所有节点配置统一的目录树显示文本
 * ```ts
 * export default {
 *   themeConfig: {
 *     doc: {
 *       space: {
 *         "reference": {
 *           nodeMeta: {
 *             global: {
 *               treeTitle(data) {
 *                 return `[${data.order.join('.')}] ${data.title ?? '未命名'}`
 *               }
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 * ```
 * 
 * @see {@link SpaceMetaData.nodeMeta} 节点元数据的配置入口
 * @see {@link DocPageData} 页面节点的数据结构
 * @see {@link DocPageData.treeTitle} 目录树显示文本生成逻辑
 */
export interface NodeMetadata {
    title?: string;
    cover?: string | false;
    resources?: Record<string, ResourceInput>;
    inherit?: boolean;
    treeTitle?:
        | string
        | ((data: DocPageData) => string);
}

/**
 * doc空间默认数据配置接口
 *
 * @remarks
 * 此接口定义了同一空间（space）下所有文档页的默认数据，包括侧边栏、顶部栏、封面图、节点元数据等配置项。
 * 
 * 通过此配置，可以实现以下功能：
 * 
 * - 自定义某个空间下文档页的侧边栏标签页内容，调整标签页顺序，取消默认标签页等。
 * - 自定义某个空间下文档页的顶部栏标题文本、图标，配置默认的 GitHub、PDF、Markdown 下载按钮，以及添加自定义工具按钮。
 * - 自定义某个空间下文档页的封面图，设置封面图高度、描述文本，并添加 CSS 效果。
 * - 自定义该空间下所有文档页面的默认节点元数据，例如标题、顺序、资源字段等。
 *
 * 可配置的全部属性如下：
 *
 * 1. **侧边栏配置**  
 * @see {@link SpaceMetaData.asideTabs} 标签页配置
 * 
 * 2. **顶部栏配置**  
 * @see {@link SpaceMetaData.headerTitleTemplate} 标题模板  
 * @see {@link SpaceMetaData.headerIcon} 图标配置  
 * @see {@link SpaceMetaData.github} GitHub 按钮  
 * @see {@link SpaceMetaData.md} Markdown 下载  
 * @see {@link SpaceMetaData.pdf} PDF 下载  
 * @see {@link SpaceMetaData.toolbar} 自定义工具按钮
 * 
 * 3. **封面配置**  
 * @see {@link SpaceMetaData.cover} 封面图路径  
 * @see {@link SpaceMetaData.coverAlt} 描述文本  
 * @see {@link SpaceMetaData.coverHeight} 高度配置  
 * @see {@link SpaceMetaData.coverFade} 渐变过渡  
 * @see {@link SpaceMetaData.coverCss} CSS 样式
 * 
 * 4. **页面数据配置**  
 * @see {@link SpaceMetaData.nodeMeta} 页面元数据
 * 
 * 注意事项：
 * - 通过此接口配置会根据键值来为 frontmatter 中 `space` 字段等于此键值的文档页应用对应配置。
 * - 此处配置的优先级高于 `themeConfig.layouts.doc` 中配置的通用布局默认值。
 * - 此处配置的优先级仍然低于页面 frontmatter 中的直接配置。如果希望定制某个页面的最终呈现，应在该页面 frontmatter 中显式声明对应属性。
 * 
 * @example
 * 示例1：配置空间 "开发规范" 的文档页默认内容，以覆盖通用 doc 布局数据
 * ```ts
 * // config.mjs
 * export default {
 *   themeConfig: {
 *     layouts: {
 *       doc: {
 *         asideTabs: {
 *           tree: { name: "目录页", order: 1 },
 *         },
 *         cover: "/images/default-doc-cover.png",
 *       }
 *     },
 *     doc: {
 *       space: {
 *         "开发规范": {
 *           asideTabs: {
 *             tree: false,  // 移除标签页
 *             customTab: {
 *               name: "术语说明",
 *               component: "TermGlossary",
 *               order: 3
 *             }
 *           },
 *           cover: "/images/dev-doc-cover.png",
 *           coverAlt: "开发文档封面图",
 *           github: "https://github.com/my-org/dev-docs"
 *         }
 *       }
 *     }
 *   }
 * }
 * ```
 */
export interface SpaceMetaData {
    /**
     * 文档空间标题模板
     * @optional
     * 
     * @remarks
     * 该项用于配置某一空间下所有 `doc` 页面在 `<head>` 中渲染的 `<title>` 元素，
     * 支持静态模板、动态函数或禁用模式，以统一控制空间页面的标题样式。
     * 
     * 支持以下三种配置方式：
     * 
     * 1. **字符串模板** - 使用 `:space`、`:title`、`:order` 占位符
     * 2. **函数模板** - 基于 {@link PageContext} 上下文动态生成标题
     * 3. **禁用模式（false）** - 忽略模板，直接返回页面标题
     * 
     * 注意事项：
     * - 优先级高于 {@link VPJDocLayoutConfig.titleTemplate} 中的 layout 层级配置
     * - 函数返回值必须为字符串，否则将被视为无效输入
     * - 若设置为 `false` 则使用上下文中的标题
     * - 支持的占位符包括：
     *   - `:space`：当前空间名称
     *   - `:title`：页面主标题（通常为首个 h1）
     *   - `:order`：树目录层级位置（如 '1.2.3'）
     * 
     * @example
     * 示例 1：为某空间设置统一标题样式
     * ```ts
     * export default {
     *   themeConfig: {
     *     doc: {
     *       spaces: {
     *         "开发指南": {
     *           titleTemplate: "[指南] :title · :order"
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link PageContext}
     * @see {@link HeaderTitleTemplateInput}
     * @see {@link VPJDocLayoutConfig.titleTemplate}
     */
    titleTemplate?: TitleTemplateInput;

    /**
     * 文档空间图标
     * @optional
     * 
     * @remarks
     * 该项用于配置某一空间下所有 `doc` 页面标签页图标，
     * 将被注入为 `<link rel="icon">`，支持简洁路径或包含标题信息的对象形式。
     * 
     * 注意事项：
     * - 优先级高于 {@link VPJDocLayoutConfig.favicon} 中的 layout 层级配置
     * - 若未设置该项，则 fallback 至 layout 层级配置或 `themeConfig.logo`
     * - 若为对象形式，可附加 `alt` 字段作为图标说明
     * 
     * @example
     * 示例 1：为某空间设置专属图标
     * ```ts
     * export default {
     *   themeConfig: {
     *     doc: {
     *       spaces: {
     *         "API参考": {
     *           favicon: "/icons/api-icon.svg"
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例 2：提供带说明的图标对象
     * ```ts
     * export default {
     *   themeConfig: {
     *     doc: {
     *       spaces: {
     *         "设计规范": {
     *           favicon: {
     *             src: "/icons/design-icon.svg",
     *             alt: "设计规范空间图标",
     *           }
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link ImageData}
     * @see {@link VPJDocLayoutConfig.favicon}
     */
    favicon?: ImageData;

    /**
     * 文档空间页面描述
     * @optional
     * 
     * @remarks
     * 该项用于设置某一空间下所有 `doc` 页面的默认描述信息，
     * 将注入为 `<meta name="description">`，常用于 SEO 与摘要显示。
     * 
     * 注意事项：
     * - 优先级高于 {@link VPJDocLayoutConfig.description} 中的 layout 层级配置
     * - 若未设置该项，将回退至 layout 配置或站点描述
     * 
     * @example
     * 示例 1：为某空间提供个性化描述
     * ```ts
     * export default {
     *   themeConfig: {
     *     doc: {
     *       spaces: {
     *         "用户手册": {
     *           description: "包含产品所有功能的详细使用说明和操作指南。"
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link VPJDocLayoutConfig.description}
     */
    description?: string;

    /**
     * 侧边栏标签页配置
     * @optional
     * 
     * @remarks
     * 此项用于配置对应空间下所有 doc 页侧边栏显示的标签页内容，支持以下配置方式：
     * 
     * 1. **快捷模式** - 直接使用组件名称字符串替换默认标签页
     * 2. **对象模式** - 通过配置对象指定标签页名称、组件和显示顺序
     * 3. **禁用模式** - 使用 `false` 完全禁用特定标签页
     * 
     * 每个键值对会被标准化为 {@link NormalizedAsideTabInput} 格式参与合并。
     * 
     * 注意事项：
     * 
     * - 此项允许在 frontmatter 中配置，并拥有最高优先级
     * - 此处的配置在合并时优先级高于 `themeConfig.layouts.doc` 中的同名配置（参见 {@link VPJDocLayoutConfig.asideTabs}），但仍低于页面 frontmatter 中的设置
     * - 合并后 `component` 属性必须为字符串才会被渲染，其他无效数据将被过滤
     * - `name` 默认为 `component` 值，`order` 默认为 0
     * - 可使用此配置为默认标签页（如 `tags` 或 `space`）设置额外参数（如 `order`）以覆盖默认配置
     * - 内置组件如 "VPJDocAsideSpacePage" 与 "VPJDocAsideTagsPage" 会覆盖同名全局注册组件
     * 
     * @example
     * 示例1：替换空间 "使用文档" 的默认目录组件
     * ```ts
     * export default {
     *   themeConfig: {
     *     doc: {
     *       space: {
     *         "使用文档": {
     *           asideTabs: {
     *             tree: "CustomToc"
     *           }
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：为空间 "使用文档" 添加自定义标签页
     * ```ts
     * export default {
     *   themeConfig: {
     *     doc: {
     *       space: {
     *         "使用文档": {
     *           asideTabs: {
     *             changelog: {
     *               name: "更新记录",
     *               component: "Changelog",
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
     * 示例3：覆盖通用 doc 布局配置
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         asideTabs: { tree: { order: 1 } }
     *       }
     *     },
     *     doc: {
     *       space: {
     *         "使用文档": {
     *           asideTabs: { tree: false }
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link AsideTabInput}
     * @see {@link NormalizedAsideTabInput}
     * @see {@link VPJDocLayoutConfig.asideTabs}
     */
    asideTabs?: Record<string, AsideTabInput>;

    /**
     * 顶部栏标题模板配置
     * @optional
     * 
     * @remarks
     * 此项用于配置对应空间下所有 doc 页顶部栏标题的显示格式，支持以下配置方式：
     * 
     * 1. **字符串模板** - 使用 `:space`、`:title` 等占位符
     * 2. **函数模式** - 基于 {@link PageContext} 动态生成标题
     * 3. **禁用模式** - 使用 `false` 隐藏标题
     * 
     * 输入将被标准化为标题字符串或 `false` 后参与合并注入组件。
     * 
     * 注意事项：
     * 
     * - 优先级高于 `themeConfig.layouts.doc` 中的配置（参见 {@link VPJDocLayoutConfig.headerTitleTemplate}），低于页面 frontmatter
     * - 函数返回值须为字符串或 `false`，否则将被视为无效输入
     * - 返回值为 `false` 时将隐藏标题
     * - 在 doc 布局中，`PageContext.layoutConfig` 包含当前文档的 `space`、`title`、`order` 等信息
     * - 字符串模板支持以下占位符：
     *   - `:space` : 当前页面所属空间
     *   - `:title` : 当前页面标题（首个 h1 内容）
     * 
     * @example
     * 示例1：为空间 "开发文档" 添加统一前缀
     * ```ts
     * export default {
     *   themeConfig: {
     *     doc: {
     *       space: {
     *         "开发文档": {
     *           headerTitleTemplate: "[开发] :space - :title"
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：基于上下文条件设置标题
     * ```ts
     * export default {
     *   themeConfig: {
     *     doc: {
     *       space: {
     *         "开发文档": {
     *           headerTitleTemplate: (ctx) =>
     *             ctx.layoutConfig.space === "指南"
     *               ? `指南：${ctx.layoutConfig.title}`
     *               : false
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link HeaderTitleTemplateInput}
     * @see {@link PageContext}
     * @see {@link VPJDocLayoutConfig.headerTitleTemplate}
     */
    headerTitleTemplate?: HeaderTitleTemplateInput;

    /**
     * 顶部栏图标配置
     * @optional
     * 
     * @remarks
     * 此项用于控制对应空间下所有 doc 页顶部栏标题前的图标显示，支持以下配置方式：
     * 
     * 1. **快捷模式** - 使用全局注册组件名或图片 URL 字符串（支持 png、jpeg、jpg、gif、webp、svg）
     * 2. **对象模式** - 通过 `{ component: "MyIcon" }` 使用组件
     * 3. **禁用模式** - 使用 `false` 隐藏图标
     * 
     * 若最终值为 `false`，将视为未设置图标。
     * 
     * 注意事项：
     * 
     * - 优先级高于 `themeConfig.layouts.doc` 中的配置（参见 {@link VPJDocLayoutConfig.headerIcon}），低于页面 frontmatter
     * - 内置图标组件将覆盖全局注册的同名组件
     * - 自定义组件需支持 `class` 和 `style` 属性以继承主题样式
     * 
     * @example
     * 示例1：为空间 "指南" 设置图片图标
     * ```ts
     * export default {
     *   themeConfig: {
     *     doc: {
     *       space: {
     *         "指南": {
     *           headerIcon: "/icons/guide.svg"
     *         }
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
     *     doc: {
     *       space: {
     *         "指南": {
     *           headerIcon: { component: "GuideIcon" }
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例3：覆盖通用图标配置
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         headerIcon: "/icons/default.svg"
     *       }
     *     },
     *     doc: {
     *       space: {
     *         "指南": {
     *           headerIcon: false
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link VPJDocLayoutConfig.headerIcon}
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
     * 此项用于配置对应空间下所有 doc 页顶部栏 GitHub 仓库链接按钮，支持以下配置方式：
     * 
     * 1. **快捷模式** - 直接使用仓库 URL 字符串
     * 2. **对象模式** - 配置 URL 和提示文本等细节
     * 3. **禁用模式** - 使用 `false` 隐藏按钮
     * 4. **动态函数** - 基于 {@link PageContext} 生成配置
     * 
     * 输入数据将被标准化为 {@link NormalizedToolbarGithubLinkInput} 格式参与合并。
     * 
     * 注意事项：
     * 
     * - 此配置项在合并时优先级高于 `themeConfig.layouts.doc` 中的同名配置（参见 {@link VPJDocLayoutConfig.github}），但低于页面 frontmatter 中的配置
     * - 返回值为 `false` 将被视为未设置，GitHub 按钮将被隐藏
     * - 函数模式下返回值需为合法配置对象，否则将被处理为 `undefined`
     * - 按钮的提示文本（tooltip）将显示在按钮下方
     * 
     * @example
     * 示例1：为空间 "开发文档" 动态生成 GitHub 链接
     * ```ts
     * export default {
     *   themeConfig: {
     *     doc: {
     *       space: {
     *         "开发文档": {
     *           github: (ctx) => ({
     *             url: `https://github.com/my-org/docs/${ctx.layoutConfig.space}/${ctx.layoutConfig.title}.md`,
     *             tooltip: "查看文档源码"
     *           })
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：禁用 GitHub 按钮
     * ```ts
     * export default {
     *   themeConfig: {
     *     doc: {
     *       space: {
     *         "开发文档": {
     *           github: false
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例3：覆盖通用 GitHub 链接配置
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         github: {
     *           url: "https://github.com/my-org/default-repo",
     *           tooltip: "默认仓库"
     *         }
     *       }
     *     },
     *     doc: {
     *       space: {
     *         "开发文档": {
     *           github: {
     *             url: "https://github.com/my-org/special-docs",
     *             tooltip: "专属源码仓库"
     *           }
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link ToolbarGithubLinkInput}
     * @see {@link NormalizedToolbarGithubLinkInput}
     * @see {@link VPJDocLayoutConfig.github}
     */
    github?: ToolbarGithubLinkInput;

    /**
     * Markdown 下载按钮配置
     * @optional
     * 
     * @remarks
     * 此项用于配置对应空间下所有 doc 页顶部栏中的 Markdown 文件下载按钮，支持以下配置方式：
     * 
     * 1. **快捷模式** - 直接指定文件路径字符串
     * 2. **对象模式** - 配置下载链接、提示文本、打开方式等
     * 3. **禁用模式** - 使用 `false` 隐藏按钮
     * 4. **动态函数** - 基于 {@link PageContext} 生成配置
     * 
     * 输入数据将被标准化为 {@link NormalizedToolbarDownloadInput} 格式参与合并。
     * 
     * 注意事项：
     * 
     * - 优先级高于 `themeConfig.layouts.doc` 中的配置（参见 {@link VPJDocLayoutConfig.md}），低于页面 frontmatter
     * - 属性设置为 `false` 的键将被视为未定义
     * - `download` 属性支持：
     *   - `false`：不添加 download 属性
     *   - `true`：自动使用链接中的文件名作为下载名
     *   - `string`：指定下载文件名
     * - tooltip 为按钮下方提示文本
     * 
     * @example
     * 示例1：自定义下载文件名
     * ```ts
     * export default {
     *   themeConfig: {
     *     doc: {
     *       space: {
     *         "开发文档": {
     *           md: {
     *             url: "/docs/intro.md",
     *             download: "introduction.md"
     *           }
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：动态配置 Markdown 链接
     * ```ts
     * export default {
     *   themeConfig: {
     *     doc: {
     *       space: {
     *         "开发文档": {
     *           md: (ctx) => ({
     *             url: `/docs/${ctx.layoutConfig.space}.md`,
     *             tooltip: "下载空间专属文档"
     *           })
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例3：覆盖默认配置并新窗口打开
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         md: {
     *           url: "/default.md",
     *           download: true
     *         }
     *       }
     *     },
     *     doc: {
     *       space: {
     *         "开发文档": {
     *           md: {
     *             url: "/custom.md",
     *             target: "_blank",
     *             download: false
     *           }
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link ToolbarDownloadInput}
     * @see {@link NormalizedToolbarDownloadInput}
     * @see {@link VPJDocLayoutConfig.md}
     */
    md?: ToolbarDownloadInput;

    /**
     * PDF 下载按钮配置
     * @optional
     * 
     * @remarks
     * 此项用于配置对应空间下所有 doc 页的 PDF 文件下载按钮行为，支持以下配置方式：
     * 
     * 1. **快捷模式** - 直接指定 PDF 文件路径字符串
     * 2. **对象模式** - 配置链接、提示文本、下载属性等
     * 3. **禁用模式** - 使用 `false` 隐藏按钮
     * 4. **动态函数** - 基于 {@link PageContext} 动态生成配置
     * 
     * 输入数据将被标准化为 {@link NormalizedToolbarDownloadInput} 格式参与合并。
     * 
     * 注意事项：
     * 
     * - 此配置项在合并时优先级高于 `themeConfig.layouts.doc` 中的同名配置（参见 {@link VPJDocLayoutConfig.pdf}），但低于页面 frontmatter 配置
     * - 设置为 `false` 的字段将被视为未定义
     * - `download` 支持布尔值或字符串，控制浏览器下载行为
     * - 可使用函数生成基于空间、标签等元信息的动态下载路径
     * 
     * @example
     * 示例1：添加 PDF 在线预览
     * ```ts
     * export default {
     *   themeConfig: {
     *     doc: {
     *       space: {
     *         "开发文档": {
     *           pdf: {
     *             url: "/manuals/dev-manual.pdf",
     *             tooltip: "预览开发手册",
     *             target: "_blank",
     *             download: false
     *           }
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例2：基于页面信息生成 PDF 下载链接
     * ```ts
     * export default {
     *   themeConfig: {
     *     doc: {
     *       space: {
     *         "开发文档": {
     *           pdf: (ctx) => ({
     *             url: `/pdf/${ctx.layoutConfig.space}-${ctx.layoutConfig.title}.pdf`,
     *             tooltip: "当前文档专属 PDF"
     *           })
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @example
     * 示例3：覆盖默认 PDF 下载配置
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         pdf: {
     *           url: "/default.pdf",
     *           tooltip: "通用下载"
     *         }
     *       }
     *     },
     *     doc: {
     *       space: {
     *         "开发文档": {
     *           pdf: {
     *             url: "/special.pdf",
     *             tooltip: "专属下载"
     *           }
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link ToolbarDownloadInput}
     * @see {@link NormalizedToolbarDownloadInput}
     * @see {@link VPJDocLayoutConfig.pdf}
     */
    pdf?: ToolbarDownloadInput;

    /**
     * 自定义工具按钮配置
     * @optional
     *
     * @remarks
     * 此项用于为对应空间下所有 doc 页的顶部工具栏添加自定义按钮，支持以下配置方式：
     *
     * 1. **快捷模式** - 直接指定图标组件名称字符串
     * 2. **对象模式** - 配置图标、回调函数、提示文本等完整信息
     * 3. **禁用模式** - 对于特定按钮使用 `false` 隐藏
     *
     * 每个键对应一个按钮，输入数据将被标准化为 {@link NormalizedToolbarButtonInput} 后参与合并。
     *
     * 注意事项：
     *
     * - 此配置项在主题合并时优先级高于 `themeConfig.layouts.doc` 中的同名配置（参见 {@link VPJDocLayoutConfig.toolbar}），但低于页面 frontmatter 中的配置
     * - 若 `icon` 为 undefined/false 或 `callback` 非函数，则按钮项会被过滤
     * - 未设置 `order` 的按钮将默认使用 `0`，较小值显示在左侧
     * - 自定义按钮位于 GitHub / Markdown / PDF 按钮右侧，并以分隔符隔开
     * - 内置图标名称不可被全局组件覆盖
     *
     * @example
     * 示例1：为空间 "开发文档" 添加打印按钮
     * ```ts
     * export default {
     *   themeConfig: {
     *     doc: {
     *       space: {
     *         "开发文档": {
     *           toolbar: {
     *             print: {
     *               icon: "PrinterIcon",
     *               callback: () => window.print(),
     *               tooltip: "打印当前页面"
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
     * 示例2：覆盖通用配置并添加专属按钮
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         toolbar: {
     *           theme: { icon: "MoonIcon", callback: toggleDarkMode }
     *         }
     *       }
     *     },
     *     doc: {
     *       space: {
     *         "开发文档": {
     *           toolbar: {
     *             theme: false,
     *             help: {
     *               icon: "HelpIcon",
     *               callback: openHelpDialog
     *             }
     *           }
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     *
     * @see {@link ToolbarButtonInput}
     * @see {@link NormalizedToolbarButtonInput}
     * @see {@link VPJDocLayoutConfig.toolbar}
     */
    toolbar?: Record<string, ToolbarButtonInput>;

    /**
     * 封面图路径配置
     * @optional
     *
     * @remarks
     * 此项用于配置对应空间下所有 doc 页的顶部封面图路径，支持以下配置方式：
     *
     * 1. **快捷模式** - 直接使用图片路径字符串
     * 2. **禁用模式** - 使用 `false` 隐藏封面图
     *
     * 注意事项：
     *
     * - 此配置项在主题合并时优先级高于 `themeConfig.layouts.doc` 中的配置（参见 {@link VPJDocLayoutConfig.cover}），但低于页面 frontmatter 配置
     * - 设置为 `false` 会被处理为 `undefined`，最终值为 `undefined` 时将隐藏封面图
     * - 支持绝对路径（`/` 开头）或 `public` 目录中的相对路径
     * - 封面图路径信息可被其他组件共享（如侧边栏文档目录预览）
     * - 如同时设置 `coverHeight: false`，将隐藏封面图高度但保留封面图数据
     *
     * @example
     * 示例1：设置专属封面图
     * ```ts
     * export default {
     *   themeConfig: {
     *     doc: {
     *       space: {
     *         "开发文档": {
     *           cover: "/images/doc-cover.jpg"
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     *
     * @example
     * 示例2：禁用封面图
     * ```ts
     * export default {
     *   themeConfig: {
     *     doc: {
     *       space: {
     *         "开发文档": {
     *           cover: false
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     *
     * @example
     * 示例3：覆盖默认封面图
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         cover: "/default-doc-cover.jpg"
     *       }
     *     },
     *     doc: {
     *       space: {
     *         "开发文档": {
     *           cover: "/custom-dev-cover.jpg"
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     *
     * @see {@link VPJDocLayoutConfig.cover}
     * @see {@link VPJDocLayoutConfig.coverHeight}
     * @see {@link VPJDocLayoutConfig.coverCss}
     */
    cover?:
        | false
        | string;

    /**
     * 封面图描述文本配置
     * @optional
     *
     * @remarks
     * 此项用于设置对应空间下所有 doc 页封面图的 alt 描述文本，支持以下配置方式：
     *
     * 1. **文本模式** - 使用字符串描述封面图内容
     * 2. **禁用模式** - 使用 `false` 关闭 alt 属性
     *
     * 注意事项：
     *
     * - 此配置项在主题合并时优先级高于 `themeConfig.layouts.doc` 中的配置（参见 {@link VPJDocLayoutConfig.coverAlt}），但低于页面 frontmatter 配置
     *
     * @example
     * 示例1：设置 alt 文本
     * ```ts
     * export default {
     *   themeConfig: {
     *     doc: {
     *       space: {
     *         "开发文档": {
     *           coverAlt: "开发文档空间封面图"
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     *
     * @example
     * 示例2：禁用 alt 属性
     * ```ts
     * export default {
     *   themeConfig: {
     *     doc: {
     *       space: {
     *         "开发文档": {
     *           coverAlt: false
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     *
     * @example
     * 示例3：覆盖通用配置
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         coverAlt: "默认封面描述"
     *       }
     *     },
     *     doc: {
     *       space: {
     *         "开发文档": {
     *           coverAlt: "开发者手册系列封面图"
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     *
     * @see {@link VPJDocLayoutConfig.coverAlt}
     * @see {@link VPJDocLayoutConfig.cover}
     */
    coverAlt?:
        | false
        | string;

    /**
     * 封面图高度配置
     * @optional
     *
     * @remarks
     * 此项用于控制对应空间下所有 doc 页封面图的高度，支持以下配置方式：
     *
     * 1. **统一值模式** - 直接指定 CSS 高度值（如 `"300px"`）
     * 2. **设备响应模式** - 指定移动端、平板和桌面端各自的高度值
     * 3. **禁用模式** - 使用 `false` 设置封面高度为 0（视觉上隐藏封面）
     *
     * 输入数据将被标准化为 {@link NormalizedDeviceSpecificInput} 格式参与合并。
     *
     * 注意事项：
     *
     * - 此配置在主题合并时优先级高于 {@link VPJDocLayoutConfig.coverHeight}，但低于页面 frontmatter 的配置
     * - 填入的高度值将直接作为 CSS 变量应用，建议使用合法单位（如 `px`、`vh`、`rem` 等）
     * - 设置为 `false` 时封面高度为 0，但封面资源仍参与合并，可被其他组件（如目录预览）引用
     *
     * @example
     * 示例1：为空间 "开发文档" 配置响应式封面高度
     * ```ts
     * export default {
     *   themeConfig: {
     *     doc: {
     *       space: {
     *         "开发文档": {
     *           coverHeight: {
     *             mobile: "120px",
     *             desktop: "280px"
     *           }
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     *
     * @example
     * 示例2：禁用封面图显示
     * ```ts
     * export default {
     *   themeConfig: {
     *     doc: {
     *       space: {
     *         "开发文档": {
     *           coverHeight: false
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     *
     * @example
     * 示例3：覆盖默认配置并设置统一高度
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         coverHeight: "220px"
     *       }
     *     },
     *     doc: {
     *       space: {
     *         "开发文档": {
     *           coverHeight: "360px"
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     *
     * @see {@link DeviceSpecificInput}
     * @see {@link VPJDocLayoutConfig.coverHeight}
     * @see {@link VPJDocLayoutConfig.cover}
     */
    coverHeight?: DeviceSpecificInput;

    /**
     * 封面渐变过渡配置
     * @optional
     *
     * @remarks
     * 此项用于为对应空间下所有 doc 页封面图添加底部渐变过渡效果，支持以下配置方式：
     *
     * 1. **数值模式** - 使用 0 到 1 之间的数字设置渐变区域占比（如 0.3 表示底部 30% 高度渐变）
     * 2. **字符串模式** - 使用数字字符串（如 `"0.5"`），合并时自动转换为数值
     * 3. **禁用模式** - 使用 `false` 完全关闭渐变效果
     *
     * 注意事项：
     *
     * - 此配置在主题合并时优先级高于 {@link VPJDocLayoutConfig.coverFade}，但低于页面 frontmatter 的配置
     * - 输入值会被钳制至 0~1 区间
     * - 实际效果通过 CSS 的 `mask-image` 属性实现，格式为：
     *   `linear-gradient(to top, transparent 0%, black ${num * 100}%, black)`
     * - 若 `coverCss.maskImage` 被显式设置，将完全覆盖本配置
     *
     * @example
     * 示例1：设置中等渐变效果
     * ```ts
     * export default {
     *   themeConfig: {
     *     doc: {
     *       space: {
     *         "开发文档": {
     *           coverFade: 0.4
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     *
     * @example
     * 示例2：禁用渐变效果
     * ```ts
     * export default {
     *   themeConfig: {
     *     doc: {
     *       space: {
     *         "开发文档": {
     *           coverFade: false
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     *
     * @example
     * 示例3：覆盖默认值设置更强渐变
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         coverFade: 0.2
     *       }
     *     },
     *     doc: {
     *       space: {
     *         "开发文档": {
     *           coverFade: 0.7
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     *
     * @see {@link VPJDocLayoutConfig.coverFade}
     * @see {@link VPJDocLayoutConfig.coverCss}
     */
    coverFade?:
        | false
        | string
        | number;

    /**
     * 封面图 CSS 样式配置
     * @optional
     *
     * @remarks
     * 此项用于自定义对应空间下所有 doc 页封面图的 CSS 样式，支持以下属性：
     *
     * - `boxShadow`：盒子阴影
     * - `filter`：滤镜效果
     * - `maskImage`：遮罩图像（会覆盖 `coverFade`）
     * - `objectFit`：图片填充模式
     * - `objectPosition`：图片定位
     * - `opacity`：透明度
     * - `transform`：变形样式
     * - `transition`：过渡动画
     *
     * 注意事项：
     *
     * - 此配置在主题合并时优先级高于 {@link VPJDocLayoutConfig.coverCss}，但低于页面 frontmatter 的配置
     * - 为 `false` 的属性值将被处理为 `undefined`，可用于移除默认样式（如 `{ boxShadow: false }`）
     * - 设置 `maskImage` 属性将完全覆盖 `coverFade` 的渐变效果
     * - 部分样式仅适用于主页面封面图，侧边栏中的预览封面图将忽略该配置，仅应用 `{ objectFit: "cover", objectPosition: "center center" }`
     *
     * @example
     * 示例1：添加悬浮阴影与动画效果
     * ```ts
     * export default {
     *   themeConfig: {
     *     doc: {
     *       space: {
     *         "设计手册": {
     *           coverCss: {
     *             boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
     *             transition: "transform 0.3s ease, box-shadow 0.3s ease"
     *           }
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     *
     * @example
     * 示例2：覆盖默认样式并添加高级变换
     * ```ts
     * export default {
     *   themeConfig: {
     *     doc: {
     *       space: {
     *         "动画文档": {
     *           coverCss: {
     *             objectFit: false,
     *             transform: "perspective(800px) rotateX(10deg)",
     *             transition: "transform 0.5s ease-in-out"
     *           }
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     *
     * @example
     * 示例3：自定义遮罩并覆盖默认滤镜
     * ```ts
     * export default {
     *   themeConfig: {
     *     layouts: {
     *       doc: {
     *         coverCss: {
     *           filter: "brightness(0.9)"
     *         }
     *       }
     *     },
     *     doc: {
     *       space: {
     *         "高级文档": {
     *           coverCss: {
     *             maskImage: "linear-gradient(to bottom, transparent 0%, black 30%)",
     *             objectPosition: "center top"
     *           }
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     *
     * @see {@link CoverCssConfigInput}
     * @see {@link VPJDocLayoutConfig.coverCss}
     * @see {@link VPJDocLayoutConfig.coverFade}
     */
    coverCss?: CoverCssConfigInput;

    /**
     * 是否启用虚拟父节点生成逻辑
     * @optional
     * @defaults false
     * 
     * @remarks
     * 此项用于控制是否为当前文档空间下的页面节点自动生成缺失的虚拟父节点。生成逻辑基于 `order` 推导上级节点的存在性，若上级不存在，则将其以“结构占位”的形式补足为虚拟节点。
     * 
     * 生成逻辑如下：
     * 
     * 1. 每个页面节点会检查其是否要求生成虚拟父节点（详见注意事项）。
     * 2. 如果要求生成，则根据其 order 从尾部开始依次截断，构造出可能的父节点路径（例如 order: [1, 2, 3] 会依次尝试 [1, 2] → [1]）。
     * 3. 依据生成的路径逐级查询是否存在有效的父页面节点，如果不存在则生成一个对应 order 的虚拟页面节点添加到数据集中。
     * 4. 当找到第一个已经存在的父节点或穷尽父节点路径时，停止生成。
     * 
     * 生成的虚拟节点数据默认只包含以下字段：
     * 
     * - `id`：由 `space` 与 `order` 生成的唯一标识符
     * - `space`：继承自子节点的文档空间
     * - `order`：对应的位序
     * - `virtual`：标记为 `true`
     * 
     * 除非通过 {@link SpaceMetaData.nodeMeta} 指定补充字段，否则不会包含 `title`、`treeTitle`、`cover` 等其他信息。
     * 
     * 注意事项：
     * 
     * - 此配置项为空间控制项，仅影响未显式设置 `allowVirtualParents` 的页面节点。
     * - 若页面节点设置了 `allowVirtualParents: false`，则此页面节点不会生成任何虚拟父节点。
     * - 若页面节点设置了 `allowVirtualParents: true`，即使此配置项为 `false` 也会独立参与虚拟节点生成。
     * - 通过`useDocData().filter`筛选返回的节点中将包含虚拟节点。
     * - 虚拟节点在默认的目录树组件中点击时仅执行展开/收起子节点目录的操作。
     * 
     * @example
     * 启用 guides 空间的虚拟父节点自动生成
     * ```ts
     * export default {
     *   themeConfig: {
     *     doc: {
     *       space: {
     *         "guides": {
     *           enableVirtual: true
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link SpaceMetaData.nodeMeta} 用于为虚拟节点补全其他字段
     * @see {@link DocPageData.generateVirtualNodes} 虚拟节点生成逻辑方法
     */
    enableVirtual?: boolean;

    /**
     * 文档页节点元数据默认配置
     * @optional
     * 
     * @remarks
     * 此项用于为对应文档空间的所有页面节点设置默认的节点元数据配置（如 `virtual`、`inherit`、`resource` 等），支持通过两种方式配置页面节点的元数据：
     * 
     * 1. **全局模式**：通过 `global` 属性配置，将应用到此空间下所有页面节点。
     * 2. **位序指定模式**：为某个特定的位序order指定配置项，将应用此配置项到对应位序的页面节点。
     * 
     * 注意事项：
     * 
     * - 此项一般用于为虚拟节点配置缺失的元数据属性。
     * - 虽然你可以在这里与页面frontmatter配置相同的内容，但是两边都存在有效配置时页面frontmatter始终拥有更高优先级。
     * - 通过位序指定配置的配置项比全局配置的配置项有更高的优先级。
     * - 用于位序指定的字符串与页面frontmatter的输入规则一样，只有这些符号被视为有效分隔符：
     *   - 逗号（,）
     *   - 中文逗号（，）
     *   - 竖线（|）
     *   - 分号（;）
     *   - 空格（ ）
     *   - 冒号（:）
     *   - 斜杠（/）
     *   例如，`"1/-2|6,9.5，7"` 表示将配置应用于 `order` 为 [1, -2, 6, 9.5, 7] 的页面节点。
     * - 如果你希望通过函数形式设置默认doc目录树标签页中节点的文本，你只能在这里通过配置对应节点的treeTitle属性来设置。
     * - 该属性的配置只对实际存在的页面节点/虚拟节点生效，例如如果空间中不存在 `order` 为 [1, 2]的节点，那么即使为"1/2"添加配置也不会生效。
     * 
     * @example
     * 为文档空间guides下所有页面开启继承与添加目录树节点文本函数，同时为order为[1,2]的节点设置特殊标题。
     * ```ts
     * export default {
     *   themeConfig: {
     *     doc: {
     *       space: {
     *         "guides": {
     *           nodeMeta: {
     *             global: {
     *               inherit: true,
     *               treeTitle(data) {
     *                 return data.isVirtual ? `guide chap ${data.order.join("-")}` : `guide sec ${data.title}`
     *               } 
     *             },
     *             "1/2": {title: "Awesome guide"}
     *           }
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     * 
     * @see {@link NodeMetadata} 节点元数据类型定义
     */
    nodeMeta?: {

        global?: NodeMetadata;

        [orderString: string]: NodeMetadata | undefined;
    },

    next?:
        | false
        | string;
    
    prev?:
        | false
        | string;
    
    autoNextPrev?: boolean;
    
    editLink?: EditLinkInput;

    footer?: FooterInput;
}