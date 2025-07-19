<script setup>
import { useBlogData } from '../composables/useBlogData';

import VPJTag from './VPJTag.vue';
import VPJOverlayScrollArea from './VPJOverlayScrollArea.vue';


const { tags } = useBlogData();
</script>


<template>
    <VPJOverlayScrollArea
        overflow="y"
        class="vpj-layout-blog__aside-tab-outer"
        :inner-attrs="{ class: 'vpj-layout-blog__aside-tab-inner' }"
    >
        <div class="vpj-layout-blog__aside-blog-tags">
            <VPJTag
                v-for="tag in tags"
                :key="tag"
                :tag="tag"
            />
        </div>
    </VPJOverlayScrollArea>
</template>


<style scoped>
    .vpj-layout-blog__aside-tab-outer {
        background-color: var(--vpj-color-bg-100);
        height: 100%;
        width: 100%;
    }

    :deep(.vpj-layout-blog__aside-tab-inner) {
        align-items: center;
        display: flex;
        flex-direction: column;
    }

    .vpj-layout-blog__aside-blog-tags {
        align-content: flex-start;
        column-gap: .25rem;
        display: flex;
        flex-wrap: wrap;
        padding: .75rem .5rem;
        row-gap: .5rem;
        width: 100%;
    }
</style>