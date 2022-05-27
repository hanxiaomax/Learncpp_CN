---
title: 2.10 - 预处理器简介
alias: 2.10 - 预处理器简介
origin: /introduction-to-the-preprocessor/
origin_title: "2.10 — Introduction to the preprocessor"
time: 2022-4-15
type: translation
tags:
- preprocessor
---

??? note "关键点速记"
	- 预处理器可以看做是单独的程序，它使用的预处理指令也不同于C++的语法。
	- 函数类型的宏不安全且可以被函数替代，因此不要使用
	- 对象类型的宏，其作为常量定义的功能现在已经不推荐使用了
	- `#if 0` 可以用来“注释掉”包含多行注释的代码，因为多行注释是不能嵌套的
	- 预处理器指令之间不会互相影响。因此定义某个标识符为空不会导致后面的预处理器指令被替换为空
	- 宏定义的作用域只在本文件中，由于预处理器不能理解C++语法，因此宏定义是否在函数内部并无区别

## 翻译及预处理器

你可能会觉得编译器会原封不动地编译你写的代码。但实际上并不是。

在开始编译前，代码会经过一个叫做[[translation|翻译(translation)]]的阶段。在这个阶段需要完成很多操作，才能使你的代码具备被编译的条件（如果有兴趣可以在 [这里](https://en.cppreference.com/w/cpp/language/translation_phases)查看有关翻译阶段的详细信息）。进行过翻译的代码文件叫做一个翻译单元。

在翻译阶段中最值得我们关注的是[[preprocessor|预处理器]]，它可以被看做是一个对每个代码文件进行文本处理的单独的工具。

在预处理器工作的时候，它会从头到尾扫描代码文件，查找[[preprocessor-directive|预处理器指令 (preprocessor directive)]]。预处理器指令（经常简称为指令）是一些以`#`开头，以换行（而非分号）结尾的符号。这些指令会告诉预处理器应该对文本执行哪些特定的操作。<mark class="hltr-red">需要注意的是，预处理器并不理解C++的语法——相反，预处理器指令有其自己的语法（有些和C++语法类似，有些则不然）。</mark> 

预处理器的输出会经历一些列翻译阶段，然后才会被编译。需要注意的是，预处理器并不会修改原文件——所有经预处理器修改产生的变化都是临时的（用于一次编译）

本节课将介绍一些最为常见的预处理器指令。

!!! cite "题外话"

    `Using`指令 ([[2-9-Naming-collisions-and-an-introduction-to-namespaces|2.9 - 命名冲突和命名空间]]中介绍)并不属于预处理器指令（因此不会被预处理器处理）。因此，尽管指令(directive)一词多指预处理器指令，但也不是总是这样。

## Includes

我们已经在实际案例中接触过 `#include` 指令了（`#include <iostream>`）。在 `#include`某个文件的时候，预处理器会把 `#include`替换为该文件的实际内容，然后预处理器才会对替换后的文件内容进行预处理和编译。

考虑下面的例子：

```cpp
#include <iostream>

int main()
{
    std::cout << "Hello, world!";
    return 0;
}
```

当预处理器处理该程序时，它会把`#include <iostream>` 替换为经过预处理的名为“iostream”的文件的内容。

因为 `#include` 几乎只用来包含头文件，我们会在后续讨论头文件时再对其进行详细的介绍。（参见：[[2-11-Header-files|2.11 - 头文件]]）

## 宏定义

`#define` 指令可以被用来定义[[macro|宏(macro) ]]。在C++中，宏指的是一种规则，这种规则规定了一个输入文本应该如何被替换成输出文本。

宏有两种基本类型：[[object-like-macros|对象类型的宏(object-like macros)]]和[[function-like macros|函数类型的宏 (function-like macros)]]。

**函数类型的宏**和函数很像，其功能也类似。我们并不会在这里详细讨论它，因为它常常被认为是不安全的，况且它能做的普通函数也能做，

**对象类型的宏**有两种声明方式：

```cpp
#define identifier
#define identifier substitution_text
```

上面一种方式不会对文本进行替换，而下面一种会。因为这些都属于[[preprocessor-directive|预处理器指令]]而不是语句，因此不需要以分号结尾，

## 有替换文本的对象类型宏

当预处理器遇到该指令时，任何使用该标识符的地方都会被替换为对应的*替换文本*。一般来说，这些标识符会以全大写的形式使用，同时使用下划线代替空格。

考虑这个例子：

```cpp
#include <iostream>

#define MY_NAME "Alex"

int main()
{
    std::cout << "My name is: " << MY_NAME;

    return 0;
}
```

预处理器会把上面的代码转换成下面的代码：

```cpp
// iostream 的内容会被插入到这里

int main()
{
    std::cout << "My name is: " << "Alex";

    return 0;
}
```

因此上述程序会打印 `My name is: Alex`。

<mark class="hltr-red">对象类型的宏过去也被用来作定义常量（一种开销更小的方式）。随着编译器的发展和语言的更新，此类需求在现如今已经没必要了。对象类型的宏应该仅出现在历史遗留代码中才对。</mark> 


我们建议彻底放弃使用此类宏定义，因为有更好的方法可以用。我们会在[[4-15-Symbolic-constants-const-and-constexpr-variables|4.15 - 符号常数和constexpr变量]]中进行介绍

## 无替换文本的对象类型宏

对象类型的宏也可以在没有替换文本的情况下使用：

例如：

```cpp
#define USE_YEN
```

这个宏的作用你应该能够猜到：任何遇到该标识符的地方，都会被替换为空白！

看上去这个宏好像没什么用，确实，对于文本替换来说它确实没什么用。不过，这种类型的宏本来就不是用来进行替换的，很快你就会看到它的实际用途。

和有替换文本的宏不同，这种类型的宏通常被认为是可以使用的。

## 条件编译

条件编译预处理器指令使我们可以控制在何种条件下，对应的代码需要编译或者不需要编译。条件编译指令的种类有很多，这里我们只介绍三种最为常用的：`#ifdef`、`#ifndef_`和 `#endif`。

`#ifdef `指令会让预处理器检查某个标识符是否被`#define`过，如果是的话，`#ifdef`和`#endif`之间的代码将会被编译，否则这些代码会被忽略。

考虑下面这个例子：

```cpp
#include <iostream>

#define PRINT_JOE

int main()
{
#ifdef PRINT_JOE
    std::cout << "Joe\n"; // will be compiled since PRINT_JOE is defined
#endif

#ifdef PRINT_BOB
    std::cout << "Bob\n"; // will be ignored since PRINT_BOB is not defined
#endif

    return 0;
}
```


因为 `PRINT_JOE` 被 `#defined` 了，因此 `std::cout << "Joe\n"` 会被编译，而因为 `PRINT_BOB` 没有被 `#defined`，所以对应的 `std::cout << "Bob\n"` 会被忽略。

`#ifndef` 是 `#ifdef`的反义词，它控制预处理器检查某个标识符是否**没有**被`#define`。

```cpp
#include <iostream>

int main()
{
#ifndef PRINT_BOB
    std::cout << "Bob\n";
#endif

    return 0;
}
```

上面的程序会打印 “Bob”，因为`PRINT_BOB`没有被 `#define_`过。

除了 `#ifdef PRINT_BOB` 和 `#ifndef PRINT_BOB` 这样的形式以外，你也可能会遇到 `#if defined(PRINT_BOB)` 和 `#if !defined(PRINT_BOB)` 这样的形式。它们的功能是完全一样的，只不过后者看上去和C++的语法风格更加一致。


## `#if 0`

还有一个常用的条件编译指令是 `#if 0`，它可以将它包裹范围内的代码排除在编译之外（就好像这些代码被注释掉了一样）：

```cpp hl_lines="8 9"
#include <iostream>

int main()
{
    std::cout << "Joe\n";

#if 0 // 从此行开始的代码都不编译
    std::cout << "Bob\n";
    std::cout << "Steve\n";
#endif // 直到这一行为止

    return 0;
}
```

上面的程序只会打印 “Joe”，因为“Bob” 和 “Steve” 均位于`#if 0`块中，所以预处理器会将其排除在编译范围外。

这样一来，我们就可以方便的”注释掉“某些包含了多行注释的代码了（因为多行注释不支持嵌套）：

```cpp
#include <iostream>

int main()
{
    std::cout << "Joe\n";

#if 0 // Don't compile anything starting here
    std::cout << "Bob\n";
    /* Some
     * multi-line
     * comment here
     */
    std::cout << "Steve\n";
#endif // until this point

    return 0;
}
```


## 对象类型的宏不会影响其他预处理器指令

你也许会对下面这种写法心存顾虑：

```cpp
#define PRINT_JOE

#ifdef PRINT_JOE
// ...
```

既然我们定义了 `PRINT_JOE` 为空字符串，那么为什么预处理器不会将`#ifdef PRINT_JOE`中的`PRINT_JOE`替换掉呢？

宏定义的替换只针对与普通代码。其他预处理器的指令是不会受到影响的，因此`#ifdef PRINT_JOE`中的`PRINT_JOE`是会保留的。

例如：
```cpp
#define FOO 9 // 宏替换为空

#ifdef FOO // 此处的 FOO 不会被替换因为它属于预处理器指令
    std::cout << FOO; // 此处的FOO会被替换因为它属于普通代码
#endif
```

在实际工作中，预处理器输出的结果中不包含任何预处理器指令——它们都会在编译前被处理掉，比较编译器并不知道要如何处理这些指令。

## 宏定义的作用域

预处理器指令的解析会在编译器完成（从上到下逐文件地）。

考虑如下例子：

```cpp
#include <iostream>

void foo()
{
#define MY_NAME "Alex"
}

int main()
{
	std::cout << "My name is: " << MY_NAME;

	return 0;
}
```

尽管看上去 `#define MY_NAME “Alex”` 像是被定义到了`foo`函数中，但预处理器并不会意识到这一点，因为它不理解”函数“以及其他C++的语法概念。因此，这段代码的效果好我们在函数之前或是之后定义 `#define MY_NAME “Alex”` 是一模一样的。处于可读性的考虑，一般`#define`不会被定义在函数内部。

当预处理器的工作完成后，所有这些`#define`的标识符就都被丢弃了。因此这些标识符只有在这个文件中是有效的，定义在一个文件中的宏不会影响到其他文件。

考虑这个例子：

function.cpp:

```cpp
#include <iostream>

void doSomething()
{
#ifdef PRINT
    std::cout << "Printing!";
#endif
#ifndef PRINT
    std::cout << "Not printing!";
#endif
}
```

main.cpp:

```cpp
void doSomething(); // forward declaration for function doSomething()

#define PRINT

int main()
{
    doSomething();

    return 0;
}
```


上面代码的输出结果如下：

```
Not printing!
```

尽管 `PRINT` 被定义在了 _main.cpp_ 中，但是它丝毫不会影响  _function.cpp_ （对 `PRINT` 的定义只在 *main.cpp*中有效）。我们会在[[2-12-Header-guards|2.12 - 头文件重复包含保护]]中探讨其影响。


