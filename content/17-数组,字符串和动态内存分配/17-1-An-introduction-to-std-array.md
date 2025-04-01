---
title: 11.16 — 固定数组 std::array 简介
alias: 11.16 — 固定数组 std::array 简介
origin: /an-introduction-to-stdarray/
origin_title: "11.16 — An introduction to std::array"
time: 2022-9-15
type: translation
tags:
- std::array
- C++17
---

> [!note] "Key Takeaway"


在上节课中，我们讨论了[[fixed-array|固定数组]]和[[dynamic-array|动态数组]]。尽管这两种数组都是C++自带的，但是它们缺点可不少：固定数组会退化为指针，退化和将会丢失数组的长度信息。动态数组在释放时容易出现问题，而且在重新调整大小时也很难做到不出错。

为了解决这些问题，C++标准库提供了 `std::array` 和`std::vector` 两个容器类，使得数组管理变得更加简单了。我们会在本节课中介绍 `std::array`，然后在下节课中介绍 `std::vector`。

## `std::array`

==`std::array` 实现了固定数组的功能，且在传入函数时不会退化为指针。`std::array` 被定义在 `<array>` 头文件中且位于 `std` [[namespace|命名空间]]内。==

声明`std::array`变量很简单：

```cpp
#include <array>

std::array<int, 3> myArray; // 声明一个长度为3的整型数组
```

和原生的固定数组实现类似，`std::array` 的长度必须在[[compile-time|编译时]]确定。

`std::array` 可以通过[[initializer-list|初始化值列表]]或[[list-initialization|列表初始化]]的方式进行初始化：

```cpp
std::array<int, 5> myArray = { 9, 7, 5, 3, 1 }; // 初始化值列表
std::array<int, 5> myArray2 { 9, 7, 5, 3, 1 }; // 列表初始化
```

和C++自带的固定数组不同的是，在使用 `std::array` 的时候，你不能省略数组的长度，即使提供了初始化值也不行：

```cpp
std::array<int, > myArray { 9, 7, 5, 3, 1 }; // 不合法，必须提供长度
std::array<int> myArray { 9, 7, 5, 3, 1 }; // 不合法，必须提供长度
```


不过，从C++17开始， `std::array` 也支持省略类型和大小了。如果数组被显式地初始化，则类型和大小可以一起被忽略。

```cpp
std::array myArray { 9, 7, 5, 3, 1 }; // 通过类型推断得到 std::array<int, 5>
std::array myArray { 9.7, 7.31 }; // 通过类型推断得到 std::array<double, 2>
```

我们推荐使用上面这种忽略类型和大小的声明方式，除非你的编译器不支持C++17，那么你就必须显式地指定了类型和大小。

```cpp
// std::array myArray { 9, 7, 5, 3, 1 }; // Since C++17
std::array<int, 5> myArray { 9, 7, 5, 3, 1 }; // Before C++17

// std::array myArray { 9.7, 7.31 }; // Since C++17
std::array<double, 2> myArray { 9.7, 7.31 }; // Before C++17
```

在 C++20 中，我们可以指定元素类型，但是忽略数组长度。这么做的时候，创建`std::array`时看起来更像是创建一个C语言风格的数组。我们可以使用 `std::to_array` 来创建数组（指定元素类型但自动推断长度）：

```cpp
auto myArray1 { std::to_array<int, 5>({ 9, 7, 5, 3, 1 }) }; // Specify type and size
auto myArray2 { std::to_array<int>({ 9, 7, 5, 3, 1 }) }; // Specify type only, deduce size
auto myArray3 { std::to_array({ 9, 7, 5, 3, 1 }) }; // Deduce type and size
```


不幸的是，使用 `std::to_array` 创建数组时的开销比直接使用 `std::array` 创建数组开销更大，因为它需要将一个C语言风格的数组的元素拷贝到 `std::array`。出于这个原因，如果需要在循环中多次创建数组时，应该避免使用 `std::to_array` 。

你也可以使用[[initializer-list|初始化值列表]]为数组赋值。

```cpp
std::array<int, 5> myArray;
myArray = { 0, 1, 2, 3, 4 }; // okay
myArray = { 9, 8, 7 }; // okay, elements 3 and 4 are set to zero!
myArray = { 0, 1, 2, 3, 4, 5 }; // not allowed, too many elements in initializer list!
```

