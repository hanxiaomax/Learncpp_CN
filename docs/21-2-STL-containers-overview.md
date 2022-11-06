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

对于C++11来说，STL包含了6种顺序容器：`std::vector`, `std::deque`, `std::array`, `std::list`, `std::forward_list`, and `std::basic_string`。

- 如果你学过物理的话，你可能会认为vector表示的具有大小和方向的向量。不过，STL中的 vector 可不是向量，它是一个可以根据需要调整大小的动态数组。 you’ve ever taken physics, you probably are thinking of a vector as an entity with both magnitude and direction. The unfortunately named **vector**class in the STL is a dynamic array capable of growing as needed to contain its elements. The vector class allows random access to its elements via operator[], and inserting and removing elements from the end of the vector is generally fast.
   
   The following program inserts 6 numbers into a vector and uses the overloaded `[]` operator to access them in order to print them.

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

COPY

This program produces the result:  
10 9 8 7 6 5

-   The **deque** class (pronounced “deck”) is a double-ended queue class, implemented as a dynamic array that can grow from both ends.

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

COPY

This program produces the result:

8 9 10 0 1 2

-   A **list** is a special type of sequence container called a doubly linked list where each element in the container contains pointers that point at the next and previous elements in the list. Lists only provide access to the start and end of the list -- there is no random access provided. If you want to find a value in the middle, you have to start at one end and “walk the list” until you reach the element you want to find. The advantage of lists is that inserting elements into a list is very fast if you already know where you want to insert them. Generally iterators are used to walk through the list.

We’ll talk more about both linked lists and iterators in future lessons.

-   Although the STL **string** (and wstring) class aren’t generally included as a type of sequence container, they essentially are, as they can be thought of as a vector with data elements of type char (or wchar).

## 关联容器

Associative containers are containers that automatically sort their inputs when those inputs are inserted into the container. By default, associative containers compare elements using operator<.

-   A **set** is a container that stores unique elements, with duplicate elements disallowed. The elements are sorted according to their values.
-   A **multiset** is a set where duplicate elements are allowed.
-   A **map** (also called an associative array) is a set where each element is a pair, called a key/value pair. The key is used for sorting and indexing the data, and must be unique. The value is the actual data.
-   A **multimap** (also called a dictionary) is a map that allows duplicate keys. Real-life dictionaries are multimaps: the key is the word, and the value is the meaning of the word. All the keys are sorted in ascending order, and you can look up the value by key. Some words can have multiple meanings, which is why the dictionary is a multimap rather than a map.

## 容器适配器

Container adapters are special predefined containers that are adapted to specific uses. The interesting part about container adapters is that you can choose which sequence container you want them to use.

-   A **stack** is a container where elements operate in a LIFO (Last In, First Out) context, where elements are inserted (pushed) and removed (popped) from the end of the container. Stacks default to using deque as their default sequence container (which seems odd, since vector seems like a more natural fit), but can use vector or list as well.
-   A **queue** is a container where elements operate in a FIFO (First In, First Out) context, where elements are inserted (pushed) to the back of the container and removed (popped) from the front. Queues default to using deque, but can also use list.
-   A **priority queue** is a type of queue where the elements are kept sorted (via operator<). When elements are pushed, the element is sorted in the queue. Removing an element from the front returns the highest priority item in the priority queue.
