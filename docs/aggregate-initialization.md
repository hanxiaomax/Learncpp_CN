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