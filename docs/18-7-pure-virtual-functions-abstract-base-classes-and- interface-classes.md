---
title: 18.7 - 纯虚函数，抽象基类和接口类
alias: 18.7 - 纯虚函数，抽象基类和接口类
origin: /pure-virtual-functions-abstract-base-classes-and-interface-classes/
origin_title: "18.7 — Pure virtual functions, abstract base classes, and interface classes"
time: 2022-9-30
type: translation
tags:
- pure-virtual-functions
- abstract-base-classes
- interface-classes
---

??? note "关键点速记"




## 纯虚（抽象）函数和纯虚基类

到目前位置，我们看到的[[virtual-function|虚函数]]都是由函数体（函数定义）的。但是，C++ 允许我们创建一种特殊的虚函数——[[pure-virtual|纯虚函数]]（抽象函数），它没有函数体！纯虚函数只是一个占位而已，它必须在[[derived-class|派生类]]中重定义。

创建纯虚函数，不需要定义函数体，只需要将函数赋值为0即可。

```cpp
class Base
{
public:
    const char* sayHi() const { return "Hi"; } // 普通函数

    virtual const char* getName() const { return "Base"; } // 普通虚函数

    virtual int getValue() const = 0; // 纯虚函数

    int doSomething() = 0; // 编译错误: 不能给非虚函数赋值为0
};
```

当我们向类中添加一个纯虚函数时，实际上是在说，“要由派生类来实现这个函数”。

使用纯虚函数有两个主要后果：首先，任何具有一个或多个纯虚函数的类都变成了[[abstract-class|抽象类]]，这意味着它不能被实例化！考虑一下，如果我们可以创建一个`Base`实例会发生什么:


```cpp
int main()
{
    Base base; // We can't instantiate an abstract base class, but for the sake of example, pretend this was allowed
    base.getValue(); // what would this do?

    return 0;
}
```


因为没有 `getValue()` 的定义，那么 `base.getValue()` 应该如何解析？

第二，任何派生类都必须为这个函数定义一个主体，否则派生类也会被认为是一个抽象基类。


## 一个纯虚函数的例子

让我们看一个纯虚函数的例子。在上一课中，我们编写了一个简单的`Animal`基类，并从中派生了`Cat`和`Dog`类：


```cpp
#include <string>

class Animal
{
protected:
    std::string m_name;

    // We're making this constructor protected because
    // we don't want people creating Animal objects directly,
    // but we still want derived classes to be able to use it.
    Animal(const std::string& name)
        : m_name{ name }
    {
    }

public:
    std::string getName() const { return m_name; }
    virtual const char* speak() const { return "???"; }

    virtual ~Animal() = default; //默认析构函数（虚函数）
};

class Cat: public Animal
{
public:
    Cat(const std::string& name)
        : Animal{ name }
    {
    }

    const char* speak() const override { return "Meow"; }
};

class Dog: public Animal
{
public:
    Dog(const std::string& name)
        : Animal{ name }
    {
    }

    const char* speak() const override { return "Woof"; }
};
```


我们将构造函数定义为[[protected-members|受保护成员]]以防止分配`Animal`类型的对象。但是，仍然可以创建不重新定义 `speak()` 的派生类。


例如：

```cpp
#include <iostream>
#include <string>

class Cow : public Animal
{
public:
    Cow(const std::string& name)
        : Animal{ name }
    {
    }

    // 没有重新定义 speak
};

int main()
{
    Cow cow{"Betsy"};
    std::cout << cow.getName() << " says " << cow.speak() << '\n';

    return 0;
}
```

打印结果：

```
Betsy says ???
```


发生了什么事?我们忘记重新定义函数speak()，所以`cow.Speak()`解析为`Animal.speak()`，这不是我们想要的。

解决这个问题的一个更好的办法是使用纯虚函数：我们通过将构造函数定义为[[protected-members|受保护成员]]，放置人为地分配`Animal`类型的对象。但是，仍然可以创建不重新定义`speak()`的派生类。


```cpp
#include <string>

class Animal // Animal 是一个抽象类
{
protected:
    std::string m_name;

public:
    Animal(const std::string& name)
        : m_name{ name }
    {
    }

    const std::string& getName() const { return m_name; }
    virtual const char* speak() const = 0; // 纯虚函数

    virtual ~Animal() = default;
};
```

