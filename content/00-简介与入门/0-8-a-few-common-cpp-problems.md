---
title: 0-8-a-few-common-cpp-problems
aliases: 0-8-a-few-common-cpp-problems
origin: 
origin_title: 0-8-a-few-common-cpp-problems
time: 2025-04-01 
type: translation-under-construction
tags:
---

> [!note] "Key Takeaway"# 0.8 — A few common C++ problems

[*Alex*](https://www.learncpp.com/author/Alex/ "View all posts by Alex")

December 16, 2007, 12:11 am PST
December 19, 2024

In this section, we’ll address some of the common issues that new programmers seem to run across with fairly high probability. This is not meant to be a comprehensive list of compilation or execution problems, but rather a pragmatic list of solutions to very basic issues. If you have any suggestions for other issues that might be added to this list, post them in the comments section below.

General run-time issues

Q: When executing a program, the console window blinks and then closes immediately.

First, add or ensure the following lines are near the top of your program (Visual Studio users, make sure these lines appear after #include “pch.h” or #include “stdafx.h”, if those exist):

```cpp
#include <iostream>
#include <limits>
```

Second, add the following code at the end of your main() function (right before the return statement):

```cpp
std::cin.clear(); // reset any error flags
std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n'); // ignore any characters in the input buffer until we find an enter character
std::cin.get(); // get one more char from the user
```

This will cause your program to wait for the user to press a key before continuing, which will give you time to examine your program’s output before your operating system closes the console window.

Other solutions, such as the commonly suggested system(“pause”) solution may only work on certain operating systems and should be avoided.

Older versions of Visual Studio may not pause when the program is run in *Start With Debugging (F5)* mode. Try running in *Start Without Debugging (Ctrl-F5)* mode.

Q: I ran my program and get a window but no output.

Your virus scanner or anti-malware may be blocking execution. Try disabling it temporarily and see if that’s the issue.

Q: My program compiles but it isn’t working correctly. What do I do?

Debug it! There are tips on how to diagnose and debug your programs later in chapter 3.

General compile-time issues

Q: When I compile my program, I get an error about unresolved external symbol \_main or \_WinMain@16

This means your compiler can’t find your main() function. All programs must include a main() function.

There are a few things to check:\
a) Does your code include a function named main?\
b) Is main spelled correctly?\
c) When you compile your program, do you see the file that contains function main() get compiled? If not, either move the main() function to one that is, or add the file to your project (see lesson [2.8 -- Programs with multiple code files](https://www.learncpp.com/cpp-tutorial/programs-with-multiple-code-files/) for more information about how to do this).\
d) Did you create a console project? Try creating a new console project.

Q: When I compile my program, I get an error that main is already defined, or about multiple definitions for main

A C++ program is only allowed to have a single function named `main`. Your C++ program has more than one. Examine the files in your project and delete all `main` functions except one.

Q: I’m trying to use C++11/14/17/XX functionality and it doesn’t work

If your compiler is old, it may not support these more recent additions to the language. In that case, upgrade your compiler.

For modern IDEs/compilers, your compiler may be defaulting to an older language standard. We cover how to change your language standard in lesson [0.12 -- Configuring your compiler: Choosing a language standard](https://www.learncpp.com/cpp-tutorial/configuring-your-compiler-choosing-a-language-standard/).

Q: When I compile my program, I get an error that it cannot open the .exe for writing

This means the linker is trying to create your executable, but it can’t. This can happen for quite a few reasons:

- Most commonly, the .exe is currently running. A running executable can’t be replaced while it is running. Close the running .exe and recompile.
- Your antivirus or malware protection is preventing the executable from being created or replaced.
- The .exe already exists and is currently locked for some other reason. Try rebooting (to force any locks to be released), then recompile.

In Visual Studio, this is error LNK1168.

Q: When trying to use cin, cout, or endl, the compiler says cin, cout, or endl is an ‘undeclared identifier’

First, make sure you have included the following line near the top of your file:

```cpp
#include <iostream>
```

Second, make sure each use of cin, cout, and endl are prefixed by “std::”. For example:

```cpp
std::cout << "Broccoli" << std::endl;
```

If this doesn’t fix your issue, then it may be that your compiler is out of date, or the install is corrupted. Try reinstalling and/or upgrading to the latest version of your compiler.

Q: When trying to use endl to end a printed line, the compiler says end1 is an ‘undeclared identifier’

Make sure you do not mistake the letter l (lower case L) in endl for the number 1. endl is all letters. Make sure your editor is using a font that makes clear the differences between the letter lower case L, upper case i, and the number 1. Also the letter capital o and the number zero can easily be confused in many non-programming fonts.

Visual Studio issues

Q: When compiling with Microsoft Visual C++, you get a C1010 fatal error, with an error message like "c:\\vcprojects\\test.cpp(263) :fatal error C1010: unexpected end of file while looking for precompiled header directive"

This error occurs when the Microsoft Visual C++ compiler is set to use precompiled headers but one (or more) of your C++ code files does not #include “stdafx.h” or #include “pch.h” as the first line of the code file.

Our suggested fix is to turn off precompiled headers, which we show how to do in lesson [0.7 -- Compiling your first program](https://www.learncpp.com/cpp-tutorial/compiling-your-first-program/).

If you would like to keep precompiled headers turned on, to fix this problem, simply locate the file(s) producing the error (in the above error, test.cpp is the culprit), and add the following line at the very top of the file(s):

```cpp
#include "pch.h"
```

Older versions of Visual Studio use “stdafx.h” instead of “pch.h”, so if pch.h doesn’t resolve the issue, try stdafx.h.

Note that for programs with multiple files, every C++ code file needs to start with this line.

Q: Visual Studio gives an error like: "1MSVCRTD.lib(exe_winmain.obj) : error LNK2022: unresolved external symbol \_WinMain@16 referenced in function "int \_\_cdecl invoke_main(void)" (?invoke_main@@YAHXZ)"

You’ve likely created a Windows graphical application rather than a console application. Recreate your project, and make sure to create it as a Windows (or Win32) *Console* project.

Q: When I compile my program, I get a warning about "Cannot find or open the PDB file"

This is a warning, not an error, so it shouldn’t impact your program. However, it is annoying. To fix it, go into the Debug menu -> Options and Settings -> Symbols, and check “Microsoft Symbol Server”.

Something else

Q: I have some other problem that I can’t figure out. How can I get an answer quickly?

As you progress through the material, you’ll undoubtedly have questions or run into unexpected problems. What to do next depends on your problem. But in general, there are a few things you can try.

First, **ask a search engine**. Find a good way to phrase your question and do a search. If you are searching an error message, paste in the exact error message using quotes (exclude any filenames or line numbers). Odds are someone has already asked the same question and there is an answer waiting for you.

Second, **ask an AI** like [ChatGPT via Bing](https://www.bing.com/chat). Start your question with “In C++,” to get a C++ specific answer. Some ideas for things you can ask for:

- An explanation of some concept (e.g. “In C++, what is a local variable?”).
- The difference between two things (e.g. “In C++, what is the difference between a pointer and a reference?”)
- A demonstration of a concept (e.g. “In C++, write a short program that adds two numbers”)

Note that AIs may return inaccurate or outdated information, and the programs they write will probably not follow modern best practices.

If the above fails, **ask on a Q&A board**. There are websites designed for programming questions and answers, like [Stack Overflow](https://www.stackoverflow.com). Try posting your question there. Remember to be thorough about what your problem is, and include all relevant information like what OS you’re on and what IDE you’re using.

\[Next lesson

0.9Configuring your compiler: Build configurations\](https://www.learncpp.com/cpp-tutorial/configuring-your-compiler-build-configurations/)
[Back to table of contents](/)
\[Previous lesson

0.7Compiling your first program\](https://www.learncpp.com/cpp-tutorial/compiling-your-first-program/)

*Previous Post*[23.6 — Container classes](https://www.learncpp.com/cpp-tutorial/container-classes/)

*Next Post*[24.1 — Introduction to inheritance](https://www.learncpp.com/cpp-tutorial/introduction-to-inheritance/)

\[wpDiscuz\](javascript:void(0);)

Insert

You are going to send email to

Send

Move Comment

Move
