---
title: M.3 - 移动构造函数和移动赋值
alias: M.3 - 移动构造函数和移动赋值
origin: /move-constructors-and-move-assignment/
origin_title: "M.3 — Move constructors and move assignment"
time: 2022-10-3
type: translation
tags:
- R-value-references
- references
---

??? note "关键点速记"

	- 实现拷贝语义时需要使用const类型的左值引用作为形参，而实现移动语义时，需要使用非const的右值形参；
	- 编译器不会提供默认的移动构造函数和移动赋值操作符，除非该类没有定义任何拷贝构造函数、拷贝赋值、移动赋值或析构函数
	- 左值稍后可能会被使用，所以只有拷贝它是安全的。右值在表达式结束后总是会被销毁，所以移动它是安全的
	- 有了右值引用，函数就能够基于参数是左值还是右值表现出不同的行文，也就可以针对右值使用移动构造函数和移动赋值
	- 实现移动语义时，要保持双方都处于有效状态
	- 局部变量左值从函数中按值返回时，C++会移动它而不是拷贝它，当然有的编译器也会直接忽略。
	- 在支持移动语义的类中，有时需要删除拷贝构造函数和拷贝赋值函数，以确保不会执行拷贝


在[[M-1-introduction-to-smart-pointers-and-move-semantics|M.1 - 智能指针和移动语义简介]]中我们介绍了`std::auto_ptr`，进而引申出了[[move-semantics|移动语义]]的重要性。然后，我们讨论了当将本来被设计为拷贝语义的函数（[[copy-initialization|拷贝初始化]]和[[copy-assignment-operator|拷贝赋值运算符]]）被用来实现移动语义时会带来的问题。

在本节课中，我们会深入分析C++11是如何通过[[move-constructor|移动构造函数]]和[[move-assignment-operator|移动赋值运算符]]来解决上述问题的。

## 拷贝构造函数和拷贝赋值

首先，复习一下[[copy-semantics|拷贝语义]]。

拷贝构造函数用于通过拷贝一个同类对象来初始化另一个对象。拷贝赋值则用于将一个类对象复制到另一个现有类对象。默认情况下，如果没有显式提供拷贝构造函数和拷贝赋值操作符，C++会提供一个默认版本。这些编译器提供的函数会执行[[shallow-copy|浅拷贝]]，这可能会给分配动态内存的类带来问题。因此，处理动态内存的类应该重写这些函数来进行[[deep-copy|深拷贝]]。

回到本章第一课中的`Auto_ptr`智能指针类示例，让我们看看实现了深拷贝的拷贝构造函数和拷贝赋值操作符的版本能否正常工作。

```cpp
#include <iostream>

template<typename T>
class Auto_ptr3
{
	T* m_ptr;
public:
	Auto_ptr3(T* ptr = nullptr)
		:m_ptr(ptr)
	{
	}

	~Auto_ptr3()
	{
		delete m_ptr;
	}

	// 拷贝构造函数
	// 将 a.m_ptr 深拷贝到 m_ptr
	Auto_ptr3(const Auto_ptr3& a)
	{
		m_ptr = new T;
		*m_ptr = *a.m_ptr;//解引用的结果是一个Resource对象，它能够通过默认的拷贝构造函数拷贝赋值自己
	}

	// 拷贝赋值
	// 将 a.m_ptr 深拷贝到 m_ptr
	Auto_ptr3& operator=(const Auto_ptr3& a)
	{
		// Self-assignment detection
		if (&a == this)
			return *this;

		// Release any resource we're holding
		delete m_ptr;

		// Copy the resource
		m_ptr = new T;
		*m_ptr = *a.m_ptr;

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

Auto_ptr3<Resource> generateResource()
{
	Auto_ptr3<Resource> res{new Resource};
	return res; // 返回值会触发拷贝构造函数
}

int main()
{
	Auto_ptr3<Resource> mainres;
	mainres = generateResource(); // 赋值会触发拷贝赋值

	return 0;
}
```


