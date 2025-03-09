---
title: 1.11 - 开发你的第一个程序
alias: 1.11 - 开发你的第一个程序
origin: /developing-your-first-program/
origin_title: "1.11 — Developing your first program"
time: 2022-1-2
type: translation
---

前面的课程已经介绍了不少术语和概念，这些术语和概念几乎会在我们编写的任何程序中出现。在本节课中，我们会运用所学的内容，动手编写一个简单的程序。

## 小程序：输入的数字乘以 2

首先，我们会要求用户输入一个整型数并等待用户完成输入，然后我们会将该值乘以 2 并告诉用户计算结果。上述程序的输出结果如下（假设输入值为 4）：

```bash
Enter an integer: 4
Double that number is: 8
```

下面让我们来**逐步**完成上述功能：

> [!success] "最佳实践"
> 新手程序员常会去尝试一次性完成整个程序的编写，然后便会因为大量报错信息而感到无所适从。比较好的方式是每次添加一部分内容并保证其能够通过编译和通过测试。当你能够确保其正确工作后，再编写接下来的代码。

本节课也会采取上述策略。我们会将程序的实现分为多个步骤，请将各步骤中的代码**输入**（不要复制粘贴）计算机，编译并且运行。

首先，创建一个新的控制台程序项目。

现在，编写一个基本的程序框架。我们知道，编写一个 `main()` 程序是必不可少的步骤（因为 C++程序必须具有一个 main 函数）。如果你的 IDE 没有为你自动创建一个空的空函数的话，请像下面这样自行编写一个：

```cpp
int main()
{
    return 0;
}
```

由于需要向控制台输出信息以及从用户获取数，因此必须要包含 `iostream` 头文件以便能够访问 `std:: cout` 和 `std:: cin`。

```cpp
#include <iostream>

int main()
{
    return 0;
}
```

现在，向用户发送信息，提示他输入一个整型：

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter an integer: ";

    return 0;
}
```

至此，该程序应该能够得到如下的输出结果：

```
Enter an integer:
```

然后程序就终止了。

接下来，需要从用户获取输入信息，这里使用 `std:: cin` 和 `operator>>` 来完成。但是我们必须定义一个用来存放输入结果的变量。

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter an integer: ";

    int num{ }; // define variable num as an integer variable
    std::cin << num; // get integer value from user's keyboard

    return 0;
}
```

是时候再次编译程序了...

糟糕！作者的 Visual Studio 2017 报告了如下信息：

```bash
1>------ Build started: Project: Double, Configuration: Release Win32 ------
1>Double.cpp
1>c:\vcprojects\double\double.cpp(8): error C2678: binary '<<': no operator found which takes a left-hand operand of type 'std::istream' (or there is no acceptable conversion)
1>c:\vcprojects\double\double.cpp: note: could be 'built-in C++ operator<<(bool, int)'
1>c:\vcprojects\double\double.cpp: note: while trying to match the argument list '(std::istream, int)'
1>Done building project "Double.vcxproj" -- FAILED.
========== Build: 0 succeeded, 1 failed, 0 up-to-date, 0 skipped ==========
```

有编译错误！

首先，由于这次编译发生在最新一次代码修改之后，然后就报错了，说明错误是在最后一次修改代码时被引入的（7、8 两行）。因此，我们需要分析的代码相对于全部代码起始是很少的。第七行非常简单（仅仅定义了一个变量），错误很可能不在这一行。这样一来第八行的嫌疑就很大了。

其次，这里的报错信息并不是非常易读。但是我们可以从中寻找一些关键信息：编译器告诉我们，错误发送在第八行。这意味着错误很可能发生在第八行或第八行之前，这也印证了我们之前的猜想。然后，编译器告诉我们，它没有能够找到一个能够在符号左侧接受一个 `std:: istream` 类型（即 `std:: cin` 的类型）的操作数的 `<<` 运算符。换句话说，运算符 `<<` 不知道如何处理 `std:: cin`。因此，引起错误的要么是使用 `std:: cin` 不当，要么是使用 `<<` 不当。

看出问题了吗？如果还没有，那再仔细看看。

下面代码是正确的代码：

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter an integer: ";

    int num{ };
    std::cin >> num; // std::cin uses operator >>, not operator <<!

    return 0;
}
```

这份代码是可以编译的，而且我们可以对它进行测试。该程序会等待你输入一个数组，这里我们输入 4。程序的输出结果如下：

```bash
Enter an integer: 4
```

差不多要完成了！最后一个是将输入结果乘以 2。

完成最后一步后，编译程序并运行它，同时保证输出期望的结果。

这里有三种方式来完成其功能，从坏到好分别为：

## 不好的解决方案：

```cpp
#include <iostream>

