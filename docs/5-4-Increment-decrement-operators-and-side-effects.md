---
title: 5.4 - 自增自减运算符及其副作用
alias: 5.4 - 自增自减运算符及其副作用
origin: /increment-decrement-operators-and-side-effects/
origin_title: "5.4 — Increment/decrement operators, and side effects"
time: 2021-12-2
type: translation
tags:
- operator
---

## 变量的自增自减

Incrementing (adding 1 to) and decrementing (subtracting 1 from) a variable are both so common that they have their own operators.


|Operator	|Symbol	|Form	|Operation|
|---|---|---|---|
|Prefix increment (pre-increment)	|++	|++x	|Increment x, then return x
|Prefix decrement (pre-decrement)	|––	|––x	|Decrement x, then return x
|Postfix increment (post-increment)	|++	|x++	|Copy x, then increment x, then return the copy
|Postfix decrement (post-decrement)|––	|x––	|Copy x, then decrement x, then return the copy


Note that there are two versions of each operator -- a prefix version (where the operator comes before the operand) and a postfix version (where the operator comes after the operand).

The prefix increment/decrement operators are very straightforward. First, the operand is incremented or decremented, and then expression evaluates to the value of the operand. For example:

```cpp
#include <iostream>

int main()
{
    int x { 5 };
    int y = ++x; // x is incremented to 6, x is evaluated to the value 6, and 6 is assigned to y

    std::cout << x << ' ' << y;
    return 0;
}
```

This prints:

```
6 6
```

The postfix increment/decrement operators are trickier. First, a copy of the operand is made. Then the operand (not the copy) is incremented or decremented. Finally, the copy (not the original) is evaluated. For example:

```cpp
#include <iostream>

int main()
{
    int x { 5 };
    int y = x++; // x is incremented to 6, copy of original x is evaluated to the value 5, and 5 is assigned to y

    std::cout << x << ' ' << y;
    return 0;
}
```

This prints:

```
6 5
```

Let’s examine how this line 6 works in more detail. First, a temporary copy of _x_ is made that starts with the same value as _x_ (5). Then the actual _x_ is incremented from _5_ to _6_. Then the copy of _x_ (which still has value _5_) is returned and assigned to _y_. Then the temporary copy is discarded.

Consequently, _y_ ends up with the value of _5_ (the pre-incremented value), and _x_ ends up with the value _6_ (the post-incremented value).

Note that the postfix version takes a lot more steps, and thus may not be as performant as the prefix version.

Here is another example showing the difference between the prefix and postfix versions:

```cpp
#include <iostream>

int main()
{
    int x{ 5 };
    int y{ 5 };
    std::cout << x << ' ' << y << '\n';
    std::cout << ++x << ' ' << --y << '\n'; // prefix
    std::cout << x << ' ' << y << '\n';
    std::cout << x++ << ' ' << y-- << '\n'; // postfix
    std::cout << x << ' ' << y << '\n';

    return 0;
}
```


This produces the output:

```
5 5
6 4
6 4
6 4
7 3
```

On the 8th line, we do a prefix increment and decrement. On this line, _x_ and _y_ are incremented/decremented _before_ their values are sent to std::cout, so we see their updated values reflected by std::cout.

On the 10th line, we do a postfix increment and decrement. On this line, the copy of _x_ and _y_ (with the pre-incremented and pre-decremented values) are what is sent to std::cout, so we don’t see the increment and decrement reflected here. Those changes don’t show up until the next line, when _x_ and _y_ are evaluated again.

!!! success "最佳实践"

	Strongly favor the prefix version of the increment and decrement operators, as they are generally more performant, and you’re less likely to run into strange issues with them.

## 副作用

A function or expression is said to have a side effect if it does anything that persists beyond the life of the function or expression itself.

Common examples of side effects include changing the value of objects, doing input or output, or updating a graphical user interface (e.g. enabling or disabling a button).

Most of the time, side effects are useful:

```cpp
x = 5; // the assignment operator modifies the state of x
++x; // operator++ modifies the state of x
std::cout << x; // operator<< modifies the state of the console
```

The assignment operator in the above example has the side effect of changing the value of _x_ permanently. Even after the statement has finished executing, _x_ will still have the value 5. Similarly with operator++, the value of _x_ is altered even after the statement has finished evaluating. The outputting of _x_ also has the side effect of modifying the state of the console, as you can now see the value of _x_ printed to the console.

However, side effects can also lead to unexpected results:

```cpp
#include <iostream>

int add(int x, int y)
{
    return x + y;
}

int main()
{
    int x{ 5 };
    int value{ add(x, ++x) }; // is this 5 + 6, or 6 + 6?
    // It depends on what order your compiler evaluates the function arguments in

    std::cout << value << '\n'; // value could be 11 or 12, depending on how the above line evaluates!
    return 0;
}
```


The C++ standard does not define the order in which function arguments are evaluated. If the left argument is evaluated first, this becomes a call to add(5, 6), which equals 11. If the right argument is evaluated first, this becomes a call to add(6, 6), which equals 12! Note that this is only a problem because one of the arguments to function add() has a side effect.

!!! cite "题外话"

    The C++ standard intentionally does not define these things so that compilers can do whatever is most natural (and thus most performant) for a given architecture.

There are other cases where the C++ standard does not specify the order in which certain things are evaluated (such as operator operands), so different compilers may exhibit different behaviors. Even when the C++ standard does make it clear how things should be evaluated, historically this has been an area where there have been many compiler bugs. These problems can generally _all_ be avoided by ensuring that any variable that has a side-effect applied is used no more than once in a given statement.

!!! warning "注意"

	C++ does not define the order of evaluation for function arguments or operator operands.

!!! warning "注意"

	Don’t use a variable that has a side effect applied to it more than once in a given statement. If you do, the result may be undefined.