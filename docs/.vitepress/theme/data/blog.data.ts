import { createContentLoader } from "vitepress";

import { processBlogOrder, resolveNavigationInput } from "../utils/common";


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
            .filter((raw) => raw.frontmatter.layout === "blog")
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
                // Process next&prev
                let next = resolveNavigationInput(raw.frontmatter.next);
                let prev = resolveNavigationInput(raw.frontmatter.prev);
                
                return {
                    ...raw,
                    url: encodeURI(raw.url),
                    excerpt: undefined,
                    title,
                    series: (typeof raw.frontmatter.series === 'string' && raw.frontmatter.series.length > 0)
                        ? raw.frontmatter.series
                        : undefined,
                    tags: Array.isArray(raw.frontmatter.tags)
                        ? raw.frontmatter.tags.filter((tag) => typeof tag === "string" && tag.length > 0)
                        : [],
                    order: processBlogOrder(raw.frontmatter.order),
                    cover: (typeof raw.frontmatter.cover === "string" || raw.frontmatter.cover === false)
                        ? raw.frontmatter.cover
                        : undefined,
                    listTitle: (typeof raw.frontmatter.listTitle === 'string')
                        ? raw.frontmatter.listTitle
                        : undefined,
                    next,
                    prev,
                };
            });
    },
})