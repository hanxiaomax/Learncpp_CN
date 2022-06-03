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


??? note "关键点速记"

	- 逗号表达式首先对它左侧的操作数求值，然后对右侧操作数求值，然后返回右侧操作数的结果。
	- 避免使用逗号运算符，除非是在 for 循环中。
	- 条件表达式的整个表达式都要放在括号中，此外，条件部分也要放在括号中。

## 逗号运算符

|运算符	|符号	|形式|	操作 |
|---|---|---|---|
|逗号运算符|	,|	x, y	|先对 x 求值，再对 y 求值，然后返回 y 求值结果|


逗号运算符 (`,`) 允许你在允许单独表达式的地方，对多个表达式求值。逗号表达式首先对它左侧的操作数求值，然后对右侧操作数求值，然后返回右侧操作数的结果。

例如：

```cpp
#include <iostream>

int main()
{
    int x{ 1 };
    int y{ 2 };

    std::cout << (++x, ++y); // 对 x 和 y 递增， 对右侧操作数求值

    return 0;
}
```

首先，逗号运算符左侧操作数求值，将 x 递增为 2。然后逗号运算符右侧操作数求值，将 y 递增为 3。然后逗号表达式返回的是右侧求值的结果（3），并打印在屏幕上。

注意，逗号运算符的优先级是最低的，甚至比赋值表达式还低。因此，下面两行代码的效果是不同的。

```cpp
z = (a, b); // 先对 (a, b) 求值得到 b 的结果，然后赋值给 z
z = a, b; // 等价于 "(z = a), b"，所以 z 首先被赋值为 a，然后 b 求值，结果丢弃。
```


这也使得逗号运算符用起来存在危险。

几乎任何使用逗号运算符编写的语句都可以用多个单独的语句来替换。例如，上述代码可以改写成下面的形式：

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


大多数程序员几乎从来不会使用逗号运算符，只有在 for 循环中存在例外，我们会在 [[7.9 -- For statements|7.9 - for 语句]]中详细讨论：

!!! success "最佳实践"

	避免使用逗号运算符，除非是在 for 循环中。

## 逗号作为分隔符

在 C++，逗号常用作分隔符，这种情况下和逗号运算符并没有关系，也不具备逗号运算符的功能，例如：


```cpp
void foo(int x, int y) // 在函数中逗号用于分割参数
{
    add(x, y); // Comma used to separate arguments in function call
    constexpr int z{ 3 }, w{ 5 }; // 逗号用于分割同一行中定义的多个变量（不要这么做）
}
```


不需要避免使用逗号作为分隔符（除非是声明多个变量时，不要这么做）。

## 条件运算符


|运算符	|符号|	形式	|操作|
|---|---|---|---|
|条件运算符	|?:	|c ? x : y	|如果 c 非零（真）则对 x 其中，否则对 y 求值


条件运算符 (`?:`) (有时也称为 ”算数 if “运算符) 是一个三元运算符（有三个操作数）。因为它是 C++ 中唯一的三元运算符，因此有使用也称它为”那个三元运算符“。

`?:` 运算符提供了一种快捷的条件语句功能。如果你对条件语句还有疑问，请参考[[4-10-Introduction-to-if-statements|4.10 - if 语句简介]]。

if/else 语句的形式如下：

```cpp
if (condition)
    statement1;
else
    statement2;
```

如果 `condition` 求值结果为 `true` ，则 `statement1` 会被执行，否则执行 `statement2`。

`?:` 运算符的形式如下：

```
(condition) ? expression1 : expression2;
```


如果 `condition` 求值结果为 `true` ，则 `statement1` 会被执行，否则执行 `statement2`。注意，这里的 `expression2` 是必须要有的。

下面这个 if/else 语句：

```cpp
if (x > y)
    larger = x;
else
    larger = y;
```

可以改写成如下形式：

```cpp
larger = (x > y) ? x : y;
```

这样可以在不牺牲可读性的前提下，让代码变得更加紧凑。

## 为条件运算符添加括号

根据惯例，我们一般会把条件运算符的**条件**部分放在括号里，这样不仅可读性更好，而且可以确保运算优先级是正确的。其他操作数的求值优先级，加不加括号都是一样的，所以就没必要显示地添加括号了。

注意，`?:` 运算符的优先级非常低。除非是和赋值操作符在一个表达式里，不然整个条件运算符表达式也要放在括号中。

例如，为了打印 x 和 y 中较大的值，可以这样做：

```cpp
if (x > y)
    std::cout << x;
else
    std::cout << y;
```

或者也可以使用条件运算符：

```cpp
std::cout << ((x > y) ? x : y);
```


让我们测试一下，上面代码中，如果不把条件运算符表达式放在一个括号中会怎样。

因 `<< operator` 的优先级高于 `?:` 运算符，因此下面语句：

```cpp
std::cout << (x > y) ? x : y;
```

等价于：

```cpp
(std::cout << (x > y)) ? x : y;
```


因此，如果 x>y 则结果会打印 1(true)，否则打印0。


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