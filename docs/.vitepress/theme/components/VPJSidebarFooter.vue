<script setup>
import { storeToRefs } from 'pinia';

import { useVPJSidebar } from '../composables/useVPJSidebar';
import VPJDynamicIconBtn from './VPJDynamicIconBtn.vue';


const store = useVPJSidebar();
const { collapsed, footerConfig } = storeToRefs(store);
</script>


<template>
    <footer
        v-show="!collapsed || footerConfig.show"
        :class="['vpj-sidebar-footer', {'collapsed': collapsed}]"
    >
        <slot name="sidebar-footer-top"/>
        <ul class="vpj-sidebar-footer__link-list">
            <li
                v-for="item in footerConfig.links"
                :key="item.text"
                class="vpj-sidebar-footer__link-item"
            >
                <VPJDynamicIconBtn
                    v-show="!collapsed || item.showOnCollapse"
                    v-bind="item.attrs"
                    :isLink="true"
                    :icon="item.icon"
                    :text="item.text"
                    :href="item.link"
                    class="vpj-sidebar-footer__link"
                />
            </li>
        </ul>
        <slot name="sidebar-footer-bottom"/>
    </footer>
</template>


<style scoped>
    /* Footer layout */
    .vpj-sidebar-footer {
        align-items: center;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        min-height: 0;
        overflow-x: hidden;
        padding-left: .75rem;
        padding-right: calc(.75rem - 4px);
        padding-top: 1rem;
        width: 100%;
    }

    /* Footer links */
    .vpj-sidebar-footer__link-list {
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

    /* Footer link */
    .vpj-sidebar-footer__link,
    .vpj-sidebar-footer__link:visited {
        background-color: var(--vpj-color-bg-300);
        border: 0;
        border-radius: var(--vpj-border-radius-100);
        flex: 1;
        gap: .75rem;
        height: 36px;
        min-width: 0;
        padding-left: .625rem;
        padding-right: .625rem;
        text-decoration: none;
    }

    .vpj-sidebar-footer__link:hover,
    .vpj-sidebar-footer__link:active {
        background-color: var(--vpj-color-bg-500);
    }

    /* Nav link icon & text */
    .vpj-sidebar-footer__link :deep(.vpj-icon) {
        fill: var(--vpj-color-text-300);
    }

    .vpj-sidebar-footer__link:hover :deep(.vpj-icon),
    .vpj-sidebar-footer__link:active :deep(.vpj-icon) {
        fill: var(--vpj-color-text-400);
    }

    .vpj-sidebar-footer__link :deep(.vpj-text) {
        color: var(--vpj-color-text-400);
        font-size: .875rem;
    }

    /* StyleSheet for collapsed state */
    .vpj-sidebar-footer.collapsed {
        padding-left: 12px;
        padding-right: 8px;
    }

    .vpj-sidebar-footer.collapsed .vpj-sidebar-footer__link-list {
        gap: .375rem;
    }

    /* Nav links */
    .vpj-sidebar-footer.collapsed .vpj-sidebar-footer__link {
        width: 36px;
        padding: 10px;
    }
</style>