<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useVPJSidebar } from '../composables/useVPJSidebar'

import VPJTooltipBtn from './VPJTooltipBtn.vue';
import VPJDynamicIcon from './VPJDynamicIcon.vue';

import VPJIconAngleSmallDown from './icons/VPJIconAngleSmallDown.vue';


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

const props = defineProps({
    data: {
        type: Object,
        required: true
    },
});
const store = useVPJSidebar();
const {
    collapsed,
    highlight
} = storeToRefs(store);

const itemsCollapsed = ref(!!props.data?.collapsed);
const iconHovered = ref(false);

const hasChildren = computed(() => {
    if (Number(props.data.depth) > 5) return false;
    return collapsed.value
        ? props.data.items.some((item) => !!item.icon || item.items.length > 0)
        : props.data.items.length > 0;
});
const hasIcon = computed(() => !!props.data?.icon);

// Css
const gap = computed(() => collapsed.value ? "var(--vpj-sidebar-nav-list-gap-collapsed)" : "var(--vpj-sidebar-nav-list-gap)");
const paddingLeft = computed(() => {
    if (collapsed.value) return "calc((var(--vpj-sidebar-width-collapsed) - max(var(--vpj-sidebar-btn-icon-size), var(--vpj-sidebar-nav-list-item-toggle-btn-size))) / 2 - var(--vpj-sidebar-padding-x))"

    const base = "(var(--vpj-sidebar-btn-height) - max(var(--vpj-sidebar-nav-list-item-toggle-btn-size), var(--vpj-sidebar-btn-icon-size), var(--vpj-sidebar-btn-text-size))) / 2";
    return `calc(${base} + ${Number(props.data.depth)} * var(--vpj-sidebar-nav-list-indent-unit))`
});
const textOpacity = computed(() => collapsed.value ? "0" : "1");
const toggleTransition = computed(() => itemsCollapsed.value ? "rotate(-90deg)" : "none");
</script>


<template>
    <li
        v-if="!collapsed || (hasIcon) || (hasChildren)"
        :class="[
            'vpj-sidebar__nav-item',
            { 'collapsed': collapsed }
        ]"
    >
        <VPJTooltipBtn
            @click="() => {
                if (typeof data.link !== 'string' && hasChildren) itemsCollapsed = !itemsCollapsed
            }"
            :is-link="typeof data.link === 'string' ? true : false"
            :offset="tooltipOffset"
            :tooltip="data.tooltip"
            :tooltip-attrs="tooltipAttrs"
            :tooltip-position="tooltipPosition"
            :href="data.link"
            :class="[
                'vpj-sidebar__nav-item-link',
                { 'highlight': highlight === data.link }
            ]"
            :style="{
                '--vpj-highlight-normal': data.highlight.normal,
                '--vpj-highlight-hover': data.highlight.hover,
                '--vpj-highlight-active': data.highlight.active,
            }"
        >
            <span
                @mouseenter="iconHovered = true"
                @mouseleave="iconHovered = false"
                class="vpj-sidebar__nav-item-wrapper"
            >
                <button
                    v-if="(iconHovered && hasChildren) || (hasChildren && !hasIcon)"
                    @click.stop.prevent="itemsCollapsed = !itemsCollapsed"
                    class="vpj-sidebar__nav-item-toggle"
                >
                    <VPJDynamicIcon
                        class="vpj-icon"
                        :icon="VPJIconAngleSmallDown"
                    />
                </button>
                <VPJDynamicIcon
                    v-else-if="props.data.icon"
                    :icon="props.data.icon"
                    class="vpj-icon"
                />
            </span>
            <span class="vpj-text">
                {{ data.text }}
            </span>
        </VPJTooltipBtn>
        <ul
            v-show="!itemsCollapsed && hasChildren"
            class="vpj-sidebar__nav-item-sub"
        >
            <VPJSidebarNavItem
                v-for="item in props.data.items"
                :data="item"
            />
        </ul>
    </li>
</template>


