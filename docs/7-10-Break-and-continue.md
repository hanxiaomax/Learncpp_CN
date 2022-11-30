
---
title: 7.10 - break 和 continue
alias: 7.10 - break 和 continue
origin: /Break-and-continue/
origin_title: "7.10 - Break and continue"
time: 
type: translation
tags:
- break
- continue
---


## Break 语句

虽然您已经在`switch`语句的上下文中见过`break`语句([[7-4-Switch-statement-basics|7.4 - switch 语句基础]])，但它值得更仔细研究，因为它也可以用于其他类型的控制流语句。break语句导致while循环、do-while循环、for循环或switch语句结束，并在循环或switch被打破后继续执行下一个语句。

## 从 switch 中跳出

在 `switch`语句中，`break`语句通常放置在每个分支的最后，用于退出switch语句(避免贯穿执行分支)：

```cpp
#include <iostream>

void printMath(int x, int y, char ch)
{
    switch (ch)
    {
    case '+':
        std::cout << x << " + " << y << " = " << x + y << '\n';
        break; // don't fall-through to next case
    case '-':
        std::cout << x << " - " << y << " = " << x - y << '\n';
        break; // don't fall-through to next case
    case '*':
        std::cout << x << " * " << y << " = " << x * y << '\n';
        break; // don't fall-through to next case
    case '/':
        std::cout << x << " / " << y << " = " << x / y << '\n';
        break;
    }
}

int main()
{
    printMath(2, 3, '+');

    return 0;
}
```

关于[[fallthrough|贯穿属性]]的更多详细信息，参见 [[7-5-Switch-fallthrough-and-scoping|7.5 - switch fallthrough属性和作用域]]。

## 从循环中跳出

在循环上下文中，可以使用break语句提前结束循环并从循环结束后的下一条语句继续执行。

例如：

```cpp
#include <iostream>

int main()
{
    int sum{ 0 };

    // Allow the user to enter up to 10 numbers
    for (int count{ 0 }; count < 10; ++count)
    {
        std::cout << "Enter a number to add, or 0 to exit: ";
        int num{};
        std::cin >> num;

        // exit loop if user enters 0
        if (num == 0)
            break; // exit the loop now

        // otherwise add number to our sum
        sum += num;
    }

    // execution will continue here after the break
    std::cout << "The sum of all the numbers you entered is: " << sum << '\n';

    return 0;
}
```

这个程序允许用户最多输入10个数字，并显示最后输入的所有数字的总和。如果用户输入0，中断将导致循环提前终止(在输入10个数字之前)。

运行结果如下：

```
Enter a number to add, or 0 to exit: 5
Enter a number to add, or 0 to exit: 2
Enter a number to add, or 0 to exit: 1
Enter a number to add, or 0 to exit: 0
The sum of all the numbers you entered is: 8
```

`break` 也是一种从一个故意设置的无限循环中跳出的常见方法:

```cpp
#include <iostream>

int main()
{
    while (true) // infinite loop
    {
        std::cout << "Enter 0 to exit or any other integer to continue: ";
        int num{};
        std::cin >> num;

        // exit loop if user enters 0
        if (num == 0)
            break;
    }

    std::cout << "We're out!\n";

    return 0;
}
```

运行结果如下：

```
Enter 0 to exit or any other integer to continue: 5
Enter 0 to exit or any other integer to continue: 3
Enter 0 to exit or any other integer to continue: 0
We're out!
```

## `break` vs `return`

新程序员有时很难理解“break”和“return”之间的区别。break语句终止switch或循环，并从switch或循环以外的第一个语句继续执行。return语句会终止循环所在的整个函数，并在函数被调用的地方继续执行。

```cpp
#include <iostream>

int breakOrReturn()
{
    while (true) // infinite loop
    {
        std::cout << "Enter 'b' to break or 'r' to return: ";
        char ch;
        std::cin >> ch;

        if (ch == 'b')
            break; // execution will continue at the first statement beyond the loop

        if (ch == 'r')
            return 1; // return will cause the function to immediately return to the caller (in this case, main())
    }

    // breaking the loop causes execution to resume here

    std::cout << "We broke out of the loop\n";

    return 0;
}

int main()
{
    int returnValue{ breakOrReturn() };
    std::cout << "Function breakOrReturn returned " << returnValue << '\n';

    return 0;
}
```

运行函数两次：

```
Enter 'b' to break or 'r' to return: r
Function breakOrReturn returned 1

Enter 'b' to break or 'r' to return: b
We broke out of the loop
Function breakOrReturn returned 0
```

## `continue` 语句

`continue` 语句提供了一种方便的方式来结束循环的**当前迭代**而不终止整个循环。

下面是一个使用`continue`的例子:

