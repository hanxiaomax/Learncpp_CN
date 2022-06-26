---
title: 8.x - 小结与测试
alias: 8.x - 小结与测试
origin: /chapter-8-summary-and-quiz/
origin_title: "8.x — Chapter 8 summary and quiz"
time: 2022-1-20
type: translation
tags:
- summary
---

学完咯！本章的主题(特别是类型别名、重载函数和函数模板)在 C++ 标准库中随处可见。我们还有一章要讲(介绍复合类型)，然后我们将准备好深入研究标准库中最有用的部分！

## 复习

将一种数据类型转换为另外一种数据类型的过程叫做**类型转换**。

当需要一种数据类型，但提供了不同的数据类型时，则会执行[[implicit-type-conversion|隐式类型转换]](也称为自动类型转换或强制转换)。如果编译器能够找到两种类型之间进进行隐式类型转换的规则，则它会执行隐式类型转换，否则就会产生编译报错。（[[8-1-Implicit-type-conversion-coercion|8.1 - 隐式类型转换]]）

C++ 语言定义了许多基本类型之间的内置转换方式(以及一些更高级的类型的转换)，称为**标准转换**。其中包括**数值提升**、**数值转换**和**算数转换**


[[numeric promotions|数值提升]]（[[8-2-Floating-point-and-integral-promotion|8.2 - 浮点数和整型提升]]）是将较小的数值类型转换为较大的数值类型(通常为 `int` 或 `double` )，这样CPU就可以对与处理器自然数据大小相匹配的数据进行操作。数值提升包括整数提升和浮点提升。数字提升是保值的，这意味着不会丢失值或值的精度。

[[numeric-conversions|数值转换]]（[[8-3-Numeric-conversions|8.3 - 数值转换]]）数值转换是基本类型之间的类型转换，而不是数值提升。收缩转换可能会导致值或精度的损失。

在C++中，某些二元操作符要求它们的操作数具有相同的类型。如果提供了不同类型的操作数，则使用一组称为**普通算术转换**（[[8-4-Arithmetic-conversions|8.4 - 算术转换]]）规则将其中一个或两个操作数隐式转换为匹配类型。

当程序员显式地通过 cast 来进行类型转换时，称为[[explicit-type-conversion|显式类型转换]]（[[8-5-Explicit-type-conversion-casting-and-static-cast|8.5 - 显式类型转换和static_cast]]）。C++支持5种类型强制转换：[[C-style-casts|C风格类型转换]]、[[static-casts|静态类型转换]]、[[const-cast|const 类型转换]]、[[dynamic-casts|动态类型转换]]和[[reinterpret-casts|重新解释类型转换]]。一般来说，你应该避免使用"C风格类型转换”、“const类型转换”和“重新解释类型转换”。`static_cast` 用于将一个值从一种类型转换为另一种类型，它是目前C++中被最多使用的强制转换。


[[8-6-Typedefs-and-type-aliases|typedef 和类型别名]]允许程序员为数据类型创建别名。这些别名不是新类型，并且与原类型的操作相同。Typedefs 和类型别名不提供任何类型安全机制，需要注意的是，不要假定类型别名和其原类型是有区别的。

`auto`关键字有很多用途。首先，`auto` 可用于进行类型推断([[8-7-Type-deduction-for-objects-using-the auto-keyword|8.7 - 使用 auto 关键字进行类型推断]])，它将从变量的初始化值推断出变量的类型。但是，类型推断会丢弃 const 和引用，所以如果需要，请确保将它们添加回来。

`auto` 也可以用作函数返回类型的推断（[[8-8-Type-deduction-for-functions|8.8 - 函数的类型推断]]），编译器可以从函数的`return`语句中推断出函数的返回类型，不过对于普通函数应该避免这样做。`auto` 被用作尾随返回语法的一部分。

Auto can also be used as a function return type to have the compiler infer the function’s return type from the function’s return statements, though this should be avoided for normal functions. Auto is used as part of the trailing return syntax.

**Function overloading** allows us to create multiple functions with the same name, so long as each identically named function has different set of parameter types (or the functions can be otherwise differentiated). Such a function is called an overloaded function (or overload for short). Return types are not considered for differentiation.

When resolving overloaded functions, if an exact match isn’t found, the compiler will favor overloaded functions that can be matched via numeric promotions over those that require numeric conversions. When a function call is made to function that has been overloaded, the compiler will try to match the function call to the appropriate overload based on the arguments used in the function call. This is called overload resolution.

An **ambiguous match** occurs when the compiler finds two or more functions that can match a function call to an overloaded function and can’t determine which one is best.

A **default argument** is a default value provided for a function parameter. Parameters with default arguments must always be the rightmost parameters, and they are not used to differentiate functions when resolving overloaded functions.

**Function templates** allow us to create a function-like definition that serves as a pattern for creating related functions. In a function template, we use **template types** as placeholders for any types we want to be specified later. The syntax that tells the compiler we’re defining a template and declares the template types is called a **template parameter declaration**.

The process of creating functions (with specific types) from function templates (with template types) is called **function template instantiation** (or instantiation) for short. When this process happens due to a function call, it’s called **implicit instantiation**. An instantiated function is called a **function instance** (or **instance** for short, or sometimes a **template function**).

**Template argument deduction** allows the compiler to deduce the actual type that should be used to instantiate a function from the arguments of the function call. Template argument deduction does not do type conversion.

Template types are sometimes called **generic types**, and programming using templates is sometimes called **generic programming**.

In C++20, when the auto keyword is used as a parameter type in a normal function, the compiler will automatically convert the function into a function template with each auto parameter becoming an independent template type parameter. This method for creating a function template is called an **abbreviated function template**.
