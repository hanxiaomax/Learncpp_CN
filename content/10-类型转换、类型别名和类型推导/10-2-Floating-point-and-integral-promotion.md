---
title: 8.2 - 浮点数和整型提升
alias: 8.2 - 浮点数和整型提升
origin: /cpp-tutorial/floating-point-and-integral-promotion/
origin_title: "8.2 — Floating-point and integral promotion"
time: 2021-12-30
type: translation
tags:
- numeric promotion
- conversions
---

> [!note] "Key Takeaway"
> - 数值提升属于一类类型转换，它将更窄的数据类型（例如`char`）转换为更宽的数据类型（例如 `int` 或 `double`）**使其能够更高效地被处理**，同时也更不容易溢出。（做不到这一点的不叫数值**提升**）
> - 数值提升是安全的，所以编译器可以根据需要自由地使用数字提升，并且在这样做时不会发出警告。
> - 利用数值提升，可以编写函数使用某种可以被提升的类型作为形参，然后可以使用多种类型的形参进行调用。在调用时进自动进行类型提升
> - `float`-> `double`。
> - `unsigned char`或者`signed char` -> `int`；
> - `unsigned char`，`char8_t` 及`unsigned short` -> `int`，只要 `int`的范围足够表示该类型的范围，否则会转换为`unsigned int`；
> - `bool` -> `int`，`false`转换为 `0`，`true`转换为`1`。
> - 注意：在某些系统上，一些整型可能会被转换为 `unsigned int` 而不是 `int`。其次，一些较窄的无符号类型(如 `unsigned char` )将被转换为较大的有符号类型(如 `int`)。因此，虽然整型提升是保值的，但不一定能保号。


在 [[4-3-Object-sizes-and-the-sizeof-operator|4.3 - 对象的大小和 sizeof 操作符]] 中我们介绍过，C++ 只能保证每种基础类型最小的尺寸。而这些类型的具体尺寸要看具体的编译器和体系结构。

正是因为允许这种变化，所以`int` 和 `double` 数据类型才能在特定体系结构的计算机上被设置为能够提供最优性能的大小。例如，对于一个 32 位计算机来说，它每次能够处理 32 位的数据。这种情况下， `int`被设置为 32 位宽度，因为这是CPU处理数据时最”自然“（也就可能是最高效的）的宽度。

> [!info] "提醒"
> 数据类型占用的位数称为宽度。占用的位数越多，宽度也就越宽，而越窄的数据则占用的位数也越少。
	
但是，如果 32 位 CPU 需要修改一个 8 位的值（例如`char`类型）时会怎样？有些 32 位的处理器（例如 x86 系列）可以直接修改 8 位或者 16 位的值。但是这种情况比修改 32 位的数据要慢得多！其他的 32 位 CPU（例如 PowerPC），只能操作 32 位的值，而操作更窄的数据需要一些额外的技巧。

## 数值提升

因为 C++ 被设计为可以在广泛的平台上进行移植，因此语言的设计者们并不想想假定给定的 CPU 能够高效地操作比自然宽度更窄的数据。

为了解决这个挑战，C++ 定义了一种类型的数据转换，其非正式名称叫做[[numeric promotions|数值提升(numeric promotions)]]。数值提升属于一类类型转换，它将更窄的数据类型（例如`char`）转换为更宽的数据类型（例如 `int` 或 `double`）使其能够更高效地被处理，同时也更不容易溢出。


所有数值提升都是[[value-preserving|值保留(value-preserving)]]的，这意味着原始类型中的所有值都可以在不损失数据或精度的情况下进行表示。因为数值提升是安全的，所以编译器可以根据需要自由地使用数字提升，并且在这样做时不会发出警告。


## 数值提升能够避免冗余代码

数值提升还可以解决其他问题。考虑这样一个场景，如果你希望编写一个函数，打印 `int`类型的值：

```cpp
#include <iostream>

void printInt(int x)
{
    std::cout << x;
}
```

程序非常简单。但是，如果你还希望打印`short`或者`char`类型的值呢？如果没有类型转换的支持，我们就必须编写另外两个不同的函数分别用于打印`short`或者`char`类型的值。更不用说还有其他类型了（ `unsigned char`, `signed char`, `unsigned short`, `wchar_t`, `char8_t`, `char16_t`和`char32_t`）。很显然，这样的代码是不可维护的。

数值提升在这里起到了关键的作用：我们可以编写具有 `int` 和/或 `double` 形参的函数(比如上面的 `printInt()` 函数)。然后使用类型能够在调用函数是通过数值提升类型转换进行匹配的参数即可。

## 数值提升分类

数值提升还能够进一步分为两种子类型：整型提升和浮点数提升。


## 浮点数提升

先从简单的开始。

基于浮点数提升的规则，`float` 类型的值可以被转换 `double`。

这意味着我们可以编写一个接受 `double` 参数的函数，然后用 `double`或`float` 值调用它：

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


在第二次调用 `printDouble()` 时 `float` 字面量 `4.0f` 被提升为 `double` ，因此实参的类型与函数形参的类型匹配。

## 整型提升

整型数值提升就更加复杂了。

基于整型数值提升的规则，可以进行如下的类型转换：
-   无符号`char`或者有符号`char`可以被转换为`int`；
-   无符号`char`，`char8_t` 以及无符号`short`可以被转换为 `int`，只要 `int`的范围足够表示该类型的范围，否则会转换为无符号`int`；
-   如果 `char` 默认有符号的， 则会遵循上述有符号`char`的转换规则。如果默认是无符号的，则遵循上述无符号`char`的转换规则；
-   `bool` 可以被转换为 `int`，`false`转换为 `0`，`true`转换为`1`。

还有一些不常用的整型转换规则可以在[这里](https://en.cppreference.com/w/cpp/language/implicit_conversion#Integral_promotion)找到。


在大多数情况下，这允许我们编写一个接受形参类型为 `int` 的函数，然后与其他各种整型类型配合使用。例如:

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


这里有两点值得注意。首先，在某些系统上，一些整型可能会被转换为 `unsigned int` 而不是 `int`。其次，一些较窄的无符号类型(如 `unsigned char` )将被转换为较大的有符号类型(如 `int`)。因此，虽然整型提升是保值的，但不一定能保号。

## 不是所有的值保留类型转换都是数值提升

一些[[value-preserving|值保留(value-preserving)]] 的类型转换(例如 `char` 到 `short`、`int` 到 `long` 或者 `int` 到 `double`) 在 C++ 中并不被看做数值提升（它们属于**数值转换**），我们会在[[10-3-Numeric-conversions|8.3 - 数值转换]]中进行介绍)。这是因为这样的转换不能帮助实现将较小类型转换为可以更有效地处理的较大类型的目标。

这种区别主要是学术上的。但是，在某些情况下，编译器会倾向于数值提升而不是数值转换。当我们讨论函数重载解析时，我们将看到这样做的不同之处(参见：[[11-3-Function-overload-resolution-and-ambiguous-matches|8.11 - 函数重载解析和匹配歧义]])。
