---
title: 7.7 - 循环和 while 语句
alias: 7.7 - 循环和 while 语句
origin: /none/
origin_title: "7.7 — Intro to loops and while statements"
time: 2022-5-30
type: translation
tags:
- while
- for
---

??? note "Key Takeaway"
	

## 循环

现在真正的乐趣开始了——在接下来的课程中，我们将介绍循环。循环是控制流结构，它允许一段代码被重复执行，直到满足某些条件。循环为编程工具包增加了很大的灵活性，帮助我们完成很多不使用循环难以实现的功能。

例如，假设你想要打印1到10，如果没有循环，你可能会这么做：

```cpp
#include <iostream>

int main()
{
    std::cout << "1 2 3 4 5 6 7 8 9 10";
    std::cout << " done!\n";
    return 0;
}
```

虽然这么做是可行的，但当我们需要打印更多的数字时，它会变得越来越不可行：如果需要打印1到1000之间的所有数字呢？那打字的工作量就太大了！而且该程序要打印的内容必须在编译时就知道要打印多少数字。

现在，让我们稍微改变一下参数。如果需要让用户输入一个数字，然后打印1和用户输入的数字之间的所有数字，那会怎么样呢?用户将输入的数字在编译时是不可知的，要怎么解决这个问题呢?

## `while` 语句

`while` 语句（也被叫做`while`循环）是C++中最简单循环，它的定义和 if 语句特别地像：

```cpp
while (condition)
    statement;
```

`while` 语句的声明需要使用`while`关键字。当 `while` 语句执行时，`condition` 会被求值。如果求值结果是真，则相关的语句会被执行。

但是，和if语句不同的是，`while` 语句中的`statement`执行完成后，会返回到`while`语句的开始，然后继续执行、这意味着只要条件求值为真，`while`循环就会不停地执行。

还是打印1到10的例子，这次使用`while`循环完成：

```cpp
#include <iostream>

int main()
{
    int count{ 1 };
    while (count <= 10)
    {
        std::cout << count << ' ';
        ++count;
    }

    std::cout << "done!\n";

    return 0;
}
```

输出：

```
1 2 3 4 5 6 7 8 9 10 done!
```

让我们仔细看看这个程序正在做什么。首先，`count` 被初始化为1，这是我们要打印的第一个数字。条件`count <= 10` 为 `true`，因此执行语句。在本例中，我们的语句是一个语句块，因此块中的所有语句都将执行。块中的第一个语句输出 1 和一个空格，第二个语句将`count` 递增到2。控制现在返回到`while`的顶部，并再次计算条件。`2 <= 10` 的计算结果为仍然 `true`，因此代码块将再次执行。循环将重复执行，直到 `count` 为11 ，此时`11 <= 10` 将被计算为 `false` ，与循环相关的语句将被跳过。至此，循环完成了。

虽然上面的代码看上去似乎比手动输入1到10还多些，但是你可以想象，如果需要打印1到1000，我们只需要简单地将`count <= 10` 改为 `count <= 1000` 即可。

## 初始条件为`false`的`while`语句

如果初始化条件为`false`，那么语句就完全不会被执行：

```cpp
#include <iostream>

int main()
{
    int count{ 15 };
    while (count <= 10)
    {
        std::cout << count << ' ';
        ++count;
    }

    std::cout << "done!\n";

    return 0;
}
```


由于 `15 <= 10` 求值为 `false`，所以`while`中的所有语句都会被跳过，程序继续执行并打印`done`。

## 无限循环

如果表达式始终求值为`true`，则`while`循环就会一直运行——称为无限循环或死循环。请看下面的例子中：

```cpp
#include <iostream>

int main()
{
    int count{ 1 };
    while (count <= 10) // 该条件用于不会变为false
    {
        std::cout << count << ' '; // 反复执行
    }

    std::cout << '\n'; // 永远不会执行

    return 0; // 永远不会执行
}
```

因为 `count` 始终没有被递增，所以 `count <= 10` 总是真。因此循环永远不会停止，程序不停地打印 “1 1 1 1 1″。

## 有意而为之的无限循环

我们可以故意创建一个无限循环：

```cpp
while (true)
{
  // this loop will execute forever
}
```

退出无限循环的唯一方法是使用 `return`y 语句、`break` 语句、`exit` 语句、`goto` 语句、抛出异常或被其他程序终止。

请看下面的例子：

```cpp
#include <iostream>

int main()
{

    while (true) // infinite loop
    {
        std::cout << "Loop again (y/n)? ";
        char c{};
        std::cin >> c;

        if (c == 'n')
            return 0;
    }

    return 0;
}
```


该循环会不断执行，直到用户输入`n`，此时if语句的条件求值为真，`return 0` 被执行，main函数退出，程序终止。

在持续运行并为web请求提供服务的web服务器应用程序中，经常可以看到这种循环。

> [!success] "最佳实践"
> 对于有意而为之的死循环，请使用 `while(true)`。

## 循环变量

通常，我们会希望一个循环执行一定次数。此时可以使用循环变量，称为计数器。循环变量是一个整数，用于计算循环执行了多少次。在上面的例子中，变量 `count` 是一个循环变量。

