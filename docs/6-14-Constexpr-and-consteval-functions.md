---
title: 6.14 - Constexpr 和 consteval 函数
alias: 6.14 - Constexpr 和 consteval 函数
origin: /constexpr-and-consteval-functions/
origin_title: "6.14 — Constexpr and consteval functions"
time: 2022-4-12
type: translation
tags:
- constexpr
- C++20
---


In lesson [[4-15-Symbolic-constants-const-and-constexpr-variables|4.15 - 符号常量 const 和 constexpr 变量]], we introduced the `constexpr` keyword, which we used to create compile-time (symbolic) constants. We also introduced constant expressions, which are expressions that can be evaluated at compile-time rather than runtime.

Consider the following program, which uses two constexpr variables:

```cpp
#include <iostream>

int main()
{
    constexpr int x{ 5 };
    constexpr int y{ 6 };

    std::cout << (x > y ? x : y) << " is greater!";

    return 0;
}
```

COPY

This produces the result:

```
6 is greater!
```

Because `x` and `y` are constexpr, the compiler can evaluate the constant expression `(x > y ? x : y)` at compile-time, reducing it to just `6`. Because this expression no longer needs to be evaluated at runtime, our program will run faster.

However, having a non-trivial expression in the middle of our print statement isn’t ideal -- it would be better if the expression were a named function. Here’s the same example using a function:

```cpp
#include <iostream>

int greater(int x, int y)
{
    return (x > y ? x : y); // here's our expression
}

int main()
{
    constexpr int x{ 5 };
    constexpr int y{ 6 };

    std::cout << greater(x, y) << " is greater!"; // will be evaluated at runtime

    return 0;
}
```

COPY

This program produces the same output as the prior one. But there’s a downside to putting our expression in a function: the call to `greater(x, y)` will execute at runtime. By using a function (which is good for modularity and documentation) we’ve lost our ability for that code to be evaluated at compile-time (which is bad for performance).

So how might we address this?

## Constexpr functions can be evaluated at compile-time

A constexpr function is a function whose return value may be computed at compile-time. To make a function a constexpr function, we simply use the `constexpr` keyword in front of the return type. Here’s a similar program to the one above, using a constexpr function:

```cpp
#include <iostream>

constexpr int greater(int x, int y) // now a constexpr function
{
    return (x > y ? x : y);
}

int main()
{
    constexpr int x{ 5 };
    constexpr int y{ 6 };

    // We'll explain why we use variable g here later in the lesson
    constexpr int g { greater(x, y) }; // will be evaluated at compile-time

    std::cout << g << " is greater!";

    return 0;
}
```

COPY

This produces the same output as the prior example, but the function `greater()` will be evaluated at compile-time instead of runtime!

To be eligible for compile-time evaluation, a function must have a constexpr return type and not call any non-constexpr functions. Additionally, a call to the function must have constexpr arguments (e.g. constexpr variables or literals).

!!! info "作者注"

	We’ll use the term “eligible for compile-time evaluation” later in the article, so remember this definition.

