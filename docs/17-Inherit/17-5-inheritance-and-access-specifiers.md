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

??? note "Key Takeaway"
	
	- 派生类从基类继承了一些属性，从外部来看，这些继承来的属性就好像是派生类的一样，但是实际上并不是。外部代码能否通过派生类访问这些继承来的属性时，需要参考继承类型使用的访问说明符。（降级为继承等级）
	- 派生类对基类成员的访问不受继承类型影响，只参考基类的访问修饰符

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


> [!info] "扩展阅读"
> 优先使用私有成员而不是受保护成员。
    
    
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


如果不选择继承类型，C++默认为私有继承(就像如果不指定其他类型，成员默认为私有访问一样)。

这为我们提供了9种组合：3个[[access-specifiers|成员访问修饰符]](公共、私有和受保护)和3种继承类型(公共、私有和受保护)。

那么它们的区别是什么呢？简而言之，当成员被继承时，继承成员的访问说明符可以根据所使用的继承类型更改(仅在派生类中)。换句话说，基类中公共的或受保护的成员，在派生类中可能是其他类型的。

这可能看起来有点令人困惑，不过不要担心，这节课剩下的时间我们将详细探讨这个问题。

在我们逐步学习这些例子时，请记住以下规则:

-  一个类总是能访问其自己的成员（非继承而来的）；
-  外部在访问一个类的成员时，基于该成员的访问修饰符判断是否能访问；
-  派生类在访问继承来的成员时，基于它从基类继承来的访问修饰符。这一点会根据访问说明符的不同和继承类型的不同而改变。


## 公开继承

[[public-inheritance|公开继承]]是最常用的继承类型。事实上，你很少会看到或使用其他类型的继承，因此你的主要关注点应该放在理解这一节上。幸运的是，公开继承也是最容易理解的。当公开继承基类时，继承的[[public-member|公有成员]]保持公有，继承的[[protected-members|受保护成员]]保持受保护。继承的私有成员由于在基类中是私有的而不可访问，因此仍然不可访问。

|基类中的访问说明符|	公有继承后的访问说明符 |
|:---:|:---:|
|Public	|Public
|Protected	|Protected
|Private	|Inaccessible

通过一个例子来说明：

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

class Pub: public Base // 注意: 公开继承
{
    // 公有继承意味着:
    // 公有继承的成员保持公有 (m_public 被当做 public 的)
    // 公有继承来的受保护成员仍然是受保护的( m_protected 是 protected 的)
    // 公有继承来的私有成员是不可访问的( m_private 不可访问)
public:
    Pub()
    {
        m_public = 1; // okay: m_public 可以被访问
        m_protected = 2; // okay: m_protected 可以被访问
        m_private = 3; // not okay: m_private 不可以被派生类访问
    }
};

int main()
{
    // 外部访问时基于被访问类的访问说明符判断
    Base base;
    base.m_public = 1; // 可以: m_public 在 Base 中是公有的
    base.m_protected = 2; //不可以 : m_protected 在 Base 中是受保护的
    base.m_private = 3; // 不可以: m_private 在 Base 中是私有的

    Pub pub;
    pub.m_public = 1; // 可以: m_public 在 Pub 中是公有的
    pub.m_protected = 2; // 不可以 : m_protected 在 Pub 中是受保护的
    pub.m_private = 3; // 不可以: m_private 在 Pub 中是不可以访问的

    return 0;
}
```

这与上面我们介绍受保护访问说明符的示例相同，不同的是，我们也实例化了派生类，只是为了表明使用公有继承，基类和派生类的工作方式是相同的。

==除非有特定的原因，否则你应该使用公共继承。==

> [!success] "最佳实践"
> 使用公有继承，除非你有特殊的理由不这样做。


## 受保护继承

受保护的继承是最不常见的继承方法。除了在非常特殊的情况下，它几乎从不被使用。通过受保护的继承，公共成员和受保护成员成为受保护成员，而私有成员保持不可访问状态。

因为这种形式的继承非常罕见，我们将跳过这个例子，只使用一个表进行总结:

|基类中的访问说明符	|受保护继承后的访问说明符|
|:--:|:--:|
|Public	|Protected
|Protected|	Protected
|Private|	Inaccessible


## 私有继承

使用私有继承，基类的所有成员都被继承为私有。这意味着私有成员是不可访问的，受保护的和公共成员也变成私有。

==注意，这不会影响派生类访问从其父类继承的成员的方式！它只影响试图通过派生类访问这些成员的代码。==

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



总结如下：

|基类中的访问修饰符|私有继承后的访问说明符|
|:--:|:--:|
|Public	|Private
|Protected	|Private
|Private|	Inaccessible


当派生类与基类没有明显的关系，但在内部使用基类实现时，私有继承可能很有用。在这种情况下，我们可能不希望基类的公共接口通过派生类的对象公开(如果公开继承就会这样)。

不过，在实践中，很少使用私有继承。


## 最后一个例子

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

`Base` 在访问自己的成员时，没有任何限制。在这个例子中，外部代码只能访问 `m_public`。派生类可以访问 `m_public` 和 `m_protected`。

```cpp
class D2 : private Base // note: private inheritance
{
	// 私有继承：
	// 继承来的公有成员变为私有
	// 继承来的受保护成员变为私有
	// 继承来的公有成员仍然是不可访问的
public:
	int m_public2 {};
protected:
	int m_protected2 {};
private:
	int m_private2 {};
};
```

`D2`可以不受限制地访问自己的成员。`D2`可以访问`Base`的`m_public`和`m_protected`成员，但不能访问`m_private`成员。因为`D2`私有地继承了`Base`，当通过`D2`访问时，`m_public`和`m_protected`现在被认为是私有的。这意味着在使用`D2`对象时，外部代码不能访问这些变量，==也不能访问从`D2`派生的任何类。==


```cpp
class D3 : public D2
{
	// 公有继承：
	// 继承来的公有成员仍然公有
	// 继承来的受保护成员仍然受保护
	// 继承来的私有成员仍然不可访问
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

`D3`可以不受限制地访问自己的成员。`D3`可以访问`D2`的`m_public2`和`m_protected2`成员，但不能访问`m_private2`成员。因为`D3`公开继承了`D2`，所以当通过`D3`访问时，`m_public2`和`m_protected2`保留了它们的访问修饰符。`D3`不能访问`Base`的`m_private`，它在`Base`中已经是私有的。它也不能访问`Base`的`m_protected`或`m_public`，当`D2`继承它们时，它们都变成了私有。


## 小结


访问说明符、继承类型和派生类的交互方式会导致很多混乱。尽量把事情弄清楚:

首先，类(及其友元)总是可以访问自己的非继承成员。访问说明符只影响外部和派生类是否可以访问这些成员。

其次，当派生类继承成员时，这些成员可能会更改派生类中的访问说明符。这不会影响派生类自己的(非继承的)成员(它们有自己的访问说明符)。它只影响外部人员和从派生类派生的类是否可以访问那些继承的成员。

下面是所有访问说明符和继承类型组合的表


|基类中的访问修饰符|公有继承时的访问修饰符|私有继承时的访问修饰符|受保护继承时的访问修饰符|
|:---:|:---:|:---:|:---:|
|Public	|Public	|Private	|Protected
|Protected	|Protected	|Private	|Protected
|Private	|Inaccessible	|Inaccessible	|Inaccessible


最后要注意的是，尽管在上面的例子中，我们只展示了使用成员变量的例子，但这些访问规则对所有成员都成立(例如，在类内部声明的成员函数和类型)。