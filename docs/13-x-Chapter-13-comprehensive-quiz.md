---
title: 13.x - 小结与测试
alias: 13.x - 小结与测试
origin: /chapter-11-comprehensive-quiz/
origin_title: "13.x — Chapter 13 comprehensive quiz"
time: 2022-9-16
type: translation
tags:
- summary
---

使用类可以创建自定义的数据类型，并且将数据和函数和该数据类型绑定并配合使用。类中的数据和函数称为成员，而选择类中的成员需要使用成员选择运算符`.`（在使用指针访问时，使用`->`运算符）。

访问说明符允许用户限定类成员可以被谁访问。`public` 成员可以被任何人使用。`private` 成员只能被类中的其他成员访问。稍后我们还会介绍 `protected` 成员。默认情况下，类成员都是 `private` 的，而结构体的成员都是 `public` 的。

[[Encapsulation|封装]]是将成员设为private的过程，这样它们就不能被直接访问。这有助于保护类不被滥用。

[[构造函数]]是一种特殊类型的函数，使用它可以初始化该类的对象。不具有任何[[parameters|形参]]（或具有全部默认形参）的构造函数是默认构造函数。当用户没有提供任何初始化值的时候，默认函数将会被调用。你应该至少为类提供一个构造函数。

[[Member-initializer-lists|成员初始化列表]]允许用户在构造函数中对成员变量进行初始化（而不必为每个成员变量赋值）。

非静态成员初始化允许你在声明成员时为变量直接指定默认值。

构造函数也可以调用其他构造函数（称为委派构造函数或构造函数链）。

[[析构函数]]是另外一类特殊的构造函数，使用它可以让类对自己进行清理。任何内存回收或退出流程都应该在析构函数中执行。

所有的成员函数都有一个隐藏的指针`this`，`this`指针指向这个对象本身。大多数情况下你并不需要直接访问该指针，但是偶尔也会有这样的需求。

一个好的编程实践是这样的：将类的定义放置在其同名的头文件内，然后将类的成员定义在另一个与类同名的`.cpp`文件中。 这样有助于避免循环依赖。

如果成员函数不修改类的状态，则可以（也应该）被声明为const类型。const 对象也只能调用const成员函数。

静态成员变量在该类的所有对象间共享。虽然它们可以通过对象来访问，它们也可以使用[[scope-resolution-operator|作用域解析运算符]]来访问。

Similarly, static member functions are member functions that have no *this pointer. They can only access static member variables.

Friend functions are functions that are treated like member functions of the class (and thus can access a class’s private data directly). Friend classes are classes where all members of the class are considered friend functions.

It’s possible to create anonymous class objects for the purpose of evaluation in an expression, or passing or returning a value.

You can also nest types within a class. This is often used with enums related to the class, but can be done with other types (including other classes) if desired.