---
title: 3.2 - 代码调试步骤
alias: 3.2 - 代码调试步骤
origin: /the-debugging-process/
origin_title: "3.2 — The debugging process"
time: 2020-2-1
type: translation
tags:
- debugging
---

假设你编写了一个程序，它不能正常工作——代码编译没问题，但是运行的结果不正确。那么你一定在什么地方写了有语义错误的代码。此时应该如何定位问题的原因呢？如果你一直遵循最佳实践，编写少量代码并进行测试，那么可能很清楚错误会发生在哪里，否则你可能很难一下找到问题的原因。

所有的bug都有一个简单的前提——即你以为的并不是你以为的。实际上，找出错误在哪里是很有挑战性的。在这一课中，我们将概述调试程序的一般过程。

因为我们还没有涉及到那么多的C++主题，本章中的示例程序将是相当基础的。这可能会让我们在这里展示的一些技术显得多余。但是，请记住，这些技术是为更大、更复杂的程序而设计的，在这样的代码中(这是你最需要它们的地方)会更有用。

## 代码排错的一般方法

一旦确定了问题，代码排错通常包括五个步骤:

1. 找出问题的根本原因(通常是无法工作的代码行)；
2. 确保你了解问题发生的原因；
3. 决定如何解决这个问题；
4. 修复引起问题的问题；
5. 重新测试，以确保问题已被修复，且没有出现新问题。

让我们打一个现实生活的比喻。假设有一天晚上，你从冰箱里的制冰机里取冰，把杯子放在出口处，按下按钮后声明都没有出来。哦哦，出问题了！此时你会怎么做？你可能会开始检查及其，看看是否可以确定问题的根本原因。

**找到问题的根因**： 既然你听到了制冰机试图送冰的声音，那很可能不是送冰装置本身。所以你打开冰箱，检查冰盘。没有冰。这是问题的根本原因吗？不，这是一种现象。在进一步检查之后，你确定制冰机似乎没有在制冰。是制冰机出了问题还是别的什么问题？冰箱仍然是冷的，水管没有堵塞，其他一切似乎都在工作，所以你得出结论，根本原因是制冰机坏了。

**理解问题**：在本例中，这很简单。坏了的制冰机制不出冰。

**确定修复方法**： 此时，你有几个解决方案：一是可以绕过这个问题(从商店购买袋装冰)。或者你可以试着进一步诊断制冰机，看看是否有零件需要修复。三是你可以买一个新的制冰机，把它安装在现有的那个地方。你决定买一个新的制冰机。

**修复问题**：制冰机一到，你就把它装上。

**测试**： 在重新接通电源并等待一夜之后，你的新制冰机开始制冰。没有发现新的问题。

现在让我们把这个过程应用到上节课的简单程序中：

```cpp
#include <iostream>

// Adds two numbers
int add(int x, int y)
{
    return x - y; // function is supposed to add, but it doesn't
}

int main()
{
    std::cout << add(5, 3) << '\n'; // should produce 8, but produces 2
    return 0;
}
```

这段代码的唯一优点就是错的很明显：错误的答案通过第11行打印到屏幕上。这为我们的调查提供了一个起点。

**Find the root cause:** On line 11, we can see that we’re passing in literals for arguments (5 and 3), so there is no room for error there. Since the inputs to function _add_ are correct, but the output isn’t, it’s pretty apparent that function _add_ must be producing the wrong value. The only statement in function _add_ is the return statement, which must be the culprit. We’ve found the problem line. Now that we know where to focus our attention, noticing that we’re subtracting instead of adding is something you’re likely to find via inspection.

**Understand the problem:** In this case, it’s obvious why the wrong value is being generated -- we’re using the wrong operator.

**Determine a fix:** We’ll simply change _operator-_ to _operator+_.

**Repair the issue:** This is actually changing _operator-_ to _operator+_ and ensuring the program recompiles.

**Retest:** After implementing the change, rerunning the program will indicate that our program now produces the correct value of 8. For this simple program, that’s all the testing that’s needed.

This example is trivial, but illustrates the basic process you’ll go through when diagnosing any program.