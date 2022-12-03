---
title: 11.18 — 迭代器简介
alias: 11.18 — 迭代器简介
origin: /introduction-to-iterators/
origin_title: "11.18 — Introduction to iterators"
time: 2022-9-15
type: translation
tags:
- iterator
---

??? note "Key Takeaway"
	



数组（或其他数据结构）的遍历是编程中一项常见的任务。到目前为止，我们已经介绍过多种遍历方法：使用循环和索引(`for-loops` 和 `while loops`)，使用指针和指针运算，使用[[range-based-for-loops|基于范围的for循环]]：

```cpp
#include <array>
#include <cstddef>
#include <iostream>

int main()
{
    // In C++17, the type of variable data is deduced to std::array<int, 7>
    // If you get an error compiling this example, see the warning below
    std::array data{ 0, 1, 2, 3, 4, 5, 6 };
    std::size_t length{ std::size(data) };

    // while-loop with explicit index
    std::size_t index{ 0 };
    while (index < length)
    {
        std::cout << data[index] << ' ';
        ++index;
    }
    std::cout << '\n';

    // for-loop with explicit index
    for (index = 0; index < length; ++index)
    {
        std::cout << data[index] << ' ';
    }
    std::cout << '\n';

    // for-loop with pointer (Note: ptr can't be const, because we increment it)
    for (auto ptr{ &data[0] }; ptr != (&data[0] + length); ++ptr)
    {
        std::cout << *ptr << ' ';
    }
    std::cout << '\n';

    // ranged-based for loop
    for (int i : data)
    {
        std::cout << i << ' ';
    }
    std::cout << '\n';

    return 0;
}
```


