import { createContentLoader } from "vitepress";
import { processDocOrder, any2Number } from "../utils/common";

import type { ResourceInput, ResourceData } from "../types/common";


export default createContentLoader("**/*.md", {
    includeSrc: true,
    render: true,
    transform(rawData) {
        return rawData
            .filter((raw) => raw.frontmatter.layout === "doc")
            .map((raw) => {
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
                    // @ts-ignore
                    title: raw.src.match(/^#\s+(.+)/m) ? raw.src.match(/^#\s+(.+)/m)[1] : undefined,
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
                }
            })
    },
})