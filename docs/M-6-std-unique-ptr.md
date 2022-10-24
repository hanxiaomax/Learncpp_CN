---
title: M.6 — std::unique_ptr
alias: M.6 — std::unique_ptr
origin: /stdunique_ptr/
origin_title: "M.6 — std::unique_ptr"
time: 2022-8-9
type: translation
tags:
- move
---

??? note "关键点速记"


在本章开始的时候，我们讨论了使用指针可能会引发的bug和内存泄漏问题。例如，函数的提前返回、异常的抛出和指针删除不当都可能导致上述问题。

```cpp
#include <iostream>

void someFunction()
{
    auto* ptr{ new Resource() };

    int x{};
    std::cout << "Enter an integer: ";
    std::cin >> x;

    if (x == 0)
        throw 0; // the function returns early, and ptr won’t be deleted!

    // do stuff with ptr here

    delete ptr;
}
```

到目前为止，我们已经学习了[[move-semantics|移动语义]]的基本内容，接下来可以继续回到智能指针类的讨论了。回忆一下，智能指针是一个用于管理动态分配内存的类。尽管智能指针也提供其他功能，但是它最本质的功能还是管理动态分配的资源，并且确保在恰当的时候（通常是智能指针[[going-out-of-scope|离开作用域]]时），该动态资源可以被正确地清理。

因此，==智能指针本身永远都不应该被动态创建==（否则智能指针对象本身可能会被忘记释放，从而导致内存泄漏问题）。默认情况下，智能指针应该被创建在栈上（作为[[6-3-Local-variables|局部变量]]或作为其他类的成员），我们保证智能指针在离开作用域时（包含该指针的函数或对象结束时），它所拥有的资源会被恰当地释放。

C++11 标准库提供了4种智能指针类：`std::auto_ptr` (在 C++17 中已经删除了)， `std::unique_ptr`， `std::shared_ptr` 和 `std::weak_ptr`。其中 `std::unique_ptr` 是目前最为常用的一个指针类，所以我们稍后会首先介绍它，在接下来的课程中，我们会介绍 `std::shared_ptr` 和`std::weak_ptr`。

## `std::unique_ptr`

`std::unique_ptr` 在C++11中被用来替代 `std::auto_ptr`。该智能指针被用来管理动态分配的对象，且该对象并不被多个其他对象所共享。也就是说， `std::unique_ptr` 单独拥有它所管理的资源，而不会和其他类共享资源的所有权。 `std::unique_ptr` 被定义在 `<memory>` 头文件中。

再看一个简单的例子：

```cpp
#include <iostream>
#include <memory> // for std::unique_ptr

class Resource
{
public:
	Resource() { std::cout << "Resource acquired\n"; }
	~Resource() { std::cout << "Resource destroyed\n"; }
};

int main()
{
	// allocate a Resource object and have it owned by std::unique_ptr
	std::unique_ptr<Resource> res{ new Resource() };

	return 0;
} // res goes out of scope here, and the allocated Resource is destroyed
```


因为 `std::unique_ptr` 被分配在栈上，所以它最终一定会离开作用域，当它离开时，它会确保`Resource`被删除。

和`std::auto_ptr`不同的是 `std::unique_ptr`正确地实现了移动语义。

```cpp
#include <iostream>
#include <memory> // for std::unique_ptr
#include <utility> // for std::move

class Resource
{
public:
	Resource() { std::cout << "Resource acquired\n"; }
	~Resource() { std::cout << "Resource destroyed\n"; }
};

int main()
{
	std::unique_ptr<Resource> res1{ new Resource{} }; // 创建 Resource 
	std::unique_ptr<Resource> res2{}; // 初始化为空指针

	std::cout << "res1 is " << (res1 ? "not null\n" : "null\n");
	std::cout << "res2 is " << (res2 ? "not null\n" : "null\n");

	// res2 = res1; // 不能编译: 因为拷贝赋值被禁用了
	res2 = std::move(res1); // res2 获取资源所有权，res1 设为空

	std::cout << "Ownership transferred\n";

	std::cout << "res1 is " << (res1 ? "not null\n" : "null\n");
	std::cout << "res2 is " << (res2 ? "not null\n" : "null\n");

	return 0;
} // Resource destroyed here when res2 goes out of scope
```

程序运行结果为：

```
Resource acquired
res1 is not null
res2 is null
Ownership transferred
res1 is null
res2 is not null
Resource destroyed
```

因为 `std::unique_ptr` 在设计时考虑了移动语义，所以其[[copy-constructors|拷贝构造函数]]和[[copy-assignment-operator|拷贝赋值运算符]]都被禁用了。如果你想要转移 `std::unique_ptr` 管理的资源的话，就必须使用移动语义。在上面的例子中，移动语义是通过 `std::move` 实现的（它把`res1`转换成了一个[[rvalue|右值]]，因此触发了移动赋值而不是拷贝赋值）。

