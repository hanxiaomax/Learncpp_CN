---
title: 18.10 - 动态类型转换
alias: 18.10 - 动态类型转换
origin: /dynamic-casting/
origin_title: "18.10 — Dynamic casting"
time: 2022-8-6
type: translation
tags:
- dynamic casting
---

??? note "Key Takeaway"



早在 [[8-5-Explicit-type-conversion-casting-and-static-cast|8.5 - 显式类型转换和static_cast]] 中我们就讨论过类型转换的话题，当时我们使用[[static-casts|静态类型转换]]—— `static_cast` 将变量转换为其他类型。

本节课我们会讨论另外一种类型的转换：[[dynamic-casts|动态类型转换]]——`dynamic_cast`.

## `dynamic_cast` 的必要性

在处理[[polymorphism|多态]]时经常会遇到这样的情况：你有一个指向基类的指针，但需要访问存在于派生类中的一些信息。

考虑以下程序：

```cpp
#include <iostream>
#include <string>

class Base
{
protected:
	int m_value{};

public:
	Base(int value): m_value{value}
	{
	}

	virtual ~Base() = default;
};

class Derived : public Base
{
protected:
	std::string m_name{};

public:
	Derived(int value, const std::string& name)
		: Base{value}, m_name{name}
	{
	}

	const std::string& getName() const { return m_name; }
};

Base* getObject(bool returnDerived)
{
	if (returnDerived)
		return new Derived{1, "Apple"};
	else
		return new Base{2};
}

int main()
{
	Base* b{ getObject(true) };

	// 在这里如何打印派生类对象的名字呢？此时只有一个基类的指针

	delete b;

	return 0;
}
```

在这个程序中，函数`getObject()`总是返回一个`Base`指针，但该指针可以指向`Base`对象或`Derived`对象。在指针指向派生对象的情况下，如何调用`Derived::getName()`?

一种方法是向`Base`添加一个名为`getName()`的虚函数(这样我们就可以用 `Base` 指针/引用调用它，并动态解析为`Derived::getName()`)。但是如果你用一个指向 `Base` 对象的 `Base` 指针/引用调用它，这个函数又应该返回什么呢？返回什么值都是没有实际意义的（也不能为纯虚因为基类要能够被实例化）。这个函数对基类是没有意义的，只有派生类需要考虑实现该函数，那么我们为什么要用这个函数来“污染”基类呢？

我们知道，C++ 允许你将 `Derived` 指针隐式地转换为 `Base` 指针(实际上，`getObject()`正是这样做的)。这个过程有时被称为[[upcasting|向上转换(upcasting|)]]。那么，是否有一种方法可以将 `Base` 指针转换回 `Derived` 类指针呢？这样的话，我们就可以直接使用该指针调用`Derived::getName()`，而不必依赖虚函数解析。


## `dynamic_cast`

C++ 提供了一个名为 `dynamic_cast` 的强制转换操作符，可用于此目的。尽管动态强制转换有一些不同的功能，但到目前为止，动态强制转换最常见的用途是将基类指针转换为派生类指针。这个过程被称为[[downcasting|向下转换（downcasting）]]。

使用 `dynamic_cast` 和 `static_cast` 类似。基于上面的例子，我们可以使用 `dynamic_cast` 将 `Base` 指针转换为 `Derived` 指针：

```cpp
int main()
{
	Base* b{ getObject(true) };

	Derived* d{ dynamic_cast<Derived*>(b) }; // 使用动态转换将 Base 指针转换为 Derived 指针

	std::cout << "The name of the Derived is: " << d->getName() << '\n';

	delete b;

	return 0;
}
```

打印：

```
The name of the Derived is: Apple
```

## dynamic_cast 失败

上面的例子能够正常工作，因为`b`实际上指向一个`Derived`对象，因此将`b`转换为`Derived`指针是成功的。

然而，我们做了一个相当危险的假设：`b`指向一个派生对象。如果`b`不指向派生对象呢？这很容易通过将`getObject()`的参数从`true`更改为`false`来测试。在这种情况下，`getObject()`将返回一个`Base`对象的`Base`指针。当我们尝试将`dynamic_cast`转换为派生类型时，它会失败，因为无法进行转换。

如果 `dynamic_cast` 失败，则转换结果会是一个空指针。

因为我们没有检查空指针的结果，所以我们访问`d->getName()`，它将尝试解引用空指针，导致[[undefined-behavior|未定义行为]](可能是崩溃)。

为了使这个程序安全，需要确保 `dynamic_cast` 的结果实际上是成功的：


```cpp
int main()
{
	Base* b{ getObject(true) };

	Derived* d{ dynamic_cast<Derived*>(b) }; // use dynamic cast to convert Base pointer into Derived pointer

	if (d) // 确保 d 是非空
		std::cout << "The name of the Derived is: " << d->getName() << '\n';

	delete b;

	return 0;
}
```


!!! note "法则"

	总是要通过检查返回值是否为空指针来确保动态转换成功。

注意，由于 `dynamic_cast` 在运行时进行一些一致性检查(以确保可以进行转换)，因此使用 `dynamic_cast` 确实会导致性能损失。

