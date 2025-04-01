---
title: 13.10 - 结构体传递及其他
alias: 13.10 - 结构体传递及其他
origin: /default-member-initialization/
origin_title: "10.8 — Struct passing and miscellany"
time: 2022-8-25
type: translation
tags:
- struct
---
> [!note] "Key Takeaway"


假设一个员工由3个松散变量表示：

```cpp
int main()
{
    int id { 1 };
    int age { 24 };
    double wage { 52400.0 };

    return 0;
}
```

如果我们想把这个雇员传递给一个函数，则须传递三个变量：

```cpp
#include <iostream>

void printEmployee(int id, int age, double wage)
{
    std::cout << "ID:   " << id << '\n';
    std::cout << "Age:  " << age << '\n';
    std::cout << "Wage: " << wage << '\n';
}

int main()
{
    int id { 1 };
    int age { 24 };
    double wage { 52400.0 };

    printEmployee(id, age, wage);

    return 0;
}
```


虽然传递3个变量并不是那么糟糕，但考虑一个有10或12个成员的结构体。独立地传递每个变量既耗时又容易出错。此外，如果我们向雇员添加了一个新属性(例如名称)，我们现在必须修改所有函数声明、定义和函数调用，以接受新的形参和实参！


## 按引用传递结构体

使用结构体而不是单个变量的一大优点是，我们可以将整个结构传递给需要与成员一起工作的函数。结构体通常通过(const)引用传递，以避免拷贝。


```cpp
#include <iostream>

struct Employee
{
    int id {};
    int age {};
    double wage {};
};

void printEmployee(const Employee& employee) // note pass by reference here
{
    std::cout << "ID:   " << employee.id << '\n';
    std::cout << "Age:  " << employee.age << '\n';
    std::cout << "Wage: " << employee.wage << '\n';
}

int main()
{
    Employee joe { 14, 32, 24.15 };
    Employee frank { 15, 28, 18.27 };

    // Print Joe's information
    printEmployee(joe);

    std::cout << '\n';

    // Print Frank's information
    printEmployee(frank);

    return 0;
}
```


在上面的例子中，我们将 `Employee` 作为整体传递给 `printEmployee()` (传递了量词，一次是`joe` 一次是`frank`)。

上面程序输出：

```
ID:   14
Age:  32
Wage: 24.15

ID:   15
Age:  28
Wage: 18.27
```

因为传递的是整个结构对象(而不是单个成员)，所以无论结构对象有多少成员，我们只需要一个形参。而且，在将来，如果需要向`Employee`结构体中添加新成员，也不必更改函数声明或函数调用！新成员将自动被包括在内。

## 返回结构体

考虑这样一种情况，我们有一个函数需要返回三维笛卡尔空间中的一个点。这样的点有3个属性：`x`坐标、`y`坐标和`z`坐标。但是函数只能返回一个值。此时应该如何将3个坐标全部返回给用户?

最常见的办法是返回一个结构体：

```cpp
#include <iostream>

struct Point3d
{
    double x { 0.0 };
    double y { 0.0 };
    double z { 0.0 };
};

Point3d getZeroPoint()
{
    // We can create a variable and return the variable (we'll improve this below)
    Point3d temp { 0.0, 0.0, 0.0 };
    return temp;
}

int main()
{
    Point3d zero{ getZeroPoint() };

    if (zero.x == 0.0 && zero.y == 0.0 && zero.z == 0.0)
        std::cout << "The point is zero\n";
    else
        std::cout << "The point is not zero\n";

    return 0;
}
```

打印结果：

```
The point is zero
```

结构体通常[[return-by-value|按值返回]]，这样就不会产生[[dangling|悬垂]]引用。

## 返回匿名结构体

`getZeroPoint()` 函数中创建了一个对象(`temp`)，我们可以将它直接返回：

```cpp
Point3d getZeroPoint()
{
    // We can create a variable and return the variable (we'll improve this below)
    Point3d temp { 0.0, 0.0, 0.0 };
    return temp;
}
```

这个命名对象 (`temp`) 对可读性并没有什么帮助。

我们可以对函数稍加修改，使其返回一个临时的匿名对象：

```cpp
Point3d getZeroPoint()
{
    return Point3d { 0.0, 0.0, 0.0 }; // return an unnamed Point3d
}
```

这个例子中创建了一个临时的 `Point3d` 对象并将其[[return-by-value|按值返回]]（拷贝返回）给调用者。该对象会在表达式结束时销毁。注意这是多么的简洁(一行相比两行，并且不需要判断 `temp` 是否使用了多次)。

==在函数有显式返回类型的情况下(例如: `Point3d` )而不是使用类型演绎(一个 `auto` 返回类型)，我们甚至可以在return语句中省略类型:==

