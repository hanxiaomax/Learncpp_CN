---
title: 0-13-what-language-standard-is-my-compiler-using
aliases: 0-13-what-language-standard-is-my-compiler-using
origin: 
origin_title: 0-13-what-language-standard-is-my-compiler-using
time: 2025-04-01 
type: translation-under-construction
tags:
---

> [!note] "Key Takeaway"# 0.13 — What language standard is my compiler using?

[*Alex*](https://www.learncpp.com/author/Alex/ "View all posts by Alex")

April 18, 2024, 10:29 am PDT
December 29, 2024

The following program is designed to print the name of the language standard your compiler is currently using. You can copy/paste, compile, and run this program to validate that your compiler is using the language standard you expect.

PrintStandard.cpp:

```cpp
// This program prints the C++ language standard your compiler is currently using
// Freely redistributable, courtesy of learncpp.com (https://www.learncpp.com/cpp-tutorial/what-language-standard-is-my-compiler-using/)

#include <iostream>

const int numStandards = 7;
// The C++26 stdCode is a placeholder since the exact code won't be determined until the standard is finalized
const long stdCode[numStandards] = { 199711L, 201103L, 201402L, 201703L, 202002L, 202302L, 202612L};
const char* stdName[numStandards] = { "Pre-C++11", "C++11", "C++14", "C++17", "C++20", "C++23", "C++26" };

long getCPPStandard()
{
    // Visual Studio is non-conforming in support for __cplusplus (unless you set a specific compiler flag, which you probably haven't)
    // In Visual Studio 2015 or newer we can use _MSVC_LANG instead
    // See https://devblogs.microsoft.com/cppblog/msvc-now-correctly-reports-__cplusplus/
#if defined (_MSVC_LANG)
    return _MSVC_LANG;
#elif defined (_MSC_VER)
    // If we're using an older version of Visual Studio, bail out
    return -1;
#else
    // __cplusplus is the intended way to query the language standard code (as defined by the language standards)
    return __cplusplus;
#endif
}

int main()
{
    long standard = getCPPStandard();

    if (standard == -1)
    {
        std::cout << "Error: Unable to determine your language standard.  Sorry.\n";
        return 0;
    }
    
    for (int i = 0; i < numStandards; ++i)
    {
        // If the reported version is one of the finalized standard codes
        // then we know exactly what version the compiler is running
        if (standard == stdCode[i])
        {
            std::cout << "Your compiler is using " << stdName[i]
                << " (language standard code " << standard << "L)\n";
            break;
        }

        // If the reported version is between two finalized standard codes,
        // this must be a preview / experimental support for the next upcoming version.
        if (standard < stdCode[i])
        {
            std::cout << "Your compiler is using a preview/pre-release of " << stdName[i]
                << " (language standard code " << standard << "L)\n";
            break;
        }
    }
    
    return 0;
}
```

Build or runtime issues

If you get an error while trying to build this, you may have your project set up incorrectly. See [0.8 -- A few common C++ problems](https://www.learncpp.com/cpp-tutorial/a-few-common-cpp-problems/) for advice on some common issues. If that does not help, review the lessons starting from [0.6 -- Installing an Integrated Development Environment (IDE)](https://www.learncpp.com/cpp-tutorial/installing-an-integrated-development-environment-ide/).

If the program prints “Error: Unable to determine your language standard”, your compiler may be non-conforming. If you are using a popular compiler and this is the case, please leave a comment below with relevant information (e.g. the name and version of your compiler).

If this program prints a different language standard than you were expecting:

- Check your IDE settings to ensure your compiler is configured to use the language standard you expect. See [0.12 -- Configuring your compiler: Choosing a language standard](https://www.learncpp.com/cpp-tutorial/configuring-your-compiler-choosing-a-language-standard/) for more information on how to do this for some of the major compilers. Make sure there are no typos or formatting errors. Some compilers require setting the language standard for each project rather than globally, so if you’ve just created a new project, this may be the case.

- Your IDE or compiler may not even be reading the configuration file you’re editing (we see occasionally reader feedback on this with VS Code). If this seems like the case, please consult documentation for your IDE or compiler.

Q: If my compiler is using a preview/pre-release version, should I go back one version?

If you are just learning the language, it’s not necessary. Just be aware that some features from the upcoming version of the language may be missing, incomplete, buggy, or may change slightly.

\[Next lesson

1.1Statements and the structure of a program\](https://www.learncpp.com/cpp-tutorial/statements-and-the-structure-of-a-program/)
[Back to table of contents](/)
\[Previous lesson

0.12Configuring your compiler: Choosing a language standard\](https://www.learncpp.com/cpp-tutorial/configuring-your-compiler-choosing-a-language-standard/)

*Previous Post*[13.5 — Introduction to overloading the I/O operators](https://www.learncpp.com/cpp-tutorial/introduction-to-overloading-the-i-o-operators/)

*Next Post*[14.17 — Constexpr aggregates and classes](https://www.learncpp.com/cpp-tutorial/constexpr-aggregates-and-classes/)

\[wpDiscuz\](javascript:void(0);)

Insert

You are going to send email to

Send

Move Comment

Move
