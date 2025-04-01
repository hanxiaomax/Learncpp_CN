---
title: O.3 - 使用位运算符和掩码操作位
alias: O.3 - 使用位运算符和掩码操作位
origin: /bit-manipulation-with-bitwise-operators-and-bit-masks/
origin_title: "O.3 — Bit manipulation with bitwise operators and bit masks"
time: 2022-6-1
type: translation
tags:
- bit
---

> [!note] "Key Takeaway"

## 位掩码

为了操作单个位（例如打开或关闭它们），我们需要一些方法来识别我们想要操作的特定位。不幸的是，按位运算符不知道如何处理位位置。相反，他们使用位掩码。

**位掩码**是一组预定义的位，用于选择哪些特定位将被后续操作修改。

考虑一个真实的案例，您想要绘制一个窗框。如果您不小心，您不仅会冒着粉刷窗框的风险，还会冒着粉刷玻璃本身的风险。您可以购买一些遮蔽胶带并将其贴在玻璃和您不想涂漆的任何其他部件上。然后，当您绘画时，遮蔽胶带会阻止油漆接触到您不想涂漆的任何东西。最后，只有未遮罩的部分（您要绘制的部分）被绘制。

位掩码本质上对位执行相同的功能——**位掩码阻止按位运算符接触我们不想修改的位，并允许访问我们确实想要修改的位。**

让我们首先探讨如何定义一些简单的位掩码，然后我们将向您展示如何使用它们。

## 在 C++14 中定义位掩码

最简单的一组位掩码是为每个位位置定义一个位掩码。我们用 0 来屏蔽我们不关心的位，用 1 来表示我们想要修改的位。

尽管位掩码可以是文字，但它们通常被定义为符号常量，因此可以为它们指定一个有意义的名称并易于重用。

因为 C++14 支持二进制文字，所以定义这些位掩码很容易：

```cpp
#include <cstdint>

constexpr std::uint8_t mask0{ 0b0000'0001 }; // represents bit 0
constexpr std::uint8_t mask1{ 0b0000'0010 }; // represents bit 1
constexpr std::uint8_t mask2{ 0b0000'0100 }; // represents bit 2
constexpr std::uint8_t mask3{ 0b0000'1000 }; // represents bit 3
constexpr std::uint8_t mask4{ 0b0001'0000 }; // represents bit 4
constexpr std::uint8_t mask5{ 0b0010'0000 }; // represents bit 5
constexpr std::uint8_t mask6{ 0b0100'0000 }; // represents bit 6
constexpr std::uint8_t mask7{ 0b1000'0000 }; // represents bit 7
```

现在我们有一组代表每个位位置的符号常量。我们可以使用这些来操作位（稍后我们将展示如何操作）。

## 在 C++11 或更早版本中定义位掩码

因为 **C++11 不支持二进制文字**，我们必须使用其他方法来设置符号常量。有两种很好的方法可以做到这一点。

第一种方法是使用十六进制文字。

相关内容

我们在[[5-2-Literals|5.2 - 字面量]]中讨论了十六进制。

十六进制转二进制的方法如下：

| 十六进制 | 0    | 1    | 2    | 3    | 4    | 5    | 6    | 7    | 8    | 9    | A    | B    | C    | D    | E    | F    |
| -------- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 二进制   | 0000 | 0001 | 0010 | 0011 | 0100 | 0101 | 0110 | 0111 | 1000 | 1001 | 1010 | 1011 | 1100 | 1101 | 1110 | 1111 |

因此，我们可以像这样使用十六进制定义位掩码：

```cpp
constexpr std::uint8_t mask0{ 0x01 }; // hex for 0000 0001
constexpr std::uint8_t mask1{ 0x02 }; // hex for 0000 0010
constexpr std::uint8_t mask2{ 0x04 }; // hex for 0000 0100
constexpr std::uint8_t mask3{ 0x08 }; // hex for 0000 1000
constexpr std::uint8_t mask4{ 0x10 }; // hex for 0001 0000
constexpr std::uint8_t mask5{ 0x20 }; // hex for 0010 0000
constexpr std::uint8_t mask6{ 0x40 }; // hex for 0100 0000
constexpr std::uint8_t mask7{ 0x80 }; // hex for 1000 0000
```

