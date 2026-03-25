<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useVPJLayout } from '../composables/useVPJLayout';

import { data as historyData } from '../data/history.data';

import VPJTooltipBtn from './VPJTooltipBtn.vue';

import VPJIconGithub from './icons/VPJIconGithub.vue';
import VPJIconMarkdown from './icons/VPJIconMarkdown.vue';
import VPJIconPDF from './icons/VPJIconPDF.vue';
import VPJIconTimePast from './icons/VPJIconTimePast.vue';
import VPJIconCommentAltDots from './icons/VPJIconCommentAltDots.vue'


const store = useVPJLayout();
const {
    headerConfig
} = storeToRefs(store);
const { panelToggle } = store;

const tooltipPosition = "bottom"
const tooltipBoundary = ".vpj-layout-content"
const tooltipOffset = {x: 0, y: 6}
const tooltipSafeMargin = 16
const tooltipAttrs = {
    style: {
        backdropFilter: "var(--vpj-article-header-toolbar-btn-tooltip-backdrop-filter)",
        background: "var(--vpj-article-header-toolbar-btn-tooltip-bg)",
        borderRadius: "var(--vpj-article-header-toolbar-btn-tooltip-radius)",
        color: "var(--vpj-article-header-toolbar-btn-tooltip-color)",
        fontSize: "var(--vpj-article-header-toolbar-btn-tooltip-font-size)",
        maxWidth: "var(--vpj-article-header-toolbar-btn-tooltip-max-width)",
        overflow: "hidden",
        padding: "var(--vpj-article-header-toolbar-btn-tooltip-padding)",
        wordBreak: "break-all",
        zIndex: "var(--vpj-article-header-toolbar-btn-tooltip-z-index)",
    }
}

const tools = computed(() => {
    if (typeof headerConfig.value.toolbar !== 'object' || headerConfig.value.toolbar === null) return [];
    return Object.entries(headerConfig.value.toolbar).map(([key, value]) => ({
        key,
        order: value.order,
        icon: value.icon,
        callback: value.callback,
        tooltip: value.tooltip
    })).sort((a, b) => {
        return a.order - b.order
    });
});

const downloads = computed(() => {
    const result = [];

    // github button
    const github = headerConfig.value.github;
    if (typeof github.url === 'string') result.push({
        ...github,
        icon: VPJIconGithub,
        key: "github",
    });
    // markdown button
    const md = headerConfig.value.md;
    if (typeof md.url === 'string') result.push({
        ...md,
        icon: VPJIconMarkdown,
        key: "markdown",
    });
    // pdf button
    const pdf = headerConfig.value.pdf;
    if (typeof pdf.url === 'string') result.push({
        ...pdf,
        icon: VPJIconPDF,
        key: "pdf",
    });

    return result.sort((a, b) => a.order - b.order);
});

const features = computed(() => {
    const result = [];

    // history button
    const history = headerConfig.value.history;
    if (history.enabled && Object.keys(historyData).length !== 0) result.push({
        tooltip: history.tooltip,
        icon: VPJIconTimePast,
        callback: () => panelToggle("history"),
        order: history.order,
        key: "history",
    });
    // comment button
    const comment = headerConfig.value.comment;
    if (comment.enabled) result.push({
        tooltip: comment.tooltip,
        icon: VPJIconCommentAltDots,
        callback: () => panelToggle("comment"),
        order: comment.order,
        key: "comment",
    });

    return result.sort((a, b) => a.order - b.order);
});

const hasToolbar = computed(() => {
    return features.value.length > 0 || downloads.value.length > 0 || tools.value.length > 0;
});


defineExpose({ hasToolbar });
</script>


<template>
    <div class="vpj-article-header__toolbar">
        <VPJTooltipBtn
            v-for="feature in features"
            @click="feature.callback"
            :boundary="tooltipBoundary"
            :icon="feature.icon"
            :isLink="false"
            :key="feature.key"
            :tooltip="feature.tooltip"
            :tooltipPosition="tooltipPosition"
            :tooltipAttrs="tooltipAttrs"
            :offset="tooltipOffset"
            :safeMargin="tooltipSafeMargin"
            class="vpj-article-header__button"
        />
        <div
            v-if="features.length > 0 && (downloads.length > 0 || tools.length > 0)"
            class="vpj-article-header__divider"
        />
        <VPJTooltipBtn
            v-for="download in downloads"
            :boundary="tooltipBoundary"
            :icon="download.icon"
            :isLink="true"
            :key="download.key"
            :tooltip="download.tooltip"
            :tooltipPosition="tooltipPosition"
            :tooltipAttrs="tooltipAttrs"
            :offset="tooltipOffset"
            :safeMargin="tooltipSafeMargin"
            class="vpj-article-header__button"
            :href="download.url"
            :download="download.download"
        />
        <div
            v-if="tools.length > 0 && downloads.length > 0"
            class="vpj-article-header__divider"
        />
        <VPJTooltipBtn
            v-for="tool in tools"
            @click="tool.callback"
            :boundary="tooltipBoundary"
            :icon="tool.icon"
            :isLink="false"
            :key="tool.key"
            :tooltip="tool.tooltip"
            :tooltipPosition="tooltipPosition"
            :tooltipAttrs="tooltipAttrs"
            :offset="tooltipOffset"
            :safeMargin="tooltipSafeMargin"
            class="vpj-article-header__button"
        />
    </div>
</template>


<style scoped>
    /* Toolbar */
    .vpj-article-header__toolbar {
        align-items: center;
        display: flex;
        flex-shrink: 0;
        gap: var(--vpj-article-header-toolbar-gap);
        height: 100%;
        margin-left: auto;
    }

    /* Toolbar Divider */
    .vpj-article-header__divider {
        background: var(--vpj-article-header-toolbar-divider-bg);
        height: var(--vpj-article-header-toolbar-divider-height);
        width: var(--vpj-article-header-toolbar-divider-width);
        margin-left: var(--vpj-article-header-toolbar-divider-gap);
        margin-right: var(--vpj-article-header-toolbar-divider-gap);
    }
</style>