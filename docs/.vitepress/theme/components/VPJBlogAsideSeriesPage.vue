<script setup>
import { ref } from 'vue';

import VPJBlogTag from './VPJBlogTag.vue';

import VPJIconBlogPencil from './icons/VPJIconBlogPencil.vue';


const Rem = parseFloat(getComputedStyle(document.documentElement).fontSize);

function getVisibleTags(tags) {
    let tagLength = 0;
    for (let i=0; i < tags.length; i++) {
        tagLength += (tags[i].length * 0.75 + 1.25) * Rem;
        if (tagLength > 240 - Rem * 6) {
            if (i === 0) return { list: tags.slice(0, i + 1), ellipsis: true}
            else return { list: tags.slice(0, i), ellipsis: true}
        };
    }
    return { list: tags, ellipsis: false}
}


const articles = [
    { title: "示例1", cover: "/assets/birthday.jpg", tags: ["标签1", "标签2"] },
    { title: "示例2", cover: "/assets/night.jpg", tags: ["标签1", "标签2", "标签3"] },
    { title: "示例3", tags: ["测试标签1", "老表啊", "超级长的一个tag啊啊啊啊啊啊啊啊"] },
    { title: "示例4", cover: "/assets/work.png", tags: ["测试标签1", "标签2"] },
    { title: "示例5", tags: ["Vue3", "Vitepress", "响应式设计", "前端开发"] },
    { title: "示例6", cover: "/assets/background.jpg", tags: ["JavaScript", "TypeScript", "Node.js"] },
    { title: "示例7", tags: ["CSS Tricks", "Flex布局", "Grid布局", "动画效果"] },
    { title: "示例8", cover: "/assets/mountain.jpg", tags: ["UI/UX", "设计系统", "Figma"] },
    { title: "示例9", tags: ["性能优化", "Webpack", "Vite", "打包配置"] },
    { title: "示例10", cover: "/assets/code.jpg", tags: ["算法", "数据结构", "LeetCode"] }
]
</script>


<template>
    <div class="vpj-layout-blog__aside-tab-page vpj-scroll-y">
        <a
            v-for="article in articles"
            :key="article.title"
            class="vpj-layout-blog__aside-blog"
        >
            <div class="vpj-layout-blog__aside-blog-cover">
                <img v-if="article.cover" :src="article.cover" alt="" class="vpj-layout-blog__aside-blog-cover-image">
                <VPJIconBlogPencil v-else class="vpj-layout-blog__aside-blog-cover-default" />
            </div>
            <div class="vpj-layout-blog__aside-blog-info">
                <div class="vpj-layout-blog__aside-blog-title vpj-text">{{ article.title }}</div>
                <div class="vpj-layout-blog__aside-blog-tags">
                    <VPJBlogTag v-for="tag in getVisibleTags(article.tags).list" :key="tag" :tag="tag"/>
                    <span v-if="getVisibleTags(article.tags).ellipsis">...</span>
                </div>
            </div>
        </a>
    </div>
</template>


<style scoped>
    .vpj-layout-blog__aside-tab-page {
        align-content: flex-start;
        column-gap: .25rem;
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: .75rem .5rem;
        row-gap: .5rem;
        width: 100%;
    }

    .vpj-layout-blog__aside-blog {
        align-items: center;
        background-color: lightcyan;
        border-radius: var(--vpj-border-radius-200);
        display: flex;
        height: 5rem;
        flex: 0 0 auto;
        gap: 10px;
        margin-left: 6px;
        margin-right: 6px;
        padding: .5rem;
    }

    .vpj-layout-blog__aside-blog-cover {
        flex-shrink: 0;
        height: 4rem;
        width: 4rem;
    }

    .vpj-layout-blog__aside-blog-cover-image {
        border-radius: var(--vpj-border-radius-100);
        height: 100%;
        object-fit: cover;
        object-position: center center;
        width: 100%;
    }

    .vpj-layout-blog__aside-blog-cover-default {
        fill: var(--vpj-color-text-300);
        height: 50%;
        margin: 25%;
        width: 50%;
    }

    .vpj-layout-blog__aside-blog-info {
        display: flex;
        flex: 1;
        flex-direction: column;
        height: 4rem;
    }

    .vpj-layout-blog__aside-blog-title {
        color: var(--vpj-color-text-300);
        font-size: 1rem;
        font-weight: bold;
        line-height: 1;
        margin-bottom: .5rem;
        margin-top: .5rem;
        padding-left: .5rem;
    }

    .vpj-layout-blog__aside-blog-tags {
        display: flex;
        gap: .25rem;
    }
</style>