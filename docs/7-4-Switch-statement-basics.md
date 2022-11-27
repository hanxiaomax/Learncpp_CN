---
title: 7.4 - switch 语句基础
alias: 7.4 - switch 语句基础
origin: /switch-statement-basics/
origin_title: "7.4 — Switch statement basics"
time: 2022-2-10
type: translation
tags:
- switch
- control flow
---

??? note "关键点速记"
	

尽管我们可以编写很多链式 if-else，但是这么做不仅写起来费劲，效率也不高。例如：

```cpp
#include <iostream>

void printDigitName(int x)
{
    if (x == 1)
        std::cout << "One";
    else if (x == 2)
        std::cout << "Two";
    else if (x == 3)
        std::cout << "Three";
    else
        std::cout << "Unknown";
}

int main()
{
    printDigitName(2);

    return 0;
}
```

这个例子并不复杂，x 最多会被求值三次（不高效），读者也必须明白被求值多次的是`x`而不是其他变量。

由于针对一组不同的值测试变量或表达式是否相等是很常见的，C++提供了另外一种可选的条件语句，称为**switch语句**，专门用于此目的。下面的代码用switch语句实现了相同的功能：

```cpp
#include <iostream>

void printDigitName(int x)
{
    switch (x)
    {
        case 1:
            std::cout << "One";
            return;
        case 2:
            std::cout << "Two";
            return;
        case 3:
            std::cout << "Three";
            return;
        default:
            std::cout << "Unknown";
            return;
    }
}

int main()
{
    printDigitName(2);

    return 0;
}
```

switch 背后的思想很简单：表达式(有时称为条件)求值后得到一个值。如果表达式的值能够和后面的某个分支标签匹配，则该标签后的语句就会被zhi'x evaluated to produce a value. If the expression’s value is equal to the value after any of the `case labels`, the statements after the matching `case label` are executed. If no matching value can be found and a `default label` exists, the statements after the `default label` are executed instead.

Compared to the original `if statement`, the `switch statement` has the advantage of only evaluating the expression once (making it more efficient), and the `switch statement` also makes it clearer to the reader that it is the same expression being tested for equality in each case.

!!! success "最佳实践"

	Prefer `switch statements` over if-else chains when there is a choice.

Let’s examine each of these concepts in more detail.

## 创建 switch 

We start a `switch statement` by using the `switch` keyword, followed by parentheses with the conditional expression that we would like to evaluate inside. Often the expression is just a single variable, but it can be any valid expression.

The one restriction is that the condition must evaluate to an integral type (see lesson [[4-1-Introduction-to-fundamental-data-types|4.1 - 基础数据类型简介]]if you need a reminder which fundamental types are considered integral types) or an enumerated type (covered in future lesson [[10-2-unscoped-enumerations|10.2 - 无作用域枚举类型]]), or be convertible to one. Expressions that evaluate to floating point types, strings, and most other non-integral types may not be used here.

