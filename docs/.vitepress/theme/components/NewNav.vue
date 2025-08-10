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
        mask-image: linear-gradient(to bottom,
            transparent 0,
            black .5rem,
            black calc(100% - .5rem),
            transparent 100%
        );
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
        gap: .125rem;
        margin: 0;
        padding: .5rem .75rem;
        transition: gap .2s ease-in-out;
        width: 100%;
    }

    /* StyleSheet for collapsed state */
    .vpj-sidebar__nav.collapsed .vpj-sidebar__nav-link-list {
        gap: .625rem;
    }
</style>