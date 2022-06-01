---
title: 4.14 - 字面量常量
alias: 4.14 - 字面量常量
origin: /literals/
origin_title: "4.14 — Literal constants"
time: 2022-5-7
type: translation
tags:
- literal
- constants
---

??? note "关键点速记"

	- 常量有两种，字面量常量（简称字面量）和符号常量
	- 字面量的类型具有默认值，可以通过后缀修改
		- 小数字面量的默认类型为double而不是float
		- C风格的字符串，默认类型为字符数组
	- `std::string`和`std::string_view`类型的字面量可以通过`s`和`sv`后缀指定，在类型推断时比较有用，其他情况一般不需要
	- 声明浮点数字面量的方法有两种：`3.14159`或`1.9e10`
	- C++14才支持了使用`0b`创建二进制字面量，同时可以用单引号作为位的分隔符，但是分隔符不能放在第一位前面
	- 使用`std::dec`、`std::oct` 和 `std::hex`可以轻松打印十进制、八进制和十六进制。但不能直接打印二进制。
		- `std::cout << std::hex << x << '\n'; // hexadecimal`
	- 使用 `std::bitset`，我们可以定义一个 `std::bitset` 变量，并且告诉 `std::bitset` 有多少位需要存储。需要包含`<bitset>`头文件

在编程中，常量（constant）指的是不会改变的值。C++支持两种常量：字面量常量和符号常量。本节课我们会介绍字面量常量，然后下节课 [[4-15-Symbolic-constants-const-and-constexpr-variables|4.15 - 符号常量 const 和 constexpr 变量]]中会介绍符号常量。

字面量常量（通常称为[[literals|字面量]]） 指的是直接嵌入到代码中的未命名的值，例如：

```cpp
return 5; // 5 是一个整型字面量
bool myNameIsAlex { true }; // true 是一个布尔字面量
std::cout << 3.4; // 3.4 是一个 double 字面量
```


它们的值都是常量，因为你不能动态地改变它们的值（改变后必须重新编译才能生效）。

和其他对象诶新一样，所有的字面量也有其类型。字面量的类型由其值和字面量本身的格式推定。

默认情况下：

|字面量值|例子	|默认类型|
|----|----|----|
|integral value|	5, 0, -3	|int
|boolean value	|true, false|	bool
|floating point value	|3.4, -2.2	|double (不是 float)!
|char value	|‘a’	|char
|C-style string	|“Hello, world!”	|const char[14]


## 字面量后缀

如果默认类型不是你想要的，可以通过字面量的后缀改变其类型：

|数据类型	|后缀	|含义|
|----|----|----|
|int	|u or U	|unsigned int|
|int	|l or L	|long|
|int	|ul, uL, Ul, UL, lu, lU, Lu, or LU	|unsigned long|
|int	|ll or LL	|long long|
|int	|ull, uLL, Ull, ULL, llu, llU, LLu, or LLU	|unsigned long long|
|double	|f or F	|float|
|double	|l or L	|long double|


通常情况下，你不需要为整型指定后缀，但是如果要做的话，可以参考下面例子：

```cpp
std::cout << 5; // 5 (无后缀) 类型为 int (默认)
std::cout << 5u; // 5u 类型为 unsigned int
std::cout << 5L; // 5L 类型为 long
```


默认情况下，浮点数字面量的类型为 double，如果希望使用 float 类型，则需要指定 `f`或`F`后缀：

```cpp
std::cout << 5.0; // 5.0 (no suffix) is type double (by default)
std::cout << 5.0f; // 5.0f is type float
```


新程序员通常会奇怪为什么下面的代码会导致编译告警：

```cpp
float f { 4.1 }; // warning: 4.1 是 double 类型的字面量而不是 float 类型
```


因为，4.1 没有后缀所以是 double 类型的字面量，而不是 float 类型。当C++定义字面量的类型时，它不在乎该字面量的用途（例如，在这个例子中是用于初始化一个 float 变量）。因此，4.1 必须被转换为 double 类型才可以被赋值给变量 `f`，而这么做是会导致精度丢失的。

在C++中，只要字面量的意思是清晰的，那么你可以放心使用。例如大多数情况下会使用字面量进行初始化或赋值、数学运算或直接打印到屏幕上。


## 字符串字面量

在 [[4-11-Chars|4.11 - 字符]] 中我们将字符串定义为一个字符序列的集合。在 C++ 中也支持字符串字面量：

```cpp
std::cout << "Hello, world!"; // "Hello, world!" is a C-style string literal
std::cout << "Hello," " world!"; // C++ 会链接字符串字面量
```

