import { ref, computed, inject, watch, Ref } from "vue";
import { Route } from "vitepress";

// @ts-ignore
import { data } from "../data/blog.data";

import { VPJ_BLOG_DATA_SYMBOL } from "../utils/symbols";
import { processBlogOrder } from "../utils/common";

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


interface FilterOption {
    series?:
        | string
        | ((series: string) => boolean);
    
    tags?:
        | string
        | Array<string>
        | ((tags: Array<string>) => boolean);
    
    order?:
        | number
        | ((order: number) => boolean);
}

interface BlogData {
    title: Ref<string | undefined>;
    series: Ref<string | undefined>;
    tags: Ref<string[] | undefined>;
    order: Ref<number | undefined>;
    cover: Ref<string | undefined>;
    ctx: Ref<PageContext | undefined>;
    filter: (option: FilterOption | undefined) => Array<any> | undefined;
    layoutConfig: Ref<VPJBlogLayoutConfig>;
    seriesConfig: Ref<SeriesDefaultData>;
}

export function initVPJBlogData(route: Route, siteData): BlogData {
    const frontmatter = computed(() => route.data.frontmatter);
    const theme: Ref<ThemeConfig> = computed(() => siteData.value.themeConfig);

    // Get theme config and series config
    const layoutConfig: Ref<VPJBlogLayoutConfig> = ref({});
    const seriesConfig: Ref<SeriesDefaultData> = ref({});

    watch([theme, frontmatter], (next, prev) => {
        if (JSON.stringify(next) !== JSON.stringify(prev)) {
            // Update layout config
            layoutConfig.value = theme.value.layouts?.blog || {};
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
        const blogDataSet = data.map((raw: any) => {
            const blogData = { ...raw };
            const seriesData = (
                typeof blogData.series === 'string' &&
                theme.value.blog?.series &&
                typeof theme.value.blog.series === 'object' &&
                theme.value.blog.series !== null
            )
                ? theme.value.blog.series[blogData.series] || {}
                : {};
            const layoutData = layoutConfig.value;
            
            // process tags
            if (
                typeof seriesData === 'object' &&
                seriesData !== null &&
                Array.isArray(seriesData.presetTags)
            ) {
                blogData.tags.unshift(
                    ...seriesData.presetTags.filter((tag) => {
                        return typeof tag === 'string' && tag.length > 0;
                    })
                );
            };
            blogData.tags = Array.from(new Set(blogData.tags));

            // process cover
            if (typeof blogData.cover === 'string' || blogData.cover === false) {
                blogData.cover = (blogData.cover === false) ? undefined : blogData.cover;
            } else if (typeof seriesData.cover === 'string' || seriesData.cover === false) {
                blogData.cover = (seriesData.cover === false) ? undefined : seriesData.cover;
            } else if (typeof layoutData.cover === 'string' || layoutData.cover === false) {
                blogData.cover = (layoutData.cover === false) ? undefined : layoutData.cover;
            } else {
                blogData.cover = undefined;
            }

            return blogData;
        });
        return blogDataSet;
    });

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
            };
            if (Array.isArray(frontmatter.value.tags)) {
                frontmatter.value.tags.filter((tag: string) => {
                    return typeof tag === 'string' && tag.length > 0;
                }).forEach((tag) => {
                    tags.push(tag)
                })
            };
            return Array.from(new Set(tags));
        } else {
            return undefined;
        };
    });

    // Calculate the order
    const order = computed(() => {
        if (frontmatter.value.layout === "blog") {
            return processBlogOrder(frontmatter.value.order);
        }
        return undefined;
    });

    // Calculate the cover
    const cover = computed(() => {
        let cover: false | string | undefined
        if (typeof frontmatter.value.cover === "string" || frontmatter.value.cover === false) {
            cover = frontmatter.value.cover;
        } else if (typeof seriesConfig.value.cover === "string" || seriesConfig.value.cover === false) {
            cover = seriesConfig.value.cover;
        } else if (typeof layoutConfig.value.cover === "string"  || layoutConfig.value.cover === false) {
            cover = layoutConfig.value.cover;
        } else {
            cover = undefined;
        };
        return (cover === false) ? undefined : cover;
    });

    // Calculate the title
    const title = computed(() => {
        if (frontmatter.value.layout === "blog") {
            const currentData = blogDataBase.value.find((data) => {
                return (data.url || undefined) === route.path
            });
            if (currentData) return currentData.title;
        }
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
                    tags: tags.value,
                    order: order.value
                }
            }
        }
        return undefined;
    });

    function filter(option: FilterOption | undefined) {
        if (!option) {
            return blogDataBase.value
        } else if (typeof option === 'object' && option !== null) {
            // Calculate seriesFilter
            let seriesFilter: (series: string) => boolean
            if (typeof option.series === 'string') {
                seriesFilter = (series: string) => series === option.series
            } else if (typeof option.series === 'function') {
                seriesFilter = (series: string) => !!(option.series as (series: string) => boolean)(series)
            } else {
                seriesFilter = () => true;
            };

            // Calculate tagsFilter
            let tagsFilter: (tags: Array<string>) => boolean
            if (typeof option.tags === 'string') {
                tagsFilter = (tags: Array<string>) => tags.includes((option.tags as string))
            } else if (Array.isArray(option.tags)) {
                tagsFilter = (tags: Array<string>) => (option.tags as Array<string>).every((tag) => tags.includes(tag))
            } else if (typeof option.tags === 'function') {
                tagsFilter = (tags: Array<string>) => !!(option.tags as (tags: Array<string>) => boolean)(tags)
            } else {
                tagsFilter = () => true;
            };

            // Calculate orderFilter
            let orderFilter: (order: number) => boolean
            if (typeof option.order === 'number') {
                orderFilter = (order: number) => order === option.order
            } else if (typeof option.order === 'function') {
                orderFilter = (order: number) => !!(option.order as (order: number) => boolean)(order)
            } else {
                orderFilter = () => true;
            };

            return blogDataBase.value
                .filter((blog) => seriesFilter(blog.series))
                .filter((blog) => tagsFilter(blog.tags))
                .filter((blog) => orderFilter(blog.order))
        } else {
            return [];
        };
    };

    return {
        title,
        series,
        tags,
        order,
        cover,
        ctx,
        filter,
        seriesConfig,
        layoutConfig,
    };
};

export function useBlogData(): BlogData {
    const data = inject<BlogData>(VPJ_BLOG_DATA_SYMBOL);
    if (!data) {
        throw new Error('vitepress-theme-juicy blog data not properly injected in app');
    }
    return data;
};