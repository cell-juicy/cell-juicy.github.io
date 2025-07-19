<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';

// template refs
const area = ref(null);
const trackX = ref(null);
const trackY = ref(null);
const thumbX = ref(null);
const thumbY = ref(null);

// state
const showScrollX = ref(false);
const showScrollY = ref(false);
const draggingX = ref(false);
const draggingY = ref(false);
const mouseStartX = ref(0);
const mouseStartY = ref(0);
const scrollStartX = ref(0);
const scrollStartY = ref(0);

function updateScrolls() {
    if (!area.value || !trackX.value || !trackY.value || !thumbX.value || !thumbY.value) return;
    
    const vw = area.value.clientWidth;
    const vh = area.value.clientHeight;
    const cw = area.value.scrollWidth;
    const ch = area.value.scrollHeight;
    const tw = trackX.value.clientWidth;
    const th = trackY.value.clientHeight;

    if (cw <= vw) {
        showScrollX.value = false
    } else {
        showScrollX.value = true;

        const width = Math.max(20, (vw / cw) * tw);
        const transform = (area.value.scrollLeft / cw) * tw;

        thumbX.value.style.width = `${width}px`;
        thumbX.value.style.transform = `translateX(${transform}px)`;
    };

    if (ch <= vh) {
        showScrollY.value = false;
    } else {    
        showScrollY.value = true;
        
        const height = Math.max(20, (vh / ch) * th);
        const transform = (area.value.scrollTop / ch) * th;

        thumbY.value.style.height = `${height}px`;
        thumbY.value.style.transform = `translateY(${transform}px)`;
    };
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


onMounted(() => {
    if (area.value && thumbX.value && trackX.value && thumbY.value && trackY.value) {
        nextTick(() => updateScrolls());
        window.addEventListener("resize", updateScrolls);
    };
});

onBeforeUnmount(() => {
    window.removeEventListener("resize", updateScrolls);
});
</script>


<template>
    <div
        @mouseenter.stop.prevent.once="updateScrolls"
        class="vpj-overlay-scroll"
    >
        <div
            @scroll="updateScrolls"
            ref="area"
            class="vpj-overlay-scroll__area"
        >
            <slot/>
        </div>
        <div
            @click.stop.prevent="jumpToX"
            v-show="showScrollX"
            ref="trackX"
            :class="[
                'vpj-overlay-scroll__track-x',
                {'dragging': draggingX}
            ]"
        >
            <div
                @mousedown.stop="startDragX"
                @selectstart.prevent
                ref="thumbX"
                class="vpj-overlay-scroll__thumb-x"
            />
        </div>
        <div
            @click.stop.prevent="jumpToY"
            v-show="showScrollY"
            ref="trackY"
            :class="[
                'vpj-overlay-scroll__track-y',
                {'dragging': draggingY}
            ]"
        >
            <div
                @mousedown.stop="startDragY"
                @selectstart.prevent
                ref="thumbY"
                class="vpj-overlay-scroll__thumb-y"
            />
        </div>
    </div>
</template>


<style scoped>
    .vpj-overlay-scroll {
        position: relative;
        overflow: hidden;
        height: 300px;
        width: 300px;
        background-color: lightgreen;
    }

    .vpj-overlay-scroll__area {
        height: 100%;
        width: 100%;
        overflow-x: auto;
        overflow-y: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    .vpj-overlay-scroll__area::-webkit-scrollbar {
        display: none;
    }

    /* Track */
    .vpj-overlay-scroll__track-x,
    .vpj-overlay-scroll__track-y {
        border-radius: 3px;
        opacity: 0;
        pointer-events: none;
        position: absolute;
        transition: opacity 0.3s ease;
        background-color: lightcoral;
    }

    .vpj-overlay-scroll:hover .vpj-overlay-scroll__track-x,
    .vpj-overlay-scroll:hover .vpj-overlay-scroll__track-y,
    .vpj-overlay-scroll:focus .vpj-overlay-scroll__track-x,
    .vpj-overlay-scroll:focus .vpj-overlay-scroll__track-y,
    .vpj-overlay-scroll__track-x.dragging,
    .vpj-overlay-scroll__track-y.dragging {
        opacity: 1;
        pointer-events: auto; /* 悬停时启用交互 */
    }

    .vpj-overlay-scroll__track-x {
        bottom: 0;
        height: 6px;
        left: 0;
        right: 0;
        cursor: pointer; /* 添加光标指示可点击 */
    }

    .vpj-overlay-scroll__track-y {
        bottom: 0;
        right: 0;
        top: 0;
        width: 6px;
        cursor: pointer; /* 添加光标指示可点击 */
    }

    /* Thumb */
    .vpj-overlay-scroll__thumb-x,
    .vpj-overlay-scroll__thumb-y {
        border-radius: 3px;
        cursor: pointer;
        left: 0;
        position: absolute;
        top: 0;
        background-color: lightblue;
    }

    .vpj-overlay-scroll__thumb-x {
        height: 100%;
        transition: 
            opacity 0.3s ease,
            width 0.2s ease;
        width: 18px;
    }

    .vpj-overlay-scroll__thumb-y {
        width: 100%;
        transition: 
            opacity 0.3s ease,
            height 0.2s ease;
        height: 18px;
    }
</style>