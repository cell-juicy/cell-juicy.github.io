---
layout: blog
series: "测试博客"
tags:
  - Vue
  - 组件
  - props
  - 非常非常非常长的标签用来测试样式表现
order: 3
---

# 理解 Vue 中的 Props 与数据传递

这篇文章属于系列 Vue 入门学习笔记，位序为 3，有这些 tag：Vue, 组件, props, 非常非常非常长的标签用来测试样式表现

在 Vue 中，组件之间传递数据的方式之一是使用 `props`。父组件可以向子组件传递数据，如下：

```vue
<Child :title="message" />
```

### 子组件中定义 props

```js
props: {
  title: String
}
```

## 常见 props 类型

- String
- Number
- Boolean
- Array

### 小贴士

> 使用 `default` 可以为 props 设置默认值。

## markdown测试

- *斜体测试*
- **粗体测试**
- `代码测试`
- 引用测试：

> 数据应始终从父组件单向流向子组件。