有时会省略前导的十六进制 0（例如，`0x01`您只会看到`0x1`）。无论哪种方式，如果您不熟悉十六进制到二进制的转换，这可能有点难以阅读。

一种更简单的方法是使用左移运算符将一位移动到正确的位置：

```cpp
constexpr std::uint8_t mask0{ 1 << 0 }; // 0000 0001
constexpr std::uint8_t mask1{ 1 << 1 }; // 0000 0010
constexpr std::uint8_t mask2{ 1 << 2 }; // 0000 0100
constexpr std::uint8_t mask3{ 1 << 3 }; // 0000 1000
constexpr std::uint8_t mask4{ 1 << 4 }; // 0001 0000
constexpr std::uint8_t mask5{ 1 << 5 }; // 0010 0000
constexpr std::uint8_t mask6{ 1 << 6 }; // 0100 0000
constexpr std::uint8_t mask7{ 1 << 7 }; // 1000 0000
```

## 测试一下（看它是1还是0）

现在我们有了一组位掩码，我们可以将它们与位标志变量结合使用来操作我们的位标志。

要确定某个位是开还是关，我们使用*按位与*结合相应位的位掩码：

```cpp
#include <cstdint>
#include <iostream>

int main()
{
	constexpr std::uint8_t mask0{ 0b0000'0001 }; // represents bit 0
	constexpr std::uint8_t mask1{ 0b0000'0010 }; // represents bit 1
	constexpr std::uint8_t mask2{ 0b0000'0100 }; // represents bit 2
	constexpr std::uint8_t mask3{ 0b0000'1000 }; // represents bit 3
	constexpr std::uint8_t mask4{ 0b0001'0000 }; // represents bit 4
	constexpr std::uint8_t mask5{ 0b0010'0000 }; // represents bit 5
	constexpr std::uint8_t mask6{ 0b0100'0000 }; // represents bit 6
	constexpr std::uint8_t mask7{ 0b1000'0000 }; // represents bit 7

	std::uint8_t flags{ 0b0000'0101 }; // 8 bits in size means room for 8 flags

	std::cout << "bit 0 is " << ((flags & mask0) ? "on\n" : "off\n");
	std::cout << "bit 1 is " << ((flags & mask1) ? "on\n" : "off\n");

	return 0;
}
```

这打印：

```
bit 1 is off
bit 1 is on
```

## 置1一位

要设置（置1）位，我们将按位或等于（运算符 |=）与相应位的位掩码结合使用：

```cpp
#include <cstdint>
#include <iostream>

int main()
{
    constexpr std::uint8_t mask0{ 0b0000'0001 }; // represents bit 0
    constexpr std::uint8_t mask1{ 0b0000'0010 }; // represents bit 1
    constexpr std::uint8_t mask2{ 0b0000'0100 }; // represents bit 2
    constexpr std::uint8_t mask3{ 0b0000'1000 }; // represents bit 3
    constexpr std::uint8_t mask4{ 0b0001'0000 }; // represents bit 4
    constexpr std::uint8_t mask5{ 0b0010'0000 }; // represents bit 5
    constexpr std::uint8_t mask6{ 0b0100'0000 }; // represents bit 6
    constexpr std::uint8_t mask7{ 0b1000'0000 }; // represents bit 7

    std::uint8_t flags{ 0b0000'0101 }; // 8 bits in size means room for 8 flags

    std::cout << "bit 1 is " << ((flags & mask1) ? "on\n" : "off\n");

    flags |= mask1; // turn on bit 1

    std::cout << "bit 1 is " << ((flags & mask1) ? "on\n" : "off\n");

    return 0;
}
```

这打印：

```
bit 1 is off
bit 1 is on
```

