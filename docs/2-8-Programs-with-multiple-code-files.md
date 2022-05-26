---
alias: 2.8 - 多文件程序
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

    ![](https://www.learncpp.com/images/CppTutorial/Chapter2/VS-AddNewItem2.png?ezimgfmt=rs:699x393/rscb2/ng:webp/ngcb2)

    注意：如果你是从 File 菜单而不是 Solution Explorer 窗口创建的文件，那么该文件不会被自动添加到项目中。因此你必须在解决方案浏览器窗口(Solution Explorer)右键点击 _Source Files_ 目录并选择 _Add > Existing Item_，然后选择刚才创建的文件。

    接下来，在编译程序的时候，你会发现编译器会将该文件列出来，因为它会对其进行编译。

!!! example "For Code:: Blocks users"

    在 Code:: Blocks 中，在 _File_ 菜单中选择 _New > File…_。

    ![](https://www.learncpp.com/images/CppTutorial/Chapter2/CB-AddNewItem1.png?ezimgfmt=rs:540x233/rscb2/ng:webp/ngcb2)

    在 _New from template_ 对话框中，选择 _C/C++ source_ 并点击 _Go_。

    ![](https://www.learncpp.com/images/CppTutorial/Chapter2/CB-AddNewItem2.png?ezimgfmt=rs:604x453/rscb2/ng:webp/ngcb2)

    你可能会来到一个 _welcome to the C/C++ source file wizard_ 对话框。此时点击 _Next_。

    ![](https://www.learncpp.com/images/CppTutorial/Chapter2/CB-AddNewItem3.png?ezimgfmt=rs:524x443/rscb2/ng:webp/ngcb2)

    在向导的下一个页面中，选择 “C++” 并点击 _Next_。

    ![](https://www.learncpp.com/images/CppTutorial/Chapter2/CB-AddNewItem4.png?ezimgfmt=rs:524x443/rscb2/ng:webp/ngcb2)

    接下来，为这个新文件起一个名字（不要忘了使用 `.cpp` 作为后缀名），然后点击 _All_ 按钮确保所有的构建目标都被勾选了。最后，选择 _finish_。

    ![](https://www.learncpp.com/images/CppTutorial/Chapter2/CB-AddNewItem5.png?ezimgfmt=rs:524x443/rscb2/ng:webp/ngcb2)

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

解决的办法也是一样的：将 `add` 函数的定义移到  `main` 函数之前，或者使用前向声明。在本例中，由于 `add` 定义在其他文件中，因此调整定义顺序是不可以的。

因此使用前向声明才是更好的办法：

main.cpp (包含前向声明):

```cpp hl_lines="3"
#include <iostream>

int add(int x, int y); // 这行是必须的，这样main.cpp才能够知道add()函数在其他文件中定义了

int main()
{
    std::cout << "The sum of 3 and 4 is: " << add(3, 4) << '\n';
    return 0;
}
```

add.cpp (保持不变):

```cpp
int add(int x, int y)
{
    return x + y;
}
```

现在，当编译器编译 _main.cpp_ 时，它会知晓标识符 _add_ 。链接器则会将 *main.cpp* 文件中的 `add` 函数调用和 _add.cpp_中的函数定义关联起来。

使用该方法，我们就可以访问定义在其他文件中的函数了。

请自行使用前向声明并编译 _add.cpp_ 和 _main.cpp_，如果你遇到了错误，请注意是否将 *add.cpp* 加入到了项目或编译命令中。

## 发生错误了！

在创建多文件程序时，可能会遇到很多不同错误。如果你尝试了上面的例子并遇到了一些错误，可以参考以下信息：

1.  如果你遇到了 `main` 中没有定义 `add` 的问题，和可能是因为忘记在 _main.cpp_ 中对 `add` 函数进行前向声明。
2.  如果链接器报告了无法找到 _add_ 定义的问题，例如：
    ```
    unresolved external symbol "int __cdecl add(int,int)" (?add@@YAHHH@Z) referenced in function _main
    ```
    1. 最大的可能性是 _add.cpp_ 文件没有被正确地添加到项目中。在编译程序的时候，你应该能够看到编译器列出了 _main.cpp_ 和 _add.cpp_。如果你值看到了 _main.cpp_，那么 _add.cpp_ 肯定没有被编译。如果你使用 Visual Studio 或 Code:: Blocks，你应该能够在 Solution Explorer/project 中看到 _add.cpp_。如果你没有看到，请右键点击项目并添加文件，然后尝试重新编译。如果你使用的是命令行的方式，请将 _main.cpp_ 和 _add.cpp_ 都包含在编译命令中。
    2. 你是不是将_add.cpp_ 添加到了错误的项目中？
    3. 也有可能是该文件被设置为不编译链接。请检查文件属性并确保将其配置为编译/链接。在 Code:: Blocks 中，编译和链接在两个单独的选择框中，请确保它们都被选中了。对于 Visual Studio 来说，请确保 “exclude from build” 选项被设置为 no 或空白。
3.  不要在*main.cpp*中 _#include “add.cpp”_。这么做会导致编译器将 _add.cpp_ 文件的内容直接插入 _main.cpp_ 而不是将其当做单独的文件。

## 小结

当编译器在编译多文件程序时，它可能会以任意顺序来编译各个文件。不仅如此，编译器对个文件的编译还是独立的，它在编译某文件是不具备任何其他文件的信息。

在学习到面向对象编程后，我们会大量使用多文件构建程序，所以你从现在就应该好好掌握这种方式。

提醒一下：任何新创建的代码文件都应该被加入到项目中，这样它才会被编译。
