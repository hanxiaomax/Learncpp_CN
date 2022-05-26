---
alias: 2.10 - 预处理器简介
origin: /introduction-to-the-preprocessor/
origin_title: "2.10 — Introduction to the preprocessor"
time: 2022-4-15
type: translation
tags:
- preprocessor
---

## 翻译及预处理器

你可能会觉得编译器会原封不动地编译你写的代码。但实际上并不是。

在开始编译前，代码会经过一个叫做[[translation|翻译(translation)]]的阶段。在这个阶段需要完成很多操作，才能使你的代码具备被编译的条件（如果有兴趣可以在 [这里](https://en.cppreference.com/w/cpp/language/translation_phases)查看有关翻译阶段的详细信息）。进行过翻译的代码文件叫做一个翻译单元。

在翻译阶段中最值得我们关注的是[[preprocessor|预处理器]]，它可以被看做是一个对每个代码文件进行文本处理的单独的工具。

在预处理器工作的时候，它会从头到尾扫描代码文件，查找[[preprocessor-directive|预处理器指令 (preprocessor directive)]]。预处理器指令（经常简称为指令）是一些以`#`开头，以换行（而非分号）结尾的符号。这些指令会告诉预处理器应该对文本执行哪些特定的操作。<mark class="hltr-red">需要注意的是，预处理器并不理解C++的语法——相反，预处理器指令有其自己的语法（有些和C++语法类似，有些则不然）。</mark> 

预处理器的输出会经历一些列翻译阶段，然后才会被编译。需要注意的是，预处理器并不会修改原文件——所有经预处理器修改产生的变化都是临时的（用于一次编译）

本节课将介绍一些最为常见的预处理器指令。

!!! cite "题外话"

    `Using`指令 ([[2-9-Naming-collisions-and-an-introduction-to-namespaces|2.9 - 命名冲突和命名空间]]中介绍)并不属于预处理器指令（因此不会被预处理器处理）。因此，尽管指令(directive)一词多指预处理器指令，但也不是总是这样。

## Includes

我们已经在实际案例中接触过 `#include` 指令了（`#include <iostream>`）。在 `#include`某个文件的时候，预处理器会把 `#include`替换为该文件的实际内容，然后预处理器才会对替换后的文件内容进行预处理和编译。

考虑下面的例子：

```cpp
#include <iostream>

int main()
{
    std::cout << "Hello, world!";
    return 0;
}
```

当预处理器处理该程序时，它会把`#include <iostream>` 替换为经过预处理的名为“iostream”的文件的内容。

因为 `#include` 几乎只用来包含头文件，我们会在后续讨论头文件时再对其进行详细的介绍。（参见：[[2-11-Header-files|2.11 - 头文件]]）

## 宏定义

`#define` 指令可以被用来定义[[macro|宏(macro) ]]。在C++中，宏指的是一种规则，这种规则规定了一个输入文本应该如何被替换成输出文本。

宏有两种基本类型：[[object-like-macros|对象类型的宏(object-like macros)]]和[[function-like macros|函数类型的宏 (function-like macros)]]。

**函数类型的宏**和函数很像，其功能也类似。我们并不会在这里详细讨论它，因为它常常被认为是不安全的，况且它能做的普通函数也能做，

**对象类型的宏** 有两种声明方式

```cpp
#define identifier
#define identifier substitution_text
```

上面一种方式不会对文本进行替换，而下面一种会。因为这些The top definition has no substitution text, whereas the bottom one does. Because these are preprocessor directives (not statements), note that neither form ends with a semicolon.

Object-like macros with substitution text

When the preprocessor encounters this directive, any further occurrence of the identifier is replaced by _substitution_text_. The identifier is traditionally typed in all capital letters, using underscores to represent spaces.

Consider the following program:

```cpp
#include <iostream>

#define MY_NAME "Alex"

int main()
{
    std::cout << "My name is: " << MY_NAME;

    return 0;
}
```

COPY

The preprocessor converts the above into the following:

```cpp
// The contents of iostream are inserted here

int main()
{
    std::cout << "My name is: " << "Alex";

    return 0;
}
```

COPY

Which, when run, prints the output `My name is: Alex`.

Object-like macros were used as a cheaper alternative to constant variables. Those times are long gone as compilers got smarter and the language grew. Object-like macros should only be seen in legacy code anymore.

We recommend avoiding these kinds of macros altogether, as there are better ways to do this kind of thing. We discuss this more in lesson [4.15 -- Symbolic constants: const and constexpr variables](https://www.learncpp.com/cpp-tutorial/const-constexpr-and-symbolic-constants/).

Object-like macros without substitution text

_Object-like macros_ can also be defined without substitution text.

For example:

```cpp
#define USE_YEN
```

COPY

Macros of this form work like you might expect: any further occurrence of the identifier is removed and replaced by nothing!

This might seem pretty useless, and it _is useless_ for doing text substitution. However, that’s not what this form of the directive is generally used for. We’ll discuss the uses of this form in just a moment.

Unlike object-like macros with substitution text, macros of this form are generally considered acceptable to use.

Conditional compilation

The _conditional compilation_ preprocessor directives allow you to specify under what conditions something will or won’t compile. There are quite a few different conditional compilation directives, but we’ll only cover the three that are used by far the most here: _#ifdef_, _#ifndef_, and _#endif_.

The _#ifdef_ preprocessor directive allows the preprocessor to check whether an identifier has been previously _#define_d. If so, the code between the _#ifdef_ and matching _#endif_ is compiled. If not, the code is ignored.

Consider the following program:

```cpp
#include <iostream>

#define PRINT_JOE

int main()
{
#ifdef PRINT_JOE
    std::cout << "Joe\n"; // will be compiled since PRINT_JOE is defined
#endif

#ifdef PRINT_BOB
    std::cout << "Bob\n"; // will be ignored since PRINT_BOB is not defined
#endif

    return 0;
}
```

COPY

Because PRINT_JOE has been #defined, the line `std::cout << "Joe\n"` will be compiled. Because PRINT_BOB has not been #defined, the line `std::cout << "Bob\n"`will be ignored.

_#ifndef_ is the opposite of _#ifdef_, in that it allows you to check whether an identifier has _NOT_ been _#define_d yet.

```cpp
#include <iostream>

int main()
{
#ifndef PRINT_BOB
    std::cout << "Bob\n";
#endif

    return 0;
}
```

COPY

This program prints “Bob”, because PRINT_BOB was never _#define_d.

In place of `#ifdef PRINT_BOB` and `#ifndef PRINT_BOB`, you’ll also see `#if defined(PRINT_BOB)` and `#if !defined(PRINT_BOB)`. These do the same, but use a slightly more C++-style syntax.

#if 0

One more common use of conditional compilation involves using _#if 0_ to exclude a block of code from being compiled (as if it were inside a comment block):

```cpp
#include <iostream>

int main()
{
    std::cout << "Joe\n";

#if 0 // Don't compile anything starting here
    std::cout << "Bob\n";
    std::cout << "Steve\n";
#endif // until this point

    return 0;
}
```

COPY

The above code only prints “Joe”, because “Bob” and “Steve” were inside an _#if 0_ block that the preprocessor will exclude from compilation.

This also provides a convenient way to “comment out” code that contains multi-line comments (which can’t be commented out using another multi-line comment due to multi-line comments being non-nestable):

```cpp
#include <iostream>

int main()
{
    std::cout << "Joe\n";

#if 0 // Don't compile anything starting here
    std::cout << "Bob\n";
    /* Some
     * multi-line
     * comment here
     */
    std::cout << "Steve\n";
#endif // until this point

    return 0;
}
```

COPY

Object-like macros don’t affect other preprocessor directives

Now you might be wondering:

```cpp
#define PRINT_JOE

#ifdef PRINT_JOE
// ...
```

COPY

Since we defined _PRINT_JOE_ to be nothing, how come the preprocessor didn’t replace _PRINT_JOE_ in _#ifdef PRINT_JOE_ with nothing?

Macros only cause text substitution for normal code. Other preprocessor commands are ignored. Consequently, the _PRINT_JOE_ in _#ifdef PRINT_JOE_ is left alone.

For example:

```cpp
#define FOO 9 // Here's a macro substitution

#ifdef FOO // This FOO does not get replaced because it’s part of another preprocessor directive
    std::cout << FOO; // This FOO gets replaced with 9 because it's part of the normal code
#endif
```

COPY

In actuality, the output of the preprocessor contains no directives at all -- they are all resolved/stripped out before compilation, because the compiler wouldn’t know what to do with them.

The scope of defines

Directives are resolved before compilation, from top to bottom on a file-by-file basis.

Consider the following program:

```cpp
#include <iostream>

void foo()
{
#define MY_NAME "Alex"
}

int main()
{
	std::cout << "My name is: " << MY_NAME;

	return 0;
}
```

COPY

Even though it looks like _#define MY_NAME “Alex”_ is defined inside function _foo_, the preprocessor won’t notice, as it doesn’t understand C++ concepts like functions. Therefore, this program behaves identically to one where _#define MY_NAME “Alex”_ was defined either before or immediately after function _foo_. For general readability, you’ll generally want to #define identifiers outside of functions.

Once the preprocessor has finished, all defined identifiers from that file are discarded. This means that directives are only valid from the point of definition to the end of the file in which they are defined. Directives defined in one code file do not have impact on other code files in the same project.

Consider the following example:

function.cpp:

```cpp
#include <iostream>

void doSomething()
{
#ifdef PRINT
    std::cout << "Printing!";
#endif
#ifndef PRINT
    std::cout << "Not printing!";
#endif
}
```

COPY

main.cpp:

```cpp
void doSomething(); // forward declaration for function doSomething()

#define PRINT

int main()
{
    doSomething();

    return 0;
}
```

COPY

The above program will print:

Not printing!

Even though PRINT was defined in _main.cpp_, that doesn’t have any impact on any of the code in _function.cpp_ (PRINT is only #defined from the point of definition to the end of main.cpp). This will be of consequence when we discuss header guards in a future lesson.