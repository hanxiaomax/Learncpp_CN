---
title: 18.3 - override、final标识符以及协变返回类型
alias: 18.3 - override、final标识符以及协变返回类型
origin: /the-override-and-final-specifiers-and-covariant-return-types/
origin_title: "18.3 — The override and final specifiers, and covariant return types"
time: 2022-8-23
type: translation
tags:
- override
- final
- covariant-return-types
---

??? note "关键点速记"
	- 派生类虚函数只有在其签名和返回类型完全匹配的情况下才被认为是重写，使用关键字 `override` 可以防止错误 
	- 在基类的虚函数中使用 `virtual` 关键字。在派生类中对应的函数中使用`override`关键字（无需使用`virtual`关键字）。
	- 因为`override`修饰符意味着该函数是虚函数，所以不需要使用`virtual`关键字重复标记已经被标记为`override`的函数
	- 如果虚函数的返回值是指向相同类的指针或引用，其重写函数也可以返回指向派生类的指针和引用。这个机制称为[[covariant|协变返回值类型]]


为了解决继承方面的一些常见问题，C++提供了两个特殊标识符：`override` 和 `final`。注意，==这些标识符不被认为是关键字==——它们是在某些上下文中具有特殊含义的普通标识符。

`final`使用得不多，但`override`是一个很好的功能，应该经常使用。在这一课中，我们会分别介绍二者，以及虚函数重写返回类型必须匹配的规则的一个例外。


## `override` 修饰符

正如我们在上一课中提到的，==派生类虚函数只有在其签名和返回类型完全匹配的情况下才被认为是重写==。这可能会导致容易被忽略的问题，即打算被重写的函数实际上并没有被重写。

考虑下面的例子:

```cpp
#include <iostream>
#include <string_view>

class A
{
public:
	virtual std::string_view getName1(int x) { return "A"; }
	virtual std::string_view getName2(int x) { return "A"; }
};

class B : public A
{
public:
	virtual std::string_view getName1(short int x) { return "B"; } // 注意: 参数是 short int
	virtual std::string_view getName2(int x) const { return "B"; } // 注意: 函数是 const
};

int main()
{
	B b{};
	A& rBase{ b };
	std::cout << rBase.getName1(1) << '\n';
	std::cout << rBase.getName2(2) << '\n';

	return 0;
}
```


因为 `rBase` 是B中A部分的引用，所以这里的本意是使用虚函数来访问 `B::getName1()` 和 `B::getName2()`。但是，由于`B::getName1()` 的参数并不同所以没有被看做是对 `A::getName1()`的重写。更隐蔽的是，因为`B::getName2()` 是 const 而 `A::getName2()`不是，所以 `B::getName2()` 也不会被看做是 `A::getName2()`的重写。

因此，程序打印结果如下：

```
A
A
```

在本例中，因为A和B只是打印了它们各自的名称，所以很容易发现错误，即因为重写没有生效而调用了错误的虚函数。然而，在更复杂的程序中，函数的行为或返回值没有打印出来，这样的问题很难调试。

为了帮助解决本该被重写但却没有被重写的函数的问题，可以将`override`修饰符放置在const将要放置的位置，从而将`override`应用于任何虚函数。如果基类函数没有重写(或应用于非虚函数)，编译器将会错误。


```cpp
#include <string_view>

class A
{
public:
	virtual std::string_view getName1(int x) { return "A"; }
	virtual std::string_view getName2(int x) { return "A"; }
	virtual std::string_view getName3(int x) { return "A"; }
};

class B : public A
{
public:
	std::string_view getName1(short int x) override { return "B"; } // compile error, function is not an override
	std::string_view getName2(int x) const override { return "B"; } // compile error, function is not an override
	std::string_view getName3(int x) override { return "B"; } // okay, function is an override of A::getName3(int)

};

int main()
{
	return 0;
}
```


上面的程序会报告两个编译错误：第一个是 `B::getName1()`相关错误，第二个是`B::getName2()`相关错误。因它们都没有成功地重写基类中的函数。`B::getName3()` 重写成功，所以没有问题。

因为使用`override`说明符不会影响性能，而且它有助于确保重写实际发生，所以应该使用该修饰符标记所有虚函数。此外，因为`override`修饰符意味着该函数是虚函数，所以不需要使用`virtual`关键字重复标记已经被标记为`override`的函数。


