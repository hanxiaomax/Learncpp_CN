---
title: 7.2 - if 语句和语句块
alias: 7.2 - if 语句和语句块
origin: /if-statements-and-blocks/
origin_title: "7.2 -- If statements and blocks"
time: 2022-2-10
type: translation
tags:
- if
---

我们要讨论的第一类控制流语句是条件语句。条件语句是一种指定是否应该执行某些关联语句的语句。

C++支持两种基本条件语句：if语句(我们在课程[[4-10-Introduction-to-if-statements|4.10 -if语句简介]中介绍过，并将在这里进一步讨论)和  `switch` 语句(我们将在几节课中讨论)。

## 快速复习一下 if 语句

if 语句是C++中最基本的条件语句，其形式为：

```cpp
if (condition)
    true_statement;
```

或者是带 `else` 的形式：

```cpp
if (condition)
    true_statement;
else
    false_statement;
```

如果 `condition` 求值为 `true`，则执行 `true_statement`。如果求值为 `false` 而且存在 `else ` 语句则执行 `false_statement` 。

下面的例子展示了if语句和else语句的用法：

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter a number: ";
    int x{};
    std::cin >> x;

    if (x > 10)
        std::cout << x << " is greater than 10\n";
    else
        std::cout << x << " is not greater than 10\n";

    return 0;
}
```

程序输出结果如你所期望的那样：

```
Enter a number: 15
15 is greater than 10

Enter a number: 4
4 is not greater than 10
```

## 多个条件语句

新手程序员可能会编写这样的程序：

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter your height (in cm): ";
    int x{};
    std::cin >> x;

    if (x > 140)
        std::cout << "You are tall enough to ride.\n";
    else
        std::cout << "You are not tall enough to ride.\n";
        std::cout << "Too bad!\n"; // focus on this line

    return 0;
}
```

不过，程序的运行结果可能并不如愿：

```
Enter your height (in cm): 180
You are tall enough to ride.
Too bad!
```

这个程序没有像预期的那样工作，因为`true_statement` 和`false_statement` 只能是一个语句。这里的缩进欺骗了我们——上面的程序执行起来就好像它是这样写的：

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter your height (in cm): ";
    int x{};
    std::cin >> x;

    if (x > 140)
        std::cout << "You are tall enough to ride.\n";
    else
        std::cout << "You are not tall enough to ride.\n";

    std::cout << "Too bad!\n"; // focus on this line

    return 0;
}
```

这也就看到很清楚了，显然 “Too bad!” 在任何情况下都会被打印。

但是，通常希望基于某些条件执行多个语句。为此，我们可以使用复合语句(块):

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter your height (in cm): ";
    int x{};
    std::cin >> x;

    if (x > 140)
        std::cout << "You are tall enough to ride.\n";
    else
    { // note addition of block here
        std::cout << "You are not tall enough to ride.\n";
        std::cout << "Too bad!\n";
    }

    return 0;
}
```

记住，block被当作一个单独的语句，所以现在工作正常：

```
Enter your height (in cm): 180
You are tall enough to ride.
```

```
Enter your height (in cm): 130
You are not tall enough to ride.
Too bad!
```

## 应该将单独的条件语句写作语句块吗？

对于 `if` 或 `else` 后面的单个语句是否应该显式地包含在语句块中，在程序员社区中引发了广泛的争论。

这样做通常有两个理由。首先，考虑下面的代码片段：记住，块被视为一个单独的语句，所以现在工作正常:

```cpp
if (age >= 21)
    purchaseBeer();
```

然后，如果你特别匆忙地将某个新功能加入到程序中：

```cpp
if (age >= 21)
    purchaseBeer();
    gamble(); // will always execute
```

上述代码将允许未成年人赌博。在监狱里玩得开心！

其次，它会使程序更难调试。假设我们有以下代码片段：

```cpp
if (age >= 21)
    addBeerToCart();

checkout();```


如果我们怀疑 `addBeerToCart()` 函数有问题，往往会将其临时注释掉：

```cpp
if (age >= 21)
//    addBeerToCart();

checkout();
```

这样一来会使得 `checkout()` 按条件执行，这并不是我们想要的结果。

如果我们总是将if和else的语句放在语句块中的话，上面的这些问题都可以避免。

反方则认为，不要在单个语句周围使用块的最佳理由是因为添加块会占用垂直空间，使你一次看到的代码更少，这会使代码可读性变差，并可能导致其他更严重的错误。

社区似乎更倾向于始终使用块，尽管这种建议当然不是普遍存在的。


!!! success "最佳实践"

	考虑将与“`if`”或“`else`”相关的单个语句放在块中(特别是在你学习的时候)。更有经验的C++开发人员有时会忽略这种做法，而倾向于更紧凑的垂直间距。

还有一种折中的办法，即将单一条件语句和if或else写在同一行：

```cpp
if (age >= 21) purchaseBeer();
```

这避免了上面提到的两个缺点，不过可读性稍差了一点。


## 隐式语句块

如果程序员没有在 `if` 语句或`else`语句的部分声明一个语句块，则编译器将隐式声明一个。因此：

```
if (condition)
    true_statement;
else
    false_statement;
```

等价于：

```
if (condition)
{
    true_statement;
}
else
{
    false_statement;
}
```

多数情况下这并不会带来问题，但是新手程序员可能会尝试这样做：

```cpp
#include <iostream>

int main()
{
    if (true)
        int x{ 5 };
    else
        int x{ 6 };

    std::cout << x;

    return 0;
}
```

此时代码是不能编译的，编译器会报告 `x` 未定义。因为上述代码等价于：

```cpp
#include <iostream>

int main()
{
    if (true)
    {
        int x{ 5 };
    } // x 销毁了
    else
    {
        int x{ 6 };
    } // x 销毁了

    std::cout << x; // x 并不在该作用域中

    return 0;
}
```


这里，很显然变量 `x` 具有语句块作用域，并且会在语句块结束时销毁。当我们在 `std::cout` 中访问 `x` 时，它已经不存在了。

我们会在