---
title: 9.8 - 指针和const
alias: 9.8 - 指针和const
origin: /pointers-and-const/
origin_title: "9.8 — Pointers and const"
time: 2022-9-22
type: translation
tags:
- pointer
- const
---

请考虑下面的代码：

```cpp
int main()
{
    int x { 5 };
    int* ptr { &x }; // ptr is a normal (non-const) pointer

    int y { 6 };
    ptr = &y; // we can point at another value

    *ptr = 7; // we can change the value at the address being held

    return 0;
}
```

使用普通(非`const`)指针，既可以更改指针所指向的对象(通过为指针分配一个新地址来保存)，也可以更改被保存地址处的值(通过为解引用指针分配一个新值)。

但是，如果我们要指向的值是`const`，会发生什么呢?


```cpp
int main()
{
    const int x { 5 }; // x 是 const
    int* ptr { &x };   // 编译错误：不能把const int* 转换为 int*

    return 0;
}
```

上面的代码片段无法编译——普通指针不能指向const变量。这样的限制是有必要的，因为const变量的值是不能更改的。允许程序员将非const指针设置为const值将允许程序员解引用该指针并更改该值。这将违反变量的常量性。


## 指向常量的指针

A pointer to a const value (sometimes called a `pointer to const` for short) is a (non-const) pointer that points to a constant value.

To declare a pointer to a const value, use the `const` keyword before the pointer’s data type:

```cpp
int main()
{
    const int x{ 5 };
    const int* ptr { &x }; // okay: ptr is pointing to a "const int"

    *ptr = 6; // not allowed: we can't change a const value

    return 0;
}
```

COPY

In the above example, `ptr` points to a `const int`. Because the data type being pointed to is const, the value being pointed to can’t be changed.

However, because a pointer to const is not const itself (it just points to a const value), we can change what the pointer is pointing at by assigning the pointer a new address:

```cpp
int main()
{
    const int x{ 5 };
    const int* ptr { &x }; // ptr points to const int x

    const int y{ 6 };
    ptr = &y; // okay: ptr now points at const int y

    return 0;
}
```

COPY

Just like a reference to const, a pointer to const can point to non-const variables too. A pointer to const treats the value being pointed to as constant, regardless of whether the object at that address was initially defined as const or not:

```cpp
int main()
{
    int x{ 5 }; // non-const
    const int* ptr { &x }; // ptr points to a "const int"

    *ptr = 6;  // not allowed: ptr points to a "const int" so we can't change the value through ptr
    x = 6; // allowed: the value is still non-const when accessed through non-const identifier x

    return 0;
}
```

COPY

Const pointers

We can also make a pointer itself constant. A const pointer is a pointer whose address can not be changed after initialization.

To declare a const pointer, use the `const` keyword after the asterisk in the pointer declaration:

```cpp
int main()
{
    int x{ 5 };
    int* const ptr { &x }; // const after the asterisk means this is a const pointer

    return 0;
}
```

COPY

In the above case, `ptr` is a const pointer to a (non-const) int value.

Just like a normal const variable, a const pointer must be initialized upon definition, and this value can’t be changed via assignment:

```cpp
int main()
{
    int x{ 5 };
    int y{ 6 };

    int* const ptr { &x }; // okay: the const pointer is initialized to the address of x
    ptr = &y; // error: once initialized, a const pointer can not be changed.

    return 0;
}
```

COPY

However, because the _value_ being pointed to is non-const, it is possible to change the value being pointed to via dereferencing the const pointer:

```cpp
int main()
{
    int x{ 5 };
    int* const ptr { &x }; // ptr will always point to x

    *ptr = 6; // okay: the value being pointed to is non-const

    return 0;
}
```

COPY

Const pointer to a const value

Finally, it is possible to declare a const pointer to a const value by using the `const` keyword both before the type and after the asterisk:

```cpp
int main()
{
    int value { 5 };
    const int* const ptr { &value }; // a const pointer to a const value

    return 0;
}
```

COPY

A const pointer to a const value can not have its address changed, nor can the value it is pointing to be changed through the pointer. It can only be dereferenced to get the value it is pointing at.

Pointer and const recap

To summarize, you only need to remember 4 rules, and they are pretty logical:

-   A non-const pointer can be assigned another address to change what it is pointing at
-   A const pointer always points to the same address, and this address can not be changed.

-   A pointer to a non-const value can change the value it is pointing to. These can not point to a const value.
-   A pointer to a const value treats the value as const when accessed through the pointer, and thus can not change the value it is pointing to. These can be pointed to const or non-const l-values (but not r-values, which don’t have an address)

Keeping the declaration syntax straight can be a bit challenging:

-   The pointer’s type defines the type of the object being pointed at. So a `const` in the type means the pointer is pointing at a const value.
-   A `const` after the asterisk means the pointer itself is const and it can not be assigned a new address.

```cpp
int main()
{
    int value { 5 };

    int* ptr0 { &value };             // ptr0 points to an "int" and is not const itself, so this is a normal pointer.
    const int* ptr1 { &value };       // ptr1 points to a "const int", but is not const itself, so this is a pointer to a const value.
    int* const ptr2 { &value };       // ptr2 points to an "int", but is const itself, so this is a const pointer (to a non-const value).
    const int* const ptr3 { &value }; // ptr3 points to an "const int", and it is const itself, so this is a const pointer to a const value.

    return 0;
}
```