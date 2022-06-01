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
	- `std::string`和`std::string_view`类型的字面量可以通过`s`和``


在编程中，常量（constant）指的是不会改变的值。C++支持两种常量：字面量常量和符号常量。本节课我们会介绍字面量常量，然后下节课 [[4-15-Symbolic-constants-const-and-constexpr-variables|4.15 - 符号常数 const 和 constexpr 变量]]中会介绍符号常量。

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

There are two different ways to declare floating-point literals:

```cpp
double pi { 3.14159 }; // 3.14159 is a double literal in standard notation
double avogadro { 6.02e23 }; // 6.02 x 10^23 is a double literal in scientific notation
```


In the second form, the number after the exponent can be negative:

```cpp
double electron { 1.6e-19 }; // charge on an electron is 1.6 x 10^-19
```


## 8进制和16进制字面量

In everyday life, we count using decimal numbers, where each numerical digit can be 0, 1, 2, 3, 4, 5, 6, 7, 8, or 9. Decimal is also called “base 10”, because there are 10 possible digits (0 through 9). In this system, we count like this: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, … By default, numbers in C++ programs are assumed to be decimal.

```cpp
int x { 12 }; // 12 is assumed to be a decimal number
```

COPY

In binary, there are only 2 digits: 0 and 1, so it is called “base 2”. In binary, we count like this: 0, 1, 10, 11, 100, 101, 110, 111, …

There are two other “bases” that are sometimes used in computing: octal, and hexadecimal.

Octal is base 8 -- that is, the only digits available are: 0, 1, 2, 3, 4, 5, 6, and 7. In Octal, we count like this: 0, 1, 2, 3, 4, 5, 6, 7, 10, 11, 12, … (note: no 8 and 9, so we skip from 7 to 10).

|Decimal |0 |1 |2 |3 |4 |5 |6 |7 |8 |9 |10 |11|
|---|---|---|---|---|---|---|---|---|---|---|---|
|Octal |0 |1 |2 |3 |4 |5 |6 |7 |10 |11 |12 |13|


To use an octal literal, prefix your literal with a 0 (zero):

```cpp
#include <iostream>

int main()
{
    int x{ 012 }; // 0 before the number means this is octal
    std::cout << x;
    return 0;
}
```

COPY

This program prints:

```
10
```

Why 10 instead of 12? Because numbers are printed in decimal, and 12 octal = 10 decimal.

Octal is hardly ever used, and we recommend you avoid it.

Hexadecimal is base 16. In hexadecimal, we count like this: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, A, B, C, D, E, F, 10, 11, 12, …


|Decimal |0 |1 |2 |3 |4 |5 |6 |7 |8 |9 |10 |11 |12 |13 |14 |15 |16 |17|
|---|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|
|Hexadecimal |0 |1 |2 |3 |4 |5 |6 |7 |8 |9 |A |B |C |D |E |F |10 |11|


To use a hexadecimal literal, prefix your literal with 0x.

```cpp
#include <iostream>

int main()
{
    int x{ 0xF }; // 0x before the number means this is hexadecimal
    std::cout << x;
    return 0;
}
```

COPY

This program prints:

```
15
```

Because there are 16 different values for a hexadecimal digit, we can say that a single hexadecimal digit encompasses 4 bits. Consequently, a pair of hexadecimal digits can be used to exactly represent a full byte.

Consider a 32-bit integer with value 0011 1010 0111 1111 1001 1000 0010 0110. Because of the length and repetition of digits, that’s not easy to read. In hexadecimal, this same value would be: 3A7F 9826. This makes hexadecimal values useful as a concise way to represent a value in memory. For this reason, hexadecimal values are often used to represent memory addresses or raw values in memory.

Prior to C++14, there is no way to assign a binary literal. However, hexadecimal values provide us with a useful workaround:

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

COPY

## C++14 binary literals and digit separators

In C++14, we can assign binary literals by using the 0b prefix:

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

COPY

Because long literals can be hard to read, C++14 also adds the ability to use a quotation mark (‘) as a digit separator.

```cpp
#include <iostream>

int main()
{
    int bin { 0b1011'0010 };  // assign binary 1011 0010 to the variable
    long value { 2'132'673'462 }; // much easier to read than 2132673462

    return 0;
}
```

COPY

If your compiler isn’t C++14 compatible, your compiler will complain if you try to use either of these.

Also note that the separator can not occur before the first digit of the value:

```cpp
int bin { 0b'1011'0010 };  // error: ' used before first digit of value
```

COPY

## Printing decimal, octal, hexadecimal, and binary numbers

By default, C++ prints values in decimal. However, you can tell it to print in other formats. Printing in decimal, octal, or hex is easy via use of `std::dec`, `std::oct`, and std::hex:

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

COPY

This prints:

```
12
c
c
14
12
12
```

Printing in binary is a little harder, as `std::cout` doesn’t come with this capability built-in. Fortunately, the C++ standard library includes a type called `std::bitset` that will do this for us (in the `<bitset>` header). To use `std::bitset`, we can define a `std::bitset` variable and tell `std::bitset` how many bits we want to store. The number of bits must be a compile time constant. `std::bitset` can be initialized with an unsigned integral value (in any format, including decimal, octal, hex, or binary).

```cpp
#include <bitset> // for std::bitset
#include <iostream>

int main()
{
	// std::bitset<8> means we want to store 8 bits
	std::bitset<8> bin1{ 0b1100'0101 }; // binary literal for binary 1100 0101
	std::bitset<8> bin2{ 0xC5 }; // hexadecimal literal for binary 1100 0101

	std::cout << bin1 << ' ' << bin2 << '\n';
	std::cout << std::bitset<4>{ 0b1010 } << '\n'; // create a temporary std::bitset and print it

	return 0;
}
```

This prints:

```
11000101 11000101
1010
```

In the above code, this line:

```cpp
std::cout << std::bitset<4>{ 0b1010 } << '\n'; // create a temporary std::bitset and print it
```

COPY

creates a temporary (unnamed) `std::bitset` object with 4 bits, initializes it with _0b1010_, prints the value in binary, and then discards the temporary `std::bitset`.