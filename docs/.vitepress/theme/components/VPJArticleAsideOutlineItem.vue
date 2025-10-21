<script setup>
import { computed, onMounted, ref, useTemplateRef } from 'vue';

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
const indent = computed(() => {
    return `calc(${Number(props.depth) || 0} * var(--vpj-article-aside-tab-outline-item-indent-unit))`
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
            <div class="vpj-article-aside__outline-toggle-wrapper">
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
            </div>
            <span class="vpj-article-aside__outline-title vpj-markdown" v-html="props.data.title"/>
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


<style scoped>
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
        gap: var(--vpj-article-aside-tab-outline-item-gap);
        padding-block: var(--vpj-article-aside-tab-outline-item-padding-y);
        padding-inline: var(--vpj-article-aside-tab-outline-item-padding-x);
        text-decoration: none;
        width: 100%;
    }

    .vpj-article-aside__outline-link:hover,
    .vpj-article-aside__outline-link:active {
        background: var(--vpj-article-aside-tab-outline-item-bg-hover);
    }

    /* Toggle */
    .vpj-article-aside__outline-toggle-wrapper {
        flex-shrink: 0;
        height: var(--vpj-article-aside-tab-outline-toggle-size);
        margin-left: v-bind(indent);
        width: var(--vpj-article-aside-tab-outline-toggle-size);
    }

    .vpj-article-aside__outline-toggle {
        align-items: center;
        background: var(--vpj-article-aside-tab-outline-toggle-bg);
        border-radius: var(--vpj-article-aside-tab-outline-toggle-radius);
        display: flex;
        height: 100%;
        padding: calc((var(--vpj-article-aside-tab-outline-toggle-size) - var(--vpj-article-aside-tab-outline-toggle-icon-size)) / 2);
        width: 100%;
    }

    .vpj-article-aside__outline-toggle:hover,
    .vpj-article-aside__outline-toggle:active {
        background: var(--vpj-article-aside-tab-outline-toggle-bg-hover);
    }

    /* Toggle Icon */
    .vpj-article-aside__outline-toggle-icon {
        height: var(--vpj-article-aside-tab-outline-toggle-icon-size);
        fill: var(--vpj-article-aside-tab-outline-toggle-icon-color);
        transition: transform var(--vpj-article-aside-tab-outline-transition);
        width: var(--vpj-article-aside-tab-outline-toggle-icon-size);
    }

    .vpj-article-aside__outline-toggle:hover .vpj-article-aside__outline-toggle-icon,
    .vpj-article-aside__outline-toggle:active .vpj-article-aside__outline-toggle-icon {
        fill: var(--vpj-article-aside-tab-outline-toggle-icon-color-hover);
    }

    /* Title */
    .vpj-article-aside__outline-title {
        color: var(--vpj-private-c-c, var(--vpj-private-c-h, var(--vpj-article-aside-tab-outline-title-color)));
        display: inline;
        flex: 1;
        font-size: var(--vpj-private-s-c, var(--vpj-private-s-h, var(--vpj-article-aside-tab-outline-title-size)));
        font-weight: var(--vpj-private-w-c, var(--vpj-private-w-h, var(--vpj-article-aside-tab-outline-title-weight)));
        text-decoration: var(--vpj-private-d-c, var(--vpj-private-d-h, none));
    }

    .vpj-article-aside__outline-title:hover {
        --vpj-private-c-h: var(--vpj-article-aside-tab-outline-title-color-hover);
        --vpj-private-s-h: var(--vpj-article-aside-tab-outline-title-size-hover);
        --vpj-private-w-h: var(--vpj-article-aside-tab-outline-title-weight-hover);
        --vpj-private-d-h: var(--vpj-article-aside-tab-outline-title-decoration-hover);
    }

    .vpj-article-aside__outline-link.current .vpj-article-aside__outline-title {
        --vpj-private-c-c: var(--vpj-article-aside-tab-outline-title-color-current);
        --vpj-private-s-c: var(--vpj-article-aside-tab-outline-title-size-current);
        --vpj-private-w-c: var(--vpj-article-aside-tab-outline-title-weight-current);
        --vpj-private-d-c: var(--vpj-article-aside-tab-outline-title-decoration-current);
    }

    /* Collapsed */
    .vpj-article-aside__outline-link.collapsed .vpj-article-aside__outline-toggle-icon {
        transform: rotate(90deg);
    }
</style>