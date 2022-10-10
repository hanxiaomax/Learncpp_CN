---
title: 13.4 - 成员访问函数与封装
alias: 13.4 - 成员访问函数与封装
origin: /access-functions-and-encapsulation/
origin_title: "13.4 — Access functions and encapsulation"
time: 2022-9-16
type: translation
tags:
- encapsulation
---

??? note "关键点速记"


## 为什么要定义私有成员变量

书接上文，我们提到，类成员变量通常是私有的。正在学习面向对象编程的开发人员通常很难理解这么做的目的。其实打个比方你就能够明白了。

生活中我们可以接触到许多电子设备。例如电视遥控器，你可以用它来打开/关闭电视。你可以开车(或踏板车)去上班，用智能手机拍照。这三种看似不相关的东西却有着一个共同的模式：它们为你提供一个简单的界面使你可以(一个按钮、一个方向盘等等……)执行一个动作。然而，这些设备的实际操作方式却不为你所知。当你按下遥控器上的按钮时，你不需要知道它是如何与电视通信的。当你踩油门时，你也不需要知道内燃机是如何让轮子转动的。当你拍照时，你不需要知道传感器是如何将光线聚集成像素图像的。这种接口和实现的分离非常有用，因为它允许我们在不了解物体如何工作的情况下使用物体。这极大地降低了使用这些对象的复杂性，增加了我们能够与之交互的对象数量。

基于同样的原因，将实现和接口分离在软件工程中也是非常有用的。

## 封装

在面向对象编程中，[[Encapsulation|封装]]（有时也称为信息屏蔽）是指将对象的实现细节对用户隐藏起来的过程。用户在使用对象的时候只需要通过公开接口访问对象即可。通过这种方式，用户可以在不了解对象实现的情况下使用该对象。

在 C++ 中，我们可以通过[[access-specifiers|成员访问修饰符]]来实现封装。通常，类的所有成员变量都是私有的(隐藏实现细节)，而大多数成员函数都是公有的(暴露接口)。虽然要求类的用户使用公开接口与类交互比直接提供对成员变量的公共访问更繁琐，但这样做实际上益处颇多，有助于提高类的可重用性和可维护性。


注意：封装一词有时候也指代对数据和函数的打包。这里我们只取其在面向对象编程中的含义。

### 好处 1 ：类封装可以提高其易用性并降低程序复杂度

对于一个良好封装的类来说，你只需关心该类为你提供了哪些公共接口，这些接口需要什么参数，它们的返回值是什么。而这个类的具体内部实现则完全不需要搞清楚。例如，类中保存了一个包含多个名字的列表，而这个列表的实现可以是包含C语言风格字符串的动态数组，也可以是 `std::array`、`std::vector` 、`std::map`、`std::list` 或者其他数据结构。在使用该类的对象时，不需要也不关心它使用了哪个数据结构来保存名字。这无疑极大程度地降低了你的程序的复杂度，也就减少了犯错误的机会。与其他的好处相比，这是封装带来的最大好处。

C++ 标准库中的所有类都是封装过的。你可以想象一下，如果你需要了解 `std::string`, `std::vector` 或 `std::cout` 的实现才能使用它们的话，将是多么可怕的一件事！

### 好处 2 ：类封装可以保护其数据不被滥用


全局变量是危险的，因为你不能严格控制谁可以访问全局变量，或者他们应该如何使用它。[[public-member|公有成员]]也有同样的问题，只是程度稍轻而已。

例如，假设我们正在编写一个字符串类。我们可以这样开始:


```cpp
class MyString
{
    char* m_string; // we'll dynamically allocate our string here
    int m_length; // we need to keep track of the string length
};
```

这两个变量存在内在的联系: `m_length` 应该总是等于 `m_string` 持有的字符串的长度(这种联系被称为不变量)。如果 `m_length` 是public 的，那么任何人都可以在不改变 `m_string` 的情况下改变字符串的长度(反之亦然)。这将使类处于不一致的状态，从而可能导致各种奇怪的问题。通过使 `m_length` 和 `m_string` 成为 private ，用户被迫使用任何可用的公共成员函数与该类进行交互(并且这些成员函数可以确保 `m_length` 和 `m_string` 总是被适当设置)。

我们还可以防止用户在使用我们的类时犯错误。考虑一个具有公共数组成员变量的类:

```cpp
class IntArray
{
public:
    int m_array[10];
};
```

如果用户可以直接访问数组，他们可能会使用无效的索引下标数组，从而引发意想不到的结果：

```cpp
int main()
{
    IntArray array;
    array.m_array[16] = 2; // invalid array index, now we overwrote memory that we don't own
}
```

然而，如果我们将数组设为私有，则可以强制调用一个验证索引是否有效的函数：

```cpp
#include <iterator> // For std::size()

class IntArray
{
private:
    int m_array[10]; // user can not access this directly any more

public:
    void setValue(int index, int value)
    {
        // If the index is invalid, do nothing
        if (index < 0 || index >= std::size(m_array))
            return;

        m_array[index] = value;
    }
};
```

通过这种方式可以保护程序的完整性。顺带一提，`std::array` 和 `std::vector` 的 `at()`函数所做的事情和上面的函数非常类似！


### 好处 3 ：封装过的类更容易修改

考虑下面这个简单的类：

```cpp
#include <iostream>

class Something
{
public:
    int m_value1;
    int m_value2;
    int m_value3;
};

int main()
{
    Something something;
    something.m_value1 = 5;
    std::cout << something.m_value1 << '\n';
}
```

