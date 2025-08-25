<script setup>
import { ref, computed } from 'vue';
import { useData, useRoute } from 'vitepress';

import { data } from '../data/history.data';

import VPJOverlayScrollArea from './VPJOverlayScrollArea.vue';
import VPJPanelHistoryItem from './VPJPanelHistoryItem.vue';


const DEFAULT = {
    EMPTY: "没有历史提交记录",
}

const { theme } = useData();
const route = useRoute();

const fileData = computed(() => {
    if (data[route.path]) return data[route.path];
    return [];
});
const empty = computed(() => {
    const message = theme.value.components?.panelTabHistory?.empty;
    return (typeof message === 'string') ? message : DEFAULT.EMPTY;
});
</script>


<template>
    <VPJOverlayScrollArea
        overflow="y"
        class="vpj-panel__tab-outer"
        :area-attrs="{ class: 'vpj-panel__tab-area' }"
        :inner-attrs="{ class: 'vpj-panel__tab-inner' }"
    >
        <div
            v-if="fileData.history.length === 0"
            class="vpj-panel__fallback"
        >
            {{ empty }}
        </div>
        <div
            v-else
            class="vpj-panel__history"
        >
            <VPJPanelHistoryItem
                v-for="commit in fileData.history"
                :key="commit.hash"
                :path="fileData.path"
                :url="fileData.url"
                :info="commit"
            />
        </div>
    </VPJOverlayScrollArea>
</template>


<style scoped>
    .vpj-panel__tab-outer {
        background-color: var(--vpj-color-bg-100);
        height: 100%;
        width: 100%;
    }

    :deep(.vpj-panel__tab-inner) {
        align-items: center;
        display: flex;
        flex-direction: column;
        width: 100%
    }

    .vpj-panel__history {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        width: 100%;
        padding: .5rem;
    }
</style>