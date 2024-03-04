---
layout: page
title: Test
permalink: /test/

---

本页用于测试各类markdown的格式。

# 基础语法

# h1

## h2

### h3

#### h4

##### h5

###### h6

*斜体*，**粗体**，***粗斜体***。

> 引用
>
> > 嵌套引用
> >
> > **嵌套其它格式**

有序列表：

1. item1

   > hello world

2. item2

3. item3

无序列表：

* 小代码块：`printf("hello")`

* 代码块

  ```python
  """
  Here are some example code
  """
  
  import os
  
  if __name__ == "__main__":
  	text = "Hello World"
      table = {
  		"firstName": "John",
  		"lastName": "Smith",
  		"age": 25
  	}
      print(f"{text}")		# it will print Hello World in cmd.
  ```

* item3

分割线

---

[链接](https://cell-juicy.github.io/)，[有标题的链接](https://cell-juicy.github.io/ "我的主页")，直链：<https://markdown.com.cn>，引用链接：[Google][google]

[google]: https://www.google.com

图片链接（不错，是我老婆）

![我推好美](https://img2.tapimg.com/bbcode/etag/Fst55xHd_7x1d9nyBQmKGYYK03rz.webp)

转义字符大赏：

\\ \` \* \_ \[ \] \{ \} \( \) \# \+ \- \. \! \|

内嵌html：

<table>
    <tr>
        <td>Foo</td>
    </tr>
</table>







# 扩展语法

列表：

| a    | b    | c    |
| ---- | ---- | ---- |
| d    | e    | f    |
| g    | h    | i    |

脚注[^google]

[^google]:这是一个脚注，你可以看看<https://www.google.com/>

定义
: This is the definition of the 定义.

~~删除线~~，==高亮==。

任务列表：

- [x] task1
- [ ] task2
- [ ] task3

emoji事例：去露营了！:tent:真开心！:joy:

行内公式：\$$\forall\;x\in(-\delta,\delta)$$，\$$\displaystyle\frac{\part f}{\part x}<0$$，\$$\exist\:d,\int_{[0,1]}你\text{d}好$$。

行间公式：

$$
\begin{gather}
x^2+y^2=1\\
x+y+z=0\\
z^3-\log(z)=4
\end{gather}
$$

$$
\begin{pmatrix}
\xi&\pi\\
\varepsilon&\sigma
\end{pmatrix}
\begin{pmatrix}
\mathbb R\\
\ln(y)
\end{pmatrix}=
\begin{pmatrix}
\cos(\theta)\\
\sin(\theta)
\end{pmatrix}
$$

$$
\begin{align}
\sum_{i=0}^{\infty}|f(g(i))|&=\lim_{n\to\infty}\sum_{i=0}^{n}|f(g(i))|\\
&=\sup\left(\left\{\sum_{i=0}^{n}|f(g(i))|:n\geq0\right\}\right)\\
&=\sup(T)
\end{align}
$$

$$
\sup\left\{\sum_{x\in A}|f(x)|:A\subseteq X且A是有限集\right\}<\infty
$$

