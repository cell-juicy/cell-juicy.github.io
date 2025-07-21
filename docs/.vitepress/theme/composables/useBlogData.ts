import { ref, computed, inject, watch, Ref } from "vue";
import { Route } from "vitepress";
import { cloneDeep } from "lodash-es";

// @ts-ignore
import { data } from "../data/blog.data";

import { VPJ_BLOG_DATA_SYMBOL } from "../utils/symbols";

import type {
    ThemeConfig
} from '../types';
import type {
    VPJBlogLayoutConfig
} from '../types/layoutBlog';
import type {
    SeriesMetaData,
    BlogDefaultsConfig
} from '../types/blog';
import type {
    PageContext
} from '../types/common';


interface BlogData {
    data: Ref<BlogPageData | undefined>;
    title: Ref<string | undefined>;
    series: Ref<string | undefined>;
    tags: Ref<string[] | undefined>;
    order: Ref<number | undefined>;
    cover: Ref<string | undefined>;
    ctx: Ref<PageContext | undefined>;
    filter: (callbackFn: (data: BlogPageData) => boolean) => BlogPageData[];
    seriesConfig: Ref<SeriesMetaData>;
    layoutConfig: Ref<VPJBlogLayoutConfig>;
}

interface RawBlogPageData {
    title?: string;
    series?: string;
    order: number;
    cover?: string | false;
    tags: string[];
    listTitle?:
        | string
        | ((data: BlogPageData) => string | undefined);
    url?: string;
    frontmatter?: Record<string, any>;
}

interface StoreBlogPageData extends RawBlogPageData {
    id: string;
}

interface BlogStoreContext {
    idMap: Map<string, BlogPageData>;
    duplicateCount: Map<string, number>;
}


export class BlogPageData {
    #store: StoreBlogPageData;
    #storeContext: BlogStoreContext;

    constructor(
        raw: RawBlogPageData,
        storeContext: BlogStoreContext
    ) {
        // Initialization
        this.#store = {
            ...cloneDeep(raw),
            id: 'unknown',
            tags: Array.from(new Set(raw.tags))
        };
        this.#storeContext = storeContext;

