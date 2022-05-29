---
title: 4.9 - 布尔值
alias: 4.9 - 布尔值
origin: /boolean-values/
origin_title: "4.9 — Boolean values"
time: 2022-5-2
type: translation
tags:
- data type
- bool
---

In real-life, it’s common to ask or be asked questions that can be answered with “yes” or “no”. “Is an apple a fruit?” Yes. “Do you like asparagus?” No.

Now consider a similar statement that can be answered with a “true” or “false”: “Apples are a fruit”. It’s clearly true. Or how about, “I like asparagus”. Absolutely false (yuck!).

These kinds of sentences that have only two possible outcomes: yes/true, or no/false are so common, that many programming languages include a special type for dealing with them. That type is called a Boolean type (note: Boolean is properly capitalized in the English language because it’s named after its inventor, George Boole).

Boolean variables

Boolean variables are variables that can have only two possible values: _true_, and _false_.

To declare a Boolean variable, we use the keyword **bool**.

```cpp
bool b;
```

COPY

To initialize or assign a _true_ or _false_ value to a Boolean variable, we use the keywords true and false.

```cpp
bool b1 { true };
bool b2 { false };
b1 = false;
bool b3 {}; // default initialize to false
```

COPY

Just as the unary minus operator (-) can be used to make an integer negative, the logical NOT operator (!) can be used to flip a Boolean value from _true_ to _false_, or _false_ to _true_:

```cpp
bool b1 { !true }; // b1 will be initialized with the value false
bool b2 { !false }; // b2 will be initialized with the value true
```

COPY

Boolean values are not actually stored in Boolean variables as the words “true” or “false”. Instead, they are stored as integers: _true_ becomes the integer _1_, and _false_ becomes the integer _0_. Similarly, when Boolean values are evaluated, they don’t actually evaluate to “true” or “false”. They evaluate to the integers _0_ (false) or _1_ (true). Because Booleans actually store integers, they are considered an integral type.

Printing Boolean variables

When we print Boolean values with std::cout, std::cout prints _0_ for _false_, and _1_ for _true_:

```cpp
#include <iostream>

int main()
{
    std::cout << true << '\n'; // true evaluates to 1
    std::cout << !true << '\n'; // !true evaluates to 0

    bool b{false};
    std::cout << b << '\n'; // b is false, which evaluates to 0
    std::cout << !b << '\n'; // !b is true, which evaluates to 1
    return 0;
}
```

COPY

Outputs:

1
0
0
1

If you want std::cout to print “true” or “false” instead of 0 or 1, you can use _std::boolalpha_. Here’s an example:

```cpp
#include <iostream>

int main()
{
    std::cout << true << '\n';
    std::cout << false << '\n';

    std::cout << std::boolalpha; // print bools as true or false

    std::cout << true << '\n';
    std::cout << false << '\n';
    return 0;
}
```

COPY

This prints:

1
0
true
false

You can use _std::noboolalpha_ to turn it back off.

Integer to Boolean conversion

You can’t initialize a Boolean with an integer using uniform initialization:

```cpp
#include <iostream>

int main()
{
	bool b{ 4 }; // error: narrowing conversions disallowed
	std::cout << b;

	return 0;
}
```

COPY

(note: some versions of g++ don’t enforce this properly)

However, in any context where an integer can be converted to a Boolean , the integer _0_ is converted to _false_, and any other integer is converted to _true_.

```cpp
#include <iostream>

int main()
{
	std::cout << std::boolalpha; // print bools as true or false

	bool b1 = 4 ; // copy initialization allows implicit conversion from int to bool
	std::cout << b1 << '\n';

	bool b2 = 0 ; // copy initialization allows implicit conversion from int to bool
	std::cout << b2 << '\n';


	return 0;
}
```

COPY

This prints:

true
false

Note: `bool b1 = 4;` may generate a warning. If so you’ll have to disable treating warnings as errors to compile the example.

Inputting Boolean values

Inputting Boolean values using _std::cin_ sometimes trips new programmers up.

Consider the following program:

```cpp
#include <iostream>

int main()
{
	bool b{}; // default initialize to false
	std::cout << "Enter a boolean value: ";
	std::cin >> b;
	std::cout << "You entered: " << b << '\n';

	return 0;
}
```

COPY

Enter a Boolean value: true
You entered: 0

Wait, what?

It turns out that _std::cin_ only accepts two inputs for boolean variables: 0 and 1 (_not_ true or false). Any other inputs will cause _std::cin_ to silently fail. In this case, because we entered _true_, _std::cin_ silently failed. A failed input will also zero-out the variable, so _b_ also gets assigned value _false_. Consequently, when _std::cout_ prints a value for _b_, it prints 0.

To make _std::cin_ accept “false” and “true” as inputs, the _std::boolalpha_ option has to be enabled

```cpp
#include <iostream>

int main()
{
	bool b{};
	std::cout << "Enter a boolean value: ";

	// Allow the user to enter 'true' or 'false' for boolean values
	std::cin >> std::boolalpha;
	std::cin >> b;

	std::cout << "You entered: " << b << '\n';

	return 0;
}
```

COPY

However, when _std::boolalpha_ is enabled, “0” and “1” will no longer be treated as booleans.

Boolean return values

Boolean values are often used as the return values for functions that check whether something is true or not. Such functions are typically named starting with the word _is_(e.g. isEqual) or _has_ (e.g. hasCommonDivisor).

Consider the following example, which is quite similar to the above:

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
    int x{};
    std::cin >> x;

    std::cout << "Enter another integer: ";
    int y{};
    std::cin >> y;

    std::cout << std::boolalpha; // print bools as true or false

    std::cout << x << " and " << y << " are equal? ";
    std::cout << isEqual(x, y); // will return true or false

    return 0;
}
```

COPY

Here’s output from two runs of this program:

Enter an integer: 5
Enter another integer: 5
5 and 5 are equal? true

Enter an integer: 6
Enter another integer: 4
6 and 4 are equal? false

How does this work? First we read in integer values for _x_ and _y_. Next, the expression “isEqual(x, y)” is evaluated. In the first run, this results in a function call to isEqual(5, 5). Inside that function, 5 == 5 is evaluated, producing the value _true_. The value _true_ is returned back to the caller to be printed by std::cout. In the second run, the call to isEqual(6, 4) returns the value _false_.

Boolean values take a little bit of getting used to, but once you get your mind wrapped around them, they’re quite refreshing in their simplicity! Boolean values are also a huge part of the language -- you’ll end up using them more than all the other fundamental types put together!

We’ll continue our exploration of Boolean values in the next lesson.