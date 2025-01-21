<script setup>
import { storeToRefs } from 'pinia';

import { useVPJSidebar } from '../composables/useVPJSidebar';

import VPJSidebarHeader from './VPJSidebarHeader.vue';
import VPJSidebarNav from './VPJSidebarNav.vue';
import VPJSidebarFooter from './VPJSidebarFooter.vue';


const store = useVPJSidebar();
const { collapsed, enabled } = storeToRefs(store);
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
        <div v-if="!collapsed" @click="close" class="vpj-sidebar__overlay"/>
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
        padding-bottom: 1rem;
        padding-top: 1rem;
        transition: width 0.15s ease-in-out;
        width: 260px;
        z-index: 0;
    }

    /* StyleSheet for collapsed state */
    .vpj-sidebar.collapsed {
        width: 60px;
    }

    /* StyleSheet for overlay(only show on mobile screen) */
    .vpj-sidebar__overlay {
        display: none;
    }

    /* StyleSheet for mobile screen */
    @media screen and (max-width: 768px) {
        /* Sidebar */
        .vpj-sidebar {
            width: 300px;
            position: fixed;
            left: 0;
            transition: transform 0.15s ease-in-out;
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
</style>