---
title: 9.1 - 复合数据类型
alias: 9.1 - 复合数据类型
origin: /introduction-to-compound-data-types/
origin_title: "9.1 — Introduction to compound data types"
time: 2022-1-2
type: translation
tags:
- compound data types
---

> [!note] "Key Takeaway"
>   - C++支持下列复合数据结构
>	-   函数 Functions
>	-   数组 Arrays
>	-   指针 Pointer types:
>	    -   指向对象的指针 Pointer to object
>	    -   指向函数的指针 Pointer to function
>	-   指向成员的指针 Pointer to member types:
>	    -   指向数据成员的指针 Pointer to data member
>	    -   指向成员函数的指针 Pointer to member function
>	-   引用 Reference types:
>	    -   左值引用 L-value references
>	    -   右值引用 R-value references
>	-   枚举 Enumerated types:
>	    -   [[unscoped-enumerations|无作用域枚举类型]] Unscoped enumerations
>	    -   [[scoped-enumerations|限定作用域枚举]] Scoped enumerations
>	-   类 Class types:
>	    -   结构体 Structs
>	    -   类 Classes
>	    -   联合体 Unions
>


在 [[4-1-Introduction-to-fundamental-data-types|4.1 - 基础数据类型简介]] 中我们介绍了基础数据类型，它们是C++语言核心的一部分。

在之前的课程中，我们已经使用这些基础数据类型编写了一些程序，尤其多地用到了`int`。尽管这些基本数据类型非常有用也非常易用，它们并不能涵盖我们所有的需求，尤其是在当我们编写复杂程序的时候。

例如，当编写一个计算程序对两个分数进行相乘的时候，你该如何表示分数呢？你可能会想到使用一组整型（一个作为分子，一个作为分母），例如：

```cpp
#include <iostream>

int main()
{
    // Our first fraction
    int num1 {};
    int den1 {};

    // Our second fraction
    int num2 {};
    int den2 {};

    char ignore {};

    std::cout << "Enter a fraction: ";
    std::cin >> num1 >> ignore >> den1;

    std::cout << "Enter a fraction: ";
    std::cin >> num2 >> ignore >> den2;

    std::cout << "The two fractions multiplied: " << num1 * num2 << '/' << den1 * den2;

    return 0;
}
```

运行程序：

```
Enter a fraction: 1/2
Enter a fraction: 3/4
The two fractions multiplied: 3/8
```

尽管程序可以运行，但是还有很多可以改进的地方。首先，一对整型数的两个整型的联系是很松散的——离开注释和上下文之后，你很难将它们联系起来。第二，为了遵循DRY原则 ，我们应该编写一个函数专门处理分数的输入，但可惜的函数只能返回一个值，所以我们没办法将分子分母返回给主调函数。

现在，考虑这样一种清晰，你正在编写一个包含员工ID的列表。你会怎么做呢？也许是像下面这样：

```cpp
int main()
{
    int id1 { 42 };
    int id2 { 57 };
    int id3 { 162 };
    // and so on
}
```

但是如果你有100多名员工怎么办？首先，你需要定义100个变量名。其次如果你需要将它们全部打印出来怎么办？你又如何将它们传递给函数呢？你需要敲很多很多的代码，这显然是不可持续的。

显然，基本数据类型只能陪我们走这么远了。

## 复合数据类型

幸运的是，C++支持第二类数据类型，称为**复合数据类型**。复合数据类型（有时候也称为组合数据类型）是建立在基本数据类型或其他复合数据类型上的类型，每个复杂数据类型都有其独特的属性。

在本章节及后续章节中，我们将会使用复杂数据类型优雅地解决上面提到的那些令我们头痛的问题。


#### C++ 支持下列复合数据类型：

-   函数 Functions
-   数组 Arrays
-   指针 Pointer types:
    -   指向对象的指针 Pointer to object
    -   指向函数的指针 Pointer to function
-   指向成员的指针 Pointer to member types:
    -   指向数据成员的指针 Pointer to data member
    -   指向成员函数的指针 Pointer to member function
-   引用 Reference types:
    -   左值引用 L-value references
    -   右值引用 R-value references
-   枚举 Enumerated types:
    -   [[unscoped-enumerations|无作用域枚举类型]] Unscoped enumerations
    -   [[scoped-enumerations|限定作用域枚举]] Scoped enumerations
-   类 Class types:
    -   结构体 Structs
    -   类 Classes
    -   联合体 Unions

我们其实已经在频繁使用一种复合类型——函数。例如：

```cpp
void doSomething(int x, double y)
{
}
```

这个函数的类型是 `void(int, double)` 注意，这个类型包含了多个基本数据类型，从而形成了复合类型。当然，函数也有其特殊的行为（例如：可以被调用）。

关于这一话题有很多内容需要介绍，因此我们会使用三个章节来介绍。在本章节中，我们会介绍一些简单直观的复合数据类型，包括[[lvalue-reference|左值引用]]和指针。在下一章节中，我们则会介绍[[unscoped-enumerations|无作用域枚举类型]]、[[scoped-enumerations|限定作用域枚举]]和基本的结构体。然后，再下一章节我们会更加深入地介绍非常有用的数组类型，包括 `std::string`([[4-17-an-introduction-to-std-string|4.17 - std::string 简介]])，它其实是一种class类型。

准备好了吗！Let’s go!