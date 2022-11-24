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

??? note "关键点速记"
	


在编程中我们经常需要使用多个变量来表示更复杂的对象，正如在之前章节中([[9-1-Introduction-to-compound-data-types|9.1 - 复合数据类型]])介绍的那样，分数是由两个具有关联的数学对象——分子分母组成的。

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

幸运的是，C++ 提供了两个comes with two compound types designed to solve such challenges: structs (which we’ll introduce now) and classes (which we’ll explore soon). A struct (short for structure) is a program-defined data type ([[10-1-Introduction-to-program-defined-user-defined-types|10.1 - 自定义类型简介]]) that allows us to bundle multiple variables together into a single type. As you’ll see shortly, this makes management of related sets of variables much simpler!

## Defining structs

Because structs are a program-defined type, we first have to tell the compiler what our struct type looks like before we can begin using it. Here is an example of a struct definition for a simplified employee:

```cpp
struct Employee
{
    int id {};
    int age {};
    double wage {};
};
```

COPY

The `struct` keyword is used to tell the compiler that we’re defining a struct, which we’ve named `Employee` (since program-defined types are typically given names starting with a capital letter).

Then, inside a pair of curly braces, we define the variables that each Employee object will contain. In this example, each `Employee` we create will have 3 variables: an `int id`, an `int age`, and a `double wage`. The variables that are part of the struct are called data members (or member variables).

!!! tip "小贴士"

	We’ll use the term `member` a lot in future lessons, so make sure you remember what it means.

Just like we use an empty set of curly braces to value initialize ([[1-4-Variable-assignment-and-initialization|1.4 - 变量赋值和初始化]]) normal variables, the empty curly braces here ensure that the variables inside our `Employee` are value initialized when an `Employee` is created. We’ll talk more about this when we cover default member initialization in a few lessons ([10.7 -- Default member initialization](https://www.learncpp.com/cpp-tutorial/default-member-initialization/)).

Finally, we end the type definition with a semicolon.

As a reminder, `Employee` is just a type definition -- no objects are actually created at this point.

Defining struct objects

In order to use the `Employee` type, we simply define a variable of type `Employee`:

```cpp
Employee joe; // Employee is the type, joe is the variable name
```

COPY

This defines a variable of type `Employee` named `joe`. When `joe` is defined, an Employee object is created, and the 3 data members within are created in sequential order (and then value initialized).

Just like any other type, it is possible to define multiple variables of the same struct type:

```cpp
Employee joe; // create an Employee struct for Joe
Employee frank; // create an Employee struct for Frank
```

COPY

## 访问成员

Consider the following example:

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

COPY

In the above example, the name `joe` refers to the entire struct object (which contains the member variables). To access a specific member variable, we use the member selection operator (`operator.`) in between the struct variable name and the member name. For example, to access Joe’s age member, we’d use `joe.age`.

Struct member variables work just like normal variables, so it is possible to do normal operations on them, including assignment, arithmetic, comparison, etc…

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

COPY

This prints:

```
32
```

One of the biggest advantages of structs is that we only need to create one new name per struct variable (the member names are fixed as part of the struct type definition). In the following example, we instantiate two `Employee` objects: `joe` and `frank`.

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

In the above example, it is very easy to tell which member variables belong to Joe and which belong to Frank. This provides a much higher level of organization than individual variables would. Furthermore, because Joe’s and Frank’s members have the same names, this provides consistency when you have multiple variables of the same struct type.

We’ll continue our exploration of structs in the next lesson, including a look at how to initialize them.