!!! info "扩展阅读"


	Why does the switch type only allow for integral (or enumerated) types? The answer is because switch statements are designed to be highly optimized. Historically, the most common way for compilers to implement switch statements is via [Jump tables](https://en.wikipedia.org/wiki/Branch_table) -- and jump tables only work with integral values.
	
	For those of you already familiar with arrays, a jump table works much like an array, an integral value is used as the array index to “jump” directly to a result. This can be much more efficient than doing a bunch of sequential comparisons.
	
	Of course, compilers don’t have to implement switches using jump tables, and sometimes they don’t. There is technically no reason that C++ couldn’t relax the restriction so that other types could be used as well, they just haven’t done so yet (as of C++20).

Following the conditional expression, we declare a block. Inside the block, we use labels to define all of the values we want to test for equality. There are two kinds of labels.

## 分支标签

The first kind of label is the case label, which is declared using the `case` keyword and followed by a constant expression. The constant expression must either match the type of the condition or must be convertible to that type.

If the value of the conditional expression equals the expression after a `case label`, execution begins at the first statement after that `case label` and then continues sequentially.

Here’s an example of the condition matching a `case label`:

```cpp
#include <iostream>

void printDigitName(int x)
{
    switch (x) // x is evaluated to produce value 2
    {
        case 1:
            std::cout << "One";
            return;
        case 2: // which matches the case statement here
            std::cout << "Two"; // so execution starts here
            return; // and then we return to the caller
        case 3:
            std::cout << "Three";
            return;
        default:
            std::cout << "Unknown";
            return;
    }
}

int main()
{
    printDigitName(2);

    return 0;
}
```

COPY

This code prints:

Two

In the above program, `x` is evaluated to produce value `2`. Because there is a case label with value `2`, execution jumps to the statement underneath that matching case label. The program prints `Two`, and then the `return statement` is executed, which returns back to the caller.

There is no practical limit to the number of case labels you can have, but all case labels in a switch must be unique. That is, you can not do this:

```cpp
switch (x)
{
    case 54:
    case 54:  // error: already used value 54!
    case '6': // error: '6' converts to integer value 54, which is already used
}
```

COPY

## 默认标签

The second kind of label is the default label (often called the default case), which is declared using the `default` keyword. If the conditional expression does not match any case label and a default label exists, execution begins at the first statement after the default label.

Here’s an example of the condition matching the default label:

```cpp
#include <iostream>

void printDigitName(int x)
{
    switch (x) // x is evaluated to produce value 5
    {
        case 1:
            std::cout << "One";
            return;
        case 2:
            std::cout << "Two";
            return;
        case 3:
            std::cout << "Three";
            return;
        default: // which does not match to any case labels
            std::cout << "Unknown"; // so execution starts here
            return; // and then we return to the caller
    }
}

int main()
{
    printDigitName(5);

    return 0;
}
```

COPY

This code prints:

```
Unknown
```

The default label is optional, and there can only be one default label per switch statement. By convention, the `default case` is placed last in the switch block.

!!! success "最佳实践"

	Place the default case last in the switch block.


## 没有匹配的分支也没有默认分支

If the value of the conditional expression does not match any of the case labels, and no default case has been provided, then no cases inside the switch are executed. Execution continues after the end of the switch block.

```cpp
#include <iostream>

void printDigitName(int x)
{
    switch (x) // x is evaluated to produce value 5
    {
    case 1:
        std::cout << "One";
        return;
    case 2:
        std::cout << "Two";
        return;
    case 3:
        std::cout << "Three";
        return;
    // no matching case exists and there is no default case
    }

    // so execution continues here
    std::cout << "Hello";
}

int main()
{
    printDigitName(5);
    std::cout << '\n';

    return 0;
}
```

COPY

In the above example, `x` evalutes to `5`, but there is no case label matching `5`, nor is there a default case. As a result, no cases execute. Execution continues after the switch block, printing `Hello`.


## 休息一下

In the above examples, we used `return statements` to stop execution of the statements after our labels. However, this also exits the entire function.

A break statement (declared using the `break` keyword) tells the compiler that we are done executing statements within the switch, and that execution should continue with the statement after the end of the switch block. This allows us to exit a `switch statement` without exiting the entire function.

Here’s a slightly modified example rewritten using `break` instead of `return`:

```cpp
#include <iostream>

void printDigitName(int x)
{
    switch (x) // x evaluates to 3
    {
        case 1:
            std::cout << "One";
            break;
        case 2:
            std::cout << "Two";
            break;
        case 3:
            std::cout << "Three"; // execution starts here
            break; // jump to the end of the switch block
        default:
            std::cout << "Unknown";
            break;
    }

    // execution continues here
    std::cout << " Ah-Ah-Ah!";
}

int main()
{
    printDigitName(3);

    return 0;
}
```

COPY

The above example prints:

```
Three Ah-Ah-Ah!
```

!!! success "最佳实践"

	<>
	Each set of statements underneath a label should end in a `break statement` or a `return statement`. This includes the statements underneath the last label in the switch.

So what happens if you don’t end a set of statements under a label with a `break` or `return`? We’ll explore that topic, and others, in the next lesson.
