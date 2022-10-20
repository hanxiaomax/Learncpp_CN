---
title: 18.1 - 基类的指针和引用
alias: 18.1 - 基类的指针和引用
origin: /pointers-and-references-to-the-base-class-of-derived-objects/
origin_title: "18.1 — Pointers and references to the base class of derived objects"
time: 2022-2-23
type: translation
tags:
- pointers
- references
---


在前面的章节中，我们学习了如何通过[[inheritance|继承]]来派生新的类。在本章中，我们将介绍继承中最重要也是最强大的一面——虚函数。

在我们讨论虚函数之前，先来了解一下，为什么虚函数是有用的。

通过[[17-3-order-of-construction-of-derived-classes|17.3 - 派生类的构造顺序]] 的学习，我们指定，当创建一个派生类时，派生类实际上是由多个部分组成的：一部分属于其父类，另一部分属于它自己。

例如，这里个简单的例子：

```cpp
#include <string_view>

class Base
{
protected:
    int m_value {};

public:
    Base(int value)
        : m_value{ value }
    {
    }

    std::string_view getName() const { return "Base"; }
    int getValue() const { return m_value; }
};

class Derived: public Base
{
public:
    Derived(int value)
        : Base{ value }
    {
    }

    std::string_view getName() const { return "Derived"; }
    int getValueDoubled() const { return m_value * 2; }
};
```


当我们创建 `Derived` 对象时，它包含 `Base` 的部分（首先构建）以及属于 `Derived` 的部分 (随后构建)。注意，继承关系隐含的是对象A“是一种”对象B的含义。因为 `Derived` 是一个 `Base`，所以 `Derived` 包含 `Base` 的部分是合理的。

## 指针，引用和派生类

创建一个指向 `Derived` 对象的指针和引用很简单：

```cpp
#include <iostream>

int main()
{
    Derived derived{ 5 };
    std::cout << "derived is a " << derived.getName() << " and has value " << derived.getValue() << '\n';

    Derived& rDerived{ derived };
    std::cout << "rDerived is a " << rDerived.getName() << " and has value " << rDerived.getValue() << '\n';

    Derived* pDerived{ &derived };
    std::cout << "pDerived is a " << pDerived->getName() << " and has value " << pDerived->getValue() << '\n';

    return 0;
}
```

输出结果如下：

```
derived is a Derived and has value 5
rDerived is a Derived and has value 5
pDerived is a Derived and has value 5
```

不过，由于 `Derived` 中包含属于 `Base` 的部分，那么我们不禁要问：C++允许我们将`Base`类型指针指向`Derived` 对象吗？答案是可以的！

```cpp
#include <iostream>

int main()
{
    Derived derived{ 5 };

    // These are both legal!
    Base& rBase{ derived };
    Base* pBase{ &derived };

    std::cout << "derived is a " << derived.getName() << " and has value " << derived.getValue() << '\n';
    std::cout << "rBase is a " << rBase.getName() << " and has value " << rBase.getValue() << '\n';
    std::cout << "pBase is a " << pBase->getName() << " and has value " << pBase->getValue() << '\n';

    return 0;
}
```

程序运行结果如下：

```
derived is a Derived and has value 5
rBase is a Base and has value 5
pBase is a Base and has value 5
```

输出结果可能和你想的并不一样！

事实证明，由于`rBase`和`pBase`是`Base`引用和指针，它们只能看到`Base`的成员(或`Base`父类们的成员)。因此，即使`Derived::getName()`遮蔽(隐藏)了`Derived`对象的`Base::getName()`， `Base`指针/引用也不能看到`Derived::getName()`。因此，它会调用`Base::getName()`，这就是`rBase`和`pBase`打印它们是`Base`而不是`Derived`的原因。


注意，这也意味着你不能通过`rBase`或者`pBase`来调用`Derived::getValueDoubled()` 。因为它们看不到该函数。

这是另一个稍微复杂一点的例子，我们会在下一节课中使用它：

```cpp
#include <iostream>
#include <string_view>
#include <string>

class Animal
{
protected:
    std::string m_name;

    // 将这个构造函数设置为受保护的，因为
    // 我们不希望用户能够直接创建 Animal 对象，
    // 但是我们仍然希望能够使用它来派生类。
    Animal(std::string_view name)
        : m_name{ name }
    {
    }

    // To prevent slicing (covered later)
    Animal(const Animal&) = default;
    Animal& operator=(const Animal&) = default;

public:
    std::string_view getName() const { return m_name; }
    std::string_view speak() const { return "???"; }
};

class Cat: public Animal
{
public:
    Cat(std::string_view name)
        : Animal{ name }
    {
    }

    std::string_view speak() const { return "Meow"; }
};

class Dog: public Animal
{
public:
    Dog(std::string_view name)
        : Animal{ name }
    {
    }

    std::string_view speak() const { return "Woof"; }
};

int main()
{
    const Cat cat{ "Fred" };
    std::cout << "cat is named " << cat.getName() << ", and it says " << cat.speak() << '\n';

    const Dog dog{ "Garbo" };
    std::cout << "dog is named " << dog.getName() << ", and it says " << dog.speak() << '\n';

    const Animal* pAnimal{ &cat };
    std::cout << "pAnimal is named " << pAnimal->getName() << ", and it says " << pAnimal->speak() << '\n';

    pAnimal = &dog;
    std::cout << "pAnimal is named " << pAnimal->getName() << ", and it says " << pAnimal->speak() << '\n';

    return 0;
}
```


