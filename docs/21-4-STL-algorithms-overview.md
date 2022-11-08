---
title: 21.4 - STL算法
alias: 21.4 - STL算法
origin: /stl-algorithms-overview/
origin_title: "21.4 — STL algorithms overview"
time: 2022-7-23
type: translation
tags:
- stl
- containers
---

??? note "关键点速记"

	- 算法都是配合迭代器使用的，返回的结果一般也是迭代器


除了[[container-class|容器类]]和[[iterator|迭代器]]，STL还提供了很多[[generic-algorithm|泛型算法]] 来配合容器类中的元素使用，对它们进行搜索、排序、插入、重排、删除和拷贝。

注意，这些算法都被实现为使用迭代器进行操作的函数。这意味着每个算法都只需要实现一次，就可以配合所有提供迭代器的容器使用（包括你自定义的类）。尽管这些算法非常强大而且可以方便地编写复杂的代码逻辑，但是它也有缺点：某些算法和容器类型的组合可能无法工作，有些可能导致死循环，或者性能极差。所以在使用时需要你自己考虑清楚并承担相应的风险。

STL 提供了非常多的算法——我们只会在此介绍一些非常常见的。剩下的算法会在STL算法章节中进行介绍

使用STL算法，只需要添加algorithm头文件即可。

## `min_element` 和 `max_element`

`std::min_element` 和 `std::max_element` 算法用于查找容器[[container-class|容器类]]中的最大元素和最小元素。`std::iota` 可以生成一组连续的值。

```cpp
#include <algorithm> // std::min_element and std::max_element
#include <iostream>
#include <list>
#include <numeric> // std::iota

int main()
{
    std::list<int> li(6);
    // 使用数字填充 li ，从0开始
    std::iota(li.begin(), li.end(), 0);

    std::cout << *std::min_element(li.begin(), li.end()) << ' '
              << *std::max_element(li.begin(), li.end()) << '\n';

    return 0;
}
```

运行结果：

```
0 5
```

## `find` 和 `list::insert`

在这个例子中，`std::find()` 算法用于在链表中进行查找，然后使用 `list::insert()` 函数向链表中的该位置插入一个新的值。

```cpp
#include <algorithm>
#include <iostream>
#include <list>
#include <numeric>

int main()
{
    std::list<int> li(6);
    std::iota(li.begin(), li.end(), 0);

    // 在链表中找到 3 
    auto it{ std::find(li.begin(), li.end(), 3) };

    // 将 8 插入到 3 的前面
    li.insert(it, 8);

    for (int i : li) // 基于迭代器的for循环
        std::cout << i << ' ';

    std::cout << '\n';

    return 0;
}
```

运行结果为：

```
0 1 2 8 3 4 5
```

如果算法没有找到目标值，它会返回end迭代器。如果我们不确定3是否在`li`中，则最好先通过`std::find` 查找并通过返回的迭代器确认是否找到，然后再使用该迭代器。

```cpp
if (it == li.end())
{
  std::cout << "3 was not found\n";
}
else
{
  // ...
}
```

## `sort` 和 `reverse`

在这个例子中，我们会首先对vector进行排序，然后再将其逆序。

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main()
{
    std::vector<int> vect{ 7, -3, 6, 2, -5, 0, 4 };

    // 排序
    std::sort(vect.begin(), vect.end());

    for (int i : vect)
    {
        std::cout << i << ' ';
    }

    std::cout << '\n';

    // 逆序
    std::reverse(vect.begin(), vect.end());

    for (int i : vect)
    {
        std::cout << i << ' ';
    }

    std::cout << '\n';

    return 0;
}
```

运行结果为：

```
-5 -3 0 2 4 6 7
7 6 4 2 0 -3 -5
```

我们也可以将一个自定义的比较函数作为`std::sort`的第三个参数传入。在`<functional>` 头文件中也提供了不少可以直接使用的此类函数。我们可以将`std::greater` 传入 `std::sort` ，然后不要使用 `std::reverse`。此时 vector 也是从大到小排序的。

==注意 `std::sort()` 不能配合链表使用，链表提供了自己的 `sort()` 成员函数，它的效率要比泛型的排序高的多。==

## 小结

尽管本文只是简单地介绍了STL中提供的一些算法，它足以向你证明配合迭代器和容器使用这些算法是多么的简单。要想讲完剩下的算法，那得需要一整个章节才行呢！