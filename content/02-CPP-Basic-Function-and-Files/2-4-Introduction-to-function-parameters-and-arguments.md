---
title: 2.4 - 函数形参和实参
alias: 2.4 - 函数形参和实参
origin: /introduction-to-function-parameters-and-arguments/
origin_title: "2.4 — Introduction to function parameters and arguments"
time: 2022-4-15
type: translation
tags:
- parameter
- argument
---

在之前的课程中，我们了解到函数可以将值返回给主调函数，基于此，我们创建了 `getValueFromUser` 函数并用于下面这段程序：

```cpp
#include <iostream>

int getValueFromUser()
{
     std::cout << "Enter an integer: ";
    int input{};
    std::cin >> input;

    return input;
}

int main()
{
    int num { getValueFromUser() };

    std::cout << num << " doubled is: " << num * 2 << '\n';

    return 0;
}
```

不过，如果我们希望将输出语句也封装成一个函数呢？你可能希望这么做：

```cpp
#include <iostream>

int getValueFromUser()
{
     std::cout << "Enter an integer: ";
    int input{};
    std::cin >> input;

    return input;
}

// 这个函数不能编译
void printDouble()
{
    std::cout << num << " doubled is: " << num * 2 << '\n';
}

int main()
{
    int num { getValueFromUser() };

    printDouble();

    return 0;
}
```

这段程序并不能正确编译，因为 `printDouble` 并不知道 `num` 是什么。此时你或许会在 `printDouble()` 中定义 `num`：

```cpp
void printDouble()
{
    int num{}; // 添加此行
    std::cout << num << " doubled is: " << num * 2 << '\n';
}
```

尽管这么做可以避免编译器报错并使得程序成功编译，但该程序的运行结果并不正确（始终会打印：“0 doubled is: 0”）。这个问题的根本原因是 `printDouble` 无法访问用户的输入结果。

我们需要通过某种方式，将变量传递到 `printDouble` 函数内部，使其可以在函数体内使用该变量。

## 函数形参和实参

很多时候，我们希望能够在调用函数时将信息一并传入，这样该函数就可以基于此数据进行接下来的工作。例如，如果你希望编写一个计算两数和的函数，那么你必须有办法告诉在调用函数时，告诉函数需要相加的两个数。 否则，函数如何才能知道要将什么相加呢？通过函数的[[parameters|形参]]和[[arguments|实参]]可以完成上述工作。

函数的**形参**是能够在函数内部使用的变量。形参和函数内部定义的变量几乎是完全一样的，除了：形参总是由主调函数初始化并提供给被调函数。

函数的形参是在函数声明时定义的，它们位于函数名后的括号中，多个形参则由逗号隔开。

下面的例子中展示了包含不同数量形参的函数：

```cpp
// 函数没有参数
// 不依赖与主调函数提供任何值
void doPrint()
{
    std::cout << "In doPrint()\n";
}

// 函数接受一个名为 x 的整型参数
// 主调函数需要提供 x 的值
void printValue(int x)
{
    std::cout << x  << '\n';
}

// 函数接受两个参数，一个名为 x，一个名为 y
// 主调函数必须提供 x 和 y 的值
int add(int x, int y)
{
    return x + y;
}
```

**实参**指的是函数被调用时，主调函数传递给被调函数的值：

```cpp
doPrint(); // 没有实参
printValue(6); // 6 是传递给 printValue() 的实参
add(2, 3); // 2 和 3 是传递给 add() 的实参
```

注意，多个实参仍然由逗号进行分割。

## 形参和实参是如何协同工作的

当函数被调用时，所有的形参都被当做变量创建，然后所有的实参都被拷贝到对应的形参。这个过程称为[[pass-by-value|按值传递]]

例如：

```cpp
#include <iostream>

// This function has two integer parameters, one named x, and one named y
// The values of x and y are passed in by the caller
void printValues(int x, int y)
{
    std::cout << x << '\n';
    std::cout << y << '\n';
}

int main()
{
    printValues(6, 7); // This function call has two arguments, 6 and 7

    return 0;
}
```

当 `printValues` 函数使用实参 6 和 7 进行调用时，形参 x 被创建并初始化为 6，形参 y 被创建并初始化为 7。

上述代码输出结果如下：

```
6
7
```

注意，实参的个数必须和形参的个数保持一致，否则编译器就会报错。传递给函数的实参可以是任何合法的表达式（因为实参本质上只是形参的初始化值，而初始化值可以是任何合法表达式）。

## 修正错误的程序

现在，我们可以修正本节课开头的程序了：

```cpp
#include <iostream>

int getValueFromUser()
{
     std::cout << "Enter an integer: ";
    int input{};
    std::cin >> input;

    return input;
}

void printDouble(int value) // 函数现在有一个整型的形参
{
    std::cout << value << " doubled is: " << value * 2 << '\n';
}

int main()
{
    int num { getValueFromUser() };

    printDouble(num);

    return 0;
}
```

在上述程序中，变量 `num` 首先被初始化为用户输入的值。然后函数 `printDouble` 被调用，实参 `num` 被拷贝到形参。函数 `printDouble` 随后就可以使用该形参的值。

