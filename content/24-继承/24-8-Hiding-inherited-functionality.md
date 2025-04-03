---
title: 24.8 - 隐藏继承的函数
alias: 24.8 - 隐藏继承的函数
origin: /hiding-inherited-functionality/
origin_title: "17.8 — Hiding inherited functionality"
time: 2022-6-2
type: translation
tags:
- inheritance
- overriding
---



## 修改继承成员的访问级别

C++允许我们在派生类中更改继承成员的[[access-specifiers|成员访问修饰符]]。这是通过在新的访问说明符下使用 using声明来标识在派生类中更改其访问权限的(限定范围的)基类成员来实现的。


考虑下面的`Base`类：

```cpp
#include <iostream>

class Base
{
private:
    int m_value {};

public:
    Base(int value)
        : m_value { value }
    {
    }

protected:
    void printValue() const { std::cout << m_value; }
};
```


因为 `Base::printValue()` 类被声明为[[protected-members|受保护成员]]，所以它只能被`Base`或它的派生类访问。而外部代码是不能访问它的。

接下来，让我们把 `printValue()` 的访问级别调整为[[public-member|公有成员]]：

```cpp
class Derived: public Base
{
public:
    Derived(int value)
        : Base { value }
    {
    }

    // Base::printValue 是继承来的受保护成员，所以外部代码不能访问它
    // 但是我们可以使用 using 声明将其修改为public的
    using Base::printValue; // note: 注意这里没有括号
};
```


这意味着这段代码现在可以工作了：

```cpp
int main()
{
    Derived derived { 7 };

    // printValue public in Derived, so this is okay
    derived.printValue(); // prints 7
    return 0;
}
```


我们只能修改派生类中能够访问的基类成员成员的访问修饰符。因此，私有的基成员无法被修改为受保护或公有，因为派生类不能访问基类的私有成员。

## 隐藏函数

在 C++ 中，除了直接修改代码之外，还有别的办法删除或限制基类中函数的使用。基类中的的成员函数可以被隐藏起来，这样它就不能在派生类中被访问。要达到这个目的，只需要修改访问修饰符即可。

例如，可以把[[public-member|公有成员]]修改为[[private-member|私有成员]]：

```cpp
#include <iostream>
class Base
{
public:
	int m_value {};
};

class Derived : public Base
{
private:
	using Base::m_value;

public:
	Derived(int value)
	// We can't initialize m_value, since it's a Base member (Base must initialize it)
	{
		// But we can assign it a value
		m_value = value;
	}
};

int main()
{
	Derived derived { 7 };

	// The following won't work because m_value has been redefined as private
	std::cout << derived.m_value;

	return 0;
}
```

注意，这允许我们使用一个设计糟糕的基类，并将其数据良好地封装在派生类中。

或者，我们也可以私有地继承`Base`，除了[[public-inheritance|公开继承]]`Base`的成员并通过重写其访问说明符使`m_value` 变为[[private-member|私有成员]]之外，我们还可以 通过[[private-inheritance|私有继承]]的方式继承`Base`，这样一来`Base`的所有成员在一开始就被私有地继承。

你也可以在派生类中将成员函数标记为`delete`，以确保它们不能通过派生对象调用:


```cpp
#include <iostream>
class Base
{
private:
	int m_value {};

public:
	Base(int value)
		: m_value { value }
	{
	}

	int getValue() const { return m_value; }
};

class Derived : public Base
{
public:
	Derived(int value)
		: Base { value }
	{
	}


	int getValue() = delete; // mark this function as inaccessible
};

int main()
{
	Derived derived { 7 };

	// The following won't work because getValue() has been deleted!
	std::cout << derived.getValue();

	return 0;
}
```

在上面的例子中，`getValue()` 函数被标记为`delete`。这意味着调用派生类中的该函数时会导致编译器报错。==注意，基类中的`getValue()` 函数仍然可以使用==。我们可以通过两种方式调用 `Base::getValue()`：

```cpp
int main()
{
	Derived derived { 7 };

	// 可以直接调用 Base::getValue()
	std::cout << derived.Base::getValue();

	// 将子类转换为基类然后调用 getValue() 就会解析到 Base::getValue()
	std::cout << static_cast<Base&>(derived).getValue();

	return 0;
}
```


==如果使用强制转换方法，则强制转换为Base&而不是Base，以避免生成 `derived` 的`Base`部分的副本。==
