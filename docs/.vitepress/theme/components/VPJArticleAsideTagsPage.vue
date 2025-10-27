<script setup>
import { computed } from 'vue';
import { useData } from 'vitepress';

import { useVPJData } from '../composables/useVPJData';

import VPJTag from './VPJTag.vue';
import VPJOverlayScrollArea from './VPJOverlayScrollArea.vue';

const DEFAULT = {
    EMPTY: "当前博客没有设置标签"
};

const { tags } = useVPJData();
const { theme } = useData();

const empty = computed(() => {
    const message = theme.value.components?.asideTabTags?.empty;
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
            v-if="!tags || tags.length === 0"
            class="vpj-article-aside__fallback"
        >
            {{ empty }}
        </div>
        <div
            v-else
            class="vpj-article-aside__aside-blog-tags"
        >
            <VPJTag
                v-for="tag in tags"
                :key="tag"
                :tag="tag"
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

    .vpj-article-aside__aside-blog-tags {
        backdrop-filter: var(--vpj-article-aside-tab-tags-backdrop-filter);
        background: var(--vpj-article-aside-tab-tags-bg);
        align-content: flex-start;
        column-gap: var(--vpj-article-aside-tab-tags-list-gap-col);
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        padding: var(--vpj-article-aside-tab-tags-list-padding);
        row-gap: var(--vpj-article-aside-tab-tags-list-gap-row);
        width: 100%;
    }
</style>