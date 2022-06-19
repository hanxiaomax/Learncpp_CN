---
title: 6.x - 小结与测试
alias: 6.x - 小结与测试
origin: /none/
origin_title: "6.x — Chapter 6 summary and quiz"
time: 2022-3-29
type: translation
tags:
- summary
- C++17
- C++20
---

## 章节小结

本章的介绍了很多内容。你做的很好！

**复合语句**或者**语句块**（[[6-1-Compound-statements-blocks|6.1 - 复合语句（语句块）]]）是一组0个或多个语句组成的集合，它们被编译器看做一个整体，就好像一个单一的语句一样。语句块从 `{` 符号开始，到 `}` 符号结束，其中包含了所有的语句。在任何允许使用单一语句的地方，也都可以使用语句块。语句块的结束处不需要使用分号。语句块通常会和[[4-10-Introduction-to-if-statements|4.10 - if 语句简介]]一起使用。

**用户定义的命名空间**（[[6-2-User-defined-namespaces-and-the-scope-resolution-operator|6.2 - 用户定义命名空间和作用域解析运算符]]）指的是你为了自己的声明而创建的命名空间。由C++（全局命名空间）或标准库（`std`命名空间）提供的命名空间不属于用户自定义命名空间。

我们可以通过[[scope-resolution-operator|作用域解析运算符]](`::`)来访问命名空间中的声明。作用域解析运算符告诉编译器到运算符左操作数中去查找右操作数。如果不提供左操作数，则会使用全局作用域。

局部变量（[[6-3-Local-variables|6.3 - 局部变量]]）指的是定义在函数内部的变量（包括函数的[[parameters|形参]]）。局部变量具有语句块作用域，也就是说，它的作用域从变量定义开始，到语句块结束为止。局部变量具有[[automatic-storage-duration|自动存储持续时间]]，也就是说它在定义时被创建，在离开语句块时被销毁。

声明在嵌套语句块中的变量会对外层语句块中的同名变量形成**变量遮蔽**（[[6-5-Variable-shadowing-name-hiding|6.5 - 变量遮蔽]]）。变量遮蔽应当被避免。

全局变量（[[6-4-Introduction-to-global-variables|6.4 - 全局变量]]）指的是定义在函数外部的变量。 全局变量具有文件作用域，这也就意味着它的可见范围从变量定义开始到文件结束为止。全局变量具有[[static-storage-duration|静态存储持续时间]]，也是说该变量会在程序开始时创建，程序结束时销毁。尽可能避免对静态变量的动态 初始化。

一个标识符的链接属性，决定了该标识符的qAn identifier’s linkage determines whether other declarations of that name refer to the same object or not. Local variables have no linkage. Identifiers with internal linkage can be seen and used within a single file, but it is not accessible from other files. Identifiers with external linkage can be seen and used both from the file in which it is defined, and from other code files (via a forward declaration).

Avoid non-const global variables whenever possible. Const globals are generally seen as acceptable. Use inline variablesfor global constants if your compiler is C++17 capable.

Local variables can be given static duration via the static keyword.

Using statements (including using declarations and using directives) can be used to avoid having to qualify identifiers with an explicit namespace. These should generally be avoided.

Inline functions were originally designed as a way to request that the compiler replace your function call with inline expansion of the function code. You should not need to use the inline keyword for this purpose because the compiler will generally determine this for you. In modern C++, the `inline` keyword is used to exempt a function from the one-definition rule, allowing its definition to be imported into multiple code files. Inline functions are typically defined in header files so they can be #included into any code files that needs them.

A constexpr function is a function whose return value may be computed at compile-time. To make a function a constexpr function, we simply use the `constexpr` keyword in front of the return type. A constexpr function that is eligible for compile-time evaluation must be evaluated at compile-time if the return value is used in a context that requires a constexpr value. Otherwise, the compiler is free to evaluate the function at either compile-time or runtime.

C++20 introduces the keyword `consteval`, which is used to indicate that a function must evaluate at compile-time, otherwise a compile error will result. Such functions are called immediate functions.

Finally, C++ supports unnamed namespaces, which implicitly treat all contents of the namespace as if it had internal linkage. C++ also supports inline namespaces, which provide some primitive versioning capabilities for namespaces.