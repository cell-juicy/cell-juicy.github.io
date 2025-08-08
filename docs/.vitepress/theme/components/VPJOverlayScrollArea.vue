<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, computed, useTemplateRef } from 'vue';


const props = defineProps({
    overflow: {
        type: String,
        default: 'xy'
    },
    areaAttrs: {
        type: Object,
        default: {}
    },
    innerAttrs: {
        type: Object,
        default: {}
    },
    tag: {
        type: String,
        default: "div"
    },
    trackColor: {
        type: [String, Object],
        default: "transparent"
    },
    trackXAttrs: {
        type: Object,
        default: {}
    },
    trackYAttrs: {
        type: Object,
        default: {}
    },
    thumbWidth: {
        type: String,
        default: "4"
    },
    thumbColor: {
        type: [String, Object],
        default: {
            base: "var(--vpj-color-text-100)",
            hover: "var(--vpj-color-text-200)",
            active: "var(--vpj-color-text-200)"
        }
    },
    thumbXAttrs: {
        type: Object,
        default: {}
    },
    thumbYAttrs: {
        type: Object,
        default: {}
    }
});

// template refs
const area = useTemplateRef("area");
const content = useTemplateRef("content");
const trackX = useTemplateRef("trackX");
const trackY = useTemplateRef("trackY");
const thumbX = useTemplateRef("thumbX");
const thumbY = useTemplateRef("thumbY");

// state
const enableScrollX = computed(() => typeof props.overflow === 'string' && props.overflow.includes('x'));
const enableScrollY = computed(() => typeof props.overflow === 'string' && props.overflow.includes('y'));
const showScrollX = ref(false);
const showScrollY = ref(false);
const draggingX = ref(false);
const draggingY = ref(false);
const mouseStartX = ref(0);
const mouseStartY = ref(0);
const scrollStartX = ref(0);
const scrollStartY = ref(0);

const thumbColor = computed(() => {
    if (typeof props.thumbColor === 'string') {
        return {
            base: props.thumbColor,
            hover: props.thumbColor,
            active: props.thumbColor,
        }
    }
    return {
        base: props.thumbColor?.base || "var(--vpj-color-text-200)",
        hover: props.thumbColor?.hover || props.thumbColor?.base || "var(--vpj-color-text-300)",
        active: props.thumbColor?.active || props.thumbColor?.hover || props.thumbColor?.base || "var(--vpj-color-text-300)",
    }
});

const trackColor = computed(() => {
    if (typeof props.trackColor === 'string') {
        return {
            base: props.trackColor,
            hover: props.trackColor,
            active: props.trackColor,
        }
    }
    return {
        base: props.trackColor?.base || "var(--vpj-color-text-200)",
        hover: props.trackColor?.hover || props.trackColor?.base || "var(--vpj-color-text-300)",
        active: props.trackColor?.active || props.trackColor?.hover || props.trackColor?.base || "var(--vpj-color-text-300)",
    }
})


function updateScrolls() {
    if (!area.value || !trackX.value || !trackY.value || !thumbX.value || !thumbY.value) return;
    
    const vw = area.value.clientWidth;
    const vh = area.value.clientHeight;
    const cw = area.value.scrollWidth;
    const ch = area.value.scrollHeight;

    showScrollX.value = cw > vw
    showScrollY.value = ch > vh;
    
    nextTick(() => {
        const trw = trackX.value.clientWidth;
        const trh = trackY.value.clientHeight;

        if (showScrollX.value) {
            const width = Math.max(20, (vw / cw) * trw);
            const transformX = (area.value.scrollLeft / (cw - vw)) * (trw - width);

            thumbX.value.style.width = `${width}px`;
            thumbX.value.style.transform = `translateX(${transformX}px)`;
        };

        if (showScrollY.value) {
            const height = Math.max(20, (vh / ch) * trh);
            const transformY = (area.value.scrollTop / (ch - vh)) * (trh - height);

            thumbY.value.style.height = `${height}px`;
            thumbY.value.style.transform = `translateY(${transformY}px)`;
        };
    });
};

