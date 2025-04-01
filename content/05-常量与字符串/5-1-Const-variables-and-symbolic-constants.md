---
title: 4.13 - const 变量和符号常量
alias: 4.13 - const 变量和符号常量
origin: /const-variables-and-symbolic-constants/
origin_title: "4.13 — Const variables and symbolic constants"
time: 2022-6-16
type: translation
tags:
- const
---

> [!note] "Key Takeaway"
> - const 变量必须初始化，且初始化之后值不可以改变
> - 函数参数可以为 `const`，但是传值的情况下不需要用
> - 函数的返回值可以为 `const`，但是一般不要用，没有意义而且会影响性能
> - 避免将对象形式的预处理器宏用于符号常量
> - 在多个文件中共享符号常量，可以[[7-10-Sharing-global-constants-across-multiple-files-using-inline-variables|使用 inline 变量共享全局常量]]

在编程中，常量（constant）指的是不会改变的值。C++支持几种类型的常量：`const` 变量（参见：[[4-14-Compile-time-constants-constant-expressions-and-constexpr|4.14 - 编译时常量、常量表达式和 constexpr]]）和[[literals|字面量]]（参见：[[5-2-Literals|4.15 - 字面量]]）

## const 变量

到目前为止，我们看到的所有变量都是非常量——也就是说，它们的值可以在任何时候更改(通常通过赋值)。例如:

```cpp
int main()
{
    int x { 4 }; // x is a non-constant variable
    x = 5; // change value of x to 5 using assignment operator

    return 0;
}
```

不过，有时候需要将变量定义为不能改变。例如，地球的引力是 `9.8 meters/second^2`，这个值不太可能会随时改变（如果真的会随时改变的话，你应该担心的就不是 C++了）。将该值定义为常量有助于确保该值不会意外更改。常量还有其他好处，我们稍后将探讨。

值不能修改的变量称为常数变量。

## const 关键字

将变量定义为常量，只需要在类型前面或后面添加 `const` 关键字，例如：

```cpp
const double gravity { 9.8 };  // preferred use of const before type
int const sidesInSquare { 4 }; // "east const" style, okay but not preferred
```

尽管 C++ 允许你在类型前面或者后面添加 `const` 关键字，我们还是推荐你把它放在类型前面，这样看上去更像是正常的英语语法（例如：“a green ball” 而不是 “a ball green”）。

> [!cite] "题外话"
> 基于编译器解析复杂声明的方式，一些开发人员更喜欢将 `const` 放在类型之后(更一致)。这种风格被称为“east const”。虽然这种风格有一些拥护者(也有一些合理的观点)，但它并没有大受欢迎。

> [!success] "最佳实践"
> 把 `const` 放置在类型前（更符合习惯的做法）。


## Const 变量必须初始化

const 变量**必须**在定义时初始化，此后你也不能通过赋值来改变它：

```cpp
int main()
{
    const double gravity; // error: const variables must be initialized
    gravity = 9.9;        // error: const variables can not be changed

    return 0;
}
```

注意，const 变量可以使用其他类型的变量初始化（包括非 const 类型的变量）：

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter your age: ";
    int age{};
    std::cin >> age;

    const int constAge { age }; // initialize const variable using non-const value

    age = 5;      // ok: age is non-const, so we can change its value
    constAge = 6; // error: constAge is const, so we cannot change its value

    return 0;
}
```

在上面的例子中，我们用非 `const` 变量 `age` 初始化 `const` 变量 `constAge` 。因为  `age` 仍然是非 `const` 类型，我们可以改变它的值。但是，由于 `constAge` 是 `const`，我们不能在初始化后更改它的值。

## const 变量命名

const 变量的命名有很多不同的习惯。

从 C 语言过来的程序员喜欢使用下划线、全大写字母的方式命名 `const` 变量 （例如 `EARTH_GRAVITY`），而 C++ 中则多使用大小写交替的方式，同时添加 `k` 作为前缀(例如 `kEarthGravity`)。

不过，由于 `const` 变量的行为和普通变量没什么区别（除了不能赋值以外），所以没必要专门为它使用一种特殊形式的命名方式。因此，我们建议使用和非 const 类型一样的变量名（例如 `earthGravity`）。

## Const 函数形参

函数的[[parameters|形参]]也可以通过 `const` 关键字定义为常量：

```cpp
#include <iostream>

void printInt(const int x)
{
    std::cout << x;
}

