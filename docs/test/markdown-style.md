---
layout: page
---

# Markdown 语法全面测试

## 基础文本样式
**粗体文本**、*斜体文本*、~~删除线~~、`行内代码`  
混合样式：**粗体*与斜体*组合**、~~删除线内嵌`代码`~~

## 标题层级
### 三级标题，标题里的`code`
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

孩子们，溢出并不好笑：

```js
// 这是一个正常的代码行
function greet(name) {
  console.log(`Hello, ${name}!`);
}

// 下面这行特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别长
const superLongVariableNameThatIsIntentionallyExcessivelyLongToTestHorizontalScrollingOrWrappingBehaviorInCodeBlocks = "this-is-a-very-long-string-used-for-testing-purposes-only";

// 回到正常代码
export default greet;

```

横向溢出眉目了：

$$
\displaystyle
\sum_{n=1}^{N}\frac{(-1)^n}{n!}\int_{0}^{\infty}\left(\prod_{k=1}^{n}\frac{\Gamma!\left(\frac{k}{n}+a_k\right)}{\Gamma!\left(1+\frac{k}{n}-b_k\right)}\right)
\exp!\Bigg(-\alpha\sum_{j=1}^{n}\sqrt{j^2+\beta_j^2}\Bigg)
\cos!\Bigg(\omega\sum_{m=1}^{n}\frac{m^3}{m+1}\sin\frac{\pi m}{2N}\Bigg)
\frac{1}{(1+x)^{\gamma_n}}\Bigg|*{x=\tan\left(\frac{\pi n}{2N}\right)},
\mathrm{d}x
+\prod*{\substack{p\ \text{prime}\ p\le P}}\left(1-p^{-s}\right)^{-1}
\cdot\frac{\mathrm{d}}{\mathrm{d}s}\Bigg[\prod_{r=1}^{R}\left(\sum_{t=0}^{T_r}\frac{(-1)^t}{(t+\lambda_r)^{\mu_r}}\right)\Bigg]*{s=1+\varepsilon}
+\lim*{M\to\infty}\frac{1}{M}\sum_{q=1}^{M}\left(\int_{-M}^{M}\frac{\sin(x^2+q)}{x+q},\mathrm{d}x\right)
$$


### 一般语法

```js
export default {
  name: 'MyComponent',
  // ...
}
```

```html
<ul>
  <li v-for="todo in todos" :key="todo.id">
    {{ todo.text }}
  </li>
</ul>
```

### 行高亮
```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```

```js{1,4,6-8}
export default { // Highlighted
  data () {
    return {
      msg: `Highlighted!
      This line isn't highlighted,
      but this and the next 2 are.`,
      motd: 'VitePress is awesome',
      lorem: 'ipsum'
    }
  }
}
```

### 代码聚焦
```js
export default {
  data () {
    return {
      msg: 'Focused!' // [!code focus]
    }
  }
}
```

```js
export default {
  data () {
    return {
      msg: 'Focused!' // [!code focus:2]
    }
  }
}
```

### diff创建

```js
export default {
  data () {
    return {
      msg: 'Removed' // [!code --]
      msg: 'Added' // [!code ++]
    }
  }
}
```

### 高亮“错误”和“警告”

```js
export default {
  data () {
    return {
      msg: 'Error', // [!code error]
      msg: 'Warning' // [!code warning]
    }
  }
}
```

### 行号

```ts {1}
// 默认禁用行号
const line2 = 'This is line 2'
const line3 = 'This is line 3'
```

```ts:line-numbers {1}
// 启用行号
const line2 = 'This is line 2'
const line3 = 'This is line 3'
```

```ts:line-numbers=2 {1}
// 行号已启用，并从 2 开始
const line3 = 'This is line 3'
const line4 = 'This is line 4'
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

::: info
总之是个容器（通常为灰色）`C++`
:::

::: tip
提示型容器（通常为蓝色）`Python`
:::

::: warning
警告型容器（通常为黄色）`JavaScript`
:::

::: danger
危险型容器（通常为红色）`Ruby`
:::

::: details
可伸缩容器`Go`
:::

::: raw
Wraps in a `<div class="vp-raw">`
:::

#### Github风格的容器

> [!NOTE]
> 强调用户在快速浏览文档时也不应忽略的重要信息。

> [!TIP]
> 有助于用户更顺利达成目标的建议性信息。

> [!IMPORTANT]
> 对用户达成目标至关重要的信息。

> [!WARNING]
> 因为可能存在风险，所以需要用户立即关注的关键内容。

> [!CAUTION]
> 行为可能带来的负面影响。

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