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
	IntArray ar ( 10 ); // 分配一个 10 integers
	for (int count{ 0 }; count < ar.getLength(); ++count)
		ar.setValue(count, count+1);

	std::cout << "The value of element 5 is: " << ar.getValue(5) << '\n';

	return 0;
} // ar is destroyed here, so the ~IntArray() destructor function is called here
```


!!! tip "小贴士"

	If you compile the above example and get the following error:
	
	```
	error: 'class IntArray' has pointer data members [-Werror=effc++]|
	error:   but does not override 'IntArray(const IntArray&)' [-Werror=effc++]|
	error:   or 'operator=(const IntArray&)' [-Werror=effc++]|
	```

	Then you can either remove the “-Weffc++” flag from your compile settings for this example, or you can add the following two lines to the class:
	
	```cpp
	IntArray(const IntArray&) = delete;
	IntArray& operator=(const IntArray&) = delete;
	```
	
	We’ll discuss what these do in [14.14 -- Converting constructors, explicit, and delete](https://www.learncpp.com/cpp-tutorial/converting-constructors-explicit-and-delete/)

This program produces the result:

```
The value of element 5 is: 6
```

On the first line of main(), we instantiate a new IntArray class object called ar, and pass in a length of 10. This calls the constructor, which dynamically allocates memory for the array member. We must use dynamic allocation here because we do not know at compile time what the length of the array is (the caller decides that).

At the end of main(), ar goes out of scope. This causes the ~IntArray() destructor to be called, which deletes the array that we allocated in the constructor!

!!! info "提醒"

	In lesson [[11-7-std-string-view-part-2|11.7 - std::string_view（第二部分）]], we note that parentheses based initialization should be used when initializing an array/container/list class with a length (as opposed to a list of elements). For this reason, we initialize IntArray using `IntArray ar ( 10 );`.

## 构造和析构的时机

As mentioned previously, the constructor is called when an object is created, and the destructor is called when an object is destroyed. In the following example, we use cout statements inside the constructor and destructor to show this:

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
    // Allocate a Simple on the stack
    Simple simple{ 1 };
    std::cout << simple.getID() << '\n';

    // Allocate a Simple dynamically
    Simple* pSimple{ new Simple{ 2 } };

    std::cout << pSimple->getID() << '\n';

    // We allocated pSimple dynamically, so we have to delete it.
    delete pSimple;

    return 0;
} // simple goes out of scope here
```

COPY

This program produces the following result:

```
Constructing Simple 1
1
Constructing Simple 2
2
Destructing Simple 2
Destructing Simple 1
```

Note that “Simple 1” is destroyed after “Simple 2” because we deleted pSimple before the end of the function, whereas simple was not destroyed until the end of main().

Global variables are constructed before main() and destroyed after main().

## RAII

RAII (Resource Acquisition Is Initialization) is a programming technique whereby resource use is tied to the lifetime of objects with automatic duration (e.g. non-dynamically allocated objects). In C++, RAII is implemented via classes with constructors and destructors. A resource (such as memory, a file or database handle, etc…) is typically acquired in the object’s constructor (though it can be acquired after the object is created if that makes sense). That resource can then be used while the object is alive. The resource is released in the destructor, when the object is destroyed. The primary advantage of RAII is that it helps prevent resource leaks (e.g. memory not being deallocated) as all resource-holding objects are cleaned up automatically.

The IntArray class at the top of this lesson is an example of a class that implements RAII -- allocation in the constructor, deallocation in the destructor. std::string and std::vector are examples of classes in the standard library that follow RAII -- dynamic memory is acquired on initialization, and cleaned up automatically on destruction.

## A warning about the `exit()` function

Note that if you use the exit() function, your program will terminate and no destructors will be called. Be wary if you’re relying on your destructors to do necessary cleanup work (e.g. write something to a log file or database before exiting).

## 小结

As you can see, when constructors and destructors are used together, your classes can initialize and clean up after themselves without the programmer having to do any special work! This reduces the probability of making an error, and makes classes easier to use.

