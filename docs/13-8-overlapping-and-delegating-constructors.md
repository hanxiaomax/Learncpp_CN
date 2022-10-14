---
title: 13.8 - 重叠和委托构造函数
alias: 13.8 - 重叠和委托构造函数
origin: /overlapping-and-delegating-constructors/
origin_title: "13.8 — Overlapping and delegating constructors"
time: 2022-9-16
type: translation
tags:
- overlapping
- delegating
- constructor
---

## 重叠构造函数

当实例化一个新对象时，将隐式调用该对象的构造函数。具有多个具有重叠功能的构造函数的类并不罕见。考虑以下类:


```cpp
class Foo
{
public:
    Foo()
    {
        // code to do A
    }

    Foo(int value)
    {
        // code to do A
        // code to do B
    }
};
```

这个类有两个构造函数：一个[[default-constructor|默认构造函数]]以及一个接受一个`int`类型参数的构造函数。因为 “code to do A” 这一部分在两个构造函数中都存在，则可以说它们在每个构造函数中是重复的。

课程学到这里，相比你已经了解到，要尽可能避免重复代码，所以让我们看看解决这个问题的一些方法。

## 显而易见的解决方案并不奏效

显而易见的解决方案是让`Foo(int)`构造函数调用`Foo()`构造函数来完成A部分工作。

```cpp
class Foo
{
public:
    Foo()
    {
        // code to do A
    }

    Foo(int value)
    {
        Foo(); // use the above constructor to do A (doesn't work)
        // code to do B
    }
};
```

不过，如果你像上面这样在一个构造函数里面调用另外一个构造函数的话，程序虽然可以编译（也许会产生告警），但是绝对不会像你想象的那样工作，然后你可能需要花费很多时间去定位问题。实际上，构造函数 `Foo();` 会实例化一个新的 `Foo` 对象。


## 构造函数委派

构造函数可以调用来自同一类的其他构造函数，称为[[delegating-constructors|委托构造函数]](或**构造函数链**)。

要让一个构造函数调用另一个构造函数，只需在成员初始化列表中调用它。这是可以直接调用另一个构造函数的一种情况。应用到我们上面的例子中：


```cpp
class Foo
{
private:

public:
    Foo()
    {
        // code to do A
    }

    Foo(int value): Foo{} // 调用 Foo() 默认构造函数完成A
    {
        // code to do B
    }

};
```

这完全符合您的预期。确保从成员初始化列表中调用构造函数，而不是在构造函数的函数体中调用。

下面是使用委托构造函数减少冗余代码的另一个例子：


```cpp
#include <iostream>
#include <string>
#include <string_view>

class Employee
{
private:
    int m_id{};
    std::string m_name{};

public:
    Employee(int id=0, std::string_view name=""):
        m_id{ id }, m_name{ name }
    {
        std::cout << "Employee " << m_name << " created.\n";
    }

    // Use a delegating constructor to minimize redundant code
    Employee(std::string_view name) : Employee{ 0, name }
    { }
};
```

这个类有两个构造函数，其中一个委托给`Employee(int, std::string_view)`。通过这种方式，冗余代码的数量被最小化了(我们只需要编写一个构造函数体而不是两个)。

关于委托构造函数的一些额外注意事项。首先，委托给另一个构造函数的构造函数本身不允许进行任何成员初始化。==构造函数可以委托或初始化，但不能同时委托和初始化。==

其次，如果一个构造函数委托给另一个构造函数，而另一个构造函数又委托回第一个构造函数。这将形成一个死循环，并将导致的程序耗尽堆栈空间后崩溃。可以通过确保所有构造函数解析为非委托构造函数来避免这种情况。

!!! success "最佳实践"

	If you have multiple constructors that have the same functionality, use delegating constructors to avoid duplicate code.

Using a normal member function for setup

Because a constructor can only initialize or delegate, this leads to a challenge if our default constructor does some common initialization. Consider the following class:

```cpp
class Foo
{
private:
    const int m_value { 0 };

public:
    Foo()
    {
         // code to do some common setup tasks (e.g. open a file or database)
    }

    Foo(int value) : m_value { value } // we must initialize m_value since it's const
    {
        // how do we get to the common initialization code in Foo()?
    }

};
```

