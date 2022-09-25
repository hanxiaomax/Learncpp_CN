---
title: 14.x - 小结与测试
alias: 14.x - 小结与测试
origin: /chapter-14-comprehensive-quiz/
origin_title: "14.x — Chapter 14 comprehensive quiz"
time: 2022-9-16
type: translation
tags:
- summary
---

运算符[[overload|重载]]是函数重载的一种变形，使用它可以为你的类重载操作符。运算符重载应该尽量保持和其原本含义类似的功能。如果新的运算符的含义不明确或违反直觉，那最好还是使用一个函数来代替运算符重载。

操作符可以被重载为普通函数、[[friend-function|友元函数]]或者成员函数。下面这些法则可以帮助你决定哪种形式更适合你：

- 当重载赋值运算符(`=`)，下标运算符(`[]`)、函数调用运算符(`()`)或者成员选择运算符(`->`)时，重载为成员函数；
- 当重载一元运算符时，重载为成员函数；
- 当重载需要修改其左操作数的二元运算符（例如`+=`）时，如果可以则尽量重载为成员函数；
- 当重载不需要修改其左操作数的二元运算符（例如`+`）时，可以重载为成员函数或友元函数

类型转换也可以重载，用于提供转换功能，使用它可以显式或隐式地将类转换为其他类型。

[[copy-constructors|拷贝构造函数]]是一类特殊的构造函数，用于使用相同类型的一个对象去初始化另外一个对象。当使用相同类型的一个对象，通过直接初始化或[[统一初始化]]的方式初始化另外一个对象时(`Fraction f = Fraction(5,3)`)，或者传递、返回值时，拷贝构造函数就会被调用。

如果你不提供拷贝构造函数，编译器会自动为你创建一个。编译器提供的拷贝构造函数会使用[[memberwise initialization|成员依次初始化]]，即该对象的每个成员都会从用于初始化它的对象的每个成员依次拷贝。拷贝构造函数可能会出于优化的目的被省略，即使它有副作用，所以不要期望拷贝构造函数一定会执行。

Constructors are considered converting constructors by default, meaning that the compiler will use them to implicitly convert objects of other types into objects of your class. You can avoid this by using the explicit keyword in front of your constructor. You can also delete functions within your class, including the copy constructor and overloaded assignment operator if desired. This will cause a compiler error if a deleted function would be called.

默认情况下，构造函数会被看做类型转换构造函数。也就是说，编译器可以使用它们隐式地将其他类型的对象转换为这种类型的对象。为了避免这种事情的发生，你可以在构造函数前面添加`explicit`关键字。你也可以删除类中的函数，比如删除拷贝构造函数或重载的赋值运算符。当调用被删除的函数时，会产生

The assignment operator can be overloaded to allow assignment to your class. If you do not provide an overloaded assignment operator, the compiler will create one for you. Overloaded assignment operators should always include a self-assignment check (unless it’s handled naturally, or you’re using the copy and swap idiom).

New programmers often mix up when the assignment operator vs copy constructor are used, but it’s fairly straightforward:

-   If a new object has to be created before the copying can occur, the copy constructor is used (note: this includes passing or returning objects by value).
-   If a new object does not have to be created before the copying can occur, the assignment operator is used.

By default, the copy constructor and assignment operators provided by the compiler do a memberwise initialization or assignment, which is a shallow copy. If your class dynamically allocates memory, this will likely lead to problems, as multiple objects will end up pointing to the same allocated memory. In this case, you’ll need to explicitly define these in order to do a deep copy. Even better, avoid doing your own memory management if you can and use classes from the standard library.