循环变量通常有简单的名称，如i 、 j 或 k 。但是，如果你想知道循环变量在程序中的哪个位置被使用，此时你会搜索 i 、j 或 k ，此时会返回大量的搜索结果！因此，一些开发人员喜欢用 `iii` 、`jjj` 或 `kkk` 这样的变量名。因为这些名称更加独特，这使得搜索循环变量更加容易，并帮助它们作为循环变量脱颖而出。一个更好的主意是使用“真实的”变量名，比如`count`，或者一个关于你正在计数的东西的更详细的名字(例如`userCount`)。


## 循环变量应该为有符号数

循环变量几乎都应该是有符号的，因为无符号整数可能导致意想不到的问题。考虑以下代码：

```cpp
#include <iostream>

int main()
{
    unsigned int count{ 10 };

    // count from 10 down to 0
    while (count >= 0)
    {
        if (count == 0)
        {
            std::cout << "blastoff!";
        }
        else
        {
            std::cout << count << ' ';
        }
        --count;
    }

    std::cout << '\n';

    return 0;
}
```

看一下上面的例子，看看能否发现错误。并不是很明显。

事实证明，这个程序是一个无限循环。它开始打印 `10 9 8 7 6 5 4 3 2 1 blastoff`，但随后就脱轨了，从`4294967295`开始倒数。为什么？因为循环条件 `count >= 0` 永远不会为假！当`count`为 0 时，`0 >= 0` 为真。然后执行`--count`， `count` 反转为` 4294967295` (假设是32位整数)。由于 `4294967295 >= 0` 为真，程序继续执行。因为 `count` 是无符号的，它永远不可能是负数，所以循环永远不会停止。

> [!success] "最佳实践"
> 循环变量应该是有符号整型。

## 迭代执行N次

每次循环执行被称为一个迭代。

通常，我们希望每隔第2、3或4次迭代做一些事情，例如打印换行符。这可以通过在计数器上使用求模运算轻松实现:


```cpp
#include <iostream>

// Iterate through every number between 1 and 50
int main()
{
    int count{ 1 };
    while (count <= 50)
    {
        // print the number (pad numbers under 10 with a leading 0 for formatting purposes)
        if (count < 10)
        {
            std::cout << '0';
        }

        std::cout << count << ' ';

        // 如果循环次数可以整除10，则打印换行
        if (count % 10 == 0)
        {
            std::cout << '\n';
        }

        // increment the loop counter
        ++count;
    }

    return 0;
}
```

打印：

```
01 02 03 04 05 06 07 08 09 10
11 12 13 14 15 16 17 18 19 20
21 22 23 24 25 26 27 28 29 30
31 32 33 34 35 36 37 38 39 40
41 42 43 44 45 46 47 48 49 50
```

## 嵌套循环

循环可以嵌套在其他循环中。在下面的例子中，被嵌套循环(我们称之为内层循环)和外层循环都有各自的计数器。注意，内部循环的循环表达式也使用了外部循环的计数器！

```cpp
#include <iostream>

int main()
{
    // outer loops between 1 and 5
    int outer{ 1 };
    while (outer <= 5)
    {
        // For each iteration of the outer loop, the code in the body of the loop executes once

        // inner loops between 1 and outer
        int inner{ 1 };
        while (inner <= outer)
        {
            std::cout << inner << ' ';
            ++inner;
        }

        // print a newline at the end of each row
        std::cout << '\n';
        ++outer;
    }

    return 0;
}
```

程序打印：

```
1
1 2
1 2 3
1 2 3 4
1 2 3 4 5
```

新手程序员往往难以理解嵌套循环，所以如果你也看不懂的话，千万不要灰心丧气。对于外层循环的每一次迭代，外层循环的循环体内语句会执行一次。由于外层循环的循环体内包括内层循环，所以内层循环在每一个外层循环的迭代中都要完整执行一次。

让我们仔细研究一下上面的代码：

首先，对于外层循环(循环变量为 `outer`) 会迭代执行5次（ `outer` 依次变为 `1`, `2`, `3`, `4`, 和 `5` ）。

外层循环第一次迭代时 `outer` 值为 `1`，然后执行循环体内的语句。在循环体内，有另外一个循环，其循环变量为 `inner`。内层循环的循环变量从 `1` 到 `outer` (此时是 `1`)，所以内层循环执行一次，打印 `1`。然后打印换行，并将 `outer` 递增为`2`。

在外层循环执行第二次迭代时，`outer` 的值为 `2`，然后执行循环体。在循环体内，`inner` 仍然从 `1` 到 `outer` (此时为 `2`)进行迭代。 所以这一次内层循环会执行两次，打印 `1`和`2`。 然后打印换行，并将 `outer` 递增为`3`。

迭代继续进行的话，内存循环会依次打印 `1 2 3`、 `1 2 3 4` 以及`1 2 3 4 5` 。最终，`outer` 会递增到 `6`，此时因为外层的循环条件(`outer <= 5`) 求值为false，所以外层循环会终止。程序退出。

如果您仍然感到困惑，可以在调试器中逐行检查这个程序，并查看“inner”和“outer”的值，通过这个方法你可以更好地理解代码的运行逻辑。