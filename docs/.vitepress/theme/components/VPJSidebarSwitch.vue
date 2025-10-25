<script setup>
import { computed, inject, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import { useData } from 'vitepress';
import { storeToRefs } from 'pinia';

import { useVPJData } from '../composables/useVPJData';
import { useVPJSidebar } from '../composables/useVPJSidebar';

import { isObject } from '../utils/common';

import VPJOverlayScrollArea from './VPJOverlayScrollArea.vue';

import VPJIconCaretDown from './icons/VPJIconCaretDown.vue';
import VPJIconSun from './icons/VPJIconSun.vue';
import VPJIconMoon from './icons/VPJIconMoon.vue';


const DEFAULT = {
    INVALID: "未定义子主题",
    SOURCE: {
        default: "Default"
    },
};


const { isDark, theme } = useData();
const { subTheme } = useVPJData();
const store = useVPJSidebar();
const { collapsed } = storeToRefs(store);

const menuVisible = ref(false);
const labelElement = useTemplateRef("subThemeLabel");

const toggleAppearance = inject('toggle-appearance', () => {
    isDark.value = !isDark.value;
});
const subThemeSources = computed(() => ({
    ...DEFAULT.SOURCE, ...(isObject(theme.value.subThemes) ? theme.value.subThemes : {})
}));
const invalidLabel = computed(() => {
    const message = theme.value.components?.switch?.invalidSubThemeLabel;
    return (typeof message === 'string') ? message : DEFAULT.INVALID;
});

const subThemeList = computed(() => {
    return Object.entries(subThemeSources.value).filter(([_, v]) => typeof v === 'string');
});
const currentSubThemeLabel = computed(() => {
    const label = subThemeSources.value[subTheme.value];
    return typeof label === 'string' ? (label.length ? label : subTheme.value) : invalidLabel.value;
});
const translateX = computed(() => 
    isDark.value
        ? "translateX(calc(var(--vpj-sidebar-header-switch-brightness-height) - var(--vpj-border-width-1)))"
        : "none"
);
const menuPosition = ref({
    bottom: "auto",
    left: "auto",
    right: "auto",
    top: "auto"
});


function selectSubTheme(name) {
    subTheme.value = name;
    menuVisible.value = false;
};
function toggleSubThemeMenu() {
    if (!labelElement.value) return;

    const rect = labelElement.value.getBoundingClientRect();
    if (rect.bottom + 355 < window.innerHeight) {
        menuPosition.value.bottom = "auto";
        menuPosition.value.top = `calc(${rect.bottom}px + var(--vpj-sidebar-header-gap))`;
    } else {
        menuPosition.value.bottom = `calc(${window.innerHeight - rect.top}px + var(--vpj-sidebar-header-gap))`;
        menuPosition.value.top = "auto";
    };
    menuPosition.value.left = rect.left + "px";
    menuPosition.value.right = window.innerWidth - rect.right + "px";

    menuVisible.value = !menuVisible.value;
};
</script>


<template>
    <div>
        <button
            v-if="collapsed"
            @click="toggleAppearance"
            class="vpj-sidebar__btn collapsed"
        >
            <VPJIconMoon
                v-if="isDark"
                class="vpj-icon"
            />
            <VPJIconSun
                v-else
                class="vpj-icon"
            />
        </button>
        <button
            v-else
            @click.stop.prevent="toggleSubThemeMenu"
            class="vpj-sidebar__btn"
            data-action="switch-sub-theme"
        >
            <div class="vpj-sidebar__header-switch-wrapper">
                <button
                    @click.stop.prevent="toggleAppearance"
                    class="vpj-sidebar__header-switch-brightness"
                >
                    <span class="vpj-sidebar__header-switch-brightness-toggler">
                        <VPJIconMoon
                            v-if="isDark"
                            class="vpj-icon"
                        />
                        <VPJIconSun
                            v-else
                            class="vpj-icon"
                        />
                    </span>
                </button>
            </div>
            <span
                ref="subThemeLabel"
                class="vpj-text"
            >
                {{ currentSubThemeLabel }}
            </span>
            <VPJIconCaretDown class="vpj-sidebar__header-switch-marker"/>
        </button>
        <Teleport to=".vpj-portals-root">
            <div
                v-if="menuVisible"
                @click="menuVisible = false"
                class="vpj-sidebar__header-switch-menu-overlay"
            >
                <VPJOverlayScrollArea
                    @click.stop.prevent
                    overflow="y"
                    :inner-attrs="{
                        class: 'vpj-sidebar__header-switch-menu-inner'
                    }"
                    class="vpj-sidebar__header-switch-menu-outer"
                >
                    <button
                        v-for="[name, label] in subThemeList"
                        :key="name"
                        @click.stop.prevent="() => selectSubTheme(name)"
                        :disabled="name === subTheme"
                        :class="[
                            'vpj-sidebar__header-switch-sub-theme-option',
                            { 'selected': name === subTheme }
                        ]"
                    >
                        <span class="vpj-text">{{ label.length ? label : name }}</span>
                    </button>
                </VPJOverlayScrollArea>
            </div>
        </Teleport>
    </div>
</template>


