---
title: 7.12 - 代码测试
alias: 7.12 - 代码测试
origin: /introduction-to-testing-your-code/
origin_title: "7.12 — Introduction to testing your code"
time: 2021-10-23
type: translation
tags:
- testing
---

??? note "Key Takeaway"
	


当程序可以编译，甚至可以运行后，还有什么工作需要做呢？

这要看情况。如果该程序只运行一次并被丢弃，那么不需要做其他事情了。在这种情况下，你的程序是否能适用于所有情况可能并不重要——如果它能满足你当前任务的需要，并且你也只需要运行它一次，那么任务就已经完成了。

如果你的程序完全是线性的(没有条件，如“If语句”或“switch语句”)，不接受输入，并产生正确的答案，那么你就完成了。在本例中，你已经通过运行和验证输出测试了整个程序。

但更有可能的情况是，你的程序需要被多次运行，而且该程序使用循环和条件逻辑，能够接受某种类型的用户输入。你可能已经编写了可以在将来的其他程序中重用的函数，也可能经添加了一些最初没有计划的新功能。也许还打算将这个程序分发给其他人(用户可能会做出你意料之外的操作)。在这种情况下，我们必须验证程序在各种各样的条件下都能正确工作——这需要测试来保证。

仅仅因为你的程序适用于一组输入并不意味着它在所有情况下都能正确工作。

软件验证(也称为软件测试)是确定软件在所有情况下是否按预期工作的过程。

## 有关测试的难题

在讨论测试代码的实用方法之前，让我们先谈谈为什么全面测试程序并不容易。

考虑这个简单的程序：

```cpp
#include <iostream>

void compare(int x, int y)
{
    if (x > y)
        std::cout << x << " is greater than " << y << '\n'; // case 1
    else if (x < y)
        std::cout << x << " is less than " << y << '\n'; // case 2
    else
        std::cout << x << " is equal to " << y << '\n'; // case 3
}

int main()
{
    std::cout << "Enter a number: ";
    int x{};
    std::cin >> x;

    std::cout << "Enter another number: ";
    int y{};
    std::cin >> y;

    compare(x, y);

    return 0;
}
```

假设有一个4字节的整数，用每种可能的输入组合显式地测试这个程序将需要运行程序18,446,744,073,709,551,616次(~18亿亿次)。显然这是不可行的。

当程序要求用户输入或者在代码中存在条件判断时，程序可以执行的方式的就相应地变多了。除了最简单的程序之外，几乎不可能显式地测试每种输入组合。

现在，直觉告诉我们，其实并不需要真的运行程序18亿亿次才能确保它可以正确工作。你可以合理地得出结论，如果情况1适用于一对 `x` 和`y` 值，其中 `x > y` ，那么它应该适用于任何一对满足 `x>y` 的 `x` 和 `y` 组合。鉴于此，程序实际上只需要运行这个大约三次(在函数 `compare()` 中分别运行一次)，就可以高度确信它能按预期工作。为了使测试易于管理，我们还可以使用其他类似的技巧来大幅减少测试的次数。

关于测试方法有很多东西可以写——事实上，我们可以为此写一整章。但由于这不是C++教程应该关注的事情，所以我们只会简单介绍作为程序员应该如何测试自己的代码。在接下来的几个小节中，我们将讨论一些在测试代码时应该考虑的实际问题。

## 化整为零进行测试

Consider an auto manufacturer that is building a custom concept car. Which of the following do you think they do?  
a) Build (or buy) and test each car component individually before installing it. Once the component has been proven to work, integrate it into the car and retest it to make sure the integration worked. At the end, test the whole car, as a final validation that everything seems good.  
b) Build a car out of all of the components all in one go, then test the whole thing for the first time right at the end.

It probably seems obvious that option a) is a better choice. And yet, many new programmers write code like option b)!

In case b), if any of the car parts were to not work as expected, the mechanic would have to diagnose the entire car to determine what was wrong -- the issue could be anywhere. A symptom might have many causes -- for example, is the car not starting due to a faulty spark plug, battery, fuel pump, or something else? This leads to lots of wasted time trying to identify exactly where the problems are, and what to do about them. And if a problem is found, the consequences can be disastrous -- a change in one area might cause “ripple effects” (changes) in multiple other places. For example, a fuel pump that is too small might lead to an engine redesign, which leads to a redesign of the car frame. In the worst case, you might end up redesigning a huge part of the car, just to accommodate what was initially a small issue!