<style scoped>
    .vpj-sidebar__nav-item {
        align-items: center;
        display: flex;
        flex-direction: column;
        gap: v-bind(gap);
        list-style: none;
        transition: gap var(--vpj-sidebar-transition);
        width: 100%;
    }

    /* Nav link */
    .vpj-sidebar__nav-item-link,
    .vpj-sidebar__nav-item-link:visited {
        align-items: center;
        background-color: var(--vpj-sidebar-btn-bg);
        border: var(--vpj-sidebar-btn-border);
        border-radius: var(--vpj-sidebar-btn-radius);
        display: flex;
        flex: 1;
        flex-direction: row;
        gap: var(--vpj-sidebar-btn-gap);
        height: var(--vpj-sidebar-btn-height);
        min-width: 0;
        padding: calc((var(--vpj-sidebar-btn-height) - max(var(--vpj-sidebar-header-profile-btn-icon-size), var(--vpj-sidebar-btn-text-size))) / 2);
        padding-left: v-bind(paddingLeft);
        text-decoration: none;
        transition:
            padding var(--vpj-sidebar-transition),
            width var(--vpj-sidebar-transition);
        width: 100%;
    }

    .vpj-sidebar__nav-item-link:hover,
    .vpj-sidebar__nav-item-link:active {
        background-color: var(--vpj-sidebar-btn-bg-hover);
    }

    /* Nav link icon wrapper */
    .vpj-sidebar__nav-item-wrapper {
        align-items: center;
        display: flex;
        flex-shrink: 0;
        height: max(var(--vpj-sidebar-btn-icon-size), var(--vpj-sidebar-nav-list-item-toggle-btn-size));
        margin-left: calc((max(var(--vpj-sidebar-nav-list-item-toggle-btn-size), var(--vpj-sidebar-btn-icon-size), var(--vpj-sidebar-btn-text-size)) - max(var(--vpj-sidebar-btn-icon-size), var(--vpj-sidebar-nav-list-item-toggle-btn-size))) / 2);
        width: max(var(--vpj-sidebar-btn-icon-size), var(--vpj-sidebar-nav-list-item-toggle-btn-size));
    }

    /* Nav toggle btn */
    .vpj-sidebar__nav-item-toggle {
        align-items: center;
        background-color: transparent;
        border-radius: var(--vpj-border-radius-100);
        display: flex;
        height: var(--vpj-sidebar-nav-list-item-toggle-btn-size);
        padding: calc((var(--vpj-sidebar-nav-list-item-toggle-btn-size) - var(--vpj-sidebar-nav-list-item-toggle-icon-size)) / 2);
        margin: calc((max(var(--vpj-sidebar-btn-icon-size), var(--vpj-sidebar-nav-list-item-toggle-btn-size)) - var(--vpj-sidebar-nav-list-item-toggle-btn-size)) / 2);
        width: var(--vpj-sidebar-nav-list-item-toggle-btn-size);
    }

    .vpj-sidebar__nav-item-toggle:hover,
    .vpj-sidebar__nav-item-toggle:active {
        background-color: var(--vpj-sidebar-nav-list-item-toggle-btn-bg);
    }

    .vpj-sidebar__nav-item-toggle > .vpj-icon {
        height: var(--vpj-sidebar-nav-list-item-toggle-icon-size);
        fill: var(--vpj-sidebar-btn-icon-color);
        transition: transform var(--vpj-sidebar-transition);
        transform: v-bind(toggleTransition);
        width: var(--vpj-sidebar-nav-list-item-toggle-icon-size);
    }

    .vpj-sidebar__nav-item-toggle:hover > .vpj-icon,
    .vpj-sidebar__nav-item-toggle:active > .vpj-icon {
        fill: var(--vpj-sidebar-btn-icon-color-hover);
    }

    /* Nav link icon */
    .vpj-sidebar__nav-item-wrapper > .vpj-icon {
        fill: var(--vpj-sidebar-btn-icon-color);
        height: var(--vpj-sidebar-btn-icon-size);
        margin: calc((max(var(--vpj-sidebar-btn-icon-size), var(--vpj-sidebar-nav-list-item-toggle-btn-size)) - var(--vpj-sidebar-btn-icon-size)) / 2);
        width: var(--vpj-sidebar-btn-icon-size);
    }

    .vpj-sidebar__nav-item-link:hover .vpj-sidebar__nav-item-wrapper > .vpj-icon,
    .vpj-sidebar__nav-item-link:active .vpj-sidebar__nav-item-wrapper > .vpj-icon {
        fill: var(--vpj-sidebar-btn-icon-color-hover);
    }

    /* Nav link text */
    .vpj-sidebar__nav-item-link > .vpj-text {
        color: var(--vpj-sidebar-btn-text-color);
        font-size: var(--vpj-sidebar-btn-text-size);
        margin-right: calc((max(var(--vpj-sidebar-nav-list-item-toggle-btn-size), var(--vpj-sidebar-btn-icon-size), var(--vpj-sidebar-btn-text-size)) - var(--vpj-sidebar-btn-text-size)) / 2);;
        opacity: v-bind(textOpacity);
        transition: opacity var(--vpj-sidebar-transition);
    }

    /* Highlight link */
    .vpj-sidebar__nav-item-link.highlight .vpj-sidebar__nav-item-wrapper > .vpj-icon {
        fill: var(--vpj-highlight-normal, var(--vpj-sidebar-item-highlight-normal));
    }

    .vpj-sidebar__nav-item-link.highlight:hover .vpj-sidebar__nav-item-wrapper > .vpj-icon {
        fill: var(--vpj-highlight-hover, var(--vpj-sidebar-item-highlight-hover));
    }

    .vpj-sidebar__nav-item-link.highlight:active .vpj-sidebar__nav-item-wrapper > .vpj-icon {
        fill: var(--vpj-highlight-active, var(--vpj-sidebar-item-highlight-active));
    }

    /* Sub Items */
    .vpj-sidebar__nav-item-sub {
        align-items: center;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        gap: v-bind(gap);
        list-style-type: none;
        margin: 0;
        padding: 0;
        transition: gap var(--vpj-sidebar-transition);
        width: 100%;
    }

    /* Style Sheet for collapsed state */
    .vpj-sidebar__nav-item.collapsed .vpj-sidebar__nav-item-link {
        width: calc(var(--vpj-sidebar-width-collapsed) - 2 * var(--vpj-sidebar-padding-x));
    }

    .vpj-sidebar__nav-item.collapsed .vpj-sidebar__nav-item-wrapper {
        margin-left: 0;
    }
</style>