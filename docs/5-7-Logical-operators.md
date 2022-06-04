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

尽管条件（比较）运算符可以被用来测试一个特定的表达式是否为真，但它们一次只能对一个条件进行测试。很多时候，我们需要知道多个条件是否同时为真。例如，为了确定彩票是否中奖，我们必须将购买的每一个数字和中奖号码的各个数字逐一比较。对于有6个数的彩票，这就需要6次比较，只有当它们的结果全部都是真的时候，才能看做中奖。还有一些情况，我们需要知道多个条件中是否有一个为真。例如，如果我今天生病了，或者太累了，又或者中了彩票，这三个条件只要有一条为真我就会考虑翘班。

逻辑运算符就为我们提供了这样的能力。

C++ 提供了三种逻辑运算符：

|运算符	|符号	|形式	|操作|
|---|---|---|---|
|逻辑非 NOT	|!	|!x	|如果 x 为真则为 false，如果 x 为假则为 true |
|逻辑与 AND	|&&	|x && y	|如果 x 和 y 都是真，则为 true，否则为 false|
|逻辑或 OR	| \|\|	| x \|\| y| 如果 x 或 y 其中一个位真，则为真，否则为假|


## 逻辑非（NOT）

在 [[4-9-Boolean-values|4.9 - 布尔值]] 一节课中你已经遇到逻辑非这个一元运算符：

|操作符|	结果|
|---|---|
|true|	false
|false|	true


如果逻辑非的操作数求值为 `true`，则逻辑非求值为 `false`。如果逻辑非的操作数求值为 `false`，逻辑非的求值为 `true`。换句话说，逻辑非可以将布尔值反转，真变成假，假变成真。

逻辑非经常被用在条件表达式中：

```cpp
bool tooLarge { x > 100 }; // tooLarge is true if x > 100
if (!tooLarge)
    // do something with x
else
    // print an error
```


有件事情需要注意，那就逻辑非的优先级非常高。新手程序员经常会犯这样的错误：

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


打印结果如下：

```
5 is greater than 7
```

但是 _x_ 并不比 7 大，这结果是怎么得到的？这是因为逻辑非的优先级比大于号的优先级高，因此 `! x > y` 实际上相当于`(!x) > y`。因为 `x` 是 5，`!x` 求值结果为 _0_，而  `0 > y` 是假，所以执行的是 else 的语句。

正确的做法应该像下面这样：

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


这样  `x > y` 会首先进行求值，然后再通过逻辑非将布尔结果反转。

!!! success "最佳实践"

	如果逻辑非要对其他运算符的结果进行操作，那么其他运算符和它们的操作数应该放在括号中。
	
逻辑非的简单用法，例如 `if (!value)` 并不需要括号，因为这时不会受到优先级的影响。

## 逻辑或（OR）

逻辑或运算符被用来测试两个条件中是否有为真的。如果左操作数或右操作数为 `true`，或者两个都是 `true`，则逻辑或表达式会返回 `true`，否则返回 `false`。

|左操作数	|右操作数	|结果|
|---|----|----|
|false	|false	|false|
|false	|true	|true|
|true	|false	|true|
|true	|true	|true|

例如，考虑下面的代码：

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter a number: ";
    int value {};
    std::cin >> value;

    if (value == 0 || value == 1)
        std::cout << "You picked 0 or 1\n";
    else
        std::cout << "You did not pick 0 or 1\n";
    return 0;
}
```

这种情况下，我们使用逻辑或运算符来判断做操作数 (`value == 0`) 或者右操作数 (`value == 1`) 是否为真。如果其一（或两个）全部为真，则逻辑或运算符的求值结果为真，if 语句就会被执行。如果两个操作数都是假，逻辑或运算符的结果就是假，那么 else 语句就会执行。

你可以将多个逻辑或表达式连接起来：

```cpp
if (value == 0 || value == 1 || value == 2 || value == 3)
     std::cout << "You picked 0, 1, 2, or 3\n";
