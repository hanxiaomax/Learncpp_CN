---
title: 11.1 - 函数重载
alias: 11.1 - 函数重载
origin: /introduction-to-function-overloading/
origin_title: "8.9 — Introduction to function overloading"
time: 2022-5-31
type: translation
tags:
- overloading
---

> [!note] "Key Takeaway"
> - 使用相同函数名但形参不同的函数，称为函数重载。
> - 只要编译器能够区分每个重载函数，函数就可以被重载。如果不能区分重载函数，将导致编译错误。
> - C++ 中的操作符其实也是函数，所以它们也可以被重载
> - 重载函数能够进行编译，必须满足两个条件：
>   1. 每个重载的函数都必须能够区分。我们会在 [[11-2-Function-overload-differentiation|8.10 - 函数重载和区分]] 中介绍它们是如何被区分的。
>   2. 每个被调用的重载函数在重载解析时必须能够定位到一个函数。我们会在[[11-3-Function-overload-resolution-and-ambiguous-matches|8.11 - 函数重载解析和匹配歧义]]中介绍如何进行重载函


考虑下面的函数：

```cpp
int add(int x, int y)
{
    return x + y;
}
```

这个简单的函数将两个整数相加并返回一个整数结果。但是，如果我们还需要一个可以将两个浮点数相加的函数呢？这个 `add()`函数并不能实现浮点数相加，因为任何浮点[[parameters|形参]]都会被转换为整数，导致浮点形参丢失它们的小数值。

解决这个问题的一种方法是定义多个名称略有不同的函数:

```cpp
int addInteger(int x, int y)
{
    return x + y;
}

double addDouble(double x, double y)
{
    return x + y;
}
```


但是，为了达到最佳效果，你必须为具有不同类型参数的类似函数，定义一致的命名标准，同时记住这些函数的名称，并确保使用正确的函数。

将来，如果我们又需要一个类似的函数，将三个整数相加而不是两个整数相加的时候会发生什么？为每一个函数创建不同的名称会使代码变得难以维护。


## 函数重载简介

幸运的是，C++ 提供了一个优雅的解决方案。函数重载允许我们使用相同的名称创建多个函数，只要每个相同名称的函数具有不同的形参类型(或者可以用其他方式区分函数)。每个函数都共享一个名称(在同一个作用域中)，称为[[overload|重载(overload)]]函数(有时简称重载)。

对 `add()` 函数进行重载，我们可以声明另外一个`add()`函数，但是参数类型为`double`：

```cpp
double add(double x, double y)
{
    return x + y;
}
```


此时，在同一个作用域中，出现了两个同名的 `add()` 函数：

```cpp
int add(int x, int y) // integer version
{
    return x + y;
}

double add(double x, double y) // floating point version
{
    return x + y;
}

int main()
{
    return 0;
}
```

以上程序是可以编译的。尽管你可能担心这些函数会出现命名冲突，但实际上并不会。因为这些函数的形参类型不同，所以编译器能够区分这些函数，并将它们视为共享一个名称的单独函数。


> [!tldr] "关键信息"
> 只要编译器能够区分每个重载函数，函数就可以被重载。如果不能区分重载函数，将导致编译错误。

> [!info] "相关内容"
> 因为 C++ 中的操作符其实也是函数，所以它们也可以被重载，我们会在 [14.1 -- Introduction to operator overloading](https://www.learncpp.com/cpp-tutorial/introduction-to-operator-overloading/)中进行介绍。

## 函数重载解析

此外，当调用被重载的函数时，编译器会基于形参来匹配最合适的函数调用——称为[[overload-resolution|重载解析(overload resolution)]]。

例如：

```cpp
#include <iostream>

int add(int x, int y)
{
    return x + y;
}

double add(double x, double y)
{
    return x + y;
}

int main()
{
    std::cout << add(1, 2); // calls add(int, int)
    std::cout << '\n';
    std::cout << add(1.2, 3.4); // calls add(double, double)

    return 0;
}
```


上述函数编译执行的结果如下：

```
3
4.6
```

当提供整型形参时（`add(1, 2)`）编译器可以判断出我们需要调用的是 `add(int, int)`。而当我们提供浮点类型的形参时（ `add(1.2, 3.4)`），编译器能够确定我们调用的是`add(double, double)`。

## 使重载的函数能够编译

为了使使用了重载函数的程序能够进行编译，必须满足两个条件：

1. 每个重载的函数都必须能够区分。我们会在 [[11-2-Function-overload-differentiation|8.10 - 函数重载和区分]] 中介绍它们是如何被区分的。
2. 每个被调用的重载函数在重载解析时必须能够定位到一个函数。我们会在[[11-3-Function-overload-resolution-and-ambiguous-matches|8.11 - 函数重载解析和匹配歧义]]中介绍如何进行重载函数的匹配。

如果重载函数不能被区分，或者重载函数的函数调用无法解析为重载函数，则将导致编译错误。

在下一课中，我们将探讨如何区分重载函数。然后，在再下一课中，我们将探索编译器如何将函数调用解析为重载函数。


## 小结


函数重载通过减少需要记住的函数名的数量来降低程序的复杂性。它可以而且应该被广泛使用。

> [!success] "最佳实践"
> 使用函数重载可以简化程序。