---
title: 6.9 - 使用 inline 变量共享全局常量
alias: 6.9 - 使用 inline 变量共享全局常量
origin: /sharing-global-constants-across-multiple-files-using-inline-variables/
origin_title: "6.9 -- Sharing global constants across multiple files (using inline variables)"
time: 2022-5-13
type: translation
tags:
- inline
- global
- C++17
---

> [!note] "Key Takeaway"
> - 全局常量定义在头文件中，它是内部变量，头文件包含时会被复制到到源文件中。
> - 当全局变量为内部变量时，会导致两个问题：
>   - 修改后所有包含该头文件的文件都要重新编译
>   - 变量复制占用大量内存
> - 将全局变量定义在cpp文件中，并在头文件中对其进行前向声明，然后再需要它的地方包含头文件，这样可以确保全局变量为外部变量。需要注意的是，由于 `constexpr` 不能被[[forward-declaration|前向声明]]，因此只能使用 `const`。
> - 当全局变量为外部变量时，也会导致两个问题：
>   - 这些变量只有在定义它们的文件中属于编译时常量，在其他文件中都属于运行时常量。因此在需要使用编译时常量的地方不能使用它们。
>   - 运行时常量的优化不如编译时常量
> - 为了在编译时使用某些变量（例如，数组大小），编译器必须看到变量的定义（而不仅仅是前项声明）。
> - C++17 引入了内联变量，即可以被多处定义的变量。编译器会将它们的定义合并。同时它还具有和 constexpr 同样的属性。
> - 内联变量有两个主要的限制，需要我们遵循：
>   1. 内联变量的所有定义必须是完全一致的（否则会产生[[undefined-behavior|未定义行为]]）。
>   2. 内联变量的定义（而非声明）必须出现在任何使用它们的文件中。
> - 如果你的编译器支持 C++17，最好将全局变量定义为 `inline constexpr` 类型并放置在头文件中。



在很多应用程序中，有些符号常量需要被所有的代码使用（而不仅仅是被局部的代码使用）。这些变量可能是物理常量或数学常量（例如 π 或阿伏伽德罗常数），或者是某个应用程序需要的参数（例如摩擦系数或引力系数）。与其在多个文件中各定义一遍这些变量，不如将它们集中定义在一个地方然后按需使用。这样，万一你需要修改它们的值，你只需要在一处修改即可。

本节课会重点介绍如何实现上述全局常量的定义。

## 将全局常量作为内部变量

在 C++17 之前，定义全局常量最简单的方法如下：

