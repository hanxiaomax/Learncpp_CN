---
title: 5.6 - 关系运算符和浮点数比较
alias: 5.6 - 关系运算符和浮点数比较
origin: /relational-operators-and-floating-point-comparisons/
origin_title: "5.6 -- Relational operators and floating point comparisons"
time: 2022-4-26
type: translation
tags:
- operator
- float point
---

??? note "关键点速记"

	- 请避免对浮点数使用 `operator==` 和 `operator!=`。

关系运算符指的是那些允许我们比较两个数的运算符，这类运算符有 6 个：

|运算符	|符号	|形式	|操作|
|----|----|----|----|
|大于	|>	|x > y	| 如果 x 大于 y，则返回 true，否则为 false|
|小于	|<	|x < y	| 如果 x 小于 y，则返回 true，否则为 false|
|大于等于	|>=	|x >= y	|如果 x 大于等于 y，则返回 true，否则为 false|
|小于等于	|<=	|x <= y	|如果 x 小于等于 y，则返回 true，否则为 false|
|相等	|==	|x == y	|如果 x 相等 y，则返回 true，否则为 false|
|不等	|!=	|x != y	|如果 x 不等 y，则返回 true，否则为 false|


这里面大多数运算符如何工作，相比你已经见识过了，而且都非常符合常识。这些操作符的求值结果只会是 `true (1)` 或 `false (0)` 两种。

下面例程展示了它们的使用方法：

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter an integer: ";
    int x{};
    std::cin >> x;

    std::cout << "Enter another integer: ";
    int y{};
    std::cin >> y;

    if (x == y)
        std::cout << x << " equals " << y << '\n';
    if (x != y)
        std::cout << x << " does not equal " << y << '\n';
    if (x > y)
        std::cout << x << " is greater than " << y << '\n';
    if (x < y)
        std::cout << x << " is less than " << y << '\n';
    if (x >= y)
        std::cout << x << " is greater than or equal to " << y << '\n';
    if (x <= y)
        std::cout << x << " is less than or equal to " << y << '\n';

    return 0;
}
```

运行结果如下：

```
Enter an integer: 4
Enter another integer: 5
4 does not equal 5
4 is less than 5
4 is less than or equal to 5
```

在对整型进行比较的时候，这些运算符都非常简单。


## 布尔条件值

默认情况下，_if_ 语句或*条件运算符* （以及其他一些特殊场景下）中的条件求值结果总是布尔类型的值。

很多程序员会使用下面的写法：

```cpp
if (b1 == true) ...
```

但是这种写法有些冗余，因为`== true` 并没有为这个条件添加任何值，所以我们可以这么写：

```cpp
if (b1) ...
```

同样的，下面的代码：

```cpp
if (b1 == false) ...
```

最好写成这样：

```cpp
if (!b1) ...
```

!!! success "最佳实践"

	不要为条件添加没必要的 `==` 或 `!=` ，如果没有其他的值则会让可读性变得更差
	

## 对浮点数进行比较可能会带来问题

考虑下面的程序：

```cpp
#include <iostream>

