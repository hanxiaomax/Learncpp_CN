---
title: 7.11 - 挂起（提前结束程序）
alias: 7.11 - 挂起（提前结束程序
origin: /halts-exiting-your-program-early/
origin_title: "7.11 — Halts (exiting your program early)"
time: 2022-5-31
type: translation
tags:
- halt
---

??? note "Key Takeaway"



在本章中我们将介绍的最后一类流控制语句是挂起语句。挂起终止程序的流控制语句。在C++中，程序停止被实现为函数(而不是关键字)，因此我们的停止语句将是函数调用。

让我们绕个小弯子，回顾一下程序正常退出时发生的情况。当`main()` 函数返回时(到达函数的末尾，或者通过`return`语句)，会发生许多不同的事情。

首先，因为我们要离开函数，所以所有局部变量和函数形参都被销毁(像往常一样)。

接下来，一个名为 `std::exit()` 的特殊函数被调用，并将`main()` 的返回值(`状态码`)作为参数传入。那么 `std::exit()` 是什么呢?

## `std::exit()` 函数

`std::exit()` 是一个可以让程序正常终止的函数。正常终止的意思是，程序以我们期望的方式退出。注意术语**正常终止**并不隐含程序是否执行成功的含义（这是返回状态码的作用）。例如，假设我们编写了一个程序需要用户输入文件名。如果用户输入的是非法的文件名，则程序通常应该返回非零的状态码来表示失败，但是该程序仍然可以**正常终止**。

`std::exit()` 执行许多清理函数。首先，销毁具有静态存储持续时间的对象。然后，如果使用了任何文件，则执行其他一些杂项文件清理。最后，控制被返回给操作系统，传递给`std::exit()` 的参数被用作`状态码`。

## 显式调用 `std::exit()` 

虽然`std::exit()` 在`main()` 结束时会被隐式调用，但它也可以被显式调用，以在程序正常终止前停止程序。当以这种方式调用`std::exit()` 时，你需要包含 `cstdlib` 头文件。

下面是显式调用 `std::exit()` 的一个例子:

```cpp
#include <cstdlib> // for std::exit()
#include <iostream>

void cleanup()
{
    // code here to do any kind of cleanup required
    std::cout << "cleanup!\n";
}

int main()
{
    std::cout << 1 << '\n';
    cleanup();

    std::exit(0); // terminate and return status code 0 to operating system

    // The following statements never execute
    std::cout << 2 << '\n';

    return 0;
}
```

程序打印：

```
1
cleanup!
```

注意，`std::exit()` 之后的语句永远不会执行，因为程序已经终止了。

虽然在上面的程序中，我们从函数 `main()` 调用 `std::exit()` ，但也可以从任何函数调用`std::exit()`来终止程序。

关于显式调用 `std::exit()` 的一个重要注意事项是： `std::exit()` 不会清除任何本地变量(无论是在当前函数中，还是在调用栈中的函数)。因此，通常最好避免调用`std::exit()` 。
!!! warning "注意"

	`std::exit()`函数不会清理当前函数中的局部变量或清理调用堆栈。

## `std::atexit`

因为`std::exit()` 会立即终止程序，所以你可能需要在终止前手动执行一些清理操作。在这种情况下，清理意味着关闭数据库或网络连接、释放所分配的内存、将信息写入日志文件等。

在上面的例子中，我们调用函数`cleanup()` 来处理清理任务。然而，记住在调用`exit()`之前手动调用一个清理函数会给程序员增加负担。

为了帮助我们完成这项工作，C++提供了`std::atexit()` 函数，它允许指定一个函数，该函数将在程序终止时通过 `std::exit()` 自动调用。

!!! info "相关内容"

	我们会在[[12-1-function-pointers|12.1 - 函数指针]]中介绍如何将函数作为参数传递

请看下面的例子：

```cpp
#include <cstdlib> // for std::exit()
#include <iostream>

void cleanup()
{
    // code here to do any kind of cleanup required
    std::cout << "cleanup!\n";
}

int main()
{
    // register cleanup() to be called automatically when std::exit() is called
    std::atexit(cleanup); // note: we use cleanup rather than cleanup() since we're not making a function call to cleanup() right now

    std::cout << 1 << '\n';

    std::exit(0); // terminate and return status code 0 to operating system

    // The following statements never execute
    std::cout << 2 << '\n';

    return 0;
}
```

该程序的输出与前面的示例相同：

```
1
cleanup!
```

为什么要这么做呢？这样你就可以在一个地方指定一个清理函数(可能在 `main` 中)，然后不必担心在调用 `std::exit()` 之前记得显式调用该函数。

首先，由于 `std::exit()` 在 `main()` 终止时隐式调用，如果程序以这种方式退出，`std::atexit()` 注册的任何函数都会被调用。第二，被注册的函数必须不带参数，也没有返回值。最后，如果你愿意，你可以使用 `std::atexit()` 注册多个清理函数，它们将按注册的相反顺序调用(最后注册的将最先调用)。

!!! info "扩展阅读"

在多线程程序中，调用`std::exit()` 可能导致程序崩溃(因为调用`std::exit()` 的线程将清理仍然可能被其他线程访问的静态对象)。因此，C++引入了另一对函数，它们的工作方式类似于 `std::exit()` 和 `std::atexit()` ，它们被称为`std::quick_exit()` 和 `std::at_quick_exit()` 。`std::quick_exit()` 会正常地终止程序，但不会清理静态对象，可能会也可能不会执行其他类型的清理。对于以`std::quick_exit()` 结束的程序，`std::at_quick_exit()` 执行与`std::atexit()` 相同的作用。

## `std::abort` 和 `std::terminate`

C++包含另外两个与停止相关的函数。

`std::abort()` 函数会导致程序非正常终止。异常终止意味着程序有某种不寻常的运行时错误，程序不能继续运行。例如，试图除以0将导致异常终止。`std::abort()` 不做任何清理。

```cpp
#include <cstdlib> // for std::abort()
#include <iostream>

int main()
{
    std::cout << 1 << '\n';
    std::abort();

    // The following statements never execute
    std::cout << 2 << '\n';

    return 0;
}
```

我们将在本章后面看到隐式调用`std::abort()` 的情况([[7-17-assert-and-static-assert|7.17 -断言和static_assert]])。

`std::terminate()` 函数通常与异常一起使用(我们将在后面的章节中讨论异常)。虽然可以显式地调用`std::terminate` ，但在没有处理异常时(以及在其他一些与异常相关的情况下)，更多的情况是隐式地调用它。默认情况下，`std::terminate()`会调用`std:: abort()`。

## 什么时候应该挂起程序？

简短的回答是“几乎没有”。销毁局部对象是C++的一个重要部分(特别是当我们进入类时)，上面提到的函数都没有清除局部变量。异常是处理错误情况的更好、更安全的机制。

!!! success "最佳实践"

	只有在没有从主函数正常返回的安全方法时才使用挂起。如果没有禁用异常，最好使用异常来安全地处理错误。