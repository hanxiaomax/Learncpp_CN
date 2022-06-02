---
title: 5.1 - 运算符优先级和结合律
alias: 5.1 - 运算符优先级和结合律
origin: /operator-precedence-and-associativity/
origin_title: "5.1 — Operator precedence and associativity"
time: 2022-4-24
type: translation
tags:
- operator
---

## 章节简介

本章的内容建立在[[1-9-Introduction-to-literals-and-operators|1.9 - 字面量和操作符]]的基础上。首先让我们来复习一下学过的内容：

数学中的运算指的是一个计算操作，它涉及到0个或多个输入值（称为[[operands|操作数]]），并能够产生一个新的值（称为输出值）。这个特定的计算操作，通过某种结构（通常是一个或一对符号）来指定，这种结构称之为[[operator|运算符(operator)]]。

例如，我们都知道 `2 + 3 = 5`。在这个表达式中，2和3称之为运算符，而符号 `+` 则称为运算符，该运算符告诉我们此时将对两个操作数执行一个加法操作，并产生一个新的值 5。

在本章节中，我们会讨论有关运算符的话题，同时介绍很多 C++ 支持的运算符。

## 运算符的优先级

考虑一下这个稍微有点复杂的表达式 _4 + 2 * 3_。一个含有多种运算符的表达式称为**复合表达式**，为了对一个复合表达式求值，我们必须知道每个运算符的含义，以及运算符的执行顺序。复杂表达式求值时运算符的执行顺序有运算符的优先级决定。基于对普通运算符优先级的理解（乘法优先级高于加法），我们可以知道上述表达式应该按照 _4 + (2 * 3)_ 求值并得到结果 10。

在 C++ 中，当编译器遇到表达式时，它同样需要分析表达式并确定如何求值。为了帮助编译器判断，所有的运算符都被指定了优先级。运算符的优先级越高，越先求值。

你可以从下面的表中看到，乘法和除法（优先级 5）的优先级高于加法和减法（优先级 6）因此 _4 + 2 * 3_ 会被看做 _4 + (2 * 3)_ 因为乘法的优先级更高。

## 运算符的结合律

如果两个运算符的优先级恰好相等会怎样？例如，在 _3 * 4 / 2_ 中，乘法和除法的优先级就是一样的，这种情况下编译器仅靠优先级是不能判断如何求值的。

如果两个运算符的优先级相同，则编译器会参考运算符的结合律以判断该运算符的求值顺序是从左向右还是从右向左。优先级 5 的运算符，结合律为从左向右，因此表达式被看做 _(3 * 4) / 2 = 6_。

## 运算符表

下表的主要作用是作为参考手册来使用（如果你将来遇到有关优先级和结合律相关的问题时可以过来查询）。

注意：

-   优先级1是最高的优先级，17 为最低。运算符的优先级越高，越先求值；
-   L->R 表示从左向右；
-   R->L 表示从右向左；

![[table1.png]]
![[table2.png]]


你必须You should already recognize a few of these operators, such as +, -, *, /, (), and sizeof. However, unless you have experience with another programming language, the majority of the operators in this table will probably be incomprehensible to you right now. That’s expected at this point. We’ll cover many of them in this chapter, and the rest will be introduced as there is a need for them.

