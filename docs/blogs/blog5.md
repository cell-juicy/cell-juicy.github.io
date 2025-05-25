---
layout: blog
series: "开发者工具教程"
tags:
  - DevTools
  - Chrome
  - 性能调试
  - Lighthouse
order: 1
---

# 使用 Chrome DevTools 分析页面性能

这篇文章属于系列 开发者工具教程，位序为 1，有这些 tag：DevTools, Chrome, 性能调试, Lighthouse

Chrome DevTools 是前端开发者最重要的调试工具之一，其中包含了强大的性能分析功能。

## 使用步骤

1. 打开页面
2. 按 F12 打开 DevTools
3. 进入 "Performance" 标签页
4. 点击录制并分析加载过程

## 使用 Lighthouse 进行整体审查

```bash
# 使用命令行版本
npx lighthouse https://example.com --view
```

> 多利用“帧率”、“内存”、“网络”等子工具获取更多洞察。

### 表格测试

| 工具          | 用途             |
|---------------|------------------|
| Network       | 查看资源请求     |
| Performance   | 帧率与渲染分析   |
| Lighthouse    | 自动化评估工具   |
```

---

### ✅ 第5篇

```markdown