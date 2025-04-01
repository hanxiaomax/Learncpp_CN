---
title: 11-10-using-function-templates-in-multiple-files
aliases: 11-10-using-function-templates-in-multiple-files
origin: 
origin_title: 11-10-using-function-templates-in-multiple-files
time: 2025-04-01 
type: translation-under-construction
tags:
---
# 11.10 — Using function templates in multiple files

[*Alex*](https://www.learncpp.com/author/Alex/ "View all posts by Alex")

June 11, 2024, 11:06 am PDT
October 20, 2024

Consider the following program, which doesn’t work correctly:

main.cpp:

```cpp
#include <iostream>

template <typename T>
T addOne(T x); // function template forward declaration

int main()
{
    std::cout << addOne(1) << '\n';
    std::cout << addOne(2.3) << '\n';

    return 0;
}
```

add.cpp:

```cpp
template <typename T>
T addOne(T x) // function template definition
{
    return x + 1;
}
```

If `addOne` were a non-template function, this program would work fine: In *main.cpp*, the compiler would be satisfied with the forward declaration of `addOne`, and the linker would connect the call to `addOne()` in *main.cpp* to the function definition in *add.cpp*.

But because `addOne` is a template, this program doesn’t work, and we get a linker error:

```cpp
1>Project6.obj : error LNK2019: unresolved external symbol "int __cdecl addOne<int>(int)" (??$addOne@H@@YAHH@Z) referenced in function _main
1>Project6.obj : error LNK2019: unresolved external symbol "double __cdecl addOne<double>(double)" (??$addOne@N@@YANN@Z) referenced in function _main

```

In *main.cpp*, we call `addOne<int>` and `addOne<double>`. However, since the compiler can’t see the definition for function template `addOne`, it can’t instantiate those functions inside *main.cpp*. It does see the forward declaration for `addOne` though, and will assume those functions exist elsewhere and will be linked in later.

When the compiler goes to compile *add.cpp*, it will see the definition for function template `addOne`. However, there are no uses of this template in *add.cpp*, so the compiler will not instantiate anything. The end result is that the linker is unable to connect the calls to `addOne<int>` and `addOne<double>` in *main.cpp* to the actual functions, because those functions were never instantiated.

As an aside…

If *add.cpp* had instantiated those functions, the program would have compiled and linked just fine. But such solutions are fragile and should be avoided: if the code in *add.cpp* was later changed so those functions are no longer instantiated, the program would again fail to link. Or if *main.cpp* called a different version of `addOne` (such as `addOne<float>`) that was not instantiated in *add.cpp*, we run into the same problem.

The most conventional way to address this issue is to put all your template code in a header (.h) file instead of a source (.cpp) file:

add.h:

```cpp
#ifndef ADD_H
#define ADD_H

template <typename T>
T addOne(T x) // function template definition
{
    return x + 1;
}

#endif
```

main.cpp:

```cpp
#include "add.h" // import the function template definition
#include <iostream>

int main()
{
    std::cout << addOne(1) << '\n';
    std::cout << addOne(2.3) << '\n';

    return 0;
}
```

That way, any files that need access to the template can #include the relevant header, and the template definition will be copied by the preprocessor into the source file. The compiler will then be able to instantiate any functions that are needed.

You may be wondering why this doesn’t cause a violation of the one-definition rule (ODR). The ODR says that types, templates, inline functions, and inline variables are allowed to have identical definitions in different files. So there is no problem if the template definition is copied into multiple files (as long as each definition is identical).

Related content

We covered the ODR in lesson [2.7 -- Forward declarations and definitions](https://www.learncpp.com/cpp-tutorial/forward-declarations/#ODR).

But what about the instantiated functions themselves? If a function is instantiated in multiple files, how does that not cause a violation of the ODR? The answer is that functions implicitly instantiated from templates are implicitly inline. And as you know, inline functions can be defined in multiple files, so long as the definition is identical in each.

Key insight

Template definitions are exempt from the part of the one-definition rule that requires only one definition per program, so it is not a problem to have the same template definition #included into multiple source files. And functions implicitly instantiated from function templates are implicitly inline, so they can be defined in multiple files, so long as each definition is identical.

The templates themselves are not inline, as the concept of inline only applies to variables and functions.

Here’s another example of a function template being placed in a header file, so it can be included into multiple source files:

max.h:

```cpp
#ifndef MAX_H
#define MAX_H

template <typename T>
T max(T x, T y)
{
    return (x < y) ? y : x;
}

#endif
```

foo.cpp:

```cpp
#include "max.h" // import template definition for max<T>(T, T)
#include <iostream>

void foo()
{
	std::cout << max(3, 2) << '\n';
}
```

main.cpp:

```cpp
#include "max.h" // import template definition for max<T>(T, T)
#include <iostream>

void foo(); // forward declaration for function foo

int main()
{
    std::cout << max(3, 5) << '\n';
    foo();

    return 0;
}
```

In the above example, both main.cpp and foo.cpp `#include "max.h"` so the code in both files can make use of the `max<T>(T, T)` function template.

Best practice

Templates that are needed in multiple files should be defined in a header file, and then #included wherever needed. This allows the compiler to see the full template definition and instantiate the template when needed.

\[Next lesson

11.xChapter 11 summary and quiz\](https://www.learncpp.com/cpp-tutorial/chapter-11-summary-and-quiz/)
[Back to table of contents](/)
\[Previous lesson

11.9Non-type template parameters\](https://www.learncpp.com/cpp-tutorial/non-type-template-parameters/)

*Previous Post*[14.17 — Constexpr aggregates and classes](https://www.learncpp.com/cpp-tutorial/constexpr-aggregates-and-classes/)

*Next Post*[5.4 — The as-if rule and compile-time optimization](https://www.learncpp.com/cpp-tutorial/the-as-if-rule-and-compile-time-optimization/)

\[wpDiscuz\](javascript:void(0);)

Insert

You are going to send email to

Send

Move Comment

Move
