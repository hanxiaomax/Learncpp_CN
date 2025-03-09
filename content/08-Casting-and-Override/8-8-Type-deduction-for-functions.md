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

> [!note] "Key Takeaway"
> - 在 C++14 中，`auto` 可以被用于函数返回值类型，此时需要保证**所有返回值类型是一致的**，否则需要进行转换
> - 函数返回值类型使用 `auto` 的最大缺点这些函数在使用前必须已经完整定义（只有[[forward-declaration|前向声明]]）是不够的。这也意味着 `auto` 类型返回值的函数通常只能够在定义它们的文件中使用。
> - `auto add(int x, int y) -> int` 后置返回值类型。这种形式可以对齐函数名或是配合 lambda 使用
> - 函数形参的类型不能使用类型推断

考虑下面代码：

```cpp
int add(int x, int y)
{
    return x + y;
}
```

但编译这个函数的时候，编译器可以确定 `x + y` 的求值结果为 `int` 类型，然后它会确保函数的返回值类型和该类型匹配（或者返回值的类型可以被转换为函数声明的返回类型）。

因为编译器已经能够从 `return` 语句推断返回值的类型，所以在 C++14 中，`auto` 可以被用于函数返回值类型，将 `auto` 关键字放置在原来用于声明函数返回值类型的地方就可以。

例如：

```cpp
auto add(int x, int y)
{
    return x + y;
}
```

由于 `return` 语句返回的是一个 `int` 类型的值，则编译器会将函数返回值的类型推断为 `int`。

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

在上面的函数中，由于两个 `return` 语句返回值的类型不同，所以编译器会提示错误。

如果有些情况下需要使用不同的返回值类型，那么要么你为函数显式地指明返回值类型（此时编译器会将不匹配的返回值进行[[implicit-type-conversion|隐式类型转换]]），或者你可以显式地将 `return` 语句的返回值转换成相同的类型。在上面的例子中，我们可以将 `5` 修改为 `5.0`，或者对于非字面量的情况还可以使用 `static_cast`

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

这是理所当然的，因为仅凭前向声明编译器无法对函数的返回值类型进行推断。这也意味着 `auto` 类型返回值的函数通常只能够在定义它们的文件中使用。

与对象的类型推断不同，对于函数返回类型推断的最佳实践并没有太多共识。当对对象使用类型推断时，初始化式总是作为同一语句的一部分出现，因此确定要推断的类型通常不会太麻烦。对于函数，情况就不是这样了——当查看函数的原型时，没有上下文来帮助指示函数返回的类型。虽然一个优秀的 IDE 应该清楚推断出的函数类型是什么，但在没有这种功能的时候，用户实际上必须深入到函数体本身来确定函数返回的类型。犯错误的几率更高。此外，函数返回值的类型推断不能通过[[forward-declaration|前向声明]]使用，这也限制了它们在多文件程序中的可用性。

> [!success] "最佳实践"
> 对于一般函数来说，最好使用显式的函数返回值类型而不是类型推断。

## 后置返回值类型语法

`auto` 也可以用于后置返回值类型语法，即函数的返回值类型被放置在函数原型的后面。

考虑下面的代码：

```cpp
int add(int x, int y)
{
  return (x + y);
}
```

它等价于下面后置返回值语法形式：

```cpp
auto add(int x, int y) -> int
{
  return (x + y);
}
```

在这个例子中，`auto` 不再被用来进行类型推断——它只是后置返回值类型语法的一部分。

这种语法有什么用呢？

这种语法可以帮我们对齐函数名：

```cpp
auto add(int x, int y) -> int;
auto divide(double x, double y) -> double;
auto printSomething() -> void;
auto generateSubstring(const std::string &s, int start, int len) -> std::string;
```

此外，一些 C++ 高级特性也需要后置返回值类型语法的支持，例如 lambda 表达式（参见： [12.7 -- Introduction to lambdas (anonymous functions)](https://www.learncpp.com/cpp-tutorial/introduction-to-lambdas-anonymous-functions/) ）

就目前而言，我们还是建议大家使用传统的函数返回值语法，除非是需要配合一些特殊的特性来使用时。

## ## 函数形参的类型不能使用类型推断

很多新手程序员在学习过类型推断后，会尝试这样做：

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

不幸的是，类型推演不适用于函数形参，在++ 20 之前，上面的程序无法编译(会将得到关于函数形参不能具有自动类型的错误)。

在 C++20 中，`auto` 关键字再次得到了扩展，所以上述程序可以正常编译了。不过，此时 `auto` 并不是被用做类型推断，而是用于触发[[function-template|函数模板(function template)]]特性。

!!! info "相关内容"

    我们会在[[8-13-Function-templates|8.13 - 函数模板]]中介绍函数模板并在[[8-15-Function-templates-with-multiple-template-types|8.15 - 具有多种类型的函数模板]]中讨论 `auto` 在此语境中的用途。
