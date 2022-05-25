---
alias: 2.11 - 头文件
origin: /header-files/
origin_title: "2.11 — Header files"
time: 2022-5-2
type: translation
tags:
- header
---

Headers, and their purpose

As programs grow larger (and make use of more files), it becomes increasingly tedious to have to forward declare every function you want to use that is defined in a different file. Wouldn’t it be nice if you could put all your forward declarations in one place and then import them when you need them?

C++ code files (with a .cpp extension) are not the only files commonly seen in C++ programs. The other type of file is called a header file. Header files usually have a .h extension, but you will occasionally see them with a .hpp extension or no extension at all. The primary purpose of a header file is to propagate declarations to code files.

Key insight

Header files allow us to put declarations in one location and then import them wherever we need them. This can save a lot of typing in multi-file programs.

Using standard library header files

Consider the following program:

```cpp
#include <iostream>

int main()
{
    std::cout << "Hello, world!";
    return 0;
}
```

COPY

This program prints “Hello, world!” to the console using _std::cout_. However, this program never provided a definition or declaration for _std::cout_, so how does the compiler know what _std::cout_ is?

The answer is that _std::cout_ has been forward declared in the “iostream” header file. When we `#include <iostream>`, we’re requesting that the preprocessor copy all of the content (including forward declarations for std::cout) from the file named “iostream” into the file doing the #include.

Key insight

When you #include a file, the content of the included file is inserted at the point of inclusion. This provides a useful way to pull in declarations from another file.

Consider what would happen if the _iostream_ header did not exist. Wherever you used _std::cout_, you would have to manually type or copy in all of the declarations related to _std::cout_ into the top of each file that used _std::cout_! This would require a lot of knowledge about how _std::cout_ was implemented, and would be a ton of work. Even worse, if a function prototype changed, we’d have to go manually update all of the forward declarations. It’s much easier to just `#include <iostream>`!

When it comes to functions and variables, it’s worth keeping in mind that header files typically only contain function and variable declarations, not function and variable definitions (otherwise a violation of the _one definition rule_ could result). _std::cout_ is forward declared in the iostream header, but defined as part of the C++ standard library, which is automatically linked into your program during the linker phase.

