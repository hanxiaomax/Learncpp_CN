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


??? note "关键点速记"

	- 类内的函数是内联的，不受[[one-definition-rule|单一定义规则(one-definition-rule)]]第二条的限制（定义在程序中只能出现一次），所以可以被定义到头文件中。
	- 被分离到类外的函数定义是普通函数，受限于单一定义规则，因此只能被定义在源文件中。

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

幸运地是，C++ 支持将类的“声明部分”和实现部分分离。这是通过在类定义之外定义类成员函数来实现的。要做到这一点，只需将类的成员函数按照普通函数那样定义，但必须在函数前添加[[scope-resolution-operator|作用域解析运算符]](与命名空间相同)。

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

很简单吧。对于这个类来说，因为访问函数通常只有一行，所以它们通常被保留在类定义中。

在下面这个例子中，一个具[[member-initializer-list|成员初始化值列表]]构造函数被定义在了外部：


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

改写为：

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


## 将类的定义放置于头文件中

在 [[2-11-Header-files|2.11 - 头文件]] 中我们介绍过，函数的声明可以被放置在头文件中，这样我们就可以在多个文件或者项目中使用这些函数。对于类来说也是这样的。类的定义可以被放置在头文件中，这样做同样有助于在多个文件或项目中使用该类。一般来讲，类的定义会被放置与其同名的头文件中，而其成员函数则被定义在与类同名的`.cpp`文件中。

下面这个类的定义被分散在了头文件和源文件中：

```cpp title="Date.h"
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


```cpp title="Date.cpp"
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

现在，任何其他的需要使用`Date`类的头文件和源文件只有 `#include "Date.h"`即可。注意，`Date.cpp` 必须被编译到任何使用了 `Date.h` 的项目中，这样链接器才能知晓`Date`的实现。

## 将类定义在头文件中难道不会违反单一定义规则吗？


并不会。如果你的头文件包含了合适的[[2-12-Header-guards|头文件防卫式声明]]，那么类的定义并不会被多次包含到一个文件中。

类型(包括类)不受[[one-definition-rule|单一定义规则(one-definition-rule)]]第二条限制（即在一个程序中，一个变量或普通函数只能够有一个定义）。因此，将类定义`#include`类定义到到多个代码文件中并不存在问题(如果存在问题，类就没有多大用处了)。


## 将成员函数定义在头文件中难道不会违反单一定义规则吗？

视情况而定。在类定义中定义的成员函数被认为是隐式内联的。[[6-13-Inline-functions|内联函数]]不受单定义规则中每个程序一个定义部分的限制。这意味着在类定义本身中定义普通成员函数(如访问函数)没有问题。

==在类定义之外定义的成员函数被视为普通函数，并且服从单定义规则中每个程序部分的一个定义。== 因此，这些函数应该定义在代码文件中，而不是在头文件中。一个例外是模板函数，它们也是隐式内联的。

## 何时定义在头文件或源文件？又何时定义在类内或类外？


您可能会倾向于将所有成员函数定义放在类内部的头文件中。虽然这样做可以编译，但是这样做有一些缺点。首先，如上所述，这会使类定义变得混乱。其次，如果更改了头文件中的任何代码，则需要重新编译包含该头文件的每个文件。这可能会产生连锁反应，一个微小的更改就会导致整个程序需要重新编译(这可能会很慢)。如果您更改了.cpp文件中的代码，则只需要重新编译`.cpp`文件！

因此我们推荐下面的做法：

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

