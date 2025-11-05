<script setup>
import { computed } from 'vue';
import { useData } from 'vitepress';
import { storeToRefs } from 'pinia';

import { useVPJLayout } from '../composables/useVPJLayout';

import { isMobile, isDesktop } from '../utils/deviceTypes';

import VPJDynamicIconBtn from './VPJDynamicIconBtn.vue';
import VPJPanelHistoryPage from './VPJPanelHistoryPage.vue';

import VPJIconCrossSmall from './icons/VPJIconCrossSmall.vue';
import VPJPanelCommentPage from './VPJPanelCommentPage.vue';


const DEFAULT = {
    NOTAB: "",
    TABTITLE: {
        HISTORY: "历史提交",
        COMMENT: "评论",
    },
};

const { theme } = useData();
const store = useVPJLayout();
const { panelCollapsed, panelTab } = storeToRefs(store);
const {
    panelClose
} = store;

const noTab = computed(() => {
    const message = theme.value.components?.panel?.noTab;
    return (typeof message === 'string') ? message : DEFAULT.NOTAB;
});
const historyTitle = computed(() => {
    const message = theme.value.components?.panel?.tabTitle?.history;
    return (typeof message === 'string') ? message : DEFAULT.TABTITLE.HISTORY;
});
const commentTitle = computed(() => {
    const message = theme.value.components?.panel?.tabTitle?.comment;
    return (typeof message === 'string') ? message : DEFAULT.TABTITLE.COMMENT;
});

const title = computed(() => {
    switch (panelTab.value) {
        case "history":
            return historyTitle.value;
        case "comment":
            return commentTitle.value;
        default:
            return "";
    }
})
</script>


<template>
    <ClientOnly>
        <Teleport
            to=".vpj-portals-root"
            :disabled="!isMobile"
        >
            <aside
                :class="[
                    'vpj-panel',
                    { 'collapsed': panelCollapsed }
                ]"
            >
                <header class="vpj-panel__header">
                    <span class="vpj-panel__title vpj-text">
                        {{ title }}
                    </span>
                    <VPJDynamicIconBtn
                        @click="panelClose"
                        :icon="VPJIconCrossSmall"
                        class="vpj-panel__close"
                    />
                </header>
                <div class="vpj-panel__content">
                    <VPJPanelHistoryPage v-if="panelTab === 'history'"/>
                    <VPJPanelCommentPage v-else-if="panelTab === 'comment'"/>
                    <div
                        v-else
                        class="vpj-panel__fallback"
                    >
                        {{ noTab }}
                    </div>
                </div>
            </aside>
            <Transition>
                <div
                    v-if="!isDesktop && !panelCollapsed"
                    @click="panelClose"
                    class="vpj-panel__overlay"
                />
            </Transition>
        </Teleport>
    </ClientOnly>
</template>


<style scoped>
    /* Main Layout */
    .vpj-panel {
        background: var(--vpj-panel-bg);
        border-left: var(--vpj-panel-border);
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        height: 100%;
        overflow: hidden;
        transition:
            transform var(--vpj-panel-transition),
            width var(--vpj-panel-transition);
        width: var(--vpj-panel-width);
        z-index: var(--vpj-panel-z-index);
    }

    .vpj-panel.collapsed {
        width: 0;
        border-left: none;
    }

    .vpj-panel__header {
        align-items: center;
        backdrop-filter: var(--vpj-panel-header-backdrop-filter);
        background: var(--vpj-panel-header-bg);
        border-bottom: var(--vpj-panel-border);
        display: flex;
        flex-shrink: 0;
        height: var(--vpj-panel-header-height);
        padding-inline: var(--vpj-panel-header-padding-x);
        width: 100%;
    }

    .vpj-panel__content {
        flex: 1;
        width: 100%;
    }

    /* Title */
    .vpj-panel__title {
        color: var(--vpj-panel-title-color);
        flex: 1;
        font-size: var(--vpj-panel-title-size);
        font-weight: var(--vpj-panel-title-weight);
        user-select: none;
    }
    

    /* Close Button */
    .vpj-panel__close {
        align-items: center;
        backdrop-filter: var(--vpj-panel-close-btn-backdrop-filter);
        background: var(--vpj-panel-close-btn-bg);
        border: var(--vpj-panel-close-btn-border);
        border-radius: var(--vpj-panel-close-btn-radius);
        display: flex;
        height: var(--vpj-panel-close-btn-size);
        padding: calc((var(--vpj-panel-close-btn-size) - var(--vpj-panel-close-btn-icon-size)) / 2);
        text-decoration: none;
        transition:
            backdrop-filter var(--vpj-panel-transition),
            background var(--vpj-panel-transition);
        width: var(--vpj-panel-close-btn-size);
    }

    .vpj-panel__close :deep(.vpj-icon) {
        fill: var(--vpj-panel-close-btn-icon-color);
        height: var(--vpj-panel-close-btn-icon-size);
        transition: fill var(--vpj-panel-transition);
        width: var(--vpj-panel-close-btn-icon-size);
    }

    .vpj-panel__close:hover,
    .vpj-panel__close:active {
        backdrop-filter: var(--vpj-panel-close-btn-backdrop-filter-hover);
        background: var(--vpj-panel-close-btn-bg-hover);
    }

    .vpj-panel__close:hover :deep(.vpj-icon),
    .vpj-panel__close:active :deep(.vpj-icon) {
        fill: var(--vpj-panel-close-btn-icon-color-hover);
    }

    /* Overlay */
    .vpj-panel__overlay {
        backdrop-filter: var(--vpj-panel-overlay-backdrop-filter);
        background: var(--vpj-panel-overlay-bg);
        bottom: 0;
        display: block;
        left: 0;
        right: 0;
        top: 0;
        z-index: var(--vpj-panel-z-index);
    }

    /* Tablet style sheet */
    @media (max-width: 1024px) {
        .vpj-panel {
            position: fixed;
            bottom: 0;
            right: 0;
            top: 0;
            height: 100vh;
            width: var(--vpj-panel-width-mobile);
        }

        /* Collapsed */
        .vpj-panel.collapsed {
            transform: translateX(100%);
        }

        /* Overlay */
        .vpj-panel__overlay {
            position: fixed;
            z-index: var(--vpj-panel-overlay-z-index);
        }
    }

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
        transition: opacity var(--vpj-panel-transition);
    }
</style>

<style>
    /* Fallback */
    .vpj-panel__fallback {
        align-items: center;
        backdrop-filter: var(--vpj-panel-fallback-backdrop-filter);
        background: var(--vpj-panel-fallback-bg);
        color: var(--vpj-panel-fallback-color);
        display: flex;
        flex: 1;
        font-size: var(--vpj-panel-fallback-font-size);
        font-weight: var(--vpj-panel-fallback-font-weight);
        height: 100%;
        justify-content: center;
        line-height: var(--vpj-panel-fallback-line-height);
        min-height: 0;
        min-width: 0;
        opacity: v-bind(fallbackOpacity);
        overflow: hidden;
        overflow-wrap: break-word;
        padding-inline: var(--vpj-panel-fallback-padding-x);
        transition: opacity var(--vpj-panel-transition);
        user-select: none;
        width: 100%;
        word-break: break-all;
    }
</style>