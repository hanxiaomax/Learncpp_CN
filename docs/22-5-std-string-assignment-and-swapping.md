---
title: 22.5 - std-string 赋值和交换
alias: 22.5 - std-string 赋值和交换
origin: /stdstring-assignment-and-swapping/
origin_title: "22.5 — std::string assignment and swapping"
time: 2022-7-23
type: translation
tags:
- string
---

??? note "关键点速记"


## String 赋值

为字符串赋值的最简单的方法是使用[[14-15-overloading-the-assignment-operator|重载赋值运算符]] ，此外，`assign()`函数也提供了类似的功能。

**`string& string::operator= (const string& str)`**  
**`string& string::assign (const string& str)`**  
**`string& string::operator= (const char* str)`**  
**`string& string::assign (const char* str)`**  
**`string& string::operator= (char c)`**  

-   这些函数都对字符串进行赋值；
-   函数返回 `*this`，所以可以进行链式调用；
-   注意，`assign()` 函数的各个版本都不能接收一个单独字符作为参数。

例子：

```cpp
std::string sString;

// Assign a string value
sString = std::string("One");
std::cout << sString << '\n';

const std::string sTwo("Two");
sString.assign(sTwo);
std::cout << sString << '\n';

// Assign a C-style string
sString = "Three";
std::cout << sString << '\n';

sString.assign("Four");
std::cout << sString << '\n';

// Assign a char
sString = '5';
std::cout << sString << '\n';

// Chain assignment
std::string sOther;
sString = sOther = "Six";
std::cout << sString << ' ' << sOther << '\n';
```

输出：

```
One
Two
Three
Four
5
Six Six
```

`assign()` 成员函数还有一些其他的版本：

**`string& string::assign (const string& str, size_type index, size_type len)`**

- 将一个字符串的子串赋值给另一个字符串，从 `index` 开始，长度为 `len`
- 如果索引`index`越界，则抛出 `out_of_range` 异常；
- 返回 `*this` 以便可以被链式调用。

例子：

```cpp
const std::string sSource("abcdefg");
std::string sDest;

sDest.assign(sSource, 2, 4); // assign a substring of source from index 2 of length 4
std::cout << sDest << '\n';
```

输出：

```
cdef
```

**`string& string::assign (const char* chars, size_type len)`**

-   Assigns len characters from the C-style array chars
-   Throws an length_error exception if the result exceeds the maximum number of characters
-   Returns *this so it can be “chained”.

例子：

```cpp
std::string sDest;

sDest.assign("abcdefg", 4);
std::cout << sDest << '\n';
```

输出：

```
abcd
```

This function is potentially dangerous and its use is not recommended.

**`string& string::assign (size_type len, char c)`**

-   Assigns len occurrences of the character c
-   Throws a length_error exception if the result exceeds the maximum number of characters
-   Returns *this so it can be “chained”.

例子：

```cpp
std::string sDest;

sDest.assign(4, 'g');
std::cout << sDest << '\n';
```

输出：

```
gggg
```

## Swapping**

If you have two strings and want to swap their values, there are two functions both named swap() that you can use.

**`void string::swap (string& str)`**  
**`void swap (string& str1, string& str2)`**

-   Both functions swap the value of the two strings. The member function swaps *this and str, the global function swaps str1 and str2.
-   These functions are efficient and should be used instead of assignments to perform a string swap.

例子：

```cpp
std::string sStr1("red");
std::string sStr2("blue");

std::cout << sStr1 << ' ' << sStr2 << '\n';
swap(sStr1, sStr2);
std::cout << sStr1 << ' ' << sStr2 << '\n';
sStr1.swap(sStr2);
std::cout << sStr1 << ' ' << sStr2 << '\n';
```

输出：

```
red blue
blue red
red blue
```