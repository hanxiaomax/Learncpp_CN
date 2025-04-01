---
title: 13.5 - 构造函数
alias: 13.5 - 构造函数
origin: /constructors/
origin_title: "13.5 — Constructors"
time: 2022-9-16
type: translation
tags:
- constructors
---


如果一个类或者结构体的成员都是[[public-member|公有成员]]，则可以使用[[aggregate-initialization|聚合初始化]]，通过[[list-initialization|列表初始化]]对类进行初始化：

```cpp
class Foo
{
public:
    int m_x {};
    int m_y {};
};

int main()
{
    Foo foo { 6, 7 }; // list-initialization

    return 0;
}
```

但是，一旦将其中的任何成员变量设为[[private-member|私有成员]]，就不能再能够以这种方式初始化类了。道理很简单：如果你不能直接访问一个变量(因为它是私有的)，你就不应被允许直接初始化它。

那么，应该如何初始化包含私有成员的类呢？答案是通过构造函数。

## 构造函数

[[constructor|构造函数]] 是一类特殊的函数，它会在对象创建时被自动调用。构造函数通常用于使用用户提供值来初始化类的成员变量，或者用于为对象的使用做好相应的准备工作（例如：打开文件或数据库）。
 
构造函数执行后，对象应该处于一种被良好定义、可以使用的状态。

和普通的成员函数不同，构造函数的命名必须遵循以下原则：

1. 构造函数的名字必须和类名完全一致（包括大小写）；
2. 构造函数不返回任何类型（甚至不返回 `void` ） 

## 默认构造函数和默认初始化


不接受任何参数（或所有参数都有默认值）的构造函数称为[[default-constructor|默认构造函数]]。当用户初始化对象时不提供任何参数时，默认构造函数就会被调用。

下面例子中的类具有一个默认构造函数：

```cpp
#include <iostream>

class Fraction
{
private:
    int m_numerator {};
    int m_denominator {};

public:
    Fraction() // default constructor
    {
        m_numerator = 0;
        m_denominator = 1;
    }

    int getNumerator() { return m_numerator; }
    int getDenominator() { return m_denominator; }
    double getValue() { return static_cast<double>(m_numerator) / m_denominator; }
};

int main()
{
    Fraction frac{}; // calls Fraction() default constructor
    std::cout << frac.getNumerator() << '/' << frac.getDenominator() << '\n';

    return 0;
}
```

Fraction 类用于表示一个分数（通过分子和分母），同时我们定义了一个名为 Fraction 的默认构造函数（与函数同名）。

当 `Fraction frac{};` 执行时，编译器得知我们想要初始化一个 `Fraction` 类型的对象（不提供任何参数）。然后，对象 `frac` 的初始化就开始了，默认构造函数也会在此时被调用。这个过程被称为默认初始化（尽管不严谨）。默认构造函数运行时和普通函数一样（此处即将0赋值给 `m_numerator`，将 `m_denominator` 赋值为1 ）

程序运行结果为：

```
0/1
```

## 值初始化

在上面的程序中，我们使用[[value-initialization|值初始化]]的方式初始化对象：

```cpp
Fraction frac {}; // Value initialization using empty set of braces
```


我们也可以使用[[default-initialization|默认初始化]]来实现：

```cpp
Fraction frac; // Default-initialization, calls default constructor
```


使用默认初始化和值初始化来初始化一个对象，其结果是一致的：即默认构造函数被调用。

比起值初始化，很多程序员更倾向于使用默认初始化。这是因为在使用值初始化时，编译器可能会首先将类成员初始化为0，然后才调用默认构造函数，从效率的角度来讲更低效一些。

不过，使用默认初始也有不好的地方：你必须知道类是否对会初始化自身。例如，该类的所有成员是不是都具有初始化值，或者是否存在能够对所有成员进行初始化的默认构造函数。 如果你已经知道有个别变量不具有初始化值，那你就要慎重考虑，此时使用默认初始化是否会带来问题。

例如，下面代码会导致[[undefined-behavior|未定义行为]]。

