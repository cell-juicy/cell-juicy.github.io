/**
 * 主题内置组件回退值配置
 * 
 * @remarks
 * 此接口定义了主题中部分内置组件默认值的配置接口，通过此配置可以实现控制部分内置组件的一些行为。
 * 
 * 可以配置的全部属性如下：
 * 
 * 1. **主题注册组件**
 * 
 * @see {@link ComponentFallbackConfig.tag} `VPJTag`配置接口
 * 
 * 2. **主题未注册组件**
 * 
 * @see {@link ComponentFallbackConfig.aside} `VPJArticleAside`配置接口
 * @see {@link ComponentFallbackConfig.asideTabOutline} `VPJArticleAsideOutlinePage`配置接口
 * @see {@link ComponentFallbackConfig.asideTabTags} `VPJBlogAsideTagsPage`配置接口
 * @see {@link ComponentFallbackConfig.asideTabSeries} `VPJBlogAsideSeriesPage`配置接口
 * @see {@link ComponentFallbackConfig.asideTabTree} `VPJDocAsideTreePage`配置接口
 * @see {@link ComponentFallbackConfig.asideTabResources} `VPJDocAsideResourcesPage`配置接口
 * 
 * @example
 * 示例 1：一个简单的配置示例
 * ```ts
 * export default {
 *   themeConfig: {
 *     components: {
 *       aside: {
 *         noTab: "未定义任何侧边栏",
 *         unknownTab: "加载失败"
 *       },
 *       asideTabTags: {
 *         empty: "文章尚未添加标签"
 *       },
 *       tag: {
 *         format: (tag) => `#${tag}`
 *       }
 *     }
 *   }
 * }
 * ```
 */
