---
layout: doc
space: 实分析
order:
  - 11
  - 7
cover: /assets/unknown.png
coverCss:
  objectPosition: 40% center
coverFade: 0.2
coverHeight: 320px
---
# 11.7 非黎曼可积的函数

## 命题

1. <span style='color:red'>（11.7.1 狄利克雷函数？）</span>设$f:[0,1]\to\mathbb R$是不连续函数：
   $$
   f(x):=\begin{cases}
   1&\text{if}\;x\in\mathbb Q\\
   0&\text{if}\;x\notin\mathbb Q
   \end{cases}
   $$
   函数$f$是有界区间上的有界函数，但$f$不是黎曼可积的。

   <span style='color:blue'>（注：如上面所看到的，非黎曼可积的函数只是那些“人为地”给定上界的函数，因此黎曼积分在绝大多数情况下都是足够好的；但是也有一些方法推广改进黎曼积分，例如在[第19章](../Chap19/Sec2.md)中的**勒贝格积分**，还有[下一节](../Chap11/Sec8.md)中定义的**黎曼-斯蒂尔杰斯积分**）</span>

---

## 本节相关跳转

[实分析 11.8 黎曼-斯蒂尔杰斯积分](../Chap11/Sec8.md)

[实分析 19.2 非负可测函数的积分](../Chap19/Sec2.md)