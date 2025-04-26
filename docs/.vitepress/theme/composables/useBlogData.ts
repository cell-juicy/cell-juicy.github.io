import { ref, computed, inject, watch, Ref } from "vue";
import { Route } from "vitepress";

import blogData from "../data/blog.data";

import { VPJ_BLOG_DATA_SYMBOL } from "../utils/symbols";
import { processOrder } from "../utils/common";

import type {
    ThemeConfig
} from '../types';
import type {
    VPJBlogLayoutConfig
} from '../types/layoutBlog';
import type {
    SeriesDefaultData
} from '../types/blog';
import type {
    PageContext
} from '../types/common';


interface BlogData {
    series: Ref<string | undefined>;
    tags: Ref<string[] | undefined>;
    order: Ref<number | undefined>;
    cover: Ref<string | undefined>;
    ctx: Ref<PageContext | undefined>;
    layoutConfig: Ref<VPJBlogLayoutConfig>;
    seriesConfig: Ref<SeriesDefaultData>;
}

export function initVPJBlogData(route: Route, siteData): BlogData {
    const frontmatter = computed(() => route.data.frontmatter);
    const theme: Ref<ThemeConfig> = computed(() => siteData.value.themeConfig);

    // Get theme config and series config
    const layoutConfig: Ref<VPJBlogLayoutConfig> = ref(theme.value.layouts?.blog || {});
        
    const seriesConfig: Ref<SeriesDefaultData> = ref({});

    watch([theme, frontmatter], (next, prev) => {
        if (JSON.stringify(next) !== JSON.stringify(prev)) {
            // Update layout config
            layoutConfig.value = theme.value.layouts?.blog || {};
            // Update series config
            if (typeof frontmatter.value.series === 'string' && frontmatter.value.layout === "blog") {
                const name = frontmatter.value.series;
                if (theme.value.blog?.series && typeof theme.value.blog.series === 'object') {
                    seriesConfig.value = theme.value.blog.series[name] || {};
                };
            };
        };   
    }, { immediate: true });

    // Calculate the series
    const series = computed(() => {
        if (typeof frontmatter.value.series === 'string' && frontmatter.value.layout === "blog") return frontmatter.value.series;
        else return undefined;
    });

    // Calculate the tags
    const tags = computed(() => {
        if (frontmatter.value.layout === "blog") {
            const tags: string[] = []
            if (Array.isArray(seriesConfig.value.presetTags)) {
                seriesConfig.value.presetTags.filter((tag: string) => {
                    return typeof tag === 'string' && tag.length > 0;
                }).forEach((tag) => {
                    tags.push(tag)
                })
            }
            if (Array.isArray(frontmatter.value.tags)) {
                frontmatter.value.tags.filter((tag: string) => {
                    return typeof tag === 'string' && tag.length > 0;
                }).forEach((tag) => {
                    tags.push(tag)
                })
            };
            return tags;
        } else {
            return undefined;
        };
    });

    // Calculate the order
    const order = computed(() => {
        if (frontmatter.value.layout === "blog") {
            return processOrder(frontmatter.value.order);
        }
        return undefined;
    });

    // Calculate the cover
    const cover = computed(() => {
        if (typeof frontmatter.value.cover === "string") {
            return frontmatter.value.cover;
        } else if (typeof seriesConfig.value.cover === "string") {
            return seriesConfig.value.cover;
        } else if (typeof layoutConfig.value.cover === "string") {
            return layoutConfig.value.cover;
        } else {
            return undefined
        }
    })

    // Calculate the context
    const ctx: Ref<PageContext | undefined> = computed(() => {
        if (frontmatter.value.layout === "blog") {
            return {
                route: { ...route },
                layoutConfig: {
                    layout: "blog",
                    series: series.value,
                    tags: tags.value,
                    order: order.value
                }
            }
        }
        return undefined;
    })

    return {
        series,
        tags,
        order,
        cover,
        ctx,
        seriesConfig,
        layoutConfig
    };
}

export function useBlogData(): BlogData {
    const data = inject<BlogData>(VPJ_BLOG_DATA_SYMBOL);
    if (!data) {
        throw new Error('vitepress-theme-juicy blog data not properly injected in app');
    }
    return data;
}