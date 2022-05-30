---
title: 4.8 - 浮点数
alias: 4.8 - 浮点数
origin: /floating-point-numbers/
origin_title: "4.8 — Floating point numbers"
time: 2022-1-2
type: translation
tags:
- data type
- float
---

??? note "关键点速记"

	- 浮点数数据类型有三种：**float**(4 bytes), **double**(8 byte) 和 **long double**(8、12、16byte)
	- 浮点数数据类型始终是有符号的
	- 在使用浮点数字面量时，请始终保留一位小数
	- 默认情况下浮点数字面量为`double`。使用`f`后缀可以标注该字面量为`float`
	- 请确保你使用的字面量和它赋值的类型是匹配的。否则会发生不必要的转换，导致精度丢失。

整型可以很好地表示整数，但是很多时候我们需要保存非常大的数，或者小数。**浮点数**类型的变量可以用来存放实数，例如4320.0、-3.33 或 0.01226。浮点数名字中的**浮点**二字，形象地说明了小数点可以浮动；也就是说它可以支持小数点前和小数点后具有不同位的数字。

浮点数数据类型有三种：**float**, **double** 和 **long double**。和整型一样 C++ 并没有定义这三种类型的具体长度（只确保其最小值）。在现代计算机上，浮点数的表示方法几乎总是遵循 IEEE 754 二进制格式。在这种格式下，`float` 为4个字节，`double`则是 8 个字节，而`long double`可以和`double`相同（8字节），也可能为80位（通常会补位到12字节）或者16字节。

浮点数数据类型始终是有符号的（可以保存正负数）。


|Category	|Type|	Minimum Size	|Typical Size|
|---|---|---|---|
|floating point	|float	|4 bytes	|4 bytes
||double	|8 bytes	|8 bytes
||long double	|8 bytes	|8, 12, or 16 bytes


下面是一些浮点数的例子：

```cpp
float fValue;
double dValue;
long double ldValue;
```


在使用浮点数[[literals|字面量]]时，请始终保留一位小数（即使这一位是0）。这可以帮助编译器明确该数值为浮点数而非整型数。

```cpp
int x{5}; // 5 表示整型数
double y{5.0}; // 5.0 是浮点数字面量 (没有后缀的情况下默认为 double)
float z{5.0f}; // 5.0 是浮点数字面量，f 后缀表示 float
```


注意，默认情况下浮点数字面量为`double`。使用`f`后缀可以标注该字面量为`float`


!!! success "最佳实践"

	请确保你使用的字面量和它赋值的类型是匹配的。否则会发生不必要的转换，导致精度丢失。

!!! warning "注意"

	请确保在应当使用浮点数字面量时，不要误用整型字面量。这可能会发生对浮点类型对象初始化、赋值、数学运算以及调用返回值应当为浮点数的函数时。

## 打印浮点数

考虑下面这个简单的程序：

```cpp
#include <iostream>

int main()
{
	std::cout << 5.0 << '\n';
	std::cout << 6.7f << '\n';
	std::cout << 9876543.21 << '\n';

	return 0;
}
```

上述程序的输出结果可能会让你感到意外：

```
5
6.7
9.87654e+06
```

在第一条打印中，`std::cout` 打印 5，即使我们输入的是5.0。默认情况下 `std::cout` 不会输入小数部分的0。

在第二条打印中，结果和我们期望的是一样。

在第三条打印中，打印结果为科学计数法（如果你需要复习一下科学计数法可以参考 [[4-7-Introduction-to-scientific-notation|4.7 - 科学计数法]]）。

## 浮点数的范围

假定使用 IEEE 754 表示法：

|大小	|范围|	精度|
|---|---|---|
|4 bytes	|±1.18 x 10-38 到 ±3.4 x 1038|	6-9 位有效数字，一般为7
|8 bytes	|±2.23 x 10-308 到 ±1.80 x 10308	|15-18 位有效数字，一般为16
|80-bits (typically uses 12 或 16 bytes)	|±3.36 x 10-4932 到 ±1.18 x 104932	|18-21 位有效数字
|16 bytes	|±3.36 x 10-4932 到 ±1.18 x 104932|	33-36 位有效数字


