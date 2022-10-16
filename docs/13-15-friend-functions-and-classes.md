---
title: 13.15 - 友元函数和友元类
alias: 13.15 - 友元函数和友元类
origin: /friend-functions-and-classes/
origin_title: "13.15 — Friend functions and classes"
time: 2022-9-16
type: translation
tags:
- class
- friend
---

本章中很大部分篇幅中我们都在强调封装（数据私有）的重要性。不过，有时候我们也会发现，有些类和函数会和其他其他外部类密切配合工作。例如，有一个类负责存放数据，而另外一个函数（或另外一个类）用于将数据打印到屏幕上。尽管存储类和显示代码出于便于维护的目的而被分割开来，但是显示代码实际上非常紧密地依靠着存储类。这样一来，将存储类的细节对显示代码隐藏起来并无太多帮助。

在这种情况下，我们有两种选择：

1. 让显示代码使用存储类的公有函数。然而，这么做有几个潜在的缺点。首先，必须定义这些公共成员函数，这需要时间，而且可能会打乱存储类的接口。其次，存储类可能必须暴露一些接口给显示代码，但是这些代码并不应该暴露给其他模块，我们不希望其他任何人都能访问这些函数。没有办法指定这个函数只能被显示类使用。
2. 或者，使用友元类和友元函数，你可以让显示代码访问存储类的私有细节。这允许显示代码直接访问存储类的所有私有成员和函数，同时将其他所有人排除在外！在这节课中，我们将仔细看看这是如何做到的。

## 友元函数

[[friend-function|友元函数]]可以像成员函数一样访问一个类的[[private-member|私有成员]]。从各个方面来看，友元函数都和普通函数没什么区别。友元函数可以是普通函数，也可以是其他类的成员函数。声明一个友元函数，只需要在你希望成为友元的函数原型前添加`friend`关键字即可。将友元函数定义在private还是public下没什么区别。

下面是一个使用友元函数的例子：

```cpp
class Accumulator
{
private:
    int m_value { 0 };

public:
    void add(int value) { m_value += value; }

    // 使 reset() 函数成为该类的友元函数
    friend void reset(Accumulator& accumulator);
};

// reset() 现在是 Accumulator 类的友元
void reset(Accumulator& accumulator)
{
    // 可以访问 Accumulator 的私有成员
    accumulator.m_value = 0;
}

int main()
{
    Accumulator acc;
    acc.add(5); // add 5 to the accumulator
    reset(acc); // reset the accumulator to 0

    return 0;
}
```


在这个例子中，我们声明了一个名为 `reset()` 的函数，它接受 `Accumulator` 类的对象，并将 `m_value` 的值设置为0。因为`reset()`不是 `Accumulator` 类的成员，通常情况下，`reset()` 不能访问 `Accumulator` 的私有成员。但是，因为 `Accumulator` 已经特别声明了这个 `reset()` 函数是这个类的友元，所以让 `reset()` 函数访问 `Accumulator` 的私有成员。

注意，我们必须向 `reset()` 传递一个 `Accumulator` 对象。这是因为 `reset()` 不是成员函数。它没有`*this` 指针，也没有 `Accumulator` 对象可以用来操作，除非给定一个。

再看下面的例子：

```cpp
#include <iostream>

class Value
{
private:
    int m_value{};

public:
    Value(int value)
        : m_value{ value }
    {
    }

    friend bool isEqual(const Value& value1, const Value& value2);
};

bool isEqual(const Value& value1, const Value& value2)
{
    return (value1.m_value == value2.m_value);
}

int main()
{
    Value v1{ 5 };
    Value v2{ 6 };
    std::cout << std::boolalpha << isEqual(v1, v2);

    return 0;
}
```

在这个例子中我们将函数 `isEqual()` 函数声明为 `Value` 类的友元。`isEqual()` 接受两个`Value`对象作为[[parameters|形参]] 。因为 `isEqual()` 是`Value`的友元函数，所以它可以访问 `Value` 对象的所有私有成员。在这个例子中，该函数可以用来比较两个对象，如果相等则返回 true。

虽然上面的两个例子都是刻意设计的，但第二个例子与我们稍后会讨论运算符重载时遇到的情况非常相似!


## 多个友元

