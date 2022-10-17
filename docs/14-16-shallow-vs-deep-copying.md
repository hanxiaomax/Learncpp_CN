---
title: 14.16 - 浅拷贝和深拷贝
alias: 14.16 - 浅拷贝和深拷贝
origin: /shallow-vs-deep-copying/
origin_title: "14.16 — Shallow vs. deep copying"
time: 2022-7-27
type: translation
tags:
- shallow copy
- deep copy
---

??? note "关键点速记"
	
	-


## 浅拷贝

因为 C++ 并不了解你的类，所以默认的拷贝构造函数以及默认的赋值运算符会使用[[memberwise-copy|成员依次拷贝]]（也称为[[shallow-copy|浅拷贝]]）的方式信息拷贝。也就是说，C++ 会依次拷贝类的每一个成员（使用等号是调用赋值运算符、在使用拷贝构造时，使用直接初始化）。对于简单类（例如，不包含动态内存的类），这么做非常合适。

考虑下面的例子：

```cpp
#include <cassert>
#include <iostream>

class Fraction
{
private:
    int m_numerator { 0 };
    int m_denominator { 1 };

public:
    // Default constructor
    Fraction(int numerator = 0, int denominator = 1)
        : m_numerator{ numerator }
        , m_denominator{ denominator }
    {
        assert(denominator != 0);
    }

    friend std::ostream& operator<<(std::ostream& out, const Fraction& f1);
};

std::ostream& operator<<(std::ostream& out, const Fraction& f1)
{
	out << f1.m_numerator << '/' << f1.m_denominator;
	return out;
}
```

这里默认的拷贝构造函数和默认赋值运算符形式像下面这样：

```cpp
#include <cassert>
#include <iostream>

class Fraction
{
private:
    int m_numerator { 0 };
    int m_denominator { 1 };

public:
    // 默认构造函数
    Fraction(int numerator = 0, int denominator = 1)
        : m_numerator{ numerator }
        , m_denominator{ denominator }
    {
        assert(denominator != 0);
    }

    // 隐式拷贝构造函数的一种可能实现
    Fraction(const Fraction& f)
        : m_numerator{ f.m_numerator }
        , m_denominator{ f.m_denominator }
    {
    }

    // 隐式赋值运算符的一种可能实现
    Fraction& operator= (const Fraction& fraction)
    {
        // 避免自我赋值
        if (this == &fraction)
            return *this;

        // 拷贝
        m_numerator = fraction.m_numerator;
        m_denominator = fraction.m_denominator;

        // 返回对象本身，使操作符可以链式调用
        return *this;
    }

    friend std::ostream& operator<<(std::ostream& out, const Fraction& f1)
    {
	out << f1.m_numerator << '/' << f1.m_denominator;
	return out;
    }
};
```

注意，在这个例子中，因为默认版本的构造函数可以很好地完成拷贝，我们完全没有必要编写自己的版本。

但是，在设计持有动态内存的类时，浅拷贝会带来很多问题！因为浅拷贝在拷贝指针时，只是拷贝了指针的地址——它并没有分配新的地址或拷贝指针所指的内容。

请看下面的例子：
```cpp
#include <cstring> // for strlen()
#include <cassert> // for assert()

class MyString
{
private:
    char* m_data{};
    int m_length{};

public:
    MyString(const char* source = "" )
    {
        assert(source); // make sure source isn't a null string

        // Find the length of the string
        // Plus one character for a terminator
        m_length = std::strlen(source) + 1;

        // Allocate a buffer equal to this length
        m_data = new char[m_length];

        // Copy the parameter string into our internal buffer
        for (int i{ 0 }; i < m_length; ++i)
            m_data[i] = source[i];
    }

    ~MyString() // destructor
    {
        // We need to deallocate our string
        delete[] m_data;
    }

    char* getString() { return m_data; }
    int getLength() { return m_length; }
};
```

上面的例子中是一个简单的字符串类，它分配了一段内存用于保存传入的字符串。注意，我们并没有定义[[copy-constructors|拷贝构造函数]]或者重载赋值操作符。因此，C++会提供一个默认的拷贝构造函数和默认赋值运算符以便执行浅拷贝。其拷贝构造函数看上去应该是这样的：

```cpp
MyString::MyString(const MyString& source)
    : m_length { source.m_length }
    , m_data { source.m_data }
{
}
```


注意，`m_data` 只是`source.m_data`的一个浅拷贝指针，所以它们指向同一块内存。

现在， 考虑下面这段代码：

```cpp
#include <iostream>

int main()
{
    MyString hello{ "Hello, world!" };
    {
        MyString copy{ hello }; // 使用默认拷贝构造函数
    } // copy 是一个局部变量，在此处会销毁。所以其析构函数UI删除copy持有的字符串，所以hello此时持有一个悬垂指针

    std::cout << hello.getString() << '\n'; // 导致未定义行为

    return 0;
}
```

