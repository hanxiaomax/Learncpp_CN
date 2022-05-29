---
title: 4.10 - if 语句
alias: 4.10 - if 语句
origin: /introduction-to-if-statements/
origin_title: "4.10 — Introduction to if statements"
time: 2021-10-18
type: translation
tags:
- if
---

Consider a case where you’re going to go to the market, and your roommate tells you, “if they have strawberries on sale, buy some”. This is a conditional statement, meaning that you’ll execute some action (“buy some”) only if the condition (“they have strawberries on sale”) is true.

Such conditions are common in programming, as they allow us to implement conditional behavior into our programs. The simplest kind of conditional statement in C++ is called an _if statement_. An if statement allows us to execute one (or more) lines of code only if some condition is true.

The simplest _if statement_ takes the following form:

if (condition) true_statement;

For readability, this is more often written as following:

if (condition)
    true_statement;

A condition (also called a conditional expression) is an expression that evaluates to a Boolean value.

If the _condition_ of an _if statement_ evaluates to Boolean value _true_, then _true_statement_ is executed. If the _condition_ instead evaluates to Boolean value _false_, then _true_statement_ is skipped.

A sample program using an if statement

Given the following program:

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter an integer: ";
    int x {};
    std::cin >> x;

    if (x == 0)
        std::cout << "The value is zero\n";

    return 0;
}
```

COPY

Here’s output from one run of this program:

Enter an integer: 0
The value is zero

Let’s examine how this works in more detail.

First, the user enters an integer. Then the condition _x == 0_ is evaluated. The _equality operator_ (==) is used to test whether two values are equal. Operator== returns _true_ if the operands are equal, and _false_ if they are not. Since _x_ has value 0, and _0 == 0_ is true, this expression evaluates to _true_.

Because the condition has evaluated to _true_, the subsequent statement executes, printing _The value is zero_.

Here’s another run of this program:

Enter an integer: 5

In this case, _x == 0_ evaluates to _false_. The subsequent statement is skipped, the program ends, and nothing else is printed.

Warning

_If statements_ only conditionally execute a single statement. We talk about how to conditionally execute multiple statements in lesson [7.2 -- If statements and blocks](https://www.learncpp.com/cpp-tutorial/if-statements-and-blocks/).

If-else

Given the above example, what if we wanted to tell the user that the number they entered was non-zero?

We could write something like this:

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter an integer: ";
    int x {};
    std::cin >> x;

    if (x == 0)
        std::cout << "The value is zero\n";
    if (x != 0)
        std::cout << "The value is non-zero\n";

    return 0;
}
```

COPY

Or this:

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter an integer: ";
    int x {};
    std::cin >> x;

    bool zero { (x == 0) };
    if (zero)
        std::cout << "The value is zero\n";
    if (!zero)
        std::cout << "The value is non-zero\n";

    return 0;
}
```

COPY

Both of these programs are more complex than they need to be. Instead, we can use an alternative form of the _if statement_ called _if-else_. _If-else_ takes the following form:

if (condition)
    true_statement;
else
    false_statement;

If the _condition_ evaluates to Boolean true, _true_statement_ executes. Otherwise _false_statement_ executes.

Let’s amend our previous program to use an _if-else_.

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter an integer: ";
    int x {};
    std::cin >> x;

    if (x == 0)
        std::cout << "The value is zero\n";
    else
        std::cout << "The value is non-zero\n";

    return 0;
}
```

COPY

Now our program will produce the following output:

Enter an integer: 0
The value is zero

Enter an integer: 5
The value is non-zero

Chaining if statements

Sometimes we want to check if several things are true or false in sequence. We can do so by chaining an _if statement_ to a prior _if-else_, like so:

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter an integer: ";
    int x {};
    std::cin >> x;

    if (x > 0)
        std::cout << "The value is positive\n";
    else if (x < 0)
        std::cout << "The value is negative\n";
    else
        std::cout << "The value is zero\n";

    return 0;
}
```

COPY

The _less than operator_ (<) is used to test whether one value is less than another. Similarly, the _greater than operator_ (>) is used to test whether one value is greater than another. These operators both return Boolean values.

Here’s output from a few runs of this program:

Enter an integer: 4
The value is positive

Enter an integer: -3
The value is negative

Enter an integer: 0
The value is zero

Note that you can chain _if statements_ as many times as you have conditions you want to evaluate. We’ll see an example in the quiz where this is useful.

Boolean return values and if statements

In the previous lesson ([4.9 -- Boolean values](https://www.learncpp.com/cpp-tutorial/boolean-values/)), we wrote this program using a function that returns a Boolean value:

```cpp
#include <iostream>

// returns true if x and y are equal, false otherwise
bool isEqual(int x, int y)
{
    return (x == y); // operator== returns true if x equals y, and false otherwise
}

int main()
{
    std::cout << "Enter an integer: ";
    int x {};
    std::cin >> x;

    std::cout << "Enter another integer: ";
    int y {};
    std::cin >> y;

    std::cout << std::boolalpha; // print bools as true or false

    std::cout << x << " and " << y << " are equal? ";
    std::cout << isEqual(x, y); // will return true or false

    return 0;
}
```

COPY

Let’s improve this program using an _if statement_:

```cpp
#include <iostream>

// returns true if x and y are equal, false otherwise
bool isEqual(int x, int y)
{
    return (x == y); // operator== returns true if x equals y, and false otherwise
}

int main()
{
    std::cout << "Enter an integer: ";
    int x {};
    std::cin >> x;

    std::cout << "Enter another integer: ";
    int y {};
    std::cin >> y;

    if (isEqual(x, y))
        std::cout << x << " and " << y << " are equal\n";
    else
        std::cout << x << " and " << y << " are not equal\n";

    return 0;
}
```

COPY

Two runs of this program:

Enter an integer: 5
Enter another integer: 5
5 and 5 are equal

Enter an integer: 6
Enter another integer: 4
6 and 4 are not equal

In this case, our conditional expression is simply a function call to function _isEqual_, which returns a Boolean value.

Non-Boolean conditionals

In all of the examples above, our conditionals have been either Boolean values (true or false), Boolean variables, or functions that return a Boolean value. What happens if your conditional is an expression that does not evaluate to a Boolean value?

In such a case, the conditional expression is converted to a Boolean value: non-zero values get converted to Boolean _true_, and zero-values get converted to Boolean _false_.

Therefore, if we do something like this:

```cpp
#include <iostream>

int main()
{
    if (4) // nonsensical, but for the sake of example...
        std::cout << "hi";
    else
        std::cout << "bye";

    return 0;
}
```

COPY

This will print “hi”, since 4 is a non-zero value that gets converted to Boolean _true_, causing the statement attached to the _if_ to execute.

We’ll continue our exploration of _if statements_ in future lesson [7.2 -- If statements and blocks](https://www.learncpp.com/cpp-tutorial/if-statements-and-blocks/).