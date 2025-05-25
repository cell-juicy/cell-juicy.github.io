<script setup>
import { ref, computed } from 'vue'


const props = defineProps({
    cover: {
        type: String,
        default: ""
    },
    config: {
        type: Object,
        default: {
            alt: "",
            fade: undefined,
            height: "0px",
            css: {
                objectPosition: "center",
                objectFit: "cover"
            }
        }
    }
})


const computedAlt = computed(() => {
    return typeof props.config.alt === "string" ? props.config.alt : undefined;
});
const computedHeight = computed(() => {
    return props.config.height || "0";
});
const computedSrc = computed(() => {
    return typeof props.cover === "string" ? props.cover : undefined;
});
const computedCss = computed(() => {
    const fadePercentage = Math.min(Math.max(Number(props.config.fade), 0), 1) * 100;
    const maskImage = (props.config.css?.maskImage)
        ? props.config.css.maskImage
        : (fadePercentage)
            ? `linear-gradient(to top, transparent 0%, black ${fadePercentage}%, black)`
            : undefined
    return {
        ...props.config.css,
        maskImage
    }
})
</script>


<template>
    <div
        v-if="computedSrc"
        class="vpj-article-cover"
    >
        <img
            class="vpj-article-cover__img"
            :src="computedSrc"
            :alt="computedAlt"
            :style="computedCss"
        >
    </div>
</template>


<style scoped>
    .vpj-article-cover {
        background-color: transparent;
        flex-shrink: 0;
        height: v-bind(computedHeight);
        width: 100%;
    }

    .vpj-article-cover__img {
        width: 100%;
        height: 100%;
    }
</style>