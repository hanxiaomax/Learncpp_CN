---
title: 10.1 - 自定义类型简介
alias: 10.1 - 自定义类型简介
origin: /introduction-to-program-defined-user-defined-types/
origin_title: "10.1 — Introduction to program-defined (user-defined) types"
time: 2022-9-16
type: translation
tags:
- type

---

??? note "关键点速记"
	

基本数据类型是 C++ 语言的核心部分，设计它们的目的就是为了可以在需要时拿来就用。例如，当我们需要定义一个`int`或者`double`类型的时候，我们只需要：

```cpp
int x; // define variable of fundamental type 'int'
double d; // define variable of fundamental type 'double'
```

对于那些由基本数据类型通过简单扩展而得到的[[9-1-Introduction-to-compound-data-types|复合数据类型]]也是一样的（包括函数、指针、引用和数组）：

```cpp
void fcn(int) {}; // define a function of type void()(int)
int* ptr; // define variable of compound type 'pointer to int'
int& ref; // define variable of compound type 'reference to int'
int arr[5]; // define an array of 5 integers of type int[5] (we'll cover this in a future chapter)
```

这些组合可以正确工作是因为C++语言已经知晓这些数据类型名（和符号）的含义——因此我们不必提供或导入其定义。

而对于使用类型别名（[[8-6-Typedefs-and-type-aliases|8.6 - typedef 和类型别名]]）的情况来说，类型别名使我们可以为一个已知类型定义一个新的名字，因此类型别名实际上向程序引入了一个新的标识符，所以类型别名必须先定义后使用：

```cpp
#include <iostream>

using length = int; // define a type alias with identifier 'length'

int main()
{
    length x { 5 }; // we can use 'length' here since we defined it above
    std::cout << x;

    return 0;
}
```

如果没有对 `length` 定义，编译器将无法知道在我们使用它定义变量时知晓其含义。对`length`的定义并没有创建一个新的对象——它只是告诉编译器 `length` 你稍后可以使用它定义变量。

## 用户定义类型是什么？

在 [[9-1-Introduction-to-compound-data-types|9.1 - 复合数据类型]] 一课中，我们曾经介绍过如何存储一个分数。对于分数来说，它包括分子和分母两个部分，而且它们之间是存在概念性联系的。在本节课中，我们会讨论使用两个整型分别表示分子分母可能带来的问题。

如果C++有能够表示分数的内建类型就好了——但可惜并没有。还有数百种其他可能有用的类型C++没有包含，因为它不可能预测人们可能需要的所有东西(更不用说实现和测试那些东西了)。

相反，C++提供了解决该问题的另外一种途径：允许我们在程序中创建全新的自定义类型！这样的类型通常称为用户定义类型(尽管我们认为术语程序定义类型更好——我们将在本课后面讨论其区别)。C++有两类复合类型可以实现这一点：枚举类型(包括[[unscoped-enumerations|非限定作用域枚举类型]]和[[scoped-enumerations|限定作用域枚举]])和类类型(包括结构体、类和联合体)。


## 定义一个程序定义类型

就像[[type-aliases|类型别名]]一样，程序定义类型也必须先定义后使用。程序定义类型的定义称为类型定义。

尽管结构体还尚未介绍，但我们可以先从下面的例子中了解到，自定义类型`Fraction`和该类型对象是如何初始化的。

```cpp
// Define a program-defined type named Fraction so the compiler understands what a Fraction is
// (we'll explain what a struct is and how to use them later in this chapter)
// This only defines what a Fraction type looks like, it doesn't create one
struct Fraction
{
	int numerator {};
	int denominator {};
};

// Now we can make use of our Fraction type
int main()
{
	Fraction f{ 3, 4 }; // this actually instantiates a Fraction object named f

	return 0;
}
```


在本例中，我们使用`struct` 关键字来定义一个名为`Fraction` 的新程序定义类型(在全局作用域中，因此它可以在文件的其他地方使用)。这不会分配任何内存——它只是告诉编译器`Fraction` 是什么样子的，所以我们可以稍后再为`Fraction`类型的对象分配内存。然后，在`main()`内部，实例化(并初始化)一个名为`f`的`Fraction`类型变量。

类型定义总是以分号结尾。没有在类型定义的末尾包含分号是一个常见的程序员错误，而且这个错误很难调试，因为编译器通常会在类型定义后面的行报错。例如，如果你从上面例子的`Fraction`定义(第8行)末尾删除分号，编译器可能会因为`main()`的定义(第11行)报错。


!!! warning "注意"

	不要忘记以分号结束类型定义，否则编译器通常会在下一行代码中出错。

