<script setup>
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import { isDesktop } from '../utils/deviceTypes';

import { useVPJData } from '../composables/useVPJData';
import { useVPJLayout } from '../composables/useVPJLayout';

import VPJIconArrowLeft from '../components/icons/VPJIconArrowLeft.vue';
import VPJIconArrowRight from '../components/icons/VPJIconArrowRight.vue';
import VPJIconEdit from '../components/icons/VPJIconEdit.vue';


const { next, prev } = useVPJData();
const store = useVPJLayout();
const {
    articleMetaConfig,
    contentConfig,
    footerConfig
} = storeToRefs(store);

const computedMarginBottom = computed(() => {
    const marginBottom = contentConfig.value.marginBottom || "0";
    if (!(footerConfig.value.message || footerConfig.value.copyright)) {
        return `min(${marginBottom}, calc(4rem + var(--vpj-article-footer-margin-bottom)))`;
    };
    return "var(--vpj-article-footer-margin-bottom)";
});
</script>


<template>
    <div
        v-if="articleMetaConfig.editLink.link || prev.link || next.link || articleMetaConfig.timeLabel"
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
                    <div class="vpj-article-footer__navgation-label vpj-text">{{ articleMetaConfig.prevLabel }}</div>
                    <div class="vpj-article-footer__navgation-text vpj-text">{{ prev.text }}</div>
                </div>
            </a>
            <a
                v-if="next.link"
                :href="next.link"
                class="vpj-article-footer__navgation-next"
            >
                <div class="vpj-article-footer__navgation-info">
                    <div class="vpj-article-footer__navgation-label vpj-text">{{ articleMetaConfig.nextLabel }}</div>
                    <div class="vpj-article-footer__navgation-text vpj-text">{{ next.text }}</div>
                </div>
                <VPJIconArrowRight class="vpj-article-footer__navgation-icon"/>
            </a>
        </nav>
        <div class="vpj-article-footer__info">
            <a
                v-if="articleMetaConfig.editLink.link"
                :href="articleMetaConfig.editLink.link"
                :title="articleMetaConfig.editLink.text"
                class="vpj-article-footer__edit-link"
                target="_blank"
                rel="noopener noreferrer"
            >
                <VPJIconEdit class="vpj-article-footer__edit-link-icon"/>
                <span
                    v-if="articleMetaConfig.editLink.text.length > 0"
                    class="vpj-article-footer__edit-link-text vpj-text"
                >
                    {{ articleMetaConfig.editLink.text }}
                </span>
            </a>
            <span
                v-if="articleMetaConfig.timeLabel && isDesktop"
                class="vpj-article-footer__time-label vpj-text"
            >
                {{ articleMetaConfig.timeLabel }}
            </span>
        </div>
    </div>
</template>


<style scoped>
    .vpj-article-footer {
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        gap: var(--vpj-article-footer-gap);
        margin-bottom: v-bind(computedMarginBottom);
    }

    .vpj-article-footer__navgation {
        align-items: center;
        display: flex;
        flex-direction: row;
        flex-shrink: 0;
        gap: var(--vpj-article-footer-nav-gap);
        width: 100%;
    }

    /* Navigation Link */
    .vpj-article-footer__navgation-prev,
    .vpj-article-footer__navgation-next {
        align-items: center;
        background: var(--vpj-article-footer-nav-bg);
        border: var(--vpj-article-footer-nav-border);
        border-radius: var(--vpj-article-footer-nav-radius);
        display: flex;
        flex: 1;
        gap: var(--vpj-article-footer-nav-internal-gap);
        height: var(--vpj-article-footer-nav-height);
        padding-inline: var(--vpj-article-footer-nav-padding-x);
        text-decoration: none;
        transition:
            border-color var(--vpj-article-footer-transition),
            box-shadow var(--vpj-article-footer-transition),
            transform var(--vpj-article-footer-transition);
    }

    .vpj-article-footer__navgation-prev:hover,
    .vpj-article-footer__navgation-next:hover {
        background: var(--vpj-article-footer-nav-bg-hover);
        transform: var(--vpj-article-footer-nav-transform-hover);
        box-shadow: var(--vpj-article-footer-nav-shadow-hover);
    }

    .vpj-article-footer__navgation-prev:active,
    .vpj-article-footer__navgation-next:active {
        background: var(--vpj-article-footer-nav-bg-hover);
        border: var(--vpj-article-footer-nav-border-active);
    }

    /* Navigation Icon */
    .vpj-article-footer__navgation-icon {
        fill: var(--vpj-article-footer-nav-icon-color);
        height: var(--vpj-article-footer-nav-icon-size);
        width: var(--vpj-article-footer-nav-icon-size);
    }

    /* Navigation Info */
    .vpj-article-footer__navgation-info {
        display: flex;
        flex: 1;
        flex-direction: column;
    }

    .vpj-article-footer__navgation-label {
        color: var(--vpj-article-footer-nav-label-color);
        font-size: var(--vpj-article-footer-nav-label-size);
        font-weight: var(--vpj-article-footer-nav-label-weight);
        line-height: var(--vpj-article-footer-nav-label-line-height);
    }

    .vpj-article-footer__navgation-text {
        color: var(--vpj-article-footer-nav-text-color);
        font-size: var(--vpj-article-footer-nav-text-size);
        font-weight: var(--vpj-article-footer-nav-text-weight);
        line-height: var(--vpj-article-footer-nav-text-line-height);
        transition: color var(--vpj-article-footer-transition);
    }

    .vpj-article-footer__navgation-prev:hover .vpj-article-footer__navgation-text,
    .vpj-article-footer__navgation-next:hover .vpj-article-footer__navgation-text {
        color: var(--vpj-article-footer-nav-text-color-hover);
    }

    /* Next */
    .vpj-article-footer__navgation-next .vpj-article-footer__navgation-label,
    .vpj-article-footer__navgation-next .vpj-article-footer__navgation-text {
        text-align: left;
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
        gap: var(--vpj-article-footer-edit-link-gap);
        margin-right: auto;
        text-decoration: none;
    }

    .vpj-article-footer__edit-link-icon {
        fill: var(--vpj-article-footer-edit-link-color);
        flex-shrink: 0;
        height: var(--vpj-article-footer-edit-link-icon-size);
        width: var(--vpj-article-footer-edit-link-icon-size);
    }

    .vpj-article-footer__edit-link:hover .vpj-article-footer__edit-link-icon,
    .vpj-article-footer__edit-link:active .vpj-article-footer__edit-link-icon {
        fill: var(--vpj-article-footer-edit-link-color-hover);
    }

    .vpj-article-footer__edit-link-text {
        color: var(--vpj-article-footer-edit-link-color);
        font-size: var(--vpj-article-footer-edit-link-text-size);
        font-weight: var(--vpj-article-footer-edit-link-text-weight);
    }

    .vpj-article-footer__edit-link:hover .vpj-article-footer__edit-link-text,
    .vpj-article-footer__edit-link:active .vpj-article-footer__edit-link-text {
        color: var(--vpj-article-footer-edit-link-color-hover);
    }

    /* Time Label */
    .vpj-article-footer__time-label {
        color: var(--vpj-article-footer-time-color);
        font-size: var(--vpj-article-footer-time-size);
        font-weight: var(--vpj-article-footer-time-weight);
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
            flex: none;
        }
    }
</style>