在上面的程序中，`generateResource()` 函数会创建一个被智能指针封装的资源，然后该资源会被返回给主函数。主函数随后将其赋值给 `Auto_ptr3` 对象。

程序运行时打印：

```
Resource acquired
Resource acquired
Resource destroyed
Resource acquired
Resource destroyed
Resource destroyed
```

(注意:如果编译器省略了generateResource()函数的返回值，你可能只会得到4行输出)

如此简单的程序，竟然要创建并销毁这么多次？什么情况！

仔细研究一下，这个程序中有6个关键步骤(每个打印信息一个步骤)：

1.  在 `generateResource()` 中，局部变量 `res` 被创建，同时被一个动态分配的 `Resource` 对象初始化，因此第一次打印了 “Resource acquired”；
2.  `Res` [[return-by-value|按值返回]] `main()`。这里使用按值返回是因为`res`是一个局部变量，如果按地址返回或按引用返回则会带来问题因为`res`在 `generateResource()`函数结束时被销毁了。因此，`res` 会被==拷贝构建到一个临时变量中==。因为拷贝构造函数使用了深拷贝，所以它分配了一个新的 `Resource` ，所以第二次打印了 “Resource acquired”；
3.  `Res` 离开作用域，最初被创建的 `Resource` 对象就销毁了，因此第一打印了 “Resource destroyed”；
4.  临时对于通过拷贝赋值被赋值给了 `mainres` 。因为此处的拷贝赋值使用了深拷贝，所以它分配了一个新的 `Resource` ，所以第三次打印了 “Resource acquired”；
5.  当赋值表达式结束后，临时对象就离开了作用域并被销毁，因此第二次打印了“Resource destroyed”；
6.  在 `main()`的末尾，`mainres`离开了作用域，于是打印了最后一个 “Resource destroyed” 。

简而言之，我们调用了一次拷贝构造函数，拷贝构造了`res`到一个临时对象，然后调用了一次拷贝赋值将临时对象复制到`mainres`对象，所以最终总共分配和销毁了3个单独的对象。

效率很低，但至少不会崩溃！

但是，如果使用移动语义的话，效果会更好！


## 移动构造函数和移动赋值


C++ 11为了支持移动语义，新定义了两个函数：一个是[[move-constructor|移动构造函数]]，一个是[[move-assignment-operator|移动赋值运算符]]。拷贝构造函数和拷贝赋值的目的是将一个对象复制到另一个对象，而移动构造函数和移动赋值的目的是将资源的所有权从一个对象转移到另一个对象(这通常比复制成本低得多)。

定义移动构造函数和移动赋值，和定义它们的“拷贝语义”同僚类似。不过，==实现拷贝语义时需要使用const类型的左值引用作为形参，而实现移动语义时，需要使用非const的右值形参。==

这里是与上面相同的`Auto_ptr3`类，添加了移动构造函数和移动赋值操作符。为了进行比较，我们保留了深拷贝的拷贝构造函数和拷贝赋值操作符。


```cpp
#include <iostream>

template<typename T>
class Auto_ptr4
{
	T* m_ptr;
public:
	Auto_ptr4(T* ptr = nullptr)
		:m_ptr(ptr)
	{
	}

	~Auto_ptr4()
	{
		delete m_ptr;
	}

	// 拷贝构造函数
	// 将 a.m_ptr 深拷贝到 m_ptr
	Auto_ptr4(const Auto_ptr4& a)
	{
		m_ptr = new T;
		*m_ptr = *a.m_ptr;
	}

	// 移动构造函数
	// 转移 a.m_ptr 的资源给 m_ptr
	Auto_ptr4(Auto_ptr4&& a) noexcept //注意使用的是右值引用
		: m_ptr(a.m_ptr)
	{
		a.m_ptr = nullptr; // we'll talk more about this line below
	}

	// 拷贝赋值
	// 将 a.m_ptr 深拷贝到 m_ptr
	Auto_ptr4& operator=(const Auto_ptr4& a)
	{
		// Self-assignment detection
		if (&a == this)
			return *this;

		// Release any resource we're holding
		delete m_ptr;

		// Copy the resource
		m_ptr = new T;
		*m_ptr = *a.m_ptr;

		return *this;
	}

	// 移动赋值
	// 转移 a.m_ptr 的资源给 m_ptr
	Auto_ptr4& operator=(Auto_ptr4&& a) noexcept
	{
		// Self-assignment detection
		if (&a == this)
			return *this;

		// 释放当前持有的资源
		delete m_ptr;

		// 转移所有权
		m_ptr = a.m_ptr;
		a.m_ptr = nullptr; // we'll talk more about this line below

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

Auto_ptr4<Resource> generateResource()
{
	Auto_ptr4<Resource> res{new Resource};
	return res; // 此处会调用移动构造函数
}

int main()
{
	Auto_ptr4<Resource> mainres;
	mainres = generateResource(); // 此处赋值会调用移动赋值

	return 0;
}
```

