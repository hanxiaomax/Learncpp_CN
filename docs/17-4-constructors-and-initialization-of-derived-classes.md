---
title: 17.4 - 派生类的构造和初始化
alias: 17.4 - 派生类的构造和初始化
origin: /constructors-and-initialization-of-derived-classes/
origin_title: "17.4 — Constructors and initialization of derived classes"
time: 2020-12-21
type: translation
tags:
- inheritance
---

??? note "关键点速记"
	
	-


在前面两节课中，我们探讨了C++中继承的一些基础知识以及派生类初始化的顺序。本节课，我们将进一步了解构造函数在派生类初始化中的作用。为此，我们将继续使用上一课中开发的`Base`和`Derived`类：


```cpp
class Base
{
public:
    int m_id {};

    Base(int id=0)
        : m_id{ id }
    {
    }

    int getId() const { return m_id; }
};

class Derived: public Base
{
public:
    double m_cost {};

    Derived(double cost=0.0)
        : m_cost{ cost }
    {
    }

    double getCost() const { return m_cost; }
};
```

对于非派生类来说，构造函数只需要关心它自己的成员即可。例如，对于`Base`类，我们可以像这样创建一个对象：

```cpp
int main()
{
    Base base{ 5 }; // use Base(int) constructor

    return 0;
}
```


下面是实例化base时实际发生的情况：

1.  为 `base` 分配内存；
2.  调用合适的构造函数；
3.  使用[[member-initializer-list|成员初始化值列表]]来初始化变量；
4.  构造函数执行其函数体内语句；
5.  控制权返还给调用者。

很简单。

对于派生类，事情稍微复杂一些：

```cpp
int main()
{
    Derived derived{ 1.3 }; // use Derived(double) constructor

    return 0;
}
```


在派生类实例化时会有如下步骤：

1.  分配内存(满足 `Base` 和 `Derived` 的需要)；
2.  调用 `Derived` 的构造函数；
3.  `Base` 对象会使用合适的`Base`构造函数首先初始化。如果没有指定构造函数，则调用默认构造函数；
4.  使用[[member-initializer-list|成员初始化值列表]]初始化变量；
5.  构造函数执行其函数体内语句；
5.  控制权返还给调用者。

两个例子中的不同之处在于，在 `Derived` 的构造函数可以做任何事之前，`Base`的构造函数首先会被调用，它会初始化该对象的`Base`部分，然后将控制权返还给 `Derived` 构造函数，然后 `Derived` 才能去完成它自己的工作。

## 初始化基类成员

我们所编写的派生类目前的缺点之一是，在创建派生对象时没有办法初始化 `m_id`。如果我们想在创建派生对象时同时设置 `m_cost` (来自对象的`Derived`部分)和 `m_id` (来自对象的`Base`部分)，该怎么办?

新手程序员会尝试这么做：

```cpp
class Derived: public Base
{
public:
    double m_cost {};

    Derived(double cost=0.0, int id=0)
        // does not work
        : m_cost{ cost }
        , m_id{ id }
    {
    }

    double getCost() const { return m_cost; }
};
```


想法很好但并不完全正确。我们的确需要为构造函数添加额外的参数，否则C++无从知晓我们希望用什么值来初始化`m_id`。

但是，C++不允许我们在成员初始化列表中的初始化继承来的成员变量。换句话说，成员变量的值只能在它所属类的构造函数的成员初始化列表中设置。

为什么C++要这样做？答案与const变量和引用变量有关。考虑一下如果`m_id`是`const`会发生什么。因为const变量必须在创建时用一个值初始化，所以基类构造函数必须在创建变量时设置它的值。但是，当基类构造函数完成时，将执行派生类构造函数的成员初始化列表。然后每个派生类都有机会初始化该变量，可能会改变它的值!通过将变量的初始化限制在这些变量所属类的构造函数中，C++需要确保所有变量只初始化一次。

最终的结果是上面的示例不起作用，因为`m_id`是从`Base`继承的，并且只有非继承的变量可以在成员初始化器列表中初始化。

但是，继承的变量仍然可以在构造函数体中使用赋值操作更改其值。因此，新程序员通常也会这样做:

```cpp
class Derived: public Base
{
public:
    double m_cost {};

    Derived(double cost=0.0, int id=0)
        : m_cost{ cost }
    {
        m_id = id;
    }

    double getCost() const { return m_cost; }
};
```


