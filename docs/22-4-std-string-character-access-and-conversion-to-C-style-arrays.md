---
title: 22.4 - std-string 字符访问和C字符数组转换
alias: 22.4 - std-string 字符访问和C字符数组转换
origin: /stdstring-character-access-and-conversion-to-c-style-arrays/
origin_title: "22.4 — std::string character access and conversion to C-style arrays"
time: 2022-9-16
type: translation
tags:
- string
---

??? note "关键点速记"


## 访问字符
There are two almost identical ways to access characters in a string. The easier to use and faster version is the overloaded `operator[]`:

**`char& string::operator[] (size_type nIndex)`**  
**`const char& string::operator[] (size_type nIndex) const`**

-   Both of these functions return the character with index nIndex
-   Passing an invalid index results in undefined behavior
-   Because char& is the return type, you can use this to edit characters in the array

Sample code:

```cpp
std::string sSource{ "abcdefg" };
std::cout << sSource[5] << '\n';
sSource[5] = 'X';
std::cout << sSource << '\n';
```

COPY

Output:

```
f
abcdeXg
```

There is also a non-operator version. This version is slower since it uses exceptions to check if the nIndex is valid. If you are not sure whether nIndex is valid, you should use this version to access the array:

**`char& string::at (size_type nIndex)`**  
**`const char& string::at (size_type nIndex) const`**

-   Both of these functions return the character with index nIndex
-   Passing an invalid index results in an out_of_range exception
-   Because char& is the return type, you can use this to edit characters in the array

Sample code:

```cpp
std::string sSource{ "abcdefg" };
std::cout << sSource.at(5) << '\n';
sSource.at(5) = 'X';
std::cout << sSource << '\n';
```

COPY

Output:

```
f
abcdeXg
```

## Conversion to C-style arrays**

Many functions (including all C functions) expect strings to be formatted as C-style strings rather than std::string. For this reason, std::string provides 3 different ways to convert std::string to C-style strings.

**`const char* string::c_str () const`**

-   Returns the contents of the string as a const C-style string
-   A null terminator is appended
-   The C-style string is owned by the std::string and should not be deleted

Sample code:

```cpp
#include <cstring>

std::string sSource{ "abcdefg" };
std::cout << std::strlen(sSource.c_str());
```

COPY

Output:

```
7
```

**`const char* string::data () const`**

-   Returns the contents of the string as a const C-style string
-   A null terminator is appended. This function performs the same action as `c_str()`
-   The C-style string is owned by the std::string and should not be deleted

Sample code:

```cpp
#include <cstring>

std::string sSource{ "abcdefg" };
const char* szString{ "abcdefg" };
// memcmp compares the first n characters of two C-style strings and returns 0 if they are equal
if (std::memcmp(sSource.data(), szString, sSource.length()) == 0)
    std::cout << "The strings are equal";
else
    std::cout << "The strings are not equal";
```

COPY

Output:

The strings are equal

**`size_type string::copy(char* szBuf, size_type nLength, size_type nIndex = 0) const`**

-   Both flavors copy at most nLength characters of the string to szBuf, beginning with character nIndex
-   The number of characters copied is returned
-   No null is appended. It is up to the caller to ensure szBuf is initialized to NULL or terminate the string using the returned length
-   The caller is responsible for not overflowing szBuf

Sample code:

```cpp
std::string sSource{ "sphinx of black quartz, judge my vow" };

char szBuf[20];
int nLength{ static_cast<int>(sSource.copy(szBuf, 5, 10)) };
szBuf[nLength] = '\0';  // Make sure we terminate the string in the buffer

std::cout << szBuf << '\n';
```

COPY

Output:

```
black
```

This function should be avoided where possible as it is relatively dangerous (as it is up to the caller to provide null-termination and avoid buffer overflows).

