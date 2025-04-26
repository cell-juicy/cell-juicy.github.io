---
layout: page
---
<script setup>
function range(n) {
    let array = [];
    for (let i = 1; i <= n; i++) {
        array.push(i);
    }
    return array;
}
</script>


# 这里是博客

点击这里快速转移

<ol>
    <li v-for="n in range(11)">
        <a :href="`/blogs/blog${n}.html`">第{{ n }}篇测试博文</a>
    </li>
</ol>