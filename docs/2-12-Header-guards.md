---
alias: 2.12 - 头文件重复包含保护
origin: /header-guards/
origin_title: "2.12 — Header guards"
time: 2022-4-15
type: translation
tags:
- 
---

## 重复定义问题

在[[2-7-Forward-declarations-and-definitions|2.7 - 前向声明和定义]]中我们介绍了变量和函数的标识符只能被定义一次，即[[one-definition-rule|单一定义规则]]。因此，如果一个程序包含了对某个标识符的多次定义，将会引起编译错误：

```cpp
int main()
{
    int x; // this is a definition for variable x
    int x; // compile error: duplicate definition

    return 0;
}
```

类似地，如果一个函数在程序中被定义了多次，也会导致编译器报错：

```cpp
#include <iostream>

int foo() // this is a definition for function foo
{
    return 5;
}

int foo() // compile error: duplicate definition
{
    return 5;
}

int main()
{
    std::cout << foo();
    return 0;
}
```

While these programs are easy to fix (remove the duplicate definition), with header files, it’s quite easy to end up in a situation where a definition in a header file gets included more than once. This can happen when a header file `#includes` another header file (which is common).

请考虑下面这个例子：

square.h:

```cpp
// We shouldn't be including function definitions in header files
// But for the sake of this example, we will
int getSquareSides()
{
    return 4;
}
```


geometry.h:

```cpp
#include "square.h"
```

main.cpp:

```cpp
#include "square.h"
#include "geometry.h"

int main()
{
    return 0;
}
```


This seemingly innocent looking program won’t compile! Here’s what’s happening. First, _main.cpp_ #includes _square.h_, which copies the definition for function _getSquareSides_into _main.cpp_. Then _main.cpp_ #includes _geometry.h_, which #includes _square.h_ itself. This copies contents of _square.h_ (including the definition for function _getSquareSides_) into _geometry.h_, which then gets copied into _main.cpp_.

Thus, after resolving all of the #includes, _main.cpp_ ends up looking like this:

```cpp
int getSquareSides()  // from square.h
{
    return 4;
}

int getSquareSides() // from geometry.h (via square.h)
{
    return 4;
}

int main()
{
    return 0;
}
```


Duplicate definitions and a compile error. Each file, individually, is fine. However, because _main.cpp_ ends up #including the content of _square.h_ twice, we’ve run into problems. If _geometry.h_ needs _getSquareSides()_, and _main.cpp_ needs both _geometry.h_ and _square.h_, how would you resolve this issue?

## Header guards

The good news is that we can avoid the above problem via a mechanism called a **header guard** (also called an **include guard**). Header guards are conditional compilation directives that take the following form:

```cpp
#ifndef SOME_UNIQUE_NAME_HERE
#define SOME_UNIQUE_NAME_HERE

// your declarations (and certain types of definitions) here

#endif
```

COPY

When this header is #included, the preprocessor checks whether _SOME_UNIQUE_NAME_HERE_ has been previously defined. If this is the first time we’re including the header, _SOME_UNIQUE_NAME_HERE_ will not have been defined. Consequently, it #defines _SOME_UNIQUE_NAME_HERE_ and includes the contents of the file. If the header is included again into the same file, _SOME_UNIQUE_NAME_HERE_ will already have been defined from the first time the contents of the header were included, and the contents of the header will be ignored (thanks to the #ifndef).

All of your header files should have header guards on them. _SOME_UNIQUE_NAME_HERE_ can be any name you want, but by convention is set to the full filename of the header file, typed in all caps, using underscores for spaces or punctuation. For example, _square.h_ would have the header guard:

square.h:

```cpp
#ifndef SQUARE_H
#define SQUARE_H

int getSquareSides()
{
    return 4;
}

#endif
```

COPY

Even the standard library headers use header guards. If you were to take a look at the iostream header file from Visual Studio, you would see:

```cpp
#ifndef _IOSTREAM_
#define _IOSTREAM_

// content here

#endif
```

COPY

!!! info "扩展阅读"

    In large programs, it’s possible to have two separate header files (included from different directories) that end up having the same filename (e.g. directoryA\config.h and directoryB\config.h). If only the filename is used for the include guard (e.g. CONFIG_H), these two files may end up using the same guard name. If that happens, any file that includes (directly or indirectly) both config.h files will not receive the contents of the include file to be included second. This will probably cause a compilation error.

	Because of this possibility for guard name conflicts, many developers recommend using a more complex/unique name in your header guards. Some good suggestions are a naming convention of <PROJECT>_<PATH>_<FILE>_H , <FILE>_<LARGE RANDOM NUMBER>_H, or <FILE>_<CREATION DATE>_H

## Updating our previous example with header guards

Let’s return to the _square.h_ example, using the _square.h_ with header guards. For good form, we’ll also add header guards to _geometry.h_.

square.h

```cpp
#ifndef SQUARE_H
#define SQUARE_H

int getSquareSides()
{
    return 4;
}

#endif
```

COPY

geometry.h:

```cpp
#ifndef GEOMETRY_H
#define GEOMETRY_H

#include "square.h"

#endif
```

COPY

main.cpp:

```cpp
#include "square.h"
#include "geometry.h"

int main()
{
    return 0;
}
```

COPY

After the preprocessor resolves all of the includes, this program looks like this:

main.cpp:

