---
title: A.2 - 在visual studio中使用库
alias: A.2 - 在visual studio中使用库
origin: /a2-using-libraries-with-visual-studio-2005-express/
origin_title: "A.2 — Using libraries with Visual Studio"
time: 2022-8-15
type: translation
---

??? note "Key Takeaway"


To recap the process needed to use a library:

Once per library:

1.  Acquire the library. Download it from the website or via a package manager.
2.  Install the library. Unzip it to a directory or install it via a package manager.

Once per project:

3.  Tell the compiler where to look for the header file(s) for the library.
4.  Tell the linker where to look for the library file(s) for the library.
5.  Tell the linker which static or import library files to link.
6.  #include the library’s header file(s) in your program.
7.  Make sure the program know where to find any dynamic libraries being used.

Note: The examples in this lesson show screenshots from Visual Studio 2005 express, but the process hasn’t changed too substantively since then.

**Steps 1 and 2 -- Acquire and install library**

Download and install the library to your hard disk. See the tutorial on [static and dynamic libraries](https://www.learncpp.com/cpp-tutorial/a1-static-and-dynamic-libraries/) for more information about this step.

**Steps 3 and 4 -- Tell the compiler where to find headers and library files**

A) Go to the Project menu and pick Project -> Properties (it should be at the bottom)

B) Under the “Configuration” dropdown, make sure that “All configurations” is selected.

C) In the left window pane, select “Configuration Properties” -> “VC++ Directories”.

D) On the “Include Directories” line, add the path to the .h files for the library (make sure this is separated from previous entries by a semicolon).

E) On the “Library Directories”, add the path to the .lib files for the library.

F) Click “OK”.

**Step 5 -- Tell the linker which libraries your program is using**

For step 5, we need to add .lib files from the library to our project. We do this on an individual project basis.

A) Go to the Project menu and pick Project -> Properties (it should be at the bottom)

B) Under the “Configuration” dropdown, make sure that “All configurations” is selected.

C) In the left window pane, select “Configuration Properties” -> “Linker” -> “Input”.

D) Add the name of your .lib file to the list of “Additional Dependencies” (separated from previous entries by a semicolon)

E) Click “OK”.

**Steps 6 and 7 -- #include header files and make sure project can find DLLs**

Simply #include the header file(s) from the library in your project as per usual.

See the tutorial [A1 -- Static and dynamic libraries](https://www.learncpp.com/cpp-tutorial/a1-static-and-dynamic-libraries/) for more information on step 7.

[

](https://www.learncpp.com/cpp-tutorial/a3-using-libraries-with-codeblocks/)