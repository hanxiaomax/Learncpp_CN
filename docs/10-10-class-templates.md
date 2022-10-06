---
title: 10.10 - 类模板
alias: 10.10 - 类模板
origin: /class-templates/
origin_title: "10.10 — Class templates"
time: 2022-8-8
type: translation
tags:
- class template
---

??? note "关键点速记"



In lesson [8.13 -- Function templates](https://www.learncpp.com/cpp-tutorial/function-templates/), we introduced the challenge of having to create a separate (overloaded) function for each different set of types we want to work with:

```cpp
#include <iostream>

// function to calculate the greater of two int values
int max(int x, int y)
{
    return (x > y) ? x : y;
}

// almost identical function to calculate the greater of two double values
// the only difference is the type information
double max(double x, double y)
{
    return (x > y) ? x : y;
}

int main()
{
    std::cout << max(5, 6);     // calls max(int, int)
    std::cout << '\n';
    std::cout << max(1.2, 3.4); // calls max(double, double)

    return 0;
}
```

COPY

The solution to this was to create a function template that the compiler can use to instantiate normal functions for whichever set of types we need:

```cpp
#include <iostream>

// a single function template for max
template <typename T>
T max(T x, T y)
{
    return (x > y) ? x : y;
}

int main()
{
    std::cout << max(5, 6);     // instantiates and calls max<int>(int, int)
    std::cout << '\n';
    std::cout << max(1.2, 3.4); // instantiates and calls max<double>(double, double)

    return 0;
}
```

COPY

Related content

We cover how function template instantiation works in lesson [8.14 -- Function template instantiation](https://www.learncpp.com/cpp-tutorial/function-template-instantiation/).

Aggregate types have similar challenges

We run into similar challenges with aggregate types (both structs/classes/unions and arrays).

For example, let’s say we’re writing a program where we need to work with pairs of `int` values, and need to determine which of the two numbers is larger. We might write a program like this:

```cpp
#include <iostream>

struct Pair
{
    int first{};
    int second{};
};

constexpr int max(Pair p) // pass by value because Pair is small
{
    return (p.first > p.second ? p.first : p.second);
}

int main()
{
    Pair p1{ 5, 6 };
    std::cout << max(p1) << " is larger\n";

    return 0;
}
```

COPY

Later, we discover that we also need pairs of `double` values. So we update our program to the following:

```cpp
#include <iostream>

struct Pair
{
    int first{};
    int second{};
};

struct Pair // compile error: erroneous redefinition of Pair
{
    double first{};
    double second{};
};

constexpr int max(Pair p)
{
    return (p.first > p.second ? p.first : p.second);
}

constexpr double max(Pair p) // compile error: overloaded function differs only by return type
{
    return (p.first > p.second ? p.first : p.second);
}

int main()
{
    Pair p1{ 5, 6 };
    std::cout << max(p1) << " is larger\n";

    Pair p2{ 1.2, 3.4 };
    std::cout << max(p2) << " is larger\n";

    return 0;
}
```

COPY

Unfortunately, this program won’t compile, and has a number of problems that need to be addressed.

First, unlike functions, type definitions can’t be overloaded. The compiler will treat double second definition of `Pair` as an erroneous redeclaration of the first definition of `Pair`. Second, although functions can be overloaded, our `max(Pair)` functions only differ by return type, and overloaded functions can’t be differentiated solely by return type. Third, there is a lot of redundancy here. Each `Pair` struct is identical (except for the data type) and same with our `max(Pair)` functions (except for the return type).

We could solve the first two issues by giving our `Pair` structs different names (e.g. `Pairint` and `Pairdouble`). But then we both have to remember our naming scheme, and essentially clone a bunch of code for each additional pair type we want, which doesn’t solve the redundancy problem.

Fortunately, we can do better.

Author’s note

Before proceeding, please review lessons [8.13 -- Function templates](https://www.learncpp.com/cpp-tutorial/function-templates/) and [8.14 -- Function template instantiation](https://www.learncpp.com/cpp-tutorial/function-template-instantiation/) if you’re hazy on how function templates, template types, or function template instantiation works.

Class templates

Much like a function template is a template definition for instantiating functions, a class template is a template definition for instantiating class types.

A reminder

A “class type” is a struct, class, or union type. Although we’ll be demonstrating “class templates” on structs for simplicity, everything here applies equally well to classes.

As a reminder, here’s our `int` pair struct definition:

```cpp
struct Pair
{
    int first{};
    int second{};
};
```

COPY

Let’s rewrite our pair class as a class template:

```cpp
#include <iostream>

template <typename T>
struct Pair
{
    T first{};
    T second{};
};

int main()
{
    Pair<int> p1{ 5, 6 };        // instantiates Pair<int> and creates object p1
    std::cout << p1.first << ' ' << p1.second << '\n';

    Pair<double> p2{ 1.2, 3.4 }; // instantiates Pair<double> and creates object p2
    std::cout << p2.first << ' ' << p2.second << '\n';

    Pair<double> p3{ 7.8, 9.0 }; // creates object p3 using prior definition for Pair<double>
    std::cout << p3.first << ' ' << p3.second << '\n';

    return 0;
}
```

COPY

Just like with function templates, we start a class template definition with a template parameter declaration. We begin with the `template` keyword. Next, we specify all of the template types that our class template will use inside angled brackets (<>). For each template type that we need, we use the keyword `typename` (preferred) or `class` (not preferred), followed by the name of the template type (e.g. `T`). In this case, since both of our members will be the same type, we only need one template type.

Next, we define our struct like usual, except we can use our template type (`T`) wherever we want a templated type that will be replaced with a real type later. That’s it! We’re done with the class template definition.

Inside main, we can instantiate `Pair` objects using whatever types we desire. First, we instantiate an object of type `Pair<int>`. Because a type definition for `Pair<int>` doesn’t exist yet, the compiler uses the class template to instantiate a struct type definition named `Pair<int>`, where all occurrences of template type `T` are replaced by type `int`.

Next, we instantiate an object of type `Pair<double>`, which instantiates a struct type definition named `Pair<double>` where `T` is replaced by `double`. For `p3`, `Pair<double>` has already been instantiated, so the compiler will use the prior type definition.

Here’s the same example as above, showing what the compiler actually compiles after all template instantiations are done:

```cpp
#include <iostream>

// A declaration for our Pair class template
// (we don't need the definition any more since it's not used)
template <typename T>
struct Pair;

// Explicitly define what Pair<int> looks like
template <> // tells the compiler this is a template type with no template parameters
struct Pair<int>
{
    int first{};
    int second{};
};

// Explicitly define what Pair<double> looks like
template <> // tells the compiler this is a template type with no template parameters
struct Pair<double>
{
    double first{};
    double second{};
};

int main()
{
    Pair<int> p1{ 5, 6 };        // instantiates Pair<int> and creates object p1
    std::cout << p1.first << ' ' << p1.second << '\n';

    Pair<double> p2{ 1.2, 3.4 }; // instantiates Pair<double> and creates object p2
    std::cout << p2.first << ' ' << p2.second << '\n';

    Pair<double> p3{ 7.8, 9.0 }; // creates object p3 using prior definition for Pair<double>
    std::cout << p3.first << ' ' << p3.second << '\n';

    return 0;
}
```

COPY

You can compile this example directly and see that it works as expected!

For advanced readers

The above example makes use of a feature called template class specialization (covered in future lesson [19.4 -- Class template specialization](https://www.learncpp.com/cpp-tutorial/class-template-specialization/)). Knowledge of how this feature works is not required at this point.

Using our class template in a function

Now let’s return to the challenge of making our `max()` function work with different types. Because the compiler treats `Pair<int>` and `Pair<double>`as separate types, we could use overloaded functions that are differentiated by parameter type:

```cpp
constexpr int max(Pair<int> p)
{
    return (p.first > p.second ? p.first : p.second);
}

constexpr double max(Pair<double> p) // okay: overloaded function differentiated by parameter type
{
    return (p.first > p.second ? p.first : p.second);
}
```

COPY

While this compiles, it doesn’t solve the redundancy problem. What we really want is a function that can take a pair of any type. In other words, we want a function that takes a parameter of type `Pair<T>`, where T is a template type parameter. And that means we need a function template for this job!

Here’s a full example, with `max()` being implemented as a function template:

```cpp
#include <iostream>

template <typename T>
struct Pair
{
    T first{};
    T second{};
};

template <typename T>
constexpr T max(Pair<T> p)
{
    return (p.first > p.second ? p.first : p.second);
}

int main()
{
    Pair<int> p1{ 5, 6 };
    std::cout << max<int>(p1) << " is larger\n"; // explicit call to max<int>

    Pair<double> p2{ 1.2, 3.4 };
    std::cout << max(p2) << " is larger\n"; // call to max<double> using template argument deduction (prefer this)

    return 0;
}
```

COPY

The `max()` function template is pretty straightforward. Because we want to pass in a `Pair<T>`, we need the compiler to understand what `T` is. Therefore, we need to start our function with a template parameter declaration that defines template type T. We can then use `T` as both our return type, and as the template type for `Pair<T>`.

When the `max()` function is called with a `Pair<int>` argument, the compiler will instantiate the function `int max<int>(Pair<int>)` from the function template, where template type `T` is replaced with `int`. The following snippet shows what the compiler actually instantiates in such a case:

```cpp
template <>
constexpr int max(Pair<int> p)
{
    return (p.first > p.second ? p.first : p.second);
}
```

COPY

As with all calls to a function template, we can either be explicit about the template type argument (e.g. `max<int>(p1)`) or we can be implicitly (e.g. `max(p2)`) and let the compiler use template argument deduction to determine what the template type argument should be.

Class templates with template type and non-template type members

Class templates can have some members using a template type and other members using a normal (non-template) type. For example:

```cpp
template <typename T>
struct Foo
{
    T first{};    // first will have whatever type T is replaced with
    int second{}; // second will always have type int, regardless of what type T is
};
```

COPY

This works exactly like you’d expect: `first` will be whatever the template type `T` is, and `second` will always be an `int`.

Class templates with multiple template types

Class templates can also have multiple template types. For example, if we wanted the two members of our `Pair` class to be able to have different types, we can define our `Pair` class template with two template types:

```cpp
#include <iostream>

template <typename T, typename U>
struct Pair
{
    T first{};
    U second{};
};

template <typename T, typename U>
void print(Pair<T, U> p)
{
    std::cout << '[' << p.first << ", " << p.second << ']';
}

int main()
{
    Pair<int, double> p1{ 1, 2.3 }; // a pair holding an int and a double
    Pair<double, int> p2{ 4.5, 6 }; // a pair holding a double and an int
    Pair<int, int> p3{ 7, 8 };      // a pair holding two ints

    print(p2);

    return 0;
}
```

COPY

To define multiple template types, in our template parameter declaration, we separate each of our desired template types with a comma. In the above example we define two different template types, one named `T`, and one named `U`. The actual template type arguments for `T` and `U` can be different (as in the case of `p1` and `p2` above) or the same (as in the case of `p3`).

std::pair

Because working with pairs of data is common, the C++ standard library contains a class template named `std::pair` (in the `<utility>` header) that is defined identically to the `Pair` class template with multiple template types in the preceding section. In fact, we can swap out the `pair` struct we developed for `std::pair`:

```cpp
#include <iostream>
#include <utility>

template <typename T, typename U>
void print(std::pair<T, U> p)
{
    std::cout << '[' << p.first << ", " << p.second << ']';
}

int main()
{
    std::pair<int, double> p1{ 1, 2.3 }; // a pair holding an int and a double
    std::pair<double, int> p2{ 4.5, 6 }; // a pair holding a double and an int
    std::pair<int, int> p3{ 7, 8 };      // a pair holding two ints

    print(p2);

    return 0;
}
```

COPY

We developed our own `Pair` class in this lesson to show how things work, but in real code, you should favor `std::pair` over writing your own.

Using class templates in multiple files

Just like function templates, class templates are typically defined in header files so they can be included into any code file that needs them. Both template definitions and type definitions are exempt from the one-definition rule, so this won’t cause problems:

```cpp title="pair.h"
#ifndef PAIR_H
#define PAIR_H

template <typename T>
struct Pair
{
    T first{};
    T second{};
};

template <typename T>
constexpr T max(Pair<T> p)
{
    return (p.first > p.second ? p.first : p.second);
}

#endif
```

```cpp title="foo.cpp"
#include "pair.h"
#include <iostream>

void foo()
{
    Pair<int> p1{ 1, 2 };
    std::cout << max(p1) << " is larger\n";
}
```

```cpp title="main.cpp"
#include "pair.h"
#include <iostream>

void foo(); // forward declaration for function foo()

int main()
{
    Pair<double> p2 { 3.4, 5.6 };
    std::cout << max(p2) << " is larger\n";

    foo();

    return 0;
}
```