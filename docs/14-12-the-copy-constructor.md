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

实际上，这行代码会调用 `Fraction` 的拷贝构造函数。 [[copy-constructor|拷贝构造函数]]是一类特殊的构造函数，它会通过一个已经存在的对象来创建一个新的对象（相同类型）。类似于默认构造函数，如果你不提供一个拷贝构造函数的话，C++ 会为你创建一个public的拷贝构造函数。由于编译器并不很了解你的类，所以默认情况下拷贝构造函数会进行[[memberwise initialization|成员依次初始化]]。成员依次初始化意思就是每个成员都会通过被拷贝对象中的对应成员进行拷贝初始化。在上面的例子中，`fCopy.m_numerator` 会通过`fiveThirds.m_numerator` 来初始化，以此类推。

和默认构造函数类似，我们也可以显式地定义一个拷贝构造函数，它的形式想必你应该可以猜到：

```cpp
#include <cassert>
#include <iostream>

class Fraction
{
private:
    int m_numerator{};
    int m_denominator{};

public:
    // 默认构造函数
    Fraction(int numerator=0, int denominator=1)
        : m_numerator{numerator}, m_denominator{denominator}
    {
        assert(denominator != 0);
    }

    // 拷贝构造函数
    Fraction(const Fraction& fraction)
        : m_numerator{fraction.m_numerator}, m_denominator{fraction.m_denominator}
        // 注意：我们可以直接访问参数 fraction 的成员变量，因为它们都是 Fraction 类的
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
	Fraction fiveThirds { 5, 3 }; // 直接初始化，调用 Fraction(int, int) 构造函数
	Fraction fCopy { fiveThirds }; // 直接初始化——使用拷贝构造函数 
	std::cout << fCopy << '\n';
}
```

程序运行结果如下：

```
Copy constructor called
5/3
```

我们在上面的例子中定义的拷贝构造函数使用成员依次初始化方式进行初始化，在功能上与编译器默认创建的拷贝构造函数相同，只是我们添加了一个输出语句来证明正在调用拷贝构造函数。

与默认构造函数不同的是，如果拷贝构造函数能够满足你的需要，那么尽管使用它。

有一个地方需要注意：在之前我们已经看到了一些重载操作符`<<`的例子，在这些例子中，我们能够访问形参`f1`的私有成员，因为该函数是`Fraction`类的友元。类似地，类的成员函数可以访问相同类形参的私有成员。因为`Fraction`的拷贝构造函数接受同类型的形参(用于复制)，所以我们能够直接访问形参 `Fraction` 的成员。

拷贝构造函数的形参必须是引用类型

复制构造函数的形参必须是(const)引用。这是有意义的：如果实参是按值传递的，那么我们需要复制构造函数将实拷贝到拷贝构造函数的形参中(这将导致无限递归)。



## 阻止拷贝

通过将拷贝构造函数设为[[private-member|私有成员]]，我们可以阻止类的拷贝：

```cpp
#include <cassert>
#include <iostream>

class Fraction
{
private:
    int m_numerator{};
    int m_denominator{};

    // 私有拷贝构造函数
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
	Fraction fiveThirds { 5, 3 }; // 直接初始化 Fraction，调用 Fraction(int, int)
	Fraction fCopy { fiveThirds }; // 拷贝构造函数是私有的，编译器会报错。
	std::cout << fCopy << '\n';
}
```


编译程序时，编译器会报错，因为 `fCopy` 需要用到拷贝构造函数，但是由于拷贝构造函数是私有的，它无权访问。

## 拷贝构造函数可能会被省略

考虑下面的例子：

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

考虑上述程序的运行逻辑。首先，我们直接初始化了一个匿名的 `Fraction` 对象（使用 `Fraction(int, int)` 构造函数）。随后，我们将该匿名对象作为初始化值，用于初始化 `Fraction fiveThirds`。因为匿名对象也是 `Fraction` 类型的，所以会调用拷贝构造函数，这么分析没错吧？

编译并执行上述代码，你可以会认为其输出结果如下：

```
copy constructor called
5/3
```

而实际上结果更可能是：

```
5/3
```

为什么拷贝构造函数没有被调用？

注意，初始化匿名对象，然后使用该对象直接初始化定义的对象需要两个步骤(首先创建匿名对象，然调用复制构造函数)。然而，初始化已定义对象的最终结果基本上与直接初始化相同，后者只需要一个步骤。

因此，在这种情况下，编译器可以选择不调用复制构造函数，而直接进行初始化。为了性能目的而省略某些复制(或移动)步骤的过程称为**省略**

所以尽管代码是这样写的：

```cpp
Fraction fiveThirds { Fraction{ 5, 3 } };
```

编译器可能会将其优化为：

```cpp
Fraction fiveThirds{ 5, 3 };
```

上面的形式只需要一次构造函数调用(`Fraction(int, int)`)。需要注意的是，当省略发生时，拷贝构造函数其函数体内的任何语句都不会被执行，即使它们会产生[[side-effects|副作用]]（例如输出信息到屏幕）！

在 C++17 之前，编译器被允许（但不是必须）在某些情况下执行拷贝省略。在这种情况下，拷贝构造函数仍然是必须可访问的（非私有），即使拷贝构造函数实际上并没有被调用。

到了 C++17，有些拷贝省略已经是强制的了（包括上面例子中的这种情况）。对于这些强制省略的情况，拷贝构造函数不需要是可访问的，甚至不需要被定义，因为编译器保证不调用它！
