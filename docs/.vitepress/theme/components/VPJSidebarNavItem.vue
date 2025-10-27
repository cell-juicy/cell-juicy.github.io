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
const indent = computed(() => {
    const base = "(var(--vpj-sidebar-nav-list-item-content-size) - var(--vpj-sidebar-nav-list-item-wrapper-size)) / 2";
    return `calc((${base}) + ${Number(props.data.depth)} * var(--vpj-sidebar-nav-list-indent-unit))`;
});
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
                'vpj-sidebar__btn',
                { 'highlight': highlight === data.link }
            ]"
            :style="{
                '--vpj-highlight-normal': data.highlight.normal,
                '--vpj-highlight-hover': data.highlight.hover,
                '--vpj-highlight-active': data.highlight.active,
            }"
            data-action="nav-link"
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
        --vpj-sidebar-nav-list-item-content-size: max(var(--vpj-sidebar-nav-list-item-toggle-btn-size), var(--vpj-sidebar-btn-icon-size), var(--vpj-sidebar-btn-text-size));
        --vpj-sidebar-nav-list-item-wrapper-size: max(var(--vpj-sidebar-nav-list-item-toggle-btn-size), var(--vpj-sidebar-btn-icon-size));

        align-items: center;
        display: flex;
        flex-direction: column;
        gap: v-bind(gap);
        list-style: none;
        transition: gap var(--vpj-sidebar-transition);
        width: 100%;
    }

    /* Nav link */
    [data-action="nav-link"] {
        padding: calc((var(--vpj-sidebar-btn-height) - var(--vpj-sidebar-nav-list-item-content-size)) / 2);
        width: 100%;
    }

    /* Nav link icon wrapper */
    .vpj-sidebar__nav-item-wrapper {
        align-items: center;
        display: flex;
        flex-shrink: 0;
        height: var(--vpj-sidebar-nav-list-item-wrapper-size);
        justify-content: center;
        margin-left: v-bind("indent");
        width: var(--vpj-sidebar-nav-list-item-wrapper-size);
        transition: margin var(--vpj-sidebar-transition);
    }

    /* Nav toggle btn */
    .vpj-sidebar__nav-item-toggle {
        align-items: center;
        background: transparent;
        border-radius: var(--vpj-sidebar-nav-list-item-toggle-btn-radius);
        display: flex;
        height: var(--vpj-sidebar-nav-list-item-toggle-btn-size);
        justify-content: center;
        width: var(--vpj-sidebar-nav-list-item-toggle-btn-size);
    }

    .vpj-sidebar__nav-item-toggle:hover,
    .vpj-sidebar__nav-item-toggle:active {
        background: var(--vpj-sidebar-nav-list-item-toggle-btn-bg);
    }

    .vpj-sidebar__nav-item-toggle > .vpj-icon {
        height: var(--vpj-sidebar-nav-list-item-toggle-icon-size);
        fill: var(--vpj-sidebar-btn-icon-color);
        transition:
            fill var(--vpj-sidebar-transition),
            transform var(--vpj-sidebar-transition);
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
        transition: fill var(--vpj-sidebar-transition);
        width: var(--vpj-sidebar-btn-icon-size);
    }

    [data-action="nav-link"]:hover .vpj-sidebar__nav-item-wrapper > .vpj-icon,
    [data-action="nav-link"]:active .vpj-sidebar__nav-item-wrapper > .vpj-icon {
        fill: var(--vpj-sidebar-btn-icon-color-hover);
    }

    /* Nav link text */
    [data-action="nav-link"] > .vpj-text {
        margin-right: calc((var(--vpj-sidebar-nav-list-item-content-size) - var(--vpj-sidebar-btn-text-size)) / 2);;
    }

    /* Highlight link */
    [data-action="nav-link"].highlight .vpj-sidebar__nav-item-wrapper > .vpj-icon {
        fill: var(--vpj-highlight-normal, var(--vpj-sidebar-item-highlight-normal));
    }

    [data-action="nav-link"].highlight:hover .vpj-sidebar__nav-item-wrapper > .vpj-icon {
        fill: var(--vpj-highlight-hover, var(--vpj-sidebar-item-highlight-hover));
    }

    [data-action="nav-link"].highlight:active .vpj-sidebar__nav-item-wrapper > .vpj-icon {
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
    .collapsed [data-action="nav-link"] {
        padding-left: calc((var(--vpj-sidebar-width-collapsed) - var(--vpj-sidebar-nav-list-item-wrapper-size)) / 2 - var(--vpj-sidebar-padding-x));
    }

    .collapsed [data-action="nav-link"] .vpj-sidebar__nav-item-wrapper {
        margin-left: 0;
    }
</style>