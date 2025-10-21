<script setup>
import { useData } from 'vitepress';
import { ref, computed, watch, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';

import { useVPJLayout } from '../composables/useVPJLayout';
import { isMobile, isDesktop } from '../utils/deviceTypes';

import VPJArticleAsideSeriesPage from './VPJArticleAsideSeriesPage.vue';
import VPJArticleAsideTagsPage from './VPJArticleAsideTagsPage.vue';
import VPJArticleAsideTreePage from './VPJArticleAsideTreePage.vue';
import VPJArticleAsideResourcesPage from './VPJArticleAsideResourcesPage.vue';
import VPJArticleAsideOutlinePage from './VPJArticleAsideOutlinePage.vue';
import VPJOverlayScrollArea from './VPJOverlayScrollArea.vue';
import VPJDynamicIconBtn from './VPJDynamicIconBtn.vue';

import VPJIconCrossSmall from './icons/VPJIconCrossSmall.vue';


const store = useVPJLayout();
const { asideClose } = store;
const {
    asideCollapsed,
    asideConfig
} = storeToRefs(store);

const DEFAULT = {
    NOTAB: "暂无可用的侧边栏标签页",
    UNKNOWNTAB: "当前标签页无法加载",
}

const { frontmatter, theme } = useData();
const layout = computed(() => frontmatter.value.layout);

const tabsData = computed(() => {
    if (typeof asideConfig.value.tabs === 'object' && asideConfig.value.tabs !== null) {
        return Object.entries(asideConfig.value.tabs).map(([key, value]) => {
            return {
                key,
                order: value.order,
                component: value.component,
                name: value.name
            }
        }).sort((a, b) => {
            return a.order - b.order
        });
    };
    return [];
});
const activeTabKey = ref("");
const activeTabComponent = computed(() => {
    if (Array.isArray(tabsData.value)) {
        const tab = tabsData.value.find((data) => data.key === activeTabKey.value);
        if (tab) {
            if (tab.component === "VPJArticleAsideTagsPage" && layout.value === "blog") return VPJArticleAsideTagsPage;
            if (tab.component === "VPJArticleAsideSeriesPage" && layout.value === "blog") return VPJArticleAsideSeriesPage;
            if (tab.component === "VPJArticleAsideTreePage" && layout.value === "doc") return VPJArticleAsideTreePage;
            if (tab.component === "VPJArticleAsideResourcesPage" && layout.value === "doc") return VPJArticleAsideResourcesPage;
            if (tab.component === "VPJArticleAsideOutlinePage") return VPJArticleAsideOutlinePage;
            return tab.component;
        };
    };
    return "";
});
const noTab = computed(() => {
    const message = theme.value.components?.aside?.noTab;
    return (typeof message === 'string') ? message : DEFAULT.NOTAB;
});
const unknownTab = computed(() => {
    const message = theme.value.components?.aside?.unknownTab;
    return (typeof message === 'string') ? message : DEFAULT.UNKNOWNTAB;
});
const fallbackOpacity = computed(() => asideCollapsed.value ? "0": "1");


const stopWatcher = watch(tabsData, (newVal) => {
    if (newVal.length > 0) {
        activeTabKey.value = newVal[0].key;
    }
}, { immediate: true });

onUnmounted(() => {
    stopWatcher();
});
</script>


<template>
    <Teleport
        to=".vpj-portals-root"
        :disabled="!isMobile"
    >
        <aside
            :class="[
                'vpj-article-aside',
                { 'collapsed': asideCollapsed }
            ]"
        >
            <header class="vpj-article-aside__header">
                <VPJOverlayScrollArea
                    overflow="x"
                    thumb-width=3
                    :inner-attrs="{ class: 'vpj-article-aside__tablist' }"
                    class="vpj-article-aside__tabboxmask"
                >
                    <button
                        v-for="data in tabsData"
                        :key="data.key"
                        @click="activeTabKey = data.key"
                        :class="['vpj-article-aside__tab', { 'current': activeTabKey === data.key }]"
                    >
                        {{ data.name }}
                    </button>
                </VPJOverlayScrollArea>
                <VPJDynamicIconBtn
                    @click="asideClose"
                    :icon="VPJIconCrossSmall"
                    class="vpj-article-aside__close"
                />
            </header>
            <div v-if="tabsData.length === 0" class="vpj-article-aside__fallback">
                {{ noTab }}
            </div>
            <div v-else class="vpj-article-aside__content">
                <component v-if="activeTabComponent" :is="activeTabComponent"/>
                <div v-else class="vpj-article-aside__fallback">
                    {{ unknownTab }}
                </div>
            </div>
        </aside>
        <Transition>
            <div
                v-if="!isDesktop && !asideCollapsed"
                @click="asideClose"
                class="vpj-article-aside__overlay"
            />
        </Transition>
    </Teleport>
</template>


