---
title: 13.14 - 静态成员函数
alias: 13.14 - 静态成员函数
origin: /static-member-functions/
origin_title: "13.14 — Static member functions"
time: 2022-9-16
type: translation
tags:
- class
- static membe function
---


## 静态成员函数


在上一节课 [[13-13-static-member-variables|13.13 - 静态成员变量]] 中，我们知道了[[static-member-variables|静态成员变量]]是属于类而不是类对象的。如果静态成员变量是[[public-member|公有成员]]的话我们自然可以通过类名[[scope-resolution-operator|作用域解析运算符]]来访问它，但是如果它是[[private-member|私有成员]]的话，我们应该如何访问它呢？考虑下面的例子：

```cpp
class Something
{
private:
    static int s_value;

};

int Something::s_value{ 1 }; // 初始化。即使 s_value 是私有的也可以这样做，因为此处是在“定义”

int main()
{
    // 应该如何访问私有成员 Something::s_value 呢？
}
```

在上面的例子中，我们不能在`main()`函数中直接访问 `Something::s_value` ，因为它是私有成员。通常情况下，私有成员变量需要通过公有成员函数来访问。尽管我们可以创建一个普通的公有成员函数来访问 `s_value`，但很显然我们必须实例化一个对象才能够调用该成员函数！更好的办法是将该成员函数定义为静态的。

和静态成员函数一样，静态成员函数不属于任何对象。使用静态成员函数来访问`s_value`的方法见下面的例子：

```cpp
#include <iostream>

class Something
{
private:
    static int s_value;
public:
    static int getValue() { return s_value; } // static member function
};

int Something::s_value{ 1 }; // initializer

int main()
{
    std::cout << Something::getValue() << '\n';
}
```

因为静态成员函数不属于任何特定对象，所以可以使用类名和作用域解析操作符直接调用它们。与静态成员变量一样，也可以通过对象调用它们，但不建议这样做。


## 静态成员变量没有`*this`指针



静态成员函数有两个有趣的特性值得注意。首先，因为静态成员函数不属于某个对象，所以它们没有 `this` 指针！仔细想想，这是有道理的——`this` 指针总是指向该成员函数正在操作的对象。静态成员函数不能作用于对象，因此不需要 this 指针。

其次，静态成员函数可以直接访问其他静态成员(变量或函数)，但不能访问非静态成员。这是因为非静态成员必须属于类对象，而静态成员函数没有可使用的类对象!


## 又一个例子


静态成员函数也可以在类声明之外定义。这与普通成员函数的工作方式相同。

一个例子:

```cpp
#include <iostream>

class IDGenerator
{
private:
    static int s_nextID; // 静态成员的声明

public:
     static int getNextID(); // 静态函数的声明
};

// 在类外定义静态成员。注意，我们在此处没有使用 static 关键字。
// ID 从 1 开始
int IDGenerator::s_nextID{ 1 };

// 类外定义静态成员函数。注意，我们在此处没有使用 static 关键字。
int IDGenerator::getNextID() { return s_nextID++; }

int main()
{
    for (int count{ 0 }; count < 5; ++count)
        std::cout << "The next ID is: " << IDGenerator::getNextID() << '\n';

    return 0;
}
```

打印结果：

```
The next ID is: 1
The next ID is: 2
The next ID is: 3
The next ID is: 4
The next ID is: 5
```

注意，因为该类中的所有数据和函数都是静态的，所以我们不需要实例化该类的对象来使用它的功能！该类利用一个静态成员变量来保存下一个要分配的ID的值，并提供一个静态成员函数来返回该ID并使其递增。


## 有关全静态成员类的一些警示

对于一个所有成员都是静态成员的类时要小心。尽管这种“纯静态类”(也称为“单态类”)可能很有用，但它们也有一些潜在的缺点。

首先，因为所有静态成员都只实例化一次，所以不可能有纯静态类的多个副本(除非克隆该类并重命名它)。例如，如果您需要两个独立的 `IDGenerator` 对象，这对于单个纯静态类来说是不可能的。

其次，在关于全局变量的一课中，你已经了解到了全局变量的危险性，因为任何一段代码都可能改变全局变量的值，并最终破坏另一段看起来不相关的代码。对于纯静态类也是如此。因为所有成员都属于类(而不是类的对象)，而且类声明通常具有全局作用域，所以纯静态类本质上相当于在全局可访问的名称空间中声明函数和全局变量，并具有全局变量所具有的所有必要缺点。


## C++ does not support static constructors

If you can initialize normal member variables via a constructor, then by extension it makes sense that you should be able to initialize static member variables via a static constructor. And while some modern languages do support static constructors for precisely this purpose, C++ is unfortunately not one of them.

If your static variable can be directly initialized, no constructor is needed: you can initialize the static member variable at the point of definition (even if it is private). We do this in the IDGenerator example above. Here’s another example:

```cpp
class MyClass
{
public:
	static std::vector<char> s_mychars;
};

std::vector<char> MyClass::s_mychars{ 'a', 'e', 'i', 'o', 'u' }; // initialize static variable at point of definition
```


If initializing your static member variable requires executing code (e.g. a loop), there are many different, somewhat obtuse ways of doing this. One way that works with all variables, static or not, is to use a lambda and call it immediately.

```cpp
class MyClass
{
public:
    static std::vector<char> s_mychars;
};

std::vector<char> MyClass::s_mychars{
  []{ // The parameter list of lambdas without parameters can be omitted.
      // Inside the lambda we can declare another vector and use a loop.
      std::vector<char> v{};

      for (char ch{ 'a' }; ch <= 'z'; ++ch)
      {
          v.push_back(ch);
      }

      return v;
  }() // Call the lambda right away
};
```

COPY

The following code presents a method that behaves more like a regular constructor. However, it is a little tricky, and you’ll probably never need it, so feel free to skip the remainder of this section if you desire.

```cpp
class MyClass
{
public:
	static std::vector<char> s_mychars;

	class init_static // we're defining a nested class named init_static
	{
	public:
		init_static() // the init constructor will initialize our static variable
		{
			for (char ch{ 'a' }; ch <= 'z'; ++ch)
			{
				s_mychars.push_back(ch);
			}
		}
	} ;

private:
	static init_static s_initializer; // we'll use this static object to ensure the init_static constructor is called
};

std::vector<char> MyClass::s_mychars{}; // define our static member variable
MyClass::init_static MyClass::s_initializer{}; // define our static initializer, which will call the init_static constructor, which will initialize s_mychars
```


When static member s_initializer is defined, the init_static() default constructor will be called (because s_initializer is of type init_static). We can use this constructor to initialize any static member variables. The nice thing about this solution is that all of the initialization code is kept hidden inside the original class with the static member.

## Summary

Static member functions can be used to work with static member variables in the class. An object of the class is not required to call them.

Classes can be created with all static member variables and static functions. However, such classes are essentially the equivalent of declaring functions and global variables in a globally accessible namespace, and should generally be avoided unless you have a particularly good reason to use them.