!!! success "最佳实践"

	在基类的虚函数中使用 `virtual` 关键字。在派生类中对应的函数中使用`override`关键字（无需使用`virtual`关键字）。
	

## `final` 修饰符

在某些情况下，你可能不希望有人能够重写虚函数或不希望类被继承。`final` 修饰符可以用来告诉编译器确保这一点。如果用户试图重写被标记为`final`的函数或继承已指定为`final`的类，编译器将给出编译错误。

在我们想要限制用户重写函数的情况下，`final` 修饰符用在`override`修饰符的相同位置，如下所示:


```cpp
#include <string_view>

class A
{
public:
	virtual std::string_view getName() { return "A"; }
};

class B : public A
{
public:
	// note use of final specifier on following line -- that makes this function no longer overridable
	std::string_view getName() override final { return "B"; } // okay, 重写 A::getName()
};

class C : public B
{
public:
	std::string_view getName() override { return "C"; } // 编译错误: 试图重写被标记为 final 的 B::getName()
};
```


在上面的代码中，`B::getName()` 重写了 `A::getName()`，这里没有任何问题。但是由于 `B::getName()` 具有 `final` 修饰符，所以任何对它的重写都是不允许的，会被认为是错误。 `C::getName()` 对 B::getName() (与这里的`override`说明符并不相关，这里只是一个好习惯罢了) 来说是重写，所以编译器会报错。

在我们想要防止从一个类继承的情况下，`final`修饰符应用在类名之后：


```cpp
#include <string_view>

class A
{
public:
	virtual std::string_view getName() { return "A"; }
};

class B final : public A // note use of final specifier here
{
public:
	std::string_view getName() override { return "B"; }
};

class C : public B // compile error: cannot inherit from final class
{
public:
	std::string_view getName() override { return "C"; }
};
```

在上面的例子中，类B被声明为final。因此，当C试图从B继承时，编译器将给出一个编译错误。


## 协变返回值类型


有一种情况下，派生类中重写的虚函数，可以和基类中的虚函数具有不同的返回值，但仍然被认为是有效的重写。==如果虚函数的返回值是指向相同类的指针或引用，其重写函数也可以返回指向派生类的指针和引用。这个机制称为[[covariant|协变返回值类型]]==。

例如：

```cpp
#include <iostream>
#include <string_view>

class Base
{
public:
	// This version of getThis() returns a pointer to a Base class
	virtual Base* getThis() { std::cout << "called Base::getThis()\n"; return this; }
	void printType() { std::cout << "returned a Base\n"; }
};

class Derived : public Base
{
public:
	// Normally override functions have to return objects of the same type as the base function
	// However, because Derived is derived from Base, it's okay to return Derived* instead of Base*
	Derived* getThis() override { std::cout << "called Derived::getThis()\n";  return this; }
	void printType() { std::cout << "returned a Derived\n"; }
};

int main()
{
	Derived d{};
	Base* b{ &d };
	d.getThis()->printType(); // 调用 Derived::getThis(), 返回 Derived*, 调用 Derived::printType
	b->getThis()->printType(); // 调用 Derived::getThis(), 返回 Base*, 调用 Base::printType

	return 0;
}
```

打印结果：

```
called Derived::getThis()
returned a Derived
called Derived::getThis()
returned a Base
```


关于协变返回类型有一个有趣的注意事项：C++不支持动态类型，因此你总是得到与所调用函数的实际版本相匹配的类返回值型。

在上面的例子中，我们首先调用`d.getThis()`。因为`d`是派生的，所以调用`Derived::getThis()`，它返回一个`Derived*`。然后这个`Derived*`被用来调用非虚函数`Derived::printType()`。

换言之，在上面的例子中，如果你使用 `Derived` 类型的对象调用 `getThis()`，那你得到的就是 `Derived*` 类型的返回值。

如果 `printType()` 是虚函数的话情况则不同，则 `b->getThis()` (`Base*`的对象) 就会进行虚函数解析，调用 `Derived::printType()`。

协变返回类型通常用于虚成员函数返回包含该成员函数的类的指针或引用(例如`Base::getThis()`返回`Base*`， `Derived::getThis()`返回`Derived*`)的情况。然而，这并不是严格必要的。在覆盖成员函数的返回类型派生自基本虚成员函数的返回类型的任何情况下，都可以使用协变返回类型。
