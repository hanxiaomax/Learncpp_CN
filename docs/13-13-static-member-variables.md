---
title: 13.13 - 静态成员变量
alias: 13.13 - 静态成员变量
origin: /static-member-variables/
origin_title: "13.13 — Static member variables"
time: 2022-9-16
type: translation
tags:
- class
- static member variable
---

## 重温 static 关键字

在 [[6-10-Static-local-variables|6.10 - 静态局部变量]] 中我们学习了 `static` 关键字，它可以定义一个变量并确保它不会在[[going-out-of-scope|离开作用域]]后被销毁，例如：

```cpp
#include <iostream>

int generateID()
{
    static int s_id{ 0 };
    return ++s_id;
}

int main()
{
    std::cout << generateID() << '\n';
    std::cout << generateID() << '\n';
    std::cout << generateID() << '\n';

    return 0;
}
```

打印结果：

```
1
2
3
```

注意，`s_id` 的值在多次函数调用间得以保留。

`static` 关键字在用于[[global-variable|全局变量]]时，还有另外的含义—— 它会赋予该变量[[internal-linkage|内部链接]]属性（不能在定义它们的文件外使用）。因为全局变量应该被杜绝，所以`static`的这方面应用并不常见。

## 静态成员变量

`static` 关键字在应用于类成员时，有两个额外的用途：[[static-member-variables|静态成员变量]]和[[static-member-functions|静态成员函数]]。不过，这两种`static`用法都非常简单直接。我们会在本章介绍静态成员变量，然后在下一章介绍静态成员函数。

在开始学习为成员变量添加`static`关键字之前，请先考虑下面的类：

```cpp
#include <iostream>

class Something
{
public:
    int m_value{ 1 };
};

int main()
{
    Something first;
    Something second;

    first.m_value = 2;

    std::cout << first.m_value << '\n';
    std::cout << second.m_value << '\n';

    return 0;
}
```

当我们实例化对象的时候，对象各自创建其成员函数的一份拷贝。在这个例子中，因为我们创建了两个 `Something` 类型的对象，最终我们会得到两份 `m_value`: `first.m_value`和`second.m_value`。它们两个是各自独立的，因此上述程序的输出结果为：


2
1

Member variables of a class can be made static by using the static keyword. Unlike normal member variables, static member variables are shared by all objects of the class. Consider the following program, similar to the above:

```cpp
#include <iostream>

class Something
{
public:
    static int s_value;
};

int Something::s_value{ 1 };

int main()
{
    Something first;
    Something second;

    first.s_value = 2;

    std::cout << first.s_value << '\n';
    std::cout << second.s_value << '\n';
    return 0;
}
```

COPY

This program produces the following output:

2
2

Because s_value is a static member variable, s_value is shared between all objects of the class. Consequently, first.s_value is the same variable as second.s_value. The above program shows that the value we set using first can be accessed using second!

## 静态成员变量并不和类对象关联


Although you can access static members through objects of the class (as shown with first.s_value and second.s_value in the example above), it turns out that static members exist even if no objects of the class have been instantiated! Much like global variables, they are created when the program starts, and destroyed when the program ends.

Consequently, it is better to think of static members as belonging to the class itself, not to the objects of the class. Because s_value exists independently of any class objects, it can be accessed directly using the class name and the scope resolution operator (in this case, Something::s_value):

```cpp
#include <iostream>

class Something
{
public:
    static int s_value; // declares the static member variable
};

int Something::s_value{ 1 }; // defines the static member variable (we'll discuss this section below)

int main()
{
    // note: we're not instantiating any objects of type Something

    Something::s_value = 2;
    std::cout << Something::s_value << '\n';
    return 0;
}
```

COPY

In the above snippet, s_value is referenced by class name rather than through an object. Note that we have not even instantiated an object of type Something, but we are still able to access and use Something::s_value. This is the preferred method for accessing static members.

!!! success "最佳实践"

	Access static members by class name (using the scope resolution operator) rather than through an object of the class (using the member selection operator).

## 定义和初始化静态成员变量


When we declare a static member variable inside a class, we’re telling the compiler about the existence of a static member variable, but not actually defining it (much like a forward declaration). Because static member variables are not part of the individual class objects (they are treated similarly to global variables, and get initialized when the program starts), you must explicitly define the static member outside of the class, in the global scope.

In the example above, we do so via this line:

```cpp
int Something::s_value{ 1 }; // defines the static member variable
```

COPY

This line serves two purposes: it instantiates the static member variable (just like a global variable), and optionally initializes it. In this case, we’re providing the initialization value 1. If no initializer is provided, C++ initializes the value to 0.

Note that this static member definition is not subject to access controls: you can define and initialize the variable even if it’s declared as private (or protected) in the class.

If the class is defined in a .h file, the static member definition is usually placed in the associated code file for the class (e.g. Something.cpp). If the class is defined in a .cpp file, the static member definition is usually placed directly underneath the class. Do not put the static member definition in a header file (much like a global variable, if that header file gets included more than once, you’ll end up with multiple definitions, which will cause a linker error).

## 静态成员变量的内联初始化

There are a few shortcuts to the above. First, when the static member is a const integral type (which includes char and bool) or a const enum, the static member can be initialized inside the class definition:

```cpp
class Whatever
{
public:
    static const int s_value{ 4 }; // a static const int can be declared and initialized directly
};
```

COPY

In the above example, because the static member variable is a const int, no explicit definition line is needed.

Second, static constexpr members can be initialized inside the class definition:

```cpp
#include <array>

class Whatever
{
public:
    static constexpr double s_value{ 2.2 }; // ok
    static constexpr std::array<int, 3> s_array{ 1, 2, 3 }; // this even works for classes that support constexpr initialization
};
```

COPY

Finally, as of C++17, we can also initialize non-const static members in the class definition by declaring them inline:

```cpp
class Whatever
{
public:
    static inline int s_value{ 4 }; // a static inline int can be declared and initialized directly (C++17)
};
```

COPY

## 静态成员变量案例

Why use static variables inside classes? One useful example is to assign a unique ID to every instance of the class. Here’s an example of that:

```cpp
#include <iostream>

class Something
{
private:
    static inline int s_idGenerator { 1 }; // C++17
//  static int s_idGenerator;              // Use this instead for C++14 or older
    int m_id { };

public:
    Something()
    : m_id { s_idGenerator++ } // grab the next value from the id generator
    {}

    int getID() const { return m_id; }
};

// For C++14 or older, we have to initialize the non-const static member outside the class definition
// Note that we're defining and initializing s_idGenerator even though it is declared as private above.
// This is okay since the definition isn't subject to access controls.
// int Something::s_idGenerator { 1 }; // start our ID generator with value 1 (uncomment for C++14 or older)

int main()
{
    Something first;
    Something second;
    Something third;

    std::cout << first.getID() << '\n';
    std::cout << second.getID() << '\n';
    std::cout << third.getID() << '\n';
    return 0;
}
```

COPY

This program prints:

```
1
2
3
```

Because s_idGenerator is shared by all Something objects, when a new Something object is created, the constructor grabs the current value out of s_idGenerator and then increments the value for the next object. This guarantees that each instantiated Something object receives a unique id (incremented in the order of creation). This can really help when debugging multiple items in an array, as it provides a way to tell multiple objects of the same class type apart!

Static member variables can also be useful when the class needs to utilize an internal lookup table (e.g. an array used to store a set of pre-calculated values). By making the lookup table static, only one copy exists for all objects, rather than making a copy for each object instantiated. This can save substantial amounts of memory.

