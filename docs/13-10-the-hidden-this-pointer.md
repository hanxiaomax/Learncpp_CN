---
title: 13.10 - 隐藏的this指针
alias: 13.10 - 隐藏的this指针
origin: /the-hidden-this-pointer/
origin_title: "13.10 — The hidden “this” pointer"
time: 2022-9-16
type: translation
tags:
- this
---


新手面向对象程序员经常问的一个关于类的问题是，“当调用成员函数时，C++如何确定调用它的对象？“ 实际上，C++ 使用一个名为 “this”的隐藏指针来跟踪调用成员的对象。

下面是一个保存整数并提供构造函数和访问函数的简单类。注意，这个类不需要析构函数，因为C++自动清理整数成员变量。


```cpp
class Simple
{
private:
    int m_id;

public:
    Simple(int id)
        : m_id{ id }
    {
    }

    void setID(int id) { m_id = id; }
    int getID() { return m_id; }
};
```


下面例子显示了Simple的使用方法：

```cpp
#include <iostream>

int main()
{
    Simple simple{1};
    simple.setID(2);
    std::cout << simple.getID() << '\n';

    return 0;
}
```


程序输出结果如下：

```
2
```

当我们调用 `simple.setID(2);` 时，C++ 就能够知道调用的是`simple` 的 `setID()`，而 `m_id` 则指的是 `simple.m_id` 。接下来让我们看看这背后的工作原理。


## 隐藏的 `*this` 指针

观察上面例子中的这一行代码：

```cpp
simple.setID(2);
```

尽管函数 `setID()` 函数看上去只接受了一个参数，而实际上它接受了两个参数！当程序编译时，编译器会将上述代码转变成下面的形式 ：

```cpp
setID(&simple, 2); // 注意，作为对象的前缀现在变成了函数的实参！
```

注意，上面的代码已经变成了标准的函数调用，simple 对象(以前是一个对象前缀)则通过[[pass-by-address|按地址传递]]的方式传入了函数。

但这只是答案的一半，由于函数调用现在增加了一个实参，因此需要修改成员函数定义才能接受(并使用)这个实参作为形参。因此，下面的成员函数:


```cpp
void setID(int id) { m_id = id; }
```

会被编译器转换为下面的形式：

```cpp
void setID(Simple* const this, int id) { this->m_id = id; }
```

编译器在编译普通的成员函数时，会隐式地为其添加一个新的参数`this`。`this`指针是一个隐藏的常量指针，它保存着该函数对应对象的地址。

此外，还有一点需要注意。在成员函数中，在成员函数中，任何类成员（包括函数和变量）也需要被更新为引用对象的形式。要完成这一点很简单，只需要为它们添加`this->`前缀即可。因此在函数体中，`m_id` (成员变量)被转变成 `this->m_id`。由于 this 指针指向的是`simple`对象的地址，因此 `this->m_id` 会被解析为 `simple.m_id`。

总结一下：

1.  当调用 `simple.setID(2)` 时，编译器实际调用的是`setID(&simple, 2)`；
2.  在 `setID()` 中，this 指针保存着`simple`对象的地址；
3.  `setID()`函数中的任何成员都会被添加 “`this->`” 前缀，所以，对于`m_id = id`这条语句，编译器实际上执行的是 `this->m_id = id`，在这个例子中即将 `simple.m_id` 的值更新为 `id`。

好消息是，所有这些都是自动发生的，你是否记得它是如何工作的并不重要。你只需记住，所有普通成员函数都有一个“this”指针，该指针指向调用函数的对象。


## “this” 指针总是指向操作对象自己


新程序员有时会对存在多少个“this”指针感到困惑。每个成员函数都有一个“this”指针形参，它被设置为正在操作的对象的地址。例如：

```cpp
int main()
{
    Simple A{1}; // this = &A inside the Simple constructor
    Simple B{2}; // this = &B inside the Simple constructor
    A.setID(3); // this = &A inside member function setID
    B.setID(4); // this = &B inside member function setID

    return 0;
}
```

在上面的代码中，this指针交替地指代对象A或者B的地址，取决于调用成员函数的是A还是B。

因为“this”只是一个函数形参，它不会给类增加任何内存使用量(只是给成员函数调用增加内存使用量，因为这个形参需要传递给函数并存储在内存中)。

## 显式地使用 this 指针

大多数情况下，你不需要显式引用“this”指针。然而，在一些情况下直接使用 this 指针也是有用的。

