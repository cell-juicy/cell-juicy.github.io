import { error } from 'console'
import type { HeadFaviconData } from '../type'


/**
 * 根据 Vitepress 配置生成标准化标题模板字符串
 * 
 * @remarks
 * 完整复刻 Vitepress 原生标题模板逻辑，支持所有配置场景：
 * - 自定义包含 :title 的模板
 * - 纯字符串后缀模式
 * - 禁用标题后缀
 * - 默认站点标题模板
 *
 * @param titleTemplate - 站点配置的标题模板（site.titleTemplate），支持以下类型：
 *  - `string`：自定义模板（支持 :title 占位符）或纯后缀
 *  - `false`：完全禁用标题后缀
 *  - `undefined`/`true`：使用默认模板
 * @param title - 站点标题（来自 site.title），未配置时自动回退到 'VitePress'
 * 
 * @returns String 可直接用于标题替换的模板字符串，始终包含 :title 占位符
 * 
 * @example 基础用法
 * ```ts
 * // 配置 titleTemplate: '定制后缀'
 * getTitleTemplate('定制后缀', '我的站点') // → ":title | 定制后缀"
 * 
 * // 配置 titleTemplate: ':title - 自定义'
 * getTitleTemplate(':title - 自定义', '我的站点') // → ":title - 自定义"
 * ```
 * 
 * @example 特殊场景
 * ```ts
 * // 禁用后缀
 * getTitleTemplate(false, '我的站点') // → ":title"
 * 
 * // 无配置 + 无站点标题
 * getTitleTemplate(undefined, undefined) // → ":title | VitePress"
 * 
 * // 显式启用默认模板
 * getTitleTemplate(true, '我的站点') // → ":title | 我的站点"
 * ```
 */
export function resolveTitleTemplate(
    titleTemplate: 
        | string
        | boolean
        | undefined,
    title:
        | string
        | undefined
): string {
    if (
        typeof titleTemplate === 'string'
    ) {
        return titleTemplate.includes(':title') ? 
            titleTemplate:
            `:title | ${titleTemplate}`
    } else if (titleTemplate === false) {
        return ':title'
    } else {
        return `:title | ${title || 'VitePress'}`
    }
}

/**
 * 处理图标路径并转换为标准格式
 * 
 * @remarks
 * 该函数主要负责以下转换：
 * - 检测 SVG 内联内容并转换为 Data URL
 * - 验证 SVG 基本结构完整性
 * - 普通路径直接返回
 * 
 * @param src - 原始路径或 SVG 字符串
 * @returns 标准化后的路径字符串
 * 
 * @throws {Error}
 * 当遇到以下情况时抛出错误：
 * - SVG 内容缺少闭合标签
 * - SVG 内容不符合基本 XML 结构
 * 
 * @example 有效 SVG 处理
 * ```ts
 * processHref('<svg><path d="..."/></svg>') 
 * // → 'data:image/svg+xml;utf8,%3Csvg%3E...'
 * ```
 * 
 * @example 普通路径处理
 * ```ts
 * processHref('/icons/error.ico') // → '/icons/error.ico'
 * ```
 */
function processHref(src: string): string {
    if (src.startsWith('<svg')) {
        if (!/^<svg.*?>.*<\/svg>$/s.test(src)) {
            throw new Error('Invalid SVG content: missing closing tag')
        }
        return `data:image/svg+xml;utf8,${encodeURIComponent(src)}`
    }
    return src
}

/**
 * 根据文件扩展名推断 MIME 类型
 * 
 * @remarks
 * 支持自动识别以下扩展名：
 * - .ico → image/x-icon
 * - .png → image/png
 * - .jpg/.jpeg → image/jpeg
 * - .webp → image/webp
 * - .svg → image/svg+xml
 * 
 * @param src - 文件路径或 Data URL
 * @returns 对应的 MIME 类型字符串，未知类型默认返回 image/x-icon
 * 
 * @example 路径推断
 * ```ts
 * processMimetype('image.webp') // → 'image/webp'
 * ```
 * 
 * @example Data URL 处理
 * ```ts
 * processMimetype('data:image/svg+xml;base64,...') // → 'image/svg+xml'
 * ```
 */
function processMimetype(src: string) {
    if (src.startsWith('data:')) {
        return src.split(';')[0].split(':')[1]
    }
    const ext = src.split('.').pop()?.toLowerCase()
    return {
        ico: 'image/x-icon',
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        webp: 'image/webp',
        svg: 'image/svg+xml'
    }[ext || ''] || 'image/x-icon'
}

/**
 * 解析并标准化单个 Favicon 配置项
 * 
 * @remarks
 * 支持处理以下输入类型：
 * - 字符串简写（自动推断类型）
 * - 完整对象配置（可指定 rel/sizes/media 等属性）
 * 
 * @param item - 原始图标配置项
 * @returns 标准化后的 link 标签属性对象，无效项返回 null
 * 
 * @throws {Error}
 * - 当对象配置缺少 src 属性时
 * - 当 SVG 内容非法时
 * 
 * @example 字符串简写
 * ```ts
 * resolveFaviconData('/error.ico')
 * // → { rel: 'icon', href: '/error.ico', type: 'image/x-icon' }
 * ```
 * 
 * @example 完整对象配置
 * ```ts
 * resolveFaviconData({
 *   src: '<svg>...</svg>',
 *   rel: 'apple-touch-icon',
 *   sizes: '180x180'
 * })
 * // → { rel: 'apple-touch-icon', href: 'data:image/svg+xml;utf8,...', type: 'image/svg+xml', sizes: '180x180' }
 * ```
 */
export function resolveFaviconData(item: HeadFaviconData) {
    try {
        if (typeof item === 'string') {
            const href = processHref(item)
            return {
                rel: 'icon',
                href,
                type: processMimetype(href)
            }
        } else if (item.src) {
            const href = processHref(item.src)
            return {
                rel: item.rel || 'icon',
                href,
                type: item.type || processMimetype(href),
                sizes: item.sizes,
                media: item.media
            }
        } else {
            throw new Error('Favicon item must contain a valid "src" property')
        }
      } catch (error) {
        console.warn('[resolveFaviconData] Invalid item:', item, error)
        return null
      }
}