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

指针是那些保存着另外一个变量的地址的变量。[[address-of-operator|取地址操作符&]]可以用于获得某个变量的地址。而 are variables that store the memory address of (point at) another variable. The address-of operator (`&`) can be used to get the address of a variable. The indirection operator (`*`) can be used to get the value that a pointer points at.

A null pointer is a pointer that is not pointing at anything. Pointers can be made null by initializing or assigning the value `nullptr` to them. Avoid the `NULL` macro. Indirection through a null pointer can cause bad things to happen. Deleting a null pointer is okay (it doesn’t do anything).

A pointer to an array doesn’t know how large the array it is pointing to is. This means `sizeof()` and range-based for-loops won’t work.

The `new` and `delete` operators can be used to dynamically allocate memory for a pointer variable or array. Although it’s unlikely to happen, operator `new` can fail if the operating system runs out of memory. If you’re writing software for a memory-limited system, make sure to check if `new` was successful.

Make sure to use the array delete (`delete[]`) when deleting an array. Pointers pointing to deallocated memory are called dangling pointers. Using the wrong `delete`, or indirection through a dangling pointer causes undefined behavior.

Failing to delete dynamically allocated memory can result in memory leaks when the last pointer to that memory goes out of scope.

Normal variables are allocated from limited memory called the stack. Dynamically allocated variables are allocated from a general pool of memory called the heap.

A pointer to a `const` value treats the value it is pointing to as `const`.

```cpp
int value{ 5 };
const int* ptr{ &value }; // this is okay, ptr is pointing to a "const int"
```

A `const` pointer is a pointer whose value can not be changed after initialization.

```cpp
int value{ 5 };
int* const ptr{ &value }; // ptr is const, but *ptr is non-const
```


A reference is an alias to another variable. References are declared using an ampersand (`&`), but this does not mean address-of in this context. References are implicitly `const` -- they must be initialized with a value, and a new value can not be assigned to them. References can be used to prevent copies from being made when passing data to or from a function.

The member selection operator (`->`) can be used to select a member from a pointer to a struct. It combines both an indirection and normal member access (`.`).

Void pointers are pointers that can point to any type of data. Indirection through them is not possible directly. You can use `static_cast` to convert them back to their original pointer type. It’s up to you to remember what type they originally were.

Pointers to pointers allow us to create a pointer that points to another pointer.

`std::array` provides all of the functionality of C++ built-in arrays (and more) in a form that won’t decay into a pointer. These should generally be preferred over built-in fixed arrays.

`std::vector` provides dynamic array functionality, handles its own memory management and remembers its size. These should generally be favored over built-in dynamic arrays.

Thanks to iterators, we don’t have to know how a container is implemented to loop through its elements.

The algorithms library helps us to save a lot of time by providing many off-the-shelf functions. In combination with iterators (and later lambdas), the algorithms library is an important part of C++.