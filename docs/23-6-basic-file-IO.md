---
title: 23.6 - 基本文件输入输出
alias: 23.6 - 基本文件输入输出
origin: /basic-file-io/
origin_title: "23.6 — Basic file I/O"
time: 2022-9-7
type: translation
tags:
- io
- file
---

??? note "关键点速记"

	- 基本的文件IO类有三个： `ifstream` (派生自 `istream`)、 `ofstream` (派生自 `ostream`) 和 `fstream` (派生自 `iostream`)


C++中的文件I/O和普通 I/O 非常类似。基本的文件IO类有三个： `ifstream` (派生自 `istream`)、 `ofstream` (派生自 `ostream`) 和 `fstream` (派生自 `iostream`)。这些类可以分别用于文件输入、文件输出和文件输入输出。使用这些文件IO类时，需要包含 `fstream` 头文件。

和 `cout`、 `cin`、 `cerr` 以及 `clog` 这些已经连接好可以直接使用的流不同，文件流必须由程序员手动设置。不过，操作很简单：要打开一个用于读写的文件时，只需要实例化一个需要的文件IO类（将文件名作为参数）。然后使用[[extraction-operator|提取运算符]]或[[insertion-operator|插入运算符]]从文件中读取数据或向文件写入数据。完成操作后，==有几种方式可以关闭该文件：显式地调用 `close()` 函数或者让文件IO变量[[going-out-of-scope|离开作用域]]（[[destructor|析构函数]]会帮你关闭文件）。==

## 文件输出

下面的例子中使用了`ofstream`类进行文件输出。非常简单直接：

```cpp
#include <fstream>
#include <iostream>

int main()
{
    // ofstream 用于写文件
    // 创建一个名为 Sample.txt 的文件
    std::ofstream outf{ "Sample.txt" };

    // 如果无法打开输出文件流
    if (!outf)
    {
        // 打印错误并退出
        std::cerr << "Uh oh, Sample.txt could not be opened for writing!\n";
        return 1;
    }

    // 向文件写入两行文字
    outf << "This is line 1\n";
    outf << "This is line 2\n";

    return 0;

    // outf 离开作用域时，ofstream析构函数会关闭文件
}
```

此时打开项目目录，应该会看到一个名为*Sample.txt*的文件。如果用文本编辑器打开它，可以看到它确实包含了刚才写入文件的两行文本。

注意，也可以使用`put()`函数向文件写入单个字符。

## 文件输入

在这个例子中，我们会打开上一个例子中新创建的文件并读取其内容。注意，在到达文件末尾（EOF）时， `ifstream`  会返回0。我们需要基于这个特性来判断读取多少内容：

```cpp
#include <fstream>
#include <iostream>
#include <string>

int main()
{
    // ifstream 用于读取文件
    // 从 Sample.txt 读取内容
    std::ifstream inf{ "Sample.txt" };

    // 如果无法打开输入文件流
    if (!inf)
    {
        // 打印错误并退出
        std::cerr << "Uh oh, Sample.txt could not be opened for reading!\n";
        return 1;
    }

    // 如果仍然有内容可以读取
    while (inf)
    {
        // 从文件中读取字符串并打印
        std::string strInput;
        inf >> strInput;
        std::cout << strInput << '\n';
    }

    return 0;

    // 当 inf 离开作用域时，ifstream 的析构函数会负责关闭文件

}
```

输出结果：

```
This
is
line
1
This
is
line
2
```

额。。这好像并不是我们想要的结果。还记得吗？[[extraction-operator|提取运算符]]会被空格分割，所以为了读取一整行，我们需要使用 `getline()` 函数。

```cpp
#include <fstream>
#include <iostream>
#include <string>

int main()
{
    // ifstream 用于读取文件
    // 从 Sample.txt 读取内容
    std::ifstream inf{ "Sample.txt" };

    // 如果无法打开输入文件流
    if (!inf)
    {
        // 打印错误并退出
        std::cerr << "Uh oh, Sample.txt could not be opened for reading!\n";
        return 1;
    }

    // 如果仍然有内容可以读取
    while (inf)
    {
        // 从文件中读取字符串并打印
        std::string strInput;
        std::getline(inf, strInput); //使用 getline 读取一整行
        std::cout << strInput << '\n';
    }

    return 0;

    // 当 inf 离开作用域时，ifstream 的析构函数会负责关闭文件
}
```

