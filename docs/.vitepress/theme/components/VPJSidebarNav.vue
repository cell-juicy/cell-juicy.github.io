<script setup>
import { computed, ref, useTemplateRef } from 'vue';
import { storeToRefs } from 'pinia';

import { useVPJSidebar } from '../composables/useVPJSidebar';
import VPJSidebarNavLink from './VPJSidebarNavLink.vue';


const store = useVPJSidebar();
const { collapsed, navConfig } = storeToRefs(store);
</script>


<template>
    <nav :class="['vpj-sidebar-nav', 'vpj-scroll-y', {'collapsed': collapsed}]">
        <slot name="sidebar-nav-top"/>
        <ul class="vpj-sidebar-nav__link-list">
            <li 
                v-for="item in navConfig.links"
                :key="item.text"
                class="vpj-sidebar-nav__link-item"
            >
                <VPJSidebarNavLink
                    :icon="item.icon"
                    :text="item.text"
                    :link="item.link"
                    :tooltip="item.tooltip"
                    :highlight="item.highlight"
                    class="vpj-sidebar-nav__link"
                />
            </li>
        </ul>
        <component v-if="navConfig.content && !collapsed" :is="navConfig.content"/>
        <slot name="sidebar-nav-bottom"/>
    </nav>
</template>


<style scoped>
    /* Nav layout */
    .vpj-sidebar-nav {
        align-items: center;
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: .625rem;
        min-height: 0;
        overflow-x: hidden;
        padding-bottom: .75rem;
        padding-left: .75rem;
        padding-right: calc(.75rem - 4px);
        width: 100%;
    }

    /* Nav links */
    .vpj-sidebar-nav__link-list {
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

    .vpj-sidebar-nav__link-item {
        position: relative;
    }

    /* StyleSheet for collapsed state */
    .vpj-sidebar-nav.collapsed {
        padding-left: 12px;
        padding-right: 8px;
    }

    .vpj-sidebar-nav.collapsed .vpj-sidebar-nav__link-list {
        gap: .625rem;
    }

    /* Nav links */
    .vpj-sidebar-nav.collapsed .vpj-sidebar-nav__link {
        width: 36px;
        padding: 10px;
    }
</style>