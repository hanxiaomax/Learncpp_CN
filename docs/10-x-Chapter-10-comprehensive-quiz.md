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

[[10-1-Introduction-to-program-defined-user-defined-types|10.1 - 程序定义类型简介]]

- 用户定义类型是一种自定义类型，我们可以在程序中创建它用于某些目的。基于枚举类型和class类型（包括结构体、类和联合）我们可以创建需要的自定义类型。自定义类型在使用前必须先定义，定义它的过程则称为[[type-definition|类型定义]]。类型定义不需要遵循[[one-definition-rule|单一定义规则(one-definition-rule)]]。

[[10-2-unscoped-enumerations|10.2 - 非限定作用域枚举类型]]
[[10-3-unscoped-enumeration-input-and-output|10.3 - 限定作用域枚举类型的输入输出]]

- 枚举（称为枚举类型或enum）是一种复合数据类型，它的每个可能值都被定义为[[symbolic-constants|符号常量]]（称为枚举值）。枚举值是一种确切的数据类型，也就是说编译器可以区分它和其他类型（不像[[8-6-Typedefs-and-type-aliases|类型别名]]那样）。
- [[unscoped-enumerations|无作用域枚举类型]]会将自己的枚举值名称导入到与自己相同的作用域中(而不是像命名空间那样创建新的作用域区域)。无作用域枚举 会被yiUnscoped enumerations will implicitly convert to integral values.


[[10-4-scoped-enumerations-enum-classes|10.4 - 限定作用域枚举（枚举类）]]
- [[scoped-enumerations|限定作用域枚举]] work similarly to unscoped enumerations but are strongly typed (they won’t implicitly convert to integers) and strongly scoped (the enumerators are only placed into the scope region of the enumeration).

[[10-5-Introduction-to-structs-members-and-member-selection|10.5 - 结构体、成员和成员选择]]

- 结构体是一种自定义类型，使用它可以将多个变量打包为一个单独的类型。变量是结构体（或类）的一部分，称为数据成员或[[member-variable|成员变量]]。访问成员函数需要在结构体变量名（普通结构体或结构体引用）和成员名之间使用[[member-selection-operator|成员选择运算符]]（`operator .`），或者使用指针运算符(`operator->`) （对于结构体指针而言）。

[[10-6-struct-aggregate-initialization|10.6 - 结构体的聚合初始化]]

- ==在一般编程领域，[[aggregate-data-type|聚合数据类型]]（通常称为聚合）是指任何可以包含多个数据成员的类型。在 C++ 中，只包含数据成员的数组和结构体是聚合。==
- 聚合使用一种被称为[[aggregate-initialization|聚合初始化]]的初始化形式，使用聚合初始化可以直接初始化聚合的成员。为此，我们需要提供一个初始化列表作为初始化值，而所谓初始化列表就是一个以逗号分割值的列表。聚合初始化使用[[memberwise initialization|成员依次初始化]]方式，即结构体的每个成员依照其声明顺序进行初始化。
- ==在 C++20 中，使用[[designated-initializers|指定初始化]]可以显式地指定将初始化值映射到哪个成员。结构体成员必须按照声明的顺序初始化，否则会报错。==

[[10-7-default-member-initialization|10.7 - 默认成员初始化]]

- 定义结构(或类)类型时，可以为每个成员提供默认初始化值，作为类型定义的一部分。这个过程称为[[non-static-member-initialization|非静态成员初始化]]，初始化值称为[[default-member-initializer|默认成员初始化值]]。
- 
[[10-8-struct-passing-and-miscellany|10.8 - 结构体传递及其他]]

- 出于性能原因，编译器有时会在结构中添加间隙(这称为填充)，因此结构体的大小可能大于其成员的大小之和。

[[10-9-member-selection-with-pointers-and-references|10.9 - 基于指针和引用的成员选择]]

[[10-11-class-template-argument-deduction-and-deduction -guides|10.11 - 类模板参数推断CTAD]]

- [[class-template|类模板]]是实例化类类型(结构、类或联合)的模板定义。[[class-template-argument-deduction|类模板实参推断(CTAD)]]是 C++17的一个特性，它允许编译器从初始化式中推断模板类型实参。
