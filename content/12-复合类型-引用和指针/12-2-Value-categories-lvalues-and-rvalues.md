---
title: 12.2 - 值的分类（左值和右值）
alias: 12.2 - 值的分类（左值和右值）
origin: /value-categories-lvalues-and-rvalues/
origin_title: "9.2 — Value categories (lvalues and rvalues)"
time: 2022-1-2
type: translation
tags:
- lvalues
- rvalues
---

> [!note] "Key Takeaway"
> - 左值就是解析到有标识符的表达式
> - 记忆窍门：左值出现在赋值运算符的左边，右值出现在赋值表达式的右边。左侧的是被赋值的一方，因此必须是可变的且具有标识符。右侧显然可以是字面量、函数和对象，它们都属于右值。需要注意的是，因为左值可以自动转换为右值，所以左值可以出现在右值的位置（即可以出现在右侧）
> - 右值会在表达式结束后被销毁，而左值则会继续存在

在开始介绍第一个复合类型[[lvalue-reference|左值引用]]前，让我们先来了解一下什么是[[lvalue|左值]]。

在[[1-10-Introduction-to-expressions|1.10 - 表达式简介]]中，我们将表达式定义为：“字面量、变量、操作符和函数调用的组合并可以执行产生一个单一的值”。

例如：

```cpp
#include <iostream>

int main()
{
    std::cout << 2 + 3; // The expression 2 + 3 produces the value 5

    return 0;
}
```

在上面的程序中，表达式 `2 + 3` 求值会得到 5，然后 5 被打印到控制台上。

在 [[6-4-Increment-decrement-operators-and-side-effects|6.4 - 自增自减运算符及其副作用]] 中，我们还介绍过，表达式是可以有[[side-effects|副作用]]的，即其结果的生命周期会超过表达式本身：

```cpp
#include <iostream>

int main()
{
    int x { 5 };
    ++x; // This expression statement has the side-effect of incrementing x
    std::cout << x; // prints 6

    return 0;
}
```

在上面的程序中，表达式 `++x` 会将 `x` 的值递增，其值的改变即使在表达式求值完成后也是存在的。

除了产生值和副作用之外，表达式还可以做另外一件事，它们可以求值得到对象和函数——我们稍后会介绍相关内容。

## 表达式的属性

==为了确定表达式如何求值以及可以在哪里被使用，C++中的所有表达式都有两个属性：[[expression-type|表达式类型]]和[[value-category|表达式值类别]]。==

## 表达式的类型

表达式的类型等于表达式求值得到的值、对象或函数的类型：

```cpp
#include <iostream>

int main()
{
    auto v1 { 12 / 4 }; // int / int => int
    auto v2 { 12.0 / 4 }; // double / int => double

    return 0;
}
```


对于 `v1`，编译器会在[[compile-time|编译时]]确定两个`int`的求值结果是`int`，所以`int`就是表达式的类型。通过[[type-inference|类型推断]]，`int`最终会作为 `v1` 的类型。

对于 `v2`，编译器会在[[compile-time|编译时]]确定，一个`double` 操作数和一个 `int` 操作数的求值结果是 `double` 类型的。还记得吗，算数运算符要求两个操作数具有匹配的类型，因此在这个例子中，`int` 操作数会被转换为`double`，随后就会执行浮点数除法。所以 `double` 会成为表达式的类型。

==编译器会使用表达式的类型来判断在特定上下文中是不是合法的表达式==，例如：

```cpp
#include <iostream>

void print(int x)
{
    std::cout << x;
}

int main()
{
    print("foo"); // error: print() was expecting an int argument, we tried to pass in a string literal

    return 0;
}
```

在上面的程序中， `print(int)` 函数期望一个`int`类型的[[parameters|形参]] 。不过，此处表达式的类型（字符串"foo"）并不匹配，而且没有可用的类型转换可用。所以会产生编译错误。

注意，表达式的类型必须在编译时确定（否则类型检查和类型推断将无法进行）——不过，表达式的值则可以在编译时确定（如果 表达式是constexpr）也可以在运行时确定（对于不是constexpr类型的表达式）。

## 表达式的值类别

考虑下面的程序：

```cpp
int main()
{
    int x{};

    x = 5; // valid: we can assign 5 to x
    5 = x; // error: can not assign value of x to literal value 5

    return 0;
}
```

其中的一个赋值语句是合法的（将 5 赋值给 x），另外一个则是非法的（将x的值赋值给字面量5是什么意思？）。可是，编译器是如何判断赋值语句中的表达式是否合法呢？

这个问题的答案就在于第二个表达式属性：表达式[[value-category|值类型]]。值类型表明一个表达式会求值得到一个值、一个函数还是一个对象。

在 C++11 之前，C++ 中只有两个可能的值类型：[[lvalue|左值]]和[[rvalue|右值]]。

在 C++11 中，新增了三个值类型 (`glvalue`、`prvalue` 和 `xvalue`)，用于支持[[move-semantics|移动语义]]。

