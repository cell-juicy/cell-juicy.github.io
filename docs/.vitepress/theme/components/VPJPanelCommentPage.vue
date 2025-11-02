<script setup>
import { computed } from 'vue';
import { useData, useRoute } from 'vitepress';
import Giscus from '@giscus/vue';

import VPJOverlayScrollArea from './VPJOverlayScrollArea.vue';


const DEFAULT = {
    EMPTY: "没有评论",
};

const { theme } = useData();
const route = useRoute();
</script>


<template>
    <VPJOverlayScrollArea
        overflow="y"
        class="vpj-panel__tab-outer"
        :area-attrs="{ class: 'vpj-panel__tab-area' }"
        :inner-attrs="{ class: 'vpj-panel__tab-inner' }"
    >
        <!-- <div
            v-if="true"
            class="vpj-panel__fallback"
        >
            {{ empty }}
        </div> -->
        <div
            class="vpj-panel__comment"
        >
            <Giscus
                id="comment"
                repo="cell-juicy/giscus-comment-repository"
                repo-id="R_kgDOQNoB2w"
                category="Announcements"
                category-id="DIC_kwDOQNoB284CxWix"
                mapping="pathname"
                strict="0"
                reactions-enabled="1"
                emit-metadata="0"
                input-position="top"
                theme="preferred_color_scheme"
                lang="zh-CN"
            />
        </div>
    </VPJOverlayScrollArea>
</template>


<style scoped>
    .vpj-panel__tab-outer {
        height: 100%;
        width: 100%;
    }

    :deep(.vpj-panel__tab-inner) {
        align-items: center;
        display: flex;
        flex-direction: column;
        width: 100%
    }

    .vpj-panel__comment {
        display: flex;
        flex: 1;
        flex-direction: column;
        width: 100%;
        padding: 0;
    }

    #comment {
        display: flex;
        flex: 1
    }

    #comments iframe {
        flex: 1
    }
</style>