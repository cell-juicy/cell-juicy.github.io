<script setup>
import { useRoute } from 'vitepress';
import { ref, computed } from 'vue';

import VPJDynamicIconBtn from '../components/VPJDynamicIconBtn.vue';
import VPJDynamicIcon from '../components/VPJDynamicIcon.vue';

import VPJIconCaretDown from '../components/icons/VPJIconCaretDown.vue';


const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

const children = computed(() => {
    if (Array.isArray(props.data.children)) {
        return props.data.children.filter((data) => {
            return typeof data === 'object' && data !== null
        })
    }
    return []
});
const route = useRoute();

const collapsed = ref(false);
</script>


<template>
    <div class="vpj-article-aside__aside-doc-node">
        <div class="vpj-article-aside__aside-doc-node-wrapper">
            <a
                v-if="typeof data.url === 'string'"
                :href="data.url"
                :class="[
                    'vpj-article-aside__aside-doc-node-link',
                    {'current': route.path === data.url}
                ]"
            >
                <span class="vpj-text">{{ data.treeTitle }}</span>
                <VPJDynamicIconBtn
                    v-if="children.length > 0"
                    @click.stop.prevent="collapsed = !collapsed"
                    :icon="VPJIconCaretDown"
                    :class="[
                        'vpj-article-aside__aside-doc-node-toggle',
                        {'collapsed': collapsed}
                    ]"
                />
            </a>
            <button
                v-else
                @click.stop.prevent="collapsed = !collapsed"
                class="vpj-article-aside__aside-doc-node-link"
            >
                <span class="vpj-text">{{ data.treeTitle }}</span>
                <VPJDynamicIcon
                    v-if="children.length > 0"
                    :icon="VPJIconCaretDown"
                    :class="[
                        'vpj-article-aside__aside-doc-node-mark',
                        {'collapsed': collapsed}
                    ]"
                />
            </button>
        </div>
        <div
            v-show="children.length > 0 && !collapsed"
            class="vpj-article-aside__aside-doc-node-children"
        >
            <VPJArticleAsideTreeItem
                v-for="child in children"
                :key="child.id"
                :data="child"
            />
        </div>
    </div>
</template>


