<script setup>
import { computed } from 'vue';
import { useData } from 'vitepress';


const props = defineProps({
    tag: {
        type: String,
        required: true
    },
    click: {
        type: Function,
        default: undefined
    },
    format: {
        type: Function,
        default: undefined
    }
})

const { theme } = useData();

const resolvedClick = computed(() => {
    if (props.click && typeof props.click === 'function') return props.click;
    if (typeof theme.value.components?.tag?.onClick === 'function') return theme.value.components?.tag?.onClick;
    return () => {};
})
const resolvedFormat = computed(() => {
    if (props.format && typeof props.format === 'function') return props.format;
    if (typeof theme.value.components?.tag?.format === 'function') return theme.value.components?.tag?.format;
    return (tag) => tag;
})

const click = computed(() => {
    if (props.tag && typeof props.tag === 'string') {
        return () => resolvedClick.value(props.tag);
    }
    return () => {};
});

const text = computed(() => {
    if (props.tag && typeof props.tag === 'string') {
        const processed = resolvedFormat.value(props.tag);
        return (typeof processed === 'string' && processed.trim().length > 0) 
            ? processed
            : props.tag;
    }
    return "";
})
</script>


<template>
    <button
        @click.stop.prevent="click"
        class="vpj-blog-tag"
    >
        <div class="vpj-text">
            {{ text }}
        </div>
    </button>
</template>


<style scoped>
    .vpj-blog-tag {
        align-items: center;
        backdrop-filter: var(--vpj-tag-backdrop-filter);
        background: var(--vpj-tag-bg);
        border-radius: var(--vpj-tag-radius);
        cursor: var(--vpj-tag-cursor);
        display: inline-flex;
        flex-shrink: 0;
        height: var(--vpj-tag-height);
        padding-inline: var(--vpj-tag-padding-x);
        transition:
            backdrop-filter var(--vpj-tag-transition),
            background var(--vpj-tag-transition);
        vertical-align: middle;
        width: auto;
    }

    .vpj-blog-tag:hover {
        backdrop-filter: var(--vpj-tag-backdrop-filter-hover);
        background: var(--vpj-tag-bg-hover);
    }

    .vpj-blog-tag:active {
        backdrop-filter: var(--vpj-tag-backdrop-filter-active);
        background: var(--vpj-tag-bg-active);
    }

    .vpj-blog-tag .vpj-text {
        color: var(--vpj-tag-text-color);
        font-size:var(--vpj-tag-text-size);
        font-weight: var(--vpj-tag-text-weight);
        transition: color var(--vpj-tag-transition);
    }

    .vpj-blog-tag:hover .vpj-text {
        color: var(--vpj-tag-text-color-hover);
    }

    .vpj-blog-tag:active .vpj-text {
        color: var(--vpj-tag-text-color-active);
    }
</style>