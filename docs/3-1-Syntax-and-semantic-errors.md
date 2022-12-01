---
title: 3.1 - 语法和语义错误
alias: 3.1 - 语法和语义错误
origin: /syntax-and-semantic-errors/
origin_title: "3.1 — Syntax and semantic errors"
time: 2020-11-15
type: translation
tags:
- Syntax
---

软件错误是普遍存在的。制造它们很容易，但要找到它们却很难。在本章中，我们将探讨C++程序问题定位与拍错的相关主题，包括学习如何使用集成调试器，它是IDE的一部分。

尽管调试工具和技术并不是C++标准的一部分，但学会在所编写的程序中发现并删除错误是成为一名成功程序员极为重要的一部分。因此，我们将花一点时间讨论这些主题，以便随着你编写的程序变得更加复杂，你诊断和纠正问题的能力也会以匹配的速度提高。

如果你有用另一种编译编程语言调试程序的经验，那么应该已经熟悉其中的大部分内容。

## 语法错误和语义错误

编程并不简单，更何况 C++是一种有点古怪的语言。把这两者放在一起，就会有很多出错的方式。错误通常分为两类：语法错误和语义错误(逻辑错误)。

当编写的语句属于C++无效无效时，就会发生**语法错误**。这包括缺少分号、使用未声明的变量、括号或大括号不匹配等错误。例如，下面的程序包含相当多的语法错误：

```cpp
#include <iostream>

int main()
{
    std::cout < "Hi there"; << x; // invalid operator (<), extraneous semicolon, undeclared variable (x)
    return 0 // missing semicolon at end of statement
}
```

幸运的是，编译器通常会捕获语法错误并生成警告或错误，因此你可以轻松地识别和修复这些问题。然后就是重新编译直到消除所有错误的问题了。

一旦你的程序编译正确，让它实际产生你想要的结果可能是棘手的。当语句在语法上是有效的，但并没有按照程序员的意图执行时，就会发生**语义错误**。

有时这将导致你的程序崩溃，例如除0的情况：

```cpp
#include <iostream>

int main()
{
    int a { 10 };
    int b { 0 };
    std::cout << a << " / " << b << " = " << a / b; // division by 0 is undefined
    return 0;
}
```

但更多时候语义错误只会导致结果错误或行为错误：

```cpp
#include <iostream>

int main()
{
    int x;
    std::cout << x; // Use of uninitialized variable leads to undefined result

    return 0;
}
```

或者

```cpp
#include <iostream>

int add(int x, int y)
{
    return x - y; // function is supposed to add, but it doesn't
}

int main()
{
    std::cout << add(5, 3); // should produce 8, but produces 2

    return 0;
}
```

亦或者

```cpp
#include <iostream>

int main()
{
    return 0; // function returns here

    std::cout << "Hello, world!"; // so this never executes
}
```


现代编译器在检测某些类型的常见语义错误(例如使用未初始化的变量)方面做得越来越好。然而，在大多数情况下，编译器将无法捕获大多数这类问题，因为编译器被设计为强制语法，而不是强制语义。

在上面的例子中，错误很容易发现。但是在大多数重要的程序中，通过目测代码不容易发现语义错误。这就是调试技术派上用场的地方。
