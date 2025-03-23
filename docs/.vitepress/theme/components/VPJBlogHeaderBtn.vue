<script setup>
import { ref, computed, onMounted, useTemplateRef } from 'vue';
import { storeToRefs } from 'pinia';

import { useVPJSidebar } from '../composables/useVPJSidebar';
import VPJDynamicIcon from './VPJDynamicIcon.vue';


const props = defineProps({
    icon: {
        type: [String, Object],
        requirded: true
    },

    text: {
        type: String,
        requirded: true
    },

    link: {
        type: String,
        requirded: true
    },

    tooltip: {
        type: [String, null],
        requirded: true
    },

    highlight: {
        type: [Object, Boolean],
        requirded: true
    }
})
const store = useVPJSidebar();
const { collapsed, navConfig, highlightPath } = storeToRefs(store);
const elementSelf = useTemplateRef('elementSelf');

/* highlight ref */
const highlightStyle = computed(() => {
    if (!props.highlight) return {};
    const styles = {};
    if (typeof props.highlight === 'object') {
        if (props.highlight.normal) {
            styles['--vpj-highlight-normal'] = props.highlight.normal;
        }
        if (props.highlight.hover) {
            styles['--vpj-highlight-hover'] = props.highlight.hover;
        }
        if (props.highlight.active) {
            styles['--vpj-highlight-active'] = props.highlight.active;
        }
    }
    return styles;
})

/* tooltip ref */
const computedTooltip = computed(() => {
    return navConfig.value.tooltip ? props.tooltip : null;
})
const tooltipVisible = ref(false);
const tooltipPosition = ref({ top: '0px', left: '0px' });


function updateTooltipPosition() {
    if (elementSelf.value) {
        const rect = elementSelf.value.getBoundingClientRect();
        tooltipPosition.value = {
            top: rect.top + rect.height / 2 + 'px',
            left: rect.right + 8 + 'px'
        };
    }; 
}


defineExpose({
    elementSelf
});


onMounted(() => {
    if (elementSelf.value && computedTooltip) {
        updateTooltipPosition();
        elementSelf.value.addEventListener('mouseenter', () => {
            updateTooltipPosition();
            tooltipVisible.value = true;
        })
        elementSelf.value.addEventListener('mouseleave', () => {
            tooltipVisible.value = false;
        })
    }
})
</script>


<template>
    <a
        :href="props.link"
        v-bind="{
            class: [
                'vpj-sidebar-nav__link',
                {'highlight': highlightPath === props.link && highlight}
            ],
            style: highlightStyle,
            'data-tooltip': computedTooltip
        }"
        ref="elementSelf"
    >
        <VPJDynamicIcon
            :icon="props.icon"
            class="vpj-icon"
        />
        <span v-show="!collapsed" class="vpj-text">
            {{ props.text }}
        </span>
        <Teleport to=".vpj-portals-root">
            <div 
                v-if="collapsed && tooltipVisible && computedTooltip"
                class="vpj-sidebar-nav__link-tooltip"
            >
                <span class="vpj-sidebar-nav__link-tooltip-content">
                    {{ computedTooltip }}
                </span>
            </div>
        </Teleport>
    </a>
</template>


<style scoped>
    /* Nav link */
    .vpj-sidebar-nav__link,
    .vpj-sidebar-nav__link:visited {
        align-items: center;
        background-color: var(--vpj-color-bg-300);
        border: 0;
        border-radius: var(--vpj-border-radius-100);
        display: flex;
        flex: 1;
        flex-direction: row;
        gap: .75rem;
        height: 36px;
        min-width: 0;
        padding-left: .625rem;
        padding-right: .625rem;
        text-decoration: none;
    }

    .vpj-sidebar-nav__link:hover,
    .vpj-sidebar-nav__link:active {
        background-color: var(--vpj-color-bg-500);
    }

    /* Nav link icon & text */
    .vpj-sidebar-nav__link .vpj-icon {
        fill: var(--vpj-color-text-300);
    }

    .vpj-sidebar-nav__link:hover .vpj-icon,
    .vpj-sidebar-nav__link:active .vpj-icon {
        fill: var(--vpj-color-text-400);
    }

    .vpj-sidebar-nav__link .vpj-text {
        color: var(--vpj-color-text-400);
        font-size: .875rem;
    }

    /* Highlight link */
    .vpj-sidebar-nav__link.highlight .vpj-icon {
        fill: var(--vpj-highlight-normal, var(--vpj-color-primary-400));
    }

    .vpj-sidebar-nav__link.highlight:hover .vpj-icon {
        fill: var(--vpj-highlight-hover, var(--vpj-color-primary-500));
    }

    .vpj-sidebar-nav__link.highlight:active .vpj-icon {
        fill: var(--vpj-highlight-active, var(--vpj-color-primary-300));
    }

    /* Tooltip */
    .vpj-sidebar-nav__link-tooltip {
        align-items: center;
        background: var(--vpj-color-text-500);
        border-radius: var(--vpj-border-radius-100);
        display: flex;
        height: 28px;
        left: v-bind("tooltipPosition.left");
        max-width: 120px;
        padding-left: .5rem;
        padding-right: .5rem;
        pointer-events: none;
        position: fixed;
        top: v-bind("tooltipPosition.top");
        transform: translateY(-50%);
        z-index: 101;
    }

    .vpj-sidebar-nav__link-tooltip-content {
        color: var(--vpj-color-bg-100);
        font-size: .875rem;
        line-height: 1;
        overflow: hidden;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>