<style scoped>
    [data-action="switch-sub-theme"] {
        gap: var(--vpj-sidebar-header-switch-gap);
        padding-bottom: 0;
        padding-left: calc((var(--vpj-sidebar-btn-height) - var(--vpj-sidebar-header-switch-brightness-height)) / 2);
        padding-right: calc((var(--vpj-sidebar-btn-height) - var(--vpj-sidebar-header-switch-marker-size)) / 2);
        padding-top: 0;
    }

    /* Brightness Switcher */
    .vpj-sidebar__header-switch-wrapper {
        background: transparent;
        height: var(--vpj-sidebar-header-switch-brightness-height);
        width: calc(2 * var(--vpj-sidebar-header-switch-brightness-height));
    }

    .vpj-sidebar__header-switch-brightness {
        align-items: center;
        background: var(--vpj-sidebar-header-switch-brightness-bg);
        border-color: var(--vpj-sidebar-header-switch-brightness-border);
        border-style: solid;
        border-width: var(--vpj-border-width-1);
        border-radius: calc(var(--vpj-sidebar-header-switch-brightness-height) / 2);
        display: flex;
        height: 100%;
        position: relative;
        transition: border-color var(--vpj-sidebar-transition);
        width: 100%;
    }

    .vpj-sidebar__header-switch-brightness:hover {
        border-color: var(--vpj-sidebar-header-switch-brightness-border-hover);
    }

    .vpj-sidebar__header-switch-brightness-toggler {
        align-items: center;
        background: var(--vpj-sidebar-header-switch-brightness-toggle-bg);
        border-radius: 50%;
        box-shadow: var(--vpj-shadow-2);
        display: flex;
        height: calc(var(--vpj-sidebar-header-switch-brightness-height) - 2 * var(--vpj-border-width-1));
        justify-content: center;
        left: var(--vpj-border-width-1);
        position: absolute;
        transform: v-bind(translateX);
        transition: transform var(--vpj-sidebar-transition);
        width: calc(var(--vpj-sidebar-header-switch-brightness-height) - 2 * var(--vpj-border-width-1));
    }

    .vpj-sidebar__header-switch-brightness-toggler > .vpj-icon {
        border-radius: 50%;
        fill: var(--vpj-sidebar-btn-icon-color);
        height: 66.67%;
        width: 66.67%;
    }

    [data-action="switch-sub-theme"] > .vpj-text,
    [data-action="switch-sub-theme"]:hover > .vpj-text,
    [data-action="switch-sub-theme"]:active > .vpj-text {
        align-items: center;
        color: var(--vpj-sidebar-header-switch-label-color);
        display: flex;
        font-weight: var(--vpj-sidebar-header-switch-label-weight);
        height: 100%;
        justify-content: center;
        margin-right: 0;
        text-align: center;
    }

    .vpj-sidebar__header-switch-marker {
        fill: var(--vpj-sidebar-header-switch-marker-color);
        flex-shrink: 0;
        height: var(--vpj-sidebar-header-switch-marker-size);
        width: var(--vpj-sidebar-header-switch-marker-size);
    }

    [data-action="switch-sub-theme"]:hover > .vpj-sidebar__header-switch-marker {
        fill: var(--vpj-sidebar-header-switch-marker-color-hover);
    }

    /* Menu */
    .vpj-sidebar__header-switch-menu-overlay {
        background-color: transparent;
        bottom: 0;
        left: 0;
        position: fixed;
        right: 0;
        top: 0;
        z-index: var(--vpj-sidebar-header-switch-menu-z-index);
    }

    .vpj-sidebar__header-switch-menu-outer {
        background: var(--vpj-sidebar-header-switch-menu-bg);
        border: var(--vpj-sidebar-header-switch-menu-border);
        border-radius: var(--vpj-sidebar-header-switch-menu-radius);
        box-shadow: var(--vpj-sidebar-header-switch-menu-shadow);
        max-height: 355px;
        position: fixed;
        bottom: v-bind("menuPosition.bottom");
        left: v-bind("menuPosition.left");
        right: v-bind("menuPosition.right");
        top: v-bind("menuPosition.top");
    }

    :deep(.vpj-sidebar__header-switch-menu-inner) {
        display: flex;
        flex-direction: column;
        gap: var(--vpj-sidebar-header-switch-menu-gap);
        padding: var(--vpj-sidebar-header-switch-menu-padding);
    }

    .vpj-sidebar__header-switch-sub-theme-option {
        background: var(--vpj-sidebar-header-switch-option-bg);
        border-radius: var(--vpj-sidebar-header-switch-option-radius);
        padding: var(--vpj-sidebar-header-switch-option-padding);
        text-align: start;
        width: 100%;
    }

    .vpj-sidebar__header-switch-sub-theme-option > .vpj-text {
        color: var(--vpj-sidebar-header-switch-option-font-color);
        font-size: var(--vpj-sidebar-header-switch-option-font-size);
        font-weight: var(--vpj-sidebar-header-switch-option-font-weight);
    }

    .vpj-sidebar__header-switch-sub-theme-option:hover,
    .vpj-sidebar__header-switch-sub-theme-option:active {
        background: var(--vpj-sidebar-header-switch-option-bg-hover);
    }

    .vpj-sidebar__header-switch-sub-theme-option:disabled > .vpj-text {
        color: var(--vpj-sidebar-header-switch-option-selected-font-color);
        font-size: var(--vpj-sidebar-header-switch-option-selected-font-size);
        font-weight: var(--vpj-sidebar-header-switch-option-selected-font-weight);
    }

    .vpj-sidebar__header-switch-sub-theme-option:disabled:hover,
    .vpj-sidebar__header-switch-sub-theme-option:disabled:active {
        background: var(--vpj-sidebar-header-switch-option-bg);
    }
    

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
        transition: opacity var(--vpj-sidebar-transition);
    }
</style>