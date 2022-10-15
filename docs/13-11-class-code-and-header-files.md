---
title: 13.11 - 类代码和头文件
alias: 13.11 - 类代码和头文件
origin: /class-code-and-header-files/
origin_title: "13.11 — Class code and header files"
time: 2022-9-16
type: translation
tags:
- class
---

## 在类定义的外部定义类成员函数

到目前为止，我们编写的类都很简单，所以可以在类的定义中直接实现成员函数。 例如，对于下列 `Date` 类来说：

```cpp
class Date
{
private:
    int m_year;
    int m_month;
    int m_day;

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
    int getDay()  { return m_day; }
};
```

不过，随着类越来越复杂，将所有的成员函数都直接定义在类中会导致类难以维护。使用一个已经定义好的类时，只需要关注其[[公共接口]]（[[public-member|公有成员]]函数）即可，而不需要了解类的底层工作原理。成员函数的实现细节只会对我们造成干扰。

幸运地是，C++ 支持将类的“声明部分”和实现部分分离。This is done by defining the class member functions outside of the class definition. To do so, simply define the member functions of the class as if they were normal functions, but prefix the class name to the function using the scope resolution operator (::) (same as for a namespace).

这是通过在类定义之外定义类成员函数来实现的。要做到这一点，只需将类的成员函数按照普通函数那样定义，但必须在函数前添加[[scope-resolution-operator|作用域解析运算符]](与命名空间相同)。

对于下面这个 `Data` 类定义来说，其构造函数和 `setDate()` 函数被定义在了类外部。注意，函数的原型仍然在类定义中，但是其实际实现被移动到了类外部：

```cpp
class Date
{
private:
    int m_year;
    int m_month;
    int m_day;

public:
    Date(int year, int month, int day);

    void SetDate(int year, int month, int day);

    int getYear() { return m_year; }
    int getMonth() { return m_month; }
    int getDay()  { return m_day; }
};

// Date constructor
Date::Date(int year, int month, int day)
{
    SetDate(year, month, day);
}

// Date member function
void Date::SetDate(int year, int month, int day)
{
    m_month = month;
    m_day = day;
    m_year = year;
}
```

很简单吧。对整个类来说，因为访问函数通常只有一行，所以它们通常被保留在类定义中。