```

新手程序员经常会把逻辑或运算符 (`||`) 和按位或运算符搞混 (`|`) (稍后会介绍)。 即使它们的名字中都有一个或，其功能确是不同的。将它们混为一谈会带来错误的结果。


## 逻辑与（AND)

逻辑与运算符被用作测试两个操作数是否均为真。如果均为真，则逻辑与会返回 `true`，否则返回值为`false` 。

|左操作数	|右操作数	|结果|
|---|---|---|
|false	|false	|false|
|false	|true	|false|
|true	|false	|false|
|true	|true	|true|


例如，我们想要判断 x 是否在 10 到 20 之间：我们必须知道 _x_ 是否大于 _10_，**并且**是否小于 20：

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter a number: ";
    int value {};
    std::cin >> value;

    if (value > 10 && value < 20)
        std::cout << "Your value is between 10 and 20\n";
    else
        std::cout << "Your value is not between 10 and 20\n";
    return 0;
}
```

在这个例子中，我们使用逻辑与运算符检测左侧的条件 (value > 10) **和**右侧的条件 (value < 20) 是否都是 `true`。如果都是真，则逻辑与运算符的求值结果为 `true`，执行 if 语句。如果左右两个条件都是假，则逻辑与运算符的求值结果为 `false`，执行 else 语句。

和逻辑或运算符一样，你可以把多个逻辑与运算符连接起来：

```cpp
if (value > 10 && value < 20 && value != 16)
    // do something
else
    // do something else
```


如果上述所有条件都是真，则执行 if 语句。如果任何一个条件为假，则执行 else 语句。

As with logical and bitwise OR, new programmers sometimes confuse the _logical AND_ operator (`&&`) with the _bitwise AND_ operator (`&`).

## 短路求值

In order for _logical AND_ to return true, both operands must evaluate to true. If the first operand evaluates to false, _logical AND_ knows it must return false regardless of whether the second operand evaluates to true or false. In this case, the _logical AND_ operator will go ahead and return false immediately without even evaluating the second operand! This is known as short circuit evaluation, and it is done primarily for optimization purposes.

Similarly, if the first operand for _logical OR_ is true, then the entire OR condition has to evaluate to true, and the second operand won’t be evaluated.

Short circuit evaluation presents another opportunity to show why operators that cause side effects should not be used in compound expressions. Consider the following snippet:

```cpp
if (x == 1 && ++y == 2)
    // do something
```


if `x` does not equal _1_, the whole condition must be false, so `++y `never gets evaluated! Thus, `y` will only be incremented if `x` evaluates to 1, which is probably not what the programmer intended!


!!! warning "注意"

	Short circuit evaluation may cause _Logical OR_ and _Logical AND_ to not evaluate one operand. Avoid using expressions with side effects in conjunction with these operators.

!!! tldr "关键信息"

	The Logical OR and logical AND operators are an exception to the rule that the operands may evaluate in any order, as the standard explicitly states that the left operand must evaluate first.

!!! info "扩展阅读"

    Only the built-in versions of these operators perform short-circuit evaluation. If you overload these operators to make them work with your own types, those overloaded operators will not perform short-circuit evaluation.

## 混合 AND  和 OR

Mixing _logical AND_ and _logical OR_ operators in the same expression often can not be avoided, but it is an area full of potential dangers.

Many programmers assume that _logical AND_ and _logical OR_ have the same precedence (or forget that they don’t), just like addition/subtraction and multiplication/division do. However, _logical AND_ has higher precedence than _logical OR_, thus _logical AND_ operators will be evaluated ahead of _logical OR_operators (unless they have been parenthesized).

New programmers will often write expressions such as `value1 || value2 && value3`. Because _logical AND_ has higher precedence, this evaluates as `value1 || (value2 && value3)`, not `(value1 || value2) && value3`. Hopefully that’s what the programmer wanted! If the programmer was assuming left to right evaluation (as happens with addition/subtraction, or multiplication/division), the programmer will get a result he or she was not expecting!

When mixing _logical AND_ and _logical OR_ in the same expression, it is a good idea to explicitly parenthesize each operator and its operands. This helps prevent precedence mistakes, makes your code easier to read, and clearly defines how you intended the expression to evaluate. For example, rather than writing `value1 && value2 || value3 && value4`, it is better to write `(value1 && value2) || (value3 && value4)`.

!!! success "最佳实践"

	When mixing _logical AND_ and _logical OR_ in a single expression, explicitly parenthesize each operation to ensure they evaluate how you intend.

## 德摩根定律（De Morgan‘s law）

Many programmers also make the mistake of thinking that `!(x && y)` is the same thing as `!x && !y`. Unfortunately, you can not “distribute” the _logical NOT_ in that manner.

