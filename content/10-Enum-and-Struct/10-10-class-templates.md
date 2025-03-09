---
title: 10.10 - 类模板
alias: 10.10 - 类模板
origin: /class-templates/
origin_title: "10.10 — Class templates"
time: 2022-8-8
type: translation
tags:
- class template
---
> [!note] "Key Takeaway"



在 [[8-13-Function-templates|8.13 - 函数模板] 中我们提到，为不同类型的对象分别创建（重载）不同的函数是一项困难且没必要的工作。

```cpp
#include <iostream>

// function to calculate the greater of two int values
int max(int x, int y)
{
    return (x > y) ? x : y;
}

// almost identical function to calculate the greater of two double values
// the only difference is the type information
double max(double x, double y)
{
    return (x > y) ? x : y;
}

int main()
{
    std::cout << max(5, 6);     // calls max(int, int)
    std::cout << '\n';
    std::cout << max(1.2, 3.4); // calls max(double, double)

    return 0;
}
```

该问题的最终解决方案是创建一个[[function-template|函数模板]]并让编译器根据所需的类型为你实例化对应的函数：

```cpp
#include <iostream>

// a single function template for max
template <typename T>
T max(T x, T y)
{
    return (x > y) ? x : y;
}

int main()
{
    std::cout << max(5, 6);     // instantiates and calls max<int>(int, int)
    std::cout << '\n';
    std::cout << max(1.2, 3.4); // instantiates and calls max<double>(double, double)

    return 0;
}
```

!!! info "相关内容"

	我们在[[8-14-Function-template-instantiation|8.14 - 函数模板的实例化]]中介绍了函数模板的实例化。

## 聚合类型也面临类似的问题

对于聚合类型(包括结构/类/联合和数组)，我们也遇到了类似的问题。

例如，假设我们正在编写一个程序，其中需要处理一对 `int` 值，并需要确定这两个数字中哪一个更大。我们可以写这样一个程序:

```cpp
#include <iostream>

struct Pair
{
    int first{};
    int second{};
};

constexpr int max(Pair p) // pass by value because Pair is small
{
    return (p.first > p.second ? p.first : p.second);
}

int main()
{
    Pair p1{ 5, 6 };
    std::cout << max(p1) << " is larger\n";

    return 0;
}
```

一段时间后，我们发现我们需要处理一对 `double` 类型的值，那么我们必须更新程序，添加另外一个`Pair`：

```cpp
#include <iostream>

struct Pair
{
    int first{};
    int second{};
};

struct Pair // compile error: erroneous redefinition of Pair
{
    double first{};
    double second{};
};

constexpr int max(Pair p)
{
    return (p.first > p.second ? p.first : p.second);
}

constexpr double max(Pair p) // compile error: overloaded function differs only by return type
{
    return (p.first > p.second ? p.first : p.second);
}

int main()
{
    Pair p1{ 5, 6 };
    std::cout << max(p1) << " is larger\n";

    Pair p2{ 1.2, 3.4 };
    std::cout << max(p2) << " is larger\n";

    return 0;
}
```

很遗憾，这个程序是不能编译的，而且这里有很多问题：

首先，和函数不同，类型是不能被[[overload|重载]]的。所以编译器会将第二个`double`成员版本的 `Pair` 看做是第一个`Pair` 的重复定义。第二，尽管函数可以被重载，但两个 `max(Pair)` 函数只有返回值不同，而函数重载不能仅仅通过不同的返回值类型区分。第三，代码有很多冗余。每个  `Pair` 结构体都是相同的（只是数据类型不同），`max(Pair)` 函数也是 (只有返回值不同)。

我们可以通过给`Pair` 起不同的名字来解决前两个问题（例如 `Pairint` 和 `Pairdouble` )。但是我们必须记住全部的命名方案，并为我们想要的每一个额外的类型克隆一堆代码，这并不能解决冗余问题。

幸运的是，我们有更好的办法！

> [!info] "作者注"
> 在继续阅读之前，如果你还不熟悉函数模板、模板类型或者函数模板实例化是如何工作的，推荐复习一下 [[8-13-Function-templates|8.13 - 函数模板]]和[[8-14-Function-template-instantiation|8.14 - 函数模板的实例化]]。
	
## 类模板

就像函数模板是实例化函数的模板定义一样，类模板是实例化类类型的模板定义。

!!! info "提醒"

	所谓 “[[class-type|类类型]]” 指的是结构体、类或联合体。虽然我们以结构体的类模板进行演示，但是它同样适用于类。

回忆一下，这里有一个整型成员类型的 `Pair` 结构体定义：

```cpp
struct Pair
{
    int first{};
    int second{};
};
```

让我们使用类模板重写一下该结构体：

