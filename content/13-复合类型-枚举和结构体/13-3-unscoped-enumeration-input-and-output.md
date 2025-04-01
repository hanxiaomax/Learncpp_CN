---
title: 13.3 - 限定作用域枚举类型的输入输出
aliases:
  - 13.3 - 限定作用域枚举类型的输入输出
origin: /unscoped-enumeration-input-and-output/
origin_title: 10.3 — Unscoped enumeration input and output
time: 2022-8-25
type: translation
tags:
  - enum
  - unscoped
  - enumerations
  - split
---
> [!NOTE] Split：此文章内容会被分拆至以下文章：
> - [[13-4-converting-an-enumeration-to-and-from-a-string|13-4-converting-an-enumeration-to-and-from-a-string]]
> - [[13-5-introduction-to-overloading-the-i-o-operators|13-5-introduction-to-overloading-the-i-o-operators]]

> [!note] "Key Takeaway"
> 
在上节课中([[13-2-unscoped-enumerations|13.2 - 无作用域枚举类型]])我们提到，枚举是一种[[symbolic-constants|符号常量]]。但是我们没说的是，枚举实际上是一个整型符号常量。因此，枚举类型中保存的其实是一个整型值。

在这一点上，枚举类型类似于字符 ([[4-11-Chars|4.11 - 字符]])。考虑下面代码：

```cpp
char ch { 'A' };
```

`char` 实际上就是一个1个字节的整型数，字符 `A` 会被转换为整型数（转换为65）并储存。

当我们定义枚举的时候，每个枚举值会根据其所在位置被自动赋值一个整型值。默认情况下，第一个枚举值会被赋值为0，后面的枚举值以此类推，每个都比前一个值大一：

```cpp
#include <iostream>

enum Color
{
    black, // assigned 0
    red, // assigned 1
    blue, // assigned 2
    green, // assigned 3
    white, // assigned 4
    cyan, // assigned 5
    yellow, // assigned 6
    magenta, // assigned 7
};

int main()
{
    Color shirt{ blue }; // This actually stores the integral value 2

    return 0;
}
```

我们也可以显式地定义枚举数的值，而且这些整数值可以是整数或负数，并且可以与其他枚举值共享相同的值。任何未定义的枚举数都被赋予一个比前一个枚举数大1的值。

```cpp
enum Animal
{
    cat = -3,
    dog,         // assigned -2
    pig,         // assigned -1
    horse = 5,
    giraffe = 5, // shares same value as horse
    chicken,      // assigned 6
};
```

注意，在这个例子中，`horse` 和 `giraffe` 具有相同的值，在这种情况下，这些枚举值是无区别的—— `horse` 和 `giraffe` 是可以互换的。尽管C++允许你这么做，但是我们应该尽量避免将一个枚举类型中的两个枚举值赋值为相同的数。

> [!success] "最佳实践"
> 避免给枚举值显式赋值，除非有令人信服的理由这样做。

## 无作用域枚举类型会被隐式地转换为整型值

考虑下面的程序：

```cpp
#include <iostream>

enum Color
{
    black, // assigned 0
    red, // assigned 1
    blue, // assigned 2
    green, // assigned 3
    white, // assigned 4
    cyan, // assigned 5
    yellow, // assigned 6
    magenta, // assigned 7
};

int main()
{
    Color shirt{ blue };

    std::cout << "Your shirt is " << shirt; // what does this do?

    return 0;
}
```

因为枚举类型保存的是整型值，所以如你所期待的那样，上面的程序打印：

```
Your shirt is 2
```

当枚举类型用于函数调用或与运算符一起使用时，编译器将首先尝试查找与枚举类型匹配的函数或运算符。例如，当编译器试图编译`std::cout << shirt` 时，编译器首先会查看 `operator<<` 是否知道如何将`Color` 类型的对象(因为 `shirt` 的类型是`Color` )打印到 `std::cout` 。它不知道。

如果编译器无法找到匹配的运算符，则它会将[[unscoped-enumerations|无作用域枚举类型]]隐式地转换为对应的整型。因为 `std::cout` 知道如何打印一个整型，所以 `shirt` 会被转换为整型并打印出2。

## 打印枚举值的名字

大多数情况下，将枚举转换为整型打印出来并不是我们想要的结果。我们肯定是希望能够将枚举值的本名打印出来 (例如 `blue`)。但是，为了实现这一点我们需要一些方法将枚举在转换为字符串并打印出来(`"blue"`)。