虽然这个程序工作得很好，但如果稍后我们决定重命名 `m_value1` 或改变它的类型会发生什么？我们不仅破坏了这个程序，而且可能破坏了大多数使用 `Something` 类的程序！

封装使我们能够在不破坏所有使用类的程序的情况下改变类的实现方式。

下面是这个类的封装版本，它使用函数访问 `m_value1`：

```cpp
#include <iostream>

class Something
{
private:
    int m_value1;
    int m_value2;
    int m_value3;

public:
    void setValue1(int value) { m_value1 = value; }
    int getValue1() { return m_value1; }
};

int main()
{
    Something something;
    something.setValue1(5);
    std::cout << something.getValue1() << '\n';
}
```

现在，让我们改变类的实现：

```cpp
#include <iostream>

class Something
{
private:
    int m_value[3]; // note: we changed the implementation of this class!

public:
    // We have to update any member functions to reflect the new implementation
    void setValue1(int value) { m_value[0] = value; }
    int getValue1() { return m_value[0]; }
};

int main()
{
    // But our program still works just fine!
    Something something;
    something.setValue1(5);
    std::cout << something.getValue1() << '\n';
}
```

请注意，因为我们没有更改类的公共接口中的任何函数签名(返回类型、函数名或形参)，所以使用该类的用户不会感知到任何改变。

同样地，如果有人在晚上潜入你的房子，用不同的(但兼容的)技术替换了你的电视遥控器的内部，你在使用时可能完全不会注意到！

### 好处 4：封装的类更容易查找错误

最后，封装可以帮助你在出现错误时调试程序。通常，当一个程序不能正常工作时，其原因可能是因为我们的一个成员变量的值不正确。如果每个人都能够直接访问变量，那么跟踪哪段代码修改了变量就会很困难(可能是程序中的任何一段代码，你需要将它们全部分解以找出是哪一行)。但是，如果每个人都必须调用同一个公共函数来修改一个值，那么你就可以将该函数设为断点，并观察每个调用者更改值的过程，直到发现哪里出了问题。


## 成员访问函数

对于某些类来说（取决于这个类要做什么），有时候我们会希望能够直接读取或设置某个[[private-member|私有成员]]变量的值。

[[access-function|成员访问函数]]是一类用于获取或改变类私有成员变量值的精简函数。例如，对于 `String` 类，成员函数看上去可能会像这样：

```cpp
class MyString
{
private:
    char* m_string; // we'll dynamically allocate our string here
    int m_length; // we need to keep track of the string length

public:
    int getLength() { return m_length; } // access function to get value of m_length
};
```

`getLength()` 就是上一个成员访问函数，它返回 `m_length` 的值。

成员访问函数通常有两种：**getters** 和 **setters**。**Getters** (有时也称为accessor) 用于返回某个私有成员变量的值。**Setters** (有时候也称为**mutators**) 则用于为私有成员变量设置值。

下面是一个示例类，它的所有成员都具有getter和setter：

```cpp
class Date
{
private:
    int m_month;
    int m_day;
    int m_year;

public:
    int getMonth() { return m_month; } // getter for month
    void setMonth(int month) { m_month = month; } // setter for month

    int getDay() { return m_day; } // getter for day
    void setDay(int day) { m_day = day; } // setter for day

    int getYear() { return m_year; } // getter for year
    void setYear(int year) { m_year = year; } // setter for year
};
```

The Date class above is essentially an encapsulated struct with a trivial implementation, and a user of the class might reasonably expect to be able to get or set the day, month, or year.

The MyString class above isn’t used just to transport data -- it has more complex functionality and has an invariant that needs to be maintained. No setter was provided for variable m_length because we don’t want the user to be able to set the length directly (length should only be set whenever the string is changed). In this class, it does make sense to allow the user to get the string length directly, so a getter for the length was provided.

Getters should provide “read-only” access to data. Therefore, the best practice is that they should return by value or const reference (not by non-const reference). A getter that returns a non-const reference would allow the caller to modify the actual object being referenced, which violates the read-only nature of the getter (and violates encapsulation).

Here’s a trivial example of what can happen if your getter returns a non-const reference:

```cpp
#include <iostream>

class Foo
{
private:
    int m_value{ 4 };

public:
    int& getValue() { return m_value; } // returns a non-const reference
};

int main()
{
    Foo f;                     // f.m_value is initialized to 4
    f.getValue() = 5;          // use the non-const reference to assign value 5 to m_value
    std::cout << f.getValue(); // prints 5

    return 0;
}
```

COPY

This program prints:

5

Because getValue() is returning a non-const reference, we can use that reference to modify the value being referenced (m_value)!

!!! success "最佳实践"

	Getters should return by value or const reference.


## 成员访问函数的相关问题

There is a fair bit of discussion around in which cases access functions should be used or avoided. Although they don’t violate encapsulation, some developers would argue that use of access functions violates good OOP class design (a topic that could easily fill an entire book).

For now, we’ll recommend a pragmatic approach. As you create your classes, consider the following:

-   If nobody outside your class needs to access a member, don’t provide access functions for that member.
-   If someone outside your class needs to access a member, think about whether you can expose a behavior or action instead (e.g. rather than a setAlive(bool) setter, implement a kill() function instead).
-   If you can’t, consider whether you can provide only a getter.

## 小结

As you can see, encapsulation provides a lot of benefits for just a little bit of extra effort. The primary benefit is that encapsulation allows us to use a class without having to know how it was implemented. This makes it a lot easier to use classes we’re not familiar with.