<script setup>
import { computed, inject } from 'vue';
import { isDesktop } from '../utils/deviceTypes';
import { VPJ_PAGE_LAYOUT_SYMBOL } from '../utils/symbols';


const props = defineProps({
    src: {
        type: String,
        required: true
    },
    height: {
        type: String,
        default: "350px"
    },
    fade: {
        type: String
    },
    filter: {
        type: String,
        default: "none"
    },
    bgAttachment: {
        type: String,
        default: "scroll"
    },
    bgPosition: {
        type: String,
        default: "center center"
    },
    bgRepeat: {
        type: String,
        default: "no-repeat"
    },
    bgSize: {
        type: String,
        default: "cover"
    },
    bgClass: {
        type: String
    },
    contentClass: {
        type: String
    }
})

const computedSrc = computed(() => `url(${props.src})`)
const computedFade = computed(() => {
    if (props.fade) {
        const percentage = Math.min(Math.max(props.fade, 0), 1) * 100
        return `linear-gradient(to top, transparent 0%, black ${percentage}%, black)`
    }
    return 'none'
})
const computedFilter = computed(() => {
    if (props.filter) {
        return `${props.filter}`
    }
    return 'none'
})
const { computedGutter, computedWidth } = inject(VPJ_PAGE_LAYOUT_SYMBOL, {
    computedGutter: computed(() => {
        if (isDesktop.value) return "4rem";
        return "1.5rem";
    }),
    computedWidth: computed(() => "61.25rem")
});
</script>


<template>
    <ClientOnly>
        <Teleport to=".vpj-layout-page__hero-iamge">
            <div
                class="vpj-hero-image"
                v-bind="$attrs"
            >
                <div :class="bgClass || 'vpj-hero-image__bg'"></div>
                <div class="vpj-hero-image__grid-layout">
                    <div :class="contentClass || 'vpj-hero-image__content'">
                        <slot/>
                    </div>
                </div>
            </div>
        </Teleport>
    </ClientOnly>
</template>


<style scoped>
    .vpj-hero-image {
        height: v-bind("props.height");
        width: 100%;
        position: relative;
    }

    .vpj-hero-image__bg {
        background-image: v-bind(computedSrc);
        background-attachment: v-bind("props.bgAttachment");
        background-position: v-bind("props.bgPosition");
        background-repeat: v-bind("props.bgRepeat");
        background-size: v-bind("props.bgSize");
        filter: v-bind(computedFilter);
        height: 100%;
        left: 0;
        mask-image: v-bind(computedFade);
        position: absolute;
        top: 0;
        width: 100%;
    }

    .vpj-hero-image__grid-layout {
        display: grid;
        grid-template-columns: 
            minmax(min(v-bind(computedGutter), 100%), 1fr)
            minmax(min(calc(2 * v-bind(computedGutter)), 100%), v-bind(computedWidth))
            minmax(min(v-bind(computedGutter), 100%), 1fr);
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
    }

    .vpj-hero-image__content {
        grid-column: 2;
        height: 100%;
        width: 100%;
    }
</style>