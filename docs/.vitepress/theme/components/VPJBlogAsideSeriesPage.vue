<script setup>
import { computed } from 'vue';

import { useBlogData } from '../composables/useBlogData';

import VPJBlogAsideSeriesItem from './VPJBlogAsideSeriesItem.vue';
import VPJOverlayScrollArea from './VPJOverlayScrollArea.vue';


const { filter, series } = useBlogData();
const articles = computed(() => filter((data) => data.series === series.value).sort((a, b) => a.order - b.order))
</script>


<template>
    <VPJOverlayScrollArea
        overflow="y"
        class="vpj-layout-blog__aside-tab-outer"
        :area-attrs="{ class: 'vpj-layout-blog__aside-tab-area' }"
        :inner-attrs="{ class: 'vpj-layout-blog__aside-tab-inner' }"
    >
        <div class="vpj-layout-blog__aside-blog-series">
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
</style>