<style scoped>
    /* Main Layout */
    .vpj-article-aside__aside-doc-node {
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
    }

    /* Warpper */
    .vpj-article-aside__aside-doc-node-wrapper {
        align-items: center;
        display: flex;
        flex-shrink: 0;
        height: var(--vpj-article-aside-tab-tree-node-height);
    }

    .vpj-article-aside__aside-doc-node-link {
        align-items: center;
        backdrop-filter: var(--vpj-private-bf-c, var(--vpj-private-bf-h, var(--vpj-article-aside-tab-tree-node-backdrop-filter)));;
        background: var(--vpj-private-b-c, var(--vpj-private-b-h, var(--vpj-article-aside-tab-tree-node-bg)));;
        border-radius: var(--vpj-article-aside-tab-tree-node-radius);
        color: var(--vpj-private-c-c, var(--vpj-private-c-h, var(--vpj-article-aside-tab-tree-node-color)));
        display: flex;
        flex: 1;
        font-size: var(--vpj-article-aside-tab-tree-node-font-size);
        font-weight: var(--vpj-private-w-c, var(--vpj-private-w-h, var(--vpj-article-aside-tab-tree-node-weight)));
        height: 100%;
        padding-inline: var(--vpj-article-aside-tab-tree-node-padding-x);
        text-align: start;
        text-decoration: none;
        transition:
            backdrop-filter var(--vpj-article-aside-tab-tree-transition),
            background var(--vpj-article-aside-tab-tree-transition),
            color var(--vpj-article-aside-tab-tree-transition),
            font-weight var(--vpj-article-aside-tab-tree-transition);
    }

    .vpj-article-aside__aside-doc-node-link:hover,
    .vpj-article-aside__aside-doc-node-link:active {
        --vpj-private-bf-h: var(--vpj-article-aside-tab-tree-node-backdrop-filter-hover);
        --vpj-private-b-h: var(--vpj-article-aside-tab-tree-node-bg-hover);
        --vpj-private-c-h: var(--vpj-article-aside-tab-tree-node-color-hover);
        --vpj-private-w-h: var(--vpj-article-aside-tab-tree-node-weight-hover);
    }

    .vpj-article-aside__aside-doc-node-link.current {
        --vpj-private-bf-c: var(--vpj-article-aside-tab-tree-node-backdrop-filter-current);
        --vpj-private-b-c: var(--vpj-article-aside-tab-tree-node-bg-current);
        --vpj-private-c-c: var(--vpj-article-aside-tab-tree-node-color-current);
        --vpj-private-w-c: var(--vpj-article-aside-tab-tree-node-weight-current);
    }

    .vpj-article-aside__aside-doc-node-toggle {
        align-items: center;
        backdrop-filter: var(--vpj-article-aside-tab-tree-node-toggle-backdrop-filter);
        background: var(--vpj-article-aside-tab-tree-node-toggle-bg);
        border-radius: var(--vpj-article-aside-tab-tree-node-toggle-radius);
        height: var(--vpj-article-aside-tab-tree-node-toggle-size);
        padding: calc((var(--vpj-article-aside-tab-tree-node-toggle-size) - var(--vpj-article-aside-tab-tree-node-toggle-icon-size)) / 2);
        transition:
            backdrop-filter var(--vpj-article-aside-tab-tree-transition),
            background var(--vpj-article-aside-tab-tree-transition);
        width: var(--vpj-article-aside-tab-tree-node-toggle-size);
    }

    .vpj-article-aside__aside-doc-node-toggle :deep(.vpj-icon) {
        fill: var(--vpj-article-aside-tab-tree-node-toggle-icon-color);
        height: var(--vpj-article-aside-tab-tree-node-toggle-icon-size);
        transition:
            fill var(--vpj-article-aside-tab-tree-transition),
            transform var(--vpj-article-aside-tab-tree-transition);
        width: var(--vpj-article-aside-tab-tree-node-toggle-icon-size);
    }

    .vpj-article-aside__aside-doc-node-mark {
        background: var(--vpj-article-aside-tab-tree-node-toggle-bg);
        border-radius: var(--vpj-article-aside-tab-tree-node-toggle-radius);
        fill: var(--vpj-article-aside-tab-tree-node-toggle-icon-color);
        height: var(--vpj-article-aside-tab-tree-node-toggle-size);
        padding: calc((var(--vpj-article-aside-tab-tree-node-toggle-size) - var(--vpj-article-aside-tab-tree-node-toggle-icon-size)) / 2);
        transition:
            fill var(--vpj-article-aside-tab-tree-transition),
            transform var(--vpj-article-aside-tab-tree-transition);
        width: var(--vpj-article-aside-tab-tree-node-toggle-size);
    }

    .vpj-article-aside__aside-doc-node-toggle:hover,
    .vpj-article-aside__aside-doc-node-toggle:active {
        backdrop-filter: var(--vpj-article-aside-tab-tree-node-toggle-backdrop-filter-hover);
        background: var(--vpj-article-aside-tab-tree-node-toggle-bg-hover);
    }

    .vpj-article-aside__aside-doc-node-toggle:hover :deep(.vpj-icon),
    .vpj-article-aside__aside-doc-node-toggle:active :deep(.vpj-icon) {
        fill: var(--vpj-article-aside-tab-tree-node-toggle-icon-color-hover);
    }

    .vpj-article-aside__aside-doc-node-link:hover .vpj-article-aside__aside-doc-node-mark,
    .vpj-article-aside__aside-doc-node-link:active .vpj-article-aside__aside-doc-node-mark {
        fill: var(--vpj-article-aside-tab-tree-node-toggle-icon-color-hover);
    }

    .vpj-article-aside__aside-doc-node-toggle.collapsed :deep(.vpj-icon) {
        transform: rotate(90deg);
    }

    .vpj-article-aside__aside-doc-node-mark.collapsed {
        transform: rotate(90deg);
    }

    /* Children */
    .vpj-article-aside__aside-doc-node-children {
        border-left: var(--vpj-article-aside-tab-tree-node-children-border-left);
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: var(--vpj-article-aside-tab-tree-node-children-gap);
        margin: var(--vpj-article-aside-tab-tree-node-children-margin);
        padding: var(--vpj-article-aside-tab-tree-node-children-padding);
    }
</style>