*我们还可以使用按位或*同时置1多个位：

```cpp
flags |= (mask4 | mask5); // turn bits 4 and 5 on at the same time
```

## 置0一位

要清除位（置0），我们同时使用*按位与*和*按位非*：

```cpp
#include <cstdint>
#include <iostream>

int main()
{
    constexpr std::uint8_t mask0{ 0b0000'0001 }; // represents bit 0
    constexpr std::uint8_t mask1{ 0b0000'0010 }; // represents bit 1
    constexpr std::uint8_t mask2{ 0b0000'0100 }; // represents bit 2
    constexpr std::uint8_t mask3{ 0b0000'1000 }; // represents bit 3
    constexpr std::uint8_t mask4{ 0b0001'0000 }; // represents bit 4
    constexpr std::uint8_t mask5{ 0b0010'0000 }; // represents bit 5
    constexpr std::uint8_t mask6{ 0b0100'0000 }; // represents bit 6
    constexpr std::uint8_t mask7{ 0b1000'0000 }; // represents bit 7

    std::uint8_t flags{ 0b0000'0101 }; // 8 bits in size means room for 8 flags

    std::cout << "bit 2 is " << ((flags & mask2) ? "on\n" : "off\n");

    flags &= ~mask2; // turn off bit 2

    std::cout << "bit 2 is " << ((flags & mask2) ? "on\n" : "off\n");

    return 0;
}
```

这打印：

```
bit 2 is on
bit 2 is off
```

我们可以同时关闭多个位：

```cpp
flags &= ~(mask4 | mask5); // turn bits 4 and 5 off at the same time
```

## 翻转一位 

要切换位状态，我们使用*按位异或*：

```cpp
#include <cstdint>
#include <iostream>

int main()
{
    constexpr std::uint8_t mask0{ 0b0000'0001 }; // represents bit 0
    constexpr std::uint8_t mask1{ 0b0000'0010 }; // represents bit 1
    constexpr std::uint8_t mask2{ 0b0000'0100 }; // represents bit 2
    constexpr std::uint8_t mask3{ 0b0000'1000 }; // represents bit 3
    constexpr std::uint8_t mask4{ 0b0001'0000 }; // represents bit 4
    constexpr std::uint8_t mask5{ 0b0010'0000 }; // represents bit 5
    constexpr std::uint8_t mask6{ 0b0100'0000 }; // represents bit 6
    constexpr std::uint8_t mask7{ 0b1000'0000 }; // represents bit 7

    std::uint8_t flags{ 0b0000'0101 }; // 8 bits in size means room for 8 flags

    std::cout << "bit 2 is " << ((flags & mask2) ? "on\n" : "off\n");
    flags ^= mask2; // flip bit 2
    std::cout << "bit 2 is " << ((flags & mask2) ? "on\n" : "off\n");
    flags ^= mask2; // flip bit 2
    std::cout << "bit 2 is " << ((flags & mask2) ? "on\n" : "off\n");

    return 0;
}
```

这打印：

```
bit 2 is on
bit 2 is off
bit 2 is on
```

我们可以同时翻转多个位：

```cpp
flags ^= (mask4 | mask5); // flip bits 4 and 5 at the same time
```

## 位掩码和 std::bitset

std::bitset 支持全套位运算符。因此，尽管使用函数（测试、设置、重置和翻转）修改单个位更容易，但您可以根据需要使用按位运算符和位掩码。

你为什么要这样做？**这些函数test(),set(),reset(),flip()只允许您修改单个位。按位运算符允许您一次修改多个位。**

