<script setup>
import { computed, h, isVNode } from 'vue';
import { useData } from 'vitepress';


const props = defineProps({
    path: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    commit: {
        type: Object,
        default: () => ({})
    },
    repository: {
        type: [String, undefined]
    }
});

function basename(p) {
    return p?.split(/[\\/]/).pop() || p || "";
}

const DEFAULT = {
    TITLE: (ctx) => {
        const { commit, path: currentPagePath } = ctx;
        const author = commit.author || "未知用户";

        const actionMap = {
            A: "创建",
            M: "修改",
            D: "删除",
            R: "重命名",
            C: "复制",
            T: "变更类型",
            U: "解决冲突",
            X: "未知变更"
        };

        const baseAction = actionMap[commit.status] || `执行了 ${commit.status} 操作`;
        let message;

        if (["A", "M", "D", "T", "U", "X"].includes(commit.status)) {
            message = `${baseAction}了本页`;
        } else if (commit.status === "R" || commit.status === "C") {
            const isSource = commit.from === currentPagePath;
            const isTarget = commit.to === currentPagePath;

            if (isTarget && commit.from) {
                const verb = commit.status === "R" ? "重命名" : "复制";
                message = `由 “${basename(commit.from)}” ${verb}而来`;
            } else if (isSource && commit.to) {
                const verb = commit.status === "R" ? "重命名" : "复制";
                message = `被${verb}为 “${basename(commit.to)}”`;
            } else {
                message = `${baseAction}了本页`;
            };
        } else {
            message = `${baseAction}了本页`;
        };

        return h("div", [h("strong", author), ` ${message}`]);
    },

    DESCRIPTION: (ctx) => {
        const { commit } = ctx;
        const hash = commit.hash?.substring(0, 7) || "unknown";
        const message = commit.message?.trim() || "无提交信息";

        return h("div", [
            "在提交 ",
            h("code", hash),
            message ? `中：${message}` : ""
        ]);
    }
};

const { theme } = useData();

const title = computed(() => {
    const themeConfig = theme.value.components?.panelTabHistory?.title;
    if (typeof themeConfig === 'function') {
        try {
            const node = themeConfig(props, h);
            if (isVNode(node)) return node;
        } catch(e) {
            console.error(`[Juicy Theme] Fail to render history item title. Catch error: ${e}`);
        };
    };
    return DEFAULT.TITLE(props);
});
const description = computed(() => {
    const themeConfig = theme.value.components?.panelTabHistory?.description;
    if (typeof themeConfig === 'function') {
        try {
            const node = themeConfig(props, h);
            if (isVNode(node)) return node;
        } catch(e) {
            console.error(`[Juicy Theme] Fail to render history item description. Catch error: ${e}`);
        };
    };
    return DEFAULT.DESCRIPTION(props);
});
</script>


<template>
    <component
        :is="props.repository ? 'a' : 'div'"
        :href="props.repository ? `${props.repository}/commit/${props.commit.hash}` : undefined"
        :target="props.repository ? '_blank' : undefined"
        :rel="props.repository ? 'noopener' : undefined"
        class="vpj-panel__history-item vpj-markdown"
    >
        <component :is="title" class="vpj-panel__history-item-title"/>
        <component :is="description" class="vpj-panel__history-item-description"/>
    </component>
</template>


<style scoped>
    .vpj-panel__history-item {
        backdrop-filter: var(--vpj-panel-history-item-backdrop-filter);
        background: var(--vpj-panel-history-item-bg);
        border-radius: var(--vpj-panel-history-item-radius);
        display: flex;
        flex-direction: column;
        gap: var(--vpj-panel-history-item-gap);
        padding: var(--vpj-panel-history-item-padding);
        text-decoration: none;
        transition:
            backdrop-filter var(--vpj-panel-history-transition),
            background var(--vpj-panel-history-transition);
    }

    .vpj-panel__history-item:hover,
    .vpj-panel__history-item:active {
        backdrop-filter: var(--vpj-panel-history-item-backdrop-filter-hover);
        background: var(--vpj-panel-history-item-bg-hover);
    }

    .vpj-panel__history-item-title {
        color: var(--vpj-panel-history-item-title-color);
        font-size: var(--vpj-panel-history-item-title-size);
    }

    .vpj-panel__history-item-description {
        color: var(--vpj-panel-history-item-desc-color);
        font-size: var(--vpj-panel-history-item-desc-size);
    }
</style>
