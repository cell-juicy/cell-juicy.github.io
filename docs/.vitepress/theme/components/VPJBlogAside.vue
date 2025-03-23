<script setup>
import { ref } from 'vue';

import VPJBlogAsideSeriesPage from './VPJBlogAsideSeriesPage.vue';
import VPJBlogAsideTagsPage from './VPJBlogAsideTagsPage.vue';
import VPJDynamicIconBtn from './VPJDynamicIconBtn.vue';

import VPJIconCrossSmall from './icons/VPJIconCrossSmall.vue';

const tabs = {
    tags: { name: '标签', component: VPJBlogAsideTagsPage},
    series: { name: '系列', component: VPJBlogAsideSeriesPage}
}
const activeTab = ref('tags');
</script>


<template>
    <aside class="vpj-layout-blog__aside">
        <header class="vpj-layout-blog__aside-header">
            <div class="vpj-layout-blog__aside-tabs vpj-scroll-x">
                <button
                    v-for="(tab, key) in tabs"
                    :key="key"
                    @click="activeTab = key"
                    :class="['vpj-layout-blog__aside-tab', { 'current': activeTab === key }]"
                >
                    {{ tab.name }}
                </button>
            </div>
            <VPJDynamicIconBtn
                :icon="VPJIconCrossSmall"
                class="vpj-layout-blog__aside-close"
            />
        </header>
        <div class="vpj-layout-blog__aside-content">
            <component :is="tabs[activeTab].component || tabs.tags.component"/>
        </div>
    </aside>
</template>


<style scoped>
    /* Main Layout */
    .vpj-layout-blog__aside {
        background-color: var(--vpj-color-bg-100);
        border-right-width: var(--vpj-border-width-200);
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        width: 300px;
    }

    .vpj-layout-blog__aside-header {
        align-items: center;
        border-bottom-width: var(--vpj-border-width-200);
        display: flex;
        flex-shrink: 0;
        height: 40px;
        width: 100%;
    }

    .vpj-layout-blog__aside-content {
        flex: 1;
        width: 100%;
    }

    /* Tabs */
    .vpj-layout-blog__aside-tabs {
        align-items: center;
        display: flex;
        flex: 1;
        flex-wrap: nowrap;
        gap: .5rem;
        height: 100%;
        mask-image: linear-gradient(
            to right,
            transparent,
            black 8px,
            black calc(100% - 8px),
            transparent
        );
        padding-left: 12px;
        padding-right: 12px;
    }

    .vpj-layout-blog__aside-tab {
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

    .vpj-layout-blog__aside-tab:hover {
        background-color: var(--vpj-color-bg-400);
        color: var(--vpj-color-text-400);
    }

    .vpj-layout-blog__aside-tab.current,
    .vpj-layout-blog__aside-tab:active {
        background-color: var(--vpj-color-bg-400);
        border-width: var(--vpj-border-width-100);
        color: var(--vpj-color-text-500);
    }

    /* Close Button */
    .vpj-layout-blog__aside-close {
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

    .vpj-layout-blog__aside-close :deep(.vpj-icon) {
        fill: var(--vpj-color-text-300);
        height: 16px;
        width: 16px;
    }

    .vpj-layout-blog__aside-close:hover,
    .vpj-layout-blog__aside-close:active {
        background-color: var(--vpj-color-bg-300);
    }

    .vpj-layout-blog__aside-close:hover :deep(.vpj-icon),
    .vpj-layout-blog__aside-close:active :deep(.vpj-icon) {
        fill: var(--vpj-color-text-400);
    }

    /* Mobile style sheet */
    @media (max-width: 768px) {
        .vpj-layout-blog__aside-close {
            display: flex;
        }
    }
</style>