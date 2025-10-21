<script setup>
import { useRoute } from 'vitepress';

import VPJTag from './VPJTag.vue';
import VPJOverlayScrollArea from './VPJOverlayScrollArea.vue';

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
            'vpj-article-aside__aside-blog',
            {'current': route.path === props.data.url}
        ]"
    >
        <div class="vpj-article-aside__aside-blog-cover">
            <img v-if="props.data.cover" :src="props.data.cover" alt="Blog Cover" class="vpj-article-aside__aside-blog-cover-image">
            <VPJIconBlogPencil v-else class="vpj-article-aside__aside-blog-cover-default" />
        </div>
        <div class="vpj-article-aside__aside-blog-info">
            <div class="vpj-article-aside__aside-blog-title vpj-text">
                {{ props.data.listTitle }}
            </div>
            <VPJOverlayScrollArea
                v-if="Array.isArray(props?.data?.tags) && props?.data?.tags?.length !== 0"
                overflow="x"
                thumb-width=3
                :inner-attrs="{class: 'vpj-article-aside__aside-blog-taglist'}"
                class="vpj-article-aside__aside-blog-tagboxmask"
            >
                <VPJTag v-for="tag in props.data.tags" :key="tag" :tag="tag"/>
            </VPJOverlayScrollArea>
        </div>
    </a>
</template>


<style scoped>
    /* Blog item */
    .vpj-article-aside__aside-blog {
        align-items: center;
        background: var(--vpj-article-aside-tab-series-item-bg);
        border: var(--vpj-article-aside-tab-series-item-border);
        border-radius: var(--vpj-article-aside-tab-series-item-radius);
        box-shadow: var(--vpj-article-aside-tab-series-item-shadow);
        display: flex;
        height: var(--vpj-article-aside-tab-series-item-height);
        flex: 0 0 auto;
        gap: var(--vpj-article-aside-tab-series-item-gap);
        padding-inline: var(--vpj-article-aside-tab-series-item-padding-x);
        text-decoration: none;
        transition:
            box-shadow var(--vpj-article-aside-tab-series-transition),
            color var(--vpj-article-aside-tab-series-transition),
            transform var(--vpj-article-aside-tab-series-transition);
    }

    .vpj-article-aside__aside-blog:hover {
        background: var(--vpj-article-aside-tab-series-item-bg-hover);
        border: var(--vpj-article-aside-tab-series-item-border-hover);
        box-shadow: var(--vpj-article-aside-tab-series-item-shadow-hover);
        transform: var(--vpj-article-aside-tab-series-item-transform-hover);
    }

    .vpj-article-aside__aside-blog:active {
        background: var(--vpj-article-aside-tab-series-item-bg-hover);
        border: var(--vpj-article-aside-tab-series-item-border-hover);
        box-shadow: var(--vpj-article-aside-tab-series-item-shadow-active);
        transform: var(--vpj-article-aside-tab-series-item-transform-active);
    }

    /* Current item */
    .vpj-article-aside__aside-blog.current {
        border: var(--vpj-article-aside-tab-series-item-border-current);
    }

    /* Cover */
    .vpj-article-aside__aside-blog-cover {
        align-items: center;
        display: flex;
        flex-shrink: 0;
        height: var(--vpj-article-aside-tab-series-item-cover-height);
        justify-content: center;
        width: var(--vpj-article-aside-tab-series-item-cover-width);
    }

    /* Cover(image input from data) */
    .vpj-article-aside__aside-blog-cover-image {
        border: var(--vpj-article-aside-tab-series-item-cover-border);
        border-radius: var(--vpj-article-aside-tab-series-item-cover-radius);
        height: 100%;
        object-fit: cover;
        object-position: center;
        width: 100%;
    }

    .vpj-article-aside__aside-blog.current .vpj-article-aside__aside-blog-cover-image {
        border: var(--vpj-article-aside-tab-series-item-cover-border-current);
    }

    /* Cover(default icon) */
    .vpj-article-aside__aside-blog-cover-default {
        fill: var(--vpj-article-aside-tab-series-item-color);
        height: var(--vpj-article-aside-tab-series-item-cover-icon-size);
        margin: auto;
        width: var(--vpj-article-aside-tab-series-item-cover-icon-size);
    }

    .vpj-article-aside__aside-blog:hover .vpj-article-aside__aside-blog-cover-default,
    .vpj-article-aside__aside-blog:active .vpj-article-aside__aside-blog-cover-default {
        fill: var(--vpj-article-aside-tab-series-item-color-hover);
    }

    /* Current blog cover(default icon) */
    .vpj-article-aside__aside-blog.current .vpj-article-aside__aside-blog-cover-default {
        fill: var(--vpj-article-aside-tab-series-item-color-current);
    }

    .vpj-article-aside__aside-blog.current:hover .vpj-article-aside__aside-blog-cover-default,
    .vpj-article-aside__aside-blog.current:active .vpj-article-aside__aside-blog-cover-default {
        fill: var(--vpj-article-aside-tab-series-item-color-current-hover);
    }

    .vpj-article-aside__aside-blog-info {
        display: flex;
        flex: 1;
        flex-direction: column;
    }

    .vpj-article-aside__aside-blog-title {
        color: var(--vpj-article-aside-tab-series-item-color);
        flex-shrink: 0;
        font-size: var(--vpj-article-aside-tab-series-item-title-size);
        font-weight: var(--vpj-article-aside-tab-series-item-title-weight);
        line-height: var(--vpj-article-aside-tab-series-item-title-line-height);
        padding: var(--vpj-article-aside-tab-series-item-title-padding);
    }

    .vpj-article-aside__aside-blog:hover .vpj-article-aside__aside-blog-title,
    .vpj-article-aside__aside-blog:active .vpj-article-aside__aside-blog-title {
        color: var(--vpj-article-aside-tab-series-item-color-hover);
    }

    .vpj-article-aside__aside-blog.current .vpj-article-aside__aside-blog-title {
        color: var(--vpj-article-aside-tab-series-item-color-current);
    }

    .vpj-article-aside__aside-blog.current:hover .vpj-article-aside__aside-blog-title,
    .vpj-article-aside__aside-blog.current:active .vpj-article-aside__aside-blog-title {
        color: var(--vpj-article-aside-tab-series-item-color-current-hover);
    }

    .vpj-article-aside__aside-blog-tagboxmask {
        display: flex;
        flex-shrink: 0;
        flex-wrap: nowrap;
        margin-inline: var(--vpj-article-aside-tab-series-item-tagbox-margin-x);
        mask-image: var(--vpj-article-aside-tab-series-item-tagbox-mask);
    }

    :deep(.vpj-article-aside__aside-blog-taglist) {
        display: flex;
        flex-direction: row;
        flex-shrink: 0;
        flex-wrap: nowrap;
        gap: var(--vpj-article-aside-tab-series-item-taglist-gap);
        padding: var(--vpj-article-aside-tab-series-item-taglist-padding);
    }
</style>