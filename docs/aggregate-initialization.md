---
title: 聚合初始化
alias: 聚合初始化
english: aggregate-initialization
type: glossary
tags:
- 词汇表
- aggregate-initialization
---


聚合初始化使用大括号，主要用于初始化结构体的，如果是类的话则必须都是public成员（不太常用）：

```cpp
struct Data {
    std::string name;
    double value;
};
Data x{"test1", 6.778};
```

从C++17开始，聚合还可以有基类，因此可以初始化从其他类/结构体派生而来的结构体：

```cpp
struct MoreData : Data {
    bool done;
};
MoreData y{{"test1", 6.778}, false};
```

https://toutiao.io/posts/tt34ysp/preview
https://en.cppreference.com/w/cpp/language/aggregate_initialization

聚合初始化有三种形式：

```cpp
struct Employee
{
    int id {};
    int age {};
    double wage {};
};

int main()
{
    Employee frank = { 1, 32, 60000.0 }; // 拷贝列表初始化，使用大括号
    Employee robert ( 3, 45, 62500.0 );  // 使用小括号的直接初始化(C++20)
    Employee joe { 2, 28, 45000.0 };     // 使用大括号列表的列表初始化（推荐）
    return 0;
}
```