一个函数可以同时成为多个类的友元。例如，考虑下面的例子:


```cpp
#include <iostream>

class Humidity;

class Temperature
{
private:
    int m_temp {};

public:
    Temperature(int temp=0)
        : m_temp { temp }
    {
    }

    friend void printWeather(const Temperature& temperature, const Humidity& humidity);
};

class Humidity
{
private:
    int m_humidity {};

public:
    Humidity(int humidity=0)
        : m_humidity { humidity }
    {
    }

    friend void printWeather(const Temperature& temperature, const Humidity& humidity);
};

void printWeather(const Temperature& temperature, const Humidity& humidity)
{
    std::cout << "The temperature is " << temperature.m_temp <<
       " and the humidity is " << humidity.m_humidity << '\n';
}

int main()
{
    Humidity hum{10};
    Temperature temp{12};

    printWeather(temp, hum);

    return 0;
}
```

COPY

There are two things worth noting about this example. First, because printWeather is a friend of both classes, it can access the private data from objects of both classes. Second, note the following line at the top of the example:

```cpp
class Humidity;
```

COPY

This is a class prototype that tells the compiler that we are going to define a class called Humidity in the future. Without this line, the compiler would tell us it doesn’t know what a Humidity is when parsing the prototype for printWeather() inside the Temperature class. Class prototypes serve the same role as function prototypes -- they tell the compiler what something looks like so it can be used now and defined later. However, unlike functions, classes have no return types or parameters, so class prototypes are always simply `class ClassName`, where ClassName is the name of the class.

## 友元类

It is also possible to make an entire class a friend of another class. This gives all of the members of the friend class access to the private members of the other class. Here is an example:

```cpp
#include <iostream>

class Storage
{
private:
    int m_nValue {};
    double m_dValue {};
public:
    Storage(int nValue, double dValue)
       : m_nValue { nValue }, m_dValue { dValue }
    {
    }

    // Make the Display class a friend of Storage
    friend class Display;
};

class Display
{
private:
    bool m_displayIntFirst;

public:
    Display(bool displayIntFirst)
         : m_displayIntFirst { displayIntFirst }
    {
    }

    void displayItem(const Storage& storage)
    {
        if (m_displayIntFirst)
            std::cout << storage.m_nValue << ' ' << storage.m_dValue << '\n';
        else // display double first
            std::cout << storage.m_dValue << ' ' << storage.m_nValue << '\n';
    }
};

int main()
{
    Storage storage{5, 6.7};
    Display display{false};

    display.displayItem(storage);

    return 0;
}
```

COPY

Because the Display class is a friend of Storage, any of Display’s members that use a Storage class object can access the private members of Storage directly. This program produces the following result:

6.7 5

A few additional notes on friend classes. First, even though Display is a friend of Storage, Display has no direct access to the *this pointer of Storage objects. Second, just because Display is a friend of Storage, that does not mean Storage is also a friend of Display. If you want two classes to be friends of each other, both must declare the other as a friend. Finally, if class A is a friend of B, and B is a friend of C, that does not mean A is a friend of C.

Be careful when using friend functions and classes, because it allows the friend function or class to violate encapsulation. If the details of the class change, the details of the friend will also be forced to change. Consequently, limit your use of friend functions and classes to a minimum.

## 友元成员函数

Instead of making an entire class a friend, you can make a single member function a friend. This is done similarly to making a normal function a friend, except using the name of the member function with the className:: prefix included (e.g. Display::displayItem).

However, in actuality, this can be a little trickier than expected. Let’s convert the previous example to make Display::displayItem a friend member function. You might try something like this:

```cpp
#include <iostream>

class Display; // forward declaration for class Display

class Storage
{
private:
	int m_nValue {};
	double m_dValue {};
public:
	Storage(int nValue, double dValue)
		: m_nValue { nValue }, m_dValue { dValue }
	{
	}

	// Make the Display::displayItem member function a friend of the Storage class
	friend void Display::displayItem(const Storage& storage); // error: Storage hasn't seen the full definition of class Display
};

class Display
{
private:
	bool m_displayIntFirst {};

public:
	Display(bool displayIntFirst)
		: m_displayIntFirst { displayIntFirst }
	{
	}

	void displayItem(const Storage& storage)
	{
		if (m_displayIntFirst)
			std::cout << storage.m_nValue << ' ' << storage.m_dValue << '\n';
		else // display double first
			std::cout << storage.m_dValue << ' ' << storage.m_nValue << '\n';
	}
};
```

