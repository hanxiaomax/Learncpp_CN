---
title: 11.x - 小结与测试 - 数组、字符串和动态分配
alias: 11.x - 小结与测试 - 数组、字符串和动态分配
origin: /chapter-11-comprehensive-quiz/
origin_title: "11.x — Chapter 11 comprehensive quiz"
time: 2022-9-16
type: translation
tags:
- summary
---

[[11-1-Arrays-Part-I|11.1 - 数组（第一部分）]]

- 使用数组可以基于一个标识符来存储和访问一系列相同类型的变量。数组[[arity|元数]]可以通过下标运算符(`[]`)来访问。注意，访问数组时数组下标不能越界。数组的初始化可以使用初始化值列表或[[uniform-initialization]]。

[[11-2-Arrays-Part-II|11.2 - 数组（第二部分）]]

- 固定数组必须在[[compile-time|编译时]]确定长度。固定数组在求值或传递给函数时通常会退化为指针。

[[11-3-Arrays-and-loops|11.3 - 数组和循环]]
[[11-4-Sorting-an-array-using-selection-sort|11.4 - 数组排序之选择排序]]

- 可以使用循环对数组元素进行遍历。需要注意的是[[off-by-one|差一错误]]，避免遍历数组时访问越界。基于范围的for循环在数组没有退化为指针时是非常有用的。

[[11-5-Multidimensional-Arrays|11.5 - 多维数组]]

- 使用多个索引可以创建多维数组。

[[11-6-C-style-strings|11.6 - C 语言风格字符串]]
[[11-10-C-style-string-symbolic-constants|11.10 - C 风格字符串符号常量]]
[[11-7-std-string-view-part-2|11.7 - std::string_view（第二部分）]]

- 数组可以被用来创建C语言风格的字符串。一般来讲你不应该使用这种方式创建字符串，而是应该使用 `std::string_view` 和 `std::string`。

[[11-8-Pointers-and-arrays|11.8 - 指针和数组]]
[[11-9-Pointer-arithmetic-and-array-indexing|11.9 - 指针运算和数组索引]]

- 指针是那些保存着另外一个变量的地址的变量。[[address-of-operator|取地址操作符&]]可以用于获得某个变量的地址。而间接运算符（[[dereference-operator|解引用]]）则可以用于取得指针所指地址保存的值。
- 空指针没有指向任何地址。指针可以通过初始化或赋值为`nullptr` 的方式定义为空指针。删除空指针是没有问题的。
- 指向数组的指针并不知道该数组的长度是多少。这也意味着 `sizeof()` 运算符和[[range-based-for-loops|基于范围的for循环]]在这种情况下无法正确工作。


[[11-11-Dynamic-memory-allocation-with-new-and-delete|11.11 - 使用 new 和 delete 进行动态内存分配]]

- `new` 和`delete` 运算符可以为变量或数组分配动态内存。尽管概率很低，但操作符`new`是有可能会失败的（操作系统内存耗尽时）。如果你编写的软件运行在内存有限的平台上时，请确保检查`new`操作符是否成功执行。
- 当需要删除数组时，请使用数组删除(`delete[]`) 。指向已经被释放的内存地址的指针，称为[[dangling|悬垂]]指针。使用错误的删除运算符`delete`或者对悬垂指针解引用会导致[[undefined-behavior|未定义行为]]。
- 当指向该内存的最后一个指针超出作用域时，未能删除动态分配的内存会导致内存泄漏。


[[11-12-Dynamically-allocating-arrays|11.12 - 动态分配数组]]

- 一般的变量，系统会在一块有限的内存区——栈上为其分配内存。动态分配内存的变量则位于一块通用的内存区域——堆上。

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


成员选择运算符(`->`)用于选择指针所指结构体中的某个成员。它等效于间接运算符加上一般的成员访问符（`.`）。

[[11-14-Void-pointers|11.14 - void 指针]]

- `void` 类型的指针可以指向任何类型的数据，但是不能直接对它们使用间接运算符（[[dereference-operator|解引用]]）。你可以使用 `static_cast` 将它还原为原本的指针类型。不过这取决于你是否还记得它原本是什么类型。

[[11-15-Pointers-to-pointers-and-dynamic-multidimensional-arrays|11.15 — 指向指针的指针和多维数组]]

- 通过指针的指针，我们可以创建指向其他指针的指针。

[[11-16-An-introduction-to-std-array|11.16 — 固定数组 std::array 简介]]

- `std::array` 提供了C++内置数组的全部（甚至）更多的功能，而且它不会退化为指针。通常来说使用它来替换内置数组是更加的选择。

[[11-17-An-introduction-to-std-vector|11.17 — 动态数组 std::vector 简介]]

- `std::vector` 提供了动态数组的功能，它可以自行管理内存并记录数组的大小。通常使用它来替换内置动态数组是更加的选择。

[[11-18-Introduction-to-iterators|11.18 — 迭代器简介]]

- 由于[[iterator|迭代器]]的存在，我们其实并不需要去了解容器的具体实现就可以完成循环遍历。

[[11-19-Introduction-to-standard-library-algorithms|11.19 — 标准库算法简介]]

- [algorithms](https://en.cppreference.com/w/cpp/algorithm) 库为我们提供了很多趁手的函数，搭配迭代器（以及后面学到的lambda函数），它们构成了C++语言非常重要的一部分。
