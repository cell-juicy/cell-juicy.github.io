<script setup>
import { computed } from 'vue';

import VPJDynamicIcon from './VPJDynamicIcon.vue'
import VPJDynamicIconBtn from './VPJDynamicIconBtn.vue';
import VPJTooltipBtn from './VPJTooltipBtn.vue';

import VPJIconGithub from './icons/VPJIconGithub.vue';
import VPJIconMarkdown from './icons/VPJIconMarkdown.vue';
import VPJIconMenuBurger from './icons/VPJIconMenuBurger.vue';
import VPJIconPDF from './icons/VPJIconPDF.vue';

import { isMobile, isTablet, isDesktop } from '../utils/deviceTypes'


const tooltipPosition = "bottom"
const tooltipBoundary = ".vpj-layout-content"
const tooltipOffset = {x: 0, y: 6}
const tooltipSafeMargin = 16
const tooltipAttrs = {
    style: {
        alignItems: "center",
        background: "var(--vpj-color-text-500)",
        borderRadius: "var(--vpj-border-radius-100)",
        color: "var(--vpj-color-bg-100)",
        display: "flex",
        fontSize: ".875rem",
        maxWidth: "240px",
        maxHeight: "200px",
        lineClamp: "4",
        overflow: "hidden",
        paddingTop: ".375rem",
        paddingBottom: ".375rem",
        paddingLeft: ".5rem",
        paddingRight: ".5rem",
        zIndex: "102"
    }
}

const props = defineProps({
    config: {
        type: Object,
        default: {
            headerIcon: undefined,
            headerTitle: '',
            github: {},
            md: {},
            pdf: {},
            toolbar: {}
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

const toolsData = computed(() => {
    if (typeof props.config?.toolbar === 'object' && props.config?.toolbar !== null) {
        return Object.entries(props.config.toolbar).map(([key, value]) => {
            return {
                key,
                order: value.order,
                icon: value.icon,
                callback: value.callback,
                tooltip: value.tooltip
            };
        }).sort((a, b) => {
            return a.order - b.order
        });
    };
    return [];
});

const showActions = computed(() => {
    const hasDefaults = !!props.config?.github?.url 
        || !!props.config?.pdf?.url 
        || !!props.config?.md?.url;
    
    const hasTools = Object.entries(props.config?.toolbar || {}).length > 0;

    return hasDefaults || hasTools;
});
const showDivider = computed(() => {
    const hasDefaults = !!props.config?.github?.url 
        || !!props.config?.pdf?.url 
        || !!props.config?.md?.url;
    
    const hasTools = Object.entries(props.config?.toolbar || {}).length > 0;

    return hasDefaults && hasTools;
});
</script>


<template>
    <header class="vpj-article-header">
        <slot name="header-before"/>
        <div class="vpj-article-header__info">
            <VPJDynamicIconBtn
                v-if="!isDesktop"
                @click="props.state.toggle"
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
                    v-if="props.config?.headerIcon"
                    :icon="props.config?.headerIcon"
                    class="vpj-article-header__series-icon"
                />
                <span v-if="props.config?.headerTitle" class="vpj-article-header__series-name">
                    {{ props.config?.headerTitle }}
                </span>
            </div>
            <ClientOnly>
                <Teleport
                    to=".vpj-article-header__actions"
                    :disabled="isDesktop || !showActions"
                >
                    <div class="vpj-article-header__toolbar">
                        <VPJTooltipBtn
                            v-if="props.config?.github?.url"
                            :boundary="tooltipBoundary"
                            :href="props.config?.github?.url"
                            :isLink="true"
                            :icon="VPJIconGithub"
                            :tooltip="props.config?.github?.tooltip"
                            :tooltipPosition="tooltipPosition"
                            :tooltipAttrs="tooltipAttrs"
                            :offset="tooltipOffset"
                            :safeMargin="tooltipSafeMargin"
                            class="vpj-article-header__button"
                            target="_blank"
                            rel="noopener"
                        />
                        <VPJTooltipBtn
                            v-if="props.config?.pdf?.url"
                            :boundary="tooltipBoundary"
                            :download="
                                (props.config?.pdf?.download === true) ? '' :
                                    (typeof props.config?.pdf?.download === 'string') ?
                                        props.config?.pdf?.download :
                                        undefined
                            "
                            :href="props.config?.pdf?.url"
                            :isLink="true"
                            :icon="VPJIconPDF"
                            :target="props.config?.pdf?.target"
                            :tooltip="props.config?.pdf?.tooltip"
                            :tooltipPosition="tooltipPosition"
                            :tooltipAttrs="tooltipAttrs"
                            :offset="tooltipOffset"
                            :safeMargin="tooltipSafeMargin"
                            class="vpj-article-header__button"
                            rel="noopener"
                        />
                        <VPJTooltipBtn
                            v-if="props.config?.md?.url"
                            :boundary="tooltipBoundary"
                            :download="
                                (props.config?.md?.download === true) ? '' :
                                    (typeof props.config?.md?.download === 'string') ?
                                        props.config?.md?.download :
                                        undefined
                            "
                            :href="props.config?.md?.url"
                            :isLink="true"
                            :icon="VPJIconMarkdown"
                            :target="props.config?.md?.target"
                            :tooltip="props.config?.md?.tooltip"
                            :tooltipPosition="tooltipPosition"
                            :tooltipAttrs="tooltipAttrs"
                            :offset="tooltipOffset"
                            :safeMargin="tooltipSafeMargin"
                            class="vpj-article-header__button"
                            rel="noopener"
                        />
                        <div v-if="showDivider" class="vpj-article-header__divider"/>
                        <VPJTooltipBtn
                            v-for="tool in toolsData"
                            :key="tool.key"
                            :boundary="tooltipBoundary"
                            :icon="tool.icon"
                            :tooltip="tool.tooltip"
                            :tooltipPosition="tooltipPosition"
                            :tooltipAttrs="tooltipAttrs"
                            :offset="tooltipOffset"
                            :safeMargin="tooltipSafeMargin"
                            @click="tool.callback"
                            class="vpj-article-header__button"
                            rel="noopener"
                        />
                    </div>
                </Teleport>
            </ClientOnly>
        </div>
        <slot name="header-between"/>
        <div
            v-show="!isDesktop && showActions"
            class="vpj-article-header__actions"
        >
            
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

    /* Toolbar */
    .vpj-article-header__toolbar {
        align-items: center;
        display: flex;
        flex-shrink: 0;
        gap: .25rem;
        height: 100%;
        margin-left: auto;
    }

    .vpj-article-header__info .vpj-article-header__toolbar {
        justify-self: flex-end;
    }

    .vpj-article-header__actions .vpj-article-header__toolbar {
        margin-left: 0;
    }

    /* Toolbar Divider */
    .vpj-article-header__divider {
        background-color: var(--vpj-color-border-400);
        height: 24px;
        width: 1px;
        margin-left: .25rem;
        margin-right: .25rem;
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