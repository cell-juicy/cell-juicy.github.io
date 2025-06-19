// https://vitepress.dev/guide/custom-theme
import VPJLayout from "./VPJLayout.vue";

// ThemeConfig type
// import type { ThemeConfig } from "./type";

// Blog Data
import { initVPJBlogData } from "./composables/useBlogData";
import { VPJ_BLOG_DATA_SYMBOL } from "./utils/symbols";

// Doc Data
import { initVPJDocData } from "./composables/useDocData";
import { VPJ_DOC_DATA_SYMBOL } from "./utils/symbols";

// Pinia
import { createPinia } from "pinia";

// Unhead
import { createHead } from "@unhead/vue/client";

// Global stylesheet
import "./styles/var.css";
import "./styles/general.css";
import "./styles/markdown.css";


/** @type {import('vitepress').Theme} */
export default {
    Layout: VPJLayout,
    enhanceApp: async ({ app, router, siteData }) => {
        // Pinia support
        const pinia = createPinia();
        app.use(pinia);

        // Unhead support
        const head = createHead();
        app.use(head);

        // Add portal root element for VuePortals
        if (typeof document !== "undefined") {
            const portalRoot = document.createElement("div");
            portalRoot.className = "vpj-portals-root";
            document.body.appendChild(portalRoot);
        }

        // Initialize and provide blog data
        const blogData = initVPJBlogData(router.route, siteData);
        app.provide(VPJ_BLOG_DATA_SYMBOL, blogData);

        // Initialize and provide doc data
        const docData = initVPJDocData(router.route, siteData);
        app.provide(VPJ_DOC_DATA_SYMBOL, docData);

        // Add custom global components
        const icons = import.meta.glob('./components/icons/*.vue');
        const iconPromises = Object.entries(icons).map(async ([path, loader]) => {
            const name = path.split('/').pop().replace('.vue', '');
            const module = await loader();
            app.component(name, module.default || module);
        });
        await Promise.all(iconPromises);

        // custom component(page-layout)
        const VPJHeroImageModule = await import('./components/VPJHeroImage.vue');
        app.component('VPJHeroImage', VPJHeroImageModule.default);

        // custom component(blog-layout)
        const VPJTagModule = await import('./components/VPJTag.vue');
        app.component('VPJTag', VPJTagModule.default);
    }
}

