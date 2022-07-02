---
title: 11.4 - 数组排序之选择排序
alias: 11.4 - 数组排序之选择排序
origin: /sorting-an-array-using-selection-sort/
origin_title: "11.4 — Sorting an array using selection sort"
time: 2022-4-8
type: translation
tags:
- array
- sort
---

??? note "关键点速记"
	
## 排序
数组排序是将数组中所有元素按特定顺序排列的过程。排序在很多时候都是有用的。例如，电子邮件程序通常需要按照收件时间顺序显示电子邮件，因为最新的电子邮件通常被认为当前需要关注的。当你打开你的联系人列表时，名字通常是按字母顺序排列的，因为这样更容易找到你要找的名字。这两个例子都涉及在显示数据之前对其进行排序。

对数组进行排序可以提高搜索数组的效率，不仅对人类，对计算机也是如此。例如，考虑这样一种情况，我们想知道一个名字是否出现在一个名字列表中。为了查看名称是否在列表中，我们必须检查数组中的每个元素，以确定名称是否出现。对于包含许多元素的数组，搜索所有元素的开销可能很大。

但是，现在假设我们的名称数组是按字母顺序排序的。在本例中，我们只需要搜索到在字母顺序上比我们要查找的名称大的名称。这时，如果我们还没有找到这个名字，我们就知道它不存在于数组的其他部分，因为我们在数组中没有看到的所有名字都保证在字母顺序上更大!

其实还有更好的算法来搜索排序数组。使用一个简单的算法，我们可以搜索一个包含1,000,000个元素的排序数组，只需要进行20次比较!当然，其缺点是对数组进行排序的代价相对较高，而且通常不值得为了快速搜索而对数组进行排序，除非您要多次搜索它。

在某些情况下，对数组进行排序后就不需要再搜索了。例如，我们想找到最好的考试成绩。如果数组是无序的，我们必须遍历数组中的每个元素，以找到最大的测试分数。如果列表是排序的，最好的测试分数将在第一个或最后一个位置(取决于我们是按升序还是降序排序)，所以我们根本不需要搜索!


## 排序的原理

排序通常是通过反复比较数组元素对来执行的，如果它们满足某些预定义的条件，则交换它们。根据使用的排序算法的不同，比较这些元素的顺序也不同。标准取决于列表将如何排序(例如，升序或降序)。

要交换两个元素，可以使用c++标准库中的`std::swap()`函数，该函数在`<utility>`头文件中定义。

```cpp
#include <iostream>
#include <utility>

int main()
{
    int x{ 2 };
    int y{ 4 };
    std::cout << "Before swap: x = " << x << ", y = " << y << '\n';
    std::swap(x, y); // swap the values of x and y
    std::cout << "After swap:  x = " << x << ", y = " << y << '\n';

    return 0;
}
```

程序打印结果如下：

```
Before swap: x = 2, y = 4
After swap:  x = 4, y = 2
```

注意，使用`swap`后，`x`和`y`的值就被交换了！

## 选择排序
有很多方法可以对数组进行排序。**选择排序**可能是最容易理解的排序，这使它很适合作为教学示例（尽管它的排序速度并不快）。

选择排序的步骤如下（从小到大排序）：

1.  从索引 0开始，遍历数组查找最小的值；
2.  交换最小值和索引位置为 0 的元素；
3.  移动到下一个索引重复上述步骤。

换句话说，我们要找到数组中最小的元素，然后把它交换到第一个位置。然后我们要找到下一个最小的元素，然后把它交换到第二个位置。这个过程将重复进行，直到耗尽所有元素。

下面是一个关于5个元素的算法的例子。让我们从一个示例数组开始

{ 30, 50, 20, 10, 40 }

从索引 0 开始，找到最小的元素

{ 30, 50, 20, **10**, 40 }

交换到索引 0 的位置

{ **10**, 50, 20, **30**, 40 }

第一个元素已经排序完成，后面就不用管了。然后从索引 1 开始，继续查找最小的元素：

{ _10_, 50, **20**, 30, 40 }

