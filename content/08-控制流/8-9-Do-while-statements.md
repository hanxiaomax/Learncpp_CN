---
title: 8.9 - do-while 语句
alias: 8.9 - do-while 语句
origin: /do-while-statements/
origin_title: "7.8 — Do while statements"
time: 2022-4-23
type: translation
tags:
- do-while
---

> [!note] "Key Takeaway"

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

但是，上述代码能够正确工作的原因是因为此处的初始值为0——它不是任何合法的`selection`值 (`1, 2, 3 or 4`)。如果 0 也是合法的值会怎样？我们必须选择一个不同的初始化值来表示“无效”——这导致我们的代码中引入魔鬼数字([[5-2-Literals|5.2 - 字面量]])。

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

虽然这避免了魔鬼数字，但引入了一个新变量，以确保循环能够至少运行一次，这增加了复杂性和犯错的可能性。

## do-while 语句

为了帮助解决上述问题，C++提供了`do-while`语句:

```cpp
do
    statement; // 可以是单一语句，也可以是复合句
while (condition);
```

`do-while`语句是一个循环构造方式，其工作原理与`while`循环类似，只不过该语句总是至少执行一次。语句执行后，do-while循环检查条件。如果条件的计算结果为`true` ，执行路径将跳转回do-while循环的顶部并再次执行。

下面是我们上面用do-while循环代替while循环的例子：

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


通过这种方式，我们既避免了魔鬼数字，也避免了额外的变量。

在上面的例子中有一件事值得讨论，那就是`selection` 变量必须在do块之外声明。如果在do块中声明了 `selection` 变量，那么当do块终止时，它将被销毁，这发生在条件值被求值之前。但是我们需要在while条件语句中声明变量——因此，`selection` 变量必须在do块之外声明(即使它没有在函数体后面使用)。

实际上，do-while循环并不常用。将条件放在循环的底部会模糊循环条件，这可能会导致错误。因此，许多开发人员建议完全避免do-while循环。我们将采取一种较为温和的立场，如果两种方法都可以使用时，使用while循环而不是do-while循环。

> [!success] "最佳实践"
> 当给出相同的选择时，更倾向于while循环而不是do-while循环。