---
title: 5.2 - 数学运算符
alias: 5.2 - 数学运算符
origin: /arithmetic-operators/
origin_title: "5.2 -- Arithmetic operators"
time: 2022-5-5
type: translation
tags:
- operator
---

> [!note] "Key Takeaway"
> - 使用 static_cast 对整型数进行浮点除法
> - `std::cout << "double / int = " << static_cast<double>(x) / y << '\n';`
> - 除 0 (或 0.0) 很可能会导致你的程序崩溃

## 一元数学运算符

一元运算符有两种，正号(`+`)和负号(`-`)。提醒一下，一元运算符只需要一个[[operands|操作数]]。

|运算符	|符号	|格式	|操作|
|---|---|---|---|
|Unary plus	|+	|+x	| x的值 |
|Unary minus	|-	|-x	|x的相反数|


一元符号运算符返回操作数乘以-1之后的结果。换句话说，如果 x = 5，则 -x 是 -5。

一元正号运算符返回操作数本身。换句话说，如果 +5 是 5 则 +x 是 x。一般来说你不需要使用它，因为是多余的。只有为了和一元负号运算符形成对称的情况下才会使用它。

这些操作符应当放置在紧邻着操作数前面的位置（例如应该写作 `-x`而不是`- x`）。

不要把一元负号运算符和减号搞混了，尽管它们的符号的确是同一个。例如，在表达式 `x = 5 - -3;`中，第一个`-`是减号，第二个`-`则是负号。

## 二元数学运算符

 二元数学运算符有 5 个，它们需要两个操作数。
 
|运算符	|符号	|形式	|操作|
|---|---|---|---|
|Addition	|+	|x + y	|x 加 y|
|Subtraction	|-	|x - y	|x 减 y|
|Multiplication	|*	|x * y	|x 乘 y|
|Division	|/	|x / y	|x 除 y|
|Modulus (Remainder)	|%	|x % y	|x 除 y 的余数|

加减乘和日常生活中的用法是一样的。

除法和求模（求余数）则需要进行一些额外的说明。我们会在本节课介绍除法，下节课会介绍求余。

## 整数除法和浮点数除法

可以简单地认为除法运算符有两种”模式“。

如果任一(或全部)的操作数是浮点值，则除法操作数会执行**浮点除法**。浮点数除法会返回一个浮点值，小数部分会被保留。例如 `7.0 / 4 = 1.75`、`7 / 4.0 = 1.75` 和 `7.0 / 4.0 = 1.75`。和其他浮点运算一样，[[rounding-error|舍入误差]]可能会发生。

如果两个操作数都是整型，则除法运算符会执行整型除法。整型除法会丢弃结果的小数部分并返回一个整型数。例如 `7 / 4 = 1` ，因为小数部分被丢弃了。类似的 `-7 / 4 = -1` 因为小数部分被丢弃了。

## 使用 static_cast 对整型数进行浮点除法

如果有两个整型数，我希望不要丢失它们做除法后的小数部分，那么应该怎么做呢？

在 [[4-12-Introduction-to-type-conversion-and-static_cast|4.12 - 类型转换和 static_cast]] 中，我们展示了如何使用 `static_cast<>` 将字符转换成整型以便打印时能够将其打印为一个整数。

这里，我们同样可以用 `static_cast<>` 将一个整型转换为浮点数以便使用浮点数除法。考虑下面的代码：

```cpp
#include <iostream>

int main()
{
    int x{ 7 };
    int y{ 4 };

    std::cout << "int / int = " << x / y << '\n';
    std::cout << "double / int = " << static_cast<double>(x) / y << '\n';
    std::cout << "int / double = " << x / static_cast<double>(y) << '\n';
    std::cout << "double / double = " << static_cast<double>(x) / static_cast<double>(y) << '\n';

    return 0;
}
```

打印结果如下：

```
int / int = 1
double / int = 1.75
int / double = 1.75
double / double = 1.75
```

从结果来看，只要有任何一个操作数是浮点数，就会执行浮点除法，而不是整数除法。 

## 除 0 错误

除 0 (或 0.0) 很可能会导致你的程序崩溃，因为该运算的结果是没有数学定义的。


```cpp
#include <iostream>

int main()
{
	std::cout << "Enter a divisor: ";
	int x{};
	std::cin >> x;

	std::cout << "12 / " << x << " = " << 12 / x << '\n';

	return 0;
}
```


如果你运行上述程序并输入 0，你的程序会崩溃或异常终止。你可以亲自体验一下，这不会对你电脑有什么影响的。

## 算数赋值运算符

|运算符	|符号	|格式	|操作|
|---|---|---|---|
|Assignment	|=	|x = y	|y 赋值给 x|
|Addition assignment	|+=	|x += y	|把 y 加到 x 上|
|Subtraction assignment	|-=	|x -= y	|从 x 中减去 y|
|Multiplication assignment	|\*=	| x \*= y	| 把 x 乘上 y|
|Division assignment	| /=	| x /= y	| 把 x 除 y|
|Modulus assignment	| %=	|x %= y	|把 x / y 的余数赋值给 x|

学到这里，如果你需要给一个变量加上 4，你很可能会这样做：

```cpp
x = x + 4; // add 4 to existing value of x
```

这么做是没问题的，就是有些啰嗦，它需要两个运算符才能完成（`operator+` 和 `operator=`）。

因为 `x = x + 4` 这样的表达式太常见了，所以 C++ 提供了五种同样功能但更方便的运算符。`x = x + 4` 可以替换为 `x += 4`。而对于 `x = x * y`，你可以写成 `x *= y`。

因此，上述代码可以变成下面的形式：

```cpp
x += 4; // add 4 to existing value of x
```