1.  定义一个头文件来存放这些常量
2. 在头文件中，定义一个命名空间 (参见：[[7-2-User-defined-namespaces-and-the-scope-resolution-operator|6.2 - 用户定义命名空间和作用域解析运算符]]
3. 将全部的常量放到该命名空间中（同时确保它们都是 `constexpr` 类型的） 
4. 在需要使用这些常量的地方，`#include` 该头文件


```cpp title="constants.h"
#ifndef CONSTANTS_H
#define CONSTANTS_H

// 定义包含常量的命名空间
namespace constants
{
    // 默认内部链接
    constexpr double pi { 3.14159 };
    constexpr double avogadro { 6.0221413e23 };
    constexpr double myGravity { 9.2 }; // m/s^2 -- gravity is light on this planet
    // ... other related constants
}
#endif
```


然后在 *.cpp* 文件中使用[[scope-resolution-operator|作用域解析运算符]](`::`)来使用这些常量，运算符左侧是命名空间，右侧是常量名：


```cpp title="main.cpp"
#include "constants.h" // include a copy of each constant in this file

#include <iostream>

int main()
{
    std::cout << "Enter a radius: ";
    int radius{};
    std::cin >> radius;

    std::cout << "The circumference is: " << 2.0 * radius * constants::pi << '\n';

    return 0;
}
```


当头文件被 `#included` 到了*a .cpp* 中后，头文件中的所有常量实际上都会被**拷贝**到源文件中。因为这些变量不属于任何函数，所以它们在被包含到源文件后，会被当做全局变量对待，因此你可以在文件的任何地方使用它们。

因为 const 全局变量具有[[internal-linkage|内部链接]]属性，因此每个变量在.cpp文件之间是独立的，而且链接器并不能看到它们。在大多数情况下，由于它们是常量，所以编译器通常会将其“优化掉”。


> [!cite] "题外话"
> “优化掉”这个术语，指的是编译器为了优化程序性能而删除了某些东西，但不会对程序的功能产生影响。例如，你定义了一个 const 类型的变量 `x` 并且将其初始化为 4。则编译器会将任何引用该变量的地方，直接替换为 4（因为 x 是const类型的，所以它不能被修改），从而避免了变量的定义和初始化过程。

## 将全局常量作为外部变量

上面提到的方法实际上有一些缺陷。

尽管将 `constants.h` 头文件 `#included` 到每一个需要它的源文件中是非常简单（对于小程序来说也通常不会有什么问题）的一种方式，但毕竟这会导致变量被复制到源文件中。因此，如果 `constants.h` 被 20 个文件所包含，那么这些全局变量就会被复制 20 次。[[2-12-Header-guards|头文件防卫式声明]] 并不能防止该问题的发生，因为它只能保证头文件在一个文件中被包含一次，而不是阻止头文件被多个不同的文件包含。这样一来，我们就会面临两个问题：

1.  修改常量会导致所有包含该头文件的文件重新编译，对于大型项目来说这会浪费很多时间
2.  如果常量很大，而且无法被“优化掉”，那么大量的复制会导致大量的内存占用。

避免这个问题的方法之一，是将全局常量定义为[[external-variable|外部变量]]，这样一个变量（初始化一次）就可以被所有的文件“共享使用”。为此，我们必须将常量定义在一个`a.cpp`文件中（确保它只被定义一次），然后在头文件中添加其前向定义（该头文件仍需要被包含到使用了该变量的文件中）。

> [!info] "作者注"
> 这里使用了 `const` 类型的变量，这是因为 `constexpr` 类型的变量不能被前向声明（[[7-7-External-linkage-and-variable-forward-declarations#^ce6263]]），因为编译器需要在编译时知道`constexpr` 类型变量的定义，而前向声明并不能提供定义的信息。


```cpp title="constants.cpp"
#include "constants.h"

namespace constants
{
    // actual global variables
    extern const double pi { 3.14159 };
    extern const double avogadro { 6.0221413e23 };
    extern const double myGravity { 9.2 }; // m/s^2 -- gravity is light on this planet
}
```



```cpp title="constants.h"
#ifndef CONSTANTS_H
#define CONSTANTS_H

namespace constants
{
    // since the actual variables are inside a namespace, the forward declarations need to be inside a namespace as well
    extern const double pi;
    extern const double avogadro;
    extern const double myGravity;
}

#endif
```


使用方法和之前是一样的：

```cpp title="main.cpp"
#include "constants.h" // include all the forward declarations

#include <iostream>

int main()
{
    std::cout << "Enter a radius: ";
    int radius{};
    std::cin >> radius;

    std::cout << "The circumference is: " << 2.0 * radius * constants::pi << '\n';

    return 0;
}
```


因为全局符号常量应该被放置在命名空间中（避免与其他全局命名空间中的标识符产生命名冲突），所以没必要对其使用`g_`前缀。

这样一来，符号常量只会在 `constants.cpp` 中被初始化一次，而不是在每个 `constants.h` 被包含的地方被初始化。同时，这些常数都会被链接到 `constants.cpp`中初始化的变量，因此当这些变量被修改时，只有 `constants.cpp` 需要被重新编译。

不过，这种方法也不是完美的。首先，这些常量现在只会在它们被定义的文件中被看做[[compile-time|编译时]]常量。而在其他文件中，编译器只能看到它们的声明，而看不到常量具体的中（必须有链接器进行解析）。因此，在 `constants.cpp`以外的地方，这些常量都不能被看做是编译时常量，也就不能在要求使用编译时常量的地方使用它们。另外，因为编译时常量相对于运行时常量更容易优化，所以对于这些运行时常量，编译器可能无法对其进行足够的优化。


> [!tldr] "关键信息"
> 为了在编译时使用某些变量（例如，数组大小），编译器必须看到变量的定义（而不仅仅是前项声明）。

因为编译器是独立编译各个源文件的，因此它只能对源文件中存在定义的变量进行编译。例如，定义在 `constants.cpp` 的变量，在编译器编译 `main.cpp` 的时候是不可见的，出于这个原因`constexpr` 的定义和声明不能被分散到头文件和源文件中，它必须被定义在对应的头文件里。

出于上述原因，我们还是建议最好将常量定义在头文件中。如果因此导致了某些特定的问题，不妨到时候在把它们一起移动到.cpp文件去。

## 将全局常量作为内联变量 (C++17)

C++17 引入了一个新的概念——[[inline-variables|内联变量(inline variables)]] 。在 C++ 中，[[inline|内联]]的意思逐渐引申成了“允许多处定义”。因此，内联变量可以在多个文件中被多次定义，且不会违反[[one-definition-rule|单一定义规则(one-definition-rule)]]。内联的全局变量默认具有外部链接属性。

链接器可以将所有的内联定义合并为一个单独的定义（这样就满足了单一定义规则）。这样一来，当我们把内联变量定义在头文件中的同时，还能够将它们在.cpp文件中的定义看做是一个定义。例如，如果一个普通的常量被定义在头文件中，同时被`#include`到了10个不同的源文件。如果它不是内联的，则此时会产生10个定义。如果是内联的，则编译器会选取一个定义作为主定义，这样一来就只会产生一个定义。这样可以帮助我们节省9个常量的内存空间。


这些变量同时还保留了 constexpr 的特性，因此在任何包含它们的文件中，只要是 constexpr 可用的地方，这些变量也可用。同时，相比较于运行时常量（或非常量），编译器可以极大地优化 constexpr 类型的变量

内联变量有两个主要的限制，需要我们遵循：

1.  内联变量的所有定义必须是完全一致的（否则会产生未定义行为）。
2.  内联变量的定义（而非声明）必须出现在任何使用它们的文件中。

这样一来，我们就可以继续沿用将全局变量定义在头文件中的方式，同时还可以避免变量的重复定义：

```cpp title="constants.h"
#ifndef CONSTANTS_H
#define CONSTANTS_H

// define your own namespace to hold constants
namespace constants
{
    inline constexpr double pi { 3.14159 }; // note: now inline constexpr
    inline constexpr double avogadro { 6.0221413e23 };
    inline constexpr double myGravity { 9.2 }; // m/s^2 -- gravity is light on this planet
    // ... other related constants
}
#endif
```


```cpp title="main.cpp"
#include "constants.h"

#include <iostream>

int main()
{
    std::cout << "Enter a radius: ";
    int radius{};
    std::cin >> radius;

    std::cout << "The circumference is: " << 2.0 * radius * constants::pi << '\n';

    return 0;
}
```



将 `constants.h` 包含到所有需要使用它的代码文件中，但是这些变量只会被初始化一次，并且在所有文件中共享使用。

不过，这么做仍然不能避免文件重复编译的问题。当任何常量被修改时，每个包含它的文件都需要被重新编译。所以，如果你的常量经常需要修改（出于调优的目的），这无疑会导致很长的重新编译时间，此时你可以考虑将常量引入到单独的头文件中（减少include的数量）。

> [!success] "最佳实践"
> 如果你的编译器支持 C++17，最好将全局变量定义为 `inline constexpr` 类型并放置在头文件中。
	

> [!info] "提醒"
> 使用 `std::string_view` 定义 `constexpr` 字符串，我们在[[5-1-Const-variables-and-symbolic-constants|4.13 - const 变量和符号常量]]中进行了介绍。