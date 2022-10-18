---
title: 17.7 - 调用继承函数和重写
alias: 17.7 - 调用继承函数和重写
origin: /calling-inherited-functions-and-overriding-behavior/
origin_title: "17.7 — Calling inherited functions and overriding behavior"
time: 2022-6-2
type: translation
tags:
- inheritance
- overriding
---

??? note "关键点速记"
	
	- 基于派生类调用函数时，编译器沿着继承链向上查找并使用找到的第一个

默认情况下，派生类继承基类中定义的所有行为。在这一课中，我们将更详细地研究如何选择成员函数，以及如何利用它来改变派生类中的行为。


## 调用基类函数

当使用派生类对象调用成员函数时，编译器首先查看该成员是否存在于派生类中。如果没有，它开始沿着继承链向上查找，并检查成员是否已经在任何父类中定义。它使用它找到的第一个。

考虑下面的程序：

```cpp
#include <iostream>

class Base
{
protected:
    int m_value {};

public:
    Base(int value)
        : m_value { value }
    {
    }

    void identify() const { std::cout << "I am a Base\n"; }
};

class Derived: public Base
{
public:
    Derived(int value)
        : Base { value }
    {
    }
};
int main()
{
    Base base { 5 };
    base.identify();

    Derived derived { 7 };
    derived.identify();

    return 0;
}
```

打印结果：

```
I am a Base
I am a Base
```

当调用 `derived.identify()` 时，编译器会查看 `identify()` 函数是否被定义在 `Derived` 类中。实际上没有。所以编译器会继续查看该类的父类（本例中的`Base`）。`Base`类定义了 `identify()` 函数，所以它会使用该函数。换言之，由于`Derived::identify()`不存在，所以实际调用的是 `Base::identify()` 。

这意味着，如果基类提供的函数满足需要，我们可以使用基类的函数。


## 重定义行为（函数）

不过，如果我们在派生类中定义了 `Derived::identify()`，则会调用这个版本的函数。

也就是，我们可以在派生类中重定义通过重新定义函数来使派生类具有不同的行为。

在上面的例子中，如果 `derived.identify()` 打印  “I am a Derived” 的话才更合理。所以，让我们在派生类中修改函数`identify()`，使其能够在我们调用 `derived.identify()` 时打印正确的内容。

要修改基类中定义的函数在派生类中的工作方式，只需重新定义派生类中的函数。


```cpp
#include <iostream>

class Derived: public Base
{
public:
    Derived(int value)
        : Base { value }
    {
    }

    int getValue() const { return m_value; }

    // 在此处修改函数
    void identify() const { std::cout << "I am a Derived\n"; }
};
```


类似的例子，但是调用了 `Derived::identify()` ：

```cpp
int main()
{
    Base base { 5 };
    base.identify();

    Derived derived { 7 };
    derived.identify();

    return 0;
}
```


```
I am a Base
I am a Derived
```

注意，当在派生类中重新定义函数时，==派生函数不会继承基类中同名函数的访问说明符。它使用派生类中定义它的任何访问说明符==。因此，在基类中定义为`private`的函数可以在派生类中重新定义为`public`，反之亦然！


```cpp
#include <iostream>

class Base
{
private:
	void print() const
	{
		std::cout << "Base";
	}
};

class Derived : public Base
{
public:
	void print() const
	{
		std::cout << "Derived ";
	}
};


int main()
{
	Derived derived;
	derived.print(); // calls derived::print(), which is public
	return 0;
}
```


## 添加功能

有时，我们不想完全替换基类的成员函数，而是想向它添加额外的功能。在上面的例子中，注意`Derived::identify()`完全替换了`Base::identify()`！这可能并不是我们想要的。可以让派生函数调用同名函数的基本版本(以便重用代码)，然后向其添加额外的功能。

要让派生函数调用同名的基函数，只需执行一个普通函数调用，但在函数前面加上[[scope-resolution-operator|作用域解析运算符]](基类的名称和两个冒号)。下面的示例重新定义了 `Derived::identify()`，它首先调用`Base::identify()`，然后执行自己的附加操作。


```cpp
#include <iostream>

class Derived: public Base
{
public:
    Derived(int value)
        : Base { value }
    {
    }

    int getValue() const  { return m_value; }

    void identify() const
    {
        Base::identify(); // call Base::identify() first
        std::cout << "I am a Derived\n"; // then identify ourselves
    }
};
```

考虑下面的例子：

```cpp
int main()
{
    Base base { 5 };
    base.identify();

    Derived derived { 7 };
    derived.identify();

    return 0;
}
```

输出结果：

```
I am a Base
I am a Base
I am a Derived
```

当 `derived.identify()` 执行s时，它被解析为 `Derived::identify()`。但是它做的第一件事是调用 `Base::identify()`，进而打印 “I am a Base”。当 `Base::identify()` 返回时，`Derived::identify()` 会继续执行并打印 “I am a Derived”。

很简单吧。

为什么我们需要使用[[scope-resolution-operator|作用域解析运算符]]呢？如果像下面这样定义 `Derived::identify()` 会怎样呢？

```cpp
#include <iostream>

class Derived: public Base
{
public:
    Derived(int value)
        : Base { value }
    {
    }

    int getValue() const { return m_value; }

    void identify() const
    {
        identify(); // Note: no scope resolution!
        cout << "I am a Derived";
    }
};
```



不使用作用域解析限定符而调用`identify()` 的话，默认情况会调用当前类中的 `identify()` ，这样调用的就是 `Derived::identify()`. This would cause Derived::identify() to call itself, which would lead to an infinite loop!

There’s one bit of trickiness that we can run into when trying to call friend functions in base classes, such as operator<<. Because friend functions of the base class aren’t actually part of the base class, using the scope resolution qualifier won’t work. Instead, we need a way to make our Derived class temporarily look like the Base class so that the right version of the function can be called.

Fortunately, that’s easy to do, using static_cast. Here’s an example:

```cpp
#include <iostream>

class Base
{
private:
	int m_value {};

public:
	Base(int value)
		: m_value{ value }
	{
	}

	friend std::ostream& operator<< (std::ostream& out, const Base& b)
	{
		out << "In Base\n";
		out << b.m_value << '\n';
		return out;
	}
};

class Derived : public Base
{
public:
	Derived(int value)
		: Base{ value }
	{
	}

	friend std::ostream& operator<< (std::ostream& out, const Derived& d)
	{
		out << "In Derived\n";
		// static_cast Derived to a Base object, so we call the right version of operator<<
		out << static_cast<const Base&>(d);
		return out;
	}
};

int main()
{
	Derived derived { 7 };

	std::cout << derived << '\n';

	return 0;
}
```

COPY

Because a Derived is-a Base, we can static_cast our Derived object into a Base, so that the appropriate version of operator<< that uses a Base is called.

This prints:

```
In Derived
In Base
7
```