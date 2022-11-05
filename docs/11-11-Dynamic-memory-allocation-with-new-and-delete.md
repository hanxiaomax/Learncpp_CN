---
title: 11.11 - 使用 new 和 delete 进行动态内存分配
alias: 11.11 - 使用 new 和 delete 进行动态内存分配
origin: /dynamic-memory-allocation-with-new-and-delete/
origin_title: "11.11 — Dynamic memory allocation with new and delete"
time: 2022-4-8
type: translation
tags:
- new
- delete
- dynamic-memory
---

??? note "关键点速记"



## 动态内存分配的必要性

C++ 支持三种基本类型的内存分配 ，你应该已经见过其中的两种了：

-   [[static-memory-allocation|静态内存分配]]发生在静态变量和全局变量创建时。当程序启动时，此类变量的内存会被分配并持续到程序结束，贯穿程序的整个生命周期；
-   [[automatic-memory-allocation|自动内存分配]]发生在函数形参和局部变量创建时。这些变量的内存会在进入相应的语句块时被自动分配，而当语句块退出时则会自动释放；
-   [[dynamic-memory-allocation|动态内存分配]]则是本节课要介绍的。

静态内存分配和自动内存分配有两个共同点：

-   变量和数组的大小必须在[[compile-time|编译时]]就已知；
-   内存的分配和释放是自动进行的（在变量实例化和销毁时）。


大多数情况下，这是已经足够了。但是，有时候这两个特点会带来限制，通常是在处理外部(用户或文件)输入时。

例如，我们可能想使用一个字符串来保存某人的名字，但在用户输入名字之前，我们并不知道名字有多长。或者我们可能想从磁盘读入一些记录，但事先不知道有多少记录。或者我们正在创造一款怪物数量动态变化的游戏(随着时间的推移，一些怪物会死亡，新怪物会出现)。

如果必须在编译时就声明变量或数组的大小，那我们能做的就是尝试猜测需要的变量的大小的最大值并期望实际使用中该内存是足够的：

```cpp
char name[25]; // 期望用户的姓名不超过25个字符
Record record[500]; // 希望数据的记录数小于500条
Monster monster[40]; // 最多 40 个怪物
Polygon rendering[30000]; // 3d 渲染不超过3万个多边形
```

这种解决方案是很差劲的，原因有四条：

首先，如果实际没有使用该变量，则会导致内存浪费。例如，如果我们为每个名称分配25个字符，但名称平均只有12个字符长，那么申请的内存是实际使用的两倍多。或者，对于上面`rendering`数组的例子来说：如果渲染只使用10000个多边形，那么将有20000个多边形的内存被额外申请单没有被使用!

第二，我们如何判断哪些内存位实际上被使用了呢？对于字符串，这很简单：以`\0`开头的字符串显然没有被使用。但是对于`monster[24]`来说呢？它仍然在被使用吗？我们需要某种方法来区分仍然在使用的变量和不再被使用的变量，这增加了复杂性，并可能会占用额外的内存。

第三，大多数普通变量(包括固定数组)被分配到称为[[stack|栈]]的内存中。程序的堆栈能够使用的内存通常非常小——Visual Studio 默认堆栈大小为 1MB。如果超过这个大小，就会导致堆栈溢出，操作系统就会停止程序。

在 Visual Studio 中，你可以看到运行这个程序时发生的情况：


```cpp
int main()
{
    int array[1000000]; // allocate 1 million integers (probably 4MB of memory)
}
```

将内存限制为1MB对于许多程序来说都是有问题的，特别是那些处理图形的程序。在Visual Studio中，你可以看到运行这个程序时发生的情况:

第四，也是最重要的，它会导致人为的限制，并可能导致溢出。如果用户试图从磁盘读入600条记录，但我们只分配了最多500条记录的内存，会发生什么情况？此时要么给用户发送一个错误，要求其只读取500条记录，要么(在最坏的情况下，我们根本不处理这种情况)`record`数组溢出。

幸运的是，这些问题可以通过动态内存分配轻松解决。[[dynamic-memory-allocation|动态内存分配]]是运行程序在需要时向操作系统请求内存的一种方法。这个内存不是来自程序有限的堆栈内存——相反，它是从一个更大的内存池中分配的，由操作系统管理，称为[[heap|堆]]。在现代机器上，堆的大小可以达到千兆字节。

## 单一变量的动态内存分配

为*一个*变量分配内存，我们使用`new`的标量形式：

```cpp
new int; // dynamically allocate an integer (and discard the result)
```

