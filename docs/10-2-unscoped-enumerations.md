---
title: 10.2 - 非限定作用域枚举类型
alias: 10.2 - 非限定作用域枚举类型
origin: /unscoped-enumerations/
origin_title: "10.2 — Unscoped enumerations"
time: 2022-9-16
type: translation
tags:
- enum 
- unscoped enumerations
---

??? note "关键点速记"


C++ 中内置了很多有用的基础数据类型和符合类型（分别在[[4-1-Introduction-to-fundamental-data-types|4.1 - 基础数据类型简介]]和[[9-1-Introduction-to-compound-data-types|9.1 - 复合数据类型]]中进行了介绍）。但是这些内置数据类型并不是总能满足我们的需要。

例如，我们的程序需要追踪一个苹果的颜色是红色、黄色还是绿色。亦或者我们需要描述一件T恤的可选颜色（通过一个颜色列表）。如果只能使用基础类型的话，你会怎么做？

你可能会把颜色存储为整型值，并隐式地将其关联到对应的颜色(0 = red , 1 = green, 2 = blue)：

```cpp
int main()
{
    int appleColor{ 0 }; // my apple is red
    int shirtColor{ 1 }; // my shirt is green

    return 0;
}
```

但是这么做并不直观，而且我们讨论过为什么使用魔鬼数字是不利的（[[4-13-Const-variables-and-symbolic-constants|4.13 - const 变量和符号常量]]）。我们可以使用符号常量来避免魔鬼数字的问题：

```cpp
constexpr int red{ 0 };
constexpr int green{ 1 };
constexpr int blue{ 2 };

int main()
{
    int appleColor{ red };
    int shirtColor{ green };

    return 0;
}
```

尽管可读性变好了一些，程序员仍然需要理解`appleColor` 和 `shirtColor` (`int`类型)存放的是另外一些表示颜色的符号常量（而这些常量很可能被定义在其他地方，甚至是其他文件中）。

使用[[8-6-Typedefs-and-type-aliases|别名]]可以进一步提高可读性：

```cpp
using Color = int; // define a type alias named Color

// The following color values should be used for a Color
constexpr Color red{ 0 };
constexpr Color green{ 1 };
constexpr Color blue{ 2 };

int main()
{
    Color appleColor{ red };
    Color shirtColor{ green };

    return 0;
}
```

可读性更好了。但是程序员仍然需要理解，这些表示颜色的符号常量需要配合 `Color` 类型的变量来使用。不过至少现在这些类型具有一个唯一的别名 `Color` ，我们可以搜索它并找到相关的符号常量定义。

但是，因为 `Color` 只是 `int` 的别名，所以我们仍然无法保证这些符号常量被正确地使用。我们仍然由可能犯如下的错误。

```cpp
Color eyeColor{ 8 }; // 语法正确，但语义错误（8不是一个被定义的颜色值）
```

不仅如此，当我们调试程序的时候，这些变量都会显示为整型值，而不是其符号含义 (`red`)，这无疑会让debug变得更加困难。

幸运地是，我们还有更好的办法。

## 枚举

An enumeration (also called an enumerated type or an enum) is a compound data type where every possible value is defined as a symbolic constant (called an enumerator).

Because enumerations are program-defined types[[10-1-Introduction-to-program-defined-user-defined-types|10.1 - 自定义类型简介]]，each enumeration needs to be defined before we can use it to create objects using that enumerated type.

C++ supports two kinds of enumerations: [[unscoped-enumerations|非限定作用域枚举类型]] (which we’ll cover now) and scoped enumerations (which we’ll cover later in this chapter).

## 非限定作用域枚举类型

[[unscoped-enumerations|非限定作用域枚举类型]] are defined via the `enum` keyword.

Enumerated types are best taught by example, so let’s define an unscoped enumeration that can hold some color values. We’ll explain how it all works below.

```cpp
// Define a new unscoped enumeration named Color
enum Color
{
    // Here are the enumerators
    // These symbolic constants define all the possible values this type can hold
    // Each enumerator is separated by a comma, not a semicolon
    red,
    green,
    blue, // trailing comma optional but recommended
}; // the enum definition must end with a semicolon

int main()
{
    // Define a few variables of enumerated type Color
    Color apple { red };   // my apple is red
    Color shirt { green }; // my shirt is green
    Color cup { blue };    // my cup is blue

    Color socks { white }; // error: white is not an enumerator of Color
    Color hat { 2 };       // error: 2 is not an enumerator of Color

    return 0;
}
```


We start our example by using the `enum` keyword to tell the compiler that we are defining an unscoped enumeration, which we’ve named `Color`.

