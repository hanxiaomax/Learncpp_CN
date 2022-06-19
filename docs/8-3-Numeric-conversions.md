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
	

In the previous lesson ([[8-2-Floating-point-and-integral-promotion|8.2 - 浮点数和整型提升]]), we covered numeric promotions, which are conversions of specific narrower numeric types to wider numeric types (typically `int` or `double`) that can be processed efficiently.

C++ supports another category of numeric type conversions, called numeric conversions, that cover additional type conversions not covered by the numeric promotion rules.

!!! tldr "关键信息"

	Any type conversion covered by the numeric promotion rules ([[8-2-Floating-point-and-integral-promotion|8.2 - 浮点数和整型提升]]) is a numeric promotion, not a numeric conversion.

There are five basic types of numeric conversions.

1.  Converting an integral type to any other integral type (excluding integral promotions):

```cpp
short s = 3; // convert int to short
long l = 3; // convert int to long
char ch = s; // convert short to char
```


2.  Converting a floating point type to any other floating point type (excluding floating point promotions):

```cpp
float f = 3.0; // convert double to float
long double ld = 3.0; // convert double to long double
```


3.  Converting a floating point type to any integral type:

```cpp
int i = 3.5; // convert double to int
```


4.  Converting an integral type to any floating point type:

```cpp
double d = 3; // convert int to double
```

5.  Converting an integral type or a floating point type to a bool:

```cpp
bool b1 = 3; // convert int to bool
bool b2 = 3.0; // convert double to bool
```


!!! cite "题外话"

    Because brace initialization disallows some numeric conversions (more on this in a moment), we use copy initialization in this lesson (which does not have any such limitations) in order to keep the examples simple.

## 缩窄转换

Unlike a numeric promotion (which is always safe), a numeric conversion may (or may not) result in the loss of data or precision.

Some numeric conversions are always safe (such as `int` to `long`, or `int` to `double`). Other numeric conversions, such as `double` to `int`, may result in the loss of data (depending on the specific value being converted and/or the range of the underlying types):

```cpp
int i1 = 3.5; // the 0.5 is dropped, resulting in lost data
int i2 = 3.0; // okay, will be converted to value 3, so no data is lost
```


In C++, a [[narrowing-convertions|缩窄转换(narrowing conversion)]] is a numeric conversion that may result in the loss of data. Such narrowing conversions include:

-   From a floating point type to an integral type.
-   From a wider floating point type to a narrower floating point type, unless the value being converted is constexpr and is in range of the destination type (even if the narrower type doesn’t have the precision to store the whole number).
-   From an integral to a floating point type, unless the value being converted is constexpr and is in range of the destination type and can be converted back into the original type without data loss.
-   From a wider integral type to a narrower integral type, unless the value being converted is constexpr and after integral promotion will fit into the destination type.

The good news is that you don’t need to remember these. Your compiler will usually issue a warning (or error) when it determines that an implicit narrowing conversion is required.

!!! warning "注意"

	Compilers will often _not_ warn when converting a signed int to an unsigned int, or vice-versa, even though these are narrowing conversions. Be extra careful of inadvertent conversions between these types (particularly when passing an argument to a function taking a parameter of the opposite sign).

For example, when compiling the following program:

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