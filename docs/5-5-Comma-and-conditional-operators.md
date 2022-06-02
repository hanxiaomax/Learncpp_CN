---
title: 5.5 - 逗号和条件运算符
alias: 5.5 - 逗号和条件运算符
origin: /comma-and-conditional-operators/
origin_title: "5.5 — Comma and conditional operators"
time: 2021-12-15
type: translation
tags:
- operator
---

## 逗号运算符

|运算符	|符号	|形式|	操作 |
|---|---|---|---|
|Comma|	,|	x, y	|Evaluate x then y, returns value of y


The comma operator (`,`) allows you to evaluate multiple expressions wherever a single expression is allowed. The comma operator evaluates the left operand, then the right operand, and then returns the result of the right operand.

For example:

```cpp
#include <iostream>

int main()
{
    int x{ 1 };
    int y{ 2 };

    std::cout << (++x, ++y); // increment x and y, evaluates to the right operand

    return 0;
}
```

First the left operand of the comma operator is evaluated, which increments _x_ from _1_ to _2_. Next, the right operand is evaluated, which increments _y_from _2_ to _3_. The comma operator returns the result of the right operand (_3_), which is subsequently printed to the console.

Note that comma has the lowest precedence of all the operators, even lower than assignment. Because of this, the following two lines of code do different things:

```cpp
z = (a, b); // evaluate (a, b) first to get result of b, then assign that value to variable z.
z = a, b; // evaluates as "(z = a), b", so z gets assigned the value of a, and b is evaluated and discarded.
```


This makes the comma operator somewhat dangerous to use.

In almost every case, a statement written using the comma operator would be better written as separate statements. For example, the above code could be written as:

```cpp
#include <iostream>

int main()
{
    int x{ 1 };
    int y{ 2 };

    ++x;
    std::cout << ++y;

    return 0;
}
```


Most programmers do not use the comma operator at all, with the single exception of inside _for loops_, where its use is fairly common. We discuss for loops in future lesson [[7.9 -- For statements|7.9 - for 语句]].

!!! success "最佳实践"

	Avoid using the comma operator, except within _for loops_.

## 逗号作为分隔符

In C++, the comma symbol is often used as a separator, and these uses do not invoke the comma operator. Some examples of separator commas:

```cpp
void foo(int x, int y) // Comma used to separate parameters in function definition
{
    add(x, y); // Comma used to separate arguments in function call
    constexpr int z{ 3 }, w{ 5 }; // Comma used to separate multiple variables being defined on the same line (don't do this)
}
```


There is no need to avoid separator commas (except when declaring multiple variables, which you should not do).


## 条件运算符


|运算符	|符号|	形式	|操作|
|---|---|---|---|
|Conditional	|?:	|c ? x : y	|If c is nonzero (true) then evaluate x, otherwise evaluate y


The conditional operator (`?:`) (also sometimes called the “arithmetic if” operator) is a ternary operator (it takes 3 operands). Because it has historically been C++’s only ternary operator, it’s also sometimes referred to as “the ternary operator”.

The `?:` operator provides a shorthand method for doing a particular type of if/else statement. Please review lesson 4.10 -- Introduction to if statements if you need a brush up on if/else before proceeding.

An if/else statement takes the following form:


```
if (condition)
    statement1;
else
    statement2;
```

If _condition_ evaluates to `true` , then _statement1_ is executed, otherwise _statement2_ is executed.

The `?:` operator takes the following form:

```
(condition) ? expression1 : expression2;
```


If _condition_ evaluates to _true_, then _expression1_ is executed, otherwise _expression2_ is executed. Note that _expression2_ is not optional.

Consider an if/else statement that looks like this:

```cpp
if (x > y)
    larger = x;
else
    larger = y;
```

can be rewritten as:

```cpp
larger = (x > y) ? x : y;
```


In such uses, the conditional operator can help compact code without losing readability.

Parenthesization of the conditional operator

It is common convention to put the conditional part of the operation inside of parentheses, both to make it easier to read, and also to make sure the precedence is correct. The other operands evaluate as if they were parenthesized, so explicit parenthesization is not required for those.

Note that the ?: operator has a very low precedence. If doing anything other than assigning the result to a variable, the whole ?: operator also needs to be wrapped in parentheses.

For example, to print the larger of values x and y to the screen, we could do this:

```cpp
if (x > y)
    std::cout << x;
else
    std::cout << y;
```

Or we could use the conditional operator to do this:

```cpp
std::cout << ((x > y) ? x : y);
```


Let’s examine what happens if we don’t parenthesize the whole conditional operator in the above case.

Because the << operator has higher precedence than the ?: operator, the statement:

```cpp
std::cout << (x > y) ? x : y;
```

would evaluate as:

```cpp
(std::cout << (x > y)) ? x : y;
```


That would print 1 (true) if x > y, or 0 (false) otherwise!

!!! success "最佳实践"

	Always parenthesize the conditional part of the conditional operator, and consider parenthesizing the whole thing as well.

## 条件运算符作为表达式求值

Because the conditional operator operands are expressions rather than statements, the conditional operator can be used in some places where if/else can not.

For example, when initializing a constant variable:

```cpp
#include <iostream>

int main()
{
    constexpr bool inBigClassroom { false };
    constexpr int classSize { inBigClassroom ? 30 : 20 };
    std::cout << "The class size is: " << classSize << '\n';

    return 0;
}
```


There’s no satisfactory if/else statement for this. You might think to try something like this:

```cpp
#include <iostream>

int main()
{
    constexpr bool inBigClassroom { false };

    if (inBigClassroom)
        constexpr int classSize { 30 };
    else
        constexpr int classSize { 20 };

    std::cout << "The class size is: " << classSize;

    return 0;
}
```


However, this won’t compile, and you’ll get an error message that classSize isn’t defined. Much like how variables defined inside functions die at the end of the function, variables defined inside an if or else statement die at the end of the if or else statement. Thus, classSize has already been destroyed by the time we try to print it.

If you want to use an if/else, you’d have to do something like this:

```cpp
#include <iostream>

int getClassSize(bool inBigClassroom)
{
    if (inBigClassroom)
        return 30;

    return 20;
}

int main()
{
    const int classSize { getClassSize(false) };
    std::cout << "The class size is: " << classSize;

    return 0;
}
```

This one works because we’re not defining variables inside the _if_ or _else_, we’re just returning a value back to the caller, which can then be used as the initializer.

That’s a lot of extra work!

## The type of the expressions must match or be convertible

To properly comply with C++’s type checking, either the type of both expressions in a conditional statement must match, or the both expressions must be convertible to a common type.

!!! info "扩展阅读"

    The conversion rules used when the types don’t match are rather complicated. You can find them [here](https://en.cppreference.com/w/cpp/language/operator_other).

So while you might expect to be able to do something like this:

```cpp
#include <iostream>

int main()
{
	constexpr int x{ 5 };
	std::cout << (x != 5 ? x : "x is 5"); // won't compile

	return 0;
}
```


The above example won’t compile. One of the expressions is an integer, and the other is a string literal. The compiler is unable to determine a common type for expressions of these types. In such cases, you’ll have to use an if/else.

## 什么时候应该使用条件操作符？

The conditional operator gives us a convenient way to compact some if/else statements. It’s most useful when we need a conditional initializer (or assignment) for a variable, or to pass a conditional value to a function.

It should not be used for complex if/else statements, as it quickly becomes both unreadable and error prone.

!!! success "最佳实践"

	Only use the conditional operator for simple conditionals where you use the result and where it enhances readability.