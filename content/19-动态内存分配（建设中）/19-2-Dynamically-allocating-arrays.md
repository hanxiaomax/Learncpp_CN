---
title: 11.12 - 动态分配数组
alias: 11.12 - 动态分配数组
origin: /dynamically-allocating-arrays/
origin_title: "11.12 — Dynamically allocating arrays"
time: 2022-1-2
type: translation
tags:
- arrays
---

> [!note] "Key Takeaway"
> - 使用`new[]`创建动态数组，其长度可以在运行时指定，不需要是常数，但其类型必须是能够被转换为`std::size_t`的类型
> - 使用`new int[legth]{}`分配并初始化数组为全0。从C++11开始，[[initializer-list|初始化值列表]]可以用于动态数组：`new int[5]{ 9, 7, 5, 3, 1 }`
> - 删除动态数组的内存需要使用`delete []`，无需指定大小

除了为单个变量动态分配内存，我们也可以为数组动态分配内存。固定数组的大小必须在编译时已知，而动态分配的数组则可以在运行时确定长度。

为了分配动态数组，我们需要使用`new`和`delete`的数组形式( `new[]` 和 `delete[]`)：

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter a positive integer: ";
    int length{};
    std::cin >> length;

    int* array{ new int[length]{} }; // 使用数组 new，注意这里的length不需要是常数！

    std::cout << "I just allocated an array of integers of length " << length << '\n';

    array[0] = 5; // 元素 0 赋值为 5

    delete[] array; // 使用数组 delete 释放内存

    // 此处不需要将 array 设置为 nullptr/0 因为它马上就会离开作用域被销毁

    return 0;
}
```


因为我们分配的是一个数组，所以C++指定应该使用数组版本的`new`而不是标量版本的`new`。实际上，即使`[]`没有放在`new`后面，调用的也是`new []`。
 
==动态分配的数组长度，其类型必须是能够被转换为`std::size_t`的类型==。在实践中，使用 `int` 作为长度是可以的，因为它可以被转换为 `std::size_t`。

> [!info] "作者注"
> 有人会说，因为数组版本的`new`需要 `size_t`类型的长度值，所以我们应该使用`size_t` 或者能够被[[static-casts|静态类型转换]]成`size_t`的变量类型。
> 但是，我认为这个论点没有说服力，原因有很多。首先，它违背了使用有符号整数而不是无符号整数的最佳实践。其次，当使用整数长度创建动态数组时，按照惯例应该这样做:
> ```cpp
> double* ptr { new double[5] };
> ```
> `5` 是一个整型[[literals|字面量]]，所以我们可以将其隐式转换为 `size_t`。在C++23之前，我们没有办法在不使用`static_cast`的情况下创建一个 `size_t` 字面量。如果C++的设计者要求我们在这里是 `size_t` 的话，他肯定会提供一个创建 `size_t` 字面的方法。
> 最常见的反对意见是，一些迂腐的编译器可能会将此标记为有符号/无符号转换错误(因为我们总是将警告视为错误)。然而，值得注意的是，即使启用了此类警告(' -Wconversion ')， GCC也不会将其标记为有符号/无符号转换错误。
> 虽然使用`size_t`作为动态分配数组的长度没有什么错，但在本系列教程中，我们不会拘于要求使用它。


请注意，由于此动态分配的内存是从不同的地方分配的，而不是用于固定数组的内存，因此数组的大小可以很大。你可以运行上面的程序并分配长度为1,000,000(甚至可能是100,000,000)的数组。试一试！正因为如此，在C++中需要分配大量内存的程序通常需要分配动态内存。


## 动态地删除数组

删除动态分配的数组需要数组版本的`delete`，即 `delete[]`。

这告诉CPU它需要清理多个变量而不是单个变量。新程序员在处理动态内存分配时最常犯的错误之一是在删除动态分配的数组时使用delete而不是`delete[]` 。在数组上使用标量版本的`delete`将导致[[undefined-behavior|未定义行为]]，如数据损坏、内存泄漏、程序崩溃或其他问题。

关于 `delete[]`的一个常见的问题是，`delete`如何知道应该释放多少内存呢？实际上，`new[]`会负责追踪为变量分配的内存的大小，所以 `delete[]` 能够删除该变量实际分配的内存。但是，这段内存的长度值并不能够被开发者获取。


## 动态数组和固定数组几乎是一样的

在 [[17-8-Pointers-and-arrays|11.8 - 指针和数组]] 中，我们知道固定数组变量会持有指向数组首个元素的内存地址。同时我们还知道，固定数组在传递给函数时，会退化为指针，此时数组的长度就无法在函数内被获取了。(此时 `sizeof()`也不可用了)。

对于动态数组来说，它生来就是一个指向数组第一个元素的指针。因此，它也不知道数组的长度。使用动态数组和固定数组上是一致的，但是程序员需要负责释放动态数组的内存。

## 初始化动态分配的数组

如果你想要将动态分配的数组初始化为0，可以这样做：

```cpp
int* array{ new int[length]{} };
```

在C++11之前，并没有将动态数组初始化为非0的简便方法（[[initializer-list|初始化值列表]]只对固定数组有效）。这就意味着你必须使用循环依次为每个元素赋值才行。

```cpp
int* array = new int[5];
array[0] = 9;
array[1] = 7;
array[2] = 5;
array[3] = 3;
array[4] = 1;
```


太麻烦了！

==但是，从C++11开始，[[initializer-list|初始化值列表]]也可以用于初始化动态数组了！==

```cpp
int fixedArray[5] = { 9, 7, 5, 3, 1 }; // initialize a fixed array before C++11
int* array{ new int[5]{ 9, 7, 5, 3, 1 } }; // initialize a dynamic array since C++11
// To prevent writing the type twice, we can use auto. This is often done for types with long names.
auto* array{ new int[5]{ 9, 7, 5, 3, 1 } };
```

注意，在数组长度和初始化值列表之间没有等号。

为了保持一致，固定数组也可以使用[[uniform-initialization|统一初始化]]的方式进行初始化。

```cpp
int fixedArray[]{ 9, 7, 5, 3, 1 }; // initialize a fixed array in C++11
char fixedArray[]{ "Hello, world!" }; // initialize a fixed array in C++11
```

==显式声明数组的大小是可选的。==

## 调整数组大小

动态分配数组允许你在分配时设置数组的长度。但是，C++不提供调整已经分配的数组大小的内置方法。可以通过动态分配新数组、复制元素并删除旧数组来解决这个限制。然而，这很容易出错，特别是当元素类型是类(类有特殊的规则控制它们的创建方式)时。

因此，我们应该避免自己手动调整数组的大小。

幸运的是，如果你需要该功能，C++提供了支持调整大小的容器 `std::vector`。参见：[[16-2-An-introduction-to-std-vector|11.17 — 动态数组 std::vector 简介]]。
