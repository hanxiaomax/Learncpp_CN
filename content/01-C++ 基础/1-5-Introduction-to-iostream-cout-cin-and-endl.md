---
title: 1.5 - iostream 简介：cout，cin 和 endl
alias: 1.5 - iostream 简介：cout，cin 和 endl
origin: /introduction-to-iostream-cout-cin-and-endl/
origin_title: "1.5 — Introduction to iostream: cout, cin, and endl"
time: 2022-4-20
type: translation
tags:
- iostream
---

本节将重点介绍 `std::cout`。我们在 _Hello world!_ 程序中已经使用它向控制台输出过文本 _Hello world!_ 。我们还将介绍如何从用户获取输入，使程序具备与用户交互的能力。

## 输入输出库

输入输出库 ( IO 库) 是 C++ 标准库的一部分，用于处理基本的输入和输出。我们会使用该库提供的功能从键盘获取输入并向控制台输出数据。`iostream` 中的 io 指代的是输入输出（_input/output_）。

为了使用 `iostream` 库提供的功能，我们需要在任何需要使用该库的源文件的顶部包含  `iostream` 的头文件，像下面这样：

```cpp
#include <iostream>

// rest of code that uses iostream functionality here
```

## std:: cout

`iostream` 库中包含了一些预定义的变量供我们使用，其中最有用的当属 `std::cout`，通过它可以向控制台打印文本，`cout` 代表的含义就是字符输出（character output）。

提醒一下，下面既是之前的 _Hello world_ 程序：

```cpp
#include <iostream> // for std::cout

int main()
{
    std::cout << "Hello world!"; // print Hello world! to console

    return 0;
}
```

在这个程序中，_iostream_ 已经被包含了，因此我们可以访问 `std::cout`。在主函数中，我们使用了 `std::cout`，并配合插入运算符（`<<`）将文本 Hello world!发送到控制台并打印出来。

`std::cout` 不仅可以打印文本，还可以打印数字：

```cpp
#include <iostream> // for std::cout

int main()
{
    std::cout << 4; // print 4 to console

    return 0;
}
```

输出结果：

```
4
```

它还可以用来打印变量的值：

```cpp
#include <iostream> // for std::cout

int main()
{
    int x{ 5 }; // define integer variable x, initialized with value 5
    std::cout << x; // print value of x (5) to console
    return 0;
}
```

输出结果：

```bash
5
```

为了在一行中打印多个内容，可以多次使用插入运算符将多个要输出的内容连接起来并输出，例如：

```cpp
#include <iostream> // for std::cout

int main()
{
    std::cout << "Hello" << " world!";
    return 0;
}
```

输出结果：

```bash
Hello world!
```

另外一个例子如下，在这个例子中，我们在一条语句中同时打印了文本和变量值：

```cpp
#include <iostream> // for std::cout

int main()
{
    int x{ 5 };
    std::cout << "x is equal to: " << x;
    return 0;
}
```

输出结果：

```bash
x is equal to: 5
```

> [!info] "相关内容"
> 我们会在[[2-9-Naming-collisions-and-an-introduction-to-namespaces|2.9 - 命名冲突和命名空间]]讨论`std::`前缀的作用

## `std::endl`

你觉得下面的代码打印的结果是什么呢？

```cpp
#include <iostream> // for std::cout

int main()
{
    std::cout << "Hi!";
    std::cout << "My name is Alex.";
    return 0;
}
```

看到下面的结果你会觉得吃惊吗：

```bash
Hi!My name is Alex.
```

显然，将一条语句拆分为两行，并不会产生不同的结果。

如果我们希望分行打印，则必须要告知控制台将光标移动到下一行。

一种方式是使用 `std::endl`。当使用 `std::cout`  进行输出时，`std::endl` 会打印一个换行符（促使光标被移动到下一行的开头）。因此，`endl` 表示的是结束该行（end line）。

例程：

```cpp
#include <iostream> // for std::cout and std::endl

int main()
{
    std::cout << "Hi!" << std::endl; // std::endl will cause the cursor to move to the next line of the console
    std::cout << "My name is Alex." << std::endl;

    return 0;
}
```

输出结果：

```bash
Hi!
My name is Alex.
```

> [!tip] "小贴士"
> 在上面的程序中，第二个`std::endl`从技术上讲并无必要，因为在执行完这行代码后程序会立即停止。不过，这么做其实还有两个有用的目的：首先，它可以表明该行的内容已经被”完整输出“ （与之相对的是部分输出，即后续代码中还有需要输出的部分）。其次，如果将来我们在后面添加其他额外的输出，就不需要修改已有的代码了。因此不妨加上它。

## `std:: endl` vs `\n`

使用 `std::endl` 换行的效率稍微有点低，因为它通常需要完成两件事：将光标移动到下一行，然后确保输出结果马上显示在屏幕上（称为刷新输出）。当使用 `std::cout` 进行输出时，`std::cout` 本来就会刷新输出（即使没有刷新，通常也不会产生什么问题）。因此，使用 `std::endl` 来刷新输出就有些多余了。

因此，使用换行字符(`\n`)一般来讲是更好的选择。‘\n’ 符号会将光标移动到下一行，但是它并不会请求刷新，因此在无需特别刷新时可以获得更好的性能。‘\n’ 字符还更易读，因为它不仅更简洁，而且还可以嵌入在已有的文本中。

