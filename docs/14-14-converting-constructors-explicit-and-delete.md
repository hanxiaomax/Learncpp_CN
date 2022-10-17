---
title: 14.14 - 转换构造函数与explicit和delete关键字
alias: 14.14 - 转换构造函数与explicit和delete关键字
origin: /converting-constructors-explicit-and-delete/
origin_title: "14.14 — Converting constructors, explicit, and delete"
time: 2022-7-27
type: translation
tags:
- converting constructors
- explicit
- delete
---

??? note "关键点速记"
	
	-


默认情况下，C++会把所有的构造函数都当做隐式地转换操作符。考虑下面的例子：

```cpp
#include <cassert>
#include <iostream>

class Fraction
{
private:
	int m_numerator;
	int m_denominator;

public:
	// Default constructor
	Fraction(int numerator = 0, int denominator = 1)
		 : m_numerator(numerator), m_denominator(denominator)
	{
		assert(denominator != 0);
	}

	// Copy constructor
	Fraction(const Fraction& copy)
		: m_numerator(copy.m_numerator), m_denominator(copy.m_denominator)
	{
		// no need to check for a denominator of 0 here since copy must already be a valid Fraction
		std::cout << "Copy constructor called\n"; // just to prove it works
	}

	friend std::ostream& operator<<(std::ostream& out, const Fraction& f1);
	int getNumerator() { return m_numerator; }
	void setNumerator(int numerator) { m_numerator = numerator; }
};

void printFraction(const Fraction& f)
{
	std::cout << f;
}

std::ostream& operator<<(std::ostream& out, const Fraction& f1)
{
	out << f1.m_numerator << '/' << f1.m_denominator;
	return out;
}

int main()
{
	printFraction(6);

	return 0;
}
```


尽管 `printFraction()` 期望接受一个 `Fraction` ，但实际上我们给它传递了一个字面量 6。因为 `Fraction` 的构造函数可以接受整型，所以编译器会隐式地将字面量6转换为一个 `Fraction` 对象。它会使用`Fraction(int, int)` 来初始化 `printFraction()` 的形参`f`。

程序执行结果如下：

```
6/1
```

对于所有类型的初始化，该隐式转换都可用。

能够被用来进行[[implicit-type-conversion|隐式类型转换]]的构造函数，称为[[converting-constructors|转换构造函数]]。

## `explicit` 关键字

虽然在`Fraction`这个例子中，进行隐式转换是有意义的，但在其他情况下，这可能是不可取的，也可能导致意外的行为:

```cpp
#include <string>
#include <iostream>

class MyString
{
private:
	std::string m_string;
public:
	MyString(int x) // allocate string of size x
	{
		m_string.resize(x);
	}

	MyString(const char* string) // allocate string to hold string value
	{
		m_string = string;
	}

	friend std::ostream& operator<<(std::ostream& out, const MyString& s);

};

std::ostream& operator<<(std::ostream& out, const MyString& s)
{
	out << s.m_string;
	return out;
}

void printString(const MyString& s)
{
	std::cout << s;
}

int main()
{
	MyString mine = 'x'; // Will compile and use MyString(int)
	std::cout << mine << '\n';

	printString('x'); // Will compile and use MyString(int)
	return 0;
}
```

在上面的例子中，我们使用一个字符来初始一个字符串。因为字符实际上是属于整型家族的，所以编译器会使用`MyString(int)` 构造函数隐式地将字符转换为 `MyString`。当程序打印 `MyString`时，其结果会出乎我们的意料。类似的，调用 `printString(‘x’)` 也会导致隐式类型转换，结果也是类似的。

解决这个问题的一种方法是通过`explicit`关键字标记构造函数(和转换函数)，该关键字放在函数名前面。explicit 的构造函数和转换函数将不会用于隐式转换或拷贝初始化：


