---
title: 11.3 - 数组和循环
alias: 11.3 - 数组和循环
origin: /arrays-and-loops/
origin_title: "11.3 — Arrays and loops"
time: 2022-5-21
type: translation
tags:
- array
- loop
---

??? note "关键点速记"
	- 

考虑这样一种情况，如果需要计算一个班级学生的平均成绩的话，使用多个变量的话可以这样做: 

```cpp
int numStudents{ 5 };
int score0{ 84 };
int score1{ 92 };
int score2{ 76 };
int score3{ 81 };
int score4{ 56 };

int totalScore{ score0 + score1 + score2 + score3 + score4 };
auto averageScore{ static_cast<double>(totalScore) / numStudents };
```

真是不少变量啊——而这仅仅是计算5个学生的平均值! 想象一下如果是30个学生或150个学生，那得是多大的工作量啊。

另外，如果添加了一个新学生，则必须声明、初始化一个新变量，并将其添加到 `totalScore` 计算中。 每次修改旧代码时，都有引入错误的风险。  

使用数组提供了一个更好的解决方案:

```cpp
int scores[]{ 84, 92, 76, 81, 56 };
int numStudents{ static_cast<int>(std::size(scores)) }; // 需要 C++17 和 <iterator> 头文件
int totalScore{ scores[0] + scores[1] + scores[2] + scores[3] + scores[4] };
auto averageScore{ static_cast<double>(totalScore) / numStudents };
```

这么做的确可以大大减少声明变量的数量，但 `totalScore` 仍然需要单独列出每个数组元素。如上所述，改变学生人数意味着需要手动调整总成绩公式。

如果有一种方法可以循环我们的数组并直接计算 `totalScore` 就好了。

## 数组的循环遍历


在上一节课中我们介绍过，数组的下标不需要是一个常量值——它可以是一个变量。这意味着我们可以使用循环变量作为数组索引来循环遍历数组的所有元素，并对它们执行一些计算。这是非常常见的，数组和循环几乎总是形影不离地出现。使用循环来依次访问每个数组元素通常被称为[[iterating|遍历(iterating)]]数组。

使用 for 循环来重新编写上面的代码：

```cpp
constexpr int scores[]{ 84, 92, 76, 81, 56 };
constexpr int numStudents{ static_cast<int>(std::size(scores)) };
// const int numStudents{ sizeof(scores) / sizeof(scores[0]) }; // use this instead if not C++17 capable
int totalScore{ 0 };

// use a loop to calculate totalScore
for (int student{ 0 }; student < numStudents; ++student) // 这里 student{0} 其实就是 i=0
    totalScore += scores[student];

auto averageScore{ static_cast<double>(totalScore) / numStudents };
```

这种方案在可读性和可维护性方面都很理想。通过循环来逐个访问数组元素，公式可以根据数组中元素的个数自动调整。这意味着当有新的学生时，不需要手动添加该学生的分数。

下面是一个使用循环搜索数组的例子，以确定班级中的最高分：

```cpp
#include <iostream>
#include <iterator> // for std::size

int main()
{
    // scores are 0 (worst) to 100 (best)
    constexpr int scores[]{ 84, 92, 76, 81, 56 };
    constexpr int numStudents{ static_cast<int>(std::size(scores)) };

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

在本例中，我们使用一个名为 `maxScore` 的非循环变量来跟踪当前的最高分。`maxScore` 被初始化为`0`表示还没有存储任何分数。然后，遍历数组的每个元素，如果发现分数比之前看到的任何分数都高，则将 `maxScore` 设置为该值。因此，`maxScore` 总是表示当前的最大值。当到达数组末尾时，`maxScore` 就是整个数组中的最高分。


## 数组和循环

数组的循环遍历通常被用来完成一下三件事：

1. 计算数值 (例如：平均值或总和)；
2. 查找某个值（例如：最大值、最小值）；
3. 数组排序（例如：升序、降序）。

在计算数值时，变量通常用于保存用于计算最终值的中间结果。在上面的例子中，我们计算一个平均分数，`totalScore` 保存到目前为止所检查的所有元素的总分数。

在查找某个值是，变量通常用来保存到目前为止看到的最佳候选值(或最佳候选值的索引)。在上面的例子中，我们使用一个循环来查找最佳分数，`maxScore` 用于保存到目前为止遇到的最高分数。

数组排序要复杂一些，因为它通常涉及嵌套循环。我们将在下一课中介绍数组排序。


## 数组的”差一“错误

对数组使用循环最棘手的问题之一是确定正确的迭代次数，很容易犯[[Off-by-one|差一错误(Off-by-one)]]。访问大于数组长度的元素可能会产生可怕的后果，考虑下面的代码：


```cpp
#include <iostream>
#include <iterator>

int main()
{
  constexpr int scores[]{ 84, 92, 76, 81, 56 };
  constexpr int numStudents{ static_cast<int>(std::size(scores)) };

  int maxScore{ 0 }; // keep track of our largest score
  for (int student{ 0 }; student <= numStudents; ++student)
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

这个程序的问题是 `for` 循环中的条件是错误的！数组只有 `5` 个元素，索引从 `0` 到 `4` 。但是，这个数组从 `0` 循环到`5` 。因此，在最后一次迭代时，数组将执行如下语句:

```cpp
if (scores[5] > maxScore)
{
    maxScore = scores[5];
}
```


但实际上 `scores[5]` 是未定义的！ 访问它可能会导致各种各样的问题，最有可能的是访问 `scores[5]` 会得到一个*垃圾值*，此时 `maxScore` 将是错误的。

然而，想象一下，如果我们无意中给 `array[5]` 赋了一个值，会发生什么？我们可能会覆盖另一个变量(或它的一部分)，或者可能破坏某些东西——这些类型的bug 是很难定位的！

因此，在循环遍历数组时，一定要反复检查循环条件，以确保不会引入[[Off-by-one|差一错误]]。
