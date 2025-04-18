---
title: 26-3-function-template-specialization
aliases: 26-3-function-template-specialization
origin: 
origin_title: 26-3-function-template-specialization
time: 2025-04-01 
type: translation-under-construction
tags:
---
# 26.3 — Function template specialization

When instantiating a function template for a given type, the compiler stencils out a copy of the templated function and replaces the template type parameters with the actual types used in the variable declaration. This means a particular function will have the same implementation details for each instanced type (just using different types). While most of the time this is exactly what you want, occasionally there are cases where it is useful to implement a templated function slightly differently for a specific data type.

Using a non-template function

Consider the following example:

```cpp
#include <iostream>

template <typename T>
void print(const T& t)
{
    std::cout << t << '\n';
}

int main()
{
    print(5);
    print(6.7);
    
    return 0;
}
```

This prints:

```cpp
5
6.7

```

Now, let’s say we want double values (and only double values) to output in scientific notation.

One way to get different behavior for a given type is to define a non-template function:

```cpp
#include <iostream>

template <typename T>
void print(const T& t)
{
    std::cout << t << '\n';
}

void print(double d)
{
    std::cout << std::scientific << d << '\n';
}

int main()
{
    print(5);
    print(6.7);
    
    return 0;
}
```

When the compiler goes to resolve `print(6.7)`, it will see that `print(double)` has already been defined by us, and use that instead of instantiating a version from `print(const T&)`.

This produces the result:

```cpp
5
6.700000e+000

```

One nice thing about defining functions this way is that the non-template function doesn’t need to have the same signature as the function template. Note that `print(const T&)` uses pass by const reference, whereas `print(double)` uses pass by value.

Generally, prefer to define a non-template function if that option is available.

Function template specialization

Another way to achieve a similar result is to use explicit template specialization. **Explicit template specialization** (often shortened to **template specialization**) is a feature that allows us to explicitly define different implementations of a template for specific types or values. When all of the template parameters are specialized, it is called a **full specialization**. When only some of the template parameters are specialized, it is called a **partial specialization**.

Let’s create a specialization of `print<T>` when `T` is a `double`:

```cpp
#include <iostream>

// Here's our primary template (must come first)
template <typename T>
void print(const T& t)
{
    std::cout << t << '\n';
}

// A full specialization of primary template print<T> for type double
// Full specializations are not implicitly inline, so make this inline if put in header file
template<>                          // template parameter declaration containing no template parameters 
void print<double>(const double& d) // specialized for type double
{
    std::cout << std::scientific << d << '\n'; 
}

int main()
{
    print(5);
    print(6.7);
    
    return 0;
}
```

In order to specialize a template, the compiler first must have seen a declaration for the primary template. The primary template in the example above is `print<T>(const T&)`.

Now, let’s take a closer look at our function template specialization:

```cpp
template<>                          // template parameter declaration containing no template parameters 
void print<double>(const double& d) // specialized for type double
```

First, we need a template parameter declaration so the compiler knows we’re doing something related to templates. However, in this case, we don’t actually need any template parameters, so we use an empty pair of angled brackets. Since we have no template parameters in the specialization, this is a full specialization.

On the next line, `print<double>` tells the compiler that we’re specializing the `print` primary template function for type `double`. The specialization must have the same signature as the primary template (except the specialization substitutes `double` anywhere the primary template uses `T`). Because the primary template has a parameter of type `const T&`, the specialization must have a parameter of type `const double&`. The specialization cannot use pass-by-value when the primary template uses pass-by-reference (or vice-versa).

This example prints the same result as above.

Note that if a matching non-template function and a matching template function specialization both exist, the non-template function will take precedence. Also, full specializations are not implicitly inline, so if you define one in a header file, make sure you `inline` it to avoid ODR violations.

Warning

Full specializations are not implicitly inline (partial specializations are implicitly inline). If you put a full specialization in a header file, it should be marked as `inline` so that it does not cause ODR violations when included into multiple translation units.

Just like normal functions, function template specializations can be deleted (using `= delete`) if you want any function calls that resolve to the specialization to produce a compilation error.

In general, you should avoid function template specializations in favor of non-template functions whenever possible.

Function template specialization for member functions?

Now consider the following class template:

```cpp
#include <iostream>

template <typename T>
class Storage
{
private:
    T m_value {};
public:
    Storage(T value)
      : m_value { value }
    {
    }

    void print()
    {
        std::cout << m_value << '\n';
    }
};

int main()
{
    // Define some storage units
    Storage i { 5 };
    Storage d { 6.7 };

    // Print out some values
    i.print();
    d.print();
}
```

This prints:

```cpp
5
6.7
```

Let’s say we again want to create a version of the `print()` function that prints doubles in scientific notation. However, this time `print()` is a member function, so we can’t define a non-member function. So how might we do this?

Although it may seem like we need to use function template specialization here, that’s the wrong tool. Note that `i.print()` calls `Storage<int>::print()` and `d.print()` calls `Storage<double>::print()`. Therefore, if we want to change the behavior of this function when `T` is a double, we need to specialize `Storage<double>::print()`, which is a class template specialization, not a function template specialization!

So how might we do that? We’ll cover class template specialization in the next lesson.