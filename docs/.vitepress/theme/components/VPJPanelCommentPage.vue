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
const options = computed(() => isObject(themeConfig.value.options) ? themeConfig.value.options : {});

const giscusConfig = computed(() => {
    if (provider.value !== "giscus") return {};

    // category & categoryId
    const isDev = import.meta.env.DEV;
    let category, categoryId;
    if (isString(options.value.category)) {
        category = options.value.category;
    } else if (isObject(options.value.category)) {
        const { dev, prod } = options.value.category;
        category = (isDev ? dev : prod) ?? (isDev ? prod : dev);
        category = isString(category) ? category : undefined;
    }
    if (isString(options.value.categoryId)) {
        categoryId = options.value.categoryId;
    } else if (isObject(options.value.categoryId)) {
        const { dev, prod } = options.value.categoryId;
        categoryId = (isDev ? dev : prod) ?? (isDev ? prod : dev);
        categoryId = isString(categoryId) ? categoryId : undefined;
    };
    // theme
    const themeObject = isString(options.value.theme)
        ? { light: options.value.theme, dark: options.value.theme }
        : isObject(options.value.theme)
            ? {
                light: isString(options.value.theme.light) ? options.value.theme.light : DEFAULT.GISCUS.THEME.light,
                dark: isString(options.value.theme.dark) ? options.value.theme.dark : DEFAULT.GISCUS.THEME.dark,
            }
            : DEFAULT.GISCUS.THEME;
    // mapping & term
    const mapping = ["pathname", "url", "title", "og:title", "specific", "number"].includes(options.value.mapping)
            ? options.value.mapping
            : DEFAULT.GISCUS.MAPPING
    let term;
    if (["specific", "number"].includes(mapping)) {
        if (isFunction(options.value.term)) {
            try {
                const product = options.value.term(route);
                term = isString(product) ? product : route.path;
            } catch(e) {};
        } else if (isString(options.value.term)) {
            term = options.value.term;
        };
    };
    // lang
    const lang = [options.value.lang, site.value.lang, DEFAULT.GISCUS.LANG]
        .map((lang) => {
            if (!isString(lang)) return undefined;
            if (lang === "zh") return "zh-CN";
            if (lang === "zh-Hans") return "zh-CN";
            if (lang === "zh-Hant") return "zh-TW";
            return lang;
        })
        .find(isString);
    // loading
    const loading = isBoolean(options.value.lazyLoading)
        ? options.value.lazyLoading ? "lazy" : undefined
        : DEFAULT.GISCUS.LAZYLOADING;

    // return
    const base = {
        repo: isString(options.value.repo) ? options.value.repo : undefined,
        repoId: isString(options.value.repoId) ? options.value.repoId : undefined,
        category,
        categoryId,
        strict: isBoolean(options.value.strict)
            ? options.value.strict ? "1" : "0"
            : DEFAULT.GISCUS.STRICT,
        reactionsEnabled: isBoolean(options.value.reactionsEnabled)
            ? options.value.reactionsEnabled ? "1" : "0"
            : DEFAULT.GISCUS.REACTIONSENABLED,
        emitMetadata: isBoolean(options.value.emitMetadata)
            ? options.value.emitMetadata ? "1" : "0"
            : DEFAULT.GISCUS.EMITMETADATA,
        inputPosition: ["bottom", "top"].includes(options.value.inputPosition)
            ? options.value.inputPosition
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