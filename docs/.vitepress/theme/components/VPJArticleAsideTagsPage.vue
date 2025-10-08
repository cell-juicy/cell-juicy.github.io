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
        background-color: var(--vpj-color-bg-100);
        height: 100%;
        width: 100%;
    }

    :deep(.vpj-article-aside__aside-tab-inner) {
        align-items: center;
        display: flex;
        flex-direction: column;
    }

    .vpj-article-aside__aside-blog-tags {
        align-content: flex-start;
        column-gap: .25rem;
        display: flex;
        flex-wrap: wrap;
        padding: .75rem .5rem;
        row-gap: .5rem;
        width: 100%;
    }
</style>