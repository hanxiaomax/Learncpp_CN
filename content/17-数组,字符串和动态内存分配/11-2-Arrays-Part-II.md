---
title: 11.2 - 数组（第二部分）
alias: 11.2 - 数组（第二部分）
origin: /arrays-part-ii/
origin_title: "11.2 — Arrays (Part II)"
time: 2022-6-15
type: translation
tags:
- array
- C++17
- C++20
---

> [!note] "Key Takeaway"
> - 使用[[list-initialization]]方式初始化数组 `int prime[5]{ 2,3, 5,7, 11 };`
>   - 初始化列表中的元素个数超过数组能容纳的个数时会报错，少于时剩下的会被初始化为 0
>   - 初始化一个全 0 数组：`int prime[5]{};`
> - 如果省略初始化列表，则数组元素为未初始化状态，除非它们是 `class` 类型的。
> - 不论数组元素可以在没有初始化列表时会不会被默认初始化，都应当显式地初始化数组。
> - 使用列表初始化对数组初始化时，编译器可以自动计算数组长度，因此不需要声明数组的长度。
> - 可以添加了一个名为 `max_XXX`的额外枚举值。此枚举值在数组声明期间使用，以确保数组具有适当的长度(因为数组长度应该比最大索引大 1)。这对于代码可读性非常重要，当我们添加新的枚举值时，数组将自动调整大小：
> - [[scoped-enumerations|限定作用域枚举]]（枚举类）并不能隐式地转换为对应的整型
> - 使用普通枚举类型并将其放置在某个作用域中，比使用枚举类更好。
> - 数组是传地址不是传值，所以如果你想确保一个函数不会修改传递给它的数组元素，可以将数组设置为 `const`
> - `<iterator>` 头文件中的 `std: size()` 函数可以用来判断数组的长度，但不能用于数组被当做参数传递的情形（C++17）
> - `sizeof` 操作符可以用于数组，它会返回**数组的大小**（数组长度乘以数组元素的大小），使用数组大小除以数组第一个元素的大小可以得到数组长度
> - 将 `sizeof` 应用于被传入函数的数组时，不会像 `std:: size()` 一样导致编译错误，取而代之的是，它会返回**指针的长度**。

书接上文（ [[11-1-Arrays-Part-I|11.1 - 数组（第一部分）]]）。

## 固定数组初始化

数组元素会被当做普通变量来对待，因此，它们在创建时默认是不初始化的。

“初始化”数组的方式之一，是逐个元素进行初始化：

```cpp
int prime[5]; // hold the first 5 prime numbers
prime[0] = 2;
prime[1] = 3;
prime[2] = 5;
prime[3] = 7;
prime[4] = 11;
```

不过，这么做很麻烦，几乎不可能用来初始化非常长的数组。不仅如此，与其说这是在初始化，倒不如说是在赋值。如果数组是 `const` 类型的话，赋值是行不通的。

幸好，我们可以使用[[initializer-list|初始化值列表(initializer list)]]来初始化整个数组。下面例子中初始化的数组和上一个例子的”初始化“结果是完全一样的：

```cpp
int prime[5]{ 2, 3, 5, 7, 11 }; // use initializer list to initialize the fixed array
```

如果列表中初始化值的数量超过了数组所能容纳的数量，编译器将会报告一个错误。

但是，如果列表中初始化器的数量少于数组所能容纳的数量，则剩余的元素将被初始化为 `0`(或者，`0` 会被转换其他非整型的值——例如，对于 `double` 类型，`0` 会转换为 `0.0`)。这被称为[[zero-initialization|零初始化(zero initialization)]]。

请看下面这个例子：

```cpp
#include <iostream>

int main()
{
    int array[5]{ 7, 4, 5 }; // only initialize first 3 elements

    std::cout << array[0] << '\n';
    std::cout << array[1] << '\n';
    std::cout << array[2] << '\n';
    std::cout << array[3] << '\n';
    std::cout << array[4] << '\n';

    return 0;
}
```

