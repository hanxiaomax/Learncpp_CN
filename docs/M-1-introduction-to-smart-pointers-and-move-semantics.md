---
title: M.1 - 智能指针和移动语义简介
alias: M.1 - 智能指针和移动语义简介
origin: /introduction-to-smart-pointers-move-semantics/
origin_title: "M.1 — Introduction to smart pointers and move semantics"
time: 2022-9-16
type: translation
tags:
- smart-pointers
- move-semantics
---

??? note "关键点速记"


考虑下面函数，函数中动态分配了一个资源：

```cpp
void someFunction()
{
    Resource* ptr = new Resource(); // Resource is a struct or class

    // do stuff with ptr here

    delete ptr;
}
```

尽管上面的代码看起来相当简单，但是在实践中很容易忘记释放 `ptr`。即使你记得在函数结束时删除 `ptr`，如果函数提前退出，也有许多因素导致`ptr`不能被正确删除，例如函数的提前返回：

```cpp
#include <iostream>

void someFunction()
{
    Resource* ptr = new Resource();

    int x;
    std::cout << "Enter an integer: ";
    std::cin >> x;

    if (x == 0)
        return; // 函数提前返回，ptr 无法被删除！

    // do stuff with ptr here

    delete ptr;
}
```

抛出异常也可能会导致问题：

```cpp
#include <iostream>

void someFunction()
{
    Resource* ptr = new Resource();

    int x;
    std::cout << "Enter an integer: ";
    std::cin >> x;

    if (x == 0)
        throw 0; // the function returns early, and ptr won’t be deleted!

    // do stuff with ptr here

    delete ptr;
}
```

在上述两个程序中，提前返回或throw语句，都可能会导致函数在没有删除 `ptr` 的情况下终止。因此，分配给变量`ptr`的内存可能出现内存泄漏(而且是每次调用此函数并提前返回时都会泄漏)。

本质上，发生这类问题是因为指针变量不具备自我清理的能力。

## 智能指针类可以拯救我们吗？

对于类对象来说，它们最大的优势是可以在[[going-out-of-scope|离开作用域]]是自动执行[[destructor|析构函数]]。这样一来，如果我们在构造函数中分配或获取内存，则可以在析构函数中进行释放，这样就可以确保内存在对象被销毁前（不论是离开作用域还是显式删除等）释放。这也正是[[RAII (Resource Acquisition Is Initialization)|资源获取即初始化（RAII）]]编程范式的核心思想（见[[13-9-destructors|13.9 - 析构函数]]）。

那么，是否可以辨析一个类，帮助我们管理和清理指针呢？当然可以！

考虑设计这样一个类，它的唯一工作，就是管理一个传入的指针。当该类对象离开作用域时，释放指针所指向的内存。只要该对象被声明为一个局部变量，我们就可以保证，当它离开作用域时（不论何时、也不论函数如何终止），它管理的指针都会被销毁。


```cpp
#include <iostream>

template <typename T>
class Auto_ptr1
{
	T* m_ptr;
public:
	// 通过构造函数传入一个指针，使该类拥有它
	Auto_ptr1(T* ptr=nullptr)
		:m_ptr(ptr)
	{
	}

	// 析构函数会确保指针被删除
	~Auto_ptr1()
	{
		delete m_ptr;
	}

	// 重载解引用和成员运算符
	T& operator*() const { return *m_ptr; }
	T* operator->() const { return m_ptr; }
};

// A sample class to prove the above works
class Resource
{
public:
    Resource() { std::cout << "Resource acquired\n"; }
    ~Resource() { std::cout << "Resource destroyed\n"; }
};

int main()
{
	Auto_ptr1<Resource> res(new Resource()); // 注意此处分配的资源

        // ... 没有显式删除指针

	// 注意，尖括号中的Resource不需要星号，星号是模板提供的

	return 0;
} // res 离开作用域，并且删除了资源
```

程序打印：

```
Resource acquired
Resource destroyed
```


