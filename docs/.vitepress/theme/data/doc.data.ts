import { createContentLoader } from "vitepress";

import { processDocOrder } from "../utils/common";


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
                    space: typeof raw.frontmatter.space === 'string' ? raw.frontmatter.space : undefined,
                    order: processDocOrder(raw.frontmatter.order),
                    cover: (typeof raw.frontmatter.cover === "string" || raw.frontmatter.cover === false)
                        ? raw.frontmatter.cover
                        : undefined,
                    ...raw
                }
            });
    },
})