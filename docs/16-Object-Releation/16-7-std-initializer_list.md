---
title: 16.7 - std::initializer_list
alias: 16.7 - std::initializer_list
origin: /stdinitializer_list/
origin_title: "16.7 — std::initializer_list"
time: 2022-5-31
type: translation
tags:
- object
- initializer_list
---


??? note "Key Takeaway"
	
	-


考虑下面这个整型数组：

```cpp
int array[5];
```

如果我们想用值初始化这个数组，可以直接通过[[initializer-list|初始化值列表]]语法来实现:

```cpp
#include <iostream>

int main()
{
	int array[] { 5, 4, 3, 2, 1 }; // 初始化值列表
	for (auto i : array)
		std::cout << i << ' ';

	return 0;
}
```

打印：

```
5 4 3 2 1
```

对于动态数组同样适用：

```cpp
#include <iostream>

int main()
{
	auto* array{ new int[5]{ 5, 4, 3, 2, 1 } }; // 初始化值列表
	for (int count{ 0 }; count < 5; ++count)
		std::cout << array[count] << ' ';
	delete[] array;

	return 0;
}
```


在上节课中我们介绍了[[container-class|容器类]]的概念，并且以`IntArray`类为例介绍了整型数组容器：

```cpp
#include <cassert> // for assert()
#include <iostream>

class IntArray
{
private:
    int m_length{};
    int* m_data{};

public:
    IntArray() = default;

    IntArray(int length)
        : m_length{ length }
        , m_data{ new int[length]{} }
    {
    }

    ~IntArray()
    {
        delete[] m_data;
        // we don't need to set m_data to null or m_length to 0 here, since the object will be destroyed immediately after this function anyway
    }

    int& operator[](int index)
    {
        assert(index >= 0 && index < m_length);
        return m_data[index];
    }

    int getLength() const { return m_length; }
};

int main()
{
	// 如果我们使用初始化值列表对IntArray进行初始化会发生什么呢？
	IntArray array { 5, 4, 3, 2, 1 }; // 无法编译
	for (int count{ 0 }; count < 5; ++count)
		std::cout << array[count] << ' ';

	return 0;
}
```


上述代码并不能成功编译，因为 `IntArray` 类并不知道在面对一个[[initializer-list|初始化值列表]]时应该做什么。因此，我们必须对数组中的元素逐一初始化：

```cpp
int main()
{
	IntArray array(5);
	array[0] = 5;
	array[1] = 4;
	array[2] = 3;
	array[3] = 2;
	array[4] = 1;

	for (int count{ 0 }; count < 5; ++count)
		std::cout << array[count] << ' ';

	return 0;
}
```


很不优雅。

## 使用 `std::initializer_list`初始化

当编译器看到初始化值列表时，它会自动地将初始化值列表转换为一个`std::initializer_list`类型的对象。因此，如果我们可以创建一个接收 `std::initializer_list` 类型参数的构造函数的话，就可以通过初始化值列表创建对象了。

`std::initializer_list` 位于 `<initializer_list>` 头文件中。

关于`std::initializer_list`，有些事情你必须指定。和 `std::array` 或者 `std::vector`类似，你必须告诉`std::initializer_list` 列表中的元素类型是什么，除非你是立即对其初始化。因此你很少会看到`std::initializer_list`的最简形式。多数情况下你看到的应该是这样的`std::initializer_list<int>` 或这样的 `std::initializer_list<std::string>`。

第二，`std::initializer_list` 有一个 `size()`成员函数可以返回列表中的元素个数。当我们需要指定传入的初始化列表多长时，这个方法非常有用。

使用 `std::initializer_list` 对 `IntArray`改写之后是这样的：

```cpp
#include <cassert> // for assert()
#include <initializer_list> // for std::initializer_list
#include <iostream>

class IntArray
{
private:
	int m_length {};
	int* m_data {};

public:
	IntArray() = default;

	IntArray(int length)
		: m_length{ length }
		, m_data{ new int[length]{} }
	{

	}

	IntArray(std::initializer_list<int> list) // allow IntArray to be initialized via list initialization
		: IntArray(static_cast<int>(list.size())) // use delegating constructor to set up initial array
	{
		// Now initialize our array from the list
		int count{ 0 };
		for (auto element : list)
		{
			m_data[count] = element;
			++count;
		}
	}

	~IntArray()
	{
		delete[] m_data;
		// we don't need to set m_data to null or m_length to 0 here, since the object will be destroyed immediately after this function anyway
	}

	IntArray(const IntArray&) = delete; // to avoid shallow copies
	IntArray& operator=(const IntArray& list) = delete; // to avoid shallow copies

	int& operator[](int index)
	{
		assert(index >= 0 && index < m_length);
		return m_data[index];
	}

	int getLength() const { return m_length; }
};

int main()
{
	IntArray array{ 5, 4, 3, 2, 1 }; // initializer list
	for (int count{ 0 }; count < array.getLength(); ++count)
		std::cout << array[count] << ' ';

	return 0;
}
```

运行结果符合预期：

```
5 4 3 2 1
```

很好！接下来让我们深入研究一下：

`IntArray`的构造函数接受 `std::initializer_list<int>`作为[[parameters|形参]]。

```cpp
IntArray(std::initializer_list<int> list) // 使得 IntArray 可以进行列表初始化
	: IntArray(static_cast<int>(list.size())) // 使用委派构造函数设置数组 
{
	// 使用列表元素初始化数组
	int count{ 0 };
	for (int element : list)
	{
		m_data[count] = element;
		++count;
	}
}
```

