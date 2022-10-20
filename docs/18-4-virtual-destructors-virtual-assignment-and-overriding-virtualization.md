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

	- 析构函数的调用顺序和构造函数相反，而且是向基类方向逐级调用。
	- 基类的析构函数必须是[[virtual-function|虚函数]]。如果不这样做，当基于派生类中基类部分的指针或引用时销毁对象时，调用的是基类的析构函数，子类成员不能被正确销毁。
	- 所有的析构函数都设置为虚可以避免上述问题，但是会有性能损失（时间和空间，每个类对象都多了一个指针）
	- 如果一个类允许被其他类继承，确保其析构函数是虚函数。
	- 如果一个类**不允许**被其他类继承，将其标记为 `final`。这将从根本上防止其他类对它的继承，而不会对类本身施加其他限制

## 虚构析构函数

 
尽管 C++ 可以提供默认的构造函数，但我们时常也会想要提供自定义的析构函数（尤其是当类需要释放内存的情况）。==当一个类涉及到[[inheritance|继承]]的时候，其析构函数应该总是为[[virtual-destructor|虚析构函数]]。==考虑下面的例子：

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



## 虚赋值

可以将赋值操作符设为`virtual`。然而，与析构函数的情况(虚拟化总是一个好主意)不同，虚拟化赋值操作符会带来一大堆麻烦，并涉及本教程范围之外的一些高级主题。因此，为了简单起见，我们建议你暂时不要使用虚赋值。


## 忽略虚化

极少数情况下我们需要忽略函数的虚化，例如下面代码：

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


可能在某些情况下，你需要指向`Derived`对象的`Base` 指针能够调用 `Base::getName()` 而不是 `Derived::getName()`。此时可以使用[[scope-resolution-operator|作用域解析运算符]]：

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

这个操作并不常用，但是知道总比不知道好。

## 应该将所有的析构函数都设置为虚函数吗？


这是新程序员经常会问的问题。如上面的例子所述，如果基类析构函数没有被标记为虚函数，那么如果程序员稍后删除指向派生对象的基类指针，则程序有内存泄漏的风险。避免这种情况的一种方法是将所有析构函数标记为虚函数。但是我们真的需要这么做吗？

说“是”很容易，这样以后就可以使用任何类作为基类了——但是这样做会有性能损失(向类的每个实例添加一个虚拟指针)。所以你必须权衡轻重，尤其是它是否符合你的意图。

著名的C++大师Herb Sutter提出了一种能够避免由非虚析构函数导致的内存泄漏的方法：“基类析构函数应该是**公共的虚析构函数**，或者是**受保护的非虚析构函数**。” 有受保护析构函数的类不能通过指针删除，因此，当基类具有非虚析构函数时，可以防止通过基指针意外删除派生类。不幸的是，这也意味着基类不能通过基类指针删除，这实际上意味着类只能由派生类动态分配或删除。这也使得这些类不能使用智能指针(例如`std::unique_ptr`和`std::shared_ptr`)，从而限制了该规则的有用性(我们将在后面的章节讨论智能指针)。这也意味着这样的基类不能被分配在栈上。代价有点大！

既然已经在语言中引入了`final`修饰符，我们的建议如下:

- ==如果一个类允许被其他类继承，确保其析构函数是虚函数。==
- 如果一个类**不允许**被其他类继承，将其标记为 `final`。这将从根本上防止其他类对它的继承，而不会对类本身施加其他限制

