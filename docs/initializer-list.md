---
title: 初始化值列表
alias: 初始化值列表
english: initializer-list
type: glossary
tags:
- 词汇表
- initializer-list
---


区别于[[list-initialization|列表初始化]]
[[member-initializer-list|成员初始化值列表]]

```cpp
std::array<int, 5> myArray = { 9, 7, 5, 3, 1 }; // 初始化值列表
std::array<int, 5> myArray2 { 9, 7, 5, 3, 1 }; // 列表初始化

//数组的初始化
int prime[5]{ 2, 3, 5, 7, 11 }; 
int prime[5]={ 2, 3, 5, 7, 11 }; 

```
