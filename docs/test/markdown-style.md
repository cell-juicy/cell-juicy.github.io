---
layout: page
---

# Markdown 语法全面测试

## 基础文本样式
**粗体文本**、*斜体文本*、~~删除线~~、`行内代码`  
混合样式：**粗体*与斜体*组合**、~~删除线内嵌`代码`~~

## 标题层级
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题

## 列表类型
### 无序列表
- 基础项
- **加粗项**
- 嵌套列表
  - 子项
  - [ ] 任务项 (未完成)
  - [x] 任务项 (已完成)

### 有序列表
1. `代码项`
2. *斜体项*
3. 多行列表项  
   第二行文本（注意缩进对齐）

## 链接与图片
[普通链接](https://vitepress.dev)  
[带标题的链接](https://vuejs.org "Vue官网")  
![老婆](/assets/birthday.jpg)  
[空链接](#)  
[参考式链接][ref]  
[ref]: https://github.com/vuejs

## 代码块
```js
// JavaScript 高亮
function highlight(code) {
  return `\${code}\`
}
```

```css
/* CSS 高亮 */
.markdown-body {
  font-family: system-ui;
  --theme-color: #42b983;
}
```

```diff
- const deleted = true;
+ const added = true;
```

## 表格
| 对齐方式 | 左对齐 | 居中对齐 | 右对齐 |
| :------- | :----- | :------: | -----: |
| **示例** | 文本   | `代码`   | 1234   |
| 合并列   | \      | *跨列*   | \      |
| 行合并   | 跨行 → |          |        |
| ^        | 单元格 |          |        |

## 引用块
> 标准引用文本
> > 嵌套引用（第二层）
> > > 再嵌套嵌套
> > >
> > > 反复嵌套
> 
> ### 引用内的标题
> - 引用内的列表
> - [ ] 任务项

## 分隔线
---
*** 
* * *

## 扩展语法
### 自定义容器
::: tip
提示型容器（通常为蓝色）
:::

::: warning
警告型容器（通常为黄色）
:::

::: danger
危险型容器（通常为红色）
:::

::: details
可伸缩容器
:::

### 行内公式
勾股定理：$a^2 + b^2 = c^2$  
欧拉公式：$e^{i\pi} + 1 = 0$  
质能方程：$E = mc^2$  
矢量点积：$\vec{a} \cdot \vec{b} = \sum_{i=1}^n a_i b_i$

### 块级公式
二次方程求根：
$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

矩阵运算：
$$
\begin{bmatrix}
a_{11} & a_{12} \\
a_{21} & a_{22} \\
\end{bmatrix}
+
\begin{bmatrix}
b_{11} & b_{12} \\
b_{21} & b_{22} \\
\end{bmatrix}
=
\begin{bmatrix}
a_{11}+b_{11} & a_{12}+b_{12} \\
a_{21}+b_{21} & a_{22}+b_{22} \\
\end{bmatrix}
$$

### 复杂公式
傅里叶变换：
$$
\mathcal{F}(\omega) = \int_{-\infty}^{\infty} f(t) e^{-i\omega t} \,dt
$$

麦克斯韦方程组：
$$
\begin{aligned}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\varepsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0 \mathbf{J} + \mu_0\varepsilon_0 \frac{\partial \mathbf{E}}{\partial t}
\end{aligned}
$$

### 公式对齐
多行公式对齐：
$$
\begin{align}
f(x) &= (a+b)^2 \\
     &= a^2 + 2ab + b^2 \\
\lim_{x \to 0} \frac{\sin x}{x} &= 1 \\
\int_0^\infty e^{-x^2} dx &= \frac{\sqrt{\pi}}{2}
\end{align}
$$

### 特殊符号
希腊字母：$\alpha, \beta, \gamma, \Gamma, \Delta, \Omega$  
运算符：$\pm, \mp, \times, \div, \otimes, \oplus$  
关系符：$\leq, \geq, \approx, \propto, \equiv$  
箭头：$\rightarrow, \Rightarrow, \leftrightarrow, \Leftrightarrow$  
集合：$\in, \notin, \subset, \subseteq, \cup, \cap, \emptyset$

### 表情符号
:rocket: Vitepress :+1: :warning:  
转义符号：\*不是斜体\*

### 脚注示例
这是一个带脚注的文本[^1]。  
这是另一个脚注[^longnote]。

[^1]: 短脚注内容
[^longnote]: **长脚注**：可包含  
    多行文本和`代码`

## 特殊字符测试
< > & © ® ™  
10 > 5 && 5 < 10  
http://example.com/?param=

## 混合嵌套测试
1. **列表内组合**：
   - [x] 任务列表
   > 列表内的引用
   ```python
   print("列表内的代码块")
   ```
2. | 表格内组合 |
   | ---------- |
   | *斜体*和`代码` |
   | ![小图标](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjgiIGZpbGw9IiM0MmI5ODMiLz48L3N2Zz4=) |

## 超长文本测试
这是一段非常长的文本行，用于测试自动换行和文本溢出处理。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tempus magna eu urna venenatis, at ultrices nisi rhoncus. Curabitur varius fermentum diam, in faucibus turpis convallis ut. Integer at aliquam urna. Sed ac consequat elit. Donec auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Donec auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.