---
title: B.1 - C++11
alias: B.1 - C++11
origin: /b-1-introduction-to-c11/
origin_title: "B.1 — Introduction to C++11"
time: 2022-6-27
type: translation
---



**What is C++11?**

On August 12, 2011, the [ISO (International Organization for Standardization)](https://www.iso.org/home.html) approved a new version of C++, called C++11. C++11 adds a whole new set of features to the C++ language! Use of these new features is entirely optional -- but you will undoubtedly find some of them helpful. The prior tutorials have all been updated to be C++11 compliant.

**The goals and designs of C++11**

Bjarne Stroustrup characterized the goals of C++11 as such:

-   Build on C++’s strengths -- rather than trying to extend C++ to new areas where it may be weaker (eg. Windows applications with heavy GUI), focus on making it do what it does well even better.
-   Make C++ easier to learn, use, and teach -- provide functionality that makes the language more consistent and easier to use.

To that end, the committee that put the language together tried to obey the following general principles:

-   Maintain stability and compatibility with older versions of C++ and C wherever possible. Programs that worked under C++03 should generally still work under C++11.
-   Keep the number of core language extensions to a minimum, and put the bulk of the changes in the standard library (an objective that wasn’t met very well with this release)
-   Focus on improving abstraction mechanisms (classes, templates) rather than adding mechanisms to handle specific, narrow situations.
-   Add new functionality for both novices and experts. A little of something for everybody!
-   Increase type safety, to prevent inadvertent bugs.
-   Improve performance and allow C++ to work directly with hardware.
-   Consider usability and ecosystem issues. C++ needs to work well with other tools, be easy to use and teach, etc…

C++11 isn’t a large departure from C++03 thematically, but it did add a huge amount of new functionality.

**Major new features in C++11**

For your interest, here’s a list of the major features that C++11 adds. Note that this list is not comprehensive, but rather intended to highlight some of the key features of interest.

-   auto ([8.7 -- Type deduction for objects using the auto keyword](https://www.learncpp.com/cpp-tutorial/type-deduction-for-objects-using-the-auto-keyword/))
-   char16_t and char32_t and new literals to support them (no tutorial yet)
-   constexpr ([4.13 -- Const variables and symbolic constants](https://www.learncpp.com/cpp-tutorial/const-variables-and-symbolic-constants/))
-   decltype (no tutorial yet)
-   default specifier (no tutorial yet)
-   Delegating constructors ([13.8 -- Overlapping and delegating constructors](https://www.learncpp.com/cpp-tutorial/overlapping-and-delegating-constructors/))
-   delete specifier ([14.14 -- Converting constructors, explicit, and delete](https://www.learncpp.com/cpp-tutorial/converting-constructors-explicit-and-delete/))
-   Enum classes ([10.4 -- Scoped enumerations (enum classes)](https://www.learncpp.com/cpp-tutorial/scoped-enumerations-enum-classes/))
-   Extern templates (no tutorial yet)
-   Lambda expressions ([12.7 -- Introduction to lambdas (anonymous functions)](https://www.learncpp.com/cpp-tutorial/introduction-to-lambdas-anonymous-functions/)) and captures ([12.8 -- Lambda captures](https://www.learncpp.com/cpp-tutorial/lambda-captures/))
-   long long int ([4.3 -- Object sizes and the sizeof operator](https://www.learncpp.com/cpp-tutorial/object-sizes-and-the-sizeof-operator/))
-   Move constructor and assignment ([M.3 -- Move constructors and move assignment](https://www.learncpp.com/cpp-tutorial/move-constructors-and-move-assignment/))
-   Noexcept specifier (quick mention in [20.4 -- Uncaught exceptions and catch-all handlers](https://www.learncpp.com/cpp-tutorial/uncaught-exceptions-catch-all-handlers/))
-   nullptr ([9.7 -- Null pointers](https://www.learncpp.com/cpp-tutorial/null-pointers/))
-   override and final specifiers([18.3 -- The override and final specifiers, and covariant return types](https://www.learncpp.com/cpp-tutorial/the-override-and-final-specifiers-and-covariant-return-types/))
-   Range-based for statements ([11.13 -- For-each loops](https://www.learncpp.com/cpp-tutorial/for-each-loops/))
-   r-value references ([M.2 -- R-value references](https://www.learncpp.com/cpp-tutorial/rvalue-references/))
-   static_assert ([7.17 -- Assert and static_assert](https://www.learncpp.com/cpp-tutorial/assert-and-static_assert/))
-   std::initializer_list ([16.7 -- std::initializer_list](https://www.learncpp.com/cpp-tutorial/stdinitializer_list/))
-   Trailing return type syntax ([8.7 -- Type deduction for objects using the auto keyword](https://www.learncpp.com/cpp-tutorial/type-deduction-for-objects-using-the-auto-keyword/))
-   Type aliases ([8.6 -- Typedefs and type aliases](https://www.learncpp.com/cpp-tutorial/typedefs-and-type-aliases/))
-   typedef can now typedef template classes
-   Uniform initialization ([4.1 -- Introduction to fundamental data types](https://www.learncpp.com/cpp-tutorial/introduction-to-fundamental-data-types/))
-   User-defined literals (no tutorial yet)
-   Variadic templates (no tutorial yet)
-   Two >> symbols without a space between them will now properly be interpreted as closing a template object

There are also many new classes in the C++ standard library available for use.

-   Better support for multi-threading and thread-local storage (no tutorial yet)
-   Hash tables (no tutorial yet)
-   Random number generation improvements (basic discussion in [7.19 -- Generating random numbers using Mersenne Twister](https://www.learncpp.com/cpp-tutorial/generating-random-numbers-using-mersenne-twister/))
-   Reference wrappers ([18.9 -- Object slicing](https://www.learncpp.com/cpp-tutorial/object-slicing/))
-   Regular expressions (no tutorial yet)
-   std::auto_ptr has been deprecated ([M.1 -- Introduction to smart pointers and move semantics](https://www.learncpp.com/cpp-tutorial/introduction-to-smart-pointers-move-semantics/))
-   std::tuple (no tutorial yet)
-   std::unique_ptr ([M.6 -- std::unique_ptr](https://www.learncpp.com/cpp-tutorial/stdunique_ptr/))