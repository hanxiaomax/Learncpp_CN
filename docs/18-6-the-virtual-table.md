---
title: 18.6 - 虚函数表
alias: 18.6 - 虚函数表
origin: /the-virtual-table/
origin_title: "18.6 — The virtual table"
time: 2022-9-30
type: translation
tags:
- virtual-table
---

??? note "关键点速记"

	

为了实现虚函数，C++ 使用了一种称为[[virtual-table|虚表]]的特殊形式的[[Late-binding|后期绑定]]。虚表是一个函数查找表，用于以动态/后期绑定方式解析函数调用。虚表有时也称为 “vtable”、“虚函数表”、“虚方法表”或“调度表”。

*因为使用虚函数并不需要了解虚表的工作方式，所以可以将本节视为选修*


虚表实际上非常简单，不过用语言描述有点复杂。首先，每个使用虚函数的类(或从使用虚函数的类派生而来的类)都有自己的虚表。这个表只是编译器在编译时设置的一个静态数组。虚表为类的对象调用的每个虚函数都包含一个条目。该表中的每个条目都只是一个函数指针，指向该类可访问的最后派生（most-derived）的函数。

其次，编译器还会添加一个隐藏的指针作为基类成员，称为`*__vptr`。 `*__vptr` 会在类对象创建时被自动设置，使其指向该类的虚表。和 `*this` 指针不同的是，`*this`指针是一个函数参数，用于编译器解析自引用。==而 `*__vptr` 是一个实际的指针。因此，所有具有该指针的对象需要多分配一个指针大小的内存。不仅如此，`*__vptr` 还会和其他成员一样被派生继承，这一点非常重要==。

但就目前来说，你可能还不知道这些东西是如何组合在一起使用的，所以让我们看一个简单的例子:


```cpp
class Base
{
public:
    virtual void function1() {};
    virtual void function2() {};
};

class D1: public Base
{
public:
    void function1() override {};
};

class D2: public Base
{
public:
    void function2() override {};
};
```

例子中有三个类，编译器会创建三个[[virtual-table|虚表]]：`Base`、`D1`、`D2`各一个。

编译器还向使用虚函数的**最基类**添加一个隐藏指针成员。尽管编译器会自动执行此操作，但我们将把它放在下一个示例中，只是为了显示添加它的位置：

```cpp
class Base
{
public:
    VirtualTable* __vptr;//自动添加的
    virtual void function1() {};
    virtual void function2() {};
};

class D1: public Base
{
public:
    void function1() override {};
};

class D2: public Base
{
public:
    void function2() override {};
};
```



When a class object is created, `*__vptr `is set to point to the virtual table for that class. For example, when an object of type Base is created, `*__vptr` is set to point to the virtual table for Base. When objects of type D1 or D2 are constructed, `*__vptr` is set to point to the virtual table for D1 or D2 respectively.

Now, let’s talk about how these virtual tables are filled out. Because there are only two virtual functions here, each virtual table will have two entries (one for function1() and one for function2()). Remember that when these virtual tables are filled out, each entry is filled out with the most-derived function an object of that class type can call.

The virtual table for Base objects is simple. An object of type Base can only access the members of Base. Base has no access to D1 or D2 functions. Consequently, the entry for function1 points to `Base::function1()` and the entry for function2 points to `Base::function2()`.

The virtual table for D1 is slightly more complex. An object of type D1 can access members of both D1 and Base. However, D1 has overridden `function1()`, making `D1::function1()` more derived than `Base::function1()`. Consequently, the entry for function1 points to `D1::function1()`. D1 hasn’t overridden `function2()`, so the entry for function2 will point to `Base::function2()`.

The virtual table for D2 is similar to D1, except the entry for function1 points to `Base::function1()`, and the entry for function2 points to `D2::function2()`.

Here’s a picture of this graphically:

Although this diagram is kind of crazy looking, it’s really quite simple: the `*__vptr` in each class points to the virtual table for that class. The entries in the virtual table point to the most-derived version of the function that objects of that class are allowed to call.

So consider what happens when we create an object of type D1:

```cpp
int main()
{
    D1 d1;
}
```

COPY

Because d1 is a D1 object, d1 has its `*__vptr` set to the D1 virtual table.

Now, let’s set a base pointer to D1:

```cpp
int main()
{
    D1 d1;
    Base* dPtr = &d1;

    return 0;
}
```

COPY

Note that because `dPtr` is a base pointer, it only points to the Base portion of d1. However, also note that `___vptr` is in the Base portion of the class, so dPtr has access to this pointer. Finally, note that `dPtr->__vptr` points to the D1 virtual table! Consequently, even though `dPtr` is of type Base_, it still has access to D1’s virtual table (through `__vptr`).

So what happens when we try to call `dPtr->function1()`?

```cpp
int main()
{
    D1 d1;
    Base* dPtr = &d1;
    dPtr->function1();

    return 0;
}
```

COPY

First, the program recognizes that `function1()` is a virtual function. Second, the program uses `dPtr->__vptr` to get to D1’s virtual table. Third, it looks up which version of function1() to call in D1’s virtual table. This has been set to `D1::function1()`. Therefore, `dPtr->function1()` resolves to `D1::function1()`!

Now, you might be saying, “But what if dPtr really pointed to a Base object instead of a D1 object. Would it still call `D1::function1()`?”. The answer is no.

```cpp
int main()
{
    Base b;
    Base* bPtr = &b;
    bPtr->function1();

    return 0;
}
```

COPY

In this case, when b is created, `__vptr` points to Base’s virtual table, not D1’s virtual table. Consequently, `bPtr->__vptr` will also be pointing to Base’s virtual table. Base’s virtual table entry for `function1()` points to `Base::function1()`. Thus, `bPtr->function1()` resolves to `Base::function1()`, which is the most-derived version of `function1()` that a Base object should be able to call.

By using these tables, the compiler and program are able to ensure function calls resolve to the appropriate virtual function, even if you’re only using a pointer or reference to a base class!

Calling a virtual function is slower than calling a non-virtual function for a couple of reasons: First, we have to use the *__vptr to get to the appropriate virtual table. Second, we have to index the virtual table to find the correct function to call. Only then can we call the function. As a result, we have to do 3 operations to find the function to call, as opposed to 2 operations for a normal indirect function call, or one operation for a direct function call. However, with modern computers, this added time is usually fairly insignificant.

Also as a reminder, any class that uses virtual functions has a *__vptr, and thus each object of that class will be bigger by one pointer. Virtual functions are powerful, but they do have a performance cost.