将找到的值交换到索引 1 的位置：

{ _10_, **20**, **50**, 30, 40 }

现在我们可以忽略前两个元素。找到从索引2开始的最小元素：

{ _10_, _20_, 50, **30**, 40 }

然后将它与索引2中的元素交换：

{ _10_, _20_, **30**, **50**, 40 }

找到从索引3开始的最小元素：

{ _10_, _20_, _30_, 50, **40** }

然后将它与索引3中的元素交换：

{ _10_, _20_, _30_, **40**, **50** }

最后，找到从索引4开始的最小元素：

{ _10_, _20_, _30_, _40_, **50** }

然后将它与索引4中的元素交换(实际上什么也没做)：

{ _10_, _20_, _30_, _40_, **50** }

完成！

{ 10, 20, 30, 40, 50 }

注意，最后一次比较总是与自身进行比较(这是冗余的)，因此我们实际上可以在数组结束前停止1个元素。


## C++ 中的选择排序

C++ 的实现：
```cpp
#include <iostream>
#include <iterator>
#include <utility>

int main()
{
	int array[]{ 30, 50, 20, 10, 40 };
	constexpr int length{ static_cast<int>(std::size(array)) };

	// Step through each element of the array
	// (except the last one, which will already be sorted by the time we get there)
	for (int startIndex{ 0 }; startIndex < length - 1; ++startIndex)
	{
		// smallestIndex is the index of the smallest element we’ve encountered this iteration
		// Start by assuming the smallest element is the first element of this iteration
		int smallestIndex{ startIndex };

		// Then look for a smaller element in the rest of the array
		for (int currentIndex{ startIndex + 1 }; currentIndex < length; ++currentIndex)
		{
			// If we've found an element that is smaller than our previously found smallest
			if (array[currentIndex] < array[smallestIndex])
				// then keep track of it
				smallestIndex = currentIndex;
		}

		// smallestIndex is now the smallest element in the remaining array
                // swap our start element with our smallest element (this sorts it into the correct place)
		std::swap(array[startIndex], array[smallestIndex]);
	}

	// Now that the whole array is sorted, print our sorted array as proof it works
	for (int index{ 0 }; index < length; ++index)
		std::cout << array[index] << ' ';

	std::cout << '\n';

	return 0;
}
```

这个算法最令人困惑的部分是一个循环中的循环(称为**嵌套循环**)。外层循环(startIndex)逐个遍历每个元素。对于外层循环的每次迭代，使用内部循环(currentIndex)查找剩余数组中最小的元素(从startIndex+1开始)。smallstindex跟踪内部循环找到的最小元素的索引。然后用startIndex交换smallstindex。最后，外层循环(startIndex)前进一个元素，然后重复这个过程。

提示:如果您在弄清楚上述程序如何工作方面有困难，那么在一张纸上完成一个示例案例会很有帮助。在纸张的顶部水平写入起始(未排序)数组元素。画箭头表示startIndex、currentIndex和smallstindex正在索引哪些元素。手动跟踪整个程序，并在索引变化时重新绘制箭头。对于外层循环的每次迭代，开始一个新行，显示数组的当前状态。

名称的排序使用相同的算法。只需将数组类型从 `int` 改为`std::string`，并使用适当的值初始化即可。

## `std::sort`

因为数组的排序非常常见，C++标准库中包含了一个名为 `std::sort`的排序函数。`std::sort` 位于`<algorithm>`头文件中，可以像这样在数组中调用：

```cpp
#include <algorithm> // for std::sort
#include <iostream>
#include <iterator> // for std::size

int main()
{
	int array[]{ 30, 50, 20, 10, 40 };

	std::sort(std::begin(array), std::end(array));

	for (int i{ 0 }; i < static_cast<int>(std::size(array)); ++i)
		std::cout << array[i] << ' ';

	std::cout << '\n';

	return 0;
}
```


默认情况下，`std::sort` 按升序排序，使用`operator<` 比较元素对，并在必要时交换它们(很像上面的选择排序示例所做的)。

我们将在以后的章节中更多地讨论`std::sort`。

