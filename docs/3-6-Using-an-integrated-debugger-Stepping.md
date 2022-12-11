---
title: 3.6 - 使用集成调试器之单步调试
alias: 3.6 - 使用集成调试器之单步调试
origin: /using-an-integrated-debugger-stepping/
origin_title: "3.6 — Using an integrated debugger: Stepping"
time: 2021-8-30
type: translation
tags:
- debugger
---


当你运行程序时，程序会从 `main` 函数的顶部开始执行，然后逐条执行，直到程序结束。在程序运行的任何时间点，程序都在跟踪很多事情：你正在使用的变量的值，调用了哪些函数(这样当这些函数返回时，程序就知道要返回到哪里)，以及程序中的当前执行点(这样它就知道下一步要执行哪条语句)。所有这些被跟踪的信息都被称为程序状态(或简称为 `state`)。

在前面的课程中，我们介绍的调试方法都需要对代码进行修改，例如添加打印语句或使用日志工具。这些是在程序运行时检查程序状态的简单方法。尽管如果使用得当，这些方法是有效的，但也有缺点：它们需要修改代码，这需要时间，并可能引入新的错误，并且它们会使代码变得混乱，使现有的代码更难理解。

我们之所以这么做，是因为我们基于一个假设——即代码一旦开始运行，程序就会运行到结束(只会在接受输入时暂停)，我们没有机会在任何我们想要的时候进行干预和检查程序的结果。

然而，如果我们能够消除这种假设呢？幸运的是，大多数现代IDE都提供了一种称为调试器的集成工具，该工具正是为此而设计的。

## 调试器

调试器是一种计算机程序，它允许程序员控制另一个程序的执行方式，并在该程序运行时检查该程序的状态。例如，程序员可以使用调试器逐行执行程序，在整个过程中检查变量的值。通过将变量的实际值与预期值进行比较，或者观察整个代码的执行路径，调试器可以极大地帮助跟踪语义(逻辑)错误。

调试器有两大核心功能：精确控制程序执行的能力，以及查看(和修改，如果需要的话)程序状态的能力。

