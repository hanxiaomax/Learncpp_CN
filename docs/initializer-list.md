---
title: 初始化值列表
alias: 初始化值列表
english: initializer-list
type: glossary
tags:
- 词汇表
- initializer-list
---

- 普通类不需要初始值列表，容器类需要。实现时需要特殊的构造函数支持。
- 所以初始化值列表是对容器类来说的。唯一特例是基本数据类型中的数组，因为它也是容器
- 一般提供初始化值列表构造函数时也要提供对应的赋值运算符重载
- 对于一般类来说只有列表初始化。但是有[[member-initializer-list|成员初始化值列表]]的概念，是构造函数后面的列表。

```cpp
std::array<int, 5> myArray = { 9, 7, 5, 3, 1 }; // 初始化值列表
std::array<int, 5> myArray2 { 9, 7, 5, 3, 1 }; // 列表初始化

//数组的初始化
int prime[5]{ 2, 3, 5, 7, 11 }; 
int prime[5]={ 2, 3, 5, 7, 11 }; 

```
