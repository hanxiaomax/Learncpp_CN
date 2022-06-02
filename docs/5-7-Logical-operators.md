---
title: 5.7 - 逻辑运算符
alias: 5.7 - 逻辑运算符
origin: /logical-operators/
origin_title: "5.7 — Logical operators"
time: 2022-5-2
type: translation
tags:
- operator
---

While relational (comparison) operators can be used to test whether a particular condition is true or false, they can only test one condition at a time. Often we need to know whether multiple conditions are true simultaneously. For example, to check whether we’ve won the lottery, we have to compare whether all of the multiple numbers we picked match the winning numbers. In a lottery with 6 numbers, this would involve 6 comparisons, _all_ of which have to be true. In other cases, we need to know whether any one of multiple conditions is true. For example, we may decide to skip work today if we’re sick, or if we’re too tired, or if we won the lottery in our previous example. This would involve checking whether _any_ of 3 comparisons is true.

Logical operators provide us with the capability to test multiple conditions.

C++ has 3 logical operators:

|Operator	|Symbol	|Form	|Operation|
|----|----|----|----|
|Logical NOT	|!	|!x	|true if x is false, or false if x is true|
|Logical AND	|&&	|x && y	|true if both x and y are true, false otherwise|
|Logical OR	|||	|x || y	|true if either x or y are true, false otherwise|


## Logical NOT

You have already run across the logical NOT unary operator in lesson [4.9 -- Boolean values](https://www.learncpp.com/cpp-tutorial/boolean-values/). We can summarize the effects of logical NOT like so:


|Operand|	Result|
|---|---|
|true|	false
|false|	true


If _logical NOT’s_ operand evaluates to true, _logical NOT_ evaluates to false. If _logical NOT’s_ operand evaluates to false, _logical NOT_ evaluates to true. In other words, _logical NOT_ flips a Boolean value from true to false, and vice-versa.

Logical NOT is often used in conditionals:

```cpp
bool tooLarge { x > 100 }; // tooLarge is true if x > 100
if (!tooLarge)
    // do something with x
else
    // print an error
```

COPY

One thing to be wary of is that _logical NOT_ has a very high level of precedence. New programmers often make the following mistake:

```cpp
#include <iostream>

int main()
{
    int x{ 5 };
    int y{ 7 };

    if (!x > y)
        std::cout << x << " is not greater than " << y << '\n';
    else
        std::cout << x << " is greater than " << y << '\n';

    return 0;
}
```

COPY

This program prints:

5 is greater than 7

But _x_ is not greater than _y_, so how is this possible? The answer is that because the _logical NOT_ operator has higher precedence than the _greater than_operator, the expression `! x > y` actually evaluates as `(!x) > y`. Since _x_ is 5, !x evaluates to _0_, and `0 > y` is false, so the _else_ statement executes!

The correct way to write the above snippet is:

```cpp
#include <iostream>

int main()
{
    int x{ 5 };
    int y{ 7 };

    if (!(x > y))
        std::cout << x << " is not greater than " << y << '\n';
    else
        std::cout << x << " is greater than " << y << '\n';

    return 0;
}
```

COPY

This way, `x > y` will be evaluated first, and then logical NOT will flip the Boolean result.

Best practice

If _logical NOT_ is intended to operate on the result of other operators, the other operators and their operands need to be enclosed in parentheses.

Simple uses of _logical NOT_, such as `if (!value)` do not need parentheses because precedence does not come into play.

Logical OR

The _logical OR_ operator is used to test whether either of two conditions is true. If the left operand evaluates to true, or the right operand evaluates to true, or both are true, then the _logical OR_ operator returns true. Otherwise it will return false.

|Left operand	|Right operand	|Result|
|---|----|----|
|false	|false	|false|
|false	|true	|true|
|true	|false	|true|
|true	|true	|true|
