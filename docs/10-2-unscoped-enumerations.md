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

	- 使用`enum`关键字定义，默认暴露在全局作用域中，因此更适合被直接定义在使用它的类中


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

枚举(也称为枚举类型和`enum`) 是一种复合类型。在枚举类型中，每个可能的值都被定义为一个[[symbolic-constants|符号常量]]（称为枚举值）。

因为枚举属于程序定义类型（[[10-1-Introduction-to-program-defined-user-defined-types|10.1 - 自定义类型简介]]），所以枚举类型在使用前必须先进行定义。

C++ 支持两种类型的枚举：[[10-2-unscoped-enumerations|10.2 - 非限定作用域枚举类型]]和[[10-4-scoped-enumerations-enum-classes|10.4 - 限定作用域枚举（枚举类）]]

## 非限定作用域枚举类型

[[unscoped-enumerations|非限定作用域枚举类型]]通过 `enum` 关键字定义。

枚举类型通过实例来学习效果更好。接下来，让我们定义一个非限定作用域枚举类型来表示颜色值吧：


```cpp
// 定义一个新的非限定作用域枚举类型，名为 Color
enum Color
{
    // 枚举值定义在这里
    // 这些符号常量定义了所有可能的值
    // 枚举值通过逗号分割，而不是分号
    red,
    green,
    blue, // 结尾的逗号可有可无，但是推荐写上
}; // 枚举定义必须以分号结尾

int main()
{
    // 定义一些Color类型的变量
    Color apple { red };   // my apple is red
    Color shirt { green }; // my shirt is green
    Color cup { blue };    // my cup is blue

    Color socks { white }; // 错误: white 不是可用的枚举值
    Color hat { 2 };       // 错误: 2 页不是Color的枚举值

    return 0;
}
```


我们首先使用`enum`关键字来告诉编译器，我们正在定义一个非限定作用域枚举，我们将其命名为`Color` 。

随后，在花括号里面定义`Color`类型的枚举值：`red`，`green`和`blue`。这些枚举值指定了 `Color` 类型能够表示或存储的所有可能值。每个枚举值需要通过逗号（而不是分号）隔开——最后一个枚举值后面可以有逗号也可以没有，加上逗号看起来一致性更好。

`Color` 的定义以分号结尾。至此，枚举类型 `Color` 就定义完成了！

在 `main()` 函数中，我们初始化了三个 `Color` 类型的变量：`apple` 被初始化为 `red`，`shirt` 初始化为 `green` ，`cup` 初始化为 `blue`。 

程序会为这三个对象分配内存。注意，当初始化枚举类型时，所用的初始化值必须是该类型定义过的枚举值。变量`socks` 和 `hat` 并不能成功定义，因为 `white` 和 `2` 并不是 `Color` 的枚举值。

!!! info "作者注"

	命名规则小结:
	- 枚举和枚举类型指的是类型本身(例如 `Color`)
	- 枚举值指的是枚举中可能值所对应的符号常量(例如 `red`)

## 枚举类型和枚举值的命名

按照惯例，枚举类型的名字以大写字母开头（规则适用于所有自定义类型）。

!!! warning "注意"

	枚举类型不一定要有名字，但是现代C++推荐避免使用匿名的枚举。
	

枚举值必须有名字。可惜的是，对于枚举值的名字暂时还没有约定俗成的命名规范。通常的选择有：小写字母开头（例如`red`），大写字母开头（例如`Red`，全大写（例如`RED`）、全大写且添加将枚举类型作为前缀（例如`COLOR_RED`），再或者使用`k`作为前缀并配合大小写交替(kColorRed)。

现代C++指南通常建议避免使用全大写的命名约定，因为全大写通常用于预处理器宏，可能会发生冲突。我们还建议避免以大写字母开头的约定，因为以大写字母开头的名称通常为自定义类型保留。

!!! success "最佳实践"

	以大写字母开头命名枚举类型。以小写字母开头命名枚举值。
	

## 枚举类型是可区分类型

你创建的每个枚举类型都被认为是一个不同的类型，这意味着编译器可以将其与其他类型区分开来(不像`typedefs`或类型别名，它们是一种别名，与其对应的类型并没有区别)。

枚举类型是不同的，因此一种枚举类型中枚举值也不能用于另一种枚举类型的对象:


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
    Pet myPet { black }; // 编译错误: black 不是 Pet 的枚举值
    Color shirt { pig }; // 编译错误: pig 不是 Color 的枚举值

    return 0;
}
```

你可能也不想要一件”pig“衬衫。


## 使用枚举

因为枚举器是描述性的，它们对于增强代码文档性和可读性非常有用。当你的相关常量的集合很小，并且对象每次只需要保存其中一个值时，枚举类型是最合适的。

星期几、方向或者一副牌中的花色都是常见的枚举定义。



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

## 非限定作用域枚举类型的作用域

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

## 避免枚举值的命名冲突

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

A related option is to use a scoped enumeration (which defines its own scope region). We’ll discuss scoped enumerations shortly ([[10-4-scoped-enumerations-enum-classes|10.4 - 限定作用域枚举（枚举类）]]).

!!! success "最佳实践"

	Prefer putting your enumerations inside a named scope region (such as a namespace or class) so the enumerators don’t pollute the global namespace.

## 比较枚举值

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

In the above example, we use an if-statement to test whether `shirt` is equal to the enumerator `blue`. This gives us a way to conditionalize our program’s behavior based on what enumerator our enumeration is holding.

We’ll make more use of this in the next lesson.