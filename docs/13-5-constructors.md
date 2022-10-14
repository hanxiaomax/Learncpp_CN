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


!!! success "最佳实践"

	初始化对象时，推荐使用值初始化而非默认初始化
	
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

一如既往地，我们更推荐列表初始化。在后面的教程中，我们也会遇到需要使用直接初始化的情况(模板和std::initializer_list)。还有另外一种特殊的构造函数会使用括号初始化（列表初始化）做一些不同的事情，在这种情况下，我们必须使用直接初始化。

注意，由于构造函数的第二个[[parameters|形参]]具有默认值，所以下面的调用方式也是合法的:

```cpp
Fraction six{ 6 }; // 调用 Fraction(int, int) 构造函数，第二个形参会使用默认值1。
```

构造函数的默认参数和普通函数的默认参数没有什么区别，所以当我们调用 `six{ 6 }` 时，`Fraction(int, int)` 函数会自动使用1作为第二个形参的值。

!!! success "最佳实践"

	推荐使用大括号初始化来初始类对象。

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

定义和调用具有默认参数函数的规则 (参见：[[8-12-Default-arguments|8.12 - 默认参数]]) 同样也适用于构造函数。简单复习一下，在定义具有默认参数的构造函数时，默认参数必须在非默认参数的后面。也就是说，非默认参数不能被定义在默认参数后。

This may produce unexpected results for classes that have multiple default parameters of different types. Consider:

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

	Something s4 { 2.4 }; // will not compile, as there's no constructor to handle Something(double)

	return 0;
}
```

COPY

With `s4`, we’ve attempted to construct a `Something` by providing only a `double`. This won’t compile, as the rules for how arguments match with default parameters won’t allow us to skip a non-rightmost parameter (in this case, the leftmost int parameter).

If we want to be able to construct a `Something` with only a `double`, we’ll need to add a second (non-default) constructor:

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

COPY

## 隐式生成的默认构造函数


If your class has no constructors, C++ will automatically generate a public default constructor for you. This is sometimes called an **implicit constructor** (or implicitly generated constructor).

Consider the following class:

```cpp
class Date
{
private:
    int m_year{ 1900 };
    int m_month{ 1 };
    int m_day{ 1 };

    // No user-provided constructors, the compiler generates a default constructor.
};

int main()
{
    Date date{};

    return 0;
}
```

COPY

The Date class has no constructors. Therefore, the compiler will generate a default constructor that allows us to create a `Date` object without arguments.

When the generated default constructor is called, members will still be initialized if they have non-static member initializers (covered in lesson [[10-7-default-member-initialization|10.7 - 默认成员初始化]] 和 [[13-7-non-static-member-initialization|13.7 - 非静态成员初始化列表]])。

If your class has any other constructors, the implicitly generated constructor will not be provided. For example:

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

COPY

If your class has another constructor and you want to allow default construction, you can either add default arguments to every parameter of a constructor with parameters, or explicitly define a default constructor.

There’s a third option as well: you can use the default keyword to tell the compiler to create a default constructor for us anyway:

```cpp
class Date
{
private:
    int m_year{ 1900 };
    int m_month{ 1 };
    int m_day{ 1 };

public:
    // Tell the compiler to create a default constructor, even if
    // there are other user-provided constructors.
    Date() = default;

    Date(int year, int month, int day) // normal non-default constructor
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

COPY

Using `= default` is longer than writing a constructor with an empty body, but expresses better what your intentions are (To create a default constructor), and it’s safer, because it can zero-initialize members even if they have not been initialized at their declaration. `= default` also works for other special constructors, which we’ll talk about in the future.

!!! success "最佳实践"

	If you have constructors in your `class` and need a default constructor that does nothing (e.g. because all your members are initialized using non-static member initialization), use `= default`.

## 包含类类型成员的类

A `class` may contain other class objects as member variables. By default, when the outer class is constructed, the member variables will have their default constructors called. This happens before the body of the constructor executes.

This can be demonstrated thusly:

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
    A m_a; // B contains A as a member variable

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

When variable `b` is constructed, the `B()` constructor is called. Before the body of the constructor executes, `m_a` is initialized, calling the `class A`default constructor. This prints “A”. Then control returns back to the `B` constructor, and the body of the B constructor executes.

This makes sense when you think about it, as the `B()` constructor may want to use variable `m_a` -- so `m_a` had better be initialized first!

The difference to the last example in the previous section is that `m_a` is a `class`-type. `class`-type members get initialized even if we don’t explicitly initialize them.

In the next lesson, we’ll talk about how to initialize these class member variables.

## 构造函数小结

Many new programmers are confused about whether constructors create the objects or not. They do not -- the compiler sets up the memory allocation for the object prior to the constructor call.

Constructors actually serve two purposes.

1.  Constructors determine who is allowed to create an object of the class type. That is, an object of a class can only be created if a matching constructor can be found.
2.  Constructors can be used to initialize objects. Whether the constructor actually does an initialization is up to the programmer. It’s syntactically valid to have a constructor that does no initialization at all (the constructor still serves the purpose of allowing the object to be created, as per the above).

However, much like it is a best practice to initialize all local variables, it’s also a best practice to initialize all member variables on creation of the object. This can be done via a constructor or via non-static member initialization.

!!! success "最佳实践"

	Always initialize all member variables in your objects.

Finally, constructors are only intended to be used for initialization when the object is created. You should not try to call a constructor to re-initialize an existing object. While it may compile, the results will not be what you intended (instead, the compiler will create a temporary object and then discard it).