---
title: B.1 - C++11
alias: B.1 - C++11
origin: /b-1-introduction-to-c11/
origin_title: "B.1 — Introduction to C++11"
time: 2022-6-27
type: translation
---



## C++11 是什么？

 2011年8月11日，[ISO (国际标准化组织)](https://www.iso.org/home.html) 通过了C++的新版本——C++11。C++11 为C++语言添加了一系列全新的特性！是否使用这些新功能是可选的——但毫无疑问，你会发现其中一些功能是非常有用的。教程都已更新为C++ 11兼容。

## C++ 11的设计目标

[Bjarne Stroustrup](https://www.stroustrup.com/) 这样描述C++11的目标：

- 扬长避短——扩大C++的优势而不是试图将C++扩展到它可能较弱的新领域（例如有大量GUI的Windows应用程序)，专注于让它更好地做它擅长的事情。
- 使C++更容易学习、使用和教授——提供使语言更一致和更容易使用的功能。

为此，编写该语言的委员会试图遵守以下基本原则：

- 尽可能保持稳定性以及与旧版本C++和C的兼容性。在C++03能够工作的程序仍然应该可以在C++11下工作。
- 将核心语言的扩展数量保持在最低限度，并将大部分的更改放在标准库中(这个目标在这个版本中没有很好地实现)
- 专注于改进抽象机制(类、模板)，而不是添加机制来处理特定的、罕见的情况。
- 为新手和专家添加新的功能。给每个人一点好处！
- 提高类型安全，防止无心的错误。
- 提高性能，并允许C++直接与硬件协同工作。
- 考虑可用性和生态系统问题。C++需要与其他工具很好配合，易于使用和教授，等等。

C++ 11在主旨思想上与C++03相差不大，但它确实增加了大量的新功能。

## C++11中的重要新特性

这里是C++ 11添加的主要特性的列表。请注意，这个列表不是全面的，而是旨在突出一些感兴趣的关键特性。

-   `auto` ([[8-7-Type-deduction-for-objects-using-the auto-keyword|8.7 - 使用 auto 关键字进行类型推断]])
-   `char16_t` 和 `char32_t` 以及其他字面量的支持(*暂无教程*)
-   `constexpr` ([[4-13-Const-variables-and-symbolic-constants|4.13 - const 变量和符号常量]])
-   `decltype` (*暂无教程*)
-   default specifier (*暂无教程*)
-   [[delegating-constructors|委托构造函数]] ([[13-8-overlapping-and-delegating-constructors|13.8 - 重叠和委托构造函数]])
-   `delete` 说明符 ([[14-14-converting-constructors-explicit-and-delete|14.14 - 转换构造函数与explicit和delete关键字]])
-   [[enum-class|枚举类]] ([[10-4-scoped-enumerations-enum-classes|10.4 - 限定作用域枚举（枚举类）]])
-   Extern templates (*暂无教程*)
-   [[lambda|匿名函数]] ([[12-7-introduction-to-lambdas-anonymous-functions|12.7 - lambda表达式简介（匿名函数）]]) 和[[closure|闭包]]([[12-8-lambda-captures|12.8 - lambda 闭包]])
-   `long long int` ([[4-3-Object-sizes-and-the-sizeof-operator|4.3 - 对象的大小和 sizeof 操作符]])
-   [[move-constructor|移动构造函数]]和[[move-assignment-operator|移动赋值运算符]]([[M-3-move-constructors-and-move-assignment|M.3 - 移动构造函数和移动赋值]])
-   `Noexcept` 说明符 (quick mention in [[20.4]])
-   `nullptr` ([[9-7-Null-pointers|9.7 - 空指针]])
-   `override` 和 `final` 说明符([[18-3-the-override-and-final-specifiers-and-covariant-return-types|18.3 - override、final标识符以及协变返回类型]])
-   [[range-based-for-loops|基于范围的for循环]] ([[11-13-For-each-loops|11.13 - for-each 循环]])
-   [[rvalue-reference|右值引用]] ([[M-2-R-value-references|M.2 - 右值引用]])
-   `static_assert` ([[7-17-assert-and-static-assert|7.17 - 断言和 static_assert]])
-   `std::initializer_list` ([[16-7-std-initializer_list|16.7 - std::initializer_list]])
-   末尾返回类型语法([[8-7-Type-deduction-for-objects-using-the auto-keyword|8.7 - 使用 auto 关键字进行类型推断]])
-   [[type-aliases|类型别名]]([[8-6-Typedefs-and-type-aliases|8.6 - typedef 和类型别名]])
-   `typedef` 可以用于模板类
-   [[uniform-initialization|统一初始化]]([[4-1-Introduction-to-fundamental-data-types|4.1 - 基础数据类型简介]])
-   自定义字面量 (*暂无教程*)
-   可变模板(Variadic templates )(*暂无教程*)
-   Two `>>` symbols without a space between them will now properly be interpreted as closing a template object

C++标准库中还有许多新类可供使用。

-   更好地支持多线程和线程本地存储 (*暂无教程*)
-   哈希表 (*暂无教程*)
-   改进随机数生成(在 [[7-19-generating-random-numbers-using-mersenne-twister|7.19 - 使用 Mersenne Twister 生成随机数]] 中进行了讨论)
-   引用包装 ([[18-9-object-slicing|18.9 - 对象切片]])
-   正则表达式 (*暂无教程*)
-   `std::auto_ptr` 被弃用 ([[M-1-introduction-to-smart-pointers-and-move-semantics|M.1 - 智能指针和移动语义简介]])
-   `std::tuple` (*暂无教程*)
-   `std::unique_ptr` ([[M-6-std-unique-ptr|M.6 — std::unique_ptr]])