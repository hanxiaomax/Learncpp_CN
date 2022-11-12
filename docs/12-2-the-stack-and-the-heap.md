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

调用栈n段保存用于调用堆栈的内存。当应用程序启动时，main()函数被操作系统推送到调用堆栈上。然后程序开始执行。

The call stack segment holds the memory used for the call stack. When the application starts, the main() function is pushed on the call stack by the operating system. Then the program begins executing.

When a function call is encountered, the function is pushed onto the call stack. When the current function ends, that function is popped off the call stack. Thus, by looking at the functions pushed on the call stack, we can see all of the functions that were called to get to the current point of execution.

Our mailbox analogy above is fairly analogous to how the call stack works. The stack itself is a fixed-size chunk of memory addresses. The mailboxes are memory addresses, and the “items” we’re pushing and popping on the stack are called **stack frames**. A stack frame keeps track of all of the data associated with one function call. We’ll talk more about stack frames in a bit. The “marker” is a register (a small piece of memory in the CPU) known as the stack pointer (sometimes abbreviated “SP”). The stack pointer keeps track of where the top of the call stack currently is.

We can make one further optimization: When we pop an item off the call stack, we only have to move the stack pointer down -- we don’t have to clean up or zero the memory used by the popped stack frame (the equivalent of emptying the mailbox). This memory is no longer considered to be “on the stack” (the stack pointer will be at or below this address), so it won’t be accessed. If we later push a new stack frame to this same memory, it will overwrite the old value we never cleaned up.

## 调用栈实例

Let’s examine in more detail how the call stack works. Here is the sequence of steps that takes place when a function is called:

1.  The program encounters a function call.
2.  A stack frame is constructed and pushed on the stack. The stack frame consists of:

-   The address of the instruction beyond the function call (called the **return address**). This is how the CPU remembers where to return to after the called function exits.
-   All function arguments.
-   Memory for any local variables
-   Saved copies of any registers modified by the function that need to be restored when the function returns

3.  The CPU jumps to the function’s start point.
4.  The instructions inside of the function begin executing.

When the function terminates, the following steps happen:

1.  Registers are restored from the call stack
2.  The stack frame is popped off the stack. This frees the memory for all local variables and arguments.
3.  The return value is handled.
4.  The CPU resumes execution at the return address.

Return values can be handled in a number of different ways, depending on the computer’s architecture. Some architectures include the return value as part of the stack frame. Others use CPU registers.

Typically, it is not important to know all the details about how the call stack works. However, understanding that functions are effectively pushed on the stack when they are called and popped off when they return gives you the fundamentals needed to understand recursion, as well as some other concepts that are useful when debugging.

A technical note: on some architectures, the call stack grows away from memory address 0. On others, it grows towards memory address 0. As a consequence, newly pushed stack frames may have a higher or a lower memory address than the previous ones.

## 一个简单的调用栈例子

Consider the following simple application:

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

COPY

The call stack looks like the following at the labeled points:

a:

main()

b:

foo() (including parameter x)
main()

c:

main()

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

HelloWorld.exe (process 15916) exited with code -1073741571.

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