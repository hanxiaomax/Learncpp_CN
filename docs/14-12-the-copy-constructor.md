---
title: 14.12 - 拷贝构造函数
alias: 14.12 - 拷贝构造函数
origin: /the-copy-constructor/
origin_title: "14.12 — The copy constructor"
time: 2022-10-3
type: translation
tags:
- copy constructor
- constructor
---

??? note "关键点速记"
	
	-


## 初始化回顾

由于我们将在接下来的几节课中讨论初始化，所以有必要先回顾一下 C++ 支持的几种初始化方式：[[direct-initialization|直接初始化]]（使用括号）、[[uniform-initialization|统一初始化]]（大括号）和[[copy-initialization|拷贝初始化]]（使用等于号）。

下面的例子中，我们同时使用了上述三种初始化：

```cpp
#include <cassert>
#include <iostream>

class Fraction
{
private:
    int m_numerator{};
    int m_denominator{};

public:
    // Default constructor
    Fraction(int numerator=0, int denominator=1)
        : m_numerator{numerator}, m_denominator{denominator}
    {
        assert(denominator != 0);
    }

    friend std::ostream& operator<<(std::ostream& out, const Fraction& f1);
};

std::ostream& operator<<(std::ostream& out, const Fraction& f1)
{
	out << f1.m_numerator << '/' << f1.m_denominator;
	return out;
}
```

直接初始化：

```cpp
int x(5); // 直接初始化一个整型
Fraction fiveThirds(5, 3); // 直接初始化 Fraction，即调用构造函数 Fraction(int, int) 
```

在 C++11 中，我们还可以使用统一初始化：

```cpp
int x { 5 }; // 统一初始化一个整型
Fraction fiveThirds {5, 3}; // 统一初始化 Fraction ，仍然是调用构造函数 Fraction(int, int) 
```


最后，我们也可以使用拷贝初始化：

```cpp
int x = 6; // 拷贝初始化一个整型
Fraction six = Fraction(6); // 拷贝初始化 Fraction, 会调用 Fraction(6, 1)
Fraction seven = 7; // 拷贝初始化 Fraction，编译器会尝试寻找将 7 转换为 Fraction 的方法，因此会调用构造函数 Fraction(7, 1)
```


通过直接初始化或者统一初始化，对象会被创建并初始化。而当使用拷贝初始化时，问题就有一点复杂了。我们会在下一节课仔细探讨拷贝初始化。为了更好的效果，让我们先看看另外一个话题。

## 拷贝构造函数

考虑下面的程序：

```cpp
#include <cassert>
#include <iostream>

class Fraction
{
private:
    int m_numerator{};
    int m_denominator{};

public:
    // Default constructor
    Fraction(int numerator=0, int denominator=1)
        : m_numerator{numerator}, m_denominator{denominator}
    {
        assert(denominator != 0);
    }

    friend std::ostream& operator<<(std::ostream& out, const Fraction& f1);
};

std::ostream& operator<<(std::ostream& out, const Fraction& f1)
{
	out << f1.m_numerator << '/' << f1.m_denominator;
	return out;
}

int main()
{
	Fraction fiveThirds { 5, 3 }; // 统一初始化 Fraction, 调用 Fraction(int, int) 
	Fraction fCopy { fiveThirds }; // 统一初始化 Fraction -- 这里调用的是哪个构造函数？
	std::cout << fCopy << '\n';
}
```

当我们编译执行上面程序时，一切正常，程序打印：

```cpp
5/3
```

接下来，让我们看看上面代码是如何工作的。

变量 `fiveThirds` 的初始化使用了标准的统一初始化方式，因此会调用构造函数 `Fraction(int, int)` ，没什么好说的。但是下一行呢？`fCopy` 显然也是在初始化，而且初始化会调用类的构造函数，那么你知道它调用的是什么构造函数吗？

The answer is that this line is calling Fraction’s copy constructor. A **copy constructor** is a special type of constructor used to create a new object as a copy of an existing object (of the same type). And much like a default constructor, if you do not provide a copy constructor for your classes, C++ will create a public copy constructor for you. Because the compiler does not know much about your class, by default, the created copy constructor utilizes a method of initialization called memberwise initialization. **Memberwise initialization** simply means that each member of the copy is initialized directly from the member of the class being copied. In the above example, fCopy.m_numerator would be initialized from fiveThirds.m_numerator, etc…

Just like we can explicitly define a default constructor, we can also explicitly define a copy constructor. The copy constructor looks just like you’d expect it to:

```cpp
#include <cassert>
#include <iostream>

class Fraction
{
private:
    int m_numerator{};
    int m_denominator{};

public:
    // Default constructor
    Fraction(int numerator=0, int denominator=1)
        : m_numerator{numerator}, m_denominator{denominator}
    {
        assert(denominator != 0);
    }

    // Copy constructor
    Fraction(const Fraction& fraction)
        : m_numerator{fraction.m_numerator}, m_denominator{fraction.m_denominator}
        // Note: We can access the members of parameter fraction directly, because we're inside the Fraction class
    {
        // no need to check for a denominator of 0 here since fraction must already be a valid Fraction
        std::cout << "Copy constructor called\n"; // just to prove it works
    }

    friend std::ostream& operator<<(std::ostream& out, const Fraction& f1);
};

std::ostream& operator<<(std::ostream& out, const Fraction& f1)
{
	out << f1.m_numerator << '/' << f1.m_denominator;
	return out;
}

int main()
{
	Fraction fiveThirds { 5, 3 }; // Direct initialize a Fraction, calls Fraction(int, int) constructor
	Fraction fCopy { fiveThirds }; // Direct initialize -- with Fraction copy constructor
	std::cout << fCopy << '\n';
}
```

