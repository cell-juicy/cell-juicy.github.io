<script setup>
import { computed } from 'vue';

const props = defineProps({
    data: {
        type: Array,
        required: true
    }
});
</script>


<template>
    <ul>
        <li v-for="header in data" :key="header.link" >
            <a :href="header.link">{{ header.title }}</a>
            <VPJArticleAsideOutlineItem v-if="header.children.length > 0" :data="header.children" />
        </li>
    </ul>
</template>


<style>
    .active {
        color: green;
    }
</style>