---
title: 列表初始化
alias: 列表初始化
english: list initialization
type: glossary
tags:
- 词汇表
- list-initialization
- initialization
---

和[[uniform-initialization|统一初始化]]、[[括号初始化]] 是一回事，和[[initializer-list|初始化值列表]]有什么区别

```cpp
std::array<int, 5> myArray = { 9, 7, 5, 3, 1 }; // 初始化值列表
std::array<int, 5> myArray2 { 9, 7, 5, 3, 1 }; // 列表初始化
```

https://en.cppreference.com/w/cpp/language/list_initialization
