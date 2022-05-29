---
title: 4.3 - 对象的大小和 sizeof 操作符
alias: 4.3 - 对象的大小和 sizeof 操作符
origin: /object-sizes-and-the-sizeof-operator/
origin_title: "4.3 — Object sizes and the sizeof operator"
time: 2022-1-2
type: translation
tags:
- sizeof
---

## 对象的大小

正如在[[4-1-Introduction-to-fundamental-data-types|4.1 - 基础数据类型简介]]中介绍的那样，现代计算机以[[byte|字节(byte)]]为单位使用内存，每个字节的内存都有其唯一对应的地址。从这个角度来说，内存可以被想象成一系列的小储藏间或信箱，你可以从中存放或读取信息，而变量名则用来对这些储藏间或信箱进行访问。

不过，这个比喻并不完全准确——很多对象实际上占据的内存要大于1个字节。一个对象可能会使用2、4、8或者更多连续的内存地址。而对象使用多大的内存，取决于对象的数据类型。

因为我们通常使用变量名来访问内存（而非直接访问内存），编译器帮我们隐藏了上述细节，即一个对象占用多少内存。当使用变量 x 访问其对应的内存时，编译器指定应该获取多少字节的数据（基于 x 的数据类型），它为我们完成了上述工作。

即使这也，很多时候知道对象占用多少内存是有用的。

首先，对象占用的内存决定了该对象能够保存多少信息。

一个比特可以保存两个可能的值，即0或1：

| bit 0 | 
| ----- | 
| 0    | 
| 1      | 


| bit 0      | bit 1
| ----- | -----|
| 0    | 0
| 1      | 1
|1      | 0
|1      |1 


| bit 0      | bit 1 | bit 2 
| ----- | -----|-----|
| 0    | 0 |  0 
| 0    | 0 |  1
| 0    | 1 |  0
| 0    | 1 |  1
|1      | 0 |  0 
|1      | 0 |  1
|1      | 1 |  0 
|1      |1   |  1

概括来说，具有 n 个[[bit|比特]]大小的对象（n为正整数）可以保存 $2^n$ 中不同的值（2的n次方，一般也写作`2^n`）。因此，对于一个8个比特的字节来说，大小位1字节的对象可以保存 $2^8$ (256)中可能的值。使用2个字节的对象可以保存 $2^{16}$ (65536)种不同的值！

因此，对象的大小决定了它能保存的不同值的上限——使用的内存越多，能够存放的不同, the size of the object puts a limit on the amount of unique values it can store -- objects that utilize more bytes can store a larger number of unique values. We will explore this further when we talk more about integers.

Second, computers have a finite amount of free memory. Every time we define an object, a small portion of that free memory is used for as long as the object is in existence. Because modern computers have a lot of memory, this impact is usually negligible. However, for programs that need a large amount of objects or data (e.g. a game that is rendering millions of polygons), the difference between using 1 byte and 8 byte objects can be significant.

!!! tldr "关键信息"

	New programmers often focus too much on optimizing their code to use as little memory as possible. In most cases, this makes a negligible difference. Focus on writing maintainable code, and optimize only when and where the benefit will be substantive.

## 基础数据类型的大小

The obvious next question is “how much memory do variables of different data types take?”. You may be surprised to find that the size of a given data type is dependent on the compiler and/or the computer architecture!

C++ only guarantees that each fundamental data types will have a minimum size:

|分类|类型|最小尺寸|备注|
|---|---|---|---|
|boolean|bool|1 byte |
|character|char|1 byte | 总是1个字节
|character|wchat_t|1 byte |
|character|char16_t|2 byte |
|character|char32_t|4 byte |
|integer|short|2 byte |
|integer|int|2 byte |
|integer|long|4 byte |
|integer|long long|8 byte |
|floating point|float|4 byte |
|floating point|double|8 byte |
|floating point|long double|8 byte |

However, the actual size of the variables may be different on your machine (particularly int, which is more often 4 bytes).

!!! success "最佳实践"

	For maximum compatibility, you shouldn’t assume that variables are larger than the specified minimum size.

Objects of fundamental data types are generally extremely fast.

## sizeof 运算符

In order to determine the size of data types on a particular machine, C++ provides an operator named _sizeof_. The sizeof operator is a unary operator that takes either a type or a variable, and returns its size in bytes. You can compile and run the following program to find out how large some of your data types are:

```cpp
#include <iostream>

int main()
{
    std::cout << "bool:\t\t" << sizeof(bool) << " bytes\n";
    std::cout << "char:\t\t" << sizeof(char) << " bytes\n";
    std::cout << "wchar_t:\t" << sizeof(wchar_t) << " bytes\n";
    std::cout << "char16_t:\t" << sizeof(char16_t) << " bytes\n";
    std::cout << "char32_t:\t" << sizeof(char32_t) << " bytes\n";
    std::cout << "short:\t\t" << sizeof(short) << " bytes\n";
    std::cout << "int:\t\t" << sizeof(int) << " bytes\n";
    std::cout << "long:\t\t" << sizeof(long) << " bytes\n";
    std::cout << "long long:\t" << sizeof(long long) << " bytes\n";
    std::cout << "float:\t\t" << sizeof(float) << " bytes\n";
    std::cout << "double:\t\t" << sizeof(double) << " bytes\n";
    std::cout << "long double:\t" << sizeof(long double) << " bytes\n";

    return 0;
}
```

COPY

Here is the output from the author’s x64 machine, using Visual Studio:

```
bool:           1 bytes
char:           1 bytes
wchar_t:        2 bytes
char16_t:       2 bytes
char32_t:       4 bytes
short:          2 bytes
int:            4 bytes
long:           4 bytes
long long:      8 bytes
float:          4 bytes
double:         8 bytes
long double:    8 bytes
```

Your results may vary if you are using a different type of machine, or a different compiler. Note that you can not use the _sizeof_operator on the _void_ type, since it has no size (doing so will cause a compile error).

!!! info "扩展阅读"

	If you’re wondering what ‘\t’ is in the above program, it’s a special symbol that inserts a tab (in the example, we’re using it to align the output columns). We will cover ‘\t’ and other special symbols in lesson [[4-11-Chars|4.11 - 字符]]

You can also use the _sizeof_ operator on a variable name:

```cpp
#include <iostream>

int main()
{
    int x{};
    std::cout << "x is " << sizeof(x) << " bytes\n";

    return 0;
}
```

COPY

x is 4 bytes

## Fundamental data type performance

On modern machines, objects of the fundamental data types are fast, so performance while using these types should generally not be a concern.

!!! cite "题外话"

    You might assume that types that use less memory would be faster than types that use more memory. This is not always true. CPUs are often optimized to process data of a certain size (e.g. 32 bits), and types that match that size may be processed quicker. On such a machine, a 32-bit _int_ could be faster than a 16-bit _short_ or an 8-bit _char_.