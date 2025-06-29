<script setup>
import { computed } from 'vue';

import { useDocData } from '../composables/useDocData';

import VPJDocAsideResourcesItem from './VPJDocAsideResourcesItem.vue';
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
    <div class="vpj-layout-doc__aside-tab-page vpj-scroll-y">
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
    </div>
</template>


<style scoped>
    .vpj-layout-doc__aside-tab-page {
        align-content: flex-start;
        background-color: var(--vpj-color-bg-100);
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
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