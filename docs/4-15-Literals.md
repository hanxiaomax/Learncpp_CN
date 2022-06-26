---
title: 4.15 - 字面量
alias: 4.15 - 字面量
origin: /literals/
origin_title: "4.14 — Literal"
time: 2022-6-17
type: translation
tags:
- literal
- constants
- C++14
---

??? note "关键点速记"

	- 常量有两种，字面量常量（简称字面量）和符号常量
	- 字面量的类型具有默认值，可以通过后缀修改
		- 小数字面量的默认类型为double而不是float
		- C风格的字符串，默认类型为字符数组
	- `std::string`和`std::string_view`类型的字面量可以通过`s`和`sv`后缀指定，在类型推断时比较有用，其他情况一般不需要
	- 声明浮点数字面量的方法有两种：`3.14159`或`1.9e10`
	

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




