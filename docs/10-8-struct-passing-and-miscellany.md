---
title: 10.8 - 结构体传递及其他
alias: 10.8 - 结构体传递及其他
origin: /default-member-initialization/
origin_title: "10.8 — Struct passing and miscellany"
time: 2022-8-25
type: translation
tags:
- struct
---

??? note "关键点速记"
	
Consider an employee represented by 3 loose variables:

```cpp
int main()
{
    int id { 1 };
    int age { 24 };
    double wage { 52400.0 };

    return 0;
}
```

COPY

If we want to pass this employee to a function, we have to pass three variables:

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

COPY

While passing 3 variables isn’t that bad, consider a struct with 10 or 12 members. Passing each variable independently would be time consuming and error prone. Additionally, if we ever add a new attribute to our employee (e.g. name), we now have to modify all the functions declarations, definitions, and function calls to accept the new parameter and argument!

Passing structs (by reference)

A big advantage of using structs over individual variables is that we can pass the entire struct to a function that needs to work with the members. Structs are generally passed by (const) reference to avoid making copies.

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

COPY

In the above example, we pass an entire `Employee` to `printEmployee()` (twice, once for `joe` and once for `frank`).

The above program outputs:

ID:   14
Age:  32
Wage: 24.15

ID:   15
Age:  28
Wage: 18.27

Because we are passing the entire struct object (rather than individual members), we only need one parameter no matter how many members the struct object has. And, in the future, if we ever decide to add new members to our `Employee` struct, we will not have to change the function declaration or function call! The new member will automatically be included.

Returning structs

Consider the case where we have a function that needs to return a point in 3-dimensional Cartesian space. Such a point has 3 attributes: an x-coordinate, a y-coordinate, and a z-coordinate. But functions can only return one value. So how do we return all 3 coordinates back the user?

One common way is to return a struct:

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

COPY

This prints:

The point is zero

Structs are usually returned by value, so as not to return a dangling reference.

Returning unnamed structs

In the `getZeroPoint()` function above, we create a new named object (`temp`) just so we could return it:

```cpp
Point3d getZeroPoint()
{
    // We can create a variable and return the variable (we'll improve this below)
    Point3d temp { 0.0, 0.0, 0.0 };
    return temp;
}
```

COPY

The name of the object (`temp`) doesn’t really provide any documentation value here.

We can make our function slightly better by returning a temporary (unnamed) object instead:

```cpp
Point3d getZeroPoint()
{
    return Point3d { 0.0, 0.0, 0.0 }; // return an unnamed Point3d
}
```

COPY

In this case, a temporary Point3d is constructed, copied back to the caller, and then destroyed at the end of the expression. Note how much cleaner this is (one line vs two, and no need to understand whether `temp` is used more than once).

In the case where the function has an explicit return type (e.g. `Point3d`) instead of using type deduction (an `auto` return type), we can even omit the type in the return statement:

```cpp
Point3d getZeroPoint()
{
    // We already specified the type at the function declaration
    // so we don't need to do so here again
    return { 0.0, 0.0, 0.0 }; // return an unnamed Point3d
}
```

COPY

Also note that since in this case we’re returning all zero values, we can use empty braces to return a value-initialized Point3d:

```cpp
Point3d getZeroPoint()
{
    // We can use empty curly braces to value-initialize all members
    return {};
}
```

COPY

Structs with program-defined members

In C++, structs (and classes) can have members that are other program-defined types. There are two ways to do this.

First, we can define one program-defined type (in the global scope) and then use it as a member of another program-defined type:

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

COPY

In the above case, we’ve defined an `Employee` struct, and then used that as a member in a `Company` struct. When we initialize our `Company`, we can also initialize our `Employee` by using a nested initialization list. And if we want to know what the CEO’s salary was, we simply use the member selection operator twice: `myCompany.CEO.wage;`

Second, types can also be nested inside other types, so if an Employee only existed as part of a Company, the Employee type could be nested inside the Company struct:

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

COPY

This is more often done with classes, so we’ll talk more about this in a future lesson ([13.17 -- Nested types in classes](https://www.learncpp.com/cpp-tutorial/nested-types-in-classes/)).

Struct size and data structure alignment

Typically, the size of a struct is the sum of the size of all its members, but not always!

Consider the following struct:

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

COPY

On many platforms, a short is 2 bytes, an int is 4 bytes, and a double is 8 bytes, so we’d expect `sizeof(Foo)` to be 2 + 4 + 8 = 14 bytes. However, on the author’s machine, this prints:

The size of Foo is 16

It turns out, we can only say that the size of a struct will be _at least_ as large as the size of all the variables it contains. But it could be larger! For performance reasons, the compiler will sometimes add gaps into structures (this is called padding).

In the `Foo` struct above, the compiler is invisibly adding 2 bytes of padding after member `a`, making the size of the structure 16 bytes instead of 14.

For advanced readers

The reason compilers may add padding is beyond the scope of this tutorial, but readers who want to learn more can read about [data structure alignment](https://en.wikipedia.org/wiki/Data_structure_alignment) on Wikipedia. This is optional reading and not required to understand structures or C++!

This can actually have a pretty significant impact on the size of the struct, as the following program will demonstrate:

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

COPY

Note that `Foo1` and `Foo2` have the same members, the only difference being where in the declaration order member `qq` is declared. This program prints:

The size of Foo1 is 16
The size of Foo2 is 24

Structs are an important building block

While structs are useful in and of themselves, classes (which are the heart of C++ and object oriented programming) build directly on top of the concepts we’ve introduced here. Having a good understanding of structs (especially data members, member selection, and default member initialization) will make your transition to classes that much easier.