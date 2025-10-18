<script setup>
import { storeToRefs } from 'pinia';
import { useHead } from '@unhead/vue';

import { useVPJLayout } from '../composables/useVPJLayout';

import VPJDynamicIcon from '../components/VPJDynamicIcon.vue';
import VPJIconCrossCircle from '../components/icons/VPJIconCrossCircle.vue';


const store = useVPJLayout();
const {
    headConfig,
    notFoundContent
} = storeToRefs(store);

useHead(headConfig);
</script>


<template>
    <div class="vpj-layout-notfound">
        <div class="vpj-layout-notfound__content">
            <VPJDynamicIcon
                :icon="notFoundContent.statusIcon === 'VPJIconCrossCircle'
                    ? VPJIconCrossCircle
                    : notFoundContent.statusIcon"
                class="vpj-layout-notfound__content-icon"
            />
            <div
                v-if="notFoundContent.heading"
                class="vpj-layout-notfound__content-title"
            >
                {{ notFoundContent.heading }}
            </div>
            <div
                v-if="notFoundContent.message"
                class="vpj-layout-notfound__content-text"
            >
                {{ notFoundContent.message }}
            </div>
            <a
                v-if="typeof notFoundContent.guidance.link === 'string'"
                class="vpj-layout-notfound__content-link"
                :href="notFoundContent.guidance.link"
            >
                <span class="vpj-text">
                    {{ notFoundContent.guidance.text || "" }}
                </span>
            </a>
        </div>
    </div>
</template>


<style scoped>
    /* Main layout */
    .vpj-layout-notfound {
        align-items: center;
        background: var(--vpj-layout-notfound-bg);
        display: flex;
        flex: 1;
        height: 100%;
        width: 100%;
        max-height: 100%;
        max-width: 100%;
        min-height: 0;
        min-width: 0;
    }

    .vpj-layout-notfound__content {
        align-items: center;
        border: 0;
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: var(--vpj-layout-notfound-content-gap);
        height: 100%;
        justify-content: center;
        margin-left: auto;
        margin-right: auto;
        min-height: 0;
        min-width: 0;
        max-width: var(--vpj-layout-notfound-content-max-width);
        padding: var(--vpj-layout-notfound-content-padding);
        text-align: center;
    }

    /* Icon */
    .vpj-layout-notfound__content-icon {
        fill: var(--vpj-layout-notfound-icon-color);
        height: var(--vpj-layout-notfound-icon-size);
        margin-bottom: var(--vpj-layout-notfound-icon-margin-bottom);
        width: var(--vpj-layout-notfound-icon-size);
    }

    /* Title */
    .vpj-layout-notfound__content-title {
        color: var(--vpj-layout-notfound-title-color);
        font-size: var(--vpj-layout-notfound-title-size);
        font-weight: var(--vpj-layout-notfound-title-weight);
        letter-spacing: 0;
        line-height: var(--vpj-layout-notfound-title-line-height);
        user-select: none;
    }

    /* Text */
    .vpj-layout-notfound__content-text {
        color: var(--vpj-layout-notfound-text-color);
        font-size: var(--vpj-layout-notfound-text-size);
        font-weight: var(--vpj-layout-notfound-text-weight);
        line-height: var(--vpj-layout-notfound-text-line-height);
        margin-bottom: var(--vpj-layout-notfound-text-margin-bottom);
        text-wrap: balance;
        user-select: none;
    }

    /* Link */
    .vpj-layout-notfound__content-link,
    .vpj-layout-notfound__content-link:visited {
        align-items: center;
        background: var(--vpj-layout-notfound-link-bg);
        border: var(--vpj-layout-notfound-link-border);
        border-radius: var(--vpj-layout-notfound-link-radius);
        box-shadow: var(--vpj-layout-notfound-link-shadow);
        color: var(--vpj-layout-notfound-link-color);
        display: flex;
        height: var(--vpj-layout-notfound-link-height);
        justify-content: center;
        padding: var(--vpj-layout-notfound-link-padding);
        text-decoration: none;
        transition:
            background var(--vpj-layout-notfound-transition),
            box-shadow var(--vpj-layout-notfound-transition),
            color var(--vpj-layout-notfound-transition),
            transform var(--vpj-layout-notfound-transition);
    }

    .vpj-layout-notfound__content-link .vpj-text {
        font-size: var(--vpj-layout-notfound-link-size);
        user-select: none;
    }

    .vpj-layout-notfound__content-link:hover {
        background: var(--vpj-layout-notfound-link-bg-hover);
        color: var(--vpj-layout-notfound-link-color-hover);
    }

    .vpj-layout-notfound__content-link:active {
        box-shadow: none;
        transform: var(--vpj-layout-notfound-link-transform-active);
    }
</style>