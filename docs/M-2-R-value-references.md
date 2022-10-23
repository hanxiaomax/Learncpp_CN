---
title: M.2 - 右值引用
alias: M.2 - 右值引用
origin: /rvalue-references/
origin_title: "M.2 — R-value references"
time: 2022-9-16
type: translation
tags:
- R-value-references
- references
---

??? note "关键点速记"


在第九章中我们介绍了[[value-category|值类型]]([[9-2-Value-categories-lvalues-and-rvalues|9.2 - 值的分类（左值和右值）]])——值类型是表达式的一个属性，用于确定表达式求值得到值、函数还是对象。我们还介绍了[[lvalue|左值]]和[[rvalue|右值]]，以便展开对[[lvalue-reference|左值引用]]的讨论。

如果你对左值和右值感到生疏了，现在正是复习它们的好时机。

## 复习：左值

在C++11之前，C++中只有左值引用这一种引用，所以它被称为“引用”。但是到了C++11，它被重新命名为左值引用。==左值引用必须通过可修改左值初始化。==



|左值引用	|可以被初始化	|可以被修改|
|:----|:----|:----|
|Modifiable l-values	|Yes	|Yes
|Non-modifiable l-values|	No	|No
|R-values	|No	|No

L-value references to const objects can be initialized with modifiable and non-modifiable l-values and r-values alike. However, those values can’t be modified.


|L-value reference to const	|Can be initialized with	|Can modify|
|:----|:----|:----|
|Modifiable l-values	|Yes	|No
|Non-modifiable l-values	|Yes	|No
|R-values	|Yes|	No


L-value references to const objects are particularly useful because they allow us to pass any type of argument (l-value or r-value) into a function without making a copy of the argument.

## **R-value references**

C++11 adds a new type of reference called an r-value reference. An r-value reference is a reference that is designed to be initialized with an r-value (only). While an l-value reference is created using a single ampersand, an r-value reference is created using a double ampersand:

```cpp
int x{ 5 };
int &lref{ x }; // l-value reference initialized with l-value x
int &&rref{ 5 }; // r-value reference initialized with r-value 5
```

COPY

R-values references cannot be initialized with l-values.

|R-value reference	|Can be initialized with|	Can modify|
|:----|:----|:----|
|Modifiable l-values	|No	|No
|Non-modifiable l-values	|No	|No
|R-values	|Yes	|Yes


|R-value reference to const	|Can be initialized with	|Can modify|
|:----|:----|:----|
|Modifiable l-values	|No	|No
|Non-modifiable l-values	|No	|No
|R-values	|Yes|	No



R-value references have two properties that are useful. First, r-value references extend the lifespan of the object they are initialized with to the lifespan of the r-value reference (l-value references to const objects can do this too). Second, non-const r-value references allow you to modify the r-value!

Let’s take a look at some examples:

```cpp
#include <iostream>

class Fraction
{
private:
	int m_numerator;
	int m_denominator;

public:
	Fraction(int numerator = 0, int denominator = 1) :
		m_numerator{ numerator }, m_denominator{ denominator }
	{
	}

	friend std::ostream& operator<<(std::ostream& out, const Fraction &f1)
	{
		out << f1.m_numerator << '/' << f1.m_denominator;
		return out;
	}
};

int main()
{
	auto &&rref{ Fraction{ 3, 5 } }; // r-value reference to temporary Fraction

	// f1 of operator<< binds to the temporary, no copies are created.
	std::cout << rref << '\n';

	return 0;
} // rref (and the temporary Fraction) goes out of scope here
```

COPY

This program prints:

3/5

As an anonymous object, Fraction(3, 5) would normally go out of scope at the end of the expression in which it is defined. However, since we’re initializing an r-value reference with it, its duration is extended until the end of the block. We can then use that r-value reference to print the Fraction’s value.

Now let’s take a look at a less intuitive example:

```cpp
#include <iostream>

int main()
{
    int &&rref{ 5 }; // because we're initializing an r-value reference with a literal, a temporary with value 5 is created here
    rref = 10;
    std::cout << rref << '\n';

    return 0;
}
```

COPY

This program prints:

10

While it may seem weird to initialize an r-value reference with a literal value and then be able to change that value, when initializing an r-value reference with a literal, a temporary object is constructed from the literal so that the reference is referencing a temporary object, not a literal value.

R-value references are not very often used in either of the manners illustrated above.

## **R-value references as function parameters**

R-value references are more often used as function parameters. This is most useful for function overloads when you want to have different behavior for l-value and r-value arguments.

```cpp
#include <iostream>

void fun(const int &lref) // l-value arguments will select this function
{
	std::cout << "l-value reference to const\n";
}

void fun(int &&rref) // r-value arguments will select this function
{
	std::cout << "r-value reference\n";
}

int main()
{
	int x{ 5 };
	fun(x); // l-value argument calls l-value version of function
	fun(5); // r-value argument calls r-value version of function

	return 0;
}
```

COPY

This prints:

```
l-value reference to const
r-value reference
```

As you can see, when passed an l-value, the overloaded function resolved to the version with the l-value reference. When passed an r-value, the overloaded function resolved to the version with the r-value reference (this is considered a better match than a l-value reference to const).

Why would you ever want to do this? We’ll discuss this in more detail in the next lesson. Needless to say, it’s an important part of move semantics.

One interesting note:

```cpp
int &&ref{ 5 };
fun(ref);
```

COPY

actually calls the l-value version of the function! Although variable ref has type _r-value reference to an integer_, it is actually an l-value itself (as are all named variables). The confusion stems from the use of the term r-value in two different contexts. Think of it this way: Named-objects are l-values. Anonymous objects are r-values. The type of the named object or anonymous object is independent from whether it’s an l-value or r-value. Or, put another way, if r-value reference had been called anything else, this confusion wouldn’t exist.

## Returning an r-value reference**

You should almost never return an r-value reference, for the same reason you should almost never return an l-value reference. In most cases, you’ll end up returning a hanging reference when the referenced object goes out of scope at the end of the function.