---
layout: blog
series: "测试博客"
tags:
  - 解构赋值
  - ES6
  - const
  - let
order: 4
---

# 深入解构赋值：让代码更简洁

这篇文章属于系列 JavaScript 语法精讲，位序为 4，有这些 tag：解构赋值, ES6, const, let

解构赋值是 ES6 引入的重要语法，可以让你从数组或对象中快速提取值。

## 解构数组

```js
const [a, b] = [1, 2];
```

## 解构对象

```js
const { name, age } = person;
```

### 小贴士

- 默认值支持：`const [a = 1] = [];`
- 可嵌套结构：`const {a: {b}} = obj;`

## Markdown 样式测试

- `代码块`
- > 引用测试
- - 列表测试
- **粗体测试**