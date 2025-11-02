import { useData } from 'vitepress';
import { ref, computed, readonly } from 'vue';
import { defineStore } from 'pinia';

import { isObject } from '../utils/common';
import { getDeviceSpecificData } from '../utils/deviceTypes';
import {
    asideTabMerger,
    coverCssConfigMerger,
    deviceSpecificSMerger,
    deviceSpecificBNormalizer,
    toolbarDownloadMerger,
    toolbarGithubMerger,
    headerTitleMeger,
    simpleMerger,
    titleMeger,
    toolbarButtonMerger,
    footerMerger,
    editLinkMerger,
    timeLabelMerger,
    toolbarFeatureMerger,
} from '../utils/mergeData';

import { useVPJData } from './useVPJData';

import type { Ref, ComputedRef } from 'vue';
import type { SiteData, PageData } from 'vitepress';
import type { ThemeConfig } from '../types';
import type { CoverCssConfigData, ImageData } from '../types/common';
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
        CONTENTMARGINBOTTOM: "2.5rem",
        CONTENTMARGINTOP: "1.5rem",
        CONTENTMAXWIDTH: "61.25rem",
        CONTENTPADDING: {
            mobile: "2.2rem",
            tablet: "2.2rem",
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
        HISTORY: {
            enabled: true,
            tooltip: "查看历史记录"
        },
        ASIDETABS: {
            series: {name: "系列", component: "VPJArticleAsideSeriesPage", order: 0},
            tags: {name: "标签", component: "VPJArticleAsideTagsPage", order: 0},
            outline: {name: "大纲", component: "VPJArticleAsideOutlinePage", order: 0},
        },
        COVERALT: undefined,
        COVERHEIGHT: "240px",
        COVERFADE: undefined,
        COVERCSS: {
            objectFit: "cover",
            objectPosition: "center center"
        },
        CONTENTMARGINBOTTOM: "2.5rem",
        CONTENTMARGINTOP: "1.5rem",
        CONTENTMAXWIDTH: "760px",
        CONTENTPADDING: {
            mobile: "2.2rem",
            tablet: "2.2rem",
            desktop: "4rem"
        },
        FOOTER: undefined,
        EDITLINK: undefined,
        NEXT: "Next",
        PREV: "Previous",
        TIMELABEL: undefined,
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
        HISTORY: {
            enabled: true,
            tooltip: "查看历史记录"
        },
        ASIDETABS: {
            tree: {name: "目录", component: "VPJArticleAsideTreePage", order: 0},
            resources: {name: "资源", component: "VPJArticleAsideResourcesPage", order: 0},
            outline: {name: "大纲", component: "VPJArticleAsideOutlinePage", order: 0},
        },
        COVERALT: undefined,
        COVERHEIGHT: "300px",
        COVERFADE: undefined,
        COVERCSS: {
            objectFit: "cover",
            objectPosition: "center center"
        },
        CONTENTMARGINBOTTOM: "2.5rem",
        CONTENTMARGINTOP: "1.5rem",
        CONTENTMAXWIDTH: "820px",
        CONTENTPADDING: {
            mobile: "2.2rem",
            tablet: "2.2rem",
            desktop: "4rem"
        },
        FOOTER: undefined,
        EDITLINK: undefined,
        NEXT: "Next",
        PREV: "Previous",
        TIMELABEL: undefined,
    },
};

const PANEL_TAB = ["history", "comment"] as const;
type PANEL_TAB_TYPE = typeof PANEL_TAB[number];

