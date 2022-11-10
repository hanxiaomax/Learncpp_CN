---
title: 聚合数据类型
alias: 聚合数据类型
english: aggregate-data-type
type: glossary
tags:
- 词汇表
- aggregate-data-type
---

聚合类型包括：
-   array type
-   class type (typically, struct or union), that has
-   no private or protected direct (since C++17)non-static data members
-   no user-declared constructors(until C++11)
-   no [user-provided](https://en.cppreference.com/w/cpp/language/function#User-provided_functions "cpp/language/function"), [inherited](https://en.cppreference.com/w/cpp/language/using_declaration#Inheriting_constructors "cpp/language/using declaration"), or [explicit](https://en.cppreference.com/w/cpp/language/explicit "cpp/language/explicit") constructors (since C++11)  (until C++20)
-   no user-declared or inherited constructors(since C++20)
-   no virtual, private, or protected (since C++17) base classes
-   no virtual member functions
-   no [default member initializers](https://en.cppreference.com/w/cpp/language/data_members#Member_initialization "cpp/language/data members")  (since C++11)  (until C++14)

聚合类型中元素的特点
-   for an array, the array elements in increasing subscript order, or

-   for a class, the non-static data members that are not anonymous [bit-fields](https://en.cppreference.com/w/cpp/language/bit_field "cpp/language/bit field"), in declaration order.

(until C++17)

-   for a class, the direct base classes in declaration order, followed by the direct non-static data members that are neither anonymous [bit-fields](https://en.cppreference.com/w/cpp/language/bit_field "cpp/language/bit field") nor members of an [anonymous union](https://en.cppreference.com/w/cpp/language/union#Anonymous_unions "cpp/language/union"), in declaration order.

(since C++17)