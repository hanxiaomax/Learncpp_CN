---
title: 8.1 - 隐式类型转换
alias: 8.1 - 隐式类型转换
origin: /implicit-type-conversion-coercion/
origin_title: "8.1 -- Implicit type conversion (coercion)"
time: 2022-2-18
type: translation
tags:
- type conversion
---


## 类型转换简介

对象的值是以一系列的[[bit|比特]]存放的，而数据类型则告诉编译器应该如何将这一系列比特解析成有意义的值。不同的数据类型可以以不同的方式表示*相同*的值。例如，整型值 3 可能被存放为二进制  `0000 0000 0000 0000 0000 0000 0000 0011`，而浮点数 3.0 则可能被存放为二进制 `0100 0000 0100 0000 0000 0000 0000 0000`。

那么当我们这样做的时候会发生什么呢?

```cpp
float f{ 3 }; // initialize floating point variable with int 3
```


这种情况下，编译器不能仅仅把表示`int`类型值 3 的比特拷贝到内存中表示 `float` 变量`f`。相反，它必须将整型值 3 转换为等价的浮点数，然后才能存放到内存中表示变量`f`。

将一种数据类型转换为另外一种数据类型的过程，称为类型转换。

类型转换可以通过两种方式触发：隐式地（编译器需要这么做）或是显式地（由程序员发起）。我们会在本节课介绍[[隐式类型转换（implicit type conversion）]]We’ll cover implicit type conversion in this lesson, and explicit type conversions (casting) in upcoming lesson [8.5 -- Explicit type conversion (casting) and static_cast](https://www.learncpp.com/cpp-tutorial/explicit-type-conversion-casting-and-static-cast/).

## Implicit type conversion

Implicit type conversion (also called automatic type conversion or coercion) is performed automatically by the compiler when one data type is required, but a different data type is supplied. The vast majority of type conversions in C++ are implicit type conversions. For example, implicit type conversion happens in all of the following cases:

When initializing (or assigning a value to) a variable with a value of a different data type:

```cpp
double d{ 3 }; // int value 3 implicitly converted to type double
d = 6; // int value 6 implicitly converted to type double
```


When the type of a return value is different from the function’s declared return type:

```cpp
float doSomething()
{
    return 3.0; // double value 3.0 implicitly converted to type float
}
```


When using certain binary operators with operands of different types:

```cpp
double division{ 4.0 / 3 }; // int value 3 implicitly converted to type double
```

When using a non-Boolean value in an if-statement:

```cpp
if (5) // int value 5 implicitly converted to type bool
{
}
```


When an argument passed to a function is a different type than the function parameter:

```cpp
void doSomething(long l)
{
}

doSomething(3); // int value 3 implicitly converted to type long
```


## What happens when a type conversion is invoked

When a type conversion is invoked (whether implicitly or explicitly), the compiler will determine whether it can convert the value from the current type to the desired type. If a valid conversion can be found, then the compiler will produce a new value of the desired type. Note that type conversions don’t change the value or type of the value or object being converted.

If the compiler can’t find an acceptable conversion, then the compilation will fail with a compile error. Type conversions can fail for any number of reasons. For example, the compiler might not know how to convert a value between the original type and the desired type. In other cases, statements may disallow certain types of conversions. For example:

```cpp
int x { 3.5 }; // brace-initialization disallows conversions that result in data loss
```

COPY

Even though the compiler knows how to convert a `double` value to an `int` value, such conversions are disallowed when using brace-initialization.

There are also cases where the compiler may not be able to figure out which of several possible type conversions is unambiguously the best one to use. We’ll see examples of this in lesson [8.11 -- Function overload resolution and ambiguous matches](https://www.learncpp.com/cpp-tutorial/function-overload-resolution-and-ambiguous-matches/).

So how does the compiler actually determine whether it can convert a value from one type to another?

## The standard conversions

The C++ language standard defines how different fundamental types (and in some cases, compound types) can be converted to other types. These conversion rules are called the standard conversions.

The standard conversions can be broadly divided into 4 categories, each covering different types of conversions:

-   Numeric promotions (covered in lesson [8.2 -- Floating-point and integral promotion](https://www.learncpp.com/cpp-tutorial/floating-point-and-integral-promotion/))
-   Numeric conversions (covered in lesson [8.3 -- Numeric conversions](https://www.learncpp.com/cpp-tutorial/numeric-conversions/))
-   Arithmetic conversions (covered in lesson [8.4 -- Arithmetic conversions](https://www.learncpp.com/cpp-tutorial/arithmetic-conversions/))
-   Other conversions (which includes various pointer and reference conversions)

When a type conversion is needed, the compiler will see if there are standard conversions that it can use to convert the value to the desired type. The compiler may apply zero, one, or more than one standard conversions in the conversion process.

!!! cite "题外话"

	How do you have a type conversion with zero conversions? As an example, on architectures where `int` and `long` both have the same size and range, the same sequence of bits is used to represent values of both types. Therefore, no actual conversion is needed to convert a value between those types -- the value can simply be copied.

The full set of rules describing how type conversions work is both lengthy and complicated, and for the most part, type conversion “just works”. In the next set of lessons, we’ll cover the most important things you need to know about type conversions. If finer detail is required for some uncommon case, the full rules are detailed in [technical reference documentation for implicit conversions](https://en.cppreference.com/w/cpp/language/implicit_conversion).

Let’s get to it!

