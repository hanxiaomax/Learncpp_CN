---
title: 17.5 - 继承和访问说明符
alias: 17.5 - 继承和访问说明符
origin: /inheritance-and-access-specifiers/
origin_title: "17.5 — Inheritance and access specifiers"
time: 2022-3-24
type: translation
tags:
- inheritance
- access-specifiers
---

??? note "关键点速记"
	
	-

在本章前面的课程中，您已经了解了基继承是如何工作的。到目前为止，在我们所有的例子中，我们都使用了公开继承。也就是说，我们的派生类公开继承基类。

在这一课中，我们将进一步了解公开继承，以及另外两种类型的继承(私有的和受保护的)。我们还将探讨不同类型的继承如何与[[access-specifiers|成员访问修饰符]]，以允许或限制对成员的访问。

至此，你已经看到了私有访问说明符和公共访问说明符，它们决定谁可以访问类的成员。快速复习一下，[[public-member|公有成员]]可以被任何人访问。[[private-member|私有成员]]只能由同一类或[[friend-class|友元类]]的成员函数访问。这意味着派生类不能直接访问基类的私有成员！


```cpp
class Base
{
private:
    int m_private {}; // can only be accessed by Base members and friends (not derived classes)
public:
    int m_public {}; // can be accessed by anybody
};
```

非常简单吧，你应该已经能够很好地掌握并使用这些知识了。

## `protected` 访问说明符

当配合继承类工作时，问题变得复杂了一些。

C++ 提供了第三种访问说明符，它只在使用继承的场合中有用途。`protected` 访问说明符允许成员被类本身、友元类和派生类访问。但是，[[protected-members|受保护成员]] 不能被外部类访问。

```cpp
class Base
{
public:
    int m_public {}; // 可以被任何人访问
protected:
    int m_protected {}; // 可以被 Base、友元类和派生类访问
private:
    int m_private {}; // 只能被 Base 和友元访问（不能被派生类直接访问）
};

class Derived: public Base
{
public:
    Derived()
    {
        m_public = 1; // 允许: 可以在派生类中访问基类的公有成员
        m_protected = 2; // 允许: 可以在派生类中访问基类中的受保护成员
        m_private = 3; // 不允许：不能在派生类中访问基类的私有成员
    }
};

int main()
{
    Base base;
    base.m_public = 1; // 允许: 可以从外部类访问公有成员
    base.m_protected = 2; // 不允许: 不能够从外部类访问公有成员
    base.m_private = 3; // 不允许：不能够从外部访问私有成员

    return 0;
}
```

在上面的例子中，你可以看到受保护的基类的成员`m_protected`可以直接由派生类访问，但不能在外部被访问。

## 那么，应该在何时使用`protected`访问说明符？

基类中的[[protected-members|受保护成员]]可以直接被派生类访问。这意味着，如果你以后更改了受保护属性的任何内容(类型、值的含义等等)，你可能需要同时更改基类和所有派生类。

因此，受保护访问说明符适用于你从自己编写类中继承并且派生类数量并不多的情况。这样，如果你对基类的实现进行了更改，并且因此需要对派生类进行更新，那么可以自己进行更新(并且不会花费太长时间，因为派生类的数量是有限的)。

将成员设为私有意味着公共类和派生类不能直接对基类进行更改。这有利于将公共类或派生类与实现更改隔离开来，并确保适当地维护不变量。但是，这也意味着你的类可能需要一个更大的公开(或受保护的)接口来支持公共或派生类操作所需的所有功能，该接口有其自身的构建、测试和维护成本。

一般来说，如果可以的话，最好将成员设为私有的，只有准备创建派生类且构建和维护到那些私有成员的接口的成本过高时才使用受`protected`访问说明符。


!!! info "扩展阅读"

    优先使用私有成员而不是受保护成员。
    
    
## 不同类型的继承以及它们对成员访问的影响

首先，继承类型有三种：[[public-inheritance|公开继承]]、[[protected-inheritance|受保护继承]]和[[private-inheritance|私有继承]]。

只需在继承类时指定需要的访问类型就可以：

