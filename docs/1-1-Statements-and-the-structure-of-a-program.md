---
alias: 1.1 - 程序结构和语句
origin: /statements-and-the-structure-of-a-program/
origin_title: 1.1 — Statements and the structure of a program
time: 2022-1-2
type: translation
tags:
- statements
---

## 章节简介

欢迎来到我们C++教程的第一个主要章节！

本章节将首先介绍有关 C++ 程序最基本的话题。由于本章节涉及的话题较多，因此我们只会对每一个部分都进行相对简单的介绍，其目的只是为了让你能够理解构成C++程序的基本元素有哪些。在完成本章节的学习后，你应当可以独立编写一个简单的程序了。

在后续的章节中，我们会复习并深入探讨这些话题，同时介绍尤其衍生出的一些新的概念。

为了使每节课都可以保持适当的体量，有些话题被分割成了多节课。如果你觉得有些重要的概念在一节课中尚未介绍，那么它很可能会在接下来的课程中进行讲解。

## 语句

计算机程序指的是控制计算机完成某件事所需要的一系列[[指令(instuction)]]。[[语句(statement)]]是指令的一种，它控制计算机完成某些操作。

就目前而言，语句是C++程序中最常见的一种指令类型。这主要是因为它们是C++语言中最简单的、独立的计算单元。从这个意义上来讲，语句之于编程语言，就好比句子之于自然语言。当你需要向其他人传递信息的时候，通常我们会使用句子，而不是一些随机的词语或音节。 在C++中，我们一般也是通过语句向程序传达我们的意图的。

大多数（但不是全部）的C++语句以分号结尾。如果你看到一行以分号结尾的代码，那么它多半就是一条语句了。

在C++这样的高级语言中，一条语句可能会被编译为多条机器指令。

!!! info "扩展阅读"

    C++中有很多不同类型的语句：

	1.  声明语句 Declaration statements
	2.  跳转语句 Jump statements
	3.  表达式语句 Expression statements
	4.  复合语句 Compound statements
	5.  选择语句（条件）Selection statements (conditionals)
	6.  迭代语句（循环）Iteration statements (loops)
	7.  Try 语句块 Try blocks
	
	在结束本教程的学习后，你将掌握上述全部的语句类型！

## 函数和 `main`函数

在C++ 中，我们通常会合并使用一组语句，这一组语句称为一个函数。函数就是一组顺序执行（从上向下按顺序执行）的语句的集合。在我们学习编程程序的过程中，你会编写自己的函数，根据我们的目的混合或使用语句（具体做法将在后续的课程中介绍）。

!!! note "法则"

	每个C++程序都必须包含一个函数名为 `main` 的函数(main全部为小写字母)。当程序开始运行的时候，`main`函数中的代码会被顺序执行。

一般情况下，程序通常会在完成 `main` 函数中最后一条语句后终止（尽管也可能提前终止或者在结束后执行一些清理操作）。

编写的函数一般是为了完成某个特定的工作。例如，名为 "max" 的函数一般用于两个数字比大小。而名为 “calculateGrade” 的函数则用于计算学生成绩（grade）。我们会在函数一节中对其进行详细介绍，毕竟函数是构建程序的最常用的工具。

!!! info "作者注"

	当我们谈论函数时，通常会在函数名后面加上一组括号作为一种速记法。例如，当你看到 `main()` 或者 `doSomething()` 的时候，你应该清楚此时我们在谈论一个名为 _main_ 或者 _doSomething_ 的函数。这么做可以帮助我们将函数和其他类型的名称区分开来（例如变量名），同时不必每次都加上“函数”二字。

## Hello world! 程序剖析

现在，你已经初步了解了什么是语句以及什么是函数，接下来，让我们回到 “Hello world” 程序并逐行对其进行分析。

```cpp
#include <iostream>

int main()
{
   std::cout << "Hello world!";
   return 0;
}
```

**第一行**比较特殊，称为[[preprocessor directive|预处理器指令]]。该指令表明用户需要使用 `iostream` 库的内容，该库属于C++标准库的一部分，程序可以使用该库提供的功能从[[控制台(console)]]读写文本。我们需要这一行代码，是为了在第五行使用 `std::cout`。如果将这一行删除，则会导致第五行编译时报错，因为这样[[编译器(compiler)]]就不知道 `std::cout` 是什么了。

**第二行**是空行，编译器会将其忽略。它的存在仅仅是为了让程序可读性变得更好（将`#include` 预处理器指令和程序的其他部分分割开来）。

**第三行** tells the compiler that we’re going to write (define) a function called _main_. As you learned above, every C++ program must have a _main_function or it will fail to link.

Lines 4 and 7 tell the compiler which lines are part of the _main_ function. Everything between the opening curly brace on line 4 and the closing curly brace on line 7 is considered part of the _main_ function. This is called the function body.

Line 5 is the first statement within function _main_, and is the first statement that will execute when we run our program. _std::cout_ (which stands for “character output”) and the `<<` operator allow us to send letters or numbers to the console to be output. In this case, we’re sending it the text “Hello world!”, which will be output to the console. This statement creates the visible output of the program.

Line 6 is a return statement. When an executable program finishes running, the program sends a value back to the operating system in order to indicate whether it ran successfully or not. This particular return statement returns the value of 0 to the operating system, which means “everything went okay!”. This is the last statement in the program that executes.

All of the programs we write will follow this general template, or a variation on it.

!!! info "作者注"

	If parts (or all) of the above explanation are confusing, that’s to be expected at this point. This was just to provide a quick overview. Subsequent lessons will dig into all of the above topics, with plenty of additional explanation and examples.


You can compile and run this program yourself, and you will see that it outputs the following to the console:

```
Hello world!
```
If you run into issues compiling or executing this program, check out lesson [0.8 -- A few common C++ problems](https://www.learncpp.com/cpp-tutorial/a-few-common-cpp-problems/).

## Syntax and syntax errors

In English, sentences are constructed according to specific grammatical rules that you probably learned in English class in school. For example, normal sentences end in a period. The rules that govern how sentences are constructed in a language is called syntax. If you forget the period and run two sentences together, this is a violation of the English language syntax.

C++ has a syntax too: rules about how your programs must be constructed in order to be considered valid. When you compile your program, the compiler is responsible for making sure your program follows the basic syntax of the C++ language. If you violate a rule, the compiler will complain when you try to compile your program, and issue you a syntax error.

Let’s see what happens if we omit the semicolon on line 5 of the “Hello world” program, like this:

```cpp
#include <iostream>

int main()
{
   std::cout << "Hello world!"
   return 0;
}
```

COPY

Feel free to compile this ill-formed program yourself.

Visual Studio produces the following error (your compiler may generate an error message with different wording):

```
c:\vcprojects\test1.cpp(6): error C2143: syntax error : missing ';' before 'return'
```

This is telling you that you have a syntax error on line 6: the compiler was expecting a semicolon before the return statement, but it didn’t find one. Although the compiler will tell you which line of code it was compiling when it encountered the syntax error, the omission may actually be on a previous line. In this case, the error is actually at the end of line 5 (the compiler didn’t discover the issue until line 6).

Syntax errors are common when writing a program. Fortunately, they’re typically straightforward to find and fix, as the compiler will generally point you right at them. Compilation of a program will only complete once all syntax errors are resolved.

You can try deleting characters or even whole lines from the “Hello world” program to see different kinds of errors that get generated. Try restoring the missing semicolon at the end of line 5, and then deleting lines 1, 3, or 4 and see what happens.