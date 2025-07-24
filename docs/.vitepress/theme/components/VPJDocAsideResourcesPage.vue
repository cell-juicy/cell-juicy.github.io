<script setup>
import { computed } from 'vue';

import { useDocData } from '../composables/useDocData';
import { useData } from 'vitepress';

import VPJDocAsideResourcesItem from './VPJDocAsideResourcesItem.vue';
import VPJOverlayScrollArea from './VPJOverlayScrollArea.vue';

import { any2Number } from '../utils/common';


const DEFAULT = {
    EMPTY: "当前文档没有相关资源",
};

const { resources } = useDocData();
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
        class="vpj-layout-doc__aside-tab-outer"
        :inner-attrs="{ class: 'vpj-layout-doc__aside-tab-inner' }"
    >
        <div
            v-if="resourcesData.length === 0"
            class="vpj-article-aside__fallback"
        >
            {{ empty }}
        </div>
        <div
            v-else
            class="vpj-layout-doc__aside-resources-list"
        >
            <VPJDocAsideResourcesItem
                v-for="resource in resourcesData"
                :key="resource.key"
                :data="resource"
            />
        </div>
    </VPJOverlayScrollArea>
</template>


<style scoped>
    .vpj-layout-doc__aside-tab-outer {
        background-color: var(--vpj-color-bg-100);
        height: 100%;
        width: 100%;
    }

    :deep(.vpj-layout-doc__aside-tab-inner) {
        align-items: center;
        display: flex;
        flex-direction: column;
    }

    .vpj-layout-doc__aside-resources-list {
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: .5rem;
        padding: .75rem .5rem;
        min-height: min-content;
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