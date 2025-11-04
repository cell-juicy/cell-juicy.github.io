<script setup>
import { computed } from 'vue';
import { useData, useRoute } from 'vitepress';
import Giscus from '@giscus/vue';

import { isBoolean, isObject, isString, isFunction } from '../utils/common';

import VPJOverlayScrollArea from './VPJOverlayScrollArea.vue';


const DEFAULT = {
    EMPTY: "本站没有启用评论",
    PROVIDER: ["giscus"],
    GISCUS: {
        STRICT: "0",
        REACTIONSENABLED: "1",
        INPUTPOSITION: "bottom",
        MAPPING: "pathname",
        TERM: undefined,
        THEME: {
            light: "light",
            dark: "dark",
        },
        EMITMETADATA: "0",
        LANG: "zh-CN",
        LAZYLOADING: undefined,
    },
};

const { theme, site, isDark } = useData();
const route = useRoute();

// Config
const themeConfig = computed(() =>
    isObject(theme.value.comment) && DEFAULT.PROVIDER.includes(theme.value.comment.provider)
        ? theme.value.comment
        : {}
);
const provider = computed(() => themeConfig.value.provider);
const option = computed(() => isObject(themeConfig.value.option) ? themeConfig.value.option : {});

const giscusConfig = computed(() => {
    if (provider.value !== "giscus") return {};

    // category & categoryId
    const isDev = import.meta.env.DEV;
    let category, categoryId;
    if (isString(option.value.category)) {
        category = option.value.category;
    } else if (isObject(option.value.category)) {
        const { dev, prod } = option.value.category;
        category = (isDev ? dev : prod) ?? (isDev ? prod : dev);
        category = isString(category) ? category : undefined;
    }
    if (isString(option.value.categoryId)) {
        categoryId = option.value.categoryId;
    } else if (isObject(option.value.categoryId)) {
        const { dev, prod } = option.value.categoryId;
        categoryId = (isDev ? dev : prod) ?? (isDev ? prod : dev);
        categoryId = isString(categoryId) ? categoryId : undefined;
    };
    // theme
    const themeObject = isString(option.value.theme)
        ? { light: option.value.theme, dark: option.value.theme }
        : isObject(option.value.theme)
            ? {
                light: isString(option.value.theme.light) ? option.value.theme.light : DEFAULT.GISCUS.THEME.light,
                dark: isString(option.value.theme.dark) ? option.value.theme.dark : DEFAULT.GISCUS.THEME.dark,
            }
            : DEFAULT.GISCUS.THEME;
    // mapping & term
    const mapping = ["pathname", "url", "title", "og:title", "specific", "number"].includes(option.value.mapping)
            ? option.value.mapping
            : DEFAULT.GISCUS.MAPPING
    let term;
    if (["specific", "number"].includes(mapping)) {
        if (isFunction(option.value.term)) {
            try {
                const product = option.value.term(route);
                term = isString(product) ? product : route.path;
            } catch(e) {};
        } else if (isString(option.value.term)) {
            term = option.value.term;
        };
    };
    // lang
    const lang = [option.value.lang, site.value.lang, DEFAULT.GISCUS.LANG]
        .map((lang) => {
            if (!isString(lang)) return undefined;
            if (lang === "zh") return "zh-CN";
            if (lang === "zh-Hans") return "zh-CN";
            if (lang === "zh-Hant") return "zh-TW";
            return lang;
        })
        .find(isString);
    // loading
    const loading = isBoolean(option.value.lazyLoading)
        ? option.value.lazyLoading ? "lazy" : undefined
        : DEFAULT.GISCUS.LAZYLOADING;

    // return
    const base = {
        repo: isString(option.value.repo) ? option.value.repo : undefined,
        repoId: isString(option.value.repoId) ? option.value.repoId : undefined,
        category,
        categoryId,
        strict: isBoolean(option.value.strict)
            ? option.value.strict ? "1" : "0"
            : DEFAULT.GISCUS.STRICT,
        reactionsEnabled: isBoolean(option.value.reactionsEnabled)
            ? option.value.reactionsEnabled ? "1" : "0"
            : DEFAULT.GISCUS.REACTIONSENABLED,
        emitMetadata: isBoolean(option.value.emitMetadata)
            ? option.value.emitMetadata ? "1" : "0"
            : DEFAULT.GISCUS.EMITMETADATA,
        inputPosition: ["bottom", "top"].includes(option.value.inputPosition)
            ? option.value.inputPosition
            : DEFAULT.GISCUS.INPUTPOSITION,
        theme: isDark.value ? themeObject.dark : themeObject.light,
        mapping,
        lang,
    };
    if (term) base.term = term;
    if (loading) base.loading = loading;
    return base;
});

const empty = computed(() => {
    const message = theme.value.components?.panelTabComment?.empty;
    return (typeof message === 'string') ? message : DEFAULT.EMPTY;
});
</script>


<template>
    <VPJOverlayScrollArea
        overflow="y"
        class="vpj-panel__tab-outer"
        :area-attrs="{ class: 'vpj-panel__tab-area' }"
        :inner-attrs="{ class: 'vpj-panel__tab-inner' }"
    >
        <div
            v-if="!provider"
            class="vpj-panel__fallback"
        >
            {{ empty }}
        </div>
        <div
            v-else
            class="vpj-panel__comment"
        >
            <Giscus
                v-if="provider === 'giscus'"
                :key="route.path"
                id="comments"
                v-bind="giscusConfig"
            />
        </div>
    </VPJOverlayScrollArea>
</template>


<style scoped>
    .vpj-panel__tab-outer {
        height: 100%;
        width: 100%;
    }

    :deep(.vpj-panel__tab-inner) {
        align-items: center;
        display: flex;
        flex-direction: column;
        width: 100%
    }

    .vpj-panel__comment {
        backdrop-filter: var(--vpj-panel-comment-backdrop-filter);
        background: var(--vpj-panel-comment-bg);
        display: flex;
        flex: 1;
        flex-direction: column;
        padding: var(--vpj-panel-comment-padding);
        width: 100%;
    }

    #comments {
        display: flex;
        flex: 1
    }
</style>