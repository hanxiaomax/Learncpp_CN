---
title: 18.x - 小结与测试 - 虚函数
alias: 18.x - 小结与测试 - 虚函数
origin: /chapter-18-comprehensive-quiz/
origin_title: "18.x — Chapter 18 comprehensive quiz"
time: 2022-8-12
type: translation
tags:
- summary
---

## 复习

[[18-1-pointers-and-references-to-the-base-class-of-derived-objects|18.1 - 基类的指针和引用]]

- C++ 允许你将基类类型的指针或引用指向派生类的对象。当我们需要编写代码使其能够配合从同一个基类继承的派生类工作时，这个特性非常有用；
- 
[[18-2-virtual-functions-and-polymorphism|18.2 - 虚函数和多态]]

- 如果没有虚函数的帮助，指向派生类的基类指针和引用就只能访问基类的成员变量和基类中对应的函数；
- 虚函数是一种特殊类型的函数，它会解析为基类和派生类中共同存在的最后派生的函数（称为[[override|重载]]）。为了实现重载。派生类的函数和基类中的虚函数必须具有相同的函数签名和返回值类型。一个例外的情况是[[covariant|协变返回值类型]]，这种情况下重载函数的返回值可以返回派生类类型的指针或引用，而不必和基类中的函数一样也返回基类类型的指针和引用；

[[18-3-the-override-and-final-specifiers-and-covariant-return-types|18.3 - override、final标识符以及协变返回类型]]

- 如果一个函数的目的是被另外一个函数重载，我们应该使用`override`来修饰它以便确保它被重载；
- `final` 关键字可以用来指明某个函数不可以被重载或某个类不能被继承；

[[18-4-virtual-destructors-virtual-assignment-and-overriding-virtualization|18.4 - 虚构造函数、虚赋值和重载虚拟化]]

- 如果一个类的功能是作为基类使用，那应该将其析构函数设为虚函数，这样才能确保一个指向派生类的基类类型的指针被 `delete` 的时候，能够调用正确的析构函数（子类的析构函数）；
- 使用[[scope-resolution-operator|作用域解析运算符]]可以规避虚函数解析，它可以直接显式地指定你希望使用哪个类中的函数：例如： `base.Base::getName()`；

[[18-5-early-binding-and-late-binding|18.5 - 早期绑定和后期绑定]]

- 当编译器解析到函数的直接调用时，会进行[[Early-binding|早期绑定]]。编译器或者链接器可以直接解析该函数调用。 [[Late-binding|后期绑定]] 则发生在通过函数指针进行调用时。在这种情况下，实际的函数调用只有在运行时才能确定。虚函数使用[[Late-binding|后期绑定]]和虚函数表来确定实际调用的函数。

[[18-6-the-virtual-table|18.6 - 虚函数表]]

- 使用虚函数是有开销的：虚函数的调用更耗时，而且虚函数表也会使每一个包含虚函数的对象其大小增加一个指针的大小。


[[18-7-pure-virtual-functions-abstract-base-classes-and- interface-classes|18.7 - 纯虚函数，抽象基类和接口类]]

- 虚函数可以被定义为[[pure-virtual|纯虚函数]]或抽象函数，只需在其函数原型的结尾添加”=0“即可。包含纯虚函数的类称为[[abstract-class|抽象类]]，它 不能被实例化。一个继承了纯虚函数的类，必须实现这些虚函数，否则该类也是抽象类。纯虚函数也可以有函数体，但即便这样它仍然是抽象的。
- [[interface-class|接口类]]是那些没有成员变量，且所有函数均为**纯虚函数**的类，通常在命名它们的时候会使用大写字母I开头。

[[18-8-virtual-base-classes|18.8 - 虚基类]]

- [[virtual-base-class|虚基类]]是一种基类，不论它被继承多少次，它始终只会被构造一次。

[[18-9-object-slicing|18.9 - 对象切片]]

- 当一个派生类被赋值给一个基类对象时，基类只会得到一份包含了派生类中基类部分的拷贝。这个现象被称为[[object-slicing|对象切片]]。
- *所以函数[[pass-by-value|按值传递]]派生对象时会出现切片，导致派生类虚函数没办法被实际调用*

[[18-10-dynamic-casting|18.10 - 动态类型转换]]

- [[dynamic-casts|动态类型转换]]可以用来将一个指向基类对象的指针转换为指向派生类对象的指针，即[[downcasting]]。如果转换失败，则会返回一个空指针。

[[18-11-printing-inherited-classes-using-operator<<|18.11 - 使用<<运算符打印继承类]]

- 为派生类重载`<<` 运算符的最简单的办法，是重载最基础的基类的`<<`运算符，然后调用虚成员函数来进行打印。