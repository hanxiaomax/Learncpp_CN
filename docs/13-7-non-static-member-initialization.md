---
title: 13.7 - 非静态成员初始化列表
alias: 13.7 - 非静态成员初始化列表
origin: /non-static-member-initialization/
origin_title: "13.7 — Non-static member initialization"
time: 2022-9-16
type: translation
tags:
- static member
- initialization
---

When writing a class that has multiple constructors (which is most of them), having to specify default values for all members in each constructor results in redundant code. If you update the default value for a member, you need to touch each constructor.

It’s possible to give normal class member variables (those that don’t use the static keyword) a default initialization value directly:

```cpp
#include <iostream>

class Rectangle
{
private:
    double m_length{ 1.0 }; // m_length has a default value of 1.0
    double m_width{ 1.0 }; // m_width has a default value of 1.0

public:
    void print()
    {
        std::cout << "length: " << m_length << ", width: " << m_width << '\n';
    }
};

int main()
{
    Rectangle x{}; // x.m_length = 1.0, x.m_width = 1.0
    x.print();

    return 0;
}
```

COPY

This program produces the result:

length: 1.0, width: 1.0

Non-static member initialization (also called in-class member initializers) provides default values for your member variables that your constructors will use if the constructors do not provide initialization values for the members themselves (via the member initialization list).

However, note that constructors still determine what kind of objects may be created. Consider the following case:

```cpp
#include <iostream>

class Rectangle
{
private:
    double m_length{ 1.0 };
    double m_width{ 1.0 };

public:

    // note: No default constructor provided in this example

    Rectangle(double length, double width)
        : m_length{ length },
          m_width{ width }
    {
        // m_length and m_width are initialized by the constructor (the default values aren't used)
    }

    void print()
    {
        std::cout << "length: " << m_length << ", width: " << m_width << '\n';
    }

};

int main()
{
    Rectangle x{}; // will not compile, no default constructor exists, even though members have default initialization values

    return 0;
}
```

COPY

Even though we’ve provided default values for all members, no default constructor has been provided, so we are unable to create Rectangle objects with no arguments.

If a default initialization value is provided and the constructor initializes the member via the member initializer list, the member initializer list will take precedence. The following example shows this:

```cpp
#include <iostream>

class Rectangle
{
private:
    double m_length{ 1.0 };
    double m_width{ 1.0 };

public:

    Rectangle(double length, double width)
        : m_length{ length },
          m_width{ width }
    {
        // m_length and m_width are initialized by the constructor (the default values aren't used)
    }

    Rectangle(double length)
        : m_length{ length }
    {
        // m_length is initialized by the constructor.
        // m_width's default value (1.0) is used.
    }

    void print()
    {
        std::cout << "length: " << m_length << ", width: " << m_width << '\n';
    }

};

int main()
{
    Rectangle x{ 2.0, 3.0 };
    x.print();

    Rectangle y{ 4.0 };
    y.print();

    return 0;
}
```

COPY

This prints:

length: 2.0, width: 3.0
length: 4.0, width: 1.0

Note that initializing members using non-static member initialization requires using either an equals sign, or a brace (uniform) initializer -- the parenthesis initialization form doesn’t work here:

```cpp
class A
{
    int m_a = 1;  // ok (copy initialization)
    int m_b{ 2 }; // ok (brace initialization)
    int m_c(3);   // doesn't work (parenthesis initialization)
};
```

COPY

Rule

Favor use of non-static member initialization to give default values for your member variables.