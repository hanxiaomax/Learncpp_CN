---
title: 13.6 - 构造函数成员初始化值列表
alias: 13.6 - 构造函数成员初始化值列表
origin: /constructor-member-initializer-lists/
origin_title: "13.6 — Constructor member initializer lists"
time: 2022-9-16
type: translation
tags:
- constructors
- initialization
---

在上一节课中，为了简化问题，我们在构造函数中使用赋值运算符对成员变量进行初始化。例如：

```cpp
class Something
{
private:
    int m_value1 {};
    double m_value2 {};
    char m_value3 {};

public:
    Something()
    {
        // 都属于赋值，而不是初始化
        m_value1 = 1;
        m_value2 = 2.2;
        m_value3 = 'c';
    }
};
```

当构造函数执行时，`m_value1`，`m_value2` 和 `m_value3` 首先被创建。然后执行构造函数的函数体，对成员变量进行赋值。上面的过程和之前的非面向对象程序是非常类似：

```cpp
int m_value1 {};
double m_value2 {};
char m_value3 {};

m_value1 = 1;
m_value2 = 2.2;
m_value3 = 'c';
```

尽管合乎语法，但是上述代码并不具有良好的编程风格（而且效率相较于初始化是不佳的）。

不过，在前面的课程中我们提到过，有些类型的变量（例如const变量或[[lvalue-reference|引用]]）。考虑下面的例子：

```cpp
class Something
{
private:
    const int m_value;

public:
    Something()
    {
        m_value = 1; // 错误: const 变量不能被赋值
    }
};
```

上述代码等价于下面的代码：

```cpp
const int m_value; // error: const vars must be initialized with a value
m_value = 5; //  error: const vars can not be assigned to
```

在构造函数内部对 const 变量或引用赋值显然不是一个可行的办法。


## 成员初始化列表

为了解决这个问题，C++ 提供了一种对成员变量进行初始化（而不是在创建后赋值）的方法，即使用[[member-initializer-list|成员初始化值列表]] 。请不要把成员初始化值列表和用于对数组进行赋值的[[initializer-list|初始化值列表]]搞混。

在[[1-4-Variable-assignment-and-initialization|1.4 - 变量赋值和初始化]]中我们介绍过，初始化变量的方式有三种：[[copy-initialization|拷贝初始化]]、[[direct-initialization|直接初始化]]和[[uniform-initialization|统一初始化]]。

```cpp
int value1 = 1; // copy initialization
double value2(2.2); // direct initialization
char value3 {'c'}; // uniform initialization
```

使用初始化列表进行初始化基本上和[[direct-initialization|直接初始化]]或[[uniform-initialization|统一初始化]]是完全一致的。

举个例子就更容易理解了。还记得之前为变量赋值的构造函数吗？

```cpp
class Something
{
private:
    int m_value1 {};
    double m_value2 {};
    char m_value3 {};

public:
    Something()
    {
        // 都是赋值，而不是初始化
        m_value1 = 1;
        m_value2 = 2.2;
        m_value3 = 'c';
    }
};
```

接下来，重写函数，使用成员初始化值列表来初始化：

```cpp
#include <iostream>

class Something
{
private:
    int m_value1 {};
    double m_value2 {};
    char m_value3 {};

public:
    Something() : m_value1{ 1 }, m_value2{ 2.2 }, m_value3{ 'c' } // Initialize our member variables
    {
    // No need for assignment here
    }

    void print()
    {
         std::cout << "Something(" << m_value1 << ", " << m_value2 << ", " << m_value3 << ")\n";
    }
};

int main()
{
    Something something{};
    something.print();
    return 0;
}
```

输出结果：

```
Something(1, 2.2, c)
```

成员初始化值列表位于构造函数参数列表后，以冒号`:`开头，后面是一系列变量和它们的初始化值（使用逗号分隔）。

注意，函数体内不再需要对变量进行赋值，因为初始化的工作已经由成员初始化值列表完成。同时还需要注意的是，成员初始化值列表后面并没有分号。

当然，如果能够通过构造函数来传递初始化值则会更有用：

```cpp
#include <iostream>

class Something
{
private:
    int m_value1 {};
    double m_value2 {};
    char m_value3 {};

public:
    Something(int value1, double value2, char value3='c')
        : m_value1{ value1 }, m_value2{ value2 }, m_value3{ value3 } // 直接初始化成员变量
    {
    // No need for assignment here
    }

    void print()
    {
         std::cout << "Something(" << m_value1 << ", " << m_value2 << ", " << m_value3 << ")\n";
    }

};

int main()
{
    Something something{ 1, 2.2 }; // value1 = 1, value2=2.2, value3 使用默认值 'c'
    something.print();
    return 0;
}
```

输出结果：

```
Something(1, 2.2, c)
```

注意，你可以使用默认形参来提供默认值，防止用户没有传递参数。

