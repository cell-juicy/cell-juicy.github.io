<script setup>
import { ref, computed, useTemplateRef, watch, onUnmounted, onMounted, nextTick } from 'vue';

import VPJDynamicIcon from './VPJDynamicIcon.vue';


const props = defineProps({
    boundary: {
        type: String
    },
    isLink: {
        type: Boolean,
        default: false
    },
    icon: {
        type: [String, Object]
    },
    iconAttrs: {
        type: Object,
        default: {}
    },
    text: {
        type: String
    },
    textAttrs: {
        type: Object,
        default: {}
    },
    tooltip: {
        type: [String, undefined],
    },
    tooltipAttrs: {
        type: Object,
        default: {}
    },
    tooltipPosition: {
        type: String,
        default: 'bottom'
    },
    offset: {
        type: Object,
        default: {
            x: 0,
            y: 0
        }
    },
    safeMargin: {
        type: Number,
        default: 8
    }
})

const tooltipVisible = ref(false);
const tooltipCss = ref({left: '0px', top: '0px', transform: undefined})
const button = useTemplateRef('buttonRef');
const tooltip = useTemplateRef('tooltipRef');


function updateTooltipPosition() {
    if (tooltip.value && button.value) {
        const buttonRect = button.value.getBoundingClientRect();

        let top = buttonRect.top;
        let left = buttonRect.left;
        let transform = {x: 0, y: 0};

        switch (props.tooltipPosition) {
            case "top":
                transform.x = -0.5;
                transform.y = -1;
                left += buttonRect.width / 2;
                break;
            case "bottom":
                transform.x = -0.5;
                left += buttonRect.width / 2;
                top += buttonRect.height;
                break;
            case "left":
                transform.x = -1;
                transform.y = -0.5;
                top += buttonRect.height / 2;
                break;
            case "right":
                transform.y = -0.5;
                left += buttonRect.width;
                top += buttonRect.height / 2;
                break;
            default:
                transform.x = -0.5;
                left += buttonRect.width / 2;
                top += buttonRect.height;
                break;
        };

        if (typeof props.offset === 'object') {
            left += Number(props.offset.x) || 0;
            top += Number(props.offset.y) || 0;
        }

        if (typeof props.boundary === 'string') {
            const boundary = document.querySelector(props.boundary);
            if (boundary) {
                const tooltipRect = tooltip.value.getBoundingClientRect();
                const boundaryRect = boundary.getBoundingClientRect();

                if (left + transform.x * tooltipRect.width < boundaryRect.left + Number(props.safeMargin)) {
                    left = boundaryRect.left + Number(props.safeMargin);
                    transform.x = 0;
                } else if (left + (transform.x + 1) * tooltipRect.width > boundaryRect.right - Number(props.safeMargin)) {
                    left = boundaryRect.right - tooltipRect.width - Number(props.safeMargin);
                    transform.x = 0;
                }

                if (top + transform.y * tooltipRect.height < boundaryRect.top + Number(props.safeMargin)) {
                    top = boundaryRect.top + Number(props.safeMargin);
                    transform.y = 0;
                } else if (top + (transform.y + 1) * tooltipRect.height > boundaryRect.bottom - Number(props.safeMargin)) {
                    top = boundaryRect.bottom - tooltipRect.height - Number(props.safeMargin);
                    transform.y = 0;
                }
            }
        }

        tooltipCss.value = {
            left: `${left}px`,
            top: `${top}px`,
            transform: `translate(${transform.x * 100}%, ${transform.y * 100}%)`
        }
    }
}

if (props.tooltip) {
    const stopTooltipWatcher = watch(tooltipVisible, (val) => {
        if (val) nextTick(updateTooltipPosition);
    });
    const observer = new ResizeObserver(updateTooltipPosition);

    let currentBoundary = null;
    const stopObserverWatcher = watch(() => props.boundary, (val) => {
        if (currentBoundary) {
            observer.unobserve(currentBoundary);
        }
        if (val) {
            const newBoundary = document.querySelector(val);
            if (newBoundary) {
                observer.observe(newBoundary);
                currentBoundary = newBoundary;
            }
        }
    }, { immediate: true });

    onMounted(() => {
        window.removeEventListener('resize', updateTooltipPosition);
        window.addEventListener('resize', updateTooltipPosition);
        observer.observe(button.value);
    })

    onUnmounted(() => {
        window.removeEventListener('resize', updateTooltipPosition);
        observer.disconnect();
        stopTooltipWatcher();
        stopObserverWatcher();
    })
}

defineExpose({
    elementSelf: button
})
</script>


<template>
    <component
        ref="buttonRef"
        :is="props.isLink ? 'a' : 'button'"
        :type="props.isLink ? undefined : 'button'"
        @mouseenter="tooltipVisible = true"
        @mouseleave="tooltipVisible = false"
        class="vpj-btn"
    >
        <slot>
            <VPJDynamicIcon
                v-if="props.icon"
                v-bind="props.iconAttrs"
                :icon="props.icon"
                class="vpj-icon"
            />
            <span
                v-if="props.text"
                v-bind="props.textAttrs"
                class="vpj-text"
            >
                {{ props.text }}
            </span>
        </slot>
        <Teleport to=".vpj-portals-root">
            <Transition>
                <div 
                    v-if="props.tooltip && tooltipVisible"
                    v-bind="props.tooltipAttrs"
                    ref="tooltipRef"
                    class="vpj-teleport"
                    :style="tooltipCss"
                >
                    {{ props.tooltip }}
                </div>
            </Transition>
        </Teleport>
    </component>
</template>


<style scoped>
    /* Vue Transition */
    .v-enter-from,
    .v-leave-to {
        opacity: 0;
    }

    .v-enter-to,
    .v-leave-from {
        opacity: 1;
    }

    .v-enter-active,
    .v-leave-active {
        transition: opacity 0.2s ease-in-out;
    }
</style>