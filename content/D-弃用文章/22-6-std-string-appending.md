---
title: 22.6 - std-string 追加
alias: 22.6 - std-string 追加
origin: /stdstring-appending/
origin_title: "22.6 — std::string appending"
time: 2022-8-24
type: translation
tags:
- string
---


## 追加字符串

在一个字符串的末尾追加字符串，可以使用 `operator+=` 或 `append()` 或 `push_back()`。

**`string& string::operator+= (const string& str)`**  
**`string& string::append (const string& str)`**  

-   这些函数都可以将`str`追加到字符串的末尾；
-   这些函数都返回 `*this` 以便可以被链式调用；
-   如果结果超过最大字符个数则抛出 `length_error` 异常。

Sample code:

```cpp
std::string sString{"one"};

sString += std::string{" two"};

std::string sThree{" three"};
sString.append(sThree);

std::cout << sString << '\n';
```


Output:

```bash
one two three
```

`append()`函数也有几种，可以用于添加一个子串：

**`string& string::append (const string& str, size_type index, size_type num)`**

-   该函数将`str`中从索引`index`开始的`num`个字符串追加到字符串末尾；
-   这些函数都返回 `*this` 以便可以被链式调用；
-   如果索引越界，则抛出`out_of_range`；
-   如果结果超过最大字符个数则抛出 `length_error` 异常。

例子：

```cpp
std::string sString{"one "};

const std::string sTemp{"twothreefour"};
sString.append(sTemp, 3, 5); // append substring of sTemp starting at index 3 of length 5
std::cout << sString << '\n';
```

输出：

```bash
one three
```

`Operator+=` 和 `append()` 也提供了配合C语言风格字符串工作的版本：

**`string& string::operator+= (const char* str)`**  
**`string& string::append (const char* str)`**  

-   这些函数都可以将`str`追加到字符串的末尾；
-   这些函数都返回 `*this` 以便可以被链式调用；
-   如果结果超过最大字符个数则抛出 `length_error` 异常；
-   `str` 不能是 NULL。

例子：

```cpp
std::string sString{"one"};

sString += " two";
sString.append(" three");
std::cout << sString << '\n';
```

输出：

```bash
one two three
```

`append()` 还有另外一个配合C语言字符串工作的版本：

**`string& string::append (const char* str, size_type len)`**  

-  将`str`的前`len`个字符追加到字符串；
-  这些函数都返回 `*this` 以便可以被链式调用；
-  如果结果超过最大字符个数则抛出 `length_error` 异常；
-  会忽略特殊字符(包括`”`)。

例子：

```cpp
std::string sString{"one "};

sString.append("threefour", 5);
std::cout << sString << '\n';
```

输出：

```bash
one three
```

该函数不安全，不推荐使用。

还有另外一些可以追加**字符**的函数，注意，函数名是 `push_back()` 而不是 `append()`！

**`string& string::operator+= (char c)`**  
**`void string::push_back (char c)`**  

-   这两个函数都可以将字符c追加到字符串；
-   `operator +=` 返回 `*this` 以便可以被链式调用；
-   如果结果超过最大字符个数则抛出 `length_error` 异常；

例子：

```cpp
std::string sString{"one"};

sString += ' ';
sString.push_back('2');
std::cout << sString << '\n';
```

输出：

```bash
one 2
```

如果你好奇为什么这个函数的名字是 `push_back()` 而不是 `append()`。这里是遵循了[[stack|栈]]操作的命名习惯，`push_back()` 用于将一个单个内容添加到栈顶。如果我们将字符串看做是一个字符组成的栈，则使用 `push_back()` 将一个字符添加到栈顶是很符合直觉的。但是，没有提供 `append()` 函数在我看来在一致性方面是一种缺失！

`append()` 函数有一个版本可以添加多个字符串：

**`string& string::append (size_type num, char c)`**  

-  将字符c重复`num`次追加到字符串中；
-  返回 `*this` 以便可以被链式调用；
-  如果结果超过最大字符个数则抛出 `length_error` 异常；

例子：

```cpp
std::string sString{"aaa"};

sString.append(4, 'b');
std::cout << sString << '\n';
```

输出：

```bash
aaabbbb
```

最后一种版本的 `append()` 可以配合[[iterator|迭代器]]工作：

**`string& string::append (InputIterator start, InputIterator end)`**  

-   将 `[start, end)` 范围内的字符追加到字符串 (左闭右开区间)；
-   返回 `*this` 以便可以被链式调用；
-   如果结果超过最大字符个数则抛出 `length_error` 异常；