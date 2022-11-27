---
title: 11.13 - for-each 循环
alias: 11.13 - for-each 循环
origin: /none/
origin_title: "none"
time: 2022-1-2
type: translation
tags:
- for-each
- C++20
---

??? note "关键点速记"

	- 在 for-each 循环中声明元素时，如果元素是非基本类型，则将其声明为引用或常数引用以提高性能。
	- for-each 循环必须知道被遍历容器的大小，所以它不能配合退化为指针的数组或动态数组工作
	- For-each 循环不仅能够配合固定数组一起使用，它可以和多种类列表的数据结构一起工作，例如vector(例如 `std::vector`)、链表、树和映射。
	- 通过放置在循环变量的前面的`init-statement`可以像普通for循环一样创建一个索引(C++20)并在循环中对其进行递增。在C++20之前，必须在循环外声明这索引，注意可能会导致命名冲突的情况。

在 [[11-3-Arrays-and-loops|11.3 - 数组和循环]] 中，我们学习了如何使用for循环遍历数组中的元素，例如：

```cpp
#include <iostream>
#include <iterator> // std::size

int main()
{
    constexpr int scores[]{ 84, 92, 76, 81, 56 };
    constexpr int numStudents{ std::size(scores) };

    int maxScore{ 0 }; // keep track of our largest score
    for (int student{ 0 }; student < numStudents; ++student)
    {
        if (scores[student] > maxScore)
        {
            maxScore = scores[student];
        }
    }

    std::cout << "The best score was " << maxScore << '\n';

    return 0;
}
```


尽管使用 for 循环可以很方便的遍历一个数组，但是在真正使用的时候，这种方式容易出错，而且也容易犯[[Off-by-one|差一错误]]。

使用 for-each 循环（也称为[[range-based-for-loops|基于范围的for循环]]）可以更加简便、更加安全地遍历数组（或其他类似的数据结构）中的元素。


## For-each 循环

for-each 循环的语法如下：

```cpp
for (element_declaration : array)
   statement;
```

当执行此语句时，循环将遍历数组中的每个元素，将当前数组元素的值赋给`element_declaration`中声明的变量。为了获得最佳结果，`element_declaration`应该具有与数组元素相同的类型，否则将发生类型转换。

让我们看一个简单的例子，它使用 for-each 循环来打印斐波那契数组中的所有元素:

```cpp
#include <iostream>

int main()
{
    constexpr int fibonacci[]{ 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89 };
    for (int number : fibonacci) // iterate over array fibonacci
    {
       std::cout << number << ' '; // we access the array element for this iteration through variable number
    }

    std::cout << '\n';

    return 0;
}
```

程序的输出结果为：

```
0 1 1 2 3 5 8 13 21 34 55 89
```

让我们仔细研究一下上面代码是如何工作的。首先，执行 for 循环，变量`number` 的值首先被设置为数组中的第一个元素，也就是 0。程序随后打印该值，即打印0.然后，for 循环再次执行，`number`被设置为数组的第二个元素，即1。然后打印1。for 循环不断地执行，依次打印出数组中的每个元素，直到遍历完全部数组。然后，循环截止了，程序继续执行（返回0给操作系统）。

注意，这里的 `number` 并不是一个数组索引。它本身被赋值为当前遍历到的数组中的元素。

## For each 循环和 `auto`关键字

因为 `element_declaration` 应该与数组中的元素属于同一类型，那么最理想的方式就是使用`auto`关键字声明该变量并让C++为我们自动推断其类型。


```cpp
#include <iostream>

int main()
{
    constexpr int fibonacci[]{ 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89 };
    for (auto number : fibonacci) // type is auto, so number has its type deduced from the fibonacci array
    {
       std::cout << number << ' ';
    }

    std::cout << '\n';

    return 0;
}
```


## For-each 循环和引用

在下面的例子中，`element`被声明为一个值变量：

```cpp
std::string array[]{ "peter", "likes", "frozen", "yogurt" };
for (auto element : array) // element will be a copy of the current array element
{
    std::cout << element << ' ';
}
```

这意味着在遍历数组时，当前元素会被拷贝到`element`。拷贝数组元素的开销会很大，而且多数情况下我们实际上想要访问原本的元素。幸运的是，我们可以将其声明为引用类型：

```cpp
std::string array[]{ "peter", "likes", "frozen", "yogurt" };
for (auto& element: array) // The ampersand makes element a reference to the actual array element, preventing a copy from being made
{
    std::cout << element << ' ';
}
```

在上面的例子中，`element` 是当前迭代数组元素的引用，从而避免了复制。此外，对`element`的任何修改都会影响正在迭代的数组，如果`element`是一个普通变量，这是不可能的。

当然，如果你打算以只读的方式使用引用，将它设为`const`是个好主意：

