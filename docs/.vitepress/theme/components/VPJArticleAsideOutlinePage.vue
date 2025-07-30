<script setup>
import { computed, inject, onMounted, shallowRef } from 'vue';
import { useData, onContentUpdated } from 'vitepress';

import { getHeaders } from '../utils/outline';
import { VPJ_ARTICLE_LAYOUT_SYMBOL } from '../utils/symbols';

import VPJOverlayScrollArea from './VPJOverlayScrollArea.vue';
import VPJArticleAsideOutlineItem from './VPJArticleAsideOutlineItem.vue';

const DEFAULT = {
    EMPTY: "没有大纲标题",
    LEVEL: "deep",
    IGNORE: /\b(vpj-tag|header-anchor|footnote-ref|ignore-header)\b/,
};

const { theme } = useData();

const headers = shallowRef([]);
const article = inject(VPJ_ARTICLE_LAYOUT_SYMBOL, {});

function updateOutline() {
    const content = article?.content?.value;
    if (content) {
        headers.value = getHeaders(content, DEFAULT.LEVEL, DEFAULT.IGNORE);
    };
}

onContentUpdated(updateOutline);
onMounted(updateOutline);
</script>


<template>
    <VPJOverlayScrollArea
        overflow="y"
        ref="scrollArea"
        class="vpj-layout-blog__aside-tab-outer"
        :area-attrs="{ class: 'vpj-layout-blog__aside-tab-area' }"
        :inner-attrs="{ class: 'vpj-layout-blog__aside-tab-inner' }"
    >
        <div
            v-if="headers.length === 0"
            class="vpj-article-aside__fallback"
        >
            {{ DEFAULT.EMPTY }}
        </div>
        <div v-else class="vpj-article-aside__outline">
            <VPJArticleAsideOutlineItem
                :data="headers"
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
        width: 100%
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