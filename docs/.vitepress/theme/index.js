// https://vitepress.dev/guide/custom-theme
import Layout from "./Layout.vue";
import "./styles/var.css";
import "./styles/general.css";


/** @type {import('vitepress').Theme} */
export default {
  Layout,
  enhanceApp({ app, router, siteData }) {
    if (typeof document !== "undefined") {
      const portalRoot = document.createElement("div");
      portalRoot.className = "vpj-portals-root";
      document.body.appendChild(portalRoot);
    }
  }
}

