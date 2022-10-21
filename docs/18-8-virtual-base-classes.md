---
title: 18.8 - 虚基类
alias: 18.8 - 虚基类
origin: /virtual-base-classes/
origin_title: "18.8 — Virtual base classes"
time: 2022-9-30
type: translation
tags:
- virtual-base-classes
---

??? note "关键点速记"



在上一章 [[17-9-multiple-inheritance|17.9 - 多重继承]] 一课中，我们谈论了[[the-diamond-problem|菱形继承问题]]。本章我们会继续该话题。

*注意：本节是高级主题，可以作为选修。*

## 菱形继承问题

下面是我们上一课中的例子(多了一些构造函数)，说明菱形继承问题：

```cpp
#include <iostream>

class PoweredDevice
{
public:
    PoweredDevice(int power)
    {
	std::cout << "PoweredDevice: " << power << '\n';
    }
};

class Scanner: public PoweredDevice
{
public:
    Scanner(int scanner, int power)
        : PoweredDevice{ power }
    {
	std::cout << "Scanner: " << scanner << '\n';
    }
};

class Printer: public PoweredDevice
{
public:
    Printer(int printer, int power)
        : PoweredDevice{ power }
    {
	std::cout << "Printer: " << printer << '\n';
    }
};

class Copier: public Scanner, public Printer
{
public:
    Copier(int scanner, int printer, int power)
        : Scanner{ scanner, power }, Printer{ printer, power }
    {
    }
};
```

也许你会认为上述代码会得到下面这样的继承结构：

![](data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%22287%22%20height=%22213%22%3E%3C/svg%3E)

如果要创建一个 `Copier` 类对象，默认情况下最终会得到`PoweredDevice`类的两个副本——一个来自`Printer`，一个来自`Scanner`。它有以下结构:
![](data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%22344%22%20height=%22213%22%3E%3C/svg%3E)

我们可以创建一个简短的示例来演示这一点：

```cpp
int main()
{
    Copier copier{ 1, 2, 3 };

    return 0;
}
```


```
PoweredDevice: 3
Scanner: 1
PoweredDevice: 3
Printer: 2
```

看到了吗？`PoweredDevice` 被构建了两次。

虽然这通常是期望的结果，但在有时你可能只想让 `Scanner` 和 `Printer` 共享 `PoweredDevice` 的一个副本。


## 虚基类

要共享基类，只需在派生类的继承列表中插入" virtual "关键字。这将创建所谓的[[virtual-base-class|虚基类]]，这意味着只有一个基类对象。基类对象在继承树中的所有对象之间共享，并且只构造一次。下面是一个示例(为了简单起见，没有构造函数)，演示如何使用 `virtual` 关键字创建共享基类:

```cpp
class PoweredDevice
{
};

class Scanner: virtual public PoweredDevice
{
};

class Printer: virtual public PoweredDevice
{
};

class Copier: public Scanner, public Printer
{
};
```

现在，当你创建一个 `Copier` 类对象时，每个`Copier`将只获得一个由`Scanner`和`Printer`共享的`PoweredDevice`副本。

但是，这又导致了另一个问题：如果`Scanner`和`Printer`共享一个`PoweredDevice`基类，那么谁负责创建它呢？事实证明，答案是 `Copier` 。 `Copier` 的构造函数负责创建 `PoweredDevice`。因此， `Copier` 可以直接调用非直接父类(non-immediate-parent构造函数一次：


```cpp
#include <iostream>

class PoweredDevice
{
public:
    PoweredDevice(int power)
    {
		std::cout << "PoweredDevice: " << power << '\n';
    }
};

class Scanner: virtual public PoweredDevice // note: PoweredDevice is now a virtual base class
{
public:
    Scanner(int scanner, int power)
        : PoweredDevice{ power } // this line is required to create Scanner objects, but ignored in this case
    {
		std::cout << "Scanner: " << scanner << '\n';
    }
};

class Printer: virtual public PoweredDevice // note: PoweredDevice is now a virtual base class
{
public:
    Printer(int printer, int power)
        : PoweredDevice{ power } // this line is required to create Printer objects, but ignored in this case
    {
		std::cout << "Printer: " << printer << '\n';
    }
};

class Copier: public Scanner, public Printer
{
public:
    Copier(int scanner, int printer, int power)
        : PoweredDevice{ power }, // PoweredDevice is constructed here
        Scanner{ scanner, power }, Printer{ printer, power }
    {
    }
};
```

再看前面的例子：

```cpp
int main()
{
    Copier copier{ 1, 2, 3 };

    return 0;
}
```

结果：

```
PoweredDevice: 3
Scanner: 1
Printer: 2
```

如您所见，`PoweredDevice` 只构造一次。

有几个容易忽视的细节：

首先，虚基类总是在非虚基类之前创建，这确保了所有基类都在它们的派生类之前创建。

其次，请注意 `Scanner` 和 `Printer` 构造函数仍然有对 `PoweredDevice` 构造函数的调用。在创建copy的实例时，这些构造函数调用将被忽略，因为copy负责创建PoweredDevice，而不是Scanner或Printer。但是，如果我们要创建Scanner或Printer的实例，就会使用这些构造函数调用，并应用正常的继承规则。


As you can see, PoweredDevice only gets constructed once.

There are a few details that we would be remiss if we did not mention.

First, virtual base classes are always created before non-virtual base classes, which ensures all bases get created before their derived classes.

Second, note that the Scanner and Printer constructors still have calls to the PoweredDevice constructor. When creating an instance of Copier, these constructor calls are simply ignored because Copier is responsible for creating the PoweredDevice, not Scanner or Printer. However, if we were to create an instance of Scanner or Printer, those constructor calls would be used, and normal inheritance rules apply.

Third, if a class inherits one or more classes that have virtual parents, the _most_ derived class is responsible for constructing the virtual base class. In this case, Copier inherits Printer and Scanner, both of which have a PoweredDevice virtual base class. Copier, the most derived class, is responsible for creation of PoweredDevice. Note that this is true even in a single inheritance case: if Copier singly inherited from Printer, and Printer was virtually inherited from PoweredDevice, Copier is still responsible for creating PoweredDevice.

Fourth, all classes inheriting a virtual base class will have a virtual table, even if they would normally not have one otherwise, and thus instances of the class will be larger by a pointer.

Because Scanner and Printer derive virtually from PoweredDevice, Copier will only be one PoweredDevice subobject. Scanner and Printer both need to know how to find that single PoweredDevice subobject, so they can access its members (because after all, they are derived from it). This is typically done through some virtual table magic (which essentially stores the offset from each subclass to the PoweredDevice subobject).

