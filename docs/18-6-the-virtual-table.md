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

??? note "Key Takeaway"

	

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


==当一个类对象被创建时，`*__vptr `被设置为指向该类的虚表==。例如，当`Base`类型的对象创建时，`*__vptr` 指向`Base`的虚表、当 D1 或 D2 构建时，`*__vptr` 则分别指向 D1 或 D2 的虚表。

现在，让我们讨论一下如何填充这些虚拟表。因为这里只有两个虚函数，==**每个虚表**将有两个条目(一个用于`function1()`，一个用于`function2()`))。请记住，在填写这些虚表时，每个条目都用该类类型的对象可以调用的最后派生的函数填写。==

`Base` 对象的虚表很简单，任何`Base`对象都只能访问`Base`的成员，而不能访问 `D1` 或者 `D2` 。这样一来，虚表中条目`function1` 指向`Base::function1()` 并且 `function2` 指向 `Base::function2()`.

D1 的虚表稍微复杂一些。D1 类型的对象可以访问 D1 和 `Base`的成员，D1 [[override|重写]]了 `function1()`，使得 `D1::function1()` 相较于 `Base::function1()`是更晚被派生的函数。因此，`function1` 指向 `D1::function1()`。因为 D1 没有重写 `function2()`，所以条目 `function2` 指向`Base::function2()`。

D2 的虚表类似于 D1 的虚表。只不过 `function1` 指向 `Base::function1()`而 `function2` 指向 `D2::function2()`。

Here’s a picture of this graphically:

尽管看上去有些复杂，每个类的`*__vptr`都指向该类的[[virtual-table|虚表]]，虚表的条目指向该对象能够调用的最后被派生的函数。 

考虑一下当我们创建一个D1类型的对象时会发生什么:

```cpp
int main()
{
    D1 d1;
}
```


因为 `d1` 是一个 `D1` 对象，`d1` 的 `*__vptr` 指向 D1 的虚表。

现在，创建一个指向D1的基类指针：

```cpp
int main()
{
    D1 d1;
    Base* dPtr = &d1;

    return 0;
}
```


因为`dPtr` 是一个基类指针，所以它指向的是`d1`中的`Base`部分。不过，由于 `__vptr` 位于`Base`部分，所以`dPtr` 是可以访问该指针的。最终，==一定要注意 `dPtr->__vptr`  指向的是 D1 的虚表！ 因此，即使`dPtr` 是`Base`类型指针，它仍然能够访问 D1’的虚表(通过 `__vptr`)。==

那么，当我们尝试调用`dPtr->function1()`时会发生什么？

```cpp
int main()
{
    D1 d1;
    Base* dPtr = &d1;
    dPtr->function1();

    return 0;
}
```

首先，程序识别到 `function1()` 是一个[[virtual-function|虚函数]]。其次，程序使用 `dPtr->__vptr` 获取 D1 的虚函数表。然后，它会在虚表中查找 `function1()` 对应的版本——即 `D1::function1()`。因此 `dPtr->function1()` 会解析为 `D1::function1()`！

你可能会有这样的疑问：“如果 `dPtr` 指向的是一个`Base`类的对象，而不是 D1 类型的对象会怎样？它仍然会调用`D1::function1()`吗？答案是否定的。

```cpp
int main()
{
    Base b;
    Base* bPtr = &b;//指向一个Base对象
    bPtr->function1();

    return 0;
}
```


在这个例子中，`b` 被创建后， `__vptr` 就被指向了`Base`的虚表而不是D1的虚表。这样一来，`bPtr->__vptr` 也同样指向`Base`的虚表。`Base`虚表的`function1()` 条目指向 `Base::function1()`。因此 `bPtr->function1()` 解析到 `Base::function1()`，因为它是能看到的最后派生的函数。

通过使用这些表，编译器和程序能够确保函数调用解析为适当的虚函数，即使你只使用指向基类的指针或引用！

调用虚函数比调用非虚函数要慢，这有几个原因：首先，我们必须使用`*__vptr`来获得适当的虚表。其次，我们必须对虚拟表建立索引，以找到要调用的函数。因此，我们必须执行3个操作才能找到要调用的函数，而普通的间接函数调用则需要执行2个操作，直接函数调用则需要执行1个操作。然而，在现代计算机中，这增加的时间通常是相当微不足道的。

另外需要提醒的是，任何使用虚函数的类都有`*__vptr` ，因此该类的每个对象都将增加一个指针。虚函数功能强大，但它们确实有性能代价。