> [!success] "最佳实践"
> 使用成员初始化值列表对成员进行初始化而不是依次为其赋值。


## 初始化 const 类型成员变量

类可以包含 const 类型的成员变量。const 成员变量和一般的 const 变量没什么区别——它们都必须被初始化，初始化后其值将不能被改变。

我们可以使用构造函数的初始化列表对 const 类型的变量进行初始化（和非const成员一样），而且初始化值可以是常数也可以不是。

下例中的类，包含一个 const 类型的变量。我们使用构造函数的成员初始化列表对其进行初始化（使用用户提供的非const值）。

```cpp
#include <iostream>

class Something
{
private:
	const int m_value;

public:
	Something(int x) : m_value{ x } // directly initialize our const member variable
	{
	}

	void print()
	{
		std::cout << "Something(" << m_value << ")\n";
	}
};

int main()
{
	std::cout << "Enter an integer: ";
	int x{};
	std::cin >> x;

	Something s{ x };
	s.print();

	return 0;
}
```


程序的输出结果：

```
Enter an integer: 4
Something(4)
```

> [!note] "法则"
> `Const` 成员变量必须被初始化。

## 使用成员初始化列表初始化数组类型成员

下面例子中的类包含一个数组类型的成员：

```cpp
class Something
{
private:
    const int m_array[5];

};
```

在 C++11 之前，你只能通过成员初始化列表，对数组成员进行0初始化：

```cpp
class Something
{
private:
    const int m_array[5];

public:
    Something(): m_array {} // zero initialize the member array
    {
    }

};
```

不过，从C++11开始，你可以使用[[uniform-initialization|统一初始化]]对数组成员进行初始化了：

```cpp
class Something
{
private:
    const int m_array[5];

public:
    Something(): m_array { 1, 2, 3, 4, 5 } // use uniform initialization to initialize our member array
    {
    }

};
```


## 初始化类类型的成员变量

成员初始化列表也可用于类类型成员变量的初始化：


```cpp
#include <iostream>

class A
{
public:
    A(int x = 0) { std::cout << "A " << x << '\n'; }
};

class B
{
private:
    A m_a {};
public:
    B(int y)
        : m_a{ y - 1 } // call A(int) constructor to initialize member m_a
    {
        std::cout << "B " << y << '\n';
    }
};

int main()
{
    B b{ 5 };
    return 0;
}
```

输出结果：

```
A 4
B 5
```

当构造变量b时，用值5调用 `B(int)`构造函数。在构造函数的函数体执行之前，`m_a` 被初始化，调用值为4的`A(int)`构造函数，打印出“A 4”。然后控制返回到B构造函数，执行B构造函数的主体，打印“B 5”。


## 初始化列表排版

C++ 允许程序员灵活地排版初始化值列表。虽然你也可按照自己的喜好排版，但是我们推荐以下的方式：

如果函数名同一行中可以放得下初始化值列表，则将它们都放在这一行：

```cpp
class Something
{
private:
    int m_value1 {};
    double m_value2 {};
    char m_value3 {};

public:
    Something() : m_value1{ 1 }, m_value2{ 2.2 }, m_value3{ 'c' } // everything on one line
    {
    }
};
```

如果放不下，则在下一行中缩进放置。

```cpp
class Something
{
private:
    int m_value1;
    double m_value2;
    char m_value3;

public:
    Something(int value1, double value2, char value3='c') // 函数名这一行已经够长了
        : m_value1{ value1 }, m_value2{ value2 }, m_value3{ value3 } // 所以将初始化列表放在下一行
    {
    }

};
```

如果这样也不能将初始化值列表放在一行，则通过空格排版，每行一个初始化值：

```cpp
class Something
{
private:
    int m_value1 {};
    double m_value2 {};
    char m_value3 {};
    float m_value4 {};

public:
    Something(int value1, double value2, char value3='c', float value4=34.6f) // this line already has a lot of stuff on it
        : m_value1{ value1 } // one per line
        , m_value2{ value2 }
        , m_value3{ value3 }
        , m_value4{ value4 }
    {
    }

};
```


## 初始化列表的顺序

令人惊讶的是，初始化列表中的变量并不会按照它们在初始化列表中指定的顺序初始化。实际上，它们将按照在变量在类中声明的顺序进行初始化。

为了取得最佳的效果，请遵循以下建议：

1. 初始化成员变量，不要使它们依赖于其他成员变量的初始化(换句话说，确保即使初始化顺序不同，也能正确初始化成员变量)。
2. 按照在类中声明变量的相同顺序编写初始化列表。只要遵循了前面的建议，这不是严格要求的，但是如果你不这样做，并且打开了所有的警告，编译器可能会产生警告。


## 小结

成员初始化列表对类成员进行初始化，而不是为它们赋值。这是初始化某些类型变量的(如const或reference成员)的唯一方法，而且它比在构造函数体中赋值性能更好。成员初始化器列表既适用于基本类型，也适用于作为类本身的成员。
