<script setup>
import { computed } from 'vue';
import { useData } from 'vitepress';

import { useBlogData } from '../composables/useBlogData';

import VPJBlogAsideSeriesItem from './VPJBlogAsideSeriesItem.vue';
import VPJOverlayScrollArea from './VPJOverlayScrollArea.vue';

const DEFAULT = {
    EMPTY: "没有找到同系列的博客",
    NOSERIES: "当前博客还没被收录进任何系列",
};

const { series, filter } = useBlogData();
const { theme } = useData();

const articles = computed(() => filter((data) => data.series === series.value).sort((a, b) => a.order - b.order));
const noSeries = computed(() => {
    const message = theme.value.components?.asideTabSeries?.noSeries;
    return (typeof message === 'string') ? message : DEFAULT.NOSERIES;
});
const empty = computed(() => {
    const message = theme.value.components?.asideTabSeries?.empty;
    return (typeof message === 'string') ? message : DEFAULT.EMPTY;
});
</script>


<template>
    <VPJOverlayScrollArea
        overflow="y"
        class="vpj-layout-blog__aside-tab-outer"
        :area-attrs="{ class: 'vpj-layout-blog__aside-tab-area' }"
        :inner-attrs="{ class: 'vpj-layout-blog__aside-tab-inner' }"
    >
        <div
            v-if="!series"
            class="vpj-article-aside__fallback"
        >
            {{ noSeries }}
        </div>
        <div
            v-else-if="articles.length === 0"
            class="vpj-article-aside__fallback"
        >
            {{ empty }}
        </div>
        <div v-else="" class="vpj-layout-blog__aside-blog-series">
            <VPJBlogAsideSeriesItem
                v-for="article in articles"
                :key="article.url"
                :data="article"
            />
        </div>
    </VPJOverlayScrollArea>
</template>


<style scoped>
    .vpj-layout-blog__aside-tab-outer {
        background-color: var(--vpj-color-bg-100);
        height: 100%;
        width: 100%;
    }

    :deep(.vpj-layout-blog__aside-tab-inner) {
        align-items: center;
        display: flex;
        flex-direction: column;
        width: 100%
    }

    .vpj-layout-blog__aside-blog-series {
        align-content: flex-start;
        background-color: var(--vpj-color-bg-100);
        display: flex;
        flex-direction: column;
        padding: .75rem .5rem;
        row-gap: .5rem;
        width: 100%;
    }

    .vpj-article-aside__fallback {
        align-items: center;
        color: var(--vpj-color-text-100);
        display: flex;
        flex: 1;
        font-size: 1.25rem;
        height: 100%;
        justify-content: center;
        line-height: 1.5;
        min-height: 0;
        min-width: 0;
        overflow: hidden;
        overflow-wrap: break-word;
        padding-left: 1.2rem;
        padding-right: 1.2rem;
        width: 100%;
        word-break: break-all;
    }
</style>