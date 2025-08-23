<script setup>
import { useData } from 'vitepress';
import { ref, computed, watch, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';

import { useVPJLayout } from '../composables/useVPJLayout';

import { isMobile, isTablet, isDesktop } from '../utils/deviceTypes';

import VPJDynamicIconBtn from './VPJDynamicIconBtn.vue';

import VPJIconCrossSmall from './icons/VPJIconCrossSmall.vue';


const store = useVPJLayout();
const { panelCollapsed, panelTab } = storeToRefs(store);
const {
    panelClose
} = store;

const title = computed(() => {
    switch (panelTab.value) {
        case "history":
            return "历史提交"
        default:
            return ""
    }
})
</script>


<template>
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
                <div v-if="panelTab === 'history'"></div>
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
</template>


<style scoped>
    /* Main Layout */
    .vpj-panel {
        background-color: var(--vpj-color-bg-100);
        border-left-width: var(--vpj-border-width-200);
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        height: 100%;
        overflow: hidden;
        transition:
            transform 0.2s ease-in-out,
            width 0.2s ease-in-out;
        width: min(21.5rem, 35vw);
    }

    .vpj-panel.collapsed {
        width: 0;
        border-left: none;
    }

    .vpj-panel__header {
        align-items: center;
        border-bottom-width: var(--vpj-border-width-200);
        display: flex;
        flex-shrink: 0;
        height: 2.75rem;
        padding-bottom: .5rem;
        padding-left: .875rem;
        padding-right: .5rem;
        padding-top: .5rem;
        width: 100%;
    }

    .vpj-panel__content {
        flex: 1;
        width: 100%;
    }

    /* Title */
    .vpj-panel__title {
        flex: 1;
        font-size: 1rem;
        font-weight: var(--vpj-font-weight-600);
        user-select: none;
    }
    

    /* Close Button */
    .vpj-panel__close {
        align-items: center;
        background-color: var(--vpj-color-bg-100);
        border-radius: var(--vpj-border-radius-100);
        display: flex;
        height: 1.75rem;
        padding: .375rem;
        text-decoration: none;
        width: 1.75rem;
    }

    .vpj-panel__close :deep(.vpj-icon) {
        fill: var(--vpj-color-text-300);
        height: 1rem;
        width: 1rem;
    }

    .vpj-panel__close:hover,
    .vpj-panel__close:active {
        background-color: var(--vpj-color-bg-300);
    }

    .vpj-panel__close:hover :deep(.vpj-icon),
    .vpj-panel__close:active :deep(.vpj-icon) {
        fill: var(--vpj-color-text-400);
    }

    /* Overlay */
    .vpj-panel__overlay {
        display: block;
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
        z-index: 100;
    }

    /* Tablet style sheet */
    @media (max-width: 1024px) {
        .vpj-panel {
            position: fixed;
            bottom: 0;
            right: 0;
            top: 0;
            height: 100vh;
            width: min(20rem, 50vw);
            z-index: 101;
        }

        /* Collapsed */
        .vpj-panel.collapsed {
            transform: translateX(100%);
        }

        /* Overlay */
        .vpj-panel__overlay {
            position: fixed;
            background-color: transparent;
        }
    }

    @media (max-width: 768px) {
        /* Overlay */
        .vpj-panel__overlay {
            background-color: var(--vpj-overlay-400);
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
        transition: opacity 0.2s ease-in-out;
    }
</style>