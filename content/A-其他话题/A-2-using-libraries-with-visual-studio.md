---
title: A.2 - 在visual studio中使用库
alias: A.2 - 在visual studio中使用库
origin: /a2-using-libraries-with-visual-studio-2005-express/
origin_title: "A.2 — Using libraries with Visual Studio"
time: 2022-8-15
type: translation
---


回顾一下使用库需要完成的几个步骤：

对于每个库：

1.  获取库。从官网或通过包管理器下载库；
2.  安装库。将库解压或安装到特定的目录。

对于每个项目：

3. 告知编译器到哪里寻找头文件；
4. 告知链接器到哪里寻找库文件；
5. 告知链接器链接哪个静态库或导入库文件；
6. 在程序中 `#include` 头文件；
7. 确保程序知道到哪里寻找动态库。

注意：本课中的例子基于 Visual Studio 2005 express，但是从那时起这个过程并没有发生太大的变化。

**步骤1和2——获取和安装库

下载库到本地电脑，参见 [[A-1-static-and-dynamic-libraries|安装和使用库]] 。

**步骤3和4——告诉编译器到哪里查找头文件和库文件**

1. 进入项目菜单，选择项目->属性(它应该在底部)
2. 在“配置”下拉菜单中，确保选择了“所有配置”。
3. 在左侧窗口窗格中，选择“配置属性”->“VC++目录”。
4. 在“Include Directories”行，为库添加.h文件的路径(确保这与前面的条目用分号分隔)。
5. 在“库目录”中，添加库的`.lib`文件的路径。
6. 点击“确定”。


**步骤 5 —— 告诉链接器程序使用哪些库**

对于第5步，需要将库中的`.lib`文件添加到项目中。我们在每个项目的基础上这样做。

1. 进入项目菜单，选择项目->属性(它应该在底部)
2. 在“配置”下拉菜单中，确保选择了“所有配置”。
3. 在左侧窗口中，选择“Configuration Properties”->“Linker”->“Input”。
4. 将.lib文件的名称添加到“附加依赖项”列表中(用分号与前面的条目分隔)
5. 点击“确定”。

**步骤 6和 7 —— `#include` 头文件

只需像往常一样将库中的头文件`#include`到项目中。

