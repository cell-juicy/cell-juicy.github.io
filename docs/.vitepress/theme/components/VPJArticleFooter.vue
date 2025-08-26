<script setup>
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import { isDesktop } from '../utils/deviceTypes';

import { useVPJLayout } from '../composables/useVPJLayout';

import VPJIconArrowLeft from '../components/icons/VPJIconArrowLeft.vue';
import VPJIconArrowRight from '../components/icons/VPJIconArrowRight.vue';
import VPJIconEdit from '../components/icons/VPJIconEdit.vue';


const props = defineProps({
    prev: {
        type: Object,
        default: () => ({})
    },
    next: {
        type: Object,
        default: () => ({})
    }
})

const store = useVPJLayout();
const {
    articleFooterConfig: config,
    contentConfig: content,
    footerConfig: footer
} = storeToRefs(store);

const computedMarginBottom = computed(() => {
    const marginBottom = content.value.marginBottom || "0";
    if (!(footer.value.message || footer.value.copyright)) {
        return `min(${marginBottom}, 4.5rem)`
    };
    return ".5rem"
})
</script>


<template>
    <div
        v-if="config.editLink.link || prev.link || next.link || config.timeLabel"
        class="vpj-article-footer"
    >
        <nav
            v-if="next.link || prev.link"
            class="vpj-article-footer__navgation"
        >
            <a
                v-if="prev.link"
                :href="prev.link"
                class="vpj-article-footer__navgation-prev"
            >
                <VPJIconArrowLeft class="vpj-article-footer__navgation-icon"/>
                <div class="vpj-article-footer__navgation-info">
                    <div class="vpj-article-footer__navgation-label vpj-text">{{ config.prevLabel }}</div>
                    <div class="vpj-article-footer__navgation-text vpj-text">{{ prev.text }}</div>
                </div>
            </a>
            <a
                v-if="next.link"
                :href="next.link"
                class="vpj-article-footer__navgation-next"
            >
                <div class="vpj-article-footer__navgation-info">
                    <div class="vpj-article-footer__navgation-label vpj-text">{{ config.nextLabel }}</div>
                    <div class="vpj-article-footer__navgation-text vpj-text">{{ next.text }}</div>
                </div>
                <VPJIconArrowRight class="vpj-article-footer__navgation-icon"/>
            </a>
        </nav>
        <div class="vpj-article-footer__info">
            <a
                v-if="config.editLink.link"
                :href="config.editLink.link"
                :title="config.editLink.text"
                class="vpj-article-footer__edit-link"
                target="_blank"
                rel="noopener noreferrer"
            >
                <VPJIconEdit class="vpj-article-footer__edit-link-icon"/>
                <span
                    v-if="config.editLink.text.length > 0"
                    class="vpj-article-footer__edit-link-text vpj-text"
                >
                    {{ config.editLink.text }}
                </span>
            </a>
            <span
                v-if="config.timeLabel && isDesktop"
                class="vpj-article-footer__time-label vpj-text"
            >
                {{ config.timeLabel }}
            </span>
        </div>
    </div>
</template>


<style scoped>
    .vpj-article-footer {
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        gap: 1.25rem;
        margin-bottom: v-bind(computedMarginBottom);
    }

    .vpj-article-footer__navgation {
        align-items: center;
        display: flex;
        flex-direction: row;
        flex-shrink: 0;
        gap: 1rem;
        width: 100%;
    }

    /* Navigation Link */
    .vpj-article-footer__navgation-prev,
    .vpj-article-footer__navgation-next {
        align-items: center;
        border: var(--vpj-border-width-100) solid var(--vpj-color-border-300);
        border-radius: var(--vpj-border-radius-100);
        display: flex;
        flex: 1;
        gap: 1rem;
        height: 4.5rem;
        padding: 1rem;
        text-decoration: none;
        transition:
            border-color 0.2s ease-in-out,
            box-shadow 0.2s ease-in-out,
            transform 0.2s ease-in-out;
    }

    .vpj-article-footer__navgation-prev:hover,
    .vpj-article-footer__navgation-next:hover {
        transform: translateY(-4%);
        box-shadow: var(--vpj-shadow-200);
    }

    .vpj-article-footer__navgation-prev:active,
    .vpj-article-footer__navgation-next:active {
        border-color: var(--vpj-color-primary-400);
    }

    /* Navigation Icon */
    .vpj-article-footer__navgation-icon {
        fill: var(--vpj-color-text-200);
        height: 1.25rem;
        width: 1.25rem;
    }

    /* Navigation Info */
    .vpj-article-footer__navgation-info {
        display: flex;
        flex: 1;
        flex-direction: column;
    }

    .vpj-article-footer__navgation-label {
        color: var(--vpj-color-text-300);
        font-size: .75rem;
        line-height: 1.25rem;
    }

    .vpj-article-footer__navgation-text {
        color: var(--vpj-color-text-400);
        font-size: 1rem;
        line-height: 1.25rem;
        transition: color 0.2s ease-in-out;
    }

    .vpj-article-footer__navgation-prev:hover .vpj-article-footer__navgation-text,
    .vpj-article-footer__navgation-next:hover .vpj-article-footer__navgation-text {
        color: var(--vpj-color-primary-400);
    }

    /* Prev */
    .vpj-article-footer__navgation-prev .vpj-article-footer__navgation-label,
    .vpj-article-footer__navgation-prev .vpj-article-footer__navgation-text {
        text-align: right;
    }

    .vpj-article-footer__info {
        align-items: center;
        display: flex;
        justify-content: space-between;
        width: 100%;
    }

    /* Edit Link */
    .vpj-article-footer__edit-link {
        align-items: center;
        display: flex;
        gap: .5rem;
        height: 1rem;
        margin-right: auto;
        text-decoration: none;
    }

    .vpj-article-footer__edit-link-icon {
        fill: var(--vpj-color-primary-400);
        flex-shrink: 0;
        height: 1rem;
        width: 1rem;
    }

    .vpj-article-footer__edit-link:hover .vpj-article-footer__edit-link-icon,
    .vpj-article-footer__edit-link:active .vpj-article-footer__edit-link-icon {
        fill: var(--vpj-color-primary-300);
    }

    .vpj-article-footer__edit-link-text {
        color: var(--vpj-color-primary-400);
    }

    .vpj-article-footer__edit-link:hover .vpj-article-footer__edit-link-text,
    .vpj-article-footer__edit-link:active .vpj-article-footer__edit-link-text {
        color: var(--vpj-color-primary-300);
    }

    /* Time Label */
    .vpj-article-footer__time-label {
        color: var(--vpj-color-text-200);
        height: 1rem;
        line-height: 1rem;
        margin-left: auto;
        text-align: right;
    }

    /* StyleSheet for mobile&tablet screen */
    @media screen and (max-width: 1024px) {
        .vpj-article-footer__navgation {
            flex-direction: column;
        }

        .vpj-article-footer__navgation-prev,
        .vpj-article-footer__navgation-next {
            width: 100%;
        }
    }
</style>