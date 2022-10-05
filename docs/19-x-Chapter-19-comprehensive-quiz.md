---
title: 19.x - 小结与测试 - 模板和类
alias: 19.x - 小结与测试 - 模板和类
origin: /chapter-19-comprehensive-quiz/
origin_title: "19.x — Chapter 19 comprehensive quiz"
time: 2022-7-22
type: translation
tags:
- summary
---

- 使用[[template|模板]]可以基于[[placeholder-types|占位符类型]]来定义函数或者类，这样我们就可以定义出配合不同类型工作，但是结构完全一致的函数或者类。被实例化的函数或者类，称为[[函数实例]]或[[类实例]]
- 所有的模板函数或模板类，都必须以[[template-parameter-declaration|模板参数声明]]开头。在模板参数声明中，我们需要指定模板的类型参数或表达式参数。[[template-type-parameters|模板类型参数]]其实就是[[placeholder-types|占位符类型]]，通常会写作`T`，`T1`，`T2`或者其他单独字母（例如`S`）。[[Expression-parameters|表达式参数]]通常是整型类型，但是也可以是指针或者引用类型（指向某个函数，对象或成员函数）。
- 模板类及其成员函数定义并不能像其他一般类那样进行分离——你不能将类的定义放在头文件中然后将成员函数的定义放在`.cpp`文件中。通常情况下，最好将它们都定义在一个头文件中，模板类的定义在前，其成员函数的定义在后。
- [[Template specialization]] can be used when we want to override the default behavior from the templated function or class for a specific type. If all types are overridden, this is called full specialization. Classes also support partial specialization, where only some of the templated parameters are specialized. Functions can not be partially specialized.
- C++标准库中的很多类都使用了模板，包括 `std::array` 和 `std::vector`。模板经常被用来实现容器类，这样的容器类就可以配合任意类型的对象来使用。

