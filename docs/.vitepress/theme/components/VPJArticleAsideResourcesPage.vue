<script setup>
import { computed } from 'vue';

import { useVPJData } from '../composables/useVPJData';
import { useData } from 'vitepress';

import VPJArticleAsideResourcesItem from './VPJArticleAsideResourcesItem.vue';
import VPJOverlayScrollArea from './VPJOverlayScrollArea.vue';

import { any2Number } from '../utils/common';


const DEFAULT = {
    EMPTY: "当前文档没有相关资源",
};

const { resources } = useVPJData();
const { theme } = useData();

const resourcesData = computed(() => {
    const processedResources = (typeof resources.value === 'object' && resources.value !== null)
        ? resources.value
        : {}
    return Object.entries(processedResources)
        .map(([key, value]) => ({key, ...value}))
        .filter((data) => !!data.url)
        .sort((a, b) => any2Number(a.order) - any2Number(b.order))
})
const empty = computed(() => {
    const message = theme.value.components?.asideTabResources?.empty;
    return (typeof message === 'string') ? message : DEFAULT.EMPTY; 
})
</script>


<template>
    <VPJOverlayScrollArea
        overflow="y"
        class="vpj-article-aside__aside-tab-outer"
        :inner-attrs="{ class: 'vpj-article-aside__aside-tab-inner' }"
    >
        <div
            v-if="resourcesData.length === 0"
            class="vpj-article-aside__fallback"
        >
            {{ empty }}
        </div>
        <div
            v-else
            class="vpj-article-aside__aside-resources-list"
        >
            <VPJArticleAsideResourcesItem
                v-for="resource in resourcesData"
                :key="resource.key"
                :data="resource"
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
    }

    .vpj-article-aside__aside-resources-list {
        backdrop-filter: var(--vpj-article-aside-tab-resources-backdrop-filter);
        background: var(--vpj-article-aside-tab-resources-bg);
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: var(--vpj-article-aside-tab-resources-list-gap);
        padding: var(--vpj-article-aside-tab-resources-list-padding);
        min-height: min-content;
        width: 100%;
    }
</style>