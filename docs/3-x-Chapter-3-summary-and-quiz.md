---
title: 3.x - 小结与测试
alias: 3.x - 小结与测试
origin: /chapter-3-summary-and-quiz/
origin_title: "3.x — Chapter 3 summary and quiz"
time: 2022-1-2
type: translation
tags:
- summary
---


如果你的语句不符合 C++ 的语法，则会产生**语法错误**。编译器或捕获语法错误。

当语句的语法正确，但是其行为并不符合程序员的本意，此时称为**语义错误**。

定位并修复程序错误的过程，称为debugging。

可以使用五步法来定位并修复程序错误：

1.  定位根因；
2.  理解问题；
3.  确定修复方式；
4.  修复问题；
5.  重新测试

debug过程中最困难的部分就是找到问题所在。

静态分析工具可以用来对代码进行分析，查找可能导致问题的语义错误。

debug过程中，最重要的一步就是要能够稳定地复现问题。

以下方法可以帮助我们定位问题：

-  注释掉代码；
-  使用输出语句来验证代码流程；
-   打印值。

当使用打印语句时，推荐使用 `std::cerr` 来代替 `std::cout`，不过最好避免依赖打印语句来定位问题。

日志文件记录了程序中的各个事件。A log file is a file that records events that occur in a program. The process of writing information to a log file is called logging.

The process of restructuring your code without changing how it behaves is called refactoring. This is typically done to make your program more organized, modular, or performant.

Unit testing is a software testing method by which small units of source code are tested to determine whether they are correct.

Defensive programming is a technique whereby the programmer tries to anticipate all of the ways the software could be misused. These misuses can often be detected and mitigated.

All of the information tracked in a program (variable values, which functions have been called, the current point of execution) is part of the program state.

A debugger is a tool that allows the programmer to control how a program executes and examine the program state while the program is running. An integrated debuggeris a debugger that integrates into the code editor.

Stepping is the name for a set of related debugging features that allow you to step through our code statement by statement.

Step into executes the next statement in the normal execution path of the program, and then pauses execution. If the statement contains a function call, _step into_ causes the program to jump to the top of the function being called.

Step over executes the next statement in the normal execution path of the program, and then pauses execution. If the statement contains a function call, _step over_executes the function and returns control to you after the function has been executed.

Step out executes all remaining code in the function currently being executed and then returns control to you when the function has returned.

Run to cursor executes the program until execution reaches the statement selected by your mouse cursor.

Continue runs the program, until the program terminates or a breakpoint is hit.  
Start is the same as continue, just from the beginning of the program.

A breakpoint is a special marker that tells the debugger to stop execution of the program when the breakpoint is reached.

Watching a variable allows you to inspect the value of a variable while the program is executing in debug mode. The watch window allows you to examine the value of variables or expressions.

The call stack is a list of all the active functions that have been executed to get to the current point of execution. The call stack window is a debugger window that shows the call stack.