!!! question "Q: Where’s the exponent operator?"

	C++ doesn’t include an operator to do exponentiation (operator^ has a different function in C++). We discuss exponentiation more in lesson [5.3 -- Modulus and Exponentiation](https://www.learncpp.com/cpp-tutorial/5-3-modulus-and-exponentiation/).

## 加括号

In normal arithmetic, you learned that you can use parentheses to change the order of application of operations. For example, we know that _4 + 2 * 3_evaluates as _4 + (2 * 3)_, but if you want it to evaluate as _(4 + 2) * 3_ instead, you can explicitly parenthesize the expression to make it evaluate the way you want. This works in C++ because parentheses have one of the highest precedence levels, so parentheses generally evaluate before whatever is inside them.

Now consider an expression like _x && y || z_. Does this evaluate as _(x && y) || z_ or _x && (y || z)_? You could look up in the table and see that && takes precedence over ||. But there are so many operators and precedence levels that it’s hard to remember them all.

In order to reduce mistakes and make your code easier to understand without referencing a precedence table, it’s a good idea to parenthesize any non-trivial compound expression, so it’s clear what your intent is.

!!! success "最佳实践"

	Use parentheses to make it clear how a non-trivial expression should evaluate (even if they are technically unnecessary).

There is one notable exception to the above best practice: Expressions that have a single assignment operator do not need to have the right operand of the assignment wrapped in parenthesis.

For example:

```cpp
x = (y + z + w);   // instead of this
x = y + z + w;     // it's okay to do this

x = ((y || z) && w); // instead of this
x = (y || z) && w;   // it's okay to do this

x = (y *= z); // expressions with multiple assignments still benefit from parenthesis
```

COPY

The assignment operators have the second lowest precedence (only the comma operator is lower, and it’s rarely used). Therefore, so long as there is only one assignment (and no commas), we know the right operand will fully evaluate before the assignment.

!!! success "最佳实践"

	Expressions with a single assignment operator do not need to have the right operand of the assignment wrapped in parenthesis.

## 表达式求值顺序和函数参数处理顺序大多是未指明的

Consider the following expression:

```cpp
a + b * c
```


We know from the precedence and associativity rules above that this expression will evaluate as if we had typed:

```cpp
a + (b * c)
```


If _a_ is _1_, _b_ is _2_, and _c_ is 3, this expression will evaluate to the answer _7_.

However, the precedence and associativity rules only tell us how operators evaluate in relation to other operators. It does not tell us anything about the order in which the rest of the expression evaluates. For example, does variable _a_, _b_, or _c_ get evaluated first?

Perhaps surprisingly, in many cases, the order of evaluation of any part of a compound expression (including function calls and argument evaluation) is unspecified. In such cases, the compiler is free to choose any evaluation order it believes is optimal.

!!! warning "注意"

	In many cases, the operands in a compound expression may evaluate in any order. This includes function calls and the arguments to those function calls.

For most expressions, this is irrelevant. In our sample expression above, it doesn’t matter whether in which order variables _a_, _b_, or _c_ are evaluated for their values: the answer will always be _7_. There is no ambiguity here.

But it is possible to write expressions where the order of evaluation does matter. Consider this program, which contains a mistake often made by new C++ programmers:

```cpp
#include <iostream>

int getValue()
{
    std::cout << "Enter an integer: ";

    int x{};
    std::cin >> x;
    return x;
}

int main()
{
    std::cout << getValue() + (getValue() * getValue()); // a + (b * c)
    return 0;
}
```

COPY

If you run this program and enter inputs _1_, _2_, and _3_, you might assume that this program would print _7_. But that is making the assumption that the calls to getValue() will evaluate in left-to-right order. The compiler may choose a different order. For example, if the compiler chose a right-to-left order instead, the program would print _5_ for the same set of inputs.

!!! success "最佳实践"

	Outside of the operator precedence and associativity rules, assume that the parts of an expression could evaluate in any order. Ensure that the expressions you write are not dependent on the order of evaluation of those parts.

The above program can be made unambiguous by making each function call a separate statement:

```cpp
#include <iostream>

int getValue()
{
    std::cout << "Enter an integer: ";

    int x{};
    std::cin >> x;
    return x;
}

int main()
{
    int a{ getValue() }; // will execute first
    int b{ getValue() }; // will execute second
    int c{ getValue() }; // will execute third

    std::cout << a + (b * c); // order of eval doesn't matter now

    return 0;
}
```

COPY

!!! info "相关内容"

	There are some additional examples of cases where order of evaluation problems can occur in lesson [5.4 -- Increment/decrement operators, and side effects](https://www.learncpp.com/cpp-tutorial/increment-decrement-operators-and-side-effects/).