打印：

```
7
4
5
0
0
```

因此，要将数组中的所有元素初始化为 0，你可以这样做:

```cpp
// Initialize all elements to 0
int array[5]{ };

// Initialize all elements to 0.0
double array[5]{ };

// Initialize all elements to an empty string
std::string array[5]{ };
```

如果省略初始化列表，则数组元素为未初始化状态，除非它们是 `class` 类型的。

```cpp
// 未初始化
int array[5];

// 未初始化
double array[5];

// 初始化为空字符串
std::string array[5];
```

> [!success] "最佳实践"
> 不论数组元素可以在没有初始化列表时会不会被默认初始化，都应当显式地初始化数组。

## 省略数组长度

如果您使用初始化列表初始化一个固定长度数组，编译器可以自动计算出数组的长度，所以你可以省略数组长度的声明。

下面两行是等价的:

```cpp
int array[5]{ 0, 1, 2, 3, 4 }; // explicitly define the length of the array
int array[]{ 0, 1, 2, 3, 4 }; // let the initializer list set length of the array
```

这么做的好处可不仅仅是方便，同时可以避免你在修改了元素后还要更新数组长度声明。

## 数组和枚举

对于数组来说，践行代码即文档的最大障碍，就是整数索引无法向程序员提供关于索引含义的任何信息。假设一个有 `5` 个学生的班级:

```cpp
constexpr int numberOfStudents{5};
int testScores[numberOfStudents]{};
testScores[2] = 76;
```

`testScores[2]` 表示的是谁的分数？我们看不出来！

解决这个问题的办法是使用枚举类型，每个枚举变量对应一个数组索引：

```cpp
enum StudentNames
{
    kenny, // 0
    kyle, // 1
    stan, // 2
    butters, // 3
    cartman, // 4
    max_students // 5
};

int main()
{
    int testScores[max_students]{}; // allocate 5 integers
    testScores[stan] = 76;

    return 0;
}
```

这样，每个数组元素所代表的含义就更加清晰了。注意，我们添加了一个名为 `max_students` 的额外枚举值。此枚举值在数组声明期间使用，以确保数组具有适当的长度(因为数组长度应该比最大索引大 1)。这对于代码可读性非常重要，当我们添加新的枚举值时，数组将自动调整大小：

```cpp
enum StudentNames
{
    kenny, // 0
    kyle, // 1
    stan, // 2
    butters, // 3
    cartman, // 4
    wendy, // 5
    max_students // 6
};

int main()
{
    int testScores[max_students]{}; // allocate 6 integers
    testScores[stan] = 76; // still works

    return 0;
}
```

注意，这个技巧只有在你不需要手动修改枚举值对应的数值时才有用。

## 数组和枚举类

[[enum-class|枚举类(enum class)]]并不能隐式地转换为对应的整型，所以如果你尝试编写下面的代码：

```cpp
enum class StudentNames
{
    kenny, // 0
    kyle, // 1
    stan, // 2
    butters, // 3
    cartman, // 4
    wendy, // 5
    max_students // 6
};

int main()
{
    int testScores[StudentNames::max_students]{}; // allocate 6 integers
    testScores[StudentNames::stan] = 76;

    return 0;
}
```

你会得到一个编译错误。为了解决这个问题，你可以使用  `static_cast` 将枚举值转换为整型。

```cpp
int main()
{
    int testScores[static_cast<int>(StudentNames::max_students)]{}; // allocate 6 integers
    testScores[static_cast<int>(StudentNames::stan)] = 76;

    return 0;
}
```

不过，这么做显然很麻烦。所以，使用普通枚举类型并将其放置在某个作用域中，比使用枚举类更好。

```cpp
namespace StudentNames
{
    enum StudentNames
    {
        kenny, // 0
        kyle, // 1
        stan, // 2
        butters, // 3
        cartman, // 4
        wendy, // 5
        max_students // 6
    };
}

int main()
{
    int testScores[StudentNames::max_students]{}; // allocate 6 integers
    testScores[StudentNames::stan] = 76;

    return 0;
}
```

