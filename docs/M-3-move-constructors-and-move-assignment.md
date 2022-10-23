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

		// Release any resource we're holding
		delete m_ptr;

		// Transfer ownership of a.m_ptr to m_ptr
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
	return res; // this return value will invoke the move constructor
}

int main()
{
	Auto_ptr4<Resource> mainres;
	mainres = generateResource(); // this assignment will invoke the move assignment

	return 0;
}
```

The move constructor and move assignment operator are simple. Instead of deep copying the source object (a) into the implicit object, we simply move (steal) the source object’s resources. This involves shallow copying the source pointer into the implicit object, then setting the source pointer to null.

When run, this program prints:

```
Resource acquired
Resource destroyed
```

That’s much better!

The flow of the program is exactly the same as before. However, instead of calling the copy constructor and copy assignment operators, this program calls the move constructor and move assignment operators. Looking a little more deeply:

1.  Inside generateResource(), local variable res is created and initialized with a dynamically allocated Resource, which causes the first “Resource acquired”.
2.  Res is returned back to main() by value. Res is move constructed into a temporary object, transferring the dynamically created object stored in res to the temporary object. We’ll talk about why this happens below.
3.  Res goes out of scope. Because res no longer manages a pointer (it was moved to the temporary), nothing interesting happens here.
4.  The temporary object is move assigned to mainres. This transfers the dynamically created object stored in the temporary to mainres.
5.  The assignment expression ends, and the temporary object goes out of expression scope and is destroyed. However, because the temporary no longer manages a pointer (it was moved to mainres), nothing interesting happens here either.
6.  At the end of main(), mainres goes out of scope, and our final “Resource destroyed” is displayed.

So instead of copying our Resource twice (once for the copy constructor and once for the copy assignment), we transfer it twice. This is more efficient, as Resource is only constructed and destroyed once instead of three times.

## **When are the move constructor and move assignment called?**

The move constructor and move assignment are called when those functions have been defined, and the argument for construction or assignment is an r-value. Most typically, this r-value will be a literal or temporary value.

In most cases, a move constructor and move assignment operator will not be provided by default, unless the class does not have any defined copy constructors, copy assignment, move assignment, or destructors.

## **The key insight behind move semantics**

You now have enough context to understand the key insight behind move semantics.

If we construct an object or do an assignment where the argument is an l-value, the only thing we can reasonably do is copy the l-value. We can’t assume it’s safe to alter the l-value, because it may be used again later in the program. If we have an expression “a = b”, we wouldn’t reasonably expect b to be changed in any way.

However, if we construct an object or do an assignment where the argument is an r-value, then we know that r-value is just a temporary object of some kind. Instead of copying it (which can be expensive), we can simply transfer its resources (which is cheap) to the object we’re constructing or assigning. This is safe to do because the temporary will be destroyed at the end of the expression anyway, so we know it will never be used again!

C++11, through r-value references, gives us the ability to provide different behaviors when the argument is an r-value vs an l-value, enabling us to make smarter and more efficient decisions about how our objects should behave.

## **Move functions should always leave both objects in a valid state**

In the above examples, both the move constructor and move assignment functions set a.m_ptr to nullptr. This may seem extraneous -- after all, if `a` is a temporary r-value, why bother doing “cleanup” if parameter `a` is going to be destroyed anyway?

The answer is simple: When `a` goes out of scope, the destructor for `a` will be called, and `a.m_ptr` will be deleted. If at that point, `a.m_ptr` is still pointing to the same object as `m_ptr`, then `m_ptr` will be left as a dangling pointer. When the object containing `m_ptr` eventually gets used (or destroyed), we’ll get undefined behavior.

When implementing move semantics, it is important to ensure the moved-from object is left in a valid state, so that it will destruct properly (without creating undefined behavior).

## **Automatic l-values returned by value may be moved instead of copied**

In the generateResource() function of the Auto_ptr4 example above, when variable res is returned by value, it is moved instead of copied, even though res is an l-value. The C++ specification has a special rule that says automatic objects returned from a function by value can be moved even if they are l-values. This makes sense, since res was going to be destroyed at the end of the function anyway! We might as well steal its resources instead of making an expensive and unnecessary copy.

Although the compiler can move l-value return values, in some cases it may be able to do even better by simply eliding the copy altogether (which avoids the need to make a copy or do a move at all). In such a case, neither the copy constructor nor move constructor would be called.

## **Disabling copying**

In the Auto_ptr4 class above, we left in the copy constructor and assignment operator for comparison purposes. But in move-enabled classes, it is sometimes desirable to delete the copy constructor and copy assignment functions to ensure copies aren’t made. In the case of our Auto_ptr class, we don’t want to copy our templated object T -- both because it’s expensive, and whatever class T is may not even support copying!

Here’s a version of Auto_ptr that supports move semantics but not copy semantics:

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

	// Copy constructor -- no copying allowed!
	Auto_ptr5(const Auto_ptr5& a) = delete;

	// Move constructor
	// Transfer ownership of a.m_ptr to m_ptr
	Auto_ptr5(Auto_ptr5&& a) noexcept
		: m_ptr(a.m_ptr)
	{
		a.m_ptr = nullptr;
	}

	// Copy assignment -- no copying allowed!
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

COPY

If you were to try to pass an Auto_ptr5 l-value to a function by value, the compiler would complain that the copy constructor required to initialize the function argument has been deleted. This is good, because we should probably be passing Auto_ptr5 by const l-value reference anyway!

Auto_ptr5 is (finally) a good smart pointer class. And, in fact the standard library contains a class very much like this one (that you should use instead), named std::unique_ptr. We’ll talk more about std::unique_ptr later in this chapter.

## **Another example**

Let’s take a look at another class that uses dynamic memory: a simple dynamic templated array. This class contains a deep-copying copy constructor and copy assignment operator.

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

COPY

Now let’s use this class in a program. To show you how this class performs when we allocate a million integers on the heap, we’re going to leverage the Timer class we developed in lesson [13.18 -- Timing your code](https://www.learncpp.com/cpp-tutorial/timing-your-code/). We’ll use the Timer class to time how fast our code runs, and show you the performance difference between copying and moving.

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

COPY

On one of the author’s machines, in release mode, this program executed in 0.00825559 seconds.

Now let’s run the same program again, replacing the copy constructor and copy assignment with a move constructor and move assignment.

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

COPY

On the same machine, this program executed in 0.0056 seconds.

Comparing the runtime of the two programs, 0.0056 / 0.00825559 = 67.8%. The move version was 47.4% faster!

## **Do not implement move semantics using std::swap**

Since the goal of move semantics is to move a resource from a source object to a destination object, you might think about implementing the move constructor and move assignment operator using `std::swap()`. However, this is a bad idea, as `std::swap()` calls both the move constructor and move assignment on move-capable objects, which would result in an infinite recursion. You can see this happen in the following example:

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

COPY

This prints:

```
Move assign
Move ctor
Move ctor
Move ctor
Move ctor
```

And so on… until the stack overflows.

You can implement the move constructor and move assignment using your own swap function, as long as your swap member function does not call the move constructor or move assignment. Here’s an example of how that can be done:

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
        // We avoid recursive calls by invoking std::swap on the std::string member,
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

COPY

This works as expected, and prints:

```
Move assign
Joe
```