输出结果：
```
This is line 1
This is line 2
```

## 带缓冲的输出

C++中的输出可以被缓冲。这意味着输出到文件流的任何内容都不会立即写入磁盘。这样一来就可以将几个输出操作合并处理。这样做主要是出于性能原因，当缓冲区被写入磁盘时，这被称为**刷新缓冲区**。==触发缓冲区刷新的一种方法是关闭文件——缓冲区的内容将被刷新到磁盘，然后关闭文件。==

缓冲通常不是问题，但在某些情况下，它可能会给粗心的人带来麻烦。在这种情况下，主要的罪魁祸首是缓冲区中有数据，然后程序立即终止(通过崩溃或调用`exit()`)。在这种情况下，不会执行文件流类的析构函数，这意味着文件永远不会关闭，所以缓冲区永远不会刷新。在这种情况下，缓冲区中的数据将不会被写入磁盘，并且永远丢失。这就是为什么在调用`exit()`之前显式关闭所有打开的文件总是一个好主意

缓冲区可以通过 `ostream::flush()` 函数手动刷新，或者向输出流发送 `std::flush` 也可以。这两种方法都可以用于确保缓冲区的内容立即写入磁盘，以防程序突然崩溃。

另外一点需要注意的是，`std::endl;` 会刷新输出流。因此，过度使用`std::endl`(导致不必要的缓冲区刷新)可能会在执行缓存I/O时产生性能影响，因为刷新操作开销很大(例如写入文件)。由于这个原因，注重性能的程序员通常会使用`\n` 而不是`std::endl`在输出流中插入换行符，以避免不必要的刷新缓冲区。

## 文件模式

What happens if we try to write to a file that already exists? Running the output example again shows that the original file is completely overwritten each time the program is run. What if, instead, we wanted to append some more data to the end of the file? It turns out that the file stream constructors take an optional second parameter that allows you to specify information about how the file should be opened. This parameter is called mode, and the valid flags that it accepts live in the ios class.

Ios file mode	Meaning
app	Opens the file in append mode
ate	Seeks to the end of the file before reading/writing
binary	Opens the file in binary mode (instead of text mode)
in	Opens the file in read mode (default for ifstream)
out	Opens the file in write mode (default for ofstream)
trunc	Erases the file if it already exists

It is possible to specify multiple flags by bitwise ORing them together (using the | operator). ifstream defaults to std::ios::in file mode. ofstream defaults to std::ios::out file mode. And fstream defaults to std::ios::in | std::ios::out file mode, meaning you can both read and write by default.

!!! tip "小贴士"

	Due to the way fstream was designed, it may fail if std::ios::in is used and the file being opened does not exist. If you need to create a new file using fstream, use std::ios::out mode only.

Let’s write a program that appends two more lines to the Sample.txt file we previously created:

```cpp
#include <iostream>
#include <fstream>

int main()
{
    // We'll pass the ios:app flag to tell the ofstream to append
    // rather than rewrite the file. We do not need to pass in std::ios::out
    // because ofstream defaults to std::ios::out
    std::ofstream outf{ "Sample.txt", std::ios::app };

    // If we couldn't open the output file stream for writing
    if (!outf)
    {
        // Print an error and exit
        std::cerr << "Uh oh, Sample.txt could not be opened for writing!\n";
        return 1;
    }

    outf << "This is line 3\n";
    outf << "This is line 4\n";

    return 0;

    // When outf goes out of scope, the ofstream
    // destructor will close the file
}
```

COPY

Now if we take a look at Sample.txt (using one of the above sample programs that prints its contents, or loading it in a text editor), we will see the following:

```
This is line 1
This is line 2
This is line 3
This is line 4
```

## 使用 `open()`打开文件

Just like it is possible to explicitly close a file stream using close(), it’s also possible to explicitly open a file stream using open(). open() works just like the file stream constructors -- it takes a file name and an optional file mode.

For example:

```cpp
std::ofstream outf{ "Sample.txt" };
outf << "This is line 1\n";
outf << "This is line 2\n"
outf.close(); // explicitly close the file

// Oops, we forgot something
outf.open("Sample.txt", std::ios::app);
outf << "This is line 3\n";
outf.close();
```

COPY

You can find more information about the open() function [here](https://en.cppreference.com/w/cpp/io/basic_filebuf/open).
