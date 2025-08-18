<script setup>
import { useRoute } from 'vitepress';
import { ref, computed } from 'vue';

import VPJDynamicIconBtn from '../components/VPJDynamicIconBtn.vue';
import VPJDynamicIcon from '../components/VPJDynamicIcon.vue';

import VPJIconCaretLeft from '../components/icons/VPJIconCaretLeft.vue';
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
    <div class="vpj-layout-doc__aside-doc-node vpj-scroll-y">
        <div class="vpj-layout-doc__aside-doc-node-wrapper">
            <a
                v-if="typeof data.url === 'string'"
                :href="data.url"
                :class="[
                    'vpj-layout-doc__aside-doc-node-link',
                    {'current': route.path === data.url}
                ]"
            >
                <span class="vpj-text">{{ data.treeTitle }}</span>
                <VPJDynamicIconBtn
                    v-if="children.length > 0"
                    @click.stop.prevent="collapsed = !collapsed"
                    :icon="VPJIconCaretDown"
                    :class="[
                        'vpj-layout-doc__aside-doc-node-toggle',
                        {'collapsed': collapsed}
                    ]"
                />
            </a>
            <button
                v-else
                @click.stop.prevent="collapsed = !collapsed"
                class="vpj-layout-doc__aside-doc-node-link"
            >
                <span class="vpj-text">{{ data.treeTitle }}</span>
                <VPJDynamicIcon
                    v-if="children.length > 0"
                    :icon="VPJIconCaretDown"
                    :class="[
                        'vpj-layout-doc__aside-doc-node-mark',
                        {'collapsed': collapsed}
                    ]"
                />
            </button>
        </div>
        <div
            v-show="children.length > 0 && !collapsed"
            class="vpj-layout-doc__aside-doc-node-children"
        >
            <VPJDocAsideTreeItem
                v-for="child in children"
                :key="child.id"
                :data="child"
            />
        </div>
    </div>
</template>


<style scoped>
    /* Main Layout */
    .vpj-layout-doc__aside-doc-node {
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
    }

    /* Warpper */
    .vpj-layout-doc__aside-doc-node-wrapper {
        display: flex;
        flex-shrink: 0;
        height: 2.25rem;
        align-items: center;
    }

    .vpj-layout-doc__aside-doc-node-link {
        align-items: center;
        background-color: var(--vpj-color-bg-100);
        border-radius: var(--vpj-border-radius-100);
        color: var(--vpj-color-text-300);
        font-size: .875rem;
        display: flex;
        flex: 1;
        height: 100%;
        padding-bottom: .25rem;
        padding-left: .5rem;
        padding-right: .5rem;
        padding-top: .25rem;
        text-decoration: none;
    }

    .vpj-layout-doc__aside-doc-node-link:hover,
    .vpj-layout-doc__aside-doc-node-link:active,
    .vpj-layout-doc__aside-doc-node-link.current {
        background-color: var(--vpj-color-bg-300);
        color: var(--vpj-color-text-400);
    }

    .vpj-layout-doc__aside-doc-node-toggle {
        align-items: center;
        background-color: transparent;
        border-radius: var(--vpj-border-radius-100);
        height: 24px;
        width: 24px;
        padding: 6px;
    }

    .vpj-layout-doc__aside-doc-node-toggle :deep(.vpj-icon) {
        fill: var(--vpj-color-text-300);
        height: 12px;
        transition: transform 0.2s ease-in-out;
        width: 12px;
    }

    .vpj-layout-doc__aside-doc-node-mark {
        border-radius: var(--vpj-border-radius-100);
        fill: var(--vpj-color-text-300);
        height: 24px;
        padding: 6px;
        transition: transform 0.2s ease-in-out;
        width: 24px;
    }

    .vpj-layout-doc__aside-doc-node-toggle:hover,
    .vpj-layout-doc__aside-doc-node-toggle:active {
        background-color: var(--vpj-color-bg-500);
    }

    .vpj-layout-doc__aside-doc-node-toggle.collapsed :deep(.vpj-icon) {
        transform: rotate(90deg);
    }

    .vpj-layout-doc__aside-doc-node-mark.collapsed {
        transform: rotate(90deg);
    }

    /* Children */
    .vpj-layout-doc__aside-doc-node-children {
        border-left-width: var(--vpj-border-width-100);
        border-left-color: var(--vpj-color-border-200);
        display: flex;
        flex: 1;
        flex-direction: column;
        margin-left: 1rem;
        margin-top: .5rem;
        gap: .25rem;
    }
</style>