---
title: 4.14 - 字面量常量
alias: 4.14 - 字面量常量
origin: /literals/
origin_title: "4.14 — Literal constants"
time: 2022-5-7
type: translation
tags:
- literal
- constants
---

In programming, a constant is a fixed value that may not be changed. C++ has two kinds of constants: literal constants, and symbolic constants. We’ll cover literal constants in this lesson, and symbolic constants in the next lesson ([4.15 -- Symbolic constants: const and constexpr variables](https://www.learncpp.com/cpp-tutorial/const-constexpr-and-symbolic-constants/)).

Literal constants (usually just called literals) are unnamed values inserted directly into the code. For example:

```cpp
return 5; // 5 is an integer literal
bool myNameIsAlex { true }; // true is a boolean literal
std::cout << 3.4; // 3.4 is a double literal
```

COPY

They are constants because their values can not be changed dynamically (you have to change them, and then recompile for the change to take effect).

Just like objects have a type, all literals have a type. The type of a literal is assumed from the value and format of the literal itself.

By default:


|Literal value|Examples	|Default type|
|----|----|----|
|integral value|	5, 0, -3	|int
|boolean value	|true, false|	bool
|floating point value	|3.4, -2.2	|double (not float)!
|char value	|‘a’	|char
|C-style string	|“Hello, world!”	|const char[14]


**Literal suffixes**

If the default type of a literal is not as desired, you can change the type of a literal by adding a suffix:

|Data Type	|Suffix	|Meaning|
|----|----|----|
|int	|u or U	|unsigned int|
|int	|l or L	|long|
|int	|ul, uL, Ul, UL, lu, lU, Lu, or LU	|unsigned long|
|int	|ll or LL	|long long|
|int	|ull, uLL, Ull, ULL, llu, llU, LLu, or LLU	|unsigned long long|
|double	|f or F	|float|
|double	|l or L	|long double|
