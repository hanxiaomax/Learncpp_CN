---
alias: 2.11 - 头文件
origin: /header-files/
origin_title: "2.11 — Header files"
time: 2022-5-2
type: translation
tags:
- header
---

??? note "关键点速记"

    - 头文件中一般不应该包含函数和变量的定义，以便遵循单一定义规则，除非是符号常量
    - 源文件应该包含其对应的头文件（如果存在的话），可以确保定义和声明不匹配的问题在编译时就能被发现

## 头文件及其用途

随着程序越来越大（以及越来越多的文件被使用），为每个被定义在其他文件中的函数创建[[forward-declaration|前向声明]] 会变得非常麻烦。如果能够将所有的前向声明都放在一个文件里，然后在需要使用的时候将其导入，岂不美哉？

C++ 代码文件(扩展名为 `.cpp`) 并不是 C++项目中唯一常见的文件类型。头文件通常以 `.h` 扩展名结尾，但是有时候你也会看到 `.hpp` 扩展名的头文件，甚至有些都没有扩展名。 这类头文件的主要作用就是放置代码的声明。

!!! tldr "关键信息"

    头文件使我们可以将所有的前向声明都放在一个文件里，然后在需要的时候将其导入。这样可以在多文件程序中避免很多手工劳动。

## 使用标准库的头文件

考虑如下程序：

```cpp
#include <iostream>

int main()
{
    std::cout << "Hello, world!";
    return 0;
}
```

这个程序使用 `std:: cout` 将 “Hello, world!” 打印在控制台上。不过，我们的程序并没有定义过 `std:: cout` 函数呀？编译器如何得知它的定义的呢？

实际上 `std:: cout` 的声明被定义在  “iostream” 头文件中，当我们使用 `#include <iostream>` 指令的时候，其实是在告诉预处理器，将该文件的内容（其中就包括 `std:: cout` 的前向声明）全部拷贝到此处。

!!! tldr "关键信息"

    当我们 #include 一个文件的时候，该文件的内容会被插入到此处，这样我们就可以非常方便地从其他文件获取前向定义。

考虑一下，如果 _iostream_ 头文件不存在会怎样？那么你每次使用 `std:: cout` 的时候，都必须手工将所有和 `std:: cout` 相关的声明都输入或拷贝到文件的开头部分。这样不仅麻烦，还需要使用者知道 `std:: cout` 实现的细节，这将会是非常非常大的工作量。更糟的是，一旦函数原型发生了改变，我们必须手动更新全部的声明。所以，最简单的方法莫过于直接使用 `#include <iostream>`！

对于函数和变量来说，需要注意的是，它们的头文件中通常只包含声明，而不包含函数和变量的定义（否则可能会违反 [[one-definition-rule|单一定义规则(one-definition-rule)]]）。`std:: cout` 被前向定义在 *iostream* 头文件中并作为 C++标准库的一部分，而标准库则会在程序编译时被自动链接。

