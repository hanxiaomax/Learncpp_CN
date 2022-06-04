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

尽管条件（比较）运算符可以被用来测试一个特定的表达式是否为真，但它们一次只能对一个条件进行测试。很多时候，我们需要知道多个条件是否同时为真。例如，为了确定彩票是否中奖，我们必须将购买的每一个数字和中奖号码的各个数字逐一比较。对于有6个数的彩票，这就需要6次比较，只有当它们的结果全部都是真的时候，才能看做中奖。还有一些情况，例如我们需要知道多个条件中是否有一个为真。 In other cases, we need to know whether any one of multiple conditions is true. For example, we may decide to skip work today if we’re sick, or if we’re too tired, or if we won the lottery in our previous example. This would involve checking whether _any_ of 3 comparisons is true.

Logical operators provide us with the capability to test multiple conditions.

C++ has 3 logical operators:

|运算符	|符号	|形式	|操作|
|---|---|---|---|
|Logical NOT	|!	|!x	|true if x is false, or false if x is true|
|Logical AND	|&&	|x && y	|true if both x and y are true, false otherwise|
|Logical OR	| \|\|	| x \|\| y|true if either x or y are true, false otherwise|


## 逻辑非（NOT）

You have already run across the logical NOT unary operator in lesson [[4-9-Boolean-values|4.9 - 布尔值]]. We can summarize the effects of logical NOT like so:


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


打印结果如下：

```
5 is greater than 7
```

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


This way, `x > y` will be evaluated first, and then logical NOT will flip the Boolean result.

!!! success "最佳实践"

	If _logical NOT_ is intended to operate on the result of other operators, the other operators and their operands need to be enclosed in parentheses.

Simple uses of _logical NOT_, such as `if (!value)` do not need parentheses because precedence does not come into play.

## 逻辑或（OR）

The _logical OR_ operator is used to test whether either of two conditions is true. If the left operand evaluates to true, or the right operand evaluates to true, or both are true, then the _logical OR_ operator returns true. Otherwise it will return false.

|Left operand	|Right operand	|Result|
|---|----|----|
|false	|false	|false|
|false	|true	|true|
|true	|false	|true|
|true	|true	|true|

For example, consider the following program:

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

In this case, we use the logical OR operator to test whether either the left condition (`value == 0`) or the right condition (`value == 1`) is true. If either (or both) are true, the _logical OR_ operator evaluates to true, which means the _if statement_ executes. If neither are true, the _logical OR_ operator evaluates to false, which means the _else statement_ executes.

You can string together many `logical OR` statements:

```cpp
if (value == 0 || value == 1 || value == 2 || value == 3)
     std::cout << "You picked 0, 1, 2, or 3\n";
```

New programmers sometimes confuse the _logical OR_ operator (`||`) with the _bitwise OR_ operator (`|`) (Covered later). Even though they both have _OR_ in the name, they perform different functions. Mixing them up will probably lead to incorrect results.


## 逻辑与（AND)

The `logical AND` operator is used to test whether both operands are true. If both operands are true, `logical AND` returns true. Otherwise, it returns false.

|Left operand	|Right operand	|Result|
|---|---|---|
|false	|false	|false|
|false	|true	|false|
|true	|false	|false|
|true	|true	|true|


For example, we might want to know if the value of variable _x_ is between _10_ and _20_. This is actually two conditions: we need to know if _x_ is greater than _10_, and also whether _x_ is less than _20_.

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


In this case, we use the _logical AND_ operator to test whether the left condition (value > 10) AND the right condition (value < 20) are both true. If both are true, the _logical AND_ operator evaluates to true, and the _if statement_ executes. If neither are true, or only one is true, the _logical AND_ operator evaluates to false, and the _else statement_ executes.

As with _logical OR_, you can string together many _logical AND_ statements:

```cpp
if (value > 10 && value < 20 && value != 16)
    // do something
else
    // do something else
```


If all of these conditions are true, the _if statement_ will execute. If any of these conditions are false, the _else statement_ will execute.

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

|Left operand	|Right operand	|Result|
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


|Operator name	|Keyword alternate name|
|---|---|
|&&	|and|
|\|\|	|or|
|!	|not|

This means the following are identical:

```cpp
std::cout << !a && (b || c);
std::cout << not a and (b or c);
```


While these alternative names might seem easier to understand right now, most experienced C++ developers prefer using the symbolic names over the keyword names. As such, we recommend learning and using the symbolic names, as this is what you will commonly find in existing code.