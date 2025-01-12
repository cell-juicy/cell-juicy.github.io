<script setup>
import { computed } from 'vue';


const props = defineProps({
    icon: {
        type: [String, Object],
        required: true
    }
});

const isImagePath = (str) => /\.(png|jpe?g|gif|webp|svg)$/i.test(str);

const isImage = computed(() => {
    if (typeof props.icon === 'string') {
        return isImagePath(props.icon);
    } else if (typeof props.icon === 'object' && props.icon.src) {
        return true;
    } else {
        return false;
    }
});

const isComponent = computed(() => {
    if (typeof props.icon === 'object' && props.icon.component) {
        return true;
    } else if (typeof props.icon === 'string' || typeof props.icon.render === 'function') {
        return true;
    } else {
        return false;
    }
});

const imageSource = computed(() => {
    if (isImage.value) {
        if (typeof props.icon === 'object') {
            return props.icon;
        }
        return { src: props.icon };
    }
    return null;
});

const componentSource = computed(() => {
    if (isComponent.value) {
        if (typeof props.icon === 'object' && props.icon.component) {
            return props.icon.component;
        }
        return props.icon;
    }
    return null;
});
</script>


<template>
    <img v-if="isImage" :src="imageSource.src" :alt="imageSource.alt"/>
    <component v-else-if="isComponent" :is="componentSource"/>
    <div v-else class="vpj-error">Invalid Icon input, {{props.icon}} is not a image path/Vue component.</div>
</template>