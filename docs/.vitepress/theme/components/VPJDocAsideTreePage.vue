<script setup>
import { computed } from 'vue';

import { useDocData } from '../composables/useDocData';

import VPJDocAsideTreeItem from './VPJDocAsideTreeItem.vue';
import VPJOverlayScrollArea from './VPJOverlayScrollArea.vue';


const { filter, space } = useDocData();
const rootDocData = computed(() => {
    if (!space.value) {
        return [];
    }
    return filter((data) => data.space === space.value).filter((data) => !data.parent)
})
</script>


<template>
    <VPJOverlayScrollArea
        overflow="y"
        class="vpj-layout-doc__aside-tab-outer"
        :inner-attrs="{ class: 'vpj-layout-doc__aside-tab-inner' }"
    >
        <div
            v-if="rootDocData.length > 0"
            class="vpj-layout-doc__aside-doc-tree"
        >
            <VPJDocAsideTreeItem
                v-for="docData in rootDocData"
                :key="docData.id"
                :data="docData"
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

    .vpj-layout-doc__aside-doc-tree {
        display: flex;
        flex-direction: column;
        gap: .25rem;
        min-height: min-content;
        padding-bottom: 1rem;
        padding-left: 1.25rem;
        padding-top: 1rem;
        width: 100%;
    }
</style>