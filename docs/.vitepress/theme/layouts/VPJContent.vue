<script setup>
import { useData } from 'vitepress';

import VPJLayoutNotFound from './VPJLayoutNotFound.vue';
import VPJLayoutPage from './VPJLayoutPage.vue';
import VPJLayoutBlog from './VPJLayoutBlog.vue';
import VPJLayoutDoc from './VPJLayoutDoc.vue';


const { page, frontmatter } = useData();
</script>


<template>
    <div class="vpj-layout-content">
        <VPJLayoutNotFound v-if="page.isNotFound || frontmatter.layout === 'not-found'"/>
        <VPJLayoutPage v-else-if="frontmatter.layout === 'page'">
            <template #page-top><slot name="page-top"/></template>
            <template #page-bottom><slot name="page-bottom"/></template>
            <template #page-padding-left><slot name="page-padding-left"/></template>
            <template #page-padding-right><slot name="page-padding-right"/></template>
        </VPJLayoutPage>
        <VPJLayoutBlog v-else-if="frontmatter.layout === 'blog'">
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
        </VPJLayoutBlog>
        <VPJLayoutDoc v-else-if="frontmatter.layout === 'doc'">
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
        </VPJLayoutDoc>
        <Content v-else/>
    </div>
</template>


<style scoped>
    .vpj-layout-content {
        height: 100%;
        width: 100%;
    }
</style>