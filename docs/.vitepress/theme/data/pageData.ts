import { cloneDeep } from 'lodash-es';

import { data as history } from './history.data';
import { isObject, isNumber, isStringFalse, isString, isFunction, isBoolean } from '../utils/common';
import { resourceMerger } from '../utils/mergeData';

import type { ThemeConfig } from '../types';
import type {
    RawBaseData,
    RawPageData,
    RawBlogData,
    RawDocData,
    RawArticleData,
    ResourceInput
} from '../types/common';


function genId<T extends {order: number[]}>(item: T) {
    return item.order.join("/");
};
function dictionarySorting(idA: string, idB: string) {
    const orderA = idA.split("/").map(Number);
    const orderB = idB.split("/").map(Number);
    for (let i = 0; i < Math.min(orderA.length, orderB.length); i++) {
        if (orderA[i] !== orderB[i]) return orderA[i] - orderB[i];
    };
    return orderA.length - orderB.length;
};
function deepFreeze<T extends object>(obj: T): T {
    Object.freeze(obj);
    for (const key of Object.keys(obj)) {
        const value = (obj as any)[key];
        if (value && typeof value === 'object' && !Object.isFrozen(value)) {
            deepFreeze(value);
        }
    };
    return obj;
};


class VPJBaseData {
    #frontmatter?: Record<string, any>;
    #title?: string;
    #url?: string;
    #createdAt?: Date;
    #lastUpdated?: Date;

    constructor(raw: RawBaseData) {
        this.#frontmatter = raw.frontmatter;
        this.#title = raw.title;
        this.#url = raw.url;
        this.#createdAt = isNumber(raw.createdAt) ? new Date(raw.createdAt) : undefined;
        this.#lastUpdated = isNumber(raw.lastUpdated) ? new Date(raw.lastUpdated) : undefined;
    };

