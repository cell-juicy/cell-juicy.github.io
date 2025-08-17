import { PageData, useData } from 'vitepress';
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

import { isMobile, isTablet } from '../utils/deviceTypes'
import {
    mergeAsideTabData,
    mergeCoverCssConfig,
    mergeDeviceData,
    mergeDownloadData,
    mergeGithubLinkData,
    mergeHeaderTitleTemplateData,
    mergeSimpleData,
    mergeTitleTemplateData,
    mergeToolbarButtonData,
    mergeFooterData,
    mergeEditLinkData,
} from '../utils/mergeData';

import { useBlogData } from './useBlogData';
import { useDocData } from './useDocData';

import type { Ref, ComputedRef } from 'vue';
import type { SiteData } from 'vitepress';
import type { ThemeConfig } from '../types';
import type { CoverCssConfigData, DeviceSpecificData } from '../types/common';
import type { VPJBlogLayoutConfig } from '../types/layoutBlog';
import type { VPJDocLayoutConfig } from '../types/layoutDoc';
import type { VPJPageLayoutConfig } from '../types/layoutPage';


const DEFAULT = {
    "NOT-FOUND": {
        TITLETEMPLATE: true,
        FAVICON: undefined,
        DESCRPTION: undefined,
        STATUSICON: "VPJIconCrossCircle",
        HEADING: "页面未找到",
        MESSAGE: "很抱歉，您尝试访问的页面不存在或可能已被删除。",
        GUIDANCE: { text: "返回主页", link: "/" }
    },
    "PAGE": {
        TITLETEMPLATE: true,
        FAVICON: undefined,
        DESCRPTION: undefined,
        CONTENTMARGINBOTTOM: "1.5rem",
        CONTENTMARGINTOP: "1.5rem",
        CONTENTMAXWIDTH: "61.25rem",
        CONTENTPADDING: {
            mobile: "1.5rem",
            tablet: "1.5rem",
            desktop: "4rem"
        },
        FOOTER: undefined,
        EDITLINK: undefined,
    },
    "BLOG": {
        TITLETEMPLATE: true,
        FAVICON: undefined,
        DESCRPTION: undefined,
        HEADERTITLETEMPLATE: ":series",
        HEADERICON: undefined,
        GITHUB: {
            tooltip: "在Github上查看"
        },
        PDF: {
            tooltip: "以pdf格式下载",
            download: true
        },
        MD: {
            tooltip: "以markdown格式下载",
            download: true
        },
        TOOLBAR: {},
        ASIDETABS: {
            series: {name: "系列", component: "VPJBlogAsideSeriesPage", order: 0},
            tags: {name: "标签", component: "VPJBlogAsideTagsPage", order: 0},
            outline: {name: "大纲", component: "VPJArticleAsideOutlinePage", order: 0},
        },
        COVERALT: undefined,
        COVERHEIGHT: "240px",
        COVERFADE: undefined,
        COVERCSS: {
            objectFit: "cover",
            objectPosition: "center center"
        },
        CONTENTMARGINBOTTOM: "1.5rem",
        CONTENTMARGINTOP: "1.5rem",
        CONTENTMAXWIDTH: "760px",
        CONTENTPADDING: {
            mobile: "1rem",
            tablet: "2rem",
            desktop: "4rem"
        },
        FOOTER: undefined,
        EDITLINK: undefined,
        NEXT: "下一页",
        PREV: "上一页",
    },
    "DOC":{
        TITLETEMPLATE: true,
        FAVICON: undefined,
        DESCRPTION: undefined,
        HEADERTITLETEMPLATE: ":space",
        HEADERICON: undefined,
        GITHUB: {
            tooltip: "在Github上查看"
        },
        PDF: {
            tooltip: "以pdf格式下载",
            download: true
        },
        MD: {
            tooltip: "以markdown格式下载",
            download: true
        },
        TOOLBAR: {},
        ASIDETABS: {
            tree: {name: "目录", component: "VPJDocAsideTreePage", order: 0},
            resources: {name: "资源", component: "VPJDocAsideResourcesPage", order: 0},
            outline: {name: "大纲", component: "VPJArticleAsideOutlinePage", order: 0},
        },
        COVERALT: undefined,
        COVERHEIGHT: "300px",
        COVERFADE: undefined,
        COVERCSS: {
            objectFit: "cover",
            objectPosition: "center center"
        },
        CONTENTMARGINBOTTOM: "1.5rem",
        CONTENTMARGINTOP: "1.5rem",
        CONTENTMAXWIDTH: "820px",
        CONTENTPADDING: {
            mobile: "1rem",
            tablet: "2rem",
            desktop: "4rem"
        },
        FOOTER: undefined,
        EDITLINK: undefined,
        NEXT: "下一页",
        PREV: "上一页",
    },
};

