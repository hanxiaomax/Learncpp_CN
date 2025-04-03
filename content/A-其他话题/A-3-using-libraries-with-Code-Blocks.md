---
title: A.3 - 在Code Blocks中使用库
alias: A.3 - 在Code Blocks中使用库
origin: /a3-using-libraries-with-codeblocks/
origin_title: "A.3 — Using libraries with Code::Blocks"
time: 2020-1-23
type: translation
---



回顾一下使用库需要完成的几个步骤：

对于每个库：

1.  获取库。从官网或通过包管理器下载库；
2.  安装库。将库解压或安装到特定的目录。
3. 告知编译器到哪里寻找头文件；
4. 告知链接器到哪里寻找库文件；

对于每个项目：

6. 告知链接器链接哪个静态库或导入库文件；
7. 在程序中 `#include` 头文件；
8. 确保程序知道到哪里寻找动态库。


**步骤1和2——获取和安装库

下载库到本地电脑，参见 [[A-1-static-and-dynamic-libraries|安装和使用库]] 。

**步骤3和4——告诉编译器到哪里查找头文件和库文件**

下面的操作是针对全局的设置，这样所有的项目都可以使用这个库。因此，下面的步骤每个库只需要执行一次。

1. 找到 “Settings menu” 然后选择 “Compiler”。

![](https://www.learncpp.com/images/CppTutorial/AppendixA/CB-SettingsMenu.png?ezimgfmt=rs:179x123/rscb2/ngcb2/notWebP)

2. 点击 “Directories” 选项卡找到默认的 “Compiler” 子选项卡。
3. 按下“Add”按钮，为库的头文件添加路径。如果你使用Linux并通过包管理器安装库，这里列出了 `/usr/include` ；

![](https://www.learncpp.com/images/CppTutorial/AppendixA/CB-CompilerDirectory.png?ezimgfmt=rs%3Adevice%2Frscb2-1)

4. 点击 “Linker” 标签。点击 “Add” 按钮并添加`.lib` 文件的地址。如果你运行的是 LInux 且通过包管理器安装的库，请确保在此处列出`/usr/lib`；

![](https://www.learncpp.com/images/CppTutorial/AppendixA/CB-LinkerDirectory.png?ezimgfmt=rs:512x538/rscb2/ng:webp/ngcb2)

5. 点击OK按钮。

**步骤 5 —— 告诉链接器程序使用哪些库**

对于步骤 5，我们需要将库文件添加到项目中。这个操作每个项目都需要做一次。

1. 右键default workspace下面的项目名，选择“Build options”；


![](https://www.learncpp.com/images/CppTutorial/AppendixA/CB-BuildOptions.png?ezimgfmt=rs:324x303/rscb2/ng:webp/ngcb2)

2. 点击 linker 选项卡。在 “Link libraries” 窗口下点击 “Add” 按钮并添加库；

![](https://www.learncpp.com/images/CppTutorial/AppendixA/CB-Library.png?ezimgfmt=rs:672x521/rscb2/ng:webp/ngcb2)

3. 点击OK按钮。

**步骤 6和 7 —— `#include` 头文件**

只需像往常一样将库中的头文件`#include`到项目中。

参见：[[A-1-static-and-dynamic-libraries|安装和使用库]]  获取更多关于步骤 7 的信息