```cpp
#include <iostream>

template <typename T>
struct Pair
{
    T first{};
    T second{};
};

int main()
{
    Pair<int> p1{ 5, 6 };        // instantiates Pair<int> and creates object p1
    std::cout << p1.first << ' ' << p1.second << '\n';

    Pair<double> p2{ 1.2, 3.4 }; // instantiates Pair<double> and creates object p2
    std::cout << p2.first << ' ' << p2.second << '\n';

    Pair<double> p3{ 7.8, 9.0 }; // creates object p3 using prior definition for Pair<double>
    std::cout << p3.first << ' ' << p3.second << '\n';

    return 0;
}
```

就像函数模板一样，我们从模板形参声明开始定义类模板，即先是 `template`关键字。接下来，在尖括号(`<>`)中指定类模板将使用的所有模板类型。对于我们需要的每个模板类型，需要使用关键字`typename` (首选)或`class` (非首选)，后面跟着模板类型的名称(例如。“T”)。在本例中，因为我们的两个成员都是相同的类型，所以我们只需要一个模板类型。

接下来，我们像往常一样定义结构，只不过我们可以在需要模板类型的地方使用模板类型(`T` )，以便稍后用实际类型替换模板类型。就是这样！类模板的定义就完成了。

在`main`中，我们可以使用需要要的任何类型来实例化`Pair` 对象。首先，我们实例化一个 `Pair<int>` 类型的对象。因为`Pair<int>` 的类型定义还不存在，编译器使用类模板实例化一个名为` Pair<int>` 的结构体类型定义，其中所有出现的模板类型 `T` 都被类型 `int` 替换。

接下来，再实例化一个 `Pair<double>` 类型的对象，此时会实例化一个 `Pair<double>` 类型的结构体定义，其中 `T` 会被替换为 `double`。对于`p3`来说，`Pair<double>` 已经被实例化了，所以编译器会使用之前的定义。

接下来是与上面相同的例子，显示了编译器在所有模板实例化完成后实际编译的内容：

```cpp
#include <iostream>

// A declaration for our Pair class template
// (we don't need the definition any more since it's not used)
template <typename T>
struct Pair;

// Explicitly define what Pair<int> looks like
template <> // tells the compiler this is a template type with no template parameters
struct Pair<int>
{
    int first{};
    int second{};
};

// Explicitly define what Pair<double> looks like
template <> // tells the compiler this is a template type with no template parameters
struct Pair<double>
{
    double first{};
    double second{};
};

int main()
{
    Pair<int> p1{ 5, 6 };        // instantiates Pair<int> and creates object p1
    std::cout << p1.first << ' ' << p1.second << '\n';

    Pair<double> p2{ 1.2, 3.4 }; // instantiates Pair<double> and creates object p2
    std::cout << p2.first << ' ' << p2.second << '\n';

    Pair<double> p3{ 7.8, 9.0 }; // creates object p3 using prior definition for Pair<double>
    std::cout << p3.first << ' ' << p3.second << '\n';

    return 0;
}
```

你可以直接编译此示例，它能够按预期工作!

