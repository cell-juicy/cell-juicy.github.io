<script setup>
import { storeToRefs } from 'pinia';

import { useVPJSidebar } from '../composables/useVPJSidebar';

import VPJSidebarHeader from './VPJSidebarHeader.vue';
import VPJSidebarNav from './VPJSidebarNav.vue';
import VPJSidebarFooter from './VPJSidebarFooter.vue';


const store = useVPJSidebar();
const {
    collapsed,
    enabled,
} = storeToRefs(store);
const { close } = store;
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
        background: var(--vpj-sidebar-bg);
        border-right: var(--vpj-sidebar-border);
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        height: 100%;
        min-height: 0;
        padding-bottom: var(--vpj-sidebar-padding-bottom);
        padding-top: var(--vpj-sidebar-padding-top);
        transition:
            width var(--vpj-sidebar-transition),
            transform var(--vpj-sidebar-transition);
        width: var(--vpj-sidebar-width);
        z-index: var(--vpj-sidebar-z-index);
    }

    /* StyleSheet for collapsed state */
    .vpj-sidebar.collapsed {
        width: var(--vpj-sidebar-width-collapsed);
    }

    /* StyleSheet for overlay(only show on mobile screen) */
    .vpj-sidebar__overlay {
        display: none;
    }

    /* StyleSheet for mobile screen */
    @media screen and (max-width: 768px) {
        /* Sidebar */
        .vpj-sidebar {
            width: var(--vpj-sidebar-width-mobile, var(--vpj-sidebar-width));
            position: fixed;
            left: 0;
        }

        /* Collapsed */
        .vpj-sidebar.collapsed {
            transform: translateX(-100%);
        }

        /* Overlay */
        .vpj-sidebar__overlay {
            background: var(--vpj-sidebar-overlay);
            display: block;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            top: 0;
            z-index: var(--vpj-sidebar-overlay-z-index);
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