```cpp
#include <iostream>

int main()
{
    for (int count{ 0 }; count < 10; ++count)
    {
        // if the number is divisible by 4, skip this iteration
        if ((count % 4) == 0)
            continue; // go to next iteration

        // If the number is not divisible by 4, keep going
        std::cout << count << '\n';

        // The continue statement jumps to here
    }

    return 0;
}
```

这个程序输出从0到9所有不能被4整除的数：

```
1
2
3
5
6
7
9
```

`continue` 语句使当前执行点跳转到当前循环的底部。

在 for 循环的中，for 循环的结束语句仍然在`continue`语句之后执行(因为这发生在循环体结束之后)。

在使用带有`while`或`do-while`循环的 `continue` 语句时要小心。这些循环通常会更改循环体内部条件中使用的变量的值。如果使用 `continue` 语句导致这些行被跳过，那么循环可能会变成无限循环!

考虑下面的程序:

```cpp
#include <iostream>

int main()
{
    int count{ 0 };
    while (count < 10)
    {
        if (count == 5)
            continue; // 跳转到末尾

        std::cout << count << '\n';

        ++count; // 到达 5 之后再也不会被执行

        // 从这里执行
    }

    return 0;
}
```

这个程序的目的是打印0到9之间除5之外的所有数字。但它实际上打印:

```
0
1
2
3
4
```

随后就进入了无限循环。当 `count` 等于 `5` 时，`if`语句条件求值为 `true`，`continue` 语句使控制流跳转到循环底部。所以 `count` 变量无法被递增。这样一来，下一次迭代时 `count` 仍然是 `5`，所以 `if` 语句条件求值仍然为 `true`，程序变成了死循环。

当然，如果我们能够识别出一个典型的计数变量的话，你应该使用 `for`循环来代替 `while` 或 `do-while` 循环。

## 关于 `break` 和 `continue` 的争论

许多教科书告诫读者不要在循环中使用“break”和“continue”，因为它会导致执行流四处跳跃，也会使逻辑流更难遵循。例如，在一个复杂的逻辑片段中间的“中断”可能被错过，或者在什么条件下应该触发它可能不明显。

然而，如果使用得当，break 和 continue 可以减少嵌套块的数量，减少对复杂循环逻辑的需求，从而使循环更具可读性。

例如，考虑以下程序：

```cpp
#include <iostream>

int main()
{
    int count{ 0 }; // count how many times the loop iterates
    bool keepLooping { true }; // controls whether the loop ends or not
    while (keepLooping)
    {
        std::cout << "Enter 'e' to exit this loop or any other character to continue: ";
        char ch{};
        std::cin >> ch;

        if (ch == 'e')
            keepLooping = false;
        else
        {
            ++count;
            std::cout << "We've iterated " << count << " times\n";
        }
    }

    return 0;
}
```

这个程序使用一个布尔变量来控制循环是否继续，以及一个只在用户不退出时运行的嵌套块。

下面是一个更容易理解的版本，使用 `break` 语句：

```cpp
#include <iostream>

int main()
{
    int count{ 0 }; // count how many times the loop iterates
    while (true) // loop until user terminates
    {
        std::cout << "Enter 'e' to exit this loop or any other character to continue: ";
        char ch{};
        std::cin >> ch;

        if (ch == 'e')
            break;

        ++count;
        std::cout << "We've iterated " << count << " times\n";
    }

    return 0;
}
```

在这个版本中，通过使用“break语句”，避免了使用布尔变量(并且必须理解它的预期用途以及它的值在哪里被更改)、“else语句”和嵌套块。

尽量减少使用的变量数量和保持嵌套块的数量都能提高代码的可理解性，而不是“break”或“continue”对代码的损害。因此，我们认为明智地使用“break”或“continue”是可以接受的。

!!! success "最佳实践"

	如果使用break和continue能够简化循环逻辑，则使用它们。

## 关于提前返回的争论

对于`return`语句也有类似的争论。不是函数中最后一条语句的返回语句则称之为**提前返回语句**。许多程序员认为应该避免提前返回。在函数底部只有一个`return`语句的函数更简单——你可以假设函数将接受它的参数，执行它实现的任何逻辑，并返回一个没有偏差的结果。额外的 `return` 语句会使逻辑变得复杂。

反方则认为，使用提前返回可以让函数在完成后立即退出，这样就减少了阅读不必要的逻辑，并减少了对条件嵌套块的需求，从而使代码更具可读性。

有些开发人员采取中间立场，**只在函数顶部使用提前返回来进行参数验证**(捕获传入的错误参数)，然后在函数之后的部分保证只使用一个`return`语句。

我们的立场是，提前返回利大于弊，但在实践中要因地制宜地使用。

!!! success "最佳实践"

	如果提前返回能够简化函数逻辑，则可以使用它