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
        <!-- <Transition> -->
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
        <!-- </Transition> -->
    </Teleport>
</template>


<style scoped>
    /* Header layout */
    .vpj-sidebar__header {
        display: flex;
        flex-direction: column;
        gap: var(--vpj-sidebar-header-gap);
        padding-bottom: var(--vpj-sidebar-header-nav-gap);
        padding-inline: var(--vpj-sidebar-padding-x);
        transition: gap var(--vpj-sidebar-transition);
    }

    /* Row Container */
    .vpj-sidebar__header-container {
        display: flex;
        flex: 1;
        flex-direction: row;
        gap: var(--vpj-sidebar-header-gap);
        width: 100%;
        transition: gap var(--vpj-sidebar-transition);
    }

    /* Button style */
    .vpj-sidebar__header-btn {
        background: var(--vpj-sidebar-btn-bg);
        border: var(--vpj-sidebar-btn-border);
        border-radius: var(--vpj-sidebar-btn-radius);
        flex: 1;
        gap: var(--vpj-sidebar-btn-gap);
        height: var(--vpj-sidebar-btn-height);
        min-width: 0;
        padding: calc((var(--vpj-sidebar-btn-height) - max(var(--vpj-sidebar-btn-icon-size), var(--vpj-sidebar-btn-text-size))) / 2);
        transition: padding var(--vpj-sidebar-transition);
    }

    .vpj-sidebar__header-btn:hover,
    .vpj-sidebar__header-btn:active {
        background: var(--vpj-sidebar-btn-bg-hover);
    }

    /* Button Icon style */
    .vpj-sidebar__header-btn :deep(.vpj-icon) {
        height: var(--vpj-sidebar-btn-icon-size);
        fill: var(--vpj-sidebar-btn-icon-color);
        margin-left: calc((max(var(--vpj-sidebar-btn-icon-size), var(--vpj-sidebar-btn-text-size)) - var(--vpj-sidebar-btn-icon-size)) / 2);
        width: var(--vpj-sidebar-btn-icon-size);
    }

    .vpj-sidebar__header-btn:hover :deep(.vpj-icon),
    .vpj-sidebar__header-btn:active :deep(.vpj-icon) {
        fill: var(--vpj-sidebar-btn-icon-color-hover);
    }

    /* Button Text style */
    .vpj-sidebar__header-btn :deep(.vpj-text) {
        color: var(--vpj-sidebar-btn-text-color);
        font-size: var(--vpj-sidebar-btn-text-size);
        font-weight: var(--vpj-sidebar-btn-text-weight);
        margin-right: calc((max(var(--vpj-sidebar-btn-icon-size), var(--vpj-sidebar-btn-text-size)) - var(--vpj-sidebar-btn-text-size)) / 2);
        opacity: 1;
        transition: opacity var(--vpj-sidebar-transition);
    }

    .vpj-sidebar__header-profile-overlay {
        background-color: var(--vpj-sidebar-profile-overlay);
        display: block;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
        z-index: var(--vpj-sidebar-profile-overlay-z-index);
    }

    /* StyleSheet for collapsed state */
    /* Main */
    .vpj-sidebar__header.collapsed {
        gap: var(--vpj-sidebar-header-gap-collapsed);
    }

    /* Container */
    .vpj-sidebar__header.collapsed .vpj-sidebar__header-container {
        flex-direction: column;
        gap: var(--vpj-sidebar-header-gap-collapsed);
    }

    /* Button Text (hide when collapsed) */
    .vpj-sidebar__header.collapsed .vpj-sidebar__header-btn :deep(.vpj-text) {
        opacity: 0;
    }

    /* Profile button */
    [data-action="profile"] {
        padding: calc((var(--vpj-sidebar-btn-height) - max(var(--vpj-sidebar-header-profile-btn-icon-size), var(--vpj-sidebar-btn-text-size))) / 2);
        transition: width var(--vpj-sidebar-transition);
    }

    [data-action="profile"] :deep(.vpj-text) {
        font-weight: var(--vpj-sidebar-header-profile-btn-text-weight);
        text-align: start;
    }

    [data-action="profile"] :deep(.vpj-icon) {
        border-radius: var(--vpj-sidebar-header-profile-btn-icon-radius);
        height: var(--vpj-sidebar-header-profile-btn-icon-size);
        margin-left: calc((max(var(--vpj-sidebar-header-profile-btn-icon-size), var(--vpj-sidebar-btn-text-size)) - var(--vpj-sidebar-header-profile-btn-icon-size)) / 2);
        width: var(--vpj-sidebar-header-profile-btn-icon-size);
    }

    .vpj-sidebar__header.collapsed [data-action="profile"] {
        width: calc(var(--vpj-sidebar-width-collapsed) - 2 * var(--vpj-sidebar-padding-x));
        margin-left: 0;
        padding-left: calc((var(--vpj-sidebar-width-collapsed) - var(--vpj-sidebar-header-profile-btn-icon-size))/2 - var(--vpj-sidebar-padding-x));
    }

    /* Toggle button */
    [data-action="toggle"] {
        flex: 0 0 auto;
        padding-left: calc((var(--vpj-sidebar-width-collapsed) - var(--vpj-sidebar-btn-icon-size))/2 - var(--vpj-sidebar-padding-x));
        width: calc(var(--vpj-sidebar-width-collapsed) - 2 * var(--vpj-sidebar-padding-x));
    }

    [data-action="toggle"] :deep(.vpj-icon) {
        margin-left: 0;
    }

    /* Profile Card */
    .vpj-sidebar__profile {
        background: var(--vpj-sidebar-profile-bg);
        border: var(--vpj-sidebar-profile-border);
        border-radius: var(--vpj-sidebar-profile-border-radius);
        box-shadow: var(--vpj-sidebar-profile-shadow);
        display: flex;
        flex-direction: column;
        position: fixed;
        padding-top: var(--vpj-sidebar-profile-border-radius);
        padding-bottom: var(--vpj-sidebar-profile-border-radius);
        bottom: v-bind("profileProsition.bottom");
        left: v-bind("profileProsition.left");
        right: v-bind("profileProsition.right");
        top: v-bind("profileProsition.top");
        max-width: var(--vpj-sidebar-profile-width);
        max-height: 355px;
        z-index: var(--vpj-sidebar-profile-z-index);
    }

    /* Header */
    .vpj-sidebar__profile-header {
        align-items: center;
        border-bottom: var(--vpj-sidebar-profile-border);
        display: flex;
        flex-direction: row;
        gap: var(--vpj-sidebar-profile-title-gap);
        padding: var(--vpj-sidebar-profile-title-padding);
    }

    .vpj-sidebar__profile-logo {
        border-radius: var(--vpj-sidebar-profile-title-icon-radius);
        height: var(--vpj-sidebar-profile-title-icon-size);
        flex-shrink: 0;
        width: var(--vpj-sidebar-profile-title-icon-size);
    }

    .vpj-sidebar__profile-title {
        color: var(--vpj-sidebar-profile-color);
        flex: 1;
        font-size: var(--vpj-sidebar-profile-title-font-size);
        font-weight: var(--vpj-sidebar-profile-font-weight);
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
        color: var(--vpj-sidebar-profile-color);
        font-size: var(--vpj-sidebar-profile-desc-font-size);
        font-weight: var(--vpj-sidebar-profile-font-weight);
        min-height: max-content;
        padding: var(--vpj-sidebar-profile-desc-padding);
        text-align: left;
        width: 100%;
        word-break: break-all;
    }

    /* StyleSheet for mobile screen */
    @media screen and (max-width: 768px) {
        .vpj-sidebar__profile {
            bottom: auto;
            left: var(--vpj-sidebar-padding-x);
            right: var(--vpj-sidebar-padding-x);
            top: var(--vpj-sidebar-padding-y);
            min-width: none;
            max-width: none;
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
        transition: opacity var(--vpj-sidebar-transition);
    }
</style>