出于某些历史原因，C++ 处理字符串的方式有些特别。目前来讲，你可以使用字符串字面量来作为打印文本或用于初始化 `std::string`。

!!! info "扩展阅读"

	C++ 同样也支持 std::string 和 std::string_view 字面量。虽然在很多时候并不需要使用它们，但是在使用类型推断的时候，它们还是挺有用的。类型推断可以发生在使用 `auto`关键字（[[8-7-Type-deduction-for-objects-using-the auto-keyword|8.7 - 使用 auto 关键字进行类型推断]]）或是在类模板参数推断时。

	```cpp
	#include <iostream>
	#include <string>      // for std::string
	#include <string_view> // for std::string_view
	
	int main()
	{
	    using namespace std::literals; // easiest way to access the s and sv suffixes
	
	    std::cout << "foo\n";   // no suffix is a C-style string literal
	    std::cout << "goo\n"s;  // s 后缀表示 std::string 字面量
	    std::cout << "moo\n"sv; // sv 后缀表示 a std::string_view 字面量
	
	    return 0;
	};
	```

	此处使用`using`来引入整个命名空间是一个被允许的特例。

我们会在后续的课程中深入讨论字符串字面量。

## 浮点数字面量的科学计数法表示

声明浮点数字面量的方法有两种：

```cpp
double pi { 3.14159 }; // 3.14159 是 double 类型字面量
double avogadro { 6.02e23 }; // 6.02 x 10^23 是 double 类型，科学计数法表示
```

对于科学计数法来讲，指数部分也可以是负值：

```cpp
double electron { 1.6e-19 }; // charge on an electron is 1.6 x 10^-19
```


## 8进制和16进制字面量

在日常生活中，我们习惯了数字可以有 0, 1, 2, 3, 4, 5, 6, 7, 8, 或 9。十进制也称为“base 10”，因为它可以有10种不同的数字(0 到 9)。在这个系统里，我们会按照 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, … 的方式来计数，而在 C++ 中，数字也是默认十进制表示法。

```cpp
int x { 12 }; // 12 is assumed to be a decimal number
```


对于二进制来说，数字只有 0 和 1 两种可能，所以才叫做 2 （“base 2”）。二进制计数时通常是这样的：0, 1, 10, 11, 100, 101, 110, 111, …

当然，计算机有时候也使用其他的进制，例如八进制和十六进制。

八进制的数字有8种可能: 0, 1, 2, 3, 4, 5, 6, 和 7。计数方式类似于 0, 1, 2, 3, 4, 5, 6, 7, 10, 11, 12, … （注意，没有8和9，所以我们从7跳到了10（一零））

|十进制 |0 |1 |2 |3 |4 |5 |6 |7 |8 |9 |10 |11|
|---|---|---|---|---|---|---|---|---|---|---|---|
|八进制 |0 |1 |2 |3 |4 |5 |6 |7 |10 |11 |12 |13|


如需使用八进制，则需要在数字前加一个`0`（零）作为前缀。

```cpp
#include <iostream>

int main()
{
    int x{ 012 }; // 0 before the number means this is octal
    std::cout << x;
    return 0;
}
```

打印结果为：

```
10
```

为什么打印的是 10 而不是 12？因为打印时使用的是十进制，而八进制的12等于10进制的10。

八进制很难用，我建议你避免使用它。

十六进制有16个数：0, 1, 2, 3, 4, 5, 6, 7, 8, 9, A, B, C, D, E, F, 10, 11, 12, …


|十进制 |0 |1 |2 |3 |4 |5 |6 |7 |8 |9 |10 |11 |12 |13 |14 |15 |16 |17|
|---|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|
|十六进制 |0 |1 |2 |3 |4 |5 |6 |7 |8 |9 |A |B |C |D |E |F |10 |11|

如需使用十六进制，则需要在数字前加一个`0x`（零x）作为前缀。

```cpp
#include <iostream>

int main()
{
    int x{ 0xF }; // 0x before the number means this is hexadecimal
    std::cout << x;
    return 0;
}
```

打印结果为：

```
15
```

因为16进制中每一位数字都有16种可能，所以一个十六进制的数刚好占用了4个位。因此，一对十六进制数刚好可以表示一个字节（8个位） 。

一个32位的整型表示成二进制是这个样子的：0011 1010 0111 1111 1001 1000 0010 0110。这个二进制数非常长而且都是重复的数字，读起来就很困难。而如果写成十六进制，则变成了：3A7F 9826。这也使得十六进制数成为了一种非常适合精简地表示内存中值的方式。因此，我们通常都会使用十六进制数来表示内存地址或内存中的原始数据。