<style scoped>
    /* Main Layout */
    .vpj-article-aside {
        background: var(--vpj-article-aside-bg);
        border-right: var(--vpj-article-aside-border);
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        height: 100%;
        overflow: hidden;
        transition:
            transform var(--vpj-article-aside-transition),
            width var(--vpj-article-aside-transition);
        width: var(--vpj-article-aside-width);
        z-index: var(--vpj-article-aside-z-index);
    }

    .vpj-article-aside.collapsed {
        width: 0;
        border-right: none;
    }

    .vpj-article-aside__header {
        align-items: center;
        background: var(--vpj-article-aside-header-bg);
        border-bottom: var(--vpj-article-aside-border);
        display: flex;
        flex-shrink: 0;
        height: var(--vpj-article-aside-header-height);
        width: 100%;
    }

    .vpj-article-aside__content {
        flex: 1;
        width: 100%;
    }

    /* Tabs */
    .vpj-article-aside__tabboxmask {
        display: flex;
        flex: 1;
        height: 100%;
        mask-image: var(--vpj-article-aside-header-tabbox-mask-gradient);
    }

    .vpj-article-aside__tabboxmask :deep(.vpj-article-aside__tablist) {
        align-items: center;
        display: flex;
        flex: 1;
        flex-wrap: nowrap;
        gap: var(--vpj-article-aside-header-tablist-gap);
        height: 100%;
        padding-inline: var(--vpj-article-aside-header-tablist-padding-x);
    }

    .vpj-article-aside__tab {
        align-items: center;
        background: var(--vpj-article-aside-tab-bg);
        border-radius: var(--vpj-article-aside-tab-radius);
        color: var(--vpj-article-aside-tab-color);
        display: flex;
        flex: 0 0 auto;
        font-size: var(--vpj-article-aside-tab-font-size);
        height: var(--vpj-article-aside-tab-height);
        overflow: hidden;
        padding-inline: var(--vpj-article-aside-tab-padding-x);
        text-wrap: nowrap;
        width: max-content;
    }

    .vpj-article-aside__tab:hover {
        background: var(--vpj-article-aside-tab-bg-hover);
        color: var(--vpj-article-aside-tab-color-hover);
    }

    .vpj-article-aside__tab.current,
    .vpj-article-aside__tab:active {
        background: var(--vpj-article-aside-tab-bg-hover);
        border: var(--vpj-article-aside-tab-border-active);
        color: var(--vpj-article-aside-tab-color-hover);
    }

    /* Close Button */
    .vpj-article-aside__close {
        align-items: center;
        background: var(--vpj-article-aside-close-bg);
        border: var(--vpj-article-aside-close-border);
        border-radius: var(--vpj-article-aside-close-radius);
        display: none;
        height: var(--vpj-article-aside-close-size);
        padding: calc((var(--vpj-article-aside-close-size) - var(--vpj-article-aside-close-icon-size)) / 2);
        margin-inline: var(--vpj-article-aside-close-margin-x);
    }

    .vpj-article-aside__close :deep(.vpj-icon) {
        fill: var(--vpj-article-aside-close-icon-color);
        height: var(--vpj-article-aside-close-icon-size);
        width: var(--vpj-article-aside-close-icon-size);
    }

    .vpj-article-aside__close:hover,
    .vpj-article-aside__close:active {
        background: var(--vpj-article-aside-close-bg-hover);
    }

    .vpj-article-aside__close:hover :deep(.vpj-icon),
    .vpj-article-aside__close:active :deep(.vpj-icon) {
        fill: var(--vpj-article-aside-close-icon-color-hover);
    }

    /* Overlay */
    .vpj-article-aside__overlay {
        display: block;
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
        z-index: var(--vpj-article-aside-overlay-z-index);
    }

    /* Tablet style sheet */
    @media (max-width: 1024px) {
        .vpj-article-aside {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
        }

        .vpj-article-aside__overlay {
            position: absolute;
            background-color: var(--vpj-article-aside-overlay-bg);
        }
    }

    /* Mobile style sheet */
    @media (max-width: 768px) {
        .vpj-article-aside {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            height: 100vh;
            width: var(--vpj-article-aside-width-mobile);
        }

        /* Collapsed */
        .vpj-article-aside.collapsed {
            transform: translateX(-100%);
        }

        /* Overlay */
        .vpj-article-aside__overlay {
            position: fixed;
            background: var(--vpj-article-aside-overlay-bg-mobile);
        }

        .vpj-article-aside__close {
            display: flex;
        }
    }

    /* Vue Transition */
    .v-enter-from,
    .v-leave-to {
        opacity: 0;
    }

    .v-enter-to,
    .v-leave-from {
        opacity: 1;
    }

    .v-enter-active,
    .v-leave-active {
        transition: opacity var(--vpj-article-aside-transition);
    }
</style>

<style>
    /* Fallback */
    .vpj-article-aside__fallback {
        align-items: center;
        background: var(--vpj-article-aside-fallback-bg);
        color: var(--vpj-article-aside-fallback-color);
        display: flex;
        flex: 1;
        font-size: var(--vpj-article-aside-fallback-font-size);
        font-weight: var(--vpj-article-aside-fallback-font-weight);
        height: 100%;
        justify-content: center;
        line-height: var(--vpj-article-aside-fallback-line-height);
        min-height: 0;
        min-width: 0;
        opacity: v-bind(fallbackOpacity);
        overflow: hidden;
        overflow-wrap: break-word;
        padding-inline: var(--vpj-article-aside-fallback-padding-x);
        transition: opacity var(--vpj-article-aside-transition);
        user-select: none;
        width: 100%;
        word-break: break-all;
    }
</style>