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


In the previous lesson on [[13-13-static-member-variables|13.13 - 静态成员变量]], you learned that static member variables are member variables that belong to the class rather than objects of the class. If the static member variables are public, we can access them directly using the class name and the scope resolution operator. But what if the static member variables are private? Consider the following example:

```cpp
class Something
{
private:
    static int s_value;

};

int Something::s_value{ 1 }; // initializer, this is okay even though s_value is private since it's a definition

int main()
{
    // how do we access Something::s_value since it is private?
}
```

COPY

In this case, we can’t access Something::s_value directly from main(), because it is private. Normally we access private members through public member functions. While we could create a normal public member function to access s_value, we’d then need to instantiate an object of the class type to use the function! We can do better. It turns out that we can also make functions static.

Like static member variables, static member functions are not attached to any particular object. Here is the above example with a static member function accessor:

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

COPY

Because static member functions are not attached to a particular object, they can be called directly by using the class name and the scope resolution operator. Like static member variables, they can also be called through objects of the class type, though this is not recommended.

## 静态成员变量没有`*this`指针

Static member functions have two interesting quirks worth noting. First, because static member functions are not attached to an object, they have no _this_pointer! This makes sense when you think about it -- the _this_ pointer always points to the object that the member function is working on. Static member functions do not work on an object, so the _this_ pointer is not needed.

Second, static member functions can directly access other static members (variables or functions), but not non-static members. This is because non-static members must belong to a class object, and static member functions have no class object to work with!

Another example

Static member functions can also be defined outside of the class declaration. This works the same way as for normal member functions.

Here’s an example:

```cpp
#include <iostream>

class IDGenerator
{
private:
    static int s_nextID; // Here's the declaration for a static member

public:
     static int getNextID(); // Here's the declaration for a static function
};

// Here's the definition of the static member outside the class.  Note we don't use the static keyword here.
// We'll start generating IDs at 1
int IDGenerator::s_nextID{ 1 };

// Here's the definition of the static function outside of the class.  Note we don't use the static keyword here.
int IDGenerator::getNextID() { return s_nextID++; }

int main()
{
    for (int count{ 0 }; count < 5; ++count)
        std::cout << "The next ID is: " << IDGenerator::getNextID() << '\n';

    return 0;
}
```

COPY

This program prints:

```
The next ID is: 1
The next ID is: 2
The next ID is: 3
The next ID is: 4
The next ID is: 5
```

Note that because all the data and functions in this class are static, we don’t need to instantiate an object of the class to make use of its functionality! This class utilizes a static member variable to hold the value of the next ID to be assigned, and provides a static member function to return that ID and increment it.

A word of warning about classes with all static members

Be careful when writing classes with all static members. Although such “pure static classes” (also called “monostates”) can be useful, they also come with some potential downsides.

First, because all static members are instantiated only once, there is no way to have multiple copies of a pure static class (without cloning the class and renaming it). For example, if you needed two independent IDGenerator objects, this would not be possible with a single pure static class.

Second, in the lesson on global variables, you learned that global variables are dangerous because any piece of code can change the value of the global variable and end up breaking another piece of seemingly unrelated code. The same holds true for pure static classes. Because all of the members belong to the class (instead of object of the class), and class declarations usually have global scope, a pure static class is essentially the equivalent of declaring functions and global variables in a globally accessible namespace, with all the requisite downsides that global variables have.

C++ does not support static constructors

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

COPY

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

COPY

When static member s_initializer is defined, the init_static() default constructor will be called (because s_initializer is of type init_static). We can use this constructor to initialize any static member variables. The nice thing about this solution is that all of the initialization code is kept hidden inside the original class with the static member.

## Summary

Static member functions can be used to work with static member variables in the class. An object of the class is not required to call them.

Classes can be created with all static member variables and static functions. However, such classes are essentially the equivalent of declaring functions and global variables in a globally accessible namespace, and should generally be avoided unless you have a particularly good reason to use them.