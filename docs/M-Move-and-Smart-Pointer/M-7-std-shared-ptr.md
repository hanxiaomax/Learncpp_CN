---
title: M.7 — std::shared_ptr
alias: M.7 — std::shared_ptr
origin: /stdshared_ptr/
origin_title: "M.7 — std::shared_ptr"
time: 2022-9-16
type: translation
tags:
- shared_ptr
- C++11
- C++14
- C++17
- C++20
---

??? note "Key Takeaway"

	- 如果你需要为相同的资源创建额外的 `std::shared_ptr` ，请从已有的 `std::shared_ptr` 复制一份。


`std::unique_ptr` 被设计出来独占它所管理的资源，与此不同的是 `std::shared_ptr` 则是为了解决多个指针共同管理同一个资源的情况。

这也意味着，多个 `std::shared_ptr` 指向同一个资源是可以的。`std::shared_ptr`内部会自动追踪当前共享该资源的 `std::shared_ptr` 的个数。只有还有一个`std::shared_ptr` 还指向资源，该资源就不会被释放，即使任意一个`std::shared_ptr` 被销毁。当最后一个指向该资源的 `std::shared_ptr` 离开作用域时（或不再指向该资源），资源才会被释放。

和 `std::unique_ptr` 一样`std::shared_ptr` 也被定义在 `<memory>` 头文件中。

```cpp
#include <iostream>
#include <memory> // for std::shared_ptr

class Resource
{
public:
	Resource() { std::cout << "Resource acquired\n"; }
	~Resource() { std::cout << "Resource destroyed\n"; }
};

int main()
{
	// 分配一个 Resource 对象并让 std::shared_ptr 拥有它
	Resource* res { new Resource };
	std::shared_ptr<Resource> ptr1{ res };
	{
		std::shared_ptr<Resource> ptr2 { ptr1 }; // 创建另外一个 std::shared_ptr 也指向该资源

		std::cout << "Killing one shared pointer\n";
	} // ptr2 离开作用域，什么都没有发生

	std::cout << "Killing another shared pointer\n";

	return 0;
} // ptr1 离开作用域，资源被释放
```


打印：

```
Resource acquired
Killing one shared pointer
Killing another shared pointer
Resource destroyed
```

在上面的例子中，我们首先创建了一个动态  `Resource` 对象，然后将 `std::shared_ptr`类型的 `ptr1`指向它，对资源进行管理。在嵌套的语句块中，我们通过拷贝构造函数创建了第二个 `std::shared_ptr` (`ptr2`)也指向同一个 `Resource`。当 `ptr2` 离开作用域时，`Resource` 并没有被释放，因为`ptr1`仍然指向该资源。当`ptr1`离开作用域时，`ptr1`会意识到此时没有 `std::shared_ptr` 管理该资源了，所以它会释放 `Resource`。

注意，我们是从第一个指针创建的第二个指针，这一点非常重要，考虑下面的代码：

```cpp
#include <iostream>
#include <memory> // for std::shared_ptr

class Resource
{
public:
	Resource() { std::cout << "Resource acquired\n"; }
	~Resource() { std::cout << "Resource destroyed\n"; }
};

int main()
{
	Resource* res { new Resource };
	std::shared_ptr<Resource> ptr1 { res };
	{
		std::shared_ptr<Resource> ptr2 { res }; // 直接通过res创建 ptr2

		std::cout << "Killing one shared pointer\n";
	} // ptr2 离开作用域 Resource 被销毁

	std::cout << "Killing another shared pointer\n";

	return 0;
} // ptr1 离开作用域，Resource 再次被销毁
```

程序输出：

```
Resource acquired
Killing one shared pointer
Resource destroyed
Killing another shared pointer
Resource destroyed
```

紧接着就崩溃了（至少在笔者的机器上会崩溃）。

和上一个程序不同的是，这里创建的两个 `std::shared_ptr` 是相互独立的。其结果就是它们并不知道对方和自己指向了同一个 `Resource`，它们也互相不知道对方的存在。当 `ptr2` 离开作用域时，它认为只有自己在管理该资源，所以就会释放它。而当`ptr1`离开作用域时，它也认为只有自己在管理该资源，所以会再次释放。问题就此发生了！

幸好，这个问题很容易避免：如果你需要为一个资源再创建一个 `std::shared_ptr`，请从一个已经存在的 `std::shared_ptr` 克隆。