## 将数组传递给函数

虽然乍一看向函数传递数组和传递普通变量好像没什么区别，但在本质上，C++对传递数组的处理是不同的。

普通变量通过[[pass-by-value|按值传递]]的方式传入函数——C++将实参的值复制到函数形参中。因为形参是一个副本，改变形参的值并不会改变原始实参的值。

但是，==由于复制大型数组的开销非常大，所以 C++在将数组传递给函数时不会复制数组。相反，它会传递*数组本身*==。这样做的副作用是函数可以直接更改数组元素的值！

下面的例子说明了这个概念:

```cpp
#include <iostream>

void passValue(int value) // value 是实参的副本
{
    value = 99; // 修改 value 的值不会影响原值
}

void passArray(int prime[5]) // prime 是数组本身
{
    prime[0] = 11; // 修改 prime 元素的值会实际修改数组
    prime[1] = 7;
    prime[2] = 5;
    prime[3] = 3;
    prime[4] = 2;
}

int main()
{
    int value{ 1 };
    std::cout << "before passValue: " << value << '\n';
    passValue(value);
    std::cout << "after passValue: " << value << '\n';

    int prime[5]{ 2, 3, 5, 7, 11 };
    std::cout << "before passArray: " << prime[0] << " " << prime[1] << " " << prime[2] << " " << prime[3] << " " << prime[4] << '\n';
    passArray(prime);
    std::cout << "after passArray: " << prime[0] << " " << prime[1] << " " << prime[2] << " " << prime[3] << " " << prime[4] << '\n';

    return 0;
}
```

```
before passValue: 1
after passValue: 1
before passArray: 2 3 5 7 11
after passArray: 11 7 5 3 2
```

在上面的例子中，`value` 没有在 `main()` 被中改变，因为 `passValue()` 函数中的参数值是 `main()` 函数中变量值的副本，而不是实际的变量。然而，由于 `passArray()` 函数中的数组是数组本身，`passArray()` 能够直接改变元素的值！

上述现象背后的原因，和 C++ 实现数组的方式有关，我们会在 [[11-8-Pointers-and-arrays|11.8 - 指针和数组]]中进行详细介绍。现在你可以暂时认为这是语言中的一个”怪异“特性。

注意，如果你想确保一个函数不会修改传递给它的数组元素，你可以将数组设置为 `const` :

```cpp
// 即使 prime 是实际上数组，在函数中它也会被看做是常量。
void passArray(const int prime[5])
{
    // so each of these lines will cause a compile error!
    prime[0] = 11;
    prime[1] = 7;
    prime[2] = 5;
    prime[3] = 3;
    prime[4] = 2;
}
```

## 确定数组长度

`<iterator>` 头文件中的 `std: size()` 函数可以用来判断数组的长度。

例如：

```cpp
#include <iostream>
#include <iterator> // for std::size

int main()
{
    int array[]{ 1, 1, 2, 3, 5, 8, 13, 21 };
    std::cout << "The array has: " << std::size(array) << " elements\n";

    return 0;
}
```

打印：

```
The array has: 8 elements
```

注意，由于 C++ 函数传递数组的特殊性，上面的方法不能用于数组被传递到函数中的情形。

```cpp
#include <iostream>
#include <iterator>

void printSize(int array[])
{
    std::cout << std::size(array) << '\n'; // Error
}

int main()
{
    int array[]{ 1, 1, 2, 3, 5, 8, 13, 21 };
    std::cout << std::size(array) << '\n'; // will print the size of the array
    printSize(array);

    return 0;
}
```

`std:: size()` 也可以用于其他类型的对象（例如 `std:: array` 和 `std:: vector`），而且如果你对被传入函数的数组使用 `std: size()` 时，会产生编译报错。注意，`std:: size` 会返回的是一个无符号值，如果你需要使用有符号值，则要么将其转换为有符号值，或者使用 C++20 中提供的 `std:: ssize()` (signed size)。

