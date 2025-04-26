import { createContentLoader } from "vitepress";

import { processOrder } from "../utils/common";


export default createContentLoader("**/*.md", {
    includeSrc: true,
    render: true,
    transform(rawData) {
        return rawData
            .filter((raw) => raw.frontmatter.layout === "blog")
            .map((raw) => {
                return {
                    series: typeof raw.frontmatter.series === 'string' ? raw.frontmatter.series : undefined,
                    tags: Array.isArray(raw.frontmatter.tags)
                        ? raw.frontmatter.tags.filter((tag) => typeof tag === "string" && tag.length > 0)
                        : [],
                    order: processOrder(raw.frontmatter.order),
                    ...raw
                }
            });
    },
})