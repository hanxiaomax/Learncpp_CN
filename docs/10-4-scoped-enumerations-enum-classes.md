---
title: 10.4 - 限定作用域枚举（枚举类）
alias: 10.4 - 限定作用域枚举（枚举类）
origin: /scoped-enumerations-enum-classes/
origin_title: "10.4 — Scoped enumerations (enum classes)"
time: 2022-8-23
type: translation
tags:
- enum 
- scoped enumerations
- C++20
---

??? note "关键点速记"
	

尽管[[unscoped-enumerations|非限定作用域枚举类型]]在C++中是可区分类型，但它们并不是[[type-safe|类型安全]]的，而且在某些情况下它允许你做出一些不合理的操作。考虑下面的代码：

```cpp
#include <iostream>

int main()
{
    enum Color
    {
        red,
        blue,
    };

    enum Fruit
    {
        banana,
        apple,
    };

    Color color { red };
    Fruit fruit { banana };

    if (color == fruit) // 编译器会将 color 和 fruit 当做整型进行比较
        std::cout << "color and fruit are equal\n"; // 并认为它们相等
    else
        std::cout << "color and fruit are not equal\n";

    return 0;
}
```

打印：

```
color and fruit are equal
```

当 `color` 和 `fruit` 进行比较时，编译器会首先判断它是否知道如何比较`Color` 和 `Fruit`。它并不知道。然后，它就会尝试将 `Color` 或 `Fruit` 转换为整型并继续查看是有匹配的比较方法。最终，编译器会将二者都转换为整型并进行比较。因为 `color` 和 `fruit` 的枚举值都转换为0，所以它们是相等的。

这显然不合理，因为 `color` 和 `fruit` 来自两个不同的枚举类型，它们本来是不具有可比性的。对于一般的枚举来说，我们并没有简单的办法放置此类事情发生。

因为上述问题的存在，以及[[namespace|命名空间]]污染问题，C++设计者决定提供一个干净利落地解决方案。

## 有作用域枚举

这个解决方案就是[[scoped-enumerations|有作用域枚举]](在C++中通常称为[[enum-class|枚举类]]，至于为什么这么叫它，很快就会不言自明了)。

有作用域枚举和无作用域枚举（[[10-2-unscoped-enumerations|10.2 - 非限定作用域枚举类型]]）用法类似，不过它们有两个主要的区别：其一，有作用域枚举是强类型的(它不会被隐式地转换为整型) ，其二它具有强作用域约束 (它的枚举值**只会**被放置在枚举类的作用域中)。

创建有作用域枚举，需要使用关键字 `enum class`。定义的其他部分则和无作用域枚举一样。例如：

```cpp
#include <iostream>
int main()
{
    enum class Color // "enum class" 定义了有作用域枚举类型
    {
        red, // red 是 Color 作用域的成员
        blue,
    };

    enum class Fruit
    {
        banana, // banana 是 Fruit 作用域的成员
        apple,
    };

    Color color { Color::red }; // 注意: red 不能够被直接访问，必须使用 Color::red
    Fruit fruit { Fruit::banana }; // note: banana 不能够被直接访问, 必须使用 Fruit::banana

    if (color == fruit) // 编译错误：编译器不知道如何比较 Color 和 Fruit
        std::cout << "color and fruit are equal\n";
    else
        std::cout << "color and fruit are not equal\n";

    return 0;
}
```

编译器会报告程序的第19行存在错误，因为有作用域枚举不能够被转换为任何可比较的其他类型。

!!! cite "题外话"

    `class` 关键字 (以及`static`关键字)是 C++ 中最被“滥用”的关键字，它在不同语境下具有不同的含义。尽管有作用域枚举类型使用了 `class` 关键字，但是它们并不是类类型（类类型包括结构体、类和联合体）。
    
## 有作用域枚举会定义自己的作用域


[[unscoped-enumerations|无作用域枚举类型]]会将其枚举值和自己放置在相同的作用域中，而有作用域枚举会将它的枚举值放置在自己定义的作用域中。换言之，有作用域枚举同时是其枚举值的命名空间。这种自带的作用域有助于避免命名空间污染和潜在的命名冲突。

要访问有作用域枚举值，就像它位于与作用域枚举同名的命名空间中一样:

```cpp
#include <iostream>

int main()
{
    enum class Color // "enum class" defines this as a scoped enum rather than an unscoped enum
    {
        red, // red is considered part of Color's scope region
        blue,
    };

    std::cout << red << '\n';        // compile error: red not defined in this scope region
    std::cout << Color::red << '\n'; // compile error: std::cout doesn't know how to print this (will not implicitly convert to int)

    Color color { Color::blue }; // okay

    return 0;
}
```

因为有作用域枚举类型为枚举值提供了它们自己的隐式名称空间，所以没有必要将作用域枚举放在另一个作用域(比如名称空间)中，除非有其他令人信服的理由这样做，因为这样做是多余的。

