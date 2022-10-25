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
---

??? note "关键点速记"

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

!!! success "最佳实践"

	=如果你需要为相同的资源创建额外的 `std::shared_ptr` ，请从已有的 `std::shared_ptr` 复制一份。
	
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

Unlike std::unique_ptr, which uses a single pointer internally, std::shared_ptr uses two pointers internally. One pointer points at the resource being managed. The other points at a “control block”, which is a dynamically allocated object that tracks of a bunch of stuff, including how many std::shared_ptr are pointing at the resource. When a std::shared_ptr is created via a std::shared_ptr constructor, the memory for the managed object (which is usually passed in) and control block (which the constructor creates) are allocated separately. However, when using std::make_shared(), this can be optimized into a single memory allocation, which leads to better performance.

This also explains why independently creating two std::shared_ptr pointed to the same resource gets us into trouble. Each std::shared_ptr will have one pointer pointing at the resource. However, each std::shared_ptr will independently allocate its own control block, which will indicate that it is the only pointer owning that resource. Thus, when that std::shared_ptr goes out of scope, it will deallocate the resource, not realizing there are other std::shared_ptr also trying to manage that resource.

However, when a std::shared_ptr is cloned using copy assignment, the data in the control block can be appropriately updated to indicate that there are now additional std::shared_ptr co-managing the resource.

Shared pointers can be created from unique pointers

A std::unique_ptr can be converted into a std::shared_ptr via a special std::shared_ptr constructor that accepts a std::unique_ptr r-value. The contents of the std::unique_ptr will be moved to the std::shared_ptr.

However, std::shared_ptr can not be safely converted to a std::unique_ptr. This means that if you’re creating a function that is going to return a smart pointer, you’re better off returning a std::unique_ptr and assigning it to a std::shared_ptr if and when that’s appropriate.

The perils of std::shared_ptr

std::shared_ptr has some of the same challenges as std::unique_ptr -- if the std::shared_ptr is not properly disposed of (either because it was dynamically allocated and never deleted, or it was part of an object that was dynamically allocated and never deleted) then the resource it is managing won’t be deallocated either. With std::unique_ptr, you only have to worry about one smart pointer being properly disposed of. With std::shared_ptr, you have to worry about them all. If any of the std::shared_ptr managing a resource are not properly destroyed, the resource will not be deallocated properly.

std::shared_ptr and arrays

In C++17 and earlier, std::shared_ptr does not have proper support for managing arrays, and should not be used to manage a C-style array. As of C++20, std::shared_ptr does have support for arrays.

Conclusion

std::shared_ptr is designed for the case where you need multiple smart pointers co-managing the same resource. The resource will be deallocated when the last std::shared_ptr managing the resource is destroyed.