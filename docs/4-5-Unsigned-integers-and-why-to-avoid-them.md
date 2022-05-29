---
title: 4.5 - 无符号整型以及为什么要避免使用它
alias: 4.5 - 无符号整型以及为什么要避免使用它
origin: /unsigned-integers-and-why-to-avoid-them/
origin_title: "4.5 — Unsigned integers, and why to avoid them"
time: 2022-4-11
type: translation
tags:
- integer
- overflow
---

??? note "关键点速记"

    - 无符号整型表示超过范围的数时，实际存储的值为原值除以范围最大值加 1 后的余数。例如，`value mod 2^32`
    - 无符号整型表示超过范围的数时不会产生未定义行为，它的行为是确定的
    - C++ 标准明确说明无符号整型不会溢出

## 无符号整型

在上节课 ([[4-4-Signed-integers|4.4 - 有符号整型]]) 中，我们介绍了有符号整型，这些征信可以保存正负整数和 0。

C++ 还支持无符号整型。无符号整型只能表示非符整数。

## 定义无符号整型

定义无符号整型，需要使用 `unsigned` 关键字。通常来讲，该关键字应该写在类型前：

```cpp
unsigned short us;
unsigned int ui;
unsigned long ul;
unsigned long long ull;
```

## 无符号整型的范围

1 字节(8 位)无符号整型的范围为 0 和 255，而 1 字节有符号整型的范围是 -128 到 127。它们都能够存放 256 个不同的值，但是有符号整型的一半范围被用来表示负数，而无符号整型则全部用来存放整数，因此能够表示的正数范围是有符号整型的两倍。

下表展示了不同有符号整型可以表示的范围：

|大小/类型    |范围|
|---|---|
|1 byte unsigned    |0 到 255
|2 byte unsigned    |0 到 65,535
|4 byte unsigned    |0 到 4,294,967,295
|8 byte unsigned    |0 到 18,446,744,073,709,551,615

一个 n 为的无符号整型可表示的范围为 0 到 $(2^n)-1$。

如果不需要表示负数，那么无符号整型更适合在内存比较小的网络和系统上使用，因为它可以在不占用更多内存的前提下保存更多的正整数。

## 分清有符号(signed) 和无符号(unsigned)

很多新手程序员经常把有符号(signed) 和无符号(unsigned)这两个术语搞混。以下介绍一种简单的方法来记忆它们的不同：为了区分负数和正数，我们需要负号。如果没有指定符号，我们假定该数为正数。这样一来，具有符号的整型（有符号整型）可以区分正负。而不具有符号的整型（有符号整型）则全部为正数。

## 无符号整型溢出

What happens if we try to store the number 280 (which requires 9 bits to represent) in a 1-byte (8-bit) unsigned integer? The answer is overflow.

如果我们尝试把 280 （需要 9 个位来表示）赋值给一个 8 位无符号整型会发生什么呢？答案是——溢出。

