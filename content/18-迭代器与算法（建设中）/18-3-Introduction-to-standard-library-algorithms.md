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

> [!note] "Key Takeaway"
> - `<algorithms>`中提供了很多好用的算法，用于对容器进行查找、搜索和计数。
> - [`std::find`](https://en.cppreference.com/w/cpp/algorithm/find) 函数用于查找某个值在元素中第一次出现的位置。`std::find` 有三个参数：序列中起始元素的迭代器、终点元素的迭代器、需要搜索的值。该函数会返回指向目标元素的迭代器（如果找到的话），或者指向容器的末尾（如果没找的话）。
> - [`std::find_if`](https://en.cppreference.com/w/cpp/algorithm/find)在容器中查找是否有一个满足某种条件的值（例如字符串中是否包含某个特定的子串）
> - [`std::count`](https://en.cppreference.com/w/cpp/algorithm/count) 和 `std::count_if` 用于搜索满足某个条件的元素，并对其出现次数进行统计。
> - [`std::sort`](https://en.cppreference.com/w/cpp/algorithm/sort) 默认对数组进行升序排序，但是可以接受第三个参数，定义排序规则
> - [`std::for_each`](https://en.cppreference.com/w/cpp/algorithm/for_each) 接受一个列表作为输入，然后对列表中的每个元素应用一个自定义的函数。支持并行处理。


新手程序员可能会画上大量的时间来编写循环代码处理很多简单的任务，例如排序、计数或者是搜索数组。这些循环可能很容易带来问题，一方面本身编写数组循环就容易产生问题，另外一方面可维护性也很不好，因为循环代码通常比较难以理解。

因为搜索、统计和排序是非常常见的操作，所以C++标准库为此提供了非常多的函数，以便你使用寥寥几句代码就可以完成这些任务。不仅如此，标准库的函数久经检验、高效、可以配合多种不同类型的容器使用，而且它们中多少都支持并行（使用多个CPU线程同时工作以便更快速的完成任务）。

标准算法库提供的功能大体可以分为以下三类：

-   查验类（Inspectors）—— 用于查看（不修改）容器中的数据。包括搜索和统计。
-   修改类（Mutators）—— 用于修改容器中的数据。例如排序和洗牌。
-   辅助类（Facilitators）—— 用于基于数据生成结果。例如数值相乘或者确定元素对的排序顺序。

这些算法都被定义在 [algorithms](https://en.cppreference.com/w/cpp/algorithm) 库中。在本节课中，我们会介绍其中最常用的一些算法——但是实际上该算法库提供的算法远远不止这些，强烈建议你点击链接去到参考手册，看看它的全部内容。

注意：所有这些算法都使用了[[iterator|迭代器]]，如果你还不熟悉迭代器的话，再去学习一下[[18-2-Introduction-to-iterators|11.18 — 迭代器简介]]吧。

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

`std::find_if` 函数的工作方式和`std::find`很类似，但是我们不需要传递一个具体的值，而是传递一个[[callable-object|可调用对象]]，例如函数指针（或者[[20-6-introduction-to-lambdas-anonymous-functions|lambda表达式]]）。
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

我们曾使用 [`std::sort`](https://en.cppreference.com/w/cpp/algorithm/sort) 对数组进行升序排序，但实际上 `std::sort` 还可以做很多事。一个版本的 `std::sort` 可以接受第三个参数，使我们可以通过一个函数定义如何排序。该函数需要接受两个参数用于比较，如果第一个数应该被排在第二个数之前，应该返回`true`。默认情况下，`std::sort` 会按照升序进行排序。

下面，我们使用 `std::sort` 对数组进行降序排序（通过自定义比较函数`greater`实现）：


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

同样，我们不用自己编写循环，只需几行代码就可以对数组进行排序!

我们的`greater`函数需要两个参数，但我们没有传递给它任何参数，那么它们从何而来呢?当我们使用一个没有圆括号`()`的函数时，它只是一个函数指针，而不是一个函数调用。你可能还记得，当我们试图打印一个没有括号的函数时，`std::cout` 输出的是"1"。`std::sort` 会使用这个指针调用函数并将数组中的两个元素作为实参。我们不知道哪些元素会被`greater`使用，这取决于底层的排序算法。我们将在后面的章节中详细讨论函数指针。


> [!tip] "小贴士"
> 因为降序排序也非常常见，所以C++提供了一个自定义类型(`std::greater`)用于降序排序(它定义在[functional](https://en.cppreference.com/w/cpp/header/functional)头文件中)。在上面的例子中，我们可以替换：
> 
> ```cpp
> std::sort(arr.begin(), arr.end(), greater); // 调用自定义的 greater 函数
> ```
> 为
> 
> ```cpp
> std::sort(arr.begin(), arr.end(), std::greater{}); // 使用标准库的 greater 比较函数
> // 在 C++17 之前，我们可以指定 std::greater 使用的元素类型
> std::sort(arr.begin(), arr.end(), std::greater<int>{}); // 使用标准库的 greater 比较函数
> ```
> 注意，`std::greater{}` 需要使用大括号初始化，因为它并不是一个可调用的函数。它是一个类型，为了使用它，我们必须将其实例化为一个对象。花括号初始化再这里会实例化一个匿名对象（最终会被传递给`std::sort`）。


> [!info] "扩展阅读"
> 这里我们详细介绍一下`std::sort`是如何使用比较函数的。首先，我们需要修改一下[[18-1-Sorting-an-array-using-selection-sort|11.4 - 数组排序之选择排序]]中实现的选择排序算法。
> ```cpp
> #include <iostream>
> #include <iterator>
> #include <utility>
> 
> void sort(int* begin, int* end)
> {
>     for (auto startElement{ begin }; startElement != end; ++startElement)
>     {
>         auto smallestElement{ startElement };
> 
>         // std::next returns a pointer to the next element, just like (startElement + 1) would.
>         for (auto currentElement{ std::next(startElement) };currentElement != end; ++currentElement)
>         {
>             if (*currentElement < *smallestElement)
>             {
>                 smallestElement = currentElement;
>             }
>         }
> 
>         std::swap(*startElement, *smallestElement);
>     }
> }
> 
> int main()
> {
>     int array[]{ 2, 1, 9, 4, 5 };
> 
>     sort(std::begin(array), std::end(array));
> 
>     for (auto i : array)
>     {
>         std::cout << i << ' ';
>     }
> 
>     std::cout << '\n';
> 
>     return 0;
> }
> ```
> 到这里还没有任何新东西，`sort`也总是对元素进行从低到高的排序。为了添加比较函数，我们需要使用一个新的类型 `std::function<bool(int, int)>` 用于保存一个2个整型参数且返回布尔类型的函数。你可以暂时将其理解为某种黑科技，我们稍后会在[第十二章](https://www.learncpp.com/#Chapter12)进行详细介绍。
> ```cpp
> void sort(int* begin, int* end, std::function<bool(int, int)> compare)
> ```
> 我们现在可以将一个`greater`函数传递给`sort`，但是`sort`又应该如何使用它呢？我们需要将下面代码
> 
> ```cpp
> if (*currentElement < *smallestElement)
> ```
> 
> 替换为：
> 
> ```cpp
> if (compare(*currentElement, *smallestElement))
> ```
> 接下来，`sort` 的调用者就可以决定如何比较函数。
> ```cpp
> #include <functional> // std::function
> #include <iostream>
> #include <iterator>
> #include <utility>
> 
> // sort accepts a comparison function
> void sort(int* begin, int* end, std::function<bool(int, int)> compare)
> {
>     for (auto startElement{ begin }; startElement != end; ++startElement)
>     {
>         auto smallestElement{ startElement };
> 
>         for (auto currentElement{ std::next(startElement) }; currentElement != end; ++currentElement)
>         {
>             // the comparison function is used to check if the current element should be ordered
>             // before the currently "smallest" element.
>             if (compare(*currentElement, *smallestElement))
>             {
>                 smallestElement = currentElement;
>             }
>         }
> 
>         std::swap(*startElement, *smallestElement);
>     }
> }
> 
> int main()
> {
>     int array[]{ 2, 1, 9, 4, 5 };
> 
>     // use std::greater to sort in descending order
>     // (We have to use the global namespace selector to prevent a collision
>     // between our sort function and std::sort.)
>     ::sort(std::begin(array), std::end(array), std::greater{});
> 
>     for (auto i : array)
>     {
>         std::cout << i << ' ';
>     }
> 
>     std::cout << '\n';
> 
>     return 0;
> }
> ```
	

## 使用 `std::for_each` 对容器中的每个元素进行操作

[`std::for_each`](https://en.cppreference.com/w/cpp/algorithm/for_each) 接受一个列表作为输入，然后对列表中的每个元素应用一个自定义的函数。当我们需要对列表中的每个元素都进行相同的操作时这就非常有用，

在下面这个例子中，我们使用 `std::for_each` 函数将数组中的每个元素都翻倍：

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

上述功能在新手程序员看来，似乎没什么用，因为相同的操作完全可以使用一个[[range-based-for-loops|基于范围的for循环]]来完成，而且代码会更简短。但是 `std::for_each` 有它的优势。让我们比较一下两种方式。

```cpp
std::ranges::for_each(arr, doubleNumber); // 从 C++20开始，我们不必再使用 begin() 和 end().
// std::for_each(arr.begin(), arr.end(), doubleNumber); // 在 C++20 之前的形式

for (auto& i : arr)
{
    doubleNumber(i);
}
```


使用 `std::for_each` 时，程序的目的是非常清晰的——对`arr`中的每个元素调用 `doubleNumber`。 在for循环的例子中，我们必须添加一个新的变量`i`，在程序员疲惫或者分心的时候，这可能会带来一些问题。一方面，如果我们不使用auto的话，此处会发生[[implicit-type-conversion|隐式类型转换]]。我们也可能会忘记使用`&`，这样的话 `doubleNumber` 函数将无法修改数组元素。我们还可能会误将其他变量传递给 `doubleNumber`。而这些问题在使用 `std::for_each` 时都不会发生。

不仅如此，`std::for_each` 还可以跳过第一个元素，例如 [`std::next`](https://en.cppreference.com/w/cpp/iterator/next) 就可以实现该功能。

```cpp
std::for_each(std::next(arr.begin()), arr.end(), doubleNumber);
// Now arr is [1, 4, 6, 8]. The first element wasn't doubled.
```

这在[[range-based-for-loops|基于范围的for循环]]中是无法实现的。

和很多算法一样，`std::for_each` 也可以通过并行的方式来加速处理，这在应对大型项目或大数据时效率要比[[range-based-for-loops|基于范围的for循环]]高得多。


## 执行顺序

注意，算法库中的大多数算法都不保证特定的执行顺序。对于这样的算法，请注意确保传入的任何函数都不依赖某种顺序执行，因为其在每个编译器上调用的顺序可能不相同。

下面这些函数是可以保证执行顺序的：`std::for_each`、`std::copy`、`std::copy_backward`、 `std::move` 和 `std::move_backward`。

> [!success] "最佳实践"
> 除非有特殊说明，否则不要假设标准库中的算法具有特定的执行顺序。`std::for_each`, `std::copy`, `std::copy_backward`, `std::move`, and `std::move_backward` 是顺序执行的。

## C++20 中的范围

在使用算法时总是要传入 `arr.begin()` 和 `arr.end()` 其实挺烦人的。不过在C++20中，就不需要这样做了，直接使用`arr`即可。这无疑可以使代码更加简洁。

## 结论

算法库有大量有用的功能，可以使你的代码更简单、更健壮。在这一课中，我们只涉及一个很小的子集，但是因为这些函数中的大多数工作方式非常相似，一旦你知道了其中一些函数是如何工作的，你就可以使用它们中的大多数。

> [!success] "最佳实践"
> 建议使用算法库中的函数，而不是编写自己的函数来完成相同的任务
