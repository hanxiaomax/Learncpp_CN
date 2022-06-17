---
title: 6.13 - 内联函数
alias: 6.13 - 内联函数
origin: /inline-functions/
origin_title: "6.13 — Inline functions"
time: 2022-1-2
type: translation
tags:
- inline
---

Consider the case where you need to write some code to perform some discrete task, like reading input from the user, or outputting something to a file, or calculating a particular value. When implementing this code, you essentially have two options:

1.  Write the code as part of an existing function (called writing code “in-place” or “inline”).
2.  Create a function (and possibly sub-functions) to handle the task.

Writing functions provides many potential benefits, as code in a function:

-   Is easier to read and understand in the context of the overall program.
-   Is easier to use, as you can call the function without understanding how it is implemented.
-   Is easier to update, as the code in a function can be updated in one place.
-   Is easier to reuse, as functions are naturally modular.

However, one downside of using a function is that every time a function is called, there is a certain amount of performance overhead that occurs. Consider the following example:

```cpp
#include <iostream>

int min(int x, int y)
{
    return (x < y) ? x : y;
}

int main()
{
    std::cout << min(5, 6) << '\n';
    std::cout << min(3, 2) << '\n';
    return 0;
}
```

COPY

When a call to `min()` is encountered, the CPU must store the address of the current instruction it is executing (so it knows where to return to later) along with the values of various CPU registers (so they can be restored upon returning). Then parameters `x` and `y` must be instantiated and then initialized. Then the execution path has to jump to the code in the `min()` function. When the function ends, the program has to jump back to the location of the function call, and the return value has to be copied so it can be output. In other words, there is a significant amount of overhead cost that is incurred with each function call.

For functions that are large and/or perform complex tasks, the overhead of the function call is typically insignificant compared to the amount of time the function takes to run. However, for small functions (such as `min()` above), the overhead costs can be larger than the time needed to actually execute the function’s code! In cases where a small function is called often, using a function can result in a significant performance penalty over writing the same code in-place.

## 内联表达式

Fortunately, the C++ compiler has a trick that it can use to avoid such overhead cost: Inline expansion is a process where a function call is replaced by the code from the called function’s definition.

For example, if the compiler expanded the `min()` calls in the above example, the resulting code would look like this:

```cpp
#include <iostream>

int main()
{
    std::cout << ((5 < 6) ? 5 : 6) << '\n';
    std::cout << ((3 < 2) ? 3 : 2) << '\n';
    return 0;
}
```

COPY

Note that the two calls to function `min()` have been replaced by the code in the body of the `min()` function (with the value of the arguments substituted for the parameters). This allows us to avoid the overhead of those calls, while preserving the results of the code.

## 内联代码的性能

Beyond removing the cost of function call overhead, inline expansion can also allow the compiler to optimize the resulting code more efficiently -- for example, because the expression `((5 < 6) ? 5 : 6)` is now a compile-time constant, the compiler could further optimize the first statement in `main()` to `std::cout << 5 << '\n';`.

However, inline expansion has its own potential cost: if the body of the function being expanded takes more instructions than the function call being replaced, then each inline expansion will cause the executable to grow larger. Larger executables tend to be slower (due to not fitting as well in caches).

The decision about whether a function would benefit from being made inline (because removal of the function call overhead outweighs the cost of a larger executable) is not straightforward. Inline expansion could result in performance improvements, performance reductions, or no change to performance at all, depending on the relative cost of a function call, the size of the function, and what other optimizations can be performed.

Inline expansion is best suited to simple, short functions (e.g. no more than a few statements), especially cases where a single function call is executed more than once (e.g. function calls inside a loop).

## 内联代码的展开时机

Every function falls into one of three categories, where calls to the function:

-   Must be expanded.
-   May be expanded (most functions are in this category).
-   Can’t be expanded.

A function that is eligible to have its function calls expanded is called an inline function.

Most functions fall into the “may” category: their function calls can be expanded if and when it is beneficial to do so. For functions in this category, a modern compiler will assess each function and each function call to make a determination about whether that particular function call would benefit from inline expansion. A compiler might decide to expand none, some, or all of the function calls to a given function.

!!! tip "小贴士"

	Modern optimizing compilers make the decision about when functions should be expanded inline.

!!! info "扩展阅读"

    Some types of functions are implicitly treated as inline functions. These include:

-   Functions defined inside a class, struct, or union type definition.
-   Constexpr / consteval functions [[6-14-Constexpr-and-consteval-functions|6.14 - Constexpr 和 consteval 函数]]

## 历史上的 inline 关键字

Historically, compilers either didn’t have the capability to determine whether inline expansion would be beneficial, or were not very good at it. For this reason, C++ provides the keyword `inline`, which was intended to be used as a hint to the compiler that a function would benefit from being expanded inline:

```cpp
#include <iostream>

inline int min(int x, int y) // hint to the compiler that it should do inline expansion of this function
{
    return (x < y) ? x : y;
}

int main()
{
    std::cout << min(5, 6) << '\n';
    std::cout << min(3, 2) << '\n';
    return 0;
}
```

COPY

This is where the term “inline function” comes from (because such functions had the `inline` specifier as part of the declaration syntax of the function).

However, in modern C++, the `inline` keyword is no longer used to request that a function be expanded inline. There are quite a few reasons for this:

-   Using `inline` to request inline expansion is a form of premature optimization, and misuse could actually harm performance.
-   The `inline` keyword is just a hint -- the compiler is completely free to ignore a request to inline a function. This is likely to be the result if you try to inline a lengthy function! The compiler is also free to perform inline expansion of functions that do not use the `inline` keyword as part of its normal set of optimizations.
-   The `inline` keyword is defined at the wrong level of granularity. We use the `inline` keyword on a function declaration, but inline expansion is actually determined per function call. It may be beneficial to expand some function calls and detrimental to expand others, and there is no syntax to affect this.

Modern optimizing compilers are typically very good at determining which functions should be made inline -- better than humans in most cases. As a result, the compiler will likely ignore or devalue any request you make to `inline` a function anyway.

!!! success "最佳实践"

	Do not use the `inline` keyword to request inline expansion for your functions.

## 现代 inline 关键字

In previous chapters, we mentioned that you should not implement functions (with external linkage) in header files, because when those headers are included into multiple .cpp files, the function definition will be copied into multiple .cpp files. These files will then be compiled, and the linker will throw an error because it will note that you’ve defined the same function more than once, which is a violation of the one-definition rule.

In lesson [[6-9-Sharing-global-constants-across-multiple-files-using-inline-variables|6.9 - 使用 inline 变量共享全局常量]], we noted that in modern C++, the `inline` concept has evolved to have a new meaning: multiple definitions are allowed in the program. This is true for functions as well as variables. Thus, if we mark a function as inline, then that function is allowed to have multiple definitions (in different files), as long as those definitions are identical.

In order to do inline expansion, the compiler needs to be able to see the full definition of an inline function wherever the function is called. Therefore, inline functions are typically defined in header files, where they can be `#included` into any code file that needs to see the full definition of the function.


!!! tldr "关键信息"

	The compiler needs to be able to see the full definition of an inline function wherever it is called.

For the most part, you should not mark your functions as inline, but we’ll see examples in the future where this is useful.

!!! success "最佳实践"

	Avoid the use of the `inline` keyword for functions unless you have a specific, compelling reason to do so.