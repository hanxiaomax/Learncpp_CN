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

作用域、持续时间和链接这些概念很绕人，所以我们利用这节课对它们进行一次整理和总结。有些内容我们还没有介绍，但是我们仍然将其罗列在这里，在后续学习时可以进行参考。

## 作用域小结

变量标识符的**作用域**决定了标识符在哪里可以被访问。

-   具有**块（局部）作用域**的标识符，只能够在声明它们的块（及其嵌套块）中访问，这些变量包括：
    -   [[6-3-Local-variables|局部变量]]
    -   [[parameters|函数形参]]
    -   定义在块中的用户自定义类型（包括枚举和类）
-   具有**文件（全局）作用域** 的变量和函数从声明位置开始，直到文件结尾都可以被访问， 包括：
    -   [[global-variable|全局变量]]
    -   函数
    -   定义在全局作用域或命名空间中的用户自定义类型（包括枚举和类）

## 持续时间小结

变量的持续时间决定了它合适被创建和销毁。

- 具有[[automatic-storage-duration|自动存储持续时间]]的变量，在定义时被创建，而且在离开语句块时被销毁，包括：
    - [[6-3-Local-variables|局部变量]]
    - [[parameters|函数形参]]
- 具有[[static-storage-duration|静态存储持续时间]]的变量，在程序开始时创建，在程序结束时销毁，包括：
    -  [[global-variable|全局变量]]
    -  [[static-variables|静态局部变量]]
- 具有[[dynamic-duration|动态存储持续时间]]时间的变量在可以根据程序员的需要创建和销毁，包括：
    -   动态分配的变量

## 链接小结

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

因为变量具有作用域、持续时间和链接属性，这里我们使用表格对它们进行总结：

|类型	|例子	|作用域	|持续时间	|链接属性	|备注|
|---|---|---|---|---|---|
|局部变量	|`int x;`	|块	|自动	|无	|      |
|静态局部变量	|`static int s_x;`	|块	|静态	|无	| 
|动态变量	|`int \*x { new int{} };`	|块	|动态	|无	||
|函数形参	|`void foo(int x)`	|块	|自动	|无	||
|外部非常量全局变量 |`int g_x;`	|文件	|静态	|外部	|Initialized or uninitialized|
|内部 non-constant global variable	|`static int g_x;`	|文件	|静态	|内部	|Initialized or uninitialized|
|Internal constant global variable	|`constexpr int g_x { 1 };`	|文件	|静态	|内部	|Must be initialized|
|External constant global variable	|`extern const int g_x { 1 };`	|文件	|静态	|外部	|Must be initialized|
|Inline constant global variable (C++17)	|`inline constexpr int g_x { 1 };`	|文件	|静态	|外部	|Must be initialized|

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
