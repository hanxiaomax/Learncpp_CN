---
title: 13.3 - 访问修饰符 public 和 private
alias: 13.3 - 访问修饰符 public 和 private
origin: /public-vs-private-access-specifiers/
origin_title: "13.3 — Public vs private access specifiers"
time: 2022-9-16
type: translation
tags:
- access specifier
---

??? note "Key Takeaway"


## 公有和私有成员

考虑下面的结构体：

```cpp
struct DateStruct // 成员默认是公有的
{
    int month {}; // public by default, can be accessed by anyone
    int day {}; // public by default, can be accessed by anyone
    int year {}; // public by default, can be accessed by anyone
};

int main()
{
    DateStruct date;
    date.month = 10;
    date.day = 14;
    date.year= 2020;

    return 0;
}
```

在上面例子的`main()`函数中，我们声明了一个 `DateStruct` 结构体，然后直接访问它的成员，以便给它们赋值。这是可行的，因为结构体的所有成员在默认情况下都是公有成员。[[public-member|公有成员]]是任何人都可以直接访问的结构或类的成员，包括从结构或类外部的代码访问。在上面的例子中，函数`main()`位于结构体外部，但它可以直接访问成员月、日和年，因为它们是公有成员。

结构体或者类外部的代码有时称为 public，public只能够访问结构体或类的公有成员。

请考虑下面这个几乎类似的class版本代码：

```cpp
class DateClass // members are private by default
{
    int m_month {}; // private by default, can only be accessed by other members
    int m_day {}; // private by default, can only be accessed by other members
    int m_year {}; // private by default, can only be accessed by other members
};

int main()
{
    DateClass date;
    date.m_month = 10; // error
    date.m_day = 14; // error
    date.m_year = 2020; // error

    return 0;
}
```

编译这个程序会报错。这是因为默认情况下，类的所有成员都是私有的。[[private-member|私有成员]]只能被该类的其他成员访问(不能被public访问)。因为`main()`不是`DateClass`的成员，所以它不能访问`date`的私有成员。


## 访问修饰符

尽管类成员在默认情况下是私有的，但我们可以通过使用public关键字将它们设为公有：

```cpp
class DateClass
{
public: // note use of public keyword here, and the colon
    int m_month {}; // public, can be accessed by anyone
    int m_day {}; // public, can be accessed by anyone
    int m_year {}; // public, can be accessed by anyone
};

int main()
{
    DateClass date;
    date.m_month = 10; // okay because m_month is public
    date.m_day = 14;  // okay because m_day is public
    date.m_year = 2020;  // okay because m_year is public

    return 0;
}
```


因为 `DateClass` 的成员现在是公有的了，因此它们可以被 `main()`访问。

public 关键字及其后面的分号，称为[[access-specifiers|成员访问修饰符]]，它可以设置谁可以访问对应的成员。每个成员都可以从其前面的成员访问修饰符获取对应的访问等级（如果没有对应的修饰符，则使用默认的访问修饰符）。

C++提供了3个不同的访问说明符关键字：`public`、`private` 和 `protected`。`public` 和 `private` 分别用来使它们后面的成员成为[[public-member|公有成员]]或[[private-member|私有成员]]。第三个访问说明符 `protected` 的工作原理与 `private` 非常相似。我们将在讨论继承时讨论 `private` 和 `protected` 的区别。

## 混合使用访问修饰符

一个类可以(而且几乎总是)使用多个访问说明符来设置其成员的访问级别。一个类中可以使用的访问说明符的数量是没有限制的。

一般来说，成员变量通常设为私有，成员函数通常设为公有。我们将在下一课中仔细研究其中的原因。

> [!success] "最佳实践"
> 将成员变量设为私有，将成员函数设为公共，除非您有充分的理由不这样做。

让我们看一个同时使用私有和公共访问的类的例子：