> [!success] "最佳实践"
> 如果你需要为相同的资源创建额外的 `std::shared_ptr` ，请从已有的 `std::shared_ptr` 复制一份。
	
## `std::make_shared`

类似C++14中的 `std::make_unique()`可以用来创建 `std::unique_ptr`，`std::make_shared()` 也可以（应该）被用来创建 `std::shared_ptr`。`std::make_shared()` 可以在 C++11 中使用。

这个例子使用 `std::make_shared()` 对原来的程序进行了修改：

```cpp
#include <iostream>
#include <memory> // for std::shared_ptr

class Resource
{
public:
	Resource() { std::cout << "Resource acquired\n"; }
	~Resource() { std::cout << "Resource destroyed\n"; }
};

int main()
{
	// 分配一个 Resource 对象并将其交给 std::shared_ptr 管理
	auto ptr1 { std::make_shared<Resource>() };
	{
		auto ptr2 { ptr1 }; // 复制 ptr1 创建 ptr2

		std::cout << "Killing one shared pointer\n";
	} // ptr2 离开作用域但是什么都没有发生

	std::cout << "Killing another shared pointer\n";

	return 0;
} // ptr1 离开作用域，资源被销毁
```


使用 `std::make_shared()` 的理由和使用 `std::make_unique()`的理由类似—— `std::make_shared()`更简洁也更安全(使用该方法的情况下，不可能创建两个指向头一个资源的 `std::shared_ptr` )。`std::make_shared()` 效率也更高，它会跟踪指向特定资源的指针的个数。

## `std::shared_ptr` 内幕

和 `std::unique_ptr`内部使用了一个指针不同，==`std::shared_ptr` 内部使用了两个指针。其中一个指针指向被管理的资源。另外一个指针则指向一个“控制块”，控制块是一个动态分配的对象，用于追踪一系列的信息，其中就包括有多少 `std::shared_ptr` 指向了该对象==。当 `std::shared_ptr` 通过 `std::shared_ptr`构造函数创建时，被管理对象的内存（通常是传入的）和控制块（通常由构造函数创建）的内存会被分别分配。 但是，当使用 `std::make_shared()` 创建时，两个内存的分配可以被优化为一次内存分配，从而提升性能。

这也解释了为什么分配创建两个指向相同资源的 `std::shared_ptr` 时会有问题。每个 `std::shared_ptr` 都会有一个指向该资源的指针，但同时，每个 `std::shared_ptr` 也都会独立分配自己的控制块，因此控制块中都只会显示有一个指针指向被管理的资源。当 `std::shared_ptr` 离开作用域时，它就会释放资源，而不会意识到还有其他的 `std::shared_ptr` 也在管理着该资源。

但是，当 `std::shared_ptr` 通过[[copy-assignment-operator|拷贝赋值运算符]]被创建时，控制块会被正确地更新，使其能够显示又有另外一个 `std::shared_ptr` 开始管理这个资源了。

##  `std::shared_ptr` 可以通过 `std::unique_ptr`  创建

`std::unique_ptr` 可以通过特殊的构造函数（接受一个`std::unique_ptr`右值）被转换为 `std::shared_ptr`。`std::unique_ptr` 的内容会被移动到 `std::shared_ptr`。

但是，`std::shared_ptr` 并不能被安全地转换为 `std::unique_ptr`。这意味着当你创建的函数需要返回一个智能指针时，所以你最好返回 `std::unique_ptr` 并将其赋值给`std::shared_ptr` 。

## `std::shared_ptr` 的陷阱

`std::shared_ptr` 也存在`std::unique_ptr`所具有的一些问题——如果`std::shared_ptr` 没有被正常地销毁（可能是因为动态内存没有被释放或部分对象没有被释放）则其管理的资源也不会被释放。使用 `std::unique_ptr` 时，你只需要关心一个智能指针是否被正常的销毁。但是在使用`std::shared_ptr`时，你需要关注管理该对象的所有指针。如果它们中任何一个没有被销毁，则资源也不会被正常销毁。

## `std::shared_ptr` 和数组

在 C++17 及之前的版本中，`std::shared_ptr` 并不支持管理数组，而且也不应该被用来管理C语言风格的数组。在 C++20 中 `std::shared_ptr` 已经可以支持数组了。

## 小结

设计 `std::shared_ptr` 的初衷，是为了支持多个指针能够共同管理一个资源。当最后一个 `std::shared_ptr` 被销毁时，被管理的资源也就会被销毁了。