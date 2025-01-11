<script setup>
import { computed } from 'vue';


const props = defineProps({
    icon: {
        type: [String, Object],
        required: true,
    }
});

const isImagePath = (str) => /\.(png|jpe?g|gif|webp|svg)$/i.test(str);

const isImage = computed(() => {
    if (typeof props.icon === 'string') {
        return isImagePath(props.icon);
    }
    if (typeof props.icon === 'object' && props.icon.img) {
        return true;
    }
    return false;
});

// 是否为组件类型
const isComponent = computed(() => {
    if (typeof props.icon === 'object' && props.icon.component) {
        return true;
    }
    if (typeof props.icon === 'string' && !isImagePath(props.icon)) {
        return true;
    }
    return false;
});

// 提取图片源
const imgSource = computed(() => {
    if (isImage.value) {
        if (typeof props.icon === 'object') {
            return props.icon.img;
        }
        return props.icon;
    }
    return null;
});

// 提取组件
const componentSource = computed(() => {
    if (isComponent.value) {
        if (typeof props.icon === 'object') {
            return props.icon.component;
        }
        return props.icon;
    }
    return null;
});
</script>


<template>
    <img v-if="isImagePath" :src="imgSource"/>
    <component v-else-if="isComponent" :is="componentSource"/>
    <div class="vpj-error">Invalid Icon input, {{props.icon}} is not a image path/Vue component.</div>
</template>