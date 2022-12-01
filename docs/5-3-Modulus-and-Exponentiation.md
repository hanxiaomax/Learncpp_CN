---
title: 5.3 - 求模和指数运算
alias: 5.3 - 求模和指数运算
origin: /5-3-modulus-and-exponentiation/
origin_title: "5.3 — Modulus and Exponentiation"
time: 2022-4-7
type: translation
tags:
- operator
---

??? note "Key Takeaway"

	- 在需要判断一个数是否能被另外一个数整除（除法结果没有余数）时求模运算非常有：如果 `x%y`结果为0，说明 `x` 可以被 `y` 整除。
	- 负数也可以求模。`x % y` 的结果总是和 x 的符号一样。
	- C++ 不支持指数运算符，可以使用`<cmath>`中的`pow`函数
	- 编写整型指数运算函数可以使用平方求幂法


## 求模运算符

求模运算符（有时候也被叫做求余运算符）可以返回整数除法结果的余数。例如 7 / 4 = 1 余 3。因此 7 % 4 = 3。又比如，25 / 7 = 3 余 4，因此 25 % 7 = 4。求模运算只能用于整数操作数。

在需要判断一个数是否能被另外一个数整除（除法结果没有余数）时求模运算非常有：如果 `x%y`结果为0，说明 `x` 可以被 `y` 整除。

```cpp
#include <iostream>

int main()
{
	std::cout << "Enter an integer: ";
	int x{};
	std::cin >> x;

	std::cout << "Enter another integer: ";
	int y{};
	std::cin >> y;

	std::cout << "The remainder is: " << x % y << '\n';

	if ((x % y) == 0)
		std::cout << x << " is evenly divisible by " << y << '\n';
	else
		std::cout << x << " is not evenly divisible by " << y << '\n';

	return 0;
}
```

程序运行结果如下：

```
Enter an integer: 6
Enter another integer: 3
The remainder is: 0
6 is evenly divisible by 3
```

```
Enter an integer: 6
Enter another integer: 4
The remainder is: 2
6 is not evenly divisible by 4
```

接下来，我们实时如果第二个数比第一个数大会怎么样：

```
Enter an integer: 2
Enter another integer: 4
The remainder is: 2
2 is not evenly divisible by 4
```

余数是 2 ，乍一看原因可能不是很明显，但其实很简单：2 / 4 是 0 (整数除法) 余数为 2。任何时候只要第二个数大于第一个，则第一个数为余数。


## 负数求模

负数也可以求模。`x % y` 的结果总是和 x 的符号一样。

执行上述程序：

```
Enter an integer: -6
Enter another integer: 4
The remainder is: -2
-6 is not evenly divisible by 4
```

```
Enter an integer: 6
Enter another integer: -4
The remainder is: 2
6 is not evenly divisible by -4
```

在上面两种例子中可以看到余数的符号总是和第一个操作符一样。

## 指数运算符去哪了?

你可能已经注意到了 `^` 运算符(通常用于表示指数运算)在 C++ 中是异或运算符 (在[O.3 -- Bit manipulation with bitwise operators and bit masks](https://www.learncpp.com/cpp-tutorial/bit-manipulation-with-bitwise-operators-and-bit-masks/) 中介绍)。C++ 并没有指数运算符。

在 C++ 中进行指数运算需要 `#include` `<cmath>` 头文件，然后使用 pow() 函数：

```cpp
#include <cmath>

double x{ std::pow(3.0, 4.0) }; // 3 to the 4th power
```


注意，参数和返回值的类型都是 double。而由于浮点数存在[[rounding-error|舍入误差]]，所以`pow()`的结果可能并不精确（即使你传入的是整数）。

如果你想进行整数指数运算，你最好自己写一个函数。下面这个函数就实现了整型的指数运算（使用了不太直观的**平方求幂**算法以提高效率）：

```cpp
#include <iostream>
#include <cstdint> // for std::int64_t
#include <cassert> // for assert

// note: exp must be non-negative
std::int64_t powint(int base, int exp)
{
	assert(exp > 0 && "powint: exp parameter has negative value");

	std::int64_t result{ 1 };
	while (exp)
	{
		if (exp & 1)
			result *= base;
		exp >>= 1;
		base *= base;
	}

	return result;
}

int main()
{
	std::cout << powint(7, 12); // 7 to the 12th power

	return 0;
}
```

!!! info "译者注"

	求x的n次方，最直接的算法是把x乘以x执行n次，但是这样很慢。
	使用平方求幂的方法可以极大提高速度，它的原理如下：
	
	1. 假设求x的16次方，其实没必要把x乘以x执行16次
	2. 更快的方法是把x平方，然后再平方，再平方，再平方。即$((((x^2)^2)^2)^2)$，因为我们知道求指数的指数实际上是把两个指数相乘。所以$((((x^2)^2)^2)^2)=x^{16}$
	3. 如果转换为更一般的形式，x的n次方其实就是看n转换成2进制之后，里面包含多少个1。假设n = 37，则转换为二进制是 `100101`。
	4. $x^{37} = x^1 * x^{100} * x^{10000}$, 即$x^{37} = x^1 * x^{4} * x^{32}$
	5. 所以，我们只要把指数先转变成二进制，然后一位一位的看，如果遇到1，则看该位是第几位，然后求2的几次方，假设结果为n，则再次求x的n次方，最后把所有的结果乘起来。
	6. 不过按照上面计算每个部分的时候还是很麻烦，实际可以这样做：
		1. 不论是1还是0，都把x自身成以自身
		2. 如果遇到1，则把x的结果乘到result上
		3. 如果遇到0，跳过
		4. 最后的结果相当于每处理指数的一个位，x都平方一次。然后只有a位上为1时，x的a次方才被乘到结果上，这样就很自然，不用再特意去计算当前是第几位了。
	
	
	[视频讲解](https://www.youtube.com/watch?v=qed48E92qXc)

结果为：

```
13841287201
```

如果你不理解这个函数的原理也不要紧 —— 使用它并不需要你了解它的原理。

!!! warning "注意"

	大部分情况下，整型的指数运算都可能会溢出整型。这很可能是该函数没有被包含到标准库中的原因。
	


