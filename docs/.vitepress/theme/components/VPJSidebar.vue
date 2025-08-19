<script setup>
import { provide } from 'vue';
import { storeToRefs } from 'pinia';

import { useVPJSidebar } from '../composables/useVPJSidebar';
import { VPJ_SIDEBAR_SYMBOL } from '../utils/symbols';

import VPJSidebarHeader from './VPJSidebarHeader.vue';
import VPJSidebarNav from './VPJSidebarNav.vue';
import VPJSidebarFooter from './VPJSidebarFooter.vue';


const store = useVPJSidebar();
const {
    collapsed,
    highlight,
    enabled,
} = storeToRefs(store);
const { close } = store;

provide(VPJ_SIDEBAR_SYMBOL, {
    highlight,
});
</script>


<template>
    <aside v-if="enabled" :class="['vpj-sidebar', {'collapsed': collapsed}]">
        <slot name="sidebar-top"/>
        <slot name="sidebar-header">
            <VPJSidebarHeader>
                <template #sidebar-header-top><slot name="sidebar-header-top"/></template>
                <template #sidebar-header-bottom><slot name="sidebar-header-bottom"/></template>
            </VPJSidebarHeader>
        </slot>
        <slot name="sidebar-nav">
            <VPJSidebarNav>
                <template #sidebar-nav-top><slot name="sidebar-nav-top"/></template>
                <template #sidebar-nav-bottom><slot name="sidebar-nav-bottom"/></template>
            </VPJSidebarNav>
        </slot>
        <slot name="sidebar-footer">
            <VPJSidebarFooter>
                <template #sidebar-footer-top><slot name="sidebar-footer-top"/></template>
                <template #sidebar-footer-bottom><slot name="sidebar-footer-bottom"/></template>
            </VPJSidebarFooter>
        </slot>
        <slot name="sidebar-bottom"/>
    </aside>
    <Teleport to=".vpj-portals-root">
        <Transition>
            <div v-if="!collapsed" @click="close" class="vpj-sidebar__overlay"/>
        </Transition>
    </Teleport>
</template>


<style scoped>
    /* Sidebar layout */
    .vpj-sidebar {
        background-color: var(--vpj-color-bg-300);
        border-right: var(--vpj-border-width-200) solid var(--vpj-color-border-300);
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        height: 100%;
        min-height: 0;
        padding-bottom: .5rem;
        padding-top: 1rem;
        transition:
            padding-bottom 0.2s ease-in-out,
            width 0.2s ease-in-out,
            transform 0.2s ease-in-out;
        width: min(16.5rem, 50vw);
        z-index: 0;
    }

    /* StyleSheet for collapsed state */
    .vpj-sidebar.collapsed {
        padding-bottom: 1rem;
        width: 3.5rem;
    }

    /* StyleSheet for overlay(only show on mobile screen) */
    .vpj-sidebar__overlay {
        display: none;
    }

    /* StyleSheet for mobile screen */
    @media screen and (max-width: 768px) {
        /* Sidebar */
        .vpj-sidebar {
            width: min(20rem, 60vw);
            position: fixed;
            left: 0;
            z-index: 101;
        }

        /* Collapsed */
        .vpj-sidebar.collapsed {
            transform: translateX(-100%);
        }

        /* Overlay */
        .vpj-sidebar__overlay {
            background-color: var(--vpj-overlay-400);
            display: block;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            top: 0;
            z-index: 100;
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
        transition: opacity 0.2s ease-in-out;
    }
</style>