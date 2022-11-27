---
title: A.3 - 在Code Blocks中使用库
alias: A.3 - 在Code Blocks中使用库
origin: /a3-using-libraries-with-codeblocks/
origin_title: "A.3 — Using libraries with Code::Blocks"
time: 2020-1-23
type: translation
---

??? note "关键点速记"


To recap the process needed to use a library:

Once per library:

1.  Acquire the library. Download it from the website or via a package manager.
2.  Install the library. Unzip it to a directory or install it via a package manager.
3.  Tell the compiler where to look for the header file(s) for the library.
4.  Tell the linker where to look for the library file(s) for the library.

Once per project:

5.  Tell the linker which static or import library files to link.
6. `#include` the library’s header file(s) in your program.
7.  Make sure the program know where to find any dynamic libraries being used.

**Steps 1 and 2 -- Acquire and install library**

Download and install the library to your hard disk. See the tutorial on [[A-1-static-and-dynamic-libraries|A.1 - 静态库和动态库]] for more information about this step.

**Steps 3 and 4 -- Tell the compiler where to find headers and library files**

We are going to do this on a global basis so the library will be available to all of our projects. Consequently, the following steps only need to be done once per library.

A) Go to the “Settings menu” and pick “Compiler”.

![](https://www.learncpp.com/images/CppTutorial/AppendixA/CB-SettingsMenu.png?ezimgfmt=rs:179x123/rscb2/ngcb2/notWebP)

B) Click the “Directories” tab. The compiler tab will already be selected for you.

C) Press the “Add” button, and add the path to the .h files for the library. If you are running Linux and installed the library via a package manager, make sure _/usr/include_ is listed here.

![](https://www.learncpp.com/images/CppTutorial/AppendixA/CB-CompilerDirectory.png?ezimgfmt=rs%3Adevice%2Frscb2-1)

D) Click the “Linker” tab. Press the “Add” button, and add the path to the .lib files for the library. If you are running Linux and installed the library via a package manager, make sure _/usr/lib_ is listed here.

![](https://www.learncpp.com/images/CppTutorial/AppendixA/CB-LinkerDirectory.png?ezimgfmt=rs:512x538/rscb2/ng:webp/ngcb2)

E) Press the “OK” button.

**Step 5 -- Tell the linker which libraries your program is using**

For step 5, we need to add the library files from the library to our project. We do this on an individual project basis.

A) Right click on the bolded project name under the default workspace (probably “Console application”, unless you changed it). Choose “Build options” from the menu.

![](https://www.learncpp.com/images/CppTutorial/AppendixA/CB-BuildOptions.png?ezimgfmt=rs:324x303/rscb2/ng:webp/ngcb2)

B) Click the linker tab. Under the “Link libraries” window, press the “Add” button and add the library you wish your project to use.

![](https://www.learncpp.com/images/CppTutorial/AppendixA/CB-Library.png?ezimgfmt=rs:672x521/rscb2/ng:webp/ngcb2)

C) Press the “OK” button

**Steps 6 and 7 -- #include header files and make sure project can find DLLs**

Simply `#include` the header file(s) from the library in your project.

See the tutorial [[A-1-static-and-dynamic-libraries|A.1 - 静态库和动态库]] for more information step 7.

