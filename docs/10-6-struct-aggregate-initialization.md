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
---

??? note "关键点速记"
	

In the previous lesson ([10.5 -- Introduction to structs, members, and member selection](https://www.learncpp.com/cpp-tutorial/introduction-to-structs-members-and-member-selection/)), we talked about how to define structs, instantiate struct objects, and access their members. In this lesson, we’ll discuss how structs are intialized.

Data members are not initialized by default

Much like normal variables, data members are not initialized by default. Consider the following struct:

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

COPY

Because we have not provided any initializers, when `joe` is instantiated, `joe.id`, `joe.age`, and `joe.wage` will all be uninitialized. We will then get undefined behavior when we try to print the value of `joe.id`.

However, before we show you how to initialize a struct, let’s take a short detour.

What is an aggregate?

In general programming, an aggregate data type (also called an aggregate) is any type that can contain multiple data members. Some types of aggregates allow members to have different types (e.g. structs), while others require that all members must be of a single type (e.g. arrays).

In C++, the definition of an aggregate is narrower and quite a bit more complicated.

For advanced readers

To be an aggregate in C++, a type must meet the following criteria:

-   Is a class type (a struct, class, or union), or an array type (a built-in array or `std::array`).
-   Has no private or protected non-static data members.
-   Has no user-declared or inherited constructors.
-   Has no base classes.
-   Has no virtual member functions.

Putting the precise definition of a C++ aggregate aside, the important thing to understand at this point is that structs with only data members (which are the only kind of structs we’ll create in these lessons) are aggregates. Arrays (which we’ll cover next chapter) are also aggregates.

## Aggregate initialization of a struct

Because a normal variable can only hold a single value, we only need to provide a single initializer:

```cpp
int x { 5 };
```

COPY

However, a struct can have multiple members:

```cpp
struct Employee
{
    int id {};
    int age {};
    double wage {};
};
```

COPY

When we define an object with a struct type, we need some way to initialize multiple members at initialization time:

```cpp
Employee joe; // how do we initialize joe.id, joe.age, and joe.wage?
```

COPY

Aggregates use a form of initialization called aggregate initialization, which allows us to directly initialize the members of aggregates. To do this, we provide an initializer list as an initializer, which is just a list of comma-separated initialization values.

Much like normal variables can be copy initialized, direct initialized, or list initialized, there are 3 forms of aggregate initialization:

```cpp
struct Employee
{
    int id {};
    int age {};
    double wage {};
};

int main()
{
    Employee frank = { 1, 32, 60000.0 }; // copy-list initialization using braced list
    Employee robert ( 3, 45, 62500.0 );  // direct initialization using parenthesized list (C++20)
    Employee joe { 2, 28, 45000.0 };     // list initialization using braced list (preferred)

    return 0;
}
```

COPY

Each of these initialization forms does a memberwise initialization, which means each member in the struct is initialized in the order of declaration. Thus, `Employee joe { 2, 28, 45000.0 };` first initializes `joe.id` with value `2`, then `joe.age` with value `28`, and `joe.wage` with value `45000.0` last.

Best practice

Prefer the (non-copy) braced list form when initializing aggregates.

Missing initializers in an initializer list

If an aggregate is initialized but the number of initialization values is fewer than the number of members, then all remaining members will be value-initialized.

```cpp
struct Employee
{
    int id {};
    int age {};
    double wage {};
};

int main()
{
    Employee joe { 2, 28 }; // joe.wage will be value-initialized to 0.0

    return 0;
}
```

COPY

In the above example, `joe.id` will be initialized with value `2`, `joe.age` will be initialized with value `28`, and because `joe.wage` wasn’t given an explicit initializer, it will be value-initialized to `0.0`.

This means we can use an empty initialization list to value-initialize all members of the struct:

```cpp
Employee joe {}; // value-initialize all members
```

COPY

Const structs

Variables of a struct type can be const, and just like all const variables, they must be initialized.

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

COPY

Designated initializers C++20

When initializing a struct from a list of values, the initializers are applied to the members in order of declaration.

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

COPY

Now consider what would happen if you were to add a new member to your struct that is not the last member:

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

COPY

Now all your initialization values have shifted, and worse, the compiler may not detect this as an error (after all, the syntax is still valid).

To help avoid this, C++20 adds a new way to initialize struct members called designated initializers. Designated initializers allow you to explicitly define which initialization values map to which members. The members must be initialized in the same order in which they are declared in the struct, otherwise an error will result. Members not designated an initializer will be value initialized.

```cpp
struct Foo
{
    int a{ };
    int b{ };
    int c{ };
};

int main()
{
    Foo f1{ .a{ 1 }, .c{ 3 } }; // ok: f.a = 1, f.b = 0 (value initialized), f.c = 3
    Foo f2{ .b{ 2 }, .a{ 1 } }; // error: initialization order does not match order of declaration in struct

    return 0;
}
```

COPY

Designated initializers are nice because they provide some level of self-documentation and help ensure you don’t inadvertently mix up the order of your initialization values. However, designated initializers also clutter up the initializer list significantly, so we won’t recommend their use as a best practice at this time.

Also, because there’s no enforcement that designated initializers are being used consistently everywhere an aggregate is initialized, it’s a good idea to avoid adding new members to the middle of an existing aggregate definition, to avoid the risk of initializer shifting.

Best practice

When adding a new member to an aggregate, it’s safest to add it to the bottom of the definition list so the initializers for other members don’t shift.

Assignment with an initializer list

As shown in the prior lesson, we can assign values to members of structs individually:

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

COPY

This is fine for single members, but not great when we want to update many members. Similar to initializing a struct with an initializer list, you can also assign values to structs using an initializer list (which does memberwise assignment):

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

COPY

Note that because we didn’t want to change `joe.id`, we needed to provide the current value for `joe.id` in our list as a placeholder, so that memberwise assignment could assign `joe.id` to `joe.id`. This is a bit ugly.

Assignment with designated initializers C++20

Designated initializers can also be used in a list assignment:

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

COPY

Any members that aren’t designated in such an assignment will be assigned the value that would be used for value initialization. If we hadn’t have specified a designated initializer for `joe.id`, `joe.id` would have been assigned the value 0.