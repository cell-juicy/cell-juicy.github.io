import { createContentLoader } from "vitepress";

import { processBlogOrder } from "../utils/common";


export default createContentLoader("**/*.md", {
    includeSrc: true,
    render: true,
    transform(rawData) {
        return rawData
            .filter((raw) => raw.frontmatter.layout === "blog")
            .map((raw) => {
                return {
                    // @ts-ignore
                    title: raw.src.match(/^#\s+(.+)/m) ? raw.src.match(/^#\s+(.+)/m)[1] : "",
                    series: typeof raw.frontmatter.series === 'string' ? raw.frontmatter.series : undefined,
                    tags: Array.isArray(raw.frontmatter.tags)
                        ? raw.frontmatter.tags.filter((tag) => typeof tag === "string" && tag.length > 0)
                        : [],
                    order: processBlogOrder(raw.frontmatter.order),
                    cover: (typeof raw.frontmatter.cover === "string" || raw.frontmatter.cover === false)
                        ? raw.frontmatter.cover
                        : undefined,
                    ...raw
                }
            });
    },
})