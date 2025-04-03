---
title: 9.3 - C++ 中常见的语义错误
alias: 9.3 - C++ 中常见的语义错误
origin: /common-semantic-errors-in-c/
origin_title: "7.14 — Common semantic errors in C++"
time: 2022-1-2
type: translation
---

> [!note] "Key Takeaway"
	

在 [[3-1-Syntax-and-semantic-errors|3.1 - 语法和语义错误] 中我们介绍了**语法错误**——当代码不符合C++语义的语法规则时，就会产生语法错误。编译器能够识别并报告语法错误，所以它们很容易被识别到，通常也很容易修复。

我们还介绍了**语义错误**——当代码的行为不符合你的本意时，就被认为是语义错误。编译器通常情况下并不能识别到语义错误（在某些情况下，智能的编译器可能会对语义错误产生告警信息）。

语义错误可能会导致很多[[undefined-behavior|未定义行为]]类似的症状，例如导致程序产生错误的结果、产生古怪的程序行为、破坏数据、导致程序崩溃——或者不产生任何影响。

在编写程序时，我们很难完全避免语义错误。通常情况下，在使用程序时我们就会遇到这些语义错误：例如，在你编写的迷宫游戏中，游戏角色竟然能够穿墙！通过对程序进行测试 ([[9-1-Introduction-to-testing-your-code|9.1 - 代码测试]]) 可以帮助我们发现语义错误。

不过，除了测试之外，还有一件事可以帮助你——那就是知道哪种类型的语义错误最常见，这样你就可以对这些情况多加注意！

本节课中我们会介绍几种常见的意义错误（很多都和条件控制相关）。

## 条件逻辑错误

最常见的语义错误类型之一是**条件逻辑错误**。当程序员错误地编写了条件语句或循环条件的逻辑时，就会发生条件逻辑错误。这里有一个简单的例子：

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter an integer: ";
    int x{};
    std::cin >> x;

    if (x >= 5) // oops, we used operator>= instead of operator>
        std::cout << x << " is greater than 5\n";

    return 0;
}
```

运行程序，很容易观察到逻辑错误：

```
Enter an integer: 5
5 is greater than 5
```

当用户输入5时，条件表达式 `x >= 5` 求值为 `true`，所以对应的打印语句就执行了。

另外一个例子是关于 for 循环的：

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter an integer: ";
    int x{};
    std::cin >> x;

    // oops, we used operator> instead of operator<
    for (int count{ 1 }; count > x; ++count)
    {
        std::cout << count << ' ';
    }

    std::cout << '\n';

    return 0;
}
```


这个程序应该打印从1到用户输入的数字之间的所有数字。但它实际上是这样做的：

```
Enter an integer: 5
```

程序没有打印任何内容。这是因为进入循环的条件 `count > x` 求值为 `false`，所以循环根本没有进行。

## 无限循环

在 [[8-8-Intro-to-loops-and-while-statements|8.8 - 循环和 while 语句]] 中我们介绍了无限循环（死循环），请看这个例子：

```cpp
#include <iostream>

int main()
{
    int count{ 1 };
    while (count <= 10) // this condition will never be false
    {
        std::cout << count << ' '; // so this line will repeatedly execute
    }

    std::cout << '\n'; // this line will never execute

    return 0; // this line will never execute
}
```


在这个例子中，我们忘记了对 `count` 进行递增，所以循环条件求值结果永远都不为 `false`，循环也就永远不会停止，只能不停打印：

```
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
```

直到用户终止该程序。

这是另一个容易被问到的小测验问题——下面的代码有什么问题?

```cpp
#include <iostream>

int main()
{
    for (unsigned int count{ 5 }; count >= 0; --count)
    {
        if (count == 0)
            std::cout << "blastoff! ";
        else
          std::cout << count << ' ';
    }

    std::cout << '\n';

    return 0;
}
```

COPY

程序的本意是打印 `5 4 3 2 1 blastoff!`，但是在完成操作后，程序实际上并没有停止，而是继续打印：

```
5 4 3 2 1 blastoff! 4294967295 4294967294 4294967293 4294967292 4294967291
```

然后继续递减。程序永远不会停止，因为当`count`是无符号整型时 `count >= 0` 永远为真。

## 差一错误

[[Off-by-one|差一错误]]指的是循环多执行一次或少执行一次而产生的错误。情况下面这个例子：

```cpp
#include <iostream>

int main()
{
    for (unsigned int count{ 1 }; count < 5; ++count)
    {
        std::cout << count << ' ';
    }

    std::cout << '\n';

    return 0;
}
```


