<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useVPJSidebar } from '../composables/newSidebar'

import VPJTooltipBtn from './VPJTooltipBtn.vue';
import VPJDynamicIcon from './VPJDynamicIcon.vue';

import VPJIconAngleSmallDown from './icons/VPJIconAngleSmallDown.vue';


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

const props = defineProps({
    data: {
        type: Object,
        required: true
    },
});
const store = useVPJSidebar();
const {
    highlight
} = storeToRefs(store);

const itemsCollapsed = ref(!!props.data?.collapsed);
const iconHovered = ref(false);
</script>


<template>
    <li class="vpj-sidebar__nav-item">
        <VPJTooltipBtn
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
        >
            <span
                @mouseenter="iconHovered = true"
                @mouseleave="iconHovered = false"
                class="vpj-sidebar__nav-item-warpper"
            >
                <button
                    v-if="iconHovered && props.data.items?.length > 0 && props.depth <= 5"
                    @click.stop.prevent="itemsCollapsed = !itemsCollapsed"
                    class="vpj-sidebar__nav-item-toggle"
                >
                    <VPJDynamicIcon
                        class="vpj-icon"
                        :icon="VPJIconAngleSmallDown"
                    />
                >
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
            v-show="(Number(props.data.depth) <= 5) && (props.data.items?.length > 0)"
            class="vpj-sidebar__nav-item-sub"
        >
            <NewNavItem
                v-for="item in props.data.items"
                :data="item"
            />
        </ul>
    </li>
</template>


<style scoped>
    .vpj-sidebar__nav-item {
        list-style: none;
        width: 100%;
    }

    /* Nav link */
    .vpj-sidebar__nav-item-link,
    .vpj-sidebar__nav-item-link:visited {
        align-items: center;
        background-color: var(--vpj-color-bg-300);
        border: 0;
        border-radius: var(--vpj-border-radius-100);
        display: flex;
        flex: 1;
        flex-direction: row;
        gap: .75rem;
        height: 36px;
        min-width: 0;
        padding-left: .625rem;
        padding-right: .625rem;
        text-decoration: none;
    }

    .vpj-sidebar__nav-item-link:hover,
    .vpj-sidebar__nav-item-link:active {
        background-color: var(--vpj-color-bg-500);
    }

    /* Nav link icon & text */
    .vpj-sidebar__nav-item-link .vpj-icon {
        fill: var(--vpj-color-text-300);
    }

    .vpj-sidebar__nav-item-link:hover .vpj-icon,
    .vpj-sidebar__nav-item-link:active .vpj-icon {
        fill: var(--vpj-color-text-400);
    }

    .vpj-sidebar__nav-item-link .vpj-text {
        color: var(--vpj-color-text-400);
        font-size: .875rem;
    }

    /* Highlight link */
    .vpj-sidebar__nav-item-link.highlight .vpj-icon {
        fill: var(--vpj-highlight-normal, var(--vpj-color-primary-400));
    }

    .vpj-sidebar__nav-item-link.highlight:hover .vpj-icon {
        fill: var(--vpj-highlight-hover, var(--vpj-color-primary-500));
    }

    .vpj-sidebar__nav-item-link.highlight:active .vpj-icon {
        fill: var(--vpj-highlight-active, var(--vpj-color-primary-300));
    }

    /* Sub Items */
    .vpj-sidebar__nav-item-sub {
        margin: 0;
        padding: 0;
    }
</style>