第一行：我们必须使用尖括号表明列表中元素的类型。在这个例子中，因为这是一个`IntArray`，所以初始化值列表中的元素自然需要是`int`。注意，我们并没有[[pass-by-reference|按const引用传递]]。和 `std::string_view` 类似，`std::initializer_list`是非常轻量级的，所以拷贝比间接访问开销还小。 

第二行：我们必须将内存分配的任务委派给其他构造函数（通过委派构造减少冗余代码）。该委派构造函数需要指定数组的长度，所以我们通过 `list.size()`获取长度并向它传递该信息。注意`list.size()` 返回的是 `size_t` (无符号)，所以我们必须将其转换为有符号整型。我们使用[[direct-initialization|直接初始化]]而不是[[括号初始化]]因为括号初始化需要[[list-constructor|列表构造函数]]（list constructors）。尽管构造函数可以被正确解析，使用直接初始化的方式初始化具有列表构造函数的类是更安全的（如果你本意不是使用列表构造函数的话）。

构造函数的函数体中的代码用于将初始化列表中的值拷贝到`IntArray`中。令人费解的是，`std::initializer_list` 并没有提供下标运算符用于访问元素。这个问题在C++标准委员会上被提及很多次但每一次都不了了之了。

不过，我们可以使用一些方法来解决这个问题。最简单的是使用[[range-based-for-loops|基于范围的for循环]]，它可以一次遍历初始化列表中的每个元素然后我们就可以将元素拷贝到我们的内部数组中。


注意：初始化器列表总是倾向于调用匹配的`initializer_list`构造函数，而不是其他可能匹配的构造函数。因此，这个变量定义:

```cpp
IntArray array { 5 };
```

会匹配到 `IntArray(std::initializer_list<int>)`而不是 `IntArray(int)`。如果你希望在[[list-constructor|列表构造函数]]存在的情况下匹配 `IntArray(int)` ，那么你需要使用[[copy-initialization|拷贝初始化]]或者[[direct-initialization|直接初始化]]。对于 `std::vector` 和其他同时具有列表构造函数和类似构造函数的[[container-class|容器类]]也是一样的。

```cpp
std::vector<int> array(5); // Calls std::vector::vector(std::vector::size_type), 5个元素被初始化为0
std::vector<int> array{ 5 }; // Calls std::vector::vector(std::initializer_list<int>), 一个元素 5
```

COPY

## 使用 `std::initializer_list` 对类进行赋值

重载赋值操作符接受`std::initializer_list`形参后，我们就可以通过`std::initializer_list`来为类赋值了。工作原理与上面类似。具体的实例见quiz部分。（见原文）

注意，如果你实现了一个接受`std::initializer_list`的构造函数，你应该确保你至少做了以下其中之一:

1.  提供重载的[[list assignment operator|列表赋值运算符]]；
2.  提供正确的[[deep-copy|深拷贝]][[copy-assignment-operator|拷贝赋值运算符]]；
3.  删除[[copy-assignment-operator|拷贝赋值运算符]]。

为什么？考虑下面这个类(不满足上面三个条件)在使用列表赋值语句时可能出现的问题：


```cpp
#include <cassert> // for assert()
#include <initializer_list> // for std::initializer_list
#include <iostream>

class IntArray
{
private:
	int m_length{};
	int* m_data{};

public:
	IntArray() = default;

	IntArray(int length)
		: m_length{ length }
		, m_data{ new int[length] {} }
	{

	}

	IntArray(std::initializer_list<int> list) // allow IntArray to be initialized via list initialization
		: IntArray(static_cast<int>(list.size())) // use delegating constructor to set up initial array
	{
		// Now initialize our array from the list
		int count{ 0 };
		for (auto element : list)
		{
			m_data[count] = element;
			++count;
		}
	}

	~IntArray()
	{
		delete[] m_data;
	}

//	IntArray(const IntArray&) = delete; // to avoid shallow copies
//	IntArray& operator=(const IntArray& list) = delete; // to avoid shallow copies

	int& operator[](int index)
	{
		assert(index >= 0 && index < m_length);
		return m_data[index];
	}

	int getLength() const { return m_length; }
};

int main()
{
	IntArray array{};
	array = { 1, 3, 5, 7, 9, 11 }; // Here's our list assignment statement

	for (int count{ 0 }; count < array.getLength(); ++count)
		std::cout << array[count] << ' ';

	return 0;
}
```

首先，编译器会注意到带有`std::initializer_list`的赋值函数不存在。接下来，它将查找其他可以使用的赋值函数，并发现**隐式提供**的[[copy-assignment-operator|拷贝赋值运算符]]。但是，此函数只应该在初始化器列表能够被转换为`IntArray`的情况下使用。因为`{1,3,5,7,9,11}`是`std::initializer_list`，编译器将使用列表构造函数将初始化列表转换为临时的`IntArray`。然后调用隐式赋值操作符，将临时的`IntArray`浅拷贝到数组对象中。

这样一来，临时 `IntArray` 的 `m_data` 和 `array->m_data` 都指向同一个地址（因为[[shallow-copy|浅拷贝]]的原因）。结果你应该也能预料到了。

在赋值语句的末尾，临时的 `IntArray` 会被销毁，此时它的析构函数就会删除 `IntArray`的 `m_data`。这使得 `array->m_data` 称为了一个悬垂指针。在后续使用 `array->m_data` 的时候（不论出于什么目的，包括数组[[going-out-of-scope|离开作用域]]或者析构函数删除`m_data`时），都会导致[[undefined-behavior|未定义行为]]。

> [!success] "最佳实践"
> 如果提供了列表构造函数，请同时提供列表赋值运算符。
	
## 小结

实现一个接受`std::initializer_list`形参的构造函数，允许我们对自定义类使用列表初始化。我们还可以使用`std::initializer_list`来实现其他需要使用初始化列表的函数，例如赋值操作符。
