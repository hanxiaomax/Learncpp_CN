---
title: 13.7 - 非静态成员初始化
alias: 13.7 - 非静态成员初始化
origin: /non-static-member-initialization/
origin_title: "13.7 — Non-static member initialization"
time: 2022-9-16
type: translation
tags:
- static member
- initialization
---

当编写具有多个构造函数(即大多数构造函数)的类时，在每个构造函数中都为所有成员指定默认值会产生冗余代码，而且如果更新成员的默认值，则需要修改所有的构造函数。

可以直接给普通的类成员变量(那些不使用static关键字的变量)一个默认初始化值：

```cpp
#include <iostream>

class Rectangle
{
private:
    double m_length{ 1.0 }; // m_length 具有默认值 1.0
    double m_width{ 1.0 }; // m_width 具有默认值 1.0

public:
    void print()
    {
        std::cout << "length: " << m_length << ", width: " << m_width << '\n';
    }
};

int main()
{
    Rectangle x{}; // x.m_length = 1.0, x.m_width = 1.0
    x.print();

    return 0;
}
```

程序输出结果：

```
length: 1.0, width: 1.0
```

非静态成员初始化(也称为类内成员初始化)为成员变量提供默认值，如果构造函数不为成员本身提供初始化值(通过成员初始化列表)，则构造函数将使用这些默认值。

不过，决定对象创建的仍然是构造函数。考虑下面的例子：

```cpp
#include <iostream>

class Rectangle
{
private:
    double m_length{ 1.0 };
    double m_width{ 1.0 };

public:

    // 注意：没有默认构造函数

    Rectangle(double length, double width)
        : m_length{ length },
          m_width{ width }
    {
        // m_length 和 m_width 会被构造函数初始化（不会使用它们的默认值）
    }

    void print()
    {
        std::cout << "length: " << m_length << ", width: " << m_width << '\n';
    }

};

int main()
{
    Rectangle x{}; // 无法编译，因为不存在默认构造函数，即使成员具有默认值

    return 0;
}
```

尽管我们为所有成员提供了默认值，但由于没有提供默认构造函数，因此无法创建不带参数的 Rectangle 对象。

如果提供了默认初始化值，且构造函数通过成员初始化列表初始化成员，则优先使用成员初始化列表。下面的例子说明了这一点：

```cpp
#include <iostream>

class Rectangle
{
private:
    double m_length{ 1.0 };
    double m_width{ 1.0 };

public:

    Rectangle(double length, double width)
        : m_length{ length },
          m_width{ width }
    {
        // m_length 和 m_width 会被构造函数初始化（不会使用它们的默认值）
    }

    Rectangle(double length)
        : m_length{ length }
    {
        // m_length 被构造函数初始化
        // m_width 则使用默认值 1.0
    }

    void print()
    {
        std::cout << "length: " << m_length << ", width: " << m_width << '\n';
    }

};

int main()
{
    Rectangle x{ 2.0, 3.0 };
    x.print();

    Rectangle y{ 4.0 };
    y.print();

    return 0;
}
```

```
length: 2.0, width: 3.0
length: 4.0, width: 1.0
```

注意，使用非静态成员初始化来初始化成员需要使用等号或大括号(统一)初始化式——**圆括号初始化形式**在这里不起作用:

```cpp
class A
{
    int m_a = 1;  // ok (拷贝初始化)
    int m_b{ 2 }; // ok (大括号初始化)
    int m_c(3);   // 无效 (圆括号初始化)
};
```

COPY

!!! note "法则"

	推荐使用非静态成员初始化来为成员变量提供默认值。
