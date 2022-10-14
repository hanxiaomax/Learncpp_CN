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

在上一节课中，为了简化问题，我们在构造函数中使用赋值运算符对成员变量进行初始化。例如：

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
        // 都属于赋值，而不是初始化
        m_value1 = 1;
        m_value2 = 2.2;
        m_value3 = 'c';
    }
};
```

当构造函数执行时，`m_value1`，`m_value2` 和 `m_value3` 首先被创建。然后执行构造函数的函数体，对成员变量进行赋值。上面的过程和之前的非面向对象程序是非常类似：

```cpp
int m_value1 {};
double m_value2 {};
char m_value3 {};

m_value1 = 1;
m_value2 = 2.2;
m_value3 = 'c';
```

尽管合乎语法，但是上述代码并不具有良好的编程风格（而且效率相较于初始化是不佳的）。

不过，在前面的课程中我们提到过，有些类型的变量（例如const变量或[[lvalue-reference|引用]]）。考虑下面的例子：

```cpp
class Something
{
private:
    const int m_value;

public:
    Something()
    {
        m_value = 1; // 错误: const 变量不能被赋值
    }
};
```

上述代码等价于下面的代码：

```cpp
const int m_value; // error: const vars must be initialized with a value
m_value = 5; //  error: const vars can not be assigned to
```

在构造函数内部对 const 变量或引用赋值显然不是一个可行的办法。


## 成员初始化列表

为了解决这个问题，C++ 提供了一种对成员变量进行初始化（而不是在创建后赋值）的方法，即使用[[member-initializer-list|成员初始化列表]] 。请不要把成员初始化值列表和用于对数组进行赋值的初始化列表搞混。

在[[1-4-Variable-assignment-and-initialization|1.4 - 变量赋值和初始化]]中我们介绍过，初始化变量的方式有三种：[[copy-initialization|拷贝初始化]]、[[direct-initialization|直接初始化]]和[[uniform-initialization|统一初始化]]。

```cpp
int value1 = 1; // copy initialization
double value2(2.2); // direct initialization
char value3 {'c'}; // uniform initialization
```

使用初始化列表进行初始化基本上和[[direct-initialization|直接初始化]]或[[uniform-initialization|统一初始化]]是完全一致的。

举个例子就更容易理解了。还记得之前为变量赋值的构造函数吗？

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
        // 都是赋值，而不是初始化
        m_value1 = 1;
        m_value2 = 2.2;
        m_value3 = 'c';
    }
};
```

接下来，重写函数，使用成员初始化值列表来初始化：

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

输出结果：

```
Something(1, 2.2, c)
```

成员初始化值列表位于构造函数参数列表后，以冒号`:`开头，后面是一系列变量和它们的初始化值（使用逗号分隔）。

注意，函数体内不再需要对变量进行赋值，因为初始化的工作已经由成员初始化值列表完成。同时还需要注意的是，成员初始化值列表后面并没有分号。

当然，如果能够通过构造函数来传递初始化值则会更有用：

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
        : m_value1{ value1 }, m_value2{ value2 }, m_value3{ value3 } // 直接初始化成员变量
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
    Something something{ 1, 2.2 }; // value1 = 1, value2=2.2, value3 使用默认值 'c'
    something.print();
    return 0;
}
```

输出结果：

```
Something(1, 2.2, c)
```

注意，你可以使用默认形参来提供默认值，防止用户没有传递参数。

!!! success "最佳实践"

	使用成员初始化值列表对成员进行初始化而不是依次为其赋值。


## 初始化 const 类型成员变量

类可以包含 const 类型的成员变量。const 成员变量和一般的 const 变量没什么区别——它们都必须被初始化，初始化后 can contain const member variables. Const member variables act just like normal const variables -- they must be initialized, and then their values can’t be changed thereafter.

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

!!! note "法则"

	Const member variables must be initialized.

## 使用成员初始化列表初始化数组

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

## 初始化类类型的成员变量


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

## 初始化列表排版

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

## 初始化列表的顺序

Perhaps surprisingly, variables in the initializer list are not initialized in the order that they are specified in the initializer list. Instead, they are initialized in the order in which they are declared in the class.

For best results, the following recommendations should be observed:

1.  Don’t initialize member variables in such a way that they are dependent upon other member variables being initialized first (in other words, ensure your member variables will properly initialize even if the initialization ordering is different).
2.  Initialize variables in the initializer list in the same order in which they are declared in your class. This isn’t strictly required so long as the prior recommendation has been followed, but your compiler may give you a warning if you don’t do so and you have all warnings turned on.

## 小结

Member initializer lists allow us to initialize our members rather than assign values to them. This is the only way to initialize members that require values upon initialization, such as const or reference members, and it can be more performant than assigning values in the body of the constructor. Member initializer lists work both with fundamental types and members that are classes themselves.