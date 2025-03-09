---
title: 10.6 - 结构体的聚合初始化
alias: 10.6 - 结构体的聚合初始化
origin: /struct-aggregate-initialization//
origin_title: "10.6 — Struct aggregate initialization"
time: 2022-9-13
type: translation
tags:
- struct
- aggregate initialization
- C++20
---

> [!note] "Key Takeaway"
> - 数据成员默认不会被初始化，除非有默认初始化值。
> - 如果聚合类型被初始化了，那么即便没有对每个成员进行初始化，则该成员会使用自己的初始化值（可以是0，也可以是其他指定值，由其自身的括号初始化决定）
> - 列表初始化聚合类型时，按照[[memberwise initialization|成员依次初始化]]进行，此时如果插入新声明的成员到前面，则对应的列表必须移动，而编译器并不会检测到这类问题。
> - 在向聚合中添加新成员时，最安全的做法是将其添加到定义列表的底部，这样其他成员的初始化式就不需要调整顺序。

在上节课中([[10-5-Introduction-to-structs-members-and-member-selection|10.5 - 结构体、成员和成员选择]])，我们讨论了如何定义、初始化一个结构体以及如何访问其成员。在这节课中，我们会介绍如何初始化一个结构体。

## 数据成员默认不会被初始化

和普通变量类似，数据成员并不会被默认初始化。考虑下面的结构体：


```cpp
#include <iostream>

struct Employee
{
    int id; // note: no initializer here
    int age;
    double wage;
};

int main()
{
    Employee joe; // note: no initializer here either
    std::cout << joe.id << '\n';

    return 0;
}
```

因为我们没有提供任何初始化值，所以当实例化 `joe` 时，`joe.id`、`joe.age` 和 `joe.wage` 处于未初始化状态。当我们试图打印`joe.id` 的值时，将产生[[undefined-behavior|未定义行为]]。

但是，在向你展示如何初始化结构之前，让我们先绕路走一小段路。

## 什么是聚合？

在编程领域，[[aggregate-data-type|聚合数据类型]]指的是==任何包含多个数据成员的类型==。某些类型的聚合类型允许成员具有不同的类型(例如结构)，而其他类型的聚合要求所有成员必须具有单一类型(例如数组)。

在C++中，聚合数据类型的定义更局限也更复杂。

> [!info] "扩展阅读"
> C++ 中的聚合数据类型必须满足如下条件：
> -   是一个[[class-type|类类型]](包括 struct, class 或 union) 或数组 (包括内置数组或`std::array`)；
> -   没有私有或受保护的非静态数据成员；
> -   没有用户声明的或继承的[[constructor|构造函数]]；
> -   没有[[base-class|基类]]；
> -   没有[[virtual-function|虚函数]] ；


先把C++聚合的精确定义放在一边，在这一点上需要理解的重要事情是，==只有数据成员的结构(这是我们在这些课程中创建的唯一类型的结构)是聚合数据类型。数组(我们将在下一章讨论)也是聚合。==


## 结构体的聚合初始化

因为普通变量只能保存一个值，所以我们只需要提供一个初始化值：

```cpp
int x { 5 };
```

但是，结构体中有多个成员：

```cpp
struct Employee
{
    int id {};
    int age {};
    double wage {};
};
```

当定义一个具有结构类型的对象时，我们能够在初始化结构体时同时初始化多个成员的方法：

```cpp
Employee joe; // 如何初始化 joe.id, joe.age 和 joe.wage?
```

聚合数据类型使用一种称为[[aggregate-initialization|聚合初始化]]的初始化形式，它允许我们直接初始化聚合的成员。为此，我们提供一个[[initializer-list|初始化值列表]]作为初始化值。初始化值列表就是一个包含多个初始化值，以逗号分割的值列表。

就像普通变量可以被[[copy-initialization|拷贝初始化]]、[[direct-initialization|直接初始化]]或[[list-initialization|列表初始化]]一样，==聚合初始化也有三种形式：==


```cpp
struct Employee
{
    int id {};
    int age {};
    double wage {};
};

int main()
{
    Employee frank = { 1, 32, 60000.0 }; // 拷贝列表初始化，使用大括号
    Employee robert ( 3, 45, 62500.0 );  // 使用小括号的直接初始化(C++20)
    Employee joe { 2, 28, 45000.0 };     // 使用大括号列表的列表初始化（推荐）
    return 0;
}
```


上面这三种初始化形式都会进行[[memberwise initialization|成员依次初始化]]，即结构体成员会按照其声明的顺序进行初始化。因此，`Employee joe { 2, 28, 45000.0 };` 首先初始化 `joe.id` 为2，然后将 `joe.age` 初始化为28，最后将 `joe.wage` 初始化为 `45000.0` 。

> [!success] "最佳实践"
> 推荐使用括号列表形式（非拷贝）进行聚合初始化。
	
## 初始化值列表中缺失的值

