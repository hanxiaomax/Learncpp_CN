---
title: 13.x - 小结与测试 - 面向对象基础
alias: 13.x - 小结与测试 - 面向对象基础
origin: /chapter-13-comprehensive-quiz/
origin_title: "13.x — Chapter 13 comprehensive quiz"
time: 2022-9-16
type: translation
tags:
- summary
---


[[14-2-classes-and-class-members|13.2 - 类和类成员]]

- 使用类可以创建自定义的数据类型，并且将数据和函数和该数据类型绑定并配合使用。类中的数据和函数称为成员，而选择类中的成员需要使用成员选择运算符`.`（在使用指针访问时，使用`->`运算符）。

[[14-5-public-vs-private-access-specifiers|13.3 - 访问修饰符 public 和 private]]

- [[access-specifiers|成员访问修饰符]]允许用户限定类成员可以被谁访问。`public` 成员可以被任何人使用。`private` 成员只能被类中的其他成员访问。稍后我们还会介绍 `protected` 成员。默认情况下，类成员都是 `private` 的，而结构体的成员都是 `public` 的。

[[14-6-access-functions-and-encapsulation|13.4 - 成员访问函数与封装]]

- [[Encapsulation|封装]]是将成员设为private的过程，这样它们就不能被直接访问。这有助于保护类不被滥用。

[[14-9-constructors|13.5 - 构造函数]]

- [[constructor|构造函数]]是一种特殊类型的函数，使用它可以初始化该类的对象。不具有任何[[parameters|形参]]（或具有全部默认形参）的构造函数是默认构造函数。当用户没有提供任何初始化值的时候，默认函数将会被调用。你应该至少为类提供一个构造函数。

[[14-10-constructor-member-initializer-lists|13.6 - 构造函数成员初始化列表]]

- [[member-initializer-list|成员初始化值列表]]允许用户在构造函数中对成员变量进行初始化（而不必为每个成员变量赋值）。

[[13-7-non-static-member-initialization|13.7 - 非静态成员初始化]]

- [[non-static-member-initialization|非静态成员初始化]]允许你在声明成员时为变量直接指定默认值。

[[14-12-overlapping-and-delegating-constructors|13.8 - 重叠和委托构造函数]]

- [[constructor|构造函数]]也可以调用其他构造函数（称为[[delegating-constructors|委托构造函数]]或构造函数链）。

[[19-3-destructors|13.9 - 析构函数]]

- [[destructor|析构函数]]是另外一类特殊的构造函数，使用它可以让类对自己进行清理。任何内存回收或退出流程都应该在析构函数中执行。

[[15-1-the-hidden-this-pointer|13.10 - 隐藏的this指针]]

- 所有的成员函数都有一个隐藏的指针`this`，`this`指针指向这个对象本身。大多数情况下你并不需要直接访问该指针，但是偶尔也会有这样的需求。

[[15-2-class-code-and-header-files|13.11 - 类代码和头文件]]

- 一个好的编程实践是这样的：将类的定义放置在其同名的头文件内，然后将类的成员定义在另一个与类同名的`.cpp`文件中。 这样有助于避免循环依赖。

[[14-4-const-class-objects-and-member-functions|13.12 - const 对象和成员函数]]

- 如果成员函数不修改类的状态，则可以（也应该）被声明为const类型。const 对象也只能调用const成员函数。

[[15-6-static-member-variables|13.13 - 静态成员变量]] & [[15-7-static-member-functions|13.14 - 静态成员函数]]

- [[static-member-variables|静态成员变量]]在该类的所有对象间共享。它们可以通过对象来访问，它们也可以使用[[scope-resolution-operator|作用域解析运算符]]来访问。
- [[static-member-functions|静态成员函数]]没有`this`指针，它们只能够被静态成员变量访问。

[[15-8-friend-functions-and-classes|13.15 - 友元函数和友元类]]

- [[friend-function|友元函数]]被当做类成员函数使用（可以直接访问类的私有数据）。[[friend-class|友元类]]的所有成员函数都被看做是友元函数。

[[14-13-anonymous-objects|13.16 - 匿名对象]]

- 在表达式求值，或者传递、返回值时，可以使用匿名对象。

[[15-3-nested-types-in-classes|13.17 - 类中的嵌套类型]]

- 你也可以在类中嵌套类型。通常是枚举类型，不过如有需要也可以是其他类型（或者其他类）。