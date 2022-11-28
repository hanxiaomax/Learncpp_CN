---
title: B.1 - C++11
alias: B.1 - C++11
origin: /b-1-introduction-to-c11/
origin_title: "B.1 — Introduction to C++11"
time: 2022-6-27
type: translation
---



## C++11 是什么？

On August 12, 2011, the [ISO (International Organization for Standardization)](https://www.iso.org/home.html) approved a new version of C++, called C++11. C++11 adds a whole new set of features to the C++ language! Use of these new features is entirely optional -- but you will undoubtedly find some of them helpful. The prior tutorials have all been updated to be C++11 compliant.

## C++ 11的设计目标

Bjarne Stroustrup characterized the goals of C++11 as such:

-   Build on C++’s strengths -- rather than trying to extend C++ to new areas where it may be weaker (eg. Windows applications with heavy GUI), focus on making it do what it does well even better.
-   Make C++ easier to learn, use, and teach -- provide functionality that makes the language more consistent and easier to use.

To that end, the committee that put the language together tried to obey the following general principles:

-   Maintain stability and compatibility with older versions of C++ and C wherever possible. Programs that worked under C++03 should generally still work under C++11.
-   Keep the number of core language extensions to a minimum, and put the bulk of the changes in the standard library (an objective that wasn’t met very well with this release)
-   Focus on improving abstraction mechanisms (classes, templates) rather than adding mechanisms to handle specific, narrow situations.
-   Add new functionality for both novices and experts. A little of something for everybody!
-   Increase type safety, to prevent inadvertent bugs.
-   Improve performance and allow C++ to work directly with hardware.
-   Consider usability and ecosystem issues. C++ needs to work well with other tools, be easy to use and teach, etc…

C++11 isn’t a large departure from C++03 thematically, but it did add a huge amount of new functionality.

## C++11中的重要新特性

For your interest, here’s a list of the major features that C++11 adds. Note that this list is not comprehensive, but rather intended to highlight some of the key features of interest.

-   auto ([[8-7-Type-deduction-for-objects-using-the auto-keyword|8.7 - 使用 auto 关键字进行类型推断]])
-   char16_t and char32_t and new literals to support them (no tutorial yet)
-   constexpr ([[4-13-Const-variables-and-symbolic-constants|4.13 - const 变量和符号常量]])
-   decltype (no tutorial yet)
-   default specifier (no tutorial yet)
-   Delegating constructors ([[13-8-overlapping-and-delegating-constructors|13.8 - 重叠和委托构造函数]])
-   delete specifier ([[14-14-converting-constructors-explicit-and-delete|14.14 - 转换构造函数与explicit和delete关键字]])
-   Enum classes ([[10-4-scoped-enumerations-enum-classes|10.4 - 限定作用域枚举（枚举类）]])
-   Extern templates (no tutorial yet)
-   Lambda expressions ([[12-7-introduction-to-lambdas-anonymous-functions|12.7 - lambda表达式简介（匿名函数）]]) and captures ([[12-8-lambda-captures|12.8 - lambda 闭包]])
-   long long int ([[4-3-Object-sizes-and-the-sizeof-operator|4.3 - 对象的大小和 sizeof 操作符]])
-   Move constructor and assignment ([[M-3-move-constructors-and-move-assignment|M.3 - 移动构造函数和移动赋值]])
-   Noexcept specifier (quick mention in [[20.4]])
-   nullptr ([[9-7-Null-pointers|9.7 - 空指针]])
-   override and final specifiers([[18-3-the-override-and-final-specifiers-and-covariant-return-types|18.3 - override、final标识符以及协变返回类型]])
-   Range-based for statements ([[11-13-For-each-loops|11.13 - for-each 循环]])
-   r-value references ([[M-2-R-value-references|M.2 - 右值引用]])
-   static_assert ([[7-17-assert-and-static-assert|7.17 - 断言和 static_assert]])
-   std::initializer_list ([[16-7-std-initializer_list|16.7 - std::initializer_list]])
-   Trailing return type syntax ([[8-7-Type-deduction-for-objects-using-the auto-keyword|8.7 - 使用 auto 关键字进行类型推断]])
-   Type aliases ([[8-6-Typedefs-and-type-aliases|8.6 - typedef 和类型别名]])
-   typedef can now typedef template classes
-   Uniform initialization ([[4-1-Introduction-to-fundamental-data-types|4.1 - 基础数据类型简介]])
-   User-defined literals (no tutorial yet)
-   Variadic templates (no tutorial yet)
-   Two >> symbols without a space between them will now properly be interpreted as closing a template object

There are also many new classes in the C++ standard library available for use.

-   Better support for multi-threading and thread-local storage (no tutorial yet)
-   Hash tables (no tutorial yet)
-   Random number generation improvements (basic discussion in [[7-19-generating-random-numbers-using-mersenne-twister|7.19 - 使用 Mersenne Twister 生成随机数]])
-   Reference wrappers ([[18-9-object-slicing|18.9 - 对象切片]])
-   Regular expressions (no tutorial yet)
-   std::auto_ptr has been deprecated ([[M-1-introduction-to-smart-pointers-and-move-semantics|M.1 - 智能指针和移动语义简介]])
-   std::tuple (no tutorial yet)
-   std::unique_ptr ([[M-6-std-unique-ptr|M.6 — std::unique_ptr]])