考虑一下这个程序和类是如何工作的。首先，动态创建`Resource`，并将其作为参数传递给模板化的`Auto_ptr1`类。从这一刻开始，`Auto_ptr1`变量`res`拥有该资源对象(`Auto_ptr1`是`m_ptr`是[[16-2-composition|组合关系]])。因为`res`被声明为局部变量并具有语句块作用域，所以当语句块结束时，它将离开作用域并被销毁(不用担心忘记释放它)。由于它是一个类，因此在销毁它时，将调用`Auto_ptr1`析构函数。该析构函数将确保它所持有的`Resource`指针被删除!

只要`Auto_ptr1`被定义为一个局部变量(具有自动持续时间，因此类名中的“Auto”部分)，无论函数如何终止(即使它提前终止)，`Resource`总是可以在声明它的块的末尾被销毁。

这种类被称为智能指针。[[smart pointer class|智能指针类]]是一种组合类，它用于管理动态分配的内存，并且能够确保指针对象在离开作用域时被删除（内置的指针对象被称为“笨指针”，正是因为它们不能自己清理自己所管理的内存）。

现在让我们回到上面的`someFunction()`例子，看看如何使用智能指针解决我们面临的问题：

```cpp
#include <iostream>

template <typename T>
class Auto_ptr1
{
	T* m_ptr;
public:
	// Pass in a pointer to "own" via the constructor
	Auto_ptr1(T* ptr=nullptr)
		:m_ptr(ptr)
	{
	}

	// The destructor will make sure it gets deallocated
	~Auto_ptr1()
	{
		delete m_ptr;
	}

	// Overload dereference and operator-> so we can use Auto_ptr1 like m_ptr.
	T& operator*() const { return *m_ptr; }
	T* operator->() const { return m_ptr; }
};

// A sample class to prove the above works
class Resource
{
public:
    Resource() { std::cout << "Resource acquired\n"; }
    ~Resource() { std::cout << "Resource destroyed\n"; }
    void sayHi() { std::cout << "Hi!\n"; }
};

void someFunction()
{
    Auto_ptr1<Resource> ptr(new Resource()); // ptr 现在拥有 Resource

    int x;
    std::cout << "Enter an integer: ";
    std::cin >> x;

    if (x == 0)
        return; // 函数提前返回

    // do stuff with ptr here
    ptr->sayHi();
}

int main()
{
    someFunction();

    return 0;
}
```

如果用户输入非0，则程序打印：

```
Resource acquired
Hi!
Resource destroyed
```

如果用户输入0，则程序会提前退出，打印：

```
Resource acquired
Resource destroyed
```

注意，即使在用户输入零且函数提前终止的情况下，资源仍然被正确地释放。

因为`ptr`变量是一个局部变量，所以`ptr`将在函数终止时被销毁(不管它以何种方式终止)。因为`Auto_ptr1`析构函数将清理`Resource`，所以我们可以保证`Resource`将被正确地清理。

## 严重缺陷

`Auto_ptr1` 类有一个严重的缺陷，是由自动生成的代码引起的。你能看出来吗？

(提示：如果编译器会为类提供哪些默认的函数？)

时间到！

猜到了吗？考虑下面代码：

```cpp
#include <iostream>

// Same as above
template <typename T>
class Auto_ptr1
{
	T* m_ptr;
public:
	Auto_ptr1(T* ptr=nullptr)
		:m_ptr(ptr)
	{
	}

	~Auto_ptr1()
	{
		delete m_ptr;
	}

	T& operator*() const { return *m_ptr; }
	T* operator->() const { return m_ptr; }
};

class Resource
{
public:
	Resource() { std::cout << "Resource acquired\n"; }
	~Resource() { std::cout << "Resource destroyed\n"; }
};

int main()
{
	Auto_ptr1<Resource> res1(new Resource());
	Auto_ptr1<Resource> res2(res1); // 没有初始化res2，而是进行赋值

	return 0;
}
```

程序输出结果：

```
Resource acquired
Resource destroyed
Resource destroyed
```