虽然这在本例中实际上是可行的，但如果`m_id`是`const`或引用，则不可行(因为`const`值和引用必须在构造函数的成员初始化列表中初始化)。它的效率也很低，因为`m_id`被分配了两次值：一次是在基类构造函数的成员初始化列表中，然后是在派生类构造函数的主体中。最后，如果基类在构造过程中需要访问这个值怎么办？它没有办法访问它，因为它是在执行`Derived`构造函数之前才设置的(这基本上是在最后执行)。


那么，我们应该如何子创建`Derived`类对象时正确初始化 `m_id` 呢？

在上面的这些例子中，当我们初始化 `Derived` 类的对象时，`Base` 类的部分都是通过它的默认构造函数来创建的。为什么它总是会调用默认构造函数呢？因为我们没有让他不要这么做啊！

所幸，C++ 允许我们显式地指定创建`Base`类时应该使用的构造函数！我们只需要在派生类的[[member-initializer-list|成员初始化值列表]]中调用所需的`Base`的构造函数就可以了：

```cpp
class Derived: public Base
{
public:
    double m_cost {};

    Derived(double cost=0.0, int id=0)
        : Base{ id } // Call Base(int) constructor with value id!
        , m_cost{ cost }
    {
    }

    double getCost() const { return m_cost; }
};
```

再次执行代码：

```cpp
#include <iostream>

int main()
{
    Derived derived{ 1.3, 5 }; // use Derived(double, int) constructor
    std::cout << "Id: " << derived.getId() << '\n';
    std::cout << "Cost: " << derived.getCost() << '\n';

    return 0;
}
```


基类的构造函数 `Base(int)` 将会被用来初始化成员`m_id`（5）然后派生类的构造函数会被用来初始化 `m_cost` 到 `1.3`！

因此，程序会打印：

```
Id: 5
Cost: 1.3
```

In more detail, here’s what happens:

1.  Memory for derived is allocated.
2.  The Derived(double, int) constructor is called, where cost = 1.3, and id = 5.
3.  The compiler looks to see if we’ve asked for a particular Base class constructor. We have! So it calls Base(int) with id = 5.
4.  The base class constructor member initializer list sets m_id to 5.
5.  The base class constructor body executes, which does nothing.
6.  The base class constructor returns.
7.  The derived class constructor member initializer list sets m_cost to 1.3.
8.  The derived class constructor body executes, which does nothing.
9.  The derived class constructor returns.

This may seem somewhat complex, but it’s actually very simple. All that’s happening is that the Derived constructor is calling a specific Base constructor to initialize the Base portion of the object. Because m_id lives in the Base portion of the object, the Base constructor is the only constructor that can initialize that value.

Note that it doesn’t matter where in the Derived constructor member initializer list the Base constructor is called -- it will always execute first.

## Now we can make our members private**

Now that you know how to initialize base class members, there’s no need to keep our member variables public. We make our member variables private again, as they should be.

As a quick refresher, public members can be accessed by anybody. Private members can only be accessed by member functions of the same class. Note that this means derived classes can not access private members of the base class directly! Derived classes will need to use access functions to access private members of the base class.

Consider:

```cpp
#include <iostream>

class Base
{
private: // our member is now private
    int m_id {};

public:
    Base(int id=0)
        : m_id{ id }
    {
    }

    int getId() const { return m_id; }
};

class Derived: public Base
{
private: // our member is now private
    double m_cost;

public:
    Derived(double cost=0.0, int id=0)
        : Base{ id } // Call Base(int) constructor with value id!
        , m_cost{ cost }
    {
    }

    double getCost() const { return m_cost; }
};

int main()
{
    Derived derived{ 1.3, 5 }; // use Derived(double, int) constructor
    std::cout << "Id: " << derived.getId() << '\n';
    std::cout << "Cost: " << derived.getCost() << '\n';

    return 0;
}
```

COPY

In the above code, we made m_id and m_cost private. This is fine, since we use the relevant constructors to initialize them, and use a public accessor to get the values.

This prints, as expected:

```
Id: 5
Cost: 1.3
```

We’ll talk more about access specifiers in the next lesson.

## Another example

Let’s take a look at another pair of classes we’ve previously worked with:

