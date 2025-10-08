<script setup>
import { useTemplateRef } from 'vue';
import { storeToRefs } from 'pinia';

import { useVPJLayout } from '../composables/useVPJLayout';

import VPJDynamicIcon from './VPJDynamicIcon.vue';
import VPJDynamicIconBtn from './VPJDynamicIconBtn.vue';
import VPJArticleHeaderToolbar from './VPJArticleHeaderToolbar.vue';

import VPJIconMenuBurger from './icons/VPJIconMenuBurger.vue';

import { isMobile, isDesktop } from '../utils/deviceTypes';


const store = useVPJLayout();
const { asideToggle } = store;
const {
    articleMetaConfig,
    headerConfig,
} = storeToRefs(store);

const toolbar = useTemplateRef("toolbar");
</script>


<template>
    <header class="vpj-article-header">
        <slot name="header-before"/>
        <div class="vpj-article-header__info">
            <VPJDynamicIconBtn
                v-if="!isDesktop"
                @click="asideToggle"
                :icon="VPJIconMenuBurger"
                class="vpj-article-header__button"
            />
            <div
                class="vpj-article-header__series"
                :style="{
                    paddingLeft: isMobile ? '.75rem' : '.5rem'
                }"
            >
                <VPJDynamicIcon
                    v-if="headerConfig.headerIcon"
                    :icon="headerConfig.headerIcon"
                    class="vpj-article-header__series-icon"
                />
                <span v-if="headerConfig.headerTitle" class="vpj-article-header__series-name">
                    {{ headerConfig.headerTitle }}
                </span>
            </div>
            <VPJArticleHeaderToolbar v-show="isDesktop" ref="toolbar"/>
        </div>
        <slot name="header-between"/>
        <div
            v-show="!isDesktop && (toolbar?.hasToolbar || articleMetaConfig?.timeLabel)"
            class="vpj-article-header__actions"
        >
            <VPJArticleHeaderToolbar/>
            <span
                v-if="articleMetaConfig?.timeLabel"
                class="vpj-article-header__time-label vpj-text"
            >
                {{ articleMetaConfig.timeLabel }}
            </span>
        </div>
        <slot name="header-after"/>
    </header>
</template>


<style scoped>
    /* Main Layout */
    .vpj-article-header {
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        width: 100%;
    }

    .vpj-article-header__info {
        align-items: center;
        background-color: var(--vpj-color-bg-100);
        border-bottom-width: var(--vpj-border-width-200);
        display: flex;
        flex-shrink: 0;
        height: 60px;
        overflow: hidden;
        padding-left: 1.25rem;
        padding-right: 1.25rem;
        width: 100%;
    }

    .vpj-article-header__actions {
        align-items: center;
        background-color: var(--vpj-color-bg-100);
        border-bottom-width: var(--vpj-border-width-200);
        display: flex;
        flex-shrink: 0;
        height: 48px;
        overflow: hidden;
        padding-left: 1.25rem;
        padding-right: 1.25rem;
        width: 100%;
    }

    /* Button */
    .vpj-article-header__button {
        align-items: center;
        background-color: var(--vpj-color-bg-100);
        border-radius: var(--vpj-border-radius-100);
        height: 32px;
        padding-left: 8px;
        padding-right: 8px;
        text-decoration: none;
    }

    .vpj-article-header__button :deep(.vpj-icon) {
        fill: var(--vpj-color-text-300);
        height: 16px;
        width: 16px;
    }

    .vpj-article-header__button:hover,
    .vpj-article-header__button:active {
        background-color: var(--vpj-color-bg-300);
    }

    .vpj-article-header__button:hover :deep(.vpj-icon),
    .vpj-article-header__button:active :deep(.vpj-icon) {
        fill: var(--vpj-color-text-400);
    }

    /* Series */
    .vpj-article-header__series {
        align-items: center;
        display: flex;
        flex-shrink: 0;
        gap: .75rem;
        height: 100%;
        padding-right: .75rem;
    }

    .vpj-article-header__series-icon {
        border-radius: var(--vpj-border-radius-100);
        height: 28px;
        width: 28px;
        object-fit: cover;
        object-position: center;
    }

    .vpj-article-header__series-name {
        color: var(--vpj-color-text-500);
        font-size: 24px;
        font-weight: bold;
        line-height: 1;
    }

    /* Toolbar Divider */
    .vpj-article-header__divider {
        background-color: var(--vpj-color-border-400);
        height: 24px;
        width: 1px;
        margin-left: .25rem;
        margin-right: .25rem;
    }

    /* Time Label */
    .vpj-article-header__time-label {
        color: var(--vpj-color-text-200);
        height: 1rem;
        line-height: 1rem;
        margin-left: 1rem;
        text-align: right;
    }

    /* Tablet and Mobile style sheet */
    @media screen and (max-width: 1024px) {
        /* Series */
        .vpj-article-header__series {
            gap: .5rem;
        }
    }
    
    /* Mobile style sheet */
    @media screen and (max-width: 768px) {
        .vpj-article-header__series-icon {
            height: 24px;
            width: 24px;
        }

        .vpj-article-header__series-name {
            font-size: 20px;
        }
    }
</style>