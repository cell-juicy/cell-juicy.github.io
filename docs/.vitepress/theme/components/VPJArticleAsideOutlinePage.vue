<script setup>
import { ref, inject, onMounted, shallowRef, useTemplateRef, watch, onUnmounted } from 'vue';
import { useData, onContentUpdated } from 'vitepress';

import { getHeaders, useActiveAnchor } from '../utils/outline';
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
const outline = useTemplateRef("outline");
const scrollArea = ref(null);

const stopWatcher = watch(article.scrollArea, () => {
    const area = article?.scrollArea?.value?.area;
    scrollArea.value = area ? area : null;
}, { immediate: true })

function updateOutline() {
    const content = article?.content?.value;
    if (content) {
        headers.value = getHeaders(content, DEFAULT.LEVEL, DEFAULT.IGNORE);
    };
}

onContentUpdated(updateOutline);
onMounted(updateOutline);
onUnmounted(() => {
    stopWatcher();
})

useActiveAnchor(outline, scrollArea)
</script>


<template>
    <VPJOverlayScrollArea
        overflow="y"
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
        <div v-else ref="outline" class="vpj-article-aside__outline">
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