移动构造函数和移动赋值运算符并不复杂。这个例子中，我们不再将源对象(`a`)深拷贝到隐式对象中，而是转移了源对象的资源。这涉及到将源指针浅拷贝到隐式对象中，然后将源指针设置为空。

程序运行输出：

```
Resource acquired
Resource destroyed
```

效果好极了！

程序的流程和之前的完全一样。但是，这个程序中调用的不是拷贝构造函数和拷贝赋值操作符，而是移动构造函数和移动赋值操作符。再深入一点看：

1.  在 `generateResource()`，局部变量 `res` 被创建，同时被一个动态分配的 `Resource` 对象初始化，因此第一次打印了 “Resource acquired”；
2. `Res` [[return-by-value|按值返回]] `main()`。`res` 会被==移动构造到一个临时变量中==，然后将存放在`res`动态创建的对象的所有权转移给了一个临时对象；
4.  `Res`离开作用域，但是由于`res`已经不管理指针了（已经转移给了临时对象），所以什么事情都不会发生；
5.  临时对象被移动赋值给 `mainres`，此时存放在临时对象中的动态创建的资源就被转移给了 `mainres`；
6.  当赋值表达式结束时，临时对象离开作用域并被销毁，但是由于它已经不再管理任何指针（已经转移给了`mainres`），所以仍然什么都不会发生。
7.  在`main()`结束的地方，`mainres` 会离开作用域，所以打印了 “Resource destroyed” 。

因此，这次，`Resource`并没有被复制两次(一次是拷贝构造函数，一次是拷贝赋值)，而是将其转移了两次。这么做效率明显更高，因为资源只构建和摧毁一次，而不是三次。


## 移动构造函数和移动赋值会在何时被调用？

移动构造函数和移动赋值在定义后才会被调用，而且用于构造或赋值的参数需要是一个右值。最典型的是，这个右值是一个字面量或临时值。

在大多数情况下，==编译器不会提供默认的移动构造函数和移动赋值操作符，除非该类没有定义任何拷贝构造函数、拷贝赋值、移动赋值或析构函数==。


## 移动语义背后的关键信息

现在你已经具有理解移动语义背后关键信息的背景知识了。

当使用一个[[lvalue|左值]]实参构造一个对象或进行赋值时，我们唯一能做的合理的事情就是复制这个左值。我们不能假设改变可以安全地改变这个左值，因为它可能在稍后的程序中再次被使用。例如，对于表达式`a = b` ，我们不能期望有任何合理的方式可以用来修改b的值。

然而，如果我们使用一个[[rvalue|右值]]来构造一个对象或赋值，由于右值只是某种类型的临时对象。因此，我们不必复制它(复制开销很大)，而是可以简单地将它管理的资源转移到正在构造或分配的对象即可。这样做是安全的，因为临时变量无论如何都会在表达式结束时被销毁。显然，它永远不会再被使用!

c++ 11通过[[rvalue-reference|右值引用]]，使我们能够在实参是右值和左值时选择不同的行为，以便设计出更聪明、更有效的对象行为。

