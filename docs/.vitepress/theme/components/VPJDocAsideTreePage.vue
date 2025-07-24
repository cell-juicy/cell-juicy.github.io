<script setup>
import { computed } from 'vue';
import { useData } from 'vitepress';

import { useDocData } from '../composables/useDocData';

import VPJDocAsideTreeItem from './VPJDocAsideTreeItem.vue';
import VPJOverlayScrollArea from './VPJOverlayScrollArea.vue';


const DEFAULT = {
    EMPTY: "没有找到同空间的文档",
    NOSPACE: "当前文档还没被收录进空间中",
};

const { filter, space } = useDocData();
const { theme } = useData();

const rootDocData = computed(() => {
    if (!space.value) {
        return [];
    }
    return filter((data) => data.space === space.value).filter((data) => !data.parent)
});
const noSpace = computed(() => {
    const message = theme.value.components?.asideTabTree?.noSpace;
    return (typeof message === 'string') ? message : DEFAULT.NOSPACE;
});
const empty = computed(() => { 
    const message = theme.value.components?.asideTabTree?.empty;
    return (typeof message === 'string') ? message : DEFAULT.EMPTY;
});
</script>


<template>
    <VPJOverlayScrollArea
        overflow="y"
        class="vpj-layout-doc__aside-tab-outer"
        :inner-attrs="{ class: 'vpj-layout-doc__aside-tab-inner' }"
    >
        <div
            v-if="!space"
            class="vpj-article-aside__fallback"
        >
            {{ noSpace }}
        </div>
        <div
            v-else-if="rootDocData.length === 0"
            class="vpj-article-aside__fallback"
        >
            {{ empty }}
        </div>
        <div
            v-else
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