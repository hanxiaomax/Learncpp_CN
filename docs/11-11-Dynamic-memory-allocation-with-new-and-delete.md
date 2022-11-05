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

当你动态分配一个变量时，你可以通过[[direct-initialization|直接初始化]]或[[uniform-initialization|统一初始化]]对其进行初始化：

```cpp
int* ptr1{ new int (5) }; // 直接初始化
int* ptr2{ new int { 6 } }; // 统一初始化
```

## 删除单一变量

在使用完动态分配的变量时，我们需要显式地告诉C++释放内存以便重用。对于单个变量，这是通过标量(非数组)形式的`delete`操作符来完成的：

```cpp
// assume ptr has previously been allocated with operator new
delete ptr; // return the memory pointed to by ptr to the operating system
ptr = nullptr; // set ptr to be a null pointer
```


## 删除内存是什么意思？

`delete` 运算符并没有*实际上*删除任何东西，它只是将指针指向的内存还给操作系统罢了。操作系统随即便可以将该内存分配给其他应用使用（或者给当前应用使用也可以）。

尽管看上去我们是在`delete`一个变量，但实际上并不是！该指针变量仍然处于该作用域，而且也可以被赋予新值。

注意，删除不指向动态分配内存的指针可能会导致不好的事情发生。

## 悬垂指针

C++没有规定被释放的内容其内容应该是什么，也没有规定被删除的指针的值应该是什么。在大多数情况下，返回给操作系统的内存将包含它在返回之前的相同值，并且指针将指向现在释放的内存。

执行已经被释放的内存的指针，称为[[dangling|悬垂]]指针。间接访问或删除悬垂指针会导致[[undefined-behavior|未定义行为]]。考虑下面程序：

```cpp
#include <iostream>

int main()
{
    int* ptr{ new int }; // 动态分配一个整型
    *ptr = 7; // 向该内存赋一个值

    delete ptr; // 内存还给操作系统，ptr现在是悬垂指针

    std::cout << *ptr; // 间接访问悬垂指针会导致未定义行为
    delete ptr; // 再次释放已经被释放的内存也会导致未定义行为

    return 0;
}
```


在上面的程序中，之前分配给已分配内存的值7可能仍然存在，但该内存地址的值可能已经发生了变化。内存也有可能被分配给另一个应用程序(或操作系统自己使用)，试图访问该内存将导致操作系统关闭程序。

释放内存可能会导致多个悬垂指针。考虑下面的例子:

```cpp
#include <iostream>

int main()
{
    int* ptr{ new int{} }; // 动态分配一个整型
    int* otherPtr{ ptr }; // otherPtr 指向相同的内存

    delete ptr; // 内存还给操作系统，ptr,otherPtr 现在是悬垂指针
    ptr = nullptr; // ptr 现在是nullptr

    // 但是, otherPtr 仍然是悬垂指针

    return 0;
}
```

通过一些最佳实践，可以帮助避免上述问题。

首先，尽量避免有多个指针指向同一块动态内存。如果这是不可能的，要清楚哪些指针“拥有”内存(并负责删除它)，哪些指针只是在访问它。

其次，在删除指针时，如果该指针不会立即离开作用域，则将该指针设置为nullptr。我们将更多地讨论空指针，以及它们为什么有用。

!!! success "最佳实践"

	将已删除的指针设置为nullptr，除非它们随后将立即超出作用域。

## `new` 运算符可能执行失败

当向操作系统请求内存时，在极少数情况下，操作系统可能已经没有任何可用的内存。

默认情况下，如果`new`失败，则抛出`bad_alloc`异常。如果这个异常没有得到正确处理(它不会得到正确处理，因为我们还没有讨论异常或异常处理)，程序将终止(崩溃)，并出现一个未处理的异常错误。

==在许多情况下，让`new`抛出异常(或让程序崩溃)是不可取的，因此，如果无法分配内存，可以使用另一种形式的`new`来告诉`new`返回空指针。这是通过在`new`关键字和分配类型之间添加常量`std::nothrow`来实现的：==

```cpp
int* value { new (std::nothrow) int }; // 如果没有分配到内存，则指针被置为null
```

在上面的例子中，如果`new`分配内存失败，它将返回一个空指针而不是已分配内存的地址。

注意，如果你尝试通过此指针进行间接操作，将导致[[undefined-behavior|未定义行为]](最有可能的是程序崩溃)。因此，最佳实践是在使用分配的内存之前检查所有内存请求，以确保它们实际上成功了。

```cpp
int* value { new (std::nothrow) int{} }; // ask for an integer's worth of memory
if (!value) // handle case where new returned null
{
    // Do error handling here
    std::cerr << "Could not allocate memory\n";
}
```

因为通过`new`申请内存很少会失败(在开发环境中几乎从不失败)，所以经常会忘记执行此检查！


## 空指针和动态内存分配

空指针 (设置为 `nullptr` 的指针) 在处理动态内存分配时很有用。在动态内存分配的上下文中，空指针代表着”没有内存被分配给这个指针“。这使得我们可以根据条件来分配内存：

```cpp
// If ptr isn't already allocated, allocate it
if (!ptr)
    ptr = new int;
```

删除空指针没效果。因此没必要这么做：

```cpp
if (ptr)
    delete ptr;
```

直接这么做就可以：

```cpp
delete ptr;
```


如果 `ptr` 是非空的，那么它指向的内存将被释放，如果`ptr`是空，则什么都不会发生。

## 内存泄漏


除非显式地释放动态分配的内存或程序结束(并且操作系统清理它，假设您的操作系统这么做)，否则动态分配的内存一直处于被分配状态。但是，用于保存动态分配的内存地址的指针遵循本地变量的正常作用域规则。这种不匹配会产生有趣的问题。

考虑下面的函数：

```cpp
void doSomething()
{
    int* ptr{ new int{} };
}
```

This function allocates an integer dynamically, but never frees it using delete. Because pointers variables are just normal variables, when the function ends, ptr will go out of scope. And because ptr is the only variable holding the address of the dynamically allocated integer, when ptr is destroyed there are no more references to the dynamically allocated memory. This means the program has now “lost” the address of the dynamically allocated memory. As a result, this dynamically allocated integer can not be deleted.

这个函数动态分配了一个整数，但并没有用`delete`释放它。因为指针变量只是普通变量，当函数结束时，`ptr`[[going-out-of-scope|离开作用域]]。由于`ptr`是保存动态分配的整数地址的唯一变量，当`ptr`被销毁时，对动态分配的内存就没有更多的引用了。这意味着程序现在“丢失”了动态分配的内存的地址。因此，不能删除这个动态分配的整数。

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