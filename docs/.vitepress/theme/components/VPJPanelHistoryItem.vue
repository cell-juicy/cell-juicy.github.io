<script setup>
import { computed } from 'vue';

const props = defineProps({
    path: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    info: {
        type: Object,
        default: {}
    },
    repository: {
        type: String
    }
});
const DEFAULT = {
    ACTION: {
        A: "添加",
        M: "修改",
        D: "删除",
        R: "重命名",
        C: "复制",
        U: "未知"
    }
}

const action = computed(() => {
    return DEFAULT.ACTION[props.info.status] || DEFAULT.ACTION.U;
});
const message = computed(() => {
    if (["A", "D", "M"].includes(props.info.status)) {
        return `${action.value}了本页`;
    } else if (["R", "C"].includes(props.info.status)) {
        return (props.info.from)
            ? `从${props.info.from.match(/[^/]+$/)[0]}${action.value}为本页`
            : `将本页${action.value}为${props.info.to.match(/[^/]+$/)[0]}`
    };
    return `未知操作了本页`;
});
</script>


<template>
    <component
        :is="props.repository ? 'a' : 'div'"
        :href="props.repository ? `${props.repository}/commit/${props.info.hash}` : undefined"
        :target="props.repository ? '_blank' : undefined"
        :rel="props.repository ? 'noopener' : undefined"
        class="vpj-panel__history-item"
    >
        <div class="vpj-panel__history-item-message">
            <strong>{{ props.info.author }}</strong> {{ message }}
        </div>
        <div class="vpj-panel__history-item-commit">
            在提交 {{ props.info.message }} 中({{ props.info.hash }})
        </div>
    </component>
</template>


<style scoped>
    .vpj-panel__history-item {
        background-color: transparent;
        border-radius: var(--vpj-border-radius-200);
        display: flex;
        flex-direction: column;
        gap: .25rem;
        padding: .5rem;
    }

    .vpj-panel__history-item:hover,
    .vpj-panel__history-item:active {
        background-color: var(--vpj-color-bg-400);
    }

    .vpj-panel__history-item-message {
        font-size: 1rem;
        color: var(--vpj-color-text-400)
    }

    .vpj-panel__history-item-commit {
        font-size: .75rem;
        color: var(--vpj-color-text-200);
    }
</style>