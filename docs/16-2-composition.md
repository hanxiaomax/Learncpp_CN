---
title: 16.2 - 组合关系
alias: 16.2 - 组合关系
origin: /composition/
origin_title: "16.2 — Composition"
time: 2022-7-13
type: translation
tags:
- object
- composition
---


??? note "关键点速记"
	
	-

## 对象组合

在现实生活中，复杂的东西往往都基于更小的、更简单的东西构建。例如，汽车是基于车架、引起、轮胎、变速箱、方向盘和很多其他部件构建的。个人电脑则是基于CPU、主板、内存等构建的。甚至你自己也可以分为更小的部分：头、身体、腿、手臂等等。通过简单对象构建复杂对象的过程称为对象[[composition|组合]]。

一般来说，对象组合模型中的对象之间是“有一个（has-a）”的关系。汽车“有一个”变速箱。电脑“有一个”CPU，你“有一个”心脏。复杂对象通常被称为**整体**。而简单的对象通常被称为部件或组件。

在C++中，你已经看到结构和类可以拥有各种类型的数据成员(例如基本类型或其他类)。当使用数据成员构建类时，就是在用更简单的部分构造复杂的对象，这就是对象组合。因此，结构和类有时被称为[[composite-types|组合类型]]。

对象组合在C++中很有用，因为它允许我们通过将更简单、更容易管理的部分来组合起来创建复杂的类。这降低了复杂性，并使我们可以更快地编写代码，也更不容易出错，因为我们可以重用已经编写、测试和验证过的代码。


## 对象组合的类型

对象组合有两种基本的子类型：组合和聚合。这节课我们将讨论组合，下节课我们将讨论[[16-3-aggregation|聚合关系]]。

关于术语的说明：术语“组合”通常同时指组合和聚合，而不仅仅指组合子类型。在本教程中，当我们提到两者时，我们将使用术语“对象组合”，当我们专门提到组合子类型时，我们将使用术语“组合”。


## 组合

合格的组合关系需要满足如下条件：

- 部分(成员)是对象(类)的一部分
- 部件(成员)一次只能属于一个对象(类)
- 部分(成员)的存在由对象(类)管理
- 部分(成员)不知道对象(类)的存在


现实生活中一个很好的组合例子是一个人的身体和心脏之间的关系。让我们更详细地研究这些内容。

组合关系是“部分-整体”的关系，其中部分必须构成整个对象的一部分。例如，心脏是一个人身体的一部分。组合中的部分只能是属于**一个对象**的一部分。作为一个人身体一部分的心脏不可能同时是另一个人身体的一部分。

在组合关系中，对象负责管理各个部件的存在。通常情况下，这意味着在创建对象时创建该部件，在销毁对象时销毁该部分。但更广泛地说，它意味着对象以一种不需要对象的用户参与的方式管理部件的生命周期。例如，当一个身体被创造出来时，心脏也被创造出来了。当一个人的身体被摧毁时，他的心也会被摧毁。正因为如此，组合有时被称为“死亡关系”。

最后，部分不知道整体的存在。你的心在幸福地运转着，却没有意识到它是一个更大结构的一部分。我们称之为单向关系，因为身体了解心脏，但心脏不了解身体。

注意，组合关系与部件的可移植性无关。心脏可以从一个身体移植到另一个身上。然而，即使在移植后，它仍然满足组合的定义(心脏现在属于接受者，除非再次移植，否则只能是接受者对象的一部分)。

我们的`Fraction`类就是一个很好的组合例子:


```cpp
class Fraction
{
private:
	int m_numerator;
	int m_denominator;

public:
	Fraction(int numerator=0, int denominator=1)
		: m_numerator{ numerator }, m_denominator{ denominator }
	{
	}
};
```


This class has two data members: a numerator and a denominator. The numerator and denominator are part of the Fraction (contained within it). They can not belong to more than one Fraction at a time. The numerator and denominator don’t know they are part of a Fraction, they just hold integers. When a Fraction instance is created, the numerator and denominator are created. When the fraction instance is destroyed, the numerator and denominator are destroyed as well.

While object composition models has-a type relationships (a body has-a heart, a fraction has-a denominator), we can be more precise and say that composition models “part-of” relationships (a heart is part-of a body, a numerator is part of a fraction). Composition is often used to model physical relationships, where one object is physically contained inside another.

The parts of a composition can be singular or multiplicative -- for example, a heart is a singular part of the body, but a body contains 10 fingers (which could be modeled as an array).

## 实现组合关系

Compositions are one of the easiest relationship types to implement in C++. They are typically created as structs or classes with normal data members. Because these data members exist directly as part of the struct/class, their lifetimes are bound to that of the class instance itself.

Compositions that need to do dynamic allocation or deallocation may be implemented using pointer data members. In this case, the composition class should be responsible for doing all necessary memory management itself (not the user of the class).

In general, if you _can_ design a class using composition, you _should_ design a class using composition. Classes designed using composition are straightforward, flexible, and robust (in that they clean up after themselves nicely).

## 更多的例子

Many games and simulations have creatures or objects that move around a board, map, or screen. One thing that all of these creatures/objects have in common is that they all have a location. In this example, we are going to create a creature class that uses a point class to hold the creature’s location.

First, let’s design the point class. Our creature is going to live in a 2d world, so our point class will have 2 dimensions, X and Y. We will assume the world is made up of discrete squares, so these dimensions will always be integers.

