<script setup>
import { useData } from 'vitepress';
import { computed } from 'vue';

import VPJDynamicIcon from '../components/VPJDynamicIcon.vue';
import VPJIconCrossCircle from '../components/icons/VPJIconCrossCircle.vue';


const { site, theme, frontmatter, page } = useData();
const computedContent = computed(() => {
    const linkRaw = theme.value.layouts?.notFound?.contentLink ?? {text: '返回主页', link: '/'};
    const linkData = {};
    if (typeof linkRaw === 'string') {
        linkData.text = linkRaw;
        linkData.href = '/'
    } else if (linkRaw && typeof linkRaw === 'object') {
        linkData.text = linkRaw.text ?? '返回主页';
        linkData.href = linkRaw.link ?? '/';
    } else {
        linkData.text = '返回主页';
        linkData.href = '/';
    }
    return {
        icon: theme.value.layouts?.notFound?.contentIcon ?? VPJIconCrossCircle,
        title: theme.value.layouts?.notFound?.contentTitle ?? '页面未找到',
        text: theme.value.layouts?.notFound?.contentText ?? '很抱歉，您尝试访问的页面不存在或可能已被删除。',
        link: linkData
    }
})
</script>


<template>
    <div class="vpj-layout-notfound">
        <div class="vpj-layout-notfound__content">
            <VPJDynamicIcon
                :icon="computedContent.icon"
                class="vpj-layout-notfound__content-icon"
            />
            <div class="vpj-layout-notfound__content-title">
                {{ computedContent.title }}
            </div>
            <div class="vpj-layout-notfound__content-text">
                {{ computedContent.text}}
            </div>
            <a
                class="vpj-layout-notfound__content-link"
                :href="computedContent.link.href"
            >
                <span class="vpj-text">
                    {{ computedContent.link.text }}
                </span>
            </a>
        </div>
    </div>
</template>


<style scoped>
    /* Main layout */
    .vpj-layout-notfound {
        align-items: center;
        background-color: var(--vpj-color-bg-100);
        display: flex;
        flex: 1;
        height: 100%;
        width: 100%;
    }

    .vpj-layout-notfound__content {
        align-items: center;
        border: 0;
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: .5rem;
        height: 100%;
        justify-content: center;
        margin-left: auto;
        margin-right: auto;
        min-height: 0;
        min-width: 0;
        max-width: 32rem;
        padding: 2rem;
        text-align: center;
    }

    /* Icon */
    .vpj-layout-notfound__content-icon {
        fill: var(--vpj-color-danger-300);
        height: 1.5rem;
        margin-bottom: .5rem;
        width: 1.5rem;
    }

    /* Title */
    .vpj-layout-notfound__content-title {
        color: var(--vpj-color-text-500);
        font-size: 1rem;
        font-weight: var(--vpj-font-weight-600);
        letter-spacing: 0;
        line-height: 1.4;
    }

    /* Text */
    .vpj-layout-notfound__content-text {
        color: var(--vpj-color-text-300);
        line-height: 1.4;
        margin-top: .2rem;
        margin-bottom: .5rem;
        text-wrap: balance;
    }

    /* Link */
    .vpj-layout-notfound__content-link,
    .vpj-layout-notfound__content-link:visited {
        align-items: center;
        background-color: var(--vpj-color-bg-100);
        border: var(--vpj-border-width-200) solid var(--vpj-color-border-300);
        border-radius: var(--vpj-border-radius-200);
        box-shadow: var(--vpj-shadow-200);
        color: var(--vpj-color-text-300);
        display: flex;
        height: 2.2rem;
        justify-content: center;
        padding-inline: .8rem;
        text-decoration: none;
        transition:
            background-color 0.3s ease,
            box-shadow 0.3s ease,
            color 0.3s ease,
            transform 0.2s ease;
    }

    .vpj-layout-notfound__content-link:hover {
        background-color: var(--vpj-color-bg-200);
        color: var(--vpj-color-text-400);
    }

    .vpj-layout-notfound__content-link:active {
        box-shadow: none;
        transform: scale(0.98);
    }

    /* 添加active动态效果 */
    .vpj-layout-notfound__content-link:active {
        background-color: var(--vpj-color-bg-300);
        transition: transform 0.1s, background-color 0.1s;
    }
</style>