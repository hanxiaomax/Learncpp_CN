---
title: 4.6 - 固定宽度整型和 size_t
alias: 4.6 - 固定宽度整型和 size_t
origin: /fixed-width-integers-and-size-t/
origin_title: "4.6 — Fixed-width integers and size_t"
time: 2022-4-6
type: translation
tags:
- fixed-width
- integer
- size_t
---

上面的课程中我们介绍了整型，并且提到 C++ 只保证整型值占用空间的最小值——但是它占用的空间可以更大，这取决于具体的系统。

## 为什么整型的大小不是固定的？

简而言之，这还是从C语言继承而来的。在计算机非常慢的年代，性能是最需要被考虑的问题。C 语言选择故意不去固定整型的大小，以便编译器的实现者可以为目标计算机选择最合适的整型大小以提高性能。

## 很讨厌是吧？

从现代标准的角度来讲，是的。作为程序员还要处理类型范围不确定的情况确实有点荒唐。

考虑`int`类型，其占用内存最小为 2字节，但是在现代计算机上却经常为4字节。如果你假设int是4个字节（确实4字节情况最有可能），那么你的程序在`int`实际只占两个字节的计算机上就会产生异常的行为（因为你很可能把一个需要4字节才能存放的值存放到了实际只有2个字节的变量中，这会导致溢出或未定义行为）。而如果你假设`int`只有两个字节以便获得最好的兼容性，那么在4字节系统上无疑会浪费两个字节，这会使得你的内存使用成倍增加！

## 固定宽度整型

为了解决这个问题，C99定义了一组固定宽度整形（位于`stdint.h`）来确保整型在不同的计算机体系结构下都具有相同的大小。

|名称 |    类型|    范围    |备注|
|---|---|---|---|
|std:: int8_t      |1 byte signed    |-128 到 127| 在大多数系统上被看做有符号字符处理，见下面备注。
|std:: uint8_t    |1 byte unsigned    |0 到 255    |在大多数系统上被看做无符号字符处理，见下面备注
|std:: int16_t    |2 byte signed    |-32,768 到 32,767    |
|std:: uint16_t    |2 byte unsigned    |0 到 65,535    |
|std:: int32_t    |4 byte signed    |-2,147,483,648 到 2,147,483,647    |
|std:: uint32_t    |4 byte unsigned    |0 到 4,294,967,295    |
|std:: int64_t    |8 byte signed    |-9,223,372,036,854,775,808 到 9,223,372,036,854,775,807    |
|std:: uint64_t    |8 byte unsigned    |0 到 18,446,744,073,709,551,615    |

C++ 在 C++11中官方吸纳了这些固定宽度整型。通过包含 `<cstdint>` 头文件就可以使用它们，它们被定义在`std`命名空间中。

请看下面这个例子：

```cpp
#include <cstdint> // for fixed-width integers
#include <iostream>

int main()
{
    std::int16_t i{5};
    std::cout << i;
    return 0;
}
```

固定宽度整型通常来讲有两个缺陷。

首先，固定宽度整型不能保证在所有的体系结构中都被定义了。它只存在于, They only exist on systems where there are fundamental types matching their widths and following a certain binary representation.如果体系结构不支持固定宽度整型，则你的程序是无法编译的。不过，大多数的现代体系结构都以 8/16/32/64-位的变量为标准，因此除非你需要将程序移植到某个极其特殊的大型机或嵌入式系统上，否则一般没有问题。

其次，如果你使用了固定宽度整型，它的性能相较于使用更宽的类型可能或稍差（在同样的体系结构下）。例如，如果你需要一个大小确定为32位的整型，你可能会使用 `std:: int32_t`，但是你的CPU可能在处理64位整形时更快。不过，即便CPU能够更快的处理某种给定的类型，也不一定意味着程序的运行速度更快——现代程序更多受限于内存使用而不是CPU处理速度。使用更大的内存足迹(memory footprint)带来的性能损失可能会超过CPU对其进行的加速。不经实际测试是很难进行对比的。


## 快整型和小整型

为了解决上述问题，C++还定义了另外两组整型，并确保它们总是具有定义。