> [!info] "扩展阅读"
> 上面的例子中使用了一个称为[[template-class-specialization|类模板特化]]的特性(会在 [19.4 -- Class template specialization](https://www.learncpp.com/cpp-tutorial/class-template-specialization/) 中介绍)。目前我们还不需要掌握该特性的知识。

## 在函数中使用类模板

现在让我们回到让`max()` 函数配合不同类型工作的挑战。因为编译器将 `Pair<int>` 和 `Pair<double>` 看做单独的类型，我们可以使用按形参类型区分的重载函数：

```cpp
constexpr int max(Pair<int> p)
{
    return (p.first > p.second ? p.first : p.second);
}

constexpr double max(Pair<double> p) // okay: overloaded function differentiated by parameter type
{
    return (p.first > p.second ? p.first : p.second);
}
```


虽然上述代码可以编译了，但是它没有解决代码冗余的问题。我们实际上希望一个函数能够接受任何类型的参数。换言之我们希望函数可以使用  `Pair<T>` 类型的形参，其中 `T` 是一个模板类型参数。因此我们需要使用一个函数模板来完成相应的工作！

下面是一个完整的例子，`max()`被实现为一个函数模板：

```cpp
#include <iostream>

template <typename T>
struct Pair
{
    T first{};
    T second{};
};

template <typename T>
constexpr T max(Pair<T> p)
{
    return (p.first > p.second ? p.first : p.second);
}

int main()
{
    Pair<int> p1{ 5, 6 };
    std::cout << max<int>(p1) << " is larger\n"; // explicit call to max<int>

    Pair<double> p2{ 1.2, 3.4 };
    std::cout << max(p2) << " is larger\n"; // call to max<double> using template argument deduction (prefer this)

    return 0;
}
```

`max()` 函数模板非常直白。因为我们需要向其传递 `Pair<T>`，所以编译器必须了解 `T` 是什么。因此，我们需要在函数开头出添加模板参数声明，定义模板类型`T`。随后，我们就可以使用`T`作为返回类型，以及模板参数 `Pair<T>`。

因为 `max()` 函数的调用基于 `Pair<int>` 类型[[arguments|实参]] ，编译器会基于函数模板实例化函数`int max<int>(Pair<int>)` ，模板中的 `T` 被替换为了`int`。编译器实际上实例化了这样一个函数：

```cpp
template <>
constexpr int max(Pair<int> p)
{
    return (p.first > p.second ? p.first : p.second);
}
```

与所有对函数模板的调用一样，我们可以显式地指定模板类型实参(例如 `max<int>(p1)`)，也可以隐式地使用(例如 `max(p2)`)，并让编译器使用[[class-template-argument-deduction|类模板实参推断]]来确定模板类型实参应该是什么类型的。

## 同时使用模板类型和非模板类型的类模板

类模板的成员可以使用模板类型，也可以同时有另外一部分成员使用普通类型（非模板），例如：

```cpp
template <typename T>
struct Foo
{
    T first{};    // first will have whatever type T is replaced with
    int second{}; // second will always have type int, regardless of what type T is
};
```

上述代码能够正常工作：`first` 的类型由 `T` 指定，而 `second` 类型则总是`int`。

## 具有多个模板类型的类模板

类模板也可以有多个模板类型。例如，如果我们希望`Pair` 类的两个成员能够具有不同的类型，我们可以用两种模板类型定义`Pair` 类模板：

```cpp
#include <iostream>

template <typename T, typename U>
struct Pair
{
    T first{};
    U second{};
};

template <typename T, typename U>
void print(Pair<T, U> p)
{
    std::cout << '[' << p.first << ", " << p.second << ']';
}

int main()
{
    Pair<int, double> p1{ 1, 2.3 }; // a pair holding an int and a double
    Pair<double, int> p2{ 4.5, 6 }; // a pair holding a double and an int
    Pair<int, int> p3{ 7, 8 };      // a pair holding two ints

    print(p2);

    return 0;
}
```

要定义多个模板类型，在模板参数声明中，用逗号分隔每个所需的模板类型。在上面的例子中，我们定义了两种不同的模板类型，一种名为`T` ，另一种名为`U` 。`T` 和 `U` 的实际模板类型实参可以不同(就像上面的 `p1` 和 `p2` 一样)，也可以相同(就像 `p3` 一样)。

## `std::pair`

因为在C++中使用一对数据是很常见的需求，因此C++标准库提供了一个名为`std::pair`的类模板(位于 `<utility>` 头文件中) ，它的另一和使用了多个模板类型的  `Pair` 类一样。实际上，我们可以使用 `std::pair` 来替换我们定义的`pair`。

```cpp
#include <iostream>
#include <utility>

template <typename T, typename U>
void print(std::pair<T, U> p)
{
    std::cout << '[' << p.first << ", " << p.second << ']';
}

int main()
{
    std::pair<int, double> p1{ 1, 2.3 }; // a pair holding an int and a double
    std::pair<double, int> p2{ 4.5, 6 }; // a pair holding a double and an int
    std::pair<int, int> p3{ 7, 8 };      // a pair holding two ints

    print(p2);

    return 0;
}
```

本节课我们定义了自己的 `Pair` 类以解释其工作原理，但是在实际工作中，我们推荐使用`std::pair`。

## 在多个文件中使用类模板

就像函数模板一样，类模板通常是在头文件中定义的，因此它们可以被包含到任何需要它们的代码文件中。模板定义和类型定义都不受[[one-definition-rule|单一定义规则(one-definition-rule)]]的约束，所以这不会导致问题：

```cpp title="pair.h"
#ifndef PAIR_H
#define PAIR_H

template <typename T>
struct Pair
{
    T first{};
    T second{};
};

template <typename T>
constexpr T max(Pair<T> p)
{
    return (p.first > p.second ? p.first : p.second);
}

#endif
```

```cpp title="foo.cpp"
#include "pair.h"
#include <iostream>

void foo()
{
    Pair<int> p1{ 1, 2 };
    std::cout << max(p1) << " is larger\n";
}
```

```cpp title="main.cpp"
#include "pair.h"
#include <iostream>

void foo(); // forward declaration for function foo()

int main()
{
    Pair<double> p2 { 3.4, 5.6 };
    std::cout << max(p2) << " is larger\n";

    foo();

    return 0;
}
```