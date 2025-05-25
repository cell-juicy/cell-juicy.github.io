<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';

import { isMobile, isTablet, isDesktop } from '../utils/deviceTypes';

import VPJBlogAsideSeriesPage from './VPJBlogAsideSeriesPage.vue';
import VPJBlogAsideTagsPage from './VPJBlogAsideTagsPage.vue';
import VPJDynamicIconBtn from './VPJDynamicIconBtn.vue';

import VPJIconCrossSmall from './icons/VPJIconCrossSmall.vue';


const props = defineProps({
    config: {
        type: Object,
        default: {
            tabs: {}
        }
    },

    state: {
        type: Object,
        default: {
            collasped: true,
            close() {},
            open() {},
            toggle() {}
        }
    }
});


const tabsData = computed(() => {
    if (typeof props.config.tabs === 'object' && props.config.tabs !== null) {
        return Object.entries(props.config.tabs).map(([key, value]) => {
            return {
                key,
                order: value.order,
                component: value.component,
                name: value.name
            }
        }).sort((a, b) => {
            return a.order - b.order
        });
    };
    return [];
});
const activeTabKey = ref("");
const activeTabComponent = computed(() => {
    if (Array.isArray(tabsData.value)) {
        const tab = tabsData.value.find((data) => data.key === activeTabKey.value);
        if (tab) {
            if (tab.component === "VPJBlogAsideTagsPage") return VPJBlogAsideTagsPage;
            if (tab.component === "VPJBlogAsideSeriesPage") return VPJBlogAsideSeriesPage;
            return tab.component;
        };
    };
    return "";
});


const stopWatch = watch(tabsData, (newVal) => {
    if (newVal.length > 0) {
        activeTabKey.value = newVal[0].key;
    }
}, { immediate: true });

onUnmounted(() => {
    stopWatch();
});
</script>


<template>
    <Teleport
        to=".vpj-portals-root"
        :disabled="!isMobile"
    >
        <aside
            :class="['vpj-article-aside', {'collapsed': props.state.collapsed}]"
        >
            <header class="vpj-article-aside__header">
                <div class="vpj-article-aside__tabboxmask">
                    <div class="vpj-article-aside__tabbox vpj-scroll-x">
                        <div class="vpj-article-aside__tablist">
                            <button
                                v-for="data in tabsData"
                                :key="data.key"
                                @click="activeTabKey = data.key"
                                :class="['vpj-article-aside__tab', { 'current': activeTabKey === data.key }]"
                            >
                                {{ data.name }}
                            </button>
                        </div>
                    </div>
                </div>
                <VPJDynamicIconBtn
                    @click="props.state.close"
                    :icon="VPJIconCrossSmall"
                    class="vpj-article-aside__close"
                />
            </header>
            <div class="vpj-article-aside__content">
                <component v-if="activeTabComponent" :is="activeTabComponent"/>
            </div>
        </aside>
        <div
            v-if="!isDesktop && !props.state.collapsed"
            @click="props.state.close"
            class="vpj-article-aside__overlay"
        />
    </Teleport>
</template>


<style scoped>
    /* Main Layout */
    .vpj-article-aside {
        background-color: var(--vpj-color-bg-100);
        border-right-width: var(--vpj-border-width-200);
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        height: 100%;
        overflow: hidden;
        transition: width 0.2s ease-in-out;
        width: 300px;
    }

    .vpj-article-aside.collapsed {
        width: 0;
    }

    .vpj-article-aside__header {
        align-items: center;
        border-bottom-width: var(--vpj-border-width-200);
        display: flex;
        flex-shrink: 0;
        height: 40px;
        width: 100%;
    }

    .vpj-article-aside__content {
        flex: 1;
        width: 100%;
    }

    /* Tabs */
    .vpj-article-aside__tabboxmask {
        display: flex;
        flex: 1;
        height: 100%;
        mask-image: linear-gradient(
            to right,
            transparent,
            black .3rem,
            black calc(100% - .3rem),
            transparent
        );
    }

    .vpj-article-aside__tabbox {
        height: 100%;
        width: 100%;
        overflow-y: hidden;
        visibility: hidden;
    }

    .vpj-article-aside__tablist,
    .vpj-article-aside__tabbox:hover,
    .vpj-article-aside__tabbox:focus {
        visibility: visible;
    }

    .vpj-article-aside__tablist {
        align-items: center;
        display: flex;
        flex: 1;
        flex-wrap: nowrap;
        gap: .5rem;
        height: 100%;
        padding-left: 12px;
        padding-right: 12px;
    }

    .vpj-article-aside__tab {
        align-items: center;
        background-color: transparent;
        border-radius: var(--vpj-border-radius-100);
        color: var(--vpj-color-text-300);
        display: flex;
        flex: 0 0 auto;
        font-size: .875rem;
        height: 24px;
        overflow: hidden;
        padding: 2px .5rem;
        text-wrap: nowrap;
        width: max-content;
    }

    .vpj-article-aside__tab:hover {
        background-color: var(--vpj-color-bg-400);
        color: var(--vpj-color-text-400);
    }

    .vpj-article-aside__tab.current,
    .vpj-article-aside__tab:active {
        background-color: var(--vpj-color-bg-400);
        border-width: var(--vpj-border-width-100);
        color: var(--vpj-color-text-500);
    }

    /* Close Button */
    .vpj-article-aside__close {
        align-items: center;
        background-color: var(--vpj-color-bg-100);
        border-radius: var(--vpj-border-radius-100);
        display: none;
        height: 32px;
        padding-left: 8px;
        padding-right: 8px;
        margin-left: 5px;
        margin-right: 5px;
        text-decoration: none;
    }

    .vpj-article-aside__close :deep(.vpj-icon) {
        fill: var(--vpj-color-text-300);
        height: 16px;
        width: 16px;
    }

    .vpj-article-aside__close:hover,
    .vpj-article-aside__close:active {
        background-color: var(--vpj-color-bg-300);
    }

    .vpj-article-aside__close:hover :deep(.vpj-icon),
    .vpj-article-aside__close:active :deep(.vpj-icon) {
        fill: var(--vpj-color-text-400);
    }

    .vpj-article-aside__overlay {
        display: block;
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
        z-index: 100;
    }

    /* Tablet style sheet */
    @media (max-width: 1024px) {
        .vpj-article-aside {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            z-index: 101;
        }

        .vpj-article-aside__overlay {
            position: absolute;
            background-color: var(--vpj-overlay-600);
        }
    }

    /* Mobile style sheet */
    @media (max-width: 768px) {
        .vpj-article-aside {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            height: 100vh;
            transition: transform 0.15s ease-in-out;
            z-index: 101;
        }

        /* Collapsed */
        .vpj-article-aside.collapsed {
            transform: translateX(-100%);
        }

        /* Overlay */
        .vpj-article-aside__overlay {
            position: fixed;
            background-color: var(--vpj-overlay-400);
        }

        .vpj-article-aside__close {
            display: flex;
        }
    }
</style>