---
layout: doc
space: 实分析
order:
  - 19
  - 4
cover: /assets/unknown.png
coverCss:
  objectPosition: 40% center
coverFade: 0.2
coverHeight:
  desktop: 360px
  tablet: 320px
  mobile: 280px
---
# 19.4 与黎曼积分的比较

## 命题

1. <span style="color:red">（19.4.1）</span>设$I\subseteq\mathbb R$是一个区间，并设$f:I\to\mathbb R$是一个黎曼可积的函数。那么，$f$也是绝对可积的，并且$\displaystyle\int_{I}f=R.\int_{I}f$。

   <span style="color:blue">（注：这就表明了勒贝格积分事实上是黎曼积分的推广（至少在一维情况下如此）；与黎曼积分相比，勒贝格积分可以处理更多的函数，这就是我们为什么在分析学中使用勒贝格积分的主要原因之一（例如非常经典的狄利克雷函数在$[0,1]$上的积分，它不是黎曼可积的但是可以通过勒贝格积分给出一个合理的结果）；另一方面，勒贝格积分可以很好地与极限运算进行交互，这一点可以从[勒贝格单调收敛定理](/docs/Real-Analysis/Chap19/Sec2.md)、[法都引理](/docs/Real-Analysis/Chap19/Sec2.md)以及[勒贝格控制收敛定理](/docs/Real-Analysis/Chap19/Sec3.md)中看出，黎曼积分中我们并不能给出这样的相应定理（没记错的话，黎曼积分好像只有关于一致收敛的结论，参见[命题14.6.1](/docs/Real-Analysis/Chap14/Sec6.md)）；关于本节的内容（包括后面[19.5节](/docs/Real-Analysis/Chap19/Sec5.md)的内容），个人推荐去看原书的证明过程，此处仅做记录方便查阅回看）</span>

---

## 本节相关跳转

[实分析 14.6 一致收敛和积分](/docs/Real-Analysis/Chap14/Sec6.md)

[实分析 19.2 非负可测函数的积分](/docs/Real-Analysis/Chap19/Sec2.md)

[实分析 19.3 绝对可积函数的积分](/docs/Real-Analysis/Chap19/Sec3.md)