这里有几点需要注意。首先，`speak()` 现在是一个纯虚函数。这意味着`Animal`现在是一个抽象基类，不能被实例化。因此，我们不需要将构造函数定义为受保护成员(尽管这样做没有坏处)。第二，因为我们的`Cow`类是从`Animal`派生的，但是我们没有定义`Cow::speak()`，所以`Cow`也是一个抽象基类。现在，当我们试图编译这段代码时:


```cpp
#include <iostream>

class Cow: public Animal
{
public:
    Cow(const std::string& name)
        : Animal{ name }
    {
    }

    // We forgot to redefine speak
};

int main()
{
    Cow cow{ "Betsy" };
    std::cout << cow.getName() << " says " << cow.speak() << '\n';

    return 0;
}
```


编译器会给我们一个警告，因为`Cow`是一个抽象基类，我们不能创建抽象基类的实例(行号是错误的，因为上面的例子中省略了`Animal`类):

```bash
(33): error C2259: 'Cow': cannot instantiate abstract class
(20): note: see declaration of 'Cow'
(33): note: due to following members:
(33): note: 'const char *Animal::speak(void) const': is abstract
(15): note: see declaration of 'Animal::speak'
```

上面信息表明，只有当`Cow`为`speak()`提供了定义，`Cow`才能够被实例化。

让我们继续这样做：

```cpp
#include <iostream>
#include <string>

class Animal // This Animal is an abstract base class
{
protected:
    std::string m_name;

public:
    Animal(const std::string& name)
        : m_name{ name }
    {
    }

    const std::string& getName() const { return m_name; }
    virtual const char* speak() const = 0; // note that speak is now a pure virtual function

    virtual ~Animal() = default;
};

class Cow: public Animal
{
public:
    Cow(const std::string& name)
        : Animal(name)
    {
    }

    const char* speak() const override { return "Moo"; }
};

int main()
{
    Cow cow{ "Betsy" };
    std::cout << cow.getName() << " says " << cow.speak() << '\n';

    return 0;
}
```

编译并运行程序：

```
Betsy says Moo
```

==当我们有一个想要放在基类中的函数，但只有派生类知道它应该返回什么时，纯虚函数是有用的==。纯虚函数使得基类不能被实例化，派生类在被实例化之前必须定义这些函数。这有助于确保派生类不会忘记重新定义基类希望它们重新定义的函数。

就像普通虚函数一样，纯虚函数可以使用基类的引用(或指针)来调用:

```cpp
int main()
{
    Cow cow{ "Betsy" };
    Animal& a{ cow };

    std::cout << a.speak(); // resolves to Cow::speak(), prints "Moo"

    return 0;
}
```

在上面的例子中，`a.speak()` 通过虚函数解析解析为 `Cow::speak()` 。

由于带有纯虚函数的类具有虚函数，所以不要忘记将析构函数也设置为虚函数。


## 有函数体（定义）的纯虚函数

事实证明我们可以创建具有函数体的纯虚函数：

```cpp
#include <string>

class Animal // This Animal is an abstract base class
{
protected:
    std::string m_name;

public:
    Animal(const std::string& name)
        : m_name{ name }
    {
    }

    std::string getName() { return m_name; }
    virtual const char* speak() const = 0; // = 0 意味着这是纯虚函数

    virtual ~Animal() = default;
};

const char* Animal::speak() const  // 即使该函数有定义
{
    return "buzz";
}
```


In this case, speak() is still considered a pure virtual function because of the “= 0” (even though it has been given a definition) and Animal is still considered an abstract base class (and thus can’t be instantiated). Any class that inherits from Animal needs to provide its own definition for speak() or it will also be considered an abstract base class.

When providing a definition for a pure virtual function, the definition must be provided separately (not inline).

!!! tip "小贴士"

	For Visual Studio users

	Visual Studio mistakenly allows pure virtual function declarations to be definitions, for example
	
	```cpp
	// wrong!
	virtual const char* speak() const = 0
	{
	  return "buzz";
	}
	```
	This is wrong and cannot be disabled.


当您希望基类为函数提供默认实现，但仍然强制任何派生类提供它们自己的实现时，此范例可能很有用。但是，如果派生类对基类提供的默认实现感到满意，它可以直接调用基类实现。例如:

