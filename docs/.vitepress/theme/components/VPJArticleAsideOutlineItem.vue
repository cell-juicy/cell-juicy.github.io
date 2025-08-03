<script setup>
import { computed, ref } from 'vue';

import VPJDynamicIcon from './VPJDynamicIcon.vue';

import VPJIconAngleSmallRight from './icons/VPJIconAngleSmallRight.vue';


const props = defineProps({
    data: {
        type: Object,
        required: true
    },
    depth: {
        type: Number,
        default: 0
    }
});

const collapsed = ref(true);
const paddingLeft = computed(() => {
    const correction = props.data?.children?.length === 0 ? 20 : 0;
    return 6 + correction + props.depth * 16 + "px"
});
</script>


<template>
    <li
        class="vpj-article-aside__outline-item"
    >
        <a
            :href="props.data?.link"
            :class="[
                'vpj-article-aside__outline-link',
                { 'collapsed': !collapsed }
            ]"
        >
            <button
                v-if="props.data?.children?.length > 0"
                @click.stop.prevent="collapsed = !collapsed"
                class="vpj-article-aside__outline-toggle"
            >
                <VPJDynamicIcon
                    :icon="VPJIconAngleSmallRight"
                    class="vpj-article-aside__outline-toggle-icon"
                />
            </button>
            <span class="vpj-article-aside__outline-title">
                {{ props.data.title }}
            </span>
        </a>
        <ul
            v-show="props.data?.children?.length > 0 && !collapsed"
            class="vpj-article-aside__outline-list"
        >
            <VPJArticleAsideOutlineItem
                v-for="child in props.data?.children"
                :key="child.link"
                :data="child"
                :depth="props.depth + 1"
            />
        </ul>
    </li>
</template>


<style>
    /* Child List */
    .vpj-article-aside__outline-list {
        align-items: flex-start;
        display: flex;
        flex: 1;
        flex-direction: column;
        margin: 0;
        padding: 0;
        width: 100%;
    }

    /* Item */
    .vpj-article-aside__outline-item {
        list-style: none;
        width: 100%;
    }

    /* Link */
    .vpj-article-aside__outline-link {
        align-items: center;
        display: flex;
        gap: 4px;
        padding-bottom: .375rem;
        padding-left: v-bind(paddingLeft);
        padding-right: 4px;
        padding-top: .375rem;
        text-decoration: none;
        width: 100%;
    }

    .vpj-article-aside__outline-link:hover,
    .vpj-article-aside__outline-link:active {
        background-color: var(--vpj-color-bg-400);
    }

    /* Toggle */
    .vpj-article-aside__outline-toggle {
        align-items: center;
        background-color: transparent;
        border-radius: 8px;
        display: flex;
        flex-shrink: 0;
        height: 16px;
        justify-content: center;
        padding: 2px;
        width: 16px;
    }

    /* Toggle Icon */
    .vpj-article-aside__outline-toggle-icon {
        height: 12px;
        fill: var(--vpj-color-text-300);
        transition: transform 0.2s ease-in-out;
        width: 12px;
    }

    .vpj-article-aside__outline-toggle:hover .vpj-article-aside__outline-toggle-icon,
    .vpj-article-aside__outline-toggle:active .vpj-article-aside__outline-toggle-icon {
        fill: var(--vpj-color-text-400);
    }

    /* Title */
    .vpj-article-aside__outline-title {
        color: var(--vpj-color-text-400);
        font-size: .875rem;
        line-height: 1.5;
    }

    .vpj-article-aside__outline-title:hover {
        text-decoration: underline;
    }

    .vpj-article-aside__outline-link.active {
        font-weight: var(--vpj-font-weight-700);
    }

    /* Collapsed */
    .vpj-article-aside__outline-link.collapsed .vpj-article-aside__outline-toggle-icon {
        transform: rotate(90deg);
    }
</style>