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

这个类有两个数据成员：分子和分母。分子和分母是分数的一部分(包含在分数中)。它们不能同时属于多个分数。分子和分母并不知道它们是分数的一部分，它们只包含整数。在创建 `Fraction` 实例时，将创建分子和分母。当分数实例被破坏时，分子和分母也会被破坏。

尽管对象组合关系描述的是“具有”的关系（人体有一个心脏、分数有一个分母），但是更加精确的说法其实是，组合描述的是“部分与整体”的关系（心脏是人体的一部分、分子是分数的一部分）。组合关系通常用于对一个物理关系进行建模，即一个对象被包含在另外一个对象中。

“部分”关系可以是“一对一的”，也可以是“多对一的”——例如，身体中包含一个心脏，但是身体可以包含10个手指（最终被实现为数组）。

## 实现组合关系

组合是C++中最容易实现的关系类型之一。它们通常被创建为具有普通数据成员的结构或类。因为这些数据成员直接作为结构/类的一部分存在，所以它们的生命周期与类实例本身的生命周期绑定在一起。

需要进行动态分配或回收的组合可以使用指针数据成员实现。在这种情况下，组合类应该自己负责所有必要的内存管理(而不是类的用户)。

一般来说，如果你能使用复合设计一个类，你就应该使用组合关系设计一个类。使用组合设计的类是直接的、灵活的和健壮的(因为它们很好地自行清理)。

## 更多的例子

许多游戏都有在棋盘、地图或屏幕上移动的生物或物体。所有这些生物/物体的一个共同点是，它们都有一个位置。在这个例子中，我们将创建一个生物类，它使用一个`Point`类来保存生物的位置。

首先，让我们设计`Point`类。生物将生活在2d世界中，所以`Point`类只需要有两个维度`x`和`y`。我们假设世界是由离散的正方形组成，所以这些维度总是整数。


```cpp title="Point2D.h"
#ifndef POINT2D_H
#define POINT2D_H

#include <iostream>

class Point2D
{
private:
    int m_x;
    int m_y;

public:
    // 默认构造函数
    Point2D()
        : m_x{ 0 }, m_y{ 0 }
    {
    }

    // 有参数的构造函数
    Point2D(int x, int y)
        : m_x{ x }, m_y{ y }
    {
    }

    // 重载的输出操作符
    friend std::ostream& operator<<(std::ostream& out, const Point2D& point)
    {
        out << '(' << point.m_x << ", " << point.m_y << ')';
        return out;
    }

    // 成员访问函数
    void setPoint(int x, int y)
    {
        m_x = x;
        m_y = y;
    }

};

#endif
```


注意，因为所有函数的实现都在头文件中（为了保持例子简短），所以并没有 `Point2D.cpp` 文件。

`Point2d` 是它的部件的的组合：位置信息x和y都是 `Point2D`的一部分，所以它们的生命周期也和 `Point2D` 实例绑定在一起。

现在，定义 `Creature` 类。`Creature` 有如下几个属性：名称是一个字符串，位置则是一个 `Point2D` 类。


```cpp title="Creature.h"
#ifndef CREATURE_H
#define CREATURE_H

#include <iostream>
#include <string>
#include "Point2D.h"

class Creature
{
private:
    std::string m_name;//名称
    Point2D m_location;//位置

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


`Creature` 同样也是其各部分的组合。生物的名字和位置其声明周期都绑定到了 `Creature`。

最终的程序是这样的。

```cpp title="main.cpp"
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


运行程序：

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

## 不同类型的组合

尽管大多数组合会在组合关系建立时，直接创建它们的部分，并在组合被破坏时直接销毁它们的部分，但也有一些不同类型的组合不满足这一规则。

例如：

- 组合也可以先不创建部分，而是在需要使用它们时在创建。例如，字符串类可以先不动态分配字符数组，当真正有数据要存放时再创建；
- 组合使用的部分可以是被传入的对象，而不是它自己创建的；
- 组合也可以把销毁部分的工作委派给其他对象（例如，垃圾回收程序）。

这里的关键点是，组合应该管理它的各个部分，而不需要组合的用户管理任何东西。


## 组合和类成员

当涉及到对象组合时，新程序员经常会问的一个问题是，“什么时候我应该使用类成员而不是直接使用某个特性？”例如，我们可以不使用`Point2D``类来实现Creature` 的位置，而是向`Creature`类中直接添加2个整数，并编写代码来处理定位。然而，让`Point2D`成为独立的类(并成为`Creature`的的成员)有很多好处：

1. 每个独立的类能够尽可能地保持简洁，专注于它要完成的任务。这使得这些类更容易编写、也更容易理解，因为它们只专注一个功能。例如，`Point2D` 只需要关注和“点”相关的功能，显然有助于保持类的简洁。
2. 每个类都是自包含的，所以它们能够被复用。例如，我们可以在其他应用中复用 `Point2D` 这个类。而且，如果`creature`需要另外一个点（例如，表示要去的目标点），此时只需要向类中再添加一个 `Point2D` 成员变量即可；
3.  The outer class can have the class members do most of the hard work, and instead focus on coordinating the data flow between the members . This helps lower the overall complexity of the outer class, because it can delegate tasks to its members, who already know how to do those tasks. For example, when we move our Creature, it delegates that task to the Point class, which already understands how to set a point. Thus, the Creature class does not have to worry about how such things would be implemented.

!!! tip "小贴士"

	A good rule of thumb is that each class should be built to accomplish a single task. That task should either be the storage and manipulation of some kind of data (e.g. Point2D, std::string), OR the coordination of its members (e.g. Creature). Ideally not both.

In this case of our example, it makes sense that Creature shouldn’t have to worry about how Points are implemented, or how the name is being stored. Creature’s job isn’t to know those intimate details. Creature’s job is to worry about how to coordinate the data flow and ensure that each of the class members knows _what_ it is supposed to do. It’s up to the individual classes to worry about _how_ they will do it.