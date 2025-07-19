<script setup>
import { computed } from 'vue';

import { useDocData } from '../composables/useDocData';

import VPJDocAsideResourcesItem from './VPJDocAsideResourcesItem.vue';
import VPJOverlayScrollArea from './VPJOverlayScrollArea.vue';

import { any2Number } from '../utils/common';


const { resources } = useDocData();

const resourcesData = computed(() => {
    const processedResources = (typeof resources.value === 'object' && resources.value !== null)
        ? resources.value
        : {}
    return Object.entries(processedResources)
        .map(([key, value]) => ({key, ...value}))
        .filter((data) => !!data.url)
        .sort((a, b) => any2Number(a.order) - any2Number(b.order))
})
</script>


<template>
    <VPJOverlayScrollArea
        overflow="y"
        class="vpj-layout-doc__aside-tab-outer"
        :inner-attrs="{ class: 'vpj-layout-doc__aside-tab-inner' }"
    >
        <div
            v-if="resourcesData.length > 0"
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
</style>