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

cheng'x are a couple runs of this program:

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

Now let’s try an example where the second number is bigger than the first:

```
Enter an integer: 2
Enter another integer: 4
The remainder is: 2
2 is not evenly divisible by 4
```

A remainder of 2 might be a little non-obvious at first, but it’s simple: 2 / 4 is 0 (using integer division) remainder 2. Whenever the second number is larger than the first, the second number will divide the first 0 times, so the first number will be the remainder.

## Modulus with negative numbers

The modulus operator can also work with negative operands. `x % y` always returns results with the sign of _x_.

Running the above program:

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

In both cases, you can see the remainder takes the sign of the first operand.

## Where’s the exponent operator?

You’ll note that the _^_ operator (commonly used to denote exponentiation in mathematics) is a _Bitwise XOR_ operation in C++ (covered in lesson [O.3 -- Bit manipulation with bitwise operators and bit masks](https://www.learncpp.com/cpp-tutorial/bit-manipulation-with-bitwise-operators-and-bit-masks/)). C++ does not include an exponent operator.

To do exponents in C++, `#include` the `<cmath>` header, and use the pow() function:

```cpp
#include <cmath>

double x{ std::pow(3.0, 4.0) }; // 3 to the 4th power
```


Note that the parameters (and return value) of function pow() are of type double. Due to rounding errors in floating point numbers, the results of pow() may not be precise (even if you pass it integers or whole numbers).

If you want to do integer exponentiation, you’re best off using your own function to do so. The following function implements integer exponentiation (using the non-intuitive “exponentiation by squaring” algorithm for efficiency):

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

结果为：

```
13841287201
```

Don’t worry if you don’t understand how this function works -- you don’t need to understand it in order to call it.

!!! warning "注意"

	In the vast majority of cases, integer exponentiation will overflow the integral type. This is likely why such a function wasn’t included in the standard library in the first place.