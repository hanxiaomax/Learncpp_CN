---
title: 11.9 - 指针运算和数组索引
alias: 11.9 - 指针运算和数组索引
origin: /pointer-arithmetic-and-array-indexing/
origin_title: "none"
time: 2022-1-2
type: translation
tags:
- Pointer arithmetic
---

> [!note] "Key Takeaway"
> - 指针+1，移动的内存地址数取决于指针指向的对象的大小，每次移动一个对象的长度。
> - C++的 algorithms 库提供了`std::count_if`，该函数可以基于某个条件来统计元素
> - `std::begin`和`std::end`可以返回指向固定数组的第一个元素的迭代器和最后一个元素后面的伪元素的迭代器
> - `std::end` 返回的迭代器只作为标记来使用，对其进行访问会导致[[undefined-behavior|未定义行为]]，因为它不指向某个实际的元素。


## 指针运算

在 C++ 中你可以对指针进行加减运算。如果 `ptr` 指向一个整型，那么 `ptr + 1` 则会指向下内存中下一个整型对象。`ptr - 1` 则会指向前一个整形对象。

注意，`ptr + 1` 返回的并不是`ptr`指针指向的下一个内存地址，而是指针所指对象的下一个同类型对象的地址。如果指针指向整型（假设为4字节），那么`ptr+3`则返回3个整型（12字节）后的地址。如果`ptr`指向的是`char`类型的对象（总是1字节），则`ptr + 3`会返回`ptr`后面3个字节的地址。

在计算指针算术表达式的结果时，编译器总是将整数操作数乘以所指向对象的大小。这叫做[[scaling|指针缩放(scaling)]]。

考虑以下程序:

```cpp
#include <iostream>

int main()
{
    int value{ 7 };
    int* ptr{ &value };

    std::cout << ptr << '\n';
    std::cout << ptr+1 << '\n';
    std::cout << ptr+2 << '\n';
    std::cout << ptr+3 << '\n';

    return 0;
}
```

在笔者的电脑上会打印如下信息：

```
0012FF7C
0012FF80
0012FF84
0012FF88
```

上述地址之间相差4字节(十六进制 7C + 4 = 80)，这是因为在笔者电脑上整型大小为4字节。

下面这个程序中使用`short` 代替了 `int`：

```cpp
#include <iostream>

int main()
{
    short value{ 7 };
    short* ptr{ &value };

    std::cout << ptr << '\n';
    std::cout << ptr+1 << '\n';
    std::cout << ptr+2 << '\n';
    std::cout << ptr+3 << '\n';

    return 0;
}
```


在笔者的电脑上会打印如下信息：

```
0012FF7C
0012FF7E
0012FF80
0012FF82
```

因为 `short` 的长度为 2 字节，所以地址之间相差 2 字节。

## 数组元素按顺序分布在内存中

通过取地址运算符(`&`)，我们可以检验数组元素是否是按照顺序排列在内存中的，0, 1, 2, … 元素彼此相邻，按照顺序排列在内存中。

```cpp
#include <iostream>

int main()
{
    int array[]{ 9, 7, 5, 3, 1 };

    std::cout << "Element 0 is at address: " << &array[0] << '\n';
    std::cout << "Element 1 is at address: " << &array[1] << '\n';
    std::cout << "Element 2 is at address: " << &array[2] << '\n';
    std::cout << "Element 3 is at address: " << &array[3] << '\n';

    return 0;
}
```

在笔者的电脑上会打印如下信息：

```
Element 0 is at address: 0041FE9C
Element 1 is at address: 0041FEA0
Element 2 is at address: 0041FEA4
Element 3 is at address: 0041FEA8
```

注意，每个地址之间都间隔4字节，这正是笔者电脑上整型数的大小。


## 指针算数、数组和索引背后的魔法

上面已经介绍了，数组是一系列顺序排列的内存。

在之前的课程中我们还介绍了，固定数组可以退化为指针，该指针指向数组的第一个元素。

同时我们还知道，对指针加1可以得到该指针所指地址后面一个对象的地址。

以你，对数组加1就可以得到第二个元素，通过下面的代码可以进行验证：

