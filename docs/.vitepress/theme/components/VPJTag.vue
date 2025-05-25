<script setup>
import { computed } from 'vue';
import { useData } from 'vitepress';


const props = defineProps({
    tag: {
        type: String,
        required: true
    },
    callback: {
        type: Function,
        default: undefined
    },
    processor: {
        type: Function,
        default: undefined
    }
})

const { theme } = useData()
const resolvedCallback = computed(() => {
    if (props.callback && typeof props.callback === 'function') return props.callback;
    if (typeof theme.value.blog?.tag?.defaultCallback === 'function') return theme.value.blog.tag.defaultCallback;
    return () => {}
})
const resolvedProcessor = computed(() => {
    if (props.processor && typeof props.processor === 'function') return props.processor;
    if (typeof theme.value.blog?.tag?.textProcessor === 'function') return theme.value.blog.tag.textProcessor;
    return (tag) => tag;
})

const callback = computed(() => {
    if (props.tag && typeof props.tag === 'string') {
        return (e) => {
            e.preventDefault();
            e.stopPropagation();
            resolvedCallback.value(props.tag);
        }
    }
    return () => {}
});

const text = computed(() => {
    if (props.tag && typeof props.tag === 'string') {
        const processed = resolvedProcessor.value(props.tag);
        return (typeof processed === 'string' && processed.trim().length > 0) 
            ? processed
            : props.tag;
    }
    return ""
})
</script>


<template>
    <button
        @click="callback"
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
        display: flex;
        flex-shrink: 0;
        height: 1.5rem;
        padding-left: .75rem;
        padding-right: .75rem;
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