```cpp
#include <cstdint>
#include <iostream>
#include <bitset>

int main()
{
	constexpr std::bitset<8> mask0{ 0b0000'0001 }; // represents bit 0
	constexpr std::bitset<8> mask1{ 0b0000'0010 }; // represents bit 1
	constexpr std::bitset<8> mask2{ 0b0000'0100 }; // represents bit 2
	constexpr std::bitset<8> mask3{ 0b0000'1000 }; // represents bit 3
	constexpr std::bitset<8> mask4{ 0b0001'0000 }; // represents bit 4
	constexpr std::bitset<8> mask5{ 0b0010'0000 }; // represents bit 5
	constexpr std::bitset<8> mask6{ 0b0100'0000 }; // represents bit 6
	constexpr std::bitset<8> mask7{ 0b1000'0000 }; // represents bit 7

	std::bitset<8> flags{ 0b0000'0101 }; // 8 bits in size means room for 8 flags
	std::cout << "bit 1 is " << (flags.test(1) ? "on\n" : "off\n");
	std::cout << "bit 2 is " << (flags.test(2) ? "on\n" : "off\n");

	flags ^= (mask1 | mask2); // flip bits 1 and 2
	std::cout << "bit 1 is " << (flags.test(1) ? "on\n" : "off\n");
	std::cout << "bit 2 is " << (flags.test(2) ? "on\n" : "off\n");

	flags |= (mask1 | mask2); // turn bits 1 and 2 on
	std::cout << "bit 1 is " << (flags.test(1) ? "on\n" : "off\n");
	std::cout << "bit 2 is " << (flags.test(2) ? "on\n" : "off\n");

	flags &= ~(mask1 | mask2); // turn bits 1 and 2 off
	std::cout << "bit 1 is " << (flags.test(1) ? "on\n" : "off\n");
	std::cout << "bit 2 is " << (flags.test(2) ? "on\n" : "off\n");

	return 0;
}
```

这打印：

```
bit 1 is off
bit 2 is on
bit 1 is on
bit 2 is off
bit 1 is on
bit 2 is on
bit 1 is off
bit 2 is off
```

## 使位掩码有意义

将我们的位掩码命名为“mask1”或“mask2”可以告诉我们正在操作的是哪个位，但不会告诉我们该位标志实际用于什么。

最佳做法是为您的位掩码提供有用的名称，作为记录位标志含义的一种方式。这是我们可能编写的游戏的示例：

```cpp
#include <cstdint>
#include <iostream>

int main()
{
        // Define a bunch of physical/emotional states
	constexpr std::uint8_t isHungry{	1 << 0 }; // 0000 0001
	constexpr std::uint8_t isSad{		1 << 1 }; // 0000 0010
	constexpr std::uint8_t isMad{		1 << 2 }; // 0000 0100
	constexpr std::uint8_t isHappy{		1 << 3 }; // 0000 1000
	constexpr std::uint8_t isLaughing{ 	1 << 4 }; // 0001 0000
	constexpr std::uint8_t isAsleep{	1 << 5 }; // 0010 0000
	constexpr std::uint8_t isDead{		1 << 6 }; // 0100 0000
	constexpr std::uint8_t isCrying{	1 << 7 }; // 1000 0000

	std::uint8_t me{}; // all flags/options turned off to start
	me |= (isHappy | isLaughing); // I am happy and laughing
	me &= ~isLaughing; // I am no longer laughing

	// Query a few states
	// (we'll use static_cast<bool> to interpret the results as a boolean value)
	std::cout << "I am happy? " << static_cast<bool>(me & isHappy) << '\n';
	std::cout << "I am laughing? " << static_cast<bool>(me & isLaughing) << '\n';

	return 0;
}
```

下面是使用 std::bitset 实现的相同示例：

```cpp
#include <iostream>
#include <bitset>

int main()
{
        // Define a bunch of physical/emotional states
	constexpr std::bitset<8> isHungry{	0b0000'0001 };
	constexpr std::bitset<8> isSad{		0b0000'0010 };
	constexpr std::bitset<8> isMad{		0b0000'0100 };
	constexpr std::bitset<8> isHappy{	0b0000'1000 };
	constexpr std::bitset<8> isLaughing{	0b0001'0000 };
	constexpr std::bitset<8> isAsleep{	0b0010'0000 };
	constexpr std::bitset<8> isDead{	0b0100'0000 };
	constexpr std::bitset<8> isCrying{	0b1000'0000 };


	std::bitset<8> me{}; // all flags/options turned off to start
	me |= (isHappy | isLaughing); // I am happy and laughing
	me &= ~isLaughing; // I am no longer laughing

	// Query a few states (we use the any() function to see if any bits remain set)
	std::cout << "I am happy? " << (me & isHappy).any() << '\n';
	std::cout << "I am laughing? " << (me & isLaughing).any() << '\n';

	return 0;
}
```

