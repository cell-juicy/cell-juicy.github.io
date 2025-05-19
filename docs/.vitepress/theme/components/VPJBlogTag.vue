<script setup>
import { computed } from 'vue';


const props = defineProps({
    tag: {
        type: String,
        required: true
    },
    callback: {
        type: Function,
        default: () => {}
    }
})


const callbackFunction = computed(() => {
    if (props.callback && typeof props.callback === 'function') {
        return (event) => {
            event.preventDefault();
            event.stopPropagation();
            props.callback(props.tag);
        }
    } else {
        return (event) => {
            event.preventDefault();
            event.stopPropagation();
        }
    }
})
</script>


<template>
    <button
        @click="callbackFunction"
        class="vpj-blog-tag"
    >
        <div class="vpj-text">
            {{ props.tag }}
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