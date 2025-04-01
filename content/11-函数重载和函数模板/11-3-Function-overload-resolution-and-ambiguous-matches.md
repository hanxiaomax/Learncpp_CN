---
title: 11.3 - 函数重载解析和不明确匹配
alias: 11.3 - 函数重载解析和不明确匹配
origin: /function-overload-resolution-and-ambiguous-matches/
origin_title: "8.11 — Function overload resolution and ambiguous matches"
time: 2022-6-16
type: translation
tags:
- overload
---

> [!note] "Key Takeaway"
> - 函数调用时匹配重载函数的过程叫做重载解析，重载解析分为**6**个步骤：
>   - 完全匹配
>   - 数值提升匹配
>   - 数值转换匹配
>   - 自定义类型转换匹配
>	- 省略号匹配
>	- 放弃并报错
> - 在每一步中，如果找到且只找到一个匹配函数，则完成匹配，否则进入下一步。如果最终匹配的结果大于 1 个或者为 0，则报错。
> - 通过数值提升进行匹配的优先级高于通过数值转换匹配的优先级
> - 将非引用类型转换为引用类型（或者反过来）也属于[[trivial-conversion|简单转换]]
> - 如果编译器在某一步找到了多个可能的匹配，则会导致**不明确匹配**。也就是说，在这一步中编译器没能找到一个比其他匹配都好的匹配。注意，在每一步中编译器都会应用所有可用的转换并进行匹配，不会找到一个匹配后就停止。
> - 解决不明确匹配的方法是：
>   - 定义一个能够参数完全匹配的新函数
>   - 强制类型转换
>   - 字面量添加后缀

在上节课([[11-2-Function-overload-differentiation|8.10 - 函数重载和区分]])中我们介绍了函数中可以被用来对重载函数进行区分的属性。如果一个重载函数不能和其他重载函数被区分开来，那么就会产生编译错误。

不过，拥有一组能够被区分的重载函数只是解决了一半的问题。当调用任何函数时，编译器还必须确保找到匹配的函数声明。

对于非重载函数(具有惟一名称的函数)，只有一个函数可能与函数调用匹配。该函数要么匹配(或者可以在应用类型转换后匹配)，要么不匹配(结果是编译错误)。对于重载函数，可以有许多函数可能与函数调用匹配。由于函数调用只能解析到其中一个函数，因此编译器必须确定哪个重载函数是最佳匹配的。将函数调用匹配到特定重载函数的过程称为[[overload-resolution|重载解析]]。

在函数**实参类型**和函数**形参类型**完全匹配的简单情况下，重载函数的匹配(通常)是很简单的:

```cpp
#include <iostream>

void print(int x)
{
     std::cout << x;
}

void print(double d)
{
     std::cout << d;
}

int main()
{
     print(5); // 5 is an int, so this matches print(int)
     print(6.7); // 6.7 is a double, so this matches print(double)

     return 0;
}
```

但是，如果函数调用中的参数类型与重载函数中的参数类型**不完全匹配**，会发生什么呢？例如:

```cpp
#include <iostream>

void print(int x)
{
     std::cout << x;
}

void print(double d)
{
     std::cout << d;
}

int main()
{
     print('a'); // char does not match int or double
     print(5L); // long does not match int or double

     return 0;
}
```

没有完全匹配的函数，不等于没有能够匹配的函数——毕竟，`char` 或者 `long` 可以通过[[implicit-type-conversion|隐式类型转换]]转换为 `int` 或者 `double`。但是，在不同情况下如何选择**最佳**匹配呢？

在本节课中，我们会探索编译器是如何在函数调用时匹配的重载函数的。

## 解析重载函数调用

当对重载函数进行调用时，编译器通过一系列规则和步骤确定重载函数的最佳匹配(如果有的话)。

在每个步骤中，编译器对函数调用中的实参应用一系列不同的类型转换。对于应用的每个转换，编译器检查重载的函数现在是否匹配。在应用了所有不同的类型转换并检查了匹配之后，这一步就完成了。结果将是以下三种可能的结果之一：

- 未找到匹配的函数。编译器进入下一个步骤。
- 找到单个匹配函数。该函数被认为是最佳匹配。匹配过程现在已经完成，后续步骤不再执行。
- 发现多个匹配函数。编译器将发出一个**不明确匹配**的编译错误。我们稍后将进一步讨论这种情况。

如果编译器执行完一系列步骤后，仍然没有找到匹配的函数，它将生成一个编译错误，即无法为函数调用找到匹配的重载函数。

## 参数匹配顺序

第一步：编译器首先尝试对重载函数进行**完全匹配**。这个过程分为两个阶段。首先，编译器会查找是否存在一个重载函数，其调用时的实参完全匹配重载函数的形参，例如：

```cpp
void print(int)
{
}

void print(double)
{
}

int main()
{
    print(0); // exact match with print(int)
    print(3.4); // exact match with print(double)

    return 0;
}
```