## 有作用域枚举不会被隐式地转换为整型

和无作用域枚举不同，有作用域枚举不会被隐式地转换为整型。在大多数情况下，这是有益地，因为绝大多数情况下这样的转换都不合理，所以这有助于帮我们避免语义错误，例如比较两个不同枚举类型中的枚举值或者使用枚举值进行数学运算（`red + 5`）。

注意，你可以比较来自相同有作用域枚举类型中的枚举值(因为它们具有相同的类型)：

```cpp
#include <iostream>
int main()
{
    enum class Color
    {
        red,
        blue,
    };

    Color shirt { Color::red };

    if (shirt == Color::red) // Color 和 Color 的比较是可以的
        std::cout << "The shirt is red!\n";
    else if (shirt == Color::blue)
        std::cout << "The shirt is blue!\n";

    return 0;
}
```

在某些情况下，将有作用域枚举值作为整数处理也是有用的。在这些情况下，可以通过使用`static_cast` 显式地将枚举值转换为整数：

```cpp
#include <iostream>
int main()
{
    enum class Color
    {
        red,
        blue,
    };

    Color color { Color::blue };

    std::cout << color << '\n'; // won't work, because there's no implicit conversion to int
    std::cout << static_cast<int>(color) << '\n'; // will print 1

    return 0;
}
```


反过来，你也可以使用 `static_cast` 将一个整型转换为有作用域枚举值，这在处理输入时尤其有用：

```cpp
#include <iostream>

enum class Pet
{
    cat, // assigned 0
    dog, // assigned 1
    pig, // assigned 2
    whale, // assigned 3
};

int main()
{
    std::cout << "Enter a pet (0=cat, 1=dog, 2=pig, 3=whale): ";

    int input{};
    std::cin >> input; // input an integer

    Pet pet{ static_cast<Pet>(input) }; // static_cast our integer to a Pet

    return 0;
}
```


As of C++17, you can initialize a scoped enumeration using an integral value without the `static_cast` (and unlike an unscoped enumeration, you don’t need to specify a base).

!!! success "最佳实践"

	Favor scoped enumerations over unscoped enumerations unless there’s a compelling reason to do otherwise.

Despite the benefits that scoped enumerations offer, unscoped enumerations are still commonly used in C++ because there are situations where we desire the implicit conversion to int (doing lots of static_casting get annoying) and we don’t need the extra namespacing.

## Easing the conversion of scoped enumerators to integers (进阶话题) 

Scoped enumerations are great, but the lack of implicit conversion to integers can sometimes be a pain point. If we need to convert a scoped enumeration to integers often (e.g. cases where we want to use scoped enumerators as array indices), having to use static_cast every time we want a conversion can clutter our code significantly.

If you find yourself in the situation where it would be useful to make conversion of scoped enumerators to integers easier, a useful hack is to overload the unary `operator+` to perform this conversion. We haven’t explained how this works yet, so consider it magic for now:

```cpp
#include <iostream>

enum class Animals
{
    chicken, // 0
    dog, // 1
    cat, // 2
    elephant, // 3
    duck, // 4
    snake, // 5

    maxAnimals,
};

// Overload the unary + operator to convert Animals to the underlying type
// adapted from https://stackoverflow.com/a/42198760, thanks to Pixelchemist for the idea
constexpr auto operator+(Animals a) noexcept
{
    return static_cast<std::underlying_type_t<Animals>>(a);
}

int main()
{
    std::cout << +Animals::elephant << '\n'; // convert Animals::elephant to an integer using unary operator+

    return 0;
}
```

打印：

```
3
```

This method prevents unintended implicit conversions to an integral type, but provides a convenient way to explicitly request such conversions as needed.

## `using enum` 语句 （C++20）

Introduced in C++20, a `using enum` statement imports all of the enumerators from an enum into the current scope. When used with an enum class type, this allows us to access the enum class enumerators without having to prefix each with the name of the enum class.

This can be useful in cases where we would otherwise have many identical, repeated prefixes, such as within a switch statement:

```cpp
#include <iostream>
#include <string_view>

enum class Color
{
    black,
    red,
    blue,
};

constexpr std::string_view getColor(Color color)
{
    using enum Color; // bring all Color enumerators into current scope (C++20)
    // We can now access the enumerators of Color without using a Color:: prefix

    switch (color)
    {
    case black: return "black"; // note: black instead of Color::black
    case red:   return "red";
    case blue:  return "blue";
    default:    return "???";
    }
}

int main()
{
    Color shirt{ Color::blue };

    std::cout << "Your shirt is " << getColor(shirt) << '\n';

    return 0;
}
```

COPY

In the above example, `Color` is an enum class, so we normally would access the enumerators using a fully qualified name (e.g. `Color::blue`). However, within function `getColor()`, we’ve added the statement `using enum Color;`, which allows us to access those enumerators without the `Color::` prefix.

This saves us from having multiple, redundant, obvious prefixes inside the switch statement.