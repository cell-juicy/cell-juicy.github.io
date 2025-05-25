---
layout: blog
series: "开发者工具教程"
tags:
  - DevTools
  - 调试技巧
  - console
  - 日志管理
order: 2
---

# 善用 console 提高调试效率

这篇文章属于系列 开发者工具教程，位序为 2，有这些 tag：DevTools, 调试技巧, console, 日志管理

控制台调试是开发过程中不可或缺的一部分。除了常用的 `console.log`，还有更多高级用法：

## 多样的输出方式

```js
console.warn("这是警告信息");
console.error("这是错误信息");
console.table([{a: 1}, {a: 2}]);
```

## 分组与计时

```js
console.group("请求流程");
console.log("开始");
console.log("处理中");
console.groupEnd();

console.time("耗时任务");
doSomething();
console.timeEnd("耗时任务");
```

> 使用 `console.assert` 还能快速测试逻辑表达式。