COPY

When this program is run, you get:

Copy constructor called
5/3

The copy constructor we defined in the example above uses memberwise initialization, and is functionally equivalent to the one we’d get by default, except we’ve added an output statement to prove the copy constructor is being called.

Unlike with default constructors, it’s fine to use the default copy constructor if it meets your needs.

One interesting note: You’ve already seen a few examples of overloaded operator<<, where we’re able to access the private members of parameter f1 because the function is a friend of the Fraction class. Similarly, member functions of a class can access the private members of parameters of the same class type. Since our Fraction copy constructor takes a parameter of the class type (to make a copy of), we’re able to access the members of parameter fraction directly, even though it’s not the implicit object.

The copy constructor’s parameter must be a reference

It is a requirement that the parameter of a copy constructor be a (const) reference. This makes sense: if the argument were passed by value, then we’d need the copy constructor to copy the argument into the parameter of the copy constructor (which would result in an infinite recursion).

**Preventing copies**

We can prevent copies of our classes from being made by making the copy constructor private:

```cpp
#include <cassert>
#include <iostream>

class Fraction
{
private:
    int m_numerator{};
    int m_denominator{};

    // Copy constructor (private)
    Fraction(const Fraction& fraction)
        : m_numerator{fraction.m_numerator}, m_denominator{fraction.m_denominator}
    {
        // no need to check for a denominator of 0 here since fraction must already be a valid Fraction
        std::cout << "Copy constructor called\n"; // just to prove it works
    }

public:
    // Default constructor
    Fraction(int numerator=0, int denominator=1)
        : m_numerator{numerator}, m_denominator{denominator}
    {
        assert(denominator != 0);
    }

    friend std::ostream& operator<<(std::ostream& out, const Fraction& f1);
};

std::ostream& operator<<(std::ostream& out, const Fraction& f1)
{
	out << f1.m_numerator << '/' << f1.m_denominator;
	return out;
}

int main()
{
	Fraction fiveThirds { 5, 3 }; // Direct initialize a Fraction, calls Fraction(int, int) constructor
	Fraction fCopy { fiveThirds }; // Copy constructor is private, compile error on this line
	std::cout << fCopy << '\n';
}
```

COPY

Now when we try to compile our program, we’ll get a compile error since fCopy needs to use the copy constructor, but can not see it since the copy constructor has been declared as private.

**The copy constructor may be elided**

Now consider the following example:

```cpp
#include <cassert>
#include <iostream>

class Fraction
{
private:
	int m_numerator{};
	int m_denominator{};

public:
    // Default constructor
    Fraction(int numerator=0, int denominator=1)
        : m_numerator{numerator}, m_denominator{denominator}
    {
        assert(denominator != 0);
    }

        // Copy constructor
	Fraction(const Fraction &fraction)
		: m_numerator{fraction.m_numerator}, m_denominator{fraction.m_denominator}
	{
		// no need to check for a denominator of 0 here since fraction must already be a valid Fraction
		std::cout << "Copy constructor called\n"; // just to prove it works
	}

	friend std::ostream& operator<<(std::ostream& out, const Fraction& f1);
};

std::ostream& operator<<(std::ostream& out, const Fraction& f1)
{
	out << f1.m_numerator << '/' << f1.m_denominator;
	return out;
}

int main()
{
	Fraction fiveThirds { Fraction { 5, 3 } };
	std::cout << fiveThirds;
	return 0;
}
```

COPY

Consider how this program works. First, we direct initialize an anonymous Fraction object, using the Fraction(int, int) constructor. Then we use that anonymous Fraction object as an initializer for Fraction fiveThirds. Since the anonymous object is a Fraction, as is fiveThirds, this should call the copy constructor, right?

Run this and compile it for yourself. You’d probably expect to get this result (and you may):

copy constructor called
5/3

But in actuality, you’re more likely to get this result:

5/3

Why didn’t our copy constructor get called?

Note that initializing an anonymous object and then using that object to direct initialize our defined object takes two steps (one to create the anonymous object, one to call the copy constructor). However, the end result of initializing our defined object is essentially identical to just doing a direct initialization, which only takes one step.

For this reason, in such cases, the compiler is allowed to opt out of calling the copy constructor and just do a direct initialization instead. The process of omitting certain copy (or move) steps for performance purposes is called **elision**.

So although you wrote:

```cpp
Fraction fiveThirds { Fraction{ 5, 3 } };
```

COPY

The compiler may change this to:

```cpp
Fraction fiveThirds{ 5, 3 };
```

COPY

which only requires one constructor call (to Fraction(int, int)). Note that in cases where elision is used, any statements in the body of the copy constructor are not executed, even if they would have produced side effects (like printing to the screen)!

Prior to C++17, compilers are permitted (but not required) to perform copy elision in certain cases. In such cases, a copy constructor must be accessible (e.g. non-private), even if the actual copy is elided.

As of C++17, some cases of copy elision (including the example above) have been made mandatory. In these mandatory elision cases, the copy constructor does not need to be accessible (or even present) since it is guaranteed not to be needed!