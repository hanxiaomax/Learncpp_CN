---
title: 10.5 - 结构体、成员和成员选择
alias: 10.5 - 结构体、成员和成员选择
origin: /none/
origin_title: "none"
time: 2022-1-2
type: translation
tags:
- struct
- members
- member selection
---

> [!note] "Key Takeaway"


在编程中我们经常需要使用多个变量来表示更复杂的对象，正如在之前章节中([[12-1-Introduction-to-compound-data-types|9.1 - 复合数据类型]])介绍的那样，分数是由两个具有关联的数学对象——分子分母组成的。

或者，假设我们想要编写一个程序，其中需要存储关于公司员工的信息。为此我们需要追踪诸如员工姓名、头衔、年龄、员工id、经理id、工资、生日、雇佣日期等属性。

```cpp
std::string name;
std::string title;
int age;
int id;
int managerId;
double wage;
int birthdayYear;
int birthdayMonth;
int birthdayDay;
int hireYear;
int hireMonth;
int hireDay;
```

然而，这种方式存在许多问题。首先，我们不清楚这些变量是否真的相关(你必须阅读注释，或者查看它们在上下文中是如何使用的)。其次，现在有12个变量需要管理。如果我们想要将这个雇员传递给一个函数，我们必须传递12个参数(并且顺序正确)，这将使我们的函数原型和函数调用变得混乱。既然函数只能返回一个值，那么函数如何返回一个雇员呢?

如果我们想要一个以上的员工，我们需要为每个额外的员工定义12个以上的变量(每个变量都需要一个惟一的名称)！这显然是无法扩展的。我们真正需要的是某种方法来组织所有这些相关的数据块，使它们更容易管理。

幸运的是，C++ 提供了两个符合类型用于解决上述问题：结构体和类。结构体是一种程序定义类型([[13-1-Introduction-to-program-defined-user-defined-types|10.1 - 程序定义类型简介]]) ，使用结构体我们可以把多个变量聚合成一个单独的类型。稍后你将会看到，这使得管理多个相关联变量变得非常简单！

## 定义结构体

因为结构是程序定义的类型，所以在开始使用结构类型之前，我们必须先告诉编译器结构类型是什么样子的。下面是一个简化员工的结构定义示例：

```cpp
struct Employee
{
    int id {};
    int age {};
    double wage {};
};
```

`struct` 关键字用于告诉编译器此处要定义一个结构体——名为 `Employee` （因为程序定义类型的命名通常以大写字母开头）。

随后，在大括号中，定义了 `Employee` 所需要的各个变量。在这个例子中，每个 `Employee` 创建了3个变量：`int id`、`int age` 和 `double wage`。这些变量是结构体的一部分，称为数据成员（或者[[member-variable|成员变量]]）。

> [!tip] "小贴士"
> 在以后的课程中，我们会经常用到“成员”这个词，所以一定要记住它的意思。

正如可以使用空的大括号对一般变量进行[[initialization|初始化]]一样 ([[1-4-Variable-assignment-and-initialization|1.4 - 变量赋值和初始化]]) ，空的大括号也可以用于在创建 `Employee` 时对其成员变量进行初始化。 我们会在后续的课程中介绍[[default-member-initializer|默认成员初始化]]([[13-9-default-member-initialization|10.7 - 默认成员初始化]])。

最后，在定义结束处添加分号。

提醒一下，这里的 `Employee` 只是一个类型定义——并没有实际创建任何对象。

## 定义结构体对象

为了使用 `Employee` 类型，定义一个 `Employee` 类型的变量即可：

```cpp
Employee joe; // Employee is the type, joe is the variable name
```

此处定义了一个名为 `joe` 的 `Employee` 类型变量。定义 `joe` 时，将创建一个 `Employee` 对象，并按顺序创建其中的3个数据成员(然后初始化值)。

就像任何其他类型一样，可以定义多个此类型变量:

```cpp
Employee joe; // create an Employee struct for Joe
Employee frank; // create an Employee struct for Frank
```

## 访问成员

考虑下面这个例子：

```cpp
struct Employee
{
    int id {};
    int age {};
    double wage {};
};

int main()
{
    Employee joe;

    return 0;
}
```

在上面的例子中，`joe` 指的是整个结构体对象(其中包含成员变量)。要访问特定的成员变量，需要在结构变量名和成员名之间使用[[member-selection-operator|成员选择运算符]]。例如，要访问`joe`的年龄成员，需要写作 `joe.age`。

结构体成员变量就像普通变量一样工作，因此可以对它们进行一般的操作，包括赋值、运算、比较等……

```cpp
#include <iostream>

struct Employee
{
    int id {};
    int age {};
    double wage {};
};

int main()
{
    Employee joe;

    joe.age = 32;  // use member selection operator (.) to select the age member of variable joe

    std::cout << joe.age << '\n'; // print joe's age

    return 0;
}
```

打印结果：

```
32
```

使用结构体的最大有时在于，你只需要为每个结构体创建一个变量(成员名是结构体定义中固定的部分)。在下面的例子中，我们实例化了两个  `Employee` 对象：`joe` 和 `frank`。

```cpp
#include <iostream>

struct Employee
{
    int id {};
    int age {};
    double wage {};
};

int main()
{
    Employee joe;
    joe.id = 14;
    joe.age = 32;
    joe.wage = 60000.0;

    Employee frank;
    frank.id = 15;
    frank.age = 28;
    frank.wage = 45000.0;

    int totalAge { joe.age + frank.age };

    if (joe.wage > frank.wage)
        std::cout << "Joe makes more than Frank\n";
    else if (joe.wage < frank.wage)
        std::cout << "Joe makes less than Frank\n";
    else
        std::cout << "Joe and Frank make the same amount\n";

    // Frank got a promotion
    frank.wage += 5000.0;

    // Today is Joe's birthday
    ++joe.age; // use pre-increment to increment Joe's age by 1

    return 0;
}
```

在上面的例子中，很容易判断哪些成员变量属于`Joe`，哪些属于`Frank`。这提供了比单个变量更高层次的组织方法。此外，由于`Joe`的成员和`Frank`的成员具有相同的名称，当你有多个相同结构类型的变量时，这将提供一致性。

我们将在下一课中继续探索结构体，以及如何初始化它们。
