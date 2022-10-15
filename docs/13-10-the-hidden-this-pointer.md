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

会被编译器zhuan'h

```cpp
void setID(Simple* const this, int id) { this->m_id = id; }
```

COPY

When the compiler compiles a normal member function, it implicitly adds a new parameter to the function named “this”. The **this pointer** is a hidden const pointer that holds the address of the object the member function was called on.

There’s just one more detail to take care of. Inside the member function, any class members (functions and variables) also need to be updated so they refer to the object the member function was called on. This is easily done by adding a “this->” prefix to each of them. Thus, in the body of function setID(), `m_id` (which is a class member variable) has been converted to `this->m_id`. Thus, when “this” points to the address of simple, this->m_id will resolve to simple.m_id.

Putting it all together:

1.  When we call `simple.setID(2)`, the compiler actually calls setID(&simple, 2).
2.  Inside setID(), the “this” pointer holds the address of object simple.
3.  Any member variables inside setID() are prefixed with “this->”. So when we say `m_id = id`, the compiler is actually executing `this->m_id = id`, which in this case updates simple.m_id to id.

The good news is that all of this happens automatically, and it doesn’t really matter whether you remember how it works or not. All you need to remember is that all normal member functions have a “this” pointer that refers to the object the function was called on.

## “this” always points to the object being operated on

New programmers are sometimes confused about how many “this” pointers exist. Each member function has a “this” pointer parameter that is set to the address of the object being operated on. Consider:

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

COPY

Note that the “this” pointer alternately holds the address of object A or B depending on whether we’ve called a member function on object A or B.

Because “this” is just a function parameter, it doesn’t add any memory usage to your class (just to the member function call, since that parameter needs to be passed to the function and stored in memory).

## 显式地使用 this 指针

Most of the time, you never need to explicitly reference the “this” pointer. However, there are a few occasions where doing so can be useful:

First, if you have a constructor (or member function) that has a parameter with the same name as a member variable, you can disambiguate them by using “this”:

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

COPY

Note that our constructor is taking a parameter of the same name as a member variable. In this case, “data” refers to the parameter, and “this->data” refers to the member variable. Although this is acceptable coding practice, we find using the “m_” prefix on all member variable names provides a better solution by preventing duplicate names altogether!

Some developers prefer to explicitly add this-> to all class members. We recommend that you avoid doing so, as it tends to make your code less readable for little benefit. Using the m_ prefix is a more readable way to differentiate member variables from non-member (local) variables.

## 链式调用成员函数

Second, it can sometimes be useful to have a class member function return the object it was working with as a return value. The primary reason to do this is to allow a series of member functions to be “chained” together, so several member functions can be called on the same object! You’ve actually been doing this for a long time. Consider this common example where you’re outputting more than one bit of text using `std::cout`:

```cpp
std::cout << "Hello, " << userName;
```


In this case, std::cout is an object, and operator<< is a member function that operates on that object. The compiler evaluates the above snippet like this:

```cpp
(std::cout << "Hello, ") << userName;
```


First, operator<< uses std::cout and the string literal “Hello, ” to print “Hello, ” to the console. However, since this is part of an expression, operator<< also needs to return a value (or void). If operator<< returned void, you’d end up with this:

```cpp
(void) << userName;
```


which clearly doesn’t make any sense (and the compiler would throw an error). Instead, operator<< returns *this, which in this context is the std::cout object. That way, after the first operator<< has been evaluated, we get:

```cpp
(std::cout) << userName;
```


which then prints the user’s name.

In this way, we only need to specify the object (in this case, std::cout) once, and each function call passes it on to the next function to work with, allowing us to chain multiple commands together.

We can implement this kind of behavior ourselves. Consider the following class:

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

COPY

If you wanted to add 5, subtract 3, and multiply by 4, you’d have to do this:

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

COPY

However, if we make each function return *this, we can chain the calls together. Here is the new version of Calc with “chainable” functions:

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

COPY

Note that add(), sub() and mult() are now returning *this. Consequently, this allows us to do the following:

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

COPY

We have effectively condensed three lines into one expression! Let’s take a closer look at how this works.

First, calc.add(5) is called, which adds 5 to our m_value. add() then returns *this, which is just a reference to calc, so calc will be the object used in the subsequent evaluation. Next calc.sub(3) evaluates, which subtracts 3 from m_value and again returns calc. Finally, calc.mult(4) multiplies m_value by 4 and returns calc, which isn’t used further, and is thus ignored.

Since each function modified calc as it was executed, calc’s m_value now contains the value (((0 + 5) - 3) * 4), which is 8.

## 小结

The “this” pointer is a hidden parameter implicitly added to any non-static member function. Most of the time, you will not need to access it directly, but you can if needed. It’s worth noting that “this” is a const pointer -- you can change the value of the underlying object it points to, but you can not make it point to something else!

By having functions that would otherwise return void return *this instead, you can make those functions chainable. This is most often used when overloading operators for your classes (something we’ll talk about more in [chapter 14](https://www.learncpp.com/#Chapter14)).