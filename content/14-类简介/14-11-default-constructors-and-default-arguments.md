---
title: 14-11-default-constructors-and-default-arguments
aliases: 14-11-default-constructors-and-default-arguments
origin: 
origin_title: 14-11-default-constructors-and-default-arguments
time: 2025-04-01 
type: translation-under-construction
tags:
---
# 14.11 — Default constructors and default arguments

[*Alex*](https://www.learncpp.com/author/Alex/ "View all posts by Alex")

September 11, 2023, 12:21 pm PDT
September 16, 2024

A **default constructor** is a constructor that accepts no arguments. Typically, this is a constructor that has been defined with no parameters.

Here is an example of a class that has a default constructor:

```cpp
#include <iostream>

class Foo
{
public:
    Foo() // default constructor
    {
        std::cout << "Foo default constructed\n";
    }
};

int main()
{
    Foo foo{}; // No initialization values, calls Foo's default constructor

    return 0;
}
```

When the above program runs, an object of type `Foo` is created. Since no initialization values have been provided, the default constructor `Foo()` is called, which prints:

```cpp
Foo default constructed

```

Value initialization vs default initialization for class types

If a class type has a default constructor, both value initialization and default initialization will call the default constructor. Thus, for such a class such as the `Foo` class in the example above, the following are essentially equivalent:

```cpp
    Foo foo{}; // value initialization, calls Foo() default constructor
    Foo foo2;  // default initialization, calls Foo() default constructor
```

However, as we already covered in lesson [13.9 -- Default member initialization](https://www.learncpp.com/cpp-tutorial/default-member-initialization/), value initialization is safer for aggregates. Since it’s difficult to tell whether a class type is an aggregate or non-aggregate, it’s safer to just use value initialization for everything and not worry about it.

Best practice

Prefer value initialization over default initialization for all class types.

Constructors with default arguments

As with all functions, the rightmost parameters of constructors can have default arguments.

Related content

We cover default arguments in lesson [11.5 -- Default arguments](https://www.learncpp.com/cpp-tutorial/default-arguments/).

For example:

```cpp
#include <iostream>

class Foo
{
private:
    int m_x { };
    int m_y { };

public:
    Foo(int x=0, int y=0) // has default arguments
        : m_x { x }
        , m_y { y }
    {
        std::cout << "Foo(" << m_x << ", " << m_y << ") constructed\n";
    }
};

int main()
{
    Foo foo1{};     // calls Foo(int, int) constructor using default arguments
    Foo foo2{6, 7}; // calls Foo(int, int) constructor

    return 0;
}
```

This prints:

```cpp
Foo(0, 0) constructed
Foo(6, 7) constructed

```

If all of the parameters in a constructor have default arguments, the constructor is a default constructor (because it can be called with no arguments).

We’ll see examples of where this can be useful in the next lesson ([14.12 -- Delegating constructors](https://www.learncpp.com/cpp-tutorial/delegating-constructors/)).

Overloaded constructors

Because constructors are functions, they can be overloaded. That is, we can have multiple constructors so that we can construct objects in different ways:

```cpp
#include <iostream>

class Foo
{
private:
    int m_x {};
    int m_y {};

public:
    Foo() // default constructor
    {
        std::cout << "Foo constructed\n";
    }

    Foo(int x, int y) // non-default constructor
        : m_x { x }, m_y { y }
    {
        std::cout << "Foo(" << m_x << ", " << m_y << ") constructed\n";
    }
};

int main()
{
    Foo foo1{};     // Calls Foo() constructor
    Foo foo2{6, 7}; // Calls Foo(int, int) constructor

    return 0;
}
```

A corollary of the above is that a class should only have one default constructor. If more than one default constructor is provided, the compiler will be unable to disambiguate which should be used:

```cpp
#include <iostream>

class Foo
{
private:
    int m_x {};
    int m_y {};

public:
    Foo() // default constructor
    {
        std::cout << "Foo constructed\n";
    }

    Foo(int x=1, int y=2) // default constructor
        : m_x { x }, m_y { y }
    {
        std::cout << "Foo(" << m_x << ", " << m_y << ") constructed\n";
    }
};

int main()
{
    Foo foo{}; // compile error: ambiguous constructor function call

    return 0;
}
```

In the above example, we instantiate `foo` with no arguments, so the compiler will look for a default constructor. It will find two, and be unable to disambiguate which constructor should be used. This will result in a compile error.

An implicit default constructor

If a non-aggregate class type object has no user-declared constructors, the compiler will generate a public default constructor (so that the class can be value or default initialized). This constructor is called an **implicit default constructor**.

Consider the following example:

```cpp
#include <iostream>

class Foo
{
private:
    int m_x{};
    int m_y{};

    // Note: no constructors declared
};

int main()
{
    Foo foo{};

    return 0;
}
```

This class has no user-declared constructors, so the compiler will generate an implicit default constructor for us. That constructor will be used to instantiate `foo{}`.

The implicit default constructor is equivalent to a constructor that has no parameters, no member initializer list, and no statements in the body of the constructor. In other words, for the above `Foo` class, the compiler generates this:

```cpp
public:
    Foo() // implicitly generated default constructor
    {
    }
```

The implicit default constructor is useful mostly when we have classes that have no data members. If a class has data members, we’ll probably want to make them initializable with values provided by the user, and the implicit default constructor isn’t sufficient for that.

Using `= default` to generate an explicitly defaulted default constructor

In cases where we would write a default constructor that is equivalent to the implicitly generated default constructor, we can instead tell the compiler to generate a default constructor for us. This constructor is called an **explicitly defaulted default constructor**, and it can be generated by using the `= default` syntax:

```cpp
#include <iostream>

class Foo
{
private:
    int m_x {};
    int m_y {};

public:
    Foo() = default; // generates an explicitly defaulted default constructor

    Foo(int x, int y)
        : m_x { x }, m_y { y }
    {
        std::cout << "Foo(" << m_x << ", " << m_y << ") constructed\n";
    }
};

int main()
{
    Foo foo{}; // calls Foo() default constructor

    return 0;
}
```

In the above example, since we have a user-declared constructor (`Foo(int, int)`), an implicit default constructor would not normally be generated. However, because we’ve told the compiler to generate such a constructor, it will. This constructor will subsequently be used by our instantiation of `foo{}`.

Best practice

Prefer an explicitly defaulted default constructor (`= default`) over a default constructor with an empty body.

Explicitly defaulted default constructor vs empty user-defined constructor

There are at least two cases where the explicitly defaulted default constructor behaves differently than an empty user-defined constructor.

1. When value initializing a class, if the class has a user-defined default constructor, the object will be default initialized. However, if the class has a default constructor that is not user-provided (that is, a default constructor that is either implicitly defined, or defined using `= default`), the object will be zero-initialized before being default initialized.

```cpp
#include <iostream>

class User
{
private:
    int m_a; // note: no default initialization value
    int m_b {};

public:
    User() {} // user-defined empty constructor

    int a() const { return m_a; }
    int b() const { return m_b; }
};

class Default
{
private:
    int m_a; // note: no default initialization value
    int m_b {};

public:
    Default() = default; // explicitly defaulted default constructor

    int a() const { return m_a; }
    int b() const { return m_b; }
};

class Implicit
{
private:
    int m_a; // note: no default initialization value
    int m_b {};

public:
    // implicit default constructor

    int a() const { return m_a; }
    int b() const { return m_b; }
};

int main()
{
    User user{}; // default initialized
    std::cout << user.a() << ' ' << user.b() << '\n';

    Default def{}; // zero initialized, then default initialized
    std::cout << def.a() << ' ' << def.b() << '\n';

    Implicit imp{}; // zero initialized, then default initialized
    std::cout << imp.a() << ' ' << imp.b() << '\n';

    return 0;
}
```

On the author’s machine, this prints:

```cpp
782510864 0
0 0
0 0

```

Note that `user.a` was not zero initialized before being default initialized, and thus was left uninitialized.

In practice, this shouldn’t matter since you should be providing default member initializers for all data members!

Tip

For a class that does not have a user-provided default constructor, value initialization will first zero-initialize the class, while default initialization will not. Given this, default initialization may be more performant than value initialization (at the cost of being less safe). If you are looking to squeeze out every bit of performance in a section of code that initializes a lot of objects that do not have user-provided default constructors, changing those objects to be default initialized may be worth exploring. Alternatively, you could try changing the class to have a default constructor with an empty body. This avoids the zero-initialization case when using value initialization, but may inhibit other optimizations.

2. Prior to C++20, a class with a user-defined default constructor (even if it has an empty body) makes the class a non-aggregate, whereas an explicitly defaulted default constructor does not. Assuming the class was otherwise an aggregate, the former would cause the class to use list initialization instead of aggregate initialization. In C++20 onward, this inconsistency was addressed, so that both make the class a non-aggregate.

Only create a default constructor when it makes sense

A default constructor allows us to create objects of a non-aggregate class type with no user-provided initialization values. Thus, a class should only provide a default constructor when it makes sense for objects of a class type to be created using all default values.

For example:

```cpp
#include <iostream>

class Fraction
{
private:
    int m_numerator{ 0 };
    int m_denominator{ 1 };

public:
    Fraction() = default;
    Fraction(int numerator, int denominator)
        : m_numerator{ numerator }
        , m_denominator{ denominator }
    {
    }

    void print() const
    {
        std::cout << "Fraction(" << m_numerator << ", " << m_denominator << ")\n";
    }
};

int main()
{
    Fraction f1 {3, 5};
    f1.print();

    Fraction f2 {}; // will get Fraction 0/1
    f2.print();

    return 0;
}
```

For a class representing a fraction, it makes sense to allow the user to create Fraction objects with no initializers (in which case, the user will get the fraction 0/1).

Now consider this class:

```cpp
#include <iostream>
#include <string>
#include <string_view>

class Employee
{
private:
    std::string m_name{ };
    int m_id{ };

public:
    Employee(std::string_view name, int id)
        : m_name{ name }
        , m_id{ id }
    {
    }

    void print() const
    {
        std::cout << "Employee(" << m_name << ", " << m_id << ")\n";
    }
};

int main()
{
    Employee e1 { "Joe", 1 };
    e1.print();

    Employee e2 {}; // compile error: no matching constructor
    e2.print();

    return 0;
}
```

For a class representing an employee, it doesn’t make sense to allow creation of employees with no name. Thus, such a class should not have a default constructor, so that a compilation error will result if the user of the class tries to do so.

\[Next lesson

14.12Delegating constructors\](https://www.learncpp.com/cpp-tutorial/delegating-constructors/)
[Back to table of contents](/)
\[Previous lesson

14.10Constructor member initializer lists\](https://www.learncpp.com/cpp-tutorial/constructor-member-initializer-lists/)

*Previous Post*[14.8 — The benefits of data hiding (encapsulation)](https://www.learncpp.com/cpp-tutorial/the-benefits-of-data-hiding-encapsulation/)

*Next Post*[15.5 — Class templates with member functions](https://www.learncpp.com/cpp-tutorial/class-templates-with-member-functions/)

\[wpDiscuz\](javascript:void(0);)

Insert

You are going to send email to

Send

Move Comment

Move
