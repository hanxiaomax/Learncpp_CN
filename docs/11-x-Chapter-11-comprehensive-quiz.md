---
title: 11.x - 小结与测试
alias: 11.x - 小结与测试
origin: /chapter-11-comprehensive-quiz/
origin_title: "11.x — Chapter 11 comprehensive quiz"
time: 2022-9-16
type: translation
tags:
- summary
---

使用数组可以基于一个标识符来存储和访问一系列相同类型的变量。数组元数可以通过下标运算符(`[]`)来访问。注意，访问数组时数组下标不能越界。数组的初始化可以使用初始化值列表或[[统一初始化]]。

固定数组必须在[[编译时(compile-time)]]确定长度。固定数组在求值或传递给函数时通常会退化为指针。

可以使用循环对数组元素进行遍历。需要注意的是[[off-by-one|差一错误]]，避免遍历数组时访问越界。基于范围的for循环在数组没有退化为指针时是非常有用的。

使用多个索引可以创建多维数组。

数组可以被用来创建C语言风格的字符串。一般来讲你不应该使用这种方式创建字符串，而是应该使用 `std::string_view` 和 `std::string`。

指针是那些保存着另外一个变量的地址的变量。[[address-of-operator|取地址操作符&]]可以用于获得某个变量的地址。而间接运算符（[[dereference-operator|解引用]]）则可以用于取得指针所指地址保存的值。

空指针没有指向任何地址。指针可以通过初始化或赋值为`nullptr` 的方式定义为空指针。删除空指针是没有问题的。

指向数组的指针并不知道该数组的长度是多少。这也意味着 `sizeof()` 运算符和基于范围的for循环在这种情况下无法正确工作。

`new` 和`delete` 运算符可以为变量或数组分配动态内存。尽管概率很低，但操作符`new`是有可能会失败的（操作系统内存耗尽时）。如果你编写的软件运行在内存有限的平台上时，请确保检查`new`操作符是否成功执行。

当需要删除数组时，请使用数组删除(`delete[]`) 。指向已经被释放的内存地址的指针，称为[[dangling|悬垂]]指针。使用错误的删除运算符`delete`或者对悬垂指针解引用会导致未定义行为。

当指向该内存的最后一个指针超出作用域时，未能删除动态分配的内存会导致内存泄漏。

一般的变量，系统会在一块有限的内存区——栈上为其分配内存。动态分配内存的变量则位于一块通用的内存区域——堆上。

指向const类型值的指针会将它所指的值看做常量。

```cpp
int value{ 5 };
const int* ptr{ &value }; // this is okay, ptr is pointing to a "const int"
```

`const` 指针则是表示指针本身的内容（持有的地址）在初始化后不能被改变。

```cpp
int value{ 5 };
int* const ptr{ &value }; // ptr is const, but *ptr is non-const
```

引用是变量的别名。引用的声明需要使用 `&` 号，但是在这个语境下并不表示[[dereference-operator|解引用]]。引用带有隐含的“常量”含义，它们必须被初始化，此后将不能够再为其赋予新的值。使用引用可以在函数传值或返回值时避免拷贝。

The member selection operator (`->`) can be used to select a member from a pointer to a struct. It combines both an indirection and normal member access (`.`).

Void pointers are pointers that can point to any type of data. Indirection through them is not possible directly. You can use `static_cast` to convert them back to their original pointer type. It’s up to you to remember what type they originally were.

Pointers to pointers allow us to create a pointer that points to another pointer.

`std::array` provides all of the functionality of C++ built-in arrays (and more) in a form that won’t decay into a pointer. These should generally be preferred over built-in fixed arrays.

`std::vector` provides dynamic array functionality, handles its own memory management and remembers its size. These should generally be favored over built-in dynamic arrays.

Thanks to iterators, we don’t have to know how a container is implemented to loop through its elements.

The algorithms library helps us to save a lot of time by providing many off-the-shelf functions. In combination with iterators (and later lambdas), the algorithms library is an important part of C++.