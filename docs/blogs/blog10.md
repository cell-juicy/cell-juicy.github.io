---
layout: blog
series: "测试博客2"
tags:
  - Node.js
  - 路径处理
  - path模块
  - 工具函数
order: 3
---

# 用 path 模块处理文件路径的正确姿势

这篇文章属于系列 Node.js 实用技巧，位序为 3，有这些 tag：Node.js, 路径处理, path模块, 工具函数

Node.js 提供了内置模块 `path` 来处理跨平台路径问题：

```js
const path = require('path');

const fullPath = path.join(__dirname, 'folder', 'file.txt');
console.log(fullPath);
```

### 常用方法

| 方法名         | 用途           |
|----------------|----------------|
| `join()`       | 拼接路径       |
| `resolve()`    | 生成绝对路径   |
| `basename()`   | 获取文件名     |

> 永远不要手动拼接 `/`，使用 path 方法更安全。