---
title: O.1 - bit标记和通过std::bitset操作bit
alias: O.1 - bit标记和通过std::bitset操作bit
origin: /bit-flags-and-bit-manipulation-via-stdbitset/
origin_title: "O.1 — Bit flags and bit manipulation via std::bitset"
time: 2022-8-6
type: translation
tags:
- bit
---

> [!note] "Key Takeaway"

在现代计算机体系结构上，最小的可寻址内存单元是字节。由于所有对象都需要具有唯一的内存地址，这意味着对象的大小必须至少为一个字节。对于大多数变量类型，这很好。但是，对于布尔值，这有点浪费(双关语）`“原文:this is a bit wasteful”`。布尔类型只有两种状态：真 （1） 或假 （0）。这组状态只需要一个位来存储。但是，如果变量必须至少是一个字节，并且一个字节是 8 位，这意味着布尔值使用 1 位，而其他 7 位未使用。

在大多数情况下，这么做很好 —— 我们通常不会对内存管理如此苛刻，以至于我们需要关心7个浪费的位（我们更应该使代码易于理解，易于维护）。**但是，在某些存储密集型情况下，出于存储效率目的，将 8 个单独的布尔值“打包”到单个字节中可能很有用。**

做这些事情需要我们可以在位级别操作对象。幸运的是，C++为我们提供了做到这一点的工具。修改对象中的单个位称为**位操作**。

位操作在加密和压缩算法中也很有用。

## 位标志

到目前为止，我们已经使用变量来保存单个值：

```cpp
int foo { 5 }; // assign foo the value 5 (probably uses 32 bits of storage)
std::cout << foo; // print the value 5
```

但是，我们可以将它们视为单个位的集合，而不是将对象视为包含单个值的对象。当对象的单个位用作布尔值时，这些位称为**位标志**。

要定义一组位标志，我们通常会使用**适当大小的无符号整数**（8 位、16 位、32 位等......取决于我们有多少标志），或**std::bitset**。

```cpp
#include <bitset> // for std::bitset

std::bitset<8> mybitset {}; // 8 bits in size means room for 8 flags
```
> [!success] "最佳实践"
> 位操作是少数应该明确使用无符号整数（或 std：：bitset）的情况之一。

在本课中，我们将展示如何通过 std::bitset 以简单的方式进行位操作。在下一组课程中，我们将探讨如何以更困难但用途广泛的方式做到这一点。

## 位编号和位位置

给定一个位序列，我们通常从右到左对位进行编号，**从 0（而不是 1）开始**。每个数字表示一个**位位置**。

```
76543210  Bit position
00000101  Bit sequence
```

给定位序列 0000 0101，位于位置 0 和 2 的位的值为 1，其他位的值为 0。

## 通过 std::bitset 操作位

在[[4-16-Numeral-systems-decimal-binary-hexadecimal-and-octal|第 4.16 课——数字系统十进制、二进制、十六进制和八进制]]中，我们已经展示了如何使用 std::bitset 打印二进制值。然而，这并不是 std::bitset 能做的唯一有用的事情。

std::bitset 提供了 4 个可用于位操作的关键函数：

- test() 允许我们查询某个位是 0 还是 1
- set() 允许我们打开一个位（如果位已经打开，这将不执行任何操作）
- reset() 允许我们关闭一个位（如果该位已经关闭，这将不执行任何操作）
- flip() 允许我们将位值从 0 翻转为 1，反之亦然

这些函数中的每一个都将我们要操作的位的位置作为它们唯一的参数。

这是一个例子：

```cpp
#include <bitset>
#include <iostream>

int main()
{
    std::bitset<8> bits{ 0b0000'0101 }; // we need 8 bits, start with bit pattern 0000 0101
    bits.set(3); // set bit position 3 to 1 (now we have 0000 1101)
    bits.flip(4); // flip bit 4 (now we have 0001 1101)
    bits.reset(4); // set bit 4 back to 0 (now we have 0000 1101)

    std::cout << "All the bits: " << bits << '\n';
    std::cout << "Bit 3 has value: " << bits.test(3) << '\n';
    std::cout << "Bit 4 has value: " << bits.test(4) << '\n';

    return 0;
}
```

这打印：

```
All the bits: 00001101
Bit 3 has value: 1
Bit 4 has value: 0
```

> [!tip] "小贴士"
> 如果您需要复习什么是`0b`前缀或`'`分隔符，请查看[[4-16-Numeral-systems-decimal-binary-hexadecimal-and-octal|4.16 - 数字系统十进制、二进制、十六进制和八进制]]

## 如果我们想一次获取或设置多个位怎么办
std::bitset 并不容易实现这个需求。为了做到这一点，或者如果我们想使用无符号整数位标志而不是 std::bitset，我们需要使用更传统的方法。我们将在接下来的几节课中介绍这些内容。

## std::bitset 的大小

一个潜在的惊喜是 std::bitset **针对速度进行了优化**，而不是节省内存。std::bitset 的大小通常是保存位所需的字节数，`四舍五入到(rounded up to)`最接近的`sizeof(size_t)`，在 32 位机器上为 4 字节，在 64 位机器上为 8 字节。

因此，`std::bitset<8>` 通常使用 4 或 8 字节的内存，即使它在技术上只需要 1 个字节来存储 8 位。因此，当我们想要方便而不是节省内存时，std::bitset 是最有用的。