恶意使用下标运算符访问 `std::array` 数组中的值：

```cpp
std::cout << myArray[1] << '\n';
myArray[2] = 6;
```

和内置的数组类似，下标运算符并没有实现越界检查。当传入非法索引时，会发生很不好的事情。

`std::array` 还支持另外一种元素访问方式（使用`at()`函数），它会在（[[runtime|运行时]]）进行越界检查：

```cpp
std::array myArray { 9, 7, 5, 3, 1 };
myArray.at(1) = 6; // array element 1 is valid, sets array element 1 to value 6
myArray.at(9) = 10; // array element 9 is invalid, will throw a runtime error
```


在上面的例子中，调用 `myArray.at(1)` 时会确保所以1是合法的。由于1确实是合法索引，所以它会返回对应的元素的引用。我们将6赋值给该引用。不过，当我们调用 `myArray.at(9)` 时就会失败，因为索引9越界了。当越界发生时，`at()`函数会抛出一个异常（具体来说它会抛出一个`std::out_of_range`异常），而不会返回对应的索引。因为需要进行越界检查，所以 `at()` 的速度会比下标运算符慢，但它更安全。

`std::array` 会在[[going-out-of-scope|离开作用域]]时清理自己，所以我们必须进行手动清理。

## 数组大小和排序

`size()` 函数可以用来获取 `std::array` 的长度：

```cpp
std::array myArray { 9.0, 7.2, 5.4, 3.6, 1.8 };
std::cout << "length: " << myArray.size() << '\n';
```

程序打印：

```
length: 5
```

因为 `std::array` 不会在传递给函数时退化为指针，所以 `size()`在函数内部也可以调用：

```cpp
#include <array>
#include <iostream>

void printLength(const std::array<double, 5>& myArray)
{
    std::cout << "length: " << myArray.size() << '\n';
}

int main()
{
    std::array myArray { 9.0, 7.2, 5.4, 3.6, 1.8 };

    printLength(myArray);

    return 0;
}
```


程序打印：

```
length: 5
```

注意，在标准库中 size 一词表示数组的长度——不要把它和 `sizeof()` 搞混了，当对原生的固定数组使用`sizeof`时，返回的是该数组占用的实际内存的大小（元素大小乘以数组长度）。是的，这边命名的一致性保持的不好。

还要注意，当[[pass-by-reference|按引用传递]] `std::array` 时。可以防止编译器创建 `std::array` 的拷贝（有助于提升性能）。

> [!success] "最佳实践"
> 使用按引用传递或按const引用传递的方式将 `std::array` 传入函数。
	
因为`std::array`的长度总是已知的，所以它可以使用[[range-based-for-loops|基于范围的for循环]]来遍历：

```cpp
std::array myArray{ 9, 7, 5, 3, 1 };

for (int element : myArray)
    std::cout << element << ' ';
```

使用 `std::sort` 可以对 `std::array` 进行排序，该函数位于 `<algorithm>` 头文件中：

```cpp
#include <algorithm> // for std::sort
#include <array>
#include <iostream>

int main()
{
    std::array myArray { 7, 3, 1, 9, 5 };
    std::sort(myArray.begin(), myArray.end()); // 从前向后排序
//  std::sort(myArray.rbegin(), myArray.rend()); // 从后向前排序

    for (int element : myArray)
        std::cout << element << ' ';

    std::cout << '\n';

    return 0;
}
```

运行结果：

```
1 3 5 7 9
```

## 向函数传递不同长度的 `std::array` 

对于 `std::array` 来说，元素的类型和数组的长度是数组类型的一部分。因此，当我们使用 `std::array` 作为函数[[parameters|形参]]时，必须指明元素类型和数组长度
：

```cpp
#include <array>
#include <iostream>

void printArray(const std::array<int, 5>& myArray)
{
    for (auto element : myArray)
        std::cout << element << ' ';
    std::cout << '\n';
}

int main()
{
    std::array myArray5{ 9.0, 7.2, 5.4, 3.6, 1.8 }; // type deduced as std::array<double, 5>
    printArray(myArray5); // error: printArray expects a std::array<int, 5>

    return 0;
}
```


