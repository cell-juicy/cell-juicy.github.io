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
                        <VPJDynamicIconBtn
                            :icon="VPJIconAngleSquareRight"
                            class="vpj-layout-blog__aside-toggle"
                        />
                    </div>
                    <article class="vpj-layout-blog__article">
                        <Content class="vpj-markdown"/>
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
        background-color: transparent;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        height: 100%;
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
        width: 48px;
    }

    .vpj-layout-blog__aside-controler:hover {
        opacity: 1;
    }

    .vpj-layout-blog__aside-toggle {
        align-items: center;
        background-color: var(--vpj-color-bg-100);
        border-radius: var(--vpj-border-radius-100);
        height: 32px;
        margin: 8px;
        padding: 8px;
        position: sticky;
        top: 8px;
        width: 32px;
    }

    .vpj-layout-blog__aside-toggle :deep(.vpj-icon) {
        fill: var(--vpj-color-text-300);
        height: 16px;
        width: 16px;
    }

    .vpj-layout-blog__aside-toggle:hover,
    .vpj-layout-blog__aside-toggle:active {
        background-color: var(--vpj-color-bg-300);
    }

    .vpj-layout-blog__aside-toggle:hover :deep(.vpj-icon),
    .vpj-layout-blog__aside-toggle:active :deep(.vpj-icon) {
        fill: var(--vpj-color-text-400);
    }

    .vpj-layout-blog__article {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-between;
        padding-left: 6rem;
        padding-right: calc(6rem + 48px);
    }

    @media screen and (max-width: 1024px) {
        .vpj-layout-blog__article {
            padding-left: 2rem;
            padding-right: calc(2rem + 48px);
        }
    }

    @media screen and (max-width: 768px) {
        .vpj-layout-blog__aside-controler {
            display: none;
        }

        .vpj-layout-blog__article {
            padding-left: 1rem;
            padding-right: 1rem;
        }
    }
</style>