在上面的例子中，我们向操作系统申请一个整型的内存。`new`运算符会使用申请来的内存创建这个对象，然后返回指向该内存的指针。

多数情况下，我们可以将返回值赋值给一个指针变量，并通过它在后续的程序中访问这块内存。

```cpp
int* ptr{ new int }; // dynamically allocate an integer and assign the address to ptr so we can access it later
```

在后续的程序中通过[[dereference-operator|解引用运算符]]访问该内存：

```cpp
*ptr = 7; // assign value of 7 to allocated memory
```

如果你之前不知道指针有什么用，那么现在应该清楚了，至少在这种情况下，如果没有一个指针来保存刚刚分配的内存地址，我们就没有办法访问刚刚分配给我们的内存!


## 动态内存分配的原理是什么？

计算机中的内存可供应用程序使用。当程序运行时，操作系统会将程序加载到一块内存中。这块内存被你的程序分割成几个不同的部分，每个部分也都有其特定的作用。其中一小部分包含你的程序代码，另外一小部分则用于程序正常运行时使用（记录函数调用、创建和销毁全局变量和临时变量，等等）。我们会在后面进行更详细介绍。但是，还有很多很多的内存就只是放在那里，等待你的程序请求使用。

和静态内存、自动内存不同的是，程序自己需要负责请求和释放动态分配的内存。


## 动态分配变量的初始化 

当你动态分配一个变量 you dynamically allocate a variable, you can also initialize it via direct initialization or uniform initialization:

```cpp
int* ptr1{ new int (5) }; // use direct initialization
int* ptr2{ new int { 6 } }; // use uniform initialization
```

COPY

## 删除单一变量

When we are done with a dynamically allocated variable, we need to explicitly tell C++ to free the memory for reuse. For single variables, this is done via the scalar (non-array) form of the **delete** operator:

```cpp
// assume ptr has previously been allocated with operator new
delete ptr; // return the memory pointed to by ptr to the operating system
ptr = nullptr; // set ptr to be a null pointer
```


## 删除内存是什么意思？

The delete operator does not _actually_ delete anything. It simply returns the memory being pointed to back to the operating system. The operating system is then free to reassign that memory to another application (or to this application again later).

Although it looks like we’re deleting a _variable_, this is not the case! The pointer variable still has the same scope as before, and can be assigned a new value just like any other variable.

Note that deleting a pointer that is not pointing to dynamically allocated memory may cause bad things to happen.

## 悬垂指针

C++ does not make any guarantees about what will happen to the contents of deallocated memory, or to the value of the pointer being deleted. In most cases, the memory returned to the operating system will contain the same values it had before it was returned, and the pointer will be left pointing to the now deallocated memory.

A pointer that is pointing to deallocated memory is called a **dangling pointer**. Indirection through- or deleting a dangling pointer will lead to undefined behavior. Consider the following program:

```cpp
#include <iostream>

int main()
{
    int* ptr{ new int }; // dynamically allocate an integer
    *ptr = 7; // put a value in that memory location

    delete ptr; // return the memory to the operating system.  ptr is now a dangling pointer.

    std::cout << *ptr; // Indirection through a dangling pointer will cause undefined behavior
    delete ptr; // trying to deallocate the memory again will also lead to undefined behavior.

    return 0;
}
```

COPY

In the above program, the value of 7 that was previously assigned to the allocated memory will probably still be there, but it’s possible that the value at that memory address could have changed. It’s also possible the memory could be allocated to another application (or for the operating system’s own usage), and trying to access that memory will cause the operating system to shut the program down.

Deallocating memory may create multiple dangling pointers. Consider the following example:

```cpp
#include <iostream>

int main()
{
    int* ptr{ new int{} }; // dynamically allocate an integer
    int* otherPtr{ ptr }; // otherPtr is now pointed at that same memory location

    delete ptr; // return the memory to the operating system.  ptr and otherPtr are now dangling pointers.
    ptr = nullptr; // ptr is now a nullptr

    // however, otherPtr is still a dangling pointer!

    return 0;
}
```

COPY

There are a few best practices that can help here.

First, try to avoid having multiple pointers point at the same piece of dynamic memory. If this is not possible, be clear about which pointer “owns” the memory (and is responsible for deleting it) and which pointers are just accessing it.

Second, when you delete a pointer, if that pointer is not going out of scope immediately afterward, set the pointer to nullptr. We’ll talk more about null pointers, and why they are useful in a bit.

!!! success "最佳实践"

	Set deleted pointers to nullptr unless they are going out of scope immediately afterward.