```cpp
// Inherit from Base publicly
class Pub: public Base
{
};

// Inherit from Base protectedly
class Pro: protected Base
{
};

// Inherit from Base privately
class Pri: private Base
{
};

class Def: Base // Defaults to private inheritance
{
};
```

If you do not choose an inheritance type, C++ defaults to private inheritance (just like members default to private access if you do not specify otherwise).

That gives us 9 combinations: 3 member access specifiers (public, private, and protected), and 3 inheritance types (public, private, and protected).

So what’s the difference between these? In a nutshell, when members are inherited, the access specifier for an inherited member may be changed (in the derived class only) depending on the type of inheritance used. Put another way, members that were public or protected in the base class may change access specifiers in the derived class.

This might seem a little confusing, but it’s not that bad. We’ll spend the rest of this lesson exploring this in detail.

Keep in mind the following rules as we step through the examples:

如果不选择继承类型，c++默认为私有继承(就像如果不指定其他类型，成员默认为私有访问一样)。

这为我们提供了9种组合:3个成员访问说明符(公共、私有和受保护)和3种继承类型(公共、私有和受保护)。

那么它们的区别是什么呢?简而言之，当成员被继承时，继承成员的访问说明符可以根据所使用的继承类型更改(仅在派生类中)。换句话说，基类中公共的或受保护的成员可以更改派生类中的访问说明符。

这可能看起来有点令人困惑，但它并没有那么糟糕。这节课剩下的时间我们将详细探讨这个问题。

在我们逐步学习这些例子时，请记住以下规则:


-   A class can always access its own (non-inherited) members.
-   The public accesses the members of a class based on the access specifiers of the class it is accessing.
-   A derived class accesses inherited members based on the access specifier inherited from the parent class. This varies depending on the access specifier and type of inheritance used.

## Public inheritance

Public inheritance is by far the most commonly used type of inheritance. In fact, very rarely will you see or use the other types of inheritance, so your primary focus should be on understanding this section. Fortunately, public inheritance is also the easiest to understand. When you inherit a base class publicly, inherited public members stay public, and inherited protected members stay protected. Inherited private members, which were inaccessible because they were private in the base class, stay inaccessible.


Access specifier in base class	Access specifier when inherited publicly
Public	Public
Protected	Protected
Private	Inaccessible

Here’s an example showing how things work:

```cpp
class Base
{
public:
    int m_public {};
protected:
    int m_protected {};
private:
    int m_private {};
};

class Pub: public Base // note: public inheritance
{
    // Public inheritance means:
    // Public inherited members stay public (so m_public is treated as public)
    // Protected inherited members stay protected (so m_protected is treated as protected)
    // Private inherited members stay inaccessible (so m_private is inaccessible)
public:
    Pub()
    {
        m_public = 1; // okay: m_public was inherited as public
        m_protected = 2; // okay: m_protected was inherited as protected
        m_private = 3; // not okay: m_private is inaccessible from derived class
    }
};

int main()
{
    // Outside access uses the access specifiers of the class being accessed.
    Base base;
    base.m_public = 1; // okay: m_public is public in Base
    base.m_protected = 2; // not okay: m_protected is protected in Base
    base.m_private = 3; // not okay: m_private is private in Base

    Pub pub;
    pub.m_public = 1; // okay: m_public is public in Pub
    pub.m_protected = 2; // not okay: m_protected is protected in Pub
    pub.m_private = 3; // not okay: m_private is inaccessible in Pub

    return 0;
}
```

COPY

This is the same as the example above where we introduced the protected access specifier, except that we’ve instantiated the derived class as well, just to show that with public inheritance, things work identically in the base and derived class.

Public inheritance is what you should be using unless you have a specific reason not to.

!!! success "最佳实践"

	Use public inheritance unless you have a specific reason to do otherwise.


## Protected inheritance

Protected inheritance is the least common method of inheritance. It is almost never used, except in very particular cases. With protected inheritance, the public and protected members become protected, and private members stay inaccessible.

Because this form of inheritance is so rare, we’ll skip the example and just summarize with a table:


Access specifier in base class	Access specifier when inherited protectedly
Public	Protected
Protected	Protected
Private	Inaccessible

## Private inheritance

With private inheritance, all members from the base class are inherited as private. This means private members are inaccessible, and protected and public members become private.

