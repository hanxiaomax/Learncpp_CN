---
title: 19.x - 小结与测试
alias: 19.x - 小结与测试
origin: /chapter-19-comprehensive-quiz/
origin_title: "19.x — Chapter 19 comprehensive quiz"
time: 2022-7-22
type: translation
tags:
- summary
---

Templates allow us to write functions or classes using placeholder types, so that we can stencil out identical versions of the function or class using different types. A function or class that has been instantiated is called a function or class instance.

All template functions or classes must start with a template parameter declaration that tells the compiler that the following function or class is a template function or class. Within the template parameter declaration, the template type parameters or expression parameters are specified. Template type parameters are just placeholder types, normally named T, T1, T2, or other single letter names (e.g. S). Expression parameters are usually integral types, but can be a pointer or reference to a function, class object, or member function.

Splitting up template class definition and member function definitions doesn’t work like normal classes -- you can’t put your class definition in a header and member function definitions in a .cpp file. It’s usually best to keep all of them in a header file, with the member function definitions underneath the class.

Template specialization can be used when we want to override the default behavior from the templated function or class for a specific type. If all types are overridden, this is called full specialization. Classes also support partial specialization, where only some of the templated parameters are specialized. Functions can not be partially specialized.

Many classes in the C++ standard library use templates, including std::array and std::vector. Templates are often used for implementing container classes, so a container can be written once and used with any appropriate type.

