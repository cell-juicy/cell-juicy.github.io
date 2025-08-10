<script setup>
import { computed, onMounted, ref, useTemplateRef } from 'vue';
import { storeToRefs } from 'pinia';

import { useVPJSidebar } from '../composables/useVPJSidebar';

import VPJDynamicIconBtn from './VPJDynamicIconBtn.vue';
import VPJDynamicIcon from './VPJDynamicIcon.vue';
import VPJOverlayScrollArea from './VPJOverlayScrollArea.vue';

import VPJIconAngleSquareLeft from './icons/VPJIconAngleSquareLeft.vue';
import VPJIconAngleSqureRight from './icons/VPJIconAngleSquareRight.vue';


const store = useVPJSidebar();
const {
    collapsed,
    headerConfig: config
} = storeToRefs(store);
const { toggle } = store;

// Toggle button
const toggleBtnIcon = computed(() => collapsed.value ? VPJIconAngleSqureRight : VPJIconAngleSquareLeft);

// Profile button
const profileBtn = useTemplateRef('profileBtn');
const profileVisible = ref(false);
const profileProsition = ref({
    bottom: 'auto',
    left: 'auto',
    right: 'auto',
    top: 'auto'
})


onMounted(() => {
    if (profileBtn.value) {
        if (config.value.profile?.enabled) {
            // add EventListener to profile button
            profileBtn.value.elementSelf.addEventListener('click', () => {
                const rect = profileBtn.value.elementSelf.getBoundingClientRect();
                if (rect.bottom + 355 < window.innerHeight) {
                    profileProsition.value.bottom = 'auto';
                    profileProsition.value.left = rect.left + 'px';
                    profileProsition.value.right = 'auto';
                    profileProsition.value.top = rect.bottom + 4 + 'px';
                } else {
                    profileProsition.value.bottom = window.innerHeight - rect.top + 4 + 'px';
                    profileProsition.value.left = rect.left + 'px';
                    profileProsition.value.right = 'auto';
                    profileProsition.value.top = 'auto';
                }
                profileVisible.value = !profileVisible.value;
            });
        };
    };
});
</script>


<template>
    <header
        :class="[
            'vpj-sidebar__header',
            { 'collapsed': collapsed }
        ]"
    >
        <slot name="sidebar-header-top"/>
        <div class="vpj-sidebar__header-container">
            <VPJDynamicIconBtn
                :icon="config.profile.logo"
                :text="config.profile.title"
                ref="profileBtn"
                class="vpj-sidebar__header-btn"
                data-action="profile"
                :disabled="!config.profile.enabled"
            />
            <VPJDynamicIconBtn
                @click="toggle" 
                :icon="toggleBtnIcon" 
                class="vpj-sidebar__header-btn" 
                data-action="toggle"
            />
        </div>
        <slot name="sidebar-header-bottom"/>
    </header>
    <Teleport to=".vpj-portals-root">
        <div
            v-if="profileVisible"
            @click="profileVisible = false"
            class="vpj-sidebar__header-profile-overlay"
        >
            <div @click.stop class="vpj-sidebar__profile">
                <header class="vpj-sidebar__profile-header">
                    <VPJDynamicIcon
                        :icon="config.profile.cardLogo"
                        class="vpj-sidebar__profile-logo"
                    />
                    <span class="vpj-sidebar__profile-title vpj-text">
                        {{ config.profile.cardTitle }}
                    </span>
                </header>
                <div class="vpj-sidebar__profile-main">
                    <component
                        v-if="config.profile.description.component"
                        :is="config.profile.description.component"
                    />
                    <VPJOverlayScrollArea
                        v-else
                        overflow="y"
                        :inner-attrs="{ class: 'vpj-sidebar__profile-description-inner' }"
                        class="vpj-sidebar__profile-description-outer"
                    >
                        {{ config.profile.description }}
                    </VPJOverlayScrollArea>
                </div>
            </div>
        </div>
    </Teleport>
</template>


