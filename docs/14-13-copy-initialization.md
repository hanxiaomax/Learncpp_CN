---
title: 14.13 - 拷贝初始化
alias: 14.13 - 拷贝初始化
origin: /the-copy-constructor/
origin_title: "14.13 — Copy initialization"
time: 2022-7-27
type: translation
tags:
- copy initialization
---

??? note "关键点速记"
	
	-


考虑下面代码：

```cpp
int x = 5;
```

该语句使用拷贝初始化的方式将一个新创建的整型变量 x 的值设置为 5。

而对于类来说，问题则会变得稍微复杂一些，因为类在初始化时需要使用构造函数。本节课我们会介绍与类的拷贝初始化相关的问题。


## 类的拷贝初始化

考虑下面的  `Fraction` 类：

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
    Fraction(int numerator=0, int denominator=1)
        : m_numerator(numerator), m_denominator(denominator)
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

考虑下下面代码：

```cpp
int main()
{
    Fraction six = Fraction(6);
    std::cout << six;
    return 0;
}
```


编译运行代码，结果如你所以想的那样：

```
6/1
```

这种形式的拷贝构造，其求值方式和下面的代码是一样的：

```cpp
Fraction six(Fraction(6));
```

在上一节课中（[[14-12-the-copy-constructor|14.12 - 拷贝构造函数]]）我们学到，上面的代码可能会调用 `Fraction(int, int)` 以及 `Fraction` 的拷贝构造函数（可能会被优化掉）。不过，由于省略不被保证一定发生，所以最好避免使用拷贝初始化来初始化类，而改用[[uniform-initialization|统一初始化]]。


!!! success "最佳实践"

	避免使用拷贝初始化，使用统一初始化


## 拷贝初始化的其他使用场景

还有其他一些地方使用了拷贝初始化，其中有两个地方值得一提。当[[pass-by-value|按值传递]]或[[return-by-value|按值返回]]类时，会使用拷贝初始化。

考虑下面代码：

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
    Fraction(int numerator=0, int denominator=1)
        : m_numerator(numerator), m_denominator(denominator)
    {
        assert(denominator != 0);
    }

        // Copy constructor
	Fraction(const Fraction& copy) :
		m_numerator(copy.m_numerator), m_denominator(copy.m_denominator)
	{
		// no need to check for a denominator of 0 here since copy must already be a valid Fraction
		std::cout << "Copy constructor called\n"; // just to prove it works
	}

	friend std::ostream& operator<<(std::ostream& out, const Fraction& f1);
	int getNumerator() { return m_numerator; }
	void setNumerator(int numerator) { m_numerator = numerator; }
};

std::ostream& operator<<(std::ostream& out, const Fraction& f1)
{
	out << f1.m_numerator << '/' << f1.m_denominator;
	return out;
}

Fraction makeNegative(Fraction f) // ideally we should do this by const reference
{
    f.setNumerator(-f.getNumerator());
    return f;
}

int main()
{
    Fraction fiveThirds(5, 3);
    std::cout << makeNegative(fiveThirds);

    return 0;
}
```

在上面的例子中，函数 `makeNegative` 将 `Fraction` 类型的对象作为参数，同时返回按值返回 `Fraction` 对象。程序执行后，输出结果如下：

```
Copy constructor called
Copy constructor called
-5/3
```

第一次调用拷贝构造函数是在 `fiveThirds` 被传入 `makeNegative()` 作为形参 `f`的时候。第二次调用是在 `makeNegative()` 按值返回时。

在上面的例子中，实参和返回值都是**按值**传递或返回的，所以拷贝构造不会被省略。但是，在其他的一些场合，如果实参和返回值满足某些条件，编译器仍然可能省略拷贝构造函数。例如：

```cpp
#include <iostream>
class Something
{
public:
	Something() = default;
	Something(const Something&)
	{
		std::cout << "Copy constructor called\n";
	}
};

Something foo()
{
	return Something(); // copy constructor normally called here
}
Something goo()
{
	Something s;
	return s; // copy constructor normally called here
}

int main()
{
	std::cout << "Initializing s1\n";
	Something s1 = foo(); // copy constructor normally called here

	std::cout << "Initializing s2\n";
	Something s2 = goo(); // copy constructor normally called here
}
```


The above program would normally call the copy constructor 4 times -- however, due to copy elision, it’s likely that your compiler will elide most or all of the cases. Visual Studio 2019 elides 3 (it doesn’t elide the case where goo() is returned), and GCC elides all 4

上面的程序通常会调用拷贝构造函数4次——然而，由于省略，编译器很可能会省略大部分或所有调用。Visual Studio 2019省略了3个(它没有省略返回`goo()`的情况)，而GCC省略了所有4个。