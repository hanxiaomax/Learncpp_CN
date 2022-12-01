---
title: M.6 — std::unique_ptr
alias: M.6 — std::unique_ptr
origin: /stdunique_ptr/
origin_title: "M.6 — std::unique_ptr"
time: 2022-8-9
type: translation
tags:
- move
- C++14
- C++17
---

??? note "Key Takeaway"

	- 智能指针永远都不应该被动态创建，总是应该在栈上
	- `std::unique_ptr` 智能指针是其管理资源的唯一拥有者，且只有移动语义
	- `std::unique_ptr` 并不一定总是管理着某个对象——有可能是它被初始化为空（使用默认构造函数或`nullptr`字面量作为参数），也有可能是它管理的资源被转移了，通过直接对它判断true还是false可以知道它是否正在管理资源
	- 模板化函数 `std::make_unique` 比直接使用`std::unique_ptr`更好用也更安全，它返回的是管理资源的`std::unique_ptr`
	- 函数传参时，一般不希望转移所有权，否则资源会在函数结束时被销毁。此时最好传递智能指针管理的资源本身（按值传递或按地址传递都可以），但是不要把智能指针的引用直接传进去

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

==因为 `std::unique_ptr` 在设计时考虑了移动语义，所以其[[copy-constructors|拷贝构造函数]]和[[copy-assignment-operator|拷贝赋值运算符]]都被禁用了。如果你想要转移 `std::unique_ptr` 管理的资源的话，就必须使用移动语义==。在上面的例子中，移动语义是通过 `std::move` 实现的（它把`res1`转换成了一个[[rvalue|右值]]，因此触发了移动赋值而不是拷贝赋值）。

## 访问被智能指针管理的对象

`std::unique_ptr` 类重载了[[dereference-operator|解引用运算符]]和[[member-access-operator|成员访问运算符->]]，所以我们可以通过这两个运算符来返回被管理的对象。解引用运算符会返回被管理资源的引用，而`operator->`返回一个指针。

记住，==`std::unique_ptr` 并不一定总是管理着某个对象——有可能是它被初始化为空（使用默认构造函数或`nullptr`字面量作为参数），也有可能是它管理的资源被转移了==。 所以在使用这些操作符之前，必须首先检查 `std::unique_ptr`是否有资源。==因为`std::unique_ptr`会被隐式转换为布尔类型，所以只需要对该指针进行条件判断就可以，当返回`true`时说明它包含资源。==


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

打印结果：

```
Resource acquired
I am a resource
Resource destroyed
```

在上面的例子中，我们使用了重载的[[dereference-operator|解引用运算符]]来获取 `std::unique_ptr` `res` 管理的 `Resource` 对象，然后将其送去 `std::cout` 打印。

## `std::unique_ptr` 和数组

和 `std::auto_ptr` 不一样的是，`std::unique_ptr` 足够只能，它懂得使用恰当的`delete`去删除内存（普通 `delete` 或数组 `delete`），所以，`std::unique_ptr` 既可以用于一般对象，也可以用于数组。

但是，==相对于使用 `std::unique_ptr` 管理一个固定数组或C风格字符串，使用`std::array` 或者 `std::vector` (或者 `std::string`) 总是更好的选择。== 

!!! success "最佳实践"

	相对于使用 `std::unique_ptr` 管理一个固定数组、动态数组或C风格字符串，使用`std::array` 或者 `std::vector` (或者 `std::string`) 总是更好的选择。 

## `std::make_unique`

C++14 新增了一个名为 `std::make_unique()`的函数。这个模板化函数基于一个模板类型构建对象，并使用传入的参数对其进行初始化。

```cpp
#include <memory> // for std::unique_ptr 和 std::make_unique
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
	// 创建一个动态分配的 Fraction
	// 这里可以配合使用自动类型推断获得更好的效果
	auto f1{ std::make_unique<Fraction>(3, 5) };
	std::cout << *f1 << '\n';

	// 创建一个动态分配的 Fraction 数组，长度为4
	auto f2{ std::make_unique<Fraction[]>(4) };
	std::cout << f2[0] << '\n';

	return 0;
}
```

程序输出：

```
3/5
0/1
```

使用 `std::make_unique()` 是一种可选的办法，但是相对于直接创建 `std::unique_ptr` ，我们更推荐这种做法。不关因为使用 `std::make_unique` 的代码更加简洁（尤其是使用了[[8-7-Type-deduction-for-objects-using-the auto-keyword|类型推断]]后），它还可以解决C++参数求值顺序没有规范而引发的异常安全问题。

!!! success "最佳实践"

	使用 `std::make_unique()` 来代替 `std::unique_ptr`和 `new`。

## 异常安全问题

如果你对上文提到的[[exception-safety-issue|异常安全问题]]感到好奇的话，这一小结我们会详细进行介绍。

考虑下面的代码：

```cpp
some_function(std::unique_ptr<T>(new T), function_that_can_throw_exception());
```