Note that this does not affect the way that the derived class accesses members inherited from its parent! It only affects the code trying to access those members through the derived class.

```cpp
class Base
{
public:
    int m_public {};
protected:
    int m_protected {};
private:
    int m_private {};
};

class Pri: private Base // note: private inheritance
{
    // Private inheritance means:
    // Public inherited members become private (so m_public is treated as private)
    // Protected inherited members become private (so m_protected is treated as private)
    // Private inherited members stay inaccessible (so m_private is inaccessible)
public:
    Pri()
    {
        m_public = 1; // okay: m_public is now private in Pri
        m_protected = 2; // okay: m_protected is now private in Pri
        m_private = 3; // not okay: derived classes can't access private members in the base class
    }
};

int main()
{
    // Outside access uses the access specifiers of the class being accessed.
    // In this case, the access specifiers of base.
    Base base;
    base.m_public = 1; // okay: m_public is public in Base
    base.m_protected = 2; // not okay: m_protected is protected in Base
    base.m_private = 3; // not okay: m_private is private in Base

    Pri pri;
    pri.m_public = 1; // not okay: m_public is now private in Pri
    pri.m_protected = 2; // not okay: m_protected is now private in Pri
    pri.m_private = 3; // not okay: m_private is inaccessible in Pri

    return 0;
}
```

COPY

To summarize in table form:


Access specifier in base class	Access specifier when inherited privately
Public	Private
Protected	Private
Private	Inaccessible
Private inheritance can be useful when the derived class has no obvious relationship to the base class, but uses the base class for implementation internally. In such a case, we probably don’t want the public interface of the base class to be exposed through objects of the derived class (as it would be if we inherited publicly).

In practice, private inheritance is rarely used.

## A final example

```cpp
class Base
{
public:
	int m_public {};
protected:
	int m_protected {};
private:
	int m_private {};
};
```

COPY

Base can access its own members without restriction. The public can only access m_public. Derived classes can access m_public and m_protected.

```cpp
class D2 : private Base // note: private inheritance
{
	// Private inheritance means:
	// Public inherited members become private
	// Protected inherited members become private
	// Private inherited members stay inaccessible
public:
	int m_public2 {};
protected:
	int m_protected2 {};
private:
	int m_private2 {};
};
```

COPY

D2 can access its own members without restriction. D2 can access Base’s m_public and m_protected members, but not m_private. Because D2 inherited Base privately, m_public and m_protected are now considered private when accessed through D2. This means the public can not access these variables when using a D2 object, nor can any classes derived from D2.

```cpp
class D3 : public D2
{
	// Public inheritance means:
	// Public inherited members stay public
	// Protected inherited members stay protected
	// Private inherited members stay inaccessible
public:
	int m_public3 {};
protected:
	int m_protected3 {};
private:
	int m_private3 {};
};
```

COPY

D3 can access its own members without restriction. D3 can access D2’s m_public2 and m_protected2 members, but not m_private2. Because D3 inherited D2 publicly, m_public2 and m_protected2 keep their access specifiers when accessed through D3. D3 has no access to Base’s m_private, which was already private in Base. Nor does it have access to Base’s m_protected or m_public, both of which became private when D2 inherited them.

## Summary

The way that the access specifiers, inheritance types, and derived classes interact causes a lot of confusion. To try and clarify things as much as possible:

First, a class (and friends) can always access its own non-inherited members. The access specifiers only affect whether outsiders and derived classes can access those members.

Second, when derived classes inherit members, those members may change access specifiers in the derived class. This does not affect the derived classes’ own (non-inherited) members (which have their own access specifiers). It only affects whether outsiders and classes derived from the derived class can access those inherited members.

Here’s a table of all of the access specifier and inheritance types combinations:


Access specifier in base class	Access specifier when inherited publicly	Access specifier when inherited privately	Access specifier when inherited protectedly
Public	Public	Private	Protected
Protected	Protected	Private	Protected
Private	Inaccessible	Inaccessible	Inaccessible

As a final note, although in the examples above, we’ve only shown examples using member variables, these access rules hold true for all members (e.g. member functions and types declared inside the class).

