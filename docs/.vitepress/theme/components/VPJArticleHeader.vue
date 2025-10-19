<script setup>
import { useTemplateRef } from 'vue';
import { storeToRefs } from 'pinia';

import { useVPJLayout } from '../composables/useVPJLayout';

import VPJDynamicIcon from './VPJDynamicIcon.vue';
import VPJDynamicIconBtn from './VPJDynamicIconBtn.vue';
import VPJArticleHeaderToolbar from './VPJArticleHeaderToolbar.vue';

import VPJIconMenuBurger from './icons/VPJIconMenuBurger.vue';

import { isDesktop } from '../utils/deviceTypes';


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
            <div class="vpj-article-header__brand">
                <VPJDynamicIcon
                    v-if="headerConfig.headerIcon"
                    :icon="headerConfig.headerIcon"
                    class="vpj-article-header__brand-icon"
                />
                <span v-if="headerConfig.headerTitle" class="vpj-article-header__brand-title vpj-text">
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
        background: var(--vpj-article-header-bg);
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        width: 100%;
    }

    .vpj-article-header__info {
        align-items: center;
        border-bottom: var(--vpj-article-header-border);
        display: flex;
        flex-shrink: 0;
        height: var(--vpj-article-header-info-height);
        overflow: hidden;
        padding-inline: var(--vpj-article-header-info-padding-x);
        width: 100%;
    }

    .vpj-article-header__actions {
        align-items: center;
        border-bottom: var(--vpj-article-header-border);
        display: flex;
        flex-shrink: 0;
        height: var(--vpj-article-header-actions-height);
        overflow: hidden;
        padding-inline: var(--vpj-article-header-actions-padding-x);
        width: 100%;
    }

    /* Series */
    .vpj-article-header__brand {
        align-items: center;
        display: flex;
        flex-shrink: 0;
        gap: var(--vpj-article-header-brand-gap);
        height: 100%;
        padding-inline: var(--vpj-article-header-brand-padding-x);
    }

    .vpj-article-header__brand-icon {
        border-radius: var(--vpj-article-header-brand-icon-radius);
        height: var(--vpj-article-header-brand-icon-size);
        width: var(--vpj-article-header-brand-icon-size);
        object-fit: cover;
        object-position: center;
    }

    .vpj-article-header__brand-title {
        color: var(--vpj-article-header-brand-title-color);
        font-size: var(--vpj-article-header-brand-title-size);
        font-weight: var(--vpj-article-header-brand-title-weight);
        line-height: 1;
    }

    /* Time Label */
    .vpj-article-header__time-label {
        color: var(--vpj-article-header-time-label-color);
        font-size: var(--vpj-article-header-time-label-size);
        font-weight: var(--vpj-article-header-time-label-weight);
        margin-left: var(--vpj-article-header-time-label-margin-left);
        text-align: right;
    }

    /* Tablet and Mobile style sheet */
    @media screen and (max-width: 1024px) {
        /* Series */
        .vpj-article-header__brand {
            gap: var(--vpj-article-header-brand-gap-tablet);
            padding-inline: var(--vpj-article-header-brand-padding-x-tablet);
        }
    }
    
    /* Mobile style sheet */
    @media screen and (max-width: 768px) {
        .vpj-article-header__brand-icon {
            height: var(--vpj-article-header-brand-icon-size-mobile);
            width: var(--vpj-article-header-brand-icon-size-mobile);
        }

        .vpj-article-header__brand-title {
            font-size: var(--vpj-article-header-brand-title-size-mobile);
        }
    }
</style>

<style>
    /* Button */
    .vpj-article-header__button {
        align-items: center;
        background: var(--vpj-article-header-btn-bg);
        border: var(--vpj-article-header-btn-border);
        border-radius: var(--vpj-article-header-btn-radius);
        height: var(--vpj-article-header-btn-size);
        padding: calc((var(--vpj-article-header-btn-size) - var(--vpj-article-header-btn-icon-size)) / 2);
        text-decoration: none;
    }

    .vpj-article-header__button .vpj-icon {
        fill: var(--vpj-article-header-btn-icon-color);
        height: var(--vpj-article-header-btn-icon-size);
        width: var(--vpj-article-header-btn-icon-size);
    }

    .vpj-article-header__button:hover,
    .vpj-article-header__button:active {
        background: var(--vpj-article-header-btn-bg-hover);
    }

    .vpj-article-header__button:hover .vpj-icon,
    .vpj-article-header__button:active .vpj-icon {
        fill: var(--vpj-article-header-btn-icon-color-hover);
    }
</style>