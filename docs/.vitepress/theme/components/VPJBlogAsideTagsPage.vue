<script setup>
import { computed } from 'vue';
import { useData } from 'vitepress';

import { useBlogData } from '../composables/useBlogData';

import VPJTag from './VPJTag.vue';
import VPJOverlayScrollArea from './VPJOverlayScrollArea.vue';

const DEFAULT = {
    EMPTY: "当前博客没有设置标签"
};

const { tags } = useBlogData();
const { theme } = useData();

const empty = computed(() => {
    const message = theme.value.components?.asideTabTags?.empty;
    return (typeof message === 'string') ? message : DEFAULT.EMPTY;
})
</script>


<template>
    <VPJOverlayScrollArea
        overflow="y"
        class="vpj-layout-blog__aside-tab-outer"
        :inner-attrs="{ class: 'vpj-layout-blog__aside-tab-inner' }"
    >
        <div
            v-if="!tags || tags.length === 0"
            class="vpj-article-aside__fallback"
        >
            {{ empty }}
        </div>
        <div v-else class="vpj-layout-blog__aside-blog-tags">
            <VPJTag
                v-for="tag in tags"
                :key="tag"
                :tag="tag"
            />
        </div>
    </VPJOverlayScrollArea>
</template>


<style scoped>
    .vpj-layout-blog__aside-tab-outer {
        background-color: var(--vpj-color-bg-100);
        height: 100%;
        width: 100%;
    }

    :deep(.vpj-layout-blog__aside-tab-inner) {
        align-items: center;
        display: flex;
        flex-direction: column;
    }

    .vpj-layout-blog__aside-blog-tags {
        align-content: flex-start;
        column-gap: .25rem;
        display: flex;
        flex-wrap: wrap;
        padding: .75rem .5rem;
        row-gap: .5rem;
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