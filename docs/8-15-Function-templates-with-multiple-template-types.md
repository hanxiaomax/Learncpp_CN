---
title: 8.15 - 具有多种类型的函数模板
alias: 8.15 - 具有多种类型的函数模板
origin: /function-templates-with-multiple-template-types/
origin_title: "8.15 — Function templates with multiple template types"
time: 2021-11-8
type: translation
tags:
- function template
- C++20
---

??? note "关键点速记"
	

In lesson [[8-13-Function-templates|8.13 - 函数模板]], we wrote a function template to calculate the maximum of two values:

```cpp
#include <iostream>

template <typename T>
T max(T x, T y)
{
    return (x > y) ? x : y;
}

int main()
{
    std::cout << max(1, 2) << '\n';   // will instantiate max(int, int)
    std::cout << max(1.5, 2.5) << '\n'; // will instantiate max(double, double)

    return 0;
}
```

COPY

Now consider the following similar program:

```cpp
#include <iostream>

template <typename T>
T max(T x, T y)
{
    return (x > y) ? x : y;
}

int main()
{
    std::cout << max(2, 3.5) << '\n';  // compile error

    return 0;
}
```

COPY

You may be surprised to find that this program won’t compile. Instead, the compiler will issue a bunch of (probably crazy looking) error messages. On Visual Studio, the author got the following:

```
Project3.cpp(11,18): error C2672: 'max': no matching overloaded function found
Project3.cpp(11,28): error C2782: 'T max(T,T)': template parameter 'T' is ambiguous
Project3.cpp(4): message : see declaration of 'max'
Project3.cpp(11,28): message : could be 'double'
Project3.cpp(11,28): message : or       'int'
Project3.cpp(11,28): error C2784: 'T max(T,T)': could not deduce template argument for 'T' from 'double'
Project3.cpp(4): message : see declaration of 'max'
```

In our function call `max(2, 3.5)`, we’re passing arguments of two different types: one `int` and one `double`. Because we’re making a function call without using angled brackets to specify an actual type, the compiler will first look to see if there is a non-template match for `max(int, double)`. It won’t find one.