Inside a pair of curly braces, we define the enumerators for the `Color` type: `red`, `green`, and `blue`. These enumerators specify the set of possible values that objects of type `Color` will be able to hold. Each enumerator must be separated by a comma (not a semicolon) -- a trailing comma after the last enumerator is optional but recommended for consistency.

The type definition for `Color` ends with a semicolon. We’ve now fully defined what enumerated type `Color` is!

Inside `main()`, we instantiate three variables of type `Color`: `apple` is initialized with the color `red`, `shirt` is initialized with the color `green`, and `cup` is initialized with the color `blue`. Memory is allocated for each of these objects. Note that the initializer for an enumerated type must be one of the defined enumerators for that type. The variables `socks` and `hat` cause compile errors because the initializers `white` and `2` are not enumerators of `Color`.

!!! info "作者注"

	To quickly recap on nomenclature:
	- An _enumeration_ or _enumerated type_ is the program-defined type itself (e.g. `Color`)
	- An _enumerator_ is a symbolic constant that is a possible value for a given enumeration (e.g. `red`)

## Naming enumerations and enumerators

By convention, the names of enumerated types start with a capital letter (as do all program-defined types).

!!! warning "注意"

	Enumerations don’t have to be named, but unnamed enumerations should be avoided in modern C++.

Enumerators must be given names. Unfortunately, there is no common naming convention for enumerator names. Common choices include starting with lower case (e.g. red), starting with caps (Red), all caps (RED), all caps with a prefix (COLOR_RED), or prefixed with a “k” and intercapped (kColorRed).

Modern C++ guidelines typically recommend avoiding the all caps naming conventions, as all caps is typically used for preprocessor macros and may conflict. We recommend also avoiding the conventions starting with a capital letter, as names beginning with a capital letter are typically reserved for program-defined types.

!!! success "最佳实践"

	Name your enumerated types starting with a capital letter. Name your enumerators starting with a lower case letter.

## Enumerated types are distinct types

Each enumerated type you create is considered to be a distinct type, meaning the compiler can distinguish it from other types (unlike typedefs or type aliases, which are considered non-distinct from the types they are aliasing).

Because enumerated types are distinct, enumerators defined as part of one enumerated type can’t be used with objects of another enumerated type:

```cpp
enum Pet
{
    cat,
    dog,
    pig,
    whale,
};

enum Color
{
    black,
    red,
    blue,
};

int main()
{
    Pet myPet { black }; // compile error: black is not an enumerator of Pet
    Color shirt { pig }; // compile error: pig is not an enumerator of Color

    return 0;
}
```


You probably didn’t want a pig shirt anyway.

## Putting enumerations to use

Because enumerators are descriptive, they are useful for enhancing code documentation and readability. Enumerated types are best used when you have a smallish set of related constants, and objects only need to hold one of those values at a time.

Commonly defined enumerations include days of the week, the cardinal directions, and the suits in a deck of cards:

```cpp
enum DaysOfWeek
{
    sunday,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
};

enum CardinalDirections
{
    north,
    east,
    south,
    west,
};

enum CardSuits
{
    clubs,
    diamonds,
    hearts,
    spades,
};
```

Sometimes functions will return a status code to the caller to indicate whether the function executed successfully or encountered an error. Traditionally, small negative numbers were used to represent different possible error codes. For example:

```cpp
int readFileContents()
{
    if (!openFile())
        return -1;
    if (!readFile())
        return -2;
    if (!parseFile())
        return -3;

    return 0; // success
}
```


However, using magic numbers like this isn’t very descriptive. A better method would be to use an enumerated type:

```cpp
enum FileReadResult
{
    readResultSuccess,
    readResultErrorFileOpen,
    readResultErrorFileRead,
    readResultErrorFileParse,
};

FileReadResult readFileContents()
{
    if (!openFile())
        return readResultErrorFileOpen;
    if (!readFile())
        return readResultErrorFileRead;
    if (!parseFile())
        return readResultErrorFileParse;

    return readResultSuccess;
}
```


Then the caller can test the function’s return value against the appropriate enumerator, which is easier to understand than testing the return result for a specific integer value.

```cpp
if (readFileContents() == readResultSuccess)
{
    // do something
}
else
{
    // print error message
}
```

Enumerated types can also be put to good use in games, to identify different types of items, or monsters, or terrain types. Basically, anything that is a small set of related objects.

For example:

```cpp
enum ItemType
{
	sword,
	torch,
	potion,
};

int main()
{
	ItemType holding{ torch };

	return 0;
}
```


Enumerated types can also make for useful function parameters when the user needs to make a choice between two or more options:

