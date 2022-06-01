---
title: 4.x - 小结与测试
alias: 4.x - 小结与测试
origin: /chapter-4-summary-and-quiz/
origin_title: "4.x — Chapter 4 summary and quiz"
time: 2022-4-12
type: translation
tags:
- summary
---


## 章节回顾

内存的最小单元称为[[bit|位]]。内存可寻找的最小单位是[[byte|字节]]，现代标准一个字节等于8个位。

一种**数据类型** ([[4-1-Introduction-to-fundamental-data-types|4.1 - 基础数据类型简介]])告诉编译器如何将内存中的数据解析成有意义的值。

C++ 支持多种基础数据类型，包括浮点数、整型、布尔类型、字符、null指针和 void。

**Void**（[[4-2-Void|4.2 - Void]]） 用于表示无类型。其最主要的作用是表明函数无返回值。

不同数据类型占据的内存大小也不同，同时也会收到机器体系结构的影响。参考 [[4-3-Object-sizes-and-the-sizeof-operator|4.3 - 对象的大小和 sizeof 操作符]] 中的表格了解每种基础数据类型占用的空间。

`sizeof` 运算符可以返回某个类型所占用的字节数。

**有符号整型**（[[4-4-Signed-integers|4.4 - 有符号整型]]） 用于保存正数和负数，也包括0。一个特定数据类型能够保存的值，称为该类型的范围。当使用整型时，一定要注意溢出和整型除0问题。

**无符号整型**（[[4-5-Unsigned-integers-and-why-to-avoid-them|4.5 - 无符号整型以及为什么要避免使用它]]）只能保存正整数，通常应该避免使用它，除非是用于位运算。

**固定宽度整型** （[[4-6-Fixed-width-integers-and-size_t|4.6 - 固定宽度整型和 size_t]]）是具有确定大小的整型，但是并不是所有的体系结构都支持。速度优先和大小优先的整型是保证某其具有某大小前提下的最快的或最小的整型。`std::int8_t` 和 `std::uint8_t` 一般不要使用，它们的行为更像字符而不是整型。

**size_t** 是一种无符号整型，它用于表示对象的大小或长度。

**科学计数法** （[[4-7-Introduction-to-scientific-notation|4.7 - 科学计数法]]）是一种表示大数的简单记法。C++ 支持科学计数法表示浮点数。科学计数法中，e前面的部分称为有效数字。

**浮点数** （[[4-8-Floating-point-numbers|4.8 - 浮点数]]）类型用于保存实数（包括哪些有小数部分的数）。数字的精度指的是在不丢失精度的前提下，可以表示多少个有效数字。[[rounding-error|舍入误差]]出现在过多的有效数字被存放在无法保存这么多有效数字的浮点数中。舍入误差一致存在，nding errors happen all the time, even with simple numbers such as 0.1. Because of this, you shouldn’t compare floating point numbers directly.

**布尔**（[[4-9-Boolean-values|4.9 - 布尔值]]）类型用于存放 `true` 和 `false`。

**If 语句** [[4-10-Introduction-to-if-statements|4.10 - if 语句简介]]（allow us to execute one or more lines of code if some condition is true. The conditional expression of an _if statement_ is interpreted as a boolean value.

**字符** （[[4-11-Chars|4.11 - 字符]]）is used to store values that are interpreted as an ASCII character. When using chars, be careful not to mix up ASCII code values and numbers. Printing a char as an integer value requires use of static_cast.

Angled brackets are typically used in C++ to represent something that needs a parameterizable type. This is used with static_cast to determine what data type the argument should be converted to (e.g. `static_cast<int>(x)` will convert _x_ to an int).（[[4-12-Introduction-to-type-conversion-and-static_cast|4.12 - 类型转换和 static_cast]]）

**std::string** （[[4-13-An introduction-to-std-string|4.13 - std::string 简介]]）offers an easy and safe way to deal with text strings. String literals are always placed between double quotes. std::string lives in the `<string>` header.

A **constant** （[[4-14-Literal-constants|4.14 - 字面量常量]]）is a fixed value that may not be changed. C++ supports two types of constants: literal constants, and symbolic constants.

**字面量**（[[4-14-Literal-constants|4.14 - 字面量常量]]） are values inserted directly into the code. Literals have types, and literal suffixes can be used to change the type of a literal from default.

**Const** （[[4-14-Literal-constants|4.14 - 字面量常量]]）variables are variables that can’t be changed after being initialized. Const variables can be either runtime or compile-time constants. **constexpr** variables must be compile-time constants.


不要在代码中使用魔术数字，应该用符号常量代替它。