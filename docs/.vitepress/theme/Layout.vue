<script setup>
import { useData, Content } from 'vitepress';
import { computed } from 'vue';
import VPJIconApps from './components/icons/VPJIconApps.vue';


const { frontmatter } = useData();
const activeLayout = computed(() => {
    switch (frontmatter.value.layout) {
        default:
            return Content
    }
});
</script>

<template>
    <VPJIconApps class="icon" />
    <component :is="activeLayout"/>
</template>

<style scoped>
.icon {
    width: 32px;
    height: 32px;
    fill: green;
}
</style>