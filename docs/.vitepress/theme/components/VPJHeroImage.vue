<script setup>
import { computed, inject, ref, onMounted } from 'vue';
import { isDesktop } from '../utils/deviceTypes';
import { VPJ_PAGE_LAYOUT_SYMBOL } from '../utils/symbols';


function checkImageRoot() {
    if (typeof document !== 'undefined' && isPageLayout.value) {
        imageRootExists.value = !!document.querySelector('.vpj-layout-page__hero-iamge')
    } else {
        imageRootExists.value = false
    }
};


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
        type: [String, Number],
        default: undefined
    },
    bgCss: {
        type: Object,
        default: () => ({})
    }
})

const layoutConfig = inject(VPJ_PAGE_LAYOUT_SYMBOL, null);
const isPageLayout = computed(() => !!layoutConfig);
const imageRootExists = ref(false);

// Computed properties for dynamic styling
const computedCss = computed(() => {
    // Calculate fade percentage and mask image
    const fadeNumber = isNaN(Number(props.fade)) ? 0 : Number(props.fade);
    const fadePercentage = Math.min(Math.max(fadeNumber, 0), 1) * 100;
    const maskImage = (props.bgCss?.maskImage)
        ? props.bgCss.maskImage
        : (fadePercentage > 0)
            ? `linear-gradient(to top, transparent 0%, black ${fadePercentage}%, black)`
            : undefined;

    // Calculate background image
    const backgroundImage = (props.src) ? `url("${props.src}")` : undefined;

    return {
        ...props.bgCss,
        maskImage,
        backgroundImage,
        backgroundPosition: props.bgCss?.backgroundPosition ?? "center center",
        backgroundSize: props.bgCss?.backgroundSize ?? "cover",
        backgroundRepeat: props.bgCss?.backgroundRepeat ?? "no-repeat"
    }
})
const computedPadding = computed(() => {
    if (isPageLayout.value) return layoutConfig.computedPadding?.value;
    else {
        if (isDesktop.value) return "4rem";
        return "1.5rem";
    };
});
const computedMaxWidth = computed(() => {
    if (isPageLayout.value) return layoutConfig.computedMaxWidth?.value;
    return "61.25rem"
});
const computedGrid = computed(() => {
    return [
        `minmax(min(${computedPadding.value}, 100%), 1fr) `,
        `minmax(min(calc(2 * ${computedPadding.value}), 100%), ${computedMaxWidth.value}) `,
        `minmax(min(${computedPadding.value}, 100%), 1fr)`
    ].join(" ")
})

onMounted(() => {
    checkImageRoot()
})
</script>


<template>
    <ClientOnly>
        <Teleport
            to=".vpj-layout-page__hero-iamge"
            v-if="isPageLayout && imageRootExists"
        >
            <div
                class="vpj-hero-image"
                :style="{ height: props.height }"
            >
                <div
                    class="vpj-hero-image__bg"
                    :style="computedCss"
                />
                <div class="vpj-hero-image__grid-layout" :style="{
                    gridTemplateColumns: computedGrid
                }">
                    <div class="vpj-hero-image__padding-left" style="grid-column: 1;">
                        <slot name="padding-left"/>
                    </div>
                    <div class="vpj-hero-image__content" style="grid-column: 2;">
                        <slot/>
                    </div>
                    <div class="vpj-hero-image__padding-right" style="grid-column: 3;">
                        <slot name="padding-right"/>
                    </div>
                </div>
            </div>
        </Teleport>
    </ClientOnly>
</template>


<style scoped>
    .vpj-hero-image {
        width: 100%;
        position: relative;
    }

    .vpj-hero-image__bg {
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
    }

    .vpj-hero-image__grid-layout {
        display: grid;
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
    }

    .vpj-hero-image__padding-left,
    .vpj-hero-image__padding-right {
        height: 100%;
        overflow: hidden;
    }

    .vpj-hero-image__content {
        height: 100%;
        width: 100%;
    }
</style>