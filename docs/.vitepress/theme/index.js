// https://vitepress.dev/guide/custom-theme
import VPJLayout from "./VPJLayout.vue";

// ThemeConfig type
// import type { ThemeConfig } from "./type";

// Pinia
import { createPinia } from "pinia";

// Unhead
import { createHead } from "@unhead/vue/client";

// Global stylesheet
import "./styles/var.css";
import "./styles/general.css";
import "./styles/markdown.css"


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
    }
}

