<script setup>
import { ref, computed, inject, onMounted, shallowRef, useTemplateRef, watch, onUnmounted } from 'vue';
import { useData, onContentUpdated } from 'vitepress';

import { getHeaders, useActiveAnchor, resolveOutlineInput } from '../utils/outline';
import { VPJ_ARTICLE_LAYOUT_SYMBOL } from '../utils/symbols';

import VPJOverlayScrollArea from './VPJOverlayScrollArea.vue';
import VPJArticleAsideOutlineItem from './VPJArticleAsideOutlineItem.vue';

const DEFAULT = {
    EMPTY: "没有大纲标题",
    LEVEL: "deep",
    IGNORE: /\b(vpj-blog-tag|header-anchor|footnote-ref|ignore-header)\b/,
};

const { theme, frontmatter } = useData();

const headers = shallowRef([]);
const article = inject(VPJ_ARTICLE_LAYOUT_SYMBOL, {});
const outline = useTemplateRef("outline");
const scrollArea = ref(null);
const empty = computed(() => {
    const message = theme.value.components?.asideTabOutline?.empty;
    return (typeof message === 'string') ? message : DEFAULT.EMPTY;
});

const stopWatcher = watch(article.scrollArea, () => {
    const area = article?.scrollArea?.value?.area;
    scrollArea.value = area ? area : null;
}, { immediate: true });

function updateOutline() {
    const content = article?.content?.value;
    const frontmatterConfig = resolveOutlineInput(frontmatter.value.outline);
    const themeConfig = resolveOutlineInput(theme.value.components?.asideTabOutline);
    const { level, ignore } = {
        level: frontmatterConfig?.level ?? themeConfig?.level ?? DEFAULT.LEVEL,
        ignore: frontmatterConfig?.ignore ?? themeConfig?.ignore ?? DEFAULT.IGNORE
    };
    if (content) {
        headers.value = getHeaders(content, level, ignore);
    };
}

onContentUpdated(updateOutline);
onMounted(updateOutline);
onUnmounted(() => {
    stopWatcher();
});

useActiveAnchor(outline, scrollArea);
</script>


<template>
    <VPJOverlayScrollArea
        overflow="y"
        class="vpj-article-aside__aside-tab-outer"
        :area-attrs="{ class: 'vpj-article-aside__aside-tab-area' }"
        :inner-attrs="{ class: 'vpj-article-aside__aside-tab-inner' }"
    >
        <div
            v-if="headers.length === 0"
            class="vpj-article-aside__fallback"
        >
            {{ empty }}
        </div>
        <div
            v-else
            ref="outline"
            class="vpj-article-aside__outline"
        >
            <ul
                class="vpj-article-aside__outline-list"
            >
                <VPJArticleAsideOutlineItem
                    v-for="header in headers"
                    :key="header.link"
                    :data="header"
                />
            </ul>
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
        width: 100%
    }

    .vpj-article-aside__outline {
        width: 100%;
    }

    .vpj-article-aside__outline-list {
        align-items: flex-start;
        display: flex;
        flex: 1;
        flex-direction: column;
        margin: 0;
        padding: 0;
        width: 100%;
    }
</style>