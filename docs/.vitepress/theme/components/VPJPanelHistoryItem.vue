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
        <div class="vpj-panel__history-item-message">
            <strong>{{ props.commit.author }}</strong> {{ message }}
        </div>
        <div class="vpj-panel__history-item-commit">
            在提交 <code>{{ props.commit.hash }}</code> 中：{{ props.commit.message }}
        </div>
    </component>
</template>


<style scoped>
    .vpj-panel__history-item {
        background-color: transparent;
        border-radius: var(--vpj-border-radius-200);
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: 0.5rem;
        text-decoration: none;
    }

    .vpj-panel__history-item:hover,
    .vpj-panel__history-item:active {
        background-color: var(--vpj-color-bg-300);
    }

    .vpj-panel__history-item-message {
        font-size: .875rem;
        color: var(--vpj-color-text-400);
    }

    .vpj-panel__history-item-commit {
        font-size: 0.75rem;
        color: var(--vpj-color-text-200);
    }

    .vpj-panel__history-item-commit > code {
        background-color: var(--vpj-color-bg-500);
        border-radius: var(--vpj-border-radius-100);
        color: var(--vpj-color-text-400);
        padding: .125rem .25rem .125rem .25rem;
    }
</style>
