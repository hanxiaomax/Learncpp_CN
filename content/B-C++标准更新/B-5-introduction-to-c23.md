---
title: B-5-introduction-to-c23
aliases: B-5-introduction-to-c23
origin: 
origin_title: B-5-introduction-to-c23
time: 2025-04-01 
type: translation-under-construction
tags:
---
# B.5 — Introduction to C++23

What is C++23?

In February of 2023, the ISO (International Organization for Standardization) approved a new version of C++, called C++23.

New improvements in C++23

For your interest, here’s a list of the major changes that C++23 adds. Note that this list is not comprehensive, but rather intended to highlight some of the key changes of interest.

- Constexpr <cmath> (e.g. `std::abs()`), and <cstdlib> ([6.7 -- Relational operators and floating point comparisons](https://www.learncpp.com/cpp-tutorial/relational-operators-and-floating-point-comparisons/)).
- Constexpr `std::unique_ptr` (no lesson yet).
- Explicit `this` parameter (no lesson yet).
- Fixed-size floating point types (via <stdfloat>) (no lesson yet).
- Formatted printing functions `std::print` and `std::println` (no lesson yet)
- Literal suffixes for `std::size_t` and the corresponding signed type ([5.2 -- Literals](https://www.learncpp.com/cpp-tutorial/literals/)).
- Multidimensional subscript `operator[]` (Mentioned in lesson [17.13 -- Multidimensional std::array](https://www.learncpp.com/cpp-tutorial/multidimensional-stdarray/)).
- Multidimensional span `std::mdspan` ([17.13 -- Multidimensional std::array](https://www.learncpp.com/cpp-tutorial/multidimensional-stdarray/)).
- Preprocessor directives `#elifdef` and `#elifndef` (no lesson yet).
- Preprocessor directive `#warning` (no lesson yet).
- Stacktrace library (no lesson yet)
- Standard library modules `std` (and `std.compat`) (no lesson yet).
- Static `operator()` and `operator[]` (no lesson yet).
- `std::bitset` now fully constexpr.
- `std::expected` (no lesson yet)
- `std::ranges` algorithms `starts_with`, `ends_with`, `contains` (no lesson yet)
- `std::string::contains` and `std::string_view::contains` (no lesson yet)
- `std::to_underlying` to get the underlying type of enum ([13.6 -- Scoped enumerations (enum classes)](https://www.learncpp.com/cpp-tutorial/scoped-enumerations-enum-classes/)).
- `std::unreachable()` (no lesson yet).
- Using unknown pointers and references in constant expressions ([17.2 -- std::array length and indexing](https://www.learncpp.com/cpp-tutorial/stdarray-length-and-indexing/)).