!!! info "扩展阅读"

    There are some other lesser encountered criteria as well. These can be found [here](https://en.cppreference.com/w/cpp/language/constexpr).

Our `greater()` function definition and function call in the above example meets these requirements, so it is eligible for compile-time evaluation.

!!! success "最佳实践"

	Use a `constexpr` return type for functions that need to return a compile-time constant.

## Constexpr functions are implicitly inline

Because constexpr functions may be evaluated at compile-time, the compiler must be able to see the full definition of the constexpr function at all points where the function is called.

This means that a constexpr function called in multiple files needs to have its definition included into each such file -- which would normally be a violation of the one-definition rule. To avoid such problems, constexpr functions are implicitly inline, which makes them exempt from the one-definition rule.

As a result, constexpr functions are often defined in header files, so they can be #included into any .cpp file that requires the full definition.

## Constexpr functions can also be evaluated at runtime

Functions with a constexpr return value can also be evaluated at runtime, in which case they will return a non-constexpr result. For example:

```cpp
#include <iostream>

constexpr int greater(int x, int y)
{
    return (x > y ? x : y);
}

int main()
{
    int x{ 5 }; // not constexpr
    int y{ 6 }; // not constexpr

    std::cout << greater(x, y) << " is greater!"; // will be evaluated at runtime

    return 0;
}
```

COPY

In this example, because arguments `x` and `y` are not constexpr, the function cannot be resolved at compile-time. However, the function will still be resolved at runtime, returning the expected value as a non-constexpr `int`.

!!! tldr "关键信息"

	Allowing functions with a constexpr return type to be evaluated at either compile-time or runtime was allowed so that a single function can serve both cases. Otherwise, you’d need to have separate functions (a constexpr version and a non-constexpr version) -- and since return type isn’t considered in function overload resolution, you’d have to name the functions different things!

## So when is a constexpr function evaluated at compile-time?

You might think that a constexpr function would evaluate at compile-time whenever possible, but unfortunately this is not the case.

According to the C++ standard, a constexpr function that is eligible for compile-time evaluation _must_ be evaluated at compile-time if the return value is used where a constant expression is required. Otherwise, the compiler is free to evaluate the function at either compile-time or runtime.

Let’s examine a few cases to explore this further:

```cpp
#include <iostream>

constexpr int greater(int x, int y)
{
    return (x > y ? x : y);
}

int main()
{
    constexpr int g { greater(5, 6) };            // case 1: evaluated at compile-time
    std::cout << g << "is greater!";

    int x{ 5 }; // not constexpr
    std::cout << greater(x, 6) << " is greater!"; // case 2: evaluated at runtime

    std::cout << greater(5, 6) << " is greater!"; // case 3: may be evaluated at either runtime or compile-time

    return 0;
}
```

COPY

In case 1, we’re calling `greater()` with constexpr arguments, so it is eligible to be evaluated at compile-time. The initializer of constexpr variable `g` must be a constant expression, so the return value is used in a context that requires a constant expression. Thus, `greater()` must be evaluated at compile-time.

In case 2, we’re calling `greater()` with one parameter that is non-constexpr. Thus `greater()` cannot be evaluated at compile-time, and must evaluate at runtime.

Case 3 is the interesting case. The `greater()` function is again being called with constexpr arguments, so it is eligible for compile-time evaluation. However, the return value is not being used in a context that requires a constant expression (operator<< always executes at runtime), so the compiler is free to choose whether this call to `greater()` will be evaluated at compile-time or runtime!

Note that your compiler’s optimization level setting may have an impact on whether it decides to evaluate a function at compile-time or runtime. This also means that your compiler may make different choices for debug vs. release builds (as debug builds typically have optimizations turned off).

!!! tldr "关键信息"

	A constexpr function that is eligible to be evaluated at compile-time will only be evaluated at compile-time if the return value is used where a constant expression is required. Otherwise, compile-time evaluation is not guaranteed.

Thus, a constexpr function is better thought of as “can be used in a constant expression”, not “will be evaluated at compile-time”.

Determining if a constexpr function call is evaluating at compile-time or runtime

Prior to C++20, there are no standard language tools available to do this.

In C++20, `std::is_constant_evaluated()` (defined in the <type_traits> header) returns a `bool` indicating whether the current function call is executing in a constant context. This can be combined with a conditional statement to allow a function to behave differently when evaluated at compile-time vs runtime.

```cpp
#include <type_traits> // for std::is_constant_evaluated
constexpr int someFunction()
{
    if (std::is_constant_evaluated()) // if compile-time evaluation
        // do something
    else // runtime evaluation
        // do something else
}
```

COPY

Used cleverly, you can have your function produce some observable difference (such as returning a special value) when evaluated at compile-time, and then infer how it evaluated from that result.

Forcing a constexpr function to be evaluated at compile-time

There is no way to tell the compiler that a constexpr function should prefer to evaluate at compile-time whenever it can (even in cases where the return value is used in a non-constant expression).

However, we can force a constexpr function that is eligible to be evaluated at compile-time to actually evaluate at compile-time by ensuring the return value is used where a constant expression is required. This needs to be done on a per-call basis.

The most common way to do this is to use the return value to initialize a constexpr variable (this is why we’ve been using variable ‘g’ in prior examples). Unfortunately, this requires introducing a new variable into our program just to ensure compile-time evaluation, which is ugly and reduces code readability.

!!! info "扩展阅读"

    There are several hacky ways that people have tried to work around the problem of having to introduce a new constexpr variable each time we want to force compile-time evaluation. See [here](https://quuxplusone.github.io/blog/2018/08/07/force-constexpr/) and [here](https://artificial-mind.net/blog/2020/11/14/cpp17-consteval).

However, in C++20, there is a better workaround to this issue, which we’ll present in a moment.

## Consteval (C++20)

C++20 introduces the keyword `consteval`, which is used to indicate that a function _must_ evaluate at compile-time, otherwise a compile error will result. Such functions are called immediate functions.

```cpp
#include <iostream>

consteval int greater(int x, int y) // function is now consteval
{
    return (x > y ? x : y);
}

int main()
{
    constexpr int g { greater(5, 6) };            // ok: will evaluate at compile-time
    std::cout << greater(5, 6) << " is greater!"; // ok: will evaluate at compile-time

    int x{ 5 }; // not constexpr
    std::cout << greater(x, 6) << " is greater!"; // error: consteval functions must evaluate at compile-time

    return 0;
}
```

COPY

In the above example, the first two calls to `greater()` will evaluate at compile-time. The call to `greater(x, 6)` cannot be evaluated at compile-time, so a compile error will result.

Just like constexpr functions, consteval functions are implicitly inline.

!!! success "最佳实践"

	Use `consteval` if you have a function that must run at compile-time for some reason (e.g. performance).

## Using consteval to make constexpr execute at compile-time (C++20)

The downside of consteval functions is that such functions can’t evaluate at runtime, making them less flexible than constexpr functions, which can do either. Therefore, it would still be useful to have a convenient way to force constexpr functions to evaluate at compile-time (even when the return value is being used where a constant expression is not required), so that we could have compile-time evaluation when possible, and runtime evaluation when we can’t.

Consteval functions provides a way to make this happen, using a neat helper function:

```cpp
#include <iostream>

// Uses abbreviated function template (C++20) and `auto` return type to make this function work with any type of value
// See 'related content' box below for more info (you don't need to know how these work to use this function)
consteval auto compileTime(auto value)
{
    return value;
}

constexpr int greater(int x, int y) // function is constexpr
{
    return (x > y ? x : y);
}

int main()
{
    std::cout << greater(5, 6);              // may or may not execute at compile-time
    std::cout << compileTime(greater(5, 6)); // will execute at compile-time

    int x { 5 };
    std::cout << greater(x, 6);              // we can still call the constexpr version at runtime if we wish

    return 0;
}
```


This works because consteval functions require constant expressions as arguments -- therefore, if we use the return value of a constexpr function as an argument to a consteval function, the constexpr function must be evaluated at compile-time! The consteval function just returns this argument as its own return value, so the caller can still use it.

Note that the consteval function returns by value. While this might be inefficient to do at runtime (if the value was some type that is expensive to copy, e.g. std::string), in a compile-time context, it doesn’t matter because the entire call to the consteval function will simply be replaced with the calculated return value.

!!! info "相关内容"

	We cover `auto` return types in lesson [8.8 -- Type deduction for functions](https://www.learncpp.com/cpp-tutorial/type-deduction-for-functions/).  
We cover abbreviated function templates (`auto` parameters) in lesson [8.15 -- Function templates with multiple template types](https://www.learncpp.com/cpp-tutorial/function-templates-with-multiple-template-types/).