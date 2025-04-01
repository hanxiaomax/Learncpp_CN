---
title: 7.9 - for 语句
alias: 7.9 - for 语句
origin: /for-statements/
origin_title: "7.9 -- For statements"
time: 2022-5-24
type: translation
tags:
- for
---


C++中最常用的语句是`for`语句。当我们有一个明显的循环变量时，首选使用for语句(也称为for循环)，因为它使我们可以轻松而简洁地定义、初始化、测试和更改循环变量的值。

在 C++11 中，有两种 `for`循环，我们会在本节课介绍最典型的 `for`  循环，然后在后面的课程中（[[16-8-For-each-loops|11.13 - for-each 循环]]）介绍较新的的[[range-based-for-loops|基于范围的for循环]] ([11.13 -- For-each loops](https://www.learncpp.com/cpp-tutorial/for-each-loops/)) 。

`for` 循环语法的抽象形式非常简单：

```cpp
for (init-statement; condition; end-expression)
   statement;
```

理解 `for` 循环最简单的方式是将其转换成一个等价的 `while`循环：

```cpp
{ // 注意这里的语句块
    init-statement; // 用于定义循环中使用的变量
    while (condition)
    {
        statement; 
        end-expression; // 用于修改循环变量
    }
} // 在循环中定义的变量在这里超出了作用域

```

## for 语句求值

`for`语句求值分三部分：

首先是执行 `init-statement` ，但是它之后在循环初始化时执行一次。`init-statement` 通常用于变量的定义和初始化。这些变量均具有“循环作用域”——这只是块作用域的一种形式，这些变量从定义点一直存续到循环语句结束。在等价的while循环中，可以看到`init-statement`位于包含循环的块中，因此当包含循环的块结束时，`init-statement`中定义的变量将超出作用域。

其次, 对于每个循环迭代，都要计算条件。如果该值为`true`，则执行语句。如果该值为`false`，则循环终止，并继续执行循环以外的下一个语句。

最后，当`statement`执行后，会对 `end-expression` 进行求值。通常，该表达式用于增加或减少`init-statement`中定义的循环变量。在计算结束表达式之后，执行返回到第二步(再次计算条件)。

接下来看一个 for 循环例程，了解其工作方式：

```cpp
#include <iostream>

int main()
{
    for (int count{ 1 }; count <= 10; ++count)
        std::cout << count << ' ';

    std::cout << '\n';

    return 0;
}
```

首先，声明一个循环变量 `count`并将其初始化为1。

然后对 `count <= 10` 求值，因为 `count`等于1，所以条件求值为 `true`。因此，`statement` 会被执行，打印1和空格。

最后，对 `++count` 求值，将 `count` 递增为 `2`。然后回到第二步。

现在，再次对 `count <= 10` 求值。由于 `count` 已经是 `2`了，所以求值结果为 `true`，再次执行循环。语句输出`2` 和一个空格，`count` 被增加到`3` 。循环继续迭代，直到`count` 被增加到`11` ，此时 `count <= 10` 的计算值为 `false` ，循环退出。

程序的输出结果为：

```
1 2 3 4 5 6 7 8 9 10
```

对于这个例子，让我们将其转换为等价的 `while` 循环：

```cpp
#include <iostream>

int main()
{
    { // the block here ensures block scope for count
        int count{ 1 }; // our init-statement
        while (count <= 10) // our condition
        {
            std::cout << count << ' '; // our statement
            ++count; // our end-expression
        }
    }

    std::cout << '\n';
}
```

看起来没那么糟，是吧？注意，这里需要使用外大括号，因为当循环结束时 `count` 要[[going-out-of-scope|离开作用域]]。

对于新程序员来说，“for循环”可能很难读懂——然而，有经验的程序员喜欢它们，因为它们是一种非常紧凑的方法，可以用计数器来执行循环，关于循环变量、循环条件和循环计数修饰符的所有必要信息都在前面给出了。这有助于减少错误。

## 更多循环案例

下面是一个使用`for`循环计算整数指数的函数示例:

```cpp
#include <cstdint> // for fixed-width integers

// returns the value base ^ exponent -- watch out for overflow!
std::int64_t pow(int base, int exponent)
{
    std::int64_t total{ 1 };

    for (int count{ 0 }; count < exponent; ++count)
        total *= base;

    return total;
}
```

This function returns the value `base^exponent` (base to the exponent power).

This is a straightforward incrementing `for loop`, with `count` looping from `0` up to (but excluding) `exponent`.

- If exponent is `0`, the `for loop` will execute 0 times, and the function will return `1`.  
- If exponent is `1`, the `for loop` will execute 1 time, and the function will return `1 * base`.  
- If exponent is `2`, the `for loop` will execute 2 times, and the function will return `1 * base * base`.

Although most `for loops` increment the loop variable by 1, we can decrement it as well:

```cpp
#include <iostream>

int main()
{
    for (int count{ 9 }; count >= 0; --count)
        std::cout << count << ' ';

    std::cout << '\n';

    return 0;
}
```

COPY

This prints the result:

```
9 8 7 6 5 4 3 2 1 0
```

Alternately, we can change the value of our loop variable by more than 1 with each iteration:

```cpp
#include <iostream>

int main()
{
    for (int count{ 0 }; count <= 10; count += 2)
        std::cout << count << ' ';

    std::cout << '\n';

    return 0;
}
```

COPY

This prints the result:

```
0 2 4 6 8 10
```

The perils of `operator!=` in for-loop conditions

When writing a loop condition involving a value, we can often write the condition in many different ways. The following two loops execute identically:

```cpp
#include <iostream>

int main()
{
    for (int i { 0 }; i < 10; ++i) // uses <
         std::cout << i;

    for (int i { 0 }; i != 10; ++i) // uses !=
         std::cout << i;

     return 0;
}
```

COPY

So which should we prefer? The former is the better choice, as it will terminate even if `i` jumps over the value `10`, whereas the latter will not. The following example demonstrates this:

```cpp
#include <iostream>

int main()
{
    for (int i { 0 }; i < 10; ++i) // uses <, still terminates
    {
         std::cout << i;
         if (i == 9) ++i; // jump over value 10
    }

    for (int i { 0 }; i != 10; ++i) // uses !=, infinite loop
    {
         std::cout << i;
         if (i == 9) ++i; // jump over value 10
    }

     return 0;
}
```

COPY

> [!success] "最佳实践"
> Avoid `operator!=` when doing numeric comparisons in the for-loop condition.

## 差一错误

One of the biggest problems that new programmers have with `for loops` (and other loops that utilize counters) are [[Off-by-one|差一错误]]。 Off-by-one errorsoccur when the loop iterates one too many or one too few times to produce the desired result.

Here’s an example:

```cpp
#include <iostream>

int main()
{
    // oops, we used operator< instead of operator<=
    for (int count{ 1 }; count < 5; ++count)
    {
        std::cout << count << ' ';
    }

    std::cout << '\n';

    return 0;
}
```

COPY

This program is supposed to print `1 2 3 4 5`, but it only prints `1 2 3 4` because we used the wrong relational operator.

Although the most common cause for these errors is using the wrong relational operator, they can sometimes occur by using pre-increment or pre-decrement instead of post-increment or post-decrement, or vice-versa.

## 省略表达式

It is possible to write _for loops_ that omit any or all of the statements or expressions. For example, in the following example, we’ll omit the init-statement and end-expression, leaving only the condition:

```cpp
#include <iostream>

int main()
{
    int count{ 0 };
    for ( ; count < 10; ) // no init-statement or end-expression
    {
        std::cout << count << ' ';
        ++count;
    }

    std::cout << '\n';

    return 0;
}
```

COPY

This _for loop_ produces the result:

```
0 1 2 3 4 5 6 7 8 9
```

Rather than having the _for loop_ do the initialization and incrementing, we’ve done it manually. We have done so purely for academic purposes in this example, but there are cases where not declaring a loop variable (because you already have one) or not incrementing it in the end-expression (because you’re incrementing it some other way) is desired.

Although you do not see it very often, it is worth noting that the following example produces an infinite loop:

```cpp
for (;;)
    statement;
```

COPY

The above example is equivalent to:

```cpp
while (true)
    statement;
```

COPY

This might be a little unexpected, as you’d probably expect an omitted condition-expression to be treated as `false`. However, the C++ standard explicitly (and inconsistently) defines that an omitted condition-expression in a for loop should be treated as `true`.

We recommend avoiding this form of the for loop altogether and using `while(true)` instead.

## 有多个计数的循环

Although `for loops` typically iterate over only one variable, sometimes `for loops` need to work with multiple variables. To assist with this, the programmer can define multiple variables in the init-statement, and can make use of the comma operator to change the value of multiple variables in the end-expression:

```cpp
#include <iostream>

int main()
{
    for (int x{ 0 }, y{ 9 }; x < 10; ++x, --y)
        std::cout << x << ' ' << y << '\n';

    return 0;
}
```

COPY

This loop defines and initializes two new variables: `x` and `y`. It iterates `x` over the range `0` to `9`, and after each iteration `x` is incremented and `y` is decremented.

This program produces the result:

```
0 9
1 8
2 7
3 6
4 5
5 4
6 3
7 2
8 1
9 0
```
This is about the only place in C++ where defining multiple variables in the same statement, and use of the comma operator is considered an acceptable practice.

> [!success] "最佳实践"
> Defining multiple variables (in the init-statement) and using the comma operator (in the end-expression) is acceptable inside a `for statement`.

## 嵌套循环

Like other types of loops, `for loops` can be nested inside other loops. In the following example, we’re nesting a `for loop` inside another `for loop`:

```cpp
#include <iostream>

int main()
{
	for (char c{ 'a' }; c <= 'e'; ++c) // outer loop on letters
	{
		std::cout << c; // print our letter first

		for (int i{ 0 }; i < 3; ++i) // inner loop on all numbers
			std::cout << i;

		std::cout << '\n';
	}

	return 0;
}
```

COPY

For each iteration of the outer loop, the inner loop runs in its entirety. Consequently, the output is:

```
a012
b012
c012
d012
e012
```

Here’s some more detail on what’s happening here. The outer loop runs first, and char `c` is initialized to `'a'`. Then `c <= 'e'` is evaluated, which is `true`, so the loop body executes. Since `c` is set to `'a'`, this first prints `a`. Next the inner loop executes entirely (which prints `0`, `1`, and `2`). Then a newline is printed. Now the outer loop body is finished, so the outer loop returns to the top, `c` is incremented to `'b'`, and the loop condition is re-evaluated. Since the loop condition is still `true` the next iteration of the outer loop begins. This prints `b012\n`. And so on.

## 小结

`For statements` are the most commonly used loop in the C++ language. Even though its syntax is typically a bit confusing to new programmers, you will see `for loops` so often that you will understand them in no time at all!

`For statements` excel when you have a counter variable. If you do not have a counter, a `while statement` is probably a better choice.

> [!success] "最佳实践"
> - Prefer `for loops` over `while loops` when there is an obvious loop variable.  
> - Prefer `while loops` over `for loops` when there is no obvious loop variable.