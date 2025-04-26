import { useData } from 'vitepress';
import { Ref, ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';

import { isMobile, isTablet } from '../utils/deviceTypes'
import {
    mergeAsideTabData,
    mergeDeviceData,
    mergeDownloadData,
    mergeGithubLinkData,
    mergeHeaderTitleTemplateData,
    mergeToolbarButtonData
} from '../utils/mergeData';

import type {
    ThemeConfig
} from '../types';
import { useBlogData } from './useBlogData';
import { CoverCssConfig } from '../types/common';


const DEFAULT = {
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
    },
    COVERALT: undefined,
    COVERHEIGHT: "240px",
    COVERFADE: undefined,
    COVERCSS: {
        objectFit: "cover",
        objectPosition: "center center"
    },
    CONTENTMAXWIDTH: {
        mobile: "760px",
        tablet: "760px",
        desktop: "760px"
    },
    CONTENTPADDING: {
        mobile: "1rem",
        tablet: "1rem",
        desktop: "4rem"
    },
}

export const useVPJBlogLayout = defineStore('vpj-layout-blog', () => {
    // Initialize blog layout config
    const {
        frontmatter,
    }: {
        frontmatter: Ref<{[key: string]: any}>
    } = useData();
    
    const {
        ctx,
        layoutConfig,
        seriesConfig
    } = useBlogData();

    // Aside config
    const asideConfig = computed(() => {
        if (frontmatter.value.layout === "blog") {
            // Calculate aside tabs data
            const tabs = mergeAsideTabData(
                frontmatter.value.asideTabs,
                seriesConfig.value.asideTabs,
                layoutConfig.value.asideTabs,
                DEFAULT.ASIDETABS
            );
            return {
                tabs
            }
        };
        return undefined;
    });

    // Header config
    const headerConfig = computed(() => {
        if (frontmatter.value.layout === "blog") {
            // Calculate header title
            const hedaerTitle = mergeHeaderTitleTemplateData(
                // @ts-ignore
                ctx.value,
                frontmatter.value.headerTitleTemplate,
                seriesConfig.value.headerTitleTemplate,
                layoutConfig.value.headerTitleTemplate,
                DEFAULT.HEADERTITLETEMPLATE
            );

            // Calculate header icon
            const heaedrIcon = [
                frontmatter.value.headerIcon,
                seriesConfig.value.headerIcon,
                layoutConfig.value.headerIcon,
                DEFAULT.HEADERICON
            ].map((input) => {
                if (typeof input === 'string') {
                    return input;
                } else if (typeof input === 'object' && typeof input.component) {
                    return { component: input.component };
                } else {
                    return undefined
                };
            }).find((value) => value !== undefined);

            // Calculate github
            const github = mergeGithubLinkData(
                // @ts-ignore
                ctx.value,
                frontmatter.value.github,
                seriesConfig.value.github,
                layoutConfig.value.github,
                DEFAULT.GITHUB
            );

            // Calculate pdf
            const pdf = mergeDownloadData(
                // @ts-ignore
                ctx.value,
                frontmatter.value.pdf,
                seriesConfig.value.pdf,
                layoutConfig.value.pdf,
                DEFAULT.PDF
            );

            // Calculate md
            const md = mergeDownloadData(
                // @ts-ignore
                ctx.value,
                frontmatter.value.md,
                seriesConfig.value.md,
                layoutConfig.value.md,
                DEFAULT.MD
            );

            // Calculate toolbar button
            const toolbar = mergeToolbarButtonData(
                frontmatter.value.toolbar,
                seriesConfig.value.toolbar,
                layoutConfig.value.toolbar,
                DEFAULT.TOOLBAR
            );
            return {
                hedaerTitle,
                heaedrIcon,
                github,
                pdf,
                md,
                toolbar
            }
        };
        return undefined;
    });

    // Content config
    const contentConfig = computed(() => {
        if (frontmatter.value.layout === "blog") {
            // Calculate max width
            const themeMaxWidth = layoutConfig.value.contentMaxWidth;
            const frontmatterMaxWidth = frontmatter.value.contentMaxWidth;
            const mergeMaxWidth = mergeDeviceData(frontmatterMaxWidth, themeMaxWidth, DEFAULT.CONTENTMAXWIDTH);
            // Calculate padding
            const themePadding = layoutConfig.value.contentPadding;
            const frontmatterPadding = frontmatter.value.contentPadding;
            const mergePadding = mergeDeviceData(frontmatterPadding, themePadding, DEFAULT.CONTENTPADDING);
            // Determine the current device type
            if (isMobile.value) {
                return {
                    maxWidth: mergeMaxWidth.mobile,
                    padding: mergePadding.mobile
                };
            } else if (isTablet.value) {
                return {
                    maxWidth: mergeMaxWidth.tablet,
                    padding: mergePadding.tablet
                };
            } else {
                return {
                    maxWidth: mergeMaxWidth.desktop,
                    padding: mergePadding.desktop
                };
            };
        };
        return undefined;
    });

    // Cover config
    const coverConfig = computed(() => {
        if (frontmatter.value.layout === "blog") {
            // Calculate alt
            const alt: string | undefined = [
                frontmatter.value.coverAlt,
                seriesConfig.value.coverAlt,
                layoutConfig.value.coverAlt,
                DEFAULT.COVERALT,
            ].map((input) => typeof input === 'string' ? input : undefined)
            .find((value) => value !== undefined);

            // Calculate fade
            const fade: number | undefined = [
                frontmatter.value.coverFade,
                seriesConfig.value.coverFade,
                layoutConfig.value.coverFade,
                DEFAULT.COVERFADE
            ].map((input) => input ? (isNaN(Number(input)) ? undefined : Number(input)) : undefined)
            .find((value) => value !== undefined);

            // Calculate height
            const height: string | undefined = [
                frontmatter.value.coverHeight,
                seriesConfig.value.coverHeight,
                layoutConfig.value.coverHeight,
                DEFAULT.COVERHEIGHT,
            ].map((input) => typeof input === 'string' ? input : "")
            .find((value) => value !== undefined);

            // Calculate css
            const css: CoverCssConfig = [
                frontmatter.value.coverCss,
                seriesConfig.value.coverCss,
                layoutConfig.value.coverCss,
                DEFAULT.COVERCSS
            ].reduce((acc: CoverCssConfig, cur: CoverCssConfig) => {
                if (!cur) return acc;

                Object.entries(cur).forEach(([key, value]) => {
                    if (key === "padding") {
                        acc[key] = mergeDeviceData(acc[key], value);
                    } else {
                        acc[key] = (typeof acc[key] === 'string' || typeof value !== 'string')
                            ? acc[key]
                            : value;
                    }
                })
                return acc;
            }, {} as CoverCssConfig);

            return {
                alt,
                fade,
                height,
                css
            }
        };
        return undefined;
    });

    // state
    const asideCollapsed: Ref<boolean> = ref(true);
    function asideToggle(): void {
        asideCollapsed.value = !asideCollapsed.value;
    };
    function asideClose(): void {
        asideCollapsed.value = true;
    };
    function asideOpen(): void {
        asideCollapsed.value = false;
    };
    

    return {
        asideConfig,
        contentConfig,
        headerConfig,
        coverConfig,
        asideCollapsed,
        asideToggle,
        asideClose,
        asideOpen
    };
})