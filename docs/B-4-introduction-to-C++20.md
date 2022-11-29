---
title: B.4 - C++20
alias: B.4 - C++20
origin: /b-4-introduction-to-c20/
origin_title: "B.4 — Introduction to C++20"
time: 2022-3-28
type: translation
---


??? note "关键点速记"



## C++20 是什么？

2020年2月，[ISO (国际标准化组织)](https://www.iso.org/home.html) 通过了C++的新版本——C++20。C++20是自C++11以来，包含最多变化的版本。

## C++20 的改进

这里列出了C++ 20增加的主要改进。请注意，这个列表不是全面的，而是旨在突出一些感兴趣的关键改进点。

-  通过`auto`参数支持[[abbreviated function templates|缩写函数模板]]([[8-15-Function-templates-with-multiple-template-types|8.15 - 具有多种类型的函数模板]])
-   `Chrono` 扩展用于支持日历和时区(*暂无教程*)
-   Concepts，用于对模板参数进行限制 (*暂无教程*)
-   Constexpr virtual functions, `unions`, `try`, `catch`, `dynamic_cast`, and `typeid` (*暂无教程*)
-   `Constinit` 关键字，用于断言某个变量被静态初始化(*暂无教程*)
-   协程 (*暂无教程*)
-   [[designated-initializers|指定初始化]]([[10-6-struct-aggregate-initialization|10.6 - 结构体的聚合初始化]])
-   使用`consteval` 创建即时函数 ([[6-14-Constexpr-and-consteval-functions|6.14 - Constexpr 和 consteval 函数]])
-   模块，作为 `#include` 的替代品(*暂无教程*)
-   Ranges (*暂无教程*)
-   `std::erase` (*暂无教程*)
-   `std::make_shared` for arrays (*暂无教程*)
-   `std::map::contains()` (*暂无教程*)
-   `std::span` (*暂无教程*)
-   字符串格式化库(*暂无教程*，参见 [https://en.cppreference.com/w/cpp/utility/format](https://en.cppreference.com/w/cpp/utility/format))
-   字符串字面量作为模板参数 (*暂无教程*)
-   使用飞船运算符`<=>`进行三路比较(*暂无教程*)
-   Using scoped enums (*暂无教程*)
-   Views (*暂无教程*)