---
title: 8.1 - 控制流
alias: 8.1 - 控制流
origin: /control-flow-introduction/
origin_title: "7.1 — Control flow introduction"
time: 2021-8-2
type: translation
tags:
- control flow
---


> [!note] "Key Takeaway"


当程序开始运行时，CPU从 `main()` 的顶部开始执行指令（默认按照顺序执行），当到达 `main()` 函数末尾时，程序停止。CPU执行语句的特定顺序，称为执行路径（简称路径）。

考虑下面代码：

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter an integer: ";

    int x{};
    std::cin >> x;

    std::cout << "You entered " << x;

    return 0;
}
```

该程序的执行路径依次包括第5、7、8、10和12行。这是一个直线程序的例子。直线程序每次运行时都采用相同的路径(以相同的顺序执行相同的语句)。

然而，这往往并不是我们想要的。例如，如果我们要求用户输入，而用户输入的内容无效，理想情况下，我们希望要求用户做出另一个选择。这在直线顺序执行的程序中这是不可能的。事实上，用户可能会重复输入无效的输入，所以我们可能需要要求他们做出另一个选择的次数直到运行时才知道。

幸运的是，C++提供了许多不同的控制流语句(也称为流控制语句)，这些语句允许程序员通过程序改变正常的执行路径。你已经看到了一个关于“if语句”的例子(在课程[[4-10-Introduction-to-if-statements|4.10 - if 语句简介]]中介绍)，它允许我们只在条件表达式为真时执行语句。

当“控制流语句”导致执行点更改为非顺序语句时，这称为分支。

控制语句的分类：

|分类	|含义	|实现|
|---|---|---|
|条件语句	|条件语句只在满足某些条件时执行代码序列	|`if`, `switch`|
|跳转	|跳转告诉CPU从其他位置开始执行语句.	|`Goto`, `break`, `continue`|
|函数调用	|函数调用会跳转到其他地方执行再返回	|`Function calls`, `return`|
|循环	|循环告诉程序重复执行某些语句0次或多次，知道满足某种条件|`while`, `do-while`, `for`, `ranged-for`|
|挂起	|告诉程序停止运行|`std::exit()`, `std::abort()`|
|异常	|异常是为错误处理而设计的一种特殊的流控制结构	|`try`, `throw`, `catch`|


我们会在本章介绍除异常以外的其他全部类别的控制语句。

在学习本章前，你可以让一个程序做的事情是相当有限的。在学会控制程序的流程(特别是使用循环)后，可以做许多有趣的事情！我们将不再局限于玩具程序和小练习——你将能够编写真正有用的程序。

这才是真正有趣的开始。所以让我们继续吧！