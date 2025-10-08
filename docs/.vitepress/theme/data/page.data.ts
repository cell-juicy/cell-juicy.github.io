import { createContentLoader } from "vitepress";
import { JSDOM } from "jsdom";
import { processDocOrder, processBlogOrder, isObject, isString, isFalse, isStringFalse } from "../utils/common";

import type {
    RawPageData,
    RawBlogData,
    RawDocData
} from '../types/common';


declare const data: (RawPageData|RawBlogData|RawDocData)[];
export { data };


function resolveNavigation(input: any) {
    if (isFalse(input)) return input;
    if (typeof input === 'object') return {
        text: isString(input.text) ? input.text : undefined,
        link: isString(input.link) ? input.link : undefined,
    };
    return {};
};

const IGNORE_CLASS_RE = /header-anchor|ignore-header/i;
function resolveTitle(title: string | undefined) {
    if (!isString(title)) return "";

    const dom = new JSDOM(title)
    const root = dom.window.document.body.firstElementChild;
    let result = "";

    if (!root) return result;
    for (const node of root.childNodes) {
        if (node.nodeType === 1) {
            const el = node as HTMLElement;
            if (IGNORE_CLASS_RE.test(el.className)) continue;
            result += el.textContent || "";
        } else if (node.nodeType === 3) {
            result += node.textContent;
        };
    };

    return result.trim();
};


export default createContentLoader("**/*.md", {
    excerpt(file, options) {
        const mdMatch = file.content.match(/^#\s+(.+?)\s*$/m)
        if (mdMatch) file.excerpt = mdMatch[1];
        return;
    },
    transform(rawData): (RawPageData|RawBlogData|RawDocData)[] {
        return rawData
            .filter((raw) => ["page", "blog", "doc"].includes(
                isString(raw.frontmatter.layout) ? raw.frontmatter.layout : ""
            ))
            .map((raw) => {
                // Process title
                let title: string | undefined;
                if (isString(raw.frontmatter.title)) {
                    title = `<p>${raw.frontmatter.title}</p>`;
                } else if (isString(raw.excerpt)) {
                    title = raw.excerpt;
                };

                // Process lastUpdated&createdAt
                const lastUpdated = isFalse(raw.frontmatter.lastUpdated)
                    ? raw.frontmatter.lastUpdated
                    : (raw.frontmatter.lastUpdated instanceof Date && !isNaN(raw.frontmatter.lastUpdated.getTime()))
                        ? raw.frontmatter.lastUpdated.getTime()
                        : undefined;
                const createdAt = isFalse(raw.frontmatter.createdAt)
                    ? raw.frontmatter.createdAt
                    : (raw.frontmatter.createdAt instanceof Date && !isNaN(raw.frontmatter.createdAt.getTime()))
                        ? raw.frontmatter.createdAt.getTime()
                        : undefined;

                const baseData = {
                    url: encodeURI(raw.url),
                    frontmatter: raw.frontmatter,
                    title: resolveTitle(title),
                    lastUpdated,
                    createdAt,
                };

                if (raw.frontmatter.layout === "page") return {
                    ...baseData,
                    layout: "page",
                };

                // Process next&prev
                const articleBase = {
                    cover: isStringFalse(raw.frontmatter.cover)
                        ? raw.frontmatter.cover
                        : undefined,
                    next: resolveNavigation(raw.frontmatter.next),
                    prev: resolveNavigation(raw.frontmatter.prev),
                };

                if (raw.frontmatter.layout === "blog") return {
                    ...baseData,
                    ...articleBase,
                    layout: "blog",
                    series: (isString(raw.frontmatter.series) && raw.frontmatter.series.length > 0)
                        ? raw.frontmatter.series
                        : undefined,
                    tags: Array.isArray(raw.frontmatter.tags)
                        ? raw.frontmatter.tags.filter((tag) => isString(tag) && tag.length > 0)
                        : [],
                    order: processBlogOrder(raw.frontmatter.order),
                    listTitle: isString(raw.frontmatter.listTitle)
                        ? raw.frontmatter.listTitle
                        : undefined,
                } as RawBlogData;

                return {
                    ...baseData,
                    ...articleBase,
                    layout: "doc",
                    space: (isString(raw.frontmatter.space) && raw.frontmatter.space.length > 0)
                        ? raw.frontmatter.space
                        : undefined,
                    order: processDocOrder(raw.frontmatter.order),
                    inherit: (raw.frontmatter.inherit === undefined)
                        ? undefined
                        : !!raw.frontmatter.inherit,
                    resourcesList: isObject(raw.frontmatter.resources) ? [raw.frontmatter.resources]: [],
                    treeTitle: isString(raw.frontmatter.treeTitle)
                        ? raw.frontmatter.treeTitle
                        : undefined,
                    allowVirtualParents: (raw.frontmatter.allowVirtualParents === undefined)
                        ? undefined
                        : !!raw.frontmatter.allowVirtualParents,
                    children: [],
                    virtual: false,
                } as RawDocData;
            });
    },
});