In case a), the company tests as they go. If any component is bad right out of the box, they’ll know immediately and can fix/replace it. Nothing is integrated into the car until it’s proven working by itself, and then that part is retested again as soon as it’s been integrated into the car. This way any unexpected issues are discovered as early as possible, while they are still small problems that can be easily fixed.

By the time they get around to having the whole car assembled, they should have reasonable confidence that the car will work -- after all, all the parts have been tested in isolation and when initially integrated. It’s still possible that unexpected issues will be found at this point, but that risk is minimized by all the prior testing.

The above analogy holds true for programs as well, though for some reason, new programmers often don’t realize it. You’re much better off writing small functions (or classes), and then compiling and testing them immediately. That way, if you make a mistake, you’ll know it has to be in the small amount of code that you changed since the last time you compiled/tested. That means fewer places to look, and far less time spent debugging.

Testing a small part of your code in isolation to ensure that “unit” of code is correct is called unit testing. Each unit test is designed to ensure that a particular behavior of the unit is correct.

!!! success "最佳实践"

	Write your program in small, well defined units (functions or classes), compile often, and test your code as you go.

If the program is short and accepts user input, trying a variety of user inputs might be sufficient. But as programs get longer and longer, this becomes less sufficient, and there is more value in testing individual functions or classes before integrating them into the rest of the program.

So how can we test our code in units?

## 非正式测试

One way you can test code is to do informal testing as you write the program. After writing a unit of code (a function, a class, or some other discrete “package” of code), you can write some code to test the unit that was just added, and then erase the test once the test passes. As an example, for the following isLowerVowel() function, you might write the following code:

```cpp
#include <iostream>

// We want to test the following function
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

int main()
{
    // So here's our temporary tests to validate it works
    std::cout << isLowerVowel('a'); // temporary test code, should produce 1
    std::cout << isLowerVowel('q'); // temporary test code, should produce 0

    return 0;
}
```

COPY

If the results come back as `1` and `0`, then you’re good to go. You know your function works for some basic cases, and you can reasonably infer by looking at the code that it will work for the cases you didn’t test (‘e’, ‘i’, ‘o’, and ‘u’). So you can erase that temporary test code, and continue programming.

## 保存测试

Although writing temporary tests is a quick and easy way to test some code, it doesn’t account for the fact that at some point, you may want to test that same code again later. Perhaps you modified a function to add a new capability, and want to make sure you didn’t break anything that was already working. For that reason, it can make more sense to preserve your tests so they can be run again in the future. For example, instead of erasing your temporary test code, you could move the tests into a testVowel() function:

```cpp
#include <iostream>

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

// Not called from anywhere right now
// But here if you want to retest things later
void testVowel()
{
    std::cout << isLowerVowel('a'); // temporary test code, should produce 1
    std::cout << isLowerVowel('q'); // temporary test code, should produce 0
}

int main()
{
    return 0;
}
```

As you create more tests, you can simply add them to the `testVowel()` function.

## 自动化测试

上述测试函数的一个问题是，它依赖于你在运行时手动验证结果。这要求你要记住期望的结果是什么(假设您没有记录它)，并手动将实际结果与预期结果进行比较。

我们可以通过编写一个包含测试和预期答案的测试函数来做得更好，这样我们就不必对它们进行人工比较了。


```cpp
#include <iostream>

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

// returns the number of the test that failed, or 0 if all tests passed
int testVowel()
{
    if (isLowerVowel('a') != true) return 1;
    if (isLowerVowel('q') != false) return 2;

    return 0;
}

int main()
{
    return 0;
}
```

COPY

Now, you can call `testVowel()` at any time to re-prove that you haven’t broken anything, and the test routine will do all the work for you, returning either an “all good” signal (return value `0`), or the test number that didn’t pass, so you can investigate why it broke. This is particularly useful when going back and modifying old code, to ensure you haven’t accidentally broken anything!

## 单元测试框架


因为编写函数来执行其他函数是非常常见和有用的需求，所以有一些完整的框架(称为单元测试框架)旨在帮助简化编写、维护和执行单元测试的过程。因为这些涉及到第三方软件，所以我们在这里不做介绍，但是你应该知道它们的存在。

## 集成测试

一旦程序的每个单元都单独测试过，它们就可以被集成到你的程序中，并重新测试，以确保它们被正确地集成了。这就是所谓的集成测试。集成测试往往更加复杂——目前，运行几次程序并抽检集成单元的行为就足够了。