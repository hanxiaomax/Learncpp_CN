---
title: 5.x - 小结与测试
alias: 5.x - 小结与测试
origin: /chapter-5-summary-and-quiz/
origin_title: "5.x — Chapter 5 summary and quiz"
time: 2021-6-28
type: translation
tags:
- summary
---


## Quick review

Always use parentheses to disambiguate the precedence of operators if there is any question or opportunity for confusion.

The arithmetic operators all work like they do in normal mathematics. The modulus (%) operator returns the remainder from an integer division.

The increment and decrement operators can be used to easily increment or decrement numbers. Avoid the postfix versions of these operators whenever possible.

Beware of side effects, particularly when it comes to the order that function parameters are evaluated. Do not use a variable that has a side effect applied more than once in a given statement.

The comma operator can compress multiple statements into one. Writing the statements separately is usually better.

The conditional operator is a nice short version of an if-statement, but don’t use it as an alternative to an if-statement. Only use the conditional operator if you use its result.

Relational operators can be used to compare floating point numbers. Beware using equality and inequality on floating point numbers.

Logical operators allow us to form compound conditional statements.