---
title: 21.x - 小结与测试 - 运算符重载
alias: 21.x - 小结与测试 - 运算符重载
origin: /chapter-14-comprehensive-quiz/
origin_title: "14.x — Chapter 14 comprehensive quiz"
time: 2022-9-16
type: translation
tags:
- summary
---

[[21-1-introduction-to-operator-overloading|21.1 - 运算符重载简介]]
- 运算符[[overload|重载]]是函数重载的一种变形，使用它可以为你的类重载操作符。运算符重载应该尽量保持和其原本含义类似的功能。如果新的运算符的含义不明确或违反直觉，那最好还是使用一个函数来代替运算符重载。
- 运算符可以被重载为普通函数、[[friend-function|友元函数]]或者成员函数。下面这些法则可以帮助你决定哪种形式更适合你：
	- 当重载赋值运算符(=)，下标运算符(`[]`)、函数调用运算符(`()`)或者成员选择运算符(`->`)时，重载为**成员函数**；
	- 当重载一元运算符时，重载为**成员函数**；
	- 当重载需要修改其左操作数的二元运算符（例如`+=`）时，如果可以则尽量重载为**成员函数**；
	- 当重载不需要修改其左操作数的二元运算符（例如`+`）时，可以重载为**成员函数**或**友元函数**

[[21-2-overloading-the-arithmetic-operators-using-friend-functions|21.2 - 使用友元重载算数运算符]]
[[21-3-overloading-operators-using-normal-functions|21.3 - 使用普通函数重载运算符]]
[[21-4-overloading-the-IO-operators|21.4 - 重载输入输出运算符]]
[[21-5-overloading-operators-using-member-functions|21.5 - 使用成员函数重载运算符]]
[[21-6-overloading-unary-operators-+--and-!|21.6 - 重载一元运算符+，- 和 !]]
[[21-7-overloading-the-comparison-operators|21.7 - 重载比较运算符]]
[[21-8-overloading-the-increment-and-decrement-operators|21.8 - 重载递增递减运算符]]
[[21-9-overloading-the-subscript-operator|21.9 - 重载下标运算符]]
[[21-10-overloading-the-parenthesis-operator|21.10 - 重载括号运算符]]

[[21-11-Overloading-typecasts|21.11 - 重载类型转换操作符]]
- 类型转换也可以重载，用于提供转换功能，使用它可以显式或隐式地将类转换为其他类型。

[[14-14-the-copy-constructor|14.14 - 拷贝构造函数]] && [[14-15-copy-initialization|14.15 - 拷贝初始化]]
- [[copy-constructors|拷贝构造函数]]是一类特殊的构造函数，用于使用相同类型的一个对象去初始化另外一个对象。当使用相同类型的一个对象，通过直接初始化或[[uniform-initialization|统一初始化]]的方式初始化另外一个对象时(`Fraction f = Fraction(5,3)`)，或者传递、返回值时，拷贝构造函数就会被调用。
- 如果你不提供拷贝构造函数，编译器会自动为你创建一个。编译器提供的拷贝构造函数会使用[[memberwise initialization|成员依次初始化]]，即该对象的每个成员都会从用于初始化它的对象的每个成员依次拷贝。拷贝构造函数可能会出于优化的目的被省略，即使它有副作用，所以不要期望拷贝构造函数一定会执行。

[[14-16-converting-constructors-explicit-and-delete|14.16 - 转换构造函数与explicit和delete关键字]]
- 默认情况下，构造函数会被看做类型转换构造函数。也就是说，编译器可以使用它们隐式地将其他类型的对象转换为这种类型的对象。为了避免这种事情的发生，你可以在构造函数前面添加`explicit`关键字。你也可以删除类中的函数(`=delete`)，比如删除拷贝构造函数或重载的赋值运算符。当调用被删除的函数时，会产生编译错误。

[[21-12-overloading-the-assignment-operator|21.12 - 重载赋值运算符]]
- 赋值运算符可以被重载并用于给你的类赋值，如果你没有提供重载的赋值操作符，编译器则会自动地为你创建一个。重载的赋值运算符应该总是进行自我赋值检查（除非它能够自然地处理，或者你选择使用[[copy-swap习语]]([what is the copy and swap idiom](https://stackoverflow.com/questions/3279543/what-is-the-copy-and-swap-idiom))）。
- 新手程序员经常会把**赋值运算符**和**拷贝构造函数**搞混，其实它们很好区分：
	- 如果一个对象在拷贝前，必须先被创建，则会使用**拷贝构造函数**（注意：包括对象的按值传递和返回）；
	- 如果在拷贝前，不需要先创建一个新的对象，则会使用**赋值运算符**。

[[21-13-shallow-vs-deep-copying|21.13 - 浅拷贝和深拷贝]]
- 默认情况下，编译器会提供一个能够进行[[memberwise initialization|成员依次初始化]]的拷贝构造函数或赋值运算符，其行为称为[[shallow-copy|浅拷贝]]。而如果你的类中包含动态分配的内存，浅拷贝可能会导致问题的发生，因为多个对象最终可能会指向同一块内存。这种情况下，你应该显式地定义对象的拷贝，即进行[[deep-copy|深拷贝]]。如果你可以避免自己进行内存管理，使用标准库中的类，那就更好了。
