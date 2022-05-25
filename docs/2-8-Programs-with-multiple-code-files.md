---
alias: 2.8 - 程序和多个代码文件
origin: /programs-with-multiple-code-files/
origin_title: "2.8 — Programs with multiple code files"
time: 2022-4-15
type: translation
tags:
- 
---

Adding files to your project

As programs get larger, it is common to split them into multiple files for organizational or reusability purposes. One advantage of working with an IDE is that they make working with multiple files much easier. You already know how to create and compile single-file projects. Adding new files to existing projects is very easy.

Best practice

When you add new code files to your project, give them a .cpp extension.

For Visual Studio users

In Visual Studio, right click on the _Source Files_ folder in the Solution Explorer window, and choose _Add > New Item…_.

![](https://www.learncpp.com/images/CppTutorial/Chapter2/VS-AddNewItem1.png?ezimgfmt=rs%3Adevice%2Frscb2-1)

Make sure you have _C++ File (.cpp)_ selected. Give the new file a name, and it will be added to your project.

![](https://www.learncpp.com/images/CppTutorial/Chapter2/VS-AddNewItem2.png?ezimgfmt=rs:800x450/rscb2/ng:webp/ngcb2)

Note: If you create a new file from the _File menu_ instead of from your project in the Solution Explorer, the new file won’t be added to your project automatically. You’ll have to add it to the project manually. To do so, right click on _Source Files_ in the _Solution Explorer_, choose _Add > Existing Item_, and then select your file.

Now when you compile your program, you should see the compiler list the name of your file as it compiles it.

For Code::Blocks users

In Code::Blocks, go to the _File menu_ and choose _New > File…_.

![](https://www.learncpp.com/images/CppTutorial/Chapter2/CB-AddNewItem1.png?ezimgfmt=rs:540x233/rscb2/ng:webp/ngcb2)

In the _New from template_ dialog, select _C/C++ source_ and click _Go_.

![](https://www.learncpp.com/images/CppTutorial/Chapter2/CB-AddNewItem2.png?ezimgfmt=rs:604x453/rscb2/ng:webp/ngcb2)

You may or may not see a _welcome to the C/C++ source file wizard_ dialog at this point. If you do, click _Next_.

![](https://www.learncpp.com/images/CppTutorial/Chapter2/CB-AddNewItem3.png?ezimgfmt=rs:524x443/rscb2/ng:webp/ngcb2)

On the next page of the wizard, select “C++” and click _Next_.

![](https://www.learncpp.com/images/CppTutorial/Chapter2/CB-AddNewItem4.png?ezimgfmt=rs:524x443/rscb2/ng:webp/ngcb2)

Now give the new file a name (don’t forget the .cpp extension), and click the _All_ button to ensure all build targets are selected. Finally, select _finish_.

![](https://www.learncpp.com/images/CppTutorial/Chapter2/CB-AddNewItem5.png?ezimgfmt=rs:524x443/rscb2/ng:webp/ngcb2)

Now when you compile your program, you should see the compiler list the name of your file as it compiles it.

For GCC/G++ users

From the command line, you can create the additional file yourself, using your favorite editor, and give it a name. When you compile your program, you’ll need to include all of the relevant code files on the compile line. For example: _g++ main.cpp add.cpp -o main_, where _main.cpp_ and _add.cpp_ are the names of your code files, and _main_ is the name of the output file.

## A multi-file example

In lesson [2.7 -- Forward declarations and definitions](https://www.learncpp.com/cpp-tutorial/forward-declarations/), we took a look at a single-file program that wouldn’t compile:

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

COPY

When the compiler reaches the function call to _add_ on line 5 of _main_, it doesn’t know what _add_ is, because we haven’t defined _add_ until line 9! Our solution to this was to either reorder the functions (placing _add_ first) or use a forward declaration for _add_.

Now let’s take a look at a similar multi-file program:

add.cpp:

```cpp
int add(int x, int y)
{
    return x + y;
}
```

COPY

main.cpp:

```cpp
#include <iostream>

int main()
{
    std::cout << "The sum of 3 and 4 is: " << add(3, 4) << '\n'; // compile error
    return 0;
}
```

COPY

Your compiler may decide to compile either _add.cpp_ or _main.cpp_ first. Either way, _main.cpp_ will fail to compile, giving the same compiler error as the previous example:

main.cpp(5) : error C3861: 'add': identifier not found

The reason is exactly the same as well: when the compiler reaches line 5 of _main.cpp_, it doesn’t know what identifier _add_ is.

Remember, the compiler compiles each file individually. It does not know about the contents of other code files, or remember anything it has seen from previously compiled code files. So even though the compiler may have seen the definition of function _add_ previously (if it compiled _add.cpp_ first), it doesn’t remember.

This limited visibility and short memory is intentional, so that files may have functions or variables that have the same names without conflicting with each other. We’ll explore an example of such a conflict in the next lesson.

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

Something went wrong!

There are plenty of things that can go wrong the first time you try to work with multiple files. If you tried the above example and ran into an error, check the following:

1.  If you get a compiler error about _add_ not being defined in _main_, you probably forgot the forward declaration for function _add_ in _main.cpp_.
2.  If you get a linker error about _add_ not being defined, e.g.

unresolved external symbol "int __cdecl add(int,int)" (?add@@YAHHH@Z) referenced in function _main

2a. …the most likely reason is that _add.cpp_ is not added to your project correctly. When you compile, you should see the compiler list both _main.cpp_ and _add.cpp_. If you only see _main.cpp_, then _add.cpp_ definitely isn’t getting compiled. If you’re using Visual Studio or Code::Blocks, you should see _add.cpp_ listed in the Solution Explorer/project pane on the left or right side of the IDE. If you don’t, right click on your project, and add the file, then try compiling again. If you’re compiling on the command line, don’t forget to include both _main.cpp_ and _add.cpp_ in your compile command.

2b. …it’s possible that you added _add.cpp_ to the wrong project.

2c. …it’s possible that the file is set to not compile or link. Check the file properties and ensure the file is configured to be compiled/linked. In Code::Blocks, compile and link are separate checkboxes that should be checked. In Visual Studio, there’s an “exclude from build” option that should be set to “no” or left blank.

3.  Do _not_ _#include “add.cpp”_ from _main.cpp_. This will cause the compiler to insert the contents of _add.cpp_ directly into _main.cpp_ instead of treating them as separate files.

## Summary

When the compiler compiles a multi-file program, it may compile the files in any order. Additionally, it compiles each file individually, with no knowledge of what is in other files.

We will begin working with multiple files a lot once we get into object-oriented programming, so now’s as good a time as any to make sure you understand how to add and compile multiple file projects.

Reminder: Whenever you create a new code (.cpp) file, you will need to add it to your project so that it gets compiled.