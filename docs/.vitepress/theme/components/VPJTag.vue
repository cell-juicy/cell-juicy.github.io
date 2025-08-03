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
    return () => {}
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
        background-color: var(--vpj-color-primary-100);
        border-radius: .75rem;
        display: inline-flex;
        flex-shrink: 0;
        height: 1.5rem;
        padding-left: .75rem;
        padding-right: .75rem;
        vertical-align: middle;
        width: auto;
    }

    .vpj-blog-tag:hover {
        background-color: var(--vpj-color-primary-200);
    }

    .vpj-blog-tag:active {
        background-color: var(--vpj-color-primary-300);
    }

    .vpj-blog-tag .vpj-text {
        color: var(--vpj-color-primary-500);
        font-size: .75rem;
    }

    .vpj-blog-tag:hover .vpj-text,
    .vpj-blog-tag:active .vpj-text{
        color: var(--vpj-color-primary-600);
    }
</style>