打印结果

```
cat is named Fred, and it says Meow
dog is named Garbo, and it says Woof
pAnimal is named Fred, and it says ???
pAnimal is named Garbo, and it says ???
```

和之前的问题类似，因为 `pAnimal` 是一个 `Animal` 类型的指针，所以它可以看到 `Animal` 的部分。其结果就是`pAnimal->speak()`调用的是 `Animal::speak()` 而不是 `Dog::Speak()` 或者 `Cat::speak()`。

## 使用指向基类的指针和引用

现在你可能会说，“上面的例子看起来有点傻。当我可以直接使用派生对象时，为什么要设置指向派生对象基类的指针或引用呢?”事实证明，这么做很有用。

首先，假设你想要编写一个函数来打印动物的名字和声音。如果不使用指向基类的指针，你就必须使用重载函数来编写它，像这样:

```cpp
//函数重载（签名不同）
void report(const Cat& cat)
{
    std::cout << cat.getName() << " says " << cat.speak() << '\n';
}

void report(const Dog& dog)
{
    std::cout << dog.getName() << " says " << dog.speak() << '\n';
}
```

好像没啥问题，但想想如果我们不止有两种动物而是有30种会发生什么。你必须编写30个几乎相同的函数！另外，如果你添加了一种新的动物类型，你也必须为它写一个新的函数。考虑到这些函数的唯一区别就是参数不同，这是无疑是一种巨大的浪费。

不过，因为 `Cat` 和 `Dog` 都派生自`Animal`，`Cat` 和 `Dog` 中一定具有属于`Animal` 的部分。因此，如果能像下面这么做就好了：

```cpp
void report(const Animal& rAnimal)
{
    std::cout << rAnimal.getName() << " says " << rAnimal.speak() << '\n';
}
```

这将允许我们传入从`Animal`派生的任何类，甚至是在编写函数之后创建的类！不需要为每个派生类编写一个函数，而是与所有派生自`Animal`的类可以共用的一个函数！

当然，这么做最大的问题在于 `rAnimal`是`Animal` 的引用，所以 `rAnimal.speak()` 会调用 `Animal::speak()` 而不是派生类中的 `speak()`。

其次，假设你有3只猫和3只狗，你想把它们放在一个数组中以便于访问。因为数组只能保存一种类型的对象，没有指向基类的指针或引用，你必须为每个派生类型创建不同的数组，像这样:

```cpp
#include <array>
#include <iostream>

// Cat and Dog from the example above

int main()
{
    const auto& cats{ std::to_array<Cat>({{ "Fred" }, { "Misty" }, { "Zeke" }}) };
    const auto& dogs{ std::to_array<Dog>({{ "Garbo" }, { "Pooky" }, { "Truffle" }}) };

    // Before C++20
    // const std::array<Cat, 3> cats{{ { "Fred" }, { "Misty" }, { "Zeke" } }};
    // const std::array<Dog, 3> dogs{{ { "Garbo" }, { "Pooky" }, { "Truffle" } }};

    for (const auto& cat : cats)
    {
        std::cout << cat.getName() << " says " << cat.speak() << '\n';
    }

    for (const auto& dog : dogs)
    {
        std::cout << dog.getName() << " says " << dog.speak() << '\n';
    }

    return 0;
}
```

如果有30种不同的动物呢？岂不是要定义30个数组，每个动物都需要一个数组！

不过，因为`Cat`和`Dog`都派生自于`Animal`，所以可以这样做:


```cpp
#include <array>
#include <iostream>

// Cat and Dog from the example above

int main()
{
    const Cat fred{ "Fred" };
    const Cat misty{ "Misty" };
    const Cat zeke{ "Zeke" };

    const Dog garbo{ "Garbo" };
    const Dog pooky{ "Pooky" };
    const Dog truffle{ "Truffle" };

    // Set up an array of pointers to animals, and set those pointers to our Cat and Dog objects
    // Note: to_array requires C++20 support (and at the time of writing, Visual Studio 2022 still doesn't support it correctly)
    const auto animals{ std::to_array<const Animal*>({&fred, &garbo, &misty, &pooky, &truffle, &zeke }) };

    // Before C++20, with the array size being explicitly specified
    // const std::array<const Animal*, 6> animals{ &fred, &garbo, &misty, &pooky, &truffle, &zeke };

    for (const auto animal : animals)
    {
        std::cout << animal->getName() << " says " << animal->speak() << '\n';
    }

    return 0;
}
```


尽管上述代码可以编译和执行，但可惜的是，由于每个元素都是 `Animal` 类型的指针，那就意味着`animal->speak()`调用的会是 `Animal::speak()` 而不是派生类各自的 `speak()` 函数。输出结果是这样的：

```
Fred says ???
Garbo says ???
Misty says ???
Pooky says ???
Truffle says ???
Zeke says ???
```

虽然这两种方法可以节省大量的时间和精力，但它们都有相同的问题。基类的指针或引用调用函数的基类版本而不是派生版本。要是有办法让这些基指针调用函数的派生版本而不是基版本就好了…

你猜，虚函数是做什么用的？（不会那么巧吧）。