```cpp
enum SortOrder
{
    alphabetical,
    alphabeticalReverse,
    numerical,
};

void sortData(SortOrder order)
{
    if (order == alphabetical)
        // sort data in forwards alphabetical order
    else if (order == alphabeticalReverse)
        // sort data in backwards alphabetical order
    else if (order == numerical)
        // sort data numerically
}
```


Many languages use enumerations to define Booleans -- after all, a Boolean is essentially just an enumeration with 2 enumerators: `false` and `true`! However, in C++, `true` and `false` are defined as keywords instead of enumerators.

## The scope of unscoped enumerations

Unscoped enumerations are named such because they put their enumerator names into the same scope as the enumeration definition itself (as opposed to creating a new scope region like a namespace does).

For example, given this program:

```cpp
enum Color // this enum is defined in the global namespace
{
    red, // so red is put into the global namespace
    green,
    blue,
};

int main()
{
    Color apple { red }; // my apple is red

    return 0;
}
```

COPY

The `Color` enumeration is defined in the global scope. Therefore, all the enumeration names (`red`, `green`, and `blue`) also go into the global scope. This pollutes the global scope and significantly raises the chance of naming collisions.

One consequence of this is that an enumerator name can’t be used in multiple enumerations within the same scope:

```cpp
enum Color
{
    red,
    green,
    blue, // blue is put into the global namespace
};

enum Feeling
{
    happy,
    tired,
    blue, // error: naming collision with the above blue
};

int main()
{
    Color apple { red }; // my apple is red
    Feeling me { happy }; // I'm happy right now (even though my program doesn't compile)

    return 0;
}
```

COPY

In the above example, both unscoped enumerations (`Color` and `Feeling`) put enumerators with the same name `blue` into the global scope. This leads to a naming collision and subsequent compile error.

Unscoped enumerations also provide a named scope region for their enumerators (much like a namespace acts as a named scope region for the names declared within). This means we can access the enumerators of an unscoped enumeration as follows:

```cpp
enum Color
{
    red,
    green,
    blue, // blue is put into the global namespace
};

int main()
{
    Color apple { red }; // okay, accessing enumerator from global namespace
    Color raspberry { Color::red }; // also okay, accessing enumerator from scope of Color

    return 0;
}
```

COPY

Most often, unscoped enumerators are accessed without using the scope resolution operator.

## Avoiding enumerator naming collisions

There are quite a few common ways to prevent unscoped enumerator naming collisions. One option is to prefix each enumerator with the name of the enumeration itself:

```cpp
enum Color
{
    color_red,
    color_blue,
    color_green,
};

enum Feeling
{
    feeling_happy,
    feeling_tired,
    feeling_blue, // no longer has a naming collision with color_blue
};

int main()
{
    Color paint { color_blue };
    Feeling me { feeling_blue };

    return 0;
}
```

COPY

This still pollutes the namespace but reduces the chance for naming collisions by making the names longer and more unique.

A better option is to put the enumerated type inside something that provides a separate scope region, such as a namespace:

```cpp
namespace color
{
    // The names Color, red, blue, and green are defined inside namespace color
    enum Color
    {
        red,
        green,
        blue,
    };
}

namespace feeling
{
    enum Feeling
    {
        happy,
        tired,
        blue, // feeling::blue doesn't collide with color::blue
    };
}

int main()
{
    color::Color paint { color::blue };
    feeling::Feeling me { feeling::blue };

    return 0;
}
```

COPY

This means we now have to prefix our enumeration and enumerator names with the name of the scoped region.

!!! info "扩展阅读"

    Classes also provide a scope region, and it’s common to put enumerated types related to a class inside the scope region of the class. We discuss this in lesson [13.17 -- Nested types in classes](https://www.learncpp.com/cpp-tutorial/nested-types-in-classes/).

A related option is to use a scoped enumeration (which defines its own scope region). We’ll discuss scoped enumerations shortly ([10.4 -- Scoped enumerations (enum classes)](https://www.learncpp.com/cpp-tutorial/scoped-enumerations-enum-classes/)).

!!! success "最佳实践"

	Prefer putting your enumerations inside a named scope region (such as a namespace or class) so the enumerators don’t pollute the global namespace.

## Comparing against enumerators

We can use the equality operators (`operator==` and `operator!=`) to test whether an enumeration has the value of a particular enumerator or not.

```cpp
#include <iostream>

enum Color
{
    red,
    green,
    blue,
};

int main()
{
    Color shirt{ blue };

    if (shirt == blue) // if the shirt is blue
        std::cout << "Your shirt is blue!";
    else
        std::cout << "Your shirt is not blue!";

    return 0;
}
```

COPY

In the above example, we use an if-statement to test whether `shirt` is equal to the enumerator `blue`. This gives us a way to conditionalize our program’s behavior based on what enumerator our enumeration is holding.

We’ll make more use of this in the next lesson.