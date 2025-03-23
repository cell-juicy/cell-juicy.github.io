<script setup>
import { ref } from 'vue'


const props = defineProps({
    src: {
        type: String
    },
    alt: {
        type: String,
        default: "Cover Image"
    },
    height: {
        type: String,
        default: "240px"
    }
})
</script>


<template>
    <div class="vpj-layout-blog__cover-image">
        <img
            :src="props.src"
            :alt="props.alt"
        >
    </div>
</template>


<style scoped>
    .vpj-layout-blog__cover-image {
        background-color: transparent;
        border-bottom-width: 1px;
        flex-shrink: 0;
        height: v-bind("props.height");
        width: 100%;
    }
</style>