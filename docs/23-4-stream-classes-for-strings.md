---
title: 23.4 - 用于字符串的 stream 类
alias: 23.4 - 用于字符串的 stream 类
origin: /stream-classes-for-strings/
origin_title: "23.4 — Stream classes for strings"
time: 2022-6-27
type: translation
tags:
- io
- string
---

??? note "关键点速记"


到目前为止，你看到的所有I/O示例都是从`cout`写入或从`cin`读取的。但是，还有另一组称为字符串流类的类，它允许你使用熟悉的[[insertion-operator|插入运算符]]和[[extraction-operator|提取运算符]]来处理字符串。像`istream`和`ostream`一样，字符串流提供了一个缓冲区来保存数据。然而，与`cin`和`cout`不同的是，这些流不连接到I/O通道(如键盘、显示器等)。字符串流的主要用途之一是缓冲输出以便稍后显示，或者逐行处理输入。

字符串有六个流类: 其中`istringstream`(派生自`istream`)、`ostringstream`(派生自`ostream`)和`stringstream`(派生自`iostream`)用于读写普通字符宽度的字符串。`Wistringstream`、`wostringstream` 和 `wstringstream` 用于读写宽字符串。要使用 `stringstreams`，你需要 `#include` `sstream` 头文件。

有两个方法可以向 `stringstream` 输入数据：

1.  使用[[insertion-operator|插入运算符]]：

```cpp
std::stringstream os;
os << "en garde!\n"; // insert "en garde!" into the stringstream
```

COPY

2.  Use the str(string) function to set the value of the buffer:

```cpp
std::stringstream os;
os.str("en garde!"); // set the stringstream buffer to "en garde!"
```

COPY

There are similarly two ways to get data out of a stringstream:

1.  Use the str() function to retrieve the results of the buffer:

```cpp
std::stringstream os;
os << "12345 67.89\n";
std::cout << os.str();
```

COPY

This prints:

12345 67.89

2.  Use the extraction (>>) operator:

```cpp
std::stringstream os;
os << "12345 67.89"; // insert a string of numbers into the stream

std::string strValue;
os >> strValue;

std::string strValue2;
os >> strValue2;

// print the numbers separated by a dash
std::cout << strValue << " - " << strValue2 << '\n';
```

COPY

This program prints:

12345 - 67.89

Note that the >> operator iterates through the string -- each successive use of >> returns the next extractable value in the stream. On the other hand, str() returns the whole value of the stream, even if the >> has already been used on the stream.

**Conversion between strings and numbers**

Because the insertion and extraction operators know how to work with all of the basic data types, we can use them in order to convert strings to numbers or vice versa.

First, let’s take a look at converting numbers into a string:

```cpp
std::stringstream os;

int nValue{ 12345 };
double dValue{ 67.89 };
os << nValue << ' ' << dValue;

std::string strValue1, strValue2;
os >> strValue1 >> strValue2;

std::cout << strValue1 << ' ' << strValue2 << '\n';
```

COPY

This snippet prints:

12345 67.89

Now let’s convert a numerical string to a number:

```cpp
std::stringstream os;
os << "12345 67.89"; // insert a string of numbers into the stream
int nValue;
double dValue;

os >> nValue >> dValue;

std::cout << nValue << ' ' << dValue << '\n';
```

COPY

This program prints:

12345 67.89

**Clearing a stringstream for reuse**

There are several ways to empty a stringstream’s buffer.

1.  Set it to the empty string using str() with a blank C-style string:

```cpp
std::stringstream os;
os << "Hello ";

os.str(""); // erase the buffer

os << "World!";
std::cout << os.str();
```

COPY

2.  Set it to the empty string using str() with a blank std::string object:

```cpp
std::stringstream os;
os << "Hello ";

os.str(std::string{}); // erase the buffer

os << "World!";
std::cout << os.str();
```

COPY

Both of these programs produce the following result:

World!

When clearing out a stringstream, it is also generally a good idea to call the clear() function:

```cpp
std::stringstream os;
os << "Hello ";

os.str(""); // erase the buffer
os.clear(); // reset error flags

os << "World!";
std::cout << os.str();
```

COPY

clear() resets any error flags that may have been set and returns the stream back to the ok state. We will talk more about the stream state and error flags in the next lesson.

[

](https://www.learncpp.com/cpp-tutorial/stream-states-and-input-validation/)