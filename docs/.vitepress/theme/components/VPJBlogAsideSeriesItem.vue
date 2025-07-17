<script setup>
import { useRoute } from 'vitepress';

import VPJTag from './VPJTag.vue';

import VPJIconBlogPencil from '../components/icons/VPJIconBlogPencil.vue';


const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

const route = useRoute();
</script>


<template>
    <a
        :key="props.data.url"
        :href="props.data.url"
        :class="[
            'vpj-layout-blog__aside-blog',
            {'current': route.path === props.data.url}
        ]"
    >
        <div class="vpj-layout-blog__aside-blog-cover">
            <img v-if="props.data.cover" :src="props.data.cover" alt="Blog Cover" class="vpj-layout-blog__aside-blog-cover-image">
            <VPJIconBlogPencil v-else class="vpj-layout-blog__aside-blog-cover-default" />
        </div>
        <div class="vpj-layout-blog__aside-blog-info">
            <div class="vpj-layout-blog__aside-blog-title vpj-text">
                {{ props.data.title }}
            </div>
            <div class="vpj-layout-blog__aside-blog-tagboxmask">
                <div class="vpj-layout-blog__aside-blog-tagbox vpj-scroll-x">
                    <div class="vpj-layout-blog__aside-blog-taglist">
                        <VPJTag v-for="tag in props.data.tags" :key="tag" :tag="tag"/>
                    </div>
                </div>
            </div>
        </div>
    </a>
</template>


<style scoped>
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