---
title: 2.1 - 函数简介
alias: 2.1 - 函数简介
origin: /introduction-to-functions/
origin_title: "2.1 — Introduction to functions
"
time: 2022-5-19
type: translation
tags:
- function
---


在上一章节中，我们将函数定义为一组顺序执行指令的合集。这个定义固然没错，但是它并没有表达出函数的重要性。 这里让我们重新定义函数：函数是一组为了完成某项任务而创建的可复用的顺序指令集合。

你已经知道了，任何都必须包含一个名为 `main` 的函数（程序开始执行的地方）。然而，如果将程序的所有代码都塞进 `main` 函数中，那么它无疑会变得越来越长，也越来越难以维护。而函数则提供了一种将程序分割成简短的、模块化的代码段的方式。这种方式的代码更加容易管理、容易测试，也更容易使用。C++ 标准库中包含了非常多的已经编写好的函数可供你使用。不过，使用自己编写的函数也是非常常见的情形，这些函数称为用户自定义函数。

我们可以考虑这样一种生活中的场景：当你在阅读的时候，突然想到要去打一个电话。此时你会将书签夹在书里，然后去打电话，然后在回到夹了书签的地方继续阅读。

C++ 函数也可以通过类似的方法去工作。当遇到函数调用的时候，程序会进入函数并顺序地执行其中各个语句。而所谓函数调用，实际上是一个表达式，它可以告诉 CPU 中断当前函数的执行而转去执行另外一个函数。此时 CPU 就会在当前的执行点”插入一个书签“，然后去执行另外的函数。当该函数执行完毕后，CPU 就会返回之前中断的点继续执行。

实施函数调用的函数，称为**主调函数(caller)**，而被它调用的函数称为**被调函数(callee 或 called function)**。

## 自定定义函数案例

首先，让我们熟悉一下定义函数的基本语法。在接下来的几节课中，用户定义函数都是如下形式：

```
return-type identifier() // identifier replaced with the name of your function
{
// Your code here
}
```

简单介绍一下其中四个主要元素：

- 在本课程中，我们会使用 `int`（对于 `main()` 函数）或 `void` （对于其他函数）作为函数的返回值类型（ `return-type`）。我们会在下一节课（[[2.2 函数返回值 (带返回值的函数)]]）中介绍更多的返回值类型；
- 和变量一样，函数也有函数名。`identifier` 就是你定义的函数的函数名；
- 标识符后面的括号告诉编译器这里是在定义一个函数；
- 花括号以及花括号内部的语句称为**函数体**。这里就是放置函数语句的的地方。

下面的代码展示了如何定义并使用一个函数：

```cpp
#include <iostream> // for std::cout

// 定义一个名为 doPrint() 的函数
void doPrint() // doPrint() 在本例中是被调函数
{
    std::cout << "In doPrint()\n";
}

// Definition of function main()
int main()
{
    std::cout << "Starting main()\n";
    doPrint(); // 中断 main() 函数并调用 doPrint()。main() 函数是主调函数
    std::cout << "Ending main()\n"; // 在 doPrint() 结束后执行该指令

    return 0;
}
```

上述代码的输出结果如下：

```
Starting main()
In doPrint()
Ending main()
```

该程序从 `main` 函数的顶部开始执行，第一行会打印 `Starting main()`.

`main` 函数的第二行会调用 `doPrint`。通过在函数名后面加上括号就可以调用该函数，例如 `doPrint()`。注意，如果你忘记了括号，程序可能无法编译（如果程序能够编译，函数也不会被调用）。

!!! warning "注意"

	在调用函数的时候，不要忘记加上括号。

因为执行了函数调用，`main`函数中语句的执行被暂停了，此时会跳转到被调函数 `doPrint`的顶部开始执行。`doPrint`函数的第一行（也是唯一一行）会打印 `In doPrint()`。当函数执行完毕后，程序会返回主调函数(`main`函数)，从之前离开的位置继续执行。因此，下一条要执行的语句是打印 `Ending main()`。

## 多次调用函数

函数最有用的功能莫过于它可以被多次调用。下面例子展示了多次调用函数的场景：

```cpp
#include <iostream> // for std::cout

void doPrint()
{
    std::cout << "In doPrint()\n";
}

// Definition of function main()
int main()
{
    std::cout << "Starting main()\n";
    doPrint(); // doPrint() called for the first time
    doPrint(); // doPrint() called for the second time
    std::cout << "Ending main()\n";

    return 0;
}
```

上述程序输出结果如下：

```
Starting main()
In doPrint()
In doPrint()
Ending main()
```

因为 `doPrint` 在`main`函数中被调用了两次，因此它也会执行两次，因此`In doPrint()` 会打印两次（每次调用打印一次）。

## 函数链式调用

你已经看到了，`main` 函数可以调用其他函数（例如 `doPrint`）。任何函数都可以函数。在下面的程序中，`main` 函数会调用函数`doA`，`doA`函数又会调用 `doB`：

```cpp
#include <iostream> // for std::cout

void doB()
{
    std::cout << "In doB()\n";
}

void doA()
{
    std::cout << "Starting doA()\n";

    doB();

    std::cout << "Ending doA()\n";
}

// Definition of function main()
int main()
{
    std::cout << "Starting main()\n";

    doA();

    std::cout << "Ending main()\n";

    return 0;
}
```

上述代码输出结果如下：

```
Starting main()
Starting doA()
In doB()
Ending doA()
Ending main()
```

## C++不支持函数嵌套

和其他语言不同，C++并不支持在函数中定义其他函数。下面的代码是不合法的：

```cpp
#include <iostream>

int main()
{
    void foo() // 错误：该函数定义位于其他函数内部。
    {
        std::cout << "foo!\n";
    }

    foo(); // function call to foo()
    return 0;
}
```

正确的方式应该像下面这样：

```cpp
#include <iostream>

void foo() // no longer inside of main()
{
    std::cout << "foo!\n";
}

int main()
{
    foo();
    return 0;
}
```


!!! cite "题外话"

	“foo” 是一个没有意义的单词，在展示某些概念的时候，如果名称不重要，那么常会使用它来作为占位符。此类单词有个专门的名字叫做：伪变量/[metasyntactic variables](https://baike.baidu.com/item/伪变量/7994371?fr=aladdin) (不过，在日常用语中大家还是喜欢称其为”名称占位符“，因为 metasyntactic variables这个单词真的很生僻)。 其他C++中常见的伪变量还包括 “bar”、“baz”以及其他以“oo”结尾的三字母单词，例如“goo”、“moo”和“boo”。
	
	如果你对其词源感兴趣，可以去阅读 [RFC 3092](https://datatracker.ietf.org/doc/html/rfc3092) 。

