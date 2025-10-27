<script setup>
import { useTemplateRef } from 'vue';
import VPJDynamicIcon from './VPJDynamicIcon.vue'



const elementSelf = useTemplateRef('elementSelf');
const props = defineProps({
    isLink: {
        type: Boolean
    },
    icon: {
        type: [String, Object],
        required: true
    },
    iconAttrs: {
        type: Object,
        default: () => ({})
    },
    text: {
        type: String
    },
    textAttrs: {
        type: Object,
        default: () => ({})
    }
})

defineExpose({
    elementSelf
})
</script>


<template>
    <component :is="props.isLink ? 'a' : 'button'" ref="elementSelf" class="vpj-btn">
        <slot name="icon">
            <VPJDynamicIcon :icon="props.icon" class="vpj-icon" v-bind="props.iconAttrs"/>
        </slot>
        <slot name="text">
            <span v-if="props.text" class="vpj-text" v-bind="props.textAttrs">{{ props.text }}</span>
        </slot>
    </component>
</template>