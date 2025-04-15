---
title: F-3-constexpr-functions-part-3-and-consteval
aliases: F-3-constexpr-functions-part-3-and-consteval
origin: 
origin_title: F-3-constexpr-functions-part-3-and-consteval
time: 2025-04-01 
type: translation-under-construction
tags:
---
# F.3 — Constexpr functions (part 3) and consteval

Forcing a constexpr function to be evaluated at compile-time

There is no way to tell the compiler that a constexpr function should prefer to evaluate at compile-time whenever it can (e.g. in cases where the return value of a constexpr function is used in a non-constant expression).

However, we can force a constexpr function that is eligible to be evaluated at compile-time to actually evaluate at compile-time by ensuring the return value is used where a constant expression is required. This needs to be done on a per-call basis.

The most common way to do this is to use the return value to initialize a constexpr variable (this is why we’ve been using variable ‘g’ in prior examples). Unfortunately, this requires introducing a new variable into our program just to ensure compile-time evaluation, which is ugly and reduces code readability.

For advanced readers

There are several hacky ways that people have tried to work around the problem of having to introduce a new constexpr variable each time we want to force compile-time evaluation. See [here](https://quuxplusone.github.io/blog/2018/08/07/force-constexpr/) and [here](https://artificial-mind.net/blog/2020/11/14/cpp17-consteval).

However, in C++20, there is a better workaround to this issue, which we’ll present in a moment.

Consteval C++20

C++20 introduces the keyword **consteval**, which is used to indicate that a function *must* evaluate at compile-time, otherwise a compile error will result. Such functions are called **immediate functions**.

```cpp
#include <iostream>

consteval int greater(int x, int y) // function is now consteval
{
    return (x > y ? x : y);
}

int main()
{
    constexpr int g { greater(5, 6) };              // ok: will evaluate at compile-time
    std::cout << g << '\n';

    std::cout << greater(5, 6) << " is greater!\n"; // ok: will evaluate at compile-time

    int x{ 5 }; // not constexpr
    std::cout << greater(x, 6) << " is greater!\n"; // error: consteval functions must evaluate at compile-time

    return 0;
}
```

In the above example, the first two calls to `greater()` will evaluate at compile-time. The call to `greater(x, 6)` cannot be evaluated at compile-time, so a compile error will result.

Best practice

Use `consteval` if you have a function that must evaluate at compile-time for some reason (e.g. because it does something that can only be done at compile time).

Perhaps surprisingly, the parameters of a consteval function are not constexpr (even though consteval functions can only be evaluated at compile-time). This decision was made for the sake of consistency.

Determining if a constexpr function call is evaluating at compile-time or runtime

C++ does not currently provide any reliable mechanisms to do this.

What about `std::is_constant_evaluated` or `if consteval`? Advanced

Neither of these capabilities tell you whether a function call is evaluating at compile-time or runtime.

`std::is_constant_evaluated()` (defined in the \<type_traits> header) returns a `bool` indicating whether the current function is executing in a constant-evaluated context. A **constant-evaluated context** (also called a **constant context**) is defined as one in which a constant expression is required (such as the initialization of a constexpr variable). So in cases where the compiler is required to evaluate a constant expression at compile-time `std::is_constant_evaluated()` will `true` as expected.

This is intended to allow you to do something like this:

```cpp
#include <type_traits> // for std::is_constant_evaluated()

constexpr int someFunction()
{
    if (std::is_constant_evaluated()) // if evaluating in constant context
        doSomething();
    else
        doSomethingElse();
}
```

However, the compiler may also choose to evaluate a constexpr function at compile-time in a context that does not require a constant expression. In such cases, `std::is_constant_evaluated()` will return `false` even though the function did evaluate at compile-time. So `std::is_constant_evaluated()` really means “the compiler is being forced to evaluate this at compile-time”, not “this is evaluating at compile-time”.

Key insight

While this may seem strange, there are several reasons for this:

1. As [the paper that proposed this feature](https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2018/p0595r2.html) indicates, the standard doesn’t actually make a distinction between “compile time” and “runtime”. Defining behavior involving that distinction would have been a larger change.
1. Optimizations should not change the observable behavior of a program (unless explicitly allowed by the standard). If `std::is_constant_evaluated()` were to return `true` when the function was evaluated at compile-time for any reason, then the optimizer deciding to evaluate a function at compile-time instead of runtime could potentially change the observable behavior of the function. As a result, your program might behave very differently depending on what optimization level it was compiled with!

While this could be addressed in various ways, those involve adding additional complexity to the optimizer and/or limiting its ability to optimize certain cases.

Introduced in C++23, `if consteval` is a replacement for `if (std::is_constant_evaluated())` that provides a nicer syntax and fixes some other issues. However, it evaluates the same way.

Using consteval to make constexpr execute at compile-time C++20

The downside of consteval functions is that such functions can’t evaluate at runtime, making them less flexible than constexpr functions, which can do either. Therefore, it would still be useful to have a convenient way to force constexpr functions to evaluate at compile-time (even when the return value is being used where a constant expression is not required), so that we can explicitly force compile-time evaluation when possible, and runtime evaluation when we can’t.

Here’s an example that shows how this is possible:

```cpp
#include <iostream>

#define CONSTEVAL(...) [] consteval { return __VA_ARGS__; }()               // C++20 version per Jan Scultke (https://stackoverflow.com/a/77107431/460250)
#define CONSTEVAL11(...) [] { constexpr auto _ = __VA_ARGS__; return _; }() // C++11 version per Justin (https://stackoverflow.com/a/63637573/460250)

// This function returns the greater of the two numbers if executing in a constant context
// and the lesser of the two numbers otherwise
constexpr int compare(int x, int y) // function is constexpr
{
    if (std::is_constant_evaluated())
        return (x > y ? x : y);
    else
        return (x < y ? x : y);
}

int main()
{
    int x { 5 };
    std::cout << compare(x, 6) << '\n';                  // will execute at runtime and return 5

    std::cout << compare(5, 6) << '\n';                  // may or may not execute at compile-time, but will always return 5
    std::cout << CONSTEVAL(compare(5, 6)) << '\n';       // will always execute at compile-time and return 6
    

    return 0;
}
```

For advanced readers

This uses a variadic preprocessor macro (the #define, `...`, and `__VA_ARGS__`) to define an consteval lambda that is immediately invoked (by the trailing parentheses).\
You can find information on variadic macros at <https://en.cppreference.com/w/cpp/preprocessor/replace>.\
We cover lambdas in lesson [20.6 -- Introduction to lambdas (anonymous functions)](https://www.learncpp.com/cpp-tutorial/introduction-to-lambdas-anonymous-functions/).

The following should also work (and is a bit cleaner since it doesn’t use preprocessor macros):

For gcc users

There is a bug in GCC 14 onward that causes the following example to produce the wrong answer when any level of optimization is enabled.

```cpp
#include <iostream>

// Uses abbreviated function template (C++20) and `auto` return type to make this function work with any type of value
// See 'related content' box below for more info (you don't need to know how these work to use this function)
// We've opted to use an uppercase name here for consistency with the prior example, but it also makes it easier to see the call
consteval auto CONSTEVAL(auto value)
{
    return value;
}

// This function returns the greater of the two numbers if executing in a constant context
// and the lesser of the two numbers otherwise
constexpr int compare(int x, int y) // function is constexpr
{
    if (std::is_constant_evaluated())
        return (x > y ? x : y);
    else
        return (x < y ? x : y);
}

int main()
{
    std::cout << CONSTEVAL(compare(5, 6)) << '\n';       // will execute at compile-time

    return 0;
}
```

Because the arguments of consteval functions are always manifestly constant evaluated, if we call a constexpr function as an argument to a consteval function, that constexpr function must be evaluated at compile-time! The consteval function then returns the result of the constexpr function as its own return value, so the caller can use it.

Note that the consteval function returns by value. While this might be inefficient to do at runtime (if the value was some type that is expensive to copy, e.g. `std::string`), in a compile-time context, it doesn’t matter because the entire call to the consteval function will simply be replaced with the calculated return value.

For advanced readers

We cover auto return types in lesson [10.9 -- Type deduction for functions](https://www.learncpp.com/cpp-tutorial/type-deduction-for-functions/).\
We cover abbreviated function templates (auto parameters) in lesson 11.8 -- Function templates with multiple template types [11.8 -- Function templates with multiple template types](https://www.learncpp.com/cpp-tutorial/function-templates-with-multiple-template-types/).
