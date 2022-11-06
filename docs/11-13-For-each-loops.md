---
title: 11.13 - for-each 循环
alias: 11.13 - for-each 循环
origin: /none/
origin_title: "none"
time: 2022-1-2
type: translation
tags:
- for-each
---

??? note "关键点速记"

	- for-each 中的变量可以声明为引用


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


尽管使用 for 循环可以很方便的遍历一个数组，但是在真正使用的时候，这种方式容易出错，而且也容易犯[[off-by-one-errors|差一错误]]。

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

	In for-each loops element declarations, if your elements are non-fundamental types, use references or `const` references for performance reasons.

## 使用 for-each 循环重写最高分数的例子

Here’s the example at the top of the lesson rewritten using a _for each_ loop:

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

COPY

Note that in this example, we no longer have to manually subscript the array or get its size. We can access the array element directly through variable score. The array has to have size information. An array that decayed to a pointer cannot be used in a for-each loop.

## For-each 循环和非数组变量

_For-each_ loops don’t only work with fixed arrays, they work with many kinds of list-like structures, such as vectors (e.g. `std::vector`), linked lists, trees, and maps. We haven’t covered any of these yet, so don’t worry if you don’t know what these are. Just remember that for each loops provide a flexible and generic way to iterate through more than just arrays.

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

COPY

For-each doesn’t work with pointers to an array

In order to iterate through the array, for-each needs to know how big the array is, which means knowing the array size. Because arrays that have decayed into a pointer do not know their size, for-each loops will not work with them!

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

COPY

Similarly, dynamic arrays won’t work with for-each loops for the same reason.

Can I get the index of the current element?

_For-each_ loops do _not_ provide a direct way to get the array index of the current element. This is because many of the structures that _for-each_ loops can be used with (such as linked lists) are not directly indexable!

Since C++20, range-based for-loops can be used with an init-statement just like the init-statement in normal for-loops. We can use the init-statement to create a manual index counter without polluting the function in which the for-loop is placed.

The init-statement is placed right before the loop variable:

```
for (init-statement; element_declaration : array)
   statement;
```

In the following code, we have two arrays which are correlated by index. For example, the student with the name at `names[3]` has a score of `scores[3]`. Whenever a student with a new high score is found, we print their name and difference in points to the previous high score.

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

COPY

Output

```
Alex beat the previous best score of 0 by 84 points!
Betty beat the previous best score of 84 by 8 points!
The best score was 92
```

The `int i{ 0 };` is the init-statement, it only gets executed once when the loop starts. At the end of each iteration, we increment `i`, similar to a normal for-loop. However, if we were to use `continue` inside the loop, the `++i` would get skipped, leading to unexpected results. If you use `continue`, you need to make sure that `i` gets incremented before the `continue` is encountered.

Before C++20, the index variable `i` had to be declared outside of the loop, which could lead to name conflicts when we wanted to define another variable named `i` later in the function.

## 结论

_For-each_ loops provide a superior syntax for iterating through an array when we need to access all of the array elements in forwards sequential order. It should be preferred over the standard for loop in the cases where it can be used. To prevent making copies of each element, the element declaration can be a reference.