// worst version
int main()
{
    std::cout << "Enter an integer: ";

    int num{ };
    std::cin >> num;

    num = num * 2; // double num's value, then assign that value back to num

    std::cout << "Double that number is: " << num << '\n';

    return 0;
}
```

在这个方案中，我们使用表达式将 `num` 的值乘以 2，然后将其再次赋值给 `num`。此时，`num` 的值就是乘以 2 后的结果了。

为什么说这种方法不好呢？

- 在赋值语句之前，`num` 包含的是用户的输入，在赋值语句之后，它包含的是一个不同的值。这会令人感到困惑。
- 通过为接收输入的变量赋新值，我们覆盖了它原有的值，那么如果在后续扩展程序的时候希望再次使用这个输入值来做些别的事情就无法实现了（例如将输入结果乘以 3），因为它已经被丢弃了。

## 还不错的解决方案

```cpp
#include <iostream>

// less-bad version
int main()
{
    std::cout << "Enter an integer: ";

    int num{ };
    std::cin >> num;

    int doublenum{ num * 2 }; // define a new variable and initialize it with num * 2
    std::cout << "Double that number is: " << doublenum << '\n'; // then print the value of that variable here

    return 0;
}
```

这个方案非常的直白，它解决了上一种方案中会面临的两个问题。

这个方案的主要缺点在于，这里需要定义一个新的变量（着无疑增加了复杂性）来存储一个一次性的值。一定还有更好的方法。

## 最佳方案

```cpp
#include <iostream>

// preferred version
int main()
{
    std::cout << "Enter an integer: ";

    int num{ };
    std::cin >> num;

    std::cout << "Double that number is: " <<  num * 2 << '\n'; // use an expression to multiply num * 2 at the point where we are going to print it

    return 0;
}
```

这种方法是这一系列解决方案中最推荐的。当 `std:: cout` 执行的时候，表达式 `num * 2` 会进行求值，其结果就是两倍的 `num` 值。该值会被打印处理，同时变量 `num` 的值并没有被修改，方便我们后续继续使用它。

这个版本是我们提供的参考答案。

> [!info] "作者注"
> 编程的首要目标，是让程序能够正常工作。不能工作的程序不论写的多好 s，都是没有意义的。
> 然而，我很喜欢的一句名言是这么说的：你必须写过一遍代码之后，才能知道你最初应该如何去写它。这句话道出了这样一个事实，最佳的解决方案往往不明显的，而最先想到的解决方案，往往又不是最佳的。
> 在我们专注于如何解决问题并使得程序运行起来的时候，花大量的时间取琢磨这些我们甚至都不知道是否最终会被使用的代码，是不划算。因此我们需要另辟蹊径，暂时跳过异常处理和注释，代码中充斥着大量的帮助定位问题的调试代码也无所谓，我们要学会摸着石头过河，而当一个方法彻底行不通的时候，就换一种方法从新开始。
> 这么做的结果就是，最初版本的代码往往缺乏条理、健壮性也不佳、可读性不好，就更别提什么简介明了了。因此，当你的代码可以工作之后，你的工作还没有完成（出发你编写的代码是一次性的）。接下来，你需要清理你的代码，包括删除（或注释掉）帮助调试的临时性代码、编写注释、处理可能发生的错误、美化代码的排版并确保代码遵循了相关的最佳实践。此外，你的代码可能并不是最精简的，也许里面还存在着可以被合并的冗余逻辑，或者存在着可以被合并的语句，亦或是有些变量是没有必要的，以及其他各种可以被简化的常见。很多新手程序员都迫切的想要去优化程序的性能，而实际上程序的可维护性才是它们最应该优先考虑的事情。
> 本教程提供的解决方案，很少是第一次就得到最佳解决方案的。实际上，它们都经过了不断的修改，直到我们认为没有什么可以再优化的了。即使是这样，很多时候读者还是能够向我们提出很多优化的建议！
> 说这么多，我想表达的是：如果你没有一次性想到一个最优的解决方案，请不要为此感到沮丧，这很正常。精益求精在编程中是一个迭代的过程。

> [!info] "作者注"
> 还有一件事：你可能会想，”C++中有这么多的规则和概念，我怎么才能记住它们呢？“
> 简单来说，你并不需要记住它们。使用 C++，一方面在于使用你已经掌握的知识，另一方面在于掌握如何查找并使用你没有掌握的知识。
> 当你第一次阅读本教程的时候，不要把注意力放在记忆规则上，而是要重点理解使用C++你能做哪些事。然后，当你真正需要在程序中实现某个功能的时候，你可以再回来（或者到其他网站）去刷新巩固你的知识并掌握应该如何去做。
