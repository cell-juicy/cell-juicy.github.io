import { ref, computed, inject, watch, Ref } from "vue";
import { Route } from "vitepress";
import { cloneDeep } from "lodash-es";

// @ts-ignore
import { data } from "../data/doc.data";

import { VPJ_DOC_DATA_SYMBOL } from "../utils/symbols";
import { any2Number, processDocOrder } from "../utils/common";

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
    PageContext,
    ResourceInput,
    ResourceData
} from '../types/common';


interface DocData {
    data: Ref<DocPageData | undefined>;
    title: Ref<string | undefined>;
    space: Ref<string | undefined>;
    order: Ref<number[] | undefined>;
    cover: Ref<string | undefined>;
    resources: Ref<Record<string, ResourceInput> | undefined>;
    ctx: Ref<PageContext | undefined>;
    filter: (callbackFn: (data: DocPageData) => boolean) => DocPageData[];
    spaceConfig: Ref<SpaceMetaData>;
    layoutConfig: Ref<VPJDocLayoutConfig>;
}

interface RawDocPageData {
    title?: string;
    space?: string;
    order: number[];
    cover?: string | false;
    resources?: Record<string, ResourceInput>;
    allowVirtualParents?: boolean;
    treeTitle?:
        | string
        | ((data: DocPageData) => string | undefined);
    url?: string;
    frontmatter?: Record<string, any>;
    inherit?: boolean;
    virtual?: boolean;
}

interface StoreDocPageData extends RawDocPageData {
    resources: Record<string, ResourceData>;
    id: string;
    inherit: boolean;
    virtual: boolean;
}

interface DocStoreContext {
    idMap: Map<string, DocPageData>;
    duplicateCount: Map<string, number>;
}

function resolveResourceInput(input: any):Record<string, ResourceData> {
    const normalized: Record<string, ResourceInput> = 
        (typeof input === 'object' && input !== null)
            ? input
            : {};;
    const result: Record<string, ResourceData> = {};

    Object.entries(normalized).forEach(([key, value]) => {
        if (value === false) {
            result[key] = { url: false };
        } else if (typeof value === 'string') {
            result[key] = {
                url: value,
                label: value
            }
        } else if (typeof value === 'object') {
            result[key] = {
                url: (typeof value.url === 'string' || value.url === false)
                    ? value.url
                    : undefined,
                label: (typeof value.label === 'string')
                    ? value.label
                    : undefined,
                icon: (
                    typeof value.icon === 'string' ||
                    (
                        typeof value.icon === 'object' &&
                        value.icon !== null &&
                        typeof value.icon.component === 'string'
                    )
                )
                    ? value.icon
                    : undefined,
                download: (typeof value.download === 'boolean' || typeof value.download === 'string')
                    ? value.download
                    : undefined,
                order: ("order" in value) ? any2Number(value.order) : undefined,
                type: (["file", "image", "website", "download"].includes(value.type || ""))
                    ? value.type
                    : undefined,
            };
        };
    });

    return result;
};

function mergeResourceData(child: Record<string, ResourceData>, parent: Record<string, ResourceData>) {
    const result: Record<string, ResourceData> = {...child};
    Object.entries(parent).forEach(([key, value]) => {
        if (!(key in result)) {
            result[key] = value;
        } else {
            result[key] = {
                url: (
                    (typeof value.url === 'string' || value.url === false) &&
                    result[key].url === undefined
                )
                    ? value.url
                    : result[key].url,
                label: (
                    (typeof value.label === 'string') &&
                    result[key].label === undefined
                )
                    ? value.label
                    : result[key].label,
                icon: (
                    (
                        typeof value.icon === 'string' || (
                        typeof value.icon === 'object' &&
                        value.icon !== null &&
                        typeof value.icon.component === 'string'
                    )) &&
                    result[key].icon === undefined
                )
                    ? value.icon
                    : result[key].icon,
                download: (
                    (typeof value.download === 'boolean' || typeof value.download === 'string') &&
                    result[key].download === undefined
                )
                    ? value.download
                    : result[key].download,
                order: (
                    ("order" in value) &&
                    result[key].order === undefined
                )
                    ? value.order
                    : result[key].order,
                type: (
                    ["file", "image", "website", "download"].includes(value.type || "") &&
                    result[key].type === undefined
                )
                    ? value.type
                    : result[key].type,
            };
        };
    });

    return result;
};