我们将在下一课([[10-2-unscoped-enumerations|10.2 - 非限定作用域枚举类型]]中展示更多定义和使用程序定义类型的例子，并且我们将从[[10-5-Introduction-to-structs-members-and-member-selection|10.5 - 结构体、成员和成员选择]]开始介绍结构体。


## 命名一个自定义类型

按照管理，自定义类型的名字应该以大写字母开头，而且不要添加任何的后缀(例如：`Fraction`，而不是 `fraction`，`fraction_t` 或者 `Fraction_t`)。

!!! success "最佳实践"

	以大写字母开始命名自定义类型，不要使用后缀。

由于类型名和变量名之间的相似性，新手程序员时常会觉得下面这样的变量定义令人困惑:

```cpp
Fraction fraction {}; // 实例化一个名为 fraction 的 Fraction 类型的对象
```

但这与其他类型的变量定义并没有什么区别：类型(`Fraction`)在前(因为 `Fraction` 是大写的，我们知道它是一个自定义类型)，然后是变量名(`fraction`)，然后是一个可选的初始化值。因为C++是区分大小写的，所以这里不存在命名冲突!


## 在多文件程序中使用自定义类型


每个使用程序定义类型的代码文件在使用之前都需要看到完整的类型定义。[[forward-declaration|前向声明]]是不够的。看到完整定义是必需的，因为编译器需要知道要为该类型的对象分配多少内存。

为了能将定义引入需要使用该类型定义的文件，自定义类型通常被定义在头文件中，然后使用 `#included` 导入任何需要该定义的文件。这些头文件通常和类型具有相同的名字（例如 `Fraction`应该定义在`Fraction.h`中）。

!!! success "最佳实践"

	- 只在一个代码文件中使用的程序定义类型应该在该代码文件中尽可能靠近第一个使用点定义。
	- 在多个代码文件中使用的程序定义类型应该在与程序定义类型同名的头文件中定义，然后根据需要在每个代码文件中使用“#included”。


下面是一个例子，如果我们把我们的`Fraction`类型移动到一个头文件(名为`Fraction.h`)，这样它就可以包含在多个代码文件中:


```cpp title="Fraction.h"
#ifndef FRACTION_H
#define FRACTION_H

// Define a new type named Fraction
// This only defines what a Fraction looks like, it doesn't create one
// Note that this is a full definition, not a forward declaration
struct Fraction
{
	int numerator {};
	int denominator {};
};

#endif
```


```cpp title="Fraction.cpp"
#include "Fraction.h" // include our Fraction definition in this code file

// Now we can make use of our Fraction type
int main()
{
	Fraction f{ 3, 4 }; // this actually creates a Fraction object named f

	return 0;
}
```

## 类型定义部分上豁免于单一定义原则


In lesson [[2-7-Forward-declarations-and-definitions|2.7 - 前向声明和定义]]， we discussed how the one-definition rule requires that each function and global variable only have one definition per program. To use a given function or global variable in a file that does not contain the definition, we need a forward declaration (which we typically propagate via a header file). This works because declarations are enough to satisfy the compiler when it comes to functions and non-constexpr variables, and the linker can then connect everything up.

However, using forward declarations in a similar manner doesn’t work for types, because the compiler typically needs to see the full definition to use a given type. We must be able to propagate the full type definition to each code file that needs it.

To allow for this, types are partially exempt from the one-definition rule: a given type is allowed to be defined in multiple code files.

You’ve already exercised this capability (likely without realizing it): if your program has two code files that both `#include <iostream>`, you’re importing all of the input/output type definitions into both files.

There are two caveats that are worth knowing about. First, you can still only have one type definition per code file (this usually isn’t a problem since header guards will prevent this). Second, all of the type definitions for a given type must be identical, otherwise undefined behavior will result.

## 命名法：用户定义类型 vs 程序定义类型

The term “user-defined type” sometimes comes up in casual conversation, as well as being mentioned (but not defined) in the C++ language standard. In casual conversation, the term tends to mean “a type that you defined yourself” (such as the Fraction type example above). Sometimes this also includes type aliases.

However, as used in the C++ language standard, a user-defined type is intended to be any type not defined as part of the core C++ language (in other words, a non-fundamental type). Therefore, types defined in the C++ standard library (such as `std::string`) are technically considered to be user-defined types, as are any types that you’ve defined yourself.

To provide additional differentiation, the C++20 language standard helpfully defines the term “program-defined type” to mean only types that you’ve defined yourself. We’ll prefer this term when talking about such types, as it is less ambiguous.


|类型	|含义|	例子|
|:---:|:---:|:---:|
|基本类型	|内建于 C++ 语言的核心部分|	`int`, `std::nullptr_t`
|用户定义类型	|A non-fundamental type (in casual use, typically used to mean program-defined types)	|`std::string`, `Fraction`
|程序定义类型	|a class type or enumeration type defined yourself	|`Fraction`

