---
title: 7.8 - 为什么非 const 全局变量是魔鬼
alias: 7.8 - 为什么非 const 全局变量是魔鬼
origin: /why-non-const-global-variables-are-evil/
origin_title: "6.8 — Why (non-const) global variables are evil"
time: 2022-2-24
type: translation
tags:
- global variable
---

> [!note] "Key Takeaway"
> - 非 const 类型的全局变量可以被所有函数修改，因此会让程序变得难以预料。
> - 静态变量初始化有两个阶段
>   - 第一阶段称为静态初始化 。在静态初始化阶段，constexpr 类型的全局变量（包括字面量）都会被初始化成具体的值。此外，没有显式初始化的全局变量也会被初始化为0。
>   - 第二阶段称为动态初始化。这个阶段要复杂的多，但是它的精髓在于具有非 constexpr *初始化值*的全局变量会被初始化。
> - 全局变量的动态初始化会造成很大问题，尽量避免动态初始化。

如果你向编程大佬讨教一条编程实践的建议，很多人都会在稍加思考后告诉你：“避免全局变量！”。这是因为全局变量是编程语言中最被滥用的概念。尽管在一些编程小练习中，全局变量看起来人畜无害，但是到了大型程序中就非常容易导致问题。

新手程序员通常会想要使用大量的全局变量，因为全局变量用起来很方便，尤其是许多程序都需要这些变量的时候（作为参数使用的话，传参会非常痛苦）。不过，这并不是个好主意。很多程序员都认为应该坚决避免非 const 类型的全局变量！

在我们深究其原因之前，首先澄清一个问题。当我们谈论“全局是魔鬼”的时候，并不是说**所有**的全局变量都是魔鬼。多数情况下我们指的是非 const 类型的全局变量。

## 为什么非 const 类型的全局变量是魔鬼

 到目前位置，非 const 类型全局变量危险的最大原因，是因为它的值可以被任何函数修改，同时也没有简单的办法可以让程序员清楚地了解到发生了什么：

```cpp
int g_mode; // 声明全局变量 (默认会初始化为0)

void doSomething()
{
    g_mode = 2; // 将全局变量设置为 2
}

int main()
{
    g_mode = 1; // 注意：这里又将全局变量 g_mode 变量设置为 1，而并没有声明一个局部变量 g_mode

    doSomething();

    // 程序员此时还以为 g_mode 是 1
    // 但是 doSomething 已经将它修改为 2 了。

    if (g_mode == 1)
        std::cout << "No threat detected.\n";
    else
        std::cout << "Launching nuclear missiles...\n";

    return 0;
}
```


注意，程序员首先将变量 `g_mode` 设置为了 _1_，然后就调用了 `doSomething()`。除非程序员明确知道 `doSomething()` 内部会修改 `g_mode` 的值，否则他可能并不会想到 `doSomething()` 会修改`g_mode` 的值！因此，接下来 `main()` 所做的事情就不像我们期望的那样了。

简单来说，全局变量会让程序难以预料。 程序中的每个函数都可能很危险，而且程序员通常并没有简单的办法可以判断哪个函数危险哪个不危险。局部变量就安全的多，因为其他函数没有办法直接修改它。

除此之外，还有很多其他不使用非const全局变量的理由。

使用全局变量的程序中，下面这样的函数并不少见：

```cpp
void someFunction()
{
    // useful code

    if (g_mode == 4) // do something good
}
```


当程序出现问题时，你通过调试确定了问题的原因是因为 `g_mode` 的值是 3 而不是 4。此时你应该如何修复这个问题呢？为了修复这个问题，你必须找到 `g_mode` 可能被设置为 3 的所有的地方，然后追踪代码运行，判断它是什么时候被修改为 3 的。而这里面可能会涉及到很多完全不相关的代码。

之前我们说过，局部变量的声明应该在最接近使用它的地方，因为这么做可以在出现问题时，最大程度减少你需要分析的代码。全局变量则正号相反——因为它可以在任何地方被使用，所以你必须阅读全部的代码才能够了解它是如何工作的。在简短的程序中这也许并不是问题，但是在大型程序中，这就很麻烦了。

例如，你的程序可能有 442 处使用了 `g_mode` 的地方。除非有很好的文档说明，不然你可能需要理解每一处使用了 `g_mode` 的代码，它在不同情况下的是如何使用的、有效值是多少、主要功能是什么。

全局变量还会破坏程序的模块性和灵活性。如果一个函数值使用其参数且不具有副作用，那么它是完全模块化的。模块性可以帮助我们理解程序，同时也能够增强程序的可复用性。全局变量会极大地降低程序的模块性。

特别地，避免将“决策点”变量（例如条件语句中的变量，就像上文中的`g_mode`）定义为全局变量。如果一个全局变量仅仅包含某个数据，也许并不会让你的程序被破坏。而如果该全局变量可以决定程序**如何**运行，那么它造成问题的可能性就会大大提高。

> [!success] "最佳实践"
> 如果可能，尽量使用局部变量而不是全局变量。
	
## 全局变量的初始化顺序问题

静态变量的初始化（其中包含全局变量）是程序启动的一部分，在执行`main`函数前就会进行。这个过程有两个阶段：

第一阶段称为[[static-initialization|静态初始化(static initialization)]] 。在静态初始化阶段，constexpr 类型的全局变量（包括字面量）都会被初始化成具体的值。此外，没有显式初始化的全局变量也会被初始化为0。

