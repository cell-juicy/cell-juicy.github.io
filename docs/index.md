---
layout: page
---
<script setup>
</script>

<style scoped>
    .hero-content {
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-top: 5rem;
        padding-left: 1rem;
        padding-right: 1rem;
        padding-bottom: 5rem;
    }

    .button,
    .button:visited {
        align-items: center;
        background-color: var(--vpj-color-bg-100);
        border: none;
        border-radius: 5px;
        box-shadow: var(--vpj-shadow-200);
        color: var(--vpj-color-text-500);
        display: flex;
        justify-content: center;
        height: 40px;
        width: 120px;
        padding: auto;
        text-decoration: none;
    }

    .button:hover {
        background-color: var(--vpj-color-bg-300);
    }
</style>

<VPJHeroImage
    src="/assets/mountain.jpg"
    height="400px"
    fade=0.2
>
    <div class="hero-content">
        <h1>这是Cell的网站</h1>
        <h3>欢迎每一个访客</h3>
        <button class="button">点击我</button>
    </div>
</VPJHeroImage>


# 这是一个主页（绝赞装修中）

我现在正在测试超赞的markdown样式，你可以在这里看到我的进度 [传送门](test/markdown-style.md)。

## 我的博客

<a class="button" href="/blogs/">我的博客</a>

1. 啊啊啊
2. 啊啊啊
3. 啊啊啊

## 我的笔记

<a class="button" href="/docs/">我的笔记</a>

1. 呃呃呃
2. 呃呃呃
3. 呃呃呃