---
title: 21.2 - STL容器
alias: 21.2 - STL容器
origin: /stl-containers-overview/
origin_title: "21.2 — STL containers overview"
time: 2022-7-23
type: translation
tags:
- stl
- containers
---

??? note "关键点速记"
	

STL库中最有用的功能要算是STL容器类了。如果你需要快速复习一下什么是容器类，请参考 [[16-6-container-classes|16.6 - 容器类]]。

STL 提供了很多不同场合使用的[[container-class|容器类]]。通常，这些容器类可以分为三个大类：[[Sequence-containers|顺序容器]]，[[Associative-containers|关联容器]] 和[[container-adapter|容器适配器]] 。

## 顺序容器

顺序容器是指那些在容器中按顺序存放元素的容器类。顺序容器的一大特点就是你可以决定在哪个位置插入元素。最常见的顺序容器的例子就是数组：如果你需要在数组的某个位置插入元素，那么该元素一定会被插入到这个位置。

对于C++11来说，STL包含了6种顺序容器：

- `std::vector`
- `std::deque`
- `std::array`
- `std::list`
- `std::forward_list`
- `std::basic_string`

如果你学过物理的话，你可能会认为vector表示的具有大小和方向的向量。不过，STL中的 vector 可不是向量，它是一个可以根据需要调整大小的动态数组。vector 容器类支持通过下标运算符进行随机访问，也支持像尾部快速插入元素。

下面的代码向 vector 中插入了 6 个数字，并且使用下标运算符依次访问并打印元素。

```cpp
#include <vector>
#include <iostream>

int main()
{

  std::vector<int> vect;
  for (int count=0; count < 6; ++count)
	vect.push_back(10 - count); // insert at end of array

  for (int index=0; index < vect.size(); ++index)
	std::cout << vect[index] << ' ';

  std::cout << '\n';
}
```

程序运行结果：

```
10 9 8 7 6 5
```

`deque` 类（读作deck）是一个双端队列容器类，它使用动态数组实现，支持向前面或者后面插入。

```cpp
#include <iostream>
#include <deque>

int main()
{
  std::deque<int> deq;
  for (int count=0; count < 3; ++count)
  {
	deq.push_back(count); // insert at end of array
	deq.push_front(10 - count); // insert at front of array
  }

  for (int index=0; index < deq.size(); ++index)
	std::cout << deq[index] << ' ';

  std::cout << '\n';
}
```

程序运行结果：

```
8 9 10 0 1 2
```

`list`是一种特殊的顺序容器，称为双向链表。容器中的每个元素都通过指针指向前一个元素和后一个元素。链表只提供了从第一个元素或最后一个元素访问容器的方法——即不支持元素的随机访问。如果你需要访问中间位置的元素，你必须遍历链表以找到你需要访问的元素。链表的优势在于它支持快速插入元素（如果你知道要向哪里插入的话）。通常我们会使用迭代器遍历链表。

我们会在后续的课程中介绍链表和迭代器。

尽管 STL 中的 `string` (和 `wstring`)通常不被看做是一种顺序容器，但从本质上讲它是的。你可以将它看做是元素类型为char或wchar的vector。

## 关联容器

关联容器会在新元素插入时自动排序。默认情况下，关联容器会使用`<`对元素进行比较。

- `set` 是一种用于存放唯一元素的容器，重复的元素是不被允许的。元素会按照它们的值进行排序；
- `multiset` 是一种允许重复元素的集合；
- `map` (也称为关联数组) 是一个包含元素对的集合，称为键值对。其中键用来对数据进行排序和索引，而且键必须是唯一的。其中值是实际数据；
- `multimap`(也称为字典)是一种映射，它允许重复的键。在实际生活中，字典是一种 `multimaps`：键是要查的词，而值则是词的意思。所有的键均是按升序排列的，你可以根据键来查值。有些词有多个含义，这也是为什么字典是一个`multimap`而不是`map`。


## 容器适配器

容器适配器是用于特定用途的特殊预定义容器。容器适配器的有趣之处在于，你可以选择它们使用的[[Sequence-containers|顺序容器]]。

- `stack` 容器支持元素的 LIFO （后入先出）。元素从容器的末端被压入(push)或弹出(pop)。`stack` 默认使用`deque`作为顺序容器（看上去多少有点奇怪，毕竟感觉`vector`更合适），但是你也可以使用`vector`或链表；
- `queue` 容器支持元素的 FIFO（先入先出）。元素从容器的尾部插入，然后从头部弹出。`queue` 默认使用 `deque` 作为顺序容器，但是你也可以使用链表；
- `priority queue` 是一种始终保持元素为排序状态（通过`<`运算符）的队列。当元素被压入优先级队列时，元素会在队列中进行排序。删除时，则从队首移除元素（当前优先级最高的元素）。
