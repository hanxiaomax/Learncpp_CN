---
title: 10.3 - 数值转换
alias: 10.3 - 数值转换
origin: /none/
origin_title: "8.3 — Numeric conversions"
time: 2022-3-17
type: translation
tags:
- numeric conversions
- conversions
- static_cast
---

> [!note] "Key Takeaway"
> - 符合数值提升规则的类型转换是首先是数值提升，不是数值转换
> - 数值转换涵盖了数值提升规则未涉及的其他类型转换
> - 5 种基本数值转换：
>		- 整型转整型
>		- 浮点转浮点
>		- 浮点转整型
>		- 整型转浮点
>		- 整型或浮点转布尔
> - 数值提升总是安全的，但是数值转换不一定，可能造成数据或精度丢失
> - 缩窄转换会造成精度丢失。编译器会在发生隐式缩窄转换时报告错误
> - 尽可能避免缩窄转换。如果一定要进行转换，使用 `static_cast` 显式地进行缩窄转换。
> - 括号初始化不允许隐式地缩窄转换
> - 一些需要注意的重要规则：
>		- 将值转换为其范围不支持该值的类型将可能导致意想不到的结果
>		- 只要值适合较小类型的范围，从较大的整型或浮点类型转换为同一族的较小类型通常是有效的
>		- 整数转浮点数，只要范围ok就可以
>		- 浮点数转整数，只要范围ok就可以，但是小数部分会丢失

在上一节课 ([[10-2-Floating-point-and-integral-promotion|8.2 - 浮点数和整型提升]]) 中，我们介绍了[[numeric promotions|数值提升]]，它属于一种类型转换，可以将更窄的数据类型转换为更宽的数据类型(通常是 `int` 或 `double`) 使其可以被更高效地处理。

C++ 支持另一种类数值类型转换，称为[[numeric-conversions|数值转换(numeric conversions)]]，它涵盖了数值提升规则没有涵盖的其他类型转换。


> [!tldr] "关键信息"
> 任何符合**数值提升**规则（[[10-2-Floating-point-and-integral-promotion|8.2 - 浮点数和整型提升]]）的类型转换，都属于[[numeric promotions|数值提升]]而不是数值转换。

#### 五种基本的数值转换：

1.  把一种整型类型转换为另外一种整型类型（整型提升除外）
	```cpp
	short s = 3; // convert int to short
	long l = 3; // convert int to long
	char ch = s; // convert short to char
	```
1.  把一种浮点类型转换为另外一种浮点类型（浮点提升除外）:
	```cpp
	float f = 3.0; // convert double to float
	long double ld = 3.0; // convert double to long double
	```
3.  将浮点数类型转换为任何整型类型：
	```cpp
	int i = 3.5; // convert double to int
	```
4.  将整型类型转换为任何浮点类型：
	```cpp
	double d = 3; // convert int to double
	```
1.  将整型或浮点型转换为bool类型：
	```cpp
	bool b1 = 3; // convert int to bool
	bool b2 = 3.0; // convert double to bool
	```


> [!cite] "题外话"
> 由于大括号初始化不允许进行一些数值转换(稍后会详细介绍)，为了使示例简单，我们在本课中使用了复制初始化(这种初始化方法没有这样的限制)。


## 缩窄转换

与数值提升(始终是安全的)不同，数值转换可能(也可能不会)导致数据或精度的丢失。

有些数值转换总是安全的(例如 `int` 到 `long` ，或者 `int` 到 `double`)。其他数值转换，例如 `double` 到 `int` ，可能会导致数据丢失(取决于转换的特定值和/或基础类型的范围)：

```cpp
int i1 = 3.5; // the 0.5 is dropped, resulting in lost data
int i2 = 3.0; // okay, will be converted to value 3, so no data is lost
```


在 C++ 中[[narrowing-convertions|缩窄转换(narrowing conversion)]] 是一种可能会造成数据丢失的数值转换。这种缩窄转换包括为：

