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
    <ClientOnly>
        <Teleport to=".vpj-portals-root">
            <Transition>
                <div v-if="!collapsed" @click="close" class="vpj-sidebar__overlay"/>
            </Transition>
        </Teleport>
    </ClientOnly>
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
        background: var(--vpj-sidebar-bg-collapsed, var(--vpj-sidebar-bg));
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
            backdrop-filter: var(--vpj-sidebar-overlay-backdrop-filter);
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

<style>
    .vpj-sidebar__btn,
    .vpj-sidebar__btn:visited {
        align-items: center;
        backdrop-filter: var(--vpj-sidebar-btn-backdrop-filter);
        background: var(--vpj-sidebar-btn-bg);
        border: var(--vpj-sidebar-btn-border);
        border-radius: var(--vpj-sidebar-btn-radius);
        display: flex;
        flex: 1;
        flex-direction: row;
        gap: var(--vpj-sidebar-btn-gap);
        height: var(--vpj-sidebar-btn-height);
        min-width: 0;
        overflow: hidden;
        padding: calc((var(--vpj-sidebar-btn-height) - max(var(--vpj-sidebar-btn-icon-size), var(--vpj-sidebar-btn-text-size))) / 2);
        text-decoration: none;
        transition:
            backdrop-filter var(--vpj-sidebar-transition),
            background var(--vpj-sidebar-transition),
            gap var(--vpj-sidebar-transition),
            padding var(--vpj-sidebar-transition),
            width var(--vpj-sidebar-transition);
    }

    .vpj-sidebar__btn:hover,
    .vpj-sidebar__btn:active {
        backdrop-filter: var(--vpj-sidebar-btn-backdrop-filter-hover);
        background: var(--vpj-sidebar-btn-bg-hover);
        transition: fill var(--vpj-sidebar-transition);
    }

    .vpj-sidebar__btn > .vpj-icon {
        fill: var(--vpj-sidebar-btn-icon-color);
        flex-shrink: 0;
        height: var(--vpj-sidebar-btn-icon-size);
        width: var(--vpj-sidebar-btn-icon-size);
    }

    .vpj-sidebar__btn:hover > .vpj-icon,
    .vpj-sidebar__btn:active > .vpj-icon {
        fill: var(--vpj-sidebar-btn-icon-color-hover);
    }

    .vpj-sidebar__btn > .vpj-text {
        color: var(--vpj-sidebar-btn-text-color);
        flex: 1;
        font-size: var(--vpj-sidebar-btn-text-size);
        font-weight: var(--vpj-sidebar-btn-text-weight);
        margin-right: calc((max(var(--vpj-sidebar-btn-icon-size), var(--vpj-sidebar-btn-text-size)) - var(--vpj-sidebar-btn-text-size)) / 2);
        opacity: 1;
        text-align: start;
        transition: opacity var(--vpj-sidebar-transition);
    }

    .vpj-sidebar__btn:hover > .vpj-text,
    .vpj-sidebar__btn:active > .vpj-text {
        color: var(--vpj-sidebar-btn-text-color-hover);
    }

    /* Collapsed */
    .collapsed .vpj-sidebar__btn,
    .vpj-sidebar__btn.collapsed {
        gap: 0;
        flex: 0 0 auto;
        padding-left: calc((var(--vpj-sidebar-width-collapsed) - var(--vpj-sidebar-btn-icon-size)) / 2 - var(--vpj-sidebar-padding-x));
    }

    .collapsed .vpj-sidebar__btn {
        width: 100%;
    }

    .vpj-sidebar__btn.collapsed {
        width: calc(var(--vpj-sidebar-width-collapsed) - 2 * var(--vpj-sidebar-padding-x));
    }

    .collapsed .vpj-sidebar__btn > .vpj-icon,
    .vpj-sidebar__btn.collapsed > .vpj-icon {
        margin-left: 0;
    }

    .collapsed .vpj-sidebar__btn > .vpj-text,
    .vpj-sidebar__btn.collapsed > .vpj-text {
        margin-right: 0;
        opacity: 0;
    }
</style>