function getDeviceSpecificData(data: DeviceSpecificData) {
    if (isMobile.value) return data.mobile;
    if (isTablet.value) return data.tablet;
    return data.desktop;
}

export const useVPJLayout = defineStore("vpj-layout", () => {
    const { page, frontmatter, theme, site }: {
        page: Ref<PageData, PageData>
        frontmatter: Ref<Record<string, any>, Record<string, any>>,
        theme: Ref<ThemeConfig, ThemeConfig>,
        site: Ref<SiteData<ThemeConfig>, SiteData<ThemeConfig>>
    } = useData();
    const { layoutConfig: docLayoutConfig, spaceConfig: docSpecificConfig, ctx: docCtx } = useDocData();
    const { layoutConfig: blogLayoutConfig, seriesConfig: blogSpecificConfig, ctx: blogCtx } = useBlogData();
    const pageLayoutConfig = computed(() => {
        return (typeof theme.value.layouts?.page === "object" && theme.value.layouts.page)
            ? theme.value.layouts.page
            : {}
    });
    const notFoundLayoutConfig = computed(() => {
        return (typeof theme.value.layouts?.notFound === "object" && theme.value.layouts.notFound)
            ? theme.value.layouts.notFound
            : {}
    });

    const layout: ComputedRef<string|undefined> = computed(() => {
        if (page.value.isNotFound) return "not-found";
        return ["page", "doc", "blog", "not-found"].includes(frontmatter.value.layout)
            ? frontmatter.value.layout
            : undefined
    });
    const defaultConfig = computed(() => {
        if (layout.value) return DEFAULT[layout.value.toUpperCase()]
        return {};
    });
    const layoutConfig: ComputedRef<VPJBlogLayoutConfig|VPJDocLayoutConfig|VPJPageLayoutConfig> = computed(() => {
        if (layout.value === "blog") return blogLayoutConfig.value;
        if (layout.value === "doc") return docLayoutConfig.value;
        if (layout.value === "page") return pageLayoutConfig.value;
        if (layout.value === "not-found") return notFoundLayoutConfig.value;
        return {};
    });
    const specificConfig = computed(() => {
        if (layout.value === "blog") return blogSpecificConfig.value;
        if (layout.value === "doc") return docSpecificConfig.value;
        return {};
    });
    const ctx = computed(() => {
        if (layout.value === "blog") return blogCtx.value;
        if (layout.value === "doc") return docCtx.value;
        return undefined;
    });

    // state
    const asideCollapsed: Ref<boolean> = ref(true);
    function asideToggle(): void { asideCollapsed.value = !asideCollapsed.value; };
    function asideClose(): void { asideCollapsed.value = true; };
    function asideOpen(): void { asideCollapsed.value = false; };

    // Head config
    const headConfig = computed(() => {
        const link: Array<any> = [];
        const meta: Array<any> = [];

        // Calculate title
        const mergedTitle = mergeTitleTemplateData(
            ctx.value,
            site.value,
            page.value,
            (page.value.isNotFound) ? undefined : frontmatter.value.titleTemplate,
            specificConfig.value.titleTemplate,
            layoutConfig.value.titleTemplate
        );

        // Calculate favicon
        const mergedFavicon = mergeSimpleData(
            (input) => typeof input === 'string' || (typeof input === 'object' && input  && typeof input.src === 'string'),
            undefined,
            (page.value.isNotFound) ? undefined : frontmatter.value.favicon,
            specificConfig.value.favicon,
            layoutConfig.value.favicon,
            theme.value.logo
        );
        if (mergedFavicon) {
            const icon = typeof mergedFavicon === 'string' ? { src: mergedFavicon } : mergedFavicon;
            link.push({ rel: "icon", href: icon.src, title: typeof icon.alt === 'string' ? icon.alt : undefined })
        };

        // Calculate description
        const mergedDescription = mergeSimpleData(
            (input) => typeof input === 'string',
            undefined,
            (page.value.isNotFound) ? undefined : frontmatter.value.description,
            specificConfig.value.description,
            layoutConfig.value.description,
            site.value.description
        );
        if (mergedDescription) meta.push({ name: "description", content: mergedDescription });

        return {
            title: mergedTitle,
            meta,
            link
        };
    });
    // Content config
    const contentConfig = computed(() => {
        if (["blog", "doc", "page"].includes(layout.value || "")) {
            // Calculate margin bottom
            const mergedMarginBottom = mergeDeviceData(
                frontmatter.value.contentMarginBottom,
                layoutConfig.value.contentMarginBottom,
                defaultConfig.value.CONTENTMARGINBOTTOM
            );
            let marginBottom: string|undefined = getDeviceSpecificData(mergedMarginBottom);
            
            // Calculate margin top
            const mergedMarginTop = mergeDeviceData(
                frontmatter.value.contentMarginTop,
                layoutConfig.value.contentMarginTop,
                defaultConfig.value.CONTENTMARGINTOP
            );
            let marginTop: string|undefined = getDeviceSpecificData(mergedMarginTop);
            
            // Calculate max width
            const mergedMaxWidth = mergeDeviceData(
                frontmatter.value.contentMaxWidth,
                layoutConfig.value.contentMaxWidth,
                defaultConfig.value.CONTENTMAXWIDTH
            );
            let maxWidth: string|undefined = getDeviceSpecificData(mergedMaxWidth);
            
            // Calculate padding
            const mergedPadding = mergeDeviceData(
                frontmatter.value.contentPadding,
                layoutConfig.value.contentPadding,
                defaultConfig.value.CONTENTPADDING
            );
            let padding: string|undefined = getDeviceSpecificData(mergedPadding)
            
            return {
                marginBottom,
                marginTop,
                maxWidth,
                padding
            };
        };
        return undefined;
    });
    // Footer config
    const footerConfig = computed(() => {
        if (["blog", "doc", "page"].includes(layout.value || "")) {
            return mergeFooterData(
                frontmatter.value.footer,
                specificConfig.value.footer,
                layoutConfig.value.footer,
                defaultConfig.value.FOOTER
            );
        };
        return undefined;
    });

    // Aside config
    const asideConfig = computed(() => {
        if (["blog", "doc"].includes(layout.value || "")) {
            // Calculate aside tabs data
            const tabs = mergeAsideTabData(
                frontmatter.value.asideTabs,
                specificConfig.value.asideTabs,
                (layoutConfig.value as VPJBlogLayoutConfig|VPJDocLayoutConfig).asideTabs,
                defaultConfig.value.ASIDETABS
            );

            return {
                tabs
            };
        };
        return undefined;
    });
    // Header config
    const headerConfig = computed(() => {
        if (["blog", "doc"].includes(layout.value || "")) {
            // Calculate header title
            const headerTitle = mergeHeaderTitleTemplateData(
                // @ts-ignore
                ctx.value,
                frontmatter.value.headerTitleTemplate,
                specificConfig.value.headerTitleTemplate,
                (layoutConfig.value as VPJBlogLayoutConfig|VPJDocLayoutConfig).headerTitleTemplate,
                defaultConfig.value.HEADERTITLETEMPLATE
            );
            
            // Calculate header icon
            const headerIcon = mergeSimpleData<false | string | { component: string }, false>(
                (v) => {
                    return typeof v === 'string' ||
                        v === false || 
                        (
                            typeof v === 'object' &&
                            typeof v.component === 'string'
                        )
                },
                false,
                frontmatter.value.headerIcon,
                specificConfig.value.headerIcon,
                (layoutConfig.value as VPJBlogLayoutConfig|VPJDocLayoutConfig).headerIcon,
                defaultConfig.value.HEADERICON
            );
            
            // Calculate github
            const github = mergeGithubLinkData(
                // @ts-ignore
                ctx.value,
                frontmatter.value.github,
                specificConfig.value.github,
                (layoutConfig.value as VPJBlogLayoutConfig|VPJDocLayoutConfig).github,
                defaultConfig.value.GITHUB
            );
            
            // Calculate pdf
            const pdf = mergeDownloadData(
                // @ts-ignore
                ctx.value,
                frontmatter.value.pdf,
                specificConfig.value.pdf,
                (layoutConfig.value as VPJBlogLayoutConfig|VPJDocLayoutConfig).pdf,
                defaultConfig.value.PDF
            );
            
            // Calculate md
            const md = mergeDownloadData(
                // @ts-ignore
                ctx.value,
                frontmatter.value.md,
                specificConfig.value.md,
                (layoutConfig.value as VPJBlogLayoutConfig|VPJDocLayoutConfig).md,
                defaultConfig.value.MD
            );

            // Calculate toolbar button
            const toolbar = mergeToolbarButtonData(
                frontmatter.value.toolbar,
                specificConfig.value.toolbar,
                (layoutConfig.value as VPJBlogLayoutConfig|VPJDocLayoutConfig).toolbar,
                defaultConfig.value.TOOLBAR
            );

            return {
                headerTitle,
                headerIcon,
                github,
                pdf,
                md,
                toolbar
            }
        };
        return undefined;
    });
    // Cover config
    const coverConfig = computed(() => {
        if (["blog", "doc"].includes(layout.value || "")) {
            // Calculate alt
            const alt = mergeSimpleData<false | string, false>(
                (v) => typeof v === 'string' || v === false,
                false,
                frontmatter.value.coverAlt,
                specificConfig.value.coverAlt,
                (layoutConfig.value as VPJBlogLayoutConfig|VPJDocLayoutConfig).coverAlt,
                defaultConfig.value.COVERALT
            );

            // Calculate fade
            const fade = mergeSimpleData<false | number | string, false>(
                (v) => typeof v === 'number' || v === false || typeof v === 'string',
                false,
                frontmatter.value.coverFade,
                specificConfig.value.coverFade,
                (layoutConfig.value as VPJBlogLayoutConfig|VPJDocLayoutConfig).coverFade,
                defaultConfig.value.COVERFADE
            );

            // Calculate height
            const mergedHeight = mergeDeviceData(
                frontmatter.value.coverHeight,
                specificConfig.value.coverHeight,
                (layoutConfig.value as VPJBlogLayoutConfig|VPJDocLayoutConfig).coverHeight,
                defaultConfig.value.COVERHEIGHT,
            );
            let height: string|undefined = getDeviceSpecificData(mergedHeight);

            // Calculate css
            const css: CoverCssConfigData = mergeCoverCssConfig(
                frontmatter.value.coverCss,
                specificConfig.value.coverCss,
                (layoutConfig.value as VPJBlogLayoutConfig|VPJDocLayoutConfig).coverCss,
                defaultConfig.value.COVERCSS
            );

            return {
                alt,
                fade,
                height,
                css
            }
        };
        return undefined;
    });
    // Article footer config
    const articleFooterConfig = computed(() => {
        if (["blog", "doc"].includes(layout.value || "")) {
            // Calculate edit link
            const editLink = mergeEditLinkData(
                // @ts-ignore
                ctx.value,
                frontmatter.value.editLink,
                specificConfig.value.editLink,
                (layoutConfig.value as VPJDocLayoutConfig | VPJBlogLayoutConfig).editLink,
                defaultConfig.value.EDITLINK
            );

            // Calculate next label
            const nextLabel = mergeSimpleData<string | false, false>(
                (v) => typeof v === 'string' || v === false,
                false,
                frontmatter.value.next?.label,
                specificConfig.value.next,
                (layoutConfig.value as VPJDocLayoutConfig | VPJBlogLayoutConfig).next,
                defaultConfig.value.NEXT
            );

            // Calculate prev label
            const prevLabel = mergeSimpleData<string | false, false>(
                (v) => typeof v === 'string' || v === false,
                false,
                frontmatter.value.prev?.label,
                specificConfig.value.prev,
                (layoutConfig.value as VPJDocLayoutConfig | VPJBlogLayoutConfig).prev,
                defaultConfig.value.PREV
            );

            return {
                editLink,
                nextLabel,
                prevLabel
            };
        }
        return undefined;
    });

    // Not found content
    const notFoundContent = computed(() => {
        //  Calculate status icon
        const statusIcon = mergeSimpleData(
            (input: any) => (
                (input === false) ||
                (typeof input === 'string') ||
                (typeof input === 'object' && input && typeof input.component === 'string') ||
                (typeof input === 'object' && input && typeof input.src === 'string')
            ),
            false,
            page.value.isNotFound ? undefined : frontmatter.value.statusIcon,
            notFoundLayoutConfig.value.statusIcon,
            DEFAULT["NOT-FOUND"].STATUSICON
        );

        // Calculate heading
        const heading = mergeSimpleData(
            (input: any) => typeof input === 'string',
            undefined,
            page.value.isNotFound ? undefined : frontmatter.value.heading,
            notFoundLayoutConfig.value.heading,
            DEFAULT["NOT-FOUND"].HEADING
        );

        // Calculate message
        const message = mergeSimpleData(
            (input: any) => typeof input === 'string',
            undefined,
            page.value.isNotFound ? undefined : frontmatter.value.message,
            notFoundLayoutConfig.value.message,
            DEFAULT["NOT-FOUND"].MESSAGE
        );

        // Calculate guidance
        const guidance = [
            page.value.isNotFound ? undefined : frontmatter.value.guidance,
            notFoundLayoutConfig.value.guidance,
            DEFAULT["NOT-FOUND"].GUIDANCE
        ].map((config) => {
            if (typeof config === 'string') {
                return { text: config };
            } else if (config === false) {
                return { link: false }
            } else if (typeof config === 'object' && config) {
                return {
                    text: typeof config.text === 'string' ? config.text : undefined,
                    link: typeof config.link === 'string' ? config.link : undefined,
                };
            } else {
                return {};
            };
        }).reduce((acc, cur) => ({
            link: (typeof cur.link === 'string' || cur.link === false) && acc.link === undefined
                ? cur.link
                : acc.link,
            text: (typeof cur.text === 'string') && acc.text === undefined
                ? cur.text
                : acc.text,
        }), {} as { link?: string | false, text?: string });

        return {
            statusIcon,
            message,
            heading,
            guidance
        };
    });

    return {
        asideCollapsed,
        asideClose,
        asideOpen,
        asideToggle,

        headConfig,
        contentConfig,

        asideConfig,
        coverConfig,
        headerConfig,

        notFoundContent
    };
});