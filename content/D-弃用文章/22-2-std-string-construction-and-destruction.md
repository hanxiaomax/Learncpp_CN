---
title: 22.2 - std-string 的构造和析构
alias: 22.2 - std-string 的构造和析构
origin: /stdstring-construction-and-destruction/
origin_title: "22.2 — std::string construction and destruction"
time: 2022-9-16
type: translation
tags:
- string
---




在这一课中，我们将看看如何构造`std::string`的对象，以及如何从数字创建字符串，反之亦然。

## 字符串构造

字符串类有许多可以用来创建字符串的构造函数。我们将在这里逐一了解它们。

注意：`string::size_type`解析为`size_t`，它与`sizeof`操作符返回的无符号整型相同。`size_t`的实际大小取决于环境。在本教程中，将其看做无符号整型。


**`string::string()`**

- 字符串类的默认构造函数——创建一个空字符串。

例子：

```cpp
std::string sSource;
std::cout << sSource;
```

输出：

```bash
```

**`string::string(const string& strString)`**

-   拷贝构造函数。该构造函数基于一个字符串`strString`来创建一个新的字符串。

例子：

```cpp
std::string sSource{ "my string" };
std::string sOutput{ sSource };
std::cout << sOutput;
```

输出：

```bash
my string
```


**`string::string(const string& strString, size_type unIndex)`**  
**`string::string(const string& strString, size_type unIndex, size_type unLength)`**

-  该构造函数基于`strString`字符串中最多`unLength`个字符（从`unIndex` 开始）构造新的字符串。如果遇到结束符，则停止拷贝，即使还没有到 `unLength` 个字符；
-  如果没有 `unLength` 个字符，则会从 `unIndex` 开始拷贝全部字符；
-  如果 `unIndex`比字符串的长度还长，则或抛出 `out_of_range` 异常。

例子：

```cpp
std::string sSource{ "my string" };
std::string sOutput{ sSource, 3 };
std::cout << sOutput<< '\n';
std::string sOutput2(sSource, 3, 4);
std::cout << sOutput2 << '\n';
```

输出：

```
string
stri
```

**`string::string(const char* szCString)`**

-   该构造函数会基于一个C语言风格字符串 `szCString` 构造一个新的字符串，但是不会包含结束符；
-   如果结果会超过字符串的最大长度，则会抛出 `length_error` 异常；
-   **警告⚠️**：`szCString` 不能是 NULL。

例子：

```cpp
const char* szSource{ "my string" };
std::string sOutput{ szSource };
std::cout << sOutput << '\n';
```

输出：

```
my string
```

**`string::string(const char* szCString, size_type unLength)`**

-   This constructor creates a new string from the first unLength chars from the C-style string szCString.
-   If the resulting size exceeds the maximum string length, the length_error exception will be thrown.
-   **Warning:** For this function only, NULLs are not treated as end-of-string characters in szCString! This means it is possible to read off the end of your string if unLength is too big. Be careful not to overflow your string buffer!

例子：

```cpp
const char* szSource{ "my string" };
std::string sOutput(szSource, 4);
std::cout << sOutput << '\n';
```

输出：

```bash
my s
```

**string::string(size_type nNum, char chChar)**

-   该构造函数基于某个字符，将其重复 `chChar` 次创建出新的字符串；
-   如果结果的长度超过字符串的长度，则抛出 `length_error` 异常。

例子：

```cpp
std::string sOutput(4, 'Q');
std::cout << sOutput << '\n';
```

输出：

```bash
QQQQ
```

**`template string::string(InputIterator itBeg, InputIterator itEnd)`**

-   该构造函数基于一个范围`[itBeg, itEnd)`的字符串创建一个新的字符串；
-   如果结果的长度超过字符串的长度，则抛出 `length_error` 异常。

没有示例代码。它太晦涩了，你可能永远不会用它。



## 字符串析构

**`string::~string()`**

-   析构函数，用于销毁字符串并释放内存

没有示例代码。你不会显示地调用它。

## 从数字构建字符串

`std::string` 类遗漏了一个非常重要的功能，即从数字创建字符串，例如：

```cpp
std::string sFour{ 4 };
```

输出结果：

```bash
c:vcprojectstest2test2test.cpp(10) : error C2664: 'std::basic_string<_Elem,_Traits,_Ax>::basic_string(std::basic_string<_Elem,_Traits,_Ax>::_Has_debug_it)' : cannot convert parameter 1 from 'int' to 'std::basic_string<_Elem,_Traits,_Ax>::_Has_debug_it'
```

还记得我说过字符串类会产生可怕的报错信息吗？就是像上面这样。这里的有用的信息是：

```bash
cannot convert parameter 1 from 'int' to 'std::basic_string
```

换句话说，它试图将int转换为字符串，但失败了。

将数字转换为字符串最简单的方法是使用`std::ostringstream` 类。`std::ostringstream` 可以接受来自各种来源的输入，包括字符、数字、字符串等…它还能够输出字符串(通过[[extraction-operator|提取运算符]]，或通过`str()` 函数)。有关 `std::ostringstream` 的更多信息，参考 [[28-4-stream-classes-for-strings|28.4 - 用于字符串的 stream 类]]。

==从不同类型的输入创建字符串的例子如下：==

```cpp
#include <iostream>
#include <sstream>
#include <string>

template <typename T>
inline std::string ToString(T tX)
{
    std::ostringstream oStream;
    oStream << tX;
    return oStream.str();
}
```

下面是一些测试它的示例代码：

```cpp
int main()
{
    std::string sFour{ ToString(4) };
    std::string sSixPointSeven{ ToString(6.7) };
    std::string sA{ ToString('A') };
    std::cout << sFour << '\n';
    std::cout << sSixPointSeven << '\n';
    std::cout << sA << '\n';
}
```

输出结果：

```bash
4
6.7
A
```

注意，这里我们忽略了错误检查。将`tX`插入`oStream`中可能会失败，如果转换失败则应该抛出一个异常。

> [!info] "相关内容"
> 标准库还包含一个名为 `std::to_string()` 的函数，可用于将字符和数字转换为 `std::string`。虽然这是基本场合中更简单的解决方案，但`std::to_string`的输出可能与上面`std::cout`或`out ToString()`函数的输出不同。其中一些差异被记录[这里](https://en.cppreference.com/w/cpp/string/basic_string/to_string)。


## 从字符串创建数字

和上面的解决方案类似：

```cpp
#include <iostream>
#include <sstream>
#include <string>

template <typename T>
inline bool FromString(const std::string& sString, T& tX)
{
    std::istringstream iStream(sString);
    return !(iStream >> tX).fail(); // 将值提取到 tX 并返回是否成功
}
```

下面是一些测试它的示例代码：

```cpp
int main()
{
    double dX;
    if (FromString("3.4", dX))
        std::cout << dX << '\n';
    if (FromString("ABC", dX))
        std::cout << dX << '\n';
}
```

输出结果：

```bash
3.4
```

注意，第二次转换失败并返回了 `false`。