80位的浮点数类型可以看做是历史遗留问题。在现代处理器上，它通常被实现为12字节或16字节（对于处理器来说是更加方便的长度）。

你可能会奇怪为什么80位的浮点数类型和16字节的浮点数类型具有相同的范围。这是因为它们中专门用来表示指数的位是相同的——不过，16字节的浮点数可以表示更多的有效数字。

## 浮点数的精度

考虑以下分数 1/3。它的十进制表示法为 0.33333333333333… 无限循环3。如果你在纸上一直写的话，写着写着你就受不了了。最终你写下来的可能是 0.3333333333…. (无限循环3)，但绝对不可能是全部的值。

对于计算机来说，无限长度的数字需要无限大的内存才能存储，而通常我们只能使用4字节或8字节的空间。有限的内存就意味着浮点数只能存放特定长度的有效数字——其他剩余部分就被丢弃了。最终被存储下来的数字是我们能够接受的值，而不是实际值。

浮点数的精度被定义为：在不损失信息的情况下能够表示的最多的有效数字位数。

在输出浮点数时，`std::cout`的默认精度为6——也就说它假设所有浮点数都只有6位有效数字，超过的部分都会被截断。

下面的程序对 `std::cout`截断到6位有效数字进行了演示：

```cpp
#include <iostream>

int main()
{
    std::cout << 9.87654321f << '\n';
    std::cout << 987.654321f << '\n';
    std::cout << 987654.321f << '\n';
    std::cout << 9876543.21f << '\n';
    std::cout << 0.0000987654321f << '\n';

    return 0;
}
```

输出结果为：

```
9.87654
987.654
987654
9.87654e+006
9.87654e-005
```

我们注意到，输出结果中的数都只有6位有效数字。

同时我们注意到， `std::cout` 有些情况下会自动改用科学计数法。根据编译器的不同，指数部分会被补0到最小位数。不要担心，9.87654e+006 和 9.87654e6 是完全一样的，只是补了一些0罢了。指数的最小位数根编译器有关，Visual Studio 是 3，其他编译器可能会使用C99的标准即2。

浮点数精度取决于浮点数类型的大小（float的精度小于double）以及被存储的具体值（有些值的精度本身就比其他值高）。float 类型的精度通常位于 6 到 9之间，多数具有至少7位有效数字。Double 类型的精度通常为 15 到 18之间，多数具有至少16位有效数字。Long double 类型的精度最小为15、18或33位you'xia a minimum precision of 15, 18, or 33 significant digits depending on how many bytes it occupies.

We can override the default precision that std::cout shows by using an `output manipulator` function named `std::setprecision()`. Output manipulators alter how data is output, and are defined in the _iomanip_ header.

```cpp
#include <iostream>
#include <iomanip> // for output manipulator std::setprecision()

int main()
{
    std::cout << std::setprecision(16); // show 16 digits of precision
    std::cout << 3.33333333333333333333333333333333333333f <<'\n'; // f suffix means float
    std::cout << 3.33333333333333333333333333333333333333 << '\n'; // no suffix means double

    return 0;
}
```


Outputs:

```
3.333333253860474
3.333333333333334
```

Because we set the precision to 16 digits using `std::setprecision()`, each of the above numbers is printed with 16 digits. But, as you can see, the numbers certainly aren’t precise to 16 digits! And because floats are less precise than doubles, the float has more error.

Precision issues don’t just impact fractional numbers, they impact any number with too many significant digits. Let’s consider a big number:

```cpp
#include <iomanip> // for std::setprecision()
#include <iostream>

int main()
{
    float f { 123456789.0f }; // f has 10 significant digits
    std::cout << std::setprecision(9); // to show 9 digits in f
    std::cout << f << '\n';

    return 0;
}
```


Output:

```
123456792
```

123456792 is greater than 123456789. The value 123456789.0 has 10 significant digits, but float values typically have 7 digits of precision (and the result of 123456792 is precise only to 7 significant digits). We lost some precision! When precision is lost because a number can’t be stored precisely, this is called a rounding error.

Consequently, one has to be careful when using floating point numbers that require more precision than the variables can hold.

!!! success "最佳实践"

	Favor double over float unless space is at a premium, as the lack of precision in a float will often lead to inaccuracies.

## Rounding errors make floating point comparisons tricky

