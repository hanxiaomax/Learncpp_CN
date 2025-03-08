---
title: 13.2 - 类和类成员
alias: 13.2 - 类和类成员
origin: /classes-and-class-members/
origin_title: "13.2 — Classes and class members"
time: 2022-9-16
type: translation
tags:
- class
---

??? note "Key Takeaway"


虽然 C++ 提供了不少基本数据类型（例如 char、int、long、float、double 等等），应付相对的简单问题，这些基本数据结构似乎已经足够了，但是使用它们解决复杂问题的话就会显得力不从心。C++ 最有用的一个特性就是允许用户针对要解决的问题来自定义数据类型。 [[unscoped-enumerations|枚举类型]]和[[10-5-Introduction-to-structs-members-and-member-selection|结构体]]是两种我们已经介绍过的自定义数据类型。

下面的例子展示了如何使用结构体来存放日期：

```cpp
struct DateStruct
{
    int year {};
    int month {};
    int day {};
};
```

枚举类型和纯数据结构体（只包含变量的结构体）常用于传统的非面向对象编程领域，因为它们只能保存数据。我们可以像下面这样初始化结构体：

```cpp
DateStruct today { 2020, 10, 14 }; // use uniform initialization
```

现在，如果你想将结构体的内容打印到屏幕上，那么可以通过一个函数来完成，例如：

```cpp
#include <iostream>

struct DateStruct
{
    int year {};
    int month {};
    int day {};
};

void print(const DateStruct& date)
{
    std::cout << date.year << '/' << date.month << '/' << date.day;
}

int main()
{
    DateStruct today { 2020, 10, 14 }; // 使用统一初始化

    today.day = 16; // 使用成员选择运算符选择一个结构体成员
    print(today);

    return 0;
}
```


打印结果如下：

```
2020/10/16
```

## 类（Classes）

在面向对象编程的世界中，我们不仅需要自定义类型能够包含数据，它还需要提供能够操作这些数据的函数（方法）。在C++中，定义这样的数据可以使用`class`关键字。该关键字可以用于定义一个被称为类（class）的数据类型。

在 C++ 中，类和结构体本质上是相同的。实际上，下面代码中的结构体和类几乎没有区别：

```cpp
struct DateStruct
{
    int year {};
    int month {};
    int day {};
};

class DateClass
{
public:
    int m_year {};
    int m_month {};
    int m_day {};
};
```

注意，上面代码中的唯一的一处明显不同，就是类中的public关键字。我们会在后续的课程中讨论该关键字的作用。

与声明结构体类似，类的声明并不会实际分配任何内存，它仅仅定义了一个类应该“是什么样的”。

> [!warning] "注意"
> 与定义结构体类似，定义类的时候最容易犯的一个错误就是忘记结尾处的分号。忘记这个分号会导致**下一行代码**编译报错。现代编译器，例如 Visual Studio 2010 会在你忘记该分号时提醒你，但是一些较早的或者简单的编译器并不会提醒你，这可能导致问题难以被发现。
	

类（和结构体）的定义类似于**蓝图**——它们描述了一个对象应该“是什么样的”，但定义并不会实际创建对象。为了创建对象，我们必须使用该类型定义一个变量：

```cpp
DateClass today { 2020, 10, 14 }; // declare a variable of class DateClass
```


> [!tip] "小贴士"
> 在声明类的时候就要对其成员变量进行初始化。
	
## 成员函数

除了存放数据之外，类（和结构体）同样还可以包含函数！定义在类中的函数称为[[member-function|成员函数]]（或称为方法）。成员函数的定义可以被包含在类内，也可以定义在类外。我们暂时将其定义在类内，这种形式相对更简单，稍后我们会介绍如何在类外定义类的方法。

具有成员函数的Data类如下：

```cpp
class DateClass
{
public:
    int m_year {};
    int m_month {};
    int m_day {};

    void print() // defines a member function named print()
    {
        std::cout << m_year << '/' << m_month << '/' << m_day;
    }
};
```

和结构体成员一样，类的成员（包括变量和函数）可以通过[[member-access-operator|成员访问运算符(.)]]来访问。


```cpp
#include <iostream>

class DateClass
{
public:
    int m_year {};
    int m_month {};
    int m_day {};

    void print()
    {
        std::cout << m_year << '/' << m_month << '/' << m_day;
    }
};

int main()
{
    DateClass today { 2020, 10, 14 };

    today.m_day = 16; // use member selection operator to select a member variable of the class
    today.print(); // use member selection operator to call a member function of the class

    return 0;
}
```


运行结果为：

```
2020/10/16
```

观察可以发现，上述代码和之前使用结构体的版本近乎是一致的。

不过，其中还是有几处不同。在使用结构体的版本中，`print()`函数需要将结构体本身作为参数传递，否则`print()`函数就无从判断我们要打印的是哪个结构体的内容。不仅如此，我们还需要在函数中明确地使用该参数。

成员函数的工作方式则略有不同：所有成员函数的调用必须基于该类的一个具体对象。当我们调用 `today.print()`的时候，实际上是告诉编译器调用`today`对象的成员函数`print()`。

让我们在看一眼成员函数`print`的定义：

```cpp
void print() // defines a member function named print()
{
    std::cout << m_year << '/' << m_month << '/' << m_day;
}
```


`m_year`、`m_month` 和 `m_day` 是谁的变量？它们指的是其函数调用时关联的对象所属的变量。