int main()
{
    printInt(5); // 5 will be used as the initializer for x
    printInt(6); // 6 will be used as the initializer for x

    return 0;
}
```

注意，我们没有为 `const` 形参 `x` 提供显式的初始化值——函数调用中的实参值将被用作 `x` 的初始化式。

将函数形参设为常量可以得到编译器的帮助，以确保形参的值不会在函数内部被更改。然而，当实参通过[[pass-by-value|按值传递]]时，我们通常不关心函数是否改变了形参的值(因为它只是一个副本，无论如何都会在函数结束时销毁)。由于这个原因，我们通常不使用 `const` 形参来传递值(因为它会给我们的代码增加混乱，而不会提供太多的实际价值)。

> [!success] "最佳实践"
> 在[[pass-by-value|按值传递]]时不要使用 `const`。

在本系列教程的后面部分，我们将讨论向函数传递参数的另外两种方法：[[pass-by-reference|传引用]]和[[pass-by-address|传地址]]。在使用这两种方法时，正确使用 `const` 非常重要。

## Const 类型返回值

函数的返回值同样可以是 `const` 类型：

```cpp
#include <iostream>

const int getValue()
{
    return 5;
}

int main()
{
    std::cout << getValue();

    return 0;
}
```

然而，由于返回值是一个副本，将其设为 `const` 没有什么意义。返回 `const` 值还可能妨碍某些类型的编译器优化，从而导致性能下降。

> [!success] "最佳实践"
> 不要使用 `const` 类型的返回值。


## 什么是符号常量？

符号常数是赋予常数值的名称。常量变量是符号常量的一种，因为变量有一个名称(它的标识符)和一个常量值。

在[[2-10-Introduction-to-the-preprocessor|2.10 - 预处理器简介]]中，我们介绍了[[object-like-macros|对象类型的宏]]有两种形式——一种用于替换，一种不用于替换。这里我们会讨论一下用于替换的宏，它的形式如下：

```
`#define` identifier substitution_text
```

每当[[preprocessor|预处理器]]遇到该指令时，后续所有 `identifier` 都会被替换为 `substitution_text`。这里的 `identifier` 通常会使用全大写形式并使用下划线代替空格。

例如：

```cpp
#include <iostream>
#define MAX_STUDENTS_PER_CLASS 30

int main()
{
    std::cout << "The class has " << MAX_STUDENTS_PER_CLASS << " students.\n";

    return 0;
}
```

当你编译代码时，预处理器就会把 `MAX_STUDENTS_PER_CLASS` 替换为字面量 30，然后被编译到可执行文件中。

因为宏是有名字的，而且它的替换文本是一个常量，所以它也属于符号常量的一种。

## 避免将对象形式的预处理器宏用于符号常量

所以，为什么不用 `#define` 定义符号常量呢？这里有（至少）三个主要问题。

首先，因为宏的解析是预处理器负责的，所以所有的替换都发生在编译之前。当你调试代码的时候，你无法看到实际的值（例如 30），而只能看到该符号常量的名字(例如 `MAX_STUDENTS_PER_CLASS`)。而且，因为这些宏定义并不是变量，所以再调试器中你没法对其值进行监控。 如果你想要指定 `MAX_STUDENTS_PER_CLASS` 解析后的值是多少，你必须取找到 `MAX_STUDENTS_PER_CLASS` 的定义才行(该定义还可能是在别的文件中)。这样就会使你的程序难以调试。

另外，宏和普通代码可能会产生命名冲突，例如：

```cpp
#include "someheader.h"
#include <iostream>

int main()
{
    int beta { 5 };
    std::cout << beta;

    return 0;
}
```

如果 `someheader.h` 恰好 `#define` 了一个名为 _beta_ 的宏，那么这个程序就无法编译，因为预处理器会把 `int` 变量的名字替换掉。通常，使用全大写的宏名可以避免此类问题，但并无法完全杜绝。

第三，宏并不遵循正常的作用域规则，这意味着定极少数情况下，定义在函数某部分的宏可能会和其他部分的代码发生冲突。

> [!success] "最佳实践"
> 使用常量而不是宏替换来创建常数变量。

## 在多个文件中共用符号常量

在很多应用程序中，有些符号常量需要被所有的代码使用（而不仅仅是被局部的代码使用）。这些变量可能是物理常量或数学常量（例如 π 或阿伏伽德罗常数），或者是某个应用程序需要的参数（例如摩擦系数或引力系数）。与其在多个文件中各定义一遍这些变量，不如将它们集中定义在一个地方然后按需使用。这样，万一你需要修改它们的值，你只需要在一处修改即可。

在 C++ 中有很多方法可以实现上述需求，我们会在 [[7-10-Sharing-global-constants-across-multiple-files-using-inline-variables|6.9 - 使用 inline 变量共享全局常量]] 中进行详细的介绍。
