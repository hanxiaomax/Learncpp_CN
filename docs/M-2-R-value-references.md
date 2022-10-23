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

|左值引用	|可用于初始化	|可修改|
|:----|:----|:----|
|Modifiable l-values	|Yes	|Yes
|Non-modifiable l-values|	No	|No
|R-values	|No	|No

 
 const 对象的左值引用可以通过可修改、不可修改的左值或右值初始化。但是，这些值都不能被修改。

|const左值的引用	|可用于初始化	|可修改|
|:----|:----|:----|
|Modifiable l-values	|Yes	|No
|Non-modifiable l-values	|Yes	|No
|R-values	|Yes|	No


==const 对象的左值引用尤其有用，因为它能够配合任何类型的实参（左值或右值）工作，且不会创建拷贝。==
 

## **R-value references**

C++11 添加了一种新的引用类型，称为[[rvalue-reference|右值引用]]。右值引用被设计出来的目的，是为了配合右值使用（也只能配合右值使用）。创建左值引用使用一个`&`符号，创建右值引用则使用两个：

```cpp
int x{ 5 };
int &lref{ x }; // 通过左值来初始化一个左值引用
int &&rref{ 5 }; // 使用右值 5（字面量）来初始化右值引用
```

右值引用不能够通过左值来初始化。

|右值引用	|可用于初始化|可修改|
|:----|:----|:----|
|Modifiable l-values	|No	|No
|Non-modifiable l-values	|No	|No
|R-values	|Yes	|Yes


|const右值引用	|可用于初始化|可修改|
|:----|:----|:----|
|Modifiable l-values	|No	|No
|Non-modifiable l-values	|No	|No
|R-values	|Yes|	No

右值引用有两个有用的属性。首先，==右值引用可以将初始化它们的对象的生命周期延长到自己的生命周期==(对const对象的左值引用也可以做到这一点)。其次，你==可以通过指向非const右值引用来修改右值。==

考虑下面的例子：

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
	auto &&rref{ Fraction{ 3, 5 } }; // 对临时 Fraction 的右值引用

	// operator<< 的参数f1会绑定到临时对象，而不会创建拷贝
	std::cout << rref << '\n';

	return 0;
} // rref (和临时的Fraction) 离开作用域
```

程序输出：

```
3/5
```

作为一个临时对象，`Fraction(3, 5)`通常会在表达式结束后就离开作用域。但是，因为我们使用它初始化了一个右值引用，所以它的持续时间被延长到了和该右值引用一样——语句块结尾时离开作用域。然后，我们变可以通过该右值引用打印 `Fraction` 的值。

现在让我们看一个不那么直观的例子:

```cpp
#include <iostream>

int main()
{
    int &&rref{ 5 }; // 通过字面量初始化右值引用，此时创建了临时对象5
    rref = 10;
    std::cout << rref << '\n';

    return 0;
}
```

程序输出：

```
10
```


虽然用字面值初始化一个右值引用，然后再通过右值引用修改该右值看起来有些奇怪。但是当我们这么做时，会从字面值构造一个临时对象，此时右值引用引用的对象是该临时对象而不是字面量本身。

不过，上面两个例子并不是常见的右值使用场合。

## **R-value references as function parameters**

R-value references are more often used as function parameters. This is most useful for function overloads when you want to have different behavior for l-value and r-value arguments

==右值引用通常用作函数形参==。当您希望l值和r值参数具有不同的行为时，这对于函数重载最有用。

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