这么做的弊端在于，该函数便只能使用特定元素类型和数组长度的数组作为[[arguments|实参]]，但是如果我们希望函数能够处理不同类型元素且长度不同的数组时，应该怎么做呢？难道要创建多个不同的函数来处理吗？这显然会带来很多很多的冗余代码。

幸运地是，C++允许我们使用模板来实现上述功能。==我们可以创建一个模板化函数并将所有的类型信息参数化，C++会根据模板在需要时自动创建“真实”的函数：==

```cpp
#include <array>
#include <cstddef>
#include <iostream>

// printArray is a template function
template <typename T, std::size_t size> // parameterize the element type and size
void printArray(const std::array<T, size>& myArray)
{
    for (auto element : myArray)
        std::cout << element << ' ';
    std::cout << '\n';
}

int main()
{
    std::array myArray5{ 9.0, 7.2, 5.4, 3.6, 1.8 };
    printArray(myArray5);

    std::array myArray7{ 9.0, 7.2, 5.4, 3.6, 1.8, 1.2, 0.7 };
    printArray(myArray7);

    return 0;
}
```

> [!info] "相关内容"
> 函数模板会在 [[11-6-Function-templates|8.13 - 函数模板]] 中介绍。
	

## 基于`size_type` 对 `std::array` 进行人工索引

一个常见问题：下面的代码有什么问题？

```cpp
#include <iostream>
#include <array>

int main()
{
    std::array myArray { 7, 3, 1, 9, 5 };

    // Iterate through the array and print the value of the elements
    for (int i{ 0 }; i < myArray.size(); ++i)
        std::cout << myArray[i] << ' ';

    std::cout << '\n';

    return 0;
}
```

这个问题的答案是：代码中可能会出现 signed/unsigned 不匹配的问题。 `size()` 函数和下标索引使用了一种被称为 `size_type` 的类型，该类型在C++标准中被定义为无符号整型类型。而在上面代码中，循环索引`i` 是一个有符号整型。因此在进行 `i < myArray.size()` 比较时会出现类型不匹配的问题。

有趣的是，`size_type` 还不是一个全局类型（例如，`int`或`std::size_t`），它实际上被定义在`std::array`内部 (C++允许嵌套定义)。这就意味着，当你需要使用`size_type`时，必须添加完整的前缀(可以将 `std::array` 看做是它的命名空间)。在上面的例子中， “size_type” 的完整前缀是 `std::array<int, 5>::size_type`!

所以，上面代码的正确写法应该是这样的：

```cpp
#include <array>
#include <iostream>

int main()
{
    std::array myArray { 7, 3, 1, 9, 5 };

    // std::array<int, 5>::size_type is the return type of size()!
    for (std::array<int, 5>::size_type i{ 0 }; i < myArray.size(); ++i)
        std::cout << myArray[i] << ' ';

    std::cout << '\n';

    return 0;
}
```


可读性并不好。幸运地是，`std::array::size_type` 实际上是 `std::size_t` 的别名，所以我们可以直接使用`std::size_t`：

```cpp
#include <array>
#include <cstddef> // std::size_t
#include <iostream>

int main()
{
    std::array myArray { 7, 3, 1, 9, 5 };

    for (std::size_t i{ 0 }; i < myArray.size(); ++i)
        std::cout << myArray[i] << ' ';

    std::cout << '\n';

    return 0;
}
```


更好的办法是==避免对`std::array` 进行人工索引，而是应该使用[[range-based-for-loops|基于范围的for循环]]或[[iterator|迭代器]]。==

一定要记住，当无符号整型到达它们的最大值后，会产生反转。常见的错误是对一个所有进行递减，到达0后仍然递减则会导致无符号整型反转为最大值。在for循环的课程中你已经见过下面的例子了，这里再复习一下：
```cpp
#include <array>
#include <iostream>

int main()
{
    std::array myArray { 7, 3, 1, 9, 5 };

    // 逆序打印素组
    // 因为i不需要初始化为0所以可以使用auto
    // Bad:
    for (auto i{ myArray.size() - 1 }; i >= 0; --i)
        std::cout << myArray[i] << ' ';

    std::cout << '\n';

    return 0;
}
```


