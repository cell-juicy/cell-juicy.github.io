<script setup>
import { useRoute } from 'vitepress';
import { nextTick, watch, onMounted, onUnmounted } from 'vue';

import VPJSidebar from './components/VPJSidebar.vue';
import VPJMobileNavbar from './components/VPJMobileNavbar.vue';

import VPJContent from './layouts/VPJContent.vue';


function scrollToAnchor() {
    if (window) {
        const hash = window.location.hash;
        if (hash !== "") {
            nextTick(() => {
                const target = document.getElementById(decodeURIComponent(hash.substring(1)));
                if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                };
            });
        };
    };
};


const route = useRoute();
const stopAnchorWatcher = watch(route, scrollToAnchor);


onMounted(() => {
    setTimeout(scrollToAnchor, 200)
    window.addEventListener("hashchange", scrollToAnchor)
})

onUnmounted(() => {
    window.removeEventListener("hashchange", scrollToAnchor)
    stopAnchorWatcher();
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
                <template #blog-header><slot name="blog-header"/></template>
                <template #blog-header-before><slot name="blog-header-before"/></template>
                <template #blog-header-between><slot name="blog-header-between"/></template>
                <template #blog-header-after><slot name="blog-header-after"/></template>
                <template #blog-aside><slot name="blog-aside"/></template>
                <template #blog-cover><slot name="blog-cover"/></template>
                <template #blog-controler><slot name="blog-controler"/></template>
                <template #blog-top><slot name="blog-top"/></template>
                <template #blog-bottom><slot name="blog-bottom"/></template>
                <template #blog-padding-left><slot name="blog-padding-left"/></template>
                <template #blog-padding-right><slot name="blog-padding-right"/></template>
                <template #doc-header><slot name="doc-header"/></template>
                <template #doc-header-before><slot name="doc-header-before"/></template>
                <template #doc-header-between><slot name="doc-header-between"/></template>
                <template #doc-header-after><slot name="doc-header-after"/></template>
                <template #doc-aside><slot name="doc-aside"/></template>
                <template #doc-cover><slot name="doc-cover"/></template>
                <template #doc-controler><slot name="doc-controler"/></template>
                <template #doc-top><slot name="doc-top"/></template>
                <template #doc-bottom><slot name="doc-bottom"/></template>
                <template #doc-padding-left><slot name="doc-padding-left"/></template>
                <template #doc-padding-right><slot name="doc-padding-right"/></template>
            </VPJContent>
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