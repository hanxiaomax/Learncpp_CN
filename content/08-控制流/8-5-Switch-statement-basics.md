---
title: 7.4 - switch 语句基础
alias: 7.4 - switch 语句基础
origin: /switch-statement-basics/
origin_title: "7.4 — Switch statement basics"
time: 2022-2-10
type: translation
tags:
- switch
- control flow
---

> [!note] "Key Takeaway"
	

尽管我们可以编写很多链式 if-else，但是这么做不仅写起来费劲，效率也不高。例如：

```cpp
#include <iostream>

void printDigitName(int x)
{
    if (x == 1)
        std::cout << "One";
    else if (x == 2)
        std::cout << "Two";
    else if (x == 3)
        std::cout << "Three";
    else
        std::cout << "Unknown";
}

int main()
{
    printDigitName(2);

    return 0;
}
```

这个例子并不复杂，x 最多会被求值三次（不高效），读者也必须明白被求值多次的是`x`而不是其他变量。

由于针对一组不同的值测试变量或表达式是否相等是很常见的，C++提供了另外一种可选的条件语句，称为**switch语句**，专门用于此目的。下面的代码用switch语句实现了相同的功能：

```cpp
#include <iostream>

void printDigitName(int x)
{
    switch (x)
    {
        case 1:
            std::cout << "One";
            return;
        case 2:
            std::cout << "Two";
            return;
        case 3:
            std::cout << "Three";
            return;
        default:
            std::cout << "Unknown";
            return;
    }
}

int main()
{
    printDigitName(2);

    return 0;
}
```

switch 背后的思想很简单：表达式(有时称为条件)求值后得到一个值。如果表达式的值能够和后面的某个分支标签匹配，则该标签后的语句就会被执行。如果没有匹配的标签，但是存在default标签，则执行default后面的语句。

和if语句相比，switch语句的优势在于条件求值只需要做一次（更高效），而且switch语句看起来更清楚，可读性更好。

> [!success] "最佳实践"
> 如果可以的话，尽量用 switch 语句代替 if-else 语句链。
	
让我们更详细地研究这些概念。

## 创建 switch 

使用 `switch` 关键字，后面加上括号以及需要在括号中求值的条件表达式，就可以创建switch语句。通常情况下表达式会是一个单一变量，但是也可以是任何合法的表达式。

关于这里的条件语句，它的一个限制条件是其求值结果必须为[[integral-type|整型类型]](如何你还不熟悉整型类型，请参见：[[4-1-Introduction-to-fundamental-data-types|4.1 - 基础数据类型简介]]) 或[[scoped-enumerations|有作用域枚举]]类型(参见：[[13-2-unscoped-enumerations|10.2 - 无作用域枚举类型]])，或者是任何能转换成上述类型的值。浮点类型、字符串和大多数其他非整型的表达式都不可用。