虽然这段代码看起来没啥问题，但它包含一个潜在的问题，将导致程序出现[[undefined-behavior|未定义行为]]！

让我们逐行分析这个例子:

```cpp
MyString hello{ "Hello, world!" };
```

这一行没什么问题。它调用 `MyString` 构造函数，分配一段内存，然后让 `hello.m_data` 指向它，然后拷贝字符串“Hello, world!” 到该内存。

```cpp
MyString copy{ hello }; // 使用默认拷贝构造函数
```


这一行代码看上去也人畜无害，但是它其实是问题的根源！这行代码在求值时，C++会使用默认的拷贝构造函数（因为我们没有提供自己的） line seems harmless enough as well, but it’s actually the source of our problem! When this line is evaluated, C++ will use the default copy constructor (because we haven’t provided our own). This copy constructor will do a shallow copy, initializing copy.m_data to the same address of hello.m_data. As a result, copy.m_data and hello.m_data are now both pointing to the same piece of memory!

```cpp
} // copy gets destroyed here
```

COPY

When copy goes out of scope, the MyString destructor is called on copy. The destructor deletes the dynamically allocated memory that both copy.m_data and hello.m_data are pointing to! Consequently, by deleting copy, we’ve also (inadvertently) affected hello. Variable copy then gets destroyed, but hello.m_data is left pointing to the deleted (invalid) memory!

```cpp
std::cout << hello.getString() << '\n'; // this will have undefined behavior
```

COPY

Now you can see why this program has undefined behavior. We deleted the string that hello was pointing to, and now we are trying to print the value of memory that is no longer allocated.

The root of this problem is the shallow copy done by the copy constructor -- doing a shallow copy on pointer values in a copy constructor or overloaded assignment operator is almost always asking for trouble.

**Deep copying**

One answer to this problem is to do a deep copy on any non-null pointers being copied. A **deep copy** allocates memory for the copy and then copies the actual value, so that the copy lives in distinct memory from the source. This way, the copy and source are distinct and will not affect each other in any way. Doing deep copies requires that we write our own copy constructors and overloaded assignment operators.

Let’s go ahead and show how this is done for our MyString class:

```cpp
// assumes m_data is initialized
void MyString::deepCopy(const MyString& source)
{
    // first we need to deallocate any value that this string is holding!
    delete[] m_data;

    // because m_length is not a pointer, we can shallow copy it
    m_length = source.m_length;

    // m_data is a pointer, so we need to deep copy it if it is non-null
    if (source.m_data)
    {
        // allocate memory for our copy
        m_data = new char[m_length];

        // do the copy
        for (int i{ 0 }; i < m_length; ++i)
            m_data[i] = source.m_data[i];
    }
    else
        m_data = nullptr;
}

// Copy constructor
MyString::MyString(const MyString& source)
{
    deepCopy(source);
}
```

COPY

As you can see, this is quite a bit more involved than a simple shallow copy! First, we have to check to make sure source even has a string (line 11). If it does, then we allocate enough memory to hold a copy of that string (line 14). Finally, we have to manually copy the string (lines 17 and 18).

Now let’s do the overloaded assignment operator. The overloaded assignment operator is slightly trickier:

```cpp
// Assignment operator
MyString& MyString::operator=(const MyString& source)
{
    // check for self-assignment
    if (this != &source)
    {
        // now do the deep copy
        deepCopy(source);
    }

    return *this;
}
```

COPY

Note that our assignment operator is very similar to our copy constructor, but there are three major differences:

-   We added a self-assignment check.
-   We return *this so we can chain the assignment operator.
-   We need to explicitly deallocate any value that the string is already holding (so we don’t have a memory leak when m_data is reallocated later). This is handled inside deepCopy().

When the overloaded assignment operator is called, the item being assigned to may already contain a previous value, which we need to make sure we clean up before we assign memory for new values. For non-dynamically allocated variables (which are a fixed size), we don’t have to bother because the new value just overwrites the old one. However, for dynamically allocated variables, we need to explicitly deallocate any old memory before we allocate any new memory. If we don’t, the code will not crash, but we will have a memory leak that will eat away our free memory every time we do an assignment!

**A better solution**

Classes in the standard library that deal with dynamic memory, such as std::string and std::vector, handle all of their memory management, and have overloaded copy constructors and assignment operators that do proper deep copying. So instead of doing your own memory management, you can just initialize or assign them like normal fundamental variables! That makes these classes simpler to use, less error-prone, and you don’t have to spend time writing your own overloaded functions!

**Summary**

-   The default copy constructor and default assignment operators do shallow copies, which is fine for classes that contain no dynamically allocated variables.
-   Classes with dynamically allocated variables need to have a copy constructor and assignment operator that do a deep copy.
-   Favor using classes in the standard library over doing your own memory management.