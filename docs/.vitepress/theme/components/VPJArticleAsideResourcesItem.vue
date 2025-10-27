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
        <div class="vpj-article-aside__aside-resource-icon-wrapper">
            <VPJDynamicIcon
                :class="props.data?.icon
                    ? 'vpj-article-aside__aside-resource-icon'
                    : 'vpj-article-aside__aside-resource-icon-default'"
                :icon="icon"
            />
        </div>
        <span class="vpj-article-aside__aside-resource-label vpj-text">
            {{ label }}
        </span>
    </a>
</template>


<style scoped>
    /* Main */
    .vpj-article-aside__aside-resource {
        align-items: center;
        backdrop-filter: var(--vpj-article-aside-tab-resources-item-backdrop-filter);
        background: var(--vpj-article-aside-tab-resources-item-bg);
        border: var(--vpj-article-aside-tab-resources-item-border);
        border-radius: var(--vpj-article-aside-tab-resources-item-radius);
        box-shadow: var(--vpj-article-aside-tab-resources-item-shadow);
        display: flex;
        flex-shrink: 0;
        height: var(--vpj-article-aside-tab-resources-item-height);
        text-decoration: none;
        transition:
            backdrop-filter var(--vpj-article-aside-tab-resources-transition),
            background var(--vpj-article-aside-tab-resources-transition),
            border var(--vpj-article-aside-tab-resources-transition),
            box-shadow var(--vpj-article-aside-tab-resources-transition),
            transform var(--vpj-article-aside-tab-resources-transition);
    }

    .vpj-article-aside__aside-resource:hover,
    .vpj-article-aside__aside-resource:active {
        backdrop-filter: var(--vpj-article-aside-tab-resources-item-backdrop-filter-hover);
        background: var(--vpj-article-aside-tab-resources-item-bg-hover);
        border: var(--vpj-article-aside-tab-resources-item-border-hover);
    }

    .vpj-article-aside__aside-resource:hover {
        box-shadow: var(--vpj-article-aside-tab-resources-item-shadow-hover);
        transform: var(--vpj-article-aside-tab-resources-item-transform-hover);
    }

    .vpj-article-aside__aside-resource:active {
        box-shadow: var(--vpj-article-aside-tab-resources-item-shadow-active);
        transform: var(--vpj-article-aside-tab-resources-item-transform-active);
    }

    /* Icon Wrapper */
    .vpj-article-aside__aside-resource-icon-wrapper {
        align-items: center;
        border-radius: var(--vpj-article-aside-tab-resources-item-radius);
        border-right: var(--vpj-article-aside-tab-resources-item-border);
        display: flex;
        flex-shrink: 0;
        height: 100%;
        justify-content: center;
        overflow: hidden;
        transition: border var(--vpj-article-aside-tab-resources-transition);
        width: var(--vpj-article-aside-tab-resources-item-icon-wrapper-width);
    }

    .vpj-article-aside__aside-resource:hover .vpj-article-aside__aside-resource-icon-wrapper,
    .vpj-article-aside__aside-resource:active .vpj-article-aside__aside-resource-icon-wrapper {
        border-right: var(--vpj-article-aside-tab-resources-item-border-hover);
    }

    /* Resource Default Icon */
    .vpj-article-aside__aside-resource-icon-default {
        fill: var(--vpj-article-aside-tab-resources-item-icon-color);
        height: var(--vpj-article-aside-tab-resources-item-icon-default-size);
        margin: auto;
        transition: fill var(--vpj-article-aside-tab-resources-transition);
        width: var(--vpj-article-aside-tab-resources-item-icon-default-size);
    }

    .vpj-article-aside__aside-resource:hover .vpj-article-aside__aside-resource-icon-default,
    .vpj-article-aside__aside-resource:active .vpj-article-aside__aside-resource-icon-default {
        fill: var(--vpj-article-aside-tab-resources-item-icon-color-hover);
    }

    /* Resource Custom Icon */
    .vpj-article-aside__aside-resource-icon {
        height: 100%;
        object-fit: cover;
        object-position: center;
        width: 100%;
    }

    /* Resource Label */
    .vpj-article-aside__aside-resource-label {
        color: var(--vpj-article-aside-tab-resources-item-label-color);
        font-size: var(--vpj-article-aside-tab-resources-item-label-size);
        font-weight: var(--vpj-article-aside-tab-resources-item-label-weight);
        padding-inline: var(--vpj-article-aside-tab-resources-item-label-padding-x);
        transition: color var(--vpj-article-aside-tab-resources-transition);
    }

    .vpj-article-aside__aside-resource:hover .vpj-article-aside__aside-resource-label,
    .vpj-article-aside__aside-resource:active .vpj-article-aside__aside-resource-label {
        color: var(--vpj-article-aside-tab-resources-item-label-color-hover);
    }
</style>