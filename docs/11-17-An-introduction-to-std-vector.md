---
title: 11.17 — 动态数组 std::vector 简介
alias: 11.17 — 动态数组 std::vector 简介
origin: /an-introduction-to-stdvector/
origin_title: "11.17 — An introduction to std::vector"
time: 2022-4-8
type: translation
tags:
- vector
- C++17
---

??? note "关键点速记"
	


在之前的课程中我们介绍了`std::array`，它提供了C++内建固定数组相同的功能，但是更安全也更好用。

类似地，C++ 标准库也提供了相应的功能，使得使用动态数组可以更加安全和易用。这个功能就是 `std::vector`。

不同于`std::array`尽可能仿照固定数组的功能，`std::vector` 则提供了很多数组的额外功能，因此 `std::vector` 也成为了C++中最有用的工具之一。

## `std::vector` 简介

`std::vector` 在C++03中被引入，它提供了[[动态数组]]的功能并且可以自我管理内存的申请和释放。也就是说，你可以在[[runtime|运行时]]创建数组并指定其长度，而不需要使用`new`和`delete`来手动管理内存的申请释放。`std::vector` 位于 `<vector>` 头文件中。

声明一个 `std::vector` 很简单：

```cpp
#include <vector>

// 在声明时无需指定长度
std::vector<int> array;
std::vector<int> array2 = { 9, 7, 5, 3, 1 }; // 使用初始化值列表进行初始化(在C++11之前)
std::vector<int> array3 { 9, 7, 5, 3, 1 }; // 使用统一初始化

//和std::array一样，从C++17开始，类型可以省略
std::vector array4 { 9, 7, 5, 3, 1 }; // deduced to std::vector<int>
```

注意，不论是初始化与否，你都不需要在编译时指定数组长度。这是因为 `std::vector` 可以在需要时自行分配内存。

和 `std::array` 一样，访问数组元素可以使用[[subscripts|下标运算符]]（不进行越界检查）或`at()`函数（进行越界检查）访问：

```cpp
array[6] = 2; // no bounds checking
array.at(7) = 3; // does bounds checking
```


对于上面两种情况，如果你访问超出数组结尾的元素，vector并不会自动调整长度。

在 C++11 中，你可以使用[[initializer-list|初始化值列表]]为 `std::vector` 赋值：

```cpp
array = { 0, 1, 2, 3, 4 }; // okay, array length is now 5
array = { 9, 8, 7 }; // okay, array length is now 3
```

对于这种情况，vector可以根据元素的个数调整其长度。

## 自我清理，避免内存泄漏

当一个vector变量超出作用域时，它会自动释放它所使用的内存(如果有必要)。这不仅方便(因为您不必自己做)，还有助于防止内存泄漏。考虑下面的代码片段：

```cpp
void doSomething(bool earlyExit)
{
    int* array{ new int[5] { 9, 7, 5, 3, 1 } }; // 使用new分配内存

    if (earlyExit)
        return; // 退出函数而不会释放内存

    // do stuff here

    delete[] array; // 并不会被调用
}
```

COPY

如果 `earlyExit` 被设置为 `true` ，则数组的内存不会被释放，会造成内存泄漏。

但是，如果 `array` 是 `std::vector` 的话，就不会出现问题，因为 `array` 会在[[going-out-of-scope|离开作用域]]时自动释放内存(不论函数是否正确退出)。这也说明使用 `std::vector` 比自己管理内存要更加安全。

## Vectors 能够保存其长度信息

不同于内建的动态数组（不知道其指向数组的程度），`std::vector`能够保存其长度。使用 `size()` 函数就可以得知 vector 的长度：

```cpp
#include <iostream>
#include <vector>

void printLength(const std::vector<int>& array)
{
    std::cout << "The length is: " << array.size() << '\n';
}

int main()
{
    std::vector array { 9, 7, 5, 3, 1 };
    printLength(array);

    std::vector<int> empty {};
    printLength(empty);

    return 0;
}
```

输出结果为：

```
The length is: 5
The length is: 0
```

和`std::array`一样，`size()`返回的是`size_type`类型的值 (完整的形式为 `std::vector<int>::size_type`)，它是无符号整型数。

## 调整 vector 大小

调整内置的动态数组的大小是很复杂的，而调整`std::vector`的大小则很简单，调用`resize()`即可：

```cpp
#include <iostream>
#include <vector>

int main()
{
    std::vector array { 0, 1, 2 };
    array.resize(5); // set size to 5

    std::cout << "The length is: " << array.size() << '\n';

    for (int i : array)
        std::cout << i << ' ';

    std::cout << '\n';

    return 0;
}
```

打印：

```
The length is: 5
0 1 2 0 0
```

有两件事需要注意。首先，当调整 vector 的大小时，已经存在的元素会被保存下来。第二，新的元素会被初始化为该类型的默认值（整型是0）。

Vectors 的大小也可以缩小：

```cpp
#include <vector>
#include <iostream>

int main()
{
    std::vector array { 0, 1, 2, 3, 4 };
    array.resize(3); // set length to 3

    std::cout << "The length is: " << array.size() << '\n';

    for (int i : array)
        std::cout << i << ' ';

    std::cout << '\n';

    return 0;
}
```

打印结果：

```
The length is: 3
0 1 2
```

调整vector大小的开销是很大的，因此应该尽量少做。如果你需要一个具有特定数量元素的向量，但在声明时不知道元素的值，你可以创建一个具有默认元素的向量，如下所示：

```cpp
#include <iostream>
#include <vector>

int main()
{
    // 使用直接初始化，创建一个包含5个元素的vector
    // 每个元素都被初始化为0。如果你使用括号初始化的话，则v
    // vector会包含一个元素，值为5
    std::vector<int> array(5);

    std::cout << "The length is: " << array.size() << '\n';

    for (int i : array)
        std::cout << i << ' ';

    std::cout << '\n';

    return 0;
}
```

打印：

```
The length is: 5
0 0 0 0 0
```

!!! tip "小贴士"

	我们会在 [[16-7-std-initializer_list|16.7 - std::initializer_list]] 中介绍[[direct-initialization|直接初始化]]和[[括号初始化]]的不同。经验法则是：对于你不想初始化的列表型类型，使用直接初始化。
		

## 压缩布尔值

`std::vector` 还有另外一个很酷的小特性，它会把8个布尔类型的元素压缩为一个字节！这一切都是在幕后完成的，对你使用 `std::vector`并没有影响。

```cpp
#include <vector>
#include <iostream>

int main()
{
    std::vector<bool> array { true, false, false, true, true };
    std::cout << "The length is: " << array.size() << '\n';

    for (int i : array)
        std::cout << i << ' ';

    std::cout << '\n';

    return 0;
}
```

打印结果：

```
The length is: 5
1 0 0 1 1
```

## 更多内容

注意，本节课只是对 `std::vector`进行简介，在 [[12-3-std-vector-capacity-and-stack-behavior|12.3 - std::vector的容量和类栈行为]]中，我们会介绍它的一些额外的功能，包括长度和容量的区别，并且详细介绍`std::vector` 是如何管理内存的。

## 结论

因为`std::vector`类型是变量可以自己管理内存（有助于避免内存泄漏）并且能够记录自身长度，所以我们推荐在大多数需要使用动态数组的时候，使用`std::vector`。