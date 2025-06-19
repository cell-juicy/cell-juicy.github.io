import { ref, computed, inject, watch, Ref } from "vue";
import { Route } from "vitepress";
import { cloneDeep } from "lodash"

// @ts-ignore
import { data } from "../data/doc.data";

import { VPJ_DOC_DATA_SYMBOL } from "../utils/symbols";
import { processDocOrder } from "../utils/common";

import type {
    ThemeConfig
} from '../types';
import type {
    VPJDocLayoutConfig
} from "../types/layoutDoc";
import type {
    SpaceMetaData,
    NodeMetadata,
    DocDefaultsConfig
} from "../types/doc";
import type {
    PageContext
} from '../types/common';


interface FilterOption {
    space?:
        | string
        | ((series: string | undefined) => boolean);
    
    order?:
        | number[]
        | ((order: number[]) => boolean);
    
    isVirtual?: boolean;
}

interface DocData {
    title: Ref<string | undefined>;
    space: Ref<string | undefined>;
    order: Ref<number[] | undefined>;
    cover: Ref<string | undefined>;
    ctx: Ref<PageContext | undefined>;
    filter: (option: FilterOption | undefined) => DocPageData[];
    spaceConfig: Ref<SpaceMetaData>;
    layoutConfig: Ref<VPJDocLayoutConfig>;
}

interface RawDocPageData {
    title?: string;
    space?: string;
    order: number[];
    cover?: string | false;
    url?: string;
    frontmatter?: Record<string, any>;
    src?: string;
    html?: string;
    inherit?: boolean;
    virtual?: boolean;
}

interface StoreDocPageData extends RawDocPageData {
    id: string;
    virtual: boolean;
}

class DocPageData {
    static #idMap: Map<string, DocPageData> = new Map();
    static #duplicateCount: Map<string, number> = new Map();

    #store: StoreDocPageData;
    #parentId?: string;
    #childrenIds: string[] = [];

    constructor(
        raw: RawDocPageData
    ) {
        // Initialization
        this.#store = {
            ...cloneDeep(raw),
            id: 'unknown',
            virtual: (raw.virtual === true) ? true : false,
        };

        // Register self
        DocPageData.register(this);

        // Bind parent
        this.#bindParent();

