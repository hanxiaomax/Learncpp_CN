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

C++ comes with support for many fundamental data types, including floating point numbers, integers, boolean, chars, null pointers, and void.

**Void**（[[4-2-Void|4.2 - Void]]） is used to indicate no type. It is primarily used to indicate that a function does not return a value.

Different types take different amounts of memory, and the amount of memory used may vary by machine. See [[4-3-Object-sizes-and-the-sizeof-operator|4.3 - 对象的大小和 sizeof 操作符]]for a table indicating the minimum size for each fundamental type.

The sizeof operator can be used to return the size of a type in bytes.

**Signed integers**（[[4-4-Signed-integers|4.4 - 有符号整型]]） are used for holding positive and negative whole numbers, including 0. The set of values that a specific data type can hold is called its range. When using integers, keep an eye out for overflow and integer division problems.

**Unsigned integers**（[[4-5-Unsigned-integers-and-why-to-avoid-them|4.5 - 无符号整型以及为什么要避免使用它]]） only hold positive numbers, and should generally be avoided unless you’re doing bit-level manipulation.

**Fixed-width integers** （[[4-6-Fixed-width-integers-and-size_t|4.6 - 固定宽度整型和 size_t]]）are integers with guaranteed sizes, but they may not exist on all architectures. The fast and least integers are the fastest and smallest integers that are at least some size. `std::int8_t` and `std::uint8_t` should generally be avoided, as they tend to behave like chars instead of integers.

**size_t** is an unsigned integral type that is used to represent the size or length of objects.

**Scientific notation** （[[4-7-Introduction-to-scientific-notation|4.7 - 科学计数法]]）is a shorthand way of writing lengthy numbers. C++ supports scientific notation in conjunction with floating point numbers. The digits in the significand (the part before the e) are called the significant digits.

**Floating point** （[[4-8-Floating-point-numbers|4.8 - 浮点数]]）is a set of types designed to hold real numbers (including those with a fractional component). The precision of a number defines how many significant digits it can represent without information loss. A rounding error can occur when too many significant digits are stored in a floating point number that can’t hold that much precision. Rounding errors happen all the time, even with simple numbers such as 0.1. Because of this, you shouldn’t compare floating point numbers directly.

The **boolean**（[[4-9-Boolean-values|4.9 - 布尔值]]） type is used to store a true or false value.

**If statements** [[4-10-Introduction-to-if-statements|4.10 - if 语句简介]]（allow us to execute one or more lines of code if some condition is true. The conditional expression of an _if statement_ is interpreted as a boolean value.

**Char** （[[4-11-Chars|4.11 - 字符]]）is used to store values that are interpreted as an ASCII character. When using chars, be careful not to mix up ASCII code values and numbers. Printing a char as an integer value requires use of static_cast.

Angled brackets are typically used in C++ to represent something that needs a parameterizable type. This is used with static_cast to determine what data type the argument should be converted to (e.g. `static_cast<int>(x)` will convert _x_ to an int).（[[4-12-Introduction-to-type-conversion-and-static_cast|4.12 - 类型转换和 static_cast]]）

**std::string** （[[4-13-An introduction-to-std-string|4.13 - std::string 简介]]）offers an easy and safe way to deal with text strings. String literals are always placed between double quotes. std::string lives in the `<string>` header.

A **constant** （[[4-14-Literal-constants|4.14 - 字面量常量]]）is a fixed value that may not be changed. C++ supports two types of constants: literal constants, and symbolic constants.

**Literals**（[[4-14-Literal-constants|4.14 - 字面量常量]]） are values inserted directly into the code. Literals have types, and literal suffixes can be used to change the type of a literal from default.

**Const** （[[4-14-Literal-constants|4.14 - 字面量常量]]）variables are variables that can’t be changed after being initialized. Const variables can be either runtime or compile-time constants. **constexpr** variables must be compile-time constants.

Don’t use magic numbers in your code. Instead, use symbolic constants.