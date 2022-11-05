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
	


新手程序员可能会画上大量的时间来编写循环代码处理很多简单的任务，例如排序、计数或者是搜索数组。这些循环可能很容易带来问题，一方面本身编写数组循环就容易产生问题，另外一方面可维护性也很不好，因为循环代码通常比较难以理解。

因为搜索、统计和排序是非常常见的操作，所以C++标准库为此提供了非常多的函数，以便你使用寥寥几句代码就可以完成这些任务。不仅如此，标准库的函数久经检验、高效、可以配合多种不同类型的容器使用，而且它们中多少都支持并行（使用多个CPU线程同时工作以便更快速的完成任务）。

标准算法库提供的功能大体可以分为以下三类：

-   查验类（Inspectors）——用于查看（不修改）容器中的数据。包括搜索和统计。
-   Mutators -- Used to modify data in a container. Examples include sorting and shuffling.
-   Facilitators -- Used to generate a result based on values of the data members. Examples include objects that multiply values, or objects that determine what order pairs of elements should be sorted in.

These algorithms live in the [algorithms](https://en.cppreference.com/w/cpp/algorithm) library. In this lesson, we’ll explore some of the more common algorithms -- but there are many more, and we encourage you to read through the linked reference to see everything that’s available!

Note: All of these make use of iterators, so if you’re not familiar with basic iterators, please review lesson [[11-18-Introduction-to-iterators|11.18 — 迭代器简介]]。

## Using `std::find` to find an element by value 

[`std::find`](https://en.cppreference.com/w/cpp/algorithm/find) searches for the first occurrence of a value in a container. `std::find` takes 3 parameters: an iterator to the starting element in the sequence, an iterator to the ending element in the sequence, and a value to search for. It returns an iterator pointing to the element (if it is found) or the end of the container (if the element is not found).

For example:

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

    // Input validation omitted

    // std::find returns an iterator pointing to the found element (or the end of the container)
    // we'll store it in a variable, using type inference to deduce the type of
    // the iterator (since we don't care)
    auto found{ std::find(arr.begin(), arr.end(), search) };

    // Algorithms that don't find what they were looking for return the end iterator.
    // We can access it by using the end() member function.
    if (found == arr.end())
    {
        std::cout << "Could not find " << search << '\n';
    }
    else
    {
        // Override the found element.
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

COPY

Sample run when the element is found

```
Enter a value to search for and replace with: 5 234
13 90 99 234 40 80
```
Sample run when the element isn’t found

```
Enter a value to search for and replace with: 0 234
Could not find 0
13 90 99 5 40 80
```

## Using `std::find_if` to find an element that matches some condition

Sometimes we want to see if there is a value in a container that matches some condition (e.g. a string that contains a specific substring) rather than an exact value. In such cases, `std::find_if` is perfect.

The `std::find_if` function works similarly to `std::find`, but instead of passing in a specific value to search for, we pass in a callable object, such as a function pointer (or a lambda, which we’ll cover later). For each element being iterated over, `std::find_if` will call this function (passing the element as an argument to the function), and the function can return `true` if a match is found, or `false` otherwise.

Here’s an example where we use `std::find_if` to check if any elements contain the substring “nut”:

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

COPY

Output

```
Found walnut
```

If you were to write the above example by hand, you’d need at least three loops (one to loop through the array, and two to match the substring). The standard library functions allow us to do the same thing in just a few lines of code!

## Using `std::count` and `std::count_if` to count how many occurrences there are 

[`std::count`](https://en.cppreference.com/w/cpp/algorithm/count) and `std::count_if` search for all occurrences of an element or an element fulfilling a condition.

In the following example, we’ll count how many elements contain the substring “nut”:

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

COPY

Output

```
Counted 2 nut(s)
```

## Using `std::sort` to custom sort 

We previously used [`std::sort`](https://en.cppreference.com/w/cpp/algorithm/sort) to sort an array in ascending order, but std::sort can do more than that. There’s a version of `std::sort` that takes a function as its third parameter that allows us to sort however we like. The function takes two parameters to compare, and returns true if the first argument should be ordered before the second. By default, `std::sort` sorts the elements in ascending order.

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

COPY

Output

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
	
	COPY

## Using std::for_each to do something to all elements of a container [](https://www.learncpp.com/cpp-tutorial/introduction-to-standard-library-algorithms/#std_for_each)

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

COPY

Output

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

COPY

This isn’t possible with a range-based for-loop.

Like many algorithms, `std::for_each` can be parallelized to achieve faster processing, making it better suited for large projects and big data than a range-based for-loop.

## Order of execution

Note that most of the algorithms in the algorithms library do not guarantee a particular order of execution. For such algorithms, take care to ensure any functions you pass in do not assume a particular ordering, as the order of invocation may not be the same on every compiler.

The following algorithms do guarantee sequential execution: `std::for_each`, `std::copy`, `std::copy_backward`, `std::move`, and `std::move_backward`.

!!! success "最佳实践"

	Unless otherwise specified, do not assume that standard library algorithms will execute in a particular sequence. `std::for_each`, `std::copy`, `std::copy_backward`, `std::move`, and `std::move_backward` have sequential guarantees.

## Ranges in C++20

Having to explicitly pass `arr.begin()` and `arr.end()` to every algorithm is a bit annoying. But fear not -- C++20 adds _ranges_, which allow us to simply pass `arr`. This will make our code even shorter and more readable.

## Conclusion

The algorithms library has a ton of useful functionality that can make your code simpler and more robust. We only cover a small subset in this lesson, but because most of these functions work very similarly, once you know how a few work, you can make use of most of them.

!!! success "最佳实践"

	Favor using functions from the algorithms library over writing your own functionality to do the same thing