```cpp
#include <string>
#include <string_view>

class Person
{
public:
    std::string m_name;
    int m_age {};

    Person(const std::string_view name = "", int age = 0)
        : m_name{ name }, m_age{ age }
    {
    }

    const std::string& getName() const { return m_name; }
    int getAge() const { return m_age; }
};

// BaseballPlayer publicly inheriting Person
class BaseballPlayer : public Person
{
public:
    double m_battingAverage {};
    int m_homeRuns {};

    BaseballPlayer(double battingAverage = 0.0, int homeRuns = 0)
       : m_battingAverage{ battingAverage },
         m_homeRuns{ homeRuns }
    {
    }
};
```

COPY

As we’d previously written it, BaseballPlayer only initializes its own members and does not specify a Person constructor to use. This means every BaseballPlayer we create is going to use the default Person constructor, which will initialize the name to blank and age to 0. Because it makes sense to give our BaseballPlayer a name and age when we create them, we should modify this constructor to add those parameters.

Here’s our updated classes that use private members, with the BaseballPlayer class calling the appropriate Person constructor to initialize the inherited Person member variables:

```cpp
#include <iostream>
#include <string>
#include <string_view>

class Person
{
private:
    std::string m_name;
    int m_age {};

public:
    Person(const std::string_view name = "", int age = 0)
        : m_name{ name }, m_age{ age }
    {
    }

    const std::string& getName() const { return m_name; }
    int getAge() const { return m_age; }

};
// BaseballPlayer publicly inheriting Person
class BaseballPlayer : public Person
{
private:
    double m_battingAverage {};
    int m_homeRuns {};

public:
    BaseballPlayer(const std::string_view name = "", int age = 0,
        double battingAverage = 0.0, int homeRuns = 0)
        : Person{ name, age } // call Person(const std::string_view, int) to initialize these fields
        , m_battingAverage{ battingAverage }, m_homeRuns{ homeRuns }
    {
    }

    double getBattingAverage() const { return m_battingAverage; }
    int getHomeRuns() const { return m_homeRuns; }
};
```

COPY

Now we can create baseball players like this:

```cpp
#include <iostream>

int main()
{
    BaseballPlayer pedro{ "Pedro Cerrano", 32, 0.342, 42 };

    std::cout << pedro.getName() << '\n';
    std::cout << pedro.getAge() << '\n';
    std::cout << pedro.getBattingAverage() << '\n';
    std::cout << pedro.getHomeRuns() << '\n';

    return 0;
}
```

COPY

This outputs:

```
Pedro Cerrano
32
0.342
42
```

As you can see, the name and age from the base class were properly initialized, as was the number of home runs and batting average from the derived class.

## 继承链

Classes in an inheritance chain work in exactly the same way.

```cpp
#include <iostream>

class A
{
public:
    A(int a)
    {
        std::cout << "A: " << a << '\n';
    }
};

class B: public A
{
public:
    B(int a, double b)
    : A{ a }
    {
        std::cout << "B: " << b << '\n';
    }
};

class C: public B
{
public:
    C(int a, double b, char c)
    : B{ a, b }
    {
        std::cout << "C: " << c << '\n';
    }
};

int main()
{
    C c{ 5, 4.3, 'R' };

    return 0;
}
```

COPY

In this example, class C is derived from class B, which is derived from class A. So what happens when we instantiate an object of class C?

First, main() calls C(int, double, char). The C constructor calls B(int, double). The B constructor calls A(int). Because A does not inherit from anybody, this is the first class we’ll construct. A is constructed, prints the value 5, and returns control to B. B is constructed, prints the value 4.3, and returns control to C. C is constructed, prints the value ‘R’, and returns control to main(). And we’re done!

Thus, this program prints:

```
A: 5
B: 4.3
C: R
```

It is worth mentioning that constructors can only call constructors from their immediate parent/base class. Consequently, the C constructor could not call or pass parameters to the A constructor directly. The C constructor can only call the B constructor (which has the responsibility of calling the A constructor).

## 析构函数

When a derived class is destroyed, each destructor is called in the _reverse_ order of construction. In the above example, when c is destroyed, the C destructor is called first, then the B destructor, then the A destructor.

## 小结

When constructing a derived class, the derived class constructor is responsible for determining which base class constructor is called. If no base class constructor is specified, the default base class constructor will be used. In that case, if no default base class constructor can be found (or created by default), the compiler will display an error. The classes are then constructed in order from most base to most derived.

At this point, you now understand enough about C++ inheritance to create your own inherited classes!