---
title: F-2-constexpr-functions-part-2
aliases: F-2-constexpr-functions-part-2
origin: 
origin_title: F-2-constexpr-functions-part-2
time: 2025-04-01 
type: translation-under-construction
tags:
---
# F.2 — Constexpr functions (part 2)

[*Alex*](https://www.learncpp.com/author/Alex/ "View all posts by Alex")

November 26, 2024, 4:16 pm PST
December 10, 2024

Constexpr function calls in non-required constant expressions

You might expect that a constexpr function would evaluate at compile-time whenever possible, but unfortunately this is not the case.

In lesson [5.5 -- Constant expressions](https://www.learncpp.com/cpp-tutorial/constant-expressions/), we noted that in contexts that do not *require* a constant expression, the compiler may choose whether to evaluate a constant expression at either compile-time or at runtime. Accordingly, any constexpr function call that is part of a non-required constant expression may be evaluated at either compile-time or runtime.

For example:

```cpp
#include <iostream>

constexpr int getValue(int x)
{
    return x;
}

int main()
{
    int x { getValue(5) }; // may evaluate at runtime or compile-time
    
    return 0;
}
```

In the above example, because `getValue()` is constexpr, the call `getValue(5)` is a constant expression. However, because variable `x` is not constexpr, it does not require a constant expression initializer. So even though we’ve provided a constant expression initializer, the compiler is free to choose whether `getValue(5)` evaluates at runtime or compile-time.

Key insight

Compile-time evaluation of constexpr functions is only guaranteed when a constant expression is required.

Diagnosis of constexpr functions in required constant expressions

The compiler is *not* required to determine whether a constexpr function is evaluatable at compile-time until it is actually evaluated at compile-time. It is fairly easy to write a constexpr function that compiles successfully for runtime use, but then fails to compile when evaluated at compile-time.

As a silly example of this:

```cpp
#include <iostream>

int getValue(int x)
{
    return x;
}

// This function can be evaluated at runtime
// When evaluated at compile-time, the function will produce a compilation error
// because the call to getValue(x) cannot be resolved at compile-time
constexpr int foo(int x)
{
    if (x < 0) return 0; // needed prior to adoption of P2448R1 in C++23 (see note below)
    return getValue(x);  // call to non-constexpr function here
}

int main()
{
    int x { foo(5) };           // okay: will evaluate at runtime
    constexpr int y { foo(5) }; // compile error: foo(5) can't evaluate at compile-time

    return 0;
}
```

In the above example, when `foo(5)` is used as an initializer for non-constexpr variable `x`, it will be evaluated at runtime. This works fine, and returns the value `5`.

However, when `foo(5)`, is used as an initializer for constexpr variable `y`, it must be evaluated at compile-time. At that point, the compiler will determine that the call to `foo(5)` can’t be evaluated at compile-time, as `getValue()` is not a constexpr function.

Therefore, when writing a constexpr function, always explicitly test that it compiles when evaluated at compile-time (by calling it in a context where a constant expression is required, such as in the initialization of a constexpr variable).

Best practice

All constexpr functions should be evaluatable at compile-time, as they will be required to do so in contexts that require a constant expression.

Always test your constexpr functions in a context that requires a constant expression, as the constexpr function may work when evaluated at runtime but fail when evaluated at compile-time.

For advanced readers

Prior to C++23, if no argument values exist that would allow a constexpr function to be evaluated at compile-time, the program is ill-formed (no diagnostic required). Without the line `if (x < 0) return 0`, the above example would contain no set of arguments that allow the function to be evaluatable at compile-time, making the program ill-formed. Given that no diagnostic is required, the compiler may not enforce this.

This requirement was revoked in C++23 ([P2448R1](https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2022/p2448r1.html)).

Constexpr/consteval function parameters are not constexpr

The parameters of a constexpr function are not implicitly constexpr, nor may they be declared as `constexpr`.

Key insight

A constexpr function parameter would imply the function could only be called with a constexpr argument. But this is not the case -- constexpr functions can be called with non-constexpr arguments when the function is evaluated at runtime.

Because such parameters are not constexpr, they cannot be used in constant expressions within the function.

```cpp
consteval int goo(int c)    // c is not constexpr, and cannot be used in constant expressions
{
    return c;
}

constexpr int foo(int b)    // b is not constexpr, and cannot be used in constant expressions
{
    constexpr int b2 { b }; // compile error: constexpr variable requires constant expression initializer

    return goo(b);          // compile error: consteval function call requires constant expression argument
}

int main()
{
    constexpr int a { 5 };

    std::cout << foo(a); // okay: constant expression a can be used as argument to constexpr function foo()
    
    return 0;
}
```

In the above example, function parameter `b` is not constexpr (even though argument `a` is a constant expression). This means `b` cannot be used anywhere a constant expression is required, such as the the initializer for a constexpr variable (e.g. `b2`) or in a call to a consteval function (`goo(b)`).

The parameters of constexpr functions may be declared as `const`, in which case they are treated as runtime constants.

Related content

If you need parameters that are constant expressions, see [11.9 -- Non-type template parameters](https://www.learncpp.com/cpp-tutorial/non-type-template-parameters/).

Constexpr functions are implicitly inline

When a constexpr function is evaluated at compile-time, the compiler must be able to see the full definition of the constexpr function prior to such function calls (so it can perform the evaluation itself). A forward declaration will not suffice in this case, even if the actual function definition appears later in the same compilation unit.

This means that a constexpr function called in multiple files needs to have its definition included into each translation unit -- which would normally be a violation of the one-definition rule. To avoid such problems, constexpr functions are implicitly inline, which makes them exempt from the one-definition rule.

As a result, constexpr functions are often defined in header files, so they can be #included into any .cpp file that requires the full definition.

Rule

The compiler must be able to see the full definition of a constexpr (or consteval) function, not just a forward declaration.

Best practice

Constexpr/consteval functions used in a single source file (.cpp) should be defined in the source file above where they are used.

Constexpr/consteval functions used in multiple source files should be defined in a header file so they can be included into each source file.

For constexpr function calls that are only evaluated at runtime, a forward declaration is sufficient to satisfy the compiler. This means you can use a forward declaration to call a constexpr function defined in another translation unit, but only if you invoke it in a context that does not require compile-time evaluation.

For advanced readers

Per [CWG2166](https://www.open-std.org/jtc1/sc22/wg21/docs/cwg_active.html#2166), the actual requirement for the forward declaration of constexpr functions that are evaluated at compile-time is that “the constexpr function must be defined prior to the outermost evaluation that eventually results in the invocation”. Therefore, this is allowed:

```cpp
#include <iostream>

constexpr int foo(int);

constexpr int goo(int c)
{
	return foo(c);   // note that foo is not defined yet
}

constexpr int foo(int b) // okay because foo is still defined before any calls to goo
{
	return b;
}

int main()
{
	 constexpr int a{ goo(5) }; // this is the outermost invocation

	return 0;
}
```

The intent here is to allow for mutually recursive constexpr functions (where two constexpr functions call each other), which would not be possible otherwise.

Recap

Marking a function as `constexpr` means it can be used in a constant expression. It does not mean “will evaluate at compile-time”.

A constant expression (which may contain constexpr function calls) is only required to evaluate at compile-time in contexts where a constant expression is required.

In contexts that do not require a constant expression, the compiler may choose whether to evaluate a constant expression (which may contain constexpr function calls) at compile-time or at runtime.

A runtime (non-constant) expression (which may contain constexpr function calls or non-constexpr function calls) will evaluate at runtime.

Another example

Let’s do another examine to explore how a constexpr function is required or likely to evaluate further:

```cpp
#include <iostream>

constexpr int greater(int x, int y)
{
    return (x > y ? x : y);
}

int main()
{
    constexpr int g { greater(5, 6) };              // case 1: always evaluated at compile-time
    std::cout << g << " is greater!\n";

    std::cout << greater(5, 6) << " is greater!\n"; // case 2: may be evaluated at either runtime or compile-time

    int x{ 5 }; // not constexpr but value is known at compile-time
    std::cout << greater(x, 6) << " is greater!\n"; // case 3: likely evaluated at runtime

    std::cin >> x;
    std::cout << greater(x, 6) << " is greater!\n"; // case 4: always evaluated at runtime

    return 0;
}
```

In case 1, we’re calling `greater()` in a context that requires a constant expression. Thus `greater()` must be evaluated at compile-time.

In case 2, the `greater()` function is being called in a context that does not require a constant expression, as output statements must execute at runtime. However, since the arguments are constant expressions, the function is eligible to be evaluated at compile-time. Thus the compiler is free to choose whether this call to `greater()` will be evaluated at compile-time or runtime.

In case 3, we’re calling `greater()` with one argument that is not a constant expression. So this will typically execute at runtime.

However, this argument has a value that is known at compile-time. Under the as-if rule, the compiler could decide to treat the evaluation of `x` as a constant expression, and evaluate this call to `greater()` at compile-time. But more likely, it will evaluate it at runtime.

Related content

We cover the as-if rule in lesson [5.5 -- Constant expressions](https://www.learncpp.com/cpp-tutorial/constant-expressions/).

Note that even non-constexpr functions could be evaluated at compile-time under the as-if rule!

In case 4, the value of argument `x` can’t be known at compile-time, so this call to `greater()` will always evaluate at runtime.

Key insight

Put another way, we can categorize the likelihood that a function will actually be evaluated at compile-time as follows:

Always (required by the standard):

- Constexpr function is called where constant expression is required.
- Constexpr function is called from other function being evaluated at compile-time.

Probably (there’s little reason not to):

- Constexpr function is called where constant expression isn’t required, all arguments are constant expressions.

Possibly (if optimized under the as-if rule):

- Constexpr function is called where constant expression isn’t required, some arguments are not constant expressions but their values are known at compile-time.
- Non-constexpr function capable of being evaluated at compile-time, all arguments are constant expressions.

Never (not possible):

- Constexpr function is called where constant expression isn’t required, some arguments have values that are not known at compile-time.

Note that your compiler’s optimization level setting may have an impact on whether it decides to evaluate a function at compile-time or runtime. This also means that your compiler may make different choices for debug vs. release builds (as debug builds typically have optimizations turned off).

For example, both gcc and Clang will not compile-time evaluate a constexpr function called where a constant expression isn’t required unless the compiler told to optimize the code (e.g. using the `-O2` compiler option).

For advanced readers

The compiler might also choose to inline a function call, or even optimize a function call away entirely. Both of these can affect when (or if) the content of the function call are evaluated.

\[Next lesson

F.3Constexpr functions (part 3) and consteval\](https://www.learncpp.com/cpp-tutorial/constexpr-functions-part-3-and-consteval/)
[Back to table of contents](/)
\[Previous lesson

F.1Constexpr functions\](https://www.learncpp.com/cpp-tutorial/constexpr-functions/)

*Previous Post*[5.4 — The as-if rule and compile-time optimization](https://www.learncpp.com/cpp-tutorial/the-as-if-rule-and-compile-time-optimization/)

*Next Post*[F.3 — Constexpr functions (part 3) and consteval](https://www.learncpp.com/cpp-tutorial/constexpr-functions-part-3-and-consteval/)

\[wpDiscuz\](javascript:void(0);)

Insert

You are going to send email to

Send

Move Comment

Move
