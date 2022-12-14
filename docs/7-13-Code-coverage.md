---
title: 7.13 - 代码覆盖率
alias: 7.13 - 代码覆盖率
origin: /code-coverage/
origin_title: "/code-coverage/"
time: 2022-2-15
type: translation
tags:
- code coverage
---

??? note "Key Takeaway"
	



在 [[7-12-Introduction-to-testing-your-code|7.12 - 代码测试]] 中我们介绍了如何编写和保存测试。在这节课中，我们将探讨哪些测试对于保证程序质量是至关重要的。

## 代码覆盖率

术语代码覆盖率用于描述测试执行时可以运行的程序源代码数量。代码覆盖率有许多不同的度量标准。我们将在接下来的部分中介绍一些更有用和更受欢迎的方法。

## 语句覆盖率

术语语句覆盖率指的是测试例程执行过的代码中语句的百分比。

考虑以下函数：

```cpp
int foo(int x, int y)
{
    int z{ y };
    if (x > y)
    {
        z = x;
    }
    return z;
}
```

调用 `foo(1, 0)` 可以实现该函数语句的完全覆盖，即函数中的每条语句都会执行。

对于 `isLowerVowel()` 函数来说：

```cpp
bool isLowerVowel(char c)
{
    switch (c) // 语句 1
    {
    case 'a':
    case 'e':
    case 'i':
    case 'o':
    case 'u':
        return true; // 语句 2
    default:
        return false; // 语句 3
    }
}
```

这个函数需要两次调用才能实现语句的完全 覆盖，因为语句2和3不可能在一次函数调用中同时执行。

100%的语句覆盖率是很好的指标，但这其实并不足以确保正确性。

## 分支覆盖率

分支覆盖率是指已经执行的分支的百分比，每个可能的分支分别计算。一个' if语句'有两个分支——一个分支在条件为'真'时执行，另一个分支在条件为'假'时执行(即使没有相应的' else语句'要执行)。一个switch语句可以有很多分支。

```cpp
int foo(int x, int y)
{
    int z{ y };
    if (x > y)
    {
        z = x;
    }
    return z;
}
```

在之前的例子中，调用 `foo(1, 0)` 可以实现100%的语句覆盖率，并且测试 `x > y` 的情况，但是分支覆盖率却只有50%。我们需要再调用一次 `foo(0, 1)`，这样就可以测到`if`语句不执行的情况。

```cpp
bool isLowerVowel(char c)
{
    switch (c)
    {
    case 'a':
    case 'e':
    case 'i':
    case 'o':
    case 'u':
        return true;
    default:
        return false;
    }
}
```


在 `isLowerVowel()` 函数中，我们也需要调用两次才能得到100%的分支覆盖率：第一次调用 (例如 `isLowerVowel('a')`) 测试前面的几个case分支，第二次调用(例如 `isLowerVowel('q')`) 来测试`default`分支。能够在一次测试中执行到的分支，不需要分别测试。

考虑下面的函数：
```cpp
void compare(int x, int y)
{
	if (x > y)
		std::cout << x << " is greater than " << y << '\n'; // case 1
	else if (x < y)
		std::cout << x << " is less than " << y << '\n'; // case 2
	else
		std::cout << x << " is equal to " << y << '\n'; // case 3
}
```

该函数需要三次调用才能实现100%分支覆盖：`compare(1, 0)` 测试第一个`if`语句为真的分支，`compare(0, 1)` 测试第一个`if`语句为假且第二个`if`语句为真的分支。`compare(0, 0)` 测试两个`if`语句都为假，执行`else`的分支。执行完这三次测试后，我们就有信心说这个函数被可靠地测试了（三次测试总好过1800亿亿个输入组合吧）。


!!! success "最佳实践"

	100%分支覆盖率是我们的测试目标！

## 循环覆盖率

循环覆盖率(非正式地称为0,1,2测试)指的是，如果你的代码中有一个循环，则应该确保它在迭代0次、1次和2次时正常工作。如果它对2次迭代的情况正确工作，那么它应该对所有大于2次的迭代都正确工作。因此，这三个测试涵盖了所有的可能性(因为循环不能执行负数次)。

考虑下面代码：

```cpp
#include <iostream>

void spam(int timesToPrint)
{
    for (int count{ 0 }; count < timesToPrint; ++count)
         std::cout << "Spam! ";
}
```

COPY

To test the loop within this function properly, you should call it three times: `spam(0)` to test the zero-iteration case, `spam(1)` to test the one-iteration case, and `spam(2)`to test the two-iteration case. If `spam(2)` works, then `spam(n)` should work, where `n > 2`.

!!! success "最佳实践"

	Use the `0, 1, 2 test` to ensure your loops work correctly with different number of iterations.

## 测试不同类别的输入

When writing functions that accept parameters, or when accepting user input, consider what happens with different categories of input. In this context, we’re using the term “category” to mean a set of inputs that have similar characteristics.

For example, if I wrote a function to produce the square root of an integer, what values would it make sense to test it with? You’d probably start with some normal value, like `4`. But it would also be a good idea to test with `0`, and a negative number.

Here are some basic guidelines for category testing:

For integers, make sure you’ve considered how your function handles negative values, zero, and positive values. You should also check for overflow if that’s relevant.

For floating point numbers, make sure you’ve considered how your function handles values that have precision issues (values that are slightly larger or smaller than expected). Good `double` type values to test with are `0.1` and `-0.1` (to test numbers that are slightly larger than expected) and `0.6` and `-0.6` (to test numbers that are slightly smaller than expected).

For strings, make sure you’ve considered how your function handles an empty string (just a null terminator), normal valid strings, strings that have whitespace, and strings that are all whitespace.

If your function takes a pointer, don’t forget to test `nullptr` as well (don’t worry if this doesn’t make sense, we haven’t covered it yet).

!!! success "最佳实践"

	Test different categories of input values to make sure your unit handles them properly.