int main()
{
    double d1{ 100.0 - 99.99 }; // 应该等于 0.01
    double d2{ 10.0 - 9.99 }; // 应该等于 0.01

    if (d1 == d2)
        std::cout << "d1 == d2" << '\n';
    else if (d1 > d2)
        std::cout << "d1 > d2" << '\n';
    else if (d1 < d2)
        std::cout << "d1 < d2" << '\n';

    return 0;
}
```

变量 d1 和 d2 应该都等于 _0.01_。但是你对它们比较的话，将会产生令人意外的结果：

```
d1 > d2
```

如果你使用调试器来查看两个变量，则 `d1 = 0.0100000000000005116` 和 `d2 = 0.0099999999999997868`。这两个值都接近于 0.01，但是 d1 比 0.1 大，d2 则比 0.1 小。

如果你需要很高的精度，则对浮点数使用上述比较运算符是很危险的。这是因为浮点数并不精确，很小的[[rounding-error|舍入误差]]都有可能造成上述意外情况。 我们在 [[4-8-Floating-point-numbers|4.8 - 浮点数]] 中介绍了舍入误差的问题。

当大于小于号(`<`, `<=`, `>` 和 `>=`) 每用在浮点数比较时，通常是可以得到正确结果的（除非两个数非常接近）。因此，对浮点数使用使用此类比较运算符是可以接受的，只有当两个数非常接近的时候才有可能得到错误的结果。

例如，考虑我们在设计一个游戏（比方说《太空侵略者》），此时你需要判断两个物体是否会相交（比如说导弹和外星人）。当两个物体相距甚远时，这些比较运算符可以返回正确的结果。当两个物体已经非常接近时，那你其实已经得到结果了，即使比较的结论是错误的，你可能也不会注意到（看上去是在非常近的举例命中或丢失了），也不会对你的游戏造成严重的影响。


## 浮点值相等

相等运算符(`==` 和 `!=`) 的麻烦就比较大。对于运算符 `operator==`，它只有在两个操作数完全相等时才返回 `true`。因为很小的舍入误差就会使两个浮点数不等，所以 `operator==` 有非常大的可能在你认为应该返回 `true` 的时候返回 `false`。`Operator!=` 也有类似的问题。

因此，请避免对浮点数使用这两种运算符。

!!! warning "注意"

	请避免对浮点数使用 `operator==` 和 `operator!=`。

## 比较浮点数 （扩展阅读）

那么，对两个浮点数进行比较的合理方法是什么呢？

判断浮点数是否相等的常用方法，是使用一个函数来判断两种是不是*非常接近*。只要非常接近，我们就可以称其 *”相等“*。表示”非常接近“的传统方法是使用epsilon。它通常会被定义为一个非常小的正数（例如，*0.00000001* 有时候写作 *1e-8*）。

新手程序员通常会使用自己定义的”非常接近“函数，例如：

```cpp
#include <cmath> // for std::abs()

// epsilon is an absolute value
bool approximatelyEqualAbs(double a, double b, double absEpsilon)
{
    // if the distance between a and b is less than absEpsilon, then a and b are "close enough"
    return std::abs(a - b) <= absEpsilon;
}
```


`std::abs()` 是 `<cmath>` 头文件中定义的函数，它返回的是其[[arguments|实参]]的绝对值。`std::abs(a - b) <= absEpsilon` 会检查 a 和 b 的差的绝对值是否小于传入的任何表示很接近值的 "epsilon"。如果 a 和 b 足够接近，则函数会返回 true，表示它们相等，否则则返回 false。

尽管这个函数确实可用，但并不是最佳的解决方案。_0.00001_ 对于1.0左右的输入是合适的，但是对于 _0.0000001_ 左右的数就太大了，而对于 _10000_ 这样的输入又太小了。

!!! cite "题外话"

    如果我们说，当两个数的差距小于 0.00001 时，它们就能被看做是相同的数，那么：
    
	-   1 和 1.0001 是不同的，但是 1 和 1.00001 则是相同的，这并不合理；
	-   0.0000001 和 0.00001 是相同的，这看起来并不合理，比较它们差了一个数量级；
	-   10000 和 10000.00001 则是不同的，这看起来也并不合理，考虑到这两个数的数量级，有这么小的差异被看做是不同的两个数显然不合理。

这也意味着，每次调用该函数的时候，我们都必须为输入的值挑选一个合适的 epsilon 值。既然我们已经知道了 epsilon 的值需要根据输入数据的数量级变化，那么我们就应该通过修改函数来使其自动为我们完成这个工作。

[Donald Knuth](https://en.wikipedia.org/wiki/Donald_Knuth)是一个著名的计算机科学家，他在他的著作 “The Art of Computer Programming, Volume II: Seminumerical Algorithms (Addison-Wesley, 1969)”:

```cpp
#include <algorithm> // std::max
#include <cmath> // std::abs

// return true if the difference between a and b is within epsilon percent of the larger of a and b
bool approximatelyEqualRel(double a, double b, double relEpsilon)
{
    return (std::abs(a - b) <= (std::max(std::abs(a), std::abs(b)) * relEpsilon));
}
```


In this case, instead of epsilon being an absolute number, epsilon is now relative to the magnitude of _a_ or _b_.

Let’s examine in more detail how this crazy looking function works. On the left side of the `<= operator`, `std::abs(a - b)` tells us the distance between _a_ and _b_ as a positive number.

On the right side of the `<= operator`, we need to calculate the largest value of “close enough” we’re willing to accept. To do this, the algorithm chooses the larger of _a_ and _b_ (as a rough indicator of the overall magnitude of the numbers), and then multiplies it by relEpsilon. In this function, relEpsilon represents a percentage. For example, if we want to say “close enough” means _a_ and _b_ are within 1% of the larger of _a_ and _b_, we pass in an relEpsilon of 0.01 (1% = 1/100 = 0.01). The value for relEpsilon can be adjusted to whatever is most appropriate for the circumstances (e.g. an epsilon of 0.002 means within 0.2%).

To do inequality (`!=`) instead of equality, simply call this function and use the logical NOT operator (`!`) to flip the result:

```cpp
if (!approximatelyEqualRel(a, b, 0.001))
    std::cout << a << " is not equal to " << b << '\n';
