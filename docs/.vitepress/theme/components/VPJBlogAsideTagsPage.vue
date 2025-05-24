<script setup>
import { ref } from 'vue';

import { useBlogData } from '../composables/useBlogData';

import VPJTag from './VPJTag.vue';


const { tags, blogData } = useBlogData();
</script>


<template>
    <div class="vpj-layout-blog__aside-tab-page vpj-scroll-xy">
        <VPJTag
            v-for="tag in tags"
            :tag="tag"
            :callback="(tag) => console.log(tag)"
        />
        <pre>{{ JSON.stringify(blogData, null, 2) }}</pre>
    </div>
</template>


<style scoped>
    .vpj-layout-blog__aside-tab-page {
        align-content: flex-start;
        column-gap: .25rem;
        display: flex;
        flex-wrap: wrap;
        height: 100%;
        padding: .75rem .5rem;
        row-gap: .5rem;
        width: 100%;
    }

    .vpj-layout-blog__aside-tag {
        align-items: center;
        background-color: var(--vpj-color-primary-100);
        border-radius: 1rem;
        display: flex;
        height: 2rem;
        padding-left: 1rem;
        padding-right: 1rem;
        width: auto;
    }

    .vpj-layout-blog__aside-tag:hover {
        background-color: var(--vpj-color-primary-200);
    }

    .vpj-layout-blog__aside-tag:active {
        background-color: var(--vpj-color-primary-300);
    }

    .vpj-layout-blog__aside-tag .vpj-text {
        color: var(--vpj-color-primary-500);
        font-size: .75rem;
    }

    .vpj-layout-blog__aside-tag:hover .vpj-text,
    .vpj-layout-blog__aside-tag:active .vpj-text{
        color: var(--vpj-color-primary-600);
    }
</style>