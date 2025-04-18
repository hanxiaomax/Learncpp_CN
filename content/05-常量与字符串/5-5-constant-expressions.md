---
title: 5-5-constant-expressions
aliases: 5-5-constant-expressions
origin: 
origin_title: 5-5-constant-expressions
time: 2025-04-01 
type: translation-under-construction
tags:
---

# 5.5 — Constant expressions

In lesson [1.10 -- Introduction to expressions](https://www.learncpp.com/cpp-tutorial/introduction-to-expressions/), we introduced expressions. By default, expressions evaluate at runtime. And in some cases, they must do so:

```cpp
std::cin >> x;
std::cout << 5 << '\n';
```

Because input and output can’t be performed at compile time, the expressions above are required to evaluate at runtime.

In prior lesson [5.4 -- The as-if rule and compile-time optimization](https://www.learncpp.com/cpp-tutorial/the-as-if-rule-and-compile-time-optimization/), we discussed the as-if rule, and how the compiler can optimize programs by shifting work from runtime to compile-time. Under the as-if rule, the compiler may choose whether to evaluate certain expressions at runtime or compile-time:

```cpp
const double x { 1.2 };
const double y { 3.4 };
const double z { x + y }; // x + y may evaluate at runtime or compile-time
```

The expression `x + y` would normally evaluate at runtime, but since the value of `x` and `y` are known at compile-time, the compiler may opt to perform compile-time evaluation instead and initialize `z` with the compile-time calculated value `4.6`.

In a few other cases, the C++ language requires an expression that can be evaluated at compile-time. For example, constexpr variables require an initializer that can be evaluated at compile-time:

```cpp
int main()
{
    constexpr int x { expr }; // Because variable x is constexpr, expr must be evaluatable at compile-time
}
```

In cases where a constant expression is required but one is not provided, the compiler will error and halt compilation.

We’ll discuss constexpr variables in the next lesson ([5.6 -- Constexpr variables](https://www.learncpp.com/cpp-tutorial/constexpr-variables/)), when we cover constexpr variables.

For advanced readers

A few common cases where a compile-time evaluatable expression is required:

- The initializer of a constexpr variable ([5.6 -- Constexpr variables](https://www.learncpp.com/cpp-tutorial/constexpr-variables/)).
- A non-type template argument ([11.9 -- Non-type template parameters](https://www.learncpp.com/cpp-tutorial/non-type-template-parameters/)).
- The defined length of a `std::array` ([17.1 -- Introduction to std::array](https://www.learncpp.com/cpp-tutorial/introduction-to-stdarray/)) or a C-style array ([17.7 -- Introduction to C-style arrays](https://www.learncpp.com/cpp-tutorial/introduction-to-c-style-arrays/)).

In this lesson, we’ll explore more of C++’s capabilities around compile-time evaluation, and look at how C++ differentiates this last case from the prior two cases.

The benefits of compile-time programming

While the as-if rule is great for improving performance, it leaves us reliant on the sophistication of the compiler to actually determine what can evaluate at compile-time. This means if there is a section of code we really want to execute at compile-time, it may or may not. That same code compiled on a different platform, or with a different compiler, or using different compilation options, or slightly modified, may produce a different result. Because the as-if rule is applied invisibly to us, we get no feedback from the compiler on what portions of code it decided to evaluate at compile-time, or why. Code we desire to be evaluated at compile-time may not even be eligible (due to a typo or misunderstanding), and we may never know.

To improve upon this situation, the C++ language provides ways for us to be explicit about what parts of code we want to execute at compile-time. The use of language features that result in compile-time evaluation is called **compile-time programming**.

These features can help improve software in a number of areas:

- Performance: Compile-time evaluation makes our programs smaller and faster. The more code we can ensure is capable of evaluating at compile-time, the more performance benefit we’ll see.
- Versatility: We can always use such code in places that require a compile-time value. Code that relies on the as-if rule to evaluate at compile-time can’t be used in such places (even if the compiler opts to evaluate that code at compile-time) -- this decision was made so that code that compiles today won’t stop compiling tomorrow, when the compiler decides to optimize differently.
- Predictability: We can have the compiler halt compilation if it determines that code cannot be executed at compile-time (rather than silently opting to have that code evaluate at runtime instead). This allows us to ensure a section of code we really want to execute at compile-time will.
- Quality: We can have the compiler reliably detect certain kinds of programming errors at compile-time, and halt the build if it encounters them. This is much more effective than trying to detect and gracefully handle those same errors at runtime.
- Quality: Perhaps most importantly, undefined behavior is not allowed at compile-time. If we do something that causes undefined behavior at compile-time, the compiler should halt the build and ask us to fix it. Note that this is a hard problem for compilers, and they may not catch all cases.

To summarize, compile-time evaluation allows us to write programs that are both more performant and of higher quality (more secure and less buggy)! So while compile-time evaluation does add some additional complexity to the language, the benefits can be substantial.

The following C++ features are the most foundational to compile-time programming:

- Constexpr variables (discussed in upcoming lesson [5.6 -- Constexpr variables](https://www.learncpp.com/cpp-tutorial/constexpr-variables/)).
- Constexpr functions (discussed in upcoming lesson [F.1 -- Constexpr functions](https://www.learncpp.com/cpp-tutorial/constexpr-functions/)).
- Templates (introduced in lesson [11.6 -- Function templates](https://www.learncpp.com/cpp-tutorial/function-templates/)).
- static_assert (discussed in lesson [9.6 -- Assert and static_assert](https://www.learncpp.com/cpp-tutorial/assert-and-static_assert/)).

All of these features have one thing in common: they make use of constant expressions.

Constant expressions

Perhaps surprisingly, the C++ standard barely mentions “compile-time” at all. Instead, the standard defines a “constant expression”, which is an expression that must be evaluatable at compile-time, along with rules that determine how the compiler should handle these expressions. Constant expressions form the backbone of compile-time evaluation in C++.

In lesson [1.10 -- Introduction to expressions](https://www.learncpp.com/cpp-tutorial/introduction-to-expressions/), we defined an expression as “a non-empty sequence of literals, variables, operators, and function calls”. A **constant expression** is a non-empty sequence of literals, constant variables, operators, and function calls, all of which must be evaluatable at compile-time. The key difference is that in a constant expression, each part of the expression must be evaluatable at compile-time.

Key insight

In a constant expression, each part of the expression must be evaluatable at compile-time.

An expression that is not a constant expression is often called a non-constant expression, and may informally be called a **runtime expression** (as such expressions typically evaluate at runtime).

Optional reading

The C++20 language standard (in section [expr.const]) states “Constant expressions can be evaluated during translation”. As we covered in lesson [2.10 -- Introduction to the preprocessor](https://www.learncpp.com/cpp-tutorial/introduction-to-the-preprocessor/), translation is the whole process of building a program (that includes preprocessing, compiling, and linking). Therefore, in a compiled program, constant expressions can be evaluated as part of the compilation process. In an interpreted program, translation happens at runtime.

Since C++ programs are typically compiled, we’ll proceed under the assumption that constant expressions can be evaluated at compile-time.

What can be in a constant expression?

Author’s note

In technical terms, constant expressions are quite complex. In this section, we’ll go into a little bit deeper into what they can and can’t contain. You do not need to remember most of this. If a constant expression is required somewhere and you do not provide one, the compiler will happily point out your mistake, and you can fix it at that point.

Most commonly, constant expressions contain the following:

- Literals (e.g. ‘5’, ‘1.2’)
- Most operators with constant expression operands (e.g. `3 + 4`, `2 * sizeof(int)`).
- Const integral variables with a constant expression initializer (e.g. `const int x { 5 };`). This is a historical exception -- in modern C++, constexpr variables are preferred.
- Constexpr variables (discussed in upcoming lesson [5.6 -- Constexpr variables](https://www.learncpp.com/cpp-tutorial/constexpr-variables/)).
- Constexpr function calls with constant expression arguments (see [F.1 -- Constexpr functions](https://www.learncpp.com/cpp-tutorial/constexpr-functions/)).

For advanced readers

Constant expressions can also contain:

- Non-type template parameters (see [11.9 -- Non-type template parameters](https://www.learncpp.com/cpp-tutorial/non-type-template-parameters/)).
- Enumerators (see [13.2 -- Unscoped enumerations](https://www.learncpp.com/cpp-tutorial/unscoped-enumerations/)).
- Type traits (see the [cppreference page for type traits](https://en.cppreference.com/w/cpp/header/type_traits)).
- Constexpr lambda expressions (see [20.6 -- Introduction to lambdas (anonymous functions)](https://www.learncpp.com/cpp-tutorial/introduction-to-lambdas-anonymous-functions/)).

Tip

Notably, the following cannot be used in a constant expression:

- Non-const variables.
- Const non-integral variables, even when they have a constant expression initializer (e.g. `const double d { 1.2 };`). To use such variables in a constant expression, define them as constexpr variables instead (see lesson [5.6 -- Constexpr variables](https://www.learncpp.com/cpp-tutorial/constexpr-variables/)).
- The return values of non-constexpr functions (even when the return expression is a constant expression).
- Function parameters (even when the function is constexpr).
- Operators with operands that are not constant expressions (e.g. `x + y` when `x` or `y` is not a constant expression, or `std::cout << "hello\n"` as `std::cout` is not a constant expression).
- Operators `new`, `delete`, `throw`, `typeid`, and `operator,` (comma).

An expression containing any of the above is a runtime expression.

Related content

For the precise definition of a constant expression, see the [cppreference page for constant expression](https://en.cppreference.com/w/cpp/language/constant_expression). Note that a constant expression is defined by what kind of expression it is not. That means we’re left to infer what it is. Good luck with that!

Nomenclature

When discussing constant expressions, it is common to use one of two phrasings:

- “X is usable in a constant expression” is often used when emphasizing what X is. e.g. “`5` is usable in a constant expression” emphasizes that the literal `5` can be used in a constant expression.
- “X is a constant expression” is sometimes used when emphasizing that the full expression (consisting of X) is a constant expression. e.g. “`5` is a constant expression” emphasizes that the expression `5` is a constant expression.

The latter can sound awkward when phrased like “literals are constant expressions” (because they are actually values). But it simply means that an expression consisting of a literal is a constant expression.

As an aside…

When constant expressions were defined, `const` integral types were grandfathered in because they were already being treated as constant expressions within the language.

The committee discussed whether `const` non-integral types with a constant expression initializer should also be treated as constant expressions (for consistency with the `const` integral types case). Ultimately, they decided not to, in order to promote more consistent usage of `constexpr`.

Examples of constant and non-constant expressions

In the following program, we look at some expression statements and indicate whether each expression is a constant expression or runtime expression:

```cpp
#include <iostream>

int getNumber()
{
    std::cout << "Enter a number: ";
    int y{};
    std::cin >> y; // can only execute at runtime

    return y;      // this return expression is a runtime expression
}

// The return value of a non-constexpr function is a runtime expression
// even when the return expression is a constant expression
int five()
{
    return 5;      // this return expression is a constant expression
}

int main()
{
    // Literals can be used in constant expressions
    5;                           // constant expression            
    1.2;                         // constant expression
    "Hello world!";              // constant expression

    // Most operators that have constant expression operands can be used in constant expressions
    5 + 6;                       // constant expression
    1.2 * 3.4;                   // constant expression
    8 - 5.6;                     // constant expression (even though operands have different types)
    sizeof(int) + 1;             // constant expression (sizeof can be determined at compile-time)

    // The return values of non-constexpr functions can only be used in runtime expressions
    getNumber();                 // runtime expression
    five();                      // runtime expression (even though the return expression is a constant expression)

    // Operators without constant expression operands can only be used in runtime expressions
    std::cout << 5;              // runtime expression (std::cout isn't a constant expression operand)

    return 0;
}
```

In the following snippet, we define a bunch of variables, and indicate whether they can be used in constant expressions:

```cpp
    // Const integral variables with a constant expression initializer can be used in constant expressions:
    const int a { 5 };           // a is usable in constant expressions
    const int b { a };           // b is usable in constant expressions (a is a constant expression per the prior statement)
    const long c { a + 2 };      // c is usable in constant expressions (operator+ has constant expression operands)

    // Other variables cannot be used in constant expressions (even when they have a constant expression initializer):
    int d { 5 };                 // d is not usable in constant expressions (d is non-const)
    const int e { d };           // e is not usable in constant expressions (initializer is not a constant expression)
    const double f { 1.2 };      // f is not usable in constant expressions (not a const integral variable)
```

When constant expressions are evaluated at compile-time

Since constant expressions are always capable of being evaluated at compile-time, you may have assumed that constant expressions will always be evaluated at compile-time. Counterintuitively, this is not the case.

The compiler is only *required* to evaluate constant expressions at compile-time in contexts that *require* a constant expression.

Nomenclature

The technical name for an expression that must be evaluated at compile-time is a **manifestly constant-evaluated expression**. You will likely only encounter this term in technical documentation.

In contexts that do not require a constant expression, the compiler may choose whether to evaluate a constant expression at compile-time or at runtime.

```cpp
const int x { 3 + 4 }; // constant expression 3 + 4 must be evaluated at compile-time
int y { 3 + 4 };       // constant expression 3 + 4 may be evaluated at compile-time or runtime
```

Variable `x` has type `const int` and a constant expression initializer, `x` is usable in a constant expression. Its initializer must be evaluated at compile-time (otherwise the value of `x` wouldn’t be known at compile-time, and `x` wouldn’t be usable in a constant expression). On the other hand, variable `y` is non-const, so `y` is not usable in a constant expression. Even though its initializer is a constant expression, the compiler can decide to evaluate the initializer at compile-time or runtime.

Even when not required to do so, modern compilers will *usually* evaluate a constant expression at compile-time when optimizations are enabled.

Key insight

The compiler is only *required* to evaluate constant expressions at compile-time in contexts that *require* a constant expression. It may or may not do so in other cases.

Tip

The likelihood that an expression is fully evaluated at compile-time can be categorized as follows:

- Never: A non-constant expression where the compiler is not able to determine all values at compile-time.
- Possibly: A non-constant expression where the compiler is able to determine all values at compile-time (optimized under the as-if rule).
- Likely: A constant expression used in a context that does not require a constant expression.
- Always: A constant expression used in a context that requires a constant expression.

For advanced readers

So why doesn’t C++ require all constant expressions to be evaluated at compile-time? There are at least two good reasons:

1. Compile-time evaluation makes debugging harder. If our code has a buggy calculation that is evaluated at compile-time, we have limited tools to diagnose the issue. Allowing non-required constant expressions to be evaluated at runtime (typically when optimizations are turned off) enables runtime debugging of our code. Being able to step through and inspect the state of our programs while they are running can make finding bugs easier.
1. To provide the compiler with the flexibility to optimize as it sees fit (or as influenced by compiler options). For example, a compiler might want to offer an option that defers all non-required constant expression evaluation to runtime, in order to improve compile times for developers.

Why compile-time expressions must be constant Optional

You may be wondering why compile-time expressions can only contain constant objects (and operators and functions that can evaluate at compile-time to constants).

Consider the following program:

```cpp
#include <iostream>

int main()
{
    int x { 5 };
    // x is known to the compiler at this point

    std::cin >> x; // read in value of x from user
    // x is no longer known to the compiler

    return 0;
}
```

To start, `x` is initialized with value `5`. The value of `x` is known to the compiler at this point. But then `x` is assigned a value from the user. The compiler can’t know what value the user will provide at compile-time, so beyond this point, the value of `x` is not known to the compiler. Thus, the expression `x` is not always evaluatable at compile-time, violating the requirement that such an expression must always be capable of being evaluated at compile-time.

Because constants cannot have their values changed, a constant variable whose initializer is evaluatable at compile-time will always have a value that is known at compile-time. This keeps things simple.

While the language designers could have defined a compile-time expression as one whose values are all currently known at compile-time (rather than an expression that must always be capable of being evaluated at compile-time), this would have added significant complexity to the compiler (as the compiler would now be responsible for determining when every variable could be changed to a value not known at compile-time). Adding a single line of code (such as `std::cin >> x`) could break the program elsewhere (if `x` was being used in any context that required a value known at compile-time).