## 移动函数应该保持两个对象都处于有效状态

在上面的例子中，不论是移动构造函数还移动赋值函数，都会将`a.m_ptr`设置为`nullptr`（空指针字面量）。这么做看上去有点多余——毕竟这只是一个临时的右值。既然它稍后就会被销毁，为啥还要手工“清理”它呢？

答案很简单：当 `a` 离开作用域时，析构函数会被调用，所以 `a.m_ptr` 会被删除。在操作执行时，如果 `a.m_ptr` 仍然指向与`m_ptr` 指向相同的对象，则 `m_ptr` 显然会变成一个[[dangling|悬垂]]指针。当我们后面使用（或销毁）包含了 `m_ptr` 的对象时，就会导致[[undefined-behavior|未定义行为]]。

在实现移动语义时，确保被移动的对象也处于有效状态是很重要的，这样它就可以正确地销毁(而不会导致未定义的行为)。

## 自动变量左值按值返回时可能会进行移动而不是拷贝


在上面`Auto_ptr4`示例的`generateResource()`函数中，当变量`res`按值返回时，它将被移动而不是复制，即使`res`是一个左值。==C++规范有一个特殊的规则，即函数按值返回的自动对象可以移动，即使它们是左值。==这是有道理的，因为`res`无论如何都会在函数结束时被销毁！那么我们还不如窃取它的资源，而不是执行昂贵且无用的拷贝操作。

==虽然编译器可以移动左值返回值，但在某些情况下，如果能够完全避免拷贝(这完全避免了复制或移动的需要)就更好了，在这种情况下，拷贝构造函数和移动构造函数甚至都不会被调用。==


## 阻止拷贝

在上面的`Auto_ptr4`类中，为了进行对照，我们保留了拷贝构造函数和拷贝操作符。==但在支持移动语义的类中，有时需要删除拷贝构造函数和拷贝赋值函数，以确保不会执行拷贝==。在`Auto_ptr`类中，我们不想拷贝模板化对象T——因为它的开销很大，而且类T甚至可能不支持复制！

下面是`Auto_ptr`的一个版本，它支持移动语义但不支持复制语义:


```cpp
#include <iostream>

template<typename T>
class Auto_ptr5
{
	T* m_ptr;
public:
	Auto_ptr5(T* ptr = nullptr)
		:m_ptr(ptr)
	{
	}

	~Auto_ptr5()
	{
		delete m_ptr;
	}

	// 拷贝构造函数 —— 不允许拷贝!
	Auto_ptr5(const Auto_ptr5& a) = delete;

	// Move constructor
	// Transfer ownership of a.m_ptr to m_ptr
	Auto_ptr5(Auto_ptr5&& a) noexcept
		: m_ptr(a.m_ptr)
	{
		a.m_ptr = nullptr;
	}

	// 拷贝赋值 —— 不允许拷贝
	Auto_ptr5& operator=(const Auto_ptr5& a) = delete;

	// Move assignment
	// Transfer ownership of a.m_ptr to m_ptr
	Auto_ptr5& operator=(Auto_ptr5&& a) noexcept
	{
		// Self-assignment detection
		if (&a == this)
			return *this;

		// Release any resource we're holding
		delete m_ptr;

		// Transfer ownership of a.m_ptr to m_ptr
		m_ptr = a.m_ptr;
		a.m_ptr = nullptr;

		return *this;
	}

	T& operator*() const { return *m_ptr; }
	T* operator->() const { return m_ptr; }
	bool isNull() const { return m_ptr == nullptr; }
};
```

如果你尝试将一个`Auto_ptr5`类型的左值按值传递给一个函数，则编译器会抱怨用于初始化函数参数的拷贝构造函数被删除了。这是好事，因为我们应该通过按引用传递的方式传递 `Auto_ptr5`！

`Auto_ptr5`(终于)一个很好的智能指针类。而且，实际上标准库包含一个非常类似于它的类，名为 `std::unique_ptr`。我们将在本章后面讨论更多关于`std::unique_ptr`的内容。

