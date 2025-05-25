<script setup>
import { storeToRefs } from 'pinia';
import { useData } from 'vitepress';
import { computed } from 'vue';

import { useVPJBlogLayout } from '../composables/useVPJBlogLayout';
import { useBlogData } from '../composables/useBlogData';

import VPJArticleAside from '../components/VPJArticleAside.vue';
import VPJArticleHeader from '../components/VPJArticleHeader.vue';
import VPJArticleCover from '../components/VPJArticleCover.vue';
import VPJDynamicIconBtn from '../components/VPJDynamicIconBtn.vue';

import VPJIconAngleSquareLeft from '../components/icons/VPJIconAngleSquareLeft.vue';
import VPJIconAngleSquareRight from '../components/icons/VPJIconAngleSquareRight.vue';


const store = useVPJBlogLayout();
const { asideToggle, asideClose, asideOpen } = store;
const {
    asideCollapsed,
    headerConfig,
    coverConfig,
    contentConfig,
    asideConfig
} = storeToRefs(store);
const { cover } = useBlogData();

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
</script>


<template>
    <div class="vpj-layout-blog">
        <slot name="blog-header">
            <VPJArticleHeader 
                :config="headerConfig"
                :state="{
                    collapsed: asideCollapsed,
                    toggle: asideToggle,
                    close: asideClose,
                    open: asideOpen
                }"
            >
                <template #blog-header-before><slot name="blog-header-before"/></template>
                <template #blog-header-between><slot name="blog-header-between"/></template>
                <template #blog-header-after><slot name="blog-header-after"/></template>
            </VPJArticleHeader>
        </slot>
        <main class="vpj-layout-blog__main">
            <slot name="blog-aside">
                <VPJArticleAside
                    :config="asideConfig"
                    :state="{
                        collapsed: asideCollapsed,
                        toggle: asideToggle,
                        close: asideClose,
                        open: asideOpen
                    }"
                />
            </slot>
            <div class="vpj-layout-blog__wrapper">
                <slot name="blog-cover">
                    <VPJArticleCover
                        :cover="cover"
                        :config="coverConfig"
                    />
                </slot>
                <div class="vpj-layout-blog__container">
                    <div class="vpj-layout-blog__aside-controler">
                        <VPJDynamicIconBtn
                            :icon="asideCollapsed ? VPJIconAngleSquareRight : VPJIconAngleSquareLeft"
                            @click="asideToggle"
                            class="vpj-layout-blog__aside-toggle"
                        />
                        <slot name="blog-controler"/>
                    </div>
                    <article class="vpj-layout-blog__article">
                        <slot name="blog-top"/>
                        <div class="vpj-layout-blog__grid-layout">
                            <div class="vpj-layout-blog__article-padding-left">
                                <slot name="blog-padding-left"/>
                            </div>
                            <slot>
                                <Content class="vpj-markdown"/>
                            </slot>
                            <div class="vpj-layout-blog__article-padding-right">
                                <slot name="blog-padding-right"/>
                            </div>
                        </div>
                        <slot name="blog-bottom"/>
                    </article>
                </div>
            </div>
        </main>
    </div>
</template>


<style scoped>
    .vpj-layout-blog {
        background-color: var(--vpj-color-bg-100);
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
    }

    .vpj-layout-blog__main {
        display: flex;
        flex: 1;
        flex-direction: row;
        position: relative;
        width: 100%;
    }

    .vpj-layout-blog__wrapper {
        display: flex;
        flex: 1;
        flex-direction: column;
        height: 100%;
        overflow: auto;
        scrollbar-color: var(--vpj-color-text-100) var(--vpj-color-bg-200);
        scrollbar-gutter: auto;
    }

    .vpj-layout-blog__container {
        display: flex;
        flex: 1;
        flex-direction: row;
        min-height: min-content;
        width: 100%;
    }

    .vpj-layout-blog__aside-controler {
        background-color: transparent;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        height: 100%;
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
        width: 48px;
    }

    .vpj-layout-blog__aside-controler:hover {
        opacity: 1;
    }

    .vpj-layout-blog__aside-toggle {
        align-items: center;
        background-color: var(--vpj-color-bg-100);
        border-radius: var(--vpj-border-radius-100);
        height: 32px;
        margin: 8px;
        padding: 8px;
        position: sticky;
        top: 8px;
        width: 32px;
    }

    .vpj-layout-blog__aside-toggle :deep(.vpj-icon) {
        fill: var(--vpj-color-text-300);
        height: 16px;
        width: 16px;
    }

    .vpj-layout-blog__aside-toggle:hover,
    .vpj-layout-blog__aside-toggle:active {
        background-color: var(--vpj-color-bg-300);
    }

    .vpj-layout-blog__aside-toggle:hover :deep(.vpj-icon),
    .vpj-layout-blog__aside-toggle:active :deep(.vpj-icon) {
        fill: var(--vpj-color-text-400);
    }

    .vpj-layout-blog__article {
        align-items: center;
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-between;
        margin-bottom: v-bind(computedMarginBottom);
        margin-top: v-bind(computedMarginTop);
        padding-right: 48px;
    }

    .vpj-layout-blog__grid-layout {
        display: grid;
        grid-template-columns:
            minmax(min(v-bind(computedPadding), 100%), 1fr)
            minmax(min(calc(2 * v-bind(computedPadding)), 100%), v-bind(computedMaxWidth))
            minmax(min(v-bind(computedPadding), 100%), 1fr);
        min-height: 0;
        width: 100%;
    }

    .vpj-layout-blog__article-padding-left {
        grid-column: 1;
        max-width: 100%;
    }

    .vpj-layout-blog__article-padding-right {
        grid-column: 3;
        max-width: 100%;
    }

    .vpj-markdown {
        grid-column: 2;
        max-width: 100%;
    }

    @media screen and (max-width: 1024px) {
        .vpj-layout-blog__aside-controler {
            display: none;
        }
    }

    @media screen and (max-width: 768px) {
        .vpj-layout-blog__article {
            padding-right: 0;
        }
    }
</style>