---
layout: blog
series: "测试博客"
tags:
  - 算法
  - 双指针
  - 数组处理
  - 高效技巧
order: 1
---

# 用双指针解决数组问题的套路总结

这篇文章属于系列 算法小抄，位序为 1，有这些 tag：算法, 双指针, 数组处理, 高效技巧

在处理数组相关问题时，双指针是一种非常高效的技巧。

## 示例：移除重复元素

```js
function removeDuplicates(nums) {
  let i = 0;
  for (let j = 1; j < nums.length; j++) {
    if (nums[j] !== nums[i]) {
      i++;
      nums[i] = nums[j];
    }
  }
  return i + 1;
}
```

> 双指针技巧通常用于遍历、比较、滑动窗口等场景。

- 适用于有序数组
- 空间复杂度低
