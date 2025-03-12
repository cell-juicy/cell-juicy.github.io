<script setup>
import { useData, Content } from 'vitepress';
import { computed } from 'vue';

import VPJSidebar from './components/VPJSidebar.vue';
import VPJMobileNavbar from './components/VPJMobileNavbar.vue';

import VPJLayoutNotFound from './layouts/VPJLayoutNotFound.vue';
import VPJLayoutPage from './layouts/VPJLayoutPage.vue';


const { page, frontmatter } = useData();
const activeLayout = computed(() => {
    if (page.value.isNotFound) return VPJLayoutNotFound;
    switch (frontmatter.value.layout) {
        case 'not-found':
            return VPJLayoutNotFound;
        case 'page':
            return VPJLayoutPage
        default:
            return Content
    }
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
            <component :is="activeLayout"/>
        </div>
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