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
        backdropFilter: "var(--vpj-sidebar-btn-tooltip-backdrop-filter)",
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
        <VPJOverlayScrollArea
            v-show="!collapsed && config.socialLinks.length > 0"
            overflow="x"
            thumb-width=3
            :inner-attrs="{ class: 'vpj-sidebar__footer-social-links-inner' }"
            class="vpj-sidebar__footer-social-links-outer"
        >
            <a
                v-for="data in config.socialLinks"
                class="vpj-sidebar__btn collapsed"
                :href="data.link"
                :aria-label="data.ariaLabel"
                target="_blank"
                rel="noopener"
                data-action="social-link"
            >
                <VPJDynamicIcon
                    class="vpj-icon"
                    :icon="data.icon"
                />
            </a>
        </VPJOverlayScrollArea>
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
                        'vpj-sidebar__btn',
                        { 'highlight': highlight === item.link }
                    ]"
                    :style="{
                        '--vpj-highlight-normal': item.highlight.normal,
                        '--vpj-highlight-hover': item.highlight.hover,
                        '--vpj-highlight-active': item.highlight.active,
                    }"
                    data-action="footer-link"
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

    /* Highlight link */
    [data-action="footer-link"].highlight :deep(.vpj-icon) {
        fill: var(--vpj-highlight-normal, var(--vpj-sidebar-item-highlight-normal));
    }

    [data-action="footer-link"].highlight:hover :deep(.vpj-icon) {
        fill: var(--vpj-highlight-hover, var(--vpj-sidebar-item-highlight-hover));
    }

    [data-action="footer-link"].highlight:active :deep(.vpj-icon) {
        fill: var(--vpj-highlight-active, var(--vpj-sidebar-item-highlight-active));
    }

    /* Social Links */
    .vpj-sidebar__footer-social-links-outer {
        margin-bottom: var(--vpj-sidebar-footer-social-links-margin-bottom);
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

    /* StyleSheet for collapsed state */
    .vpj-sidebar__footer.collapsed .vpj-sidebar__footer-link-list {
        gap: var(--vpj-sidebar-footer-links-gap-collapsed);
    }
</style>