![](https://www.learncpp.com/images/CppTutorial/Section1/IncludeLibrary.png?ezimgfmt=rs%3Adevice%2Frscb2-1)

Best practice

Header files should generally not contain function and variable definitions, so as not to violate the one definition rule. An exception is made for symbolic constants (which we cover in lesson [4.15 -- Symbolic constants: const and constexpr variables](https://www.learncpp.com/cpp-tutorial/const-constexpr-and-symbolic-constants/)).

Writing your own header files

Now let’s go back to the example we were discussing in a previous lesson. When we left off, we had two files, _add.cpp_ and _main.cpp_, that looked like this:

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

int add(int x, int y); // forward declaration using function prototype

int main()
{
    std::cout << "The sum of 3 and 4 is " << add(3, 4) << '\n';
    return 0;
}
```

COPY

(If you’re recreating this example from scratch, don’t forget to add _add.cpp_ to your project so it gets compiled in).

In this example, we used a forward declaration so that the compiler will know what identifier _add_ is when compiling _main.cpp_. As previously mentioned, manually adding forward declarations for every function you want to use that lives in another file can get tedious quickly.

Let’s write a header file to relieve us of this burden. Writing a header file is surprisingly easy, as header files only consist of two parts:

1.  A _header guard_, which we’ll discuss in more detail in the next lesson ([2.12 -- Header guards](https://www.learncpp.com/cpp-tutorial/header-guards/)).
2.  The actual content of the header file, which should be the forward declarations for all of the identifiers we want other files to be able to see.

Adding a header file to a project works analogously to adding a source file (covered in lesson [2.8 -- Programs with multiple code files](https://www.learncpp.com/cpp-tutorial/programs-with-multiple-code-files/)). If using an IDE, go through the same steps and choose “Header” instead of “Source” when asked. If using the command line, just create a new file in your favorite editor.

Best practice

Use a .h suffix when naming your header files.

Header files are often paired with code files, with the header file providing forward declarations for the corresponding code file. Since our header file will contain a forward declaration for functions defined in _add.cpp_, we’ll call our new header file _add.h_.

Best practice

If a header file is paired with a code file (e.g. add.h with add.cpp), they should both have the same base name (add).

Here’s our completed header file:

add.h:

```cpp
// 1) We really should have a header guard here, but will omit it for simplicity (we'll cover header guards in the next lesson)

// 2) This is the content of the .h file, which is where the declarations go
int add(int x, int y); // function prototype for add.h -- don't forget the semicolon!
```

COPY

In order to use this header file in main.cpp, we have to #include it (using quotes, not angle brackets).

main.cpp:

```cpp
#include "add.h" // Insert contents of add.h at this point.  Note use of double quotes here.
#include <iostream>

int main()
{
    std::cout << "The sum of 3 and 4 is " << add(3, 4) << '\n';
    return 0;
}
```

COPY

add.cpp:

```cpp
#include "add.h" // Insert contents of add.h at this point.  Note use of double quotes here.

int add(int x, int y)
{
    return x + y;
}
```

COPY

When the preprocessor processes the `#include "add.h"` line, it copies the contents of add.h into the current file at that point. Because our _add.h_ contains a forward declaration for function _add_, that forward declaration will be copied into _main.cpp_. The end result is a program that is functionally the same as the one where we manually added the forward declaration at the top of _main.cpp_.

Consequently, our program will compile and link correctly.

![](https://www.learncpp.com/images/CppTutorial/Section1/IncludeHeader.png?ezimgfmt=rs:647x377/rscb2/ng:webp/ngcb2)

Source files should include their paired header [](https://www.learncpp.com/cpp-tutorial/header-files/#corresponding_include)

In C++, it is a best practice for code files to #include their paired header file (if one exists). In the example above, _add.cpp_ includes _add.h_.

This allows the compiler to catch certain kinds of errors at compile time instead of link time. For example:

something.h:

```cpp
int something(int); // return type of forward declaration is int
```

COPY

something.cpp:

```cpp
#include "something.h"

void something(int) // error: wrong return type
{
}
```

COPY

Because _something.cpp_ #includes _something.h_, the compiler will notice that function _something()_ has a mismatched return type and give us a compile error. If _something.cpp_ did not #include _something.h_, we’d have to wait until the linker discovered the discrepancy, which wastes time. For another example, see [this comment](https://www.learncpp.com/cpp-tutorial/header-files/comment-page-8/#comment-398571).

Best practice

Source files should #include their paired header file (if one exists).

Troubleshooting

If you get a compiler error indicating that _add.h_ isn’t found, make sure the file is really named _add.h_. Depending on how you created and named it, it’s possible the file could have been named something like _add_ (no extension) or _add.h.txt_ or _add.hpp_. Also make sure it’s sitting in the same directory as the rest of your code files.

If you get a linker error about function _add_ not being defined, make sure you’ve added _add.cpp_ in your project so the definition for function _add_ can be linked into the program.

Angled brackets vs double quotes [](https://www.learncpp.com/cpp-tutorial/header-files/#includemethod)

You’re probably curious why we use angled brackets for `iostream`, and double quotes for `add.h`. It’s possible that a header file with the same filename might exist in multiple directories. Our use of angled brackets vs double quotes helps give the compiler a clue as to where it should look for header files.

When we use angled brackets, we’re telling the preprocessor that this is a header file we didn’t write ourselves. The compiler will search for the header only in the directories specified by the `include directories`. The `include directories` are configured as part of your project/IDE settings/compiler settings, and typically default to the directories containing the header files that come with your compiler and/or OS. The compiler will not search for the header file in your project’s source code directory.

When we use double-quotes, we’re telling the preprocessor that this is a header file that we wrote. The compiler will first search for the header file in the current directory. If it can’t find a matching header there, it will then search the `include directories`.

Rule

Use double quotes to include header files that you’ve written or are expected to be found in the current directory. Use angled brackets to include headers that come with your compiler, OS, or third-party libraries you’ve installed elsewhere on your system.

Why doesn’t iostream have a .h extension?

Another commonly asked question is “why doesn’t iostream (or any of the other standard library header files) have a .h extension?”. The answer is that _iostream.h_ is a different header file than _iostream_! To explain requires a short history lesson.

When C++ was first created, all of the files in the standard runtime library ended in a _.h_ suffix. Life was consistent, and it was good. The original version of _cout_ and _cin_ were declared in _iostream.h_. When the language was standardized by the ANSI committee, they decided to move all of the functionality in the standard library into the _std_namespace to help avoid naming conflicts with user-defined identifiers. However, this presented a problem: if they moved all the functionality into the _std_ namespace, none of the old programs (that included iostream.h) would work anymore!

To work around this issue, a new set of header files was introduced that use the same names but lack the _.h_ extension. These new header files have all their functionality inside the _std_ namespace. This way, older programs that include `#include <iostream.h>` do not need to be rewritten, and newer programs can `#include <iostream>`.

In addition, many of the libraries inherited from C that are still useful in C++ were given a _c_ prefix (e.g. _stdlib.h_ became _cstdlib_). The functionality from these libraries was also moved into the _std_ namespace to help avoid naming collisions.

Best practice

When including a header file from the standard library, use the version without the .h extension if it exists. User-defined headers should still use a .h extension.

Including header files from other directories

Another common question involves how to include header files from other directories.

One (bad) way to do this is to include a relative path to the header file you want to include as part of the #include line. For example:

```cpp
#include "headers/myHeader.h"
#include "../moreHeaders/myOtherHeader.h"
```

COPY

While this will compile (assuming the files exist in those relative directories), the downside of this approach is that it requires you to reflect your directory structure in your code. If you ever update your directory structure, your code won’t work anymore.

A better method is to tell your compiler or IDE that you have a bunch of header files in some other location, so that it will look there when it can’t find them in the current directory. This can generally be done by setting an _include path_ or _search directory_ in your IDE project settings.

For Visual Studio users

Right click on your project in the _Solution Explorer_, and choose _Properties_, then the _VC++ Directories_ tab. From here, you will see a line called _Include Directories_. Add the directories you’d like the compiler to search for additional headers there.

For Code::Blocks users

In Code::Blocks, go to the _Project_ menu and select _Build Options_, then the _Search directories_ tab. Add the directories you’d like the compiler to search for additional headers there.

For GCC/G++ users

Using g++, you can use the -I option to specify an alternate include directory.

```cpp
g++ -o main -I/source/includes main.cpp
```

COPY

The nice thing about this approach is that if you ever change your directory structure, you only have to change a single compiler or IDE setting instead of every code file.

Headers may include other headers [](https://www.learncpp.com/cpp-tutorial/header-files/#transitive)

It’s common that a header file will need a declaration or definition that lives in a different header file. Because of this, header files will often #include other header files.

When your code file #includes the first header file, you’ll also get any other header files that the first header file includes (and any header files those include, and so on). These additional header files are sometimes called transitive includes, as they’re included implicitly rather than explicitly.

The content of these transitive includes are available for use in your code file. However, you should not rely on the content of headers that are included transitively. The implementation of header files may change over time, or be different across different systems. If that happens, your code may only compile on certain systems, or may compile now but not in the future. This is easily avoided by explicitly including all of the header files the content of your code file requires.

Best practice

Each file should explicitly #include all of the header files it needs to compile. Do not rely on headers included transitively from other headers.

Unfortunately, there is no easy way to detect when your code file is accidentally relying on content of a header file that has been included by another header file.

Q: I didn’t include <someheader> and my program worked anyway! Why?

This is one of the most commonly asked questions on this site. The answer is: it’s likely working, because you included some other header (e.g. <iostream>), which itself included <someheader>. Although your program will compile, per the best practice above, you should not rely on this. What compiles for you might not compile on a friend’s machine.

The #include order of header files

If your header files are written properly and #include everything they need, the order of inclusion shouldn’t matter.

Now consider the following scenario: let’s say header A needs declarations from header B, but forgets to include it. In our code file, if we include header B before header A, our code will still compile! This is because the compiler will compile all the declarations from B before it compiles the code from A that depends on those declarations.

However, if we include header A first, then the compiler will complain because the code from A will be compiled before the compiler has seen the declarations from B. This is actually preferable, because the error has been surfaced, and we can then fix it.

Best practice

To maximize the chance that missing includes will be flagged by compiler, order your #includes as follows:

1.  The paired header file
2.  Other headers from your project
3.  3rd party library headers
4.  Standard library headers

The headers for each grouping should be sorted alphabetically.

That way, if one of your user-defined headers is missing an #include for a 3rd party library or standard library header, it’s more likely to cause a compile error so you can fix it.

Header file best practices

Here are a few more recommendations for creating and using header files.

-   Always include header guards (we’ll cover these next lesson).
-   Do not define variables and functions in header files (global constants are an exception -- we’ll cover these later)
-   Give a header file the same name as the source file it’s associated with (e.g. _grades.h_ is paired with _grades.cpp_).
-   Each header file should have a specific job, and be as independent as possible. For example, you might put all your declarations related to functionality A in A.h and all your declarations related to functionality B in B.h. That way if you only care about A later, you can just include A.h and not get any of the stuff related to B.
-   Be mindful of which headers you need to explicitly include for the functionality that you are using in your code files
-   Every header you write should compile on its own (it should #include every dependency it needs)
-   Only #include what you need (don’t include everything just because you can).
-   Do not #include .cpp files.