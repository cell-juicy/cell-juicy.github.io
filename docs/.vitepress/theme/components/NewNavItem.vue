<script setup>
import { useData } from 'vitepress';
import { ref } from 'vue';

import VPJTooltipBtn from './VPJTooltipBtn.vue';
import VPJDynamicIcon from './VPJDynamicIcon.vue';

import VPJIconAngleSmallDown from './icons/VPJIconAngleSmallDown.vue'


const props = defineProps({
    data: {
        type: Object,
        required: true
    },
    depth: {
        type: Number,
        default: 0
    },
});

const collapsed = ref(!!props.data?.collapsed);
const iconHovered = ref(false);
</script>


<template>
    <li>
        <VPJTooltipBtn
            :is-link="true"
        >
            <span
                @mouseenter="iconHovered = true"
                @mouseleave="iconHovered = false"
                class=""
            >
                <button
                    v-if="iconHovered && props.data.items?.length > 0 && props.depth <= 5"
                    @click="collapsed = !collapsed"
                    class=""
                >
                    <VPJDynamicIcon
                        :icon="VPJIconAngleSmallDown"
                    />
                >
                </button>
                <VPJDynamicIcon
                    v-else-if="props.data.icon"
                    :icon="props.data.icon"
                    class=""
                />
            </span>
            <span class="vpj-text">
                {{ data.text }}
            </span>
        </VPJTooltipBtn>
        <ul
            v-show="(props.depth <= 5) && (props.data.items?.length > 0)"
        >
            <NewNavItem
                v-for="item in props.data.items"
                :data="item"
                :depth="props.depth + 1"
            />
        </ul>
    </li>
</template>


<style scoped>

</style>