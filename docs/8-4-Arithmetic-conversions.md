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
- typeinfo
---

??? note "关键点速记"
	- C++ 中的一些二元运算符要求两个操作数具有相同的优先级，如果不满足则需要进行算术转换
	- 算术转换规则
		- 如果至少有一个操作数在优先级列表中，则具有较低优先级的操作数会被转换为具有较高优先级的操作数；
		- 否则 (两个操作数的类型均不在表中)，则两个操作数会进行[[numeric promotions|数值提升]](参见：[[8-2-Floating-point-and-integral-promotion|8.2 - 浮点数和整型提升]])。
	- 使用 [[typeid|typeid 运算符]] (在 `<typeinfo>` 头文件中)，来显示表达式结果所属的类型。
	- **无符号整型**被用在算术表达式中的时候，由于优先级比**整型**高，会导致整型被转换为无符号整型，如果是符号可能出现反转。这就是为什么不要使用无符号整型的原因

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

-   `long double` (最高优先级)
-   `double`
-   `float`
-   `unsigned long long`
-   `long long`
-   `unsigned long`
-   `long`
-   `unsigned int`
-   `int` (最低优先级)

以及两条规则：

-   如果至少有一个操作数在优先级列表中，则具有较低优先级的操作数会被转换为具有较高优先级的操作数；
-   否则 (两个操作数的类型均不在表中)，则两个操作数会进行[[numeric promotions|数值提升]](参见：[[8-2-Floating-point-and-integral-promotion|8.2 - 浮点数和整型提升]])。

## 一些例子

在下面的例子中，我们会使用 `typeid` 运算符 (在 `<typeinfo>` 头文件中)，来显示表达式结果所属的类型。

首先，将 `int` 和 `double` 相加：

```cpp
#include <iostream>
#include <typeinfo> // for typeid()

int main()
{
    int i{ 2 };
    double d{ 3.5 };
    std::cout << typeid(i + d).name() << ' ' << i + d << '\n'; // 显示 i + d 的类型

    return 0;
}
```


在这个例子中，`double` 类型操作数的优先级最高，所以优先级较低的操作数 (例如`int`) 的类型会被转换为 `double` 值 `2.0`. Then `double` values `2.0` and `3.5` are added to produce `double` result `5.5`.

在笔者的电脑上会打印如下信息：

```
double 5.5
```

注意，你的编译器可能会产生稍微不同的结果，因为 `typeid.name()` 输出的结果是由编译器决定的。

!!! info "译者注"

	在g++上使用[[typeid|typeid 运算符]]，输出的结果为[修饰名](https://en.wikipedia.org/wiki/Name_mangling)，可以使用
	```bash
	a.out | c++filt --types
	```
	得到可读的结果。[参考](https://stackoverflow.com/questions/4465872/why-does-typeid-name-return-weird-characters-using-gcc-and-how-to-make-it-prin)

现在，将两个`short`类型的值相加：

```cpp
#include <iostream>
#include <typeinfo> // for typeid()

int main()
{
    short a{ 4 };
    short b{ 5 };
    std::cout << typeid(a + b).name() << ' ' << a + b << '\n'; // 显示 a + b 的类型

    return 0;
}
```

因为两个操作数都没有出现在优先级列表中，所以两个操作数都被整型提升为 `int` 类型。两个 `int` 相加的结果是一个 `int`，正如你所期望的那样:

```
int 9
```

## 符号和无符号问题

当混合有符号和无符号值时，这种优先级层次结构可能会导致一些问题。例如，看看下面的代码:

```cpp
#include <iostream>
#include <typeinfo> // for typeid()

int main()
{
    std::cout << typeid(5u-10).name() << ' ' << 5u - 10; // 5u 即 5 被当做无符号整型处理

    return 0;
}
```


你可能会认为表达式 `5u - 10` 求值会等于 `-5` ，因为 `5 - 10` = `-5`。但实际结果却不是这样的：

```
unsigned int 4294967291
```

因为 `unsigned int` 操作数具有更高的优先级，所以 `int` 操作数被转换成了 `unsigned int`。而且 `-5` 超过了 `unsigned int` 能够表示的范围，所以结果才会出乎我们的意料。


下面是另一个反直觉结果的例子：

```cpp
#include <iostream>

int main()
{
    std::cout << std::boolalpha << (-3 < 5u);

    return 0;
}
```


尽管，很显然 `5` 是比 `-3`大的。当表达式求值时，`-3`会被转换为一个 `unsigned int` （反转成一个很大的数），这个数大于`5`。因此，上面的表达式会输出 `false` 而不是 `true`。

这也是避免无符号整数的主要原因之一——当在算术表达式中将它们与有符号整数混合使用时，可能会出现意外结果。编译器甚至可能不会发出警告。