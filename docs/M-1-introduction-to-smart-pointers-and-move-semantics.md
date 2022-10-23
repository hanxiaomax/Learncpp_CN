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

Now let’s go back to our someFunction() example above, and show how a smart pointer class can solve our challenge:

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
    Auto_ptr1<Resource> ptr(new Resource()); // ptr now owns the Resource

    int x;
    std::cout << "Enter an integer: ";
    std::cin >> x;

    if (x == 0)
        return; // the function returns early

    // do stuff with ptr here
    ptr->sayHi();
}

int main()
{
    someFunction();

    return 0;
}
```

COPY

If the user enters a non-zero integer, the above program will print:

Resource acquired
Hi!
Resource destroyed

If the user enters zero, the above program will terminate early, printing:

Resource acquired
Resource destroyed

Note that even in the case where the user enters zero and the function terminates early, the Resource is still properly deallocated.

Because the ptr variable is a local variable, ptr will be destroyed when the function terminates (regardless of how it terminates). And because the Auto_ptr1 destructor will clean up the Resource, we are assured that the Resource will be properly cleaned up.

**A critical flaw**

The Auto_ptr1 class has a critical flaw lurking behind some auto-generated code. Before reading further, see if you can identify what it is. We’ll wait…

(Hint: consider what parts of a class get auto-generated if you don’t supply them)

(Jeopardy music)

Okay, time’s up.

Rather than tell you, we’ll show you. Consider the following program:

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
	Auto_ptr1<Resource> res2(res1); // Alternatively, don't initialize res2 and then assign res2 = res1;

	return 0;
}
```

COPY

This program prints:

Resource acquired
Resource destroyed
Resource destroyed

Very likely (but not necessarily) your program will crash at this point. See the problem now? Because we haven’t supplied a copy constructor or an assignment operator, C++ provides one for us. And the functions it provides do shallow copies. So when we initialize res2 with res1, both Auto_ptr1 variables are pointed at the same Resource. When res2 goes out of the scope, it deletes the resource, leaving res1 with a dangling pointer. When res1 goes to delete its (already deleted) Resource, crash!

You’d run into a similar problem with a function like this:

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

COPY

In this program, res1 will be copied by value into passByValue’s parameter res, leading to duplication of the Resource pointer. Crash!

So clearly this isn’t good. How can we address this?

Well, one thing we could do would be to explicitly define and delete the copy constructor and assignment operator, thereby preventing any copies from being made in the first place. That would prevent the pass by value case (which is good, we probably shouldn’t be passing these by value anyway).

But then how would we return an Auto_ptr1 from a function back to the caller?

```cpp
??? generateResource()
{
     Resource* r{ new Resource() };
     return Auto_ptr1(r);
}
```

COPY

We can’t return our Auto_ptr1 by reference, because the local Auto_ptr1 will be destroyed at the end of the function, and the caller will be left with a dangling reference. We could return pointer r as `Resource*`, but then we might forget to delete r later, which is the whole point of using smart pointers in the first place. So that’s out. Returning the Auto_ptr1 by value is the only option that makes sense -- but then we end up with shallow copies, duplicated pointers, and crashes.

Another option would be to override the copy constructor and assignment operator to make deep copies. In this way, we’d at least guarantee to avoid duplicate pointers to the same object. But copying can be expensive (and may not be desirable or even possible), and we don’t want to make needless copies of objects just to return an Auto_ptr1 from a function. Plus assigning or initializing a dumb pointer doesn’t copy the object being pointed to, so why would we expect smart pointers to behave differently?

What do we do?

**Move semantics**

What if, instead of having our copy constructor and assignment operator copy the pointer (“copy semantics”), we instead transfer/move ownership of the pointer from the source to the destination object? This is the core idea behind move semantics. **Move semantics** means the class will transfer ownership of the object rather than making a copy.

Let’s update our Auto_ptr1 class to show how this can be done:

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

	// A copy constructor that implements move semantics
	Auto_ptr2(Auto_ptr2& a) // note: not const
	{
		m_ptr = a.m_ptr; // transfer our dumb pointer from the source to our local object
		a.m_ptr = nullptr; // make sure the source no longer owns the pointer
	}

	// An assignment operator that implements move semantics
	Auto_ptr2& operator=(Auto_ptr2& a) // note: not const
	{
		if (&a == this)
			return *this;

		delete m_ptr; // make sure we deallocate any pointer the destination is already holding first
		m_ptr = a.m_ptr; // then transfer our dumb pointer from the source to the local object
		a.m_ptr = nullptr; // make sure the source no longer owns the pointer
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

COPY

This program prints:

Resource acquired
res1 is not null
res2 is null
Ownership transferred
res1 is null
res2 is not null
Resource destroyed

Note that our overloaded operator= gave ownership of m_ptr from res1 to res2! Consequently, we don’t end up with duplicate copies of the pointer, and everything gets tidily cleaned up.

**std::auto_ptr, and why it was a bad idea**

Now would be an appropriate time to talk about std::auto_ptr. std::auto_ptr, introduced in C++98 and removed in C++17, was C++’s first attempt at a standardized smart pointer. std::auto_ptr opted to implement move semantics just like the Auto_ptr2 class does.

However, std::auto_ptr (and our Auto_ptr2 class) has a number of problems that makes using it dangerous.

First, because std::auto_ptr implements move semantics through the copy constructor and assignment operator, passing a std::auto_ptr by value to a function will cause your resource to get moved to the function parameter (and be destroyed at the end of the function when the function parameters go out of scope). Then when you go to access your auto_ptr argument from the caller (not realizing it was transferred and deleted), you’re suddenly dereferencing a null pointer. Crash!

Second, std::auto_ptr always deletes its contents using non-array delete. This means auto_ptr won’t work correctly with dynamically allocated arrays, because it uses the wrong kind of deallocation. Worse, it won’t prevent you from passing it a dynamic array, which it will then mismanage, leading to memory leaks.

Finally, auto_ptr doesn’t play nice with a lot of the other classes in the standard library, including most of the containers and algorithms. This occurs because those standard library classes assume that when they copy an item, it actually makes a copy, not a move.

Because of the above mentioned shortcomings, std::auto_ptr has been deprecated in C++11 and removed in C++17.

**Moving forward**

The core problem with the design of std::auto_ptr is that prior to C++11, the C++ language simply had no mechanism to differentiate “copy semantics” from “move semantics”. Overriding the copy semantics to implement move semantics leads to weird edge cases and inadvertent bugs. For example, you can write `res1 = res2` and have no idea whether res2 will be changed or not!

Because of this, in C++11, the concept of “move” was formally defined, and “move semantics” were added to the language to properly differentiate copying from moving. Now that we’ve set the stage for why move semantics can be useful, we’ll explore the topic of move semantics throughout the rest of this chapter. We’ll also fix our Auto_ptr2 class using move semantics.

In C++11, std::auto_ptr has been replaced by a bunch of other types of “move-aware” smart pointers: std::unique_ptr, std::weak_ptr, and std::shared_ptr. We’ll also explore the two most popular of these: unique_ptr (which is a direct replacement for auto_ptr) and shared_ptr.

[

](https://www.learncpp.com/cpp-tutorial/rvalue-references/)