下面的例子中展现了使用 ‘\n’ 的两种不同方式：

```cpp
#include <iostream> // for std::cout

int main()
{
    int x{ 5 };
    std::cout << "x is equal to: " << x << '\n'; // Using '\n' standalone
    std::cout << "And that's all, folks!\n"; // Using '\n' embedded into a double-quoted piece of text (note: no single quotes when used this way)
    return 0;
}
```

输出结果：
```bash
x is equal to: 5
And that's all, folks!
```

注意，在单独使用换行符 ‘\n’ 的时候，单引号是必须的。当嵌入在其他已经被双引号包裹的文本中时，则无需再使用单引号。

我们会在后续的课程中更详细的介绍换行符 ‘\n’ ([[4-11-Chars|4.11 - 字符]])。

> [!success] "最佳实践"
> 在输出时优先使用 ‘\n’ 而不是 `std::endl`

> [!warning] "注意"
> ‘\n’使用的是反斜杠（和其他特殊字符一样），而不是斜杠。使用斜杠（例如 '/n'）可能会带来无法预料的结果。

## std:: cin

`std::cin` 是 `iostream` 中预定义的另外一个变量。与用于输出的 `std::cout` 不同， `std::cin`(表示字符输入，“character input”) 配合提取运算符(`>>`)，可以从键盘读取输入。当然，输入的结果必须存放在变量中才可以被使用。

```cpp
#include <iostream>  // for std::cout and std::cin

int main()
{
    std::cout << "Enter a number: "; // ask user for a number

    int x{ }; // define variable x to hold user input (and zero-initialize it)
    std::cin >> x; // get number from keyboard and store it in variable x

    std::cout << "You entered " << x << '\n';
    return 0;
}
```

请尝试自行编译和运行上述程序。在执行程序时，第五行代码会打印“Enter a number: “，当执行到第八行是，程序会等待用户输入。当你输入一个数字（并按下回车）后，它会被赋值给变量 x。最后，第十行代码会打印 “You entered ” 以及你刚才输入的数字。

例如：
```bash
Enter a number: 4
You entered 4
```

这种方式能够比较简单地从用户获取输入，我们会在后续的内容中大量使用这种方式。注意，在获取输入时并不需要换行符，因为用户会自行按下回车键，此时光标便会被移动到下一行。

如果你的程序界面在输入数字后马上就关闭了，请参考 [0.8 -- A few common C++ problems](https://www.learncpp.com/cpp-tutorial/a-few-common-cpp-problems/) 来获取帮助。

与输出类似，一行代码也可以完成多个值的输入：

```cpp
#include <iostream>  // for std::cout and std::cin

int main()
{
    std::cout << "Enter two numbers separated by a space: ";

    int x{ }; // define variable x to hold user input (and zero-initialize it)
    int y{ }; // define variable y to hold user input (and zero-initialize it)
    std::cin >> x >> y; // get two numbers and store in variable x and y respectively

    std::cout << "You entered " << x << " and " << y << '\n';

    return 0;
}
```

输出结果如下：

```bash
Enter two numbers separated by a space: 5 6
You entered 5 and 6
```

> [!success] "最佳实践"
> 变量在用于接收用户输入（例如通过 `std::cin`）的数据之前，是否应该进行初始化这个问题有很多争论，因为用户的输入会覆盖初始化的值。与我们之前的建议类似，变量在使用前都必须要进行初始化，因此这里的最佳实践仍然是，变量要先进行初始化再用于接收用户输入。

我们会在[[7-16-std-cin-and-handling-invalid-input|7.16 - std::in 和输入错误处理]]中讨论 `std::cin` 如何应对非法输入。


> [!info] "扩展阅读"
> C++ 的输入输出库并没有提供一种无需按下回车就可以获取输入结果的方法。如果你希望实现该功能，将不得不使用第三方库。如果是开发控制台应用程序，我们推荐尝试 [pdcurses](https://pdcurses.org/) 、[FXTUI](https://github.com/ArthurSonzogni/FTXUI)或[cpp-terminal](https://github.com/jupyter-xeus/cpp-terminal)。另外，很多图形用户库界面库也提供了类似的功能。

## 小结

新手程序员常常会混淆 `std::cin`、`std::cout`、插入运算符 (`<<`) 和提取运算符 (`>>`)。下面这些技巧可以帮助你记忆：

- `std::cin` 和 `std::cout` 总是位于语句的左侧。
- `std::cout` 用于输出 (cout = character output)
- `std::cin` 用于输入 (cin = character input)
- `<<` 配合 `std::cout` 使用，同时也表明了数据的流动方向 (假设 `std::cout` 表示的是控制台，则输出的数据从变量流向控制台）。`std::cout << 4` 就表示将 4 发送到控制台。
- `>>` 配合 `std::cin` 使用，同时也表明了数据的流动方向 (假设 `std::cin` 表示的是键盘，则输入的数据是从键盘流向变量）。`std::cin >> x` 就表示从键盘获取的用户输入被存放到变量 x 中

更多关于运算符的详细内容，将在[[1-9-Introduction-to-literals-and-operators|1.9 - 字面量和操作符]]中进行介绍。
