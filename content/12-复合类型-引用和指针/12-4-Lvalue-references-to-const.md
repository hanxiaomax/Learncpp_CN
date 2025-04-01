---
title: 9.4 - const类型的左值引用 
alias: 9.4 - const类型的左值引用 
origin: /lvalue-references-to-const/
origin_title: "9.4 — Lvalue references to const"
time: 2022-6-6
type: translation
tags:
- lvalue references
- const
---

> [!note] "Key Takeaway"
> - 左值引用只能绑定到可修改的左值。
> - 对const的左值引用可以绑定到可修改的左值、不可修改的左值和右值。这使得它们成为一种更加灵活的引用类型。

在上节课 ([[12-3-Lvalue-references|9.3 - 左值引用]]) 中，我们讨论了为声明[[lvalue-reference|左值引用]]只能绑定到一个可修改的[[lvalue|左值]]上。这意味着下面的代码是非法的：

```cpp
int main()
{
    const int x { 5 }; // x is a non-modifiable (const) lvalue
    int& ref { x }; // error: ref can not bind to non-modifiable lvalue

    return 0;
}
```

这是不允许的，因为这样我们就能够通过非`const`引用(`ref` )修改`const`变量( `x` )。

但如果我们想要一个`const`变量来创建引用，该怎么办呢？普通的左值引用(指向非const值)是不行的。

## 指向 const 的左值引用

使用 `const` 关键字声明左值引用，即要求左值引用将其引用的对象当做const看到。此时称该引用为指向const对象的左值引用（有时称为指向const的引用或**const左值引用**）。

对const引用可以绑定到不可修改的左值:

```cpp
int main()
{
    const int x { 5 };    // x is a non-modifiable lvalue
    const int& ref { x }; // okay: ref is a an lvalue reference to a const value

    return 0;
}
```

因为const的左值引用将它们引用的对象视为const，所以它们可以用于访问但不能修改被引用的值:

```cpp
#include <iostream>

int main()
{
    const int x { 5 };    // x is a non-modifiable lvalue
    const int& ref { x }; // okay: ref is a an lvalue reference to a const value

    std::cout << ref;     // okay: we can access the const object
    ref = 6;              // error: we can not modify a const object

    return 0;
}
```


## 使用可修改左值初始化const左值引用

const左值引用也可以绑定到可修改的左值。在这种情况下，通过引用访问被引用的对象时将被视为const(即使底层对象不是const):


```cpp
#include <iostream>

int main()
{
    int x { 5 };          // x is a modifiable lvalue
    const int& ref { x }; // okay: we can bind a const reference to a modifiable lvalue

    std::cout << ref;     // okay: we can access the object through our const reference
    ref = 7;              // error: we can not modify an object through a const reference

    x = 6;                // okay: x is a modifiable lvalue, we can still modify it through the original identifier

    return 0;
}
```


在上面的例子中，我们将const引用 `ref` 绑定到可修改左值 `x`。随后便可以使用 `ref` 访问 `x`，但是因为 `ref` 是 const 的，所以我们不能通过`ref`修改`x`。然而，我们仍然可以直接修改 `x` 。

> [!success] "最佳实践"
> 除非需要修改被引用的对象，最好使用“const左值引用”，而不是“非const的左值引用”。

## 使用右值初始化const左值引用

也许令人惊讶的是，const左值引用也可以绑定到右值：

```cpp
#include <iostream>

int main()
{
    const int& ref { 5 }; // okay: 5 is an rvalue

    std::cout << ref; // prints 5

    return 0;
}
```

当这种情况发生时，创建一个临时对象并用右值初始化，对const的引用被绑定到该临时对象。

临时对象(有时也称为匿名对象)是在单个表达式中为临时使用(然后销毁)而创建的对象。临时对象完全没有作用域(这是有意义的，因为==作用域是标识符的属性，而临时对象没有标识符==)。这意味着临时对象只能在创建它的位置直接使用，因为没有办法在该位置之后再引用它。

## const 引用绑定到临时对象时会延长临时对象的生命周期

临时对象通常在创建它们的表达式的末尾被销毁。

但是，如果为保存右值 `5` 而创建的临时对象在初始化 `ref` 的表达式结束时被销毁，那么在上面的例子中会发生什么情况呢？引用`ref` 将变成[[dangling|悬垂]]引用(引用一个已经被销毁的对象)，当我们试图访问 `ref` 时，将产生[[undefined-behavior|未定义行为]]。

为了避免这种情况下的[[dangling|悬垂]]引用，C++有一个特殊的规则：==当const左值引用被绑定到一个临时对象时，临时对象的生存期将被扩展到与引用的生存期相匹配。==

```cpp
#include <iostream>

int main()
{
    const int& ref { 5 }; // The temporary object holding value 5 has its lifetime extended to match ref

    std::cout << ref; // Therefore, we can safely use it here

    return 0;
} // Both ref and the temporary object die here
```

在上面的例子中，当使用右值`5`初始化 `ref` 时，一个临时对象被创建并绑定到 `ref` 。该临时对象的生命周期就会被扩展到 `ref` 的生命周期。Thus, we can safely print the value of `ref` in the next statement. Then both `ref` and the temporary object go out of scope and are destroyed at the end of the block.

> [!tldr] "关键信息"
> 左值引用只能绑定到可修改的左值。
> 对const的左值引用可以绑定到可修改的左值、不可修改的左值和右值。这使得它们成为一种更加灵活的引用类型。

那么，为什么C++允许const引用绑定到右值呢？我们将在[[12-5-Pass-by-lvalue-reference|9.5 - 传递左值引用]]中回答这个问题!