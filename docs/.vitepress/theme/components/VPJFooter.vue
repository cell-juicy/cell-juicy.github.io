<script setup>
import { storeToRefs } from 'pinia';

import { useVPJLayout } from '../composables/useVPJLayout';


const store = useVPJLayout();
const {
    footerConfig: config
} = storeToRefs(store);
</script>


<template>
    <footer v-if="config.message || config.copyright" class="vpj-footer">
        <div class="vpj-footer__container">
            <p v-if="config.message && config.message.length > 0" class="vpj-footer__message" v-html="config.message"/>
            <p v-if="config.copyright && config.copyright.length > 0" class="vpj-footer__copyright" v-html="config.copyright"/>
        </div>
    </footer>
</template>


<style scoped>
    .vpj-footer {
        backdrop-filter: var(--vpj-footer-backdrop-filter);
        background: var(--vpj-footer-bg);
        border-top: var(--vpj-footer-border);
        flex-shrink: 0;
        padding: var(--vpj-footer-padding);
        width: 100%;
    }

    .vpj-footer__container {
        align-items: center;
        color: var(--vpj-footer-text-color);
        display: flex;
        flex-direction: column;
        font-size: var(--vpj-footer-text-size);
        font-weight: var(--vpj-footer-text-weight);
        gap: var(--vpj-footer-container-gap);
        line-height: var(--vpj-footer-text-line-height);
        margin: 0 auto;
        max-width: var(--vpj-footer-container-max-width);
    }

    .vpj-footer__message,
    .vpj-footer__copyright {
        margin: 0;
    }

    .vpj-footer__message :deep(a),
    .vpj-footer__copyright :deep(a) {
        text-decoration: underline;
        text-underline-offset: 2px;
        color: var(--vpj-footer-link-color);
        transition: color var(--vpj-footer-transition);
    }

    .vpj-footer__message :deep(a:hover), .vpj-footer__message :deep(a:active),
    .vpj-footer__copyright :deep(a:hover), .vpj-footer__copyright :deep(a:active) {
        color: var(--vpj-footer-link-color-hover);
    }

    @media (min-width: 768px) {
        .vpj-footer {
            padding: var(--vpj-footer-padding);
        }
    }
</style>