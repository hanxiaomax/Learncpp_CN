---
title: 8.3 - 数值转换
alias: 8.3 - 数值转换
origin: /none/
origin_title: "8.3 — Numeric conversions"
time: 2022-3-17
type: translation
tags:
- conversions
---

??? note "关键点速记"

	- 符合数值提升规则的类型转换是首先是数值提升，不是数值转换
	- 数值转换涵盖了数值提升规则未涉及的其他类型转换
	- 5 种基本数值转换：
		- 整型转整型
		- 浮点转浮点
		- 浮点转整型
		- 整型转浮点
		- 整型或浮点转布尔
	- 数值提升总是安全的，但是数值转换不一定，可能造成数据或精度丢失
	- 缩窄转换会造成精度丢失

在上一节课 ([[8-2-Floating-point-and-integral-promotion|8.2 - 浮点数和整型提升]]) 中，我们介绍了[[numeric promotions|数值提升]]，它属于一种类型转换，可以将更窄的数据类型转换为更宽的数据类型(通常是 `int` 或 `double`) 使其可以被更高效地处理。

C++ 支持另一种类数值类型转换，称为[[numeric-conversions|数值转换(numeric conversions)]]，它涵盖了数值提升规则没有涵盖的其他类型转换。


!!! tldr "关键信息"

	任何符合**数值提升**规则（[[8-2-Floating-point-and-integral-promotion|8.2 - 浮点数和整型提升]]）的类型转换，都属于[[numeric promotions|数值提升]]而不是数值转换。

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


!!! cite "题外话"

	由于大括号初始化不允许进行一些数值转换(稍后会详细介绍)，为了使示例简单，我们在本课中使用了复制初始化(这种初始化方法没有这样的限制)。


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
- 从较宽的整型转换为较窄的整型，除非转换的值是 constexpr 且整型提升后适合目标类型。

好消息是你不需要记住这些。当编译器确定需要隐式缩窄转换时，它通常会发出警告(或错误)。

!!! warning "注意"

	当将`signed int`转换为`unsigned int`时，编译器通常会**不会**发出警告，反之亦然，即使这些是缩窄转换。要特别小心这些类型之间无意的转换(特别是当向带相反符号形参的函数传递实参时)。
	
例如：For example, when compiling the following program:

```cpp
int main()
{
    int i = 3.5;
}
```


Visual Studio produces the following warning:

warning C4244: 'initializing': conversion from 'double' to 'int', possible loss of data

In general, narrowing conversions should be avoided, but there are situational cases where you might need to do one. In such cases, you should make the implicit narrowing conversion explicit by using `static_cast`. For example:

```cpp
void someFcn(int i)
{
}

int main()
{
    double d{ 5.0 };

    someFcn(d); // bad: will generate compiler warning about narrowing conversion
    someFcn(static_cast<int>(d)); // good: we're explicitly telling the compiler this narrowing conversion is expected, no warning generated

    return 0;
}
```

COPY

!!! success "最佳实践"

	Avoid narrowing conversions whenever possible. If you do need to perform one, use `static_cast` to make it an explicit conversion.

## 括号初始化不允许缩窄转换

Narrowing conversions are strictly disallowed when using brace initialization (which is one of the primary reasons this initialization form is preferred):

```cpp
int main()
{
    int i { 3.5 }; // won't compile
}
```

COPY

Visual Studio produces the following error:

error C2397: conversion from 'double' to 'int' requires a narrowing conversion

## 关于数值转换的更多信息

The specific rules for numeric conversions are complicated and numerous, so here are the most important things to remember.

In _all_ cases, converting a value into a type whose range doesn’t support that value will lead to results that are probably unexpected. For example:

```cpp
int main()
{
    int i{ 30000 };
    char c = i; // chars have range -128 to 127

    std::cout << static_cast<int>(c);

    return 0;
}
```


In this example, we’ve assigned a large integer to a variable with type `char` (that has range -128 to 127). This causes the char to overflow, and produces an unexpected result:

```
48
```

Converting from a larger integral or floating point type to a smaller type from the same family will generally work so long as the value fits in the range of the smaller type. For example:

```cpp
int i{ 2 };
short s = i; // convert from int to short
std::cout << s << '\n';

double d{ 0.1234 };
float f = d;
std::cout << f << '\n';
```


This produces the expected result:

```
2
0.1234
```

In the case of floating point values, some rounding may occur due to a loss of precision in the smaller type. For example:

```cpp
float f = 0.123456789; // double value 0.123456789 has 9 significant digits, but float can only support about 7
std::cout << std::setprecision(9) << f << '\n'; // std::setprecision defined in iomanip header
```



In this case, we see a loss of precision because the `float` can’t hold as much precision as a `double`:

```
0.123456791
```

Converting from an integer to a floating point number generally works as long as the value fits within the range of the floating point type. For example:

```cpp
int i{ 10 };
float f = i;
std::cout << f;
```


This produces the expected result:

```
10
```

Converting from a floating point to an integer works as long as the value fits within the range of the integer, but any fractional values are lost. For example:

```cpp
int i = 3.5;
std::cout << i << '\n';
```


In this example, the fractional value (.5) is lost, leaving the following result:

```
3
```

While the numeric conversion rules might seem scary, in reality the compiler will generally warn you if you try to do something dangerous (excluding some signed/unsigned conversions).