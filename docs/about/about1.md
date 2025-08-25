---
layout: blog
---

<script setup>
import { storeToRefs } from 'pinia';
import { useVPJLayout } from '../.vitepress/theme/composables/useVPJLayout';


const store = useVPJLayout();
const { panelToggle } = store;
</script>

# 没git记录的博客

<button @click="() => panelToggle('history')">点击我展开面板</button>