```cpp
#include <iostream>

class Fraction
{
private:
    // Removed initializers
    int m_numerator;
    int m_denominator;

public:
    // Removed default-constructor

    int getNumerator() { return m_numerator; }
    int getDenominator() { return m_denominator; }
    double getValue() { return static_cast<double>(m_numerator) / m_denominator; }
};

int main()
{
    Fraction frac;
    // frac is uninitialized, accessing its members causes undefined behavior
    std::cout << frac.getNumerator() << '/' << frac.getDenominator() << '\n';

    return 0;
}
```

虽然这个类的确初始化了类中的所有成员，但要确保项目代码中的所有类都这样做了是很困难的。

优先对类对象进行值初始化是简单、一致的，并且可以帮助您捕获错误，特别是在学习时。


> [!success] "最佳实践"
> 初始化对象时，推荐使用值初始化而非默认初始化
	
## 使用带参数的函数进行直接初始化和列表初始化

尽管默认构造函数可以帮我们确保类成员具有合理的初值，但是更多时候我们还是会需要在[[instantiated|实例化]]时指定一些特殊的值。幸运的是，构造函数是可以被声明为允许接受参数的形式的。下面例子中的构造函数接受两个整型参数分别用于对分子分母进行初始化：


```cpp
#include <cassert>

class Fraction
{
private:
    int m_numerator {};
    int m_denominator {};

public:
    Fraction() // default constructor
    {
         m_numerator = 0;
         m_denominator = 1;
    }

    // Constructor with two parameters, one parameter having a default value
    Fraction(int numerator, int denominator=1)
    {
        assert(denominator != 0);
        m_numerator = numerator;
        m_denominator = denominator;
    }

    int getNumerator() { return m_numerator; }
    int getDenominator() { return m_denominator; }
    double getValue() { return static_cast<double>(m_numerator) / m_denominator; }
};
```


注意，我们现在有两个构造函数：一个默认构造函数（默认情况下调用），另一个构造函数接受两个形参。C++支持[[overload|重载]]，所以这两个构造函数可以在和平共处。事实上，您可以根据需要定义任意数量的构造函数，只要每个构造函数具有惟一的签名(形参的数量和类型)即可。

那么，我们应该如何调用这个具有参数的构造函数呢？很简单，使用[[list-initialization|列表初始化]]即可：

```cpp
Fraction fiveThirds{ 5, 3 }; // 列表初始化，调用 Fraction(int, int)
Fraction threeQuarters(3, 4); // 直接初始化，也是调用 Fraction(int, int)
```

一如既往地，==我们更推荐列表初始化。在后面的教程中，我们也会遇到需要使用直接初始化的情况(模板和`std::initializer_list`)。还有另外一种特殊的构造函数会使用括号初始化（列表初始化）做一些不同的事情，在这种情况下，我们必须使用直接初始化。==

注意，由于构造函数的第二个[[parameters|形参]]具有默认值，所以下面的调用方式也是合法的:

```cpp
Fraction six{ 6 }; // 调用 Fraction(int, int) 构造函数，第二个形参会使用默认值1。
```

构造函数的默认参数和普通函数的默认参数没有什么区别，所以当我们调用 `six{ 6 }` 时，`Fraction(int, int)` 函数会自动使用1作为第二个形参的值。

> [!success] "最佳实践"
> 推荐使用大括号初始化来初始类对象。

## 使用等于号进行拷贝初始化

就像基本变量一样，也可以使用[[copy-initialization|拷贝初始化]]来初始化类：

```cpp
Fraction six = Fraction{ 6 }; // Copy initialize a Fraction, will call Fraction(6, 1)
Fraction seven = 7; // Copy initialize a Fraction.  The compiler will try to find a way to convert 7 to a Fraction, which will invoke the Fraction(7, 1) constructor.
```

不过，最好不要使用这种方式来初始化类，它可能是低效的。尽管[[direct-initialization|直接初始化]]、[[list-initialization|列表初始化]]和[[copy-initialization|拷贝初始化]]在初始化基本数据类型时的行为是一样的，但是拷贝初始化在配合类类型使用时其行为是不同的（尽管结果相同）。我们会在后面的章节中进行更为详细的介绍。

