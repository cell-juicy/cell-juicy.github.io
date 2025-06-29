---
layout: doc
space: 实分析
order:
  - 11
  - 5
cover: /assets/unknown.png
coverCss:
  objectPosition: 40% center
coverFade: 0.2
coverHeight: 320px
---
# 11.5 连续函数的黎曼可积性

## 定义

1. <span style='color:red'>（11.5.4 分段连续？）</span>设$I$是一个有界区间，并且设$f:I\to\mathbb R$是函数。称$f$在$I$上是**分段连续**的，当且仅当存在一个$I$的划分$P$，使得对任意的$J\in P$，$f|_J$都是$J$上的连续函数。

---

## 命题

1. <span style='color:red'>（11.5.1 一致连续函数是黎曼可积的？）</span>设$I$是一个有界区间，并且设是$f:I\to\mathbb R$定义在$I$上的一致连续函数，那么$f$是黎曼可积的。

   > 推论：
   >
   > 1. <span style='color:red'>（11.5.2 闭区间上的连续函数是黎曼可积的？）</span>设$[a,b]$是一个闭区间，并且设$f:[a,b]\to\mathbb R$是连续的，那么$f$是黎曼可积的。
   >
   >    <span style='color:blue'>（注：结合定理11.5.1与[定理9.9.16](../Chap9/Sec9.md)即可）</span>

2. <span style='color:red'>（11.5.3 有界的连续函数是黎曼可积的？）</span>设$I$是一个有界区间，并且设$f:I\to\mathbb R$是定义在$I$上的有界并且连续的函数，那么$f$是黎曼可积的。

3. <span style='color:red'>（11.5.6）</span>$I$是一个有界区间，并且设$f:I\to\mathbb R$既是分段连续又是有界的，那么$f$是黎曼可积的。

---

## 课后习题

##### 11.5.1 证明命题11.5.6<span style='color:blue'>（提示：利用[定理11.4.1](../Chap11/Sec4.md)的(a)和(h)）</span>

>根据定义11.5.4，存在划分$P$使得对任意$J\in P$，$f|_J$都是$J$上的连续函数。特别地，考虑到$f$是有界的，因此$f|_J$都是$J$上的连续有界函数，从而根据命题11.5.3，$f|_J$也是黎曼可积的。
>
>于是然后对任意$J\in P$，我们定义函数$F_J:I\to\mathbb R$有：
>$$
>F_J(x)=\begin{cases}
>f|_J(x)&\text{if}\;x\in J\\
>0&\text{if}\;x\notin J\\
>\end{cases}
>$$
>由定理11.4.1(g)我们可以得到$F_J$是黎曼可积的，然后注意到对任意$x\in X$都有：
>$$
>f(x)=\sum_{J\in P}F_J(x)
>$$
>因此我们有$f=F_{J_1}+...+F_{J_n}(P=\{J_1,...,J_n\})$，从而根据定理11.4.1(a)我们有$f$是黎曼可积的，题目结论得证。
>
>（所以为什么提示里面说要用到定理11.4.1(h)，没看懂怎么用）

---

## 本节相关跳转

[实分析 9.9 一致连续性](../Chap9/Sec9.md)

[实分析 11.4 黎曼积分的基本性质](../Chap11/Sec4.md)