```cpp
std::string array[]{ "peter", "likes", "frozen", "yogurt" };
for (const auto& element: array) // element is a const reference to the currently iterated array element
{
    std::cout << element << ' ';
}
```


!!! success "最佳实践"

	在 for-each 循环中声明元素时，如果元素是非基本类型，则将其声明为引用或常数引用以提高性能。

## 使用 for-each 循环重写最高分数的例子

接下来，使用 for-each 重写开头的例子：

```cpp
#include <iostream>

int main()
{
    constexpr int scores[]{ 84, 92, 76, 81, 56 };
    int maxScore{ 0 }; // keep track of our largest score

    for (auto score : scores) // iterate over array scores, assigning each value in turn to variable score
    {
        if (score > maxScore)
        {
            maxScore = score;
        }
    }

    std::cout << "The best score was " << maxScore << '\n';

    return 0;
}
```

注意，在本例中，我们不再需要通过下标索引数组或获取数组大小。我们可以通过变量`score`直接访问数组元素。数组必须有大小信息，退化为指针的数组不能在for-each循环中使用。


## For-each 循环和非数组变量

==For-each 循环不仅能配合固定数组一起使用，它可以和多种类列表的数据结构一起工作，例如vector(例如 `std::vector`)、链表、树和映射==。 我们还没有介绍这些内容，所以你不知道也没关系。你现在只需要记住，for-each循环提供了一种灵活、通用的遍历方法（不仅仅是遍历数组而已）。

```cpp
#include <iostream>
#include <vector>

int main()
{
    std::vector fibonacci{ 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89 }; // note use of std::vector here rather than a fixed array
    // Before C++17
    // std::vector<int> fibonacci{ 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89 };

    for (auto number : fibonacci)
    {
        std::cout << number << ' ';
    }

    std::cout << '\n';

    return 0;
}
```


## For-each 不能和指向数组的指针一起工作

为了遍历数组，for-each需要知道数组的大小。因为已经退化为指针的数组不再包含数组大小的信息，因此for-each循环将无法配合它们一起工作！

```cpp
#include <iostream>

int sumArray(const int array[]) // array is a pointer
{
    int sum{ 0 };

    for (auto number : array) // compile error, the size of array isn't known
    {
        sum += number;
    }

    return sum;
}

int main()
{
     constexpr int array[]{ 9, 7, 5, 3, 1 };

     std::cout << sumArray(array) << '\n'; // array decays into a pointer here

     return 0;
}
```


同样，由于同样的原因，动态数组也不能用于for-each循环。

## 能够获取当前元素的索引吗？

_For-each_ 循环不能够提供访问数组索引的直接方法。这是因为很多配合for-each循环工作的数据结构（例如链表）并不能够通过索引访问元素。

从C++20开始，基于范围的for循环可以与一个初始化语句一起使用，就像普通for循环中的初始化语句一样。我们可以使用 `init-statement` 来创建手动索引计数器，而不会破坏for循环所在的函数。

`init-statement` 应该放置在循环变量的前面：

```cpp
for (init-statement; element_declaration : array)
   statement;
```

在下面的代码中，我们有两个通过索引关联的数组。例如，名字为“`names[3]`”的学生的分数为“`scores[3]`”。每当发现一个新的高分学生时，我们就打印出他们的名字和与前一个高分的分差。

```cpp
#include <iostream>

int main()
{
    std::string names[]{ "Alex", "Betty", "Caroline", "Dave", "Emily" }; // Names of the students
    constexpr int scores[]{ 84, 92, 76, 81, 56 };
    int maxScore{ 0 };

    for (int i{ 0 }; auto score : scores) // i is the index of the current element
    {
        if (score > maxScore)
        {
            std::cout << names[i] << " beat the previous best score of " << maxScore << " by " << (score - maxScore) << " points!\n";
            maxScore = score;
        }

        ++i;
    }

    std::cout << "The best score was " << maxScore << '\n';

    return 0;
}
```

输出结果：
```
Alex beat the previous best score of 0 by 84 points!
Betty beat the previous best score of 84 by 8 points!
The best score was 92
```

这里的 `int i{ 0 };` 是 `init-statement`，它会在循环执行时执行一次。在每次循环时，`i`就被递增1，类似与普通的循环。不过，如果我们在循环中使用`continue`的话，`++i`会被跳过，导致非预期的结果。如果你需要使用 `continue` 的话，请确保`i`的递增在`continue`之前进行。

在C++20之前，索引变量`i` 必须在循环之外声明，但这可能导致名称冲突，例如当我们想在后面的函数中定义另一个名为`i` 的变量时。

## 结论


当需要按正向顺序访问所有数组元素时，For-each 循环为遍历数组提供了一种高级语法。在可以使用它的情况下，它应该优于标准的for循环。为了防止复制每个元素，可以将元素声明为引用。
