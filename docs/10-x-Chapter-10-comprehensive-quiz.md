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

枚举（称为枚举类型或enum）是一种复合数据类型，它的每个可能值都被denumeration (also called an enumerated type or an enum) is a compound data type where every possible value is defined as a symbolic constant (called an enumerator). Enumerators are distinct types, meaning the compiler can differentiate it from other types (unlike type aliases).

Unscoped enumerations are named such because they put their enumerator names into the same scope as the enumeration definition itself (as opposed to creating a new scope region like a namespace does). Unscoped enumerations also provide a named scope region for their enumerators. Unscoped enumerations will implicitly convert to integral values.

Scoped enumerations work similarly to unscoped enumerations but are strongly typed (they won’t implicitly convert to integers) and strongly scoped (the enumerators are only placed into the scope region of the enumeration).

A struct (short for structure) is a program-defined data type that allows us to bundle multiple variables together into a single type. The variables that are part of the struct (or class) are called data members (or member variables). To access a specific member variable, we use the member selection operator (`operator.`) in between the struct variable name and the member name (for normal structs and references to structs), or the member selection from pointer operator (`operator->`) (for pointers to structs).

In general programming, an aggregate data type (also called an aggregate) is any type that can contain multiple data members. In C++, arrays and structs with only data members are aggregates.

Aggregates use a form of initialization called aggregate initialization, which allows us to directly initialize the members of aggregates. To do this, we provide an initializer list as an initializer, which is just a list of comma-separated values. Aggregate initialization does a memberwise initialization, which means each member in the struct is initialized in the order of declaration.

In C++20, Designated initializers allow you to explicitly define which initialization values map to which members. The members must be initialized in the order in which they are declared in the struct, otherwise an error will result.

When we define a struct (or class) type, we can provide a default initialization value for each member as part of the type definition. This process is called non-static member initialization, and the initialization value is called a default member initializer.

For performance reasons, the compiler will sometimes add gaps into structures (this is called padding), so the size of a structure may be larger than the sum of the size of its members.

A class template is a template definition for instantiating class types (structs, classes, or unions). Class template argument deduction (CTAD) is a C++17 feature that allows the compiler to deduce the template type arguments from an initializer.