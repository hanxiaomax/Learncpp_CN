---
title: B.3 - C++17
alias: B.3 - C++17
origin: /b-3-introduction-to-c17/
origin_title: "B.3 — Introduction to C++17"
time: 2022-4-21
type: translation
---



## C++17 是什么？

2017年9月，[ISO (国际标准化组织)](https://www.iso.org/home.html) 通过了C++的新版本——C++17。C++17包含了大量的更新。

## C++17 中的改进

这里是C++17添加的主要改进的列表。请注意，这个列表不是全面的，而是旨在突出一些感兴趣的关键改进。

-   `__has_include` 预处理器标识符，检查头文件是否包含(*暂无教程*)
-   编译时求值的 if 语句(*暂无教程*)
-   if 和 switch 语句中的初始化值(*暂无教程*)
-   内联变量 ([[7-10-Sharing-global-constants-across-multiple-files-using-inline-variables|7.10 - 使用 inline 变量共享全局常量]])
-   高阶函数表达式(Fold expressions) (*暂无教程*)
-   嵌套命名空间可以通过 namespace `X::Y` 来定义([[7-2-User-defined-namespaces-and-the-scope-resolution-operator|7.2 - 用户定义命名空间和作用域解析运算符]])
-   移除 `std::auto_ptr` 和其他的一些废弃类型
-   `static_assert` 不再要求诊断信息参数([[9-6-assert-and-static-assert|9.6 - 断言和 static_assert]])
-   `std::any` (*暂无教程*)
-   `std::byte` (*暂无教程*)
-   `std::filesystem` (*暂无教程*)
-   `std::optional` (*暂无教程*)
-   `std::shared_ptr` 可用于管理C语言数组 (但还不能通过 `std::make_shared` 创建) ([[22-6-std-shared-ptr|22.6 — std::shared_ptr]])
-   `std::size` ([[11-2-Arrays-Part-II|11.2 - 数组（第二部分）]])
-   `std::string_view` ([[5-8-Introduction-to-std-string_view|5.8 - std::string_view 简介]])
-   结构化绑定声明
-   构造函数的模板推断(*暂无教程*)
-   三字符组（Trigraphs）被移除
-   可以在模板的模板参数中使用 `typename` （而不是`class`）
-   UTF-8 (u8) 字符字面量(*暂无教程*)