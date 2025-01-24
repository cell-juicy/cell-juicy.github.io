<script setup>
import { computed, ref } from 'vue';
import { useData } from 'vitepress';
import { storeToRefs } from 'pinia';

import { useVPJSidebar } from '../composables/useVPJSidebar';

import { isMobile } from '../utils/deviceTypes';

import VPJDynamicIconBtn from './VPJDynamicIconBtn.vue';
import VPJIconAngleSmallLeft from './icons/VPJIconAngleSmallLeft.vue';
import VPJIconAngleSmallRight from './icons/VPJIconAngleSmallRight.vue';


const store = useVPJSidebar();
const { collapsed, enabled, headerConfig } = storeToRefs(store);
const { toggle } = store;
const { theme } = useData();

// enable nav
const enable = computed(() => {
    const configEnable = theme.value.mobileNav?.enable ?? true;
    return configEnable && isMobile.value
});

// initialize title
const computedTitle = computed(() => {
    const mobileNavTitle = theme.value.mobileNav?.title ?? headerConfig.value.title;
    if (typeof mobileNavTitle === 'object' && typeof mobileNavTitle.component === 'string') {
        return { component: mobileNavTitle.component }
    } else if (typeof mobileNavTitle === 'string') {
        return { text: mobileNavTitle }
    } else {
        return { text: headerConfig.value.title }
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
    </nav>
</template>


<style scoped>
    /* Mobile Navigation */
    .vpj-mobile-nav {
        align-items: center;
        background-color: var(--vpj-color-bg-300);
        border-bottom: var(--vpj-border-width-200) solid var(--vpj-color-border-300);
        display: flex;
        flex-direction: row;
        flex-shrink: 0;
        height: 48px;
        min-width: 0;
        padding-left: .5rem;
        padding-right: .5rem;
    }

    /* Title */
    .vpj-mobile-nav__title {
        flex: 1;
        font-size: .875rem;
        font-weight: var(--vpj-font-weight-600);
        margin-left: .5rem;
    }

    /* Button */
    .vpj-mobile-nav__btn {
        background-color: var(--vpj-color-bg-300);
        border: 0;
        border-radius: var(--vpj-border-radius-100);
        flex-shrink: 0;
        gap: .75rem;
        height: 36px;
        width: 36px;
        padding: 10px;
    }

    .vpj-mobile-nav__btn:hover,
    .vpj-mobile-nav__btn:active {
        background-color: var(--vpj-color-bg-500);
    }

    .vpj-mobile-nav__btn :deep(.vpj-icon) {
        fill: var(--vpj-color-text-300);
    }

    .vpj-mobile-nav__btn:hover :deep(.vpj-icon),
    .vpj-mobile-nav__btn:active :deep(.vpj-icon) {
        fill: var(--vpj-color-text-400);
    }
</style>