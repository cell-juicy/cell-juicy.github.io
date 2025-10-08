<script setup>
import { computed } from 'vue';

import VPJDynamicIcon from './VPJDynamicIcon.vue';

import VPJIconDownload from '../components/icons/VPJIconDownload.vue';
import VPJIconFile from '../components/icons/VPJIconFile.vue';
import VPJIconGlobe from '../components/icons/VPJIconGlobe.vue';
import VPJIconPicture from '../components/icons/VPJIconPicture.vue';


const DefaultIcon = {
    image: VPJIconPicture,
    file: VPJIconFile,
    website: VPJIconGlobe,
    download: VPJIconDownload
};

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

const url = computed(() => {
    return props.data.url;
});

const label = computed(() => {
    if (typeof props.data.label === "string" && props.data.label.length > 0) return props.data.label;
    return `Resource: ${props.data.url}`;
});

const icon = computed(() => {
    if (props.data.icon) return props.data.icon;
    else if (props.data.type) return DefaultIcon[props.data.type];
    else {
        if (props.data.download) return DefaultIcon.download;
        else if (/\.(pdf|doc|docx|ppt|pptx|xls|xlsx)$/i.test(props.data.url)) return DefaultIcon.file;
        else if (/\.(jpg|jpeg|png|gif|webp)$/i.test(props.data.url)) return DefaultIcon.image;
        else return DefaultIcon.website;
    }
});
</script>


<template>
    <a
        :href="url"
        class="vpj-article-aside__aside-resource"
        :download="props.data?.download"
        target="_blank"
        rel="noopener"
    >
        <VPJDynamicIcon
            :class="props.data?.icon
                ? 'vpj-article-aside__aside-resource-icon'
                : 'vpj-article-aside__aside-resource-icon-default'"
            :icon="icon"
        />
        <span class="vpj-article-aside__aside-resource-label vpj-text">
            {{ label }}
        </span>
    </a>
</template>


<style scoped>
    .vpj-article-aside__aside-resource {
        align-items: center;
        border-radius: var(--vpj-border-radius-100);
        border-width: var(--vpj-border-width-200);
        box-shadow: var(--vpj-shadow-100);
        display: flex;
        flex-shrink: 0;
        height: 3.2rem;
        text-decoration: none;
    }

    .vpj-article-aside__aside-resource:hover,
    .vpj-article-aside__aside-resource:focus {
        border-color: var(--vpj-color-border-400);
    }

    .vpj-article-aside__aside-resource:hover {
        box-shadow: var(--vpj-shadow-200);
        transform: scale(1.02);
    }

    .vpj-article-aside__aside-resource:focus {
        box-shadow: none;
        transform: scale(0.98);
    }

    /* Resource Default Icon */
    .vpj-article-aside__aside-resource-icon-default {
        border-radius: var(--vpj-border-radius-100);
        border-right-width: var(--vpj-border-width-200);
        fill: var(--vpj-color-text-300);
        height: 3.2rem;
        padding: 1rem;
        width: 3.2rem;
    }

    .vpj-article-aside__aside-resource:hover .vpj-article-aside__aside-resource-icon-default,
    .vpj-article-aside__aside-resource:focus .vpj-article-aside__aside-resource-icon-default {
        border-color: var(--vpj-color-border-400);
        fill: var(--vpj-color-text-400);
    }

    /* Resource Custom Icon */
    .vpj-article-aside__aside-resource-icon {
        border-radius: var(--vpj-border-radius-100);
        border-right-width: var(--vpj-border-width-200);
        height: 3.2rem;
        object-fit: cover;
        object-position: center;
        width: 3.2rem;
    }

    .vpj-article-aside__aside-resource:hover .vpj-article-aside__aside-resource-icon,
    .vpj-article-aside__aside-resource:focus .vpj-article-aside__aside-resource-icon {
        border-color: var(--vpj-color-border-400);
    }

    /* Resource Label */
    .vpj-article-aside__aside-resource-label {
        color: var(--vpj-color-text-300);
        font-size: .875rem;
        margin-left: .6rem;
        margin-right: .6rem;
        padding: auto;
    }

    .vpj-article-aside__aside-resource:hover .vpj-article-aside__aside-resource-label,
    .vpj-article-aside__aside-resource:focus .vpj-article-aside__aside-resource-label {
        color: var(--vpj-color-text-400);
    }
</style>