首先，如果构造函数(或成员函数)的形参与成员变量同名，你可以使用" this "来消除歧义：

```cpp
class Something
{
private:
    int data;

public:
    Something(int data)
    {
        this->data = data; // this->data is the member, data is the local parameter
    }
};
```

上面代码中的构造函数，其[[parameters|形参]]和类成员变量同名。在这种情况下，`data`将表示形参，所以你必须使用 “this->data” 来表示成员变量。尽管这么做也是可以被接受的编程风格，但是使用`m_`作为成员变量的前缀就可以从源头上消除这种歧义。


## 链式调用成员函数

另一方面，有时候让类成员函数返回对象本身也是很有用的。这么做的一个主要原因就是可以允许函数的链式调用，使得多个成员函数可以作用于一个相同的对象！其实你已经多次使用该特性了。对于下面这个例子来说，`std::cout` 输出了不止一个字符串。

```cpp
std::cout << "Hello, " << userName;
```


在这个例子中，`std::cout` 其实是一个对象，而运算符 `<<` 是该对象的一个成员函数。编译器会按照下面的方式对上述代码求值：

```cpp
(std::cout << "Hello, ") << userName;
```

首先，`<<`使用 `std::cout` 和字符串字面量 “Hello, ” 将 “Hello, ” 打印到终端。不过，这只是上述表达式的一部分，`<<` 还需要返回一个值（或void）。如果它返回的是 void，则结果会变为下面的形式：

```cpp
(void) << userName;
```

这显然不合逻辑（编译器会抛出错误）。实际上，`<<` 的返回值是`*this`，在上面的语境下，this 就是`std::cout`对象。因此，当第一个`<<`执行完成后，语句等价于如下形式：

```cpp
(std::cout) << userName;
```

上述代码进而会打印用户名。

通过这种方式，我们只需要指定对象一次（此例中为 `std::cout`)，然后每次函数调用都可以把它传递给接下来的函数，是我们可以链式执行多个指令。

在用户自定义类中我们也可以实现上述行为：

```cpp
class Calc
{
private:
    int m_value{0};

public:

    void add(int value) { m_value += value; }
    void sub(int value) { m_value -= value; }
    void mult(int value) { m_value *= value; }

    int getValue() { return m_value; }
};
```

如果你希望先加5，再减3，然后再乘以4，那么可以像下面这样做：

```cpp
#include <iostream>

int main()
{
    Calc calc{};
    calc.add(5); // returns void
    calc.sub(3); // returns void
    calc.mult(4); // returns void

    std::cout << calc.getValue() << '\n';
    return 0;
}
```

不过，如果每个函数都返回 `*this` 的话，在可以链式地调用它们，下面是一个可链式调用的例子：

```cpp
class Calc
{
private:
    int m_value{};

public:
    Calc& add(int value) { m_value += value; return *this; }
    Calc& sub(int value) { m_value -= value; return *this; }
    Calc& mult(int value) { m_value *= value; return *this; }

    int getValue() { return m_value; }
};
```

注意，函数`add()` ，`sub()`和 `mult()` 现在都返回`*this`。这样一来就可以向下面这样调用函数：

```cpp
#include <iostream>

int main()
{
    Calc calc{};
    calc.add(5).sub(3).mult(4);

    std::cout << calc.getValue() << '\n';
    return 0;
}
```

三行代码被压缩成了一行！我们再仔细研究一下它是如何工作的。

首先，调用`calc.add(5)` 将 5 加到 `m_value`，然后返回 `*this`，它是 `calc` 的引用，所以 `calc` 会被用于调用接下来的函数。再接下来，对 `calc.sub(3)` 求值，它将 3 从 `m_value` 减去后，继续返回`calc`。最后，`calc.mult(4)` 将 `m_value` 乘以四并返回`calc`，由于不需要继续调用函数，这个返回值也就被忽略掉了。

因为每个函数都会修改对象 `calc` ，所以`calc`的成员 `m_value` 的值此时为 `(((0 + 5) - 3) * 4)`，即8。

## 小结

“this” 指针是一个被编译器隐式添加到非静态成员函数的隐藏参数。多数情况下你并不会直接访问它，但是当有需要时你会用的着的。需要注意的是，this是一个常量指针，你可以通过它修改它所指的对象，但是你不能让它指向别的对象。

如果我们让原本返回 void 的函数返回`*this`，则可以使这些函数能够被链式调用。==通常在重载类的运算符时会用到这个特性==（14章中会详细介绍运算符重载）。