因为 `print(0)` 中的 `0` 是一个整型，所以编译器会查找是否存在 `print(int)` 重载函数。因为的确存在，所以编译器可以确定该重载函数为被调用函数的精确匹配。

其次，编译器会对函数调用时的实参进行一系列的[[trivial-conversion]]。这些简单的转换会通过修改类型（不修改值）的方式查找可能的匹配。例如，非 const 类型可能会被转换为 const 类型：

```cpp
void print(const int)
{
}

void print(double)
{
}

int main()
{
    int x { 0 };
    print(x); // x trivially converted to const int

    return 0;
}
```

在上面的例子中，我们调用 `print(x)` 时， `x` 是一个 `int`。编译器会将其从 `int` 转换为 `const int`，这样就可以匹配到 `print(const int)`。

> [!info] "扩展阅读"
> 将非引用类型转换为引用类型（或者反过来）也属于[[[[trivial conversion|简单转换]]。
> 通过[[trivial-conversion|简单转换]]匹配到的重载函数，也属于**完全匹配**。

第二步：如果没有找到完全匹配的重载函数，编译器会尝试对实参进行[[numeric promotions|数值提升]]，在[[10-1-Implicit-type-conversion-coercion|8.1 - 隐式类型转换]]中我介绍过，宽度较窄的整型和浮点型数值是如何被自动提升为较宽的类型的，例如 `int` 或 `double`。如果数值提升之后能够找到匹配的函数，则完成函数调用解析。

例如：
```cpp
void print(int)
{
}

void print(double)
{
}

int main()
{
    print('a'); // promoted to match print(int)
    print(true); // promoted to match print(int)
    print(4.5f); // promoted to match print(double)

    return 0;
}
```

对于 `print('a')` 来说，编译器在第一步中不能找到能够**完全匹配**它的重载函数 `print(char)`，所以编译器会将字符 `'a'` 提升为一个整型并再次查进行匹配。此时，可以匹配到 `print(int)`，所以函数调用解析为 `print(int)`。

第三步：如果通过数值提升仍不能找到匹配的函数，编译器会对函数实参进行[[numeric-conversions|数值转换]]（参见：[[10-3-Numeric-conversions|8.3 - 数值转换]]）后，再次进行匹配。

例如：
```cpp
#include <string> // for std::string

void print(double)
{
}

void print(std::string)
{
}

int main()
{
    print('a'); // 'a' converted to match print(double)

    return 0;
}
```

在这个例子中，因为不存在 `print(char)`(完全匹配)，也不存在 `print(int)` (提升匹配)，所以 `'a'` 会被数值转换为 `double` 类型并匹配 `print(double)`。

> [!tldr] "关键信息"
> 通过数值提升进行匹配的优先级高于通过数值转换匹配的优先级。

第四步：如果通过数值转换仍然没能找到匹配的函数，编译器会尝试使用用户自定义的转换。虽然我们还没有介绍什么是用户自定义转换，其实它就是一组用户定义的类型之间的隐式转换，例如：

```cpp
// 我们还没讲到类，所以看不懂也不用担心
class X // 定义了一个新类型 X
{
public:
    operator int() { return 0; } // 用户自定义的将 X 转换为 int 的规则
};

void print(int)
{
}

void print(double)
{
}

int main()
{
    X x; // 创建 X 类型的变量 x
    print(x); // x 通过用户自定义转换从 X 转换为 int

    return 0;
}
```

在这个例子中，编译器首先会检查是否能够完全匹配 `print(X)`。由于没有找到，编译器会对 `x` 进行数值提升，但是这一步无法完成，然后编译器会尝试对 `x` 进行数值转换，同样不能完成。最后，编译器会查找是否存在用户定义的转换，因为我们定义了 `X` 类型转换为 `int` 类型的规则，所以编译器会使用该规则将 `X` 转换为 `int`，并匹配 `print(int)`。

在进行用户自定义转换后，编译器还可能尝试额外的隐式提升或转换来查找匹配，所以如果我们定义的转换规则是将 `X` 转换为 `char`而不是`int`，编译器会继续对`char`进行数值提升使其提升为`int`。

> [!info] "相关内容"
> 我们会在[[21-11-Overloading-typecasts|14.11 - 重载类型转换操作符]]中介绍如何通过重载类型转换操作符来创建用户自定义转换。

> [!info] "扩展阅读"
> 类的[[constructor|构造函数(constructor)]]同样具有自定义转换的功能，在也可以被用在第四步。
    

第五步：如果通过用户自定义转换后仍然没有找到匹配的重载函数，编译器会尝试匹配使用了省略号的函数。

> [!info] "相关内容"
> 省略号的使用会在[[20-5-Ellipsis-and-why-to-avoid-them|12.6 - 省略号以及为什么要避免使用它]]中介绍。

第六步： 如果到此还没有找到匹配的函数，编译器会放弃继续查找并产生一个没有找到匹配函数的编译错误。

## 不明确匹配

在没有重载函数的情况下，一个函数调用要么解析为一个函数，要么因为找不到而产生编译报错：

```cpp
void foo()
{
}

int main()
{
     foo(); // okay: match found
     goo(); // compile error: no match found

     return 0;
}
```

而在存在重载函数的情况下，还有第三种可能：[[ambiguous-match|不明确匹配(ambiguous match)]] 。当编译器在一个步骤中找到两个或两个以上匹配的重载函数时，编译器会停止匹配并报告找到不明确匹配函数调用。

为了能够进行编译，编译器必须区分每个重载函数，那么，什么情况下会出现多个匹配的情况呢？请看下面这个例子：

```cpp
void print(int x)
{
}

void print(double d)
{
}

int main()
{
    print(5L); // 5L is type long

    return 0;
}
```

[[literals|字面量]] `5L` 是 `long` 型的，所以编译器首先会查找是否存在完全匹配的 `print(long)`，可惜没能找到。接下来，编译器会尝试数值提升，但是`long`已经不能提升了，所以仍然没有找到匹配的函数。

接下来，编译器会对 `long` 类型的实参进行数值转换。在这个过程中，它会尝试所有的数值转换规则，此时编译器会找到两个可以能的匹配。如果 `long` 实参通过数值转换转换成了 `int`，那么可以匹配 `print(int)`。如果 `long` 实参转换成了 `double`，则可以匹配 `print(double)`。因为找到了两种可能的匹配，所以该函数调用被认为是不明确的。

在 Visual Studio 2019 上会产生如下报错信息：

```bash
error C2668: 'print': ambiguous call to overloaded function
message : could be 'void print(double)'
message : or       'void print(int)'
message : while trying to match the argument list '(long)'
```

> [!tldr] "关键信息"
> 如果编译器在某一步找到了多个可能的匹配，则会导致不明确匹配。也就是说，在这一步中编译器没能找到一个比其他匹配都好的匹配。

再来看这个例子：

```cpp
void print(unsigned int x)
{
}
void print(float y)
{
}

int main()
{
    print(0); // int 可以被数值转换为 unsigned int 或 float
    print(3.14159); // double 可以被数值转换为 unsigned int 或 float

    return 0;
}
```


也许你会认为 `0` 会被解析为`unsigned int`进而匹配 `print(unsigned int)`。同时  `3.14159` 解析为`float`进而匹配 `print(float)`。其实它们都会产生不明确匹配。`int` 值 `0` 可以通过数值转换被转换为 `unsigned int` 或者 `float`，所以两个函数它都能匹配，这势必将导致不明确匹配产生。

对于`double` 类型也一样，它可以被转换为 `float` 或者 `unsigned int`。不论如何转换，都属于数值转换，也都能匹配两个函数，所以是不明确匹配。

## 处理不明确匹配

因为不明确匹配是编译时错误，所以在程序编译之前，需要消除歧义。有几种方法可以解决该问题：

1.  通常，最好的方法是简单地定义一个新的重载函数，该函数的形参与您试图调用该函数时使用的形参类型完全相同。然后C++就能找到与函数调用完全匹配的对象。
2.  或者，[[explicit-type-conversion|显式类型转换]]转换不明确的参数，以匹配要调用的函数的类型。例如，要在上面的例子中使 `print(0)` 匹配 `print(unsigned int)` ，你可以这样做:
	```cpp
	int x{ 0 };
	print(static_cast<unsigned int>(x)); // will call print(unsigned int)
	```
1.  如果参数是字面量，你可以为它添加字面量后缀，使其能够被解析为正确的类型：

	```cpp
	print(0u); // will call print(unsigned int) since 'u' suffix is unsigned int, so this is now an exact match
	```


常用的后缀参见：[[5-2-Literals#字面量后缀]]

## 多参数重载函数的匹配

如果有多个参数，编译器会依次对每个参数应用匹配规则。最终匹配的函数的要求是：每个参数都匹配且至少有一个参数比所有其他函数匹配得更好。换句话说，所选函数必须对至少一个参数提供比所有其他候选函数更好的匹配，而对所有其他参数不差。

在找到这样一个函数的情况下，它显然是最好的选择。如果找不到这样的函数，则该调用将被视为二义性(或不匹配)。

例如：

```cpp
#include <iostream>

void print(char c, int x)
{
    std::cout << 'a';
}

void print(char c, double x)
{
    std::cout << 'b';
}

void print(char c, float x)
{
    std::cout << 'c';
}

int main()
{
    print('x', 'a');
}
```

在上面的例子中，所有函数的第一个参数都能够**完全匹配**。第一个函数通过[[numeric promotions|数值提升]]可以匹配第二个参数，其他几个函数则需要进行类型转换才能匹配。因此`print(char, int)` 毋庸置疑是最佳匹配函数。
