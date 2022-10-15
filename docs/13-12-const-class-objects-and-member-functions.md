---
title: 13.12 - const 对象和成员函数
alias: 13.12 - const 对象和成员函数
origin: /const-class-objects-and-member-functions/
origin_title: "13.12 — Const class objects and member functions"
time: 2022-9-16
type: translation
tags:
- class
- const class
---

??? note "关键点速记"

	- const 类型的对象只能调用 const 成员函数。
	- const 成员函数可以被 const 或 非const 类型的对象调用

通过学习 [[4-13-Const-variables-and-symbolic-constants|4.13 - const 变量和符号常量]] ，我们知道基本数据类型(`int`, `double`, `char` 等)，可以通过`const`关键字被定义为const类型。同时所有的const变量都必须在创建时被初始化。
 
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

!!! success "最佳实践"

	将任何不需要修改对象状态的成员函数定义为 const，这样它就可以被 const 类型的对象调用。

## 通过 const 类型引用传递 const 对象

尽管实例化const类对象是创建const对象的一种方法，但获得const对象更常见的方法是通过const引用将对象传递给函数。

在 [[9-5-Pass-by-lvalue-reference|9.5 - 传递左值引用] 中我们介绍了 we covered the merits of passing class arguments by const reference instead of by value. To recap, passing a class argument by value causes a copy of the class to be made (which is slow) -- most of the time, we don’t need a copy, a reference to the original argument works just fine, and is more performant because it avoids the needless copy. We typically make the reference const in order to ensure the function does not inadvertently change the argument, and to allow the function to work with R-values (e.g. literals), which can be passed as const references, but not non-const references.


我们讨论了用const引用而不是用值传递类参数的优点。总结一下，按值传递类实参会导致生成类的副本(这很慢)——大多数时候，我们不需要复制，对原始实参的引用工作得很好，而且性能更好，因为它避免了不必要的复制。我们通常将引用设为const，以确保函数不会无意中更改实参，并允许函数使用r值(例如字面量)，这些r值可以作为const引用传递，但不能作为非const引用传递。


Can you figure out what’s wrong with the following code?

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

// note: We're passing date by const reference here to avoid making a copy of date
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


The answer is that inside of the printDate function, date is treated as a const object. And with that const date, we’re calling functions `getYear()`, `getMonth()`, and `getDay()`, which are all non-const. Since we can’t call non-const member functions on const objects, this will cause a compile error.

The fix is simple: make `getYear()`, `getMonth()`, and `getDay()` const:

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


Now in function printDate(), const date will be able to successfully call `getYear()`, `getMonth()`, and `getDay()`.

## Const members can not return non-const references to members

When a member function is const, the hidden *this pointer is also const, which means all members are treated as const within that function. Therefore, a const member function can not return a non-const reference to a member, as that would allow the caller to have non-const access to that const member. Const member functions can return const references to members.

We’ll see an example of this in the next section.

## Overloading const and non-const function

Finally, although it is not done very often, it is possible to overload a function in such a way to have a const and non-const version of the same function. This works because the const qualifier is considered part of the function’s signature, so two functions which differ only in their const-ness are considered distinct.

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


The const version of the function will be called on any const objects, and the non-const version will be called on any non-const objects:

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


Overloading a function with a const and non-const version is typically done when the return value needs to differ in constness. In the example above, the non-const version of getValue() will only work with non-const objects, but is more flexible in that we can use it to both read and write m_value (which we do by assigning the string “Hi”).

The const version of getValue() will work with either const or non-const objects, but returns a const reference, to ensure we can’t modify the const object’s data.

## 小结

Because passing objects by const reference is common, your classes should be const-friendly. That means making any member function that does not modify the state of the class object const!