程序很可能(但不一定)在此时崩溃。发现问题的所在了吗？因为我们没有提供复制构造函数或赋值操作符，所以C++为我们提供了一个。它提供的函数只做浅拷贝。因此，当我们用`res1`初始化`res2`时，两个`Auto_ptr1`变量都指向同一个`Resource`。当`res2`超出作用域时，它删除资源，给`res1`留下一个[[dangling|悬垂]]指针。当`res1`去删除它的(已经删除的)资源时，程序崩溃!

下面的代码也会出现类似的问题：


```cpp
void passByValue(Auto_ptr1<Resource> res)
{
}

int main()
{
	Auto_ptr1<Resource> res1(new Resource());
	passByValue(res1);

	return 0;
}
```

在这个程序中，`res1` 将按值复制到`passByValue`的参数`res`中，导致`Resource`指针被复制，进而导致程序崩溃。

显然这不是什么好事。我们如何解决这个问题?

一种方法是显式地定义和删除复制构造函数和赋值操作符，从而从根本上阻止拷贝。这会阻止按值传递的情况(这很好，因为我们本来就不应该按值传递它们)。

但是，我们如何从函数返回`Auto_ptr1`给调用者呢?

```cpp
??? generateResource()
{
     Resource* r{ new Resource() };
     return Auto_ptr1(r);
}
```

我们无法将`Auto_ptr1` [[return-by-reference|按引用返回]]，因为局部变量`Auto_ptr1` 会在函数结束时删除，所以主调函数得到的是一个悬垂引用。我们可以将指针r返回为 `Resource*`，但是我们可能会在后面忘记删除 `r`，这就违背了使用智能指针的初衷。所以，按值返回`Auto_ptr1`是唯一有意义的选项——但我们最终会得到浅拷贝、重复的指针并导致程序崩溃。

另一种选择是重写[[copy-constructors|拷贝构造函数]]和赋值操作符来进行[[deep-copy|深拷贝]]。这样，我们至少可以避免指向同一个对象的重复指针。但是拷贝的开销可能会很大(而且可能不需要甚至不可能)，而且我们不希望仅仅为了从函数返回`Auto_ptr1`而对对象进行不必要的复制。另外，对普通指针赋值或初始化时并不会拷贝对象，为什么智能指针要具有不同的逻辑呢？

该怎么做呢？

## 移动语义

如果，我们可以让拷贝构造函数和赋值运算符不去拷贝指针（拷贝语义），而是将它所管理的资源传递或移动给目标指针呢？这正是[[move-semantics|移动语义]]背后的核心思想。移动语义说的就是对象所有权发生了转移而不是拷贝。

更新代码：

```cpp
#include <iostream>

template <typename T>
class Auto_ptr2
{
	T* m_ptr;
public:
	Auto_ptr2(T* ptr=nullptr)
		:m_ptr(ptr)
	{
	}

	~Auto_ptr2()
	{
		delete m_ptr;
	}

	// 使用拷贝构造函数实现移动语义
	Auto_ptr2(Auto_ptr2& a) // 注意: 不能是 const
	{
		m_ptr = a.m_ptr; // 目的对象获得源对象的指针
		a.m_ptr = nullptr; // 确保源对象不再拥有该指针 
	}

	// 使用赋值运算符实现移动语义
	Auto_ptr2& operator=(Auto_ptr2& a) // 注意: 不能是 const
	{
		if (&a == this)
			return *this;

		delete m_ptr; // 确保目的对象的指针所指的资源被释放
		m_ptr = a.m_ptr; // 目的对象获得源对象的指针
		a.m_ptr = nullptr; // 确保源对象不再拥有该指针
		return *this;
	}

	T& operator*() const { return *m_ptr; }
	T* operator->() const { return m_ptr; }
	bool isNull() const { return m_ptr == nullptr; }
};

class Resource
{
public:
	Resource() { std::cout << "Resource acquired\n"; }
	~Resource() { std::cout << "Resource destroyed\n"; }
};

int main()
{
	Auto_ptr2<Resource> res1(new Resource());
	Auto_ptr2<Resource> res2; // Start as nullptr

	std::cout << "res1 is " << (res1.isNull() ? "null\n" : "not null\n");
	std::cout << "res2 is " << (res2.isNull() ? "null\n" : "not null\n");

	res2 = res1; // res2 assumes ownership, res1 is set to null

	std::cout << "Ownership transferred\n";

	std::cout << "res1 is " << (res1.isNull() ? "null\n" : "not null\n");
	std::cout << "res2 is " << (res2.isNull() ? "null\n" : "not null\n");

	return 0;
}
```

