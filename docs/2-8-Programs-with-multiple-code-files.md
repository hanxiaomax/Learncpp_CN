---
alias: 2.8 - 程序和多个代码文件
origin: /programs-with-multiple-code-files/
origin_title: "2.8 — Programs with multiple code files"
time: 2022-4-15
type: translation
tags:
- program organization
---

## 在项目中添加文件

随着程序规模不断增大，程序通常会被分割为多个文件以方便组织程序或增强其可复用性。使用 IDE 可以让组织多文件项目变得更加容易。我们已经学习了如何去创建并编译一个单文件项目，为这个项目添加一个文件是非常简单的。

!!! success "最佳实践"

    在为项目添加代码文件时，请使用 `.cpp` 作为扩展名。

!!! example "For Visual Studio users"

    在 Visual Studio 中，在解决方案浏览器窗口(Solution Explorer)右键点击 _Source Files_ 目录并选择 _Add > New Item…_.

    ![](https://www.learncpp.com/images/CppTutorial/Chapter2/VS-AddNewItem1.png?ezimgfmt=rs%3Adevice%2Frscb2-1)

    选择 _C++ File (.cpp)_。为其指定一个文件名，就可以将文件添加到项目中。

    ![](https://www.learncpp.com/images/CppTutorial/Chapter2/VS-AddNewItem2.png?ezimgfmt=rs:699x393/rscb2/ng: webp/ngcb2)

    注意：如果你是从 File 菜单而不是 Solution Explorer 窗口创建的文件，那么该文件不会被自动添加到项目中。因此你必须在解决方案浏览器窗口(Solution Explorer)右键点击 _Source Files_ 目录并选择 _Add > Existing Item_，然后选择刚才创建的文件。

    接下来，在编译程序的时候，你会发现编译器会将该文件列出来，因为它会对其进行编译。

!!! example "For Code:: Blocks users"

    在 Code:: Blocks 中，在 _File_ 菜单中选择 _New > File…_。

    ![](https://www.learncpp.com/images/CppTutorial/Chapter2/CB-AddNewItem1.png?ezimgfmt=rs:540x233/rscb2/ng: webp/ngcb2)

    在 _New from template_ 对话框中，选择 _C/C++ source_ 并点击 _Go_。

    ![](https://www.learncpp.com/images/CppTutorial/Chapter2/CB-AddNewItem2.png?ezimgfmt=rs:604x453/rscb2/ng: webp/ngcb2)

    你可能会来到一个 _welcome to the C/C++ source file wizard_ 对话框。此时点击 _Next_。

    ![](https://www.learncpp.com/images/CppTutorial/Chapter2/CB-AddNewItem3.png?ezimgfmt=rs:524x443/rscb2/ng: webp/ngcb2)

    在向导的下一个页面中，选择 “C++” 并点击 _Next_。

    ![](https://www.learncpp.com/images/CppTutorial/Chapter2/CB-AddNewItem4.png?ezimgfmt=rs:524x443/rscb2/ng: webp/ngcb2)

    接下来，为这个新文件起一个名字（不要忘了使用 `.cpp` 作为后缀名），然后点击 _All_ 按钮确保所有的构建目标都被勾选了。最后，选择 _finish_。

    ![](https://www.learncpp.com/images/CppTutorial/Chapter2/CB-AddNewItem5.png?ezimgfmt=rs:524x443/rscb2/ng: webp/ngcb2)

    现在，当你编译程序的时候，你就可以看到编译器在编译时列出了该文件的名字。

!!! example "For GCC/G++ users"

    你可以从命令行来创建文件并为其指定一个文件名。在编译程序的时候，你必须将相关的文件都包含在编译命令中。`g++ main.cpp add.cpp -o main`, 其中，`main.cpp` 和 `add.cpp` 是需要编译的文件，`main` 则是输出文件的文件名。

## 一个多文件程序的例子

在 [[2-7-Forward-declarations-and-definitions|2.7 - 前向声明和定义]]中，我们介绍了一个单文件不能编译的例子：

```cpp
#include <iostream>

int main()
{
    std::cout << "The sum of 3 and 4 is: " << add(3, 4) << '\n';
    return 0;
}

int add(int x, int y)
{
    return x + y;
}
```

在编译器解析到第五行的 `add` 函数调用时，编译器不知道 `add` 为何物，因为我们还没有定义它呀！之前我们解决这个问题时使用了两种方案，要么重新调整函数定义的顺序，要么使用[[forward-declaration|前向声明(forward declaration)]]。

现在，来看一个类似的多文件程序：

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

int main()
{
    std::cout << "The sum of 3 and 4 is: " << add(3, 4) << '\n'; // compile error
    return 0;
}
```

你的编译器可能会先编译 *add.cpp* 或者先编译 *main.cpp*。不论是那种情况，编译器都会报告和之前一样的编译错误：

```
main.cpp(5) : error C3861: 'add': identifier not found
```

问题的原因也是一样的，在编译器解析到第五行的 `add` 函数调用时，编译器不知道 `add` 为何物。

还记得吗？编译器是单独编译各个文件的，它并不知道其他代码文件中的内容，也不会记得之前编译时遇到的东西。也许编译器曾经遇到过函数 `add` 的定义(如果它先编译*add.cpp *的话)，但它并不会将其记下来。

编译器的这种短视和健忘是有意而为之的，这样可以确保具有相同名字的函数和变量不会发生冲突。我们会在下一节课中探讨命名冲突的问题。

Our options for a solution here are the same as before: place the definition of function _add_ before function _main_, or satisfy the compiler with a forward declaration. In this case, because function _add_ is in another file, the reordering option isn’t a good one.

The better solution here is to use a forward declaration:

main.cpp (with forward declaration):

```cpp
#include <iostream>

int add(int x, int y); // needed so main.cpp knows that add() is a function declared elsewhere

int main()
{
    std::cout << "The sum of 3 and 4 is: " << add(3, 4) << '\n';
    return 0;
}
```

COPY

add.cpp (stays the same):

```cpp
int add(int x, int y)
{
    return x + y;
}
```

COPY

Now, when the compiler is compiling _main.cpp_, it will know what identifier _add_ is and be satisfied. The linker will connect the function call to _add_in _main.cpp_ to the definition of function _add_ in _add.cpp_.

Using this method, we can give files access to functions that live in another file.

Try compiling _add.cpp_ and the _main.cpp_ with the forward declaration for yourself. If you get a linker error, make sure you’ve added _add.cpp_ to your project or compilation line properly.

## Something went wrong!

There are plenty of things that can go wrong the first time you try to work with multiple files. If you tried the above example and ran into an error, check the following:

1.  If you get a compiler error about _add_ not being defined in _main_, you probably forgot the forward declaration for function _add_ in _main.cpp_.
2.  If you get a linker error about _add_ not being defined, e.g.

unresolved external symbol "int __cdecl add(int,int)" (?add@@YAHHH@Z) referenced in function _main

2a. …the most likely reason is that _add.cpp_ is not added to your project correctly. When you compile, you should see the compiler list both _main.cpp_ and _add.cpp_. If you only see _main.cpp_, then _add.cpp_ definitely isn’t getting compiled. If you’re using Visual Studio or Code:: Blocks, you should see _add.cpp_ listed in the Solution Explorer/project pane on the left or right side of the IDE. If you don’t, right click on your project, and add the file, then try compiling again. If you’re compiling on the command line, don’t forget to include both _main.cpp_ and _add.cpp_ in your compile command.

2b. …it’s possible that you added _add.cpp_ to the wrong project.

2c. …it’s possible that the file is set to not compile or link. Check the file properties and ensure the file is configured to be compiled/linked. In Code:: Blocks, compile and link are separate checkboxes that should be checked. In Visual Studio, there’s an “exclude from build” option that should be set to “no” or left blank.

3.  Do _not_ _#include “add.cpp”_ from _main.cpp_. This will cause the compiler to insert the contents of _add.cpp_ directly into _main.cpp_ instead of treating them as separate files.

## Summary

When the compiler compiles a multi-file program, it may compile the files in any order. Additionally, it compiles each file individually, with no knowledge of what is in other files.

We will begin working with multiple files a lot once we get into object-oriented programming, so now’s as good a time as any to make sure you understand how to add and compile multiple file projects.

Reminder: Whenever you create a new code (.cpp) file, you will need to add it to your project so that it gets compiled.