```cpp
#include <iostream>

class DateClass // members are private by default
{
    int m_month {}; // private by default, can only be accessed by other members
    int m_day {}; // private by default, can only be accessed by other members
    int m_year {}; // private by default, can only be accessed by other members

public:
    void setDate(int month, int day, int year) // public, can be accessed by anyone
    {
        // setDate() can access the private members of the class because it is a member of the class itself
        m_month = month;
        m_day = day;
        m_year = year;
    }

    void print() // public, can be accessed by anyone
    {
        std::cout << m_month << '/' << m_day << '/' << m_year;
    }
};

int main()
{
    DateClass date;
    date.setDate(10, 14, 2020); // okay, because setDate() is public
    date.print(); // okay, because print() is public
    std::cout << '\n';

    return 0;
}
```

程序运行结果：

```
10/14/2020
```

注意，尽管我们不能在`main`中直接访问变量 `m_month`、`m_day` 和 `m_year` （因为它们是私有的），但是我们可以通过公有成员函数`setDate()`和`print()`间接地访问它们！

类中公有成员的集合通常称为该类的公开接口。因为只有公有成员才能在类外被访问，所以公开接口实际上定义了程序应该如何使用接口和类进行交互。注意，`main()` 只能够设置日期和打印日期。该类可以保护自己的成员被直接访问或修改。

有的程序员喜欢将私有成员定义在公有成员前面，因为公有成员通常会使用私有成员，所以将私有的定义在前是有道理的。但是，反方的观点也很有力，他们认为用户根本不关心类的私有成员，所以应该将公有成员定义在前面。其实两种方法都是可以的。

## 访问控制在类层面工作（而非对象层面）

考虑下面程序：

```cpp
#include <iostream>

class DateClass // members are private by default
{
	int m_month {}; // private by default, can only be accessed by other members
	int m_day {}; // private by default, can only be accessed by other members
	int m_year {}; // private by default, can only be accessed by other members

public:
	void setDate(int month, int day, int year)
	{
		m_month = month;
		m_day = day;
		m_year = year;
	}

	void print()
	{
		std::cout << m_month << '/' << m_day << '/' << m_year;
	}

	// Note the addition of this function
	void copyFrom(const DateClass& d)
	{
		// Note that we can access the private members of d directly
		m_month = d.m_month;
		m_day = d.m_day;
		m_year = d.m_year;
	}
};

int main()
{
	DateClass date;
	date.setDate(10, 14, 2020); // okay, because setDate() is public

	DateClass copy {};
	copy.copyFrom(date); // okay, because copyFrom() is public
	copy.print();
	std::cout << '\n';

	return 0;
}
```

==该例中包含一个 C++ 中常被忽略或误解的细节，访问控制是工作在类的层面，而不是对象层面。== 这就意味着如果一个函数可以访问**类中的某个私有成员**，那么该类所有对象中的该私有成员也都能够被该函数访问。

在上面的例子中，`copyFrom()`是类 `DateClass` 的成员函数，它可以访问 `DateClass` 的私有成员。因此，`copyFrom()` 函数不仅可以访问调用它的对象（`copy`），还可以直接访问它的形参（`DataClass` 类型变量 `d`）的私有成员。如果该形参d是其他类型的，则其私有成员不可以被访问。

这个特性非常有用，尤其是当我们需要拷贝一个对象给与它同属一个类的对象时。在下一章中，我们还会讨论`<<`运算符的重载，到时候我们还会重新体积这个问题。

## 结构体 vs 类

访问说明符介绍完毕，现在我们可以讨论C++中的类和结构之间的实际区别了。类的成员默认为private。结构体的的成员则默认为public。

就是这样!

(好吧，迂腐一点，其实还有一个小区别——结构体默认从其他类公开继承，而类则是私有继承。我们将在以后的章节中讨论这意味着什么，但这一点实际上是无关紧要的，因为无论如何你都不应该依赖它的默认行为)。