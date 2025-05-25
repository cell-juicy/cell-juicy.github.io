<script setup>
import { useData } from 'vitepress';
import { computed, inject, ref, watch, watchEffect, onMounted } from 'vue';
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
const { page } = useData();
const layoutConfig = inject(VPJ_PAGE_LAYOUT_SYMBOL, null);
const isPageLayout = computed(() => !!layoutConfig);
const imageRootExists = ref(false);
// Computed properties for dynamic styling
const computedSrc = computed(() => `url(${props.src})`)
const computedFade = computed(() => {
    if (props.fade) {
        const fadeNumber = Number(props.fade) === NaN ? 0 : Number(props.fade)
        const percentage = Math.min(Math.max(fadeNumber, 0), 1) * 100
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
const computedGutter = computed(() => {
    if (isPageLayout.value) return layoutConfig.computedGutter?.value;
    else {
        if (isDesktop.value) return "4rem";
        return "1.5rem";
    };
});
const computedWidth = computed(() => {
    if (isPageLayout.value) return layoutConfig.computedWidth?.value;
    return "61.25rem"
})


watchEffect(checkImageRoot);
watch(isPageLayout, (value) => {
    if (!value) {
        console.warn('[Juicy Theme Warn]: ' +
            'The VPJHeroImage component can only be used in a page layout or an extended page layout.' +
            'Please check if you have used the VPJHeroImage component in a page that does not use a page' + 
            ' layout or an extended page layout by mistake. The incorrectly used VPJHeroImage component' +
            ' has been hidden.' + 
            `${!page.value.isNotFound ? `\n(At file: ${page.value.filePath})` : ''}`
        )
    }
}, { immediate: true });
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