```cpp
Point3d getZeroPoint()
{
    // We already specified the type at the function declaration
    // so we don't need to do so here again
    return { 0.0, 0.0, 0.0 }; // return an unnamed Point3d
}
```

还要注意，因为在本例中我们返回的都是零值，所以我们可以使用空大括号来返回一个值初始化的 `Point3d`：

```cpp
Point3d getZeroPoint()
{
    // We can use empty curly braces to value-initialize all members
    return {};
}
```


## 包含程序自定义类型成员的结构体

在C++中，结构体(和类)的成员可以是其他程序定义的类型。有两种方法可以做到这一点。

首先，可以定义一个程序定义类型（在全局作用域），然后将其作为另一个程序定义类型的成员：

```cpp
#include <iostream>

struct Employee
{
    int id {};
    int age {};
    double wage {};
};

struct Company
{
    int numberOfEmployees {};
    Employee CEO {}; // Employee is a struct within the Company struct
};

int main()
{
    Company myCompany{ 7, { 1, 32, 55000.0 } }; // Nested initialization list to initialize Employee
    std::cout << myCompany.CEO.wage; // print the CEO's wage
}
```

在上面的例子中，我们首先定义了一个 `Employee` 结构体，然后将其作为另一个 `Company` 结构体的成员。 当 `Company` 初始化时，也可以通过嵌套的[[initializer-list|初始化值列表]]初始化`Employee`。如果我们想知道某个CEO的薪水是多少，则需要使用两次[[member-selection-operator|成员选择运算符]]：`myCompany.CEO.wage;`

其次，类型也可以被嵌套定义在其他类型中，搜易如果 `Employee` 只会作为 `Company` 的成员使用，则可以将其定义在 `Company` 结构体中：

```cpp
#include <iostream>

struct Company
{
    struct Employee // accessed via Company::Employee
    {
        int id{};
        int age{};
        double wage{};
    };

    int numberOfEmployees{};
    Employee CEO{}; // Employee is a struct within the Company struct
};

int main()
{
    Company myCompany{ 7, { 1, 32, 55000.0 } }; // Nested initialization list to initialize Employee
    std::cout << myCompany.CEO.wage; // print the CEO's wage
}
```

这种形式通常会在类中使用，我们会在后面的课程中进行介绍[[15-3-nested-types-in-classes|15.3 - 类中的嵌套类型]]。

## 结构体大小和数据结构对齐

通常我们会认为结构体的大小就是其所有成员大小的总和，但实际上并不一定！

考虑下面的代码：

```cpp
#include <iostream>

struct Foo
{
    short a {};
    int b {};
    double c {};
};

int main()
{
    std::cout << "The size of Foo is " << sizeof(Foo) << '\n';

    return 0;
}
```

在很多平台上，short 是 2 字节、int 是 4 字节而 double 是 8 字节，所以我们会认为 `sizeof(Foo)` 的长度为 2 + 4 + 8 = 14 字节。但是，在笔者的机器上打印结果为。

```
The size of Foo is 16
```

实际上，我们计算的结果，只是结构体最小的大小，即结构体的大小的最小值为其所有成员的大小的总和。但是它也可以占据更多空间。处于性能优化的考虑，编译器有时会在结构体中添加一些“间隙”（称为[[struct-padding|结构体填充]]）

在上面的例子中，`Foo` 结构体会被编译器插入一个2字节的不可见的填充（位于成员a之后），使得结构体的大小从14变为16。

> [!info] "扩展阅读"
> 编译器之所以对结构体进行填充的原因，超出了本教程的范围，如果您有兴趣可以阅读维基百科上关于[数据结构对齐](https://en.wikipedia.org/wiki/Data_structure_alignment)的内容。该知识点属于扩展阅读内容，它并不是掌握结构体或C++必备的知识！

这实际上会对结构的大小产生相当大的影响，如下面的程序所示：

```cpp
#include <iostream>

struct Foo1
{
    short a{};
    short qq{}; // note: qq is defined here
    int b{};
    double c{};
};

struct Foo2
{
    short a{};
    int b{};
    double c{};
    short qq{}; // note: qq is defined here
};

int main()
{
    std::cout << "The size of Foo1 is " << sizeof(Foo1) << '\n';
    std::cout << "The size of Foo2 is " << sizeof(Foo2) << '\n';

    return 0;
}
```

注意，尽管 `Foo1` 和 `Foo2` 具有相同的成员，但是其中成员`qq`声明的位置是不同的，程序打印：

```
The size of Foo1 is 16
The size of Foo2 is 24
```

## 结构体是重要的程序组成部分

虽然结构本身很有用，但类(类是C++和面向对象编程的核心)直接构建在我们这里介绍的概念之上。在很好地理解结构体(特别是数据成员、成员选择和默认成员初始化)之后，学习类也会变得更加容易。
