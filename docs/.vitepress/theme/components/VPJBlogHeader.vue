<script setup>
import { useData } from 'vitepress';
import { computed } from 'vue';

import VPJDynamicIconBtn from './VPJDynamicIconBtn.vue';

import VPJIconGithub from './icons/VPJIconGithub.vue';
import VPJIconMarkdown from './icons/VPJIconMarkdown.vue';
import VPJIconMenuBurger from './icons/VPJIconMenuBurger.vue';
import VPJIconPDF from './icons/VPJIconPDF.vue';

import { isMobile, isTablet, isDesktop } from '../utils/deviceTypes'


const { frontmatter } = useData();
</script>


<template>
    <header class="vpj-layout-blog__header">
        <div class="vpj-layout-blog__header-info">
            <VPJDynamicIconBtn
                v-if="isMobile"
                :icon="VPJIconMenuBurger"
                class="vpj-layout-blog__header-button"
            />
            <div
                class="vpj-layout-blog__header-series"
                :style="{
                    paddingLeft: isMobile ? '.75rem' : undefined
                }"
            >
                <img v-if="frontmatter.series"
                    src="/assets/daily.jpg"
                    class="vpj-layout-blog__header-series-icon"
                >
                <span v-if="frontmatter.series" class="vpj-layout-blog__header-series-name">
                    {{ frontmatter.series }}
                </span>
            </div>
            <div class="vpj-layout-blog__header-toolbar">
                <VPJDynamicIconBtn
                    :isLink="true"
                    :icon="VPJIconGithub"
                    class="vpj-layout-blog__header-button"
                />
                <VPJDynamicIconBtn
                    :isLink="true"
                    :icon="VPJIconMarkdown"
                    class="vpj-layout-blog__header-button"
                />
                <VPJDynamicIconBtn
                    :isLink="true"
                    :icon="VPJIconPDF"
                    class="vpj-layout-blog__header-button"
                />
            </div>
        </div>
        <div class="vpj-layout-blog__header-actions">
            <div class="vpj-layout-blog__header-toolbar">
                <VPJDynamicIconBtn
                    :isLink="true"
                    :icon="VPJIconGithub"
                    class="vpj-layout-blog__header-button"
                />
                <VPJDynamicIconBtn
                    :isLink="true"
                    :icon="VPJIconMarkdown"
                    class="vpj-layout-blog__header-button"
                />
                <VPJDynamicIconBtn
                    :isLink="true"
                    :icon="VPJIconPDF"
                    class="vpj-layout-blog__header-button"
                />
            </div>
        </div>
    </header>
</template>


<style scoped>
    /* Main Layout */
    .vpj-layout-blog__header {
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        width: 100%;
    }

    .vpj-layout-blog__header-info {
        align-items: center;
        background-color: var(--vpj-color-bg-100);
        border-bottom-width: var(--vpj-border-width-200);
        display: flex;
        flex-shrink: 0;
        height: 60px;
        padding-left: 1.25rem;
        padding-right: 1.25rem;
        width: 100%;
    }

    .vpj-layout-blog__header-actions {
        align-items: center;
        background-color: var(--vpj-color-bg-100);
        border-bottom-width: var(--vpj-border-width-200);
        display: none;
        flex-shrink: 0;
        height: 48px;
        padding-left: 1.25rem;
        padding-right: 1.25rem;
        width: 100%;
    }

    /* Button */
    .vpj-layout-blog__header-button {
        align-items: center;
        background-color: var(--vpj-color-bg-100);
        border-radius: var(--vpj-border-radius-100);
        height: 32px;
        padding-left: 8px;
        padding-right: 8px;
        text-decoration: none;
    }

    .vpj-layout-blog__header-button :deep(.vpj-icon) {
        fill: var(--vpj-color-text-300);
        height: 16px;
        width: 16px;
    }

    .vpj-layout-blog__header-button:hover,
    .vpj-layout-blog__header-button:active {
        background-color: var(--vpj-color-bg-300);
    }

    .vpj-layout-blog__header-button:hover :deep(.vpj-icon),
    .vpj-layout-blog__header-button:active :deep(.vpj-icon) {
        fill: var(--vpj-color-text-400);
    }

    /* Series */
    .vpj-layout-blog__header-series {
        align-items: center;
        display: flex;
        flex-shrink: 0;
        gap: .75rem;
        height: 100%;
        padding-right: .75rem;
    }

    .vpj-layout-blog__header-series-icon {
        border-radius: var(--vpj-border-radius-100);
        height: 28px;
        width: 28px;
    }

    .vpj-layout-blog__header-series-name {
        color: var(--vpj-color-text-500);
        font-size: 24px;
        font-weight: bold;
        line-height: 1;
    }

    /* Toolbar */
    .vpj-layout-blog__header-toolbar {
        align-items: center;
        display: flex;
        flex-shrink: 0;
        gap: .25rem;
        height: 100%;
    }

    .vpj-layout-blog__header-info .vpj-layout-blog__header-toolbar {
        justify-self: flex-end;
        margin-left: auto;
    }

    /* Tablet and Mobile style sheet */
    @media screen and (max-width: 1024px) {
        /* Main */
        .vpj-layout-blog__header-actions {
            display: flex;
        }

        /* Series */
        .vpj-layout-blog__header-series {
            gap: .5rem;
        }

        .vpj-layout-blog__header-info .vpj-layout-blog__header-toolbar {
            display: none;
        }
    }
    
    /* Mobile style sheet */
    @media screen and (max-width: 768px) {
        .vpj-layout-blog__header-series-icon {
            height: 24px;
            width: 24px;
        }

        .vpj-layout-blog__header-series-name {
            font-size: 20px;
        }
    }
</style>