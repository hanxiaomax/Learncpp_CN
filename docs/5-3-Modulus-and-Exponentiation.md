---
title: 5.3 - 求模和指数运算
alias: 5.3 - 求模和指数运算
origin: /5-3-modulus-and-exponentiation/
origin_title: "5.3 — Modulus and Exponentiation"
time: 2022-4-7
type: translation
tags:
- 
---



## The modulus operator

The modulus operator (also informally known as the _remainder operator_) is an operator that returns the remainder after doing an integer division. For example, 7 / 4 = 1 remainder 3. Therefore, 7 % 4 = 3. As another example, 25 / 7 = 3 remainder 4, thus 25 % 7 = 4. Modulus only works with integer operands.

Modulus is most useful for testing whether a number is evenly divisible by another number (meaning that after division, there is no remainder): if _x % y_evaluates to 0, then we know that _x_ is evenly divisible by _y_.

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

COPY

Here are a couple runs of this program:

Enter an integer: 6
Enter another integer: 3
The remainder is: 0
6 is evenly divisible by 3

Enter an integer: 6
Enter another integer: 4
The remainder is: 2
6 is not evenly divisible by 4

Now let’s try an example where the second number is bigger than the first:

Enter an integer: 2
Enter another integer: 4
The remainder is: 2
2 is not evenly divisible by 4

A remainder of 2 might be a little non-obvious at first, but it’s simple: 2 / 4 is 0 (using integer division) remainder 2. Whenever the second number is larger than the first, the second number will divide the first 0 times, so the first number will be the remainder.

Modulus with negative numbers

The modulus operator can also work with negative operands. `x % y` always returns results with the sign of _x_.

Running the above program:

Enter an integer: -6
Enter another integer: 4
The remainder is: -2
-6 is not evenly divisible by 4

Enter an integer: 6
Enter another integer: -4
The remainder is: 2
6 is not evenly divisible by -4

In both cases, you can see the remainder takes the sign of the first operand.

Where’s the exponent operator?

You’ll note that the _^_ operator (commonly used to denote exponentiation in mathematics) is a _Bitwise XOR_ operation in C++ (covered in lesson [O.3 -- Bit manipulation with bitwise operators and bit masks](https://www.learncpp.com/cpp-tutorial/bit-manipulation-with-bitwise-operators-and-bit-masks/)). C++ does not include an exponent operator.

To do exponents in C++, #include the <cmath> header, and use the pow() function:

```cpp
#include <cmath>

double x{ std::pow(3.0, 4.0) }; // 3 to the 4th power
```

COPY

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

COPY

Produces:

13841287201

Don’t worry if you don’t understand how this function works -- you don’t need to understand it in order to call it.

Warning

In the vast majority of cases, integer exponentiation will overflow the integral type. This is likely why such a function wasn’t included in the standard library in the first place.