## 减少构造函数的数量

像上面那样为 `Fraction` 声明两个构造函数是多余的，我们可以这么做：

```cpp
#include <cassert>

class Fraction
{
private:
    int m_numerator {};
    int m_denominator {};

public:
    // Default constructor
    Fraction(int numerator=0, int denominator=1)
    {
        assert(denominator != 0);

        m_numerator = numerator;
        m_denominator = denominator;
    }

    int getNumerator() { return m_numerator; }
    int getDenominator() { return m_denominator; }
    double getValue() { return static_cast<double>(m_numerator) / m_denominator; }
};
```

尽管这个构造函数仍然是默认构造函数，但是它现在也可以在需要时基于用户提供的参数进行初始化。

```cpp
Fraction zero; // will call Fraction(0, 1)
Fraction zero{}; // will call Fraction(0, 1)
Fraction six{ 6 }; // will call Fraction(6, 1)
Fraction fiveThirds{ 5, 3 }; // will call Fraction(5, 3)
```

在实现构造函数时，要考虑如何通过默认值来减少构造函数的数量。

## 关于默认参数的注意事项

定义和调用具有默认参数函数的规则 (参见：[[11-5-Default-arguments|8.12 - 默认参数]]) 同样也适用于构造函数。简单复习一下，在定义具有默认参数的构造函数时，默认参数必须在非默认参数的后面。也就是说，非默认参数不能被定义在默认参数后。

对于具有多个默认参数，且参数类型不同的构造函数，使用不当会带来出乎意料的错误。考虑下面代码：

```cpp
class Something
{
public:
	// Default constructor
	Something(int n = 0, double d = 1.2) // allows us to construct a Something(int, double), Something(int), or Something()
	{
	}
};

int main()
{
	Something s1 { 1, 2.4 }; // calls Something(int, double)
	Something s2 { 1 }; // calls Something(int, double)
	Something s3 {}; // calls Something(int, double)

	Something s4 { 2.4 }; // 无法编译，因为没有能匹配的构造函数 Something(double)

	return 0;
}
```


对于 `s4`，我们希望使用一个`double`类型的参数构造 `Something`。上面程序是无法编译的，因为规则不允许我们跳过默认参数前面的默认参数为后面的默认参数提供具体值（这里即最左边的`int`类型的[[parameters|形参]]不能被跳过）。

如果想基于一个`double`类型的变量构造`Something`，则必须再定义一个（非默认）构造函数：

```cpp
class Something
{
public:
	// Default constructor
	Something(int n = 0, double d = 1.2) // allows us to construct a Something(int, double), Something(int), or Something()
	{
	}

	Something(double d)
	{
	}
};

int main()
{
	Something s1 { 1, 2.4 }; // calls Something(int, double)
	Something s2 { 1 }; // calls Something(int, double)
	Something s3 {}; // calls Something(int, double)

	Something s4 { 2.4 }; // calls Something(double)

	return 0;
}
```


## 隐式生成的默认构造函数

如果你的类没有定义构造函数，则C++可以自动为你生成一个默认构造函数。这个构造函数被称为[[implicit-constructor|隐式构造函数]]。

考虑下面的类定义：

```cpp
class Date
{
private:
    int m_year{ 1900 };
    int m_month{ 1 };
    int m_day{ 1 };

    // 用户没有提供构造函数，编译器自动生成默认构造函数

};

int main()
{
    Date date{};

    return 0;
}
```


`Date` 类没有构造函数，因此编译器会为其创建一个默认构造函数。用户可以通过该隐式构造函数，在不提供参数的情况下创建`Date`对象。

当隐式构造函数被调用时，具有非静态成员初始化值的成员会被初始化(参考：[[13-9-default-member-initialization|10.7 - 默认成员初始化]] 和 [[13-7-non-static-member-initialization|13.7 - 非静态成员初始化列表]])。

只要你的类中有构造函数，编译器就不会为你创建默认构造函数，例如：


