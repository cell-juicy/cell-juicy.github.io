<script setup>
import { Content, useData } from 'vitepress';
import { computed, provide } from 'vue';

import { mergeDeviceData } from '../utils/mergeData'
import { isMobile, isTablet } from '../utils/deviceTypes';
import { VPJ_PAGE_LAYOUT_SYMBOL } from '../utils/symbols';


const { theme, frontmatter } = useData();
const DEFAULT = {
    GUTTER: {
        mobile: "1.5rem",
        tablet: "1.5rem",
        desktop: "4rem"
    },
    WIDTH: {
        mobile: "61.25rem",
        tablet: "61.25rem",
        desktop: "61.25rem"
    }
};

// calculate gutter data
const themeGutter = computed(() => theme.value.layouts?.page?.contentGutter);
const frontmatterGutter = computed(() => frontmatter.value.contentGutter);
const computedGutter = computed(() => {
    const merge = mergeDeviceData(frontmatterGutter.value, themeGutter.value, DEFAULT.GUTTER);
    if (isMobile.value) return merge.mobile;
    if (isTablet.value) return merge.tablet;
    return merge.desktop;
})
// calculate width data
const themeWidth = computed(() =>theme.value.layouts?.page?.contentWidth);
const frontmatterWidth = computed(() => frontmatter.value.contentWidth);
const computedWidth = computed(() => {
    const merge = mergeDeviceData(frontmatterWidth.value, themeWidth.value, DEFAULT.WIDTH);
    if (isMobile.value) return merge.mobile;
    if (isTablet.value) return merge.tablet;
    return merge.desktop;
})


provide(VPJ_PAGE_LAYOUT_SYMBOL, {
    computedGutter,
    computedWidth
});
</script>


<template>
    <div class="vpj-layout-page">
        <div class="vpj-layout-page__hero-iamge"/>
        <slot name="page-top"/>
        <div class="vpj-layout-page__grid-layout">
            <div class="vpj-layout-page__gutter-left">
                <slot name="page-gutter-left"/>
            </div>
            <slot>
                <Content class="vpj-layout-page__content vpj-markdown"/>
            </slot>
            <div class="vpj-layout-page__gutter-right">
                <slot name="page-gutter-right"/>
            </div>
        </div>
        <slot name="page-bottom"/>
    </div>
</template>


<style scoped>
    /* Main layout */
    .vpj-layout-page {
        background-color: var(--vpj-color-bg-100);
        height: 100%;
        overflow: auto;
        scrollbar-color: var(--vpj-color-text-100) var(--vpj-color-bg-200);
        scrollbar-gutter: auto;
        width: 100%;
    }

    .vpj-layout-page__hero-iamge {
        min-height: 0;
        width: 100%;
    }

    /* Grid layout */
    .vpj-layout-page__grid-layout {
        display: grid;
        grid-template-columns:
            minmax(min(v-bind(computedGutter), 100%), 1fr)
            minmax(min(calc(2 * v-bind(computedGutter)), 100%), v-bind(computedWidth))
            minmax(min(v-bind(computedGutter), 100%), 1fr);
        min-height: 0;
        width: 100%;
    }

    .vpj-layout-page__gutter-left {
        grid-column: 1;
        min-height: 0;
        width: 100%;
    }

    .vpj-layout-page__gutter-right {
        grid-column: 3;
        min-height: 0;
        width: 100%;
    }

    /* Content */
    .vpj-layout-page__content {
        grid-column: 2;
        min-height: 0;
        padding-bottom: 2.5rem;
        width: 100%;
    }
</style>