## 使用返回值作为实参

在上面的程序中，变量 `num` 只被使用了一次，我们可以将 `getValueFromUser` 的返回值作为 `printDouble` 的实参，将上面的代码稍加简化：

```cpp
#include <iostream>

int getValueFromUser()
{
     std::cout << "Enter an integer: ";
    int input{};
    std::cin >> input;

    return input;
}

void printDouble(int value)
{
    std::cout << value << " doubled is: " << value * 2 << '\n';
}

int main()
{
    printDouble(getValueFromUser());

    return 0;
}
```

现在，我们使用 `getValueFromUser` 的返回值作为了 `printDouble` 的实参。

尽管这个程序变得更加精简了（而且也很清楚的表明用户的输入仅仅被用于进行计算），但是你也许也会决定这种“压缩语法”可读性并不会。如果你觉得之前的版本更加易读，那也是可以的。

## 形参和返回值是如何协同工作的

通过一起使用形参和返回值，我们可以创建一个函数，接受某些数据，对数据进行计算并通过返回值将结果返回给主调函数。

下面的代码是一个简单的例子，函数计算两个值的和并将结果返回给主调函数：

```cpp
#include <iostream>

// add() takes two integers as parameters, and returns the result of their sum
// The values of x and y are determined by the function that calls add()
int add(int x, int y)
{
    return x + y;
}

// main takes no parameters
int main()
{
    std::cout << add(4, 5) << '\n'; // Arguments 4 and 5 are passed to function add()
    return 0;
}
```

程序从 `main` 函数的顶部开始执行，当 `add(4,5)` 语句求值时，函数 `add` 被调用，其形参 x 被初始化为 4，形参 y 被初始化为 5。

函数的 return 语句对 `x+y` 进行了求值并得到结果 9，该值随后被返回给 `main` 函数。然后 9 就被输入 `std::cout` 并打印到控制台。

输出结果：

```
9
```

图解：

![](https://www.learncpp.com/images/CppTutorial/Chapter2/ParametersReturn.png?ezimgfmt=rs:441x251/rscb2/ng: webp/ngcb2)

## 更多例子

接下来，让我们看看更多的例子：

```cpp
#include <iostream>

int add(int x, int y)
{
    return x + y;
}

int multiply(int z, int w)
{
    return z * w;
}

int main()
{
    std::cout << add(4, 5) << '\n'; // within add() x=4, y=5, so x+y=9
    std::cout << add(1 + 2, 3 * 4) << '\n'; // within add() x=3, y=12, so x+y=15

    int a{ 5 };
    std::cout << add(a, a) << '\n'; // evaluates (5 + 5)

    std::cout << add(1, multiply(2, 3)) << '\n'; // evaluates 1 + (2 * 3)
    std::cout << add(1, add(2, 3)) << '\n'; // evaluates 1 + (2 + 3)

    return 0;
}
```

上述程序输出结果如下：

```
9
15
10
7
6
```

第一行语句非常直白。

第二行语句，作为实参的表达式在传递前首先进行求值，在这个例子中，_1 + 2_ 求值得到 _3_，所以 3 倍拷贝到形参 x。_3 * 4_ 求值得到 _12_，因此 _12_ 被拷贝到形参 y。`add(3,12)` 的结果为 _15_。

接下来的两行语句也比较简单：

```cpp
int a{ 5 };
std::cout << add(a, a) << '\n'; // evaluates (5 + 5)
```

在这个例子中，`add()` 变量 a 被拷贝到形参 x 和 y。由于 a 的值为 5，则 _add(a, a)_ = _add(5,5)_，其计算结果为 10。

接下来是这一系列语句中最复杂的一条：

```cpp
std::cout << add(1, multiply(2, 3)) << '\n'; // evaluates 1 + (2 * 3)
```

当函数 `add` 执行时， 程序必须要确定其形参 x 和 y。x 很简单，因为传递给它的值就是 1。而为了获取形参 y 的值，程序必须要对 `multiply(2,3)` 进行求值。为此，程序首先调用 `multiply` 函数并将 z 初始化为 2，w 初始化为 3，因此 `multiply(2,3)` 返回值为 6。该值随后被用来初始化 `add` 函数的形参 y。`add(1,6)` 的返回值为 7，该值被传递给 `std:: cout` 用于打印。

简单来说：`add(1, multiply(2,3))` 求值得到 `add(1,6)`，进而求值得到 7

下面的语句看上去有点绕，因为 `add` 函数的一个实参，其值来自于另外一个 `add` 函数的返回值。

```cpp
std::cout << add(1, add(2, 3)) << '\n'; // evaluates 1 + (2 + 3)
```

不过，其实它和前一个例子是完全一样的，`add(2,3)` 首先求值，返回值为 5。接下来，对 `add(1,5)` 进行求值，其结果为 6，该值被传递给 `std::cout` 用于打印。

简单来说：`add(1, add(2,3))` 求值得到 `add(1,5)` ，继续求值得到 6。

## 结论

函数的参数和返回值是函数能够被重用的关键机制，因为该机制可以允许我们在不指定具体值的情况下编写函数获取或计算数据并将返回值返回给主调函数。
