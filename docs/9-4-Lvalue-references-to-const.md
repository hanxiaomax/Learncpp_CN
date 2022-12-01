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

??? note "Key Takeaway"
	

在上节课 ([[9-3-Lvalue-references|9.3 - 左值引用]]) 中，我们讨论了为声明[[lvalue-reference|左值引用]]只能绑定到一个可修改的[[lvalue|左值]]上。这意味着下面的代码是非法的：

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

使用 `const` 关键字声明左值引用，即要求左值引用将其引用的对象当做const看到。此时称该引用为指向const对象的左值引用（有时称为指向const的引用或const引用）。

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


在上面的例子中，我们将const引用 `ref` 绑定到可修改左值 `x`。随后便可以使用 `ref` 访问 `x`，但是因为 `ref` 是 const 的，所以我们不能通过`ref` we can not modify the value of `x` through `ref`. However, we still can modify the value of `x` directly (using the identifier `x`).

!!! success "最佳实践"

	Favor `lvalue references to const` over `lvalue references to non-const` unless you need to modify the object being referenced.

## Initializing an lvalue reference to const with an rvalue

Perhaps surprisingly, lvalues references to const can also bind to rvalues:

```cpp
#include <iostream>

int main()
{
    const int& ref { 5 }; // okay: 5 is an rvalue

    std::cout << ref; // prints 5

    return 0;
}
```

COPY

When this happens, a temporary object is created and initialized with the rvalue, and the reference to const is bound to that temporary object.

A temporary object (also sometimes called an anonymous object) is an object that is created for temporary use (and then destroyed) within a single expression. Temporary objects have no scope at all (this makes sense, since scope is a property of an identifier, and temporary objects have no identifier). This means a temporary object can only be used directly at the point where it is created, since there is no way to refer to it beyond that point.

## Const references bound to temporary objects extend the lifetime of the temporary object

Temporary objects are normally destroyed at the end of the expression in which they are created.

However, consider what would happen in the above example if the temporary object created to hold rvalue `5` was destroyed at the end of the expression that initializes `ref`. Reference `ref` would be left dangling (referencing an object that had been destroyed), and we’d get undefined behavior when we tried to access `ref`.

To avoid dangling references in such cases, C++ has a special rule: When a const lvalue reference is bound to a temporary object, the lifetime of the temporary object is extended to match the lifetime of the reference.

```cpp
#include <iostream>

int main()
{
    const int& ref { 5 }; // The temporary object holding value 5 has its lifetime extended to match ref

    std::cout << ref; // Therefore, we can safely use it here

    return 0;
} // Both ref and the temporary object die here
```

COPY

In the above example, when `ref` is initialized with rvalue `5`, a temporary object is created and `ref` is bound to that temporary object. The lifetime of the temporary object matches the lifetime of `ref`. Thus, we can safely print the value of `ref` in the next statement. Then both `ref` and the temporary object go out of scope and are destroyed at the end of the block.

!!! tldr "关键信息"

	Lvalue references can only bind to modifiable lvalues.
	
	Lvalue references to const can bind to modifiable lvalues, non-modifiable lvalues, and rvalues. This makes them a much more flexible type of reference.

So why does C++ allow a const reference to bind to an rvalue anyway? We’ll answer that question in the next lesson!