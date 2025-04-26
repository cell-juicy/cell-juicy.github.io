---
layout: blog
series: "CSS 精修系列"
tags:
  - CSS
  - Grid
  - 网格布局
  - 布局系统
order: 2
asideTabs:
  angularDocs:
    component: "Something"  # 抑制系列配置
  customTab:
    component: "CustomTab"
  tags:
    component: null
---

# Grid 网格布局的强大之处

这篇文章属于系列 CSS 精修系列，位序为 2，有这些 tag：CSS, Grid, 网格布局, 布局系统

CSS Grid 是另一种强大的布局方式，尤其适合二维网格系统。

## 基本结构

```css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 10px;
}
```

### 和 Flex 的比较

| 特性        | Flexbox | Grid   |
|-------------|---------|--------|
| 轴方向      | 一维    | 二维   |
| 项目排序    | 灵活    | 精确   |
| 学习曲线    | 简单    | 略高   |

> 当需要控制行和列时，使用 Grid 是更好的选择。