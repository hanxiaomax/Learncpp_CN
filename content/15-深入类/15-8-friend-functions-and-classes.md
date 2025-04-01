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

关于这个示例，有两点值得注意。首先，因为 `printWeather` 是这两个类的友元函数，所以它可以访问这两个类的对象的私有数据。其次，注意示例中顶部的这一行：

```cpp
class Humidity;
```

这是一个类原型，它告诉编译器我们将在未来定义一个名为`Humidity`的类。如果没有这一行，编译器在解析 `Temperature` 类中 `printWeather()` 的原型时就不知道 `Humidity` 是什么。类原型的作用与函数原型相同——它们告诉编译器某个东西是什么样子的，以便现在可以使用它，以后可以定义它。然而，与函数不同的是，类没有返回类型或参数，因此类原型总是简单的`class ClassName` ，其中`ClassName`是类的名称。


## 友元类

也可以让整个类成为另一个类的友元。这使友元类的所有成员都可以访问另一个类的私有成员。下面是一个例子：


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

    // 使 Display 类称为 Storage 的友元
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


因为 `Display` 类是 `Storage` 的友元，所以 `Display` 的任何成员都可以 `Storage` 的私有成员。上述程序输出结果为：

```
6.7 5
```

有关友元类，还有一些事情需要注意。首先，即便 `Display` 是 `Storage` 的友元，但是 `Display` 并不能直接访问`Storage`对象的 `*this` 指针。其次，因为`Display` 是 `Storage` 的友元类，但是这不代表 `Storage` 也是 `Display` 的友元。如果你希望两个类互为友元，阿么必须分别在类中将对方声明为友元。最后，如果A是B的友元，而B是C的友元，但不代表A是C的友元。

在使用友函数和类时要小心，因为它允许友函数或类打破封装。如果类改变了，友元的也需要被迫改变。因此，尽量减少对友函数和友元类的使用。


## 友元成员函数


可以将单个成员函数设为友元，而不是将整个类设为友元。这与将普通函数设为友元类似，只是在使用成员函数的名称时包含了`className::`前缀（例如`Display::displayItem`)。

不过，这么做比预期的要复杂一些。让我们改写一下前面的示例，使`Display::displayItem`成为友元成员函数。我们可以这样做:

```cpp
#include <iostream>

class Display; // Display 的前向声明

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

	// 使 Display::displayItem 成员函数成为 Storage 的友元
	friend void Display::displayItem(const Storage& storage); // 错误: Storage 此时并不知道 Display 类的完整定义。
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

很遗憾，这么做并不能正确工作。为了让一个成员函数称为友元，编译器必须看到该成员函数的完整定义而不仅仅是[[forward-declaration|前向声明]]。因为 `Storage` 还没有看到`Display` 的完整定义，所以当我们在此处声明友元函数时会，编译器会报错。

幸运的是，我们只要将 `Display` 的定义移动到 `Storage` 前面即可。

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


不过， 这样一来会带来另外的问题，因为 `Display::displayItem()` 使用 `Storage` 作为引用参数。而当我们将`Storage`的定义移动到`Display`后面时，`编译器就会抱怨它不知道Storage` 是什么，我们不能再调整顺序了，不然又会出现之前的问题。

幸运地是，只需要几步就可以解决该问题。首先，我们可以添加对于`Storage`的前向声明。第二，我们可以将 `Display::displayItem()` 移动到类外部，放在`Storage`类完整定义的后。

看上去是这样的：

```cpp
#include <iostream>

class Storage; // Storage 的前向声明

class Display
{
private:
	bool m_displayIntFirst {};

public:
	Display(bool displayIntFirst)
		: m_displayIntFirst { displayIntFirst }
	{
	}

	void displayItem(const Storage& storage); // 上面的前向声明就是为了这一句声明
};

class Storage // Storage 类的完整定义
{
private:
	int m_nValue {};
	double m_dValue {};
public:
	Storage(int nValue, double dValue)
		: m_nValue { nValue }, m_dValue { dValue }
	{
	}

	// 将 Display::displayItem 声明为 Storage 类的友元 (必须看到 Display 的完整定义)
	friend void Display::displayItem(const Storage& storage);
};

// 现在，我们可以定义 Display::displayItem 了，它必须看到 Storage 的完整定义
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


现在，代码可以正常编译了：`Storage` 的前向声明对于 `Display::displayItem()` 的声明来说足够了。`Display` 的完整定义可以确保`Display::displayItem()`被定义为`Storage`的友元函数，如果你还是感到困惑，请仔细看看上面代码中的注释。

如果这令你感到困难——的确是的。幸运的是，这么做的原因只是因为我们试图在一个文件中完成所有工作。更好的解决方案是将每个类定义放在单独的头文件中，成员函数定义放在相应的.cpp文件中。这样，所有的类定义都将立即在.cpp文件中可见，并且不需要重新排列类或函数!

## 小结

友元函数或友元类是可以访问另一个类的私有成员的函数或类，就好像它是该类的成员一样。这允许友元函数或友元类与另一个类紧密地一起工作，而不必暴露一个私有成员(例如通过访问函数)。

友元通常在定义重载操作符(我们将在下一章讨论)时使用，或者（少数时候）在两个或多个类需要以亲密的方式一起工作时。

注意，要使特定的成员函数成为友元，首先需要看到成员函数类的完整定义。
