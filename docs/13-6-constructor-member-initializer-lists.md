---
title: 13.6 - 构造函数成员初始化列表
alias: 13.6 - 构造函数成员初始化列表
origin: /constructor-member-initializer-lists/
origin_title: "13.6 — Constructor member initializer lists"
time: 2022-9-16
type: translation
tags:
- constructors
- initialization
---

In the previous lesson, for simplicity, we initialized our class member data in the constructor using the assignment operator. For example:

```cpp
class Something
{
private:
    int m_value1 {};
    double m_value2 {};
    char m_value3 {};

public:
    Something()
    {
        // These are all assignments, not initializations
        m_value1 = 1;
        m_value2 = 2.2;
        m_value3 = 'c';
    }
};
```

COPY

When the class’s constructor is executed, m_value1, m_value2, and m_value3 are created. Then the body of the constructor is run, where the member data variables are assigned values. This is similar to the flow of the following code in non-object-oriented C++:

```cpp
int m_value1 {};
double m_value2 {};
char m_value3 {};

m_value1 = 1;
m_value2 = 2.2;
m_value3 = 'c';
```

COPY

While this is valid within the syntax of the C++ language, it does not exhibit good style (and may be less efficient than initialization).

However, as you have learned in previous lessons, some types of data (e.g. const and reference variables) must be initialized on the line they are declared. Consider the following example:

```cpp
class Something
{
private:
    const int m_value;

public:
    Something()
    {
        m_value = 1; // error: const vars can not be assigned to
    }
};
```

COPY

This produces code similar to the following:

```cpp
const int m_value; // error: const vars must be initialized with a value
m_value = 5; //  error: const vars can not be assigned to
```

COPY

Assigning values to const or reference member variables in the body of the constructor is clearly not possible in some cases.

Member initializer lists

To solve this problem, C++ provides a method for initializing class member variables (rather than assigning values to them after they are created) via a **member initializer list** (often called a “member initialization list”). Do not confuse these with the similarly named initializer list that we can use to assign values to arrays.

