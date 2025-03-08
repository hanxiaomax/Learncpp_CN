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

> [!note] "Key Takeaway"
> - 使用[[extraction-operator|提取运算符]]从流中提取“数字格式”的字符串到数值类型，即可完成字符串到数值的转换


到目前为止，你看到的所有I/O示例都是从`cout`写入或从`cin`读取的。但是，还有另一组称为字符串流类的类，它允许你使用熟悉的[[insertion-operator|插入运算符]]和[[extraction-operator|提取运算符]]来处理字符串。像`istream`和`ostream`一样，字符串流提供了一个缓冲区来保存数据。然而，与`cin`和`cout`不同的是，这些流不连接到I/O通道(如键盘、显示器等)。字符串流的主要用途之一是缓冲输出以便稍后显示，或者逐行处理输入。

字符串有六个流类: 其中`istringstream`(派生自`istream`)、`ostringstream`(派生自`ostream`)和`stringstream`(派生自`iostream`)用于读写普通字符宽度的字符串。`Wistringstream`、`wostringstream` 和 `wstringstream` 用于读写宽字符串。要使用 `stringstreams`，你需要 `#include` `sstream` 头文件。

有两个方法可以向 `stringstream` 输入数据：

1.  使用[[insertion-operator|插入运算符]]：

```cpp
std::stringstream os;
os << "en garde!\n"; // insert "en garde!" into the stringstream
```

2.  使用 `str(string)` 函数设置字符串到缓冲：

```cpp
std::stringstream os;
os.str("en garde!"); // set the stringstream buffer to "en garde!"
```

类似的，从 `stringstream` 读取也有两个方法：

1.  使用 `str()` 函数获取缓冲中的内容：

```cpp
std::stringstream os;
os << "12345 67.89\n";
std::cout << os.str();
```

打印：

```
12345 67.89
```

2.  使用[[extraction-operator|提取运算符]]：

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

程序打印：

```
12345 - 67.89
```

注意，提取运算符会遍历字符串，每个>>会返回流中下一个可以提取的字符串。另一方面，`str()` 可以返回整个流中的数据，即使我们已经使用 >> 从中进行了提取。

## 转换字符串和数字

因为插入和提取操作符知道如何处理所有基本数据类型，所以我们可以使用它们将字符串转换为数字，反之亦然。

首先，让我们看看如何将数字转换为字符串:

```cpp
std::stringstream os;

int nValue{ 12345 };
double dValue{ 67.89 };
os << nValue << ' ' << dValue;

std::string strValue1, strValue2;
os >> strValue1 >> strValue2;

std::cout << strValue1 << ' ' << strValue2 << '\n';
```

输出结果：

```
12345 67.89
```

现在，将字符串转换为数字：

```cpp
std::stringstream os;
os << "12345 67.89"; // insert a string of numbers into the stream
int nValue;
double dValue;

os >> nValue >> dValue;

std::cout << nValue << ' ' << dValue << '\n';
```

输出结果：

```
12345 67.89
```

## 清理 `stringstream` 为再次使用做准备

清空 `stringstream` 缓冲的方法有很多：

1.  使用 `str()` 设置一个C语言风格的空字符串：

```cpp
std::stringstream os;
os << "Hello ";

os.str(""); // erase the buffer

os << "World!";
std::cout << os.str();
```

2. 使用 `str()` 和空的 `std::string` 对象将其设置为空:

```cpp
std::stringstream os;
os << "Hello ";

os.str(std::string{}); // 清空

os << "World!";
std::cout << os.str();
```

两个程序的输出结果是相同的：

```
World!
```

清理`stringstream`时，应该同时调用 `clear()` 函数：

```cpp
std::stringstream os;
os << "Hello ";

os.str(""); // 清空 buffer
os.clear(); // 重置错误标记

os << "World!";
std::cout << os.str();
```

`clear()`重置可能已设置的任何错误标志，并将流返回到ok状态。我们将在下一课中更多地讨论流状态和错误标志。
