---
title: 10.6 - 显式类型转换和static_cast
alias: 10.6 - 显式类型转换和static_cast
origin: /explicit-type-conversion-casting-and-static-cast/
origin_title: "8.5 -- Explicit type conversion (casting) and static_cast"
time: 2022-1-2
type: translation
tags:
- explicit-type-conversion
- conversions
- static-cast
---

> [!note] "Key Takeaway"
> - C++支持 5 种类型的显示类型转换: [[C-style-casts|C风格类型转换]]、[[static-casts|静态类型转换]]、[[const-cast|const 类型转换]]、[[dynamic-casts|动态类型转换]]和[[reinterpret-casts|重新解释类型转换]]。后四种类型有时称为[[named-cast|具名名类型转换(named cast)]]。
> - C 语言类型的类型转换在不同的语境下会产生不同的效果，尽量不要使用
> - 优先使用`static_cast` ，它提供了[[runtime|运行时]]的类型检查机制，不容易犯错。
> - 使用 `static_cast`  进行显式地缩窄转换

在 [[10-1-Implicit-type-conversion-coercion|8.1 - 隐式类型转换]]中我们介绍过，编译器可以隐式地将一种类型的值转换成另外一种类型，即[[implicit-type-conversion|隐式类型转换]]。当你想要将一个数值类型通过[[numeric promotions|数值提升]]的方式转换为更宽的类型时，使用隐式类型转换是可以的。

很多新手 C++ 程序员会这样做：

```cpp
double d = 10 / 4; // 通过整型乘法，将值初始化为 2.0
```


因为 `10` 和 `4` 都是 `int`类型，所以执行的是整型除法，表达式的求值结果为 `int` 值 `2`。然后，该值在被用于初始化变量 `d` 之前被转换成了 `double` 类型的 `2.0` 。 多数情况下，程序员并不会故意这么做。

下面这个例子中，我们使用了字面量，将上面的`int`型操作数替换成了`double`操作数，这样一来就会进行浮点数除法：

```cpp
double d = 10.0 / 4.0; // does floating point division, initializes d with value 2.5
```


但是，如果你使用的是变量而非字面量呢？考虑下面的例子：

```cpp
int x { 10 };
int y { 4 };
double d = x / y; // does integer division, initializes d with value 2.0
```

因为执行了整型除法，所以变量 `d`的值最终为`2.0`。那么我们应该如何告诉编译器，这里需要使用浮点数除法呢？字面量后缀并不能被用在变量上。因此，需要一种能够将变量转换为浮点类型的方法，以便使用浮点数除法。

幸运的是，C++提供了许多不同的类型转换操作符(通常称为类型转换)，程序员可以使用它们请求编译器执行类型转换。因为类型转换是程序员的显式请求，所以这种形式的类型转换通常称为[[explicit-type-conversion|显式类型转换]](与隐式类型转换相反，隐式类型转换是编译器自动执行的类型转换)。


## 类型转换


C++支持 5 种类型的显示类型转换: [[C-style-casts|C风格类型转换]]、[[static-casts|静态类型转换]]、[[const-cast|const 类型转换]]、[[dynamic-casts|动态类型转换]]和[[reinterpret-casts|重新解释类型转换]]。后四种类型有时称为[[named-cast|具名名类型转换(named cast)]]。

在本课中，我们将介绍**C风格类型转换**和**静态类型转换**。


