---
title: 18.2 - 虚函数和多态
alias: 18.2 - 虚函数和多态
origin: /virtual-functions/
origin_title: "18.2 — Virtual functions and polymorphism"
time: 2022-8-12
type: translation
tags:
- virtual functions
- polymorphism
---

??? note "关键点速记"

	- 虚函数将解析为最后被派生的版本（在原始对象和引用对象之间的派生链上查找）
	- 龙生龙凤生凤，虚函数的重写函数虚函数
	- 解析虚函数调用的时间比解析常规函数调用的时间长。此外，编译器还必须为每个具有一个或多个虚函数的类对象分配一个额外的指针

在[[18-1-pointers-and-references-to-the-base-class-of-derived-objects|18.1 - 基类的指针和引用]]中，我们介绍了一些可以使用基类指针或引用简化代码的例子。但是，在这些例子中，最大的问题就在于基类的指针只能够调用基类版本的函数，无法调用派生类的函数。

例如：
```cpp
#include <iostream>
#include <string_view>

class Base
{
public:
    std::string_view getName() const { return "Base"; }
};

class Derived: public Base
{
public:
    std::string_view getName() const { return "Derived"; }
};

int main()
{
    Derived derived;
    Base& rBase{ derived };
    std::cout << "rBase is a " << rBase.getName() << '\n';

    return 0;
}
```

打印：

`rBase is a Base`

因为 `rBase` 是 `Base` 类型的引用，它会调用 `Base::getName()`，即便它实际上引用的是`Derived`类型中的`Base`部分。

在这节课中，我们会使用[[virtual-function|虚函数]]来解决该问题。

## 虚函数和多态