<style scoped>
    /* Header layout */
    .vpj-sidebar__header {
        display: flex;
        flex-direction: column;
        gap: .625rem;
        padding-bottom: .5rem;
        padding-left: .75rem;
        padding-right: .75rem;
    }

    /* Row Container */
    .vpj-sidebar__header-container {
        display: flex;
        flex: 1;
        flex-direction: row;
        gap: .25rem;
        width: 100%;
    }

    /* Button style */
    .vpj-sidebar__header-btn {
        background-color: var(--vpj-color-bg-300);
        border: 0;
        border-radius: var(--vpj-border-radius-100);
        flex: 1;
        gap: .75rem;
        height: 2rem;
        min-width: 0;
        padding: .5rem;
    }

    .vpj-sidebar__header-btn:hover,
    .vpj-sidebar__header-btn:active {
        background-color: var(--vpj-color-bg-500);
    }

    /* Button Icon style */
    .vpj-sidebar__header-btn :deep(.vpj-icon) {
        fill: var(--vpj-color-text-300);
    }

    .vpj-sidebar__header-btn:hover :deep(.vpj-icon),
    .vpj-sidebar__header-btn:active :deep(.vpj-icon) {
        fill: var(--vpj-color-text-400);
    }

    /* Button Text style */
    .vpj-sidebar__header-btn :deep(.vpj-text) {
        color: var(--vpj-color-text-400);
        font-size: .875rem;
        opacity: 1;
        transition: opacity .2s ease-in-out;
    }

    .vpj-sidebar__header-profile-overlay {
        background-color: transparent;
        display: block;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
        z-index: 102;
    }

    /* StyleSheet for collapsed state */
    /* Container */
    .vpj-sidebar__header.collapsed .vpj-sidebar__header-container {
        flex-direction: column;
        gap: .625rem;
    }

    /* Button */
    .vpj-sidebar__header.collapsed .vpj-sidebar__header-btn {
        width: 2rem;
    }

    /* Button Text (hide when collapsed) */
    .vpj-sidebar__header.collapsed .vpj-sidebar__header-btn :deep(.vpj-text) {
        opacity: 0;
    }

    /* Profile button */
    [data-action="profile"] {
        padding: .4rem;
        transition: width .2s ease-in-out;
    }

    [data-action="profile"] :deep(.vpj-text) {
        font-weight: var(--vpj-font-weight-600);
    }

    [data-action="profile"] :deep(.vpj-icon) {
        border-radius: var(--vpj-border-radius-100);
        height: 1.4rem;
        width: 1.4rem;
    }

    /* Toggle button */
    [data-action="toggle"] {
        flex: 0 0 auto;
        width: 2rem;
    }

    /* Profile Card */
    .vpj-sidebar__profile {
        background-color: var(--vpj-color-bg-100);
        border: var(--vpj-border-width-200) solid var(--vpj-color-border-300);
        border-radius: var(--vpj-border-radius-200);
        box-shadow: var(--vpj-shadow-300);
        display: flex;
        flex-direction: column;
        position: fixed;
        padding-top: 8px;
        padding-bottom: 8px;
        bottom: v-bind("profileProsition.bottom");
        left: v-bind("profileProsition.left");
        right: v-bind("profileProsition.right");
        top: v-bind("profileProsition.top");
        max-width: min(15.25rem, 42.5vw);
        max-height: 355px;
        z-index: 102;
    }

    /* Header */
    .vpj-sidebar__profile-header {
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

    .vpj-sidebar__profile-logo {
        border-radius: var(--vpj-border-radius-100);
        height: 1.6rem;
        flex-shrink: 0;
        width: 1.6rem;
    }

    .vpj-sidebar__profile-title {
        color: var(--vpj-color-text-400);
        flex: 1;
        font-size: 1.1rem;
        font-weight: var(--vpj-font-weight-600);
    }

    /* Main */
    .vpj-sidebar__profile-main {
        align-items: center;
        display: flex;
        flex: 1;
        flex-direction: column;
        min-height: 0;
        width: 100%;
    }

    /* Default description style */
    .vpj-sidebar__profile-description-outer {
        align-self: stretch;
        flex: 1;
        width: 100%;
    }

    :deep(.vpj-sidebar__profile-description-inner) {
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
        .vpj-sidebar__profile {
            bottom: auto;
            left: 12px;
            right: 12px;
            top: 12px;
            min-width: none;
            max-width: none;
        }
    }
</style>