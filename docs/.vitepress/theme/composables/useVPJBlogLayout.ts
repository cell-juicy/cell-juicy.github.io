import { useData } from 'vitepress';
import { Ref, ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';

import {mergeDeviceData, isMobile, isTablet} from '../utils/deviceTypes'

import type {
    VPJBlogLayoutConfig
} from '../types/layoutBlog';
import type {
    AsideTabData
} from '../types/common';
import type {
    ThemeConfig
} from '../types';


// Transfrom user input to triple device data
function initializeTripleDeviceData(
    input:
        | string
        | { mobile?: string; tablet?: string; desktop?: string },
    defaults:
        | { mobile: string; tablet: string; desktop: string }
): { mobile: string; tablet: string; desktop: string } {
    if (typeof input === 'string') {
        return {
            mobile: input,
            tablet: input,
            desktop: input
        };
    } else if (typeof input === 'object') {
        return {
            mobile: input.mobile ?? defaults.mobile,
            tablet: input.tablet ?? defaults.tablet,
            desktop: input.desktop ?? defaults.desktop
        };
    }
    return defaults;
};

const DEFAULT = {
    MAXWIDTH: {
        mobile: "760px",
        tablet: "760px",
        desktop: "760px"
    },
    PADDING: {
        mobile: "1rem",
        tablet: "1rem",
        desktop: "4rem"
    },
}

export const useVPJBlogLayout = defineStore('vpj-layout-blog', () => {
    // Initialize blog layout config
    const {
        theme,
        frontmatter,
    }: {
        theme: Ref<ThemeConfig>,
        frontmatter: Ref<{[key: string]: any}>
    } = useData();
    
    const layoutBlog: Ref<VPJBlogLayoutConfig> = ref(theme.value.layouts?.blog || {});
    watch(theme, (next, prev) => {
        if (JSON.stringify(next) !== JSON.stringify(prev)) {
            layoutBlog.value = theme.value.layouts?.blog || {};
        };   
    });

    // Aside tabs
    const asideTabsConfig = computed(() => {
        if (Array.isArray(layoutBlog.value.asideTabs)) {
            return layoutBlog.value.asideTabs?.filter((tabRawData) => {
                return typeof tabRawData === "object" &&
                    (typeof tabRawData.name === "string" || tabRawData.name === undefined) &&
                    (typeof tabRawData.component === "string" || tabRawData.component === null)
            }).map((raw) => {
                const name = raw.name || raw.component || undefined;
                const component = raw.component;
                return {
                    name,
                    component
                }
            }) || []
        } else {
            return []
        }
    })

    // Cover config
    const coverConfig = computed(() => {
        const computedHeight = typeof layoutBlog.value.coverHeight === "string" ?
            layoutBlog.value.coverHeight :
            "240px";
        const computedFade = typeof layoutBlog.value.coverFade === "string" ?
            layoutBlog.value.coverFade :
            undefined
        const computedCss = typeof layoutBlog.value.coverCss === "object" ?
            {
                boxShadow: typeof layoutBlog.value.coverCss.boxShadow === "string" ?
                    layoutBlog.value.coverCss.boxShadow :
                    undefined,
                filter: typeof layoutBlog.value.coverCss.filter === "string" ?
                    layoutBlog.value.coverCss.filter :
                    undefined,
                maskImage: typeof layoutBlog.value.coverCss.maskImage === "string" ?
                    layoutBlog.value.coverCss.maskImage :
                    undefined,
                objectFit: typeof layoutBlog.value.coverCss.objectFit === "string" ?
                    layoutBlog.value.coverCss.objectFit :
                    "cover",
                objectPosition: typeof layoutBlog.value.coverCss.objectPosition === "string" ?
                    layoutBlog.value.coverCss.objectPosition :
                    "center center",
                opacity: typeof layoutBlog.value.coverCss.opacity === "string" ?
                    layoutBlog.value.coverCss.opacity :
                    "100%",
                padding: typeof layoutBlog.value.coverCss.padding === "string" ?
                    initializeTripleDeviceData(
                        layoutBlog.value.coverCss.padding,
                        {mobile: "0", tablet: "0", desktop: "0"}
                    ) :
                    undefined,
                transform: typeof layoutBlog.value.coverCss.transform === "string" ?
                    layoutBlog.value.coverCss.transform :
                    undefined,
                transition: typeof layoutBlog.value.coverCss.transition === "string" ?
                    layoutBlog.value.coverCss.transition :
                    undefined,
            } : {}

        return {
            height: computedHeight,
            fade: computedFade,
            css: computedCss,
        }
    })

    // Content config
    const contentConfig = computed(() => {
        // Calculate max width
        const themeMaxWidth = theme.value.layouts?.blog?.contentMaxWidth;
        const frontmatterMaxWidth = frontmatter.value.contentMaxWidth;
        const mergeMaxWidth = mergeDeviceData(frontmatterMaxWidth, themeMaxWidth, DEFAULT.MAXWIDTH);
        // Calculate padding
        const themePadding = theme.value.layouts?.blog?.contentPadding;
        const frontmatterPadding = frontmatter.value.contentPadding;
        const mergePadding = mergeDeviceData(frontmatterPadding, themePadding, DEFAULT.PADDING);
        // Determine the current device type
        if (isMobile.value) {
            return {
                maxWidth: mergeMaxWidth.mobile,
                padding: mergePadding.mobile
            }
        } else if (isTablet.value) {
            return {
                maxWidth: mergeMaxWidth.tablet,
                padding: mergePadding.tablet
            }
        } else {
            return {
                maxWidth: mergeMaxWidth.desktop,
                padding: mergePadding.desktop
            }
        }
    })

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
        asideTabsConfig,
        coverConfig,
        contentConfig,
        asideCollapsed,
        asideToggle,
        asideClose,
        asideOpen
    }
})