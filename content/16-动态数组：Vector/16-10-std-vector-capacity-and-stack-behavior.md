---
title: 12.3 - std::vector的容量和类栈行为
alias: 12.3 - std::vector的容量和类栈行为
origin: /stdvector-capacity-and-stack-behavior/
origin_title: "12.3 — std::vector capacity and stack behavior"
time: 2022-9-22
type: translation
tags:
- vector
- stack
---

> [!note] "Key Takeaway"


在 [[16-2-An-introduction-to-std-vector|11.17 — 动态数组 std::vector 简介]]中我们介绍了 `std::vector` 以及如何将其当做动态数组使用（可以记录自身长度也可以根据需要调整大小）。

尽管这是 `std::vector` 最常用的功能，`std::vector` 还有一些其他的其他的属性和功能使其在别的方面也很有用。

## 长度和容量

考虑下面的例子：

```cpp
int* array{ new int[10] { 1, 2, 3, 4, 5 } };
```

我们会说这个数组的长度是10，即使我们只使用了分配的元素中的5个。

但是，如果我们只想遍历已经初始化的元素，而保留未使用的元素以备将来扩展呢？在这种情况下，我们需要分别跟踪“使用”了多少元素和分配了多少元素。与只记住其长度的内置数组或`std::array`不同，`std::vector`包含两个独立的属性：长度和容量。在`std::vector`的语境中，**length**是数组中使用的元素数量，而**capacity**是内存中分配的元素数量。

让我们再看一下之前的一个`std::vector`的一个例子:

```cpp
#include <vector>
#include <iostream>

int main()
{
    std::vector array { 0, 1, 2 };
    array.resize(5); // set length to 5

    std::cout << "The length is: " << array.size() << '\n';

    for (auto element: array)
        std::cout << element << ' ';

    return 0;
};
```


```
The length is: 5
0 1 2 0 0
```

在上面的例子中，我们使用了`resize()`函数将vector的长度设置为5。这告诉变量数组我们打算使用数组的前5个元素，所以它应该把这些元素当做活动的。然而，这带来了一个有趣的问题：这个数组的容量是多少?

我们可以通过`capacity()`函数查询`std::vector`的容量：

```cpp
#include <vector>
#include <iostream>

int main()
{
    std::vector array { 0, 1, 2 };
    array.resize(5); // set length to 5

    std::cout << "The length is: " << array.size() << '\n';
    std::cout << "The capacity is: " << array.capacity() << '\n';
}
```

在笔者的电脑上，输出如下：

```
The length is: 5
The capacity is: 5
```

在本例中，`resize()`函数使`std::vector`改变了它的长度和容量。注意，容量保证至少与数组长度一样大(但也可以更大)，否则访问数组末尾的元素将在分配的内存之外！

## 长度和容量——更多细节

为什么要区分长度和容量？vector会在需要的时候重新分配它的内存，但是它希望尽量避免重新分配，因为调整数组的大小计算开销很大。考虑下面代码：

```cpp
#include <vector>
#include <iostream>

int main()
{
  std::vector array{};
  array = { 0, 1, 2, 3, 4 }; // okay, array length = 5
  std::cout << "length: " << array.size() << "  capacity: " << array.capacity() << '\n';

  array = { 9, 8, 7 }; // okay, array length is now 3!
  std::cout << "length: " << array.size() << "  capacity: " << array.capacity() << '\n';

  return 0;
}
```

打印结果：

```
length: 5  capacity: 5
length: 3  capacity: 5
```

注意，虽然我们为vector分配了一个更小的数组，但它并没有重新分配它的内存(容量仍然是5)。它只是更改了它的长度，因此它知道此时只有前3个元素有效。

## 数组下标和 `at()`基于长度而非容量

下标运算符和`at()`函数是基于vector的长度而非容量工作的。对于前例中的array，它的长度是3，容量是5。那么如果我们访问索引4的元素会发生什么呢？结果显然是会访问失败，因为4已经超过了数组的长度。

