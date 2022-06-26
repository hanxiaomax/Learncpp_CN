---
title: 4.16 - 数值系统（十进制、二进制、十六进制和八进制）
alias: 4.16 - 数值系统（十进制、二进制、十六进制和八进制）
origin: /none/
origin_title: "4.16 — Numeral systems (decimal, binary, hexadecimal, and octal)"
time: 2022-1-2
type: translation
tags:
- Numeral systems
---

??? note "关键点速记"

	- C++14才支持了使用`0b`创建二进制字面量，同时可以用单引号作为位的分隔符，但是分隔符不能放在第一位前面
	- 使用`std::dec`、`std::oct` 和 `std::hex`可以轻松打印十进制、八进制和十六进制。但不能直接打印二进制。
	- `std::cout << std::hex << x << '\n'; // hexadecimal`
	- 使用 `std::bitset`，我们可以定义一个 `std::bitset` 变量，并且告诉 `std::bitset` 有多少位需要存储。需要包含`<bitset>`头文件


!!! info "作者注"

	本节课为选学。
	
	在将来的课程中我们会使用十六进制数，所以你至少需要掌握十六进制。

在日常生活中，我们习惯了数字可以有 0, 1, 2, 3, 4, 5, 6, 7, 8, 或 9。十进制也称为“base 10”，因为它可以有10种不同的数字(0 到 9)。在这个系统里，我们会按照 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, … 的方式来计数，而在 C++ 中，数字也是默认十进制表示法。

```cpp
int x { 12 }; // 12 is assumed to be a decimal number
```


对于二进制来说，数字只有 0 和 1 两种可能，所以才叫做 2 （“base 2”）。二进制计数时通常是这样的：0, 1, 10, 11, 100, 101, 110, 111, …

当然，计算机有时候也使用其他的进制，例如八进制和十六进制。


## 8进制和16进制字面量

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

## 十进制、八进制、十六进制打印

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

## 二进制打印



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