截至C++ 20, C++还没有提供任何简单的方法来实现这一点，所以我们必须自己寻找解决方案。幸运的是，这并不难。实现这一点的典型方法是编写一个函数，该函数接受枚举类型作为参数，然后输出相应的字符串(或将字符串返回给调用者)。

典型的方法是判断当前需要打印的是哪个的枚举值：

```cpp
// Using if-else for this is inefficient
void printColor(Color color)
{
    if (color == black) std::cout << "black";
    else if (color == red) std::cout << "red";
    else if (color == blue) std::cout << "blue";
    else std::cout << "???";
}
```

但是，为此使用一系列if-else语句是低效的，因为它需要多次比较才能找到匹配。完成同样任务的一种更有效的方法是使用`switch`语句。在下面的例子中，我们还将以`std::string` 的形式返回`Color` ，以给调用者更多的灵活性来对名称做任何想做的事情(包括打印它):

```cpp
#include <iostream>
#include <string>

enum Color
{
    black,
    red,
    blue,
};


// We'll show a better version of this for C++17 below
std::string getColor(Color color)
{
    switch (color)
    {
    case black: return "black";
    case red:   return "red";
    case blue:  return "blue";
    default:    return "???";
    }
}

int main()
{
    Color shirt { blue };

    std::cout << "Your shirt is " << getColor(shirt) << '\n';

    return 0;
}
```

输出结果：

```
Your shirt is blue
```

这么做比使用多个if-else判断更高效（因为switch语句比if更高效），而且可读性也更好。但是，这个版本的代码也不是很高效，因为每次调用函数时，都必须创建并返回一个 `std::string` (开销很大)。

在 C++17 中，更高效的做法是将 `std::string` 替换为 `std::string_view`。 `std::string_view` 会以某种拷贝开销更小的方式返回一个字符串字面量。

```cpp
#include <iostream>
#include <string_view> // C++17

enum Color
{
    black,
    red,
    blue,
};

constexpr std::string_view getColor(Color color) // C++17
{
    switch (color)
    {
    case black: return "black";
    case red:   return "red";
    case blue:  return "blue";
    default:    return "???";
    }
}

int main()
{
    Color shirt{ blue };

    std::cout << "Your shirt is " << getColor(shirt) << '\n';

    return 0;
}
```



> [!info] "相关内容"
> Constexpr 返回类型在[[F-1-Constexpr-and-consteval-functions|F.1 - Constexpr 和 consteval 函数]]中介绍。

## 让 `operator<<` 知道如何打印枚举值

尽管上面的例子可以正常工作，但是我们必须要能够记住哪个函数是用来获取枚举值名字的。尽管多数情况下这也并不麻烦，但是如果枚举类型很多的时候，还是很可能会带来问题。使用运算符重载，我们可以教会运算符 `operator<<` 如何打印程序定义枚举类型！由于我们还没有介绍如何做到这一点，所以你可以先将下面的代码当做一种魔法：

```cpp
#include <iostream>

enum Color
{
	black,
	red,
	blue,
};

// Teach operator<< how to print a Color
// Consider this magic for now since we haven't explained any of the concepts it uses yet
// std::ostream is the type of std::cout
// The return type and parameter type are references (to prevent copies from being made)!
std::ostream& operator<<(std::ostream& out, Color color)
{
	switch (color)
	{
	case black: out << "black";  break;
	case red:   out << "red";    break;
	case blue:  out << "blue";   break;
	default:    out << "???";    break;
	}

	return out;
}

int main()
{
	Color shirt{ blue };
	std::cout << "Your shirt is " << shirt; // it works!

	return 0;
}
```

输出结果：

```
Your shirt is blue
```

> [!info] "扩展阅读"
> 如果你好奇的话，这里简单介绍一下上面代码的工作原理。当我们尝试通过`std::cout` 和 `operator<<` 打印 `shirt` 时，编译器发现被重载的 `operator<<` 可以配合 `Color` 类型的对象工作。于是重载的 `operator<<` 被调用，参数`out`是 `std::cout`，参数`color`则是 `shirt`。因为`out`是`std::cout`的引用，所以 `out << "blue"` 就是将 `"blue"` 送到 `std::cout`打印。

我们会在 [[21-4-overloading-the-IO-operators|21.4 - 重载输入输出运算符]] 中介绍IO运算符的重载。目前你可以先拷贝这份代码并用于你自己的枚举类型。


## 枚举的大小和基类型

枚举类型被认为是整数类型家族的一部分，由编译器决定为枚举变量分配多少内存。C++标准规定，枚举的大小需要大到足以表示所有枚举值。大多数情况下，它将使枚举变量的大小与标准的`int` 相同。

