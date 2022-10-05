---
title: 10.x - 小结与测试 - 枚举和结构体
alias: 10.x - 小结与测试 - 枚举和结构体
origin: /chapter-10-comprehensive-quiz/
origin_title: "10.x — Chapter 10 comprehensive quiz"
time: 2022-5-2
type: translation
tags:
- summary
---

用户定义类型是一种自定义类型，我们可以在程序中创建它用于某些目的。基于枚举类型和class类型（包括结构体、类和联合）我们可以创建需要的自定义类型。自定义类型在使用前必须先定义，定义它的过程则称为[[type-definition|类型定义]]。类型定义不需要遵循[[one-definition-rule|单一定义规则(one-definition-rule)]]。

枚举（称为枚举类型或enum）是一种复合数据类型，它的每个可能值都被定义为[[symbolic-constants|符号常量]]（称为枚举值）。枚举值是一种确切的数据类型，也就是说编译器可以区分它和其他类型（不像[[8-6-Typedefs-and-type-aliases|类型别名]]那样）。

[[unscoped-enumerations]] are named such because they put their enumerator names into the same scope as the enumeration definition itself (as opposed to creating a new scope region like a namespace does). Unscoped enumerations also provide a named scope region for their enumerators. Unscoped enumerations will implicitly convert to integral values.

[[scoped-enumerations]] work similarly to unscoped enumerations but are strongly typed (they won’t implicitly convert to integers) and strongly scoped (the enumerators are only placed into the scope region of the enumeration).

结构体是一种自定义类型，使用它可以将多个变量打包为一个单独的类型。变量是结构体（或类）的一部分，称为数据成员或[[member-variable|成员变量]]。访问成员函数需要在结构体变量名（普通结构体或结构体引用）和成员名之间使用[[member-selection-operator|成员选择运算符]]（`operator .`），或者使用指针运算符(`operator->`) （对于结构体指针而言）。

在一般编程领域，聚合数据类型（通常称为聚合）是指任何可以包含多个数据成员的类型。在 C++ 中，数组和结构体In general programming, an aggregate data type (also called an aggregate) is any type that can contain multiple data members. In C++, arrays and structs with only data members are aggregates.

聚合使用一种被称为[[aggregate-initialization|聚合初始化]]的初始化形式，使用聚合初始化可以直接初始化聚合的成员。为此，我们需要提供一个初始化列表作为初始化值，而所谓初始化列表就是一个以逗号分割值的列表。聚合Aggregate initialization does a memberwise initialization, which means each member in the struct is initialized in the order of declaration.

In C++20, Designated initializers allow you to explicitly define which initialization values map to which members. The members must be initialized in the order in which they are declared in the struct, otherwise an error will result.

When we define a struct (or class) type, we can provide a default initialization value for each member as part of the type definition. This process is called non-static member initialization, and the initialization value is called a default member initializer.

For performance reasons, the compiler will sometimes add gaps into structures (this is called padding), so the size of a structure may be larger than the sum of the size of its members.

A class template is a template definition for instantiating class types (structs, classes, or unions). Class template argument deduction (CTAD) is a C++17 feature that allows the compiler to deduce the template type arguments from an initializer.