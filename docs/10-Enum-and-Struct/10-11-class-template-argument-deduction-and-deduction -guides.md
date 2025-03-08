---
title: 10.11 - 类模板参数推断CTAD
alias: 10.11 - 类模板参数推断CTAD
origin: /class-template-argument-deduction-ctad-and-deduction-guides/
origin_title: "10.11 — Class template argument deduction (CTAD) and deduction guides"
time: 2022-8-24
type: translation
tags:
- class template
- CTAD
- C++17
---

??? note "Key Takeaway"


## 类模板实参推断 (CTAD) (C++17)

从C++ 17开始，当从类模板实例化一个对象时，编译器可以从对象的初始化式的类型推断出模板类型([[class-template-argument-deduction|类模板实参推断]]，简称CTAD)。例如:

```cpp
#include <utility> // for std::pair

int main()
{
    std::pair<int, int> p1{ 1, 2 }; // explicitly specify class template std::pair<int, int> (C++11 onward)
    std::pair p2{ 1, 2 };           // CTAD used to deduce std::pair<int, int> from the initializers (C++17)

    return 0;
}
```

CTAD 只有在类模板列表中没有提供任何参数时才会进行，因此下面代码中的两种方式都是错误的：

```cpp
#include <utility> // for std::pair

int main()
{
    std::pair<> p1 { 1, 2 };    // 错误: 模板参数太少, 两个参数都不会推断
    std::pair<int> p2 { 3, 4 }; // 错误: 模板参数太少,第二个参数不会被推断

    return 0;
}
```

> [!info] "作者注"
> 本网站今后的许多课程都利用了CTAD。如果使用C++14标准编译这些示例，将会得到一个关于缺少模板参数的错误。您需要显式地将这些参数添加到示例中，以使其能够编译。


## 模板参数推断指南 (C++17)

在大多数情况下，CTAD可以开箱即用。然而，在某些情况下，编译器可能需要一些额外的帮助，以理解如何正确地推导模板实参。

你可能会惊讶地发现下面的程序(它几乎与上面使用`std::pair`的例子相同)不能在C++ 17中编译：

```cpp
// define our own Pair type
template <typename T, typename U>
struct Pair
{
    T first{};
    U second{};
};

int main()
{
    Pair<int, int> p1{ 1, 2 }; // ok: we're explicitly specifying the template arguments
    Pair p2{ 1, 2 };           // compile error in C++17

    return 0;
}
```

如果你在C++17中编译它，你可能会得到一些关于“类模板实参推导失败”或“无法推导模板实参”或“没有可行的构造函数或推导指南”的错误。这是因为在C++17中，CTAD不知道如何推导聚合类模板的模板实参。为了解决这个问题，我们可以为编译器提供指南，告诉编译器如何推断给定类模板的模板实参。

下面的程序为编译器提供了推断指南：

```cpp
template <typename T, typename U>
struct Pair
{
    T first{};
    U second{};
};

// 此处为 Pair 提供推断指南
// 使用参数 T 和 U 初始化的Pair对象应该推断为 Pair<T, U>
template <typename T, typename U>
Pair(T, U) -> Pair<T, U>;

int main()
{
    Pair<int, int> p1{ 1, 2 }; // 显式指定类模板Pair<int, int> (C++11 onward)
    Pair p2{ 1, 2 };     // CTAD 使用初始化值推断 Pair<int, int> (C++17)

    return 0;
}
```

上面的例子可以在C++17中成功编译。

此处`Pair`类的类型推断指南很简单，让我们仔细研究一下它是如何工作的吧。

```cpp
// 此处为 Pair 提供推断指南
// 使用参数 T 和 U 初始化的Pair对象应该推断为 Pair<T, U>
template <typename T, typename U>
Pair(T, U) -> Pair<T, U>;
```

首先，我们需要使用和 `Pair` 类一样的模板定义，因为推断定义的目的就是告诉编译器如何推断 `Pair<T, U>` 类型。接下来，在箭头符号的右侧，我们提供了用于帮助编译器进行推断的类型。在这个例子中，我们希望编译器能够为 `Pair<T, U>` 类型的对象进行模板类型推断。最后，在箭头符号的左侧，我们告诉编译器应该关注什么样的声明。在这个例子中，编译器被要求关注名为 `Pair` 且有两个形参(一个是 `T` 类型，一个是`U`类型)的声明。这里也可以写作 `Pair(T t, U u)` ( `t` 和 `u` 是参数的名字，但是因为我们不需要使用`t` 和 `u`，所以也没必要给它们一个名字)。

上述操作综合起来，告诉编译器如果看到有一个 `Pair` 类型的对象，且有两个[[arguments|实参]]，则应该将其推断为类型 `Pair<T, U>`。

所以当编译器看到 `Pair p2{ 1, 2 };` 时，它会说：“噢，这是一个`Pair`对象，有两个实参`int`和`int`，所以基于推断指南，我应该将其推断为类型`Pair<int, int>`” 。

下面是一个接受单一模板类型的`Pair`的类似示例：

```cpp
template <typename T>
struct Pair
{
    T first{};
    T second{};
};

// Here's a deduction guide for our Pair
// pair objects initialized with arguments of type T and T should deduce to Pair<T>
template <typename T>
Pair(T, T)->Pair<T>;

int main()
{
    Pair<int> p1{ 1, 2 }; // explicitly specify class template Pair<int> (C++11 onward)
    Pair p2{ 1, 2 };     // CTAD used to deduce Pair<int, int> from the initializers (C++17)

    return 0;
}
```

在这个例子中，类型推断指南将 `Pair(T, T)` (`Pair`类型且有两个类型为T的参数 `T`) 推断为类型 `Pair<T>`。

> [!info] "作者注"
> 关于类型推断指南的一些备注。
> 
> 首先，`std::pair`(以及其他标准库模板类型)是有预定义的类型推断指南的。这也是为什么使用 `std::pair`的例子是可以在 C++17 中直接编译的。
> 
> 其次，C++20 为编译器提供了为聚合类型自动生成类型推断指南的能力，因此前面使用`Pair`的例子可以在C++20编译器中编译。这里假设你的编译器支持P1816特性，在编写本文时，gcc和Visual Studio支持P1816特性，而Clang不支持。