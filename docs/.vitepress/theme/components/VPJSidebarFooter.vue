<script setup>
import { storeToRefs } from 'pinia';

import { useVPJSidebar } from '../composables/useVPJSidebar';

import VPJTooltipBtn from './VPJTooltipBtn.vue';
import VPJOverlayScrollArea from './VPJOverlayScrollArea.vue'
import VPJDynamicIcon from './VPJDynamicIcon.vue';


const tooltipPosition = "right";
const tooltipOffset = {x: 6, y: 0};
const tooltipAttrs = {
    style: {
        alignItems: "center",
        background: "var(--vpj-sidebar-btn-tooltip-bg)",
        borderRadius: "var(--vpj-sidebar-btn-tooltip-radius)",
        color: "var(--vpj-sidebar-btn-tooltip-color)",
        display: "flex",
        fontSize: "var(--vpj-sidebar-btn-tooltip-font-size)",
        maxWidth: "var(--vpj-sidebar-btn-tooltip-max-width)",
        padding: "var(--vpj-sidebar-btn-tooltip-padding)",
        zIndex: "var(--vpj-sidebar-btn-tooltip-z-index)"
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
                    v-show="!collapsed || (item.showOnCollapsed && item.icon)"
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
        <VPJOverlayScrollArea
            v-show="!collapsed && config.socialLinks.length > 0"
            overflow="x"
            thumb-width=3
            :inner-attrs="{ class: 'vpj-sidebar__footer-social-links-inner' }"
            class="vpj-sidebar__footer-social-links-outer"
        >
            <a
                v-for="data in config.socialLinks"
                class="vpj-sidebar__footer-social-link"
                :href="data.link"
                :aria-label="data.ariaLabel"
                target="_blank"
                rel="noopener"
            >
                <VPJDynamicIcon
                    class="vpj-icon"
                    :icon="data.icon"
                />
            </a>
        </VPJOverlayScrollArea>
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
        padding-top: var(--vpj-sidebar-nav-footer-gap);
        width: 100%;
    }

    /* Footer links */
    .vpj-sidebar__footer-link-list {
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        gap: var(--vpj-sidebar-footer-links-gap);
        list-style-type: none;
        margin: 0;
        padding-inline: var(--vpj-sidebar-padding-x);
        position: relative;
        width: 100%;
    }

    /* Footer link */
    .vpj-sidebar__footer-item-link,
    .vpj-sidebar__footer-item-link:visited {
        background: var(--vpj-sidebar-btn-bg);
        border: var(--vpj-sidebar-btn-border);
        border-radius: var(--vpj-sidebar-btn-radius);
        flex: 1;
        gap: var(--vpj-sidebar-btn-gap);
        height: var(--vpj-sidebar-btn-height);
        min-width: 0;
        padding: calc((var(--vpj-sidebar-btn-height) - max(var(--vpj-sidebar-btn-icon-size), var(--vpj-sidebar-btn-text-size))) / 2);;
        text-decoration: none;
    }

    .vpj-sidebar__footer-item-link:hover,
    .vpj-sidebar__footer-item-link:active {
        background-color: var(--vpj-sidebar-btn-bg-hover);
    }

    /* Footer link icon & text */
    .vpj-sidebar__footer-item-link :deep(.vpj-icon) {
        fill: var(--vpj-sidebar-btn-icon-color);
        height: var(--vpj-sidebar-btn-icon-size);
        margin-left: ((max(var(--vpj-sidebar-btn-icon-size), var(--vpj-sidebar-btn-text-size)) - var(--vpj-sidebar-btn-icon-size)) / 2);
        width: var(--vpj-sidebar-btn-icon-size);
    }

    .vpj-sidebar__footer-item-link:hover :deep(.vpj-icon),
    .vpj-sidebar__footer-item-link:active :deep(.vpj-icon) {
        fill: var(--vpj-sidebar-btn-icon-color-hover);
    }

    .vpj-sidebar__footer-item-link :deep(.vpj-text) {
        color: var(--vpj-sidebar-btn-text-color);
        font-size: var(--vpj-sidebar-btn-text-size);
        opacity: 1;
        transition: opacity var(--vpj-sidebar-transition);
    }

    /* Highlight link */
    .vpj-sidebar__footer-item-link.highlight :deep(.vpj-icon) {
        fill: var(--vpj-highlight-normal, var(--vpj-sidebar-item-highlight-normal));
    }

    .vpj-sidebar__footer-item-link.highlight:hover :deep(.vpj-icon) {
        fill: var(--vpj-highlight-hover, var(--vpj-sidebar-item-highlight-hover));
    }

    .vpj-sidebar__footer-item-link.highlight:active :deep(.vpj-icon) {
        fill: var(--vpj-highlight-active, var(--vpj-sidebar-item-highlight-active));
    }

    /* Social Links */
    .vpj-sidebar__footer-social-links-outer {
        margin-top: var(--vpj-sidebar-footer-social-links-margin-top);
        mask-image: var(--vpj-sidebar-footer-social-links-mask);
        width: 100%;
    }

    :deep(.vpj-sidebar__footer-social-links-inner) {
        align-items: center;
        display: flex;
        flex: 1;
        gap: var(--vpj-sidebar-footer-social-links-gap);
        height: var(--vpj-sidebar-btn-height);
        margin-bottom: 4px;
        padding-inline: var(--vpj-sidebar-footer-social-links-padding-x);
        width: 100%;
    }

    .vpj-sidebar__footer-social-link,
    .vpj-sidebar__footer-social-link:visited {
        align-items: center;
        background-color: var(--vpj-sidebar-btn-bg);
        border: var(--vpj-sidebar-btn-border);
        border-radius: var(--vpj-sidebar-btn-radius);
        display: flex;
        flex-shrink: 0;
        height: var(--vpj-sidebar-btn-height);
        justify-content: center;
        padding: .5rem;
        text-decoration: none;
        width: calc(var(--vpj-sidebar-width-collapsed) - 2 * var(--vpj-sidebar-padding-x));
    }

    .vpj-sidebar__footer-social-link:hover,
    .vpj-sidebar__footer-social-link:active {
        background: var(--vpj-sidebar-btn-bg-hover);
    }

    .vpj-sidebar__footer-social-link > .vpj-icon {
        height: var(--vpj-sidebar-btn-icon-size);
        width: var(--vpj-sidebar-btn-icon-size);
    }

    .vpj-sidebar__footer-social-link > .vpj-icon {
        fill: var(--vpj-sidebar-btn-icon-color);
    }

    .vpj-sidebar__footer-social-link:hover > .vpj-icon,
    .vpj-sidebar__footer-social-link:active > .vpj-icon {
        fill: var(--vpj-sidebar-btn-icon-color-hover);
    }


    /* StyleSheet for collapsed state */
    .vpj-sidebar__footer.collapsed .vpj-sidebar__footer-link-list {
        gap: var(--vpj-sidebar-footer-links-gap-collapsed);
    }

    /* Footer links */
    .vpj-sidebar__footer.collapsed .vpj-sidebar__footer-item-link {
        width: calc(var(--vpj-sidebar-width-collapsed) - 2 * var(--vpj-sidebar-padding-x));
        padding-left: calc((var(--vpj-sidebar-width-collapsed) - var(--vpj-sidebar-btn-icon-size)) / 2 - var(--vpj-sidebar-padding-x));
    }

    .vpj-sidebar__footer.collapsed .vpj-sidebar__footer-item-link :deep(.vpj-icon) {
        margin-left: 0;
    }

    .vpj-sidebar__footer.collapsed .vpj-sidebar__footer-item-link :deep(.vpj-text) {
        opacity: 0;
        margin-right: 0;
    }
</style>