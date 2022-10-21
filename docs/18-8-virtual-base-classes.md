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

- 首先，虚基类总是在非虚基类之前创建，这确保了所有基类都在它们的派生类之前创建。
- 其次，请注意 `Scanner` 和 `Printer` 构造函数仍然有对 `PoweredDevice` 构造函数的调用。在创建`Copier`的实例时，这些构造函数调用将被忽略，因为 `Copier` 负责创建 `PoweredDevice`，而不是 `Scanner` 或 `Printer` 。但是，如果我们要创建`Scanner`或`Printer`的实例，就会使用这些构造函数调用，并应用正常的继承规则。

第三，如果一个类继承了一个或多个具有虚父类的类，则最后被派生的类会负责构造虚基类。在本例中，`Copier` 继承了`Printer`和`Scanner`，它们都有一个`PoweredDevice`虚基类。最最后被派生的类，负责`PoweredDevice`的创建。注意，即使在单一继承的情况下也是这样：如果`Copier`从`Printer`单独继承，而`Printer`从`PoweredDevice`虚继承，那么`Copier`仍然负责创建`PoweredDevice`。

第四，所有继承虚基类的类都将有一个虚表，即使它们通常没有虚表，因此类的实例其大小会增加一个指针。

因为`Scanner`和`Printer`实际上是从`PoweredDevice`派生的，所以`Copier`只是一个`PoweredDevice`子对象(subobject)。`Scanner`和`Printer`都需要知道如何找到单个`PoweredDevice`子对象，这样它们才能访问它的成员(因为它们毕竟是从它派生的)。这通常是通过一些虚表操作来完成的(它实际上存储了从每个子类到`PoweredDevice`子对象的偏移量)。


