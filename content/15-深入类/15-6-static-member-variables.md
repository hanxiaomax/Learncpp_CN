---
title: 15.6 - 静态成员变量
alias: 15.6 - 静态成员变量
origin: /static-member-variables/
origin_title: "13.13 — Static member variables"
time: 2022-9-16
type: translation
tags:
- class
- static member variable
---

## 重温 static 关键字

在 [[7-11-Static-local-variables|6.10 - 静态局部变量]] 中我们学习了 `static` 关键字，它可以定义一个变量并确保它不会在[[going-out-of-scope|离开作用域]]后被销毁，例如：

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


```
2
1
```

使用 `static` 关键字可以创建静态成员变量。和普通成员变量不同的是，静态成员变量在同一个类的对象间是共享的。考虑下面代码：

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


输出结果如下：

```
2
2
```

因为 `s_value` 是静态成员变量，所以 `s_value` 在各个对象间是共享的。其结果就是，`first.s_value` is 与 `second.s_value` 实际上是同一个。因此在上面的代码中我们可以通过`first`设置`s_value`的值，并通过`second`访问它。

## 静态成员变量并不和类对象关联


尽管你可以通过对象来访问静态成员(例如：`first.s_value` 和  `second.s_value`)，但实际上这些静态成员在对象被实例化前就存在了。它们更像是全局变量，会在程序启动时创建，在程序退出时销毁。

因此，最好认为静态成员是属于类本身的，而不是类的某个实例对象。因为 `s_value` 独立于任何类对象而存在，所以可以直接使用类名和[[scope-resolution-operator|作用域解析运算符]](在本例中为`Something::s_value`)访问它:


```cpp
#include <iostream>

class Something
{
public:
    static int s_value; // 声明静态成员变量
};

int Something::s_value{ 1 }; // 定义静态成员变量
int main()
{
    // 注意：没有实例化任何对象
    
    Something::s_value = 2;
    std::cout << Something::s_value << '\n';
    return 0;
}
```

在上面的例子中，`s_value` 是使用类名进行访问的，而没有通过任何该类的变量去访问。我们甚至都还没有实例化任何该类的对象，但是仍然可以通过`Something::s_value` 来访问它。这种方式是更为推荐的使用静态成员的方法。

> [!success] "最佳实践"
> 通过类名（和作用域解析运算符）来访问静态成员变量而不是通过对象来访问（使用成员选择运算符）。
	
## 定义和初始化静态成员变量

当我们在类内部**声明**静态成员变量时，我们是在告诉编译器静态成员变量的存在，而不是真正定义它(类似[[forward-declaration|前向声明]])。因为静态成员变量不是单个类对象的一部分(它们与全局变量处理相似，并在程序启动时初始化)，所以必须在类外部的全局作用域中显式地定义静态成员。

在上面的例子中，我们通过这一行来实现静态成员的定义

```cpp
int Something::s_value{ 1 }; // 定义静态成员变量
```

这一行有两个目的：实例化静态成员变量(就像全局变量一样)，并可选地初始化它。在本例中，我们提供了初始化值1。如果没有提供初始化值，C++将该值初始化为0。

注意，静态成员的**定义**不受[[access-specifiers|成员访问修饰符]]的限制，您可以定义和初始化变量，即使它在类中声明为private(或protected)。

如果类定义在头文件中，静态成员定义通常放在类的相关代码文件中(例如`Something.cpp`)。如果类定义在`.cpp`文件中，则静态成员定义通常直接放在类的下面。不要将静态成员定义放在头文件中(很像全局变量，如果头文件被包含不止一次，最终将得到多个定义，这将导致链接器错误)。


## 静态成员变量的内联初始化

有一些捷径可以实现上述目标。首先，当静态成员是const整型类型(包括char和bool)或const enum时，可以在类定义中初始化静态成员:

```cpp
class Whatever
{
public:
    static const int s_value{ 4 }; // a static const int can be declared and initialized directly
};
```


在上面的例子中，因为静态成员变量是 const 的，所以不需要显式地定义它。

其次，`static constexpr` 成员可以在类定义中初始化：

```cpp
#include <array>

class Whatever
{
public:
    static constexpr double s_value{ 2.2 }; // ok
    static constexpr std::array<int, 3> s_array{ 1, 2, 3 }; // this even works for classes that support constexpr initialization
};
```


最后，对于 C++17 来说，非 const 静态成员也可以在类定义中内联地初始化：

```cpp
class Whatever
{
public:
    static inline int s_value{ 4 }; // a static inline int can be declared and initialized directly (C++17)
};
```


## 静态成员变量案例

为什么我们要在类中使用静态变量呢？一个比较有用的例子是为类的每个实例设置一个唯一的ID，请看下面的例子：

```cpp
#include <iostream>

class Something
{
private:
    static inline int s_idGenerator { 1 }; // C++17
//  static int s_idGenerator;              // 在 C++14 或之前的版本中使用这一行代码
    int m_id { };

public:
    Something()
    : m_id { s_idGenerator++ } // 从 id 生成器获取下一个 id
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

程序输出结果：

```
1
2
3
```

因为 `s_idGenerator` 由所有 `Something` 对象共享，所以当创建一个新的 `Something` 对象时，构造函数从 `s_idGenerator` 中获取当前值，将其递增后作为下一个对象的ID。这保证了每个实例化的 `Something` 对象可以获取唯一的id(按创建顺序递增)。这在调试数组中的多个项时非常有帮助，因为它提供了一种方法来区分具有相同类类型的多个对象!

当类需要创建类内部的查找表(例如，用于存储一组预计算值的数组)时，静态成员变量也很有用。通过将查找表设置为静态的，所有对象只存在一个副本，而不是为每个实例化的对象都创建一个副本。这可以节省大量的内存。


