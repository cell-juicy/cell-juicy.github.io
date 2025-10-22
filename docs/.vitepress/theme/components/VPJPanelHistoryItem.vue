<script setup>
import { computed } from 'vue'

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
})

const DEFAULT = {
    ACTION: {
        A: "添加",
        M: "修改",
        D: "删除",
        R: "重命名",
        C: "复制"
    },
    BASENAME: (p) => p?.split(/[\\/]/).pop() || p || ""
}

const action = computed(() => {
    return DEFAULT.ACTION[props.commit.status] || `[未知操作: ${props.commit.status}]`;
})

const message = computed(() => {
    if (["A", "M", "D"].includes(props.commit.status)) {
        return `${action.value}了本页`
    } else if (props.commit.status === "R") {
        return props.commit.from
            ? `将 ${DEFAULT.BASENAME(props.commit.from)} 重命名为本页`
            : `本页被重命名为 ${DEFAULT.BASENAME(props.commit.to)}`
    } else if (props.commit.status === "C") {
        return props.commit.from
            ? `从 ${DEFAULT.BASENAME(props.commit.from)} 复制为本页`
            : `本页复制为 ${DEFAULT.BASENAME(props.commit.to)}`
    };
    return `${action.value}了本页`;
});
</script>


<template>
    <component
        :is="props.repository ? 'a' : 'div'"
        :href="props.repository ? `${props.repository}/commit/${props.commit.hash}` : undefined"
        :target="props.repository ? '_blank' : undefined"
        :rel="props.repository ? 'noopener' : undefined"
        class="vpj-panel__history-item"
    >
        <div class="vpj-panel__history-item-title">
            <strong>{{ props.commit.author }}</strong> {{ message }}
        </div>
        <div class="vpj-panel__history-item-description">
            在提交 <code>{{ props.commit.hash }}</code> 中：{{ props.commit.message }}
        </div>
    </component>
</template>


<style scoped>
    .vpj-panel__history-item {
        background: var(--vpj-panel-history-item-bg);
        border-radius: var(--vpj-panel-history-item-radius);
        display: flex;
        flex-direction: column;
        gap: var(--vpj-panel-history-item-gap);
        padding: var(--vpj-panel-history-item-padding);
        text-decoration: none;
    }

    .vpj-panel__history-item:hover,
    .vpj-panel__history-item:active {
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

    .vpj-panel__history-item-description > code {
        background: var(--vpj-c-bg);
        border-radius: var(--vpj-border-radius-1);
        color: var(--vpj-panel-history-item-desc-color);
        padding: .125rem .25rem .125rem .25rem;
    }
</style>
