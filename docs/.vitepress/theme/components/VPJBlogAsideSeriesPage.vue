<script setup>
import { computed } from 'vue';

import { useBlogData } from '../composables/useBlogData';

import VPJBlogAsideSeriesItem from './VPJBlogAsideSeriesItem.vue';


const { filter, series } = useBlogData();
const articles = computed(() => filter((data) => data.series === series.value).sort((a, b) => a.order - b.order))
</script>


<template>
    <div class="vpj-layout-blog__aside-tab-page vpj-scroll-y">
        <VPJBlogAsideSeriesItem
            v-for="article in articles"
            :key="article.url"
            :data="article"
        />
    </div>
</template>


<style scoped>
    .vpj-layout-blog__aside-tab-page {
        align-content: flex-start;
        background-color: var(--vpj-color-bg-100);
        column-gap: .25rem;
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: .75rem .5rem;
        row-gap: .5rem;
        width: 100%;
    }
</style>