这里有两个注意事项：首先，std::bitset 没有允许您使用位掩码查询位的好函数。因此，如果您想使用位掩码而不是位置索引，则必须使用*按位与*查询位。其次，我们使用 any() 函数，如果设置了任何位，该函数返回 true，否则返回 false，以查看我们查询的位是否保持打开或关闭。

## 什么时候位标志最有用？

细心的读者可能会注意到，上面的示例实际上并没有节省任何内存。8 个布尔值通常需要 8 个字节。但是上面的例子使用了 9 个字节（8 个字节用于定义位掩码，1 个字节用于标志变量）！

当您有许多相同的标志变量时，位标志最有意义。例如，在上面的示例中，假设您有 100 个而不是一个人（我）。如果您每个人使用 8 个布尔值（每个可能的状态一个），您将使用 800 个字节的内存。对于位标志，您将使用 8 个字节作为位掩码，使用 100 个字节作为位标志变量，总共需要 108 个字节的内存——大约减少 8 倍的内存。

对于大多数程序，使用位标志节省的内存量不值得增加复杂性。但是在有数万甚至数百万个相似对象的程序中，使用位标志可以大大减少内存使用。如果需要，将其包含在您的工具包中是一项有用的优化。

在另一种情况下，位标志和位掩码是有意义的。想象一下，您有一个函数可以采用 32 种不同选项的任意组合。编写该函数的一种方法是使用 32 个单独的布尔参数：

```cpp
void someFunction(bool option1, bool option2, bool option3, bool option4, bool option5, bool option6, bool option7, bool option8, bool option9, bool option10, bool option11, bool option12, bool option13, bool option14, bool option15, bool option16, bool option17, bool option18, bool option19, bool option20, bool option21, bool option22, bool option23, bool option24, bool option25, bool option26, bool option27, bool option28, bool option29, bool option30, bool option31, bool option32);
```

希望你能给你的参数起更具描述性的名字，但这里的重点是向你展示参数列表是多么令人讨厌。

然后当你想调用选项 10 和 32 设置为 true 的函数时，你必须这样做：

```cpp
someFunction(false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true);
```

这非常难以阅读（选项 9、10 或 11 是否设置为 true？），并且还意味着您必须记住哪个参数对应于哪个选项（将“编辑标志”设置为第 9、10 或第 11 个参数？）它也可能不是很高效，因为每个函数调用都必须将 32 个布尔值从调用者复制到函数。

相反，如果您使用这样的位标志定义函数：

```cpp
void someFunction(std::bitset<32> options);
```

然后你可以使用位标志来只传递你想要的选项：

```cpp
someFunction(option10 | option32);
```

这不仅更具可读性，而且性能也可能更高，因为它只涉及 2 个操作（一个*按位或*和一个参数复制）。

这就是广受好评的 3d 图形库 OpenGL 选择使用位标志参数而不是许多连续的布尔参数的原因之一。

下面是来自 OpenGL 的示例函数调用：

```cpp
glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT); // clear the color and the depth buffer
```

GL_COLOR_BUFFER_BIT 和 GL_DEPTH_BUFFER_BIT 是位掩码，定义如下（在 gl2.h 中）：

```cpp
#define GL_DEPTH_BUFFER_BIT               0x00000100
#define GL_STENCIL_BUFFER_BIT             0x00000400
#define GL_COLOR_BUFFER_BIT               0x00004000
```

## 涉及多个位的位掩码

