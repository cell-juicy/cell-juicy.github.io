<script setup>
import { computed, ref } from 'vue';
import { useData } from 'vitepress';
import { storeToRefs } from 'pinia';

import { useVPJSidebar } from '../composables/useVPJSidebar';

import { isMobile } from '../utils/deviceTypes';

import VPJDynamicIconBtn from './VPJDynamicIconBtn.vue';

import VPJIconAngleSmallLeft from './icons/VPJIconAngleSmallLeft.vue';
import VPJIconAngleSmallRight from './icons/VPJIconAngleSmallRight.vue';
import VPJIconSearch from './icons/VPJIconSearch.vue';


const store = useVPJSidebar();
const { collapsed, enabled, headerConfig } = storeToRefs(store);
const { toggle } = store;
const { theme, isDark } = useData();

// enable nav
const enable = computed(() => {
    // const configEnable = theme.value.mobileNav?.enable ?? true;
    // return configEnable && isMobile.value
    return true;
});

// initialize title
const computedTitle = computed(() => {
    const mobileNavTitle = theme.value.mobileNav?.title ?? headerConfig.value.title;
    if (typeof mobileNavTitle === 'object' && typeof mobileNavTitle.component === 'string') {
        return { component: mobileNavTitle.component }
    } else if (typeof mobileNavTitle === 'string') {
        return { text: mobileNavTitle }
    } else {
        return { text: headerConfig.value.profile.title }
    }
});
</script>


<template>
    <nav v-if="enable" class="vpj-mobile-nav">
        <VPJDynamicIconBtn
            v-if="enabled"
            @click="toggle"
            :icon="collapsed ? VPJIconAngleSmallLeft : VPJIconAngleSmallRight"
            class="vpj-mobile-nav__btn"
        />
        <slot name="mobile-nav-content">
            <span v-if="computedTitle.text" class="vpj-mobile-nav__title vpj-text">
                {{ computedTitle.text }}
            </span>
            <component v-else :is="computedTitle.component"/>
        </slot>
        <VPJDynamicIconBtn
            v-if="enabled"
            @click="isDark = !isDark"
            :icon="VPJIconSearch"
            class="vpj-mobile-nav__btn"
        />
    </nav>
</template>


<style scoped>
    /* Mobile Navigation */
    .vpj-mobile-nav {
        align-items: center;
        background: var(--vpj-mobile-nav-bg);
        border-bottom: var(--vpj-mobile-nav-border);
        display: flex;
        flex-direction: row;
        flex-shrink: 0;
        height: var(--vpj-mobile-nav-height);
        min-width: 0;
        padding-inline: var(--vpj-mobile-nav-padding-x);
    }

    /* Title */
    .vpj-mobile-nav__title {
        color: var(--vpj-mobile-nav-title-color);
        flex: 1;
        font-size: var(--vpj-mobile-nav-title-size);
        font-weight: var(--vpj-mobile-nav-title-weight);
        margin-left: var(--vpj-mobile-nav-title-gap);
    }

    /* Button */
    .vpj-mobile-nav__btn {
        align-items: center;
        background-color: var(--vpj-mobile-nav-btn-bg);
        border: var(--vpj-mobile-nav-btn-border);
        border-radius: var(--vpj-mobile-nav-btn-radius);
        flex-shrink: 0;
        height: var(--vpj-mobile-nav-btn-size);
        justify-content: center;
        width: var(--vpj-mobile-nav-btn-size);
    }

    .vpj-mobile-nav__btn:hover,
    .vpj-mobile-nav__btn:active {
        background: var(--vpj-mobile-nav-btn-bg-hover);
    }

    .vpj-mobile-nav__btn :deep(.vpj-icon) {
        fill: var(--vpj-mobile-nav-btn-icon-color);
        height: var(--vpj-mobile-nav-btn-icon-size);
        width: var(--vpj-mobile-nav-btn-icon-size);
    }

    .vpj-mobile-nav__btn:hover :deep(.vpj-icon),
    .vpj-mobile-nav__btn:active :deep(.vpj-icon) {
        fill: var(--vpj-mobile-nav-btn-icon-color-hover);
    }
</style>