> [!info] "作者注"
> 在本节课中，我们只关注 C++11 之前的两种值类型（也是我们目前所需要的）作为简介。我们会在[[22-x-chapter-M-comprehensive-review|M.x - 小结与测试 - 移动和智能指针]]一章中介绍移动语义和其他的几种值类型。

## Lvalue 和 rvalue 表达式

左值 lvalue (是 “left value” 或 “locator value”的缩写，有时也写作 “l-value”) 是一种表达式，它最终会求值得到一个具有[[identity|身份特征]]的函数或对象。如果一个对象具有[[identifier|标识符(identifier)]]（例如变量名或函数名）或一个可被标识的内存地址（可以通过`&`运算符取地址——会在[[12-7-Introduction-to-pointers|12.7 - 指针简介]]中进行介绍）则称其具有身份特征。具有标识的对象生命周期会超过表达式本身。

```cpp
#include <iostream>

int main()
{
    int x{};

    std::cout << x << '\n'; // x is an lvalue expression

    return 0;
}
```

在上面的程序中，表达式 `x` 是一个左值表达式，因为它求值得到变量`x`（它具有标识符）。

因为语言引入了常量，左值现在有两个子类型：可变左值——它的值是可以改变的和不可变左值——它的值不可以被修改（因为该左值是 const 或 constexpr）。

```cpp
#include <iostream>

int main()
{
    int x{};
    const double d{};

    std::cout << x << '\n'; // x is a modifiable lvalue expression
    std::cout << d << '\n'; // d is a non-modifiable lvalue expression

    return 0;
}
```

rvalue (是“right value”的简称，有时候也写作`r-value`) 是一种表达式，除了左值之外的都是右值。常见的右值包括[[literals|字面量]]（除了字符串字面量，它是左值）和函数或操作符的返回值。[[rvalue|右值]]其作用域只存在于使用它的表达式中。

```cpp
#include <iostream>

int return5()
{
    return 5;
}

int main()
{
    int x{ 5 }; // 5 is an rvalue expression
    const double d{ 1.2 }; // 1.2 is an rvalue expression

    std::cout << x << '\n'; // x is a modifiable lvalue expression
    std::cout << d << '\n'; // d is a non-modifiable lvalue expression
    std::cout << return5(); // return5() is an rvalue expression (since the result is returned by value)
    std::cout << x + 1 << '\n'; // x + 1 is a rvalue
    std::cout << static_cast<int>(d) << '\n'; // the result of static casting d to an int is an rvalue

    return 0;
}
```

你可能会好奇为什么 `return5()` 和 `x + 1` 属于右值：问题的答案在于这些表达式的值在产生后必须马上使用（在表达式的作用域内）或被丢弃。

现在，我们可以回答前面的问题了，为什么 `x = 5` 是合法的但 `5 = x` 则是不合法：赋值运算符要求其左操作数是一个可修改的左值表达式，且右操作数为一个右值表达式。赋值操作 `5 = x` 失败是因为 5 并不是一个左值。


```cpp
int main()
{
    int x{};

    // Assignment requires the left operand to be a modifiable lvalue expression and the right operand to be an rvalue expression
    x = 5; // valid: x is a modifiable lvalue expression and 5 is an rvalue expression
    5 = x; // error: 5 is an rvalue expression and x is a modifiable lvalue expression

    return 0;
}
```


> [!info] "相关内容"
> 左值和右值表达式的完整列表参考[这里](https://en.cppreference.com/w/cpp/language/value_category)。在C++11中，右值被分成了两个子类别：prvalues 和 xvalues。此处我们谈论的 rvalues 综合了这两种类型的特点。
	

## L-value 和 r-value 的转换

在上面的赋值运算符中我们提到，赋值运算符的右侧运算数必须是一个右值表达式，那么为什么下面的代码可以正确运行呢？

```cpp
int main()
{
    int x{ 1 };
    int y{ 2 };

    x = y; // y 是一个可以修改的左值而不是右值，为什么这个表达式是合法的呢？

    return 0;
}
```

这是因为左值可以被隐式地转换为右值，所以任何可以使用右值的地方都可以使用左值。

考虑下面代码：

```cpp
int main()
{
    int x { 2 };

    x = x + 1;

    return 0;
}
```

在这个语句中，变量x的使用存在两个不同的语境。赋值运算符左侧的x是一个左值表达式，它求值得到变量 x。赋值运算符右侧的 x+1 则是一个右值表达式，它求值得到3。

现在，我们已经详细地介绍了左值，接下来就是我们要接触到的第一个复杂表达式类型：[[lvalue-reference|左值引用]]。

> [!tldr] "关键信息"
> 辨别左值表达式和右值表达式的关键法则：
> - 左值表达式是那些求值为变量或其他具有身份标识的变量，且它们可以持续到表达式结束后。
> - 右值表达式则是那些可以求值为字面量的表达式，或者是函数和操作符的返回值，它们会在表达式解释后被丢弃。
	