## 另一个例子

让我们来看看另一个使用动态内存的类：一个简单的动态的模板化数组。该类包含一个[[deep-copy|深拷贝]]拷贝构造函数和拷贝赋值运算符。

```cpp
#include <iostream>

template <typename T>
class DynamicArray
{
private:
	T* m_array;
	int m_length;

public:
	DynamicArray(int length)
		: m_array(new T[length]), m_length(length)
	{
	}

	~DynamicArray()
	{
		delete[] m_array;
	}

	// Copy constructor
	DynamicArray(const DynamicArray &arr)
		: m_length(arr.m_length)
	{
		m_array = new T[m_length];
		for (int i = 0; i < m_length; ++i)
			m_array[i] = arr.m_array[i];
	}

	// Copy assignment
	DynamicArray& operator=(const DynamicArray &arr)
	{
		if (&arr == this)
			return *this;

		delete[] m_array;

		m_length = arr.m_length;
		m_array = new T[m_length];

		for (int i = 0; i < m_length; ++i)
			m_array[i] = arr.m_array[i];

		return *this;
	}

	int getLength() const { return m_length; }
	T& operator[](int index) { return m_array[index]; }
	const T& operator[](int index) const { return m_array[index]; }

};
```

现在让我们在程序中使用这个类。为了演示在堆上分配一百万个整数时该类的执行情况，我们将利用在第[[13-18-timing-your-code|13.18 -对程序进行计时]]中开发的Timer类。我们将使用Timer类来对代码运行时间进行统计，以展示拷贝和移动之间的性能差异。

```cpp
#include <iostream>
#include <chrono> // for std::chrono functions

// Uses the above DynamicArray class

class Timer
{
private:
	// Type aliases to make accessing nested type easier
	using Clock = std::chrono::high_resolution_clock;
	using Second = std::chrono::duration<double, std::ratio<1> >;

	std::chrono::time_point<Clock> m_beg { Clock::now() };

public:
	void reset()
	{
		m_beg = Clock::now();
	}

	double elapsed() const
	{
		return std::chrono::duration_cast<Second>(Clock::now() - m_beg).count();
	}
};

// Return a copy of arr with all of the values doubled
DynamicArray<int> cloneArrayAndDouble(const DynamicArray<int> &arr)
{
	DynamicArray<int> dbl(arr.getLength());
	for (int i = 0; i < arr.getLength(); ++i)
		dbl[i] = arr[i] * 2;

	return dbl;
}

int main()
{
	Timer t;

	DynamicArray<int> arr(1000000);

	for (int i = 0; i < arr.getLength(); i++)
		arr[i] = i;

	arr = cloneArrayAndDouble(arr);

	std::cout << t.elapsed();
}
```



在笔者的机器上，以release模式编译，程序执行耗时 0.00825559 秒。

再次运行相同的程序，同时将拷贝构造函数和拷贝赋值替替换为移动构造函数和移动赋值。