```cpp
#include <iostream>

int main()
{
     int array[]{ 9, 7, 5, 3, 1 };

     std::cout << &array[1] << '\n'; // print memory address of array element 1
     std::cout << array+1 << '\n'; // print memory address of array pointer + 1

     std::cout << array[1] << '\n'; // prints 7
     std::cout << *(array+1) << '\n'; // prints 7 (note the parenthesis required here)

    return 0;
}
```


注意，当通过指针运算的结果进行间接操作时，必须使用圆括号来确保操作符的优先级是正确的，因为`operator *` 的优先级高于`operator +` 。

在笔者的电脑上会打印如下信息：

```
0017FB80
0017FB80
7
7
```

事实证明，当编译器看到下标操作符(`[]`)时，它实际上会将其转换为指针加法和间接操作！`array[n]` 等同于`*(array + n)` ，其中`n`为整数。下标操作符`[]`的存在既是为了美观，也是为了便于使用。

## 使用指针遍历数组

可以使用指针和指针算术来遍历数组。虽然这种方式不常见(使用下标通常更容易阅读和更少的错误)，但的确是可行的。请看下面的例子：

```cpp
#include <iostream>
#include <iterator> // for std::size

bool isVowel(char ch)
{
    switch (ch)
    {
    case 'A':
    case 'a':
    case 'E':
    case 'e':
    case 'I':
    case 'i':
    case 'O':
    case 'o':
    case 'U':
    case 'u':
        return true;
    default:
        return false;
    }
}

int main()
{
    char name[]{ "Mollie" };
    int arrayLength{ static_cast<int>(std::size(name)) };
    int numVowels{ 0 };

    for (char* ptr{ name }; ptr != (name + arrayLength); ++ptr)
    {
        if (isVowel(*ptr))
        {
            ++numVowels;
        }
    }

    std::cout << name << " has " << numVowels << " vowels.\n";

    return 0;
}
```

它是如何工作的？这个程序使用一个指针来遍历数组中的每个元素。记住数组会退化为指向数组第一个元素的指针。因此，通过使用`name` 初始化`ptr` ，`ptr` 将指向数组的第一个元素。当调用`isVowel(*ptr)` 时，通过`ptr`对每个元素执行间接操作，如果元素是元音，`numVowels` 将递增。然后，for循环使用`++`操作符将指针向前移动到数组中的下一个字符。当检查完所有字符时，for循环终止。

上述程序产生的结果是：

```
Mollie has 3 vowels
```

因为计数是非常常见的算法，所以C++的 algorithms 库提供了`std::count_if`，该函数可以基于某个条件来统计元素。我们可以将上面的for循环使用 `std::count_if` 进行改写。

```cpp
#include <algorithm>
#include <iostream>
#include <iterator> // for std::begin and std::end

bool isVowel(char ch)
{
    switch (ch)
    {
    case 'A':
    case 'a':
    case 'E':
    case 'e':
    case 'I':
    case 'i':
    case 'O':
    case 'o':
    case 'U':
    case 'u':
        return true;
    default:
        return false;
    }
}

int main()
{
    char name[]{ "Mollie" };

    // walk through all the elements of name and count how many calls to isVowel return true
    auto numVowels{ std::count_if(std::begin(name), std::end(name), isVowel) };

    std::cout << name << " has " << numVowels << " vowels.\n";

    return 0;
}
```


`std::begin` 返回一个指向第一个元素的迭代器（指针），而`std::end` 返回的是最后一个元素的后一个位置。`std::end` 返回的迭代器只作为标记来使用，对其进行访问会导致未定义行为，因为它不指向某个实际的元素。

`std::begin` 和 `std::end` 只能用于已知长度的数组，如果数组退化为指针，则需要手动计算begin和end。

```cpp
// nameLength is the number of elements in the array.
std::count_if(name, name + nameLength, isVowel)

// Don't do this. Accessing invalid indexes causes undefined behavior.
// std::count_if(name, &name[nameLength], isVowel)
```

注意，我们计算的是`name + nameLength`，而不是`name + nameLength - 1`，因为我们需要的不是最后一个元素，而是最后一个元素后面的一个”伪元素“。

像这样计算数组的开始和结束，适用于所有需要开始和结束参数的算法。
