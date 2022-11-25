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

??? note "关键点速记"



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

!!! info "作者注"

	在继续阅读之前，如果你还不熟悉函数模板、模板类型或者函数模板实例化是如何工作的，推荐复习一下 [[8-13-Function-templates|8.13 - 函数模板]]和[[8-14-Function-template-instantiation|8.14 - 函数模板的实例化]]。
	
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

接下来，我们像往常一样定义结构，只不过我们可以在需要模板类型的地方使用模板类型(`T` )，以便稍后用实际类型替换模板类型。就是这样！类模板的d我们已经完成了类模板定义。

Next, we define our struct like usual, except we can use our template type (`T`) wherever we want a templated type that will be replaced with a real type later. That’s it! We’re done with the class template definition.

Inside main, we can instantiate `Pair` objects using whatever types we desire. First, we instantiate an object of type `Pair<int>`. Because a type definition for `Pair<int>` doesn’t exist yet, the compiler uses the class template to instantiate a struct type definition named `Pair<int>`, where all occurrences of template type `T` are replaced by type `int`.

Next, we instantiate an object of type `Pair<double>`, which instantiates a struct type definition named `Pair<double>` where `T` is replaced by `double`. For `p3`, `Pair<double>` has already been instantiated, so the compiler will use the prior type definition.

Here’s the same example as above, showing what the compiler actually compiles after all template instantiations are done:

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

COPY

You can compile this example directly and see that it works as expected!

For advanced readers

The above example makes use of a feature called template class specialization (covered in future lesson [19.4 -- Class template specialization](https://www.learncpp.com/cpp-tutorial/class-template-specialization/)). Knowledge of how this feature works is not required at this point.

## Using our class template in a function

Now let’s return to the challenge of making our `max()` function work with different types. Because the compiler treats `Pair<int>` and `Pair<double>`as separate types, we could use overloaded functions that are differentiated by parameter type:

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

COPY

While this compiles, it doesn’t solve the redundancy problem. What we really want is a function that can take a pair of any type. In other words, we want a function that takes a parameter of type `Pair<T>`, where T is a template type parameter. And that means we need a function template for this job!

Here’s a full example, with `max()` being implemented as a function template:

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

COPY

The `max()` function template is pretty straightforward. Because we want to pass in a `Pair<T>`, we need the compiler to understand what `T` is. Therefore, we need to start our function with a template parameter declaration that defines template type T. We can then use `T` as both our return type, and as the template type for `Pair<T>`.

When the `max()` function is called with a `Pair<int>` argument, the compiler will instantiate the function `int max<int>(Pair<int>)` from the function template, where template type `T` is replaced with `int`. The following snippet shows what the compiler actually instantiates in such a case:

```cpp
template <>
constexpr int max(Pair<int> p)
{
    return (p.first > p.second ? p.first : p.second);
}
```

COPY

As with all calls to a function template, we can either be explicit about the template type argument (e.g. `max<int>(p1)`) or we can be implicitly (e.g. `max(p2)`) and let the compiler use template argument deduction to determine what the template type argument should be.

Class templates with template type and non-template type members

Class templates can have some members using a template type and other members using a normal (non-template) type. For example:

```cpp
template <typename T>
struct Foo
{
    T first{};    // first will have whatever type T is replaced with
    int second{}; // second will always have type int, regardless of what type T is
};
```

COPY

This works exactly like you’d expect: `first` will be whatever the template type `T` is, and `second` will always be an `int`.

## 具有多个模板类型的类模板

Class templates can also have multiple template types. For example, if we wanted the two members of our `Pair` class to be able to have different types, we can define our `Pair` class template with two template types:

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

COPY

To define multiple template types, in our template parameter declaration, we separate each of our desired template types with a comma. In the above example we define two different template types, one named `T`, and one named `U`. The actual template type arguments for `T` and `U` can be different (as in the case of `p1` and `p2` above) or the same (as in the case of `p3`).

## `std::pair`

Because working with pairs of data is common, the C++ standard library contains a class template named `std::pair` (in the `<utility>` header) that is defined identically to the `Pair` class template with multiple template types in the preceding section. In fact, we can swap out the `pair` struct we developed for `std::pair`:

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

COPY

We developed our own `Pair` class in this lesson to show how things work, but in real code, you should favor `std::pair` over writing your own.

## 在多个文件中使用类模板

Just like function templates, class templates are typically defined in header files so they can be included into any code file that needs them. Both template definitions and type definitions are exempt from the one-definition rule, so this won’t cause problems:

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