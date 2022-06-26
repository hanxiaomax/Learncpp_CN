---
title: 4.14 - 编译时常量、常量表达式和 constexpr
alias: 4.14 - 编译时常量、常量表达式和 constexpr
origin: /compile-time-constants-constant-expressions-and-constexpr/
origin_title: "4.14 — Compile-time constants, constant expressions, and constexpr"
time: 2022-1-2
type: translation
tags:
- const
- constexpr
- C++17
---

??? note "关键点速记"
	

考虑下面的函数：

```cpp
#include <iostream>

int main()
{
	std::cout << 3 + 4;

	return 0;
}
```

输出结果为：

```
7
```

不过，这里包含了一个不易被发现的优化点。

如果对上述文件原封不动地进行编译，编译器将生成一个可执行文件，并在运行时(当程序运行时)计算 3 + 4 的结果。如果程序被执行100万次，3 + 4 将被计算100万次，7 的结果值将产生100万次。但是请注意，3 + 4 的结果永远不会改变——它总是 7。因此，每次程序运行时重新计算 3 + 4 是一种浪费。


## 常量表达式

常量表达式是可以由编译器在编译时求值的表达式。要成为常量表达式，表达式中的所有值必须在编译时已知(调用的所有操作符和函数必须支持编译时求值)。

当编译器遇到常量表达式时，它将用该常量表达式的求值结果替换该常量表达式。

在上面的程序中，表达式“3 + 4”是一个常量表达式。因此，当这个程序被编译时，编译器将计算常数表达式' 3 + 4 '，然后将常数表达式' 3 + 4 '替换为结果值' 7 '。换句话说，编译器实际上编译了这个:


A constant expression is an expression that can be evaluated by the compiler at compile-time. To be a constant expression, all the values in the expression must be known at compile-time (and all of the operators and functions called must support compile-time evaluation).

When the compiler encounters a constant expression, it will replace the constant expression with the result of evaluating the constant expression.

In the above program, the expression `3 + 4` is a constant expression. So when this program is compiled, the compiler will evaluate constant expression `3 + 4` and then replace the constant expression `3 + 4` with the resulting value `7`. In other words, the compiler actually compiles this:

```cpp
#include <iostream>

int main()
{
	std::cout << 7;

	return 0;
}
```

COPY

This program produces the same output (`7`), but the resulting executable no longer needs to spend CPU cycles calculating `3 + 4` at runtime!

Note that the remaining expression `std::cout << 7` is not a constant expression, because our program can’t output values to the console at compile-time. So this expression will evaluate at runtime.

Key insight

Evaluating constant expressions at compile-time makes our compilation take longer (because the compiler has to do more work), but such expressions only need to be evaluated once (rather than every time the program is run). The resulting executables are faster and use less memory.

## Compile-time constants

A Compile-time constant is a constant whose value is known at compile-time. Literals (e.g. ‘1’, ‘2.3’, and “Hello, world!”) are one type of compile-time constant.

But what about const variables? Const variables may or may not be compile-time constants.

## Compile-time const

A const variable is a compile-time constant if its initializer is a constant expression.

Consider a program similar to the above that uses const variables:

```cpp
#include <iostream>

int main()
{
	const int x { 3 };  // x is a compile-time const
	const int y { 4 };  // y is a compile-time const

	std::cout << x + y; // x + y is a compile-time expression

	return 0;
}
```

COPY

Because the initialization values of `x` and `y` are constant expressions, `x` and `y` are compile-time constants. This means `x + y` is a constant expression. So when the compiler compiles this program, it can evaluate `x + y` for their values, and replace the constant expression with the resulting literal `7`.

Note that the initializer of a compile-time const can be any constant expression. Both of the following will be compile-time const variables:

```cpp
const int z { 1 + 2 };
const int w { z * 2 };
```


Compile-time const variables are often used as symbolic constants:

```cpp
const double gravity { 9.8 };
```


Compile-time constants enable the compiler to perform optimizations that aren’t available with non-compile-time constants. For example, whenever `gravity` is used, the compiler can simply substitute the identifier `gravity` with the literal double `9.8`, which avoids having to fetch the value from somewhere in memory.

In many cases, compile-time constants will be optimized out of the program entirely. In cases where this is not possible (or when optimizations are turned off), the variable will still be created (and initialized) at runtime.

## Runtime const

Any const variable that is initialized with a non-constant expression is a runtime constant. Runtime constants are constants whose initialization values aren’t known until runtime.

The following example illustrates the use of a constant that is a runtime constant:

```cpp
#include <iostream>

int getNumber()
{
    std::cout << "Enter a number: ";
    int y{};
    std::cin >> y;

    return y;
}

int main()
{
    const int x{ 3 };           // x is a compile time constant

    std::cout << "Enter a number: ";
    const int y{ getNumber() }; // y is a runtime constant

    std::cout << x + y;         // x + y is a runtime expression

    return 0;
}
```


Even though `y` is const, the initialization value (the return value of `getNumber()`) isn’t known until runtime. Thus, `y` is a runtime constant, not a compile-time constant. And as such, the expression `x + y` is a runtime expression.

## The `constexpr` keyword

When you declare a const variable, the compiler will implicitly keep track of whether it’s a runtime or compile-time constant. In most cases, this doesn’t matter for anything other than optimization purposes, but there are a few odd cases where C++ requires a compile-time constant instead of a run-time constant (we’ll cover these cases later as we introduce those topics).

Because compile-time constants generally allow for better optimization (and have little downside), we typically want to use compile-time constants wherever possible.

When using `const`, our variables could end up as either a compile-time const or a runtime const, depending on whether the initializer is a compile-time expression or not. Because the definitions for both look identical, we can end up with a runtime const where we thought we were getting a compile-time const. In the previous example, it’s hard to tell if `y` is a compile-time const or a runtime const -- we’d have to look at the return value of `getNumber()` to determine.

Fortunately, we can enlist the compiler’s help to ensure we get a compile-time const where we expect one. To do so, we use the `constexpr` keyword instead of `const` in a variable’s declaration. A constexpr (which is short for “constant expression”) variable can only be a compile-time constant. If the initialization value of a constexpr variable is not a constant expression, the compiler will error.

For example:

```cpp
#include <iostream>

int main()
{
    constexpr double gravity { 9.8 }; // ok: 9.8 is a constant expression
    constexpr int sum { 4 + 5 };      // ok: 4 + 5 is a constant expression
    constexpr int something { sum };  // ok: sum is a constant expression

    std::cout << "Enter your age: ";
    int age{};
    std::cin >> age;

    constexpr int myAge { age };      // compile error: age is not a constant expression

    return 0;
}
```


!!! success "最佳实践"

    任何在初始化后值就不能被改变，且初始化值可以在编译时确定的变量，都必须声明为 `constexpr`。
    任何在初始化后值就不能被改变，但是初始化值不能在编译时确定的变量，都应该声明为 `const`。
    
Although function parameters can be `const`, function parameters cannot be `constexpr`.

!!! info "相关内容"

	C++ does support functions that evaluate at compile-time (and thus can be used in constant expressions) -- we discuss these in lesson [6.14 -- Constexpr and consteval functions](https://www.learncpp.com/cpp-tutorial/constexpr-and-consteval-functions/).