> [!info] "相关内容"
> 我们会在[18.10 -- Dynamic casting](https://www.learncpp.com/cpp-tutorial/dynamic-casting/)中介绍动态类型转换，但是我们首先要介绍一些前置内容。

通常应该避免使用**const 类型转换**和**重新解释类型转换**，因为只有很少的情况下会需要使用它们，而且使用不当是非常有害的。

> [!warning] "注意"
> 除非你有充分的理由，否则请避免使用**const 类型转换**和**重新解释类型转换**

## C语言风格的类型转换

在标准的C语言中，强制转换是通过`()`运算符完成的，括号内为需要转换的类型名。在C++中，你仍然可以在由C语言转换而来的代码中看到它们。

例如：

```cpp
#include <iostream>

int main()
{
    int x { 10 };
    int y { 4 };


    double d { (double)x / y }; // convert x to a double so we get floating point division
    std::cout << d; // prints 2.5

    return 0;
}
```


在上面的程序中，我们使用了一个C语言风格的类型转换，要求编译器将`x`转换为`double`。因为，`/`左侧的操作数被转换成了浮点数，所以操作符右侧的数同样也会被转换为浮点数（[[numeric-conversions|数值转换]]），然后表达式就会按照浮点数除法而不是整型除法求值！

C++ 允许你使用一种更加类似函数调用的语法来使用C语言风格的类型转换：

```cpp
double d { double(x) / y }; // convert x to a double so we get floating point division
```


这种方式实现的类型转换和之前一种是完全一样的，但是将需要转换的变量放在括号了，更容易看清楚被转换的对象是什么。

虽然“c风格类型转换”看起来是单一类型转换，但实际上它可以根据上下文执行各种不同的转换。这可以包括“静态类型转换”、“const类型转换”或“重新解释类型转换”(我们在上面提到的后两种类型应该避免)。因此，“C风格强制转换”有可能被无意中误用，而不会产生预期的行为，而使用c++强制转换则可以避免这种情况。


> [!info] "相关内容"
> 如果你很好奇，C语言风格的类型转换是如何工作的，可以参考[这篇文章](https://anteru.net/blog/2007/c-background-static-reinterpret-and-c-style-casts/) 。

> [!success] "最佳实践"
> 避免使用C语言风格的类型转换。

## `static_cast`

C++ 引入了一个新的强制转换运算符`static_cast`，用于将一种类型的值转换为另外一种类型。

在之前的课中，你可能已经见识过如何使用 `static_cast` 将 `char` 转换为 `int` 使得 `std::cout`可以打印整型而不是 `char`：

```cpp
#include <iostream>

int main()
{
    char c { 'a' };
    std::cout << c << ' ' << static_cast<int>(c) << '\n'; // prints a 97

    return 0;
}
```


`static_cast` 运算符将一个表达式作为输入，然后将表达式求值的结果转换为**尖括号**中指定的类型。`static_cast` 是将一种基础数据类型转换为另一种基础数据类型的最佳途径。

```cpp
#include <iostream>

int main()
{
    int x { 10 };
    int y { 4 };

    // static cast x to a double so we get floating point division
    double d { static_cast<double>(x) / y };
    std::cout << d; // prints 2.5

    return 0;
}
```


`static_cast` 最大的优势是它提供了[[runtime|运行时]]的类型检查机制，这样就不容易犯下由粗心导致的问题。 `static_cast` 的功能不如 C 语言风格的类型转换（故意的）强大，所以你不会无意间移除`const`或其他你本不希望发生的事情。


> [!success] "最佳实践"
> 在需要进行类型转换时，优先使用 `static_cast`。


## 使用 `static_cast`  进行显式地缩窄转换

当我们进行具有潜在危险的（缩窄）隐式类型转换时，编译器通常会发出告警。例如，考虑下面这段代码：

```cpp
int i { 48 };
char ch = i; // 隐式地缩窄转换
```

将`int` (2 字节或者 4 字节) 转换为`char` (1 字节)通常是不安全的（因为编译器无法判断整型值是否会超出`char`能够表示的范围），因此编译器通常会产生警告。而如果我们使用的是[[list-initialization|列表初始化]]（[[1-4-Variable-assignment-and-initialization#括号初始化|括号初始化]]），编译器则通常会产生一个编译错误。(参见：[[10-3-Numeric-conversions#括号初始化不允许隐式缩窄转换|括号初始化不允许隐式缩窄转换]])

为了避免这些问题，我们可以使用 `static_cast` 显式地将整型转换为 `char`：

```cpp
int i { 48 };

// explicit conversion from int to char, so that a char is assigned to variable ch
char ch { static_cast<char>(i) };
```

这样做时，我们显式地告诉编译器这个转换是有意的，后果自负(例如，溢出 `char` 的范围)。由于这个 `static_cast` 的输出类型为 `char`，变量 `ch` 的初始化的类型是匹配的，因此不会产生警告或错误。


下面是另一个编译器通常会抱怨将 `double` 转换为 `int` 可能会导致数据丢失的例子:

```cpp
int i { 100 };
i = i / 2.5;
```


告诉编译器上述转换是有意而为之的：


```cpp
int i { 100 };
i = static_cast<int>(i / 2.5);
```