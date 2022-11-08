---
title: 21.3 - STL迭代器
alias: 21.3 - STL迭代器
origin: /stl-iterators-overview/
origin_title: "21.3 — STL iterators overview"
time: 2022-7-23
type: translation
tags:
- stl
- containers
---

??? note "关键点速记"
	


[[iterator|迭代器]]是一个可以遍历[[container-class|容器类]]的对象，使用它遍历容器时，使用者无需知道容器的实现细节。对于很多类来说（尤其是链表或关联容器），迭代器是是访问其元素的首选方式。

迭代器可以被形象地看做是一个指向容器元素的指针，同时它具有一系列被重载的运算符：

-   `Operator*` -- 迭代器的[[dereference-operator|解引用运算符]]，它可以返回迭代器当前所指的元素；
-   `Operator++` -- 将迭代器移动到下一个元素。很多迭代器也提供了`Operator--` 用于将迭代器移动到上一个元素； 
-   `Operator==` 和 `Operator!=` -- 基本的比较运算符，用于比较两个迭代器所指的元素是否相同。如果需要比较两个迭代器所指元素的值是否相同，则需要先对迭代器解引用，然后在比较；
-   `Operator=` -- 为迭代器赋值一个新的位置（一般来说是容器的起点或末尾元素）。如果需要给迭代器所指的元素赋值，则需要先对迭代器解引用然后再赋值。

每个容器都提供了四个基本的成员函数，用于配合赋值号使用：

-   `begin()`：返回一个指向容器起始元素的迭代器；
-   `end()`：返回一个指向容器末尾的迭代器（其前一个元素为容器中最后一个元素）； 
-   `cbegin()` ：返回一个指向容器起始元素的const迭代器；
-   `cend()` ：返回一个指向容器末尾的const迭代器（其前一个元素为容器中最后一个元素）。

虽然`end()` 指向的不是最后一个元素而是其后面一个位置有点奇怪，但其实这么做可以简化循环：迭代可以一直进行，直到迭代器到达 `end()`，此时我们就知道遍历结束了。

最后，所有的容器都提供了（至少）两种类型的迭代器：

-   `container::iterator` ：可以读写的迭代器
-   `container::const_iterator`： 只读迭代器

接下来，让我们看几个使用迭代器的实例吧。

## 遍历 `vector`

```cpp
#include <iostream>
#include <vector>

int main()
{
    std::vector<int> vect;
    for (int count=0; count < 6; ++count)
        vect.push_back(count);

    std::vector<int>::const_iterator it; // 声明一个只读迭代器
    it = vect.cbegin(); // 将迭代器赋值为 vector 的起点
    while (it != vect.cend()) // 如果 it 还没有到达容器的末尾
        {
        std::cout << *it << ' '; // 打印 it 所指的元素
        ++it; // 移动到下一个元素
        }

    std::cout << '\n';
}
```

打印结果为：

```
0 1 2 3 4 5
```


## 遍历列表

遍历列表也是类似的：

```cpp
#include <iostream>
#include <list>

int main()
{

    std::list<int> li;
    for (int count=0; count < 6; ++count)
        li.push_back(count);

    std::list<int>::const_iterator it; // declare an iterator
    it = li.cbegin(); // assign it to the start of the list
    while (it != li.cend()) // while it hasn't reach the end
    {
        std::cout << *it << ' '; // print the value of the element it points to
        ++it; // and iterate to the next element
    }

    std::cout << '\n';
}
```

打印结果为：

```
0 1 2 3 4 5
```

可以看到，尽管 vector 和链表的具体实现截然不同，但是遍历它们的代码却几乎完全一样！


## 遍历集合

在这个例子中，我们首先创建一个包含6个数的集合，然后再使用迭代器依次打印它们：

```cpp
#include <iostream>
#include <set>

int main()
{
    std::set<int> myset;
    myset.insert(7);
    myset.insert(2);
    myset.insert(-6);
    myset.insert(8);
    myset.insert(1);
    myset.insert(-4);

    std::set<int>::const_iterator it; // declare an iterator
    it = myset.cbegin(); // assign it to the start of the set
    while (it != myset.cend()) // while it hasn't reach the end
    {
        std::cout << *it << ' '; // print the value of the element it points to
        ++it; // and iterate to the next element
    }

    std::cout << '\n';
}
```

打印结果为：

```
-6 -4 1 2 7 8
```

从这个例子可以看出，虽然填充集合的方法和填充vector以及链表完全不同，但是使用迭代器遍历它们的方法却是一致的。

## 遍历映射

遍历映射稍微复杂些。`Maps` 和 `multimaps` 需要填充元素对(定义为`std::pair`)。我们可以使用 `make_pair()` 函数很方便的创建元素对。`std::pair` 允许我们通过`first`和`second`两个成员变量访问元素对。`first`是键，`second` 是值。

```cpp
#include <iostream>
#include <map>
#include <string>

int main()
{
	std::map<int, std::string> mymap;
	mymap.insert(std::make_pair(4, "apple"));
	mymap.insert(std::make_pair(2, "orange"));
	mymap.insert(std::make_pair(1, "banana"));
	mymap.insert(std::make_pair(3, "grapes"));
	mymap.insert(std::make_pair(6, "mango"));
	mymap.insert(std::make_pair(5, "peach"));

	auto it{ mymap.cbegin() }; // declare a const iterator and assign to start of vector
	while (it != mymap.cend()) // while it hasn't reach the end
	{
		std::cout << it->first << '=' << it->second << ' '; //  the value of the element it points to
		++it; // and iterate to the next element
	}

	std::cout << '\n';
}
```

打印结果为：

```
1=banana 2=orange 3=grapes 4=apple 5=peach 6=mango
```

可以看到，迭代器能够帮助我们依次遍历容器中的各个元素，我们完全无需操心`map`究竟是如何存储这些元素的！

## 小结

迭代器提供了一种无需知道实现细节就可以轻松遍历[[container-class|容器类]]的方法。结合STL算法和容器类的成员函数，迭代器会是非常强大的工具。在下节课中，你将会看到如何使用迭代器向链表插入元素（链表没有提供下标运算符所以不能直接访问元素）。

还有一件事值得注意：迭代器必须被实现为类的一部分，因为它需要知道类的实现细节。因此，迭代器总是和特定的容器类绑定的。
