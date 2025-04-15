---
title: 5-6-constexpr-variables
aliases:
  - 5-6-constexpr-variables
origin: 
origin_title: 5-6-constexpr-variables
time: 2025-04-01
type: translation-under-construction
tags:
---
# 5.6 — Constexpr variables

In the previous lesson [5.5 -- Constant expressions](https://www.learncpp.com/cpp-tutorial/constant-expressions/#whywecare), we defined what a constant expression is, discussed why constant expressions are desirable, and concluded with when constant expressions actually evaluate at compile-time.

In this lesson, we’ll take a closer look at how we create variables that can be used in constant expressions in modern C++. We’ll also explore our first method for ensuring that code actually executes at compile-time.

The compile-time `const` challenge

In the prior lesson, we noted that one way to create a variable that can be used in a constant expression is to use the `const` keyword. A `const` variable with an integral type and a constant expression initializer can be used in a constant expression. All other `const` variables cannot be used in constant expressions.

However, the use of `const` to create variables that can be used in constant expressions has a few challenges.

First, use of `const` does not make it immediately clear whether the variable is usable in a constant expression or not. In some cases, we can figure it out fairly easily:

```cpp
int a { 5 };       // not const at all
const int b { a }; // clearly not a constant expression (since initializer is non-const)
const int c { 5 }; // clearly a constant expression (since initializer is a constant expression)
```

In other cases, it can be quite difficult:

```cpp
const int d { someVar };    // not obvious whether d is usable in a constant expression or not
const int e { getValue() }; // not obvious whether e is usable in a constant expression or not
```

In the above example, variables `d` and `e` may or may not be usable in a constant expressions, depending on how `someVar` and `getValue()` are defined. That means we have to go inspect the definitions of those initializers and infer what case we’re in. And that may not even be sufficient -- if `someVar` is const and initialized with a variable or a function call, we’ll have to go inspect the definition of its initializer too!

Second, use of `const` does not provide a way to inform the compiler that we require a variable that is usable in a constant expression (and that it should halt compilation if it isn’t). Instead, it will just silently create a variable that can only be used in runtime expressions.

Third, the use of `const` to create compile-time constant variables does not extend to non-integral variables. And there are many cases where we would like non-integral variables to be compile-time constants too.

The `constexpr` keyword

Fortunately, we can enlist the compiler’s help to ensure we get a compile-time constant variable where we desire one. To do so, we use the `constexpr` keyword (which is shorthand for “constant expression”) instead of `const` in a variable’s declaration. A **constexpr** variable is always a compile-time constant. As a result, a constexpr variable must be initialized with a constant expression, otherwise a compilation error will result.

For example:

```cpp
#include <iostream>

// The return value of a non-constexpr function is not constexpr
int five()
{
    return 5;
}

int main()
{
    constexpr double gravity { 9.8 }; // ok: 9.8 is a constant expression
    constexpr int sum { 4 + 5 };      // ok: 4 + 5 is a constant expression
    constexpr int something { sum };  // ok: sum is a constant expression

    std::cout << "Enter your age: ";
    int age{};
    std::cin >> age;

    constexpr int myAge { age };      // compile error: age is not a constant expression
    constexpr int f { five() };       // compile error: return value of five() is not constexpr

    return 0;
}
```

Because functions normally execute at runtime, the return value of a function is not constexpr (even when the return expression is a constant expression). This is why `five()` is not a legal initialization value for `constexpr int f`.

Related content

We talk about functions whose return values can be used in constant expressions in lesson [F.1 -- Constexpr functions](https://www.learncpp.com/cpp-tutorial/constexpr-functions/).

Additionally, `constexpr` works for variables with non-integral types:

```cpp
constexpr double d { 1.2 }; // d can be used in constant expressions!
```

The meaning of const vs constexpr for variables

For variables:

- `const` means that the value of an object cannot be changed after initialization. The value of the initializer may be known at compile-time or runtime. The const object can be evaluated at runtime.
- `constexpr` means that the object can be used in a constant expression. The value of the initializer must be known at compile-time. The constexpr object can be evaluated at runtime or compile-time.

Constexpr variables are implicitly const. Const variables are not implicitly constexpr (except for const integral variables with a constant expression initializer). Although a variable can be defined as both `constexpr` and `const`, in most cases this is redundant, and we only need to use either `const` or `constexpr`.

Unlike `const`, `constexpr` is not part of an object’s type. Therefore a variable defined as `constexpr int` actually has type `const int` (due to the implicit `const` that `constexpr` provides for objects).

Best practice

Any constant variable whose initializer is a constant expression should be declared as `constexpr`.

Any constant variable whose initializer is not a constant expression (making it a runtime constant) should be declared as `const`.

Caveat: In the future we will discuss some types that are not fully compatible with `constexpr` (including `std::string`, `std::vector`, and other types that use dynamic memory allocation). For constant objects of these types, either use `const` instead of `constexpr`, or pick a different type that is constexpr compatible (e.g. `std::string_view` or `std::array`).

Nomenclature

The term `constexpr` is a portmanteau of “constant expression”. This name was picked because constexpr objects (and functions) can be used in constant expressions.

Formally, the keyword `constexpr` applies only to objects and functions. Conventionally, the term `constexpr` is used as shorthand for any constant expression (such as `1 + 2`).

Author’s note

Some of the examples on this site were written prior to the best practice to use `constexpr` -- as a result, you will note that some examples do not follow the above best practice. We are currently in the process of updating non-compliant examples as we run across them.

For advanced readers

In C and C++, the declaration of an array object (an object can hold multiple values) requires the length of the array (the number of values that it can hold) be known at compile-time (so the compiler can ensure the correct amount of memory is allocated for array objects).

Since literals are known at compile-time, they can be used as an array length:

```cpp
int arr[5]; // an array of 5 int values, length of 5 is known at compile-time
```

In many cases, it would be preferable to use a symbolic constant as an array length (e.g. to avoid magic numbers and make the array length easier to change if it is used in multiple places). In C, this can be done via a preprocessor macro, or via an enumerator, but not via a const variable (excluding VLA’s, which have other downsides). C++, looking to improve on this situation, wanted to allow the use of const variables instead of macros. But the value of variables was generally assumed to be known only at runtime, which made them ineligible to be used as array lengths.

To solve this problem, the C++ language standard added an exemption so that const integral types with a constant expression initializer would be treated as values known at compile-time, and thus be usable as array lengths:

```cpp
const int arrLen = 5;
int arr[arrLen]; // ok: array of 5 ints
```

When C++11 introduced constant expressions, it made sense for a const int with a constant expression initializer to be grandfathered into that definition. The committee discussed whether other types should be included as well, but ultimately decided not to.

Const and constexpr function parameters

Normal function calls are evaluated at runtime, with the supplied arguments being used to initialize the function’s parameters. Because the initialization of function parameters happens at runtime, this leads to two consequences:

1. `const` function parameters are treated as runtime constants (even when the supplied argument is a compile-time constant).
1. Function parameters cannot be declared as `constexpr`, since their initialization value isn’t determined until runtime.

Related content

We discuss functions that can be evaluated at compile-time (and thus be used in constant expressions) below.

C++ also supports a way to pass compile-time constants to a function. We discuss these in lesson [11.9 -- Non-type template parameters](https://www.learncpp.com/cpp-tutorial/non-type-template-parameters/).

Nomenclature recap

| Term | Definition |
| --- | --- |
| Compile-time constant | A value or non-modifiable object whose value must be known at compile time (e.g. literals and constexpr variables). |
| Constexpr | Keyword that declares objects as compile-time constants (and functions that can be evaluated at compile-time). Informally, shorthand for “constant expression”. |
| Constant expression | An expression that contains only compile-time constants and operators/functions that support compile-time evaluation. |
| Runtime expression | An expression that is not a constant expression. |
| Runtime constant | A value or non-modifiable object that is not a compile-time constant. |

A brief introduction to constexpr functions

A **constexpr function** is a function that can be called in a constant expression. A constexpr function must evaluate at compile-time when the constant expression it is part of must evaluate at compile time (e.g. in the initializer of a constexpr variable). Otherwise, a constexpr function may be evaluated at either compile-time (if eligible) or runtime. To be eligible for compile-time execution, all arguments must be constant expressions.

To make a constexpr function, the `constexpr` keyword is placed in the function declaration before the return type:

```cpp
#include <iostream>

int max(int x, int y) // this is a non-constexpr function
{
    if (x > y)
        return x;
    else
        return y;
}

constexpr int cmax(int x, int y) // this is a constexpr function
{
    if (x > y)
        return x;
    else
        return y;
}

int main()
{
    int m1 { max(5, 6) };            // ok
    const int m2 { max(5, 6) };      // ok
    constexpr int m3 { max(5, 6) };  // compile error: max(5, 6) not a constant expression

    int m4 { cmax(5, 6) };           // ok: may evaluate at compile-time or runtime
    const int m5 { cmax(5, 6) };     // ok: may evaluate at compile-time or runtime
    constexpr int m6 { cmax(5, 6) }; // okay: must evaluate at compile-time

    return 0;
}
```

Author’s note

We used to discuss constexpr functions in detail in this chapter, but feedback from readers indicated that the topic was too long and nuanced to present this early in the tutorial series. As a result, we’ve moved the full discussion back to lesson [F.1 -- Constexpr functions](https://www.learncpp.com/cpp-tutorial/constexpr-functions/).

The key thing to take away from this introduction is that a constexpr function may be called in constant expressions.

You will see constexpr functions used in some future examples (where appropriate), but we will not expect you to understand them further or write your own constexpr functions until we’ve formally covered the topic.