## `new` 运算符可能执行失败

When requesting memory from the operating system, in rare circumstances, the operating system may not have any memory to grant the request with.

By default, if new fails, a _bad_alloc_ exception is thrown. If this exception isn’t properly handled (and it won’t be, since we haven’t covered exceptions or exception handling yet), the program will simply terminate (crash) with an unhandled exception error.

In many cases, having new throw an exception (or having your program crash) is undesirable, so there’s an alternate form of new that can be used instead to tell new to return a null pointer if memory can’t be allocated. This is done by adding the constant std::nothrow between the new keyword and the allocation type:

```cpp
int* value { new (std::nothrow) int }; // value will be set to a null pointer if the integer allocation fails
```


In the above example, if new fails to allocate memory, it will return a null pointer instead of the address of the allocated memory.

Note that if you then attempt indirection through this pointer, undefined behavior will result (most likely, your program will crash). Consequently, the best practice is to check all memory requests to ensure they actually succeeded before using the allocated memory.

```cpp
int* value { new (std::nothrow) int{} }; // ask for an integer's worth of memory
if (!value) // handle case where new returned null
{
    // Do error handling here
    std::cerr << "Could not allocate memory\n";
}
```

COPY

Because asking new for memory only fails rarely (and almost never in a dev environment), it’s common to forget to do this check!

## Null 指针和动态内存分配

Null pointers (pointers set to nullptr) are particularly useful when dealing with dynamic memory allocation. In the context of dynamic memory allocation, a null pointer basically says “no memory has been allocated to this pointer”. This allows us to do things like conditionally allocate memory:

```cpp
// If ptr isn't already allocated, allocate it
if (!ptr)
    ptr = new int;
```


Deleting a null pointer has no effect. Thus, there is no need for the following:

```cpp
if (ptr)
    delete ptr;
```


Instead, you can just write:

```cpp
delete ptr;
```


If ptr is non-null, the dynamically allocated variable will be deleted. If it is null, nothing will happen.

## 内存泄漏

Dynamically allocated memory stays allocated until it is explicitly deallocated or until the program ends (and the operating system cleans it up, assuming your operating system does that). However, the pointers used to hold dynamically allocated memory addresses follow the normal scoping rules for local variables. This mismatch can create interesting problems.

Consider the following function:

```cpp
void doSomething()
{
    int* ptr{ new int{} };
}
```

COPY

This function allocates an integer dynamically, but never frees it using delete. Because pointers variables are just normal variables, when the function ends, ptr will go out of scope. And because ptr is the only variable holding the address of the dynamically allocated integer, when ptr is destroyed there are no more references to the dynamically allocated memory. This means the program has now “lost” the address of the dynamically allocated memory. As a result, this dynamically allocated integer can not be deleted.

This is called a **memory leak**. Memory leaks happen when your program loses the address of some bit of dynamically allocated memory before giving it back to the operating system. When this happens, your program can’t delete the dynamically allocated memory, because it no longer knows where it is. The operating system also can’t use this memory, because that memory is considered to be still in use by your program.

Memory leaks eat up free memory while the program is running, making less memory available not only to this program, but to other programs as well. Programs with severe memory leak problems can eat all the available memory, causing the entire machine to run slowly or even crash. Only after your program terminates is the operating system able to clean up and “reclaim” all leaked memory.

Although memory leaks can result from a pointer going out of scope, there are other ways that memory leaks can result. For example, a memory leak can occur if a pointer holding the address of the dynamically allocated memory is assigned another value:

```cpp
int value = 5;
int* ptr{ new int{} }; // allocate memory
ptr = &value; // old address lost, memory leak results
```

COPY

This can be fixed by deleting the pointer before reassigning it:

```cpp
int value{ 5 };
int* ptr{ new int{} }; // allocate memory
delete ptr; // return memory back to operating system
ptr = &value; // reassign pointer to address of value
```

COPY

Relatedly, it is also possible to get a memory leak via double-allocation:

```cpp
int* ptr{ new int{} };
ptr = new int{}; // old address lost, memory leak results
```

COPY

The address returned from the second allocation overwrites the address of the first allocation. Consequently, the first allocation becomes a memory leak!

Similarly, this can be avoided by ensuring you delete the pointer before reassigning.

## 结论

Operators new and delete allow us to dynamically allocate single variables for our programs.

Dynamically allocated memory has dynamic duration and will stay allocated until you deallocate it or the program terminates.

Be careful not to perform indirection through dangling or null pointers.

In the next lesson, we’ll take a look at using new and delete to allocate and delete arrays.