```cpp
#include <string>
#include <iostream>

class Animal // This Animal is an abstract base class
{
protected:
    std::string m_name;

public:
    Animal(const std::string& name)
        : m_name(name)
    {
    }

    const std::string& getName() const { return m_name; }
    virtual const char* speak() const = 0; // note that speak is a pure virtual function

    virtual ~Animal() = default;
};

const char* Animal::speak() const
{
    return "buzz"; // 默认实现
}

class Dragonfly: public Animal
{

public:
    Dragonfly(const std::string& name)
        : Animal{name}
    {
    }

    const char* speak() const override// 提供纯虚函数定义后该类已经不是抽象类了
    
    {
        return Animal::speak(); // 使用 Animal 的默认实现
    }
};

int main()
{
    Dragonfly dfly{"Sally"};
    std::cout << dfly.getName() << " says " << dfly.speak() << '\n';

    return 0;
}
```

输出：

```
Sally says buzz
```

这个功能并不常用。

==析构函数可以是纯虚的，但必须给出一个定义，以便在派生对象析构时调用它。==


## 接口类

[[interface-class|接口类]]没有成员变量，
a class that has no member variables, and where _all_ of the functions are pure virtual! In other words, the class is purely a definition, and has no actual implementation. Interfaces are useful when you want to define the functionality that derived classes must implement, but leave the details of how the derived class implements that functionality entirely up to the derived class.

Interface classes are often named beginning with an I. Here’s a sample interface class:

```cpp
class IErrorLog
{
public:
    virtual bool openLog(const char* filename) = 0;
    virtual bool closeLog() = 0;

    virtual bool writeError(const char* errorMessage) = 0;

    virtual ~IErrorLog() {} // make a virtual destructor in case we delete an IErrorLog pointer, so the proper derived destructor is called
};
```

COPY

Any class inheriting from IErrorLog must provide implementations for all three functions in order to be instantiated. You could derive a class named FileErrorLog, where openLog() opens a file on disk, closeLog() closes the file, and writeError() writes the message to the file. You could derive another class called ScreenErrorLog, where openLog() and closeLog() do nothing, and writeError() prints the message in a pop-up message box on the screen.

Now, let’s say you need to write some code that uses an error log. If you write your code so it includes FileErrorLog or ScreenErrorLog directly, then you’re effectively stuck using that kind of error log (at least without recoding your program). For example, the following function effectively forces callers of mySqrt() to use a FileErrorLog, which may or may not be what they want.

```cpp
#include <cmath> // for sqrt()

double mySqrt(double value, FileErrorLog& log)
{
    if (value < 0.0)
    {
        log.writeError("Tried to take square root of value less than 0");
        return 0.0;
    }
    else
    {
        return std::sqrt(value);
    }
}
```

COPY

A much better way to implement this function is to use IErrorLog instead:

```cpp
#include <cmath> // for sqrt()
double mySqrt(double value, IErrorLog& log)
{
    if (value < 0.0)
    {
        log.writeError("Tried to take square root of value less than 0");
        return 0.0;
    }
    else
    {
        return std::sqrt(value);
    }
}
```

COPY

Now the caller can pass in _any_ class that conforms to the IErrorLog interface. If they want the error to go to a file, they can pass in an instance of FileErrorLog. If they want it to go to the screen, they can pass in an instance of ScreenErrorLog. Or if they want to do something you haven’t even thought of, such as sending an email to someone when there’s an error, they can derive a new class from IErrorLog (e.g. EmailErrorLog) and use an instance of that! By using IErrorLog, your function becomes more independent and flexible.

Don’t forget to include a virtual destructor for your interface classes, so that the proper derived destructor will be called if a pointer to the interface is deleted.

Interface classes have become extremely popular because they are easy to use, easy to extend, and easy to maintain. In fact, some modern languages, such as Java and C#, have added an “interface” keyword that allows programmers to directly define an interface class without having to explicitly mark all of the member functions as abstract. Furthermore, although Java (prior to version 8) and C# will not let you use multiple inheritance on normal classes, they will let you multiple inherit as many interfaces as you like. Because interfaces have no data and no function bodies, they avoid a lot of the traditional problems with multiple inheritance while still providing much of the flexibility.

## 纯虚函数和虚表

Abstract classes still have virtual tables, as these can still be used if you have a pointer or reference to the abstract class. The virtual table entry for a class with a pure virtual function will generally either contain a null pointer, or point to a generic function that prints an error (sometimes this function is named __purecall).