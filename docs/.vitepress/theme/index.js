// https://vitepress.dev/guide/custom-theme
import VPJLayout from "./VPJLayout.vue";

// ThemeConfig type
// import type { ThemeConfig } from "./type";

// Pinia
import { createPinia } from "pinia";

// Global stylesheet
import "./styles/var.css";
import "./styles/general.css";


/** @type {import('vitepress').Theme} */
export default {
    Layout: VPJLayout,
    enhanceApp({ app, router, siteData }) {
        // Pinia
        const pinia = createPinia();
        app.use(pinia);

        // Add portal root element for VuePortals
        if (typeof document !== "undefined") {
            const portalRoot = document.createElement("div");
            portalRoot.className = "vpj-portals-root";
            document.body.appendChild(portalRoot);
        }

        // Add custom global components
        const icons = import.meta.glob('./components/icons/*.vue');
        for (const path in icons) {
            const name = path.split('/').pop().replace('.vue', '');
            icons[path]().then((module) => {
                app.component(name, module.default || module);
            });
        }
    }
}

