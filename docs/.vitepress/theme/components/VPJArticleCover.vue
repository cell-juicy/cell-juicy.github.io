<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useVPJData } from '../composables/useVPJData';
import { useVPJLayout } from '../composables/useVPJLayout';


const store = useVPJLayout();
const {
    coverConfig,
} = storeToRefs(store);
const { cover } = useVPJData();


const computedHeight = computed(() => {
    return coverConfig.value.height || "0";
});
const computedCss = computed(() => {
    const fadeNumber = isNaN(Number(coverConfig.value.fade)) ? 0 : Number(coverConfig.value.fade);
    const fadePercentage = Math.min(Math.max(fadeNumber, 0), 1) * 100;
    const maskImage = (coverConfig.value.css?.maskImage)
        ? coverConfig.value.css.maskImage
        : (fadePercentage > 0)
            ? `linear-gradient(to top, transparent 0%, black ${fadePercentage}%, black)`
            : undefined;
    return {
        ...coverConfig.value.css,
        maskImage
    };
})
</script>


<template>
    <div
        v-if="cover"
        class="vpj-article-cover"
    >
        <img
            class="vpj-article-cover__img"
            :src="cover"
            :alt="coverConfig.alt"
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