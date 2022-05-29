---
title: 4.4 - 有符号整型
alias: 4.4 - 有符号整型
origin: /signed-integers/
origin_title: "4.4 — Signed integers"
time: 2021-8-5
type: translation
tags:
- integer
---

??? note "关键点速记"
	- 

整型是一种整数类型，它可以表示正整数和负整数，当然也包括0（例如：-2、-1、0、1、2）。C++ 中有4中基础整型：

| Type |	 Minimum Size	| Note |
|-----|-----|-----|
|short |16 bits	| 
|int	|16 bits	|Typically 32 bits on modern architectures
|long  |	32 bits	|
|long long|	64 bits	|


这些类型的主要差异是它们的大小不同——越大的整型可以表示越大的数。

!!! tip "提醒"

	C++ 只保证整型大小的最小值，而不保证其最小值。请参考[[4-3-Object-sizes-and-the-sizeof-operator|4.3 - 对象的大小和 sizeof 操作符]]来确定每种类型在你机器上的具体大小。
	

## 有符号整型

在日常生活中，如果我们要表示负整数，通常会使用负号。例如，_-3_ 表示 “负三”。我们还会使用+3来表示”正三“（尽管通常正号会被省略）。数字的这种“正负零”属性，称为数字的负号。

默认情况下，整型是由符号的，也就是说数字的符号是数字本身的一部分（使用一个位进行存储，称为符号位）。因此，有符号整型可以表示正数负数和0。

在这节课中，我们会专注于介绍有符号整型。无符号整型（只能保存非负值）会在后续的课程中进行讨论。

!!! info "相关内容"

	我们在[O.4 -- Converting between binary and decimal](https://www.learncpp.com/cpp-tutorial/converting-between-binary-and-decimal/) 中讨论了二进制表示法时符号位如何使用。

## 定义有符号整型

定义有符号整型时，推荐的方式如下：
```cpp
short s;
int i;
long l;
long long ll;
```

所有的整型(除了`int`)以外，都可以带上一个可选的`int`后缀：

```cpp
short int si;//short int 中的 int 即可选后缀
long int li;
long long int lli;
```

不过，并不推荐使用这些后缀。使用这些后缀不仅需要打更多字，而且添加`int`后缀后，不容易将这些类型和`int`类型的变量区分开来，而且如果不经意忘记了`short`或者`long`修饰符的话则可能会引入问题。

整型还可以添加一个可选的`singed`关键字，通常会将其放置在类型名前：

```cpp
signed short ss;
signed int si;
signed long sl;
signed long long sll;
```


不过，这个关键字也不推荐使用，因为它是多余的，整型默认就是有符号的。

!!! success "最佳实践"

	使用最精简的写法，不要使用`int`后缀或`signed`前缀。
	
## Signed integer ranges

As you learned in the last section, a variable with _n_ bits can hold 2n possible values. But which specific values? We call the set of specific values that a data type can hold its range. The range of an integer variable is determined by two factors: its size (in bits), and whether it is signed or not.

By definition, an 8-bit signed integer has a range of -128 to 127. This means a signed integer can store any integer value between -128 and 127 (inclusive) safely.

!!! cite "题外话"

    Math time: an 8-bit integer contains 8 bits. 28 is 256, so an 8-bit integer can hold 256 possible values. There are 256 possible values between -128 to 127, inclusive.

Here’s a table containing the range of signed integers of different sizes:


|Size/Type	| Range |
|----|----|
|8 bit signed|	-128 to 127
|16 bit signed	|-32,768 to 32,767
|32 bit signed	|-2,147,483,648 to 2,147,483,647
|64 bit signed	|-9,223,372,036,854,775,808 to 9,223,372,036,854,775,807


For the math inclined, an n-bit signed variable has a range of $-(2^{n-1})$ to $2^{n-1}-1$

For the non-math inclined… use the table. :)

## 整型溢出 

What happens if we try to assign the value _280_ to an 8-bit signed integer? This number is outside the range that a 8-bit signed integer can hold. The number 280 requires 9 bits (plus 1 sign bit) to be represented, but we only have 7 bits (plus 1 sign bit) available in a 8-bit signed integer.

Integer overflow (often called _overflow_ for short) occurs when we try to store a value that is outside the range of the type. Essentially, the number we are trying to store requires more bits to represent than the object has available. In such a case, data is lost because the object doesn’t have enough memory to store everything.

In the case of signed integers, which bits are lost is not well defined, thus signed integer overflow leads to undefined behavior.

!!! warning "注意"

	Signed integer overflow will result in undefined behavior.

In general, overflow results in information being lost, which is almost never desirable. If there is _any_ suspicion that an object might need to store a value that falls outside its range, use a type with a bigger range!

## 整型除法

When dividing two integers, C++ works like you’d expect when the quotient is a whole number:

```cpp
#include <iostream>

int main()
{
    std::cout << 20 / 4;
    return 0;
}
```

COPY

This produces the expected result:

```
5
```

But let’s look at what happens when integer division causes a fractional result:

```cpp
#include <iostream>

int main()
{
    std::cout << 8 / 5;
    return 0;
}
```

COPY

This produces a possibly unexpected result:

```
1
```

When doing division with two integers (called integer division), C++ always produces an integer result. Since integers can’t hold fractional values, any fractional portion is simply dropped (not rounded!).

Taking a closer look at the above example, 8 / 5 produces the value 1.6. The fractional part (0.6) is dropped, and the result of 1 remains.

Similarly, -8 / 5 results in the value -1.

!!! warning "注意"

	Be careful when using integer division, as you will lose any fractional parts of the quotient. However, if it’s what you want, integer division is safe to use, as the results are predictable.

If fractional results are desired, we show a method to do this in lesson [5.2 -- Arithmetic operators](https://www.learncpp.com/cpp-tutorial/arithmetic-operators/).