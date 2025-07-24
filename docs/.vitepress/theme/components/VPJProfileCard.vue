<script setup>
import { storeToRefs } from 'pinia';

import { useVPJSidebar } from '../composables/useVPJSidebar';

import VPJDynamicIcon from '../components/VPJDynamicIcon.vue';
import VPJOverlayScrollArea from '../components/VPJOverlayScrollArea.vue';


const store = useVPJSidebar();
const { profileConfig } = storeToRefs(store);

const props = defineProps({
    position: {
        type: Object,
        required: true
    }
})
</script>


<template>
    <div @click.stop class="vpj-profile-card">
        <header class="vpj-profile-card__header">
            <VPJDynamicIcon
                :icon="profileConfig.logo"
                class="vpj-profile-card__logo"
            />
            <span class="vpj-profile-card__title vpj-text">
                {{ profileConfig.title }}
            </span>
        </header>
        <div class="vpj-profile-card__main">
            <component v-if="profileConfig.description.component" :is="profileConfig.description.component"/>
            <VPJOverlayScrollArea
                v-else
                overflow="y"
                :inner-attrs="{ class: 'vpj-profile-card__description-inner' }"
                class="vpj-profile-card__description-outer"
            >
                {{ profileConfig.description }}
            </VPJOverlayScrollArea>
        </div>
    </div>
</template>


<style scoped>
    /* Card Layout */
    .vpj-profile-card {
        background-color: var(--vpj-color-bg-100);
        border: var(--vpj-border-width-200) solid var(--vpj-color-border-300);
        border-radius: var(--vpj-border-radius-200);
        box-shadow: var(--vpj-shadow-300);
        display: flex;
        flex-direction: column;
        position: fixed;
        padding-top: 8px;
        padding-bottom: 8px;
        bottom: v-bind('position.bottom');
        left: v-bind('position.left');
        right: v-bind('position.right');
        top: v-bind('position.top');
        max-width: 246px;
        min-width: 246px;
        max-height: 355px;
        z-index: 102;
    }

    /* Header */
    .vpj-profile-card__header {
        align-items: center;
        border-bottom: var(--vpj-border-width-200) solid var(--vpj-color-border-300);
        display: flex;
        flex-direction: row;
        gap: 16px;
        padding-left: 16px;
        padding-right: 16px;
        padding-top: 4px;
        padding-bottom: 12px;
    }

    .vpj-profile-card__logo {
        width: 24px;
        height: 24px;
        flex-shrink: 0;
    }

    .vpj-profile-card__title {
        color: var(--vpj-color-text-400);
        flex: 1;
        font-size: .875rem;
        font-weight: var(--vpj-font-weight-600);
    }

    /* Main */
    .vpj-profile-card__main {
        align-items: center;
        display: flex;
        flex: 1;
        flex-direction: column;
        min-height: 0;
        width: 100%;
    }

    /* Default description style */
    .vpj-profile-card__description-outer {
        align-self: stretch;
        flex: 1;
        width: 100%;
    }

    :deep(.vpj-profile-card__description-inner) {
        color: var(--vpj-color-text-400);
        font-size: .875rem;
        font-weight: var(--vpj-font-weight-600);
        min-height: max-content;
        padding-left: 12px;
        padding-right: 12px;
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
        width: 100%;
        word-break: break-all;
    }

    /* StyleSheet for mobile screen */
    @media screen and (max-width: 768px) {
        .vpj-profile-card {
            bottom: auto;
            left: 12px;
            right: 12px;
            top: 12px;
            min-width: none;
            max-width: none;
        }
    }
</style>