---
title: 8.2 - 浮点数和整型提升
alias: 8.2 - 浮点数和整型提升
origin: /cpp-tutorial/floating-point-and-integral-promotion/
origin_title: "8.2 — Floating-point and integral promotion"
time: 2021-12-30
type: translation
tags:
- promotion
---

??? note "关键点速记"

	- 

在 [[4-3-Object-sizes-and-the-sizeof-operator|4.3 - 对象的大小和 sizeof 操作符]] 中我们介绍过，C++ 只能保证每种基础类型最小的尺寸。而这些类型的具体尺寸要看具体的编译器和体系结构。

正是因为允许这种变化，所以`int` 和 `double` 数据类型才能在特定体系结构的计算机上被设置为能够提供最优性能的大小。例如，对于一个 32 位计算机来说，它每次能够处理 32 位的数据。这种情况下， `int`被设置为 32 位宽度，因为这是CPU处理数据时最”自然“（也就可能是最高效的）的宽度。

!!! info "提醒"

	数据类型占用的位数称为宽度。占用的位数越多，宽度也就越宽，而越窄的数据则占用的位数也越少。
	
但是，如果 32 位 CPU 需要修改一个 8 位的值（例如`char`类型）时会怎样？Some 32-bit processors (such as the x86 series) can manipulate 8-bit or 16-bit values directly. However, doing so is often slower than manipulating 32-bit values! Other 32-bit CPUs (like the PowerPC), can only operate on 32-bit values, and additional tricks must be employed to manipulate narrower values.

## 数值提升

Because C++ is designed to be portable and performant across a wide range of architectures, the language designers did not want to assume a given CPU would be able to efficiently manipulate values that were narrower than the natural data size for that CPU.

To help address this challenge, C++ defines a category of type conversions informally called the `numeric promotions`. A numeric promotion is the type conversion of a narrower numeric type (such as a `char`) to a wider numeric type (typically `int` or `double`) that can be processed efficiently and is less likely to have a result that overflows.

All numeric promotions are value-preserving, which means that all values in the original type are representable without loss of data or precision in the new type. Because such promotions are safe, the compiler will freely use numeric promotion as needed, and will not issue a warning when doing so.

## Numeric promotion reduces redundancy

Numeric promotion solves another problem as well. Consider the case where you wanted to write a function to print a value of type `int`:

```cpp
#include <iostream>

void printInt(int x)
{
    std::cout << x;
}
```

COPY

While this is straightforward, what happens if we want to also be able to print a value of type `short`, or type `char`? If type conversions did not exist, we’d have to write a different print function for `short` and another one for `char`. And don’t forget another version for `unsigned char`, `signed char`, `unsigned short`, `wchar_t`, `char8_t`, `char16_t`, and `char32_t`! You can see how this quickly becomes unmanageable.

Numeric promotion comes to the rescue here: we can write functions that have `int` and/or `double` parameters (such as the `printInt()` function above). That same code can then be called with arguments of types that can be numerically promoted to match the types of the function parameters.

## 数值提升分类

The numeric promotion rules are divided into two subcategories: `integral promotions` and `floating point promotions`.

## 浮点数提升

We’ll start with the easier one.

Using the floating point promotion rules, a value of type `float` can be converted to a value of type `double`.

This means we can write a function that takes a `double` and then call it with either a `double` or a `float` value:

```cpp
#include <iostream>

void printDouble(double d)
{
    std::cout << d;
}

int main()
{
    printDouble(5.0); // no conversion necessary
    printDouble(4.0f); // numeric promotion of float to double

    return 0;
}
```

In the second call to `printDouble()`, the `float` literal `4.0f` is promoted into a `double`, so that the type of argument matches the type of the function parameter.

## 整型提升

The integral promotion rules are more complicated.

Using the integral promotion rules, the following conversions can be made:

-   signed char or signed short can be converted to int.
-   unsigned char, char8_t, and unsigned short can be converted to int if int can hold the entire range of the type, or unsigned int otherwise.
-   If char is signed by default, it follows the signed char conversion rules above. If it is unsigned by default, it follows the unsigned char conversion rules above.
-   bool can be converted to int, with false becoming 0 and true becoming 1.

There are a few other integral promotion rules that are used less often. These can be found at [https://en.cppreference.com/w/cpp/language/implicit_conversion#Integral_promotion](https://en.cppreference.com/w/cpp/language/implicit_conversion#Integral_promotion).

In most cases, this lets us write a function taking an `int` parameter, and then use it with a wide variety of other integral types. For example:

```cpp
#include <iostream>

void printInt(int x)
{
    std::cout << x;
}

int main()
{
    printInt(2);

    short s{ 3 }; // there is no short literal suffix, so we'll use a variable for this one
    printInt(s); // numeric promotion of short to int

    printInt('a'); // numeric promotion of char to int
    printInt(true); // numeric promotion of bool to int

    return 0;
}
```


There are two things worth noting here. First, on some systems, some of the integral types may be converted to `unsigned int` rather than `int`. Second, some narrower unsigned types (such as `unsigned char`) will be converted to larger signed types (such as `int`). So while integral promotion is value-preserving, it is not necessarily sign-preserving.

## 不是所有的值保留类型转换都是数值提升

Some [[value-preserving|值保留(value-preserving)]]value-preserving type conversions (such as `char` to `short`, `int` to `long`, or `int` to `double`) are not considered to be numeric promotions in C++ (they are `numeric conversions`, which we’ll cover shortly in lesson [8.3 -- Numeric conversions](https://www.learncpp.com/cpp-tutorial/numeric-conversions/)). This is because such conversions do not assist in the goal of converting smaller types to larger types that can be processed more efficiently.

The distinction is mostly academic. However, in certain cases, the compiler will favor numeric promotions over numeric conversions. We’ll see examples where this makes a difference when we cover function overload resolution (in upcoming lesson [8.11 -- Function overload resolution and ambiguous matches](https://www.learncpp.com/cpp-tutorial/function-overload-resolution-and-ambiguous-matches/)).

