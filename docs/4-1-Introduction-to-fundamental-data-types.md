---
title: 4.1 - 基础数据类型简介
alias: 4.1 - 基础数据类型简介
origin: /introduction-to-fundamental-data-types/
origin_title: "4.1 — Introduction to fundamental data types"
time: 2021-12-2
type: translation
tags:
- data type
---

??? note "关键点速记"

	- 变量只是一段可以存放信息的内存的名称

## Bits、bytes 和内存地址

在[[1-3-Introduction-to-objects-and-variables|1.3 - 对象和变量]]中我们介绍过，事实上变量只是一段可以存放信息的内存的名称。简单回忆一下，程序可以使用计算机提供的[[random-access-memory|随机访问内存(RAM)]]。当变量被定义的时候，一块内存被关联到了该变量。

内存的最小单元是一个二进制位（也称为 bit），它可以存储 0 或 1.你可以把一个 bit 看成是一个灯泡的开关——它只有开（1）和关（0）两种状态，没有其他任何中间状态。如果你去观察一段内存内容的话，你总能看到 …011010100101010… 或其他类似组合。

我们将内存分割成一系列连续的单元，称为内存地址。类似于街道地址可以用来查找街道上某幢建筑，通过内存地址我们也可以找到特定地址中存放的内容。 

不够有件事可能出乎你的意料，对于现代计算机体系结构来说，计算机内存中的bit并不都具有一个唯一的地址。这是因为内存地址的数量是有限的，而且也并不需要为每个bit都指定一个唯一的地址。实际上，每个内存地址表示一个 byte 的地址。一个 byte 表示一组被作为一个单元操作的 bit。一般来讲（现代计算机）一个 byte 包含8个连续的 bit。

!!! tldr "关键信息"

	在 C++，我们通常以 byte 为单位操作数据。
	
下图显示了一些内存地址及其内部存放的数据（byte为单位）：

![Memory Addressing](https://www.learncpp.com/images/CppTutorial/Section2/MemoryAddresses.png?ezimgfmt=rs:188x180/rscb2/ng:webp/ngcb2)

!!! cite "题外话"

    在一些老的或者非标的计算机上，一个 byte 可能表示不同长度的 bit（1 到 48 bit 都有可能）—— 不过，你通常不需要担心这个问题，因为现代计算机的事实标准就 8 bit，我们可以假设1个 byte 就是 8个 bit。
    

**数据类型**

由于计算机上所有的数据都只是一些连续的 bit，我们必须要使用**数据类型**（通常简称为类型）告诉计算机如何将内存中的数据解析为有意义的值。我们已经学习了一种数据类型：整型。当一个整型变量被定义时，我们告诉计算机”该变量使用的这一段内存需要被解析为一个整型值“。

当为一个对象进行赋值时，编译器和CPU会将这个值编码成一系列连续的 bit然后存放到内存中（注意：内存只能存放bit）。例如，如果你将一个整型的对象赋值为65，则该值会被转换为 0100 0001 后存放在内存关联的地址中。

反过来，当对象被求值时，这些连续的 bit 会被重新组织成原来的值，即 0100 0001 会被转换为 65。

幸运的是，编译器和CPU会帮助我们完成上述工作，我们通常不需要担心这些值是如何被转换的。

我们的工作仅仅是为变量指定一个我们需要的值。

## 基本数据类型

C++ 具有很多内置的数据类型，称为基础数据类型，也经常被称为基本类型、原始类型或内置类型。

下表是一些基本数据类型，有些可能你已经见过了：

![[datatype.png]]


本章将相继介绍这些基本数据类型（除了 `std::nullptr_t`，我们会在讨论指针时讨论它）。C++  也支持很多复杂类型，称为**复合类型**，我们会在后续的章节中进行介绍。

!!! info "作者注"

	术语 terms `integer` and `integral` are similar, but have different meanings. An `integer` is a specific data type that hold non-fractional numbers, such as whole numbers, 0, and negative whole numbers. `Integral` means “like an integer”. Most often, `integral` is used as part of the term `integral type`, which includes all of the Boolean, characters, and integer types (also enumerated types, which we’ll discuss in [chapter 9](https://www.learncpp.com/#Chapter9)). `Integral type` are named so because they are stored in memory as integers, even though their behaviors might vary (which we’ll see later in this chapter when we talk about the character types).

!!! info "作者注"

	Most modern programming languages include a fundamental `string` type (strings are a data type that lets us hold a sequence of characters, typically used to represent text). In C++, strings aren’t a fundamental type (they’re a compound type). But because basic string usage is straightforward and useful, we’ll introduce strings in this chapter as well (in lesson [4.13 -- An introduction to std::string](https://www.learncpp.com/cpp-tutorial/an-introduction-to-stdstring/)).

## The _t suffix

Many of the types defined in newer versions of C++ (e.g. std::nullptr_t) use a _t suffix. This suffix means “type”, and it’s a common nomenclature applied to modern types.

If you see something with a _t suffix, it’s probably a type. But many types don’t have a _t suffix, so this isn’t consistently applied.