export type ComponentFallbackConfig = {
    /**
     * `VPJTag` 组件的默认行为配置
     *
     * @see {@link ComponentFallbackConfig.tag.onClick} 标签点击行为
     * @see {@link ComponentFallbackConfig.tag.format}  标签显示格式
     */
    tag?: {
        /**
         * 标签默认点击回调函数
         * @optional
         * 
         * @remarks
         * 此项用于为标签组件提供默认的点击处理逻辑。当组件未显式传入 `click` prop 时，将使用该函数作为点击事件的回退处理器。
         * 
         * 该函数接收当前标签文本作为唯一参数，可用于实现跳转、筛选或提示等行为。
         * 
         * 注意事项：
         * 
         * - 此项只在未手动传入 `click` 时生效
         * - 若未提供此项，点击标签将不会触发任何行为
         * 
         * @example
         * 示例 1：点击标签后跳转到带查询参数的标签页
         * ```ts
         * export default {
         *   themeConfig: {
         *     components: {
         *       tag: {
         *         onClick: (tag) => {
         *           window.location.href = `/tags?selected=${encodeURIComponent(tag)}`
         *         }
         *       }
         *     }
         *   }
         * }
         * ```
         * 
         * @example
         * 示例 2：在控制台打印点击的标签内容
         * ```ts
         * export default {
         *   themeConfig: {
         *     components: {
         *       tag: {
         *         onClick: (tag) => {
         *           console.log("点击了标签：", tag)
         *         }
         *       }
         *     }
         *   }
         * }
         * ```
         * 
         * @see {@link ComponentFallbackConfig.tag}
         */
        onClick?: (tag: string) => void;
        
        /**
         * 标签文本格式化函数（默认）
         * @optional
         * 
         * @remarks
         * 此项用于为标签组件提供默认的显示格式处理函数。当组件未显式传入 `format` prop 时，将使用该函数作为文本内容的格式化处理器。
         * 
         * 该函数接收标签原始字符串作为唯一参数，返回一个新的字符串用于展示。
         * 
         * 注意事项：
         * - 返回值应为非空字符串，若返回空或非字符串值，将回退使用原始标签
         * - 若未提供此项，将按原样显示标签内容
         * 
         * @example
         * 示例 1：将标签转换为全小写
         * ```ts
         * export default {
         *   themeConfig: {
         *     components: {
         *       tag: {
         *         format: (tag) => tag.toLowerCase()
         *       }
         *     }
         *   }
         * }
         * ```
         * 
         * @example
         * 示例 2：对英文标签首字母大写
         * ```ts
         * export default {
         *   themeConfig: {
         *     components: {
         *       tag: {
         *         format: (tag) => tag.charAt(0).toUpperCase() + tag.slice(1)
         *       }
         *     }
         *   }
         * }
         * ```
         * 
         * @see {@link ComponentFallbackConfig.tag}
         */
        format?: (tag: string) => string;
    };

    /**
     * `VPJArticleAside` 组件的默认提示配置
     *
     * @see {@link ComponentFallbackConfig.aside.noTab} 无配置标签页时的提示文本
     * @see {@link ComponentFallbackConfig.aside.unknownTab} 标签页加载失败时的提示文本
     */
    aside?: {
        /**
         * 没有可用标签页时的回退提示
         * @optional
         * @default "暂无可用的侧边栏标签页"
         *
         * @remarks
         * 此项用于在blog/doc布局侧边栏未配置任何标签页时，展示默认提示内容。
         *
         * @example
         * 自定义侧边栏为空时的提示文本
         * ```ts
         * export default {
         *   themeConfig: {
         *     components: {
         *       aside: {
         *         noTab: "暂无内容，敬请期待"
         *       }
         *     }
         *   }
         * }
         * ```
         *
         * @see {@link ComponentFallbackConfig.aside}
         */
        noTab?: string;

        /**
         * 当前标签页无法解析时的回退提示
         * @optional
         * @default "当前标签页无法加载"
         *
         * @remarks
         * 此项用于在当前激活的侧边栏标签页组件解析失败时，展示默认的错误提示文本。常见原因包括组件未正确注册、配置错误或组件加载异常。
         *
         * @example
         * 自定义组件加载失败时的提示文本
         * ```ts
         * export default {
         *   themeConfig: {
         *     components: {
         *       aside: {
         *         unknownTab: "该页面暂不可用"
         *       }
         *     }
         *   }
         * }
         * ```
         *
         * @see {@link ComponentFallbackConfig.aside}
         */
        unknownTab?: string;
    };

    /**
     * `VPJBlogAsideTagsPage` 组件的默认提示配置
     *
     * @see {@link ComponentFallbackConfig.asideTabTags.empty} 未设置标签时的提示文本
     */
    asideTabTags?: {
        /**
         * 标签页为空时的提示信息
         * @optional
         * @default "当前博客没有设置标签"
         *
         * @remarks
         * 此项用于配置标签页无内容时的默认提示文本，适用于以下两种情况：
         *
         * 1. 当前页面不是 blog 布局，或发生数据获取错误
         * 2. 当前 blog 页面未配置任何有效标签
         *
         * @example
         * 自定义标签页为空时的提示文本
         * ```ts
         * export default {
         *   themeConfig: {
         *     components: {
         *       asideTabTags: {
         *         empty: "暂无标签信息"
         *       }
         *     }
         *   }
         * }
         * ```
         *
         * @see {@link ComponentFallbackConfig.asideTabTags}
         */
        empty?: string;
    };

    /**
     * `VPJBlogAsideSeriesPage` 组件的默认提示配置
     *
     * @see {@link ComponentFallbackConfig.asideTabSeries.empty} 当前系列没有其它文章时的提示文本
     * @see {@link ComponentFallbackConfig.asideTabSeries.noSeries} 当前页面未配置系列时的提示文本
     */
    asideTabSeries?: {
        /**
         * 未找到同系列博客时的提示信息
         * @optional
         * @default "没有找到同系列的博客"
         *
         * @remarks
         * 当页面已经声明了 `series` 字段，但未能匹配到任何同系列文章（如系列名拼写错误或数据丢失）时，将显示此提示信息。
         *
         * 此情况理论上不应出现，通常代表数据处理过程存在异常，属于意外情形的回退提示。
         *
         * @example
         * 自定义系列匹配失败时的提示语
         * ```ts
         * export default {
         *   themeConfig: {
         *     components: {
         *       asideTabSeries: {
         *         empty: "系列文章走丢了"
         *       }
         *     }
         *   }
         * }
         * ```
         *
         * @see {@link ComponentFallbackConfig.asideTabSeries}
         */
        empty?: string;

        /**
         * 当前博客未声明系列信息时的提示文本
         * @optional
         * @default "当前博客还没被收录进任何系列"
         *
         * @remarks
         * 当博客页面未设置 `series` 字段或配置为空字符串时，将显示此提示信息，说明该文章暂未归入任何系列。
         *
         * @example
         * 自定义未声明系列时的提示语
         * ```ts
         * export default {
         *   themeConfig: {
         *     components: {
         *       asideTabSeries: {
         *         noSeries: "这篇博客暂未加入任何系列"
         *       }
         *     }
         *   }
         * }
         * ```
         *
         * @see {@link ComponentFallbackConfig.asideTabSeries}
         */
        noSeries?: string;
    };

    /**
     * `VPJArticleAsideOutlinePage` 组件的大纲（TOC）配置项
     * 
     * @remark
     * 如果不以对象形式输入，那么会被直接视为对level的配置
     *
     * @see {@link ComponentFallbackConfig.asideTabOutline.level} 控制标题层级范围
     * @see {@link ComponentFallbackConfig.asideTabOutline.ignore} 过滤标题子元素的内容拼接
     * @see {@link ComponentFallbackConfig.asideTabOutline.empty} 无内容时显示的提示文本
     */
    asideTabOutline?: number | [number, number] | "deep" |{
        /**
         * 控制大纲标题的层级范围
         * @optional
         * @default "deep"（等价于 [2, 6]）
         *
         * @remarks
         * - 可以为单个数字，例如 `2`，表示只显示 `<h2>` 级别标题
         * - 也可以为 `[2, 4]` 表示只显示 `<h2>` 到 `<h4>` 范围内的标题
         * - 特殊值 `"deep"` 表示使用默认区间 `[2, 6]`
         *
         * @example
         * 只显示 h2 和 h3 的标题
         * ```ts
         * export default {
         *   themeConfig: {
         *     components: {
         *       asideTabOutline: {
         *         level: [2, 3]
         *       }
         *     }
         *   }
         * }
         * ```
         *
         * @see {@link ComponentFallbackConfig.asideTabOutline}
         */
        level?: number | [number, number] | "deep";
        
        /**
         * 忽略特定标题的内容文本拼接（通过类名匹配）
         * @optional
         * @default /\b(vpj-blog-tag|header-anchor|footnote-ref|ignore-header)\b/
         *
         * @remarks
         * - 此配置会被转为正则，用于在序列化标题时过滤不应参与的子元素内容
         * - 当标题子元素的 `className` 匹配该规则时，其 `textContent` 不会附加到生成的大纲标题中
         * - **若希望移除某个标题本身**（而非其子内容）应直接为该标题元素添加 `ignore-header` 类
         *
         * @example
         * 忽略具有 `no-outline` 类名的子元素文本
         * ```ts
         * export default {
         *   themeConfig: {
         *     components: {
         *       asideTabOutline: {
         *         ignore: "no-outline"
         *       }
         *     }
         *   }
         * }
         * ```
         */
        ignore?: string;

        /**
         * 当前页面无大纲时显示的提示文本
         * @optional
         * @default "没有大纲标题"
         *
         * @remarks
         * 此项用于配置当页面不存在任何可用标题时，大纲页的默认提示文本。
         * 
         * 适用情况例如：
         * 
         * 1. 当前页面没有满足层级或过滤条件的标题
         * 2. 页面内容完全为空或不适用于生成大纲
         *
         * @example
         * 自定义提示文本
         * ```ts
         * export default {
         *   themeConfig: {
         *     components: {
         *       asideTabOutline: {
         *         empty: "本页暂无大纲"
         *       }
         *     }
         *   }
         * }
         * ```
         *
         * @see {@link ComponentFallbackConfig.asideTabOutline}
         */
        empty?: string;
    };

    /**
     * `VPJDocAsideResourcesPage` 组件的默认提示配置
     *
     * @see {@link ComponentFallbackConfig.asideTabResources.empty} 当前页面没有配置任何资源时的提示文本
     */
    asideTabResources?: {
        /**
         * 当前文档未配置资源时的提示文本
         * @optional
         * @default "当前文档没有相关资源"
         *
         * @remarks
         * 此项用于配置标签页无内容时的默认提示文本，适用于以下两种情况：
         *
         * 1. 当前页面不是 doc 布局，或发生数据获取错误
         * 2. 当前 doc 页面未配置任何有效资源链接
         *
         * @example
         * 自定义无资源内容时的提示文本
         * ```ts
         * export default {
         *   themeConfig: {
         *     components: {
         *       asideTabResources: {
         *         empty: "此文档暂无可用资源，欢迎补充"
         *       }
         *     }
         *   }
         * }
         * ```
         *
         * @see {@link ComponentFallbackConfig.asideTabResources}
         */
        empty?: string;
    };

    /**
     * `VPJDocAsideTreePage` 组件的默认提示配置
     *
     * @see {@link ComponentFallbackConfig.asideTabTree.empty} 空间中没有其它文档时的提示文本
     * @see {@link ComponentFallbackConfig.asideTabTree.noSpace}  当前页面未配置空间时的提示文本
     */
    asideTabTree?: {
        /**
         * 未能生成当前文档空间的目录树时的提示文本
         * @optional
         * @default "没有找到同空间的文档"
         *
         * @remarks
         * 当页面已声明 `space` 字段，但未能从文档数据中构建出有效的根目录项（如数据异常、拼写错误等）时，将显示此提示信息。
         * 
         * 此情况理论上不应出现，通常代表数据处理过程存在异常，属于意外情形的回退提示。
         *
         * @example
         * 自定义目录树构建失败时的提示文本
         * ```ts
         * export default {
         *   themeConfig: {
         *     components: {
         *       asideTabTree: {
         *         empty: "文档目录加载失败，请检查空间配置"
         *       }
         *     }
         *   }
         * }
         * ```
         *
         * @see {@link ComponentFallbackConfig.asideTabTree}
         */
        empty?: string;

        /**
         * 当前页面未配置所属文档空间时的提示文本
         * @optional
         * @default "当前文档还没被收录进空间中"
         *
         * @remarks
         * 当页面 frontmatter 中未声明 `space` 字段或配置为空字符串时，将显示此提示信息，说明该文档尚未归类进任何文档空间。
         *
         * @example
         * 自定义未配置文档空间时的提示文本
         * ```ts
         * export default {
         *   themeConfig: {
         *     components: {
         *       asideTabTree: {
         *         noSpace: "这篇文档尚未归入任何空间"
         *       }
         *     }
         *   }
         * }
         * ```
         *
         * @see {@link ComponentFallbackConfig.asideTabTree}
         */
        noSpace?: string;
    };

    panelTabHistory?: {
        interval?: "year" | "month" | "week" | "day" | "hour" | "minute" | "second";
        intervalFormat?: string | ((date: Date) => string);
        repository?: string;
        component?: string;
        empty?: string;
    }
};