export const useVPJLayout = defineStore("vpj-layout", () => {
    const { page, frontmatter, theme, site }: {
        page: Ref<PageData, PageData>
        frontmatter: Ref<Record<string, any>, Record<string, any>>,
        theme: Ref<ThemeConfig, ThemeConfig>,
        site: Ref<SiteData<ThemeConfig>, SiteData<ThemeConfig>>
    } = useData();
    const {
        ctx,
        lastUpdated,
        createdAt,
        space,
        series
    } = useVPJData();
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
        // @ts-ignore
        if (layout.value) return DEFAULT[layout.value.toUpperCase()];
        return {};
    });
    const layoutConfig: ComputedRef<VPJBlogLayoutConfig|VPJDocLayoutConfig|VPJPageLayoutConfig> = computed(() => {
        const layouts = isObject(theme.value.layouts) ? theme.value.layouts : {};
        switch (layout.value) {
            case "page": return isObject(layouts.page) ? layouts.page : {};
            case "doc":  return isObject(layouts.doc)  ? layouts.doc  : {};
            case "blog": return isObject(layouts.blog) ? layouts.blog : {};
            case "not-found": return isObject(layouts.notFound) ? layouts.notFound : {};
            default: return {};
        };
    });
    const specificConfig = computed(() => {
        switch (layout.value) {
            case "doc":
                if (!space.value) return {};
                return isObject(theme.value.doc?.[space.value]) ? theme.value.doc[space.value] : {};
            case "blog":
                if (!series.value) return {};
                return isObject(theme.value.blog?.[series.value]) ? theme.value.blog[series.value] : {};
            default:
                return {};
        };
    });

    // state
    const asideCConfig = getDeviceSpecificData(deviceSpecificBNormalizer(theme.value.asideCollapsed));
    const asideCollapsed: Ref<boolean> = ref(typeof asideCConfig === 'boolean' ? asideCConfig : true);
    function asideToggle(): void { asideCollapsed.value = !asideCollapsed.value; };
    function asideClose(): void { asideCollapsed.value = true; };
    function asideOpen(): void { asideCollapsed.value = false; };

    const panelCollapsed: Ref<boolean> = ref(true);
    const panelTab: Ref<PANEL_TAB_TYPE | undefined> = ref(undefined);
    function panelToggle(tab: PANEL_TAB_TYPE): void {
        if (PANEL_TAB.includes(tab) && panelCollapsed.value === true) {
            panelOpen(tab);
        } else {
            panelClose();
        };
    };
    function panelClose(): void {
        panelTab.value = undefined;
        panelCollapsed.value = true;
    }
    function panelOpen(tab: PANEL_TAB_TYPE): void {
        if (PANEL_TAB.includes(tab)) {
            panelTab.value = tab;
            panelCollapsed.value = false;
        };
    }

    // Head config
    const headConfig = computed(() => {
        const link: Array<any> = [];
        const meta: Array<any> = [];

        // Calculate title
        const mergedTitle = titleMeger(
            ctx.value,
            site.value,
            page.value,
            (page.value.isNotFound) ? undefined : frontmatter.value.titleTemplate,
            specificConfig.value.titleTemplate,
            layoutConfig.value.titleTemplate
        );

        // Calculate favicon
        const mergedFavicon = simpleMerger<ImageData, undefined>(
            (input): input is ImageData => typeof input === 'string' || (typeof input === 'object' && input  && typeof input.src === 'string'),
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
        const mergedDescription = simpleMerger(
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
            const mergedMarginBottom = deviceSpecificSMerger(
                frontmatter.value.contentMarginBottom,
                layoutConfig.value.contentMarginBottom,
                defaultConfig.value.CONTENTMARGINBOTTOM
            );
            let marginBottom: string|undefined = getDeviceSpecificData(mergedMarginBottom);
            
            // Calculate margin top
            const mergedMarginTop = deviceSpecificSMerger(
                frontmatter.value.contentMarginTop,
                layoutConfig.value.contentMarginTop,
                defaultConfig.value.CONTENTMARGINTOP
            );
            let marginTop: string|undefined = getDeviceSpecificData(mergedMarginTop);
            
            // Calculate max width
            const mergedMaxWidth = deviceSpecificSMerger(
                frontmatter.value.contentMaxWidth,
                layoutConfig.value.contentMaxWidth,
                defaultConfig.value.CONTENTMAXWIDTH
            );
            let maxWidth: string|undefined = getDeviceSpecificData(mergedMaxWidth);
            
            // Calculate padding
            const mergedPadding = deviceSpecificSMerger(
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
            return footerMerger(
                frontmatter.value.footer,
                specificConfig.value.footer,
                layoutConfig.value.footer,
                theme.value.footer,
                defaultConfig.value.FOOTER
            );
        };
        return undefined;
    });

    // Aside config
    const asideConfig = computed(() => {
        if (["blog", "doc"].includes(layout.value || "")) {
            // Calculate aside tabs data
            const tabs = asideTabMerger(
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
            const headerTitle = headerTitleMeger(
                // @ts-ignore
                ctx.value,
                frontmatter.value.headerTitleTemplate,
                specificConfig.value.headerTitleTemplate,
                (layoutConfig.value as VPJBlogLayoutConfig|VPJDocLayoutConfig).headerTitleTemplate,
                defaultConfig.value.HEADERTITLETEMPLATE
            );
            
            // Calculate header icon
            const headerIcon = simpleMerger<false | string | { component: string }, false>(
                (v): v is string | {component: string} => {
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
            const github = toolbarGithubMerger(
                // @ts-ignore
                ctx.value,
                frontmatter.value.github,
                specificConfig.value.github,
                (layoutConfig.value as VPJBlogLayoutConfig|VPJDocLayoutConfig).github,
                defaultConfig.value.GITHUB
            );
            
            // Calculate pdf
            const pdf = toolbarDownloadMerger(
                // @ts-ignore
                ctx.value,
                frontmatter.value.pdf,
                specificConfig.value.pdf,
                (layoutConfig.value as VPJBlogLayoutConfig|VPJDocLayoutConfig).pdf,
                defaultConfig.value.PDF
            );
            
            // Calculate md
            const md = toolbarDownloadMerger(
                // @ts-ignore
                ctx.value,
                frontmatter.value.md,
                specificConfig.value.md,
                (layoutConfig.value as VPJBlogLayoutConfig|VPJDocLayoutConfig).md,
                defaultConfig.value.MD
            );

            // Calculate toolbar button
            const toolbar = toolbarButtonMerger(
                frontmatter.value.toolbar,
                specificConfig.value.toolbar,
                (layoutConfig.value as VPJBlogLayoutConfig|VPJDocLayoutConfig).toolbar,
                defaultConfig.value.TOOLBAR
            );

            // Calculate history button
            const history = toolbarFeatureMerger(
                frontmatter.value.history,
                specificConfig.value.history,
                (layoutConfig.value as VPJBlogLayoutConfig|VPJDocLayoutConfig).history,
                defaultConfig.value.HISTORY
            );

            return {
                headerTitle,
                headerIcon,
                github,
                pdf,
                md,
                toolbar,
                history
            }
        };
        return undefined;
    });
    // Cover config
    const coverConfig = computed(() => {
        if (["blog", "doc"].includes(layout.value || "")) {
            // Calculate alt
            const alt = simpleMerger<false | string, false>(
                (v): v is string | false => typeof v === 'string' || v === false,
                false,
                frontmatter.value.coverAlt,
                specificConfig.value.coverAlt,
                (layoutConfig.value as VPJBlogLayoutConfig|VPJDocLayoutConfig).coverAlt,
                defaultConfig.value.COVERALT
            );

            // Calculate fade
            const fade = simpleMerger<false | number | string, false>(
                (v): v is number|false|string => typeof v === 'number' || v === false || typeof v === 'string',
                false,
                frontmatter.value.coverFade,
                specificConfig.value.coverFade,
                (layoutConfig.value as VPJBlogLayoutConfig|VPJDocLayoutConfig).coverFade,
                defaultConfig.value.COVERFADE
            );

            // Calculate height
            const mergedHeight = deviceSpecificSMerger(
                frontmatter.value.coverHeight,
                specificConfig.value.coverHeight,
                (layoutConfig.value as VPJBlogLayoutConfig|VPJDocLayoutConfig).coverHeight,
                defaultConfig.value.COVERHEIGHT,
            );
            let height: string|undefined = getDeviceSpecificData(mergedHeight);

            // Calculate css
            const css: CoverCssConfigData = coverCssConfigMerger(
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
    const articleMetaConfig = computed(() => {
        if (["blog", "doc"].includes(layout.value || "")) {
            // Calculate edit link
            const editLink = editLinkMerger(
                // @ts-ignore
                ctx.value,
                frontmatter.value.editLink,
                specificConfig.value.editLink,
                (layoutConfig.value as VPJDocLayoutConfig | VPJBlogLayoutConfig).editLink,
                theme.value.editLink,
                defaultConfig.value.EDITLINK
            );

            // Calculate time label
            const timeLabel = timeLabelMerger(
                lastUpdated.value,
                createdAt.value,
                frontmatter.value.timeLabel,
                specificConfig.value.timeLabel,
                (layoutConfig.value as VPJDocLayoutConfig | VPJBlogLayoutConfig).timeLabel,
                theme.value.timeLabel,
                defaultConfig.value.TIMELABEL
            );

            // Calculate next label
            const nextLabel = simpleMerger<string | false, false>(
                (v): v is string | false => typeof v === 'string' || v === false,
                false,
                frontmatter.value.next?.label,
                specificConfig.value.next,
                (layoutConfig.value as VPJDocLayoutConfig | VPJBlogLayoutConfig).next,
                theme.value.next,
                defaultConfig.value.NEXT
            );

            // Calculate prev label
            const prevLabel = simpleMerger<string | false, false>(
                (v): v is string | false => typeof v === 'string' || v === false,
                false,
                frontmatter.value.prev?.label,
                specificConfig.value.prev,
                (layoutConfig.value as VPJDocLayoutConfig | VPJBlogLayoutConfig).prev,
                theme.value.prev,
                defaultConfig.value.PREV
            );

            return {
                editLink,
                timeLabel,
                nextLabel,
                prevLabel
            };
        }
        return undefined;
    });

    // Not found content
    const notFoundContent = computed(() => {
        //  Calculate status icon
        const statusIcon = simpleMerger(
            (input: any): input is ImageData | {component: string} => (
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
        const heading = simpleMerger(
            (input: any) => typeof input === 'string',
            undefined,
            page.value.isNotFound ? undefined : frontmatter.value.heading,
            notFoundLayoutConfig.value.heading,
            DEFAULT["NOT-FOUND"].HEADING
        );

        // Calculate message
        const message = simpleMerger(
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
        asideCollapsed: readonly(asideCollapsed),
        asideClose,
        asideOpen,
        asideToggle,

        panelCollapsed: readonly(panelCollapsed),
        panelTab: readonly(panelTab),
        panelClose,
        panelOpen,
        panelToggle,

        headConfig,
        contentConfig,

        asideConfig,
        coverConfig,
        headerConfig,

        footerConfig,
        articleMetaConfig,

        notFoundContent
    };
});