注意：vector并不会因为下标运算符和`at()`的调用而调整大小！

## `std::vector` 的类栈行为

如果下标操作符和`at()`函数是基于数组长度的，并且容量总是至少与数组长度一样大，为什么还要担心容量呢？虽然`std::vector`可以用作动态数组，但它也可以用作堆栈。为此，我们可以使用3个与栈操作相匹配的函数：

-   `push_back()` ：元素压栈；
-   `back(`) ：返回栈顶元素；
-   `pop_back()` ：从栈中弹出元素。

```cpp
#include <iostream>
#include <vector>

void printStack(const std::vector<int>& stack)
{
	for (auto element : stack)
		std::cout << element << ' ';
	std::cout << "(cap " << stack.capacity() << " length " << stack.size() << ")\n";
}

int main()
{
	std::vector<int> stack{};

	printStack(stack);

	stack.push_back(5); // push_back() 压栈
	printStack(stack);

	stack.push_back(3);
	printStack(stack);

	stack.push_back(2);
	printStack(stack);

	std::cout << "top: " << stack.back() << '\n'; // back() 返回最后一个元素

	stack.pop_back(); // pop_back() 弹出元素
	printStack(stack);

	stack.pop_back();
	printStack(stack);

	stack.pop_back();
	printStack(stack);

	return 0;
}
```

COPY

This prints:

```
(cap 0 length 0)
5 (cap 1 length 1)
5 3 (cap 2 length 2)
5 3 2 (cap 3 length 3)
top: 2
5 3 (cap 3 length 2)
5 (cap 3 length 1)
(cap 3 length 0)
```

和下标运算符和 `at()` 不同，栈操作函数会在需要时调整 `std::vector` 的大小，在这个例子中。vector 的大小被调整了3次(capacity 从 0 到 1， 1 到 2，2 到 3)。

因为调整vector的大小代价很大，所以我们可以使用`reserve()`函数预先告诉vector分配一定量的容量：

```cpp
#include <vector>
#include <iostream>

void printStack(const std::vector<int>& stack)
{
	for (auto element : stack)
		std::cout << element << ' ';
	std::cout << "(cap " << stack.capacity() << " length " << stack.size() << ")\n";
}

int main()
{
	std::vector<int> stack{};

	stack.reserve(5); // 将容量设置为5

	printStack(stack);

	stack.push_back(5);
	printStack(stack);

	stack.push_back(3);
	printStack(stack);

	stack.push_back(2);
	printStack(stack);

	std::cout << "top: " << stack.back() << '\n';

	stack.pop_back();
	printStack(stack);

	stack.pop_back();
	printStack(stack);

	stack.pop_back();
	printStack(stack);

	return 0;
}
```

程序输出：

```
(cap 5 length 0)
5 (cap 5 length 1)
5 3 (cap 5 length 2)
5 3 2 (cap 5 length 3)
top: 2
5 3 (cap 5 length 2)
5 (cap 5 length 1)
(cap 5 length 0)
```

我们可以看到容量被预设为5，并且在程序的生命周期中没有变化。

## Vectors 可能会分配多余的容量

当调整一个vector的大小时，该vector可能会分配比所需更多的容量。这样做是为了为其他元素提供一些“喘息的空间”，从而最小化所需的调整操作的数量。让我们来看看这个：

```cpp
#include <vector>
#include <iostream>

int main()
{
	std::vector v{ 0, 1, 2, 3, 4 };
	std::cout << "size: " << v.size() << "  cap: " << v.capacity() << '\n';

	v.push_back(5); // add another element
	std::cout << "size: " << v.size() << "  cap: " << v.capacity() << '\n';

	return 0;
}
```

在笔者机器上打印：

```
size: 5  cap: 5
size: 6  cap: 7
```

当我们使用`push_back()`添加一个新元素时，我们的向量只需要6个元素的空间，但分配了7个空间。这样做的目的是，如果我们要`push_back()`另一个元素，它不需要立即调整大小。

是否、何时以及分配多少额外的容量取决于编译器实现者。