上面的代码会得到一个死循环，当`i`反转的时候，会导致[[undefined-behavior|未定义行为]]。这里实际上存在两个问题，如果`myArray` 是空的，则 `size()`会返回 0 (对于 `std::array` 来说是可以的)，此时 `myArray.size() - 1` 就会反转。另外一个问题在于，不论数组中有多少元素，`i >= 0` 总是为 `true`，因为无符号整型就不可能小于0。

可行的反向for循环应该像下面这样：

```cpp
#include <array>
#include <iostream>

int main()
{
    std::array myArray { 7, 3, 1, 9, 5 };

    // Print the array in reverse order.
    for (auto i{ myArray.size() }; i-- > 0; )
        std::cout << myArray[i] << ' ';

    std::cout << '\n';

    return 0;
}
```

我们在条件语句中，使用后缀`--`对索引进行递减。该条件判断会在每次迭代前进行，包括第一次迭代。在第一次迭代时，`i` 是 `myArray.size() - 1`，因为`i`在条件中递减。当`i`等于0时，即将发生反转，但是此时条件语句已经不是`true`了，所以循环会停止。实际上，`i` 的确会在最后一个`--`时反转，不过此时循环已经停止，该值并不会被实际使用。

## 结构体数组

`std::array` 显然不可能只能存放数值元素。任何能够在普通数组中使用的数据类型，同样也能够在 `std::array` 中使用。例如，我们可以创建结构体元素的`std::array`：

```cpp
#include <array>
#include <iostream>

struct House
{
    int number{};
    int stories{};
    int roomsPerStory{};
};

int main()
{
    std::array<House, 3> houses{};

    houses[0] = { 13, 4, 30 };
    houses[1] = { 14, 3, 10 };
    houses[2] = { 15, 3, 40 };

    for (const auto& house : houses)
    {
        std::cout << "House number " << house.number
                  << " has " << (house.stories * house.roomsPerStory)
                  << " rooms\n";
    }

    return 0;
}
```

输出结果如下：

```
House number 13 has 120 rooms
House number 14 has 30 rooms
House number 15 has 120 rooms
```

不过，当我们需要初始化一个数组，且数组元素的初始化也需要一个列表值时（比如结构体数组），代码会看起来怪怪的。初始化此类`std::array` 时，你可能会尝试这样做：

```cpp
// Doesn't work.
std::array<House, 3> houses {
    { 13, 4, 30 },
    { 14, 3, 10 },
    { 15, 3, 40 }
};
```

但这种方法实际上是无效的。

==因为 `std::array` 的定义中包含一个C语言风格的数组成员==（其具体名字取决于实现）。所以当我们像上面那样初始化`houses` 时，编译器会按照下面的方式理解该初始化：

```cpp
// Doesn't work.
std::array<House, 3> houses { // 初始化 houses
    { 13, 4, 30 }, // 初始化 std::array 结构中的C风格数组成员
    { 14, 3, 10 }, // ?
    { 15, 3, 40 }  // ?
};
```

编译器会将 `{ 13, 4, 30 }` 解释为成员数组的初始化值。其效果相当于使用该初始化值初始化了下标为的结构体，剩余的结构体元素则进行了[[zero-initialization|0初始化]]。随后，编译器会发现我们提供了两个额外的初始化值(`{ 14, 3, 10 }` 和 `{ 15, 3, 40 }`) ，所以它会产生一个错误信息，提醒开发者初始化值过多。

正确的方法是再添加一层大括号：

```cpp
// This works as expected
std::array<House, 3> houses { // initializer for houses
    { // 额外的大括号表明接下来初始化数组成员
        { 13, 4, 30 }, // initializer for array element 0
        { 14, 3, 10 }, // initializer for array element 1
        { 15, 3, 40 }, // initializer for array element 2
     }
};
```


注意，该大括号是必要的（表明开始初始化`std::array`中的数组成员）。这样一来，我们就可以对每个结构体成员进行初始化了。

==这就解释了为什么在使用 `std::array` 时，初始化值必须多一层大括号。==


## 小结

`std::array`可以很好地代替内置的固定数组。它效率很高，唯一的缺点就是它的语法稍微有点别扭：你必须指定数组的长度（除非你省略类型，不然编译器不会基于初始化值自动计算长度，但是这并不总是可行），而且在索引时还存在有符号和无符号不匹配的问题。不过，瑕不掩瑜，我们还是推荐使用 `std::array` 来代替内建数组。
