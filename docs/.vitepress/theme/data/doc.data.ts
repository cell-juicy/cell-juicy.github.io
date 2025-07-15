import { createContentLoader } from "vitepress";
import { processDocOrder, any2Number } from "../utils/common";

import type { ResourceInput, ResourceData } from "../types/common";
import { content, end } from "happy-dom/lib/PropertySymbol.js";


export default createContentLoader("**/*.md", {
    excerpt(file, options) {
        const mdMatch = file.content.match(/^#\s+(.+?)\s*$/m)
        if (mdMatch) {
            file.excerpt = mdMatch[1]
            return
        }

        const htmlMatch = file.content.match(/<h1[^>]*>([^<]+)<\/h1>/i)
        if (htmlMatch) {
            file.excerpt = htmlMatch[1]
            return
        }
        return
    },
    transform(rawData) {
        return rawData
            .filter((raw) => raw.frontmatter.layout === "doc")
            .map((raw) => {
                // Process title
                let title: string | undefined;
                if (typeof raw.frontmatter.title === 'string') {
                    title = raw.frontmatter.title;
                } else if (typeof raw.excerpt === 'string') {
                    title = raw.excerpt;
                    let safety = 0;
                    let prev: string;
                    do {
                        prev = title;
                        title = title.replace(/<([a-zA-Z][a-zA-Z0-9]*)[^>]*>([\s\S]*?)<\/\1>/g, (m, t, c) => c);
                    } while (prev !== title && ++safety < 10);
                    title = title.replace(/<[a-zA-Z][a-zA-Z0-9]*\s*[^>]*?\/>/g, '');
                };
                
                // Filter resources
                const rawResources: Record<string, ResourceInput> = 
                    (typeof raw.frontmatter.resources === 'object' && raw.frontmatter.resources !== null)
                        ? raw.frontmatter.resources
                        : {};
                const resources: Record<string, ResourceData> = {};

                Object.entries(rawResources).forEach(([key, value]) => {
                    if (value === false) {
                        resources[key] = { url: false };
                    } else if (typeof value === 'string') {
                        resources[key] = {
                            url: value,
                            label: value
                        }
                    } else if (typeof value === 'object') {
                        resources[key] = {
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
                        }
                    }
                })

                return {
                    ...raw,
                    url: encodeURI(raw.url),
                    excerpt: undefined,
                    title,
                    space: (typeof raw.frontmatter.space === 'string' && raw.frontmatter.space.length > 0)
                        ? raw.frontmatter.space
                        : undefined,
                    order: processDocOrder(raw.frontmatter.order),
                    cover: (typeof raw.frontmatter.cover === 'string' || raw.frontmatter.cover === false)
                        ? raw.frontmatter.cover
                        : undefined,
                    inherit: (raw.frontmatter.inherit === undefined)
                        ? undefined
                        : !!raw.frontmatter.inherit,
                    resources,
                    treeTitle: (typeof raw.frontmatter.treeTitle === 'string')
                        ? raw.frontmatter.treeTitle
                        : undefined,
                    allowVirtualParents: (raw.frontmatter.allowVirtualParents === undefined)
                        ? undefined
                        : !!raw.frontmatter.allowVirtualParents,
                }
            })
    },
})