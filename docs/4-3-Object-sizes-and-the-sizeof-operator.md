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

正如在[[4-1-Introduction-to-fundamental-data-types|4.1 - 基础数据类型简介]]中介绍的那样，现代计算机以[[byte|字节(byte)]]为单位使用内存，每个字节的内存都有其唯一对应的地址。从这个角度来说，内存可以被想象成一系列的memory on modern machines is typically organized into byte-sized units, with each byte of memory having a unique address. Up to this point, it has been useful to think of memory as a bunch of cubbyholes or mailboxes where we can put and retrieve information, and variables as names for accessing those cubbyholes or mailboxes.

However, this analogy is not quite correct in one regard -- most objects actually take up more than 1 byte of memory. A single object may use 2, 4, 8, or even more consecutive memory addresses. The amount of memory that an object uses is based on its data type.

Because we typically access memory through variable names (and not directly via memory addresses), the compiler is able to hide the details of how many bytes a given object uses from us. When we access some variable _x_, the compiler knows how many bytes of data to retrieve (based on the type of variable _x_), and can handle that task for us.

Even so, there are several reasons it is useful to know how much memory an object uses.

First, the more memory an object uses, the more information it can hold.

A single bit can hold 2 possible values, a 0, or a 1:

| bit 0      | 
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

To generalize, an object with _n_ bits (where n is an integer) can hold 2n (2 to the power of n, also commonly written 2^n) unique values. Therefore, with an 8-bit byte, a byte-sized object can hold 28 (256) different values. An object that uses 2 bytes can hold 2^16 (65536) different values!

Thus, the size of the object puts a limit on the amount of unique values it can store -- objects that utilize more bytes can store a larger number of unique values. We will explore this further when we talk more about integers.

Second, computers have a finite amount of free memory. Every time we define an object, a small portion of that free memory is used for as long as the object is in existence. Because modern computers have a lot of memory, this impact is usually negligible. However, for programs that need a large amount of objects or data (e.g. a game that is rendering millions of polygons), the difference between using 1 byte and 8 byte objects can be significant.

Key insight

New programmers often focus too much on optimizing their code to use as little memory as possible. In most cases, this makes a negligible difference. Focus on writing maintainable code, and optimize only when and where the benefit will be substantive.

## Fundamental data type sizes

The obvious next question is “how much memory do variables of different data types take?”. You may be surprised to find that the size of a given data type is dependent on the compiler and/or the computer architecture!

C++ only guarantees that each fundamental data types will have a minimum size:

![[Pasted image 20220529153638.png]]

However, the actual size of the variables may be different on your machine (particularly int, which is more often 4 bytes).

Best practice

For maximum compatibility, you shouldn’t assume that variables are larger than the specified minimum size.

Objects of fundamental data types are generally extremely fast.

## The sizeof operator

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

Your results may vary if you are using a different type of machine, or a different compiler. Note that you can not use the _sizeof_operator on the _void_ type, since it has no size (doing so will cause a compile error).

For advanced readers

If you’re wondering what ‘\t’ is in the above program, it’s a special symbol that inserts a tab (in the example, we’re using it to align the output columns). We will cover ‘\t’ and other special symbols in lesson [4.11 -- Chars](https://www.learncpp.com/cpp-tutorial/chars/).

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

As an aside…

You might assume that types that use less memory would be faster than types that use more memory. This is not always true. CPUs are often optimized to process data of a certain size (e.g. 32 bits), and types that match that size may be processed quicker. On such a machine, a 32-bit _int_ could be faster than a 16-bit _short_ or an 8-bit _char_.