在下面这个例子中，一个具[[成员构造函数被定义在了外部：

This is pretty straightforward. Because access functions are often only one line, they are typically left in the class definition, even though they could be moved outside.

Here is another example that includes an externally defined constructor with a member initialization list:

```cpp
class Calc
{
private:
    int m_value = 0;

public:
    Calc(int value=0): m_value{value} {}

    Calc& add(int value) { m_value  += value;  return *this; }
    Calc& sub(int value) { m_value -= value;  return *this; }
    Calc& mult(int value) { m_value *= value;  return *this; }

    int getValue() { return m_value ; }
};
```

COPY

becomes:

```cpp
class Calc
{
private:
    int m_value = 0;

public:
    Calc(int value=0);

    Calc& add(int value);
    Calc& sub(int value);
    Calc& mult(int value);

    int getValue() { return m_value; }
};

Calc::Calc(int value): m_value{value}
{
}

Calc& Calc::add(int value)
{
    m_value += value;
    return *this;
}

Calc& Calc::sub(int value)
{
    m_value -= value;
    return *this;
}

Calc& Calc::mult(int value)
{
    m_value *= value;
    return *this;
}
```

COPY

## 将类的定义放置于头文件中

In the lesson on [[2-11-Header-files|2.11 - 头文件]], you learned that you can put function declarations inside header files in order to use those functions in multiple files or even multiple projects. Classes are no different. Class definitions can be put in header files in order to facilitate reuse in multiple files or multiple projects. Traditionally, the class definition is put in a header file of the same name as the class, and the member functions defined outside of the class are put in a .cpp file of the same name as the class.

Here’s our Date class again, broken into a .cpp and .h file:

Date.h:

```cpp
#ifndef DATE_H
#define DATE_H

class Date
{
private:
    int m_year;
    int m_month;
    int m_day;

public:
    Date(int year, int month, int day);

    void SetDate(int year, int month, int day);

    int getYear() { return m_year; }
    int getMonth() { return m_month; }
    int getDay()  { return m_day; }
};

#endif
```

COPY

Date.cpp:

```cpp
#include "Date.h"

// Date constructor
Date::Date(int year, int month, int day)
{
    SetDate(year, month, day);
}

// Date member function
void Date::SetDate(int year, int month, int day)
{
    m_month = month;
    m_day = day;
    m_year = year;
}
```

COPY

Now any other header or code file that wants to use the Date class can simply `#include "Date.h"`. Note that Date.cpp also needs to be compiled into any project that uses Date.h so the linker knows how Date is implemented.

## 将类定义在头文件中难道不会违反单一定义规则吗？

[[one-definition-rule|单一定义规则(one-definition-rule)]]

It shouldn’t. If your header file has proper header guards, it shouldn’t be possible to include the class definition more than once into the same file.

Types (which include classes), are exempt from the part of the one-definition rule that says you can only have one definition per program. Therefore, there isn’t an issue `#including` class definitions into multiple code files (if there was, classes wouldn’t be of much use).

## 将成员函数定义在头文件中难道不会违反单一定义规则吗？


It depends. Member functions defined inside the class definition are considered implicitly inline. Inline functions are exempt from the one definition per program part of the one-definition rule. This means there is no problem defining trivial member functions (such as access functions) inside the class definition itself.

Member functions defined outside the class definition are treated like normal functions, and are subject to the one definition per program part of the one-definition rule. Therefore, those functions should be defined in a code file, not inside the header. One exception is for template functions, which are also implicitly inline.

## 何时定义在头文件或源文件？又何时定义在类内或类外？


You might be tempted to put all of your member function definitions into the header file, inside the class. While this will compile, there are a couple of downsides to doing so. First, as mentioned above, this clutters up your class definition. Second, if you change anything about the code in the header, then you’ll need to recompile every file that includes that header. This can have a ripple effect, where one minor change causes the entire program to need to recompile (which can be slow). If you change the code in a .cpp file, only that .cpp file needs to be recompiled!

Therefore, we recommend the following:

-   For classes used in only one file that aren’t generally reusable, define them directly in the single .cpp file they’re used in.
-   For classes used in multiple files, or intended for general reuse, define them in a .h file that has the same name as the class.
-   Trivial member functions (trivial constructors or destructors, access functions, etc…) can be defined inside the class.
-   Non-trivial member functions should be defined in a .cpp file that has the same name as the class.

In future lessons, most of our classes will be defined in the .cpp file, with all the functions implemented directly in the class definition. This is just for convenience and to keep the examples short. In real projects, it is much more common for classes to be put in their own code and header files, and you should get used to doing so.

## 默认参数

Default parameters for member functions should be declared in the class definition (in the header file), where they can be seen by whomever `#includes` the header.

## 库

Separating the class definition and class implementation is very common for libraries that you can use to extend your program. Throughout your programs, you’ve `#included` headers that belong to the standard library, such as iostream, string, vector, array, and other. Notice that you haven’t needed to add iostream.cpp, string.cpp, vector.cpp, or array.cpp into your projects. Your program needs the declarations from the header files in order for the compiler to validate you’re writing programs that are syntactically correct. However, the implementations for the classes that belong to the C++ standard library are contained in a precompiled file that is linked in at the link stage. You never see the code.

Outside of some open source software (where both .h and .cpp files are provided), most 3rd party libraries provide only header files, along with a precompiled library file. There are several reasons for this: 1) It’s faster to link a precompiled library than to recompile it every time you need it, 2) a single copy of a precompiled library can be shared by many applications, whereas compiled code gets compiled into every executable that uses it (inflating file sizes), and 3) intellectual property reasons (you don’t want people stealing your code).

Having your own files separated into declaration (header) and implementation (code file) is not only good form, it also makes creating your own custom libraries easier. Creating your own libraries is beyond the scope of these tutorials, but separating your declaration and implementation is a prerequisite to doing so.

