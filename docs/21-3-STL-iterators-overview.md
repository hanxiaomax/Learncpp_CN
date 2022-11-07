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
-   `Operator=` -- 为迭代器赋值一个新的位置， the iterator to a new position (typically the start or end of the container’s elements). To assign the value of the element the iterator is pointing at, dereference the iterator first, then use the assign operator.

Each container includes four basic member functions for use with Operator=:

-   `begin()`returns an iterator representing the beginning of the elements in the container.
-   `end()`returns an iterator representing the element just past the end of the elements.
-   `cbegin()` returns a const (read-only) iterator representing the beginning of the elements in the container.
-   `cend()` returns a const (read-only) iterator representing the element just past the end of the elements.

It might seem weird that end() doesn’t point to the last element in the list, but this is done primarily to make looping easy: iterating over the elements can continue until the iterator reaches end(), and then you know you’re done.

Finally, all containers provide (at least) two types of iterators:

-   `container::iterator` provides a read/write iterator
-   `container::const_iterator` provides a read-only iterator

Lets take a look at some examples of using iterators.

## 遍历 `vector`

```cpp
#include <iostream>
#include <vector>

int main()
{
    std::vector<int> vect;
    for (int count=0; count < 6; ++count)
        vect.push_back(count);

    std::vector<int>::const_iterator it; // declare a read-only iterator
    it = vect.cbegin(); // assign it to the start of the vector
    while (it != vect.cend()) // while it hasn't reach the end
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


## 遍历列表

Now let’s do the same thing with a list:

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

Note the code is almost identical to the vector case, even though vectors and lists have almost completely different internal implementations!

## 遍历集合

In the following example, we’re going to create a set from 6 numbers and use an iterator to print the values in the set:

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

Note that although populating the set differs from the way we populate the vector and list, the code used to iterate through the elements of the set was essentially identical.

## 遍历映射

This one is a little trickier. Maps and multimaps take pairs of elements (defined as a std::pair). We use the make_pair() helper function to easily create pairs. std::pair allows access to the elements of the pair via the first and second members. In our map, we use first as the key, and second as the value.

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
		std::cout << it->first << '=' << it->second << ' '; // print the value of the element it points to
		++it; // and iterate to the next element
	}

	std::cout << '\n';
}
```

打印结果为：

```
1=banana 2=orange 3=grapes 4=apple 5=peach 6=mango
```

Notice here how easy iterators make it to step through each of the elements of the container. You don’t have to care at all how map stores its data!

## 小结

Iterators provide an easy way to step through the elements of a container class without having to understand how the container class is implemented. When combined with STL’s algorithms and the member functions of the container classes, iterators become even more powerful. In the next lesson, you’ll see an example of using an iterator to insert elements into a list (which doesn’t provide an overloaded operator[] to access its elements directly).

One point worth noting: Iterators must be implemented on a per-class basis, because the iterator does need to know how a class is implemented. Thus iterators are always tied to specific container classes.