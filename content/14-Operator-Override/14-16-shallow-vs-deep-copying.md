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

> [!note] "Key Takeaway"


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


这一行代码看上去也人畜无害，但是它其实是问题的根源！这行代码在求值时，C++会使用默认的拷贝构造函数（因为我们没有提供自己的拷贝构造函数）。该拷贝构造函数会执行浅拷贝，将 `copy.m_data` 初始化为 `hello.m_data` 持有的地址。因此，`copy.m_data` 和 `hello.m_data` 指向一块相同的内存！


```cpp
} // copy 在此处销毁
```


当 `copy` [[going-out-of-scope|离开作用域]]时，`MyString` 的析构函数会被调用。析构函数会删除`copy.m_data` 和 `hello.m_data` 所指的那段内存！因此，当`copy`被删除时，其析构过程不可避免地影响了`hello`。变量 `copy` 随后就被销毁了，但是`hello.m_data` 仍然指向这块被删除的内存（非法内存）！

```cpp
std::cout << hello.getString() << '\n'; // 产生未定义行为
```

现在你能明白为什么程序会产生未定义行为了吧。我们已经删除了`hello`所指的字符串，然后又尝试打印这块内存的内容。

这个问题的根源是由拷贝构造函数执行的浅拷贝导致的——在√构造函数或重载赋值操作符中对指针值进行浅几乎总是会带来麻烦。


## 深拷贝

解决上述问题的办法是对任何非空指针进行深拷贝。[[deep-copy|深拷贝]]会首先为副本分配内存，然后再拷贝实际的值，这样一来副本持有的内存就和源内存不同了。副本和原本由于持有不同的内存，所以便不会互相影响。要执行拷贝构造函数，则必须编写我们自己的拷贝构造函数和重载赋值运算符。

以 `MyString` 为了，让我们看看如何进行深拷贝：

```cpp
// assumes m_data is initialized
void MyString::deepCopy(const MyString& source)
{
    // 首先应该释放当前存放的字符串
    delete[] m_data;

    // 因为 m_length 不是指针，所以浅拷贝即可
    m_length = source.m_length;

    // m_data 是指针，所以当它不是空指针是就必须进行深拷贝

    if (source.m_data)
    {
        // 为副本分配内存
        m_data = new char[m_length];

        // 拷贝
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

从上面的代码可以看出，深拷贝被浅拷贝要复杂不少！首先，我们必须原本含有字符串（11行）。如果有的话，则必须为副本分配足够的内存用于保存字符串的副本（14行）。最后，我们必须手动拷贝字符串（17行和18行）。

接下来，让我们重载赋值运算符：


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

注意，拷贝赋值运算符和拷贝构造函数非常类似，但是有三处明显的不同：

-  添加了一个自我复制检查；
-  返回 `*this` 指针一般能够链式调用赋值运算符；
-  必须显式地释放已经持有的字符串（避免`m_data`重新分配时导致内存泄漏） 。该操作是在`deepCopy`在完成的

当调用重载赋值操作符时，被赋值的项可能已经包含了以前的值，需要确保在为新值分配内存之前将其清除。对于非动态分配的变量(大小固定)，我们不必费心，因为新值只是覆盖旧值。但是，对于动态分配的变量，在分配新内存之前需要显式地释放旧内存。如果我们不这样做，代码不会崩溃但会造成内存泄漏——每次赋值都会吞噬可用的内存。


## 更好的解决方案

标准库中处理动态内存的类，如`std::string` 和`std::vector`，它们会管理自己所有的内存，并具有执行深拷贝的拷贝构造函数和赋值操作符。因此，你不必自己管理它们的内存，只需像普通基本变量一样初始化或分配它们！这使得这些类更容易使用，更不容易出错，而且你不必花时间编写自己的重载函数!


## 小结

- 默认拷贝构造函数和默认赋值操作符执行浅复制，这对于不包含动态分配变量的类来说没有问题；
- 具有动态分配变量的类需要有一个拷贝构造函数和赋值操作符来执行深拷贝；
- 最好使用标准库中的类，而不是自己进行内存管理。