In lesson [1.4 -- Variable assignment and initialization](https://www.learncpp.com/cpp-tutorial/variable-assignment-and-initialization/), you learned that you could initialize variables in three ways: copy, direct, and via uniform initialization.

```cpp
int value1 = 1; // copy initialization
double value2(2.2); // direct initialization
char value3 {'c'}; // uniform initialization
```

COPY

Using an initialization list is almost identical to doing direct initialization or uniform initialization.

This is something that is best learned by example. Revisiting our code that does assignments in the constructor body:

```cpp
class Something
{
private:
    int m_value1 {};
    double m_value2 {};
    char m_value3 {};

public:
    Something()
    {
        // These are all assignments, not initializations
        m_value1 = 1;
        m_value2 = 2.2;
        m_value3 = 'c';
    }
};
```

COPY

Now let’s write the same code using an initialization list:

```cpp
#include <iostream>

class Something
{
private:
    int m_value1 {};
    double m_value2 {};
    char m_value3 {};

public:
    Something() : m_value1{ 1 }, m_value2{ 2.2 }, m_value3{ 'c' } // Initialize our member variables
    {
    // No need for assignment here
    }

    void print()
    {
         std::cout << "Something(" << m_value1 << ", " << m_value2 << ", " << m_value3 << ")\n";
    }
};

int main()
{
    Something something{};
    something.print();
    return 0;
}
```

COPY

This prints:

Something(1, 2.2, c)

The member initializer list is inserted after the constructor parameters. It begins with a colon (:), and then lists each variable to initialize along with the value for that variable separated by a comma.

Note that we no longer need to do the assignments in the constructor body, since the initializer list replaces that functionality. Also note that the initializer list does not end in a semicolon.

Of course, constructors are more useful when we allow the caller to pass in the initialization values:

```cpp
#include <iostream>

class Something
{
private:
    int m_value1 {};
    double m_value2 {};
    char m_value3 {};

public:
    Something(int value1, double value2, char value3='c')
        : m_value1{ value1 }, m_value2{ value2 }, m_value3{ value3 } // directly initialize our member variables
    {
    // No need for assignment here
    }

    void print()
    {
         std::cout << "Something(" << m_value1 << ", " << m_value2 << ", " << m_value3 << ")\n";
    }

};

int main()
{
    Something something{ 1, 2.2 }; // value1 = 1, value2=2.2, value3 gets default value 'c'
    something.print();
    return 0;
}
```

COPY

This prints:

Something(1, 2.2, c)

Note that you can use default parameters to provide a default value in case the user didn’t pass one in.

Best practice

Use member initializer lists to initialize your class member variables instead of assignment.

Initializing const member variables

Classes can contain const member variables. Const member variables act just like normal const variables -- they must be initialized, and then their values can’t be changed thereafter.

We can initialize a const member using the constructor member initialization list (just like a non-const member), and the initialization value can be either constant or non-constant.

Here’s an example of a class that has a const member variable. We use the constructor’s member initialization list to initialize the const member with the non-const value that the user entered.

```cpp
#include <iostream>

class Something
{
private:
	const int m_value;

public:
	Something(int x) : m_value{ x } // directly initialize our const member variable
	{
	}

	void print()
	{
		std::cout << "Something(" << m_value << ")\n";
	}
};

int main()
{
	std::cout << "Enter an integer: ";
	int x{};
	std::cin >> x;

	Something s{ x };
	s.print();

	return 0;
}
```

COPY

Here’s the output from one run of this program:

Enter an integer: 4
Something(4)

Rule

Const member variables must be initialized.

Initializing array members with member initializer lists

Consider a class with an array member:

```cpp
class Something
{
private:
    const int m_array[5];

};
```

COPY

Prior to C++11, you can only zero initialize an array member via a member initialization list:

```cpp
class Something
{
private:
    const int m_array[5];

public:
    Something(): m_array {} // zero initialize the member array
    {
    }

};
```

COPY

However, since C++11, you can fully initialize a member array using uniform initialization:

```cpp
class Something
{
private:
    const int m_array[5];

public:
    Something(): m_array { 1, 2, 3, 4, 5 } // use uniform initialization to initialize our member array
    {
    }

};
```

COPY

Initializing member variables that are classes

A member initialization list can also be used to initialize members that are classes.

```cpp
#include <iostream>

class A
{
public:
    A(int x = 0) { std::cout << "A " << x << '\n'; }
};

class B
{
private:
    A m_a {};
public:
    B(int y)
        : m_a{ y - 1 } // call A(int) constructor to initialize member m_a
    {
        std::cout << "B " << y << '\n';
    }
};

int main()
{
    B b{ 5 };
    return 0;
}
```

COPY

This prints:

A 4
B 5

When variable b is constructed, the B(int) constructor is called with value 5. Before the body of the constructor executes, m_a is initialized, calling the A(int) constructor with value 4. This prints “A 4”. Then control returns back to the B constructor, and the body of the B constructor executes, printing “B 5”.

Formatting your initializer lists

C++ gives you a lot of flexibility in how to format your initializer lists, and it’s really up to you how you’d like to proceed. But here are some recommendations:

If the initializer list fits on the same line as the function name, then it’s fine to put everything on one line:

```cpp
class Something
{
private:
    int m_value1 {};
    double m_value2 {};
    char m_value3 {};

public:
    Something() : m_value1{ 1 }, m_value2{ 2.2 }, m_value3{ 'c' } // everything on one line
    {
    }
};
```

COPY

If the initializer list doesn’t fit on the same line as the function name, then it should go indented on the next line.

```cpp
class Something
{
private:
    int m_value1;
    double m_value2;
    char m_value3;

public:
    Something(int value1, double value2, char value3='c') // this line already has a lot of stuff on it
        : m_value1{ value1 }, m_value2{ value2 }, m_value3{ value3 } // so we can put everything indented on next line
    {
    }

};
```

COPY

If all of the initializers don’t fit on a single line (or the initializers are non-trivial), then you can space them out, one per line:

```cpp
class Something
{
private:
    int m_value1 {};
    double m_value2 {};
    char m_value3 {};
    float m_value4 {};

public:
    Something(int value1, double value2, char value3='c', float value4=34.6f) // this line already has a lot of stuff on it
        : m_value1{ value1 } // one per line
        , m_value2{ value2 }
        , m_value3{ value3 }
        , m_value4{ value4 }
    {
    }

};
```

COPY

Initializer list order

Perhaps surprisingly, variables in the initializer list are not initialized in the order that they are specified in the initializer list. Instead, they are initialized in the order in which they are declared in the class.

For best results, the following recommendations should be observed:

1.  Don’t initialize member variables in such a way that they are dependent upon other member variables being initialized first (in other words, ensure your member variables will properly initialize even if the initialization ordering is different).
2.  Initialize variables in the initializer list in the same order in which they are declared in your class. This isn’t strictly required so long as the prior recommendation has been followed, but your compiler may give you a warning if you don’t do so and you have all warnings turned on.

Summary

Member initializer lists allow us to initialize our members rather than assign values to them. This is the only way to initialize members that require values upon initialization, such as const or reference members, and it can be more performant than assigning values in the body of the constructor. Member initializer lists work both with fundamental types and members that are classes themselves.