如果聚合数据类型被初始化，但初始化值列表中的值个数少于成员个数，则剩余的成员会被[[value-initialization|值初始化]]。

```cpp
struct Employee
{
    int id {};
    int age {};
    double wage {};
};

int main()
{
    Employee joe { 2, 28 }; // joe.wage 被值初始化为 0.0

    return 0;
}
```

在上面的例子中， `joe.id` 被初始化为2， `joe.age` 被初始化为28，因为 `joe.wage` 没有被显式指定初始化值，则被值初始化为0.0。

这意味着我们可以使用一个空的初始化列表对结构的所有成员进行值初始化：

```cpp
Employee joe {}; // value-initialize all members
```

!!! info "译者注"

	关于默认初始化请参考[[10-7-default-member-initialization|10.7 - 默认成员初始化]]。


## const 结构体

结构体类型也可以是const的，而且和普通const变量一样必须被初始化。


```cpp
struct Rectangle
{
    double length {};
    double width {};
};

int main()
{
    const Rectangle unit { 1.0, 1.0 };
    const Rectangle zero { }; // value-initialize all members

    return 0;
}
```


## 指定初始化（ C++20 ）

使用列表初始化结构体时，是按照成员声明的顺序初始化的。

```cpp
struct Foo
{
    int a {};
    int c {};
};

int main()
{
    Foo f { 1, 3 }; // f.a = 1, f.c = 3
}
```


那么考虑这样一种情况，如果我们添加了一个新成员，而且并没有把它声明成最后一个：

```cpp
struct Foo
{
    int a {};
    int b {}; // just added
    int c {};
};

int main()
{
    Foo f { 1, 3 }; // now, f.a = 1, f.b = 3, f.c = 0
}
```

那么你所有使用初始化值列表的地方，都要对应的移动。更糟的是，编译器并不会检测到该问题，毕竟在语法层面它是有效的。

为了解决这个问题，C++20 为结构体成员提供了一个新的初始化方法——[[designated-initializers|指定初始化]]。指定初始化允许我们显示地将初始化值映射到所需初始化的成员。但是，列表的顺序仍然要求按照成员定义的顺序定义，否则编译器会报错。没有在列表中出现的成员仍然进行值初始化。
```cpp
struct Foo
{
    int a{ };
    int b{ };
    int c{ };
};

int main()
{
    Foo f1{ .a{ 1 }, .c{ 3 } }; // ok: f.a = 1, f.b = 0 (未出现，值初始化), f.c = 3
    Foo f2{ .b{ 2 }, .a{ 1 } }; // 错误: 初始化顺序和成员声明顺序不匹配

    return 0;
}
```

指定初始化很不错，因为它们提供了某种程度的自注释，并有助于确保你不会无意中混淆初始化值的顺序。但是，指定初始化式也会使初始化式列表变得非常混乱，因此我们目前不建议将其作为最佳实践使用。

另外，由于没有强制规定在初始化聚合的所有地方都一致使用指定初始化式，因此避免向现有聚合定义的中间添加新成员是一个好主意，以避免初始化式转移的风险。

> [!success] "最佳实践"
> 在向聚合中添加新成员时，最安全的做法是将其添加到定义列表的底部，这样其他成员的初始化式就不需要调整顺序。

## 使用初始化值列表进行赋值

如上一课所示，我们可以为结构体的成员单独赋值：

```cpp
struct Employee
{
    int id {};
    int age {};
    double wage {};
};

int main()
{
    Employee joe { 1, 32, 60000.0 };

    joe.age  = 33;      // Joe had a birthday
    joe.wage = 66000.0; // and got a raise

    return 0;
}
```

如果要操作的是个别成员，那是没有问题的。但是一旦要操作很多成员时，这种方式非常麻烦。类似于可以用[[initializer-list|初始化值列表]]初始化结构体一样，我们也可以使用初始化值列表进行赋值（进行[[memberwise-assignment|成员依次赋值]]）：

```cpp
struct Employee
{
    int id {};
    int age {};
    double wage {};
};

int main()
{
    Employee joe { 1, 32, 60000.0 };
    joe = { joe.id, 33, 66000.0 }; // Joe had a birthday and got a raise

    return 0;
}
```


注意，因为我们不希望改变  `joe.id` 的值，所以可以直接使用 `joe.id` 作为占位符，将 `joe.id` 赋值给 `joe.id`。虽然不太优雅。

## 使用指定初始化赋值（C++20）

指定初始化也可以用来赋值：

```cpp
struct Employee
{
    int id {};
    int age {};
    double wage {};
};

int main()
{
    Employee joe { 1, 32, 60000.0 };
    joe = { .id = joe.id, .age = 33, .wage = 66000.0 }; // Joe had a birthday and got a raise

    return 0;
}
```

任何没有在这种赋值中指定的成员都将被赋值给用于[[value-initialization|值初始化]]的值。也就是说，如果不为 `joe.id` 提供指定初始化值，则`joe.id` 会被赋值为0。