程序员希望代码打印 `1 2 3 4 5`。但是，由于使用了错误的运算符 (`<` 而不是 `<=`)，所以循环少执行了一次，程序打印 `1 2 3 4`。

## 运算符优先级错误

在 [[6-8-Logical-operators|6.8 - 逻辑运算符]] 中，下面程序存在优先级错误：

```cpp
#include <iostream>

int main()
{
    int x{ 5 };
    int y{ 7 };

    if (!x > y) // oops: operator precedence issue
        std::cout << x << " is not greater than " << y << '\n';
    else
        std::cout << x << " is greater than " << y << '\n';

    return 0;
}
```

因为逻辑运算符  `NOT` 比 `operator>` 的优先级更高，所以条件表达式实际上是按照 `(!x) > y` 求值，这并不是程序员所希望的。

结果，这个程序输出：

```
5 is greater than 7
```

在同一个表达式中混合逻辑或和逻辑与时也会发生这种情况(逻辑与优先于逻辑或)。使用显式括号可以避免这类错误。

## 浮点数的精度问题

下面的浮点变量没有足够的精度来存储整个数字：

```cpp
#include <iostream>

int main()
{
    float f{ 0.123456789f };
    std::cout << f << '\n';

    return 0;
}
```

由于缺乏精度，这个数字被稍稍四舍五入：

```
0.123457
```

在 [[6-7-Relational-operators-and-floating-point-comparisons|6.7 - 关系运算符和浮点数比较]] 中，我们讨论了`operator==` 和 `operator !=` 在应对浮点数时，可能会产生由于微小摄入而导致的问题：

```cpp
#include <iostream>

int main()
{
    double d{ 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 }; // should sum to 1.0

    if (d == 1.0)
        std::cout << "equal\n";
    else
        std::cout << "not equal\n";

    return 0;
}
```

打印：

```
not equal
```

由于缺乏精度，这个数字会略微四舍五入：你对浮点数做的算术越多，它就会积累越多的小四舍五入错误。

## 整型除法

在下面的例子中，我们打算做浮点除法，但因为两个操作数都是整数，所以我们最终做的是整数除法：

```cpp
#include <iostream>

int main()
{
    int x{ 5 };
    int y{ 3 };

    std::cout << x << " divided by " << y << " is: " << x / y << '\n'; // integer division

    return 0;
}
```

打印：

```
5 divided by 3 is: 1
```

在 [[6-2-Arithmetic-operators|6.2 - 数学运算符]] 中，我们介绍了如何使用 `static_cast` 将整型操作数转换为浮点数，以便可以进行浮点数除法。

## 意外造成的空语句

在 [[8-3-Common-if-statement-problems|8.3 - 常见的 if 语句错误]] 中我们介绍了空语句——空语句不执行任何操作。

在下面的程序中，我们只想在得到用户许可的情况下"炸掉这个世界"：

```cpp
#include <iostream>

void blowUpWorld()
{
    std::cout << "Kaboom!\n";
}
int main()
{
    std::cout << "Should we blow up the world again? (y/n): ";
    char c{};
    std::cin >> c;

    if (c=='y'); // 意外导致了空语句 null statement here
        blowUpWorld(); // 该语句总是会执行，因为它不属于if语句
    return 0;
}
```

但是，因为存在一条意外造成的空语句，函数 `blowUpWorld()` 总是会执行，所以“世界”总是会被毁灭：

```
Should we blow up the world again? (y/n): n
Kaboom!
```

当需要复合语句时，没有使用复合语句

上述程序的另一种变体：

```cpp
#include <iostream>

void blowUpWorld()
{
    std::cout << "Kaboom!\n";
}

int main()
{
    std::cout << "Should we blow up the world again? (y/n): ";
    char c{};
    std::cin >> c;

    if (c=='y')
        std::cout << "Okay, here we go...\n";
        blowUpWorld(); // oops, will always execute.  Should be inside compound statement.

    return 0;
}
```

程序打印：

```
Should we blow up the world again? (y/n): n
Kaboom!
```

悬垂 `else` (参见 [[8-3-Common-if-statement-problems|8.3 - 常见的 if 语句错误]]) 也会导致此类问题。

## 还有什么？

以上是新手C++程序员容易犯的、最常见语义错误，当然，除了这些还有更多。读者们，如果你还有其他你认为常见的陷阱，请在评论区告诉我们。