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

    if (color == fruit) // The compiler will compare color and fruit as integers
        std::cout << "color and fruit are equal\n"; // and find they are equal!
    else
        std::cout << "color and fruit are not equal\n";

    return 0;
}
```

COPY

This prints:

color and fruit are equal

When `color` and `fruit` are compared, the compiler will look to see if it knows how to compare a `Color` and a `Fruit`. It doesn’t. Next, it will try converting `Color` and/or `Fruit` to integers to see if it can find a match. Eventually the compiler will determine that if it converts both to integers, it can do the comparison. Since `color` and `fruit` are both set to enumerators that convert to integer value `0`, `color` will equal `fruit`.

This doesn’t make sense semantically since `color` and `fruit` are from different enumerations and are not intended to be comparable. With standard enumerators, there’s no easy way to prevent this.

Because of such challenges, as well as the namespace pollution problem (unscoped enumerations defined in the global scope put their enumerators in the global namespace), the C++ designers determined that a cleaner solution for enumerations would be of use.

## Scoped enumerations

That solution is the scoped enumeration (often called an enum class in C++ for reasons that will become obvious shortly).

Scoped enumerations work similarly to unscoped enumerations ([10.2 -- Unscoped enumerations](https://www.learncpp.com/cpp-tutorial/unscoped-enumerations/)), but have two primary differences: They are strongly typed (they won’t implicitly convert to integers) and strongly scoped (the enumerators are _only_ placed into the scope region of the enumeration).

To make a scoped enumeration, we use the keywords `enum class`. The rest of the scoped enumeration definition is the same as an unscoped enumeration definition. Here’s an example:

```cpp
#include <iostream>
int main()
{
    enum class Color // "enum class" defines this as a scoped enumeration rather than an unscoped enumeration
    {
        red, // red is considered part of Color's scope region
        blue,
    };

    enum class Fruit
    {
        banana, // banana is considered part of Fruit's scope region
        apple,
    };

    Color color { Color::red }; // note: red is not directly accessible, we have to use Color::red
    Fruit fruit { Fruit::banana }; // note: banana is not directly accessible, we have to use Fruit::banana

    if (color == fruit) // compile error: the compiler doesn't know how to compare different types Color and Fruit
        std::cout << "color and fruit are equal\n";
    else
        std::cout << "color and fruit are not equal\n";

    return 0;
}
```

COPY

This program produces a compile error on line 19, since the scoped enumeration won’t convert to any type that can be compared with another type.

!!! cite "题外话"

    The `class` keyword (along with the `static` keyword), is one of the most overloaded keywords in the C++ language, and can have different meanings depending on context. Although scoped enumerations use the `class` keyword, they aren’t considered to be a “class type” (which is reserved for structs, classes, and unions).

## Scoped enumerations define their own scope regions

Unlike [[unscoped-enumerations|非限定作用域枚举类型]], which place their enumerators in the same scope as the enumeration itself, scoped enumerations place their enumerators _only_ in the scope region of the enumeration. In other words, scoped enumerations act like a namespace for their enumerators. This built-in namespacing helps reduce global namespace pollution and the potential for name conflicts when scoped enumerations are used in the global scope.

To access a scoped enumerator, we do so just as if it was in a namespace having the same name as the scoped enumeration:

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

COPY

Because scoped enumerations offer their own implicit namespacing for enumerators, there’s no need to put scoped enumerations inside another scope region (such as a namespace), unless there’s some other compelling reason to do so, as it would be redundant.

Scoped enumerations don’t implicitly convert to integers

Unlike non-scoped enumerators, scoped enumerators won’t implicitly convert to integers. In most cases, this is a good thing because it rarely makes sense to do so, and it helps prevent semantic errors, such as comparing enumerators from different enumerations, or expressions such as `red + 5`.

Note that you can still compare enumerators from within the same scoped enumeration (since they are of the same type):

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

    if (shirt == Color::red) // this Color to Color comparison is okay
        std::cout << "The shirt is red!\n";
    else if (shirt == Color::blue)
        std::cout << "The shirt is blue!\n";

    return 0;
}
```

COPY

There are occasionally cases where it is useful to be able to treat a scoped enumerator as an integer. In these cases, you can explicitly convert a scoped enumeration to an integer by using a `static_cast` to int:

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

COPY

Conversely, you can also `static_cast` an integer to a scoped enumerator, which can be useful when doing input from users:

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

COPY

As of C++17, you can initialize a scoped enumeration using an integral value without the static_cast (and unlike an unscoped enumeration, you don’t need to specify a base).

Best practice

Favor scoped enumerations over unscoped enumerations unless there’s a compelling reason to do otherwise.

Despite the benefits that scoped enumerations offer, unscoped enumerations are still commonly used in C++ because there are situations where we desire the implicit conversion to int (doing lots of static_casting get annoying) and we don’t need the extra namespacing.

Easing the conversion of scoped enumerators to integers (advanced) [](https://www.learncpp.com/cpp-tutorial/scoped-enumerations-enum-classes/#operatorplus)

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

COPY

This prints:

3

This method prevents unintended implicit conversions to an integral type, but provides a convenient way to explicitly request such conversions as needed.

`using enum` statements C++20

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