尽管位掩码通常用于选择单个位，但它们也可用于选择多个位。让我们看一个稍微复杂一点的例子。

电视机、显示器等彩色显示设备由数百万个像素组成，每个像素都可以显示一个颜色的点。颜色点由三束光组成：一束红色、一束绿色和一束蓝色 (RGB)。通过改变颜色的强度，可以制成色谱上的任何颜色。通常，给定像素的 R、G 和 B 的数量由 8 位无符号整数表示。例如，红色像素的 R=255、G=0、B=0。紫色像素的 R=255、G=0、B=255。中灰色像素将具有 R=127、G=127、B=127。

在为像素分配颜色值时，除了 R、G 和 B 之外，通常还会使用称为 A 的第 4 个值。“A”代表“alpha”，它控制颜色的透明度。如果 A=0，颜色是完全透明的。如果 A=255，则颜色不透明。

R、G、B 和 A 通常存储为单个 32 位整数，每个分量使用 8 位：

| 32 位 RGBA 值 |          |          |          |
| ------------- | -------- | -------- | -------- |
| 31-24 位      | 23-16 位 | 15-8 位  | 7-0 位   |
| RRRRRRRR      | GGGGGGGG | BBBBBBBB | AAAAAAAA |
| red           | green    | blue     | alpha    |

下面的程序要求用户输入一个 32 位的十六进制值，然后提取 R、G、B 和 A 的 8 位颜色值。

```cpp
#include <cstdint>
#include <iostream>

int main()
{
	constexpr std::uint32_t redBits{ 0xFF000000 };
	constexpr std::uint32_t greenBits{ 0x00FF0000 };
	constexpr std::uint32_t blueBits{ 0x0000FF00 };
	constexpr std::uint32_t alphaBits{ 0x000000FF };

	std::cout << "Enter a 32-bit RGBA color value in hexadecimal (e.g. FF7F3300): ";
	std::uint32_t pixel{};
	std::cin >> std::hex >> pixel; // std::hex allows us to read in a hex value

	// use Bitwise AND to isolate red pixels,
	// then right shift the value into the lower 8 bits
	std::uint8_t red{ static_cast<std::uint8_t>((pixel & redBits) >> 24) };
	std::uint8_t green{ static_cast<std::uint8_t>((pixel & greenBits) >> 16) };
	std::uint8_t blue{ static_cast<std::uint8_t>((pixel & blueBits) >> 8) };
	std::uint8_t alpha{ static_cast<std::uint8_t>(pixel & alphaBits) };

	std::cout << "Your color contains:\n";
	std::cout << std::hex; // print the following values in hex
	std::cout << static_cast<int>(red)   << " red\n";
	std::cout << static_cast<int>(green) << " green\n";
	std::cout << static_cast<int>(blue)  << " blue\n";
	std::cout << static_cast<int>(alpha) << " alpha\n";

	return 0;
}
```

这会产生输出：

```
Enter a 32-bit RGBA color value in hexadecimal (e.g. FF7F3300): FF7F3300
Your color contains:
ff red
7f green
33 blue
0 alpha
```

在上面的程序中，我们使用*按位与*来查询我们感兴趣的 8 位集合，然后将它们*右*移到一个 8 位值中，以便我们可以将它们作为十六进制值打印回来。

## 概括

总结如何设置、清除、切换和查询位标志：

要查询位状态，我们使用*按位与*：

```cpp
if (flags & option4) ... // if option4 is set, do something
```

要设置位（打开），我们使用*按位或*：

```cpp
flags |= option4; // turn option 4 on.
flags |= (option4 | option5); // turn options 4 and 5 on.
```

要清除位（关闭），我们使用*按位 AND*和*按位 NOT*：

```cpp
flags &= ~option4; // turn option 4 off
flags &= ~(option4 | option5); // turn options 4 and 5 off
```

要翻转位状态，我们使用*按位异或*：

```cpp
flags ^= option4; // flip option4 from on to off, or vice versa
flags ^= (option4 | option5); // flip options 4 and 5
```
