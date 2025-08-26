<script setup>
import { computed } from 'vue';
import { useData, useRoute } from 'vitepress';

import { data } from '../data/history.data';

import { formatDate } from '../utils/common';

import VPJOverlayScrollArea from './VPJOverlayScrollArea.vue';
import VPJPanelHistoryItem from './VPJPanelHistoryItem.vue';


const DEFAULT = {
    EMPTY: "没有历史提交记录",
    INTERVALFORMAT: ":YYYY-:MM-:DD",
    INTERVALKEY: ["year", "month", "week", "day", "hour", "minute", "second"]
};

const { theme } = useData();
const route = useRoute();

const fileData = computed(() => {
    if (data[route.path]) return data[route.path];
    return { history: []};
});

// Fetch user config
const repository = computed(() => {
    const config = theme.value.components?.panelTabHistory?.repository;
    return (typeof config === 'string') ? config : undefined;
});
const interval = computed(() => {
    const config = theme.value.components?.panelTabHistory?.interval;
    return (DEFAULT.INTERVALKEY.includes(config)) ? config : undefined;
});
const intervalFormat = computed(() => {
    const config = theme.value.components?.panelTabHistory?.intervalFormat;

    let format;
    if (typeof config === 'function') {
        format = config;
    } else {
        const pattern = (typeof config === 'string') ? config : DEFAULT.INTERVALFORMAT;
        return (date) => formatDate(date, pattern);
    };
    return (date) => {
        try {
            const label = format(date);
            return typeof label === 'string' ? label : undefined
        } catch (e) {
            console.error("[Juicy Theme] Failed to format history interval: " + e)
            return undefined
        };
    };
});
const itemComponent = computed(() => {
    const config = theme.value.components?.panelTabHistory?.component;
    return (typeof config === 'string') ? config : VPJPanelHistoryItem;
});
const empty = computed(() => {
    const message = theme.value.components?.panelTabHistory?.empty;
    return (typeof message === 'string') ? message : DEFAULT.EMPTY;
});


// Group by interval
const groupedHistory = computed(() => {
    if (!interval.value) return fileData.value.history.map((commit) => ({
        label: intervalFormat.value(new Date(commit.time)),
        commits: [commit]
    }));

    const groups = {};
    for (const commit of fileData.value.history) {
        const d = new Date(commit.time);
        let keyDate;
        switch (interval.value) {
            case "year":
                keyDate = new Date(d.getFullYear(), 0);
                break;
            case "month":
                keyDate = new Date(d.getFullYear(), d.getMonth());
                break;
            case "week":
                d.setDate(d.getDate() - d.getDay())
                keyDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                break;
            case "day":
                keyDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                break;
            case "hour":
                keyDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours());
                break;
            case "minute":
                keyDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes());
                break;
            case "second":
                keyDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds());
                break;
        };
        const key = keyDate.toISOString();
        if (!groups[key]) groups[key] = [];
        groups[key].push(commit);
    };

    return Object.entries(groups)
        .sort(([a], [b]) => new Date(b) - new Date(a))
        .map(([key, commits]) => ({
            key,
            label: intervalFormat.value(new Date(key)),
            commits
        }));
});
</script>


<template>
    <VPJOverlayScrollArea
        overflow="y"
        class="vpj-panel__tab-outer"
        :area-attrs="{ class: 'vpj-panel__tab-area' }"
        :inner-attrs="{ class: 'vpj-panel__tab-inner' }"
    >
        <div
            v-if="fileData.history.length === 0"
            class="vpj-panel__fallback"
        >
            {{ empty }}
        </div>
        <div
            v-else
            class="vpj-panel__history"
        >
            <template
                v-for="{ key, label, commits } in groupedHistory"
                :key="key"
            >
                <div v-if="label" class="vpj-panel__hitory-time-label">{{ label }}</div>
                <ul class="vpj-panel__history-list">
                    <li
                        v-for="commit in commits"
                        :key="commit.hash"
                        class="vpj-panel__history-list-item"
                    >
                        <component
                            :is="itemComponent"
                            :path="fileData.path"
                            :url="fileData.url"
                            :repository="repository"
                            :commit="commit"
                        />
                    </li>
                </ul>
            </template>
        </div>
    </VPJOverlayScrollArea>
</template>


<style scoped>
    .vpj-panel__tab-outer {
        background-color: var(--vpj-color-bg-100);
        height: 100%;
        width: 100%;
    }

    :deep(.vpj-panel__tab-inner) {
        align-items: center;
        display: flex;
        flex-direction: column;
        width: 100%
    }

    .vpj-panel__history {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        width: 100%;
        padding: .5rem;
    }

    /* Time Label */
    .vpj-panel__hitory-time-label {
        color: var(--vpj-color-text-400);
        font-size: 1rem;
        font-weight: var(--vpj-font-weight-600);
        margin: .25rem 0;
    }

    /* History List */
    .vpj-panel__history-list {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        margin: 0;
        padding: 0;
        width: 100%;
    }

    .vpj-panel__history-list-item {
        list-style: none;
        width: 100%;
    }
</style>