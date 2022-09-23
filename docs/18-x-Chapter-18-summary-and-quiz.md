---
title: 18.x - 小结与测试
alias: 18.x - 小结与测试
origin: /chapter-18-comprehensive-quiz/
origin_title: "18.x — Chapter 18 comprehensive quiz"
time: 2022-8-12
type: translation
tags:
- summary
---

## 复习

- C++ 允许你将基类类型的指针或引用指向派生类的对象。当我们需要编写代码使其能够配合从同一个基类继承的派生类工作时，这个特性非常有用；
- 如果没有虚函数的帮助，指向派生类的基类指针和引用就只能访问基类的成员变量和基类中对应的函数；
- 虚函数的一种特殊类型的函数，它会解析为基类和派生类中共同存在的最后派生的函数（称为[[override|重载]]）。为了实现重载。派生类的函数和基类中的虚函数必须具有相同的函数签名和返回值类型。一个例外的情况是[[covariant|协变返回值类型]]，这种情况下重载函数的返回值可以返回派生类类型的指针或引用，而不必和基类中的函数一样也返回基类类型的指针和引用；
- 如果一个函数的目的是重载另外一个函数，我们应该使用`override`来修饰它以便确保它被重载；
- `final` 关键字可以用来指明某个函数不可以被重载或某个类不能被继承；
- 如果一个类的功能是作为基类使用，那应该将其析构函数设为虚函数，这样才能确保一个指向派生类的基类类型的指针被 `delete` 的时候，能够调用正确的析构函数（子类的析构函数）；
- 使用[[scope-resolution-operator|作用域解析运算符]]可以规避虚函数解析，它可以直接显式地指定你希望使用哪个类中的函数：例如： `base.Base::getName()`；
- Early binding occurs when the compiler encounters a direct function call. The compiler or linker can resolve these function calls directly. Late binding occurs when a function pointer is called. In these cases, which function will be called can not be resolved until runtime. Virtual functions use late binding and a virtual table to determine which version of the function to call.
- Using virtual functions has a cost: virtual functions take longer to call, and the necessity of the virtual table increases the size of every object containing a virtual function by one pointer.
- A virtual function can be made pure virtual/abstract by adding “= 0” to the end of the virtual function prototype. A class containing a pure virtual function is called an abstract class, and can not be instantiated. A class that inherits pure virtual functions must concretely define them or it will also be considered abstract. Pure virtual functions can have a body, but they are still considered abstract.
- An interface class is one with no member variables and all pure virtual functions. These are often named starting with a capital I.
- A virtual base class is a base class that is only included once, no matter how many times it is inherited by an object.
- When a derived class is assigned to a base class object, the base class only receives a copy of the base portion of the derived class. This is called object slicing.
- Dynamic casting can be used to convert a pointer to a base class object into a pointer to a derived class object. This is called downcasting. A failed conversion will return a null pointer.
- The easiest way to overload operator<< for inherited classes is to write an overloaded operator<< for the most-base class, and then call a virtual member function to do the printing.