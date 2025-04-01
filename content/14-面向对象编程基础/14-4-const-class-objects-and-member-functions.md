---
title: 14.4 - const 对象和成员函数
alias: 14.4 - const 对象和成员函数
origin: /const-class-objects-and-member-functions/
origin_title: "13.12 — Const class objects and member functions"
time: 2022-9-16
type: translation
tags:
- class
- const class
---

> [!note] "Key Takeaway"
> - const 类型的对象只能调用 const 成员函数。
> - const 成员函数可以被 const 或 非const 类型的对象调用

通过学习 [[5-1-Const-variables-and-symbolic-constants|5.1 - const 变量和符号常量]] ，我们知道基本数据类型(`int`, `double`, `char` 等)，可以通过`const`关键字被定义为const类型。同时所有的const变量都必须在创建时被初始化。
 
对于 const 类型的基本数据类型，初始化可以通过[[copy-initialization|拷贝初始化]]、[[direct-initialization|直接初始化]]或[[uniform-initialization|统一初始化]]来完成：

```cpp
const int value1 = 5; // 拷贝初始化
const int value2(7); //  直接初始化
const int value3 { 9 }; // 统一初始化 (C++11)
```


## const 类

同样的，被[[instantiated|实例化]]的对象也可以通过const关键字被创建为 const 类型。初始化则是通过[[constructor|构造函数]]完成的：

```cpp
const Date date1; // 使用默认构造函数初始化
const Date date2(2020, 10, 16); // 使用带参数的构造函数进行初始化
const Date date3 { 2020, 10, 16 }; // 使用带参数的构造函数进行初始化(C++11)
```

const 类型的对象，一旦通过构造函数初始化，其任何成员变量都不再可以被修改，否则显然违背了其“常量性”。不论是直接修改[[public-member|公有成员]]还是通过公有成员函数为成员变量赋值都是不可以的。考虑下面的例子：


```cpp
class Something
{
public:
    int m_value {};

    Something(): m_value{0} { }

    void setValue(int value) { m_value = value; }
    int getValue() { return m_value ; }
};

int main()
{
    const Something something{}; // calls default constructor

    something.m_value = 5; // compiler error: violates const
    something.setValue(5); // compiler error: violates const

    return 0;
}
```

上面涉及变量`something`的两行都是非法的，因为它们要么试图直接更改成员变量，要么调用试图更改成员变量的成员函数，从而违反了`something`的常量性。

与普通变量一样，当需要确保类对象在创建后不再被修改时，可以将它们设置为const。


## const 成员函数

考虑下面这行代码：

```cpp
std::cout << something.getValue();
```

上述代码可能会让你感到吃惊，它会导致编译错误，即使 `getValue()` 没有去改变任何成员变量！实际上，作为 const 类型的对象，它只能显式地调用 const 类型的成员函数，而 `getValue()` 并不是 const类型的。

[[const-member-function|const 成员函数]] 是一类成员函数，它保证自己不会修改对象，也不会调用任何非const类型的成员函数（因为它们可能会修改对象）。

要将 `getValue()` 声明为 const 成员函数，只需要在函数原型中使用 const 关键字即可（放在参数列表后，函数体之前）：

```cpp
class Something
{
public:
    int m_value {};

    Something(): m_value{0} { }

    void resetValue() { m_value = 0; }
    void setValue(int value) { m_value = value; }

    int getValue() const { return m_value; } // 注意参数列表之后，函数体之前的 const 关键字

};
```


现在，`getValue()` 已经是 const 成员函数了，此时它就可以被其他 const 对象调用。

对于定义在类外的成员函数来说，不仅函数原型中需要const关键字，函数定义时也必须添加 const 关键字：

```cpp
class Something
{
public:
    int m_value {};

    Something(): m_value{0} { }

    void resetValue() { m_value = 0; }
    void setValue(int value) { m_value = value; }

    int getValue() const; // 注意此处的 const 关键字
};

int Something::getValue() const // 这里也需要
{
    return m_value;
}
```


不仅如此，任何 const 成员函数如果尝试修改成员变量或者调用非const类型的函数，都会导致编译保存，例如：

```cpp
class Something
{
public:
    int m_value {};

    void resetValue() const { m_value = 0; } // compile error, const functions can't change member variables.
};
```


在这个例子中，`resetValue()` 被标记为 const 成员函数，但是它尝试修改 `m_value`。因此导致了编译错误。

注意，构造函数不能被标记为const。这是因为构造函数需要能够初始化它们的成员变量，而const构造函数不能这样做。因此，该语言不允许使用const构造函数。

