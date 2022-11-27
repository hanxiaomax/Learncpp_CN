---
title: 7.3 - 常见的 if 语句错误
alias: 7.3 - 常见的 if 语句错误
origin: /common-if-statement-problems/
origin_title: "7.3 — Common if statement problems"
time: 2022-2-10
type: translation
tags:
- if
---

??? note "关键点速记"
	


继续 [[7-2-If-statements-and-blocks|7.2 - if 语句和语句块]] 的内容。本节课我们会介绍一些和if语句相关的常见错误。

## 嵌套if语句和悬垂else问题

if 语句可以嵌套在其他 if 语句中：

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter a number: ";
    int x{};
    std::cin >> x;

    if (x >= 0) // 外层if语句
        // 这种嵌套方式是不好的编程风格
        if (x <= 20) // 内层if语句
            std::cout << x << " is between 0 and 20\n";

    return 0;
}
```

考虑下面的程序：

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter a number: ";
    int x{};
    std::cin >> x;

    if (x >= 0) // 外层if语句
        // 这种嵌套方式是不好的编程风格
        if (x <= 20) // 内层if语句
            std::cout << x << " is between 0 and 20\n";

    // 这个 else 应该和哪个 if 语句匹配？
    else
        std::cout << x << " is negative\n";

    return 0;
}
```

上面的程序引入了一个潜在的歧义来源，称为悬垂else问题。上面程序中的`else` 语句应该与外部if匹配还是和内部if匹配？

答案是 `else` 语句与同一语句块中最后一个未匹配的`if`语句配对。因此，在上面的程序中，`else`与内部的`if`语句匹配，等价于下面形式：

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter a number: ";
    int x{};
    std::cin >> x;

    if (x >= 0) // 外层 if 语句
    {
        if (x <= 20) // 内层 if 语句
            std::cout << x << " is between 0 and 20\n";
        else // 和内层 if 语句匹配
            std::cout << x << " is negative\n";
    }

    return 0;
}
```

这使得程序产生错误的结果：

```
Enter a number: 21
21 is negative
```

为了避免因嵌套 if 语句产生的歧义，最好的办法是将内部的if语句显式地定义在语句块中：

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter a number: ";
    int x{};
    std::cin >> x;

    if (x >= 0)
    {
        if (x <= 20)
            std::cout << x << " is between 0 and 20\n";
        else // attached to inner if statement
            std::cout << x << " is greater than 20\n";
    }
    else // attached to outer if statement
        std::cout << x << " is negative\n";

    return 0;
}
```

此时，语句块中的 `else` 语句会和内层的`if` 语句匹配，而语句块外部的 `else` 则和外层的 `if` 语句匹配。

## 嵌套语句展开

嵌套的多层 `if` 语句可以通过重新组织逻辑或使用[[5-7-Logical-operators|逻辑运算符]]展开成一层逻辑。嵌套越少的代码越不容易出错。

例如，上面的例子中可以展开成如下形式：

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter a number: ";
    int x{};
    std::cin >> x;

    if (x < 0)
        std::cout << x << " is negative\n";
    else if (x <= 20) // only executes if x >= 0
        std::cout << x << " is between 0 and 20\n";
    else // only executes if x > 20
        std::cout << x << " is greater than 20\n";

    return 0;
}
```

下面是另一个使用逻辑运算符在一个`if`语句中检查多个条件的例子：

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter an integer: ";
    int x{};
    std::cin >> x;

    std::cout << "Enter another integer: ";
    int y{};
    std::cin >> y;

    if (x > 0 && y > 0) // && 是逻辑与——检查是否两个条件均为真
        std::cout << "Both numbers are positive\n";
    else if (x > 0 || y > 0) // || 是逻辑或——检查是否有为真的条件
        std::cout << "One of the numbers is positive\n";
    else
        std::cout << "Neither number is positive\n";

    return 0;
}
```


## 空语句

空语句是一个只包含分号的语句：

```cpp
if (x > 10)
    ; // this is a null statement
```

空语句什么都不做。一般来说，只有当语言要求存在一条语句但程序员不需要的情况下才这么做。为了可读性，“空语句”通常被放在单独的行中。

我们将在本章后面讲到循环的时候看到有意的空语句的例子。“空语句”很少与“if语句”一起使用。然而，它们可能会无意中给新手(或粗心的)程序员带来问题。考虑下面的代码：


```cpp
if (nuclearCodesActivated());
    blowUpTheWorld();
```

在上面的例子中，程序员不经意间在if语句的末尾添加了一个分号。这个不起眼的错误可以很好地编译，并使代码段执行起来就像它是这样编写的一样：

```cpp
if (nuclearCodesActivated())
    ; // 分号实际上制造了一个空语句
blowUpTheWorld(); // 这个函数总是会执行
```

!!! warning "注意"

	注意不要在if语句后面添加分号，否则你的“条件语句”总是会无条件执行（即使你把它写在语句块中）。

## 条件语句中的等号和赋值号

在 if 的条件中，你应该使用等号`==`来判断是否相等，而不是赋值号`=`，考虑下面程序：

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter 0 or 1: ";
    int x{};
    std::cin >> x;
    if (x = 0) // 糟糕, 我们使用赋值号进行了赋值而不是判断相等
        std::cout << "You entered 0";
    else
        std::cout << "You entered 1";

    return 0;
}
```

程序可以编译运行，但是某些情况下结果是错误的：

```
Enter 0 or 1: 0
You entered 1
```

事实上，这个程序总是会产生“你输入了1”的结果。这是因为`x = 0` 首先将值 `0` 赋值给`x` ，然后计算 `x`的值，现在是`0` ，即布尔值`false` 。由于条件总是`false` 所以`else`语句总是执行。
