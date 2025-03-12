<script setup>
import { Content, useData } from 'vitepress';
import { computed, provide } from 'vue';
import { isMobile, isTablet } from '../utils/deviceTypes';
import { VPJ_PAGE_LAYOUT_SYMBOL } from '../utils/symbols';


function raw2Data(raw) {
    if (typeof raw === 'string') {
        return {mobile: raw, tablet: raw, desktop: raw}
    } else if (typeof raw === 'object') {
        return {mobile: raw.mobile, tablet: raw.tablet, desktop: raw.desktop}
    } else {
        return {}
    };
};

function resolveMerge(merge) {
    if (merge.mobile === merge.tablet && merge.tablet === merge.desktop) {
        return merge.mobile
    };
    return merge;
}

function merge2Computed(merge) {
    if (typeof merge === 'string') {
        return computed(() => merge)
    } else if (typeof merge === 'object') {
        return computed(() => {
            if (isMobile.value) return merge.mobile
            if (isTablet.value) return merge.tablet
            return merge.desktop
        })
    }
};


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
// evaluate gutter data
const themeGutter = raw2Data(theme.value.layouts?.page?.contentGutter);
const frontmatterGutter = raw2Data(frontmatter.value.contentGutter);
const mergeGutterData = resolveMerge({
    mobile: frontmatterGutter.mobile || themeGutter.mobile || DEFAULT.GUTTER.mobile,
    tablet: frontmatterGutter.tablet || themeGutter.tablet || DEFAULT.GUTTER.tablet,
    desktop: frontmatterGutter.desktop || themeGutter.desktop || DEFAULT.GUTTER.desktop
});
const computedGutter = merge2Computed(mergeGutterData);
// evaluate width data
const themeWidth = raw2Data(theme.value.layouts?.page?.contentWidth);
const frontmatterWidth = raw2Data(frontmatter.value.contentWidth);
const mergeWidthData = resolveMerge({
    mobile: frontmatterWidth.mobile || themeWidth.mobile || DEFAULT.WIDTH.mobile,
    tablet: frontmatterWidth.tablet || themeWidth.tablet || DEFAULT.WIDTH.tablet,
    desktop: frontmatterWidth.desktop || themeWidth.desktop || DEFAULT.WIDTH.desktop
});
const computedWidth = merge2Computed(mergeWidthData);


provide(VPJ_PAGE_LAYOUT_SYMBOL, {
    computedGutter,
    computedWidth
});
</script>


<template>
    <div class="vpj-layout-page vpj-scroll-y vpj-scroll-x">
        <div class="vpj-layout-page__hero-iamge"/>
        <div class="vpj-layout-page__grid-layout">
            <slot>
                <Content class="vpj-layout-page__content"/>
            </slot>
        </div>
    </div>
</template>


<style scoped>
    /* Main layout */
    .vpj-layout-page {
        background-color: var(--vpj-color-bg-100);
        scrollbar-gutter: auto;
        height: 100%;
        width: 100%;
    }

    .vpj-layout-page__hero-iamge {
        min-height: 0;
        width: 100%;
    }

    .vpj-layout-page__grid-layout {
        display: grid;
        grid-template-columns:
            minmax(min(v-bind(computedGutter), 100%), 1fr)
            minmax(min(calc(2 * v-bind(computedGutter)), 100%), v-bind(computedWidth))
            minmax(min(v-bind(computedGutter), 100%), 1fr);
        min-height: 0;
        width: 100%;
    }

    .vpj-layout-page__content {
        grid-column: 2;
        min-height: 0;
        padding-bottom: 1rem;
        width: 100%;
    }
</style>