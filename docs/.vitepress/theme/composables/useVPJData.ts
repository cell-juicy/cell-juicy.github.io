import { ref, computed, inject, watch } from 'vue';
import { data } from '../data/page.data';
import { VPJDataStore } from '../data/pageData';
import { VPJ_DATA_SYMBOL } from '../utils/symbols';

import type { ComputedRef, Ref } from 'vue';
import type { Route, SiteData } from 'vitepress';
import type { PageContext } from '../types/common';
import type { ThemeConfig } from '../types';
import type { VPJPageData, VPJBlogData, VPJDocData } from '../data/pageData';


export type VPJDataItem = VPJPageData | VPJBlogData | VPJDocData;
export type VPJData = {
    store: VPJDataStore;
    data: Ref<VPJDataItem | undefined>;
    title: Ref<string | undefined>;
    lastUpdated: Ref<Date | undefined>;
    createdAt: Ref<Date | undefined>;
    cover: Ref<string | undefined>;
    next: Ref<{ text?: string; link?: string } | undefined>;
    prev: Ref<{ text?: string; link?: string } | undefined>;
    order: Ref<number | number[] | undefined>;
    series: Ref<string | undefined>;
    tags: Ref<string[] | undefined>;
    listTitle: Ref<string | undefined>;
    space: Ref<string | undefined>;
    resources: Ref<Record<string, any> | undefined>;
    treeTitle: Ref<string | undefined>;
    ctx: ComputedRef<PageContext | undefined>;
    filter: VPJDataStore["filter"];
    docFilter: VPJDataStore["docFilter"];
    blogFilter: VPJDataStore["blogFilter"];
    pageFilter: VPJDataStore["pageFilter"];
};

export function initVPJData(route: Route, siteData: Ref<SiteData>) {
    const theme: Ref<ThemeConfig> = computed(() => siteData.value.themeConfig);
    const store = new VPJDataStore(data, theme.value);

    const currentData = computed(() => {
        return store.getDataByUrl(route.path);
    });

    // page
    const title = computed(() => {
        return currentData.value ? currentData.value.title : undefined;
    });

    const lastUpdated = computed(() => {
        return currentData.value ? currentData.value.lastUpdated : undefined;
    });

    const createdAt = computed(() => {
        return currentData.value ? currentData.value.createdAt : undefined;
    });

    // article
    const cover = computed(() => {
        return (currentData.value && (currentData.value.layout === "blog" || currentData.value.layout === "doc"))
            ? currentData.value.cover
            : undefined;
    });

    const next = computed(() => {
        return (currentData.value && (currentData.value.layout === "blog" || currentData.value.layout === "doc"))
            ? currentData.value.next
            : undefined;
    });

    const prev = computed(() => {
        return (currentData.value && (currentData.value.layout === "blog" || currentData.value.layout === "doc"))
            ? currentData.value.prev
            : undefined;
    });

    const order = computed(() => {
        return (currentData.value && (currentData.value.layout === "blog" || currentData.value.layout === "doc"))
            ? currentData.value.order
            : undefined;
    });

    // blog
    const series = computed(() => {
        return (currentData.value && (currentData.value.layout === "blog"))
            ? currentData.value.series
            : undefined;
    });

    const tags = computed(() => {
        return (currentData.value && (currentData.value.layout === "blog"))
            ? currentData.value.tags
            : undefined;
    });

    const listTitle = computed(() => {
        return (currentData.value && (currentData.value.layout === "blog"))
            ? currentData.value.listTitle
            : undefined;
    });

    // doc
    const space = computed(() => {
        return (currentData.value && (currentData.value.layout === "doc"))
            ? currentData.value.space
            : undefined;
    });

    const resources = computed(() => {
        return (currentData.value && (currentData.value.layout === "doc"))
            ? currentData.value.resources
            : undefined;
    });

    const treeTitle = computed(() => {
        return (currentData.value && (currentData.value.layout === "doc"))
            ? currentData.value.treeTitle
            : undefined;
    });

    // ctx
    const ctx: ComputedRef<PageContext | undefined> = computed(() => {
        if (currentData.value && (currentData.value.layout === "blog" || currentData.value.layout === "doc")) {
            let layoutConfig:
                | { layout: "blog"; series?: string; tags?: string[], order: number; title?: string }
                | { layout: "doc"; space?: string; order: number[]; title?: string };
            if (currentData.value.layout === "blog") {
                layoutConfig = {
                    layout: currentData.value.layout,
                    title: currentData.value.title,
                    order: currentData.value.order,
                    tags: currentData.value.tags,
                    series: currentData.value.series,
                };
            } else {
                layoutConfig = {
                    layout: currentData.value.layout,
                    title: currentData.value.title,
                    order: currentData.value.order,
                    space: currentData.value.space,
                };
            };
            return {
                route,
                layoutConfig
            };
        };
    });

    // filter
    const filter = store.filter;
    const docFilter = store.docFilter;
    const blogFilter = store.blogFilter;
    const pageFilter = store.pageFilter;

    return {
        store,
        data: currentData,
        title,
        lastUpdated,
        createdAt,
        cover,
        next,
        prev,
        order,
        series,
        tags,
        listTitle,
        space,
        resources,
        treeTitle,
        ctx,
        filter,
        docFilter,
        blogFilter,
        pageFilter,
    };
};

export function useVPJData() {
    const data = inject<VPJData>(VPJ_DATA_SYMBOL);
    if (!data) throw new Error(
        "[vitepress-theme-juicy] useVPJData() is called without provider. " +
        "Make sure enhanceApp calls app.provide(VPJ_DATA_SYMBOL, initVPJData(...))."
    );
    return data;
};