---
title: 13.1 - 欢迎来到面向对象的世界
alias: 13.1 - 欢迎来到面向对象的世界
origin: /welcome-to-object-oriented-programming/
origin_title: "13.1 — Welcome to object-oriented programming"
time: 2022-9-16
type: translation
tags:
- object
---

在 [[1-3-Introduction-to-objects-and-variables|1.3 - 对象和变量]] 中，我们将C++中的对象定义为：“一段可以被用来存储值的内存”。一个具有名字的对象称为变量。

在传统编程领域（本节课之前介绍的内容都属于传统编程领域），程序基本上就是一系列计算机指令，它们定义了数据（通过对象），然后操作这些数据（通过语句和函数）。数据和函数共同作用同于计算所需的结果，但它们各自是独立的个体。因为这种独立性，传统的编程技术通常无法为现实世界中的事务提供直观的表示法。程序员需要将属性（变量）和行为（函数）恰当的联系起来，才能确保程序正确工作。其代码看上去多是下面这样：

```cpp
driveTo(you, work);
```

面向对象编程又是什么呢？就像许多事情一样，也许通过类比最容易理解。看看你周围的事物——你看到的任何东西可以被称之为对象：书籍、建筑、食物甚至是你自己。对象通常包含两个主要的组成部分：1. 一组相关的属性（例如） Take a look around you -- everywhere you look are objects: books and buildings and food and even you. Objects have two major components to them: 1) A list of relevant properties (e.g. weight, color, size, solidity, shape, etc…), and 2) Some number of behaviors that they can exhibit (e.g. being opened, making something else hot, etc…). These properties and behaviors are inseparable.

Object-oriented programming (OOP) provides us with the ability to create objects that tie together both properties and behaviors into a self-contained, reusable package. This leads to code that looks more like this:

```cpp
you.driveTo(work);
```

COPY

This not only reads more clearly, it also makes it clearer who the subject is (you) and what behavior is being invoked (driving somewhere). Rather than being focused on writing functions, we’re focused on defining objects that have a well-defined set of behaviors. This is why the paradigm is called “object-oriented”.

This allows programs to be written in a more modular fashion, which makes them easier to write and understand, and also provides a higher degree of code-reusability. These objects also provide a more intuitive way to work with our data by allowing us to define how we interact with the objects, and how they interact with other objects.

Note that OOP doesn’t replace traditional programming methods. Rather, it gives you additional tools in your programming tool belt to manage complexity when needed.

Object-oriented programming also brings several other useful concepts to the table: inheritance, encapsulation, abstraction, and polymorphism (language designers have a philosophy: never use a short word where a long one will do). We will be covering all of these concepts in the upcoming tutorials over the next few chapters. It’s a lot of new material, but once you’ve been properly familiarized with OOP and it clicks, you may never want to go back to pure traditional programming again.

Note that the term “object” is overloaded a bit, and this causes some amount of confusion. In traditional programming, an object is a piece of memory to store values. And that’s it. In object-oriented programming, an “object” implies that it is both an object in the traditional programming sense, and that it combines both properties and behaviors. From this point forward, when we use the term “object”, we’ll be referring to “objects” in the object-oriented sense.

[

](https://www.learncpp.com/cpp-tutorial/classes-and-class-members/)