<script setup>
import { Content, useData } from 'vitepress';
import { computed, provide, useSlots } from 'vue';
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
// process slots
const slots = useSlots();
const hasGutterLeft = computed(() => !!slots['page-gutter-left']?.());
const hasGutterRight = computed(() => !!slots['page-gutter-right']?.());


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
            <div
                v-if="hasGutterLeft"
                class="vpj-layout-page__gutter-left"
            >
                <slot name="page-gutter-left"/>
            </div>
            <slot>
                <Content class="vpj-layout-page__content"/>
            </slot>
            <div
                v-if="hasGutterRight"
                class="vpj-layout-page__gutter-right"
            >
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