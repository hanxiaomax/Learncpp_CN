---
title: 7.8 - do-while 语句
alias: 7.8 - do-while 语句
origin: /do-while-statements/
origin_title: "7.8 — Do while statements"
time: 2022-4-23
type: translation
tags:
- do-while
---

??? note "关键点速记"



考虑这样一种情况，我们希望向用户显示一个菜单，并要求他们进行选择——如果用户选择了无效的选择，则需要再次询问。显然，菜单和选项应该放在某种循环中(这样才可以反复询问用户，直到他们输入有效的输入)，但是应该选择哪种类型的循环呢?

由于`while`循环会先对条件求值，所以使用`while`循环很别扭。假设我们这样做：

```cpp
#include <iostream>

int main()
{
    // 选择必须被定义在循环外
    int selection{ 0 };

    while (selection != 1 && selection != 2 &&
        selection != 3 && selection != 4)
    {
        std::cout << "Please make a selection: \n";
        std::cout << "1) Addition\n";
        std::cout << "2) Subtraction\n";
        std::cout << "3) Multiplication\n";
        std::cout << "4) Division\n";
        std::cin >> selection;
    }

    // 继续选择进行操作
    // 可以使用 switch 语句进行

    std::cout << "You selected option #" << selection << '\n';

    return 0;
}
```

但是，上述代码能够正确工作的原因是因为此处的初始值为0——它不是任何合法的`selection`值 (`1, 2, 3 or 4`)。如果 0 也是合法的值会怎样？我们必须选择一个不同的初始化值来表示“无效”——这导致我们的代码中引入魔鬼数字([[4-15-Literals|4.15 -字面量]])。

我们可以添加一个新的变量来跟踪有效性，就像这样：

```cpp
#include <iostream>

int main()
{
    int selection { 0 };
    bool invalid { true }; // new variable just to gate the loop

    while (invalid)
    {
        std::cout << "Please make a selection: \n";
        std::cout << "1) Addition\n";
        std::cout << "2) Subtraction\n";
        std::cout << "3) Multiplication\n";
        std::cout << "4) Division\n";

        std::cin >> selection;
        invalid = (selection != 1 && selection != 2 &&
            selection != 3 && selection != 4);
    }

    // do something with selection here
    // such as a switch statement

    std::cout << "You selected option #" << selection << '\n';

    return 0;
}
```

虽然这避免了魔鬼数字，但引入了一个新变量，以确保循环能够至少运行一次，这增加了复杂性和额外错误的可能性。

While this avoids the magic number, it introduces a new variable just to ensure the loop runs once, and that adds complexity and the possibility of additional errors.

## Do while statements

To help solve problems like the above, C++ offers the do-while statement:

```
do
    statement; // can be a single statement or a compound statement
while (condition);
```

A do while statement is a looping construct that works just like a while loop, except the statement always executes at least once. After the statement has been executed, the do-while loop checks the condition. If the condition evaluates to `true`, the path of execution jumps back to the top of the do-while loop and executes it again.

Here is our example above using a do-while loop instead of a while loop:

```cpp
#include <iostream>

int main()
{
    // selection must be declared outside of the do-while so we can use it later
    int selection{};

    do
    {
        std::cout << "Please make a selection: \n";
        std::cout << "1) Addition\n";
        std::cout << "2) Subtraction\n";
        std::cout << "3) Multiplication\n";
        std::cout << "4) Division\n";
        std::cin >> selection;
    }
    while (selection != 1 && selection != 2 &&
        selection != 3 && selection != 4);

    // do something with selection here
    // such as a switch statement

    std::cout << "You selected option #" << selection << '\n';

    return 0;
}
```

COPY

In this way, we’ve avoided both magic numbers and additional variables.

One thing worth discussing in the above example is that the `selection` variable must be declared outside of the do block. If the `selection` variable were to be declared inside the do block, it would be destroyed when the do block terminates, which happens before the conditional is evaluated. But we need the variable in the while conditional -- consequently, the `selection` variable must be declared outside the do block (even if it wasn’t used later in the body of the function).

In practice, do-while loops aren’t commonly used. Having the condition at the bottom of the loop obscures the loop condition, which can lead to errors. Many developers recommend avoiding do-while loops altogether as a result. We’ll take a softer stance and advocate for preferring while loops over do-while when given an equal choice.

!!! success "最佳实践"

	Favor while loops over do-while when given an equal choice.