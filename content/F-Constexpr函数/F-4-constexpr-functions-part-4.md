---
title: F-4-constexpr-functions-part-4
aliases: F-4-constexpr-functions-part-4
origin: 
origin_title: F-4-constexpr-functions-part-4
time: 2025-04-01 
type: translation-under-construction
tags:
---
# F.4 — Constexpr functions (part 4)

[*Alex*](https://www.learncpp.com/author/Alex/ "View all posts by Alex")

November 26, 2024, 4:49 pm PST
March 17, 2025

Constexpr/consteval functions can use non-const local variables

Within a constexpr or consteval function, we can use local variables that are not constexpr, and the value of these variables can be changed.

As a silly example:

```cpp
#include <iostream>

consteval int doSomething(int x, int y) // function is consteval
{
    x = x + 2;       // we can modify the value of non-const function parameters

    int z { x + y }; // we can instantiate non-const local variables
    if (x > y)
        z = z - 1;   // and then modify their values

    return z;
}

int main()
{
    constexpr int g { doSomething(5, 6) };
    std::cout << g << '\n';

    return 0;
}
```

When such functions are evaluated at compile-time, the compiler will essentially “execute” the function and return the calculated value.

Constexpr/consteval functions can use function parameters and local variables as arguments in constexpr function calls

Above, we noted, “When a constexpr (or consteval) function is being evaluated at compile-time, any other functions it calls are required to be evaluated at compile-time.”

Perhaps surprisingly, a constexpr or consteval function can use its function parameters (which aren’t constexpr) or even local variables (which may not be const at all) as arguments in a constexpr function call. When a constexpr or consteval function is being evaluated at compile-time, the value of all function parameters and local variables must be known to the compiler (otherwise it couldn’t evaluate them at compile-time). Therefore, in this specific context, C++ allows these values to be used as arguments in a call to a constexpr function, and that constexpr function call can still be evaluated at compile-time.

```cpp
#include <iostream>

constexpr int goo(int c) // goo() is now constexpr
{
    return c;
}

constexpr int foo(int b) // b is not a constant expression within foo()
{
    return goo(b);       // if foo() is resolved at compile-time, then `goo(b)` can also be resolved at compile-time
}

int main()
{
    std::cout << foo(5);
    
    return 0;
}
```

In the above example, `foo(5)` may or may not be evaluated at compile time. If it is, then the compiler knows that `b` is `5`. And even though `b` is not constexpr, the compiler can treat the call to `goo(b)` as if it were `goo(5)` and evaluate that function call at compile-time. If `foo(5)` is instead resolved at runtime, then `goo(b)` will also be resolved at runtime.

Can a constexpr function call a non-constexpr function?

The answer is yes, but only when the constexpr function is being evaluated in a non-constant context. A non-constexpr function may not be called when a constexpr function is evaluating in a constant context (because then the constexpr function wouldn’t be able to produce a compile-time constant value), and doing so will produce a compilation error.

Calling a non-constexpr function is allowed so that a constexpr function can do something like this:

```cpp
#include <type_traits> // for std::is_constant_evaluated

constexpr int someFunction()
{
    if (std::is_constant_evaluated()) // if evaluating in constant context
        return someConstexprFcn();
    else
        return someNonConstexprFcn();
}
```

Now consider this variant:

```cpp
constexpr int someFunction(bool b)
{
    if (b)
        return someConstexprFcn();
    else
        return someNonConstexprFcn();
}
```

This is legal as long as `someFunction(false)` is never called in a constant expression.

As an aside…

Prior to C++23, the C++ standard says that a constexpr function must return a constexpr value for at least one set of arguments, otherwise it is technically ill-formed. Calling a non-constexpr function unconditionally in a constexpr function makes the constexpr function ill-formed. However, compilers are not required to generate errors or warnings for such cases -- therefore, the compiler probably won’t complain unless you try to call such a constexpr function in a constant context. In C++23, this requirement was rescinded.

For best results, we’d advise the following:

1. Avoid calling non-constexpr functions from within a constexpr function if possible.
1. If your constexpr function requires different behavior for constant and non-constant contexts, conditionalize the behavior with `if (std::is_constant_evaluated())` (in C++20) or `if consteval` (C++23 onward).
1. Always test your constexpr functions in a constant context, as they may work when called in a non-constant context but fail in a constant context.

When should I constexpr a function?

As a general rule, if a function can be evaluated as part of a required constant expression, it should be made `constexpr`.

A **pure function** is a function that meets the following criteria:

- The function always returns the same return result when given the same arguments
- The function has no side effects (e.g. it doesn’t change the value of static local or global variables, doesn’t do input or output, etc…).

Pure functions should generally be made constexpr.

As an aside…

Constexpr functions don’t always need to be pure. In C++23, constexpr functions can use and modify static local variables. Since the value of a static local persists across function calls, modifying a static local variable is considered a side-effect.

That said, if your program is trivial or a throw-away and you don’t constexpr a function, the world isn’t going to end. Hopefully.

Best practice

Unless you have a specific reason not to, a function that can be evaluated as part of a constant expression should be made `constexpr` (even if it isn’t currently used that way).

A function that cannot be evaluated as part of a required constant expression should not be marked as `constexpr`.

Why not constexpr every function?

There are a few reasons you may not want to `constexpr` a function:

1. `constexpr` signals that a function can be used in a constant expression. If your function cannot be evaluated as part of a constant expression, it should not be marked as `constexpr`.
1. `constexpr` is part of the interface of a function. Once a function is made constexpr, it can be called by other constexpr functions or used in contexts that require constant expressions. Removing the `constexpr` later will break such code.
1. `constexpr` functions can be harder to debug since you can’t breakpoint or step through them in a debugger.

Why constexpr a function when it is not actually evaluated at compile-time?

New programmers sometimes ask, “why should I constexpr a function when it is only evaluated at runtime in my program (e.g. because the arguments in the function call are non-const)”?

There are a few reasons:

1. There’s little downside to using constexpr, and it may help the compiler optimize your program to be smaller and faster.
1. Just because you’re not calling the function in a compile-time evaluatable context right now doesn’t mean you won’t call it in such a context when you modify or extend your program. And if you haven’t constexpr’d the function already, you may not think to when you do start to call it in such a context, and then you’ll miss out on the performance benefits. Or you may be forced to constexpr it later when you need to use the return value in a context that requires a constant expression somewhere.
1. Repetition helps ingrain best practices.

On a non-trivial project, it’s a good idea to implement your functions with the mindset that they may be reused (or extended) in the future. Any time you modify an existing function, you risk breaking it, and that means it needs to be retested, which takes time and energy. It’s often worth spending an extra minute or two “doing it right the first time” so you don’t have to redo (and retest) it again later.

\[Next lesson

F.XChapter F summary and quiz\](https://www.learncpp.com/cpp-tutorial/chapter-f-summary-and-quiz/)
[Back to table of contents](/)
\[Previous lesson

F.3Constexpr functions (part 3) and consteval\](https://www.learncpp.com/cpp-tutorial/constexpr-functions-part-3-and-consteval/)

*Previous Post*[F.3 — Constexpr functions (part 3) and consteval](https://www.learncpp.com/cpp-tutorial/constexpr-functions-part-3-and-consteval/)

*Next Post*[F.X — Chapter F summary and quiz](https://www.learncpp.com/cpp-tutorial/chapter-f-summary-and-quiz/)

\[wpDiscuz\](javascript:void(0);)

Insert

You are going to send email to

Send

Move Comment

Move