```cpp
class Date
{
private:
    int m_year{ 1900 };
    int m_month{ 1 };
    int m_day{ 1 };

public:
    Date(int year, int month, int day) // normal non-default constructor
    {
        m_year = year;
        m_month = month;
        m_day = day;
    }

    // No implicit constructor provided because we already defined our own constructor
};

int main()
{
    Date date{}; // error: Can't instantiate object because default constructor doesn't exist and the compiler won't generate one
    Date today{ 2020, 1, 19 }; // today is initialized to Jan 19th, 2020

    return 0;
}
```

如果你的类具有其他构造函数，但是你需要类支持默认初始化，则可以为构造函数的每个形参添加默认值，或者显式地定义一个默认构造函数。

当然，还有第三种方式：你可以使用`default`关键字告知编译器生成一个默认构造函数：

```cpp
class Date
{
private:
    int m_year{ 1900 };
    int m_month{ 1 };
    int m_day{ 1 };

public:
    // 要求编译器生成一个默认构造函数，即使
    // 用户已经提供了构造函数
    Date() = default;

    Date(int year, int month, int day) // 普通非默认构造函数
    {
        m_year = year;
        m_month = month;
        m_day = day;
    }
};

int main()
{
    Date date{}; // date is initialized to Jan 1st, 1900
    Date today{ 2020, 10, 14 }; // today is initialized to Oct 14th, 2020

    return 0;
}
```


写 `default` 比写一个空的函数体更费事，但是它能够更好地表明你的意图（创建默认构造函数），而且也更安全，因为它可以对没有初始化值的函数进行0初始化。`default`对于其他特殊构造函数也有效，等我们遇到时再讨论。


> [!success] "最佳实践"
> 如果类已经拥有构造函数，但你仍然需要一个什么都不做的构造函数(例如，所有成员函数都通过非静态成员函数初始化进行了初始化)，可以使用 = default。

## 包含类类型成员的类

`class` 中的成员变量，也可以是其他类对象。==默认情况下，当外层对象被初始化时，内部的这些对象其默认构造函数也会被调用，而且会在执行构造函数的函数体之前发生。==

举例来说：

```cpp
#include <iostream>

class A
{
public:
    A() { std::cout << "A\n"; }
};

class B
{
private:
    A m_a; // A 是 B 的一个成员

public:
    B() { std::cout << "B\n"; }
};

int main()
{
    B b;
    return 0;
}
```

程序输出：

```
A
B
```

当变量 `b` 被构建时，构造函数 `B()` 会被调用，在`B()`的函数体执行前，`m_a` 就开始初始化了，此时会调用 A 的默认构造函数并打印 "A"。然后控制权返还给构造函数 `B()`并执行其函数体。

这么做是有道理的，因为构造`B()`是有可能会去使用成员变量`m_a`的，所以它应该首先被初始化。

上面最后一个例子中，`m_a` 是一个class类型的变量。==对于class类型的对象，即使我们没有显式地初始化它们，它也会被初始化。==

在下节课中，我们会讨论如何初始化这些class类型的成员变量。


## 构造函数小结

很多新手程序员会有这样的困惑：构造函数会创建对象吗？实际上构造函数并不会创建对象——编译器会在构造函数调用前就为对象分配内存。

构造函数实际上有两个目的：

1. 构造函数可以决定谁能够创建这种类型的对象。也就是说，只有当能够找到匹配的构造函数时，该类型的对象才能够被创建。
2. 构造函数可以用于初始化对象。至于构造函数是否会进行实际的初始化工作，这取决于程序员。构造函数不进行任何的初始化工作，从语法层面来讲也是合法的。

然而，就像初始化所有局部变量是最佳实践一样，在创建对象时初始化所有成员变量也是最佳实践。这可以通过构造函数或非静态成员初始化来完成。


> [!success] "最佳实践"
> 永远要记得初始化对象的全部成员变量。

最后，构造函数仅用于创建对象时的初始化。不要使用构造函数来重新初始化现有对象。虽然可以编译，但结果不会是你想要的(相反，编译器将创建一个临时对象，然后丢弃它)。