对于如何执行上述函数调用，编译器有很大的灵活性。它可以先创建新的类型T，然后调用`function_that_can_throw_exception()`吗，然后创建`std::unique_ptr` 去管理动态分配的T。如果 `function_that_can_throw_exception()` 抛出了依次，那么T在被分配内存后，没有被释放，因为用于管理它的智能指针还没有被创建。显然这会导致内存泄漏。

`std::make_unique()` 客服了整个问题，因为对象T和 `std::unique_ptr` 的创建都是在 `std::make_unique()`中完成的，执行顺序没有歧义。

## 函数返回 `std::unique_ptr`

`std::unique_ptr` 可以安全地从函数中[[return-by-value|按值返回]]：

```cpp
#include <memory> // for std::unique_ptr

std::unique_ptr<Resource> createResource()
{
     return std::make_unique<Resource>();//匿名对象是右值，所以使用移动语义
}

int main()
{
    auto ptr{ createResource() };

    // do whatever

    return 0;
}
```

在上面的代码中，`createResource()` 按值返回了 `std::unique_ptr` 。如果这个值没有被赋值给任何其他的对象，那么临时对象就会离开作用域，`Resource`也会被清理。如果它被赋值给其他对象 (像 `main()`中那样)，在C++14或更早的代码中，[[move-semantics|移动语义]]会被用来将返回值`Resource`转移给被赋值的对象（上面例子中的`ptr`）。在C++17或更新的代码中，这个返回值会被省略，因此通过 `std::unique_ptr` 返回资源返回原始指针要安全的多！

一般情况下，你不应该将 `std::unique_ptr` 按指针返回（永远不要）或者按引用返回（除非你有足够的理由）。


## 传递 `std::unique_ptr` 给函数

如果你需要函数获取 `std::unique_ptr` 管理的资源，使用[[pass-by-value|按值传递]]。注意，由于[[copy-semantics|拷贝语义]]被禁用了，所以必须对实际传入的参数调用 `std::move`。

!!! info "译者注"

	需不需要使用`std::move`要看传入的是左值还是右值，左值才需要。


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
    takeOwnership(std::move(ptr)); // ok: 使用移动语义

    std::cout << "Ending program\n";

    return 0;
}
```

程序输出结果为：

```
Resource acquired
I am a resource
Resource destroyed
Ending program
```

==注意，在这个例子中，`Resource` 的所有权被转移给了`takeOwnership()`，所以 `Resource` 会在 `takeOwnership()` 函数结束时被销毁，而不是 `main()`。==

但是，大多数时候，我们不会希望某个函数拥有资源的所有权。尽管你可以[[pass-by-reference|按引用传递]]`std::unique_ptr` (这样一来函数就无需考虑所有权直接使用对象本身)，但是这种做法只有在函数可能需要改变被管理的对象时才使用。

相反，最好是**直接传递资源本身**(通过指针或引用，取决于null是否是有效参数)。这样一来，函数就无需关心资源是如何被管理的了。要从`std::unique_ptr`中获取原始资源指针，你可以使用`get()`成员函数：

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

// 函数值会使用资源，所以它只需要获取指向资源本身的指针，而不需要获取完整的 std::unique_ptr<Resource> 的引用
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

	useResource(ptr.get()); // note: 通过 get() 获取被管理的资源

	std::cout << "Ending program\n";

	return 0;
} // The Resource is destroyed here
```

程序运行结果：

```
Resource acquired
I am a resource
Ending program
Resource destroyed
```

## `std::unique_ptr` 和类

当然，你也可以将 `std::unique_ptr` 作为一个类成员（形成[[16-2-composition|组合关系]]关系）。这样一来，你就不需要在类的析构函数中删除该动内存，因为`std::unique_ptr` 会在类对象销毁时自动销毁。

但是，如果类没有被正确地销毁的话（例如，动态分配了内存但没有被释放），于是 `std::unique_ptr` 成员也不会被销毁，所以它管理的资源也不会被释放。

## `std::unique_ptr` 的误用

`std::unique_ptrs`有两种典型的误用，但是它们其实很容易避免。首先，不要让多个类管理同一个资源，例如：

```cpp
Resource* res{ new Resource() };
std::unique_ptr<Resource> res1{ res };
std::unique_ptr<Resource> res2{ res };
```

尽管语法上完全正确，但是最终的结果是`res1` 和 `res2` 都会去删除资源`Resource`，进而导致[[undefined-behavior|未定义行为]]。

第二，不要手动释放已经在 `std::unique_ptr` 管理下的资源：

```cpp
Resource* res{ new Resource() };
std::unique_ptr<Resource> res1{ res };
delete res;
```


这么做的话，`std::unique_ptr` 就会再次删除这个已经被释放的资源，导致[[undefined-behavior|未定义行为]]。

使用 `std::make_unique()` 可以避免上述两个问题。
