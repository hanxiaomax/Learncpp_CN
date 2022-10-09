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

!!! success "最佳实践"

	将成员变量设为私有，将成员函数设为公共，除非您有充分的理由不这样做。

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

COPY

This program prints:

```
10/14/2020
```

Note that although we can’t access date’s members variables m_month, m_day, and m_year directly from main (because they are private), we are able to access them indirectly through public member functions setDate() and print()!

The group of public members of a class are often referred to as a **public interface**. Because only public members can be accessed from outside of the class, the public interface defines how programs using the class will interact with the class. Note that main() is restricted to setting the date and printing the date. The class protects the member variables from being accessed or edited directly.

Some programmers prefer to list private members first, because the public members typically use the private ones, so it makes sense to define the private ones first. However, a good counterargument is that users of the class don’t care about the private members, so the public ones should come first. Either way is fine.

## Access controls work on a per-class basis

Consider the following program:

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

COPY

One nuance of C++ that is often missed or misunderstood is that access control works on a per-class basis, not a per-object basis. This means that when a function has access to the private members of a class, it can access the private members of _any_ object of that class type that it can see.

In the above example, copyFrom() is a member of DateClass, which gives it access to the private members of DateClass. This means copyFrom() can not only directly access the private members of the implicit object it is operating on (copy), it also means it has direct access to the private members of DateClass parameter d! If parameter d were some other type, this would not be the case.

This can be particularly useful when we need to copy members from one object of a class to another object of the same class. We’ll also see this topic show up again when we talk about overloading operator<< to print members of a class in the next chapter.

## Structs vs classes revisited

Now that we’ve talked about access specifiers, we can talk about the actual differences between a class and a struct in C++. A class defaults its members to private. A struct defaults its members to public.

That’s it!

(Okay, to be pedantic, there’s one more minor difference -- structs inherit from other classes publicly and classes inherit privately. We’ll cover what this means in a future chapter, but this particular point is practically irrelevant since you should never rely on the defaults anyway).