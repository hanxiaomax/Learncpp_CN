---
title: 4.12 - 类型转换和 static_cast
alias: 4.12 - 类型转换和 static_cast
origin: /introduction-to-type-conversion-and-static_cast/
origin_title: "4.12 — Introduction to type conversion and static_cast"
time: 2022-3-27
type: translation
tags:
- type conversion 
- static_cast
---


> [!note] "Key Takeaway"
> - 编译器会对基本数据类型进行隐式类型转换，但导致信息丢失的隐式类型转换会引发告警或错误（括号初始化时）
> - `static_cast<new_type>(expression)` 进行显式类型转换
> - 每当你看到有尖括号(`<>`)存在的 C++ 语法（除了预处理器指令）时，在两个尖括号中间的内容很可能是一个类型名。这是C++中处理需要可参数化类型时的方法。
> - `static_cast` 运算符不会做任何范围检查，所以如果你在类型转换时，新类型并不能包含该值，则会产生[[undefined-behavior|未定义行为]]。
> - 大多数编译器将 `std::int8_t` 和 `std::uint8_t` (以及对应的速度优先、大小优先的固定宽度类型) 分别当做  `signed char` 和 `unsigned char` 处理。

## 隐式类型转换

考虑如下程序：

```cpp
#include <iostream>

void print(double x) // print takes an double parameter
{
	std::cout << x;
}

int main()
{
	print(5); // what happens when we pass an int value?

	return 0;
}
```


在上面的例子中， `print()` 函数的[[parameters|形参]] 为 `double` 类型，主调函数将 5 传递给函数，但此处 5 的类型是整型。这样做有什么后果吗？

在大多数情况下，C++ 会很乐于将一种基本类型转换为另一种基本类型，这个转换过程称为[[type-conversion|类型转换(type conversion)]]。因此，[[arguments|实参]] 5 会被转换为 double 类型的值 5.0 并且被拷贝给形参  `x`。于是 `print()`  就将该值打印了出来：

```bash
5
```

当编译器帮助我们进行类型转换的时候，我们称其为**隐式类型转换**。

## 隐式类型转换告警

尽管隐式类型转换已经足够满足大多数的类型转换需要，但是仍然有些情况是无法满足的，考虑下面这个程序：

```cpp
#include <iostream>

void print(int x) // print 函数现在接收一个整型的参数
{
	std::cout << x;
}

int main()
{
	print(5.5); // 警告：我们传入了一个 double 类型的值。

	return 0;
}
```


在上面的程序中，我们将 `print()` 的形参改成了 `int` 类型，而调用 `print()` 的时候却传入了一个 `double` 类型的值 `5.5`。和最初的例子的情况类似，编译器会对其进行类型转换，将 `double` 值 `5.5` 转换为 `int` 类型，以便能够被传入 `print()`。

但是和最初的例子相比，当这个程序被编译的时候，编译器会产生关于数据丢失的告警。如果你打开了“将警告当做错误处理”的话，你的编译器就会停止编译过程。