## 访问被智能指针管理的对象

`std::unique_ptr` 类重载了[[dereference-operator|解引用运算符]]和[[成员访问n overloaded operator* and operator-> that can be used to return the resource being managed. Operator* returns a reference to the managed resource, and operator-> returns a pointer.

Remember that std::unique_ptr may not always be managing an object -- either because it was created empty (using the default constructor or passing in a nullptr as the parameter), or because the resource it was managing got moved to another std::unique_ptr. So before we use either of these operators, we should check whether the std::unique_ptr actually has a resource. Fortunately, this is easy: std::unique_ptr has a cast to bool that returns true if the std::unique_ptr is managing a resource.

Here’s an example of this:

```cpp
#include <iostream>
#include <memory> // for std::unique_ptr

class Resource
{
public:
	Resource() { std::cout << "Resource acquired\n"; }
	~Resource() { std::cout << "Resource destroyed\n"; }
	friend std::ostream& operator<<(std::ostream& out, const Resource &res)
	{
		out << "I am a resource";
		return out;
	}
};

int main()
{
	std::unique_ptr<Resource> res{ new Resource{} };

	if (res) // use implicit cast to bool to ensure res contains a Resource
		std::cout << *res << '\n'; // print the Resource that res is owning

	return 0;
}
```

COPY

This prints:

```
Resource acquired
I am a resource
Resource destroyed
```

In the above program, we use the overloaded operator* to get the Resource object owned by std::unique_ptr res, which we then send to std::cout for printing.

## `std::unique_ptr` 和数组

Unlike std::auto_ptr, std::unique_ptr is smart enough to know whether to use scalar delete or array delete, so std::unique_ptr is okay to use with both scalar objects and arrays.

However, std::array or std::vector (or std::string) are almost always better choices than using std::unique_ptr with a fixed array, dynamic array, or C-style string.

!!! success "最佳实践"

	Favor std::array, std::vector, or std::string over a smart pointer managing a fixed array, dynamic array, or C-style string.

## `std::make_unique`

C++14 comes with an additional function named std::make_unique(). This templated function constructs an object of the template type and initializes it with the arguments passed into the function.

```cpp
#include <memory> // for std::unique_ptr and std::make_unique
#include <iostream>

class Fraction
{
private:
	int m_numerator{ 0 };
	int m_denominator{ 1 };

public:
	Fraction(int numerator = 0, int denominator = 1) :
		m_numerator{ numerator }, m_denominator{ denominator }
	{
	}

	friend std::ostream& operator<<(std::ostream& out, const Fraction &f1)
	{
		out << f1.m_numerator << '/' << f1.m_denominator;
		return out;
	}
};


int main()
{
	// Create a single dynamically allocated Fraction with numerator 3 and denominator 5
	// We can also use automatic type deduction to good effect here
	auto f1{ std::make_unique<Fraction>(3, 5) };
	std::cout << *f1 << '\n';

	// Create a dynamically allocated array of Fractions of length 4
	auto f2{ std::make_unique<Fraction[]>(4) };
	std::cout << f2[0] << '\n';

	return 0;
}
```

COPY

The code above prints:

```
3/5
0/1
```

Use of std::make_unique() is optional, but is recommended over creating std::unique_ptr yourself. This is because code using std::make_unique is simpler, and it also requires less typing (when used with automatic type deduction). Furthermore it resolves an exception safety issue that can result from C++ leaving the order of evaluation for function arguments unspecified.

!!! success "最佳实践"

	Use `std::make_unique()` instead of creating std::unique_ptr and using new yourself.

The exception safety issue in more detail [](https://www.learncpp.com/cpp-tutorial/stdunique_ptr/#smartpointerexceptionsafety)

For those wondering what the “exception safety issue” mentioned above is, here’s a description of the issue.

Consider an expression like this one:

```cpp
some_function(std::unique_ptr<T>(new T), function_that_can_throw_exception());
```

COPY

The compiler is given a lot of flexibility in terms of how it handles this call. It could create a new T, then call function_that_can_throw_exception(), then create the std::unique_ptr that manages the dynamically allocated T. If function_that_can_throw_exception() throws an exception, then the T that was allocated will not be deallocated, because the smart pointer to do the deallocation hasn’t been created yet. This leads to T being leaked.

std::make_unique() doesn’t suffer from this problem because the creation of the object T and the creation of the std::unique_ptr happen inside the std::make_unique() function, where there’s no ambiguity about order of execution.

## 函数返回 `std::unique_ptr`

std::unique_ptr can be safely returned from a function by value:

```cpp
#include <memory> // for std::unique_ptr

std::unique_ptr<Resource> createResource()
{
     return std::make_unique<Resource>();
}

int main()
{
    auto ptr{ createResource() };

    // do whatever

    return 0;
}
```

COPY

In the above code, createResource() returns a std::unique_ptr by value. If this value is not assigned to anything, the temporary return value will go out of scope and the Resource will be cleaned up. If it is assigned (as shown in main()), in C++14 or earlier, move semantics will be employed to transfer the Resource from the return value to the object assigned to (in the above example, ptr), and in C++17 or newer, the return will be elided. This makes returning a resource by std::unique_ptr much safer than returning raw pointers!

In general, you should not return std::unique_ptr by pointer (ever) or reference (unless you have a specific compelling reason to).

## 传递 `std::unique_ptr` 给函数

If you want the function to take ownership of the contents of the pointer, pass the std::unique_ptr by value. Note that because copy semantics have been disabled, you’ll need to use std::move to actually pass the variable in.

```cpp
#include <iostream>
#include <memory> // for std::unique_ptr
#include <utility> // for std::move

class Resource
{
public:
	Resource() { std::cout << "Resource acquired\n"; }
	~Resource() { std::cout << "Resource destroyed\n"; }
	friend std::ostream& operator<<(std::ostream& out, const Resource &res)
	{
		out << "I am a resource";
		return out;
	}
};

void takeOwnership(std::unique_ptr<Resource> res)
{
     if (res)
          std::cout << *res << '\n';
} // the Resource is destroyed here

int main()
{
    auto ptr{ std::make_unique<Resource>() };

//    takeOwnership(ptr); // This doesn't work, need to use move semantics
    takeOwnership(std::move(ptr)); // ok: use move semantics

    std::cout << "Ending program\n";

    return 0;
}
```

COPY

The above program prints:

```
Resource acquired
I am a resource
Resource destroyed
Ending program
```

Note that in this case, ownership of the Resource was transferred to `takeOwnership()`, so the Resource was destroyed at the end of `takeOwnership()` rather than the end of `main()`.

However, most of the time, you won’t want the function to take ownership of the resource. Although you can pass a `std::unique_ptr` by reference (which will allow the function to use the object without assuming ownership), you should only do so when the called function might alter or change the object being managed.

Instead, it’s better to just pass the resource itself (by pointer or reference, depending on whether null is a valid argument). This allows the function to remain agnostic of how the caller is managing its resources. To get a raw resource pointer from a std::unique_ptr, you can use the `get()` member function:

```cpp
#include <memory> // for std::unique_ptr
#include <iostream>

class Resource
{
public:
	Resource() { std::cout << "Resource acquired\n"; }
	~Resource() { std::cout << "Resource destroyed\n"; }

	friend std::ostream& operator<<(std::ostream& out, const Resource &res)
	{
		out << "I am a resource";
		return out;
	}
};

// The function only uses the resource, so we'll accept a pointer to the resource, not a reference to the whole std::unique_ptr<Resource>
void useResource(Resource* res)
{
	if (res)
		std::cout << *res << '\n';
	else
		std::cout << "No resource\n";
}

int main()
{
	auto ptr{ std::make_unique<Resource>() };

	useResource(ptr.get()); // note: get() used here to get a pointer to the Resource

	std::cout << "Ending program\n";

	return 0;
} // The Resource is destroyed here
```

COPY

The above program prints:

```
Resource acquired
I am a resource
Ending program
Resource destroyed
```

## `std::unique_ptr` 和类

You can, of course, use std::unique_ptr as a composition member of your class. This way, you don’t have to worry about ensuring your class destructor deletes the dynamic memory, as the std::unique_ptr will be automatically destroyed when the class object is destroyed.

However, if the class object is not destroyed properly (e.g. it is dynamically allocated and not deallocated properly), then the std::unique_ptr member will not be destroyed either, and the object being managed by the std::unique_ptr will not be deallocated.

## `std::unique_ptr` 的误用

There are two easy ways to misuse std::unique_ptrs, both of which are easily avoided. First, don’t let multiple classes manage the same resource. For example:

```cpp
Resource* res{ new Resource() };
std::unique_ptr<Resource> res1{ res };
std::unique_ptr<Resource> res2{ res };
```

COPY

While this is legal syntactically, the end result will be that both res1 and res2 will try to delete the Resource, which will lead to undefined behavior.

Second, don’t manually delete the resource out from underneath the std::unique_ptr.

```cpp
Resource* res{ new Resource() };
std::unique_ptr<Resource> res1{ res };
delete res;
```

COPY

If you do, the std::unique_ptr will try to delete an already deleted resource, again leading to undefined behavior.

Note that std::make_unique() prevents both of the above cases from happening inadvertently.