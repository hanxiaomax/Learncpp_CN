---
title: O.2 - 位运算符
alias: O.2 - 位运算符
origin: /bitwise-operators/
origin_title: "O.2 — Bitwise operators"
time: 2022-8-9
type: translation
tags:
- bit
---

> [!note] "Key Takeaway"

## 按位运算符

C++ 提供 6 位操作运算符，通常称为**按位运算**符：

| Operator | Symbol | Form   | Operation                     |
| :------- | :----- | :----- | :---------------------------- |
| 左移     | <<     | x << y | x 中的所有位左移 y 位         |
| 右移     | >>     | x >> y | x 中的所有位右移 y 位         |
| 按位非   | ~      | ~x     | x 中的所有位翻转              |
| 按位与   | &      | x & y  | x 中的每一位 AND y 中的每一位 |
| 按位或   | \|     | × \| y | x 中的每一位 OR y 中的每一位  |
| 按位异或 | ^      | x^y    | x 中的每一位 XOR y 中的每一位 |

> [!info] "作者注"
> 在以下示例中，我们将主要使用 4 位二进制值。这是为了方便和保持示例简单。在实际程序中，使用的位数取决于对象的大小（例如，一个 2 字节的对象将存储 16 位）。
> 为了可读性，我们还将省略代码示例之外的 0b 前缀（例如，我们将只使用 0101 而不是 0b0101）。

按位运算符是为整数类型和 std::bitset 定义的。我们将在示例中使用 std::bitset，因为它更容易以二进制形式打印输出。

**避免使用带符号操作数的按位运算符**，因为在 C++20 之前，许多运算符将返回实现定义的结果，或有着使用无符号操作数（或 std::bitset）可以轻松避免的其他潜在问题。

> [!success] "最佳实践"
> 为避免意外，请使用带无符号操作数的按位运算符或 std::bitset。


## 按位左移 (<<) 和按位右移 (>>) 运算符

**按位左移**(<<) 运算符将位向左移动。左操作数是要移位的位的表达式，右操作数是要左移的整数位数。

所以当我们说 时`x << 1`，我们是在说“将变量 x 中的位左移一位”。从右侧移入的新位接收值 0。

0011 << 1 是 0110
0011 << 2 是 1100
0011 << 3 是 1000

请注意，在第三种情况下，我们将一个1从左端偏移出了！从二进制数末尾移出的位将永远丢失。

**按位右移**(>>) 运算符将位右移。

1100 >> 1 是 0110
1100 >> 2 是 0011
1100 >> 3 是 0001

请注意，在第三种情况下，我们将一个1从右端偏移出了，因此它丢失了。

这是进行一些位移的示例：

```cpp
#include <bitset>
#include <iostream>
int main()
{
    std::bitset<4> x { 0b1100 };
    
    std::cout << x << '\n';
    std::cout << (x >> 1) << '\n'; // shift right by 1, yielding 0110
    std::cout << (x << 1) << '\n'; // shift left by 1, yielding 1000

    return 0;
}
```

这打印：

```
1100
0110
1000
```

## 什么！？operator<< 和 operator>> 不是用于输入和输出吗？

他们肯定是。

今天的程序通常不会大量使用按位左移和右移运算符来移位。相反，您倾向于看到与 std::cout（或其他流对象）一起使用的按位左移运算符来输出文本。考虑以下程序：

```cpp
#include <bitset>
#include <iostream>

int main()
{
    unsigned int x { 0b0100 };
    x = x << 1; // use operator<< for left shift
    std::cout << std::bitset<4>{ x } << '\n'; // use operator<< for output

    return 0;
}
```

这个程序打印：

```
1000
```

在上面的程序中，operator<< 是如何知道在一种情况下移位而在另一种情况下输出*x*的呢？答案是 std::cout 已经**重载**（提供了替代定义） operator<< 执行控制台输出而不是位移。

当编译器看到 operator<< 的左操作数是 std::cout 时，它知道它应该调用 std::cout 重载的 operator<< 版本来进行输出。如果左操作数是整数类型，则 operator<< 知道它应该执行其通常的位移行为。

这同样适用于运算符>>。

请注意，如果您对输出和左移都使用运算符 <<，则需要括号：

```cpp
#include <bitset>
#include <iostream>

int main()
{
	std::bitset<4> x{ 0b0110 };

	std::cout << x << 1 << '\n'; // print value of x (0110), then 1
	std::cout << (x << 1) << '\n'; // print x left shifted by 1 (1100)

	return 0;
}
```

这打印：

```
01101
1100
```

第一行打印 x 的值 (0110)，然后是文字 1。第二行打印 x 左移 1 (1100) 的值。

我们将在以后的部分中更多地讨论运算符重载，包括讨论如何为您自己的目的重载运算符。

## 按位非

**按位非**运算符 (~) 可能是所有按位运算符中最容易理解的。它只是将每个位从 0 翻转为 1，反之亦然。请注意，*按位 NOT*的结果取决于您的数据类型的大小。

翻转 4 位：
~0100 是 1011

翻转 8 位：
~0000 0100 是 1111 1011

在 4 位和 8 位的情况下，我们从相同的数字开始（二进制 0100 与 0000 0100 相同，十进制 7 与 07 相同），但最终得到不同的结果。

我们可以在以下程序中看到这一点：