==const成员函数也可以由非const对象调用。==

> [!success] "最佳实践"
> 将任何不需要修改对象状态的成员函数定义为 const，这样它就可以被 const 类型的对象调用。

## 通过 const 类型引用传递 const 对象

尽管实例化const类对象是创建const对象的一种方法，但获得const对象更常见的方法是通过const引用将对象传递给函数。

在 [[12-5-Pass-by-lvalue-reference|12.5 - 传递左值引用]] 中我们介绍了通过常量引用传递类参数时的特性。回忆一下，[[pass-by-value|按值传递]]对象会导致对象被赋值（效率低）——大多数情况下，我们并不需要一份拷贝，使用原始对象的引用就可以了，而且由于避免了不必要的拷贝，性能自然也更好。通常情况下，我们会使用 const 类型的引用来确保实参不被修改，而且使得函数可以配合[[rvalue|右值]]来使用（例如字面量），因为右值只能通过const引用传递。

你能看出下面代码中的问题吗？

```cpp
#include <iostream>

class Date
{
private:
    int m_year {};
    int m_month {};
    int m_day {};

public:
    Date(int year, int month, int day)
    {
        setDate(year, month, day);
    }

    void setDate(int year, int month, int day)
    {
        m_year = year;
        m_month = month;
        m_day = day;
    }

    int getYear() { return m_year; }
    int getMonth() { return m_month; }
    int getDay() { return m_day; }
};

// 注意：我们通过传 const 引用来避免拷贝 data
void printDate(const Date& date)
{
    std::cout << date.getYear() << '/' << date.getMonth() << '/' << date.getDay() << '\n';
}

int main()
{
    Date date{2016, 10, 16};
    printDate(date);

    return 0;
}
```

这里的问题在于，在函数`printDate` 函数中，`date` 被当做const对象，因此基于const对象`date`调用 `getYear()`、`getMonth()` 和 `getDay()`这些非const成员函数的时候，就会导致编译器报错。

为了解决这个问题，需要将 `getYear()`、`getMonth()` 和  `getDay()` 定义为 const：

```cpp
class Date
{
private:
    int m_year {};
    int m_month {};
    int m_day {};

public:
    Date(int year, int month, int day)
    {
        setDate(year, month, day);
    }

    // setDate() cannot be const, modifies member variables
    void setDate(int year, int month, int day)
    {
        m_year = year;
        m_month = month;
        m_day = day;
    }

    // The following getters can all be made const
    int getYear() const { return m_year; }
    int getMonth() const { return m_month; }
    int getDay() const { return m_day; }
};
```


这样一来 `printDate()` 函数中的 const `date` 就可以正常调用 `getYear()`、`getMonth()` 和 `getDay()` 了。

## const 成员不能返回非const引用成员

如果成员函数是 const 的，则 `*this` 指针也是const的，这就意味着在这个函数中，所有类成员都会被当做是const的。因此一个 const 成员函数不能返回非const引用成员。const成员函数只能返回const引用成员。

在下一个章节我们会看到具体的例子。

## 重载 const 和 非 const 函数

最后，尽管不常用，但我们的确可以通过重载获得同一函数的const和非const版本。因为const限定符被认为是函数签名的一部分，所以当两个函数具有不同的 const 签名的函数会被认为是两个不同的函数。

```cpp
#include <string>

class Something
{
private:
    std::string m_value {};

public:
    Something(const std::string& value=""): m_value{ value } {}

    const std::string& getValue() const { return m_value; } // getValue() for const objects (returns const reference)
    std::string& getValue() { return m_value; } // getValue() for non-const objects (returns non-const reference)
};
```

当使用const对象调用成员函数时，调用的便是 const 版本的函数。对于非const成员而言，则调用的是非const成员函数：


```cpp
int main()
{
	Something something;
	something.getValue() = "Hi"; // calls non-const getValue();

	const Something something2;
	something2.getValue(); // calls const getValue();

	return 0;
}
```

当返回值需要不同的“常量性”时（即常量或非常量），则需要重载const和非const版本的函数。在上面的例子中，`getValue()` 的非const版本只能配合非const对象来使用，但是它更灵活，因为我们可以使用它来读 `m_value`，或者写`m_value`(通过赋值字符串" Hi "来实现)。

`getValue()`的const版本既可以处理const对象也可以处理非const对象，但返回const引用，以确保不能修改const对象的数据。


## 小结

因为通过const引用传递对象是常见的，所以类应该是const友好的。这意味着应该将任何不修改类对象的状态的成员函数设置为const！

