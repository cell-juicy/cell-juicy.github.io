<script setup>
import VPJDynamicIcon from './VPJDynamicIcon.vue'

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
</script>


<template>
    <component :is="props.isLink ? 'a' : 'button'" class="vpj-icon-btn">
        <slot name="icon">
            <VPJDynamicIcon :icon="props.icon" class="vpj-icon" v-bind="props.iconAttrs"/>
        </slot>
        <slot name="text">
            <span v-if="props.text" class="vpj-text" v-bind="props.textAttrs">{{ props.text }}</span>
        </slot>
    </component>
</template>


<style scoped>
    .vpj-icon-btn {
        align-items: center;
        display: flex;
        flex-direction: row;
    }
</style>