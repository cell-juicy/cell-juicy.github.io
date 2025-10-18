<script setup>
import { storeToRefs } from 'pinia';

import { useVPJSidebar } from '../composables/useVPJSidebar';

import VPJOverlayScrollArea from './VPJOverlayScrollArea.vue';
import VPJSidebarNavItem from './VPJSidebarNavItem.vue';


const store = useVPJSidebar();
const {
    collapsed,
    navConfig: config
} = storeToRefs(store);
</script>


<template>
    <VPJOverlayScrollArea
        tag="nav"
        overflow="y"
        :class="[
            'vpj-sidebar__nav',
            { 'collapsed': collapsed }
        ]"
    >
        <slot name="sidebar-nav-top"/>
        <ul class="vpj-sidebar__nav-link-list">
            <VPJSidebarNavItem
                v-for="item in config.navLinks"
                :data="item"
            />
        </ul>
        <slot name="sidebar-nav-bottom"/>
    </VPJOverlayScrollArea>
</template>


<style scoped>
    .vpj-sidebar__nav {
        align-items: center;
        display: flex;
        flex: 1;
        flex-direction: column;
        mask-image: var(--vpj-sidebar-nav-mask);
        min-height: 0;
        padding: 0;
        width: 100%;
    }

    /* Nav links */
    .vpj-sidebar__nav-link-list {
        align-items: center;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        gap: var(--vpj-sidebar-nav-list-gap);
        margin: 0;
        padding-block: var(--vpj-sidebar-nav-list-padding-y);
        padding-inline: var(--vpj-sidebar-padding-x);
        transition: gap var(--vpj-sidebar-transition);
        width: 100%;
    }

    /* StyleSheet for collapsed state */
    .vpj-sidebar__nav.collapsed .vpj-sidebar__nav-link-list {
        gap: var(--vpj-sidebar-nav-list-gap-collapsed);
    }
</style>