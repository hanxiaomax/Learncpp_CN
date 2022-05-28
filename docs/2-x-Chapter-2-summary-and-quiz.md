---
title: 2.x - 小结与测试
alias: 2.x - 小结与测试
origin: /chapter-2-summary-and-quiz/
origin_title: "2.x — Chapter 2 summary and quiz"
time: 2022-4-23
type: translation
tags:
- summary
---


## 章节回顾

**函数** 是一系列可以复用的语句，用来完成某个特定的任务。用户自己编写的函数称为自定义函数。

**函数调用**是一种表达式，用于告诉CPU去执行一个函数。执行函数调用的函数，称为**主调函数**，被调用的函数称为**被调函数**。在调用函数的时候，不要忘记函数名后面的括号。

函数定义时使用的花括号和和语句称为**函数体**。

具有返回值的函数称为**带返回值的函数**。返回值的类型指明了返回值的具体类型。`return`语句指定了要返回给主调函数的具体值。

返回值是通过**拷贝**的方式返回给主调函数的，这个过程称为[[return-by-value|值返回]]。如果以非空函数没有能够返回一个值，会导致[[1-6-Uninitialized-variables-and-undefined-behavior|未定义行为]]。

`main` 函数的返回值称为程序的状态码。程序通过返回的状态码向操作系统表明程序是否成功执行。返回值为 0 时表示成功，返回正数则表示执行失败。

践行 DRY 编程——jiprogramming -- “don’t repeat yourself”. Make use of variables and functions to remove redundant code.

Functions with a return type of voiddo not return a value to the caller. A function that does not return a value is called a void function or non-value returning function. Void functions can’t be called where a value is required.

A return statement that is not the last statement in a function is called a early return. Such a statement causes the function to return to the caller immediately.

A function parameter is a variable used in a function where the value is provided by the caller of the function. An argument is the specific value passed from the caller to the function. When an argument is copied into the parameter, this is called pass by value.

C++ does not define whether function calls evaluate arguments left to right or vice-versa.

Function parameters and variables defined inside the function body are called local variables. The time in which a variable exists is called its lifetime. Variables are created and destroyed at runtime, which is when the program is running. A variable’s scope determines where it can be accessed. When a variable can be accessed, we say it is in scope. When it can not be accessed, we say it is out of scope. Scope is a compile-time property, meaning it is enforced at compile time.

Whitespace refers to characters used for formatting purposes. In C++, this includes spaces, tabs, and newlines.

A forward declaration allows us to tell the compiler about the existence of an identifier before actually defining the identifier. To write a forward declaration for a function, we use a function prototype, which includes the function’s return type, name, and parameters, but no function body.

A definition actually implements (for functions and types) or instantiates (for variables) an identifier. A declaration is a statement that tells the compiler about the existence of the identifier. In C++, all definitions serve as declarations. Pure declarations are declarations that are not also definitions (such as function prototypes).

Most non-trivial programs contain multiple files.

When two identifiers are introduced into the same program in a way that the compiler or linker can’t tell them apart, the compiler or linker will produce a naming collision. A namespace guarantees that all identifiers within the namespace are unique. The std namespace is one such namespace.

The preprocessor is a process that runs on the code before it is compiled. Directives are special instructions to the preprocessor. Directives start with a # symbol and end with a newline. A macro is a rule that defines how input text is converted to a replacement output text.

Header files are files designed to propagate declarations to code files. When using the _#include_ directive, the _#include_ directive is replaced by the contents of the included file. When including headers, use angled brackets when including system headers (e.g. those in the C++ standard library), and use double quotes when including user-defined headers (the ones you write). When including system headers, include the versions with no .h extension if they exist.

Header guards prevent the contents of a header from being included more than once into a given code file. They do not prevent the contents of a header from being included into multiple different code files.