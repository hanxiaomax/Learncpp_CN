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


!!! warning "注意"

	与定义结构体类似，定义类的时候最容易犯的一个错误就是忘记结尾处的分号。忘记这个分号会导致**下一行代码**编译报错。现代编译器，例如 Visual Studio 2010 会在你忘记该分号时提醒你，但是一些较早的或者简单的编译器并不会提醒你，这可能导致问题难以被发现。
	

类（和结构体）的定义类似于**蓝图**——它们描述了一个对象应该“是什么样的”，但定义并不会实际创建对象。为了创建对象，我们必须使用该类型定义一个变量：

```cpp
DateClass today { 2020, 10, 14 }; // declare a variable of class DateClass
```


!!! tip "小贴士"

	在声明类的时候就要对其成员变量进行初始化。
	
## 成员函数

In addition to holding data, classes (and structs) can also contain functions! Functions defined inside of a class are called **member functions** (or sometimes **methods**). Member functions can be defined inside or outside of the class definition. We’ll define them inside the class for now (for simplicity), and show how to define them outside the class later.

Here is our Date class with a member function to print the date:

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



Just like members of a struct, members (variables and functions) of a class are accessed using the member selection operator (.):

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


This prints:

```
2020/10/16
```

Note how similar this program is to the struct version we wrote above.

However, there are a few differences. In the DateStruct version of print() from the example above, we needed to pass the struct itself to the print() function as the first parameter. Otherwise, print() wouldn’t know what DateStruct we wanted to use. We then had to reference this parameter inside the function explicitly.

Member functions work slightly differently: All member function calls must be associated with an object of the class. When we call “today.print()”, we’re telling the compiler to call the print() member function, associated with the today object.

Now let’s take a look at the definition of the print member function again:

```cpp
void print() // defines a member function named print()
{
    std::cout << m_year << '/' << m_month << '/' << m_day;
}
```

COPY

What do m_year, m_month, and m_day actually refer to? They refer to the associated object (as determined by the caller).

So when we call “today.print()”, the compiler interprets `m_day` as `today.m_day`, `m_month` as `today.m_month`, and `m_year` as `today.m_year`. If we called “tomorrow.print()”, `m_day` would refer to `tomorrow.m_day` instead.

In this way, the associated object is essentially implicitly passed to the member function. For this reason, it is often called **the implicit object**.

We’ll talk more about how the implicit object passing works in detail in a later lesson in this chapter.

The key point is that with non-member functions, we have to pass data to the function to work with. With member functions, we can assume we always have an implicit object of the class to work with!

Using the “m_” prefix for member variables helps distinguish member variables from function parameters or local variables inside member functions. This is useful for several reasons. First, when we see an assignment to a variable with the “m_” prefix, we know that we are changing the state of the class instance. Second, unlike function parameters or local variables, which are declared within the function, member variables are declared in the class definition. Consequently, if we want to know how a variable with the “m_” prefix is declared, we know that we should look in the class definition instead of within the function.

By convention, class names should begin with an upper-case letter.

!!! success "最佳实践"

	Name your classes starting with a capital letter.

Here’s another example of a class:

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

COPY

This produces the output:

Name: Alex  Id: 1  Wage: $25
Name: Joe  Id: 2  Wage: $22.25

With normal non-member functions, a function can’t call a function that’s defined “below” it (without a forward declaration):

```cpp
void x()
{
// You can't call y() from here unless the compiler has already seen a forward declaration for y()
}

void y()
{
}
```

COPY

With member functions, this limitation doesn’t apply:

```cpp
class foo
{
public:
     void x() { y(); } // okay to call y() here, even though y() isn't defined until later in this class
     void y() { };
};
```

COPY

## Member types

In addition to member variables and member functions, classes can have member types or nested types (including type aliases).

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

COPY

In such a context, the class name effectively acts like a namespace for the nested type. From inside the class, we only need reference `IDType`. From outside the class, we can access the type via `Employee::IDType`.

If we ever decide that an `int` no longer fulfills our needs and we want to use a `std::string` instead, we only need to update the type alias, rather than having to replace every occurrence of `int` with `std::string`.

Nested types cannot be forward declared. Generally, nested types should only be used when the nested type is used exclusively within that class. Note that since classes are types, it’s possible to nest classes inside other classes -- this is uncommon and is typically only done by advanced programmers.

## A note about structs in C++

In C, structs only have data members, not member functions. In C++, after designing classes (using the class keyword), Bjarne Stroustrup spent some amount of time considering whether structs (which were inherited from C) should be granted the ability to have member functions. Upon consideration, he determined that they should, in part to have a unified ruleset for both. So although we wrote the above programs using the class keyword, we could have used the struct keyword instead.

Many developers (including myself) feel this was the incorrect decision to be made, as it can lead to dangerous assumptions. For example, it’s fair to assume a class will clean up after itself (e.g. a class that allocates memory will deallocate it before being destroyed), but it’s not safe to assume a struct will. Consequently, we recommend using the struct keyword for data-only structures, and the class keyword for defining objects that require both data and functions to be bundled together.

!!! success "最佳实践"

	Use the struct keyword for data-only structures. Use the class keyword for objects that have both data and functions.

You have already been using classes without knowing it

It turns out that the C++ standard library is full of classes that have been created for your benefit. std::string, std::vector, and std::array are all class types! So when you create an object of any of these types, you’re instantiating a class object. And when you call a function using these objects, you’re calling a member function.

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

COPY

## Conclusion

The class keyword lets us create a custom type in C++ that can contain both member variables and member functions. Classes form the basis for Object-oriented programming, and we’ll spend the rest of this chapter and many of the future chapters exploring all they have to offer!