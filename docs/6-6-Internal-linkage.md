---
title: 6.6 - 内部链接
alias: 6.6 - 内部链接
origin: /cpp-tutorial/internal-linkage/
origin_title: "6.6 — Internal linkage"
time: 2020-9-19
type: translation
tags:
- linkage
---


In lesson [[6-3-Local-variables|6.3 - 局部变量]], we said, “An identifier’s linkage determines whether other declarations of that name refer to the same object or not”, and we discussed how local variables have `no linkage`.

Global variable and functions identifiers can have either `internal linkage` or `external linkage`. We’ll cover the internal linkage case in this lesson, and the external linkage case in lesson [6.7 -- External linkage and variable forward declarations](https://www.learncpp.com/cpp-tutorial/external-linkage-and-variable-forward-declarations/).

An identifier with internal linkage can be seen and used within a single file, but it is not accessible from other files (that is, it is not exposed to the linker). This means that if two files have identically named identifiers with internal linkage, those identifiers will be treated as independent.

Global variables with internal linkage

Global variables with internal linkage are sometimes called internal variables.

To make a non-constant global variable internal, we use the `static` keyword.

```cpp
static int g_x; // non-constant globals have external linkage by default, but can be given internal linkage via the static keyword

const int g_y { 1 }; // const globals have internal linkage by default
constexpr int g_z { 2 }; // constexpr globals have internal linkage by default

int main()
{
    return 0;
}
```

COPY

Const and constexpr global variables have internal linkage by default (and thus don’t need the `static` keyword -- if it is used, it will be ignored).

Here’s an example of multiple files using internal variables:

a.cpp:

```cpp
constexpr int g_x { 2 }; // this internal g_x is only accessible within a.cpp
```

COPY

main.cpp:

```cpp
#include <iostream>

static int g_x { 3 }; // this separate internal g_x is only accessible within main.cpp

int main()
{
    std::cout << g_x << '\n'; // uses main.cpp's g_x, prints 3

    return 0;
}
```

COPY

This program prints:

3

Because `g_x` is internal to each file, `main.cpp` has no idea that `a.cpp` also has a variable named `g_x` (and vice versa).

For advanced readers

The use of the `static` keyword above is an example of a storage class specifier, which sets both the name’s linkage and its storage duration (but not its scope). The most commonly used `storage class specifiers` are `static`, `extern`, and `mutable`. The term `storage class specifier` is mostly used in technical documentations.

The one-definition rule and internal linkage

In lesson [2.7 -- Forward declarations and definitions](https://www.learncpp.com/cpp-tutorial/forward-declarations/), we noted that the one-definition rule says that an object or function can’t have more than one definition, either within a file or a program.

However, it’s worth noting that internal objects (and functions) that are defined in different files are considered to be independent entities (even if their names and types are identical), so there is no violation of the one-definition rule. Each internal object only has one definition.

Functions with internal linkage

Because linkage is a property of an identifier (not of a variable), function identifiers have the same linkage property that variable identifiers do. Functions default to external linkage (which we’ll cover in the next lesson), but can be set to internal linkage via the `static` keyword:

add.cpp:

```cpp
// This function is declared as static, and can now be used only within this file
// Attempts to access it from another file via a function forward declaration will fail
static int add(int x, int y)
{
    return x + y;
}
```

COPY

main.cpp:

```cpp
#include <iostream>

int add(int x, int y); // forward declaration for function add

int main()
{
    std::cout << add(3, 4) << '\n';

    return 0;
}
```

COPY

This program won’t link, because function `add` is not accessible outside of `add.cpp`.

Quick Summary

```cpp
// Internal global variables definitions:
static int g_x;          // defines non-initialized internal global variable (zero initialized by default)
static int g_x{ 1 };     // defines initialized internal global variable

const int g_y { 2 };     // defines initialized internal global const variable
constexpr int g_y { 3 }; // defines initialized internal global constexpr variable

// Internal function definitions:
static int foo() {};     // defines internal function
```

COPY

We provide a comprehensive summary in lesson [6.11 -- Scope, duration, and linkage summary](https://www.learncpp.com/cpp-tutorial/scope-duration-and-linkage-summary/).