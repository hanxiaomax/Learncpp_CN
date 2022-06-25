---
title: 8.8 - 函数的类型推断
alias: 8.8 - 函数的类型推断
origin: /type-deduction-for-functions/
origin_title: "8.8 — Type deduction for functions"
time: 2022-1-20
type: translation
tags:
- type deduction
- C++14
- C++20
---

??? note "关键点速记"

	- 在 C++14 中，`auto`可以被用于函数返回值类型，此时需要保证**所有返回值类型是一致的**，否则需要进行转换
	- 函数返回值类型使用 `auto` 的最大缺点这些函数在使用前必须已经完整定义（只有[[forward-declaration|前向声明]]）是不够的。这也意味着`auto`类型返回值的函数通常只能够在定义它们的文件中使用。

考虑下面代码：

```cpp
int add(int x, int y)
{
    return x + y;
}
```


但编译这个函数的时候，编译器可以确定 `x + y` 的求值结果为`int`类型，然后它会确保函数的返回值类型和该类型匹配（或者返回值的类型可以被转换为函数声明的返回类型）。

因为编译器已经能够从`return`语句推断返回值的类型，所以在 C++14 中，`auto`可以被用于函数返回值类型，将`auto`关键字放置在原来用于声明函数返回值类型的地方就可以。

例如：

```cpp
auto add(int x, int y)
{
    return x + y;
}
```


由于`return` 语句返回的是一个 `int` 类型的值，则编译器会将函数返回值的类型推断为 `int`。

当使用 `auto` 返回值类型是，所有返回值的类型必须是一致的，否则会造成错误，例如：
```cpp
auto someFcn(bool b)
{
    if (b)
        return 5; // return type int
    else
        return 6.7; // return type double
}
```


在上面的函数中，由于两个`return`语句返回值的类型不同，所以编译器会提示错误。

如果有些情况下需要使用不同的返回值类型，那么要么你为函数显式地指明返回值类型（此时编译器会将不匹配的返回值进行[[implicit-type-conversion|隐式类型转换]]），或者你可以显式地将`return`语句的返回值转换成相同的类型。在上面的例子中，我们可以将`5` 修改为 `5.0`，或者对于非字面量的情况还可以使用 `static_cast`

函数返回值类型使用 `auto` 的最大缺点这些函数在使用前必须已经完整定义（只有[[forward-declaration|前向声明]]）是不够的。例如：

```cpp
#include <iostream>

auto foo();

int main()
{
    std::cout << foo(); // the compiler has only seen a forward declaration at this point
    return 0;
}

auto foo()
{
    return 5;
}
```

在作者的电脑上会产生如下编译错误：

```
error C3779: 'foo': a function that returns 'auto' cannot be used before it is defined.
```

这是理所当然的，因为仅凭前向声明编译器无法对函数的返回值类型进行推断。这也意味着`auto`类型返回值的函数通常只能够在定义它们的文件中使用。

Unlike type deduction for objects, there isn’t as much consensus on best practices for function return type deduction. When using type deduction with objects, the initializer is always present as part of the same statement, so it’s usually not overly burdensome to determine what type will be deduced. With functions, that is not the case -- when looking at a function’s prototype, there is no context to help indicate what type the function returns. A good programming IDE should make clear what the deduced type of the function is, but in absence of having that available, a user would actually have to dig into the function body itself to determine what type the function returned. The odds of mistakes being made are higher. And the inability for such functions to be forward declared limits their usefulness in multi-file programs.

与对象的类型推断不同，对于函数返回类型推断的最佳实践并没有太多共识。当对对象使用类型推导时，初始化式总是作为同一语句的一部分出现，因此确定要推导的类型通常不会太麻烦。对于函数，情况就不是这样了——当查看函数的原型时，没有上下文来帮助指示函数返回的类型。一个好的编程IDE应该清楚推导出的函数类型是什么，但是如果没有这种类型，用户实际上必须深入到函数体本身来确定函数返回的类型。犯错误的几率更高。这种功能不能向前声明，限制了它们在多文件程序中的有用性。

!!! success "最佳实践"

	Favor explicit return types over function return type deduction for normal functions.

## Trailing return type syntax

The `auto` keyword can also be used to declare functions using a trailing return syntax, where the return type is specified after the rest of the function prototype.

Consider the following function:

```cpp
int add(int x, int y)
{
  return (x + y);
}
```

COPY

Using the trailing return syntax, this could be equivalently written as:

```cpp
auto add(int x, int y) -> int
{
  return (x + y);
}
```

COPY

In this case, `auto` does not perform type deduction -- it is just part of the syntax to use a trailing return type.

Why would you want to use this?

One nice thing is that it makes all of your function names line up:

```cpp
auto add(int x, int y) -> int;
auto divide(double x, double y) -> double;
auto printSomething() -> void;
auto generateSubstring(const std::string &s, int start, int len) -> std::string;
```

COPY

The trailing return syntax is also required for some advanced features of C++, such as lambdas (which we cover in lesson [12.7 -- Introduction to lambdas (anonymous functions)](https://www.learncpp.com/cpp-tutorial/introduction-to-lambdas-anonymous-functions/)).

For now, we recommend the continued use of the traditional function return syntax except in situations that require the trailing return syntax.

## 函数形参的类型不能使用类型推断


Many new programmers who learn about type deduction try something like this:

```cpp
#include <iostream>

void addAndPrint(auto x, auto y)
{
    std::cout << x + y;
}

int main()
{
    addAndPrint(2, 3); // case 1: call addAndPrint with int parameters
    addAndPrint(4.5, 6.7); // case 2: call addAndPrint with double parameters
}
```

Unfortunately, type deduction doesn’t work for function parameters, and prior to C++20, the above program won’t compile (you’ll get an error about function parameters not being able to have an auto type).

In C++20, the `auto` keyword was extended so that the above program will compile and function correctly -- however, `auto` is not invoking type deduction in this case. Rather, it is triggering a different feature called `function templates` that was designed to actually handle such cases.

!!! info "相关内容"

	We introduce function templates in lesson [[8-13-Function-templates|8.13 - 函数模板]], and discuss use of `auto` in the context of function templates in lesson [[8-15-Function-templates-with-multiple-template-types|8.15 - 具有多种类型的函数模板]]。