> [!info] "作者注"
> [为什么 C++20 要引入 `std: ssize()`](https://stackoverflow.com/questions/56217283/why-is-stdssize-introduced-in-c20)

`std:: size()` 是在 C++17 中引入的，所以如果你使用的是旧版本的编译器，那么只好使用 `sizeof` 运算符。`sizeof` 运算符使用起来不如 `std: size()` 方便，而且有些地方要特别注意。如果你使用的是兼容 C++17 的编译器， 可以直接跳到*数组访问越界*一节。

`sizeof` 操作符可以用于数组，它会返回**数组的大小**（数组长度乘以数组元素的大小）。

```cpp
#include <iostream>

int main()
{
    int array[]{ 1, 1, 2, 3, 5, 8, 13, 21 };
    std::cout << sizeof(array) << '\n'; // will print the size of the array multiplied by the size of an int
    std::cout << sizeof(int) << '\n';

    return 0;
}
```

在整型大小为 4 字节的机器上：

```
32
4
```

经典技巧：将数组的大小除以数组元素的大小，就可以得到数组的长度。

```cpp
#include <iostream>

int main()
{
    int array[]{ 1, 1, 2, 3, 5, 8, 13, 21 };
    std::cout << "The array has: " << sizeof(array) / sizeof(array[0]) << " elements\n";

    return 0;
}
```

打印：

```
The array has: 8 elements
```

这是怎么回事？首先，请注意，整个数组的大小等于数组的长度乘以元素的大小，即 `array size = array length * element size`。

公式变形一下就可以得到：`array length = array size / element size`。`sizeof(array)` 即数组的大小，而 `sizeof(array[0])` 则是数组元素的大小。带入公式得到数组 `length = sizeof(array) / sizeof(array[0])`。我们通常使用数组元素 0 作为来计算数组元素的大小，因为无论数组长度是多少，第一个元素总是存在的。

将 `sizeof` 应用于被传入函数的数组时，不会像 `std:: size()` 一样导致编译错误，取而代之的是，它会返回**指针的长度**。

```cpp
#include <iostream>

void printSize(int array[])
{
    std::cout << sizeof(array) / sizeof(array[0]) << '\n';
}

int main()
{
    int array[]{ 1, 1, 2, 3, 5, 8, 13, 21 };
    std::cout << sizeof(array) / sizeof(array[0]) << '\n';
    printSize(array);

    return 0;
}
```

同样假设 8 字节指针和 4 字节整数，输出结果为：

```
8
2
```

> [!info] "作者注"
> 如果试图对传递给函数的数组使用 sizeof()，正确配置的编译器应该打印一个警告。

在 `main()` 中计算数组长度是正确的，但是 `printSize()` 中的 `sizeof()` 返回了 `8`(指针的大小)，`8` 除以 `4` 等于 `2`。

因此，在数组上使用 `sizeof()` 时要小心!

注意：在通常的用法中，术语“数组大小”和“数组长度”都是最常用于指数组的长度(数组的大小在大多数情况下是没有用的，除了我们上面展示的技巧)。

## 数组访问越界

记住，长度为 `N` 的数组，其下标从 `0` 到 `N-1`。如果你试图访问的数组下标，在这个范围之外会发生什么？

考虑以下程序:

```cpp
int main()
{
    int prime[5]{}; // hold the first 5 prime numbers
    prime[5] = 13;

    return 0;
}
```


在这个程序中，数组长度为 `5`，但我们试图将第 6 个元素(索引 5)写入 `prime` 数组。

C++ 不会检查下标是否合法。所以在上面的例子中，13 的值会被插入到内存中（第 6 个元素位置的内存可用的话）。当这种情况发生时，您将得到未定义的行为——例如，这可能会覆盖另一个变量的值，或导致程序崩溃。

尽管不常见，但在 C++中也可以使用负数索引，这也会导致错误。

> [!note] "法则"
> 当使用数组时，确保你的索引在有效范围内

