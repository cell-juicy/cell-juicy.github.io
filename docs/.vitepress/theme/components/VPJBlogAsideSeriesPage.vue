<script setup>
import { useRoute } from 'vitepress';
import { computed } from 'vue';

import { useBlogData } from '../composables/useBlogData';

import VPJTag from './VPJTag.vue';

import VPJIconBlogPencil from './icons/VPJIconBlogPencil.vue';


const { filter, series } = useBlogData();
const route = useRoute();

const articles = computed(() => filter((data) => data.series === series.value).sort((a, b) => a.order - b.order))
</script>


<template>
    <div class="vpj-layout-blog__aside-tab-page vpj-scroll-y">
        <a
            v-for="article in articles"
            :key="article.url"
            :href="article.url"
            :class="[
                'vpj-layout-blog__aside-blog',
                {'current': route.path === article.url}
            ]"
        >
            <div class="vpj-layout-blog__aside-blog-cover">
                <img v-if="article.cover" :src="article.cover" alt="Blog Cover" class="vpj-layout-blog__aside-blog-cover-image">
                <VPJIconBlogPencil v-else class="vpj-layout-blog__aside-blog-cover-default" />
            </div>
            <div class="vpj-layout-blog__aside-blog-info">
                <div class="vpj-layout-blog__aside-blog-title vpj-text">
                    {{ article.title }}
                </div>
                <div class="vpj-layout-blog__aside-blog-tagboxmask">
                    <div class="vpj-layout-blog__aside-blog-tagbox vpj-scroll-x">
                        <div class="vpj-layout-blog__aside-blog-taglist">
                            <VPJTag v-for="tag in article.tags" :key="tag" :tag="tag"/>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    </div>
</template>


<style scoped>
    .vpj-layout-blog__aside-tab-page {
        align-content: flex-start;
        background-color: var(--vpj-color-bg-100);
        column-gap: .25rem;
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: .75rem .5rem;
        row-gap: .5rem;
        width: 100%;
    }

    /* Blog item */
    .vpj-layout-blog__aside-blog {
        align-items: center;
        background-color: var(--vpj-color-bg-100);
        border-color: var(--vpj-color-border-200);
        border-width: var(--vpj-border-width-200);
        border-radius: var(--vpj-border-radius-200);
        box-shadow: var(--vpj-shadow-200);
        color: var(--vpj-color-text-300);
        display: flex;
        height: 5rem;
        flex: 0 0 auto;
        gap: 10px;
        margin-left: 6px;
        margin-right: 6px;
        padding: .5rem;
        text-decoration: none;
        transition:
            box-shadow 0.3s ease,
            color 0.3s ease
            transform 0.3s ease;
    }

    .vpj-layout-blog__aside-blog:hover {
        color: var(--vpj-color-text-500);
        transform: scale(1.02);
    }

    .vpj-layout-blog__aside-blog:active {
        color: var(--vpj-color-text-500);
        box-shadow: none;
        transform: none;
    }

    /* Current item */
    .vpj-layout-blog__aside-blog.current {
        color: var(--vpj-color-primary-400);
    }

    .vpj-layout-blog__aside-blog.current:hover {
        color: var(--vpj-color-primary-500);
    }

    .vpj-layout-blog__aside-blog.current:active {
        color: var(--vpj-color-primary-300);
    }

    /* Cover */
    .vpj-layout-blog__aside-blog-cover {
        flex-shrink: 0;
        height: 4rem;
        width: 4rem;
    }

    /* Cover(image input from data) */
    .vpj-layout-blog__aside-blog-cover-image {
        border-radius: var(--vpj-border-radius-100);
        height: 100%;
        object-fit: cover;
        object-position: center center;
        width: 100%;
    }

    /* Cover(default icon) */
    .vpj-layout-blog__aside-blog-cover-default {
        fill: var(--vpj-color-text-300);
        height: 50%;
        margin: 25%;
        width: 50%;
    }

    .vpj-layout-blog__aside-blog:hover .vpj-layout-blog__aside-blog-cover-default {
        fill: var(--vpj-color-text-500);
    }

    .vpj-layout-blog__aside-blog:active .vpj-layout-blog__aside-blog-cover-default {
        fill: var(--vpj-color-text-500);
    }

    /* Current blog cover(default icon) */
    .vpj-layout-blog__aside-blog.current .vpj-layout-blog__aside-blog-cover-default {
        fill: var(--vpj-color-primary-400);
    }

    .vpj-layout-blog__aside-blog.current:hover .vpj-layout-blog__aside-blog-cover-default {
        fill: var(--vpj-color-primary-500);
    }

    .vpj-layout-blog__aside-blog.current:active .vpj-layout-blog__aside-blog-cover-default {
        fill: var(--vpj-color-primary-300);
    }

    .vpj-layout-blog__aside-blog-info {
        display: flex;
        flex: 1;
        flex-direction: column;
        height: 4rem;
    }

    .vpj-layout-blog__aside-blog-title {
        flex-shrink: 0;
        font-size: 1rem;
        font-weight: bold;
        height: 2rem;
        line-height: 1.5rem;
        margin-bottom: .25rem;
        margin-top: .25rem;
        padding-left: .25rem;
    }

    .vpj-layout-blog__aside-blog-tagboxmask {
        display: flex;
        flex-shrink: 0;
        flex-wrap: nowrap;
        height: 2rem;
        mask-image: linear-gradient(
            to right,
            transparent,
            black .3rem,
            black calc(100% - .3rem),
            transparent
        );
    }

    .vpj-layout-blog__aside-blog-tagbox {
        margin-top: .1rem;
        height: 100%;
        width: 100%;
        overflow-y: hidden;
        visibility: hidden;
    }

    .vpj-layout-blog__aside-blog-taglist,
    .vpj-layout-blog__aside-blog-tagbox:hover,
    .vpj-layout-blog__aside-blog-tagbox:focus {
        visibility: visible;
    }

    .vpj-layout-blog__aside-blog-taglist {
        display: flex;
        flex-direction: row;
        flex-shrink: 0;
        flex-wrap: nowrap;
        gap: .25rem;
        padding-left: .4rem;
        padding-right: .4rem;
    }
</style>