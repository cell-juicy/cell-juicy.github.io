import { useData } from 'vitepress';
import { Ref, ref, computed } from 'vue';
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
    mergeToolbarButtonData
} from '../utils/mergeData';

import { useDocData } from './useDocData';
import { CoverCssConfigData } from '../types/common';


const DEFAULT = {
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
};

export const useVPJDocLayout = defineStore('vpj-layout-doc', () => {
    // Initialize doc layout config
    const {
        frontmatter,
    }: {
        frontmatter: Ref<{[key: string]: any}>
    } = useData();
    
    const {
        ctx,
        layoutConfig,
        spaceConfig
    } = useDocData();

    // Aside config
    const asideConfig = computed(() => {
        if (frontmatter.value.layout === "doc") {
            // Calculate aside tabs data
            const tabs = mergeAsideTabData(
                frontmatter.value.asideTabs,
                spaceConfig.value.asideTabs,
                layoutConfig.value.asideTabs,
                DEFAULT.ASIDETABS
            );

            return {
                tabs
            };
        };
        return undefined;
    });

    // Header config
    const headerConfig = computed(() => {
        if (frontmatter.value.layout === "doc") {
            // Calculate header title
            const headerTitle = mergeHeaderTitleTemplateData(
                // @ts-ignore
                ctx.value,
                frontmatter.value.headerTitleTemplate,
                spaceConfig.value.headerTitleTemplate,
                layoutConfig.value.headerTitleTemplate,
                DEFAULT.HEADERTITLETEMPLATE
            );
            
            // Calculate header icon
            const headerIcon = mergeSimpleData<false | string | { component: string }>(
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
                spaceConfig.value.headerIcon,
                layoutConfig.value.headerIcon,
                DEFAULT.HEADERICON
            );
            
            // Calculate github
            const github = mergeGithubLinkData(
                // @ts-ignore
                ctx.value,
                frontmatter.value.github,
                spaceConfig.value.github,
                layoutConfig.value.github,
                DEFAULT.GITHUB
            );
            
            // Calculate pdf
            const pdf = mergeDownloadData(
                // @ts-ignore
                ctx.value,
                frontmatter.value.pdf,
                spaceConfig.value.pdf,
                layoutConfig.value.pdf,
                DEFAULT.PDF
            );
            
            // Calculate md
            const md = mergeDownloadData(
                // @ts-ignore
                ctx.value,
                frontmatter.value.md,
                spaceConfig.value.md,
                layoutConfig.value.md,
                DEFAULT.MD
            );

            // Calculate toolbar button
            const toolbar = mergeToolbarButtonData(
                frontmatter.value.toolbar,
                spaceConfig.value.toolbar,
                layoutConfig.value.toolbar,
                DEFAULT.TOOLBAR
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

    // Content config
    const contentConfig = computed(() => {
        if (frontmatter.value.layout === "doc") {
            // Calculate margin bottom
            const mergedMarginBottom = mergeDeviceData(
                frontmatter.value.contentMarginBottom,
                layoutConfig.value.contentMarginBottom,
                DEFAULT.CONTENTMARGINBOTTOM
            );
            let marginBottom: string | undefined;
            if (isMobile.value) {marginBottom = mergedMarginBottom.mobile}
            else if (isTablet.value) {marginBottom = mergedMarginBottom.tablet}
            else {marginBottom = mergedMarginBottom.desktop};
            
            // Calculate margin top
            const mergedMarginTop = mergeDeviceData(
                frontmatter.value.contentMarginTop,
                layoutConfig.value.contentMarginTop,
                DEFAULT.CONTENTMARGINTOP
            );
            let marginTop: string | undefined;
            if (isMobile.value) {marginTop = mergedMarginTop.mobile}
            else if (isTablet.value) {marginTop = mergedMarginTop.tablet}
            else {marginTop = mergedMarginTop.desktop};
            
            // Calculate max width
            const mergedMaxWidth = mergeDeviceData(
                frontmatter.value.contentMaxWidth,
                layoutConfig.value.contentMaxWidth,
                DEFAULT.CONTENTMAXWIDTH
            );
            let maxWidth: string | undefined;
            if (isMobile.value) {maxWidth = mergedMaxWidth.mobile}
            else if (isTablet.value) {maxWidth = mergedMaxWidth.tablet}
            else {maxWidth = mergedMaxWidth.desktop};
            
            // Calculate padding
            const mergedPadding = mergeDeviceData(
                frontmatter.value.contentPadding,
                layoutConfig.value.contentPadding,
                DEFAULT.CONTENTPADDING
            );
            let padding: string | undefined;
            if (isMobile.value) {padding = mergedPadding.mobile}
            else if (isTablet.value) {padding = mergedPadding.tablet}
            else {padding = mergedPadding.desktop};
            
            return {
                marginBottom,
                marginTop,
                maxWidth,
                padding
            };
        };
        return undefined;
    });

    // Cover config
    const coverConfig = computed(() => {
        if (frontmatter.value.layout === "doc") {
            // Calculate alt
            const alt = mergeSimpleData<false | string>(
                (v) => typeof v === 'string' || v === false,
                false,
                frontmatter.value.coverAlt,
                spaceConfig.value.coverAlt,
                layoutConfig.value.coverAlt,
                DEFAULT.COVERALT
            );

            // Calculate fade
            const fade = mergeSimpleData<false | number | string>(
                (v) => typeof v === 'number' || v === false || typeof v === 'string',
                false,
                frontmatter.value.coverFade,
                spaceConfig.value.coverFade,
                layoutConfig.value.coverFade,
                DEFAULT.COVERFADE
            );;

            // Calculate height
            const mergedHeight = mergeDeviceData(
                frontmatter.value.coverHeight,
                spaceConfig.value.coverHeight,
                layoutConfig.value.coverHeight,
                DEFAULT.COVERHEIGHT,
            );
            let height: string | undefined
            if (isMobile.value) {height = mergedHeight.mobile}
            else if (isTablet.value) {height = mergedHeight.tablet}
            else {height = mergedHeight.desktop};

            // Calculate css
            const css: CoverCssConfigData = mergeCoverCssConfig(
                frontmatter.value.coverCss,
                spaceConfig.value.coverCss,
                layoutConfig.value.coverCss,
                DEFAULT.COVERCSS
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