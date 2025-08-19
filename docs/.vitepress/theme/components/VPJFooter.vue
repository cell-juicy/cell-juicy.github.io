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
        border-top: var(--vpj-border-width-100) solid var(--vpj-color-border-300);
        flex-shrink: 0;
        padding: 2rem;
        width: 100%;
    }

    .vpj-footer__container {
        align-items: center;
        color: var(--vpj-color-text-300);
        display: flex;
        flex-direction: column;
        font-size: .875rem;
        line-height: 1.5rem;
    }

    .vpj-footer__message,
    .vpj-footer__copyright {
        margin: 0;
    }
</style>