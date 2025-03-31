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

```bash
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

```bash
cdef
```

**`string& string::assign (const char* chars, size_type len)`**

-   将C风格字符串数组中的 `len` 个字符赋值给字符串；
-   如果要拷贝的长度超过最大字符个数，则抛出`length_error`异常；
-   返回 `*this` 以便可以被链式调用。

例子：

```cpp
std::string sDest;

sDest.assign("abcdefg", 4);
std::cout << sDest << '\n';
```

输出：

```bash
abcd
```

这个函数存在潜在风险，不建议使用。

**`string& string::assign (size_type len, char c)`**

-   将字符c重复 `len` 次赋值给字符串；
-   如果结果超过最大字符个数，则抛出 `length_error` 异常；
-   返回 `*this` 以便可以被链式调用。

例子：

```cpp
std::string sDest;

sDest.assign(4, 'g');
std::cout << sDest << '\n';
```

输出：

```bash
gggg
```

## 交换字符串

如果你有两个字符串并希望交换它们的值，那么可以使用两个名为`swap()`的函数。

**`void string::swap (string& str)`**  
**`void swap (string& str1, string& str2)`**

- 两个函数都可以交换两个字符串的值。成员函数会交换 `*this` 和 `str`，全局函数则交换 `str1` 和 `str2`；
- 这些函数是高效的，应该用来代替赋值来执行字符串交换。

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

```bash
red blue
blue red
red blue
```