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

具体来说：

1.  内存分配；
2.  构造函数 `Derived(double, int)` 被调用，`cost = 1.3`， `id = 5`。
3.  编译器查看你是否指定了`Base`类的构造函数。这里我们指定了，所以它会调用 `Base(int)` 且 `id = 5`。
4.  基类构造函数的成员初始化值列表将`m_id`设置为5；
5.  基类构造函数的函数体执行，什么都没做；
6.  基类构造函数返回；
7.  派生类构造函数的成员初始化值列表将 `m_cost` 设置为 1.3；
8.  派生类构造函数的函数体执行，什么都没做；
9.  派生类构造函数返回。

看起来有点复杂，但实际上非常简单。所发生的一切就是`Derived`构造函数调用指定的`Base`构造函数来初始化对象的`Base`部分。因为`m_id`位于对象的`Base`部分，所以`Base`构造函数是唯一可以初始化该值的构造函数。

注意，Base构造函数在`Derived`构造函数成员初始化列表中的什么位置被调用并不重要——它总是首先执行。

## 将成员设为私有

既然已经知道了如何初始化基类成员，就没有必要将成员变量保持为`public`。我们再次将成员变量设为私有，因为它们应该是私有的。

快速回顾一下，公共成员可以被任何人访问。私有成员只能由同一类的成员函数访问。注意，==这意味着派生类不能直接访问基类的私有成员==！派生类将需要使用访问函数来访问基类的私有成员。

考虑下面代码：

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


在上面的例子中，我们将 `m_id` 和 `m_cost` 设为私有。这么做完全没有问题，因为我们可以使用相关的构造函数初始化这些成员，并通过公有的[[access-function|成员访问函数]]来访问它们。


打印结果如我们所想的那样：

```
Id: 5
Cost: 1.3
```

我们将在下一课中更多地讨论访问说明符。

## 另外一个例子

再看看之前我们使用过的一个例子：

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


在之前的例子中， `BaseballPlayer` 只会初始化它自己的成员，也并没有指定 `Person` 的构造函数。这意味着 `BaseballPlayer` 在创建时，调用的都是 `Person` 的默认构造函数，它会将名字初始化为空白并将年龄初始化为0。因为，因为在创建`BaseballPlayer`时给它们一个名称和年龄是有意义的，所以我们应该修改这个构造函数来添加这些参数。

更新代码，让类使用私有成员，同时让 `BaseballPlayer` 类调用适当的 `Person` 构造函数来初始化继承的 `Person` 成员变量：

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
// BaseballPlayer 公开继承 Person
class BaseballPlayer : public Person
{
private:
    double m_battingAverage {};
    int m_homeRuns {};

public:
    BaseballPlayer(const std::string_view name = "", int age = 0,
        double battingAverage = 0.0, int homeRuns = 0)
        : Person{ name, age } // 调用 Person(const std::string_view, int) 来初始化相应的成员
        , m_battingAverage{ battingAverage }, m_homeRuns{ homeRuns }
    {
    }

    double getBattingAverage() const { return m_battingAverage; }
    int getHomeRuns() const { return m_homeRuns; }
};
```

现在，像下面这样创建一个对象：

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

程序运行结果：

```
Pedro Cerrano
32
0.342
42
```

可以看到，基类的名称和年龄已正确初始化，派生类的本垒打数和击球率也已初始化。


## 继承链

继承链中的类以完全相同的方式工作。

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

在这个例子中，类C是由类B派生而来的，而类B又是由类A派生而来的。那么当我们实例化类C的对象时会发生什么呢?

首先 `main()` 会调用 `C(int, double, char)`。C 的构造函数会调用 `B(int, double)`。B的构造函数调用`A(int)`。因为A没有继承任何类，所以它会被第一个构造。A 被构造后打印了 5，然后控制权返回给B。B被构造时打印值 4.3，然后返回控制权给C。C被构造时打印‘R’，然后将控制权返回给 `main()`。构造结束！

因此程序打印结果如下：

```
A: 5
B: 4.3
C: R
```

值得一提的是，构造函数只能调用**直接**父类（基类）中的构造函数。因此，C构造函数不能直接调用或将参数传递给A构造函数。C构造函数只能调用B构造函数(B构造函数负责调用A构造函数)。


## 析构函数

当派生类被销毁时，每个析构函数将按构造的**逆顺序调用**。在上面的例子中，当C被销毁时，首先调用C析构函数，然后是B析构函数，然后是A析构函数。


## 小结

在构造派生类时，派生类构造函数负责确定调用哪个基类构造函数。如果没有指定基类构造函数，将使用默认基类构造函数。在这种情况下，如果找不到缺省基类构造函数(或缺省创建基类构造函数)，编译器将报错。然后按照从最基类到最派生类的顺序构造类。

至此，您已经足够了解C++继承，可以创建自己的继承类了!