<script setup>
import { computed } from 'vue';
import { useData } from 'vitepress';

import { useVPJData } from '../composables/useVPJData';

import VPJArticleAsideSeriesItem from './VPJArticleAsideSeriesItem.vue';
import VPJOverlayScrollArea from './VPJOverlayScrollArea.vue';

const DEFAULT = {
    EMPTY: "没有找到同系列的博客",
    NOSERIES: "当前博客还没被收录进任何系列",
};

const { series, blogFilter } = useVPJData();
const { theme } = useData();

const articles = computed(() => blogFilter((data) => data.series === series.value).sort((a, b) => a.order - b.order));
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
        class="vpj-article-aside__aside-tab-outer"
        :area-attrs="{ class: 'vpj-article-aside__aside-tab-area' }"
        :inner-attrs="{ class: 'vpj-article-aside__aside-tab-inner' }"
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
        <div
            v-else
            class="vpj-article-aside__aside-blog-series"
        >
            <VPJArticleAsideSeriesItem
                v-for="article in articles"
                :key="article.url"
                :data="article"
            />
        </div>
    </VPJOverlayScrollArea>
</template>


<style scoped>
    .vpj-article-aside__aside-tab-outer {
        height: 100%;
        width: 100%;
    }

    :deep(.vpj-article-aside__aside-tab-inner) {
        align-items: center;
        display: flex;
        flex-direction: column;
        width: 100%
    }

    .vpj-article-aside__aside-blog-series {
        backdrop-filter: var(--vpj-article-aside-tab-series-backdrop-filter);
        background: var(--vpj-article-aside-tab-series-bg);
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: var(--vpj-article-aside-tab-series-list-gap);
        padding: var(--vpj-article-aside-tab-series-list-padding);
        width: 100%;
    }
</style>