COPY

Our `Foo(int)` constructor can either initialize `m_value`, or delegate to `Foo()` to access the setup code, but not both. But what if we need to do both? A bad solution would be to copy the setup code from our default constructor to each of our other constructors. But this will result in duplicate code, and a potential maintenance headache.

Constructors are allowed to call non-constructor member functions (and non-member functions), so a better solution is to use a normal (non-constructor) member function to handle the common setup tasks, like this:

```cpp
#include <iostream>

class Foo
{
private:
    const int m_value { 0 };

    void setup() // setup is private so it can only be used by our constructors
    {
        // code to do some common setup tasks (e.g. open a file or database)
        std::cout << "Setting things up...\n";
    }

public:
    Foo()
    {
        setup();
    }

    Foo(int value) : m_value { value } // we must initialize m_value since it's const
    {
        setup();
    }

};

int main()
{
    Foo a;
    Foo b{ 5 };

    return 0;
}
```

COPY

In this case, we’ve created a `setup()` member function to handle various setup tasks that we need, and both of our constructors call `setup()`. We’ve made this function private so we can ensure that only members of our class can call it.

Of course, `setup()` isn’t a constructor, so it can’t initialize members. By the time the constructor calls `setup()`, the members have already been created (and initialized if an initialization value was provided). The `setup()` function can only assign values to members or do other types of setup tasks that can be done through normal statements (e.g. open files or databases). The `setup()` function can’t do things like bind a member reference or set a const value (both of which must be done on initialization), or assign values to members that don’t support assignment.

Resetting a class object

Relatedly, you may find yourself in the situation where you want to write a member function (e.g. named `reset()`) to reset a class object back to the default state.

Because you probably already have a default constructor that initializes your members to the appropriate default values, you may be tempted to try to call the default constructor directly from `reset()`. However, trying to call a constructor directly will generally result in unexpected behavior as we have shown above, so that won’t work.

A mediocre implementation of a `reset()` function might look like this:

```cpp
#include <iostream>

class Foo
{
private:
    int m_a{ 1 };
    int m_b{ 2 };

public:
    Foo()
    {
    }

    Foo(int a, int b)
        : m_a{ a }, m_b{ b }
    {
    }

    void print()
    {
        std::cout << m_a << ' ' << m_b << '\n';
    }

    void reset()
    {
        m_a = 1;
        m_b = 2;
    }
};

int main()
{
    Foo a{ 3, 4 };
    a.reset();

    a.print();

    return 0;
}
```

COPY

While this works, it violates the DRY principle, as we have our “default” values in two places: once in the non-static member initializers, and again in the body of `reset()`. There is no way for the `reset()` function to get the default values from the non-static initializer.

However, if the class is assignable (meaning it has an accessible assignment operator), we can create a new class object, and then use assignment to overwrite the values in the object we want to reset:

```cpp
#include <iostream>

class Foo
{
private:
    int m_a{ 5 };
    int m_b{ 6 };


public:
    Foo()
    {
    }

    Foo(int a, int b)
        : m_a{ a }, m_b{ b }
    {
    }

    void print()
    {
        std::cout << m_a << ' ' << m_b << '\n';
    }

    void reset()
    {
        // consider this a bit of magic for now
        *this = Foo(); // create new Foo object, then use assignment to overwrite our implicit object
    }
};

int main()
{
    Foo a{ 1, 2 };
    a.reset();

    a.print();

    return 0;
}
```

COPY

In the above `reset()` function, we first create a default `Foo` object (which will have default values). Then we assign that default `Foo` object to the object that member function `reset()` was called on (`*this`). The compiler will do a memberwise copy.

Related content

We cover the `this` pointer in upcoming lesson [[13-10-the-hidden-this-pointer|13.10 - 隐藏的this指针]]，and assignment of classes in upcoming lesson [14.15 -- Overloading the assignment operator](https://www.learncpp.com/cpp-tutorial/overloading-the-assignment-operator/).