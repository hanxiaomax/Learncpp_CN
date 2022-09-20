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

- **复合数据类型** (也称作**组合数据类型**)，指的是哪些由基础数据类型组成的数据类型（或由其他复合类型组成）。
- 一个表达式的值类别（value category）表明一个表达式最终会被解析为一个值、一个函数还是某种类型的对象。
- 左值（lvalue）表达式求值为一个具有标识的函数或者一个对象。一个对象具有标识，意味着它具有标识符或者一个具有标识的内存地址。左值有两个子类：可变左值是可以被修改的左值，不可变左值是不可以被修改的左值（通常因为它们是`const`或`constexpr`类型的）。
- 当表达式不是左值时，它便是右值（rvalue）。包括字面量（字符串字面量除外）和函数或操作（当[[按值返回]]时）的返回值。
- **引用**是某个已经**存在**的对象的别名。引用一旦被定义，任何对引用的操作都相当于操作该引用所表示的对象。C++ 有两种引用，左值引用和右值引用。左值引用（简称引用）就是某个左值的别名。左值引用变量就是一个用作左值引用的变量，其引用的左值通常是另外一个变量。
- 当使用对象或函数对引用进行初始化之后，我们说该引用和对象或函数绑定了。被引用的对象或者函数称为referent。
- 左值引用不可以被绑定到不可修改的左值或右值（不然的话你就可以通过该引用来修改它们的值了，这违反了它们作为常量的属性）。因此，左值引用有时也被称为左值非常量引用（简称常量引用）。
- 引用一旦初始化，它便不能够被重置，也就是说不能修改它去引用别的对象。
- 当如果对象先于它的引用被销毁，则该引用会指向一个不存在的对象，此时该引用被称为[[dangling|悬垂]]引用。访问悬垂引用会导致[[1-6-Uninitialized-variables-and-undefined-behavior|未定义行为]]。
- 当使用`const` 关键字来修饰一个左值引用时，即要求该引用将它所引用的对象看做常量。此时成该引用为**指向常量值的左值引用**（简称指向常量的引用或常量引用）。**常量引用**可以被绑定到可以修改左值，不可修改左值和右值。
- 一个临时对象（有时称为未命名对象或匿名对象）是指在一个单一表达式中为了临时使用而创建的对象（使用后销毁）。
- 当进行[[pass-by-reference|按引用传递]]时，我们将函数的[[parameters|形参]]声明为引用或常量引用而不是普通的变量。当函数被调用时，形参中的引用会绑定到[[arguments|实参]]。因为引用只是对象的别名，所以这种情况下并不会创建实参的拷贝。
- [[address-of-operator|取地址运算符 (&)]]会返回其操作数的地址。而[[dereference-operator |解引用(*)]]运算符则会返回给定地址存放的左值。
- 指针是一个对象，它**持有**一个内存地址（通常是另外一个变量的地址）作为其值。使用指针我们可以将某个对象的地址保存起来以便稍后使用。和不同的变量一样，指针不会被默认初始化。而没有被初始化的指针通常被称为[[wild-pointer|野指针]]。[[dangling|悬垂]]指针则是那些保存着无效地址的指针（该地址中的对象已经被销毁）。

除了内存地址，指针还可以保存一个特殊值，即空值（null）。null是一个特殊值它表示空值。当指针的值为null时，表示它没有指向任何地址。此时该指针被称为空指针。关键字[[nullptr]]是空指针的字面量。我们可以通过`nullptr`来显式地为指针初始化或赋值为空值。

A pointer should either hold the address of a valid object, or be set to `nullptr`. That way we only need to test pointers for null, and can assume any non-null pointer is valid.

A pointer to a const value (sometimes called a pointer to const for short) is a (non-const) pointer that points to a constant value.

A const pointer is a pointer whose address can not be changed after initialization.

A const pointer to a const value can not have its address changed, nor can the value it is pointing to be changed through the pointer.

With pass by address, instead of providing an object as an argument, the caller provides an object’s address (via a pointer). This pointer (holding the address of the object) is copied into a pointer parameter of the called function (which now also holds the address of the object). The function can then dereference that pointer to access the object whose address was passed.

Return by reference returns a reference that is bound to the object being returned, which avoids making a copy of the return value. Using return by reference has one major caveat: the programmer must be sure that the object being referenced outlives the function returning the reference. Otherwise, the reference being returned will be left dangling (referencing an object that has been destroyed), and use of that reference will result in undefined behavior. If a parameter is passed into a function by reference, it’s safe to return that parameter by reference.

If a function returns a reference, and that reference is used to initialize or assign to a non-reference variable, the return value will be copied (as if it had been returned by value).

Type deduction for variables (via the `auto` keyword) will drop any reference or top-level const qualifiers from the deduced type. These can be reapplied as part of the variable declaration if desired.

Return by address works almost identically to return by reference, except a pointer to an object is returned instead of a reference to an object.