---
layout: blog
series: "CSS 精修系列"
tags:
  - CSS
  - Flexbox
  - 布局系统
  - flex
order: 1
---

# Flexbox 布局完全指南

这篇文章属于系列 CSS 精修系列，位序为 1，有这些 tag：CSS, Flexbox, 布局系统, flex

在现代网页设计中，Flexbox 是一个不可或缺的布局工具，它能让我们快速实现响应式排版。

## 基本语法

```css
.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
```

## 常见属性对照表

| 属性名             | 功能说明         |
|--------------------|------------------|
| `justify-content`  | 主轴对齐方式     |
| `align-items`      | 交叉轴对齐方式   |
| `flex-wrap`        | 是否换行         |

- 使用 `row` 横向排布
- 使用 `column` 纵向排布

> 提示：尽量避免过多嵌套，提高可维护性。