!!! warning "注意"

	注意，本节课的例子使用了C++17的特性：[[class-template-argument-deduction|类模板实参推断]]。即通过变量的初始化值推断模板实参。在上面的例子中，当编译器看到 `std::array data{ 0, 1, 2, 3, 4, 5, 6 };`时，它会推断出我们希望使用 `std::array<int, 7> data { 0, 1, 2, 3, 4, 5, 6 };`。

	如果你的编译器不支持C++17，你会得到这样的编译错误：“missing template arguments before ‘data’”。此时你最好按照[0.12 -- Configuring your compiler: Choosing a language standard](https://www.learncpp.com/cpp-tutorial/configuring-your-compiler-choosing-a-language-standard/)介绍的方法打开C++17支持。如果实在不行，你可以将这一行替换为显式的声明(e.g. replace `std::array data{ 0, 1, 2, 3, 4, 5, 6 };` with `std::array<int, 7> data { 0, 1, 2, 3, 4, 5, 6 };`

如果我们只需要通过索引获取元素的话（而不需要使用索引），那么使用基于索引的遍历需要很多不必要的键盘输入。而且，该方法也仅仅适用于支持元素直接访问的容器（数组支持，但是其他类型的容器例如链表就不支持）。

使用指针遍历更是啰嗦，而且对于不了解指针运算规则的人来说，可读性非常差。指针遍历也只适用于元素在内存中连续存在的情况（数组是这样的，但是其他类型的容器可不是，例如链表、树和映射）。

!!! info "扩展阅读"

	指针(在不使用指针运算时)也可以用于遍历一些非顺序型数据结构。在一个链表中，每个元素都通过指针指向下一个元素。因此我们可以沿着指针链遍历各个元素。

[[range-based-for-loops|基于范围的for循环]]就有意思了，它遍历容器的具体机制隐藏于幕后——而且，它可以用于各种不同类型的数据结构（数组、链表、树、映射等）。它的原理是什么呢？它使用了迭代器。

## 迭代器

[[iterator|迭代器]]是一个用于遍历容器（例如数组中的值或字符串中的字符）的对象，它在移动的过程中提供了对每个元素访问的能力。

容器可以提供不同类型的迭代器。例如，数组容器会提供向前遍历整个数组的前向迭代器和用于逆序遍历数组的逆序迭代器。

一旦创建了合适的迭代器，程序员就可以使用该迭代器提供的接口来遍历和访问容器中的元素，而不需要操心具体的遍历是如何实现的，也不需要操心容器中的数据是如何存储的。同时，因为C++中的迭代器通常提供了相同的接口用于遍历（`++`操作符用于移动到下一个元素）和访问（[[dereference-operator|解引用运算符]]用于访问元素），所以我们可以使用一致的客户端代码来遍历各种各样的容器。

## 指针作为迭代器

其实，最简单的迭代器就是指针。指针（使用指针运算）可以用于遍历顺序存放在内存中的数据。接下来我们先复习一下指针和[[指针运算]]：

```cpp
#include <array>
#include <iostream>

int main()
{
    std::array data{ 0, 1, 2, 3, 4, 5, 6 };

    auto begin{ &data[0] };
    // note that this points to one spot beyond the last element
    auto end{ begin + std::size(data) };

    // for-loop with pointer
    for (auto ptr{ begin }; ptr != end; ++ptr) // ++ to move to next element
    {
        std::cout << *ptr << ' '; // Indirection to get value of current element
    }
    std::cout << '\n';

    return 0;
}
```

输出：

```
0 1 2 3 4 5 6
```

在上面的例子中我们定义了两个变量：`begin` (指向容器中的第一个元素)和`end` (标记为结束点)。对于数组中来说，我们通常假定数组多包含一个元素，而结束标记应设置为该最后一个元素。

然后，指针从 `begin` 遍历到 `end`，而且所处位置的元素可以通过指针访问。

!!! warning "注意"

	你可能会尝试使用取地址和数组语法，像下面这样获取结束标记：
	```cpp
	int* end{ &data[std::size(data)] };
	```
	
	这么做会导致[[undefined-behavior|未定义行为]]，因为对于下标来说，`data[std::size(data)]`所访问的元素已经越界了。
	
	应该这么做
	
	```cpp
	int* end{ data.data() + std::size(data) }; // data() 会返回第一个元素
	```



## 标准库迭代器

遍历是如此的普遍，所以标准库中所有的容器都支持迭代。而且不需要使用指针并计算起止点的位置，而是可以函数 `begin()` 和 `end()` 直接获取迭代器：

```cpp
#include <array>
#include <iostream>

int main()
{
    std::array array{ 1, 2, 3 };

    // 通过begin和end函数直接获取起止点
    auto begin{ array.begin() };
    auto end{ array.end() };

    for (auto p{ begin }; p != end; ++p) // ++ 移动到下一个元素
    {
        std::cout << *p << ' '; // 间接访问当前元素
    }
    std::cout << '\n';

    return 0;
}
```

输出结果：

```
1 2 3
```

 
`iterator` 头文件还包含了两个泛型函数 `std::begin` 和 `std::end` ，可以用于获取迭代器：

```cpp
#include <array>
#include <iostream>
#include <iterator> // For std::begin and std::end

int main()
{
    std::array array{ 1, 2, 3 };

    // Use std::begin and std::end to get the begin and end points.
    auto begin{ std::begin(array) };
    auto end{ std::end(array) };

    for (auto p{ begin }; p != end; ++p) // ++ to move to next element
    {
        std::cout << *p << ' '; // Indirection to get value of current element
    }
    std::cout << '\n';

    return 0;
}
```

输出结果一样：

```
1 2 3
```

现在不要担心迭代器的类型，我们将在后面的章节中再次介绍迭代器。重要的是，迭代器负责处理遍历容器所需的各项细节。我们只需要四个东西：起点、终点、将迭代器移动到下一个元素(或结束)的操作符++和获取当前元素值的操作符*。


## 基于范围的for循环

==所有具有`begin()` 和 `end()` 成员函数的类型，或者可以配合`std::begin()` 和 `std::end()` 使用的类型，都可以用于[[range-based-for-loops|基于范围的for循环]]。==

```cpp
#include <array>
#include <iostream>

int main()
{
    std::array array{ 1, 2, 3 };

    // This does exactly the same as the loop we used before.
    for (int i : array)
    {
        std::cout << i << ' ';
    }
    std::cout << '\n';

    return 0;
}
```


实际上，基于范围的for循环会在背地里调用被遍历类型的 `begin()` 和 `end()` 。`std::array` 是具有 `begin` 和 `end` 成员函数的，所以它可以被用于基于范围的循环。C语言风格的固定数组，也可以通过 `std::begin` 和 `std::end` 来获取起止点，所以它也可以被用于基于范围的for循环。动态数组就不好使了，因为`std::end` 函数对它无效（类型信息不包含数组长度）。

稍后你将学习如何向类型中添加函数，以便它们也可以被用于基于范围的for循环。

[[range-based-for-loops|基于范围的for循环]]并不是唯一使用迭代器的地方。迭代器也用在`std::sort` 和其他算法中。在了解迭代器之后你会发现，标准库中大量地使用了迭代器。

## 无效迭代器（悬垂迭代器）

Much like pointers and references, iterators can be left “dangling” if the elements being iterated over change address or are destroyed. When this happens, we say the iterator has been invalidated. Accessing an invalidated iterator produces undefined behavior.

就像指针和引用一样，如果迭代器的元素地址被修改或本身被销毁时，迭代器可能会处于[[dangling|悬垂]]状态。当发生这种情况时，我们说迭代器已失效。访问无效的迭代器会产生[[undefined-behavior|未定义行为]]。


一些修改容器的操作(例如向`std::vector` 中添加一个元素)可能会导致容器中的元素地址改变。当这种情况发生时，指向这些元素的现有迭代器将失效。好的C++参考文档应该说明哪些容器操作可能或将使迭代器失效。[“Iterator invalidation” section of `std::vector` on cppreference](https://en.cppreference.com/w/cpp/container/vector#Iterator_invalidation) 可以作为一个具体的例子。

失效的例子如下：

```cpp
#include <iostream>
#include <vector>

int main()
{
	std::vector v{ 1, 2, 3, 4, 5, 6, 7 };

	auto it{ v.begin() };

	++it; // 移动到第二个元素
	std::cout << *it << '\n'; // ok: 打印2

	v.erase(it); // erase 当前遍历到的元素

	// erase() 使得被指向被删除元素的迭代器失效
	// 所以迭代器"it" 现在是无效的

	++it; // 未定义行为
	std::cout << *it << '\n'; // 未定义行为

	return 0;
}
```