        // Register self
        this.#register();
    }

    // Getters
    get title(): string | undefined { return this.#store.title; }
    get series(): string | undefined { return this.#store.series; }
    get order(): number { return this.#store.order; }
    get cover(): string | false | undefined { return this.#store.cover; }
    get tags(): string[] { return this.#store.tags; }
    get listTitle(): string {
        if (typeof this.#store.listTitle === 'string') {
            return this.#store.listTitle;
        } else if (typeof this.#store.listTitle === 'function') {
            try {
                const title  = this.#store.listTitle(this);
                if (typeof title === 'string') return title;
            } catch (e) {
                console.error(
                    `[Juicy Theme]Trying to parse listTitle from blog page data` +
                    `(${this.#store.id}) failed, caught error: ${e}`
                );
            };
        };
        return this.title || this.id;
    }

    get url(): string | undefined { return this.#store.url; }
    get frontmatter(): Record<string, any> | undefined { return this.#store.frontmatter; }

    get id(): string { return this.#store.id; }

    // Method
    #register(): void {
        const baseId = BlogPageData.genId(this.#store);
        if (this.#storeContext.idMap.has(baseId)) {
            const count = this.#storeContext.duplicateCount.get(baseId) ?? 0;
            const newId = `${baseId}:duplicate-${count}`;
            this.#store.id = newId;
            this.#storeContext.idMap.set(newId, this);
            this.#storeContext.duplicateCount.set(baseId, count + 1);
        } else {
            this.#store.id = baseId;
            this.#storeContext.idMap.set(baseId, this);
        }
    };

    // Static methods
    static genId<T extends { series?: string; order: number }>(input: T): string {
        return `blog:${input.series ?? ""}:${input.order}`;
    };

    static applyMetaData(target: RawBlogPageData, meta: SeriesMetaData) {
        // Apply cover
        if (
            target.cover === undefined &&
            (typeof meta.cover === "string" || meta.cover === false)
        ) {
            target.cover = meta.cover;
        };

        // Apply preset tags
        if (meta.presetTags) {
            const presetTags = Array.isArray(meta.presetTags)
                ? meta.presetTags.filter((tag) => typeof tag === "string" && tag.length > 0)
                : [];
            target.tags.unshift(...presetTags);
        };

        // Apply list title
        if (
            target.listTitle === undefined &&
            (typeof meta.listTitle === "string" || typeof meta.listTitle === "function")
        ) {
            target.listTitle = meta.listTitle;
        };
    };

    static applySeriesConfig(dataBase: RawBlogPageData[], config: Record<string, SeriesMetaData>) {
        Object.entries(config).forEach(([series, meta]) => {
            if (typeof meta !== 'object' || !meta) return;

            const targetList = dataBase.filter((node) => {
                return (node.series === series);
            });

            targetList.forEach((node) => BlogPageData.applyMetaData(node, meta));
        });
    };

    static sortDataBase(dataBase: RawBlogPageData[]) {
        return dataBase
            .sort((a: RawBlogPageData, b: RawBlogPageData) => {
                const seriesA = a.series ?? "";
                const seriesB = b.series ?? "";

                if (seriesA !== seriesB) {
                    return seriesA.localeCompare(seriesB);
                };

                return a.order - b.order;
            });
    };

    static processDataBase(dataBase: RawBlogPageData[], config: BlogDefaultsConfig) {
        const copy = cloneDeep(dataBase);

        // If no config, return the original dataBase
        if (typeof config !== 'object' || !config) return copy;

        // Apply series meta data
        if (typeof config.series === 'object' && config.series !== null) {
            BlogPageData.applySeriesConfig(copy, config.series);
        };

        // Sort nodes by series/order
        return BlogPageData.sortDataBase(copy);
    };
};

export function initVPJBlogData(route: Route, siteData): BlogData {
    const frontmatter = computed(() => route.data.frontmatter);
    const theme: Ref<ThemeConfig> = computed(() => siteData.value.themeConfig);

    // Get theme config and series config
    const layoutConfig: Ref<VPJBlogLayoutConfig> = ref({});
    const blogConfig: Ref<BlogDefaultsConfig> = ref({});
    const seriesConfig: Ref<SeriesMetaData> = ref({});

    watch([theme, frontmatter], (next, prev) => {
        if (JSON.stringify(next) !== JSON.stringify(prev)) {
            // Update layout config
            layoutConfig.value = theme.value.layouts?.blog || {};

            // Update blog config
            blogConfig.value = theme.value.blog || {};
            
            // Update series config
            if (typeof frontmatter.value.series === 'string' && frontmatter.value.layout === "blog") {
                const name = frontmatter.value.series;
                if (
                    theme.value.blog?.series &&
                    typeof theme.value.blog.series === 'object' &&
                    theme.value.blog.series !== null
                ) {
                    seriesConfig.value = theme.value.blog.series[name] || {};
                };
            };
        };
    }, { immediate: true });

    // Process blog data
    const blogDataBase = computed(() => {
        const storeContext: BlogStoreContext = {
            idMap: new Map<string, BlogPageData>(),
            duplicateCount: new Map<string, number>(),
        };
    
        const processedData = BlogPageData.processDataBase(
            data as RawBlogPageData[],
            blogConfig.value
        );
    
        return processedData.map((raw) => new BlogPageData(raw, storeContext))
    });

    // Calculate current data
    const currentData = computed(() => {
        if (frontmatter.value.layout === "blog") {
            return blogDataBase.value.find((data) => (data.url || undefined) === route.path);
        };
        return undefined;
    })

    // Calculate the space
    const series = computed(() => {
        if (frontmatter.value.layout === "blog") {
            return currentData.value?.series || undefined;
        };
        return undefined;
    });

    // Calculate the order
    const order = computed(() => {
        if (frontmatter.value.layout === "blog") {
            return currentData.value?.order || undefined;
        };
        return undefined;
    });

    // Calculate the cover
    const cover = computed(() => {
        if (frontmatter.value.layout === "blog") {
            return currentData.value?.cover || undefined;
        };
        return undefined;
    });

    const tags = computed(() => {
        if (frontmatter.value.layout === "blog") {
            return currentData.value?.tags || undefined;
        };
        return undefined;
    })

    // Calculate the title
    const title = computed(() => {
        if (frontmatter.value.layout === "blog") {
            return currentData.value?.title || undefined;
        };
        return undefined;
    });

    // Calculate the context
    const ctx: Ref<PageContext | undefined> = computed(() => {
        if (frontmatter.value.layout === "blog") {
            return {
                route: { ...route },
                layoutConfig: {
                    layout: "blog",
                    title: title.value,
                    series: series.value,
                    order: order.value as number
                }
            };
        };
        return undefined;
    });

    function filter(callbackFn: (data: BlogPageData) => boolean): BlogPageData[] {
        if (!callbackFn) return blogDataBase.value;
        return blogDataBase.value.filter(callbackFn);
    };

    return {
        data: currentData,
        title,
        series,
        order,
        cover,
        tags,
        ctx,
        filter,
        seriesConfig,
        layoutConfig
    };
};

export function useBlogData(): BlogData {
    const data = inject<BlogData>(VPJ_BLOG_DATA_SYMBOL);
    if (!data) {
        throw new Error('vitepress-theme-juicy blog data not properly injected in app');
    }
    return data;
};