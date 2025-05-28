import { ref, computed, inject, watch, Ref } from "vue";
import { Route } from "vitepress";

// @ts-ignore
import { data } from "../data/doc.data";

import { VPJ_DOC_DATA_SYMBOL } from "../utils/symbols";
import { processDocOrder } from "../utils/common";

import type {
    ThemeConfig
} from '../types';
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
        | number[]
        | ((order: number[]) => boolean);
}

interface DocData {
    title: Ref<string | undefined>;
    space: Ref<string | undefined>;
    order: Ref<number[] | undefined>;
    cover: Ref<string | undefined>;
    ctx: Ref<PageContext | undefined>;
    filter: (option: FilterOption | undefined) => undefined;
}

export function initVPJDocData(route: Route, siteData): DocData {
    const frontmatter = computed(() => route.data.frontmatter);
    const theme: Ref<ThemeConfig> = computed(() => siteData.value.themeConfig);

    // Get theme config and series config
    const layoutConfig: Ref<{cover?: string}> = ref({});
    const seriesConfig: Ref<{cover?: string}> = ref({});

    watch([theme, frontmatter], (next, prev) => {
        
    }, { immediate: true });

    // Process blog data
    const docDataBase = computed(() => {
        return []
    });

    // Calculate the space
    const space = computed(() => {
        if (typeof frontmatter.value.series === 'string' && frontmatter.value.layout === "doc") return frontmatter.value.series;
        else return undefined;
    });

    // Calculate the order
    const order = computed(() => {
        if (frontmatter.value.layout === "doc") {
            return processDocOrder(frontmatter.value.order);
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
        if (frontmatter.value.layout === "doc") {
            
        }
        return undefined;
    });

    // Calculate the context
    const ctx: Ref<PageContext | undefined> = computed(() => {
        if (frontmatter.value.layout === "doc") {
            return {
                route: { ...route },
                layoutConfig: {
                    layout: "doc",
                    title: title.value,
                    space: space.value,
                    order: order.value
                }
            }
        }
        return undefined;
    });

    function filter(option: FilterOption | undefined) {
        return undefined
    };

    return {
        title,
        space,
        order,
        cover,
        ctx,
        filter,
    };
};

export function useDocData(): DocData {
    const data = inject<DocData>(VPJ_DOC_DATA_SYMBOL);
    if (!data) {
        throw new Error('vitepress-theme-juicy doc data not properly injected in app');
    }
    return data;
};