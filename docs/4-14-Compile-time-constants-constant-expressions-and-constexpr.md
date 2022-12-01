---
title: 4.14 - 编译时常量、常量表达式和 constexpr
alias: 4.14 - 编译时常量、常量表达式和 constexpr
origin: /compile-time-constants-constant-expressions-and-constexpr/
origin_title: "4.14 — Compile-time constants, constant expressions, and constexpr"
time: 2022-1-2
type: translation
tags:
- const
- constexpr
---

??? note "Key Takeaway"


考虑下面的函数：

```cpp
#include <iostream>

int main()
{
    std::cout << 3 + 4;

    return 0;
}
```

输出结果为：

```
7
```

不过，这里包含了一个不易被发现的优化点。

如果对上述文件原封不动地进行编译，编译器将生成一个可执行文件，并在运行时(当程序运行时)计算 3 + 4 的结果。如果程序被执行 100 万次，3 + 4 将被计算 100 万次，7 的结果值将产生 100 万次。但是请注意，3 + 4 的结果永远不会改变——它总是 7。因此，每次程序运行时重新计算 3 + 4 是一种浪费。

## 常量表达式

常量表达式是可以由编译器在编译时求值的表达式。要成为常量表达式，表达式中的所有值必须在编译时已知(调用的所有操作符和函数必须支持编译时求值)。

当编译器遇到常量表达式时，它将用该常量表达式的求值结果替换该常量表达式。

在上面的程序中，表达式 3 + 4 是一个常量表达式。因此，当这个程序被编译时，编译器将计算常数表达式 3 + 4 ，然后将常数表达式 3 + 4 替换为结果值 7  。换句话说，编译器实际上编译的是下面的代码：

```cpp
#include <iostream>

int main()
{
    std::cout << 7;

    return 0;
}
```

这个程序产生相同的输出( 7 )，但最终的可执行文件不再需要在运行时花费 CPU 周期计算 3 + 4  !

注意，替换后的表达式 `std:: cout << 7` 不是一个常量表达式，因为我们的程序不能在编译时将值输出到控制台。所以这个表达式会在运行时求值。

!!! tldr "关键信息"

    在编译时对常量表达式求值会使编译花费更长的时间(因为编译器必须做更多的工作)，但是这样的表达式只需要求值一次(而不是每次程序运行时)。得到的可执行文件速度更快，使用的内存更少。


## 编译时常数

编译时常数是一个在编译时其值已知的常数。字面量(例如 `1`，`2.3` 和 `"Hello, world!"`)是一种编译时常量。

那么 `const` 变量呢？`const` 变量可能是也可能不是编译时常量。

## 编译时常量(`const`)

如果 `const` 变量的初始化值是常量表达式，那么它就是编译时常量。

考虑一个与上面类似的使用 `const` 变量的程序:

```cpp
#include <iostream>

int main()
{
    const int x { 3 };  // x 是编译时常量
    const int y { 4 };  // y 是编译时常量

    std::cout << x + y; // x + y 是编译时常量

    return 0;
}
```

因为 `x` 和 `y` 的初始化值是常量表达式，所以 `x` 和 `y` 是编译时常量。这意味着 `x + y` 也是一个常数表达式。因此，当编译器编译这个程序时，它可以计算 `x + y` 的值，并将常量表达式替换为结果字面值 7 。

请注意，编译时 `const` 的初始化式可以是任何常量表达式。以下两个都是编译时的 `const` 变量:

```cpp
const int z { 1 + 2 };
const int w { z * 2 };
```

编译时的 `const` 变量通常被用作符号常量:

```cpp
const double gravity { 9.8 };
```

编译时常量使编译器能够执行非编译时常量无法提供的优化。例如，每当使用 `gravity` 时，编译器可以简单地用双精度字面值 `9.8`  替换标识符 `gravity` ，这就避免了必须从内存中某处获取值。

在许多情况下，编译时常量将被**优化掉**。在无法实现的情况下(或当优化关闭时)，变量仍然会在运行时创建(和初始化)。

## 运行时常量(`const`)

任何用非常量表达式初始化的 `const` 变量都是运行时常量。运行时常量是在运行时才知道其初始化值的常量。

下面的例子演示了运行时常量的用法:

```cpp
#include <iostream>

int getNumber()
{
    std::cout << "Enter a number: ";
    int y{};
    std::cin >> y;

    return y;
}

int main()
{
    const int x{ 3 };           // x is a compile time constant

    std::cout << "Enter a number: ";
    const int y{ getNumber() }; // y is a runtime constant

    std::cout << x + y;         // x + y is a runtime expression

    return 0;
}
```

即使 `y`  是 `const`，其初始化值( `getNumber()` 的返回值)要到运行时才知道。因此， `y` 是一个运行时常量，而不是编译时常量。因此，表达式 `x + y` 是一个运行时表达式。

## `constexpr` 关键字

当声明 `const` 变量时，编译器将隐式地跟踪它是运行时常量还是编译时常量。在大多数情况下，除了优化目的之外，是运行时常量还是编译时常量并不重要，但也有一些奇怪的情况下，C++需要编译时常量而不是运行时常量(我们将在稍后介绍这些主题时讨论这些情况)。

因为编译时常量通常允许更好的优化(并且几乎没有缺点)，所以我们通常希望尽可能使用编译时常量。

当使用 `const`  时，变量最终可能是编译时的 `const` 或运行时的 `const`，这取决于初始化式是否是编译时表达式。因为两者的定义看起来完全相同，所以我们最终得到的可能是一个运行时常量，而我们原以为得到的是一个编译时常量。在前面的例子中，很难区分 `y` 是编译时的 `const` 还是运行时的 `const`——我们必须查看 `getNumber()` 的返回值来确定。

幸运的是，我们可以得到编译器的帮助，以确保在预期的地方得到编译时的 `const`。为此，我们在变量声明中使用 `constexpr` 而不是 `const` 。`constexpr`(“常量表达式”的缩写)变量只能是编译时常量。如果 `constexpr` 变量的初始化值不是常量表达式，编译器将出错。

例如：

```cpp
#include <iostream>

int main()
{
    constexpr double gravity { 9.8 }; // ok: 9.8 is a constant expression
    constexpr int sum { 4 + 5 };      // ok: 4 + 5 is a constant expression
    constexpr int something { sum };  // ok: sum is a constant expression

    std::cout << "Enter your age: ";
    int age{};
    std::cin >> age;

    constexpr int myAge { age };      // compile error: age is not a constant expression

    return 0;
}
```

!!! success "最佳实践"

    任何在初始化后值就不能被改变，且初始化值可以在编译时确定的变量，都必须声明为 `constexpr`。
    任何在初始化后值就不能被改变，但是初始化值不能在编译时确定的变量，都应该声明为 `const`。

Although function parameters can be `const`, function parameters cannot be `constexpr`.

!!! info "相关内容"

    C++ 也支持在编译时求值的函数(因此可以在常量表达式中使用)——我们会在[[6-14-Constexpr-and-consteval-functions|6.14 - Constexpr 和 consteval 函数]]中讨论这些函数。