此外，还需要注意以下情形，此时使用 `dynamic_cast` 进行[[downcasting|向下转换]]是不能成功的：

1.  [[protected-inheritance|受保护继承]]和[[private-inheritance|私有继承]]的类；
2.  对于没有声明或继承任何虚函数(因此没有虚表)的类；
3.  在某些情况下涉及[[virtual-base-class|虚基类]]的情况 (参考 [这里](https://msdn.microsoft.com/en-us/library/cby9kycs.aspx) 查看一些情况的示例，以及如何解决它们)。

## 使用 `static_cast`进行向下转换

事实证明，向下转换也可以使用 `static_cast` 完成。==主要的区别是 `static_cast` 不进行运行时类型检查==，以确保您所做的工作是有意义的。这使得使用 `static_cast` 更快，但更危险。如果将 `Base*` 转换为`Derived*`，即使基类指针没有指向派生类对象，它也会“成功”。当您尝试访问结果派生指针(实际上指向 `Base` 对象)时，这将导致未定义的行为。

如果你可以保证向下强制转换的指针将成功，那么可以使用 `static_cast` 。这里有一个(不是很好的)方法，通过虚函数判断所指的对象是不是正确的类型：

```cpp
#include <iostream>
#include <string>

// Class identifier
enum class ClassID
{
	base,
	derived
	// Others can be added here later
};

class Base
{
protected:
	int m_value{};

public:
	Base(int value)
		: m_value{value}
	{
	}

	virtual ~Base() = default;
	virtual ClassID getClassID() const { return ClassID::base; }
};

class Derived : public Base
{
protected:
	std::string m_name{};

public:
	Derived(int value, const std::string& name)
		: Base{value}, m_name{name}
	{
	}

	const std::string& getName() const { return m_name; }
	virtual ClassID getClassID() const { return ClassID::derived; }

};

Base* getObject(bool bReturnDerived)
{
	if (bReturnDerived)
		return new Derived{1, "Apple"};
	else
		return new Base{2};
}

int main()
{
	Base* b{ getObject(true) };

	if (b->getClassID() == ClassID::derived)
	{
		// We already proved b is pointing to a Derived object, so this should always succeed
		Derived* d{ static_cast<Derived*>(b) };
		std::cout << "The name of the Derived is: " << d->getName() << '\n';
	}

	delete b;

	return 0;
}
```

虽然的确有用但是实现起来还是有点费事的(还要付出调用虚函数和处理结果的代价)，那么还不如使用直接使用 `dynamic_cast`。

## dynamic_cast 和引用

尽管上面的所有示例都以指针的动态强制转换(这更常见)为例，但 `dynamic_cast` 也可以用于引用：

```cpp
#include <iostream>
#include <string>

class Base
{
protected:
	int m_value;

public:
	Base(int value)
		: m_value{value}
	{
	}

	virtual ~Base() = default;
};

class Derived : public Base
{
protected:
	std::string m_name;

public:
	Derived(int value, const std::string& name)
		: Base{value}, m_name{name}
	{
	}

	const std::string& getName() const { return m_name; }
};

int main()
{
	Derived apple{1, "Apple"}; // create an apple
	Base& b{ apple }; // set base reference to object
	Derived& d{ dynamic_cast<Derived&>(b) }; // 对引用进行动态转换

	std::cout << "The name of the Derived is: " << d.getName() << '\n'; // 使用 d 访问 Derived::getName through d

	return 0;
}
```

因为C++中没有“空引用”，所有 `dynamic_cast` 在失败时不能返回空引用。所以，如果引用的 `dynamic_cast` 失败，则会抛出`std::bad_cast` 类型的异常。我们将在本教程后面讨论异常。

## `dynamic_cast` vs `static_cast`

新手程序员有时会对何时使用`static_cast`和`dynamic_cast`感到困惑。答案很简单：除非是向下类型转换（在这种情况下，dynamic_cast通常是更好的选择），否则一律使用 static_cast。但是，你还应该考虑完全避免强制转换，而只使用虚函数。

## 向下转换 vs 虚函数

有些开发人员认为`dynamic_cast`是邪恶的，是类没有被设计好的特征。相反，这些程序员认为应该使用虚函数。

一般来说，==使用虚函数应该优先于向下转换==。然而，有时候使用向下转换会是更好的选择：

- 当你不能修改基类来添加虚函数时(例如，因为基类是标准库的一部分)
- 当你需要访问特定于派生类的东西时(例如，一个只存在于派生类中的访问函数)
- 在基类中添加虚函数是没有意义的(例如，基类没有适当的返回值)。如果不需要实例化基类，则可以使用纯虚函数。


## 对 `dynamic_cast` 和 RTTI 的一些警示

[[Run-time-type-information-RTTI|运行时类型信息(RTTI)]]是C++的一个特性，它在运行时会暴露对象数据类型的信息。`dynamic_cast` 利用了特性。因为RTTI有相当大的空间性能开销，一些编译器允许你关闭RTTI作为一种优化方式。不用说，如果这样做，`dynamic_cast` 将不能正确工作。