Next, the compiler will see if it can find a function template match (using template argument deduction, which we covered in lesson [8.14 -- Function template instantiation](https://www.learncpp.com/cpp-tutorial/function-template-instantiation/)). However, this will also fail, for a simple reason: `T` can only represent a single type. There is no type for `T` that would allow the compiler to instantiate function template `max<T>(T, T)` into a function with two different parameter types. Put another way, because both parameters in the function template are of type `T`, they must resolve to the same actual type.

Since no non-template match was found, and no template match was found, the function call fails to resolve, and we get a compile error.

You might wonder why the compiler didn’t generate function `max<double>(double, double)` and then use numeric conversion to type convert the `int` argument to a `double`. The answer is simple: type conversion is done only when resolving function overloads, not when performing template argument deduction.

This lack of type conversion is intentional for at least two reasons. First, it helps keep things simple: we either find an exact match between the function call arguments and template type parameters, or we don’t. Second, it allows us to create function templates for cases where we want to ensure that two or more parameters have the same type (as in the example above).

We’ll have to find another solution. Fortunately, we can solve this problem in (at least) three ways.

## Use static_cast to convert the arguments to matching types

The first solution is to put the burden on the caller to convert the arguments into matching types. For example:

```cpp
#include <iostream>

template <typename T>
T max(T x, T y)
{
    return (x > y) ? x : y;
}

int main()
{
    std::cout << max(static_cast<double>(2), 3.5) << '\n'; // convert our int to a double so we can call max(double, double)

    return 0;
}
```

COPY

Now that both arguments are of type `double`, the compiler will be able to instantiate `max(double, double)` that will satisfy this function call.

However, this solution is awkward and hard to read.

## Provide an actual type

If we had written a non-template `max(double, double)` function, then we would be able to call `max(int, double)` and let the implicit type conversion rules convert our `int` argument into a `double` so the function call could be resolved:

```cpp
#include <iostream>

double max(double x, double y)
{
    return (x > y) ? x : y;
}

int main()
{
    std::cout << max(2, 3.5) << '\n'; // the int argument will be converted to a double

    return 0;
}
```

COPY

However, when the compiler is doing template argument deduction, it won’t do any type conversions. Fortunately, we don’t have to use template argument deduction if we specify an actual type to be used instead:

```cpp
#include <iostream>

template <typename T>
T max(T x, T y)
{
    return (x > y) ? x : y;
}

int main()
{
    std::cout << max<double>(2, 3.5) << '\n'; // we've provided actual type double, so the compiler won't use template argument deduction

    return 0;
}
```

COPY

In the above example, we call `max<double>(2, 3.5)`. Because we’ve explicitly specified that `T` should be replaced with `double`, the compiler won’t use template argument deduction. Instead, it will just instantiate the function `max<double>(double, double)`, and then type convert any mismatched arguments. Our `int` parameter will be implicitly converted to a `double`.

While this is more readable than using `static_cast`, it would be even nicer if we didn’t even have to think about the types when making a function call to `max` at all.

## Functions templates with multiple template type parameters

The root of our problem is that we’ve only defined the single template type (`T`) for our function template, and then specified that both parameters must be of this same type.

The best way to solve this problem is to rewrite our function template in such a way that our parameters can resolve to different types. Rather than using one template type parameter `T`, we’ll now use two (`T` and `U`):

```cpp
#include <iostream>

template <typename T, typename U> // We're using two template type parameters named T and U
T max(T x, U y) // x can resolve to type T, and y can resolve to type U
{
    return (x > y) ? x : y; // uh oh, we have a narrowing conversion problem here
}

int main()
{
    std::cout << max(2, 3.5) << '\n';

    return 0;
}
```

COPY

Because we’ve defined `x` with template type `T`, and `y` with template type `U`, `x` and `y` can now resolve their types independently. When we call `max(2, 3.5)`, `T` can be an `int` and `U` can be a `double`. The compiler will happily instantiate `max<int, double>(int, double)` for us.

However, the above code still has a problem: using the usual arithmetic rules ([8.4 -- Arithmetic conversions](https://www.learncpp.com/cpp-tutorial/arithmetic-conversions/)), `double` takes precedence over `int`, so our conditional operator will return a `double`. But our function is defined as returning a `T` -- in cases where `T` resolves to an `int`, our `double` return value will undergo a narrowing conversion to an `int`, which will produce a warning (and possible loss of data).

Making the return type a `U` instead doesn’t solve the problem, as we can always flip the order of the operands in the function call to flip the types of `T`and `U`.

How do we solve this? This is a good use for an `auto` return type -- we’ll let the compiler deduce what the return type should be from the return statement:

```cpp
#include <iostream>

template <typename T, typename U>
auto max(T x, U y)
{
    return (x > y) ? x : y;
}

int main()
{
    std::cout << max(2, 3.5) << '\n';

    return 0;
}
```

COPY

This version of `max` now works fine with operands of different types.

## Abbreviated function templates C++20

C++20 introduces a new use of the `auto` keyword: When the `auto` keyword is used as a parameter type in a normal function, the compiler will automatically convert the function into a function template with each auto parameter becoming an independent template type parameter. This method for creating a function template is called an abbreviated function template.

For example:

```cpp
auto max(auto x, auto y)
{
    return (x > y) ? x : y;
}
```

COPY

is shorthand in C++20 for the following:

```cpp
template <typename T, typename U>
auto max(T x, U y)
{
    return (x > y) ? x : y;
}
```

COPY

which is the same as the `max` function template we wrote above.

In cases where you want each template type parameter to be an independent type, this form is preferred as the removal of the template parameter declaration line makes your code more concise and readable.

Best practice

Feel free to use abbreviated function templates if each auto parameter should be an independent template type (and your language standard is set to C++20 or newer).