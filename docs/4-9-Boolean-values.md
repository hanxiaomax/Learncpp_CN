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

??? note "关键点速记"
	- 

在现实中，有些问题的答案只有”是“或”不是“两种。”苹果是水果吗？“，是的。”你爱吃笋吗？“不。

现在，我们考虑一个类似的语句，它只能用`true`或`false`来回答：”苹果是水果“，`true`。”我喜欢吃笋“，`false`。

像这种只有两种可能答案的语句（yes/true 或 no/false）很常见，很多编程语言都有用于处理此类输出结果的特殊类型。它们称为布尔类型（注意：Boolean在英语中是大大写字母开头的，因为它的发明人是乔治布尔（George Boole））。


## 布尔变量

布尔变量只有两种可能的值：_true_ 和 _false_。

声明布尔类型的变量需要使用关键字 **bool**。

```cpp
bool b;
```

初始化布尔类型的变量或为其赋值，需要使用 `true` 或 `false`。

```cpp
bool b1 { true };
bool b2 { false };
b1 = false;
bool b3 {}; // 默认初始化为 false
```


和一元负号运算符(`-`)可以被用来将一个正数变成负数一样，使用逻辑**非**运算符(`!`)可以将布尔值`true`变成`false`或者把`false`变成`true`：

```cpp
bool b1 { !true }; // b1 被初始化为 false
bool b2 { !false }; // b2 被初始化为 true
```

布尔值通常并不会以 “true” 或 “false”来存储。实际上它是以整型来存储的：`true`会变成1，`false`会变成0。类似地，当布尔类型求值时，求值的实际结果也并不是“true” 或 “false”。通常它们会求值成_0_ (false) 或 _1_ (true)。因为布尔类型实际上是以整型存储的，因此它属于一种整形的类型(integral type)。


## 打印布尔变量

当使用 `std::cout`打印布尔变量时， `std::cout` 会将 false 打印成 0，而把 true 打印成1：

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

Outputs:

```
1
0
0
1
```

如果你希望 `std::cout` 打印 “true” 或 “false” 而不是 0 或 1，你可以使用 `std::boolalpha`。例如：

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

打印结果：

```
1
0
true
false
```

你可以使用 `std::noboolalpha` 来关闭此功能。

## 整型转换为布尔类型

你不能用统一初始化和一个整型数来初始化布尔变量：

```cpp
#include <iostream>

int main()
{
	bool b{ 4 }; // 错误：: narrowing conversions disallowed
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

```
true
false
```

Note: `bool b1 = 4;` may generate a warning. If so you’ll have to disable treating warnings as errors to compile the example.

## 输入布尔值

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

However, when `std::boolalpha` is enabled, “0” and “1” will no longer be treated as booleans.

## 布尔类型的返回值

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


Here’s output from two runs of this program:

```
Enter an integer: 5
Enter another integer: 5
5 and 5 are equal? true
```

```
Enter an integer: 6
Enter another integer: 4
6 and 4 are equal? false
```

How does this work? First we read in integer values for _x_ and _y_. Next, the expression “isEqual(x, y)” is evaluated. In the first run, this results in a function call to isEqual(5, 5). Inside that function, 5 == 5 is evaluated, producing the value _true_. The value _true_ is returned back to the caller to be printed by std::cout. In the second run, the call to isEqual(6, 4) returns the value _false_.

Boolean values take a little bit of getting used to, but once you get your mind wrapped around them, they’re quite refreshing in their simplicity! Boolean values are also a huge part of the language -- you’ll end up using them more than all the other fundamental types put together!

We’ll continue our exploration of Boolean values in the next lesson.