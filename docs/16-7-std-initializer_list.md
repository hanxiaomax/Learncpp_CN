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


??? note "关键点速记"
	
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

构造函数的函数体 body of the constructor is reserved for copying the elements from the list into our IntArray class. For some inexplicable reason, std::initializer_list does not provide access to the elements of the list via subscripting (operator`[]`). The omission has been noted many times to the standards committee and never addressed.

However, there are easy ways to work around the lack of subscripts. The easiest way is to use a for-each loop here. The ranged-based for loop steps through each element of the initialization list, and we can manually copy the elements into our internal array.

One caveat: Initializer lists will always favor a matching initializer_list constructor over other potentially matching constructors. Thus, this variable definition:

```cpp
IntArray array { 5 };
```

COPY

would match to IntArray(`std::initializer_list<int>`), not IntArray(int). If you want to match to IntArray(int) once a list constructor has been defined, you’ll need to use copy initialization or direct initialization. The same happens to std::vector and other container classes that have both a list constructor and a constructor with a similar type of parameter

```cpp
std::vector<int> array(5); // Calls std::vector::vector(std::vector::size_type), 5 value-initialized elements: 0 0 0 0 0
std::vector<int> array{ 5 }; // Calls std::vector::vector(std::initializer_list<int>), 1 element: 5
```

COPY

Class assignment using `std::initializer_list`

You can also use `std::initializer_list` to assign new values to a class by overloading the assignment operator to take a std::initializer_list parameter. This works analogously to the above. We’ll show an example of how to do this in the quiz solution below.

Note that if you implement a constructor that takes a `std::initializer_list`, you should ensure you do at least one of the following:

1.  Provide an overloaded list assignment operator
2.  Provide a proper deep-copying copy assignment operator
3.  Delete the copy assignment operator

Here’s why: consider the following class (which doesn’t have any of these things), along with a list assignment statement:

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


First, the compiler will note that an assignment function taking a std::initializer_list doesn’t exist. Next it will look for other assignment functions it could use, and discover the implicitly provided copy assignment operator. However, this function can only be used if it can convert the initializer list into an IntArray. Because { 1, 3, 5, 7, 9, 11 } is a std::initializer_list, the compiler will use the list constructor to convert the initializer list into a temporary IntArray. Then it will call the implicit assignment operator, which will shallow copy the temporary IntArray into our array object.

At this point, both the temporary IntArray’s m_data and array->m_data point to the same address (due to the shallow copy). You can already see where this is going.

At the end of the assignment statement, the temporary IntArray is destroyed. That calls the destructor, which deletes the temporary IntArray’s m_data. This leaves array->m_data as a dangling pointer. When you try to use array->m_data for any purpose (including when array goes out of scope and the destructor goes to delete m_data), you’ll get undefined behavior.

!!! success "最佳实践"

	If you provide list construction, it’s a good idea to provide list assignment as well.

## 小结

Implementing a constructor that takes a std::initializer_list parameter allows us to use list initialization with our custom classes. We can also use std::initializer_list to implement other functions that need to use an initializer list, such as an assignment operator.