fast types (`std:: int_fast#_t` and `std:: uint_fast#_t`) provide the fastest signed/unsigned integer type with a width of at least `#` bits (where # = 8,16,32, or 64). For example, `std:: int_fast32_t` will give you the fastest signed integer type that’s at least 32 bits.

The least types (`std:: int_least#_t` and `std:: uint_least#_t`) provide the smallest signed/unsigned integer type with a width of at least `#` bits (where # = 8,16,32, or 64). For example, _std:: uint_least32_t_ will give you the smallest unsigned integer type that’s at least 32 bits.

以作者使用的 Visual Studio (32-bit 控制台程序)为例：

```cpp
#include <cstdint> // for fixed-width integers
#include <iostream>

int main()
{
    std::cout << "least 8:  " << sizeof(std::int_least8_t) * 8 << " bits\n";
    std::cout << "least 16: " << sizeof(std::int_least16_t) * 8 << " bits\n";
    std::cout << "least 32: " << sizeof(std::int_least32_t) * 8 << " bits\n";
    std::cout << '\n';
    std::cout << "fast 8:  " << sizeof(std::int_fast8_t) * 8 << " bits\n";
    std::cout << "fast 16: " << sizeof(std::int_fast16_t) * 8 << " bits\n";
    std::cout << "fast 32: " << sizeof(std::int_fast32_t) * 8 << " bits\n";

    return 0;
}
```

输出结果如下：

```
least 8:  8 bits
least 16: 16 bits
least 32: 32 bits

fast 8:  8 bits
fast 16: 32 bits
fast 32: 32 bits
```

You can see that `std:: int_least16_t` is 16 bits, whereas `std:: int_fast16_t` is actually 32 bits. This is because on the author’s machine, 32-bit integers are faster to process than 16-bit integers.

However, these fast and least integers have their own downsides: First, not many programmers actually use them, and a lack of familiarity can lead to errors. Second, the fast types can lead to the same kind of memory wastage that we saw with 4 byte integers. Most seriously, because the size of the fast/least integers can vary, it’s possible that your program may exhibit different behaviors on architectures where they resolve to different sizes. For example:

```cpp
#include <cstdint> // for fixed-width integers
#include <iostream>

int main()
{
    std::uint_fast16_t sometype { 0 };
    --sometype; // intentionally overflow to invoke wraparound behavior

    std::cout << sometype;

    return 0;
}
```

COPY

This code will produce different results depending on whether `std:: uint_fast16_t` is 16,32, or 64 bits.

It’s hard to know where your program might not function as expected until you’ve rigorously tested your program on such architectures. And we imagine not many developers have access to a wide range of different architectures to test with!

## std:: int8_t 和 std:: uint8_t 的行为可能更像字符而非整型

Due to an oversight in the C++ specification, most compilers define and treat _std:: int8_t_ and _std:: uint8_t_ (and the corresponding fast and least fixed-width types) identically to types _signed char_ and _unsigned char_ respectively. This means these 8-bit types may (or may not) behave differently than the rest of the fixed-width types, which can lead to errors. This behavior is system-dependent, so a program that behaves correctly on one architecture may not compile or behave correctly on another architecture.

We show an example of this in lesson [4.12 -- Introduction to type conversion and static_cast](https://www.learncpp.com/cpp-tutorial/introduction-to-type-conversion-and-static_cast/) .

For consistency, it’s best to avoid _std:: int8_t_ and _std:: uint8_t_ (and the related fast and least types) altogether (use _std:: int16_t_ or _std:: uint16_t_ instead).

!!! warning "注意"

    Avoid the 8-bit fixed-width integer types. If you do use them, note that they are often treated like chars.

## 整型的类型最佳实践

Given the various pros and cons of the fundamental integral types, the fixed-width integral types, the fast/least integral types, and signed/unsigned challenges, there is little consensus on integral best practices.

Our stance is that it’s better to be correct than fast, better to fail at compile time than runtime -- therefore, we recommend avoiding the fast/least types in favor of the fixed-width types. If you later discover the need to support a platform for which the fixed-width types won’t compile, then you can decide how to migrate your program (and thoroughly test) at that point.

!!! success "最佳实践"

    - Prefer `int` when the size of the integer doesn’t matter (e.g. the number will always fit within the range of a 2-byte signed integer). For example, if you’re asking the user to enter their age, or counting from 1 to 10, it doesn’t matter whether int is 16 or 32 bits (the numbers will fit either way). This will cover the vast majority of the cases you’re likely to run across.
    - Prefer `std:: int#_t` when storing a quantity that needs a guaranteed range.
    - Prefer `std:: uint#_t` when doing bit manipulation or where well-defined wrap-around behavior is required.

    Avoid the following when possible:

    - Unsigned types for holding quantities
    - The 8-bit fixed-width integer types
    - The fast and least fixed-width types
    - Any compiler-specific fixed-width integers -- for example, Visual Studio defines __int8, __int16, etc…

## std:: size_t 是什么？

考虑如下代码：

```cpp
#include <iostream>

int main()
{
    std::cout << sizeof(int) << '\n';

    return 0;
}
```


在作者的机器上打印结果如下：

```
4
```

Pretty simple, right? We can infer that operator sizeof returns an integer value -- but what integer type is that return value? An int? A short? The answer is that sizeof (and many functions that return a size or length value) return a value of type _std:: size_t_. std:: size_t is defined as an unsigned integral type, and it is typically used to represent the size or length of objects.

Amusingly, we can use the _sizeof_ operator (which returns a value of type `std:: size_t`) to ask for the size of `std:: size_t` itself:

```cpp
#include <cstddef> // std::size_t
#include <iostream>

int main()
{
    std::cout << sizeof(std::size_t) << '\n';

    return 0;
}
```


Compiled as a 32-bit (4 byte) console app on the author’s system, this prints:

```
4
```

Much like an integer can vary in size depending on the system, `std:: size_t` also varies in size. `std:: size_t` is guaranteed to be unsigned and at least 16 bits, but on most systems will be equivalent to the address-width of the application. That is, for 32-bit applications, `std:: size_t` will typically be a 32-bit unsigned integer, and for a 64-bit application, _size_t_ will typically be a 64-bit unsigned integer. _size_t_ is defined to be big enough to hold the size of the largest object creatable on your system (in bytes). For example, if `std:: size_t` is 4 bytes wide, the largest object creatable on your system can’t be larger than 4,294,967,295 bytes, because this is the largest number a 4 byte unsigned integer can store. This is only the uppermost limit of an object’s size, the real size limit can be lower depending on the compiler you’re using.

By definition, any object with a size (in bytes) larger than the largest integral value `size_t` can hold is considered ill-formed (and will cause a compile error), as the _sizeof_operator would not be able to return the size without wrapping around.

!!! cite "题外话"

    有些编译器将最大可创建对象的大小限制为`std:: size_t`的最大值(有兴趣可以阅读[这篇文章](https://stackoverflow.com/a/42428240) ).

    实际上，最大可创建对象的大小可能会小于（远小于）这个值，它取决于你的计算机有多少可用的连续内存。
    
