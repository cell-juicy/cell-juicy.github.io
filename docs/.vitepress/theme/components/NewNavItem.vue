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
    collapsed,
    highlight
} = storeToRefs(store);

const itemsCollapsed = ref(!!props.data?.collapsed);
const iconHovered = ref(false);

const gap = computed(() => collapsed.value ? ".625rem" : ".125rem");
const paddingLeft = computed(() => collapsed.value ? ".5rem" : `${Number(props.data.depth * .75) + .5}rem`)
const textOpacity = computed(() => collapsed.value ? "0" : "1");
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
            :style="{
                '--vpj-highlight-normal': data.highlight.normal,
                '--vpj-highlight-hover': data.highlight.hover,
                '--vpj-highlight-active': data.highlight.active,
            }"
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
            v-show="
                (Number(props.data.depth) <= 5) &&
                (props.data.items?.length > 0) &&
                !itemsCollapsed
            "
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
        gap: .5rem;
        height: 2rem;
        min-width: 0;
        padding: .5rem;
        padding-left: v-bind(paddingLeft);
        text-decoration: none;
        transition:
            padding .2s ease-in-out,
            width .2s ease-in-out;
    }

    .vpj-sidebar__nav-item-link:hover,
    .vpj-sidebar__nav-item-link:active {
        background-color: var(--vpj-color-bg-500);
    }

    /* Nav link icon */
    .vpj-sidebar__nav-item-warpper {
        align-items: center;
        display: flex;
        height: 1rem;
        width: 1rem;
    }

    .vpj-sidebar__nav-item-link .vpj-icon {
        fill: var(--vpj-color-text-300);
        height: 1rem;
        width: 1rem;
    }

    .vpj-sidebar__nav-item-link:hover .vpj-icon,
    .vpj-sidebar__nav-item-link:active .vpj-icon {
        fill: var(--vpj-color-text-400);
    }

    .vpj-sidebar__nav-item-link .vpj-text {
        color: var(--vpj-color-text-400);
        font-size: .875rem;
        opacity: v-bind(textOpacity);
        transition: opacity .2s ease-in-out;
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
        align-items: center;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        gap: v-bind(gap);
        list-style-type: none;
        margin: v-bind(gap) 0;
        padding: 0;
        transition:
            gap .2s ease-in-out,
            margin .2s ease-in-out;
        width: 100%;
    }
</style>