COPY

However, it turns out this won’t work. In order to make a member function a friend, the compiler has to have seen the full definition for the class of the friend member function (not just a forward declaration). Since class Storage hasn’t seen the full definition for class Display yet, the compiler will error at the point where we try to make the member function a friend.

Fortunately, this is easily resolved simply by moving the definition of class Display before the definition of class Storage.

```cpp
#include <iostream>

class Display
{
private:
	bool m_displayIntFirst {};

public:
	Display(bool displayIntFirst)
		: m_displayIntFirst { displayIntFirst }
	{
	}

	void displayItem(const Storage& storage) // error: compiler doesn't know what a Storage is
	{
		if (m_displayIntFirst)
			std::cout << storage.m_nValue << ' ' << storage.m_dValue << '\n';
		else // display double first
			std::cout << storage.m_dValue << ' ' << storage.m_nValue << '\n';
	}
};

class Storage
{
private:
	int m_nValue {};
	double m_dValue {};
public:
	Storage(int nValue, double dValue)
		: m_nValue { nValue }, m_dValue { dValue }
	{
	}

	// Make the Display::displayItem member function a friend of the Storage class
	friend void Display::displayItem(const Storage& storage); // okay now
};
```

COPY

However, we now have another problem. Because member function Display::displayItem() uses Storage as a reference parameter, and we just moved the definition of Storage below the definition of Display, the compiler will complain it doesn’t know what a Storage is. We can’t fix this one by rearranging the definition order, because then we’ll undo our previous fix.

Fortunately, this is also fixable in a couple of simple steps. First, we can add class Storage as a forward declaration. Second, we can move the definition of Display::displayItem() out of the class, after the full definition of Storage class.

Here’s what this looks like:

```cpp
#include <iostream>

class Storage; // forward declaration for class Storage

class Display
{
private:
	bool m_displayIntFirst {};

public:
	Display(bool displayIntFirst)
		: m_displayIntFirst { displayIntFirst }
	{
	}

	void displayItem(const Storage& storage); // forward declaration above needed for this declaration line
};

class Storage // full definition of Storage class
{
private:
	int m_nValue {};
	double m_dValue {};
public:
	Storage(int nValue, double dValue)
		: m_nValue { nValue }, m_dValue { dValue }
	{
	}

	// Make the Display::displayItem member function a friend of the Storage class (requires seeing the full definition of class Display, as above)
	friend void Display::displayItem(const Storage& storage);
};

// Now we can define Display::displayItem, which needs to have seen the full definition of class Storage
void Display::displayItem(const Storage& storage)
{
	if (m_displayIntFirst)
		std::cout << storage.m_nValue << ' ' << storage.m_dValue << '\n';
	else // display double first
		std::cout << storage.m_dValue << ' ' << storage.m_nValue << '\n';
}

int main()
{
    Storage storage(5, 6.7);
    Display display(false);

    display.displayItem(storage);

    return 0;
}
```

COPY

Now everything will compile properly: the forward declaration of class Storage is enough to satisfy the declaration of Display::displayItem(), the full definition of Display satisfies declaring Display::displayItem() as a friend of Storage, and the full definition of class Storage is enough to satisfy the definition of member function Display::displayItem(). If that’s a bit confusing, see the comments in the program above.

If this seems like a pain -- it is. Fortunately, this dance is only necessary because we’re trying to do everything in a single file. A better solution is to put each class definition in a separate header file, with the member function definitions in corresponding .cpp files. That way, all of the class definitions would have been visible immediately in the .cpp files, and no rearranging of classes or functions is necessary!

## 小结

A friend function or class is a function or class that can access the private members of another class as though it was a member of that class. This allows the friend function or friend class to work intimately with the other class, without making the other class expose its private members (e.g. via access functions).

Friending is commonly used when defining overloaded operators (which we’ll cover in the next chapter), or less commonly, when two or more classes need to work together in an intimate way.

Note that making a specific member function a friend requires the full definition for the class of the member function to have been seen first.