```

Note that while the `approximatelyEqual()` function will work for most cases, it is not perfect, especially as the numbers approach zero:

```cpp
#include <algorithm>
#include <cmath>
#include <iostream>

// return true if the difference between a and b is within epsilon percent of the larger of a and b
bool approximatelyEqualRel(double a, double b, double relEpsilon)
{
	return (std::abs(a - b) <= (std::max(std::abs(a), std::abs(b)) * relEpsilon));
}

int main()
{
	// a is really close to 1.0, but has rounding errors, so it's slightly smaller than 1.0
	double a{ 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 };

	// First, let's compare a (almost 1.0) to 1.0.
	std::cout << approximatelyEqualRel(a, 1.0, 1e-8) << '\n';

	// Second, let's compare a-1.0 (almost 0.0) to 0.0
	std::cout << approximatelyEqualRel(a-1.0, 0.0, 1e-8) << '\n';
}
```


Perhaps surprisingly, this returns:

```
1
0
```

The second call didn’t perform as expected. The math simply breaks down close to zero.

One way to avoid this is to use both an absolute epsilon (as we did in the first approach) and a relative epsilon (as we did in Knuth’s approach):

```cpp
// return true if the difference between a and b is less than absEpsilon, or within relEpsilon percent of the larger of a and b
bool approximatelyEqualAbsRel(double a, double b, double absEpsilon, double relEpsilon)
{
    // Check if the numbers are really close -- needed when comparing numbers near zero.
    double diff{ std::abs(a - b) };
    if (diff <= absEpsilon)
        return true;

    // Otherwise fall back to Knuth's algorithm
    return (diff <= (std::max(std::abs(a), std::abs(b)) * relEpsilon));
}
```


In this algorithm, we first check if _a_ and _b_ are close together in absolute terms, which handles the case where _a_ and _b_ are both close to zero. The _absEpsilon_ parameter should be set to something very small (e.g. *1e-12*). If that fails, then we fall back to Knuth’s algorithm, using the relative epsilon.

Here’s our previous code testing both algorithms:

```cpp
#include <algorithm>
#include <cmath>
#include <iostream>

// return true if the difference between a and b is within epsilon percent of the larger of a and b
bool approximatelyEqualRel(double a, double b, double relEpsilon)
{
	return (std::abs(a - b) <= (std::max(std::abs(a), std::abs(b)) * relEpsilon));
}

bool approximatelyEqualAbsRel(double a, double b, double absEpsilon, double relEpsilon)
{
    // Check if the numbers are really close -- needed when comparing numbers near zero.
    double diff{ std::abs(a - b) };
    if (diff <= absEpsilon)
        return true;

    // Otherwise fall back to Knuth's algorithm
    return (diff <= (std::max(std::abs(a), std::abs(b)) * relEpsilon));
}

int main()
{
    // a is really close to 1.0, but has rounding errors
    double a{ 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 };

    std::cout << approximatelyEqualRel(a, 1.0, 1e-8) << '\n';     // compare "almost 1.0" to 1.0
    std::cout << approximatelyEqualRel(a-1.0, 0.0, 1e-8) << '\n'; // compare "almost 0.0" to 0.0

    std::cout << approximatelyEqualAbsRel(a, 1.0, 1e-12, 1e-8) << '\n'; // compare "almost 1.0" to 1.0
    std::cout << approximatelyEqualAbsRel(a-1.0, 0.0, 1e-12, 1e-8) << '\n'; // compare "almost 0.0" to 0.0
}
```

COPY

```
1
0
1
1
```

You can see that `approximatelyEqualAbsRel()` handles the small inputs correctly.

Comparison of floating point numbers is a difficult topic, and there’s no “one size fits all” algorithm that works for every case. However, the `approximatelyEqualAbsRel()` with an absEpsilon of *1e-12* and a relEpsilon of *1e-8* should be good enough to handle most cases you’ll encounter.