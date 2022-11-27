---
title: B.3 - C++17
alias: B.3 - C++17
origin: /b-3-introduction-to-c17/
origin_title: "B.3 — Introduction to C++17"
time: 2022-4-21
type: translation
---


??? note "关键点速记"
	



**What is C++17?**

In September of 2017, the [ISO (International Organization for Standardization)](https://www.iso.org/home.html) approved a new version of C++, called C++17. C++17 contains a fair amount of new content

**New improvements in C++17**

For your interest, here’s a list of the major improvements that C++17 adds. Note that this list is not comprehensive, but rather intended to highlight some of the key improvements of interest.

-   __has_include preprocessor identifier to check if optional header files are available (no tutorial yet)
-   if statements that resolve at compile time (no tutorial yet)
-   Initializers in if statements and switch statements (no tutorial yet)
-   inline variables ([6.9 -- Sharing global constants across multiple files (using inline variables)](https://www.learncpp.com/cpp-tutorial/sharing-global-constants-across-multiple-files-using-inline-variables/))
-   Fold expressions (no tutorial yet)
-   Nested namespaces can now be defined as namespace X::Y ([6.2 -- User-defined namespaces and the scope resolution operator](https://www.learncpp.com/cpp-tutorial/user-defined-namespaces-and-the-scope-resolution-operator/))
-   Removal of std::auto_ptr and some other deprecated types
-   static_assert no longer requires a diagnostic text message parameter ([7.17 -- Assert and static_assert](https://www.learncpp.com/cpp-tutorial/assert-and-static_assert/))
-   std::any (no tutorial yet)
-   std::byte (no tutorial yet)
-   std::filesystem (no tutorial yet)
-   std::optional (no tutorial yet)
-   std::shared_ptr can now manage C-style arrays (but std::make_shared can’t create them yet) ([M.7 -- std::shared_ptr](https://www.learncpp.com/cpp-tutorial/stdshared_ptr/))
-   std::size ([11.2 -- Arrays (Part II)](https://www.learncpp.com/cpp-tutorial/arrays-part-ii/))
-   std::string_view ([4.18 -- Introduction to std::string_view](https://www.learncpp.com/cpp-tutorial/introduction-to-stdstring_view/))
-   Structured binding declarations
-   Template deduction for constructors (no tutorial yet)
-   Trigraphs have been removed
-   typename can now be used (instead of class) in a template template parameter
-   UTF-8 (u8) character literals (no tutorial yet)