早期的调试器，如 [gdb](https://en.wikipedia.org/wiki/Gdb)，是具有命令行接口的独立程序，程序员必须键入神秘的命令才能使它们工作。后来的调试器(如Borland的[turbo debugger]的早期版本(https://en.wikipedia.org/wiki/Turbo_Debugger))仍然是独立的，但有自己的“图形化”前端，能够使其更加易用。目前大多数现代IDE都有一个集成的调试器——也就是说，调试器使用与代码编辑器相同的接口，因此你可以使用编写代码时使用的相同环境进行调试(而不必切换程序)。

几乎所有的现代调试器都包含相同的基本功能标准集——然而，在访问这些功能的菜单如何使用方面几乎没有一致性，键盘快捷键的一致性甚至更低。尽管我们的示例将使用Microsoft Visual Studio的截图(我们也将介绍如何在Code::Blocks中完成所有操作)，但无论你使用的是哪种IDE，都应该不难弄清楚如何访问我们讨论的每个功能。

!!! tip "小贴士"

	调试器键盘快捷键只有在IDE/集成调试器是活动窗口时才有效。

本章的剩余部分将学习如何使用调试器。

!!! tip "小贴士"

	不要忽视学习使用调试器。随着程序变得越来越复杂，与查找和修复问题所节省的时间相比，学习有效使用集成调试器所花费的时间就显得微不足道了。


!!! warning "注意"

	Before proceeding with this lesson (and subsequent lessons related to using a debugger), make sure your project is compiled using a debug build configuration (see [0.9 -- Configuring your compiler: Build configurations](https://www.learncpp.com/cpp-tutorial/configuring-your-compiler-build-configurations/) for more information).

If you’re compiling your project using a release configuration instead, the functionality of the debugger may not work correctly (e.g. when you try to step into your program, it will just run the program instead).

!!! example "For Code::Blocks users"

	If you’re using Code::Blocks, your debugger may or may not be set up correctly. Let’s check.
	
	First, go to _Settings menu > Debugger…_. Next, open the _GDB/CDB debugger_ tree on the left, and choose _Default_. A dialog should open that looks something like this:
	
	![](https://www.learncpp.com/images/CppTutorial/Chapter3/CB-DebuggingSetup-min.png?ezimgfmt=rs:494x497/rscb2/ng:webp/ngcb2)
	
	If you see a big red bar where the “Executable path” should be, then you need to locate your debugger. To do so, click the _…_ button to the right of the _Executable path_field. Next, find the “gdb32.exe” file on your system -- mine was in _C:\Program Files (x86)\CodeBlocks\MinGW\bin\gdb32.exe_. Then click _OK_.

!!! example "For Code::Blocks users"

	There have been reports that the Code::Blocks integrated debugger (GDB) can have issues recognizing some file paths that contain spaces or non-English characters in them. If the debugger appears to be malfunctioning as you go through these lessons, that could be a reason why.

## 单步调试

We’re going to start our exploration of the debugger by first examining some of the debugging tools that allow us to control the way a program executes.

Stepping is the name for a set of related debugger features that let us execute (step through) our code statement by statement.

There are a number of related stepping commands that we’ll cover in turn.

## Step into

The step into command executes the next statement in the normal execution path of the program, and then pauses execution of the program so we can examine the program’s state using the debugger. If the statement being executed contains a function call, _step into_ causes the program to jump to the top of the function being called, where it will pause.

Let’s take a look at a very simple program:

```cpp
#include <iostream>

void printValue(int value)
{
    std::cout << value << '\n';
}

int main()
{
    printValue(5);

    return 0;
}
```


Let’s debug this program using the _step into_ command.

First, locate and then execute the _step into_ debug command once.

!!! example "For Visual Studio users"

	In Visual Studio, the _step into_ command can be accessed via _Debug menu > Step Into_, or by pressing the F11 shortcut key.

!!! example "For Code::Blocks users"

	In Code::Blocks, the _step into_ command can be accessed via _Debug menu > Step into_, or by pressing the Shift-F7

!!! example "For other compilers"

	If using a different IDE, you’ll likely find the _step into_ command under a Debug or Run menu.

When your program isn’t running and you execute the first debug command, you may see quite a few things happen:

-   The program will recompile if needed.
-   The program will begin to run. Because our application is a console program, a console output window should open. It will be empty because we haven’t output anything yet.
-   Your IDE may open some diagnostic windows, which may have names such as “Diagnostic Tools”, “Call Stack”, and “Watch”. We’ll cover what some of these are later -- for now you can ignore them.

Because we did a _step into_, you should now see some kind of marker appear to the left of the opening brace of function _main_ (line 9). In Visual Studio, this marker is a yellow arrow (Code::Blocks uses a yellow triangle). If you are using a different IDE, you should see something that serves the same purpose.

![](https://www.learncpp.com/images/CppTutorial/Chapter3/VS2019-StepInto-Line9-min.png?ezimgfmt=rs:818x475/rscb2/ng:webp/ngcb2)

This arrow marker indicates that the line being pointed to will be executed next. In this case, the debugger is telling us that the next line to be executed is the opening brace of function _main_ (line 9).

Choose _step into_ (using the appropriate command for your IDE, listed above) to execute the opening brace, and the arrow will move to the next statement (line 10).

![](https://www.learncpp.com/images/CppTutorial/Chapter3/VS2019-StepInto-Line10-min.png?ezimgfmt=rs:818x475/rscb2/ng:webp/ngcb2)

This means the next line that will be executed is the call to function _printValue_.

Choose _step into_ again. Because this statement contains a function call to _printValue_, we step into the function, and the arrow will move to the top of the body of _printValue_(line 4).

![](https://www.learncpp.com/images/CppTutorial/Chapter3/VS2019-StepInto-Line4-min.png?ezimgfmt=rs:821x478/rscb2/ng:webp/ngcb2)

Choose _step into_ again to execute the opening brace of function _printValue_, which will advance the arrow to line 5.

![](https://www.learncpp.com/images/CppTutorial/Chapter3/VS2019-StepInto-Line5-min.png?ezimgfmt=rs:818x476/rscb2/ng:webp/ngcb2)

Choose _step into_ yet again, which will execute the statement `std::cout << value` and move the arrow to line 6.

!!! warning "注意"

	Because operator<< is implemented as a function, your IDE may step into the implementation of operator<< instead.

If this happens, you’ll see your IDE open a new code file, and the arrow marker will move to the top of a function named operator<< (this is part of the standard library). Close the code file that just opened, then find and execute _step out_ debug command (instructions are below under the “step out” section, if you need help).

Now because `std::cout << value` has executed, we should see the value _5_ appear in the console window.

!!! tip "小贴士"

	In a prior lesson, we mentioned that std::cout is buffered, which means there may be a delay between when you ask std::cout to print a value, and when it actually does. Because of this, you may not see the value 5 appear at this point. To ensure that all output from std::cout is output immediately, you can add the following statement to the top of your main() function:

```cpp
std::cout << std::unitbuf; // enable automatic flushing for std::cout (for debugging)
```

COPY

Choose _step into_ again to execute the closing brace of function _printValue_. At this point, _printValue_ has finished executing and control is returned to _main_.

You will note that the arrow is again pointing to _printValue_!

![](https://www.learncpp.com/images/CppTutorial/Chapter3/VS2019-StepInto-Line10-min.png?ezimgfmt=rs:818x475/rscb2/ng:webp/ngcb2)

While you might think that the debugger intends to call _printValue_ again, in actuality the debugger is just letting you know that it is returning from the function call.

Choose _step into_ three more times. At this point, we have executed all the lines in our program, so we are done. Some debuggers will terminate the debugging session automatically at this point, others may not. If your debugger does not, you may need to find a “Stop Debugging” command in your menus (in Visual Studio, this is under _Debug > Stop Debugging_).

Note that _Stop Debugging_ can be used at any point in the debugging process to end the debugging session.

Congratulations, you’ve now stepped through a program and watched every line execute!

## Step over

Like _step into_, The **step over** command executes the next statement in the normal execution path of the program. However, whereas _step into_ will enter function calls and execute them line by line, _step over_ will execute an entire function without stopping and return control to you after the function has been executed.

!!! example "For Visual Studio users"

	In Visual Studio, the _step over_ command can be accessed via _Debug menu > Step Over_, or by pressing the F10 shortcut key.

!!! example "For Code::Blocks users"

	In Code::Blocks, the _step over_ command is called _Next line_ instead, and can be accessed via _Debug menu > Next line_, or by pressing the F7 shortcut key.

Let’s take a look at an example where we step over the function call to _printValue_:

```cpp
#include <iostream>

void printValue(int value)
{
    std::cout << value << '\n';
}

int main()
{
    printValue(5);

    return 0;
}
```


First, use _step into_ on your program until the execution marker is on line 10:

![](https://www.learncpp.com/images/CppTutorial/Chapter3/VS2019-StepInto-Line10-min.png?ezimgfmt=rs:818x475/rscb2/ng:webp/ngcb2)

Now, choose _step over_. The debugger will execute the function (which prints the value _5_ in the console output window) and then return control to you on the next statement (line 12).

The _step over_ command provides a convenient way to skip functions when you are sure they already work or are not interested in debugging them right now.

## Step out

Unlike the other two stepping commands, Step out does not just execute the next line of code. Instead, it executes all remaining code in the function currently being executed, and then returns control to you when the function has returned.

!!! example "For Visual Studio users"

In Visual Studio, the _step out_ command can be accessed via _Debug menu > Step Out_, or by pressing the Shift-F11 shortcut combo.

!!! example "For Code::Blocks users"

In Code::Blocks, the _step out_ command can be accessed via _Debug menu > Step out_, or by pressing the ctrl-F7 shortcut combo.

Let’s take a look at an example of this using the same program as above:

```cpp
#include <iostream>

void printValue(int value)
{
    std::cout << value << '\n';
}

int main()
{
    printValue(5);

    return 0;
}
```


_Step into_ the program until you are inside function _printValue_, with the execution marker on line 4.

![](https://www.learncpp.com/images/CppTutorial/Chapter3/VS2019-StepInto-Line4-min.png?ezimgfmt=rs:821x478/rscb2/ng:webp/ngcb2)

Then choose _step out_. You will notice the value _5_ appears in the output window, and the debugger returns control to you after the function has terminated (on line 10).

![](https://www.learncpp.com/images/CppTutorial/Chapter3/VS2019-StepInto-Line10-min.png?ezimgfmt=rs:818x475/rscb2/ng:webp/ngcb2)

This command is most useful when you’ve accidentally stepped into a function that you don’t want to debug.

## A step too far

When stepping through a program, you can normally only step forward. It’s very easy to accidentally step past (overstep) the place you wanted to examine.

If you step past your intended destination, the usual thing to do is stop debugging and restart debugging again, being a little more careful not to pass your target this time.

## Step back

Some debuggers (such as Visual Studio Enterprise Edition and GDB 7.0) have introduced a stepping capability generally referred to as _step back_ or _reverse debugging_. The goal of a _step back_ is to rewind the last step, so you can return the program to a prior state. This can be useful if you overstep, or if you want to re-examine a statement that just executed.

Implementing _step back_ requires a great deal of sophistication on the part of the debugger (because it has to keep track of a separate program state for each step). Because of the complexity, this capability isn’t standardized yet, and varies by debugger. As of the time of writing (Jan 2019), neither Visual Studio Community edition nor the latest version of Code::Blocks support this capability. Hopefully at some point in the future, it will trickle down into these products and be available for wider use.