        // Inherit from user config and parent
        this.#inheritFromParent();
    }

    // Getters
    get title() { return this.#store.title; }
    get space() { return this.#store.space; }
    get order() { return this.#store.order; }
    get cover() { return this.#store.cover; }
    get inherit() { return this.#store.inherit; }

    get url() { return this.#store.url; }
    get frontmatter() { return this.#store.frontmatter; }
    get src() { return this.#store.src; }
    get html() { return this.#store.html; }

    get parent() { return this.#parentId ? DocPageData.#idMap.get(this.#parentId) : undefined; }
    get children() {
        return this.#childrenIds
            .map(id => DocPageData.#idMap.get(id))
            .filter((child): child is DocPageData => child !== undefined);
    }
    get isVirtual() { return this.#store.virtual; }

    // Methods
    #bindParent() {
        for (let i=1; i<this.order.length; i++) {
            const expectedParentOrder = this.order.slice(0, - i);
            const expectedParentid = DocPageData.genId({
                space: this.#store.space,
                order: expectedParentOrder,
            });
            const parent = DocPageData.#idMap.get(expectedParentid);

            if (!parent) continue;

            parent.#childrenIds.push(this.#store.id);
            this.#parentId = parent.#store.id;
            break;
        }
    };

    #inheritFromParent() {
        const parent = this.parent;
        if (parent && this.#store.inherit) {
            // Inherit cover
            if (
                (typeof parent.#store.cover === 'string' || parent.cover === false) &&
                (this.#store.cover === undefined)
            ) {
                this.#store.cover = parent.cover;
            };
        }
    };

    // Static methods
    static genId<T extends { space?: string; order: number[] }>(input: T): string {
        return `${input.space ?? ""}:${input.order.join("/")}`;
    };

    static register(data: DocPageData): void {
        const baseId = DocPageData.genId(data.#store);
        if (DocPageData.#idMap.has(baseId)) {
            const count = DocPageData.#duplicateCount.get(baseId) ?? 0;
            const newId = `${baseId}:duplicate-${count}`;
            data.#store.id = newId;
            DocPageData.#idMap.set(newId, data);
            DocPageData.#duplicateCount.set(baseId, count + 1);
        } else {
            data.#store.id = baseId;
            DocPageData.#idMap.set(baseId, data);
        }
    };

    static applyMetaData(target: RawDocPageData, meta: NodeMetadata) {
        if (
            target.title === undefined &&
            typeof meta.title === 'string'
        ) {
            target.title = meta.title;
        };

        if (
            target.cover === undefined &&
            (typeof meta.cover === 'string' || meta.cover === false)
        ) {
            target.cover = meta.cover;
        };

        if (
            target.inherit === undefined &&
            typeof meta.inherit === 'boolean'
        ) {
            target.inherit = true;
        };
    }

    static applySpaceConfig(dataBase: RawDocPageData[], config: Record<string, SpaceMetaData>) {
        Object.entries(config).forEach(([space, meta]) => {
            const nodeMeta = meta.nodeMeta;
            
            // Apply metaData according to order
            Object.entries(nodeMeta ?? {}).forEach(([orderString, metaData]) => {
                if (orderString === "global" || typeof metaData !== 'object' || metaData === null) return;

                const order = processDocOrder(orderString);
                const targetList = dataBase.filter((node) => {
                    return (node.order.length === order.length) &&
                        (node.order.every((value, index) => value === order[index])) &&
                        (node.space === space);
                });
                targetList.forEach((node) => DocPageData.applyMetaData(node, metaData));
            });

            // Apply metaData according to all nodes
            const globalMetaData = nodeMeta?.global;
            if (typeof globalMetaData === 'object' && globalMetaData !== null) {
                const spaceNodeList = dataBase.filter((node) => node.space === space);
                spaceNodeList.forEach((node) => DocPageData.applyMetaData(node, globalMetaData));
            };

        });
    };
    static generateVirtualNodes(dataBase: RawDocPageData[]) {
        const existingNodes: Set<string> = new Set();
        const virtualNodes: RawDocPageData[] = [];

        dataBase.forEach((node) => {
            const id = DocPageData.genId(node);
            if (!existingNodes.has(id)) {
                existingNodes.add(id);
            }
        });

        dataBase.forEach((node) => { 
            const currentOrder = [...node.order];

            while (currentOrder.length > 1) {
                currentOrder.pop();
                const expectedParentid = DocPageData.genId({
                    space: node.space,
                    order: currentOrder,
                });

                if (existingNodes.has(expectedParentid)) break;

                virtualNodes.push({
                    space: node.space,
                    order: [...currentOrder],
                    virtual: true,
                });
                existingNodes.add(expectedParentid);
            }
        });

        dataBase.push(...virtualNodes)
    };

    static sortDataBase(dataBase: RawDocPageData[]) {
        return dataBase
            .sort((a: RawDocPageData, b: RawDocPageData) => {
                const spaceA = a.space ?? "";
                const spaceB = b.space ?? "";

                if (spaceA !== spaceB) {
                    return spaceA.localeCompare(spaceB);
                }

                const len = Math.max(a.order.length, b.order.length);
                for (let i = 0; i < len; i++) {
                    const aVal = a.order[i] ?? -1;
                    const bVal = b.order[i] ?? -1;
                    if (aVal !== bVal) {
                        return aVal - bVal;
                    }
                }

                return 0;
            });
    };

    static processDataBase(dataBase: RawDocPageData[], config: DocDefaultsConfig) {
        const copy = cloneDeep(dataBase);

        // If no config, return the original dataBase
        if (typeof config !== 'object' || !config) return copy;
        
        // Generate virtual nodes
        if (!!config.enableVirtual) {
            DocPageData.generateVirtualNodes(copy);
        }

        // Apply space meta data
        if (typeof config.space === 'object' && config.space !== null) {
            DocPageData.applySpaceConfig(copy, config.space);
        }

        // Sort nodes by space/order
        return DocPageData.sortDataBase(copy);
    }

    static reset() {
        DocPageData.#idMap.clear();
        DocPageData.#duplicateCount.clear();
    };
};

export function initVPJDocData(route: Route, siteData): DocData {
    const frontmatter = computed(() => route.data.frontmatter);
    const theme: Ref<ThemeConfig> = computed(() => siteData.value.themeConfig);

    // Get theme config and series config
    const layoutConfig: Ref<VPJDocLayoutConfig> = ref({});
    const docConfig: Ref<DocDefaultsConfig> = ref({});
    const spaceConfig: Ref<SpaceMetaData> = ref({});

    // Watch theme and frontmatter
    watch([theme, frontmatter], (next, prev) => {
        if (JSON.stringify(next) !== JSON.stringify(prev)) {
            // Update layout config
            layoutConfig.value = theme.value.layouts?.doc || {};

            // Update series config
            docConfig.value = theme.value.doc || {};

            // Update space config
            if (typeof frontmatter.value.space === 'string' && frontmatter.value.layout === "doc") {
                const name = frontmatter.value.space;
                if (
                    theme.value.doc?.space &&
                    typeof theme.value.doc.space === 'object' &&
                    theme.value.doc.space !== null
                ) {
                    spaceConfig.value = theme.value.doc.space[name] || {};
                };
            };
        };
    }, { immediate: true });

    // Process blog data
    const docDataBase = computed(() => {
        DocPageData.reset();

        const processedData = DocPageData.processDataBase(
            data as RawDocPageData[],
            docConfig.value
        );

        return processedData.map((raw) => new DocPageData(raw))
    });

    const currentData = computed(() => {
        if (frontmatter.value.layout === "doc") {
            return docDataBase.value.find((data) => (data.url || null) === route.path);
        };
        return undefined;
    })

    // Calculate the space
    const space = computed(() => {
        if (frontmatter.value.layout === "doc") {
            return currentData.value?.space || undefined;
        };
        return undefined;
    });

    // Calculate the order
    const order = computed(() => {
        if (frontmatter.value.layout === "doc") {
            return currentData.value?.order || undefined;
        };
        return undefined;
    });

    // Calculate the cover
    const cover = computed(() => {
        if (frontmatter.value.layout === "doc") {
            return currentData.value?.cover || undefined;
        };
        return undefined;
    });

    // Calculate the title
    const title = computed(() => {
        if (frontmatter.value.layout === "doc") {
            return currentData.value?.title || undefined;
        };
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

    function filter(option?: FilterOption | undefined): DocPageData[] {
        if (!option) return docDataBase.value;

        return docDataBase.value.filter((doc) => {
            const matchSpace = option.space === undefined
                || (typeof option.space === 'string' && doc.space === option.space)
                || (typeof option.space === 'function' && option.space(doc.space));
            if (!matchSpace) return false;

            const matchOrder = option.order === undefined
                || (Array.isArray(option.order) && doc.order.join('/') === option.order.join('/'))
                || (typeof option.order === 'function' && option.order(doc.order));
            if (!matchOrder) return false;

            const matchVirtual = option.isVirtual === undefined
                || doc.isVirtual === option.isVirtual;
            return matchVirtual;
        });
    };

    return {
        title,
        space,
        order,
        cover,
        ctx,
        filter,
        spaceConfig,
        layoutConfig
    };
};

export function useDocData(): DocData {
    const data = inject<DocData>(VPJ_DOC_DATA_SYMBOL);
    if (!data) {
        throw new Error('vitepress-theme-juicy doc data not properly injected in app');
    }
    return data;
};