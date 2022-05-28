---
title: 4.2 - Void
alias: 4.2 - Void
origin: /void/
origin_title: "4.2 — Void"
time: 2021-5-24
type: translation
tags:
- void
---

Void is the easiest of the data types to explain. Basically, void means “no type”!

Consequentially, variables can not be defined with a type of void:

```cpp
void value; // won't work, variables can't be defined with a void type
```

COPY

Void is typically used in several different contexts.

## Functions that do not return a value

Most commonly, _void_ is used to indicate that a function does not return a value:

```cpp
void writeValue(int x) // void here means no return value
{
    std::cout << "The value of x is: " << x << '\n';
    // no return statement, because this function doesn't return a value
}
```

COPY

If you use a return statement to try to return a value in such a function, a compile error will result:

```cpp
void noReturn(int x) // void here means no return value
{
    return 5; // error
}
```

COPY

On Visual Studio 2017, this produced the error:

error C2562: 'noReturn': 'void' function returning a value

## Deprecated: Functions that do not take parameters

In C, void is used as a way to indicate that a function does not take any parameters:

```cpp
int getValue(void) // void here means no parameters
{
    int x{};
    std::cin >> x;
    return x;
}
```

COPY

Although this will compile in C++ (for backwards compatibility reasons), this use of keyword _void_ is considered deprecated in C++. The following code is equivalent, and preferred in C++:

```cpp
int getValue() // empty function parameters is an implicit void
{
    int x{};
    std::cin >> x;
    return x;
}
```

COPY

!!! success "最佳实践"

	Use an empty parameter list instead of _void_ to indicate that a function has no parameters.

## Other uses of void

The void keyword has a third (more advanced) use in C++ that we cover in section [11.14 -- Void pointers](https://www.learncpp.com/cpp-tutorial/void-pointers/). Since we haven’t covered what a pointer is yet, you don’t need to worry about this case for now.

Let’s move on!