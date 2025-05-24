<script setup>
import { useData } from 'vitepress';

import VPJLayoutNotFound from './VPJLayoutNotFound.vue';
import VPJLayoutPage from './VPJLayoutPage.vue';
import VPJLayoutBlog from './VPJLayoutBlog.vue';


const { page, frontmatter } = useData();
</script>


<template>
    <div class="vpj-layout-content">
        <VPJLayoutNotFound v-if="page.isNotFound || frontmatter.layout === 'not-found'"/>
        <VPJLayoutPage v-else-if="frontmatter.layout === 'page'">
            <template #page-top><slot name="page-top"/></template>
            <template #page-bottom><slot name="page-bottom"/></template>
            <template #page-gutter-left><slot name="page-gutter-left"/></template>
            <template #page-gutter-right><slot name="page-gutter-right"/></template>
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
        <Content v-else/>
    </div>
</template>


<style scoped>
    .vpj-layout-content {
        height: 100%;
        width: 100%;
    }
</style>