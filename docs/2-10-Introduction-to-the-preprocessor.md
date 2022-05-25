---
alias: 2.10 - 预处理器简介
origin: /introduction-to-the-preprocessor/
origin_title: "2.10 — Introduction to the preprocessor"
time: 2022-4-15
type: translation
tags:
- preprocessor
---

## Translation and the preprocessor

When you compile your code, you might expect that the compiler compiles the code exactly as you’ve written it. This actually isn’t the case.

Prior to compilation, the code file goes through a phase known as translation. Many things happen in the translation phase to get your code ready to be compiled (if you’re curious, you can find a list of translation phases [here](https://en.cppreference.com/w/cpp/language/translation_phases)). A code file with translations applied to it is called a translation unit.

The most noteworthy of the translation phases involves the preprocessor. The preprocessor is best thought of as a separate program that manipulates the text in each code file.

When the preprocessor runs, it scans through the code file (from top to bottom), looking for preprocessor directives. Preprocessor directives (often just called _directives_) are instructions that start with a _#_ symbol and end with a newline (NOT a semicolon). These directives tell the preprocessor to perform specific particular text manipulation tasks. Note that the preprocessor does not understand C++ syntax -- instead, the directives have their own syntax (which in some cases resembles C++ syntax, and in other cases, not so much).

The output of the preprocessor goes through several more translation phases, and then is compiled. Note that the preprocessor does not modify the original code files in any way -- rather, all text changes made by the preprocessor happen temporarily in-memory each time the code file is compiled.

In this lesson, we’ll discuss what some of the most common preprocessor directives do.

As an aside…

`Using directives` (introduced in lesson [2.9 -- Naming collisions and an introduction to namespaces](https://www.learncpp.com/cpp-tutorial/naming-collisions-and-an-introduction-to-namespaces/)) are not preprocessor directives (and thus are not processed by the preprocessor). So while the term `directive` _usually_ means a `preprocessor directive`, this is not always the case.

Includes

You’ve already seen the _#include_ directive in action (generally to #include <iostream>). When you _#include_ a file, the preprocessor replaces the #include directive with the contents of the included file. The included contents are then preprocessed (along with the rest of the file), and then compiled.

Consider the following program:

```cpp
#include <iostream>

int main()
{
    std::cout << "Hello, world!";
    return 0;
}
```

COPY

When the preprocessor runs on this program, the preprocessor will replace `#include <iostream>` with the preprocessed contents of the file named “iostream”.

Since _#include_ is almost exclusively used to include header files, we’ll discuss _#include_ in more detail in the next lesson (when we discuss header files in more detail).

Macro defines

The _#define_ directive can be used to create a macro. In C++, a macro is a rule that defines how input text is converted into replacement output text.

There are two basic types of macros: _object-like macros_, and _function-like macros_.

_Function-like macros_ act like functions, and serve a similar purpose. We will not discuss them here, because their use is generally considered dangerous, and almost anything they can do can be done by a normal function.

_Object-like macros_ can be defined in one of two ways:

#define identifier
#define identifier substitution_text

The top definition has no substitution text, whereas the bottom one does. Because these are preprocessor directives (not statements), note that neither form ends with a semicolon.

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