---
title: 11.19 — 标准库算法简介
alias: 11.19 — 标准库算法简介
origin: /introduction-to-standard-library-algorithms/
origin_title: "11.19 — Introduction to standard library algorithms"
time: 2022-10-15
type: translation
tags:
- algorithms
- C++20
---

??? note "关键点速记"

	- `<algorithms>`中提供了很多好用的算法，用于对容器进行查找、搜索和计数。
	- [`std::find`](https://en.cppreference.com/w/cpp/algorithm/find) 函数用于查找某个值在元素中第一次出现的位置。`std::find` 有三个参数：序列中起始元素的迭代器、终点元素的迭代器、需要搜索的值。该函数会返回指向目标元素的迭代器（如果找到的话），或者指向容器的末尾（如果没找的话）。
	- [`std::find_if`](https://en.cppreference.com/w/cpp/algorithm/find)在容器中查找是否有一个满足某种条件的值（例如字符串中是否包含某个特定的子串）
	- [`std::count`](https://en.cppreference.com/w/cpp/algorithm/count) 和 `std::count_if` 用于搜索满足某个条件的元素，并对其出现次数进行统计。



新手程序员可能会画上大量的时间来编写循环代码处理很多简单的任务，例如排序、计数或者是搜索数组。这些循环可能很容易带来问题，一方面本身编写数组循环就容易产生问题，另外一方面可维护性也很不好，因为循环代码通常比较难以理解。

因为搜索、统计和排序是非常常见的操作，所以C++标准库为此提供了非常多的函数，以便你使用寥寥几句代码就可以完成这些任务。不仅如此，标准库的函数久经检验、高效、可以配合多种不同类型的容器使用，而且它们中多少都支持并行（使用多个CPU线程同时工作以便更快速的完成任务）。

标准算法库提供的功能大体可以分为以下三类：

-   查验类（Inspectors）—— 用于查看（不修改）容器中的数据。包括搜索和统计。
-   修改类（Mutators）—— 用于修改容器中的数据。例如排序和洗牌。
-   辅助类（Facilitators）—— 用于基于数据生成结果。例如数值相乘或者确定元素对的排序顺序。

这些算法都被定义在 [algorithms](https://en.cppreference.com/w/cpp/algorithm) 库中。在本节课中，我们会介绍其中最常用的一些算法——但是实际上该算法库提供的算法远远不止这些，强烈建议你点击链接去到参考手册，看看它的全部内容。

注意：所有这些算法都使用了[[iterator|迭代器]]，如果你还不熟悉迭代器的话，再去学习一下[[11-18-Introduction-to-iterators|11.18 — 迭代器简介]]吧。

## 使用 `std::find` 查找特定值的元素

[`std::find`](https://en.cppreference.com/w/cpp/algorithm/find) 函数用于查找某个值在元素中第一次出现的位置。`std::find` 有三个参数：序列中起始元素的迭代器、终点元素的迭代器、需要搜索的值。该函数会返回指向目标元素的迭代器（如果找到的话），或者指向容器的末尾（如果没找的话）。

例如：

```cpp
#include <algorithm>
#include <array>
#include <iostream>

int main()
{
    std::array arr{ 13, 90, 99, 5, 40, 80 };

    std::cout << "Enter a value to search for and replace with: ";
    int search{};
    int replace{};
    std::cin >> search >> replace;

    // 忽略输入合法性检查

    // std::find 返回指向找到元素的迭代器（或者是指向容器末尾）
    // 我们将该元素存放到一个变量中，通过类型推断来获取迭代器的类型
    auto found{ std::find(arr.begin(), arr.end(), search) };

    // 没有找到则返回指向末尾的迭代器
    // 可以使用end()函数获取末尾并和迭代器进行比较
    if (found == arr.end())
    {
        std::cout << "Could not find " << search << '\n';
    }
    else
    {
        // 替换
        *found = replace;
    }

    for (int i : arr)
    {
        std::cout << i << ' ';
    }

    std::cout << '\n';

    return 0;
}
```


元素存在的例子：

```
Enter a value to search for and replace with: 5 234
13 90 99 234 40 80
```

元素不存在的例子：

```
Enter a value to search for and replace with: 0 234
Could not find 0
13 90 99 5 40 80
```

## 使用 `std::find_if` 查找满足特定条件的元素

有的时候我们需要在容器中查找是否有一个满足某种条件的值（例如字符串中是否包含某个特定的子串），而不是某个具体的值。在这种情况下，`std::find_if` 很好用。

`std::find_if` 函数的工作方式和`std::find`很类似，但是我们不需要传递一个具体的值，而是传递一个[[callable-object|可调用对象]]，例如函数指针（或者[[12-7-introduction-to-lambdas-anonymous-functions|lambda表达式]]）。
当元素被依次遍历时，`std::find_if`会调用函数（通过实参传入的函数），而该函数会返回`true`或`false`。

下面的例子中使用了 `std::find_if` 来查找包含`nut`子串的元素：

```cpp
#include <algorithm>
#include <array>
#include <iostream>
#include <string_view>

// Our function will return true if the element matches
bool containsNut(std::string_view str)
{
    // std::string_view::find returns std::string_view::npos if it doesn't find
    // the substring. Otherwise it returns the index where the substring occurs
    // in str.
    return (str.find("nut") != std::string_view::npos);
}

int main()
{
    std::array<std::string_view, 4> arr{ "apple", "banana", "walnut", "lemon" };

    // Scan our array to see if any elements contain the "nut" substring
    auto found{ std::find_if(arr.begin(), arr.end(), containsNut) };

    if (found == arr.end())
    {
        std::cout << "No nuts\n";
    }
    else
    {
        std::cout << "Found " << *found << '\n';
    }

    return 0;
}
```

输出结果：

```
Found walnut
```

如果我们自己编写上面的示例，则至少需要三个循环(一个循环遍历数组，两个循环匹配子字符串)。标准库函数允许我们在短短几行代码中完成相同的事情！

## 使用 `std::count` 和 `std::count_if` 进行计数

[`std::count`](https://en.cppreference.com/w/cpp/algorithm/count) 和 `std::count_if` 用于搜索满足某个条件的元素，并对其出现次数进行统计。

在下面的例子中，我们统计有多少个元素包含"nut"子串：

```cpp
#include <algorithm>
#include <array>
#include <iostream>
#include <string_view>

bool containsNut(std::string_view str)
{
	return (str.find("nut") != std::string_view::npos);
}

int main()
{
	std::array<std::string_view, 5> arr{ "apple", "banana", "walnut", "lemon", "peanut" };

	auto nuts{ std::count_if(arr.begin(), arr.end(), containsNut) };

	std::cout << "Counted " << nuts << " nut(s)\n";

	return 0;
}
```

输出结果：

```
Counted 2 nut(s)
```

## 使用 `std::sort` 进行自定义排序

我们曾使用 [`std::sort`](https://en.cppreference.com/w/cpp/algorithm/sort) 对数组进行升序排序，但实际上 `std::sort` 还可以做很多事。一个版本的 `std::sort` 可以接受第三个参数hat takes a function as its third parameter that allows us to sort however we like. The function takes two parameters to compare, and returns true if the first argument should be ordered before the second. By default, `std::sort` sorts the elements in ascending order.

Let’s use `std::sort` to sort an array in reverse order using a custom comparison function named `greater`:

```cpp
#include <algorithm>
#include <array>
#include <iostream>

bool greater(int a, int b)
{
    // Order @a before @b if @a is greater than @b.
    return (a > b);
}

int main()
{
    std::array arr{ 13, 90, 99, 5, 40, 80 };

    // Pass greater to std::sort
    std::sort(arr.begin(), arr.end(), greater);

    for (int i : arr)
    {
        std::cout << i << ' ';
    }

    std::cout << '\n';

    return 0;
}
```

输出结果：

```
99 90 80 40 13 5
```

Once again, instead of writing our own custom loop functions, we can sort our array however we like in just a few lines of code!

Our `greater` function needs 2 arguments, but we’re not passing it any, so where do they come from? When we use a function without parentheses (), it’s only a function pointer, not a call. You might remember this from when we tried to print a function without parentheses and `std::cout` printed “1”. `std::sort` uses this pointer and calls the actual `greater` function with any 2 elements of the array. We don’t know which elements `greater` will be called with, because it’s not defined which sorting algorithm `std::sort` is using under the hood. We talk more about function pointers in a later chapter.

!!! tip "小贴士"

	Because sorting in descending order is so common, C++ provides a custom type (named `std::greater`) for that too (which is part of the [functional](https://en.cppreference.com/w/cpp/header/functional) header). In the above example, we can replace:
	
	```cpp
	std::sort(arr.begin(), arr.end(), greater); // call our custom greater function
	```
	
	with:
	
	```cpp
	std::sort(arr.begin(), arr.end(), std::greater{}); // use the standard library greater comparison
	// Before C++17, we had to specify the element type when we create std::greater
	std::sort(arr.begin(), arr.end(), std::greater<int>{}); // use the standard library greater comparison
	```

	Note that the `std::greater{}` needs the curly braces because it is not a callable function. It’s a type, and in order to use it, we need to instantiate an object of that type. The curly braces instantiate an anonymous object of that type (which then gets passed as an argument to std::sort).

!!! info "扩展阅读"

    To further explain how `std::sort` uses the comparison function, we’ll have to take a step back to a modified version of the selection sort example from lesson [11.4 -- Sorting an array using selection sort](https://www.learncpp.com/cpp-tutorial/sorting-an-array-using-selection-sort/).
	
	```cpp
	#include <iostream>
	#include <iterator>
	#include <utility>
	
	void sort(int* begin, int* end)
	{
	    for (auto startElement{ begin }; startElement != end; ++startElement)
	    {
	        auto smallestElement{ startElement };
	
	        // std::next returns a pointer to the next element, just like (startElement + 1) would.
	        for (auto currentElement{ std::next(startElement) }; currentElement != end; ++currentElement)
	        {
	            if (*currentElement < *smallestElement)
	            {
	                smallestElement = currentElement;
	            }
	        }
	
	        std::swap(*startElement, *smallestElement);
	    }
	}
	
	int main()
	{
	    int array[]{ 2, 1, 9, 4, 5 };
	
	    sort(std::begin(array), std::end(array));
	
	    for (auto i : array)
	    {
	        std::cout << i << ' ';
	    }
	
	    std::cout << '\n';
	
	    return 0;
	}
	```
	
	COPY
	
	So far, this is nothing new and `sort` always sorts elements from low to high. To add a comparison function, we have to use a new type, `std::function<bool(int, int)>`, to store a function that takes 2 int parameters and returns a bool. Treat this type as magic for now, we will explain it in [chapter 12](https://www.learncpp.com/#Chapter12).
	
	```cpp
	void sort(int* begin, int* end, std::function<bool(int, int)> compare)
	```

	We can now pass a comparison function like `greater` to `sort`, but how does `sort` use it? All we need to do is replace the line
	
	```cpp
	if (*currentElement < *smallestElement)
	```

	
	with
	
	```cpp
	if (compare(*currentElement, *smallestElement))
	```

	
	Now the caller of `sort` can choose how to compare two elements.
	
	```cpp
	#include <functional> // std::function
	#include <iostream>
	#include <iterator>
	#include <utility>
	
	// sort accepts a comparison function
	void sort(int* begin, int* end, std::function<bool(int, int)> compare)
	{
	    for (auto startElement{ begin }; startElement != end; ++startElement)
	    {
	        auto smallestElement{ startElement };
	
	        for (auto currentElement{ std::next(startElement) }; currentElement != end; ++currentElement)
	        {
	            // the comparison function is used to check if the current element should be ordered
	            // before the currently "smallest" element.
	            if (compare(*currentElement, *smallestElement))
	            {
	                smallestElement = currentElement;
	            }
	        }
	
	        std::swap(*startElement, *smallestElement);
	    }
	}
	
	int main()
	{
	    int array[]{ 2, 1, 9, 4, 5 };
	
	    // use std::greater to sort in descending order
	    // (We have to use the global namespace selector to prevent a collision
	    // between our sort function and std::sort.)
	    ::sort(std::begin(array), std::end(array), std::greater{});
	
	    for (auto i : array)
	    {
	        std::cout << i << ' ';
	    }
	
	    std::cout << '\n';
	
	    return 0;
	}
	```
	

## 使用 `std::for_each` 对容器中的每个元素进行操作

[`std::for_each`](https://en.cppreference.com/w/cpp/algorithm/for_each) takes a list as input and applies a custom function to every element. This is useful when we want to perform the same operation to every element in a list.

Here’s an example where we use `std::for_each` to double all the numbers in an array:

```cpp
#include <algorithm>
#include <array>
#include <iostream>

void doubleNumber(int& i)
{
    i *= 2;
}

int main()
{
    std::array arr{ 1, 2, 3, 4 };

    std::for_each(arr.begin(), arr.end(), doubleNumber);

    for (int i : arr)
    {
        std::cout << i << ' ';
    }

    std::cout << '\n';

    return 0;
}
```

输出结果：

```
2 4 6 8
```

This often seems like the most unnecessary algorithm to new developers, because equivalent code with a range-based for-loop is shorter and easier. But there are benefits to `std::for_each`. Let’s compare `std::for_each` to a range-based for-loop.

```cpp
std::ranges::for_each(arr, doubleNumber); // Since C++20, we don't have to use begin() and end().
// std::for_each(arr.begin(), arr.end(), doubleNumber); // Before C++20

for (auto& i : arr)
{
    doubleNumber(i);
}
```

COPY

With `std::for_each`, our intentions are clear. Call `doubleNumber` with each element of `arr`. In the range-based for-loop, we have to add a new variable, `i`. This leads to several mistakes that a programmer could do when they’re tired or not paying attention. For one, there could be an implicit conversion if we don’t use `auto`. We could forget the ampersand, and `doubleNumber` wouldn’t affect the array. We could accidentally pass a variable other than `i` to `doubleNumber`. These mistakes cannot happen with `std::for_each`.

Additionally, `std::for_each` can skip elements at the beginning or end of a container, for example to skip the first element of `arr`, [`std::next`](https://en.cppreference.com/w/cpp/iterator/next) can be used to advance begin to the next element.

```cpp
std::for_each(std::next(arr.begin()), arr.end(), doubleNumber);
// Now arr is [1, 4, 6, 8]. The first element wasn't doubled.
```


This isn’t possible with a range-based for-loop.

Like many algorithms, `std::for_each` can be parallelized to achieve faster processing, making it better suited for large projects and big data than a range-based for-loop.

## 执行顺序

Note that most of the algorithms in the algorithms library do not guarantee a particular order of execution. For such algorithms, take care to ensure any functions you pass in do not assume a particular ordering, as the order of invocation may not be the same on every compiler.

The following algorithms do guarantee sequential execution: `std::for_each`, `std::copy`, `std::copy_backward`, `std::move`, and `std::move_backward`.

!!! success "最佳实践"

	Unless otherwise specified, do not assume that standard library algorithms will execute in a particular sequence. `std::for_each`, `std::copy`, `std::copy_backward`, `std::move`, and `std::move_backward` have sequential guarantees.

## C++20 中的范围

Having to explicitly pass `arr.begin()` and `arr.end()` to every algorithm is a bit annoying. But fear not -- C++20 adds _ranges_, which allow us to simply pass `arr`. This will make our code even shorter and more readable.

## 结论

The algorithms library has a ton of useful functionality that can make your code simpler and more robust. We only cover a small subset in this lesson, but because most of these functions work very similarly, once you know how a few work, you can make use of most of them.

!!! success "最佳实践"

	Favor using functions from the algorithms library over writing your own functionality to do the same thing