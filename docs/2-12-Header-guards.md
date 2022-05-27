---
alias: 2.12 - 头文件防卫式声明
origin: /header-guards/
origin_title: "2.12 — Header guards"
time: 2022-4-15
type: translation
tags:
- header guards
- pragma once
---



??? note "关键点速记"

    - 由于头文件防范不能防止头文件被包含到不同的文件，头文件中的定义可能会导致链接器报告函数重定义。
    - 不可能完全避免头文件中的定义，毕竟类是需要定义在头文件中的。
    - 对于不包含定义的头文件，虽然没必要使用头文件防范，但这其实是一个好习惯（尤其考虑到后面可能对头文件进行的改动）
    - 处于兼容性的考虑，优先使用头文件防范而非 `#pragma once`

## 重复定义问题

在[[2-7-Forward-declarations-and-definitions|2.7 - 前向声明和定义]]中我们介绍了变量和函数的标识符只能被定义一次，即[[one-definition-rule|单一定义规则]]。因此，如果一个程序包含了对某个标识符的多次定义，将会引起编译错误 ：

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

尽管这些问题修复起来并不难（移除重复定义即可），但是对于使用头文件的情况来说，如果头文件中存在定义，那么它很有可能会被重复地包含到代码中。尤其是一个头文件中还包括其他头文件的情况（很常见）。

请考虑下面这个例子：


```cpp title="square.h"
// 头文件里不应该包含函数的定义，这里只是为了举例
int getSquareSides()
{
    return 4;
}
```


```cpp title="geometry.h"
#include "square.h"
```


```cpp title="main.cpp"
#include "square.h"
#include "geometry.h"

int main()
{
    return 0;
}
```

这个程序看上去没什么问题，但实际上却不能编译！原因如下：首先， _main.cpp_ 文件 `#includes` 了 _square.h_，因此会把函数 `getSquareSides_into` 的定义拷贝到了  _main.cpp_。_main.cpp_ 文件同时还包含了 `#includes` _geometry.h_ 进而 `#includes` 了 _square.h_ 。这样 _square.h_ 的定义（包含了 `getSquareSides` 的定义）也被拷贝到了 _geometry.h_，进而也被拷贝到了 _main.cpp_。

因此，在解析了的全部的头文件后， _main.cpp_ 的内容变成了下面这样：

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

单独看每个函数都没有问题，不过，由于最终的结果等效于 `_main.cpp_` 包含了两次 _square.h_，所以才遇到了上述问题。 如果 _geometry.h_ 需要 `getSquareSides()` 而且 _main.cpp_ 需要 _geometry.h_ 和 _square.h_，那么应该如何解决上述问题呢？

## 头文件防卫式声明

好消息是，我们可以使用[[header-guard|头文件防范 header guards]]（或 include 防范）技术来避免上述问题。头文件防范其实是一种条件编译，它的形式如下：

```cpp
#ifndef SOME_UNIQUE_NAME_HERE
#define SOME_UNIQUE_NAME_HERE

// your declarations (and certain types of definitions) here

#endif
```

当头文件被包含时，预处理器会检查 `SOME_UNIQUE_NAME_HERE` 是否已经被定义过。如果没有说明这是第一次引入该头文件，`SOME_UNIQUE_NAME_HERE` 肯定尚未被定义。此时，该头文件会 `#defines SOME_UNIQUE_NAME_HERE` 并且包含头文件的内容。如果该头文件之后又被包含了，那么由于 `SOME_UNIQUE_NAME_HERE` 之前已经被定义过了，所以该头文件中包含的内容将会被忽略（由于 `#ifndef` 的存在）

我们使用的所有头文件，都应该使用头文件防卫式声明。`SOME_UNIQUE_NAME_HERE` 可以是任何名字，但是通常的惯例是使用头文件的**全名**、全部大写字母并使用下划线代替空格或标点，例如 _square.h_ 的头文件防范如下：


```cpp title="square.h"
#ifndef SQUARE_H
#define SQUARE_H

int getSquareSides()
{
    return 4;
}

#endif
```

标准库中也使用了头文件防范。如果你去看看 iostream 的头文件，你会发现它是这样的：

```cpp title="iostream"
#ifndef _IOSTREAM_
#define _IOSTREAM_

// content here

#endif
```

!!! info "扩展阅读"

    在大型项目中，使用两个来自两个不同目录的同名头文件也是可能的(例如：`directoryA\config.h` 和 `directoryB\config.h`)。如果头文件防范只利用了文件名，那么这两个头文件的头文件防范应该也是一样的（例如：`CONFIG_H`）。这样一来，任何同时包含了上述两个头文件的文件，其实在包含第二个的时候是不生效的，这样就有可能导致编译错误。

    正是由于存在头文件防范冲突的可能，很多开发者建议使用更复杂/独特的方式来构建相关的宏。例如：`<PROJECT>_<PATH>_<FILE>_H`、`<FILE>_<LARGE RANDOM NUMBER>_H` 或者 `<FILE>_<CREATION DATE>_H`。

## 使用头文件防范更新之前的例子

再回到 _square.h_ 的例子，使用头文件防护来处理 _square.h_ 。为了保持一致，我们在 _geometry.h_ 中也添加了头文件夹防护。


```cpp title="square.h"
#ifndef SQUARE_H
#define SQUARE_H

int getSquareSides()
{
    return 4;
}

#endif
```


```cpp title="geometry.h"
#ifndef GEOMETRY_H
#define GEOMETRY_H

#include "square.h"

#endif
```


