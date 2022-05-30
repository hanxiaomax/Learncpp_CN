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

??? note "关键点速记"

	- 从C语言继承而来的整型大小是不固定的，最小是2字节，但是更多时候是4字节。
	- C99和C++11提供了固定宽度整型，通过头文件`<cstdint>`可以使用。缺点是并非所有机器上都有定义且可能会影响性能
	- C++提供了速度优先和大小优先的两类固定宽度整型
	- 避免使用8位固定宽度整型。如果一定要使用，请注意它们的行为更类似于字符。


上面的课程中我们介绍了整型，并且提到 C++ 只保证整型值占用空间的最小值——但是它占用的空间可以更大，这取决于具体的系统。

## 为什么整型的大小不是固定的？

简而言之，这还是从 C 语言继承而来的。在计算机非常慢的年代，性能是最需要被考虑的问题。C 语言选择故意不去固定整型的大小，以便编译器的实现者可以为目标计算机选择最合适的整型大小以提高性能。

## 很讨厌是吧？

从现代标准的角度来讲，是的。作为程序员还要处理类型范围不确定的情况确实有点荒唐。

考虑 `int` 类型，其占用内存最小为 2 字节，但是在现代计算机上却经常为 4 字节。如果你假设 int 是 4 个字节（确实 4 字节情况最有可能），那么你的程序在 `int` 实际只占两个字节的计算机上就会产生异常的行为（因为你很可能把一个需要 4 字节才能存放的值存放到了实际只有 2 个字节的变量中，这会导致溢出或未定义行为）。而如果你假设 `int` 只有两个字节以便获得最好的兼容性，那么在 4 字节系统上无疑会浪费两个字节，这会使得你的内存使用成倍增加！

## 固定宽度整型

为了解决这个问题，C99 定义了一组固定宽度整形（位于 `stdint.h`）来确保整型在不同的计算机体系结构下都具有相同的大小。

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

C++ 在 C++11 中官方吸纳了这些固定宽度整型。通过包含 `<cstdint>` 头文件就可以使用它们，它们被定义在 `std` 命名空间中。

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

其次，如果你使用了固定宽度整型，它的性能相较于使用更宽的类型可能或稍差（在同样的体系结构下）。例如，如果你需要一个大小确定为 32 位的整型，你可能会使用 `std:: int32_t`，但是你的 CPU 可能在处理 64 位整形时更快。不过，即便 CPU 能够更快的处理某种给定的类型，也不一定意味着程序的运行速度更快——现代程序更多受限于内存使用而不是 CPU 处理速度。使用更大的内存足迹(memory footprint)带来的性能损失可能会超过 CPU 对其进行的加速。不经实际测试是很难进行对比的。

## 速度优先整型和尺寸优先整型

为了解决上述问题，C++还定义了另外两组整型，并确保它们总是具有定义。

速度优先的类类型(`std:: int_fast#_t` 和 `std:: uint_fast#_t`) 提供了最快的有符号和无符号整型，同时其宽度最小为 `#` 位 ( `#` = 8、16、32 或 64)。例如，`std:: int_fast32_t` 可以定义宽度最小为 32 位且速度最快的有符号整型。

尺寸优先的类型(`std:: int_least#_t` 和 `std:: uint_least#_t`) 提供了最小的有符号和无符号整型，其宽度为 `#` 位 (`#` = 8、16、32 或 64)。例如，`std:: uint_least32_t` 可以定义宽度至少为 32 位的最小的无符号整型。

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

可以看出 `std:: int_least16_t` 是 16 位的，但是 `std:: int_fast16_t` 实际上却是 32 位。这是因为在作者的机器上，32 位整型的处理速度要比 16 位块。

然而，这两种类型也有其缺点：首先，使用它们的程序员实际上并不多，不熟悉的情况使用它们会造成错误。另外，速度优先的类型同样也会带来和 4 比特宽整型一样的内存浪费问题。更严重的是，因为这两种整型类型的大小是变化的，那么可能会造成你的程序在不同体系结构的电脑上行为有所不同。例如：

```cpp
#include <cstdint> // for fixed-width integers
#include <iostream>

int main()
{
    std::uint_fast16_t sometype { 0 };
    --sometype; // 故意利用无符号整型反转的特性

    std::cout << sometype;

    return 0;
}
```

上述代码的输出结果取决于 `std:: uint_fast16_t` 是 16 位、32 位还是 64 位。

除非能在对应的平台上进行测试，否则我们很难预知程序在什么平台上运行时会出问题，而对于开发者来说，我们能够使用的平台种类并不会很多。

## std:: int8_t 和 std:: uint8_t 的行为可能更像字符而非整型

由于对C++标准研究不够仔细，很多编译器定义和对待 `std:: int8_t` 和 `std:: uint8_t`类型(以及其对应的速度或大小优先的固定宽度类型) 的方式和 `signed char`与`unsigned char`是完全一样的。这也就意味着8位的类型可能（也可能不）与其他固定宽度类型具有不同的行为，这有可能造成错误。具体的行为和系统相关，所以在某个平台上正常工作的程序在其他平台上可能无法工作或编译。

我们会在[[4-12-Introduction-to-type-conversion-and-static_cast|4.12 - 类型转换和 static_cast]]中举例说明。

为了保持一致性，最好能够避免使用 _`std:: int8_t` 和 `std:: uint8_t` (以及其相关的速度或大小优先类型) 。可以使用 `std:: int16_t`或 `std:: uint16_t` 代替。

!!! warning "注意"

    避免使用8位固定宽度整型。如果一定要使用，请注意它们的行为更类似于字符。
    

## 整型类型选择的最佳实践

由于各种基础整型类型都存在各自的优缺点，如固定宽度整型类型，速度/大小优先的固定宽度整型类型以及有符号无符号整型。我们需要在使用时参考一些最佳实践。

我们的宗旨是，正确性优于速度，编译时发现错误优于运行时发现错误——基于这个指导原则，我们建议避免使用速度/大小优先的固定宽度整型类型，使用固定ce is that it’s better to be correct than fast, better to fail at compile time than runtime -- therefore, we recommend avoiding the fast/least types in favor of the fixed-width types. If you later discover the need to support a platform for which the fixed-width types won’t compile, then you can decide how to migrate your program (and thoroughly test) at that point.

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

    有些编译器将最大可创建对象的大小限制为 `std:: size_t` 的最大值(有兴趣可以阅读 [这篇文章](https://stackoverflow.com/a/42428240) ).

    实际上，最大可创建对象的大小可能会小于（远小于）这个值，它取决于你的计算机有多少可用的连续内存。
