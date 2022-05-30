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

## Chapter introduction

This chapter builds on top of the concepts from lesson [1.9 -- Introduction to literals and operators](https://www.learncpp.com/cpp-tutorial/introduction-to-literals-and-operators/). A quick review follows:

In mathematics, an operation is a mathematical calculation involving zero or more input values (called operands) that produces a new value (called an output value). The specific operation to be performed is denoted by a construct (typically a symbol or pair of symbols) called an operator.

For example, as children we all learn that _2 + 3_ equals _5_. In this case, the literals _2_ and _3_ are the operands, and the symbol _+_ is the operator that tells us to apply mathematical addition on the operands to produce the new value _5_.

In this chapter, we’ll discuss topics related to operators, and explore many of the common operators that C++ supports.

Operator precedence

Now, let’s consider a more complicated expression, such as _4 + 2 * 3_. An expression that has multiple operators is called a compound expression. In order to evaluate this compound expression, we must understand both what the operators do, and the correct order to apply them. The order in which operators are evaluated in a compound expression is determined by an operator’s precedence. Using normal mathematical precedence rules (which state that multiplication is resolved before addition), we know that the above expression should evaluate as _4 + (2 * 3)_ to produce the value 10.

In C++, when the compiler encounters an expression, it must similarly analyze the expression and determine how it should be evaluated. To assist with this, all operators are assigned a level of precedence. Operators with the highest level of precedence are evaluated first.

You can see in the table below that multiplication and division (precedence level 5) have more precedence than addition and subtraction (precedence level 6). Thus, _4 + 2 * 3_ evaluates as _4 + (2 * 3)_ because multiplication has a higher level of precedence than addition.

Operator associativity

What happens if two operators in the same expression have the same precedence level? For example, in the expression _3 * 4 / 2_, the multiplication and division operators are both precedence level 5. In this case, the compiler can’t rely upon precedence alone to determine how to evaluate the result.

If two operators with the same precedence level are adjacent to each other in an expression, the operator’s associativity tells the compiler whether to evaluate the operators from left to right or from right to left. The operators in precedence level 5 have an associativity of left to right, so the expression is resolved from left to right: _(3 * 4) / 2 = 6_.

Table of operators

The below table is primarily meant to be a reference chart that you can refer back to in the future to resolve any precedence or associativity questions you have.

Notes:

-   Precedence level 1 is the highest precedence level, and level 17 is the lowest. Operators with a higher precedence level get evaluated first.
-   L->R means left to right associativity.
-   R->L means right to left associativity.