```cpp title="main.cpp"
#include "square.h"
#include "geometry.h"

int main()
{
    return 0;
}
```

在预处理器解析全部头文件后，程序内容变成了下面这样：

```cpp title="main.cpp"
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

从上面的例子可以看出，当第二次包含 _square.h_ 的时候，由于 _SQUARE_H_ 已经被定义过了。因此 `getSquareSides` 函数只会被包含一次。

## 头文件防范不能防止头文件被包含到不同的文件

头文件防范的目标是防止头文件被多次包含。从设计上来讲，它并不能保护头文件被包含到多个代码文件中（每个文件只能包含一次）。这可能导致难以预料的问题。

考虑如下情况：


```cpp title="square.h"
#ifndef SQUARE_H
#define SQUARE_H

int getSquareSides()
{
    return 4;
}

int getSquarePerimeter(int sideLength); // getSquarePerimeter 的前向声明

#endif
```

```cpp title="square.cpp"
#include "square.h"  // square.h 在此处被包含一次

int getSquarePerimeter(int sideLength)
{
    return sideLength * getSquareSides();
}
```

```cpp title="main.cpp"
#include "square.h" // square.h 在此处被包含一次
#include <iostream>

int main()
{
    std::cout << "a square has " << getSquareSides() << " sides\n";
    std::cout << "a square of length 5 has perimeter length " << getSquarePerimeter(5) << '\n';

    return 0;
}
```

注意 _square.h_ 被包含到了 _main.cpp_ 和 _square.cpp_ 中。这意味着  _square.h_ 的内容被 _square.cpp_ 和  _main.cpp_ 各包含了一次。

让我们仔细讲解一下为什么会这样。当 _square.h_ 被包含到 _square.cpp_ 时 `_SQUARE_H_` 被定义了，它的定义到 _square.cpp_ 文件的末尾为止。该定义可以避免  _square.h_ 的内容多次被包含到  _square.cpp_ 中 。但是，_square.cpp_ 处理完成后，_SQUARE_H_ 就没有定义了。这意味当预处理器处理 _main.cpp_ 时， _SQUARE_H_ 尚未在 _main.cpp_ 中定义。

由于 _square.cpp_ 和 _main.cpp_ 中都包含了 `getSquareSides` 函数的定义。此时，文件是可以编译的，但是在链接时链接器会报告程序存在 `getSquareSides` 函数的重复定义。

解决这个问题最后的方法是把函数定义放在一个 `.cpp` 文件中，这样头文件中就只包含函数的声明：


```cpp title="square.h"
#ifndef SQUARE_H
#define SQUARE_H

int getSquareSides(); // forward declaration for getSquareSides
int getSquarePerimeter(int sideLength); // forward declaration for getSquarePerimeter

#endif
```

```cpp title="square.cpp"
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


```cpp title="main.cpp"
#include "square.h" // square.h is also included once here
#include <iostream>

int main()
{
    std::cout << "a square has " << getSquareSides() << "sides\n";
    std::cout << "a square of length 5 has perimeter length " << getSquarePerimeter(5) << '\n';

    return 0;
}
```

现在， 程序在编译的时候，`getSquareSides` 函数只有一个定义了（来自  _square.cpp_ ），因此链接器不会再报错。 _main.cpp_ 可以调用该函数 (即使它的定义在 _square.cpp_ 中) ，因为它包含了 _square.h_（包含该函数的声明），链接器会把 _main.cpp_ 中对 `getSquareSides` 函数的调用关联到 _square.cpp_ 中 `getSquareSides` 函数的定义。

## 不把定义放在头文件中不就行了？

之前我们说过，不要把函数的定义放在头文件中。所以你可能会问，那为什么还要使用头文件防范呢？毕竟它要解决的问题从一开始就应该避免。

其实，后面我们会向你展示一些**非函数**定义被放置在头文件中的例子。例如，C++ 允许你创建自定义类型。这些自定义类型通常被定义在头文件中，这样才能让对应的源文件使用这些定义。如果不使用头文件防范，则它们很可能会被多次拷贝，导致编译器报错。

因此，即便教程看到这里的时候你还没有必要使用头文件防范，能够从现在就养成习惯还是很好的。

## `#pragma once`

现代编译器支持一种更简单的处理方法，可以使用 `#pragma` 指令来代替头文件防范：

```cpp
#pragma once

// your code here
```

`#pragma once` 的功能和头文件防范是一样的，而且更加简短且不易出错。在大多数的项目中，`#pragma once` 都可以很好的工作，因此很多开发者都倾向于使用它而不是头文件防范。不过，`#pragma once` 并不是 C++ 语言的一部分 (而且可能永远都不会成为 C++ 的一部分，因为没办法保证在仍和情况下它都能正确地工作）

处于兼容性的考虑，我们还是推荐使用传统方式——头文件防范。头文件防范用起来也不复杂而且所有的编译器都支持。

!!! success "最佳实践"

    处于兼容性的考虑，优先使用头文件防范而非 `#pragma once`。

## 小结

头文件防范可以确保该头文件的内容被包含到某个文件时，其内容只被拷贝一次，以避免重复定义的问题。

注意，重复声明是可以的，因为多次声明并不会带来任何问题。不过，即使你的头文件中只包含声明，使用头文件防范仍然是最佳实践。

注意，头文件防范不能避免头文件的内容被拷贝到多个不同的文件中。不过，这是好事，因为我们时常需要将头文件包含到多个不同的文件中。

