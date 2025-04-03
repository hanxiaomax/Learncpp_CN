---
title: 7.x - 小结与测试 - 作用域、持续时间和链接
alias: 7.x - 小结与测试 - 作用域、持续时间和链接
origin: /none/
origin_title: "6.x — Chapter 6 summary and quiz"
time: 2022-3-29
type: translation
tags:
- summary
- C++17
- C++20
---

## 章节小结

本章的介绍了很多内容。你做的很好！

[[7-1-Compound-statements-blocks|7.1 - 复合语句（语句块）]]

- **复合语句**或者语句块是一组0个或多个语句组成的集合，它们被编译器看做一个整体，就好像一个单一的语句一样。语句块从 `{` 符号开始，到 `}` 符号结束，其中包含了所有的语句。在任何允许使用单一语句的地方，也都可以使用语句块。语句块的结束处不需要使用分号。语句块通常会和if语句一起使用。

[[7-2-User-defined-namespaces-and-the-scope-resolution-operator|7.2 - 用户定义命名空间和作用域解析运算符]]

- [[namespace|命名空间]]指的是你为了自己的声明而创建的命名空间。由C++（全局命名空间）或标准库（`std`命名空间）提供的命名空间不属于用户自定义命名空间；
- 我们可以通过[[scope-resolution-operator|作用域解析运算符]](`::`)来访问命名空间中的声明。作用域解析运算符告诉编译器到运算符左操作数中去查找右操作数。如果不提供左操作数，则会使用全局作用域。

[[7-3-Local-variables|7.3 - 局部变量]]

- **局部变量**（[[7-3-Local-variables|7.3 - 局部变量]]）指的是定义在函数内部的变量（包括函数的[[parameters|形参]]）。局部变量具有语句块作用域，也就是说，它的作用域从变量定义开始，到语句块结束为止。局部变量具有[[automatic-storage-duration|自动存储持续时间]]，也就是说它在定义时被创建，在离开语句块时被销毁。

[[7-4-Introduction-to-global-variables|7.4 - 全局变量]]

- [[global-variable|全局变量]]指的是定义在函数外部的变量。 全局变量具有[[file-scope|文件作用域]]，这也就意味着它的可见范围从变量定义开始到文件结束为止。全局变量具有[[static-storage-duration|静态存储持续时间]]，也是说该变量会在程序开始时创建，程序结束时销毁。尽可能避免对静态变量的动态 初始化。

[[7-5-Variable-shadowing-name-hiding|7.5 - 变量遮蔽]]

- 声明在嵌套语句块中的变量会对外层语句块中的同名变量形成[[shadow|变量遮蔽]]，变量遮蔽应当被避免。

[[7-6-Internal-linkage|7.6 - 内部链接]] & [[7-7-External-linkage-and-variable-forward-declarations|7.7 - 外部链接和变量前向声明]]

- 一个标识符的**[[linkage|链接属性]]，决定了该标识符的其他声明值得是否都是同一个对象。局部变量没有链接属性。具有[[internal-linkage|内部链接]]属性的标识符可以在文件中被访问，但是不能在其他文件中被访问。具有[[external-linkage|外部链接]]属性的标识符则可以在定义它的文件或其他文件中可见或被访问（通过[[forward-declaration|前向声明]]）。

[[7-8-Why-non-const-global-variables-are-evil|7.8 - 为什么非 const 全局变量是魔鬼]] && [[7-10-Sharing-global-constants-across-multiple-files-using-inline-variables|7.10 - 使用 inline 变量共享全局常量]]

- 尽量避免使用非 const 类型的全局变量。const 全局变量通常是可以接受的。如果你的编译器支持C++17，请使用 inline 变量定义全局常量。

[[7-11-Static-local-variables|7.11 - 静态局部变量]]

- 局部变量可以通过`static`关键字赋予其[[static-storage-duration|静态存储持续时间]]。

[[7-13-Using-declarations-and-using directives|7.13 - using 声明和 using 指令]]

- using 语句包括 [[using-declaration|using声明]]和[[using-directive|using指令]]，使用它可以避免使用限定标识符，但是我们应该避免这样做。

[[7-9-Inline-functions|7.9 - 内联函数]]

- [[inline-function|内联函数]]最初的设计目的是提供一种方法告诉编译器将函数调用进行内联展开，但我们并不应该出于该目的而使用 `inline` 关键字，因为编译器通常会为你做决定。在现代 C++ 中，`inline` 关键字用于将函数排除到[[one-definition-rule|单一定义规则(one-definition-rule)]]的限定之外，从而使其定义可以被导入到多个源文件中能够。内联函数通常被定义在头文件中，这样它们的定义就可以在 `#included`时被一同拷贝到源文件中。

[[F-1-Constexpr-and-consteval-functions|F.1 - Constexpr 和 consteval 函数]]

- `constexpr` 函数的返回值**可能**会在[[compile-time|编译时]]求值。使用 `constexpr` 关键字可以将函数定义为 `constexpr` 类型。`constexpr` 函数**有资格**进行编译时求值，而如果它的返回值被使用在需要常量的上下文中时，则一定会进行编译时求值。其他情况下，编译器则可以自由选择是在编译时还是运行时对函数进行求值。
- C++20 引入了新的关键字 `consteval`，它可以要求函数必须进行编译时求值，否则就会产生编译报错。这种函数称为[[immediate-functions|即时函数]]。

[[7-14-Unnamed-and-inline-namespaces|7.14 - 未命名和内联命名空间]]

- 最后，C++ 支持[[unnamed-namespace|匿名命名空间]]，它隐含地将其内部定义的内容赋予[[internal-linkage|内部链接]]。 C++ 同样还支持[[inline-namespace|内联命名空间]]，它为命名空间提供了原生的版本控制机制。

[[7-12-Scope-duration-and-linkage-summary|7.12 - 作用域和链接小结]]