```cpp
#include <string>
#include <iostream>

class MyString
{
private:
	std::string m_string;
public:
	// explicit keyword makes this constructor ineligible for implicit conversions
	explicit MyString(int x) // allocate string of size x
	{
		m_string.resize(x);
	}

	MyString(const char* string) // allocate string to hold string value
	{
		m_string = string;
	}

	friend std::ostream& operator<<(std::ostream& out, const MyString& s);

};

std::ostream& operator<<(std::ostream& out, const MyString& s)
{
	out << s.m_string;
	return out;
}

void printString(const MyString& s)
{
	std::cout << s;
}

int main()
{
	MyString mine = 'x'; // 编译错误，因为 MyString(int) 现在是 explicit 的
	std::cout << mine;

	printString('x'); // 编译错误，MyString(int) 不能被用于隐式类型转换

	return 0;
}
```

上面的程序是无法编译的，因为 `MyString(int)` 被定义为 `explicit`，而且无法找到一个可用的能够将 ‘x’ 隐式转换为`MyString`的构造函数。

不过，将构造函数标记为 `explict` 只能防止隐式类转换。显示的类型转换仍然是可以的：

```cpp
std::cout << static_cast<MyString>(5); // Allowed: explicit cast of 5 to MyString(int)
```

[[direct-initialization|直接初始化]]和[[uniform-initialization|统一初始化]]仍会对参数进行转换使其匹配（统一初始化虽然不会进行[[narrowing-convertions|缩窄转换]]，但是可能会进行其他类型的转换）。


```cpp
MyString str{'x'}; // Allowed: initialization parameters may still be implicitly converted to match
```


!!! success "最佳实践"

	考虑将构造函数和用户定义转换成员函数设置为显式的，以防止隐式转换错误。

## `delete`  关键字

在`MyString`的例子中，如果希望完全禁止 `x` 被转换为`MyString`(无论是隐式的还是显式的，因为结果符合直觉)。其中一种方法是添加`MyString(char)`构造函数，并将其设为私有:


```cpp
#include <string>
#include <iostream>

class MyString
{
private:
	std::string m_string;

	MyString(char) // objects of type MyString(char) can't be constructed from outside the class
	{
	}

public:
	// explicit keyword makes this constructor ineligible for implicit conversions
	explicit MyString(int x) // allocate string of size x
	{
		m_string.resize(x);
	}

	MyString(const char* string) // allocate string to hold string value
	{
		m_string = string;
	}

	friend std::ostream& operator<<(std::ostream& out, const MyString& s);

};

std::ostream& operator<<(std::ostream& out, const MyString& s)
{
	out << s.m_string;
	return out;
}

int main()
{
	MyString mine('x'); // compile error, since MyString(char) is private
	std::cout << mine;
	return 0;
}
```

COPY

但是，这个构造函数仍然可以在类内部使用(私有访问只防止非成员调用此函数)。

更好的解决方法是使用 `delete`关键字删除函数:


```cpp
#include <string>
#include <iostream>

class MyString
{
private:
	std::string m_string;

public:
	MyString(char) = delete; // 任何使用该函数的地方都会报错
	
	// explicit 使得该构造函数不能够被用于隐式类型转换
	explicit MyString(int x) // allocate string of size x /
	{
		m_string.resize(x);
	}

	MyString(const char* string) // allocate string to hold string value
	{
		m_string = string;
	}

	friend std::ostream& operator<<(std::ostream& out, const MyString& s);

};

std::ostream& operator<<(std::ostream& out, const MyString& s)
{
	out << s.m_string;
	return out;
}

int main()
{
	MyString mine('x'); // compile error, since MyString(char) is deleted
	std::cout << mine;
	return 0;
}
```



当函数被`delete`之后，任何对该构造函数的使用都会导致编译报错。

注意，拷贝构造函数和重载运算符也可以被`delete`，以Note that the copy constructor and overloaded operators may also be deleted in order to prevent those functions from being used.