    // Getter
    get frontmatter() { return this.#frontmatter; };
    get title() { return this.#title; };
    get url() { return this.#url; };

    get createdAt() { return this.#createdAt; };
    get lastUpdated() { return this.#lastUpdated; };
};

export class VPJPageData extends VPJBaseData{
    #layout: "page" = "page";

    constructor(raw: RawPageData) {
        super(raw);
    };

    // Getter
    get layout() { return this.#layout; };

    toJSON() {
        return {
            layout: this.layout,
            title: this.title,
            url: this.url,
            createdAt: this.createdAt?.toISOString(),
            lastUpdated: this.lastUpdated?.toISOString()
        };
    };
};

export class VPJArticleData extends VPJBaseData {
    #cover?: string;
    #next: { text?: string; link?: string; } | { text: false, link: false };
    #prev: { text?: string; link?: string; } | { text: false, link: false };

    constructor(raw: RawArticleData) {
        super(raw);
        this.#cover = (raw.cover === false) ? undefined : raw.cover;
        this.#next = Object.freeze((raw.next === false) ? { text: false, link: false } : raw.next);
        this.#prev = Object.freeze((raw.prev === false) ? { text: false, link: false } : raw.prev);
    };

    // Getter
    get cover() { return this.#cover };
    get next() { return this.#next };
    get prev() { return this.#prev };
};

export class VPJBlogData extends VPJArticleData {
    #layout: "blog" = "blog";
    #series?: string;
    #order: number;
    #tags: string[];
    #listTitle?: string | ((data: VPJBlogData) => string | undefined);

    #cache: {
        listTitle?: string;
    } = {};

    constructor(raw: RawBlogData) {
        super(raw);
        this.#series = raw.series;
        this.#order = raw.order;
        this.#tags = Array.from(new Set(raw.tags));
        this.#listTitle = raw.listTitle;
    };

    // Getter
    get layout() { return this.#layout; };
    get series() { return this.#series; };
    get order() { return this.#order; };
    get tags() { return [...this.#tags]; };
    get listTitle() {
        if (this.#cache.listTitle !== undefined) return this.#cache.listTitle;
        if (isString(this.#listTitle)) {
            this.#cache.listTitle = this.#listTitle;
        } else if (isFunction(this.#listTitle)) {
            try {
                const result = this.#listTitle(this);
                this.#cache.listTitle = isString(result) ? result : (this.title || "");
            } catch(e) {
                console.warn(`Failed to parse the list title, returned the default value: ${e}`);
                this.#cache.listTitle = this.title || "";
            };
        } else {
            this.#cache.listTitle = this.title || "";
        };
        return this.#cache.listTitle;
    };

    toJSON() {
        return {
            layout: this.layout,
            title: this.title,
            url: this.url,
            series: this.series,
            order: this.order,
            tags: this.tags,
            cover: this.cover,
            next: this.next,
            prev: this.prev,
            createdAt: this.createdAt?.toISOString(),
            lastUpdated: this.lastUpdated?.toISOString()
        };
    }
};

export class VPJDocData extends VPJArticleData {
    #layout: "doc" = "doc";
    #space?: string;
    #order: number[];
    #resources: Record<string, ResourceInput>;
    #virtual?: boolean;
    #treeTitle?: string | ((data: VPJDocData) => string | undefined);
    #childrenIds: string[];
    #parentId?: string;
    #spaceIdMap: Map<string, Map<string, VPJDocData[]>>;

    #cache: {
        treeTitle?: string;
    } = {};

    constructor(raw: RawDocData, spaceIdMap: Map<string, Map<string, VPJDocData[]>>) {
        super(raw);
        this.#space = raw.space;
        this.#order = raw.order;
        this.#resources = deepFreeze(resourceMerger(...raw.resourcesList));
        this.#virtual = raw.virtual;
        this.#treeTitle = raw.treeTitle;
        this.#childrenIds = raw.children;
        this.#parentId = raw.parent;
        this.#spaceIdMap = spaceIdMap;
    };

    // Getter
    get layout() { return this.#layout; };
    get space() { return this.#space; };
    get order() { return [...this.#order]; };
    get resources() { return this.#resources; };
    get virtual() { return this.#virtual; };
    get treeTitle() {
        if (this.#cache.treeTitle !== undefined) return this.#cache.treeTitle;
        if (isString(this.#treeTitle)) {
            this.#cache.treeTitle = this.#treeTitle;
        } else if (isFunction(this.#treeTitle)) {
            try {
                const result = this.#treeTitle(this);
                this.#cache.treeTitle = isString(result) ? result : (this.title || "");
            } catch(e) {
                console.warn(`Failed to parse the tree title, returned the default value: ${e}`);
                this.#cache.treeTitle = this.title || "";
            };
        } else {
            this.#cache.treeTitle = this.title || "";
        };
        return this.#cache.treeTitle;
    };
    get children() {
        if (!this.#childrenIds.length) return [];
        return this.#childrenIds.flatMap((id) => {
            const arr = this.#spaceIdMap.get(this.#space ?? "")?.get(id);
            return Array.isArray(arr) ? arr : [];
        });
    };
    get parent() {
        if (!this.#parentId) return undefined;
        const parentIdMap = this.#spaceIdMap.get(this.#space ?? "")?.get(this.#parentId);
        if (!parentIdMap) return undefined;
        const currentId = genId({order: this.order});
        return parentIdMap.find(parent => parent.#childrenIds.includes(currentId));
    };

    toJSON() {
        return {
            layout: this.layout,
            title: this.title,
            url: this.url,
            space: this.space,
            order: this.order,
            virtual: this.virtual,
            cover: this.cover,
            next: this.next,
            prev: this.prev,
            resources: this.resources,
            treeTitle: this.treeTitle,
            createdAt: this.createdAt?.toISOString(),
            lastUpdated: this.lastUpdated?.toISOString()
        };
    };

    getAncestors(): VPJDocData[] {
        const ancestors: VPJDocData[] = [];
        let currentParent = this.parent;
        while (currentParent) {
            ancestors.unshift(currentParent);
            currentParent = currentParent.parent;
        };
        return ancestors;
    };
};

export class VPJDataStore {
    #allNode: (VPJPageData | VPJDocData | VPJBlogData)[] = [];
    #urlMap: Map<string, VPJPageData | VPJDocData | VPJBlogData> = new Map();
    #spaceIdMap: Map<string, Map<string, VPJDocData[]>> = new Map();
    #seriesMap: Map<string, VPJBlogData[]> = new Map();

    constructor(
        raw: (RawPageData | RawBlogData | RawDocData)[],
        config: ThemeConfig
    ) {
        const copy = cloneDeep(raw);
        const processed = VPJDataStore.#processRaw(copy, config);
        this.#createSpaceIdMaps(processed);
        this.#initializeData(processed);
    };

    static #processRaw(
        raw: (RawPageData | RawBlogData | RawDocData)[],
        config: ThemeConfig
    ) {
        // History
        const hProcessed = VPJDataStore.#bindHistory(raw);

        const pageList = hProcessed.filter((data) => data.layout === "page");
        const blogList = hProcessed.filter((data) => data.layout === "blog");
        const docList = hProcessed.filter((data) => data.layout === "doc");

        // Navigation
        VPJDataStore.#buildBlogNavigation(blogList as RawBlogData[], config);
        VPJDataStore.#buildDocHierarchy(docList as RawDocData[], config);

        // Config
        VPJDataStore.#applyBlogConfig(blogList as RawBlogData[], config);
        VPJDataStore.#applyDocConfig(docList as RawDocData[], config);

        return [
            ...pageList,
            ...blogList,
            ...docList,
        ];
    };

    // Method
    #createSpaceIdMaps(processed: (RawPageData | RawBlogData | RawDocData)[]) {
        const docRaws = processed.filter((data) => data.layout === "doc");
        for (const data of docRaws) {
            const spaceName = data.space ?? "";
            if (!this.#spaceIdMap.has(spaceName)) this.#spaceIdMap.set(spaceName, new Map());
            const id = genId(data);
            const idMap = this.#spaceIdMap.get(spaceName);
            if (!idMap?.has(id)) idMap?.set(id, []);
        };
    };

    #initializeData(processed: (RawPageData | RawBlogData | RawDocData)[]): void{
        for (const raw of processed) {
            let instance: VPJPageData | VPJBlogData | VPJDocData;

            switch (raw.layout) {
                case "page":
                    instance = new VPJPageData(raw);
                    break;
                case "blog":
                    instance = new VPJBlogData(raw);
                    const seriesName = raw.series ?? "";
                    if (!this.#seriesMap.has(seriesName)) this.#seriesMap.set(seriesName, []);
                    this.#seriesMap.get(seriesName)?.push(instance);
                    break;
                case "doc":
                    instance = new VPJDocData(raw, this.#spaceIdMap);
                    const spaceName = raw.space ?? "";
                    const id = genId(raw);
                    this.#spaceIdMap.get(spaceName)?.get(id)?.push(instance);
            };

            if (isString(instance.url)) this.#urlMap.set(instance.url, instance);
            this.#allNode.push(instance);
        };
    };

    // Static
    static #applyBlogConfig(raw: RawBlogData[], config: ThemeConfig) {
        const layout = isObject(config.layouts?.blog) ? config.layouts.blog : {};
        const specific = isObject(config.blog) ? config.blog : {};
        for (const data of raw) {
            const series = (isString(data.series) && isObject(specific[data.series])) ? specific[data.series] : {};
            // cover
            data.cover = (data.cover === undefined)
                ? isStringFalse(series.cover)
                    ? series.cover
                    : isStringFalse(layout.cover)
                        ? layout.cover
                        : undefined
                : data.cover;
            // presetTags
            if (Array.isArray(series.presetTags)) {
                const presetTags = series.presetTags.filter((t) => isString(t) && t.length > 0);
                data.tags = [...presetTags, ...data.tags];
            };
            // listTitle
            data.listTitle = (data.listTitle === undefined)
                ? (isString(series.listTitle) || isFunction(series.listTitle))
                    ? series.listTitle
                    : undefined
                : data.listTitle;
        };
    };

    static #applyDocConfig(raw: RawDocData[], config: ThemeConfig) {
        const layout = isObject(config.layouts?.doc) ? config.layouts.doc : {};
        const specfic = isObject(config.doc) ? config.doc : {};

        const spaceIndex: Map<string, Map<string, RawDocData[]>> = new Map();

        for (const data of raw) {
            const spaceName = isString(data.space) ? data.space : "";
            const id = genId(data);
            if (!spaceIndex.has(spaceName)) spaceIndex.set(spaceName, new Map());
            if (!spaceIndex.get(spaceName)?.get(id)) spaceIndex.get(spaceName)?.set(id, []);
            spaceIndex.get(spaceName)?.get(id)?.push(data);
        };

        for (const [spaceName, idIndex] of spaceIndex) {
            if (spaceName === "") continue;

            // nodeMeta
            const space = (isObject(specfic[spaceName])) ? specfic[spaceName] : {};
            const meta = (isObject(space.nodeMeta)) ? space.nodeMeta : {};
            const dfsRoot: {children: string[]} = {children: []}
            for (const [id, datas] of idIndex) {
                if (datas[0].parent === undefined) dfsRoot.children.push(id);

                if (!(id in meta)) continue;

                const metaConfig = isObject(meta[id]) ? meta[id] : {};
                for (const data of datas) {
                    data.cover = (data.cover === undefined && isStringFalse(metaConfig.cover))
                        ? metaConfig.cover
                        : data.cover;
                    data.inherit = (data.inherit === undefined && isBoolean(metaConfig.inherit))
                        ? metaConfig.inherit
                        : data.inherit;
                    data.title = (data.title === undefined && isString(metaConfig.title))
                        ? metaConfig.title
                        : data.title;
                    data.treeTitle = (data.treeTitle === undefined && (isString(metaConfig.treeTitle) || isFunction(metaConfig.treeTitle)))
                        ? metaConfig.treeTitle
                        : data.treeTitle;
                    if (isObject(metaConfig.resources)) data.resourcesList.push(metaConfig.resources);
                };
            };

            // inherit
            const dfsStack: RawDocData[] = [
                ...dfsRoot.children.flatMap((id) => (idIndex.get(id) as RawDocData[])).reverse()
            ];
            while (dfsStack.length) {
                const current = dfsStack.pop();
                if (current?.inherit && current?.parent) {
                    let parent = (idIndex.get(current.parent) as RawDocData[])[0];
                    current.cover = (current.cover === undefined && isString(parent.cover))
                        ? parent.cover
                        : current.cover;
                    current.resourcesList.push(...parent.resourcesList);
                };
                if (current?.children.length) {
                    dfsStack.push(...current.children.flatMap((id) => (idIndex.get(id) as RawDocData[])).reverse())
                };
            };

            // global config
            for (const [,datas] of idIndex) {
                for (const data of datas) {
                    data.cover = (data.cover === undefined)
                        ? isStringFalse(space.cover)
                            ? space.cover
                            : isStringFalse(layout.cover)
                                ? layout.cover
                                : undefined
                        : data.cover;
                    data.inherit = (data.inherit === undefined && isBoolean(space.inherit))
                        ? space.inherit
                        : data.inherit;
                    data.treeTitle = (data.treeTitle === undefined && (isString(space.treeTitle) || isFunction(space.treeTitle)))
                        ? space.treeTitle
                        : data.treeTitle;
                    if (isObject(space.resources)) data.resourcesList.push(space.resources);
                };
            };
        };

        // global config(doc without space)
        if (spaceIndex.has("")) {
            spaceIndex.get("")?.forEach((datas) => {
                for (const data of datas) {
                    data.cover = (data.cover === undefined && isStringFalse(layout.cover))
                        ? layout.cover
                        : data.cover;
                };
            });
        };
    };

    static #buildBlogNavigation(raw: RawBlogData[], config: ThemeConfig) {
        const layout = isObject(config.layouts?.blog) ? config.layouts.blog : {};
        const specfic = isObject(config.blog) ? config.blog : {};

        const seriesIndex: Map<string, RawBlogData[]> = new Map();

        raw.forEach((data) => {
            if (!isString(data.series)) return;
            if (!seriesIndex.has(data.series)) seriesIndex.set(data.series, []);
            seriesIndex.get(data.series)?.push(data);
        });

        const globalNextPrev = isBoolean(layout.autoNextPrev) 
            ? layout.autoNextPrev
            : isBoolean(config.autoNextPrev)
                ? config.autoNextPrev
                : true;

        seriesIndex.forEach((datas, seriesName) => {
            const series = isObject(specfic[seriesName]) ? specfic[seriesName] : {};
            const autoNextPrev = isBoolean(series.autoNextPrev) ? series.autoNextPrev : globalNextPrev;
            if (!autoNextPrev) return;

            datas.sort((a, b) => a.order - b.order)
                .forEach((data, index) => {
                    if (index !== 0 && isObject(data.prev)) {
                        const prev = datas[index - 1];
                        data.prev = {
                            text: isString(data.prev.text) ? data.prev.text : prev.title,
                            link: isString(data.prev.link) ? data.prev.link : prev.url,
                        };
                    };

                    if (index !== datas.length - 1 && isObject(data.next)) {
                        const next = datas[index + 1];
                        data.next = {
                            text: isString(data.next.text) ? data.next.text : next.title,
                            link: isString(data.next.link) ? data.next.link : next.url,
                        };
                    };
                });
        });
    };

    static #buildDocHierarchy(raw: RawDocData[], config: ThemeConfig) {
        const layout = isObject(config.layouts?.doc) ? config.layouts.doc : {};
        const specfic = isObject(config.doc) ? config.doc : {};

        const spaceIndex: Map<string, Map<string, RawDocData[]>> = new Map();

        // build id map
        for (const data of raw) {
            if (!data.space) continue;
            const id = genId(data);
            if (!spaceIndex.has(data.space)) spaceIndex.set(data.space, new Map());
            if (!spaceIndex.get(data.space)?.get(id)) spaceIndex.get(data.space)?.set(id, []);
            spaceIndex.get(data.space)?.get(id)?.push(data);
        };

        const virtuals: RawDocData[] = [];
        const globalVirtual = isBoolean(config.enableVirtual) ? config.enableVirtual : false;
        const globalNextPrev = isBoolean(layout.autoNextPrev)
            ? layout.autoNextPrev
            : isBoolean(config.autoNextPrev)
                ? config.autoNextPrev
                : true;
        for (const [spaceName, idIndex] of spaceIndex) {
            const space = isObject(specfic[spaceName]) ? specfic[spaceName] : {};
            const enableVirtual = isBoolean(space.enableVirtual) ? space.enableVirtual : globalVirtual;
            const autoNextPrev = isBoolean(space.autoNextPrev) ? space.autoNextPrev : globalNextPrev;
            const realNodeIds = Array.from(idIndex.keys());

            for (const id of realNodeIds) {
                const datas = (idIndex.get(id) as RawDocData[]);
                const allowed = isBoolean(datas[0].allowVirtualParents) ? datas[0].allowVirtualParents : enableVirtual;
                if (!allowed) continue;

                // generate virtual parent nodes
                const expectedParent = [ ...datas[0].order ];
                while (expectedParent.length > 1) {
                    expectedParent.pop();
                    const expectedParentId = genId({order: expectedParent});
                    if (Array.isArray(idIndex.get(expectedParentId)) && idIndex.get(expectedParentId)?.length) break;

                    const virtual = {
                        layout: "doc" as "doc",
                        space: spaceName,
                        frontmatter: {},
                        order: expectedParent,
                        next: {},
                        prev: {},
                        resourcesList: [],
                        children: [],
                        virtual: true,
                    };
                    idIndex.set(expectedParentId, [virtual]);
                    virtuals.push(virtual);
                };
            };

            // bind parent-child
            const dfsRoot: {children: string[]} = {children: []};
            for (const [id, datas] of idIndex) {
                const expectedParent = [ ...datas[0].order ];
                let isRoot = true;
                while (expectedParent.length > 1) {
                    expectedParent.pop();
                    const expectedParentId = genId({order: expectedParent});
                    if (idIndex.has(expectedParentId)) {
                        isRoot = false;
                        datas.forEach((data) => {
                            data.parent = expectedParentId;
                        });
                        const parentData = (idIndex.get(expectedParentId) as RawDocData[])[0];
                        if (!parentData.children.includes(id)) parentData.children.push(id);
                        break;
                    };
                };
                if (isRoot) dfsRoot.children.push(id);
            };

            for (const [_, datas] of idIndex) datas[0].children.sort(dictionarySorting);

            // bind next-prev
            if (!autoNextPrev) continue;
            dfsRoot.children.sort(dictionarySorting);
            const dfsStack: RawDocData[] = [
                ...dfsRoot.children.flatMap((id) => (idIndex.get(id) as RawDocData[])).reverse()
            ];
            let prevReal: RawDocData | undefined = undefined;

            while (dfsStack.length) {
                const current = dfsStack.pop();
                if (!current?.virtual) {
                    if (isObject(current?.prev)) {
                        current.prev = {
                            text: isString(current.prev.text) ? current.prev.text : prevReal?.title,
                            link: isString(current.prev.link) ? current.prev.link : prevReal?.url,
                        };
                    };
                    if (isObject(prevReal?.next)) {
                        prevReal.next = {
                            text: isString(prevReal.next.text) ? prevReal.next.text : current?.title,
                            link: isString(prevReal.next.link) ? prevReal.next.link : current?.url,
                        };
                    };
                    prevReal = current;
                };
                if (current?.children.length) {
                    dfsStack.push(...current.children.flatMap((id) => (idIndex.get(id) as RawDocData[])).reverse())
                };
            };
        };

        raw.push(...virtuals);
    };

    static #bindHistory(raw: (RawPageData | RawBlogData | RawDocData)[]) {
        if (Object.keys(history).length === 0) return raw;
        const result: (RawPageData | RawBlogData | RawDocData)[] = [];
        for (const data of raw) {
            if (!data.url) continue;
            const log = history[data.url];
            const product = { ...data };
            if (Array.isArray(log?.history) && log.history.length > 0) {
                product.createdAt = (product.createdAt === undefined) ? log.history[log.history.length - 1].time : product.createdAt;
                product.lastUpdated = (product.lastUpdated === undefined) ? log.history[0].time : product.lastUpdated;
            };
            result.push(product);
        };
        return result;
    };

    // Public
    getAllData() { return this.#allNode; };
    getAllPage() { return this.#allNode.filter((data) => data.layout === "page") };
    getAllBlog() { return this.#allNode.filter((data) => data.layout === "blog") };
    getAllDoc() { return this.#allNode.filter((data) => data.layout === "doc") };

    getDataByUrl(url: string) { return this.#urlMap.get(url) };
    getBlogBySeries(series: string) { return this.#seriesMap.get(series) || [] };
    getDocBySpace(space: string) { return Array.from(this.#spaceIdMap.get(space)?.values() || []).flat() };

    filter(predicate: (value: VPJPageData | VPJDocData | VPJBlogData, index: number, array: (VPJPageData | VPJDocData | VPJBlogData)[]) => boolean) {
        return this.#allNode.filter(predicate);
    };
    pageFilter(predicate: (value: VPJPageData, index: number, array: VPJPageData[]) => boolean) {
        return this.getAllPage().filter(predicate);
    };
    blogFilter(predicate: (value: VPJBlogData, index: number, array: VPJBlogData[]) => boolean) {
        return this.getAllBlog().filter(predicate);
    };
    docFilter(predicate: (value: VPJDocData, index: number, array: VPJDocData[]) => boolean) {
        return this.getAllDoc().filter(predicate);
    };
};