function startDragX(e) {
    draggingX.value = true;
    mouseStartX.value = e.clientX;
    scrollStartX.value = area.value.scrollLeft;
    document.addEventListener("mousemove", dragX);
    document.addEventListener("mouseup", stopDragX);
};

function dragX(e) {
    if (!draggingX.value) return;

    const d = e.clientX - mouseStartX.value;
    const tw = trackX.value.clientWidth - thumbX.value.clientWidth;
    const length = area.value.scrollWidth - area.value.clientWidth;
    const ratio = d / tw;

    area.value.scrollLeft = Math.max(0, Math.min(scrollStartX.value + length * ratio, length));
};

function stopDragX(e) {
    draggingX.value = false;
    document.removeEventListener("mousemove", dragX);
    document.removeEventListener("mouseup", stopDragX);
};

function startDragY(e) {
    draggingY.value = true;
    mouseStartY.value = e.clientY;
    scrollStartY.value = area.value.scrollTop; // 修复：使用 scrollTop
    document.addEventListener("mousemove", dragY);
    document.addEventListener("mouseup", stopDragY);
};

function dragY(e) {
    if (!draggingY.value) return;

    const d = e.clientY - mouseStartY.value;
    const th = trackY.value.clientHeight - thumbY.value.clientHeight;
    const length = area.value.scrollHeight - area.value.clientHeight;
    const ratio = d / th;

    area.value.scrollTop = Math.max(0, Math.min(scrollStartY.value + length * ratio, length));
};

function stopDragY(e) {
    draggingY.value = false;
    document.removeEventListener("mousemove", dragY);
    document.removeEventListener("mouseup", stopDragY);
};

function jumpToX(e) {
    if (e.target !== trackX.value) return;
    
    const rect = trackX.value.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const thw = thumbX.value.clientWidth;
    const trw = rect.width;
    
    const ratio = Math.max(0, Math.min(1, (clickX - thw / 2) / (trw - thw)));
    
    const length = area.value.scrollWidth - area.value.clientWidth;
    area.value.scrollLeft = ratio * length;
};

function jumpToY(e) {
    if (e.target !== trackY.value) return;
    
    const rect = trackY.value.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const thh = thumbY.value.clientHeight;
    const trh = rect.height;

    const ratio = Math.max(0, Math.min(1, (clickY - thh / 2) / (trh - thh)));

    const length = area.value.scrollHeight - area.value.clientHeight;
    area.value.scrollTop = ratio * length;
};

let observer;

onMounted(() => {
    if (area.value && thumbX.value && trackX.value && thumbY.value && trackY.value) {
        updateScrolls();
        window.addEventListener("resize", updateScrolls);
        observer = new ResizeObserver(updateScrolls);
        observer.observe(content.value);
    };
});

onBeforeUnmount(() => {
    window.removeEventListener("resize", updateScrolls);
    if (observer) observer.disconnect();
});

defineExpose({
    area,
    inner: content,
})
</script>


<template>
    <component
        :is="props.tag"
        class="vpj-overlay-scroll"
    >
        <div
            @scroll="updateScrolls"
            v-bind="props.areaAttrs"
            ref="area"
            class="vpj-overlay-scroll__area"
        >
            <div
                v-bind="props.innerAttrs"
                ref="content"
                class="vpj-overlay-scroll__content"
            >
                <slot/>
            </div>
        </div>
        <div
            @click.stop.prevent="jumpToX"
            v-show="showScrollX && enableScrollX"
            v-bind="props.trackXAttrs"
            ref="trackX"
            :class="[
                'vpj-overlay-scroll__track-x',
                {'dragging': draggingX}
            ]"
        >
            <div
                @mousedown.stop.prevent="startDragX"
                @selectstart.prevent
                @click.stop.prevent
                v-bind="props.thumbXAttrs"
                ref="thumbX"
                class="vpj-overlay-scroll__thumb-x"
            />
        </div>
        <div
            @click.stop.prevent="jumpToY"
            v-show="showScrollY && enableScrollY"
            v-bind="props.trackYAttrs"
            ref="trackY"
            :class="[
                'vpj-overlay-scroll__track-y',
                {'dragging': draggingY}
            ]"
        >
            <div
                @mousedown.stop.prevent="startDragY"
                @selectstart.prevent
                @click.stop.prevent
                v-bind="props.thumbYAttrs"
                ref="thumbY"
                class="vpj-overlay-scroll__thumb-y"
            />
        </div>
    </component>
