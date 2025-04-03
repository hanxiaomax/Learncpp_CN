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




## 访问字符

访问字符也有两个极其类似的方法。最简单也是最块的方法是使用[[21-9-overloading-the-subscript-operator|重载下标运算符]]：

**`char& string::operator[] (size_type nIndex)`**  
**`const char& string::operator[] (size_type nIndex) const`**

-   函数返回位于索引 `nIndex` 处的字符；
-   传入非法索引会导致[[undefined-behavior|未定义行为]]；
-   因为返回类型是 `char&` 所以你可以使用它修改数组中的元素。

例子：

```cpp
std::string sSource{ "abcdefg" };
std::cout << sSource[5] << '\n';
sSource[5] = 'X';
std::cout << sSource << '\n';
```

输出：

```bash
f
abcdeXg
```

此外，还有一个非操作符的版本。该版本的函数速度会慢一些，因为它==会检查数组下标是否合法==。如果你不确定索引 `nIndex` 是否一定有效，则最好使用这个方法来访问：

**`char& string::at (size_type nIndex)`**  
**`const char& string::at (size_type nIndex) const`**

-  函数返回位于索引 `nIndex` 处的字符；
-  传入非法索引会导致 `out_of_range` 异常；
-  因为返回类型是 `char&` 所以你可以使用它修改数组中的元素。


例子：

```cpp
std::string sSource{ "abcdefg" };
std::cout << sSource.at(5) << '\n';
sSource.at(5) = 'X';
std::cout << sSource << '\n';
```

输出

```bash
f
abcdeXg
```

## 转换为C风格数组

很多函数（包括所有C语言函数）期望的输入是C语言风格字符串而不是`std::string`。因此，`std::string`提供了三种将`std::string`转换为C语言字符串的方法：

**`const char* string::c_str () const`**

- 将字符串内容作为C风格字符串常量返回；
- 结尾会添加结束符；
- 该C风格字符串归 `std::string` 所有且不应该被手动释放。

例子：

```cpp
#include <cstring>

std::string sSource{ "abcdefg" };
std::cout << std::strlen(sSource.c_str());
```

输出：

```bash
7
```

**`const char* string::data () const`**

-  将字符串内容作为C风格字符串常量返回；
-  结尾会添加结束符；该函数行为与 `c_str()` 是一样的；
-  该C风格字符串归 `std::string` 所有且不应该被手动释放。

例子：

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

输出：

```
The strings are equal
```

**`size_type string::copy(char* szBuf, size_type nLength, size_type nIndex = 0) const`**

-   从字符串中拷贝至多 `nLength` 个字符到 `szBuf`，从索引`nIndex`开始；
-   返回成功拷贝的字符的个数；
-   ==并不会添加结束符==。条用在必须保证 `szBuf` 被初始化为空或基于返回的长度为字符串添加结束符；
-   调用者需要确保 `szBuf` 不溢出。

例子：

```cpp
std::string sSource{ "sphinx of black quartz, judge my vow" };

char szBuf[20];
int nLength{ static_cast<int>(sSource.copy(szBuf, 5, 10)) };
szBuf[nLength] = '\0';  // Make sure we terminate the string in the buffer

std::cout << szBuf << '\n';
```

输出：

```bash
black
```

==这个函数应该尽可能避免，因为其相对比较危险的(因为需要由调用者提供结束符并避免缓冲区溢出)。==

