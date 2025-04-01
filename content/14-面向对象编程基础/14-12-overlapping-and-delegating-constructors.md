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

> [!note] "Key Takeaway"

- 分清楚初始化和赋值

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

> [!success] "最佳实践"
> 如果您有多个具有相同功能的构造函数，请使用委托构造函数以避免重复代码。

## 使用普通成员函数进行启动配置

因为构造函数只能用作初始化或委托，所以如果默认构造函数需要执行一些常见的初始化，就会很麻烦。考虑以下类:


```cpp
class Foo
{
private:
    const int m_value { 0 };

public:
    Foo()
    {
         // 用于任务启动配置的代码(例如打开文件或数据库)
    }

    Foo(int value) : m_value { value } // 必须初始化 const 成员 m_value
    {
        // 此时应该如何执行Foo()中的启动配置代码呢？
    }

};
```

构造函数 `Foo(int)` 要么初始化 `m_value`，要么委托给`Foo()`执行其中的代码，但鱼和熊掌不可兼得。但是如果一定要兼得呢？当然，最笨的的办法就是把需要执行的代码复制一份过来。但这无疑会带来很多重复代码，导致代码难以维护。

其实构造函数是可以调用非构造成员函数（和非成员函数）的，因此更好的办法是使用一个普通函数来执行这些代码，就像下面这样：

```cpp
#include <iostream>

class Foo
{
private:
    const int m_value { 0 };

    void setup() // 设为私有，只有构造函数能够时
    {
        // code to do some common setup tasks (e.g. open a file or database)
        std::cout << "Setting things up...\n";
    }

public:
    Foo()
    {
        setup();
    }

    Foo(int value) : m_value { value } // m_value 是 const 类型必须初始化
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

在这个例子中。我们定义 `setup()` 成员函数来执行启动配置相关的代码，类中的两个构造函数都可以调用它。我们将该函数定义为[[private-member|私有成员]]，所以只有这个类的成员可以访问它。

当然，`setup()` 并不是构造函数，所以它不能初始化成员。 当构造函数调用`setup()` 时，类成员们都已经被创建了（如果提供了初始化值则甚至已经完成了初始化）。`setup()` 函数只能为成员赋值或进行一些其他操作，但都只能通过一般的语句进行（例如打开文件或数据库）。`setup()` 函数不能创建成员的[[lvalue-reference|左值引用]]，也不能为 const 类型的成员赋值（两者都需要通过初始化完成），当然也不能向任何不支持赋值操作的成员赋值。

## 重置对象

有时候你可能会想要编写一个成员函数（例如 `reset()`）将类对象重置为其初始状态。

因为默认构造函数可以为类成员初始化所需的值，所以你可能会尝试在`reset()`函数中调用构造函数以达到目的。不过，直接调用构造函数通常会导致非预期的行为，就像之前展示的那样，它并不能正确的工作。

`reset()`函数的一般实现可能是这样的：


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

虽然这种实现可以工作，但是违反了DRY验证，因为“默认”值出现在了两个位置：非静态成员初始化和`reset()`函数体中。不过，也的确没有办法能够让`reset()`直接获取非静态成员初始化值。

但是，如果一个类是**可赋值的**（即可以访问其赋值操作符），我们可以先创建一个新的对象，然后将新对象赋值给老对象，实现重置。

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

在上面的例子中，我们首先创建了一个默认的 `Foo` 对象(包含默认初值)。然后我们将这个新 `Foo` 对象赋值给调用`reset()`成员函数的对象 (`*this`)。此时编译器会进行[[memberwise-copy|成员依次拷贝]]。

> [!info] "相关内容"
> 我们会在 [[15-1-the-hidden-this-pointer|13.10 - 隐藏的this指针]] 中介绍this指针，类对象的赋值则会在 [14.15 -- Overloading the assignment operator](https://www.learncpp.com/cpp-tutorial/overloading-the-assignment-operator/) 中进行介绍。