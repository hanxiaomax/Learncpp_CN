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

While C++ provides a number of fundamental data types (e.g. char, int, long, float, double, etc…) that are often sufficient for solving relatively simple problems, it can be difficult to solve complex problems using just these types. One of C++’s more useful features is the ability to define your own data types that better correspond to the problem being solved. You have already seen how [[unscoped-enumerations|枚举类型]]and [structs](https://www.learncpp.com/cpp-tutorial/47-structs/) can be used to create your own custom data types.

Here is an example of a struct used to hold a date:

```cpp
struct DateStruct
{
    int year {};
    int month {};
    int day {};
};
```

COPY

Enumerated types and data-only structs (structs that only contain variables) represent the traditional non-object-oriented programming world, as they can only hold data. We can create and initialize this struct as follows:

```cpp
DateStruct today { 2020, 10, 14 }; // use uniform initialization
```

COPY

Now, if we want to print the date to the screen (something we probably want to do a lot), it makes sense to write a function to do this. Here’s a full program:

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
    DateStruct today { 2020, 10, 14 }; // use uniform initialization

    today.day = 16; // use member selection operator to select a member of the struct
    print(today);

    return 0;
}
```


This program prints:

```
2020/10/16
```

Classes

In the world of object-oriented programming, we often want our types to not only hold data, but provide functions that work with the data as well. In C++, this is typically done via the **class** keyword. The class keyword defines a new user-defined type called a class.

In C++, classes and structs are essentially the same. In fact, the following struct and class are effectively identical:

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

COPY

Note that the only significant difference is the _public:_ keyword in the class. We will discuss the function of this keyword in the next lesson.

Just like a struct declaration, a class declaration does not allocate any memory. It only defines what the class looks like.

!!! warning "注意"

	Just like with structs, one of the easiest mistakes to make in C++ is to forget the semicolon at the end of a class declaration. This will cause a compiler error on the _next_ line of code. Modern compilers like Visual Studio 2010 will give you an indication that you may have forgotten a semicolon, but older or less sophisticated compilers may not, which can make the actual error hard to find.

Class (and struct) definitions are like a blueprint -- they describe what the resulting object will look like, but they do not actually create the object. To actually create an object of the class, a variable of that class type must be defined:

```cpp
DateClass today { 2020, 10, 14 }; // declare a variable of class DateClass
```

COPY

!!! tip "小贴士"

	Initialize the member variables of a class at the point of declaration.

## Member Functions

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

COPY

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

COPY

This prints:

2020/10/16

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

Best practice

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

Member types

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

A note about structs in C++

In C, structs only have data members, not member functions. In C++, after designing classes (using the class keyword), Bjarne Stroustrup spent some amount of time considering whether structs (which were inherited from C) should be granted the ability to have member functions. Upon consideration, he determined that they should, in part to have a unified ruleset for both. So although we wrote the above programs using the class keyword, we could have used the struct keyword instead.

Many developers (including myself) feel this was the incorrect decision to be made, as it can lead to dangerous assumptions. For example, it’s fair to assume a class will clean up after itself (e.g. a class that allocates memory will deallocate it before being destroyed), but it’s not safe to assume a struct will. Consequently, we recommend using the struct keyword for data-only structures, and the class keyword for defining objects that require both data and functions to be bundled together.

Best practice

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

Conclusion

The class keyword lets us create a custom type in C++ that can contain both member variables and member functions. Classes form the basis for Object-oriented programming, and we’ll spend the rest of this chapter and many of the future chapters exploring all they have to offer!