```cpp
#include <bitset>
#include <iostream>

int main()
{
	std::cout << ~std::bitset<4>{ 0b0100 } << ' ' << ~std::bitset<8>{ 0b0100 } << '\n';

	return 0;
}
```

```这打印：
这打印：
1011 11111011
```

## 按位或

**按位或**(|) 的工作方式与其对应的*逻辑或*非常相似。但是，不是将*OR*应用于操作数以产生单个结果，而是*将按位 OR*应用于每一位！例如，考虑表达式`0b0101 | 0b0110`。

要进行（任何）按位运算，最简单的方法是像这样将两个操作数排列起来：

```
0 1 0 1 OR
0 1 1 0
```

然后将操作应用于每一*列位*。

如果您还记得的话，如果左操作数、右操作数或两个操作数都为*真 (1) ，则**逻辑 OR*的计算结果为*真 (1* ) ，否则*为 0*。如果左侧位、右侧位或两个位都为*1*，*则按位或*计算结果为*1 ，否则为**0*。因此，表达式的计算结果如下：

```
0 1 0 1 OR
0 1 1 0
-------
0 1 1 1
```

我们的结果是 0111 二进制。

```cpp
#include <bitset>
#include <iostream>

int main()
{
	std::cout << (std::bitset<4>{ 0b0101 } | std::bitset<4>{ 0b0110 }) << '\n';

	return 0;
}
```

这打印：

```
0111
```

我们可以对复合 OR 表达式做同样的事情，例如`0b0111 | 0b0011 | 0b0001`. 如果一列中的任何位为*1*，则该列的结果为*1*。

```
0 1 1 1 OR
0 0 1 1 OR
0 0 0 1
--------
0 1 1 1
```

这是上面的代码：

```cpp
#include <bitset>
#include <iostream>

int main()
{
	std::cout << (std::bitset<4>{ 0b0111 } | std::bitset<4>{ 0b0011 } | std::bitset<4>{ 0b0001 }) << '\n';

	return 0;
}
```

这打印：

```
0111
```

## 按位与

**按位与**(&) 的工作方式与上述类似。如果左右操作数的计算结果都为 true ，则*逻辑 AND的计算结果为**true*。如果列中的两位都为*1* *，则按位与*计算结果为*真 (1)*。考虑表达式。排列每个位并对每一列位应用 AND 运算：`0b0101 & 0b0110`

```
0 1 0 1 AND
0 1 1 0
--------
0 1 0 0
```

```cpp
#include <bitset>
#include <iostream>

int main()
{
	std::cout << (std::bitset<4>{ 0b0101 } & std::bitset<4>{ 0b0110 }) << '\n';
	return 0;
}
```

这打印：

```
0100
```

同样，我们可以对复合 AND 表达式做同样的事情，例如`0b0001 & 0b0011 & 0b0111`. 如果一列中的所有位均为 1，则该列的结果为 1。

```
0 0 0 1 AND
0 0 1 1 AND
0 1 1 1
--------
0 0 0 1
```

```cpp
#include <bitset>
#include <iostream>

int main()
{
	std::cout << (std::bitset<4>{ 0b0001 } & std::bitset<4>{ 0b0011 } & std::bitset<4>{ 0b0111 }) << '\n';

	return 0;
}
```

这打印：

```
0001
```

## 按位异或

最后一个运算符是**按位异或**(^)，也称为**异或**。

评估两个操作数时，如果 XOR 的一个*且只有一个*操作数为true (1) ，则 XOR 的计算结果为*true* *(1)*。如果两者都不为真，则计算结果为*0*。考虑表达式：`0b0110 ^ 0b0011`

```
0 1 1 0 XOR
0 0 1 1
-------
0 1 0 1
```

也可以评估复合 XOR 表达式列样式，例如`0b0001 ^ 0b0011 ^ 0b0111`. 如果一列中有偶数个 1 位，则结果为*0*。如果一列中有奇数个 1 位，则结果为*1*。

```
0 0 0 1 XOR
0 0 1 1 XOR
0 1 1 1
--------
0 1 0 1
```

## 按位赋值运算符

与算术赋值运算符类似，C++ 提供了按位赋值运算符，以方便变量的修改。

| Operator     | Symbol | Form    | Operation         |
| :----------- | :----- | :------ | :---------------- |
| 左移分配     | <<=    | x <<= y | x 左移 y 位       |
| 右移分配     | >>=    | x >>= y | x 右移 y 位       |
| 按位或赋值   | \|=    | x \|= y | 将 x \| y 赋值给x |
| 按位与赋值   | &=     | x &= y  | 将 x & y 赋值给 x |
| 按位异或赋值 | ^=     | x^=y    | 将 x ^ y 赋值给 x |

例如`x = x >> 1;`，您可以不写 ，而写`x >>= 1;`.

```cpp
#include <bitset>
#include <iostream>

int main()
{
    std::bitset<4> bits { 0b0100 };
    bits >>= 1;
    std::cout << bits << '\n';

    return 0;
}
```

这个程序打印：

```
0010
```

## 概括

总结如何使用列方法按位运算：

在评估*按位或*时，如果列中的任何位为 1，则该列的结果为 1。
在评估*按位与*时，如果列中的所有位均为 1，则该列的结果为 1。
在评估*按位异或*时，如果一列中有奇数个 1 位，该列的结果为 1。