export class DocPageData {
    #store: StoreDocPageData;
    #storeContext: DocStoreContext;
    #parentId?: string;
    #childrenIds: string[] = [];

    constructor(
        raw: RawDocPageData,
        storeContext: DocStoreContext
    ) {
        // Initialization
        this.#store = {
            ...cloneDeep(raw),
            resources: resolveResourceInput(raw.resources),
            id: 'unknown',
            inherit: (raw.inherit === true) ? true : false,
            virtual: (raw.virtual === true) ? true : false,
        };
        this.#storeContext = storeContext;

        // Register self
        this.#register();

        // Bind parent
        this.#bindParent();

        // Inherit from user config and parent
        this.#inheritFromParent();
    }

    // Getters
    get title(): string | undefined { return this.#store.title; }
    get space(): string | undefined { return this.#store.space; }
    get order(): number[] { return this.#store.order; }
    get cover(): string | false | undefined { return this.#store.cover; }
    get inherit(): boolean { return this.#store.inherit; }
    get resources(): Record<string, ResourceData> { return this.#store.resources; }
    get treeTitle(): string {
        if (typeof this.#store.treeTitle === 'string') {
            return this.#store.treeTitle;
        } else if (typeof this.#store.treeTitle === 'function') {
            try {
                const title  = this.#store.treeTitle(this);
                if (typeof title === 'string') return title;
            } catch (e) {
                console.error(
                    `[Juicy Theme]Trying to parse treeTitle from doc page data` +
                    `(${this.#store.id}) failed, caught error: ${e}`
                );
            };
        };
        return this.title || this.id;
    }

    get url(): string | undefined { return this.#store.url; }
    get frontmatter(): Record<string, any> | undefined { return this.#store.frontmatter; }

    get parent(): DocPageData | undefined { return this.#parentId ? this.#storeContext.idMap.get(this.#parentId) : undefined; }
    get children(): DocPageData[] {
        return this.#childrenIds
            .map(id => this.#storeContext.idMap.get(id))
            .filter((child): child is DocPageData => child !== undefined);
    }
    get id(): string { return this.#store.id; }
    get isVirtual(): boolean { return this.#store.virtual; }

    // Methods
    #register(): void {
        const baseId = DocPageData.genId(this.#store);
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

    #bindParent() {
        for (let i=1; i<this.order.length; i++) {
            const expectedParentOrder = this.order.slice(0, - i);
            const expectedParentid = DocPageData.genId({
                space: this.#store.space,
                order: expectedParentOrder,
            });
            const parent = this.#storeContext.idMap.get(expectedParentid);

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

            // Inherit resources
            this.#store.resources = mergeResourceData(
                this.#store.resources, parent.resources
            );
        };
    };

    // Static methods
    static genId<T extends { space?: string; order: number[] }>(input: T): string {
        return `doc:${input.space ?? ""}:${input.order.join("/")}`;
    };

    static applyMetaData(target: RawDocPageData, meta: NodeMetadata) {
        // Apply title
        if (
            target.title === undefined &&
            typeof meta.title === 'string'
        ) {
            target.title = meta.title;
        };

        // Apply cover
        if (
            target.cover === undefined &&
            (typeof meta.cover === 'string' || meta.cover === false)
        ) {
            target.cover = meta.cover;
        };

        // Apply inherit
        if (
            target.inherit === undefined &&
            typeof meta.inherit === 'boolean'
        ) {
            target.inherit = true;
        };

        // Apply resources
        if (meta.resources !== undefined) {
            const metaResources = resolveResourceInput(meta.resources);
            const targetResources = resolveResourceInput(target.resources);
            target.resources = mergeResourceData(targetResources, metaResources);
        };

        // Apply treeTitle
        if (
            target.treeTitle === undefined &&
            (typeof meta.treeTitle === 'string' || typeof meta.treeTitle === 'function')
        ) {
            target.treeTitle = meta.treeTitle;
        };
    };

    static applySpaceConfig(dataBase: RawDocPageData[], config: Record<string, SpaceMetaData>) {
        Object.entries(config).forEach(([space, meta]) => {
            if (typeof meta !== 'object' || meta === null) return;

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

    static generateVirtualNodes(dataBase: RawDocPageData[], docConfig: DocDefaultsConfig) {
        const existingNodes: Set<string> = new Set();
        const virtualNodes: RawDocPageData[] = [];

        dataBase.forEach((node) => {
            const id = DocPageData.genId(node);
            if (!existingNodes.has(id)) {
                existingNodes.add(id);
            };
        });

        dataBase.forEach((node) => {
            // Skip nodes that do not allow virtual parents
            if (node.allowVirtualParents === false) return;

            const nodeSpace = node.space;
            const spaceConfig = (
                typeof nodeSpace === 'string' &&
                (typeof docConfig === 'object' && docConfig) &&
                (typeof docConfig[nodeSpace] === 'object' && docConfig[nodeSpace] !== null)
            ) ? docConfig[nodeSpace] : {};

            // Skip nodes whose space is set to disable virtual node generation
            if (node.allowVirtualParents === undefined && !spaceConfig.enableVirtual) return;

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
            };
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

    static processDataBase(dataBase: RawDocPageData[], config: Record<string, SpaceMetaData>) {
        const copy = cloneDeep(dataBase);

        // If no config, return the original dataBase
        if (typeof config !== 'object' || !config) return copy;
        
        // Generate virtual nodes
        DocPageData.generateVirtualNodes(copy, config);

        // Apply space meta data
        if (typeof config === 'object' && config !== null) {
            DocPageData.applySpaceConfig(copy, config);
        }

        // Sort nodes by space/order
        return DocPageData.sortDataBase(copy);
    };
};

export function initVPJDocData(route: Route, siteData): DocData {
    const frontmatter = computed(() => route.data.frontmatter);
    const theme: Ref<ThemeConfig> = computed(() => siteData.value.themeConfig);

    // Get theme config and series config
    const layoutConfig: Ref<VPJDocLayoutConfig> = ref({});
    const docConfig: Ref<Record<string, SpaceMetaData>> = ref({});
    const spaceConfig: Ref<SpaceMetaData> = ref({});

    // Watch theme and frontmatter
    watch([theme, frontmatter], (next, prev) => {
        if (JSON.stringify(next) !== JSON.stringify(prev)) {
            // Update layout config
            layoutConfig.value = theme.value.layouts?.doc || {};

            // Update doc config
            docConfig.value = theme.value.doc || {};

            // Update space config
            if (typeof frontmatter.value.space === 'string' && frontmatter.value.layout === "doc") {
                const name = frontmatter.value.space;
                if (
                    theme.value.doc &&
                    typeof theme.value.doc === 'object'
                ) {
                    spaceConfig.value = theme.value.doc[name] || {};
                };
            };
        };
    }, { immediate: true });

    // Process doc data
    const docDataBase = computed(() => {
        const storeContext: DocStoreContext = {
            idMap: new Map<string, DocPageData>(),
            duplicateCount: new Map<string, number>(),
        };

        const processedData = DocPageData.processDataBase(
            data as RawDocPageData[],
            docConfig.value
        );

        return processedData.map((raw) => new DocPageData(raw, storeContext))
    });

    // Calculate current data
    const currentData = computed(() => {
        if (frontmatter.value.layout === "doc") {
            return docDataBase.value.find((data) => (data.url || undefined) === route.path);
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

    const resources = computed(() => {
        if (frontmatter.value.layout === "doc") {
            return currentData.value?.resources || undefined;
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
                    order: order.value as number[]
                }
            };
        };
        return undefined;
    });

    function filter(callbackFn: (data: DocPageData) => boolean): DocPageData[] {
        if (!callbackFn) return docDataBase.value;
        return docDataBase.value.filter(callbackFn);
    };

    return {
        data: currentData,
        title,
        space,
        order,
        cover,
        resources,
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
    };
    return data;
};