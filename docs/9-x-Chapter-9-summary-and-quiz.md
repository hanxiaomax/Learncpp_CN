---
title: 9.x - 小结与测试
alias: 9.x - 小结与测试
origin: /chapter-9-summary-and-quiz/
origin_title: "9.x — Chapter 9 summary and quiz"
time: 2022-6-12
type: translation
tags:
- summary
---

## 复习

**复合数据类型** (也称作**组合数据类型**)，指的是哪些由基础数据类型组成的数据类型（或由其他复合类型组成）。

一个表达式的值类别（value category）表明一个表达式最终会被解析为一个值、一个函数还是某种类型的对象。

左值（lvalue）表达式求值为一个具有标识的函数或者一个对象。一个对象具有标识，意味着它具有标识符或者一个具有标识的内存地址。左值有两个子类：可变左值是可以被修改的左值，不可变左值是不可以被修改的左值（通常因为它们是`const`或`constexpr`类型的）。

当表达式不是左值时，它便是右值（rvalue）。包括字面量（字符串字面量除外）和函数和操作（当[[按值返回]]时）的返回值。

**引用**是某个已经**存在**的对象的别名。引用一旦被定义，任何对引用的操作都相当于操作该引用所表示的对象。C++ 有两种引用，左值引用和右值引用。左值引用（简称引用）就是某个左值的别名。左值引用变量就是一个用作左值引用的变量，其引用的左值通常是另外一个变量。

当使用对象或函数对引用进行初始化之后，我们说该引用和对象或函数绑定了。被引用的对象或者函数称为referent。

左值引用不可以被绑定到不可修改的左值或右值Lvalue references can’t be bound to non-modifiable lvalues or rvalues (otherwise you’d be able to change those values through the reference, which would be a violation of their const-ness). For this reason, lvalue references are occasionally called lvalue references to non-const (sometimes shortened to non-const reference).

Once initialized, a reference in C++ cannot be reseated, meaning it can not be changed to reference another object.

When an object being referenced is destroyed before a reference to it, the reference is left referencing an object that no longer exists. Such a reference is called a dangling reference. Accessing a dangling reference leads to undefined behavior.

By using the `const` keyword when declaring an lvalue reference, we tell an lvalue reference to treat the object it is referencing as const. Such a reference is called an lvalue reference to a const value (sometimes called a reference to const or a const reference). Const references can bind to modifiable lvalues, non-modifiable lvalues, and rvalues.


A temporary object (also sometimes called an unnamed object or anonymous object) is an object that is created for temporary use (and then destroyed) within a single expression.

When using pass by reference, we declare a function parameter as a reference (or const reference) rather than as a normal variable. When the function is called, each reference parameter is bound to the appropriate argument. Because the reference acts as an alias for the argument, no copy of the argument is made.

The address-of operator (&) returns the memory address of its operand. The dereference operator (*) returns the value at a given memory address as an lvalue.

A pointer is an object that holds a _memory address_ (typically of another variable) as its value. This allows us to store the address of some other object to use later. Like normal variables, pointers are not initialized by default. A pointer that has not been initialized is sometimes called a wild pointer. A dangling pointer is a pointer that is holding the address of an object that is no longer valid (e.g. because it has been destroyed).

Besides a memory address, there is one additional value that a pointer can hold: a null value. A null value (often shortened to null) is a special value that means something has no value. When a pointer is holding a null value, it means the pointer is not pointing at anything. Such a pointer is called a null pointer. The nullptr keyword represents a null pointer literal. We can use `nullptr` to explicitly initialize or assign a pointer a null value.

A pointer should either hold the address of a valid object, or be set to `nullptr`. That way we only need to test pointers for null, and can assume any non-null pointer is valid.

A pointer to a const value (sometimes called a pointer to const for short) is a (non-const) pointer that points to a constant value.

A const pointer is a pointer whose address can not be changed after initialization.

A const pointer to a const value can not have its address changed, nor can the value it is pointing to be changed through the pointer.

With pass by address, instead of providing an object as an argument, the caller provides an object’s address (via a pointer). This pointer (holding the address of the object) is copied into a pointer parameter of the called function (which now also holds the address of the object). The function can then dereference that pointer to access the object whose address was passed.

Return by reference returns a reference that is bound to the object being returned, which avoids making a copy of the return value. Using return by reference has one major caveat: the programmer must be sure that the object being referenced outlives the function returning the reference. Otherwise, the reference being returned will be left dangling (referencing an object that has been destroyed), and use of that reference will result in undefined behavior. If a parameter is passed into a function by reference, it’s safe to return that parameter by reference.

If a function returns a reference, and that reference is used to initialize or assign to a non-reference variable, the return value will be copied (as if it had been returned by value).

Type deduction for variables (via the `auto` keyword) will drop any reference or top-level const qualifiers from the deduced type. These can be reapplied as part of the variable declaration if desired.

Return by address works almost identically to return by reference, except a pointer to an object is returned instead of a reference to an object.