---
title: 12.2 - 栈和堆
alias: 12.2 - 栈和堆
origin: /the-stack-and-the-heap/
origin_title: "12.2 — The stack and the heap"
time: 2022-9-22
type: translation
tags:
- stack
- heap
---

??? note "关键点速记"



一个程序的内存可以被分为几个不同的区域，称为[[segment|内存段]]：

- [[code segment|代码段(code段)]] (也称为 text 段)，编译后的程序就位于该段。代码段通常是只读的；
- [[bss segment|bss段]] (也称为未初始化数据段)，这里存放[[zero-initialization|0初始化]]的[[global-variable|全局变量]]和[[static-variables|静态变量]]；
- [[data segment|数据段]](也称为初始化数据段)，这里存放初始化的全局变量和静态变量；
- [[heap|堆]]：动态变量的内存是从堆中分配的；
- [[stack|栈]]：[[parameters|形参]]、局部变量和其他函数相关的信息都存放在这里。

本节课，我们将主要关注堆和栈，它们是这几个内存段中最”有意思“的。


## 堆内存段

堆段(也称为“自由存储区”)跟踪用于动态内存分配的内存。我们已经在 [[11-11-Dynamic-memory-allocation-with-new-and-delete|11.11 - 使用 new 和 delete 进行动态内存分配]] 中介绍了堆，所以这里只是复习一下：

在 C++ 中，当你使用 new 分配内存时，该内存就会位于堆段。

```cpp
int* ptr { new int }; // ptr is assigned 4 bytes in the heap
int* array { new int[10] }; // array is assigned 40 bytes in the heap
```

该内存的地址通过操作符new返回，然后可以存储在指针中。你不必担心定位空闲内存并将其分配给用户的底层机制。然而，你需要知道的是，连续内存请求可能不会分配连续的内存地址！

```cpp
int* ptr1 { new int };
int* ptr2 { new int };
// ptr1 and ptr2 may not have sequential addresses
```

当动态分配的变量被删除时，内存被“返回”到堆中，然后可以在接收到未来的分配请求时重新分配。请记住，删除指针并不删除变量，它只是将相关地址的内存返回给操作系统。

堆有优点和缺点：

- 在堆上分配内存相对很慢；
- 已分配的内存一直保持分配状态，直到它被特别地释放(注意内存泄漏)或应用程序结束(这时操作系统应该清理它)；
- 动态分配的内存必须通过指针访问。解引用指针比直接访问变量比较慢；
- 因为堆是一个很大的内存池，所以可以在这里分配大型数组、结构或类。

## 调用栈

[[call-stack|调用栈]]所扮演的角色更加有意思。调用栈会追踪所有活动函数（已经被调用但尚未结束）从开始到当前时间点的信息，并且负责为函数[[parameters|形参]]和局部变量分配内存。

调用栈使用数据结构——栈实现。所以在讨论调用栈的工作原理之前，我们必须要指定栈是一种什么样的数据结构。

## 数据结构——栈

**数据结构**是一种组织数据以便有效地使用数据的编程机制，你已经了解了几种类型的数据结构，例如数组和结构体。这两种数据结构都提供了有效地存储数据和访问数据的机制。还有许多在编程中经常使用的附加数据结构，其中相当一部分是在标准库中实现的，栈就是其中之一。

想想自助餐厅里的一叠盘子。因为每个盘子都很重，而且它们是堆叠的，所以你实际上只能做三件事中的一件:

1.  看到最顶层盘子的表面；
2.  拿走最上面一个盘子（漏出下面一个盘子）；
3.  将一个新的盘子放在最上面（遮蔽下面一个盘子）。

在计算机编程中，栈是一种容纳多个变量的容器数据结构(很像数组)。然而，数组允许你按任何顺序访问和修改元素(称为**随机访问**)，而栈则有更多的限制。可以在堆栈上执行的操作对应于上面提到的三件事：

1.  查看栈顶元素(通常通过`top()`函数或`peek()`)；
2.  获取并移除栈顶元素(通过`pop()`完成)；
3.  将一个新元素放置在栈顶(通过`push()`完成)。

栈是一个后入先出(LIFO)的数据结构。最后被压入栈的元素会第一个被弹出。如果你将一个新的盘子放在盘子堆顶上的话，那你第一个拿走的盘子也只能是它。当新的元素被压入栈时，栈就会增长。当元素被移除时，则栈会收缩。

例如，下面是一个简短的序列，展示了栈上的push和pop是如何工作的:

```
Stack: empty
Push 1
Stack: 1
Push 2
Stack: 1 2
Push 3
Stack: 1 2 3
Pop
Stack: 1 2
Pop
Stack: 1
```

对于调用栈是如何工作的，盘子类比是一个非常好的类比，但我们可以做一个更好的类比。考虑一堆邮箱，它们都堆叠在一起。每个邮箱只能装一件物品，而且所有邮箱都是空的。此外，每个邮箱都固定在它下面的邮箱上，因此邮箱的数量不能更改。如果不能更改邮箱的数量，如何获得类似于堆栈的行为?

首先，我们使用一个标记(比如便利贴)来跟踪最下面的空邮箱的位置。在开始时，这将是最低的邮箱(在堆栈的底部)。当我们将一个项目推入邮箱堆栈时，我们将它放入有标记的邮箱中(即第一个空邮箱)，并将标记向上移动一个邮箱。当我们从堆栈中弹出一个项目时，我们将标记向下移动一个邮箱(因此它指向顶部的非空邮箱)，并从该邮箱中删除该项目。任何低于标记的东西都被认为是“在栈上”。标记处或标记上方的任何东西都不在栈上。

