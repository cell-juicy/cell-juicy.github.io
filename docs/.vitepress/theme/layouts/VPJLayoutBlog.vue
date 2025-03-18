<script setup>
import VPJBlogAside from '../components/VPJBlogAside.vue';
import VPJBlogHeader from '../components/VPJBlogHeader.vue';
import VPJCoverImage from '../components/VPJCoverImage.vue';
import VPJDynamicIconBtn from '../components/VPJDynamicIconBtn.vue';

import VPJIconAngleSquareLeft from '../components/icons/VPJIconAngleSquareLeft.vue';
import VPJIconAngleSquareRight from '../components/icons/VPJIconAngleSquareRight.vue';
</script>


<template>
    <div class="vpj-layout-blog">
        <VPJBlogHeader/>
        <main class="vpj-layout-blog__main">
            <VPJBlogAside/>
            <div class="vpj-layout-blog__wrapper">
                <VPJCoverImage/>
                <div class="vpj-layout-blog__container">
                    <div class="vpj-layout-blog__aside-controler">
                        <VPJDynamicIconBtn :icon="VPJIconAngleSquareLeft"/>
                    </div>
                    <article class="vpj-layout-blog__article">
                        <Content class="vpj-layout-blog__content vpj-markdown"/>
                    </article>
                </div>
            </div>
        </main>
    </div>
</template>


<style scoped>
    .vpj-layout-blog {
        background-color: var(--vpj-color-bg-100);
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
    }

    .vpj-layout-blog__main {
        display: flex;
        flex: 1;
        flex-direction: row;
        width: 100%;
    }

    .vpj-layout-blog__wrapper {
        display: flex;
        flex: 1;
        flex-direction: column;
        height: 100%;
        overflow: auto;
        scrollbar-color: var(--vpj-color-text-100) var(--vpj-color-bg-200);
        scrollbar-gutter: auto;
    }

    .vpj-layout-blog__container {
        display: flex;
        flex: 1;
        flex-direction: row;
        min-height: min-content;
        width: 100%;
    }

    .vpj-layout-blog__aside-controler {
        background-color: lightyellow;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        width: 48px;
        height: 100%
    }

    .vpj-layout-blog__article {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-between;
        padding-left: 6rem;
        padding-right: calc(6rem + 60px);
    }

    .vpj-layout-blog__content {
        
    }

    @media screen and (max-width: 1024px) {
        .vpj-layout-blog__article {
            padding-left: 2rem;
            padding-right: calc(2rem + 60px);
        }
    }

    @media screen and (max-width: 768px) {
        .vpj-layout-blog__article {
            padding-left: 1rem;
            padding-right: calc(1rem + 60px);
        }
    }
</style>