> [!info] "扩展阅读"
> 为什么switch只使用整数(或枚举)类型？答案是因为switch语句被高度优化了。历史上，编译器实现switch语句最常见的方法是通过[跳表](https://en.wikipedia.org/wiki/Branch_table)实现的，而跳转表只适用于整数值。
> 对于那些已经熟悉数组的人来说，跳表的工作原理非常类似于数组，使用整数值作为数组索引，直接“跳转”到结果。这比执行一堆顺序比较要高效得多。
> 当然，编译器不必使用跳表实现switch，有时也不需要。从技术上讲，C++没有理由不能放松此处的类型限制，以便其他类型也可以使用，只是目前还没有这样做罢了(直到C++20)。

在条件表达式后面，我们声明一个语句块。在语句块内部，使用标签来定义我们想要测试是否相等的所有值，标签有两种：

## 分支标签

第一种标签是分支标签，它使用 `case` 关键字声明，后面跟着一个常量表达式。常量表达式必须匹配条件的类型，或可以转换为该类型。

如果条件表达式求值结果等于某个分支标签的值，则从该标签后面的第一条语句继续顺序执行。


下面的例子中，条件表达式可以匹配一个分支标签：

```cpp
#include <iostream>

void printDigitName(int x)
{
    switch (x) // x 求值为 2
    {
        case 1:
            std::cout << "One";
            return;
        case 2: // 匹配
            std::cout << "Two"; // 从这里开始执行
            return; // 执行到这条语句后就返回
        case 3:
            std::cout << "Three";
            return;
        default:
            std::cout << "Unknown";
            return;
    }
}

int main()
{
    printDigitName(2);

    return 0;
}
```

程序输出：

```
Two
```

在上面的例子中，`x` 求值为2。因为分支标签中也有2，所以程序会跳转到该标签下的第一条语句开始执行。该程序会打印 `Two`，然后从 `return` 语句返回给调用者。

分支标签的个数并没有现在，但是每个标签必须是唯一的，所以下面的代码是错误的：

```cpp
switch (x)
{
    case 54:
    case 54:  // error: already used value 54!
    case '6': // error: '6' converts to integer value 54, which is already used
}
```


## default 标签

第二种标签称为 default 标签(经常被称为默认分支)，使用 `default` 关键字定义。如果条件表达式不能够匹配任何其他标签且default 标签存在，则从default标签后的第一条语句开始执行。

```cpp
#include <iostream>

void printDigitName(int x)
{
    switch (x) // x is evaluated to produce value 5
    {
        case 1:
            std::cout << "One";
            return;
        case 2:
            std::cout << "Two";
            return;
        case 3:
            std::cout << "Three";
            return;
        default: // which does not match to any case labels
            std::cout << "Unknown"; // so execution starts here
            return; // and then we return to the caller
    }
}

int main()
{
    printDigitName(5);

    return 0;
}
```

程序打印：

```
Unknown
```

default 分支是可选的，如果有的话则只能有一个。一般来讲，default分支会被放置在switch语句中的最后一个分支。


> [!success] "最佳实践"
> 将 default 作为最后一个分支。


## 没有匹配的分支也没有默认分支

如果条件表达式的值不匹配任何分支，并且没有提供默认分支，则switch内部不会执行任何case。在switch结束后继续执行。

```cpp
#include <iostream>

void printDigitName(int x)
{
    switch (x) // x is evaluated to produce value 5
    {
    case 1:
        std::cout << "One";
        return;
    case 2:
        std::cout << "Two";
        return;
    case 3:
        std::cout << "Three";
        return;
    // no matching case exists and there is no default case
    }

    // so execution continues here
    std::cout << "Hello";
}

int main()
{
    printDigitName(5);
    std::cout << '\n';

    return 0;
}
```

在上面的例子中， `x`  求值为 `5`，但是由于没有匹配的分支，也没有默认分支。所以不会走到任何case中，程序在switch块结束后继续向下执行。打印 `Hello`。


## 使用 break 

在上面的例子中，我们使用 `return` 语句来停止标签后面语句的执行。但是，这也会退出整个函数。

`break` 语句(使用`break` 关键字声明)告诉编译器，我们已经完成了switch语句的执行但需要继续执行外面的语句。这允许我们在不退出整个函数的情况下退出“switch语句”。

下面是一个用`break` 而不是`return` 重写的例子:

```cpp
#include <iostream>

void printDigitName(int x)
{
    switch (x) // x evaluates to 3
    {
        case 1:
            std::cout << "One";
            break;
        case 2:
            std::cout << "Two";
            break;
        case 3:
            std::cout << "Three"; // 从这里开始执行
            break; // 跳到 switch 结束时
        default:
            std::cout << "Unknown";
            break;
    }

    // 从这里继续执行
    std::cout << " Ah-Ah-Ah!";
}

int main()
{
    printDigitName(3);

    return 0;
}
```

程序打印：

```
Three Ah-Ah-Ah!
```

> [!success] "最佳实践"
> 标签下的每组语句都应该以“break语句”或“return语句”结束。这包括switch最后一个标签下面的语句。


那么，如果不以`break` 或 `return` 作为一组语句的结尾，会发生什么呢?我们将在下一课中探讨这个话题和其他话题。