## 调用栈内存段

调用栈内存段保存用于调用栈的内存。当应用程序启动时，`main()`函数被操作系统压到调用栈上。然后程序开始执行。

函数调用时将函数压入调用栈。当当前函数结束时，该函数从调用栈中弹出。因此，通过查看压入调用栈上的函数，我们可以看到为到达当前执行点而调用的所有函数。

邮箱的比喻很好地描述了调用栈的工作原理。栈本身是一段固定长度的内存。邮箱可以被看做是内存地址，而压入或弹出的内容称为[[stack-frame|栈帧]]。栈帧追踪和某个函数调用相关的全部数据。比喻中的“标记”是一个被称为堆栈指针(SP)的寄存器(CPU中的一小块内存)。堆栈指针用于追踪当前的栈顶位置。

我们还可以进一步优化：当从调用栈中弹出内容的时候，我们并不需要实际清理或清零被弹出的栈帧——只需要将栈顶指针向下移动即可。相应的内容已经不被认为是栈的一部分了（栈指针会在该地址或该地址的下方），所以它也不会被寻址。如果稍后我们将新的栈帧压入了该内存地址，则其内容正好就被覆盖掉了。


## 调用栈实例

让我们更详细地研究调用栈是如何工作的。下面是调用函数时的步骤：

1. 程序中发生函数调用；
2. 栈帧被构建并压入调用栈。栈帧包括：
	- 函数调用后指令的地址（返回地址）。CPU通过它知道函数退出时应该返回到的地址；
	- 所有函数的实参；
	- 所有局部变量的内存；
	- 保存被函数修改且需要在函数返回时恢复的寄存器
1.  CPU 跳转到函数起点；
2.  函数中的指令开始被执行。

当函数结束时，会执行下面的步骤：

1. 寄存器从调用栈恢复；
2. 栈帧弹出调用栈。此时会释放局部变量和实参的内存；
3. 处理返回值；
4. CPU继续从返回地址执行。

根据计算机的体系结构的不同，可以有许多不同的方法处理返回值。有些体系结构将返回值作为堆栈框架的一部分，其他则使用CPU寄存器。

通常，了解调用堆栈如何工作的所有细节并不重要。但是，了解函数在调用时被有效地推入堆栈，在返回时弹出，可以帮助您了解递归所需的基础知识，以及在调试时有用的其他一些概念。

提示：在某些体系结构上，调用堆栈从内存地址0增长。在其他情况下，它会向内存地址0增长。因此，新推的堆栈帧可能比以前的栈帧有更高或更低的内存地址。


## 一个简单的调用栈例子

考虑下面这个简单的应用程序：

```cpp
int foo(int x)
{
    // b
    return x;
} // foo is popped off the call stack here

int main()
{
    // a
    foo(5); // foo is pushed on the call stack here
    // c

    return 0;
}
```


在对应调用栈标记点处看起来是这样的：

a:

```
main()
```

b:

```
foo() (including parameter x)
main()
```

c:

```
main()
```

## 堆栈溢出

The stack has a limited size, and consequently can only hold a limited amount of information. On Visual Studio for Windows, the default stack size is 1MB. With g++/Clang for Unix variants, it can be as large as 8MB. If the program tries to put too much information on the stack, stack overflow will result. **Stack overflow** happens when all the memory in the stack has been allocated -- in that case, further allocations begin overflowing into other sections of memory.

Stack overflow is generally the result of allocating too many variables on the stack, and/or making too many nested function calls (where function A calls function B calls function C calls function D etc…) On modern operating systems, overflowing the stack will generally cause your OS to issue an access violation and terminate the program.

Here is an example program that will likely cause a stack overflow. You can run it on your system and watch it crash:

```cpp
#include <iostream>

int main()
{
    int stack[10000000];
    std::cout << "hi" << stack[0]; // we'll use stack[0] here so the compiler won't optimize the array away

    return 0;
}
```

COPY

This program tries to allocate a huge (likely 40MB) array on the stack. Because the stack is not large enough to handle this array, the array allocation overflows into portions of memory the program is not allowed to use.

On Windows (Visual Studio), this program produces the result:

```
HelloWorld.exe (process 15916) exited with code -1073741571.
```

-1073741571 is c0000005 in hex, which is the Windows OS code for an access violation. Note that “hi” is never printed because the program is terminated prior to that point.

Here’s another program that will cause a stack overflow for a different reason:

```cpp
#include <iostream>

void foo()
{
    foo();
    std::cout << "hi";
}

int main()
{
    foo();

    return 0;
}
```

COPY

In the above program, a stack frame is pushed on the stack every time function foo() is called. Since foo() calls itself infinitely, eventually the stack will run out of memory and cause an overflow.

The stack has advantages and disadvantages:

-   Allocating memory on the stack is comparatively fast.
-   Memory allocated on the stack stays in scope as long as it is on the stack. It is destroyed when it is popped off the stack.
-   All memory allocated on the stack is known at compile time. Consequently, this memory can be accessed directly through a variable.
-   Because the stack is relatively small, it is generally not a good idea to do anything that eats up lots of stack space. This includes passing by value or creating local variables of large arrays or other memory-intensive structures.

!!! info "作者注"

	[This comment](https://www.learncpp.com/cpp-tutorial/introduction-to-objects-and-variables/#comment-560618) has some additional (simplified) information about how variables on the stack are laid out and receive actual memory addresses at runtime.