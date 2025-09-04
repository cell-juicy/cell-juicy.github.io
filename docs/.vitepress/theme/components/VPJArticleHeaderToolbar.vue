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
        alignItems: "center",
        background: "var(--vpj-color-text-500)",
        borderRadius: "var(--vpj-border-radius-100)",
        color: "var(--vpj-color-bg-100)",
        display: "flex",
        fontSize: ".875rem",
        maxWidth: "240px",
        maxHeight: "200px",
        lineClamp: "4",
        overflow: "hidden",
        paddingTop: ".375rem",
        paddingBottom: ".375rem",
        paddingLeft: ".5rem",
        paddingRight: ".5rem",
        zIndex: "102"
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
        download: (typeof md.download === 'boolean')
            ? (md.download === true) ? true : false
            : (typeof md.download === 'string') ? md.download : undefined,
    });
    // pdf button
    const pdf = headerConfig.value.pdf;
    if (typeof pdf.url === 'string') result.push({
        ...pdf,
        icon: VPJIconPDF,
        key: "pdf",
        download: (typeof pdf.download === 'boolean')
            ? (pdf.download === true) ? true : false
            : (typeof pdf.download === 'string') ? pdf.download : undefined,
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
        key: "history",
    })

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
            class="vpj-article-header__toolbar-btn"
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
            class="vpj-article-header__toolbar-btn"
            :href="download.url"
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
            class="vpj-article-header__toolbar-btn"
        />
    </div>
</template>


<style scoped>
    /* Toolbar */
    .vpj-article-header__toolbar {
        align-items: center;
        display: flex;
        flex-shrink: 0;
        gap: .25rem;
        height: 100%;
        margin-left: auto;
    }

    .vpj-article-header__toolbar-btn {
        align-items: center;
        background-color: var(--vpj-color-bg-100);
        border-radius: var(--vpj-border-radius-100);
        height: 32px;
        padding-left: 8px;
        padding-right: 8px;
        text-decoration: none;
    }

    .vpj-article-header__toolbar-btn :deep(.vpj-icon) {
        fill: var(--vpj-color-text-300);
        height: 16px;
        width: 16px;
    }

    .vpj-article-header__toolbar-btn:hover,
    .vpj-article-header__toolbar-btn:active {
        background-color: var(--vpj-color-bg-300);
    }

    .vpj-article-header__toolbar-btn:hover :deep(.vpj-icon),
    .vpj-article-header__toolbar-btn:active :deep(.vpj-icon) {
        fill: var(--vpj-color-text-400);
    }


    /* Toolbar Divider */
    .vpj-article-header__divider {
        background-color: var(--vpj-color-border-400);
        height: 24px;
        width: 1px;
        margin-left: .25rem;
        margin-right: .25rem;
    }
</style>