---
layout: blog
series: "测试博客"
tags:
  - Node.js
  - 文件系统
  - fs
  - IO操作
order: 2
---

# 使用 fs 模块读取与写入文件

这篇文章属于系列 Node.js 实用技巧，位序为 2，有这些 tag：Node.js, 文件系统, fs, IO操作

Node.js 的 `fs` 模块提供了丰富的文件系统操作 API：

```js
const fs = require('fs');

fs.readFile('input.txt', 'utf-8', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

### 常用方法

| 方法             | 描述             |
|------------------|------------------|
| `readFile`       | 异步读取文件     |
| `writeFile`      | 异步写入文件     |
| `unlink`         | 删除文件         |

- 支持 Promise 化操作（`fs.promises`）
- 也可同步操作但不推荐

> Node.js 擅长处理 IO 密集型任务。
