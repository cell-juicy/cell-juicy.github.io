<script setup>
import { computed, onMounted, ref, useTemplateRef } from 'vue';
import { storeToRefs } from 'pinia';

import { useVPJSidebar } from '../composables/useVPJSidebar';

import VPJDynamicIconBtn from './VPJDynamicIconBtn.vue';
import VPJProfileCard from './VPJProfileCard.vue';
import VPJIconAngleSquareLeft from './icons/VPJIconAngleSquareLeft.vue';
import VPJIconAngleSqureRight from './icons/VPJIconAngleSquareRight.vue';


// Sidebar header config and state
const store = useVPJSidebar();
const { collapsed, headerConfig, profileConfig } = storeToRefs(store);
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
        if (profileConfig.value.enabled) {
            // add EventListener to profile button
            profileBtn.value.elementSelf.addEventListener('click', () => {
                const rect = profileBtn.value.elementSelf.getBoundingClientRect();
                console.log('bottom:', rect.bottom,
                    ',condition:', rect.bottom + 355 < window.innerHeight,
                    ',vh:', window.innerHeight
                )
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
        }
    }
})
</script>


<template>
    <header :class="['vpj-sidebar-header', {'collapsed': collapsed}]">
        <slot name="sidebar-header-top"/>
        <div class="vpj-sidebar-header__container">
            <VPJDynamicIconBtn
                :icon="headerConfig.logo"
                :text="headerConfig.title"
                ref="profileBtn"
                class="vpj-sidebar-header__btn"
                data-action="profile"
                :disabled="!profileConfig.enabled"
            />
            <VPJDynamicIconBtn
                @click="toggle" 
                :icon="toggleBtnIcon" 
                class="vpj-sidebar-header__btn" 
                data-action="toggle"
            />
        </div>
        <slot name="sidebar-header-bottom"/>
    </header>
    <Teleport to=".vpj-portals-root">
        <div
            v-if="profileVisible"
            @click="profileVisible = false"
            class="vpj-sidebar-header__profile-overlay"
        >
            <VPJProfileCard :position="profileProsition"/>
        </div>
    </Teleport>
</template>


<style scoped>
    /* Header layout */
    .vpj-sidebar-header {
        display: flex;
        flex-direction: column;
        gap: .625rem;
        padding-bottom: 1rem;
        padding-left: 12px;
        padding-right: 12px;
    }

    /* Row Container */
    .vpj-sidebar-header__container {
        display: flex;
        flex: 1;
        flex-direction: row;
        gap: .25rem;
        width: 100%;
    }

    /* Button style */
    .vpj-sidebar-header__btn {
        background-color: var(--vpj-color-bg-300);
        border: 0;
        border-radius: var(--vpj-border-radius-100);
        flex: 1;
        gap: .75rem;
        height: 36px;
        min-width: 0;
        padding: auto;
        padding-left: .625rem;
        padding-right: .625rem;
    }

    .vpj-sidebar-header__btn:hover,
    .vpj-sidebar-header__btn:active {
        background-color: var(--vpj-color-bg-500);
    }

    /* Button Icon style */
    .vpj-sidebar-header__btn :deep(.vpj-icon) {
        fill: var(--vpj-color-text-300);
    }

    .vpj-sidebar-header__btn:hover :deep(.vpj-icon),
    .vpj-sidebar-header__btn:active :deep(.vpj-icon) {
        fill: var(--vpj-color-text-400);
    }

    /* Button Text style */
    .vpj-sidebar-header__btn :deep(.vpj-text) {
        color: var(--vpj-color-text-400);
        font-size: .875rem;
    }

    .vpj-sidebar-header__profile-overlay {
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
    .vpj-sidebar-header.collapsed .vpj-sidebar-header__container {
        flex-direction: column;
        gap: .625rem;
    }

    /* Button */
    .vpj-sidebar-header.collapsed .vpj-sidebar-header__btn {
        width: 36px;
        padding: 10px;
    }

    /* Button Icon */
    .vpj-sidebar-header.collapsed .vpj-sidebar-header__btn :deep(.vpj-icon) {
        width: 16px;
        height: 16px;
    }

    /* Button Text (hide when collapsed) */
    .vpj-sidebar-header.collapsed .vpj-sidebar-header__btn :deep(.vpj-text) {
        display: none;
    }

    /* Individual stylesheet */
    /* Profile button */
    [data-action="profile"]:disabled {
        background-color: var(--vpj-color-bg-300);
        border: 0;
        border-radius: var(--vpj-border-radius-100);
        flex: 1;
        gap: .75rem;
        height: 36px;
        min-width: 0;
        padding: auto;
        padding-left: .625rem;
        padding-right: .625rem;
    }

    [data-action="profile"] :deep(.vpj-text) {
        font-weight: var(--vpj-font-weight-600);
    }

    [data-action="profile"] :deep(.vpj-icon),
    .vpj-sidebar-header.collapsed [data-action="profile"] :deep(.vpj-icon) {
        height: 24px;
        width: 24px;
    }

    .vpj-sidebar-header.collapsed [data-action="profile"]  {
        padding: 6px;
    }

    /* Toggle button */
    [data-action="toggle"] {
        flex: 0 0 auto;
    }
</style>