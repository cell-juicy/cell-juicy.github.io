<script setup>
import { useData } from 'vitepress';

import VPJLayoutNotFound from './VPJLayoutNotFound.vue';
import VPJLayoutPage from './VPJLayoutPage.vue';


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
        <Content v-else/>
    </div>
</template>


<style scoped>
    .vpj-layout-content {
        height: 100%;
        width: 100%;
    }
</style>