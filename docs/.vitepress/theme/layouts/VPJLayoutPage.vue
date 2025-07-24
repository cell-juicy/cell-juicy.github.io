<script setup>
import { storeToRefs } from 'pinia';
import { computed, provide } from 'vue';
import { useHead } from '@unhead/vue';

import { useVPJLayout } from '../composables/useVPJLayout';

import { VPJ_PAGE_LAYOUT_SYMBOL } from '../utils/symbols';

import VPJOverlayScrollArea from '../components/VPJOverlayScrollArea.vue';


const store = useVPJLayout();
const {
    headConfig,
    contentConfig
} = storeToRefs(store);

useHead(headConfig);

const computedPadding = computed(() => {
    return contentConfig.value.padding || "0"
});
const computedMaxWidth = computed(() => {
    return contentConfig.value.maxWidth || "100%"
});
const computedMarginTop = computed(() => {
    return contentConfig.value.marginTop || "0"
});
const computedMarginBottom = computed(() => {
    return contentConfig.value.marginBottom || "0"
});

provide(VPJ_PAGE_LAYOUT_SYMBOL, {
    computedPadding,
    computedMaxWidth
});
</script>


<template>
    <VPJOverlayScrollArea
        overflow="xy"
        thumb-width="5"
        class="vpj-layout-page"
    >
        <div class="vpj-layout-page__hero-iamge"/>
        <slot name="page-top"/>
        <div class="vpj-layout-page__grid-layout">
            <div class="vpj-layout-page__padding-left">
                <slot name="page-padding-left"/>
            </div>
            <slot>
                <Content class="vpj-layout-page__content vpj-markdown"/>
            </slot>
            <div class="vpj-layout-page__padding-right">
                <slot name="page-padding-right"/>
            </div>
        </div>
        <slot name="page-bottom"/>
    </VPJOverlayScrollArea>
</template>


<style scoped>
    /* Main layout */
    .vpj-layout-page {
        background-color: var(--vpj-color-bg-100);
        height: 100%;
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
            minmax(min(v-bind(computedPadding), 100%), 1fr)
            minmax(min(calc(2 * v-bind(computedPadding)), 100%), v-bind(computedMaxWidth))
            minmax(min(v-bind(computedPadding), 100%), 1fr);
        margin-top: v-bind(computedMarginTop);
        margin-bottom: v-bind(computedMarginBottom);
        min-height: 0;
        width: 100%;
    }

    .vpj-layout-page__padding-left {
        grid-column: 1;
        min-height: 0;
        width: 100%;
    }

    .vpj-layout-page__padding-right {
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