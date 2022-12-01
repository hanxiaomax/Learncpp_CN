---
title: 17.3 - 派生类的构造顺序
alias: 17.3 - 派生类的构造顺序
origin: /order-of-construction-of-derived-classes/
origin_title: "17.3 — Order of construction of derived classes"
time: 2020-12-21
type: translation
tags:
- inheritance
---

??? note "Key Takeaway"
	
	-

在[[17-2-basic-inheritance-in-c++|17.2 - C++继承基础]]中我们了解到，类可以通过继承其他类来获取其成员变量。在这节课中，我们会探讨当派生类被[[instantiated|实例化]]时，相关类的构造顺序是如何的。

首先，定义几个类以便更好地说明问题：
```cpp
class Base
{
public:
    int m_id {};

    Base(int id=0)
        : m_id { id }
    {
    }

    int getId() const { return m_id; }
};

class Derived: public Base
{
public:
    double m_cost {};

    Derived(double cost=0.0)
        : m_cost { cost }
    {
    }

    double getCost() const { return m_cost; }
};
```


在这个例子中，`Derived` 派生自 `Base`。

![](https://www.learncpp.com/images/CppTutorial/Section11/DerivedBase.gif)

因为 `Derived` 继承了 `Base` 的变量和函数，所以你可能会认为 `Base` 的这部分内容都被*拷贝*到了`Derived`中。其实不然，实际上，我们可以将`Derived` 分为两部分来看，一部分是 `Derived`，另一部分是 `Base`。

![](https://www.learncpp.com/images/CppTutorial/Section11/DerivedBaseCombined.gif)


对于一个普通的(非派生的)类时的实例化，相比你已经很了解了：

```cpp
int main()
{
    Base base;

    return 0;
}
```


`Base` 不是一个[[derived-class|派生类]]，因为它没有继承任何其他的类。C++会首先为`Base`分配内存，然后调用它的[[default-constructor|默认构造函数]]进行初始化。

接下来，实例化一个派生类看看会发生什么：

```cpp
int main()
{
    Derived derived;

    return 0;
}
```

在你编写并运行上述代码的时候，你可能不会注意到任何的不同（相比于前面实例化非派生类的例子）。但是在底层，它们所进行的工作是不同的。正如上面提到的那样，`Derived` 实际上包含两部分：`Base` 部分和 `Derived` 部分。C++ 构建派生对象时是分阶段进行的。首先，最为基础的基类（继承体系的最顶部）会首先被构建。然后每一个子类会按照层次结构依次构建，知道最后一个子类（继承体系最底端）构建完成。

因此，`Derived` 被实例化时，首先被构造的是`Base`部分（使用`Base`的构造函数）。一旦 `Base` 部分被创建，`Derived`的部分就会开始构建（使用`Derived`的构造函数）。此时，已经没有其他子类需要进一步构建了，实例化过程到此结束。


使用下面代码可以展示上述过程：
```cpp
#include <iostream>

class Base
{
public:
    int m_id {};

    Base(int id=0)
        : m_id { id }
    {
        std::cout << "Base\n";
    }

    int getId() const { return m_id; }
};

class Derived: public Base
{
public:
    double m_cost {};

    Derived(double cost=0.0)
        : m_cost { cost }
    {
        std::cout << "Derived\n";
    }

    double getCost() const { return m_cost; }
};

int main()
{
    std::cout << "Instantiating Base\n";
    Base base;

    std::cout << "Instantiating Derived\n";
    Derived derived;

    return 0;
}
```

程序运行结果如下：

```
Instantiating Base
Base
Instantiating Derived
Base
Derived
```


如你所见，当我们构造`Derived`时，`Derived`中的的`Base`部分首先被构造。道理显而易见，从逻辑上讲，孩子离开父母就不能存在。这也是一种安全的做事方式：子类经常使用来自父类的变量和函数，但父类对子类一无所知。首先实例化父类可以确保在创建派生类并准备使用它们时，这些变量已经初始化。

## 继承链的构造顺序

有时候会出现父类是其他类的子类的情况：

```cpp
#include <iostream>

class A
{
public:
    A()
    {
        std::cout << "A\n";
    }
};

class B: public A
{
public:
    B()
    {
        std::cout << "B\n";
    }
};

class C: public B
{
public:
    C()
    {
        std::cout << "C\n";
    }
};

class D: public C
{
public:
    D()
    {
        std::cout << "D\n";
    }
};
```

我们只需要记得，C++ 总是首先构建”第一个“或”最基本“的类。然后它会沿着继承树逐级构造各个派生类。

下面代码可以展示派生类实例化时的构造顺序：

```cpp
int main()
{
    std::cout << "Constructing A: \n";
    A a;

    std::cout << "Constructing B: \n";
    B b;

    std::cout << "Constructing C: \n";
    C c;

    std::cout << "Constructing D: \n";
    D d;
}
```


```
Constructing A:
A
Constructing B:
A
B
Constructing C:
A
B
C
Constructing D:
A
B
C
D
```

## 结论

C++是分阶段构造派生类的，从最基本的类(在继承树的顶部)开始，到最后一个子类(在继承树的底部)结束。在构造每个类时，调用该类的适当构造函数来初始化属于该类的部分。

注意，本节中的示例类都使用基类默认构造函数(为了简单起见)。在下一课中，我们将进一步研究构造函数在构造派生类过程中的作用(包括如何显式选择派生类要使用的基类构造函数)。