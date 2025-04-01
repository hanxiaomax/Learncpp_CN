---
title: 25.11 - 使用 << 运算符打印继承类
alias: 25.11 - 使用 << 运算符打印继承类
origin: /printing-inherited-classes-using-operator/
origin_title: "18.11 — Printing inherited classes using operator<<"
time: 2022-8-26
type: translation
tags:
- inheritance
- operator<<
---

> [!note] "Key Takeaway"
> - [[friend-function|友元函数]]不属于[[member-function|成员函数]]，因此不能是[[virtual-function|虚函数]]
> - 不同类`<<`需要传入不同类的对象，所以即使能定义为虚函数，派生类也没法重写它
> - 友元的运算符可以将实际工作委派给一个普通的成员函数（[[virtual-function|虚函数]]），而且无需在派生类中实现该运算符，只需要实现该虚函数的重写函数即可

下面这个程序使用了[[virtual-function|虚函数]]：


```cpp
#include <iostream>

class Base
{
public:
	virtual void print() const { std::cout << "Base";  }
};

class Derived : public Base
{
public:
	void print() const override { std::cout << "Derived"; }
};

int main()
{
	Derived d{};
	Base& b{ d };
	b.print(); // will call Derived::print()

	return 0;
}
```

`b.print()` 会调用 `Derived::print()` (因为 `b` 指向 `Derived` 类型的对象 object，`Base::print()`是一个虚函数，而且 `Derived::print()` 是[[override|重写]]函数)。

虽然调用`print()`这样的成员函数来执行输出是可以的，但这种类型的函数不能很好地与`std::cout`一起使用：

```cpp
#include <iostream>

int main()
{
	Derived d{};
	Base& b{ d };

	std::cout << "b is a ";
	b.print(); // 显得杂乱，与一般的输出语句格格不入
	std::cout << '\n';

	return 0;
}
```


在这节课中，我们会学习如何使用 `operator<<` 打印继承类的信息，使我们可以使用下面的风格来使用：

```cpp
std::cout << "b is a " << b << '\n'; // much better
```


## 挑战

首先我们使用[[overload|重载]]的方式实现 `operator<<` ：

```cpp
#include <iostream>

class Base
{
public:
	virtual void print() const { std::cout << "Base"; }

	friend std::ostream& operator<<(std::ostream& out, const Base& b)
	{
		out << "Base";
		return out;
	}
};

class Derived : public Base
{
public:
	void print() const override { std::cout << "Derived"; }

	friend std::ostream& operator<<(std::ostream& out, const Derived& d)
	{
		out << "Derived";
		return out;
	}
};

int main()
{
	Base b{};
	std::cout << b << '\n';

	Derived d{};
	std::cout << d << '\n';

	return 0;
}
```

由于不需要[[virtual-function|虚函数]]解析，所以程序能够正确地工作并打印：

```
Base
Derived
```

再考虑下面的 `main()` ：

```cpp
int main()
{
    Derived d{};
    Base& bref{ d };
    std::cout << bref << '\n';

    return 0;
}
```

打印结果：
```
Base
```

显然输出结果不是我们想要的。当配合`Base`使用非虚的 `operator<<` 时，`std::cout << bref` 会调用基类的 `operator<<` 。

这就是我们要面临的挑战。

## Operator << 可以是虚函数吗？

如果问题的原因在于 `operator<<` 不是虚函数，那么可以把它设为 `virtual`吗？

不行！而且有很多原因：

首先，只有成员函数可以被虚拟化——这是有意义的，因为只有类可以从其他类继承，没有办法重写存在于类外部的函数(可以重载非成员函数，但不能重写它们)。因为我们通常将操作符`<<`实现为友元，==而友元不被视为成员函数==，所以操作符<<的友元版本不符合称为虚函数的条件。(要了解为什么要以这种方式实现操作符<<，请看[[21-5-overloading-operators-using-member-functions|21.5 - 使用成员函数重载运算符]])。

其次，即使我们可以把 `operator<<` 定义为虚函数，也存在 `Base::operator<<` 和 `Derived::operator<<` 的函数形参不同的问题(Base版本将接受Base形参，而Derived版本将接受Derived形参)。因此，`Derived` 版本不会被认为是`Base`版本的[[override|重写]]，因此不符合虚函数解析的条件。

那么应该怎么做呢？

## 解决办法

答案非常简单。

首先，在类中添加[[friend-function|友元函数]] `operator<<`  。但是，不要让 `operator<<`自己否则实际的打印，而是将这打印工作委托给一个可以被虚化的普通成员函数！

以下是有效的解决方案:

```cpp
#include <iostream>

class Base
{
public:
	// 重载的 operator<<
	friend std::ostream& operator<<(std::ostream& out, const Base& b)
	{
		// 委派给成员函数 print()
		return b.print(out);
	}

	// 我们依赖 print() 函数进行实际的打印工作
	// 因为 print 是一个普通的成员函数，所以可以是虚函数
	virtual std::ostream& print(std::ostream& out) const
	{
		out << "Base";
		return out;
	}
};

class Derived : public Base
{
public:
	// 重写的 print 函数
	std::ostream& print(std::ostream& out) const override
	{
		out << "Derived";
		return out;
	}
	//不需要实现operator<<
};

int main()
{
	Base b{};
	std::cout << b << '\n';

	Derived d{};
	std::cout << d << '\n'; // 注意，这一行代码可以正确工作，即使派生类都没有实现该运算符

	Base& bref{ d };
	std::cout << bref << '\n';

	return 0;
}
```

三条语句都能正确执行：

```
Base
Derived
Derived
```

让我们更详细地研究一下如何做到这一点。

首先，对于 `Base` 的例子，调用 `operator<<` 时会调用虚函数 `print()` 。因为的`Base` 引用参数指向一个`Base`对象，`b.print()` 解析为`Base::print()` 并执行打印。这里没什么特别的。

在对于`Derived`的例子，编译器首先查看是否有接受 `Derived`对象的 `<<` 。没有，因为我们没有定义，接下来，编译器查看是否有接受`Base` 对象的`<<`。有，所以编译器将`Derived` 对象隐式上转换为`Base&` 并调用函数，然后调用虚`print()` ，解析为`Derived::print()`。

注意，我们不需要为每个派生类定义`operator<<`，处理 `Base` 对象的版本对`Base` 及其派生的任何类可用！

第三种情况是前两种情况的混合。首先，编译器将变量`bref`与带有 Base  参数的 `operator<<` 匹配。它调用了虚函数`print()`。因为`Base`引用实际上是指向一个`Derived` 对象，所以它解析为`Derived::print()` ，正如我们期望的那样。

问题搞定！