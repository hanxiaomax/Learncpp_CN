---
title: 18.4 - 虚构造函数、虚赋值和重载虚拟化
alias: 18.4 - 虚构造函数、虚赋值和重载虚拟化
origin: /virtual-destructors-virtual-assignment-and-overriding-virtualization/
origin_title: "18.4 — Virtual destructors, virtual assignment, and overriding virtualization"
time: 2022-9-16
type: translation
tags:
- virtual-destructors
- virtual-assignment
- overriding-virtualization
---

??? note "关键点速记"
	
	- 基类的析构函数必须是[[virtual-function|虚函数]]。如果不这样做，当基于派生类中基类部分的指针或引用时销毁对象时，调用的是基类的析构函数，子类成员不能被正确销毁。

## 虚构析构函数

 
尽管 C++ 可以提供默认的构造函数，但我们时常也会想要提供自定义的析构函数（尤其是当类需要释放内存的情况）。当一个类涉及到[[inheritance|继承]]的时候，其析构函数应该总是为[[virtual-destructor|虚析构函数]]。考虑下面的例子：

```cpp
#include <iostream>
class Base
{
public:
    ~Base() // note: 不是虚函数
    {
        std::cout << "Calling ~Base()\n";
    }
};

class Derived: public Base
{
private:
    int* m_array;

public:
    Derived(int length)
      : m_array{ new int[length] }
    {
    }

    ~Derived() // note: 不是 virtual (编译器可能会发出告警)
    {
        std::cout << "Calling ~Derived()\n";
        delete[] m_array;
    }
};

int main()
{
    Derived* derived { new Derived(5) };
    Base* base { derived };

    delete base;//调用基类的析构函数，同时因为它不是虚函数，则子类的析构函数不会被调用，子类成员无法析构

    return 0;
}
```


注意：如果你在编译上述代码时，编译器警告你使用了非虚的析构函数。你需要关闭编译器选项：将告警当做错误对待。

因为 `base` 是一个 `Base` 类型的指针，则当`base`被删除时，程序会查看`Base`的析构函数是否为虚函数。如果不是的话，它会认为你需要调用的就是`Base`的析构函数。

程序运行结果能够证明这一点：

```
Calling ~Base()
```

但是，实际上我们希望能够调用 `Derived` 的析构函数（进而调用 `Base` 的析构函数)，否则 `m_array` 是没办法被删除的。为此我们需要将 `Base` 的析构函数设置为虚函数：

```cpp
#include <iostream>
class Base
{
public:
    virtual ~Base() // note: virtual
    {
        std::cout << "Calling ~Base()\n";
    }
};

class Derived: public Base
{
private:
    int* m_array;

public:
    Derived(int length)
      : m_array{ new int[length] }
    {
    }

    virtual ~Derived() // note: virtual
    {
        std::cout << "Calling ~Derived()\n";
        delete[] m_array;
    }
};

int main()
{
    Derived* derived { new Derived(5) };
    Base* base { derived };

    delete base;

    return 0;
}
```

此时，程序打印结果如下：

```
Calling ~Derived()
Calling ~Base()
```

!!! note "法则"

	在处理涉及继承的类时，其析构函数必须显式定义为虚函数
	
和普通的虚函数一样，如果基类的函数是虚函数，其派生类中所有[[override|重写]]函数都被认为是虚函数，不管有么有标记为`virtual`。所以没有必要定义一个空的派生类析构函数并将其标记为`virtual`。

注意，如果你希望基类的虚构造函数是空的，可以这样定义：
```cpp
virtual ~Base() = default; // generate a virtual default destructor
```

[[13-9-destructors|13.9 - 析构函数]]

## 虚赋值

It is possible to make the assignment operator virtual. However, unlike the destructor case where virtualization is always a good idea, virtualizing the assignment operator really opens up a bag full of worms and gets into some advanced topics outside of the scope of this tutorial. Consequently, we are going to recommend you leave your assignments non-virtual for now, in the interest of simplicity.

**Ignoring virtualization**

Very rarely you may want to ignore the virtualization of a function. For example, consider the following code:

```cpp
class Base
{
public:
    virtual ~Base() = default;
    virtual const char* getName() const { return "Base"; }
};

class Derived: public Base
{
public:
    virtual const char* getName() const { return "Derived"; }
};
```

COPY

There may be cases where you want a Base pointer to a Derived object to call Base::getName() instead of Derived::getName(). To do so, simply use the scope resolution operator:

```cpp
#include <iostream>
int main()
{
    Derived derived;
    const Base& base { derived };
    // Calls Base::getName() instead of the virtualized Derived::getName()
    std::cout << base.Base::getName() << '\n';

    return 0;
}
```

COPY

You probably won’t use this very often, but it’s good to know it’s at least possible.

**Should we make all destructors virtual?**

This is a common question asked by new programmers. As noted in the top example, if the base class destructor isn’t marked as virtual, then the program is at risk for leaking memory if a programmer later deletes a base class pointer that is pointing to a derived object. One way to avoid this is to mark all your destructors as virtual. But should you?

It’s easy to say yes, so that way you can later use any class as a base class -- but there’s a performance penalty for doing so (a virtual pointer added to every instance of your class). So you have to balance that cost, as well as your intent.

Conventional wisdom (as initially put forth by Herb Sutter, a highly regarded C++ guru) has suggested avoiding the non-virtual destructor memory leak situation as follows, “A base class destructor should be either public and virtual, or protected and nonvirtual.” A class with a protected destructor can’t be deleted via a pointer, thus preventing the accidental deleting of a derived class through a base pointer when the base class has a non-virtual destructor. Unfortunately, this also means the base class can’t be deleted through a base class pointer, which essentially means the class can’t be dynamically allocated or deleted except by a derived class. This also precludes using smart pointers (such as std::unique_ptr and std::shared_ptr) for such classes, which limits the usefulness of that rule (we cover smart pointers in a later chapter). It also means the base class can’t be allocated on the stack. That’s a pretty heavy set of penalties.

Now that the final specifier has been introduced into the language, our recommendations are as follows:

-   If you intend your class to be inherited from, make sure your destructor is virtual.
-   If you do not intend your class to be inherited from, mark your class as final. This will prevent other classes from inheriting from it in the first place, without imposing any other use restrictions on the class itself.

