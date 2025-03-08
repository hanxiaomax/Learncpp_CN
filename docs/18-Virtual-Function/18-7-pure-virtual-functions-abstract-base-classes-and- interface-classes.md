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

??? note "Key Takeaway"

	- 包含纯虚函数的类是抽象类，不能被实例化，其派生类如果实现了所有的虚函数则变成正常类
	- 即使纯虚函数有函数体，也是纯虚函数，而且它的定义需要单独定义，而不能是声明时定义
	- 有实现的纯虚函数用于提供默认实现，派生类在实现纯虚函数时中可以显式地调用该纯虚函数实现
	- 析构函数可以是纯虚的，但必须给出一个定义，以便在派生对象析构时调用它
	- 接口类也有虚表，但是纯虚函数的虚表条目要么是空指针的要么是打印报错函数



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

在这种情况下，`speak()` 仍然被认为是一个纯虚函数因为“= 0”(即使已经给了它一个定义)，`Animal` 仍然被认为是一个抽象基类(因此不能实例化)。任何继承自`Animal`的类都需要为`speak()`提供自己的定义，否则也会被认为是抽象基类。

在为纯虚函数提供定义时，必须单独提供定义(不能是[[6-13-Inline-functions|内联函数]])。

> [!tip] "小贴士"
> 对于 Visual Studio 用户的提示
> 
> Visual Studio 错误地允许纯虚函数在声明时定义；
> ```cpp
> // wrong!
> virtual const char* speak() const = 0
> {
>   return "buzz";
> }
> ```
> 这其实是错误的，但是无法关闭。
	

当您希望基类为函数提供默认实现，但仍然强制任何派生类提供它们自己的实现时，此范例可能很有用。但是，如果派生类对基类提供的默认实现感到满意，它可以直接调用基类实现。例如：

```cpp
#include <string>
#include <iostream>

class Animal // Animal 是抽象基类
{
protected:
    std::string m_name;

public:
    Animal(const std::string& name)
        : m_name(name)
    {
    }

    const std::string& getName() const { return m_name; }
    virtual const char* speak() const = 0; // speak 是一个纯虚函数

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

[[interface-class|接口类]]没有成员变量，而且**所有**函数都是[[pure-virtual|纯虚函数]]！换言之，这个类就是一个纯定义，并没有实际实现。当我们需要定义出派生类必须实现的功能时，并且将这些功能都留给派生类实现时，使用接口类是很有用的。

接口类命名通常以`I`开头，下面是一个示例接口类：

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

任何从`IErrorLog`继承的类都必须实现这三个函数，以便被能够被实例化。你可以派生一个名为`FileErrorLog`的类，其中`openLog()`打开磁盘上的文件，`closeLog()`关闭文件，`writeError()`将消息写入文件。然后可派生另一个名为`ScreenErrorLog`的类，其中`openLog()`和`closeLog()`不执行任何操作，而`writeError()`在屏幕上的弹出消息框中打印消息。

现在，假设你需要编写一些代码并需要使用错误日志功能。如果你编写的代码直接包使用 `FileErrorLog` 或 `ScreenErrorLog`，那么你将**只能**使用这种指定的错误日志类型(在不修改代码的情况下)。例如，下面的函数迫使`mySqrt()`的调用者使用`FileErrorLog`，但调用者可能并不想使用这种错误日志。

```cpp
#include <cmath> // for sqrt()

double mySqrt(double value, FileErrorLog& log) //注意参数使用的是FileErrorLog类型
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

更加灵活的办法是将该函数实现为使用 `IErrorLog` 类型的参数：

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

这样一来，调用者可以传入符合 `IErrorLog` 接口的任何类。如果它们希望将错误日志写到文件，则可以传入 `FileErrorLog` 的实例。如果想错误信息打印到屏幕上，则可以传入一个 `ScreenErrorLog` 的实例。如果他们想做一些你甚至没有想过的事情，比如在出现错误时向某人发送电子邮件，则可以从`IErrorLog`(例如EmailErrorLog)派生一个新类并使用它的实例！通过使用IErrorLog，您的函数变得更加独立和灵活。

不要忘记为接口类定义虚析构函数，以便在**删除指向接口的指针**时调用适当的派生析构函数。

接口类非常常用，因为它们易于使用、易于扩展和易于维护。事实上，一些现代语言，如Java和C#，已经添加了 `interface` 关键字，允许程序员直接定义接口类，而不必显式地将所有成员函数标记为抽象。此外，尽管Java(版本8之前的版本)和C#不允许对普通类使用多重继承，但它们允许您根据需要对任意多的接口进行多重继承。因为接口没有数据也没有函数体，所以它们避免了许多传统的多重继承问题，同时仍然提供了很大的灵活性。

## 纯虚函数和虚表

==抽象类仍然有虚表，因为如果您有指向抽象类的指针或引用，这些虚表仍然有用==。带有纯虚函数的类的虚表项通常要么包含空指针，要么指向打印错误的泛型函数(有时该函数被命名为`__purecall`)。
