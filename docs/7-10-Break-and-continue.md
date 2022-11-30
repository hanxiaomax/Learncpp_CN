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

虽然您已经在`switch`语句的上下文中见过`break`语句([[7-4-Switch-statement-basics|7.4 - switch语句基础])，但它值得更仔细研究，因为它也可以用于其他类型的控制流语句。break语句导致while循环、do-while循环、for循环或switch语句结束，并在循环或switch被打破后继续执行下一个语句。

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

随后就进入了无限循环。当 `count` 等于 `5` 时，`if`语句条件求值为 `true`, and the `continue` causes the execution to jump to the bottom of the loop. The `count` variable is never incremented. Consequently, on the next pass, `count` is still `5`, the `if statement` is still `true`, and the program continues to loop forever.

Of course, you already know that if you have an obvious counter variable, you should be using a `for loop`, not a `while` or `do-while` loop.

## 关于 `break` 和 `continue` 的争论

Many textbooks caution readers not to use `break` and `continue` in loops, both because it causes the execution flow to jump around, and because it can make the flow of logic harder to follow. For example, a `break` in the middle of a complicated piece of logic could either be missed, or it may not be obvious under what conditions it should be triggered.

However, used judiciously, `break` and `continue` can help make loops more readable by keeping the number of nested blocks down and reducing the need for complicated looping logic.

For example, consider the following program:

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

COPY

This program uses a boolean variable to control whether the loop continues or not, as well as a nested block that only runs if the user doesn’t exit.

Here’s a version that’s easier to understand, using a `break statement`:

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

COPY

In this version, by using a single `break statement`, we’ve avoided the use of a Boolean variable (and having to understand both what its intended use is, and where its value is changed), an `else statement`, and a nested block.

Minimizing the number of variables used and keeping the number of nested blocks down both improve code comprehensibility more than a `break` or `continue` harms it. For that reason, we believe judicious use of `break` or `continue` is acceptable.

!!! success "最佳实践"

	Use break and continue when they simplify your loop logic.

## 关于提前返回的争论

There’s a similar argument to be made for return statements. A return statement that is not the last statement in a function is called an early return. Many programmers believe early returns should be avoided. A function that only has one return statement at the bottom of the function has a simplicity to it -- you can assume the function will take its arguments, do whatever logic it has implemented, and return a result without deviation. Having extra returns complicates the logic.

The counter-argument is that using early returns allows your function to exit as soon as it is done, which reduces having to read through unnecessary logic and minimizes the need for conditional nested blocks, which makes your code more readable.

Some developers take a middle ground, and only use early returns at the top of a function to do parameter validation (catch bad arguments passed in), and then a single return thereafter.

Our stance is that early returns are more helpful than harmful, but we recognize that there is a bit of art to the practice.

!!! success "最佳实践"

	Use early returns when they simplify your function’s logic.