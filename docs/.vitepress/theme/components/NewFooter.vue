<script setup>
import { storeToRefs } from 'pinia';

import { useVPJSidebar } from '../composables/newSidebar';

import VPJTooltipBtn from './VPJTooltipBtn.vue';


const tooltipPosition = "right";
const tooltipOffset = {x: 6, y: 0};
const tooltipAttrs = {
    style: {
        alignItems: "center",
        background: "var(--vpj-color-text-500)",
        borderRadius: "var(--vpj-border-radius-100)",
        color: "var(--vpj-color-bg-100)",
        display: "flex",
        fontSize: ".875rem",
        maxWidth: "200px",
        paddingTop: ".375rem",
        paddingBottom: ".375rem",
        paddingLeft: ".5rem",
        paddingRight: ".5rem",
        zIndex: 102
    },
    class: [
        "vpj-text"
    ]
};

const store = useVPJSidebar();
const {
    collapsed,
    highlight,
    footerConfig: config
} = storeToRefs(store);
</script>


<template>
    <footer
        :class="[
            'vpj-sidebar__footer',
            { 'collapsed': collapsed }
        ]"
    >
        <slot name="sidebar-footer-top"/>
        <ul class="vpj-sidebar__footer-link-list">
            <li
                v-for="item in config.footerLinks"
                :key="item.text"
                class="vpj-sidebar__footer-item"
            >
                <VPJTooltipBtn
                    v-show="!collapsed || item.showOnCollapsed"
                    :isLink="true"
                    :icon="item.icon"
                    :text="item.text"
                    :offset="tooltipOffset"
                    :tooltip="item.tooltip"
                    :tooltip-attrs="tooltipAttrs"
                    :tooltip-position="tooltipPosition"
                    :href="item.link"
                    :class="[
                        'vpj-sidebar__footer-item-link',
                        { 'highlight': highlight === item.link }
                    ]"
                    :style="{
                        '--vpj-highlight-normal': item.highlight.normal,
                        '--vpj-highlight-hover': item.highlight.hover,
                        '--vpj-highlight-active': item.highlight.active,
                    }"
                />
            </li>
        </ul>
        <slot name="sidebar-footer-bottom"/>
    </footer>
</template>


<style scoped>
    /* Footer layout */
    .vpj-sidebar__footer {
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
    .vpj-sidebar__footer-link-list {
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
    .vpj-sidebar__footer-item-link,
    .vpj-sidebar__footer-item-link:visited {
        background-color: var(--vpj-color-bg-300);
        border: 0;
        border-radius: var(--vpj-border-radius-100);
        flex: 1;
        gap: .5rem;
        height: 2rem;
        min-width: 0;
        padding-left: .5rem;
        padding-right: .5rem;
        text-decoration: none;
    }

    .vpj-sidebar__footer-item-link:hover,
    .vpj-sidebar__footer-item-link:active {
        background-color: var(--vpj-color-bg-500);
    }

    /* Nav link icon & text */
    .vpj-sidebar__footer-item-link :deep(.vpj-icon) {
        fill: var(--vpj-color-text-300);
    }

    .vpj-sidebar__footer-item-link:hover :deep(.vpj-icon),
    .vpj-sidebar__footer-item-link:active :deep(.vpj-icon) {
        fill: var(--vpj-color-text-400);
    }

    .vpj-sidebar__footer-item-link :deep(.vpj-text) {
        color: var(--vpj-color-text-400);
        font-size: .875rem;
        opacity: 1;
        transition: opacity .2s ease-in-out;
    }

    /* Highlight link */
    .vpj-sidebar__footer-item-link.highlight :deep(.vpj-icon) {
        fill: var(--vpj-highlight-normal, var(--vpj-color-primary-400));
    }

    .vpj-sidebar__footer-item-link.highlight:hover :deep(.vpj-icon) {
        fill: var(--vpj-highlight-hover, var(--vpj-color-primary-500));
    }

    .vpj-sidebar__footer-item-link.highlight:active :deep(.vpj-icon) {
        fill: var(--vpj-highlight-active, var(--vpj-color-primary-300));
    }

    /* StyleSheet for collapsed state */
    .vpj-sidebar__footer.collapsed .vpj-sidebar__footer-link-list {
        gap: .375rem;
    }

    /* Nav links */
    .vpj-sidebar__footer.collapsed .vpj-sidebar__footer-item-link {
        width: 2rem;
    }

    .vpj-sidebar__footer.collapsed .vpj-sidebar__footer-item-link :deep(.vpj-text) {
        opacity: 0;
    }
</style>