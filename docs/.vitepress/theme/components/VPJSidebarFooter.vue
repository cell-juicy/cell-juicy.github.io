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
        padding-left: .75rem;
        padding-right: .75rem;
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
        padding: .5rem;
        text-decoration: none;
    }

    .vpj-sidebar__footer-item-link:hover,
    .vpj-sidebar__footer-item-link:active {
        background-color: var(--vpj-color-bg-500);
    }

    /* Footer link icon & text */
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

    /* Social Links */
    .vpj-sidebar__footer-social-links-outer {
        margin-top: .375rem;
        mask-image: linear-gradient(
            to right,
            transparent,
            black .4rem,
            black calc(100% - .4rem),
            transparent
        );
        width: 100%;
    }

    :deep(.vpj-sidebar__footer-social-links-inner) {
        align-items: center;
        display: flex;
        flex: 1;
        gap: .1rem;
        height: 2rem;
        margin-bottom: 4px;
        padding-left: .6rem;
        padding-right: .6rem;
        width: 100%;
    }

    .vpj-sidebar__footer-social-link,
    .vpj-sidebar__footer-social-link:visited {
        align-items: center;
        background-color: var(--vpj-color-bg-300);
        border: 0;
        border-radius: var(--vpj-border-radius-100);
        display: flex;
        flex-shrink: 0;
        height: 2rem;
        justify-content: center;
        padding: .5rem;
        text-decoration: none;
        width: 2rem;
    }

    .vpj-sidebar__footer-social-link:hover,
    .vpj-sidebar__footer-social-link:active {
        background-color: var(--vpj-color-bg-500);
    }

    .vpj-sidebar__footer-social-link > .vpj-icon {
        height: 1rem;
        width: 1rem;
    }

    .vpj-sidebar__footer-social-link > .vpj-icon {
        fill: var(--vpj-color-text-300);
    }

    .vpj-sidebar__footer-social-link:hover > .vpj-icon,
    .vpj-sidebar__footer-social-link:active > .vpj-icon {
        fill: var(--vpj-color-text-400);
    }


    /* StyleSheet for collapsed state */
    .vpj-sidebar__footer.collapsed .vpj-sidebar__footer-link-list {
        gap: .375rem;
    }

    /* Footer links */
    .vpj-sidebar__footer.collapsed .vpj-sidebar__footer-item-link {
        width: 2rem;
    }

    .vpj-sidebar__footer.collapsed .vpj-sidebar__footer-item-link :deep(.vpj-text) {
        opacity: 0;
    }
</style>