</template>


<style scoped>
    .vpj-overlay-scroll {
        align-items: center;
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: hidden;
    }

    .vpj-overlay-scroll__area {
        flex: 1;
        height: 100%;
        min-height: 0;
        min-width: 0;
        overflow-x: v-bind("enableScrollX ? 'auto' : 'hidden'");
        overflow-y: v-bind("enableScrollY ? 'auto' : 'hidden'");
        position: relative;
        scrollbar-width: none;
        -ms-overflow-style: none;
        width: 100%;
    }

    .vpj-overlay-scroll__area::-webkit-scrollbar {
        display: none;
    }

    .vpj-overlay-scroll__content {
        min-height: 100%;
        min-width: 100%;
    }

    /* Track */
    .vpj-overlay-scroll__track-x,
    .vpj-overlay-scroll__track-y {
        background-color: v-bind("trackColor.base");
        border-radius: v-bind("`${Number(props.thumbWidth) / 2}px`");
        opacity: 0;
        pointer-events: none;
        position: absolute;
        transition: opacity 0.3s ease;
    }

    .vpj-overlay-scroll__track-x:hover,
    .vpj-overlay-scroll__track-y:hover {
        background-color: v-bind("trackColor.hover");
    }

    .vpj-overlay-scroll__thumb-x:active,
    .vpj-overlay-scroll__thumb-y:active {
        background-color: v-bind("trackColor.active");
    }

    .vpj-overlay-scroll:hover > .vpj-overlay-scroll__track-x,
    .vpj-overlay-scroll:hover > .vpj-overlay-scroll__track-y,
    .vpj-overlay-scroll:focus > .vpj-overlay-scroll__track-x,
    .vpj-overlay-scroll:focus > .vpj-overlay-scroll__track-y,
    .vpj-overlay-scroll__track-x.dragging,
    .vpj-overlay-scroll__track-y.dragging {
        opacity: 1;
        pointer-events: auto;
    }

    .vpj-overlay-scroll__track-x {
        bottom: 0;
        height: v-bind("`${Number(props.thumbWidth)}px`");
        left: 0;
        right: 0;
        cursor: pointer;
    }

    .vpj-overlay-scroll__track-y {
        bottom: 0;
        right: 0;
        top: 0;
        width: v-bind("`${Number(props.thumbWidth)}px`");
        cursor: pointer;
    }

    /* Thumb */
    .vpj-overlay-scroll__thumb-x,
    .vpj-overlay-scroll__thumb-y {
        border-radius: v-bind("`${Number(props.thumbWidth) / 2}px`");
        cursor: pointer;
        left: 0;
        position: absolute;
        top: 0;
        background-color: v-bind("thumbColor.base");
    }

    .vpj-overlay-scroll__thumb-x:hover,
    .vpj-overlay-scroll__thumb-y:hover {
        background-color: v-bind("thumbColor.hover");
    }

    .vpj-overlay-scroll__thumb-x:active,
    .vpj-overlay-scroll__thumb-y:active,
    .vpj-overlay-scroll__thumb-x:focus,
    .vpj-overlay-scroll__thumb-y:focus,
    .vpj-overlay-scroll__track-x.dragging .vpj-overlay-scroll__thumb-x,
    .vpj-overlay-scroll__track-y.dragging .vpj-overlay-scroll__thumb-y {
        background-color: v-bind("thumbColor.active");
    }

    .vpj-overlay-scroll__thumb-x {
        height: 100%;
        transition: 
            opacity 0.3s ease,
            width 0.2s ease;
    }

    .vpj-overlay-scroll__thumb-y {
        width: 100%;
        transition: 
            opacity 0.3s ease,
            height 0.2s ease;
    }
</style>