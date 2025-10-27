<script setup>
import { storeToRefs } from 'pinia';
import { computed, provide, useTemplateRef } from 'vue';
import { useHead } from '@unhead/vue';

import { useVPJLayout } from '../composables/useVPJLayout';

import { VPJ_ARTICLE_LAYOUT_SYMBOL } from '../utils/symbols';

import VPJFooter from '../components/VPJFooter.vue';
import VPJArticleAside from '../components/VPJArticleAside.vue';
import VPJArticleHeader from '../components/VPJArticleHeader.vue';
import VPJArticleCover from '../components/VPJArticleCover.vue';
import VPJArticleFooter from '../components/VPJArticleFooter.vue';
import VPJDynamicIconBtn from '../components/VPJDynamicIconBtn.vue';
import VPJOverlayScrollArea from '../components/VPJOverlayScrollArea.vue';

import VPJIconAngleSquareLeft from '../components/icons/VPJIconAngleSquareLeft.vue';
import VPJIconAngleSquareRight from '../components/icons/VPJIconAngleSquareRight.vue';


const store = useVPJLayout();
const { asideToggle } = store;
const {
    asideCollapsed,
    headConfig,
    contentConfig,
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

provide(VPJ_ARTICLE_LAYOUT_SYMBOL, {
    content: useTemplateRef("article-content"),
    scrollArea: useTemplateRef("article-scroll-area")
});
</script>


<template>
    <div class="vpj-layout-article">
        <slot name="article-header">
            <VPJArticleHeader>
                <template #header-before><slot name="article-header-before"/></template>
                <template #header-between><slot name="article-header-between"/></template>
                <template #header-after><slot name="article-header-after"/></template>
            </VPJArticleHeader>
        </slot>
        <main class="vpj-layout-article__main">
            <slot name="article-aside">
                <VPJArticleAside/>
            </slot>
            <VPJOverlayScrollArea
                overflow="xy"
                thumb-width="5"
                :inner-attrs="{ class: 'vpj-layout-article__wrapper-inner' }"
                ref="article-scroll-area"
                class="vpj-layout-article__wrapper-outer"
            >
                <slot name="article-cover">
                    <VPJArticleCover/>
                </slot>
                <div class="vpj-layout-article__container">
                    <div class="vpj-layout-article__aside-controler">
                        <VPJDynamicIconBtn
                            :icon="asideCollapsed ? VPJIconAngleSquareRight : VPJIconAngleSquareLeft"
                            @click="asideToggle"
                            class="vpj-layout-article__aside-toggle"
                        />
                        <slot name="article-controler"/>
                    </div>
                    <article class="vpj-layout-article__article">
                        <slot name="article-top"/>
                        <div class="vpj-layout-article__grid-layout">
                            <div class="vpj-layout-article__article-padding-left">
                                <slot name="article-padding-left"/>
                            </div>
                            <slot>
                                <div ref="article-content" class="vpj-layout-article__article-content">
                                    <Content class="vpj-markdown"/>
                                    <VPJArticleFooter/>
                                    <VPJFooter/>
                                </div>
                            </slot>
                            <div class="vpj-layout-article__article-padding-right">
                                <slot name="article-padding-right"/>
                            </div>
                        </div>
                        <slot name="article-bottom"/>
                    </article>
                </div>
            </VPJOverlayScrollArea>
        </main>
    </div>
</template>


<style scoped>
    .vpj-layout-article {
        backdrop-filter: var(--vpj-layout-article-backdrop-filter);
        background: var(--vpj-layout-article-bg);
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
    }

    .vpj-layout-article__main {
        display: flex;
        flex: 1;
        flex-direction: row;
        position: relative;
        width: 100%;
    }

    .vpj-layout-article__wrapper-outer {
        background: var(--vpj-layout-article-wrapper-bg);
        flex: 1;
        height: 100%;
    }

    :deep(.vpj-layout-article__wrapper-inner) {
        display: flex;
        flex: 1;
        flex-direction: column;
    }

    .vpj-layout-article__container {
        display: flex;
        flex: 1;
        flex-direction: row;
        min-height: max-content;
        width: 100%;
    }

    .vpj-layout-article__aside-controler {
        align-items: center;
        background-color: transparent;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        gap: var(--vpj-layout-article-controller-gap);
        min-height: max-content;
        opacity: 0;
        padding-top: var(--vpj-layout-article-controller-padding-top);
        transition: opacity var(--vpj-layout-article-transition);
        width: var(--vpj-layout-article-controller-width);
    }

    .vpj-layout-article__aside-controler:hover {
        opacity: 1;
    }

    .vpj-layout-article__aside-toggle {
        align-items: center;
        backdrop-filter: var(--vpj-layout-article-controller-btn-backdrop-filter);
        background: var(--vpj-layout-article-controller-btn-bg);
        border: var(--vpj-layout-article-controller-btn-border);
        border-radius: var(--vpj-layout-article-controller-btn-radius);
        height: var(--vpj-layout-article-controller-btn-size);
        padding: calc((var(--vpj-layout-article-controller-btn-size) - var(--vpj-layout-article-controller-btn-icon-size)) / 2);
        position: sticky;
        top: var(--vpj-layout-article-controller-padding-top);
        transition:
            backdrop-filter var(--vpj-layout-article-transition),
            background var(--vpj-layout-article-transition);
        width: var(--vpj-layout-article-controller-btn-size);
    }

    .vpj-layout-article__aside-toggle :deep(.vpj-icon) {
        fill: var(--vpj-layout-article-controller-btn-icon-color);
        height: var(--vpj-layout-article-controller-btn-icon-size);
        width: var(--vpj-layout-article-controller-btn-icon-size);
        transition: fill var(--vpj-layout-article-transition);
    }

    .vpj-layout-article__aside-toggle:hover,
    .vpj-layout-article__aside-toggle:active {
        backdrop-filter: var(--vpj-layout-article-controller-btn-backdrop-filter-hover);
        background: var(--vpj-layout-article-controller-btn-bg-hover);
    }

    .vpj-layout-article__aside-toggle:hover :deep(.vpj-icon),
    .vpj-layout-article__aside-toggle:active :deep(.vpj-icon) {
        fill: var(--vpj-layout-article-controller-btn-icon-color-hover);
    }

    .vpj-layout-article__article {
        align-items: center;
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-between;
        padding-right: var(--vpj-layout-article-controller-width);
    }

    .vpj-layout-article__grid-layout {
        display: grid;
        flex: 1;
        grid-template-columns:
            minmax(min(v-bind(computedPadding), 100%), 1fr)
            minmax(min(calc(2 * v-bind(computedPadding)), 100%), v-bind(computedMaxWidth))
            minmax(min(v-bind(computedPadding), 100%), 1fr);
        min-height: 0;
        width: 100%;
    }

    .vpj-layout-article__article-padding-left {
        grid-column: 1;
        max-width: 100%;
    }

    .vpj-layout-article__article-padding-right {
        grid-column: 3;
        max-width: 100%;
    }

    .vpj-layout-article__article-content {
        display: flex;
        flex-direction: column;
        grid-column: 2;
        margin-top: v-bind(computedMarginTop);
        max-width: 100%;
    }

    .vpj-layout-article__article-content > .vpj-markdown {
        flex: 1;
        margin-bottom: v-bind(computedMarginBottom);
    }

    @media screen and (max-width: 1024px) {
        .vpj-layout-article__aside-controler {
            display: none;
        }

        .vpj-layout-article__article {
            padding-right: 0;
        }
    }
</style>