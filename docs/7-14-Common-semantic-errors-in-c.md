---
title: 7.14 - C++ 中常见的语义错误
alias: 7.14 - C++ 中常见的语义错误
origin: /common-semantic-errors-in-c/
origin_title: "7.14 — Common semantic errors in C++"
time: 2022-1-2
type: translation
---

??? note "Key Takeaway"
	

在 [[3-1-Syntax-and-semantic-errors|3.1 - 语法和语义错误] 中我们介绍了**语法错误**——当代码不符合C++语义的语法规则时，就会产生语法错误。编译器能够识别并报告语法错误，所以它们很容易被识别到，通常也很容易修复。

我们还介绍了**语义错误**——当代码的行为不符合你的本意时，就被认为是语义错误。编译器通常情况下并不能识别到语义错误（在某些情况下，智能的编译器可能会对语义错误产生告警信息）。

语义错误可能会导致很多[[undefined-behavior|未定义行为]]类似的症状，例如导致程序产生错误的结果、产生古怪的程序行为、破坏数据、导致程序崩溃——或者不产生任何影响。

在编写程序时，我们很难完全避免语义错误。通常情况下，在使用程序时我们就会遇到这些语义错误：例如，在你编写的迷宫游戏中，游戏角色竟然能够穿墙！通过对程序进行测试 ([[7-12-Introduction-to-testing-your-code|7.12 - 代码测试]]) 可以帮助我们发现语义错误。

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

在 [[7-7-Intro-to-loops-and-while-statements|7.7 - 循环和 while 语句]] 中我们介绍了无限循环（死循环），请看这个例子：

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

在 [[5-7-Logical-operators|5.7 - 逻辑运算符]] 中，下面程序存在优先级错误：

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

This can also happen when mixing Logical OR and Logical AND in the same expression (Logical AND takes precedence over Logical OR). Use explicit parenthesization to avoid these kinds of errors.

## 浮点数的精度问题

The following floating point variable doesn’t have enough precision to store the entire number:

```cpp
#include <iostream>

int main()
{
    float f{ 0.123456789f };
    std::cout << f << '\n';

    return 0;
}
```

COPY

Because of this lack of precision, the number is rounded slightly:

```
0.123457
```

In lesson [[5-6-Relational-operators-and-floating-point-comparisons|5.6 - 关系运算符和浮点数比较]], we talked about how using `operator==` and `operator!=` can be problematic with floating point numbers due to small rounding errors (as well as what to do about it). Here’s an example:

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

COPY

This program prints:

```
not equal
```

The more arithmetic you do with a floating point number, the more it will accumulate small rounding errors.

## 整型除法

In the following example, we mean to do a floating point division, but because both operands are integers, we end up doing an integer division instead:

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

COPY

This prints:

```
5 divided by 3 is: 1
```

In lesson [[5-2-Arithmetic-operators|5.2 - 数学运算符]], we showed that we can use static_cast to convert one of the integral operands to a floating point value in order to do floating point division.

## 意外造成的空语句

In lesson [[7-3-Common-if-statement-problems|7.3 - 常见的 if 语句错误]], we covered `null statements`, which are statements that do nothing.

In the below program, we only want to blow up the world if we have the user’s permission:

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

    if (c=='y'); // accidental null statement here
        blowUpWorld(); // so this will always execute since it's not part of the if-statement

    return 0;
}
```

COPY

However, because of an accidental `null statement`, the function call to `blowUpWorld()` is always executed, so we blow it up regardless:

```
Should we blow up the world again? (y/n): n
Kaboom!
```
Not using a compound statement when one is required

Another variant of the above program that always blows up the world:

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

COPY

This program prints:

```
Should we blow up the world again? (y/n): n
Kaboom!
```

A `dangling else` (covered in lesson [[7-3-Common-if-statement-problems|7.3 - 常见的 if 语句错误]]) also falls into this category.

## What else?

The above represents a good sample of the most common type of semantic errors new C++ programmers tend to make, but there are plenty more. Readers, if you have any additional ones that you think are common pitfalls, leave a note in the comments.