[德摩根定律](https://baike.baidu.com/item/%E5%BE%B7%C2%B7%E6%91%A9%E6%A0%B9%E5%AE%9A%E5%BE%8B/489073) tells us how the _logical NOT_ should be distributed in these cases:

`!(x && y)` is equivalent to `!x || !y`  
`!(x || y)` is equivalent to `!x && !y`

In other words, when you distribute the _logical NOT_, you also need to flip _logical AND_ to _logical OR_, and vice-versa!

This can sometimes be useful when trying to make complex expressions easier to read.


!!! info "扩展阅读"

	We can show that the first part of De Morgan’s Law is correct by proving that `!(x && y)` equals `!x || !y` for every possible value of `x` and `y`. To do so, we’ll use a mathematical concept called a truth table:
	
	
	|x	|y	|!x	|!y	|!(x && y)	|!x \|\| !y|
	|---|---|---|---|---|---|
	|false	|false	|true	|true	|true	|true|
	|false	|true	|true	|false	|true	|true|
	|true	|false	|false	|true	|true	|true|
	|true	|true	|false	|false	|false	|false|
	
	
	In this table, the first and second columns represent our `x` and `y` variables. Each row in the table shows one permutation of possible values for `x` and `y`. Because `x` and `y` are Boolean values, we only need 4 rows to cover every combination of possible values that `x` and `y` can hold.
	
	The rest of the columns in the table represent expressions that we want to evaluate based on the initial values of `x` and `y`. The third and fourth columns calculate the values of `!x` and `!y` respectively. The fifth column calculates the value of `!(x && y)`. Finally, the sixth column calculates the value of `!x || !y`.
	
	You’ll notice for each row, the value in the fifth column matches the value in the sixth column. This means for every possible value of `x` and `y`, the value of `!(x && y)` equals `!x || !y`, which is what we were trying to prove!
	
	We can do the same for the second part of De Morgan’s Law:
	
	|x	|y	|!x	|!y	|!(x \|\| y)	|!x && !y|
	|---|---|---|---|---|---|
	|false	|false	|true	|true	|true	|true|
	|false	|true	|true	|false	|false	|false|
	|true	|false	|false	|true	|false	|false|
	|true	|true	|false	|false	|false	|false|
	
	
	Similarly, for every possible value of `x` and `y`, we can see that the value of `!(x || y)` equals the value of `!x && !y`. Thus, they are equivalent.

## 逻辑异或运算符在哪里？

_Logical XOR_ is a logical operator provided in some languages that is used to test whether an odd number of conditions is true.

|左操作数	|右操作数	|结果|
|---|---|---|
|false	|false	|false|
|false	|true	|true|
|true	|false	|true|
|true	|true	|false|

C++ doesn’t provide a _logical XOR_ operator. Unlike _logical OR_ or _logical AND_, _logical XOR_ cannot be short circuit evaluated. Because of this, making a _logical XOR_ operator out of _logical OR_ and _logical AND_ operators is challenging. However, you can easily mimic _logical XOR_ using the _inequality_ operator (!=):

```cpp
if (a != b) ... // a XOR b, assuming a and b are Booleans
```


This can be extended to multiple operands as follows:

```cpp
if (a != b != c != d) ... // a XOR b XOR c XOR d, assuming a, b, c, and d are Booleans
```


Note that the above XOR patterns only work if the operands are Booleans (not integers). If you need a form of _logical XOR_ that works with non-Boolean operands, you can static_cast them to bool:

```cpp
if (static_cast<bool>(a) != static_cast<bool>(b) != static_cast<bool>(c) != static_cast<bool>(d)) ... // a XOR b XOR c XOR d, for any type that can be converted to bool
```


## 运算符的其他表示形式

Many operators in C++ (such as operator ||) have names that are just symbols. Historically, not all keyboards and language standards have supported all of the symbols needed to type these operators. As such, C++ supports an alternative set of keywords for the operators that use words instead of symbols. For example, instead of `||`, you can use the keyword `or`.

The full list can be found [这里](https://en.cppreference.com/w/cpp/language/operator_alternative). Of particular note are the following three:


|运算符|关键字替代名|
|---|---|
|&&	|and|
|\|\|	|or|
|!	|not|

因此下面两行代码是等价的：

```cpp
std::cout << !a && (b || c);
std::cout << not a and (b or c);
```


While these alternative names might seem easier to understand right now, most experienced C++ developers prefer using the symbolic names over the keyword names. As such, we recommend learning and using the symbolic names, as this is what you will commonly find in existing code.