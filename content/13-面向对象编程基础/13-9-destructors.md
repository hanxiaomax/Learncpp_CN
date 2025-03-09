---
title: 13.9 - 析构函数
alias: 13.9 - 析构函数
origin: /destructors/
origin_title: "13.9 — Destructors"
time: 2022-9-16
type: translation
tags:
- destructors
---

[[destructor|析构函数]]是另外一种雷叔的类成员函数，它会在对象销毁时自动执行。构造函数函数用于初始化对象，而析构函数则用于对对象进行“清理”。

当对象正常地[[going-out-of-scope|离开作用域]]时，或者使用 `delete` 关键字显式地删除动态分配的对象时，析构函数(如果它存在)就会被自动调用，在释放内存前执行必要的清理。对于简单类(那些只初始化普通成员变量值的类)，不需要析构函数，因为C++会自动为你清理内存。

然而，如果你的类对象持有某些资源(例如动态内存、文件或数据库句柄)，或者你需要在对象被销毁之前进行某些“维护”操作，析构函数是进行这些操作的好地方，因为析构函数的调用通常是对象被销毁之前发生的最后一件事。


## 析构函数命名

和构造函数一样，析构函数也有其特殊的命名规则：

1.  析构函数的名必须和类名完全一致，并且在最前面添加波浪号(~)；
2.  析构函数没有任何参数；
3.  析构函数不返回任何类型。

一个类只能有一个析构函数。

通常情况下，析构函数不应该被显式地调用(因为当对象被销毁时会自动调用析构函数)，因为很少有情况需要多次清理对象。不过，析构函数可以安全地调用其他成员函数，因为直到析构函数执行之后才对象才会被销毁。


## 一个析构函数案例

让我们来看看一个使用析构函数的简单类：


```cpp
#include <iostream>
#include <cassert>
#include <cstddef>

class IntArray
{
private:
	int* m_array{};
	int m_length{};

public:
	IntArray(int length) // 构造函数
	{
		assert(length > 0);

		m_array = new int[static_cast<std::size_t>(length)]{};
		m_length = length;
	}

	~IntArray() // 析构函数
	{
		// 删除之前分配的数组
		delete[] m_array;
	}

	void setValue(int index, int value) { m_array[index] = value; }
	int getValue(int index) { return m_array[index]; }

	int getLength() { return m_length; }
};

int main()
{
	IntArray ar ( 10 ); // 分配 10 个整型
	for (int count{ 0 }; count < ar.getLength(); ++count)
		ar.setValue(count, count+1);

	std::cout << "The value of element 5 is: " << ar.getValue(5) << '\n';

	return 0;
} // ar 在此处被销毁，所以析构函数 ~IntArray() 会在此时被调用
```


> [!tip] "小贴士"
> 如果你在编译上面程序时产生如下报错：
> 
> ```
> error: 'class IntArray' has pointer data members [-Werror=effc++]|
> error:   but does not override 'IntArray(const IntArray&)' [-Werror=effc++]|
> error:   or 'operator=(const IntArray&)' [-Werror=effc++]|
> ```
> 
> 此时可以删除编译器选项 “-Weffc++”，或者在类中额外添加下面两行代码：
> 
> ```cpp
> IntArray(const IntArray&) = delete;
> IntArray& operator=(const IntArray&) = delete;
> ```
> 
> 详细信息参考 [14.14 -- Converting constructors, explicit, and delete](https://www.learncpp.com/cpp-tutorial/converting-constructors-explicit-and-delete/)

输出结果：

```
The value of element 5 is: 6
```

在 `main()` 函数的第一行，我们实例化了一个 `IntArray` 类型的对象 `ar`，并且传入了10作为长度。 此时会调用构造函数，动态分配数组所需的内存。内存必须动态分配因为在[[compile-time|编译时]]无法知道数组的长度。

在`main()`末尾，`ar` [[going-out-of-scope|离开作用域]]，调用析构函数 `~IntArray()` ，删除构造函数中为数组申请的内存。

!!! info "提醒"

> 在[[11-7-std-string-view-part-2|11.7 - std::string_view（第二部分）]]中，我们讲过，括号初始化应该被用于初始化基于长度创建的数组、容器和列表（相对于基于一组元素创建）。因此，初始化 `IntArray` 时使用了 `IntArray ar ( 10 );`。

## 构造和析构的时机

和之前提到的一样，构造函数会在对象创建时调用，而析构函数则是在对象被销毁时调用。在下面的例子中，我们会在构造函数和析构函数中添加打印来展示这一点：

```cpp
#include <iostream>

class Simple
{
private:
    int m_nID{};

public:
    Simple(int nID)
        : m_nID{ nID }
    {
        std::cout << "Constructing Simple " << nID << '\n';
    }

    ~Simple()
    {
        std::cout << "Destructing Simple" << m_nID << '\n';
    }

    int getID() { return m_nID; }
};

int main()
{
    // 在栈上分配一个 Simple 对象
    Simple simple{ 1 };
    std::cout << simple.getID() << '\n';

    // 动态分配一个 Simple 对象
    Simple* pSimple{ new Simple{ 2 } };

    std::cout << pSimple->getID() << '\n';

    // 动态分配的 pSimple 必须要被delete
    delete pSimple;

    return 0;
} // simple 对象会在此处离开作用域
```


程序运行结果如下：

```
Constructing Simple 1
1
Constructing Simple 2
2
Destructing Simple 2
Destructing Simple 1
```

注意，“Simple 1” 是在 “Simple 2” 之后销毁的，因为我们在`main`函数结束前删除了 pSimple ，而 simple 则是在 main() 结束时才销毁。

==全局变量会在main()函数前构造而在main()结束后销毁==。


## RAII

[[RAII (Resource Acquisition Is Initialization)|资源获取即初始化（RAII）]]是一种将资源使用与具有自动持续时间的对象的生命周期(例如，非动态分配的对象)绑定在一起的编程技术。在C++中，RAII是通过带有构造函数和析构函数的类实现的。资源(如内存、文件或数据库句柄等)通常是在对象的构造函数中获取的(不过，如果需要的话也可以在对象创建之后获取)。然后，可以在对象处于活动状态时使用该资源。当对象被销毁时，资源在析构函数中被释放。RAII的主要优点是它有助于防止资源泄漏(例如，内存没有被释放)，因为所有资源持有对象都会自动清理。

本节课开始时的`IntArray`类是实现RAII的一个例子——在构造函数中分配，在析构函数中释放。`std::string`和`std::vector`则是标准库中实现RAII的例子——动态内存在初始化时获得，在销毁时自动清除。


## 有关 `exit()` 函数的警示

注意：当使用 `exit()` 函数时，程序会在不调用任何构造函数的情况下退出。如果你依赖于构造函数在程序退出时完成清理工作（例如，写日志或写数据库）。

## 小结

如你所见，当构造函数和析构函数被实现后，类就可以在初始化自己并在其销毁时完成清理工作，不需要程序员做任何特殊的工作！这降低了出错的可能性，并使类更容易使用。

