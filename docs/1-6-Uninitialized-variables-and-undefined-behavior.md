---
title: 1.6 - 未初始化变量和未定义行为
alias: 1.6 - 未初始化变量和未定义行为
origin: /uninitialized-variables-and-undefined-behavior/
origin_title: "1.6 — Uninitialized variables and undefined behavior"
time: 2021-8-18
type: translation
tags:
- undefined behavior
- initialization
---


## 未初始化的变量

不同于有些编程语言，C/C++ 并不会自动地将大部分变量初始化为某个给定值（例如0）。因此，当编译器为变量分配内存地址时，默认的初值将会是任何恰好位于该地址的值（垃圾值）。一个没有被明确赋予指定初值（通过初始化或赋值）的变量称为未初始化变量。

!!! info "作者注"

	很多读者想当然地认为，”初始化的“和"未初始化的"是一对严格的反义词，但实际上并不是。初始化意味着对象在被定义的时候即获得了一个给定的初始值。而未初始化则表示，对象没有被明确地指定任何值（通过各种途径，包括赋值）。因此，一个对象如果没有被”初始化“，但通过赋值得到了一个初值，它也不再是”未初始化“状态（因为它已经得到了一个值）
	简单总结一下：
	-  初始化：对象在被定义的同时也被赋予了初值
	- 赋值：对象在定义后，被赋予了一个值
	- 未初始化：对象始终没有能够获得一个明确指定的初值。

!!! cite "题外话"

	不进行默认初始化这一策略是从C语言继承而来，主要出于性能优化考虑，因为当时的计算机运行速度还很慢。你可以想象一下，假设我们需要从文件读取100000条数据，这也意味着你需要创建100000个变量并使用读取的数据来填充它们。
	
	如果 C++ 需要在创建这些变量时，使用默认值对其进行初始化，这就意味着需要执行100000次初始化（初始化速度很慢），其带来的好处也并不大（毕竟这些初始化很快将会被真实值覆盖）。
	
	现如今，我们则应该牢记对变量进行初始化，其带来的好处已经远大于其开销。当你熟练掌握这门语言后，也许也会遇到为了优化性能而放弃初始化的情况。但这样的操作一定是你深思熟虑后有意而为之的。
	
	使用未初始化的变量的值，可能会带来难以预料的结果。以如下代码为例：


```cpp
#include <iostream>

int main()
{
    // define an integer variable named x
    int x; // this variable is uninitialized because we haven't given it a value

    // print the value of x to the screen
    std::cout << x; // who knows what we'll get, because x is uninitialized

    return 0;
}
```

在上面的例子中，计算机会为x分配某空闲的内存。该内存中存放的值会通过`std::cout`输出到控制台并打印，其打印出的结果可能是某个值（被当做整型来解析）。但究竟是什么值呢？答案是：”没有人知道“，或者说，每次运行程序，答案都可能是不一样的。作者在使用 Visual Studio 进行测试的时候，打印出的值是 `7177728`，再次运行时打印的值就编程了 `5277592`。你可以自己尝试并运行上述代码（不用担心，这并不会损坏你的电脑）。

!!! warning "注意"

	有一些编译器，例如 Visual Studio，如果你使用的是debug版本配置，则编译器会将内存初始化为某些预设值。但是当你使用release版本配置时，则不会有上述行为。因此，如果你想要自行尝试上述程序，请确保自己使用的是release版本的构建配置 (参考 [0.9 -- Configuring your compiler: Build configurations](https://www.learncpp.com/cpp-tutorial/configuring-your-compiler-build-configurations/) ). 例如，当你在Visual Studio中使用debug配置编译并运行上述代码时，输出结果始终会是 -858993460，因为这个值（被解释为整型）是 Visual Studio 在 debug 配置下初始化内存使用的值。

大多数的现代编译器都能够检测到一个变量是否被赋予了初值。如果能够检测到，则在编译时会产生一个错误。例如，在 Visual Studio 中编译上述程序时，会输出如下的告警信息：

```
c:\VCprojects\test\test.cpp(11) : warning C4700: uninitialized local variable 'x' used
```

如果你的编译器不允许你编译上述代码，可以采用如下方式绕过限制：

```cpp
#include <iostream>

void doNothing(int&) // Don't worry about what & is for now, we're just using it to trick the compiler into thinking variable x is used
{
}

int main()
{
    // define an integer variable named x
    int x; // this variable is uninitialized

    doNothing(x); // make the compiler think we're assigning a value to this variable

    // print the value of x to the screen (who knows what we'll get, because x is uninitialized)
    std::cout << x;

    return 0;
}
```


使用未初始化的变量是新手程序员常犯的错误之一，不幸的是，该错误也常常会埋下最难以调试的问题（因为程序可能可以正确运行，如果该内存中恰好包含了一个合理的值，例如0）。

这也是为什么在最佳实践中我们强调，一定要确保初始化变量。

## 未定义行为

使用未定义变量中的值，是我们遇到的第一种会产生未定义行为的例子。未定义行为（常常缩写为 UB）指的是执行代码的行为没有被 C++ 语言明确定义。在这种情况下，C++ 语言并没有明确的规则能够用于确定这种情况下会发生什么。从结果上来看，如果你使用了未初始化的变量，则会导致未定义行为。

代码的未定义行为可能表现出如下症状：

-   程序每次运行都可能得到不同的结果；
-   程序每次运行都输出相同的错误结果；
-   程序每次运行的行为都不一致 (有时候结果正确，有时候不正确)；
-   程序看起来能够正确运行，但是一段时间后又会输出错误的结果；
-   程序崩溃退出，这种崩溃可能在程序启动后立即发生，也可能运行一段时间后发生；
-   程序经某些编译器编译后能够正常工作，但有些编译器则不行；
-   程序不能正常工作，直到你修改了某些看上毫不相干的代码。

或者，程序甚至能够正确运行并得到正确结果。所谓未定义行为，就是你永远不知道你能得到什么样的结果，无法预测每次运行的行为，也无法预测你做出某些修改后的影响。

在 C++ 中，如果你不够小心，那么产生未定义行为的途径有很多。我们会在后续的课程中遇到具体问题时进行讲解。请注意记录这些案例并切记要避免它们。

!!! note "法则"

	注意避免可能导致未定义行为的各种情况，例如使用未初始化变量。

!!! info "作者注"

	读者评论中最常见的问题之一便是：”你说不能这样做，但我偏偏这样做了，而且程序也能够正常运行！为什么？“

	关于这个问题通常有两个答案。最常见的答案是，你的程序实际上表现出了未定义行为，只不过该未定义行为恰巧（暂时）输出了你期望的结果。改天（或者使用其他编译器、使用其他计算机）再运行时，可能未必如此。

	这个问题还可以这样回答：有些编译器的作者，在实现特定语言的需求时，认为某些规则过于严格是没有必要的。例如，标准可能会说，X 必须位于 Y 之前发生。但是编译器作者确认为这么做是没有必要的，并且使得 Y 能够在没有执行X的前提下正确工作。这么做不会影响到正确的代码，但是可能会造成不符合规范的代码能够正确执行。因此，我们可以说：你使用的编译器可能并没有完全遵守标准。这种情况是存在的。你可以通过关闭编译器的扩展功能来避免这些问题，具体内容请参考 [0.10 -- Configuring your compiler: Compiler extensions](https://www.learncpp.com/cpp-tutorial/configuring-your-compiler-compiler-extensions/).