打印：

```
Resource acquired
res1 is not null
res2 is null
Ownership transferred
res1 is null
res2 is not null
Resource destroyed
```

注意，我们重载的赋值运算符现在可以把`m_ptr`的所有权从`res1`传递给`res2`！这样一来，我们将不会得到重复的指针，资源清理可以顺利进行。

## `std::auto_ptr` 为什么是糟糕的实现

现在是讨论`std::auto_ptr`的合适时机了。`std::auto_ptr`在C++ 98中引入，在C++ 17中被删除，它是C++第一次尝试标准化智能指针。`auto_ptr` 选择了`Auto_ptr2`类一样的移动语义实现方式。

然而，`std::auto_ptr`(以及我们的`Auto_ptr2`类)有许多问题，使得使用它很危险。

首先，由于`std::auto_ptr`通过复制构造函数和赋值操作符实现了移动语义，将`std::auto_ptr`按值传递给函数将导致资源被移动到函数形参中(并在函数形参超出作用域时销毁)。然后，当你从调用者访问`auto_ptr`实参时(没有意识到它已经被移动和删除了)时，进行[[dereference-operator|解引用]]会导致程序崩溃。

Second, std::auto_ptr always deletes its contents using non-array delete. This means auto_ptr won’t work correctly with dynamically allocated arrays, because it uses the wrong kind of deallocation. Worse, it won’t prevent you from passing it a dynamic array, which it will then mismanage, leading to memory leaks.

Finally, auto_ptr doesn’t play nice with a lot of the other classes in the standard library, including most of the containers and algorithms. This occurs because those standard library classes assume that when they copy an item, it actually makes a copy, not a move.

Because of the above mentioned shortcomings, std::auto_ptr has been deprecated in C++11 and removed in C++17.

其次，`std::auto_ptr`总是使用非数组删除来删除其内容。这意味着`auto_ptr`不能正确地处理动态分配的数组，因为它使用了错误的内存释放方式。更糟糕的是，它不能阻止您向它传递动态数组，这样它就可能导致内存泄漏。

最后，`auto_ptr` 不能很好地处理标准库中的许多其他类，包括大多数容器和算法。这是因为那些标准库类假定当它们复制一个资源时，它进行了实际的复制，而不是移动。

由于上述缺点，`std::auto_ptr` 在C++ 11中已弃用，在C++ 17中已删除。

## 继续

`std::auto_ptr`的核心问题是：C++ 11之前，C++语言根本没有区分“拷贝语义”和“移动语义”的机制。对拷贝语义重写来实现移动语义，会导致奇怪的边界情况和不易察觉的错误。例如，你可以写`res1 = res2` ，但无法知道`res2`是否会被改变！

正因为如此，在C++ 11中，正式定义了“移动”的概念，并在语言中添加了“移动语义”，以正确区分复制和移动。现在，我们已经知道移动语义是很有用的，在本章的其余部分我们会继续探索移动语义的其他话题。我们还将使用移动语义修复`Auto_ptr2`类。

在C++ 11中，`std::auto_ptr`已经被一堆其他类型的“移动语义兼容的”智能指针所取代：`std::unique_ptr`, `std::weak_ptr`和`std::shared_ptr`。我们还将探讨其中最流行的两个：`unique_ptr`(它直接替换了 `auto_ptr`)和 `shared_ptr`。