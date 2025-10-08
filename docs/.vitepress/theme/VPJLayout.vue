<script setup>
import { useRoute } from 'vitepress';
import { nextTick, watch, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';

import { useVPJLayout } from './composables/useVPJLayout';
import { useVPJSidebar } from './composables/useVPJSidebar';

import VPJSidebar from './components/VPJSidebar.vue';
import VPJMobileNavbar from './components/VPJMobileNavbar.vue';
import VPJPanel from './components/VPJPanel.vue';

import VPJContent from './layouts/VPJContent.vue';


function scrollToAnchor() {
    if (!window) return;
    const hash = window.location.hash;
    if (hash !== "") {
        nextTick(() => {
            const target = document.getElementById(decodeURIComponent(hash.substring(1)));
            if (target) target.scrollIntoView({ behavior: "smooth" });
        });
    };
};


const route = useRoute();
const layoutStore = useVPJLayout();
const sidebarStore = useVPJSidebar();
const { panelCollapsed } = storeToRefs(layoutStore);
const { collapsed: sidebarCollapsed } = storeToRefs(sidebarStore);

const stopAnchorWatcher = watch(route, scrollToAnchor);
const stopPanelWatcher = watch(panelCollapsed, (newState) => {
    if (!newState && !sidebarCollapsed.value) sidebarStore.close();
});
const stopSidebarWatcher = watch(sidebarCollapsed, (newState) => {
    if (!newState && !panelCollapsed.value) layoutStore.panelClose();
});

onMounted(() => {
    setTimeout(scrollToAnchor, 200)
    window.addEventListener("hashchange", scrollToAnchor)
});

onUnmounted(() => {
    window.removeEventListener("hashchange", scrollToAnchor)
    stopAnchorWatcher();
    stopPanelWatcher();
    stopSidebarWatcher();
});
</script>


<template>
    <div class="vpj-layout__root">
        <VPJSidebar>
            <template #sidebar-top><slot name="sidebar-top"/></template>
            <template #sidebar-header><slot name="sidebar-header"/></template>
            <template #sidebar-header-top><slot name="sidebar-header-top"/></template>
            <template #sidebar-header-bottom><slot name="sidebar-header-bottom"/></template>
            <template #sidebar-nav><slot name="sidebar-nav"/></template>
            <template #sidebar-nav-top><slot name="sidebar-nav-top"/></template>
            <template #sidebar-nav-bottom><slot name="sidebar-nav-bottom"/></template>
            <template #sidebar-footer><slot name="sidebar-footer"/></template>
            <template #sidebar-footer-top><slot name="sidebar-footer-top"/></template>
            <template #sidebar-footer-bottom><slot name="sidebar-footer-bottom"/></template>
            <template #sidebar-bottom><slot name="sidebar-bottom"/></template>
        </VPJSidebar>
        <div class="vpj-layout__main">
            <VPJMobileNavbar>
                <template #mobile-nav-content><slot name="mobile-nav-content"/></template>
            </VPJMobileNavbar>
            <VPJContent>
                <template #page-top><slot name="page-top"/></template>
                <template #page-bottom><slot name="page-bottom"/></template>
                <template #page-padding-left><slot name="page-padding-left"/></template>
                <template #page-padding-right><slot name="page-padding-right"/></template>
                <template #article-header><slot name="article-header"/></template>
                <template #article-header-before><slot name="article-header-before"/></template>
                <template #article-header-between><slot name="article-header-between"/></template>
                <template #article-header-after><slot name="article-header-after"/></template>
                <template #article-aside><slot name="article-aside"/></template>
                <template #article-cover><slot name="article-cover"/></template>
                <template #article-controler><slot name="article-controler"/></template>
                <template #article-top><slot name="article-top"/></template>
                <template #article-bottom><slot name="article-bottom"/></template>
                <template #article-padding-left><slot name="article-padding-left"/></template>
                <template #article-padding-right><slot name="article-padding-right"/></template>
            </VPJContent>
        </div>
        <VPJPanel>
        </VPJPanel>
    </div>
</template>


<style scoped>
    .vpj-layout__root {
        display: flex;
        flex-direction: row;
        height: 100vh;
        width: 100vw;
    }

    .vpj-layout__main {
        display: flex;
        flex: 1;
        flex-direction: column;
        height: 100%;
    }
</style>