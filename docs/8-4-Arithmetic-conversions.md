---
title: 8.4 - 算术转换
alias: 8.4 - 算术转换
origin: /arithmetic-conversions/
origin_title: "8.4 — Arithmetic conversions"
time: 2022-1-2
type: translation
tags:
- arithmetic conversions
- conversions
---

??? note "关键点速记"
	- 

在[[5-1-Operator-precedence-and-associativity|5.1 - 运算符优先级和结合律]]中我们讨论过，表达式是如何基于优先级和结合律进行运算的。


考虑下面这段代码：

```cpp
int x { 2 + 3 };
```


当二元运算符 `operator+` 执行时，它接受了两个操作数，且均为`int`类型。因为两个操作数的类型是相同的，所以它们会被用来执行计算然后返回结果。因此 `2 + 3` 会得到 `int` 值 `5`。

但是，如果两个操作数类型不同呢？

```cpp
??? y { 2 + 3.5 };
```


在这个例子中，`operator+` 的两个操作数，一个是 `int`，另一个是 `double`。那么表达式的结果应该是什么类型的呢？是`int`还是`double`？还是其他的呢？如果是在定义变量的时候，我们可以选择变量的类型。在其他情况下，例如在使用 `std::cout <<`的时候，计算得到的类型会影响输出的结果。

在C++中，某些操作符要求它们的操作数具有相同的类型。如果在调用运算符时，两个操作数类型不同，则使用一组称为普通算术转换的规则将其中一个或两个操作数隐式转换为匹配类型。

## 需要操作数具有相同类型的运算符

下列运算符需要操作数具有相同类型：

-   二元算术运算符： `+`, `-`, `*`,`/`, `%`
-   二元关系运算符：`<`,` >`, `<=`, `>=`, `==`, `!=`
-   二元按位运算符：`&`, `^`, `|`
-   条件运算符 `?:` (包括条件，要求为布尔类型)

## 一般算术转换规则

一般算术转换规则非常简单。编译器具有一个按照优先级排序的类型列表，就像下面这样：

-   long double (最高优先级)
-   double
-   float
-   unsigned long long
-   long long
-   unsigned long
-   long
-   unsigned int
-   int (最低优先级)

以及两条规则：

-   如果至少有一个操作数在优先级列表中，则具有较低优先级的操作数会被转换为具有较高优先级的操作数；
-   否则 (两个操作数的类型均不在表中)，则两个操作数会进行[[numeric promotions|数值提升]](参见：[[8-2-Floating-point-and-integral-promotion|8.2 - 浮点数和整型提升]])。

## 一些例子

In the following examples, we’ll use the `typeid` operator (included in the `<typeinfo>` header), to show the resulting type of an expression.

First, let’s add an `int` and a `double`:

```cpp
#include <iostream>
#include <typeinfo> // for typeid()

int main()
{
    int i{ 2 };
    double d{ 3.5 };
    std::cout << typeid(i + d).name() << ' ' << i + d << '\n'; // show us the type of i + d

    return 0;
}
```


In this case, the `double` operand has the highest priority, so the lower priority operand (of type `int`) is type converted to `double` value `2.0`. Then `double` values `2.0` and `3.5` are added to produce `double` result `5.5`.

On the author’s machine, this prints:

```
double 5.5
```

Note that your compiler may display something slightly different, as the output of `typeid.name()` is left up to the compiler.

Now let’s add two values of type `short`:

```cpp
#include <iostream>
#include <typeinfo> // for typeid()

int main()
{
    short a{ 4 };
    short b{ 5 };
    std::cout << typeid(a + b).name() << ' ' << a + b << '\n'; // show us the type of a + b

    return 0;
}
```


Because neither operand appears on the priority list, both operands undergo integral promotion to type `int`. The result of adding two `ints` is an `int`, as you would expect:

```
int 9
```

## 符号和无符号问题

This prioritization hierarchy can cause some problematic issues when mixing signed and unsigned values. For example, take a look at the following code:

```cpp
#include <iostream>
#include <typeinfo> // for typeid()

int main()
{
    std::cout << typeid(5u-10).name() << ' ' << 5u - 10; // 5u means treat 5 as an unsigned integer

    return 0;
}
```


You might expect the expression `5u - 10` to evaluate to `-5` since `5 - 10` = `-5`. But here’s what actually results:

```
unsigned int 4294967291
```

Because the `unsigned int` operand has higher priority, the `int` operand is converted to an `unsigned int`. And since the value `-5` is out of range of an `unsigned int`, we get a result we don’t expect.

Here’s another example showing a counterintuitive result:

```cpp
#include <iostream>

int main()
{
    std::cout << std::boolalpha << (-3 < 5u);

    return 0;
}
```


While it’s clear to us that `5` is greater than `-3`, when this expression evaluates, `-3` is converted to a large `unsigned int` that is larger than `5`. Thus, the above prints `false` rather than the expected result of `true`.

This is one of the primary reasons to avoid unsigned integers -- when you mix them with signed integers in arithmetic expressions, you’re at risk for unexpected results. And the compiler probably won’t even issue a warning.