在 C++14之前，是没有办法直接赋值二进制字面量的，不过我们可以利用十六进制值来曲线救国：

```cpp
#include <iostream>

int main()
{
    int bin{};    // assume 16-bit ints
    bin = 0x0001; // assign binary 0000 0000 0000 0001 to the variable
    bin = 0x0002; // assign binary 0000 0000 0000 0010 to the variable
    bin = 0x0004; // assign binary 0000 0000 0000 0100 to the variable
    bin = 0x0008; // assign binary 0000 0000 0000 1000 to the variable
    bin = 0x0010; // assign binary 0000 0000 0001 0000 to the variable
    bin = 0x0020; // assign binary 0000 0000 0010 0000 to the variable
    bin = 0x0040; // assign binary 0000 0000 0100 0000 to the variable
    bin = 0x0080; // assign binary 0000 0000 1000 0000 to the variable
    bin = 0x00FF; // assign binary 0000 0000 1111 1111 to the variable
    bin = 0x00B3; // assign binary 0000 0000 1011 0011 to the variable
    bin = 0xF770; // assign binary 1111 0111 0111 0000 to the variable

    return 0;
}
```


## C++14 中的二进制字面量和分隔符

在 C++14 中，可以使用`0b`前缀来创建二进制字面量：

```cpp
#include <iostream>

int main()
{
    int bin{};        // assume 16-bit ints
    bin = 0b1;        // assign binary 0000 0000 0000 0001 to the variable
    bin = 0b11;       // assign binary 0000 0000 0000 0011 to the variable
    bin = 0b1010;     // assign binary 0000 0000 0000 1010 to the variable
    bin = 0b11110000; // assign binary 0000 0000 1111 0000 to the variable

    return 0;
}
```


因为二进制字面量一旦长了就很难阅读，C++14引入了单引号`'`作为分隔符。 

```cpp
#include <iostream>

int main()
{
    int bin { 0b1011'0010 };  // assign binary 1011 0010 to the variable
    long value { 2'132'673'462 }; // much easier to read than 2132673462

    return 0;
}
```

如果你的编译器不支持 C++14，那么你使用上述表示法的时候将会报错。

此外，请注意分隔符不能放在第一位前面：

```cpp
int bin { 0b'1011'0010 };  // error: ' used before first digit of value
```


## 十进制、八进制、十六进制和二进制数的打印

默认情况下，C++ 会按照十进制来打印数值。不过你可以告诉它打印其他格式。使用`std::dec`、`std::oct` 和 `std::hex`可以轻松打印十进制、八进制和十六进制。

```cpp
#include <iostream>

int main()
{
    int x { 12 };
    std::cout << x << '\n'; // decimal (by default)
    std::cout << std::hex << x << '\n'; // hexadecimal
    std::cout << x << '\n'; // now hexadecimal
    std::cout << std::oct << x << '\n'; // octal
    std::cout << std::dec << x << '\n'; // return to decimal
    std::cout << x << '\n'; // decimal

    return 0;
}
```

打印结果为：

```
12
c
c
14
12
12
```

打印二进制有点复杂，因为 `std::cout` 本身并不支持打印二进制。幸好，C++标准库里面有一个叫做 `std::bitset` 的类型可以为我所用 (需要 `<bitset>` 头文件)。 使用 `std::bitset`，我们可以定义一个 `std::bitset` 变量，并且告诉 `std::bitset` 有多少位需要存储。这个位数必须是一个编译时常量。`std::bitset` 可以通过一个无符号字面量来初始化（任何格式都可以，十进制、八进制、十六进制或者二进制）。

```cpp
#include <bitset> // for std::bitset
#include <iostream>

int main()
{
	// std::bitset<8> 表示要存储8个位
	std::bitset<8> bin1{ 0b1100'0101 }; // binary literal for binary 1100 0101
	std::bitset<8> bin2{ 0xC5 }; // hexadecimal literal for binary 1100 0101

	std::cout << bin1 << ' ' << bin2 << '\n';
	std::cout << std::bitset<4>{ 0b1010 } << '\n'; // create a temporary std::bitset and print it

	return 0;
}
```

打印结果：

```
11000101 11000101
1010
```

上面代码中的这一行：

```cpp
std::cout << std::bitset<4>{ 0b1010 } << '\n'; // create a temporary std::bitset and print it
```

创建了一个临时的4个位的 `std::bitset` 对象，然后用二进制 _0b1010_ 对其进行了初始化并打印为二进制格式，随后就丢弃了这个临时的对象。