第二阶段称为[[dynamic-initialization|动态初始化(dynamic initialization)]]。这个阶段要复杂的多，但是它的精髓在于具有非 constexpr *初始化值*的全局变量会被初始化。

非 constexpr *初始化值*的例子如下：

```cpp
int init()
{
    return 5;
}

int g_something{ init() }; // 非 constexpr 初始化
```


在一个文件中，全局变量的初始化顺序和它们被定义的顺序一般是一致的（也有一些例外规则）。考虑到这一点，你需要确保变量的初始化值不依赖于后面才初始化的变量。例如：

```cpp
#include <iostream>

int initx();  // forward declaration
int inity();  // forward declaration

int g_x{ initx() }; // g_x 首先初始化
int g_y{ inity() };

int initx()
{
    return g_y; // 函数调用时，g_y 并没有初始化
}

int inity()
{
    return 5;
}

int main()
{
    std::cout << g_x << ' ' << g_y << '\n';
}
```

打印结果：

```
0 5
```

更严重的问题是，不同文件中全局变量的初始化顺序是不确定的。给定两个文件 `a.cpp` 和 `b.cpp`，每个文件中的全局变量都可能首先初始化。这也意味着，如果文件 `a.cpp` 中的变量依赖 `b.cpp`文件中的变量，那么有 50%的几率会遇到变量未初始化的情况。

> [!warning] "注意"
> 全局变量的动态初始化会造成很大问题，尽量避免动态初始化。
	

## 什么时候可以合理使用非 const 的全局变量

这种机会并不大。在大多数情况下，都可以避免使用非 const 类型的全局变量。但是在某些情况下，审慎地使用非 const 全局变量反到可以降低程序的复杂度。

日志文件是一个很好的例子，在日志文件中，我们会存放错误信息和调试信息，因此将其定义为全局变量是合理的，因为一个程序通常只会有一个日志，并且它可能在程序中的任何部分被使用。

不管怎么说，`std::cout` 和 `std::cin` 对象也被定义成了全局变量(在 `std` 命名空间中)。

一般说来，使用全局变量至少要满足下面两个条件：该变量在程序中的功能是唯一的，而且它会在程序的各个地方被使用。 

很多新手程序员会错误地认为，因为现在只需要一个全局变量，所以用用也没关系。举例来说，你现在可能在开发一个单人游戏，所以只需要一个用户。但是万一以后你需要为它添加多人模式呢？

## 有关全局变量的忠告

如果你有足够的理由而使用了一个非常量的全局变量，这里有一些忠告希望能够帮你尽可能地避免问题。当然，这些忠告不仅仅只针对非常量的全局变量，它对所有的全局变量都是有意义的。

首先，请为不在命名空间中的全局变量添加 “g” 或者 “g_” 前缀，或者干脆将它们放到一个命名空间中（在[[7-2-User-defined-namespaces-and-the-scope-resolution-operator|7.2 - 用户定义命名空间和作用域解析运算符]]中有相关讨论）以避免命名冲突。

例如，不要这么做：

```cpp
constexpr double gravity { 9.8 }; // unclear if this is a local or global variable from the name

int main()
{
    return 0;
}
```

要这么做：

```cpp
namespace constants
{
    constexpr double gravity { 9.8 };
}

int main()
{
    return 0;
}
```


其次，不要允许全局变量的直接访问，最好是将它们“封装”起来。确保变量只能在定义它们的文件内部被访问，例如为变量添加`static`或`const`修饰符，然后提供一个外部的全局“访问函数”用于该变量的访问。通过这个访问函数，我们可以对变量的使用方式进行管理（例如：输入校验，范围检查等等）。此外，如果你以后希望修改底层实现（例如从一个数据库迁移到另外一个数据库时），你只需修改这个访问函数，使其访问新的变量即可，而无需替换源码中每处使用该全局变量的地。

例如，不要这么做：

```cpp
namespace constants
{
    extern const double gravity { 9.8 }; // has external linkage, is directly accessible by other files
}
```


要这么做：

```cpp
namespace constants
{
    constexpr double gravity { 9.8 }; // has internal linkage, is accessible only by this file
}

double getGravity() // this function can be exported to other files to access the global outside of this file
{
    // We could add logic here if needed later
    // or change the implementation transparently to the callers
    return constants::gravity;
}
```


## 一个提醒

全局 `const` 变量默认具有内部链接属性，所以 `gravity` 并不需要被定义为 `static`。

第三，当函数必须使用全局变量的时候，不要直接在函数体中使用全局变量。应该将全局变量作为参数传递给函数，这样的话，不管什么时候你需要使用不同的值时，你只需要修改函数的入参就可以，这么做有助于保持函数的模块化。

不要这样做：

```cpp
#include <iostream>

namespace constants
{
    constexpr double gravity { 9.8 };
}

// 这个函数只能基于全局 gravity 计算速度
double instantVelocity(int time)
{
    return constants::gravity * time;
}

int main()
{
    std::cout << instantVelocity(5);
}
```

要这样做：

```cpp
#include <iostream>

namespace constants
{
    constexpr double gravity { 9.8 };
}

// 这个函数可以基于任何 gravity 值计算速度（更有用）
double instantVelocity(int time, double gravity)
{
    return gravity * time;
}

int main()
{
    std::cout << instantVelocity(5, constants::gravity); // 将常量当做参数传入
}
```


## 一个笑话

问：全局变量和什么前缀最配？

答:  // （注释）

C++ 笑话最棒了！

