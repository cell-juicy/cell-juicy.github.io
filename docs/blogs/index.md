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

我们还添加了两个页面以观察组件的回退设置：

1. [当一篇blog失去series与tags](/blogs/test1.md)
2. [当一篇article失去侧边栏标签页](/blogs/test2.md)