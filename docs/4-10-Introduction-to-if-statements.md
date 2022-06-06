---
title: 4.10 - if 语句简介
alias: 4.10 - if 语句简介
origin: /introduction-to-if-statements/
origin_title: "4.10 — Introduction to if statements"
time: 2021-10-18
type: translation
tags:
- if
- boolean
---


??? note "关键点速记"
	- 非布尔值在作为条件表达式使用时会被转换为布尔值，非0值被转换为布尔值 *true*，0值则被转换为 *false*

想象一下，如果你正要去超市，然后你的室友对你说：”如果有草莓的话，就买一点“。这是一个条件语句，就是说你做某个动作（"买东西"）的条件是某个条件（有草莓卖）为真。

这种条件在编程中非常常见，条件语句使我们可以在程序中实现某种条件行为。C++ 中最简单的条件语句是*if*语句。*if*语句使我们可以在某个条件为真时才执行一行（或多行）代码。

最简单的 _if_ 语句形式如下：

```
if (condition) true_statement;
```

下面这种形式可读性更好：

```
if (condition)
    true_statement;
```

所谓“条件” (也称为条件表达式)的求值结果是一个布尔值。

如果 _if_ 语句语句的求值结果为布尔值 _true_，则 _true_statement_ 就会执行。反之，如图条件求值的结果为布尔值 _false_，则语句 _true_statement_ 会被跳过。

一个使用了 *if* 语句的例程如下：

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter an integer: ";
    int x {};
    std::cin >> x;

    if (x == 0)
        std::cout << "The value is zero\n";

    return 0;
}
```

输出结果如下：

```
Enter an integer: 0
The value is zero
```

我们仔细分析一下这个程序。

首先，用户输入一个整型。然后条件 `x == 0` 进行求值。 相等比较运算符 (`==`) 被用来测试两个值是否相等。如果两数相等，则等比较运算符 (`==`)  返回 _true_ ，否则返回 _false_。因为 x 的值为0，而且 `0 == 0` 为真，所以表达式求值的结果为 _true_。

因为条件表达式的求值结果为 _true_，则接下来的语句会被执行，打印 _The value is zero_。

再次运行程序：

```
Enter an integer: 5
```

这种情况下，`x == 0` 求值结果为 _false_。因此接下来的语句会被跳过，然后程序就结束了，不会打印任何文本。

!!! warning "注意"

	_If_ 语句只会有条件地执行一条语句。我们会在[[7.2 -- If statements and blocks|7.2 - if 语句和语句块]]中介绍如何在条件为真时执行多条语句。

## If-else

在上面的例子中，如果我们希望告诉用户，他们输入的值是否为非0呢？

程序可以像下面这样写：

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter an integer: ";
    int x {};
    std::cin >> x;

    if (x == 0)
        std::cout << "The value is zero\n";
    if (x != 0)
        std::cout << "The value is non-zero\n";

    return 0;
}
```

或者这样：

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter an integer: ";
    int x {};
    std::cin >> x;

    bool zero { (x == 0) };
    if (zero)
        std::cout << "The value is zero\n";
    if (!zero)
        std::cout << "The value is non-zero\n";

    return 0;
}
```


这两个程序其实没必要这么复杂，我们可以使用另一种形式的 *if* 语句——*if-else*语句。*if-else*语句的形式如下：

```
if (condition)
    true_statement;
else
    false_statement;
```

如果 `condition` 求值结果为 *true*，则 _true_statement_ 会执行，否则 _false_statement_ 将会执行。

让我们使用 _if-else_ 来修改一下上面的代码：

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter an integer: ";
    int x {};
    std::cin >> x;

    if (x == 0)
        std::cout << "The value is zero\n";
    else
        std::cout << "The value is non-zero\n";

    return 0;
}
```

现在，程序的输出结果如下：

```
Enter an integer: 0
The value is zero
```

```
Enter an integer: 5
The value is non-zero
```

## 链式 if 语句

有时候我们需要连续检查一些条件是否为真。我们可以使用链式的*if*语句来完成，例如：

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter an integer: ";
    int x {};
    std::cin >> x;

    if (x > 0)
        std::cout << "The value is positive\n";
    else if (x < 0)
        std::cout << "The value is negative\n";
    else
        std::cout << "The value is zero\n";

    return 0;
}
```


这里的小于号(`<`) 被用来测试一个值是否小于另一个值。类似地，大于号 (`>`)则用来测试一个值是否大于另一个。这些运算符返回的都是布尔值。

多次运行程序，输出结果如下：

```
Enter an integer: 4
The value is positive
```

```
Enter an integer: -3
The value is negative
```

```
Enter an integer: 0
The value is zero
```

注意，你可以使用任意次链式_if_ 语句完成你所需要进行的条件判断。

## 布尔类型返回值和 if 语句

在之前的课程中（[[4-9-Boolean-values|4.9 - 布尔值]]），我们编写了一个返回布尔值的函数：

```cpp
#include <iostream>

// 如果 x 和 y 相等则返回 true 否则返回 false
bool isEqual(int x, int y)
{
    return (x == y); //  如果 x 和 y 相等，operator== 则返回 true 否则返回 false
}

int main()
{
    std::cout << "Enter an integer: ";
    int x {};
    std::cin >> x;

    std::cout << "Enter another integer: ";
    int y {};
    std::cin >> y;

    std::cout << std::boolalpha; // print bools as true or false

    std::cout << x << " and " << y << " are equal? ";
    std::cout << isEqual(x, y); // will return true or false

    return 0;
}
```

我们可以使用 *if* 语句对上面的代码进行改写：

```cpp
#include <iostream>

// returns true if x and y are equal, false otherwise
bool isEqual(int x, int y)
{
    return (x == y); // operator== returns true if x equals y, and false otherwise
}

int main()
{
    std::cout << "Enter an integer: ";
    int x {};
    std::cin >> x;

    std::cout << "Enter another integer: ";
    int y {};
    std::cin >> y;

    if (isEqual(x, y))
        std::cout << x << " and " << y << " are equal\n";
    else
        std::cout << x << " and " << y << " are not equal\n";

    return 0;
}
```


两次运行上述程序：

```
Enter an integer: 5
Enter another integer: 5
5 and 5 are equal
```

```
Enter an integer: 6
Enter another integer: 4
6 and 4 are not equal
```

在这个例子中，我们使用的条件表达式就是 `isEqual` 函数，它的返回值是布尔类型的。

## 非布尔类型条件

在上述所有例子中，我们使用的条件要么是布尔值（true 或 false），要么是返回布尔值的函数。那如果我们的条件表达式求值的结果不是布尔类型呢？

在这种情况下，条件表达式会被转换为布尔值：非0值被转换为布尔值 *true*，0值则被转换为 *false*。

因此，我们可以这样做：

```cpp
#include <iostream>

int main()
{
    if (4) // 没有实际意义，仅供举例使用
        std::cout << "hi";
    else
        std::cout << "bye";

    return 0;
}
```


上述程序会打印 “hi”，因为4是一个非0值，所以被转换成了布尔值 *true*，使得对应的语句能够被执行。

我们会在[[7-2-If-statements-and-blocks|7.2 - if 语句和语句块]]中更详细地介绍*if*语句。