但是，可以指定不同的基础类型。例如，==如果你在开发某个带宽敏感的程序(例如通过网络发送数据)，那么此时你可能需要指定一个更小的类型：==

```cpp
// Use an 8-bit unsigned integer as the enum base
enum Color : std::uint8_t
{
    black,
    red,
    blue,
};
```

由于枚举数通常不用于算术或与整数比较，如果需要，使用无符号整数通常是安全的。

> [!success] "最佳实践"
> 仅在必要时指定枚举的基类型

## 整型转换为无作用域枚举

==虽然编译器可以隐式地将[[unscoped-enumerations|无作用域枚举类型]]转换为整数，但它将不能隐式地将整数转换为无作用域枚举类型。以下操作将产生编译错误：==

```cpp
#include <iostream>

enum Pet
{
    cat, // assigned 0
    dog, // assigned 1
    pig, // assigned 2
    whale, // assigned 3
};

int main()
{
    Pet pet { 2 }; // compile error: integer value 2 won't implicitly convert to a Pet
    pet = 3;       // compile error: integer value 3 won't implicitly convert to a Pet

    return 0;
}
```

有两种方法可以解决这个问题。

首先，可以使用 `static_cast`  强制编译器将一个整数转换为无作用域枚举数：

```cpp
#include <iostream>

enum Pet
{
    cat, // assigned 0
    dog, // assigned 1
    pig, // assigned 2
    whale, // assigned 3
};

int main()
{
    Pet pet { static_cast<Pet>(2) }; // convert integer 2 to a Pet
    pet = static_cast<Pet>(3);       // our pig evolved into a whale!

    return 0;
}
```

稍后我们会举一个使用该方法的例子。

此外，在 C++17 中，==如果一个无作用域枚举有一个基类型，则编译器允许你使用整型初始化（非赋值）该枚举值。==

```cpp
#include <iostream>

enum Pet: int // we've specified a base
{
    cat, // assigned 0
    dog, // assigned 1
    pig, // assigned 2
    whale, // assigned 3
};

int main()
{
    Pet pet { 2 }; // ok: can initialize with integer
    pet = 3;       // compile error: can not assign with integer

    return 0;
}
```


## 无作用域枚举值的输入

由于 `Pet` 是一个程序定义类型，所以C++并不知道如何从`std::cin`输入一个 `Pet`：

```cpp
#include <iostream>

enum Pet
{
    cat, // assigned 0
    dog, // assigned 1
    pig, // assigned 2
    whale, // assigned 3
};

int main()
{
    Pet pet { pig };
    std::cin >> pet; // compile error, std::cin doesn't know how to input a Pet

    return 0;
}
```

为了解决这个问题，我们可以先读入一个整型数，然后使用 `static_cast` 将其[[static-casts|静态类型转换]]为合适的枚举类型：

```cpp
#include <iostream>

enum Pet
{
    cat, // assigned 0
    dog, // assigned 1
    pig, // assigned 2
    whale, // assigned 3
};

int main()
{
    std::cout << "Enter a pet (0=cat, 1=dog, 2=pig, 3=whale): ";

    int input{};
    std::cin >> input; // input an integer

    Pet pet{ static_cast<Pet>(input) }; // static_cast our integer to a Pet

    return 0;
}
```

> [!info] "扩展阅读"
> 类似于重载 `operator<<` 使其能够输出枚举类型，我们也可以重载 `operator>>` 使其指定如何输入一个枚举类型：
>
> ```cpp
> #include <iostream>
> 
> enum Pet
> {
>     cat, // assigned 0
>     dog, // assigned 1
>     pig, // assigned 2
>     whale, // assigned 3
> };
> 
> // Consider this magic for now
> // We pass pet by reference so we can have the function modify its value
> std::istream& operator>> (std::istream& in, Pet &pet)
> {
>     int input{};
>     in >> input; // input an integer
> 
>     pet = static_cast<Pet>(input);
>     return in;
> }
> 
> int main()
> {
>     std::cout << "Enter a pet (0=cat, 1=dog, 2=pig, 3=whale): ";
> 
>     Pet pet{};
>     std::cin >> pet; // input our pet using std::cin
> 
>     std::cout << pet << '\n'; // prove that it worked
> 
>     return 0;
> }
> ```
> 同样地，你可以先使用这段神奇的代码(因为我们还没有解释它背后的概念)，在后面的课程中我们会介绍它的原理。