> [!tip] "小贴士"
> 你需要暂时关闭 “将警告当做错误处理” 功能才能编译该例程，请参考[0.11 -- Configuring your compiler: Warning and error levels](https://www.learncpp.com/cpp-tutorial/configuring-your-compiler-warning-and-error-levels/)for more information about this setting.

编译程序并运行，打印结果如下：

```
5
```

注意，尽管我们传入的值是 5.5，但打印结果却是 5。因为整型变量不能保存小数部分，所以 double 类型的值 5.5 就被转换成了一个 int，小数部分直接被丢弃了，只有整数部分被保留了下来。

因为将浮点数转换成整型值会导致消失部分被丢弃，所以编译器需要在进行隐式类型转换的时候向我们发出告警。即使我们传入的浮点数本身没有小数部分，编译器仍然会发出告警，例如 5.0 被转换成整型时没有丢失小数，但是编译器仍然会提醒我们这种转换是不安全的。

> [!tldr] "关键信息"
> 有些类型转换总是安全的（例如 `int` 到 `double`），而另外一些类型在转换时会导致值的变化（例如 `double` 到 `int`）。不安全的隐式类型转换通常会导致编译器告警或报错（在括号初始化时）。

这也是推荐使用[[1-4-Variable-assignment-and-initialization#括号初始化 Brace initialization|括号初始化]]的主要原因之一。括号初始化能够避免初始化值因为隐式类型转换而丢失信息。

```cpp
int main()
{
    double d { 5 }; // okay: int to double is safe
    int x { 5.5 }; // error: double to int not safe

    return 0;
}
```


> [!info] "相关内容"
> 隐式类型转换是一个内容非常丰富的话题，我们会在后续的课程中对其进行深入解析（[[10-1-Implicit-type-conversion-coercion|8.1 - 隐式类型转换]]）。

## 使用 static_cast 运算符进行显式类型转换

在回到的 `print()` 例子，如果我们希望主动将一个 `double` 类型的值转换成 `int` 类型后传入函数呢？（即使知道这么做会丢失小数部分）。关闭编译器的“将警告当做错误处理”功能并不是一个好主意，因它可能会造成其他本应该发现的问题被忽略。

C++ 还支持另外一种类型转换，称为**显式类型转换**。显式类型转换允许我们明确地告诉编译器将一种类型的值转换为另外一种类型，程序员会为此操作负责（即如果转换导致了信息的丢失，算我们的错）。

大多数情况下，我们会使用 `static_cast` 操作符进行显式类型转换。 `static cast` 的语法看上去有些古怪：

```bash
static_cast<new_type>(expression)
```

static_cast 将一个表达式作为数，然后返回由 `new_type` 指定的新类型的值(例如 int、bool、char、double)。

> [!tldr] "关键信息"
> 每当你看到有尖括号(`<>`)存在的 C++ 语法（除了预处理器指令）时，在两个尖括号中间的内容很可能是一个类型名。这是 C++ 中处理需要可参数化类型时的方法。
	
使用 `static_cast` 修改之前的程序：

```cpp hl_lines="10"
#include <iostream>

void print(int x)
{
	std::cout << x;
}

int main()
{
	print( static_cast<int>(5.5) ); // explicitly convert double value 5.5 to an int

	return 0;
}
```


在上面的例子中，因为我们显式地要求将 `double` 类型的值 5.5 转换为 `int` 类型值，所以编译器不会产生告警信息（无需关闭 “将警告当做错误处理” 功能）。

> [!info] "相关内容"
> C++ 还支持其他类型的转换。我们会在[[10-6-Explicit-type-conversion-casting-and-static-cast|8.5 - 显式类型转换]]中进行详细介绍

## 使用 static_cast 将 char 转换为 int

在 [[4-11-Chars|4.11 - 字符]] 中，我们看到使用 `std::cout` 打印字符类型时，屏幕上会打印一个字符：

```cpp
#include <iostream>

int main()
{
    char ch{ 97 }; // 97 is ASCII code for 'a'
    std::cout << ch << '\n';

    return 0;
}
```

This prints:

```bash
a
```

如果我们想要打印其对应的整型值，则可以使用 `static_cast` 将 `char` 转换为 `int`：

```cpp
#include <iostream>

int main()
{
    char ch{ 97 }; // 97 是 ASCII 码中的 'a'
    std::cout << ch << " has value " << static_cast<int>(ch) << '\n'; // 将 ch 打印为 int

    return 0;
}
```

打印结果：

```bash
a has value 97
```

请注意 `static_cast` 的形参是一个表达式。当传入变量的时候，变量首先会进行求值并得到具体的值，然后该值会被转换成新的类型。作为实参的变量本身并不会受到影响，在上面的例子中，`ch` 仍然是字符类型，它保存的值也是仍然是原来的值。


## 将无符号数转换为有符号数

将无符号类型转换为有符号类型，同样可以使用 `static_cast` 运算符：

```cpp
#include <iostream>

int main()
{
    unsigned int u { 5u }; // 5u 表示 5 是无符号整型
    int s { static_cast<int>(u) }; // 返回值类型为 int

    std::cout << s;
    return 0;
}
```


 `static_cast` 运算符不会做任何范围检查，所以如果你在类型转换时，新类型并不能包含该值，则会产生[[undefined-behavior|未定义行为]]。因此，在上面的例子中，如果  `unsigned int` 保存的值比`int`能够保存的最大值还大，则将 `unsigned int` 转换为 `int` 时会产生无法预计的结果。

> [!warning] "注意"
> 如果被转换的值不能匹配新类型的范围，则 `static_cast` 运算符会产生未定义行为。
	

## std::int8_t 和 std::uint8_t 行为更像 chars 而不是整型

正如 [[4-6-Fixed-width-integers-and-size_t|4.6 - 固定宽度整型和 size_t]]中介绍的那样，大多数编译器将 `std::int8_t` 和 `std::uint8_t` (以及对应的速度优先、大小优先的固定宽度类型) 分别当做  `signed char` 和 `unsigned char` 处理。现在，既然我们已经介绍了什么是字符，接下来就可以谈谈，编译器这样做会带来什么问题：

```cpp
#include <cstdint>
#include <iostream>

int main()
{
    std::int8_t myint{65}; // initialize myint with value 65
    std::cout << myint;    // you're probably expecting this to print 65

    return 0;
}
```


因为 `std::int8_t` 自称是一种整型，所以你可能会认为上面的程序会打印 65。不过，在大多数系统上，上面的程序打印的其实是 `A`（`myint` 被当做了 `signed char`）处理。但是，这也不是绝对的（有些系统确实会打印 65）。

如果你想要确保 `std::int8_t` 或 `std::uint8_t` 对象都被当做整型处理，那么你可以使用 `static_cast` 将其转换为整型：

```cpp
#include <cstdint>
#include <iostream>

int main()
{
    std::int8_t myint{65};
    std::cout << static_cast<int>(myint); // 总是打印 65

    return 0;
}
```


在上面的例子中，`std::int8_t` 被当做整型处理了，但是如果从控制台获取输入，仍然会带来问题：

```cpp
#include <cstdint>
#include <iostream>

int main()
{
    std::cout << "Enter a number between 0 and 255: ";
    std::int8_t myint{};
    std::cin >> myint;

    std::cout << "You entered: " << static_cast<int>(myint);

    return 0;
}
```

运行程序：

```bash
Enter a number between 0 and 255: 35
You entered: 51
```

这个问题是这样的，当 `std::int8_t`被看做字符时，输入函数会将输入的内容看做是一系列的字符而不是整型。当你输入35之后，你实际上数了`'3'`和`'5'`两个字符。因为字符类型只能保存一个字符，因此只`'3'`被保存到了变量中（`'5'`被留在了输入流中以便后续的使用）。因为字符`'3'`的 ASCII 码是 51，所以51就被存放到了`myint`中，最终也就被打印了出来。

与之相对的，其他固定宽度整型在输入和输出时总是会被当做整型值处理。