- 浮点数类型转换为整型类型；
- 较宽的浮点类型转换为较窄的浮点类型，除非被转换的值是 `constexpr` 类型且它的范围在目标类型范围内(即使较窄的类型不具备存放完整数据的精度）。
- 从整数类型转换为浮点类型，除非转换的值是 `constexpr` 且在目标类型范围内，并且可以转换回原始类型而不丢失数据。
- 从较宽的整型转换为较窄的整型，除非转换的值是 `constexpr` 且整型提升后适合目标类型。

好消息是你不需要记住这些。当编译器确定需要隐式缩窄转换时，它通常会发出警告(或错误)。

> [!warning] "注意"
> 当将`signed int`转换为`unsigned int`时，编译器通常会**不会**发出警告，反之亦然，即使这些是缩窄转换。要特别小心这些类型之间无意的转换(特别是当向带相反符号形参的函数传递实参时)。
	
例如，当编译下面的程序时：

```cpp
int main()
{
    int i = 3.5;
}
```

Visual Studio 会产生如下告警信息：

```
warning C4244: 'initializing': conversion from 'double' to 'int', possible loss of data
```

一般来说，应该避免缩窄转换，但在某些情况下可能需要这样做。在这种情况下，您应该使用 `static_cast` 显式地进行缩窄转换。例如:

```cpp
void someFcn(int i)
{
}

int main()
{
    double d{ 5.0 };

    someFcn(d); // 不好: 编译器会产生缩窄转换告警
    someFcn(static_cast<int>(d)); // 好：显式地告知编译器仅缩窄转换，不会产生告警
    return 0;
}
```


> [!success] "最佳实践"
> 尽可能避免缩窄转换。如果一定要进行转换，使用 `static_cast` 显式地进行缩窄转换。
	

## 括号初始化不允许隐式缩窄转换

在使用大括号初始化时，严格禁止缩窄转换(这也是首选此初始化形式的主要原因之一)：

```cpp
int main()
{
    int i { 3.5 }; // won't compile
}
```


Visual Studio 会产生如下错误信息：

```
error C2397: conversion from 'double' to 'int' requires a narrowing conversion
```

## 关于数值转换的更多信息


数值转换的具体规则又多又复杂，所以这里我们只讲最重要、最需要记忆的。

在*所有*情况下，将值转换为其范围不支持该值的类型将可能导致意想不到的结果。例如:


```cpp
int main()
{
    int i{ 30000 };
    char c = i; // chars have range -128 to 127

    std::cout << static_cast<int>(c);

    return 0;
}
```

在本例中，我们将一个大整数赋给一个 `char` 型变量(范围为-128到127)。这会导致 `char` 溢出，并产生意想不到的结果:

```
48
```


只要值适合较小类型的范围，从较大的整型或浮点类型转换为同一族的较小类型通常是有效的。例如:

```cpp
int i{ 2 };
short s = i; // convert from int to short
std::cout << s << '\n';

double d{ 0.1234 };
float f = d;
std::cout << f << '\n';
```


能够输出预期的结果：

```
2
0.1234
```

对于浮点数的例子，在更小的类型中可能出现舍入误差，例如：

```cpp
float f = 0.123456789; // double 值 0.123456789 有 9 位有效数组，但是 float 只能支持 7 位有效数字
std::cout << std::setprecision(9) << f << '\n'; // std::setprecision defined in iomanip header
```


在这个例子中，我们可以看到由于`float`不能支持`double`类型的精度，出现了精度丢失的问题：

```
0.123456791
```

从整数到浮点数的转换通常只要值在浮点类型的范围内就可以工作。例如:

```cpp
int i{ 10 };
float f = i;
std::cout << f;
```

可以输出预期的结果：

```
10
```

从浮点数到整数的转换只要值在整数的范围内就可以工作，但是任何小数值都会丢失。例如:

```cpp
int i = 3.5;
std::cout << i << '\n';
```


在这个例子中，丢失了小数值(.5)，留下以下结果：

```
3
```

虽然数值转换规则看起来很可怕，但实际上，如果你试图做一些危险的事情(不包括一些有符号/无符号的转换)，编译器通常会发出警告。