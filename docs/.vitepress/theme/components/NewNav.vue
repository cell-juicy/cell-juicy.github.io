<script setup>
import { storeToRefs } from 'pinia';

import { useVPJSidebar } from '../composables/newSidebar';

import VPJOverlayScrollArea from './VPJOverlayScrollArea.vue';
import VPJSidebarNavItem from './NewNavItem.vue';


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
        min-height: 0;
        overflow-x: hidden;
        padding-bottom: .75rem;
        padding-left: .75rem;
        padding-right: .75rem;
        width: 100%;
    }

    /* Nav links */
    .vpj-sidebar__nav-link-list {
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        gap: .125rem;
        list-style-type: none;
        margin: 0;
        padding: 0;
        position: relative;
        width: 100%;
    }

    /* StyleSheet for collapsed state */
    .vpj-sidebar__nav.collapsed {
        padding-left: 8px;
        padding-right: 8px;
    }

    .vpj-sidebar__nav.collapsed .vpj-sidebar__nav-link-list {
        gap: .625rem;
    }
</style>