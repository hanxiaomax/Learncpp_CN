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

??? note "关键点速记"
	



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

其实，最简单的迭代器就是指针。指针（使用指针运算）可以用于遍历顺序存放在内存中的数据。接下来我们先复习yi'xiwhich (using pointer arithmetic) works for data stored sequentially in memory. Let’s revisit a simple array traversal using a pointer and pointer arithmetic:

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

COPY

Output:

0 1 2 3 4 5 6

In the above, we defined two variables: `begin` (which points to the beginning of our container), and `end` (which marks an end point). For arrays, the end marker is typically the place in memory where the last element would be if the container contained one more element.

The pointer then iterates between `begin` and `end`, and the current element can be accessed by indirection through the pointer.

Warning

You might be tempted to calculate the end marker using the address-of operator and array syntax like so:

```cpp
int* end{ &data[std::size(data)] };
```

COPY

But this causes undefined behavior, because `data[std::size(data)]` accesses an element that is off the end of the array.

Instead, use:

```cpp
int* end{ data.data() + std::size(data) }; // data() returns a pointer to the first element
```

COPY

Standard library iterators

Iterating is such a common operation that all standard library containers offer direct support for iteration. Instead of calculating our own begin and end points, we can simply ask the container for the begin and end points via functions conveniently named `begin()` and `end()`:

```cpp
#include <array>
#include <iostream>

int main()
{
    std::array array{ 1, 2, 3 };

    // Ask our array for the begin and end points (via the begin and end member functions).
    auto begin{ array.begin() };
    auto end{ array.end() };

    for (auto p{ begin }; p != end; ++p) // ++ to move to next element.
    {
        std::cout << *p << ' '; // Indirection to get value of current element.
    }
    std::cout << '\n';

    return 0;
}
```

COPY

This prints:

1 2 3

The `iterator` header also contains two generic functions (`std::begin` and `std::end`) that can be used:

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

COPY

This also prints:

1 2 3

Don’t worry about the types of the iterators for now, we’ll re-visit iterators in a later chapter. The important thing is that the iterator takes care of the details of iterating through the container. All we need are four things: the begin point, the end point, operator++ to move the iterator to the next element (or the end), and operator* to get the value of the current element.

Back to range-based for loops

All types that have both `begin()` and `end()` member functions, or that can be used with `std::begin()` and `std::end()`, are usable in range-based for-loops.

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

COPY

Behind the scenes, the range-based for-loop calls `begin()` and `end()` of the type to iterate over. `std::array` has `begin` and `end` member functions, so we can use it in a range-based loop. C-style fixed arrays can be used with `std::begin` and `std::end` functions, so we can loop through them with a range-based loop as well. Dynamic arrays don’t work though, because there is no `std::end` function for them (because the type information doesn’t contain the array’s length).

You’ll learn how to add functions to your types later, so that they can be used with range-based for-loops too.

Range-based for-loops aren’t the only thing that makes use of iterators. They’re also used in `std::sort` and other algorithms. Now that you know what they are, you’ll notice they’re used quite a bit in the standard library.

Iterator invalidation (dangling iterators)

Much like pointers and references, iterators can be left “dangling” if the elements being iterated over change address or are destroyed. When this happens, we say the iterator has been invalidated. Accessing an invalidated iterator produces undefined behavior.

Some operations that modify containers (such as adding an element to a `std::vector`) can have the side effect of causing the elements in the container to change addresses. When this happens, existing iterators to those elements will be invalidated. Good C++ reference documentation should note which container operations may or will invalidate iterators. As an example, see the [“Iterator invalidation” section of `std::vector` on cppreference](https://en.cppreference.com/w/cpp/container/vector#Iterator_invalidation).

Here’s an example of this:

```cpp
#include <iostream>
#include <vector>

int main()
{
	std::vector v{ 1, 2, 3, 4, 5, 6, 7 };

	auto it{ v.begin() };

	++it; // move to second element
	std::cout << *it << '\n'; // ok: prints 2

	v.erase(it); // erase the element currently being iterated over

	// erase() invalidates iterators to the erased element (and subsequent elements)
	// so iterator "it" is now invalidated

	++it; // undefined behavior
	std::cout << *it << '\n'; // undefined behavior

	return 0;
}
```