[[virtual-function|虚函数]]是一类特殊的函数，当它被调用时，实际解析到的是最后派生类中对应版本的函数（需要同时存在于派生类和基类中）。这个机制称为[[polymorphism|多态]]。如果派生类中有具有相同[[signature|签名]] (函数名、参数类型、是否为const）并且返回值类型一样的函数，则这些函数称为[[override|重写函数（override）]]。

定义虚函数时，只需在函数声明前添加“virtual”关键字。

使用虚函数改写上面的例子：

```cpp
#include <iostream>
#include <string_view>

class Base
{
public:
    virtual std::string_view getName() const { return "Base"; } // note addition of virtual keyword
};

class Derived: public Base
{
public:
    virtual std::string_view getName() const { return "Derived"; }
};

int main()
{
    Derived derived;
    Base& rBase{ derived };
    std::cout << "rBase is a " << rBase.getName() << '\n';

    return 0;
}
```


打印结果：

```
rBase is a Derived
```

因为 `rBase` 是 `Derived` 类型对象中 `Base` 部分的引用，因此当`rBase.getName()` 被调用时，它会解析为`Base::getName()`。不过，由于该函数是虚函数，所以程序会继续沿着派生的方向查找，如果在`Base`和`Derived`中存在该函数进一步派生的版本，则会调用该函数。在本例中，实际调用的是 `Derived::getName()`！

再看一个更复杂的例子：

```cpp
#include <iostream>
#include <string_view>

class A
{
public:
    virtual std::string_view getName() const { return "A"; }
};

class B: public A
{
public:
    virtual std::string_view getName() const { return "B"; }
};

class C: public B
{
public:
    virtual std::string_view getName() const { return "C"; }
};

class D: public C
{
public:
    virtual std::string_view getName() const { return "D"; }
};

int main()
{
    C c;
    A& rBase{ c }; //C类型中的A基类部分
    std::cout << "rBase is a " << rBase.getName() << '\n';

    return 0;
}
```


你觉得程序的输出结果会是什么？

来看看它是如何工作的。首先，实例化一个C类型的对象。`rBase` 是一个A类型的引用，使用它可以引用C类型对象中的A类型对象。然后，当 `rBase.getName()` 被调用时，它会求值得到 `A::getName()`。但是由于 `A::getName()` 是虚函数，所以编译器会尝试调用A类型和C类型中最后被派生的该函数版本。在这个例子中显然是 `C::getName()`。注意，它不会解析到 `D::getName()`，因为原始对象是 C，而不是D，所以D的成员不在考虑范围内。

程序运行结果如下：

```
rBase is a C
```

## 更复杂的例子

再来看看我们在上一课中使用的动物的例子。下面是原始的代码，以及一些测试代码:

```cpp
#include <iostream>
#include <string>
#include <string_view>

class Animal
{
protected:
    std::string m_name;

    // We're making this constructor protected because
    // we don't want people creating Animal objects directly,
    // but we still want derived classes to be able to use it.
    Animal(const std::string& name)
        : m_name{ name }
    {
    }

public:
    const std::string& getName() const { return m_name; }
    std::string_view speak() const { return "???"; }
};

class Cat: public Animal
{
public:
    Cat(const std::string& name)
        : Animal{ name }
    {
    }

    std::string_view speak() const { return "Meow"; }
};

class Dog: public Animal
{
public:
    Dog(const std::string& name)
        : Animal{ name }
    {
    }

    std::string_view speak() const { return "Woof"; }
};

void report(const Animal& animal)
{
    std::cout << animal.getName() << " says " << animal.speak() << '\n';
}

int main()
{
    Cat cat{ "Fred" };
    Dog dog{ "Garbo" };

    report(cat);
    report(dog);

    return 0;
}
```

运行结果

```
Fred says ???
Garbo says ???
```

接下来的例子中，`speak()` 函数被定义为虚函数：

```cpp
#include <iostream>
#include <string>
#include <string_view>

class Animal
{
protected:
    std::string m_name;

    // We're making this constructor protected because
    // we don't want people creating Animal objects directly,
    // but we still want derived classes to be able to use it.
    Animal(const std::string& name)
        : m_name{ name }
    {
    }

public:
    const std::string& getName() const { return m_name; }
    virtual std::string_view speak() const { return "???"; } //虚函数
};

class Cat: public Animal
{
public:
    Cat(const std::string& name)
        : Animal{ name }
    {
    }

    virtual std::string_view speak() const { return "Meow"; }
};

class Dog: public Animal
{
public:
    Dog(const std::string& name)
        : Animal{ name }
    {
    }

    virtual std::string_view speak() const { return "Woof"; }
};

void report(const Animal& animal)
{
    std::cout << animal.getName() << " says " << animal.speak() << '\n';
}

int main()
{
    Cat cat{ "Fred" };
    Dog dog{ "Garbo" };

    report(cat);
    report(dog);

    return 0;
}
```


程序运行结果如下：

```
Fred says Meow
Garbo says Woof
```

可以正确工作了。

当 `animal.speak()` 求职时，程序会注意到 `Animal::speak()` 是一个虚函数。在这个例子中，`animal` 引用的是`Cat` 类中的`Animal` 部分。程序会在Animal 和 Cat 之间所有的派生类中查看是否有该函数进一步被派生的版本。在本例中，`Cat::speak()` 就会被调用。对于`Dog`也类似，程序解析到的函数是 `Dog::speak()`。

注意，我们没有将 `Animal::getName()` 定义为虚函数。这是因为 `getName()` 并没有在任何派生类中被[[override|重写]]，所以没有必要设置为虚函数。

同样地，下面的代码也能够按照我们的需要正常工作了：

```cpp
Cat fred{ "Fred" };
Cat misty{ "Misty" };
Cat zeke{ "Zeke" };

Dog garbo{ "Garbo" };
Dog pooky{ "Pooky" };
Dog truffle{ "Truffle" };

// Set up an array of pointers to animals, and set those pointers to our Cat and Dog objects
Animal* animals[]{ &fred, &garbo, &misty, &pooky, &truffle, &zeke };

for (const auto* animal : animals)
    std::cout << animal->getName() << " says " << animal->speak() << '\n';
```

输出结果如下：

```
Fred says Meow
Garbo says Woof
Misty says Meow
Pooky says Woof
Truffle says Woof
Zeke says Meow
```

尽管这两个例子只使用了`Cat`和`Dog`，但我们从`Animal`派生的任何其他类也可以使用`report()`函数和`Animal`数组，无需进一步修改！这可能是虚函数的最大好处——能够以这样一种方式构造代码，即新派生的类将自动与旧代码一起工作，而无需修改!

注意：要使用派生类函数，==派生类函数的签名必须与基类虚函数的签名完全匹配==（返回值不是签名的一部分）。如果派生类函数具有不同的形参类型，则程序仍可能编译，但虚函数将不能按预期解析。在下一课中，我们将讨论如何防范这种情况。

还要注意，==如果一个函数被标记为虚函数，那么所有的匹配[[override|重写]]函数也被认为是虚函数==，即使它们没有被显式地标记为虚函数。


## 虚函数的返回值

正常情况下，虚函数的函数的返回值和[[override|重写]]函数的返回值必须要匹配。考虑下面的例子：

```cpp
class Base
{
public:
    virtual int getValue() const { return 5; }
};

class Derived: public Base
{
public:
    virtual double getValue() const { return 6.78; }
};
```


在这个例子中，`Derived::getValue()` is 并不会被认为是对 `Base::getValue()` 的重写，==因此编译会失败==。


## 不要在构造函数或析构函数中调用虚函数

这是另一个经常伤到菜鸟们的陷阱是——不应该从构造函数或析构函数调用虚函数。

记住，在创建派生类时，首先构造基类部分。如果在`Base`构造函数调用虚函数，而类的派生部分甚至还没有创建，则无法调用函数的派生版本，因为没有派生对象供派生函数处理。在C++中，它会调用Base版本。（[[17-3-order-of-construction-of-derived-classes|17.3 - 派生类的构造顺序]]）

析构函数也存在类似的问题。==如果在基类析构函数中调用虚函数，它将始终解析为该函数的基类版本==，因为类的派生部分将已经被销毁。


!!! success "最佳实践"

	永远不要在构造函数或析构函数中调用虚函数

## 虚函数的缺点

既然大多数时候你会希望函数是虚函数，为什么不让所有的函数都是虚的呢？因为这么做效率很低——==解析虚函数调用的时间比解析常规函数调用的时间长。此外，编译器还必须为每个具有一个或多个虚函数的类对象分配一个额外的指针==。我们将在本章以后的课程中详细讨论这个问题。