!!! info "作者注"

    奇怪的是，C++标准中明确写道，无符号操作数参与的运算永远不会溢出。这和我们的编程常识（无符号和有符号整型都会溢出）是矛盾的。( [参考文献](https://en.wikipedia.org/wiki/Integer_overflow#Definition_variations_and_ambiguity) )。由于大多数的程序员都会考虑该溢出，我们这里也沿用了该说法，尽管和C++标准有所矛盾。

当无符号值超过范围时，它会被除以该类型的最大值加 1，且只保留余数。

280 不在 0 到 255 的范围内。该范围的最大值+1 是 256，所以 280 会除以 256，余数为 24。最终 24 会被存放到内存中。

这个问题还可以这样理解。比最大值还大的数在存放时会被“wraps around” (有时候也称为“modulo wrapping”)，即从 0 开始重新计算。255 在 1 字节整型的表示范围内，所以 255 没问题。而 256 则超过了范围，因此它会被归为 0。257 则会归为 1。280 则归为 24.

这里是一个 2 字节无符号短整型（ `unsigned short`） 的例子：

```cpp
#include <iostream>

int main()
{
    unsigned short x{ 65535 }; // largest 16-bit unsigned value possible
    std::cout << "x was: " << x << '\n';

    x = 65536; // 65536 is out of our range, so we get wrap-around
    std::cout << "x is now: " << x << '\n';

    x = 65537; // 65537 is out of our range, so we get wrap-around
    std::cout << "x is now: " << x << '\n';

    return 0;
}
```

!!! note "译者注"

    无符号不会溢出，的确是 C++标准，不溢出这个说法也是合理的，因为无符号在遇到超过表示范围的情况时并不会表现出未定义行为，结果也不是简单的丢弃，而是对原值进行求模运算。英文叫 warp around，即从 0 开始重新计算。例如，对于 32 位无符号，超出范围时结果等于 `value mod 2^32`

你觉得程序的结果会是什么呢？

(注意，如果你编译上述程序的话，编译器可能会产生关于溢出或截断的告警——你需要关闭”将告警看做错误“功能，才能运行该程序）

```
x was: 65535
x is now: 0
x is now: 1
```

向另一个方向 wrap 也是可以的，0 可以被 2 字节大小的无符号整型表示，但是-1 不可以，因此它会被 wrap 到最大值，结果为 65535。-2 的结果是 65534。

```cpp
#include <iostream>

int main()
{
    unsigned short x{ 0 }; // smallest 2-byte unsigned value possible
    std::cout << "x was: " << x << '\n';

    x = -1; // -1 is out of our range, so we get wrap-around
    std::cout << "x is now: " << x << '\n';

    x = -2; // -2 is out of our range, so we get wrap-around
    std::cout << "x is now: " << x << '\n';

    return 0;
}
```

```
x was: 0
x is now: 65535
x is now: 65534
```

上述代码会引起某些编译器产生告警，因为编译器检测到整型字面量超过了表示它的类型的范围。如果你希望编译上述代码，请暂时关闭”将告警看做错误“功能。

!!! cite "题外话"

    很多电子游戏史上的著名的 bug 都和无符号数反转有关。街机游戏《大金刚》中，你不可能通过22关，因为溢出bug导致用户在这一关中不可能有足够的时间。
    
    电脑游戏《文明》中，甘地通常是第一个使用核武器的，这和他本应该有的保守的属性非常矛盾。玩家认为这是由于甘地的攻击性被初始化成1，但是如果他走民主路线的话，其攻击性会-2。进而导致了数值被反转成了255，使其变得非常好斗。不过，最近席德梅尔对此进行了澄清，他说这并不是引起上述问题的原因。

## 有关无符号整型的争论

很多程序员 (以及一些大厂，例如谷歌）认为程序也应该避免使用无符号整型。

这主要是因为无符号整型有两种行为可能会导致问题。

首先，将两个无符号整型相减，例如3-5等于-2，但是-2不能被无符号整型表示。

```cpp
#include <iostream>

int main()
{
    unsigned int x{ 3 };
    unsigned int y{ 5 };

    std::cout << x - y << '\n';
    return 0;
}
```

在笔者的机器上，尽管上面的代码看上去人畜无害，实际上结果却令人吃惊：

```cpp
4294967294
```

这是因为 -2 被反转到了一个接近 4自己整型最大值的数。另外一个可能产生反转的情况是，对无符号整型使用递减运算符(`--`)。那么当变量循环递减时，最终可能会发生于上述例子中同样的问题。
.
此外，如果你将有符号zheSecond, unexpected behavior can result when you mix signed and unsigned integers. In a mathematical operation in C++ (e.g. arithmetic or comparison), if one signed and one unsigned integer are used, the signed integer will be converted to unsigned. And because unsigned integers can not store negative numbers, this can result in loss of data.

Consider the following program demonstrating this:

```cpp
#include <iostream>

int main()
{
    signed int s { -1 };
    unsigned int u { 1 };

    if (s < u) // -1 is implicitly converted to 4294967295, and 4294967295 < 1 is false
        std::cout << "-1 is less than 1\n";
    else
        std::cout << "1 is less than -1\n"; // this statement executes

    return 0;
}
```

This program is well formed, compiles, and is logically consistent to the eye. But it prints the wrong answer. And while your compiler should warn you about a signed/unsigned mismatch in this case, your compiler will also generate identical warnings for other cases that do not suffer from this problem (e.g. when both numbers are positive), making it hard to detect when there is an actual problem.

!!! info "相关内容"

    We cover if-statements in upcoming lesson [[4-10-Introduction-to-if-statements|4.10 - if 语句]]

Additionally, there are other problematic cases that are essentially undetectable. Consider the following:

```cpp
void doSomething(unsigned int x)
{
    // Run some code x times

    std::cout << "x is " << x << '\n';
}

int main()
{
    doSomething(-1);

    return 0;
}
```

The author of doSomething() was expecting someone to call this function with only positive numbers. But the caller is passing in _-1_ -- clearly a mistake, but one made none-the-less. What happens in this case?

The signed argument of _-1_ gets implicitly converted to an unsigned parameter. -1 isn’t in the range of an unsigned number, so it wraps around to some large number (probably 4294967295). Then your program goes ballistic. Worse, there’s no good way to guard against this condition from happening. C++ will freely convert between signed and unsigned numbers, but it won’t do any range checking to make sure you don’t overflow your type.

All of these problems are commonly encountered, produce unexpected behavior, and are hard to find, even using automated tools designed to detect problem cases.

Given the above, the somewhat controversial best practice that we’ll advocate for is to avoid unsigned types except in specific circumstances.

!!! success "最佳实践"

    Favor signed numbers over unsigned numbers for holding quantities (even quantities that should be non-negative) and mathematical operations. Avoid mixing signed and unsigned numbers.

!!! info "相关内容"

    Additional material in support of the above recommendations (also covers refutation of some common counter-arguments):

    1.  [Interactive C++ panel](https://www.youtube.com/watch?v=_nrly6PH6NU) (see 12:12-13:08,42:40-45:26, and 1:02:50-1:03:15)
    2.  [Subscripts and sizes should be signed](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2019/p1428r0.pdf)
    3.  [Unsigned integers from the libtorrent blog](https://blog.libtorrent.org/2016/05/unsigned-integers/)

## So when should you use unsigned numbers?

There are still a few cases in C++ where it’s okay / necessary to use unsigned numbers.

First, unsigned numbers are preferred when dealing with bit manipulation (covered in chapter O -- that’s a capital ‘o’, not a ‘0’). They are also useful when well-defined wrap-around behavior is required (useful in some algorithms like encryption and random number generation).

Second, use of unsigned numbers is still unavoidable in some cases, mainly those having to do with array indexing. We’ll talk more about this in the lessons on arrays and array indexing. In these cases, the unsigned value can be converted to a signed value.

!!! info "相关内容"

    We discuss how to convert unsigned values to signed values in lesson [[4-12-Introduction-to-type-conversion-and-static_cast|4.12 - 类型转换和 static_cast]]

Also note that if you’re developing for an embedded system (e.g. an Arduino) or some other processor/memory limited context, use of unsigned numbers is more common and accepted (and in some cases, unavoidable) for performance reasons.