Point2D.h:

```cpp
#ifndef POINT2D_H
#define POINT2D_H

#include <iostream>

class Point2D
{
private:
    int m_x;
    int m_y;

public:
    // A default constructor
    Point2D()
        : m_x{ 0 }, m_y{ 0 }
    {
    }

    // A specific constructor
    Point2D(int x, int y)
        : m_x{ x }, m_y{ y }
    {
    }

    // An overloaded output operator
    friend std::ostream& operator<<(std::ostream& out, const Point2D& point)
    {
        out << '(' << point.m_x << ", " << point.m_y << ')';
        return out;
    }

    // Access functions
    void setPoint(int x, int y)
    {
        m_x = x;
        m_y = y;
    }

};

#endif
```

COPY

Note that because we’ve implemented all of our functions in the header file (for the sake of keeping the example concise), there is no Point2D.cpp.

This Point2d class is a composition of its parts: location values x and y are part-of Point2D, and their lifespan is tied to that of a given Point2D instance.

Now let’s design our Creature. Our Creature is going to have a few properties: a name, which will be a string, and a location, which will be our Point2D class.

Creature.h:

```cpp
#ifndef CREATURE_H
#define CREATURE_H

#include <iostream>
#include <string>
#include "Point2D.h"

class Creature
{
private:
    std::string m_name;
    Point2D m_location;

public:
    Creature(const std::string& name, const Point2D& location)
        : m_name{ name }, m_location{ location }
    {
    }

    friend std::ostream& operator<<(std::ostream& out, const Creature& creature)
    {
        out << creature.m_name << " is at " << creature.m_location;
        return out;
    }

    void moveTo(int x, int y)
    {
        m_location.setPoint(x, y);
    }
};
#endif
```

COPY

This Creature is also a composition of its parts. The creature’s name and location have one parent, and their lifetime is tied to that of the Creature they are part of.

And finally, main.cpp:

```cpp
#include <string>
#include <iostream>
#include "Creature.h"
#include "Point2D.h"

int main()
{
    std::cout << "Enter a name for your creature: ";
    std::string name;
    std::cin >> name;
    Creature creature{ name, { 4, 7 } };

    while (true)
    {
        // print the creature's name and location
        std::cout << creature << '\n';

        std::cout << "Enter new X location for creature (-1 to quit): ";
        int x{ 0 };
        std::cin >> x;
        if (x == -1)
            break;

        std::cout << "Enter new Y location for creature (-1 to quit): ";
        int y{ 0 };
        std::cin >> y;
        if (y == -1)
            break;

        creature.moveTo(x, y);
    }

    return 0;
}
```

COPY

Here’s a transcript of this code being run:

```
Enter a name for your creature: Marvin
Marvin is at (4, 7)
Enter new X location for creature (-1 to quit): 6
Enter new Y location for creature (-1 to quit): 12
Marvin is at (6, 12)
Enter new X location for creature (-1 to quit): 3
Enter new Y location for creature (-1 to quit): 2
Marvin is at (3, 2)
Enter new X location for creature (-1 to quit): -1
```

Variants on the composition theme

Although most compositions directly create their parts when the composition is created and directly destroy their parts when the composition is destroyed, there are some variations of composition that bend these rules a bit.

For example:

-   A composition may defer creation of some parts until they are needed. For example, a string class may not create a dynamic array of characters until the user assigns the string some data to hold.
-   A composition may opt to use a part that has been given to it as input rather than create the part itself.
-   A composition may delegate destruction of its parts to some other object (e.g. to a garbage collection routine).

The key point here is that the composition should manage its parts without the user of the composition needing to manage anything.

## 组合和类成员

One question that new programmers often ask when it comes to object composition is, “When should I use a class member instead of direct implementation of a feature?”. For example, instead of using the Point2D class to implement the Creature’s location, we could have instead just added 2 integers to the Creature class and written code in the Creature class to handle the positioning. However, making Point2D its own class (and a member of Creature) has a number of benefits:

1.  Each individual class can be kept relatively simple and straightforward, focused on performing one task well. This makes those classes easier to write and much easier to understand, as they are more focused. For example, Point2D only worries about point-related stuff, which helps keep it simple.
2.  Each class can be self-contained, which makes them reusable. For example, we could reuse our Point2D class in a completely different application. Or if our creature ever needed another point (for example, a destination it was trying to get to), we can simply add another Point2D member variable.
3.  The outer class can have the class members do most of the hard work, and instead focus on coordinating the data flow between the members . This helps lower the overall complexity of the outer class, because it can delegate tasks to its members, who already know how to do those tasks. For example, when we move our Creature, it delegates that task to the Point class, which already understands how to set a point. Thus, the Creature class does not have to worry about how such things would be implemented.

!!! tip "小贴士"

	A good rule of thumb is that each class should be built to accomplish a single task. That task should either be the storage and manipulation of some kind of data (e.g. Point2D, std::string), OR the coordination of its members (e.g. Creature). Ideally not both.

In this case of our example, it makes sense that Creature shouldn’t have to worry about how Points are implemented, or how the name is being stored. Creature’s job isn’t to know those intimate details. Creature’s job is to worry about how to coordinate the data flow and ensure that each of the class members knows _what_ it is supposed to do. It’s up to the individual classes to worry about _how_ they will do it.