![](https://www.learncpp.com/images/CppTutorial/Section1/IncludeLibrary.png?ezimgfmt=rs%3Adevice%2Frscb2-1)

!!! success "最佳实践"

    头文件中一般不应该包含函数和变量的定义，以便遵循单一定义规则。例外的是 [[symbolic-constants|符号常量]] (在[[4-15-Symbolic-constants-const-and-constexpr-variables|4.15 - 符号常数和 constexpr 变量]]中会进行介绍)。

## 编写头文件

现在，回想一下之前课程中使用过的程序。该程序包含两个文件 _add.cpp_ 和 _main.cpp_：

add.cpp:

```cpp
int add(int x, int y)
{
    return x + y;
}
```

main.cpp:

```cpp
#include <iostream>

int add(int x, int y); // forward declaration using function prototype

int main()
{
    std::cout << "The sum of 3 and 4 is " << add(3, 4) << '\n';
    return 0;
}
```

（如果你想要为这两个文件重新创建一个项目，不要忘记把 _add.cpp_ 文件加到项目中，这样你才能编译它）。

在这个例子中，我们使用了前向声明以便让编译器在编译 _main.cpp_ 时能够知晓  _add_ 的定义。正如之前介绍的那样，如果为每一个定义在其他文件中的函数都创建前向声明，将会非常麻烦：

其实，只需要编写一个头文件就可以一劳永逸解决上述烦恼。编写头文件比你想象的要简单的多，它只包含两部分：

1.  _头文件包含保护_，稍后我们会详细介绍(参考：[[2-12-Header-guards|2.12 - 头文件重复包含保护]])。
2.  头文件的实际内容，即所有我们希望能够在其他文件中被访问的标识符的前向声明。

将头文件添加到项目中的方法和添加源文件差不多（参考：[[2-8-Programs-with-multiple-code-files|2.8 - 多文件程序]]）。如果你使用的是 IDE，可以参考之前课程中提到的步骤，只不过在选择 `Source` 的时候，要改为选择 `Header`。如果你使用的是命令行环境，则只需要用编辑器创建一个新的文件即可。

!!! success "最佳实践"

    在创建头文件的时候请使用 `.h` 后缀。

头文件和源文件通常是成对出现的，头文件会为对应的源文件提供前向声明。因为头文件包含的是 _add.cpp_ 中函数的声明，因此头文件命名为 _add.h_。

!!! success "最佳实践"

    如果头文件和源文件成对出现（例如，add.h 和 add.cpp），它们应该是同名但不同后缀的文件。

完成后的头文件如下：

add.h:

```cpp
// 1) 这里应该是头文件包含保护，但是这个例子中只有一个头文件，为了简化这里就省略了

// 2) .h 文件的内容，声明都写在这里
int add(int x, int y); // 函数原型——不要忘记分号！
```

为了在*main.cpp*中使用该头文件，我们需要 `#include` (这里需要使用引号而非尖括号)。

main.cpp:

```cpp
#include "add.h" // 将 add.h 插入到此位置。注意使用双引号。
#include <iostream>

int main()
{
    std::cout << "The sum of 3 and 4 is " << add(3, 4) << '\n';
    return 0;
}
```

add.cpp:

```cpp
#include "add.h" // add.h 的内容会被拷贝到这里。注意使用双引号。

int add(int x, int y)
{
    return x + y;
}
```

当预处理器处理到 `#include "add.h"` 的时候，它会把 _add.h_ 中的内容都拷贝到这里。因为 _add.h_ 包含了函数  `add` 的声明，所以该声明就会被拷贝到了 _main.cpp_ 中。最终的效果，就和之前直接将声明写在 _main.cpp_ 顶部是一样的。

现在，我们的程序就可以被正确的编译和链接了。

![](https://www.learncpp.com/images/CppTutorial/Section1/IncludeHeader.png?ezimgfmt=rs:647x377/rscb2/ng:webp/ngcb2)

## 源文件需要包含其对应的头文件

C++ 中的最佳实践之一就是源文件应该包含其对应的头文件（如果存在的话）。在上面的例子中， _add.cpp_ 应该包含 _add.h_。

这么做可以使得有些问题可以在编译时被发现，而不是留到链接时再发现。例如：

something.h:

```cpp
int something(int); // 声明的返回类型是 int

something.cpp:

```cpp
#include "something.h"

void something(int) // 错误: 错误的返回类型
{
}
```

因为 _something.cpp_ `#includes`了 _something.h_，因此编译器可以在编译时发现  `something()`  函数的返回值类型不匹配。而如果 _something.cpp_ 没有 `#include` _something.h_，那么我们必须要等到链接时，该问题才会被链接器发现，这无疑会浪费时间。其他例子可以参考[这个评论](https://www.learncpp.com/cpp-tutorial/header-files/comment-page-8/#comment-398571) 。

!!! success "最佳实践"

    源文件需要包含其对应的头文件（如果有的话）。

## 错误排查

如果编译器报告了 _add.h_ 无法被找的错误，请首先确认文件名是否为 _add.h_。文件名可能会被错误地设置为 _add_ (无后缀) 或 _add.h.txt_ 或 _add.hpp_，这可能取决于你是如何创建它们的。另外，也要确保该头文件和其他文件位于相同的目录。

如果链接器报告了 `add`函数未定义的错误，请确保  _add.cpp_ 被添加到了项目中，这样`add`函数才能够被正确链接。

## 尖括号 vs 双引号

你可能会好奇，为什么 `iostream` 使用的是尖括号，而 `add.h`就需要使用双引号。这是因为，同名的文件可能会分布在不同的目录中。区分使用尖括号和双引用，可以告诉编译器到哪里寻找头文件。

When we use angled brackets, we’re telling the preprocessor that this is a header file we didn’t write ourselves. The compiler will search for the header only in the directories specified by the `include directories`. The `include directories` are configured as part of your project/IDE settings/compiler settings, and typically default to the directories containing the header files that come with your compiler and/or OS. The compiler will not search for the header file in your project’s source code directory.

When we use double-quotes, we’re telling the preprocessor that this is a header file that we wrote. The compiler will first search for the header file in the current directory. If it can’t find a matching header there, it will then search the `include directories`.

!!! note "法则"

    Use double quotes to include header files that you’ve written or are expected to be found in the current directory. Use angled brackets to include headers that come with your compiler, OS, or third-party libraries you’ve installed elsewhere on your system.

## 为什么 iostream 没有 .h 后缀?

Another commonly asked question is “why doesn’t iostream (or any of the other standard library header files) have a .h extension?”. The answer is that _iostream.h_ is a different header file than _iostream_! To explain requires a short history lesson.

When C++ was first created, all of the files in the standard runtime library ended in a _.h_ suffix. Life was consistent, and it was good. The original version of _cout_ and _cin_ were declared in _iostream.h_. When the language was standardized by the ANSI committee, they decided to move all of the functionality in the standard library into the _std_namespace to help avoid naming conflicts with user-defined identifiers. However, this presented a problem: if they moved all the functionality into the _std_ namespace, none of the old programs (that included iostream.h) would work anymore!

To work around this issue, a new set of header files was introduced that use the same names but lack the _.h_ extension. These new header files have all their functionality inside the _std_ namespace. This way, older programs that include `#include <iostream.h>` do not need to be rewritten, and newer programs can `#include <iostream>`.

In addition, many of the libraries inherited from C that are still useful in C++ were given a _c_ prefix (e.g. _stdlib.h_ became _cstdlib_). The functionality from these libraries was also moved into the _std_ namespace to help avoid naming collisions.

!!! success "最佳实践"

    When including a header file from the standard library, use the version without the .h extension if it exists. User-defined headers should still use a .h extension.

## include 其他目录中的头文件

Another common question involves how to include header files from other directories.

One (bad) way to do this is to include a relative path to the header file you want to include as part of the #include line. For example:

```cpp
#include "headers/myHeader.h"
#include "../moreHeaders/myOtherHeader.h"
```

While this will compile (assuming the files exist in those relative directories), the downside of this approach is that it requires you to reflect your directory structure in your code. If you ever update your directory structure, your code won’t work anymore.

A better method is to tell your compiler or IDE that you have a bunch of header files in some other location, so that it will look there when it can’t find them in the current directory. This can generally be done by setting an _include path_ or _search directory_ in your IDE project settings.

!!! exmaple  "For Visual Studio users"

Right click on your project in the _Solution Explorer_, and choose _Properties_, then the _VC++ Directories_ tab. From here, you will see a line called _Include Directories_. Add the directories you’d like the compiler to search for additional headers there.

!!! exmaple "For Code:: Blocks users"

    In Code:: Blocks, go to the _Project_ menu and select _Build Options_, then the _Search directories_ tab. Add the directories you’d like the compiler to search for additional headers there.

!!! exmaple  "For GCC/G++ users"

    Using g++, you can use the -I option to specify an alternate include directory.

    ```cpp
    g++ -o main -I/source/includes main.cpp
    ```

The nice thing about this approach is that if you ever change your directory structure, you only have to change a single compiler or IDE setting instead of every code file.

## 头文件中可以包含其他头文件

It’s common that a header file will need a declaration or definition that lives in a different header file. Because of this, header files will often #include other header files.

When your code file #includes the first header file, you’ll also get any other header files that the first header file includes (and any header files those include, and so on). These additional header files are sometimes called transitive includes, as they’re included implicitly rather than explicitly.

The content of these transitive includes are available for use in your code file. However, you should not rely on the content of headers that are included transitively. The implementation of header files may change over time, or be different across different systems. If that happens, your code may only compile on certain systems, or may compile now but not in the future. This is easily avoided by explicitly including all of the header files the content of your code file requires.

!!! success "最佳实践"

    Each file should explicitly #include all of the header files it needs to compile. Do not rely on headers included transitively from other headers.

Unfortunately, there is no easy way to detect when your code file is accidentally relying on content of a header file that has been included by another header file.

!!! question "Q & A"

    Q: I didn’t include <someheader> and my program worked anyway! Why?

    This is one of the most commonly asked questions on this site. The answer is: it’s likely working, because you included some other header (e.g. <iostream>), which itself included <someheader>. Although your program will compile, per the best practice above, you should not rely on this. What compiles for you might not compile on a friend’s machine.

## 头文件 `#include` 的顺序

If your header files are written properly and `#include` everything they need, the order of inclusion shouldn’t matter.

Now consider the following scenario: let’s say header A needs declarations from header B, but forgets to include it. In our code file, if we include header B before header A, our code will still compile! This is because the compiler will compile all the declarations from B before it compiles the code from A that depends on those declarations.

However, if we include header A first, then the compiler will complain because the code from A will be compiled before the compiler has seen the declarations from B. This is actually preferable, because the error has been surfaced, and we can then fix it.

!!! success "最佳实践"

    To maximize the chance that missing includes will be flagged by compiler, order your #includes as follows:

    1.  The paired header file
    2.  Other headers from your project
    3.  3rd party library headers
    4.  Standard library headers

    The headers for each grouping should be sorted alphabetically.

That way, if one of your user-defined headers is missing an #include for a 3rd party library or standard library header, it’s more likely to cause a compile error so you can fix it.

## 头文件最佳实践

Here are a few more recommendations for creating and using header files.

- Always include header guards (we’ll cover these next lesson).
- Do not define variables and functions in header files (global constants are an exception -- we’ll cover these later)
- Give a header file the same name as the source file it’s associated with (e.g. _grades.h_ is paired with _grades.cpp_).
- Each header file should have a specific job, and be as independent as possible. For example, you might put all your declarations related to functionality A in A.h and all your declarations related to functionality B in B.h. That way if you only care about A later, you can just include A.h and not get any of the stuff related to B.
- Be mindful of which headers you need to explicitly include for the functionality that you are using in your code files
- Every header you write should compile on its own (it should `#include` every dependency it needs)
- Only `#include` what you need (don’t include everything just because you can).
- Do not `#include` .cpp files.
