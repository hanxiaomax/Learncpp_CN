---
title: 6.11 - 作用域和链接小结
alias: 6.11 - 作用域和链接小结
origin: /scope-duration-and-linkage-summary/
origin_title: "6.11 — Scope, duration, and linkage summary"
time: 2022-5-27
type: translation
tags:
- linkage
- scope
- C++11
---

The concepts of scope, duration, and linkage cause a lot of confusion, so we’re going to take an extra lesson to summarize everything. Some of these things we haven’t covered yet, and they’re here just for completeness / reference later.

Scope summary

An identifier’s _scope_ determines where the identifier can be accessed within the source code.

-   Variables with **block (local) scope** can only be accessed within the block in which they are declared (including nested blocks). This includes:
    -   Local variables
    -   Function parameters
    -   User-defined type definitions (such as enums and classes) declared inside a block
-   Variables and functions with **file (global) scope** can be accessed from the point of declaration until the end of the file. This includes:
    -   Global variables
    -   Functions
    -   User-defined type definitions (such as enums and classes) declared inside a namespace or in the global scope

Duration summary

A variable’s _duration_ determines when it is created and destroyed.

-   Variables with **automatic duration** are created at the point of definition, and destroyed when the block they are part of is exited. This includes:
    -   Local variables
    -   Function parameters
-   Variables with **static duration** are created when the program begins and destroyed when the program ends. This includes:
    -   Global variables
    -   Static local variables
-   Variables with **dynamic duration** are created and destroyed by programmer request. This includes:
    -   Dynamically allocated variables

Linkage summary

An identifier’s _linkage_ determines whether multiple declarations of an identifier refer to the same identifier or not.

-   An identifier with **no linkage** means the identifier only refers to itself. This includes:
    -   Local variables
    -   User-defined type definitions (such as enums and classes) declared inside a block
-   An identifier with **internal linkage** can be accessed anywhere within the file it is declared. This includes:
    -   Static global variables (initialized or uninitialized)
    -   Static functions
    -   Const global variables
    -   Functions declared inside an unnamed namespace
    -   User-defined type definitions (such as enums and classes) declared inside an unnamed namespace
-   An identifier with **external linkage** can be accessed anywhere within the file it is declared, or other files (via a forward declaration). This includes:
    -   Functions
    -   Non-const global variables (initialized or uninitialized)
    -   Extern const global variables
    -   Inline const global variables
    -   User-defined type definitions (such as enums and classes) declared inside a namespace or in the global scope

Identifiers with external linkage will generally cause a duplicate definition linker error if the definitions are compiled into more than one .cpp file (due to violating the one-definition rule). There are some exceptions to this rule (for types, templates, and inline functions and variables) -- we’ll cover these further in future lessons when we talk about those topics.

Also note that functions have external linkage by default. They can be made internal by using the static keyword.

## 变量作用域、持续时间和链接小结

Because variables have scope, duration, and linkage, let’s summarize in a chart:

|Type	|Example	|Scope	|Duration	|Linkage	|Notes|
|---|---|---|---|---|---|
|Local variable	|int x;	|Block	|Automatic	|None	||
|Static local variable	|static int s_x;	|Block	|Static	|None	||
|Dynamic variable	|int \*x { new int{} };	|Block	|Dynamic	|None	||
|Function parameter	|void foo(int x)	|Block	|Automatic	|None	||
|External non-constant global variable	|int g_x;	|File	|Static	|External	|Initialized or uninitialized|
|Internal non-constant global variable	|static int g_x;	|File	|Static	|Internal	|Initialized or uninitialized|
|Internal constant global variable	|constexpr int g_x { 1 };	|File	|Static	|Internal	|Must be initialized|
|External constant global variable	|extern const int g_x { 1 };	|File	|Static	|External	|Must be initialized|
|Inline constant global variable (C++17)	|inline constexpr int g_x { 1 };	|File	|Static	|External	|Must be initialized|

## 前向声明小结

You can use a forward declaration to access a function or variable in another file. The scope of the declared variable is as per usual (file scope for globals, block scope for locals).

|Type	|Example	|Notes|
|---|---|---|
|Function forward declaration	|void foo(int x);	|Prototype only, no function body|
|Non-constant variable forward declaration	|extern int g_x;	|Must be uninitialized|
|Const variable forward declaration	|extern const int g_x;	|Must be uninitialized|
|Constexpr variable forward declaration	|extern constexpr int g_x;	|Not allowed, constexpr cannot be forward declared|


## 存储类型说明符到底是什么？

When used as part of an identifier declaration, the `static` and `extern` keywords are called storage class specifiers. In this context, they set the storage duration and linkage of the identifier.

C++ supports 4 active storage class specifiers:

|Specifier	|Meaning	|Note|
|---|---|---|
|extern	|static (or thread_local) storage duration and external linkage	||
|static	|static (or thread_local) storage duration and internal linkage	||
|thread_local	|thread storage duration	||
|mutable	|object allowed to be modified even if containing class is const	||
|auto	|automatic storage duration	|Deprecated in C++11|
|register	|automatic storage duration and hint to the compiler to place in a register	|Deprecated in C++17|

The term _storage class specifier_ is typically only used in formal documentation.
