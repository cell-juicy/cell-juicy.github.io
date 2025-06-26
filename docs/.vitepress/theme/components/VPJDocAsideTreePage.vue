<script setup>
import { useRoute } from 'vitepress';
import { ref, computed } from 'vue';

import { useDocData } from '../composables/useDocData';

import VPJDocAsideTreeItem from './VPJDocAsideTreeItem.vue';


const { filter, space } = useDocData();
const rootDocData = computed(() => {
    if (!space.value) {
        // console.log(`space is ${space.value}, not rendering doc tree`)
        return [];
    }
    return filter({ space: space.value }).filter((data) => !data.parent)
})
</script>


<template>
    <div class="vpj-layout-doc__aside-tab-page vpj-scroll-y">
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
    </div>
</template>


<style scoped>
    .vpj-layout-doc__aside-tab-page {
        align-content: flex-start;
        background-color: var(--vpj-color-bg-100);
        display: flex;
        flex-direction: column;
        height: 100%;
        padding-bottom: 1rem;
        padding-left: 1.25rem;
        padding-top: 1rem;
        width: 100%;
    }

    .vpj-layout-doc__aside-doc-tree {
        display: flex;
        flex-direction: column;
        gap: .25rem;
        width: 100%;
    }
</style>