因此当调用`today.print()`时，编译器会将 `m_day` 解析为 `today.m_day`，将`m_month` 解析为 `today.m_month` ，将 `m_year` 解析为 `today.m_year`。当调用 `tomorrow.print()`时，则 `m_day` 解析为 `tomorrow.m_day`。

可见，相关联的对象会被隐式地传入成员函数。因此，它通常被称为[[implicit-object|隐式对象]]。

我们会在后面的课程中详细介绍隐式对象传递的工作原理。

对于非成员函数来说，我们必须将它需要操作的数据传递给函数。而对于成员函数，我们可以假定它可以直接使用这个类的对象。

为成员变量添加 “`m_`” 前缀可以帮助我们区分成员变量、函数参数和局部变量。这么做有诸多好处：首先，当我们看到对具有 “`m_`”前缀的变量进行赋值时，我们就可以指定该操作会改变当前类实例的状态。其次，函数[[parameters|形参]]或局部变量被声明在当前函数中，而成员变量则不同，它被定义在类中。因此，如果我们想要知道`m_`前缀的变量的具体定义，就需要去类的定义中查看，而不是在当前函数中查看。

按照管理，类名通常是大写字母开头的。

> [!success] "最佳实践"
对类命名时，使用大写字母开头。

再看下面这个例子：

```cpp
#include <iostream>
#include <string>

class Employee
{
public:
    std::string m_name {};
    int m_id {};
    double m_wage {};

    // Print employee information to the screen
    void print()
    {
        std::cout << "Name: " << m_name <<
                "  Id: " << m_id <<
                "  Wage: $" << m_wage << '\n';
    }
};

int main()
{
    // Declare two employees
    Employee alex { "Alex", 1, 25.00 };
    Employee joe { "Joe", 2, 22.25 };

    // Print out the employee information
    alex.print();
    joe.print();

    return 0;
}
```

程序输出结果为：

```
Name: Alex  Id: 1  Wage: $25
Name: Joe  Id: 2  Wage: $22.25
```

对于非成员函数来说，它不能调用被定义在它下方（即后定义）的函数，除非它能够看到该函数的[[forward-declaration|前向声明]]：

```cpp
void x()
{
// You can't call y() from here unless the compiler has already seen a forward declaration for y()
}

void y()
{
}
```

而对于成员函数来说，则没有该限制：

```cpp
class foo
{
public:
     void x() { y(); } // okay to call y() here, even though y() isn't defined until later in this class
     void y() { };
};
```



## 成员类型

除了成员变量和成员函数，类还可以具有[[member-types|成员类型]]或嵌套类型（也包括[[type-aliases|类型别名]]）。

```cpp
class Employee
{
public:
    using IDType = int;

    std::string m_name{};
    IDType m_id{};
    double m_wage{};

    // Print employee information to the screen
    void print()
    {
        std::cout << "Name: " << m_name <<
            "  Id: " << m_id <<
            "  Wage: $" << m_wage << '\n';
    }
};
```

在上面的例子中，类名实际上成为了其嵌套类型的[[namespace|命名空间]]。在该类中，我们可以直接使用 `IDType`，而在类外，我们必须使用`Employee::IDType`来访问该类型。

如果在后续的开发中我们发现`int`类型已经无法满足需要，而必须改用 `std::string` ，此时我们只需要更新这个类型别名，而不需要将所有的`int`都替换为`std::string`。


嵌套类型不能被前向声明。通常情况下，嵌套类型应该只在包含它的类中使用。注意，因为类也是一种类型，所以类可以被嵌套在类中——这个做法并不常见而且通常只有高级程序员才会去使用。

## 关于 C++ 中结构体的一些注意事项

在C语言中，结构体只有数据成员，没有成员函数。在c++中，在设计完类(使用class关键字)后，Bjarne Stroustrup花了一些时间考虑是否应该赋予结构体(继承自C)具有成员函数的能力。经过考虑，他决定结构体应该能够具有成员函数，这样一来可以在某种程度上为类和结构体指定统一的规则集。因此，尽管我们使用class关键字编写了上面的程序，但其实可以使用struct关键字来代替。

许多开发者(包括我自己)认为这是一个不正确的决定，因为它可能导致危险的假设。例如，假设一个类会在销毁后清理它自己是合理的(例如，一个分配内存的类会在被销毁之前释放它所使用的内存)，但假设一个结构体也会这么做则是不安全的。因此，我们建议对只有数据的结构体使用struct关键字，而对定义需要数据和函数捆绑在一起的对象时使用class关键字。

> [!success] "最佳实践"
> struct 关键字只适用于仅包含数据的结构。而对于同时包含数据和函数的对象，请使用class关键字。
	

其实你已经在不知情的情况下多次使用class了。

实际上，C++标准库里充满了各式各样的类，它们都可以方便你工作，`std::string`、`std::vector` 和 `std::array` 都是class！因此，当我们创建这些类型的对象时，你就在实例化一个类类型的对象。而当你使用这些对象调用函数时，调用的都是它们的成员函数。

```cpp
#include <string>
#include <array>
#include <vector>
#include <iostream>

int main()
{
    std::string s { "Hello, world!" }; // instantiate a string class object
    std::array<int, 3> a { 1, 2, 3 }; // instantiate an array class object
    std::vector<double> v { 1.1, 2.2, 3.3 }; // instantiate a vector class object

    std::cout << "length: " << s.length() << '\n'; // call a member function

    return 0;
}
```


## 小结

class关键字允许我们在C++中创建一个既可以包含成员变量又可以包含成员函数的自定义类型。类构成了面向对象编程的基础，我们将用本章的其余部分和将来的许多章节来探索类为我们提供的一切能力。