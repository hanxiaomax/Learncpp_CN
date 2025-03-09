---
title: 13.18 - 对程序进行计时
alias: 13.18 - 对程序进行计时
origin: /timing-your-code/
origin_title: "13.18 — Timing your code"
time: 2022-9-16
type: translation
tags:
- class
- friend
---

在编写代码时，有时候我们需要判断一个方法的性能是否满足要求。此时应该如何判断呢？

一个简单的方法是计算代码的运行时间。C++ 11在 `chrono` 库中提供了一些功能用于实现计时。然而，使用 `chrono` 库有点复杂，不过我们可以将所有需要的计时功能封装到一个类中，然后在我们自己的程序中使用该类。

下面是计时类的例子：

```cpp
#include <chrono> // for std::chrono functions

class Timer
{
private:
	// 类型别名，方便访问嵌套类型
	using Clock = std::chrono::steady_clock;
	using Second = std::chrono::duration<double, std::ratio<1> >;

	std::chrono::time_point<Clock> m_beg { Clock::now() };//非静态成员默认初始化

public:
	void reset()
	{
		m_beg = Clock::now();
	}

	double elapsed() const
	{
		return std::chrono::duration_cast<Second>(Clock::now() - m_beg).count();
	}
};
```

就是这样！要使用它，我们需要在主函数的顶部实例化一个`Timer`对象(或者在任何需要计时的地方)，然后在我们想知道程序运行到那个点花了多长时间的时候调用elapsed()成员函数。


```cpp
#include <iostream>

int main()
{
    Timer t;

    // Code to time goes here

    std::cout << "Time elapsed: " << t.elapsed() << " seconds\n";

    return 0;
}
```

现在，让我们在一个实际的例子中使用它，我们对一个包含10000个元素的数组进行排序。首先，使用我们在前一章开发的选择排序算法:

```cpp
#include <array>
#include <chrono> // for std::chrono functions
#include <cstddef> // for std::size_t
#include <iostream>
#include <numeric> // for std::iota

const int g_arrayElements { 10000 };

class Timer
{
private:
    // Type aliases to make accessing nested type easier
    using Clock = std::chrono::steady_clock;
    using Second = std::chrono::duration<double, std::ratio<1> >;

    std::chrono::time_point<Clock> m_beg{ Clock::now() };

public:

    void reset()
    {
        m_beg = Clock::now();
    }

    double elapsed() const
    {
        return std::chrono::duration_cast<Second>(Clock::now() - m_beg).count();
    }
};

void sortArray(std::array<int, g_arrayElements>& array)
{

    // Step through each element of the array
    // (except the last one, which will already be sorted by the time we get there)
    for (std::size_t startIndex{ 0 }; startIndex < (g_arrayElements - 1); ++startIndex)
    {
        // smallestIndex is the index of the smallest element we’ve encountered this iteration
        // Start by assuming the smallest element is the first element of this iteration
        std::size_t smallestIndex{ startIndex };

        // Then look for a smaller element in the rest of the array
        for (std::size_t currentIndex{ startIndex + 1 }; currentIndex < g_arrayElements; ++currentIndex)
        {
            // If we've found an element that is smaller than our previously found smallest
            if (array[currentIndex] < array[smallestIndex])
            {
                // then keep track of it
                smallestIndex = currentIndex;
            }
        }

        // smallestIndex is now the smallest element in the remaining array
        // swap our start element with our smallest element (this sorts it into the correct place)
        std::swap(array[startIndex], array[smallestIndex]);
    }
}

int main()
{
    std::array<int, g_arrayElements> array;
    std::iota(array.rbegin(), array.rend(), 1); // fill the array with values 10000 to 1

    Timer t;

    sortArray(array);

    std::cout << "Time taken: " << t.elapsed() << " seconds\n";

    return 0;
}
```

在作者的机器上，三次运行产生的时间分别为0.0507、0.0506和0.0498。因此排序的耗时差不多0.05秒。

现在，让我们使用标准库中的`std::sort`进行相同的测试。

```cpp
#include <algorithm> // for std::sort
#include <array>
#include <chrono> // for std::chrono functions
#include <cstddef> // for std::size_t
#include <iostream>
#include <numeric> // for std::iota

const int g_arrayElements { 10000 };

class Timer
{
private:
    // Type aliases to make accessing nested type easier
    using Clock = std::chrono::steady_clock;
    using Second = std::chrono::duration<double, std::ratio<1> >;

    std::chrono::time_point<Clock> m_beg{ Clock::now() };

public:

    void reset()
    {
        m_beg = Clock::now();
    }

    double elapsed() const
    {
        return std::chrono::duration_cast<Second>(Clock::now() - m_beg).count();
    }
};

int main()
{
    std::array<int, g_arrayElements> array;
    std::iota(array.rbegin(), array.rend(), 1); // fill the array with values 10000 to 1

    Timer t;

    std::ranges::sort(array); // Since C++20
    // If your compiler isn't C++20-capable
    // std::sort(array.begin(), array.end());

    std::cout << "Time taken: " << t.elapsed() << " seconds\n";

    return 0;
}
```

在作者的机器上，运行结果是:0.000693,0.000692和0.000699。基本上在0.0007左右。

换句话说，在本例中，`std::sort`比我们自己编写的选择排序快100倍!


## 关于计时的几点注意事项

计时并不复杂，但其结果会受到很多因素的影响，知道这些因素是什么很重要。

首先，确保你使用的是release版本，而不是debug版本的程序。debug版本的程序会关闭优化，而优化可能会对结果产生重大影响。例如，使用debug版本时，在作者的机器上运行上面的`std::sort`示例花了0.0235秒——慢了33倍!

其次，计时结果会受到系统在后台可能执行的其他操作的影响。为了达到最好的效果，确保你的系统没有做任何CPU或内存密集型的事情(例如玩游戏)或硬盘密集型的事情(例如搜索文件或运行防病毒扫描)。

然后测量至少3次。如果结果都相似，取平均值。如果有一两个结果不同，则再运行程序几次，直到您更好地了解哪些是异常值。需要注意的是，有时候一些看上去无伤大雅的事情翻到会严重影响结果的正确性。例如，你的浏览器之前打开了一个网站，当该网站在后台轮换广告页面时，它需要解析一堆javascript，此时可能会暂时将你的CPU利用率提高到100%。多次运行有助于识别初始运行是否受到了此类事件的影响。

第三，当在两组代码之间进行比较时，要警惕在运行之间可能会影响计时的变化。你的系统可能在后台启动了反病毒扫描，或者你现在正在流媒体音乐，而你之前没有。随机化也会影响时间。如果我们对一个充满随机数的数组进行排序，结果可能会受到随机化的影响。这种情况下，也是仍然可以使用随机化的，但要确保使用固定的种子(例如，不要使用系统时钟)，这样每次运行的随机化都是相同的。另外，确保你没有对等待用户输入进行计时，因为用户输入所需的时间不应该是你计时考虑的一部分。