Floating point numbers are tricky to work with due to non-obvious differences between binary (how data is stored) and decimal (how we think) numbers. Consider the fraction 1/10. In decimal, this is easily represented as 0.1, and we are used to thinking of 0.1 as an easily representable number with 1 significant digit. However, in binary, 0.1 is represented by the infinite sequence: 0.00011001100110011… Because of this, when we assign 0.1 to a floating point number, we’ll run into precision problems.

You can see the effects of this in the following program:

```cpp
#include <iomanip> // for std::setprecision()
#include <iostream>

int main()
{
    double d{0.1};
    std::cout << d << '\n'; // use default cout precision of 6
    std::cout << std::setprecision(17);
    std::cout << d << '\n';

    return 0;
}
```

COPY

This outputs:

```
0.1
0.10000000000000001
```

On the top line, std::cout prints 0.1, as we expect.

On the bottom line, where we have std::cout show us 17 digits of precision, we see that d is actually _not quite_ 0.1! This is because the double had to truncate the approximation due to its limited memory. The result is a number that is precise to 16 significant digits (which type double guarantees), but the number is not _exactly_ 0.1. Rounding errors may make a number either slightly smaller or slightly larger, depending on where the truncation happens.

Rounding errors can have unexpected consequences:

```cpp
#include <iomanip> // for std::setprecision()
#include <iostream>

int main()
{
    std::cout << std::setprecision(17);

    double d1{ 1.0 };
    std::cout << d1 << '\n';

    double d2{ 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 }; // should equal 1.0
    std::cout << d2 << '\n';

    return 0;
}
```

COPY

```
1
0.99999999999999989
```

Although we might expect that d1 and d2 should be equal, we see that they are not. If we were to compare d1 and d2 in a program, the program would probably not perform as expected. Because floating point numbers tend to be inexact, comparing floating point numbers is generally problematic -- we discuss the subject more (and solutions) in lesson [[5-6-Relational-operators-and-floating-point-comparisons|5.6 - 关系运算符和浮点数比较]]

One last note on rounding errors: mathematical operations (such as addition and multiplication) tend to make rounding errors grow. So even though 0.1 has a rounding error in the 17th significant digit, when we add 0.1 ten times, the rounding error has crept into the 16th significant digit. Continued operations would cause this error to become increasingly significant.

!!! tldr "关键信息"

	Rounding errors occur when a number can’t be stored precisely. This can happen even with simple numbers, like 0.1. Therefore, rounding errors can, and do, happen all the time. Rounding errors aren’t the exception -- they’re the rule. Never assume your floating point numbers are exact.

A corollary of this rule is: be wary of using floating point numbers for financial or currency data.

## NaN 和 Inf

There are two special categories of floating point numbers. The first is Inf, which represents infinity. Inf can be positive or negative. The second is NaN, which stands for “Not a Number”. There are several different kinds of NaN (which we won’t discuss here). NaN and Inf are only available if the compiler uses a specific format (IEEE 754) for floating point numbers. If another format is used, the following code produces undefined behavior.

Here’s a program showing all three:

```cpp
#include <iostream>

int main()
{
    double zero {0.0};
    double posinf { 5.0 / zero }; // positive infinity
    std::cout << posinf << '\n';

    double neginf { -5.0 / zero }; // negative infinity
    std::cout << neginf << '\n';

    double nan { zero / zero }; // not a number (mathematically invalid)
    std::cout << nan << '\n';

    return 0;
}
```


And the results using Visual Studio 2008 on Windows:

```
1.#INF
-1.#INF
1.#IND
```

_INF_ stands for infinity, and _IND_ stands for indeterminate. Note that the results of printing _Inf_ and _NaN_ are platform specific, so your results may vary.

!!! success "最佳实践"

	Avoid division by 0 altogether, even if your compiler supports it.

## 结论

To summarize, the two things you should remember about floating point numbers:

1.  Floating point numbers are useful for storing very large or very small numbers, including those with fractional components.
2.  Floating point numbers often have small rounding errors, even when the number has fewer significant digits than the precision. Many times these go unnoticed because they are so small, and because the numbers are truncated for output. However, comparisons of floating point numbers may not give the expected results. Performing mathematical operations on these values will cause the rounding errors to grow larger.