```cpp
template <typename T>
class DynamicArray
{
private:
	T* m_array;
	int m_length;

public:
	DynamicArray(int length)
		: m_array(new T[length]), m_length(length)
	{
	}

	~DynamicArray()
	{
		delete[] m_array;
	}

	// Copy constructor
	DynamicArray(const DynamicArray &arr) = delete;

	// Copy assignment
	DynamicArray& operator=(const DynamicArray &arr) = delete;

	// Move constructor
	DynamicArray(DynamicArray &&arr) noexcept
		:  m_array(arr.m_array), m_length(arr.m_length)
	{
		arr.m_length = 0;
		arr.m_array = nullptr;
	}

	// Move assignment
	DynamicArray& operator=(DynamicArray &&arr) noexcept
	{
		if (&arr == this)
			return *this;

		delete[] m_array;

		m_length = arr.m_length;
		m_array = arr.m_array;
		arr.m_length = 0;
		arr.m_array = nullptr;

		return *this;
	}

	int getLength() const { return m_length; }
	T& operator[](int index) { return m_array[index]; }
	const T& operator[](int index) const { return m_array[index]; }

};

#include <iostream>
#include <chrono> // for std::chrono functions

class Timer
{
private:
	// Type aliases to make accessing nested type easier
	using Clock = std::chrono::high_resolution_clock;
	using Second = std::chrono::duration<double, std::ratio<1> >;

	std::chrono::time_point<Clock> m_beg { Clock::now() };

public:
	void reset()
	{
		m_beg = Clock::now();
	}

	double elapsed() const
	{
		return std::chrono::duration_cast<Second>(Clock::now() - m_beg).count();
	}
};

// Return a copy of arr with all of the values doubled
DynamicArray<int> cloneArrayAndDouble(const DynamicArray<int> &arr)
{
	DynamicArray<int> dbl(arr.getLength());
	for (int i = 0; i < arr.getLength(); ++i)
		dbl[i] = arr[i] * 2;

	return dbl;
}

int main()
{
	Timer t;

	DynamicArray<int> arr(1000000);

	for (int i = 0; i < arr.getLength(); i++)
		arr[i] = i;

	arr = cloneArrayAndDouble(arr);

	std::cout << t.elapsed();
}
```

同样的机器上，程序执行耗时 0.0056 秒。

比较两个版本的运行时间，0.0056 / 0.00825559 = 67.8%。使用移动语义的版本速度快乐 47.4% ！

## 不要使用 `std::swap` 实现移动语义

由于移动语义的目标是将资源从源对象移动到目标对象，所以你可能会考虑使用 `std::swap()` 实现移动构造函数和移动赋值操作符。然而，这并不是一个好主意，因为`std::swap()` 会在可移动对象上调用移动构造函数**和**移动赋值，这将导致无限递归。你可以在下面的例子中看到这种情况:

```cpp
#include <iostream>
#include <string>

class Name
{
private:
    std::string m_name; // std::string is move capable

public:
    Name(std::string name) : m_name{ name }
    {
    }

    Name(Name& name) = delete;
    Name& operator=(Name& name) = delete;

    Name(Name&& name)
    {
        std::cout << "Move ctor\n";

        std::swap(*this, name); // bad!
    }

    Name& operator=(Name&& name)
    {
        std::cout << "Move assign\n";

        std::swap(*this, name); // bad!

        return *this;
    }

    const std::string& get() { return m_name; }
};

int main()
{
    Name n1{ "Alex" };
    n1 = Name{"Joe"}; // invokes move assignment

    std::cout << n1.get() << '\n';

    return 0;
}
```

打印：

```
Move assign
Move ctor
Move ctor
Move ctor
Move ctor
```

一直打印。。。直到函数栈溢出。

你可以使用自己的`swap`函数实现移动构造函数和移动赋值，只要该`swap`函数不要调用移动构造函数或移动赋值即可。下面是一个如何做到这一点的例子:

```cpp
#include <iostream>
#include <string>

class Name
{
private:
    std::string m_name;

public:
    Name(std::string name) : m_name{ name }
    {
    }

    Name(Name& name) = delete;
    Name& operator=(Name& name) = delete;

    // Create our own swap friend function to swap the members of Name
    friend void swap(Name& a, Name& b) noexcept
    {
        // 对std::string 类型的成员直接使用std:swap
        // not on Name
        std::swap(a.m_name, b.m_name);
    }

    Name(Name&& name)
    {
        std::cout << "Move ctor\n";

        swap(*this, name); // Now calling our swap, not std::swap
    }

    Name& operator=(Name&& name)
    {
        std::cout << "Move assign\n";

        swap(*this, name); // Now calling our swap, not std::swap

        return *this;
    }
};

int main()
{
    Name n1{ "Alex" };
    n1 = Name{"Joe"}; // invokes move assignment

    std::cout << n1.get() << '\n';

    return 0;
}
```

运行结果符合预期：

```
Move assign
Joe
```