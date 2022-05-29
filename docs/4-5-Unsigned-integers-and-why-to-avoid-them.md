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

	- 

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

1字节(8位)无符号整型的范围为 0 和 255，而1字节有符号整型的范围是 -128 到 127。它们都能够存放256个不同的值，但是有符号整型的一半范围被用来表示负数，而无符号整型则全部用来存放整数，因此能够表示的正数范围是有符号整型的两倍。

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

如果我们尝试把 280 （需要9个位来表示）赋值给一个 8 位无符号整型会发生什么呢？答案是——溢出。

!!! info "作者注"

    奇怪的是，C++标准中明确写道，无符号操作数参与的运算永远不会溢出。这和我们的编程常识（无符号和有符号整型都会溢出）是矛盾的。( [参考文献](https://en.wikipedia.org/wiki/Integer_overflow#Definition_variations_and_ambiguity) ). Given that most programmers would consider this overflow, we’ll call this overflow despite C++’s statements to the contrary.

If an unsigned value is out of range, it is divided by one greater than the largest number of the type, and only the remainder kept.

The number 280 is too big to fit in our 1-byte range of 0 to 255. 1 greater than the largest number of the type is 256. Therefore, we divide 280 by 256, getting 1 remainder 24. The remainder of 24 is what is stored.

Here’s another way to think about the same thing. Any number bigger than the largest number representable by the type simply “wraps around” (sometimes called “modulo wrapping”). 255 is in range of a 1-byte integer, so 255 is fine. 256, however, is outside the range, so it wraps around to the value 0. 257 wraps around to the value 1. 280 wraps around to the value 24.

Let’s take a look at this using 2-byte shorts:

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

COPY

What do you think the result of this program will be?

(Note: If you try to compile the above program, your compiler should issue warnings about overflow or truncation -- you’ll need to disable “treat warnings as errors” to run the program)

```
x was: 65535
x is now: 0
x is now: 1
```

It’s possible to wrap around the other direction as well. 0 is representable in a 2-byte unsigned integer, so that’s fine. -1 is not representable, so it wraps around to the top of the range, producing the value 65535. -2 wraps around to 65534. And so forth.

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

COPY

```
x was: 0
x is now: 65535
x is now: 65534
```

The above code triggers a warning in some compilers, because the compiler detects that the integer literal is out-of-range for the given type. If you want to compile the code anyway, temporarily disable “Treat warnings as errors”.

!!! cite "题外话"

    Many notable bugs in video game history happened due to wrap around behavior with unsigned integers. In the arcade game Donkey Kong, it’s not possible to go past level 22 due to an overflow bug that leaves the user with not enough bonus time to complete the level.

    In the PC game Civilization, Gandhi was known for often being the first one to use nuclear weapons, which seems contrary to his expected passive nature. Players believed this was a result of Gandhi’s aggression setting was initially set at 1, but if he chose a democratic government, he’d get a -2 modifier. This would cause his aggression to overflow to 255, making him maximally aggressive! However, more recently Sid Meier (the game’s author) clarified that this wasn’t actually the case.

## 有关无符号整型的争论

Many developers (and some large development houses, such as Google) believe that developers should generally avoid unsigned integers.

This is largely because of two behaviors that can cause problems.

First, consider the subtraction of two unsigned numbers, such as 3 and 5. 3 minus 5 is -2, but -2 can’t be represented as an unsigned number.

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


On the author’s machine, this seemingly innocent looking program produces the result:

```cpp
4294967294
```


This occurs due to -2 wrapping around to a number close to the top of the range of a 4-byte integer. Another common unwanted wrap-around happens when an unsigned integer is repeatedly decremented by 1 (using the `--` operator). You’ll see an example of this when loops are introduced.

Second, unexpected behavior can result when you mix signed and unsigned integers. In a mathematical operation in C++ (e.g. arithmetic or comparison), if one signed and one unsigned integer are used, the signed integer will be converted to unsigned. And because unsigned integers can not store negative numbers, this can result in loss of data.

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
