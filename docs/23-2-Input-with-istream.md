---
title: 23.2 - 使用istream处理输入
alias: 23.2 - 使用istream处理输入
origin: /input-with-istream/
origin_title: "23.2 — Input with istream"
time: 2022-9-6
type: translation
tags:
- io
---

??? note "关键点速记"
	- [[extraction-operator|提取运算符]]会忽略空白符
	- `std::get()`可以获取字符或获取字符串（指定最大字符个数），但是它不读取换行符
	- `getline()`，它的工作方式和`get()`完全一致但是会读取换行符！

`iostream` 库是很复杂的——所以本教程不可能涵盖它的方方面面。不过，我们会向你介绍其中最常用的那些功能。在本节中，我们会讨论输入库`istream`的各项功能。

## 提取运算符 >>

在之前的很多课程中，我们已经在使用[[extraction-operator|提取运算符]]从输入流中获取数据了。C++为所有的内建数据类型提供了预定义的提取运算符，同时我们可以通过[[14-4-overloading-the-IO-operators|重载输入输出运算符]]为我们自己的类提供提取运算符。

读取字符串时，提取操作符的一个常见问题是如何防止输入溢出缓冲区。举个例子:

```cpp
char buf[10];
std::cin >> buf;
```

如果用户输入18个字符会发生什么？此时缓冲区会溢出并发生不好的事情。一般来说，我们不应该假设用户会输入多少字符。

处理这个问题的一种方法是使用manipulators。manipulator是一个对象，用于在应用提取(>>)或插入(setw(位于`iomanip`头文件)时修改流，可以用于限制从流中读入的字符数量。要使用`setw()`，只需提供要读取的最大字符数作为参数，并像这样将其插入到输入语句中:

```cpp
#include <iomanip>
char buf[10];
std::cin >> std::setw(10) >> buf;
```


这个程序只会从流中读取9个字符（为结束符预留一个字符）。任何其他的字符都会被留在流中等待下一次提取。

## 提取操作和空白字符

需要注意的是，提取操作符会跳过空白字符（空格、tab和空行）。

考虑下面程序：

```cpp
int main()
{
    char ch;
    while (std::cin >> ch)
        std::cout << ch;

    return 0;
}
```

用户输入：

```
Hello my name is Alex
```

由于[[extraction-operator|提取运算符]]会跳过空格和换行，所以读取的结果是：

```
HellomynameisAlex
```

通常情况下，你希望获得用户输入并保留空格。为此，istream类提供了许多可用于此目的的函数。

其中最有用的是 `get()` 函数，它只是从输入流中获取一个字符。下面是上面使用`get()`的相同程序:

```cpp
int main()
{
    char ch;
    while (std::cin.get(ch))
        std::cout << ch;

    return 0;
}
```

用户输入：

```
Hello my name is Alex
```

输出为：

```
Hello my name is Alex
```

`std::get()` 还有一个字符串版本，它接受一个参数作为读取字符个数的最大值：

```cpp
int main()
{
    char strBuf[11];
    std::cin.get(strBuf, 11);
    std::cout << strBuf << '\n';

    return 0;
}
```

如果输入为：

```
Hello my name is Alex
```

则输出为：

```
Hello my n
```

注意，我们只读取了前10个字符(必须为终止符留下一个字符)。其余的字符留在输入流中。

关于`get()`需要注意的一件重要事情是，它不读取换行符！这可能会导致一些意想不到的结果:

```cpp
int main()
{
    char strBuf[11];
    // Read up to 10 characters
    std::cin.get(strBuf, 11);
    std::cout << strBuf << '\n';

    // Read up to 10 more characters
    std::cin.get(strBuf, 11);
    std::cout << strBuf << '\n';
    return 0;
}
```

如果输入为：

```
Hello!
```

则程序输出为：

```
Hello!
```

然后程序就结束了！==为什么它不要我再输入10个字符？这是因为第一个 `get()` 读取到换行然后就结束了。而第二个`get()` 则会继续读取 `cin` 流，此时最后一个字符是换行，所以它会立即停止。==

因此， C++提供了 `getline()`，它的工作方式和`get()`完全一致但是会读取换行符！

```cpp
int main()
{
    char strBuf[11];
    // Read up to 10 characters
    std::cin.getline(strBuf, 11);
    std::cout << strBuf << '\n';

    // Read up to 10 more characters
    std::cin.getline(strBuf, 11);
    std::cout << strBuf << '\n';
    return 0;
}
```

COPY

This code will perform as you expect, even if the user enters a string with a newline in it.

If you need to know how many character were extracted by the last call of `getline()`, use `gcount()`:

```cpp
int main()
{
    char strBuf[100];
    std::cin.getline(strBuf, 100);
    std::cout << strBuf << '\n';
    std::cout << std::cin.gcount() << " characters were read" << '\n';

    return 0;
}
```

COPY

## A special version of getline() for std::string**

There is a special version of getline() that lives outside the istream class that is used for reading in variables of type std::string. This special version is not a member of either ostream or istream, and is included in the string header. Here is an example of its use:

```cpp
#include <string>
#include <iostream>

int main()
{
    std::string strBuf;
    std::getline(std::cin, strBuf);
    std::cout << strBuf << '\n';

    return 0;
}
```

COPY

## A few more useful istream functions**

There are a few more useful input functions that you might want to make use of:

`ignore()` discards the first character in the stream.  
`ignore(int nCount)` discards the first nCount characters.  
`peek()` allows you to read a character from the stream without removing it from the stream.  
`unget()` returns the last character read back into the stream so it can be read again by the next call.  
`putback(char ch)` allows you to put a character of your choice back into the stream to be read by the next call.

`istream` contains many other functions and variants of the above mentioned functions that may be useful, depending on what you need to do. However, those topics are really more suited for a tutorial or book focusing on the standard library (such as the excellent [“The C++ Standard Library”](https://www.amazon.com/Standard-Library-Tutorial-Reference-2nd/dp/0321623215) by Nicolai M. Josuttis).