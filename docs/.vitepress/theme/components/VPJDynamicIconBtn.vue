<script setup>
const props = defineProps({
    isLink: {
        type: Boolean
    },

    icon: {
        type: [String, Object],
        validator: (value) => {
            return typeof value === 'string' || 
                (value && typeof value.render === 'function')
        }
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
            <img  v-if="typeof props.icon === 'string'" :src="props.icon" class="vpj-icon" v-bind="iconAttrs"/>
            <component v-if="typeof props.icon.render === 'function'" :is="props.icon" class="vpj-icon" v-bind="iconAttrs"/>
        </slot>
        <slot name="text">
            <span v-if="props.text" class="vpj-text" v-bind="textAttrs">{{ props.text }}</span>
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