```cpp
// Square.h included from main.cpp
#ifndef SQUARE_H // square.h included from main.cpp
#define SQUARE_H // SQUARE_H gets defined here

// and all this content gets included
int getSquareSides()
{
    return 4;
}

#endif // SQUARE_H

#ifndef GEOMETRY_H // geometry.h included from main.cpp
#define GEOMETRY_H
#ifndef SQUARE_H // square.h included from geometry.h, SQUARE_H is already defined from above
#define SQUARE_H // so none of this content gets included

int getSquareSides()
{
    return 4;
}

#endif // SQUARE_H
#endif // GEOMETRY_H

int main()
{
    return 0;
}
```

COPY

As you can see from the example, the second inclusion of the contents of _square.h_ (from _geometry.h_) gets ignored because _SQUARE_H_ was already defined from the first inclusion. Therefore, function _getSquareSides_ only gets included once.

## Header guards do not prevent a header from being included once into different code files

Note that the goal of header guards is to prevent a code file from receiving more than one copy of a guarded header. By design, header guards do _not_ prevent a given header file from being included (once) into separate code files. This can also cause unexpected problems. Consider:

square.h:

```cpp
#ifndef SQUARE_H
#define SQUARE_H

int getSquareSides()
{
    return 4;
}

int getSquarePerimeter(int sideLength); // forward declaration for getSquarePerimeter

#endif
```

square.cpp:

```cpp
#include "square.h"  // square.h is included once here

int getSquarePerimeter(int sideLength)
{
    return sideLength * getSquareSides();
}
```

main.cpp:

```cpp
#include "square.h" // square.h is also included once here
#include <iostream>

int main()
{
    std::cout << "a square has " << getSquareSides() << " sides\n";
    std::cout << "a square of length 5 has perimeter length " << getSquarePerimeter(5) << '\n';

    return 0;
}
```


Note that _square.h_ is included from both _main.cpp_ and _square.cpp_. This means the contents of _square.h_ will be included once into _square.cpp_ and once into _main.cpp_.

Let’s examine why this happens in more detail. When _square.h_ is included from _square.cpp_, _SQUARE_H_ is defined until the end of _square.cpp_. This define prevents _square.h_from being included into _square.cpp_ a second time (which is the point of header guards). However, once _square.cpp_ is finished, _SQUARE_H_ is no longer considered defined. This means that when the preprocessor runs on _main.cpp_, _SQUARE_H_ is not initially defined in _main.cpp_.

The end result is that both _square.cpp_ and _main.cpp_ get a copy of the definition of _getSquareSides_. This program will compile, but the linker will complain about your program having multiple definitions for identifier _getSquareSides_!

The best way to work around this issue is simply to put the function definition in one of the .cpp files so that the header just contains a forward declaration:

square.h:

```cpp
#ifndef SQUARE_H
#define SQUARE_H

int getSquareSides(); // forward declaration for getSquareSides
int getSquarePerimeter(int sideLength); // forward declaration for getSquarePerimeter

#endif
```


square.cpp:

```cpp
#include "square.h"

int getSquareSides() // actual definition for getSquareSides
{
    return 4;
}

int getSquarePerimeter(int sideLength)
{
    return sideLength * getSquareSides();
}
```


main.cpp:

```cpp
#include "square.h" // square.h is also included once here
#include <iostream>

int main()
{
    std::cout << "a square has " << getSquareSides() << "sides\n";
    std::cout << "a square of length 5 has perimeter length " << getSquarePerimeter(5) << '\n';

    return 0;
}
```


Now when the program is compiled, function _getSquareSides_ will have just one definition (via _square.cpp_), so the linker is happy. File _main.cpp_ is able to call this function (even though it lives in _square.cpp_) because it includes _square.h_, which has a forward declaration for the function (the linker will connect the call to _getSquareSides_ from _main.cpp_ to the definition of _getSquareSides_ in _square.cpp_).

## Can’t we just avoid definitions in header files?

We’ve generally told you not to include function definitions in your headers. So you may be wondering why you should include header guards if they protect you from something you shouldn’t do.

There are quite a few cases we’ll show you in the future where it’s necessary to put non-function definitions in a header file. For example, C++ will let you create your own types. These user-defined types are typically defined in header files, so the type definitions can be propagated out to the code files that need to use them. Without a header guard, a code file could end up with multiple (identical) copies of a given type definition, which the compiler will flag as an error.

So even though it’s not strictly necessary to have header guards at this point in the tutorial series, we’re establishing good habits now, so you don’t have to unlearn bad habits later.

## `#pragma` once

Modern compilers support a simpler, alternate form of header guards using the _#pragma_ directive:

```cpp
#pragma once

// your code here
```

COPY

`#pragma once` serves the same purpose as header guards, and has the added benefit of being shorter and less error-prone. For most projects, `#pragma once` works fine, and many developers prefer to use them over header guards. However, `#pragma once` is not an official part of the C++ language (and probably will never be, because it can’t be implemented in a way that works reliably in all cases).

For maximum compatibility, we recommend sticking to traditional header guards. They aren’t much more work and they’re guaranteed to be supported on all compilers.

!!! success "最佳实践"

	Favor header guards over `#pragma once` for maximum portability.

## Summary

Header guards are designed to ensure that the contents of a given header file are not copied more than once into any single file, in order to prevent duplicate definitions.

Note that duplicate _declarations_ are fine, since a declaration can be declared multiple times without incident -- but even if your header file is composed of all declarations (no definitions) it’s still a best practice to include header guards.

Note that header guards do _not_ prevent the contents of a header file from being copied (once) into separate project files. This is a good thing, because we often need to reference the contents of a given header from different project files.