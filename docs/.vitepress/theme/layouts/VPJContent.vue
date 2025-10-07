<script setup>
import { useData } from 'vitepress';

import VPJLayoutNotFound from './VPJLayoutNotFound.vue';
import VPJLayoutPage from './VPJLayoutPage.vue';
import VPJLayoutArticle from './VPJLayoutArticle.vue';


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
        <VPJLayoutArticle v-else-if="frontmatter.layout === 'blog' || frontmatter.layout === 'doc'">
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
        </VPJLayoutArticle>
        <Content v-else/>
    </div>
</template>


<style scoped>
    .vpj-layout-content {
        height: 100%;
        width: 100%;
    }
</style>