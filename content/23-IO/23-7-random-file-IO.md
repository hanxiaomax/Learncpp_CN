---
title: 23.7 - 随机文件输入输出
alias: 23.7 - 随机文件输入输出
origin: /random-file-io/
origin_title: "23.7 — Random file I/O"
time: 2022-9-11
type: translation
tags:
- io
---


## 文件指针

每个文件流类都包含一个文件指针，用于跟踪文件内的当前读/写位置。当对文件进行读写操作时，读/写操作发生在文件指针的当前位置。默认情况下，当打开一个文件进行读写时，文件指针被设置为文件的开头。但是，如果以追加模式打开文件，则文件指针将移动到文件的末尾，因此写入操作不会覆盖文件的任何当前内容。

## 使用 `seekg()` 和 `seekp()` 进行随机文件访问

到目前为止，我们所完成的文件访问都是顺序的——即按顺序读取或写入了文件内容。但是，其实也可以进行随机文件访问——即跳到文件中的某个位置再读取其内容。当你希望从包含大量记录的文件中检索特定的记录时，这是很有用的。因为你可以直接跳到想要检索的记录，而不必读取所有的记录并从中找到你想要的记录。

通过使用`seekg()`函数(用于输入)和`seekp()`函数(用于输出)操作文件指针可以实现文件随机访问。如果你想知道，`g` 代表"get" ，`p` 代表"put"。对于某些类型的流，`seekg()`(改变读位置)和`seekp()`(改变写位置)独立操作——然而，对于文件流，读和写位置总是相同的，因此`seekg`和`seekp`可以互换使用。

`seekg()` 和 `seekp()` 函数有两个[[parameters|形参]]。第一个形参是文件指针需要编译的字节数，第二个参数则是 `ios` 标记，用于指定从哪里偏移（偏移基准点）。

|ios 搜索标记	|含义|
|:---|:---|
|`beg`	|相对于文件开头进行偏移 (默认)
|`cur`	|相对于当前位置进行偏移
|`end`	|相对于文件结尾进行偏移

正偏移量意味着将文件指针向文件的末尾移动，而负偏移量意味着将文件指针向文件开头移动。

下面是一些例子：

```cpp
inf.seekg(14, std::ios::cur); // 向前移动14字节
inf.seekg(-18, std::ios::cur); // 向后移动18字节
inf.seekg(22, std::ios::beg); // 移动到文件的第22字节
inf.seekg(24); // 移动到文件的第22字节
inf.seekg(-28, std::ios::end); // 移动到文件结束前的第28字节
```

移动到文件的开头或结尾很容易：

```cpp
inf.seekg(0, std::ios::beg); // 移动到文件的开头
inf.seekg(0, std::ios::end); // 移动到文件的结尾
```

使用`seekg()`和上一课中的创建的输入文件做一个例子。输入文件的内容如下：

```
This is line 1
This is line 2
This is line 3
This is line 4
```

例子：

```cpp
#include <fstream>
#include <iostream>
#include <string>

int main()
{
    std::ifstream inf{ "Sample.txt" };

    // If we couldn't open the input file stream for reading
    if (!inf)
    {
        // Print an error and exit
        std::cerr << "Uh oh, Sample.txt could not be opened for reading!\n";
        return 1;
    }

    std::string strData;

    inf.seekg(5); // move to 5th character
    // Get the rest of the line and print it, moving to line 2
    std::getline(inf, strData);
    std::cout << strData << '\n';

    inf.seekg(8, std::ios::cur); // move 8 more bytes into file
    // Get rest of the line and print it
    std::getline(inf, strData);
    std::cout << strData << '\n';

    inf.seekg(-14, std::ios::end); // move 14 bytes before end of file
    // Get rest of the line and print it
    std::getline(inf, strData);
    std::cout << strData << '\n';

    return 0;
}
```

输出结果如下：
```
is line 1
line 2
This is line 4
```

注意：当与文本文件一起使用时，一些编译器对`seekg()`和`seekp()`的实现有bug(由于缓冲的关系)。如果你的编译器是其中之一(如果你的输出结果和上面不同，则说明有此类问题)，此时你你可以尝试以二进制模式打开文件:

```cpp
std::ifstream inf("Sample.txt", std::ifstream::binary);
```

另外两个有用的函数是`tellg()`和`tellp()`，它们返回文件指针的绝对位置。这可以用来确定文件的大小:

```cpp
std::ifstream inf("Sample.txt");
inf.seekg(0, std::ios::end); // move to end of file
std::cout << inf.tellg();
```

打印结果：

```
64
```

这就是*Sample.txt*的字节长度(假设在最后一行之后有一个回车)。

## 使用`fstream`同时进行文件的读写

`fstream` 类可以同时读写文件！这里需要注意的是，它不能在读取和写入之间随意切换。一旦进行了读或写操作，在两者之间切换的唯一方法是执行修改文件指针位置的操作(例如`seek`)。如果你不想移动文件指针(因为它已经在需要的位置了)，你可以将指针调整到当前位置：

```cpp
// assume iofile is an object of type fstream
iofile.seekg(iofile.tellg(), std::ios::beg); // 指针移动到当前位置
```

如果你不这样做，任何奇怪的事情都可能发生。

(注意：尽管看起来 `iofile.seekg(0, std::ios::cur)` 也能起到相似的作用。但是实际上有些编译器会将其优化掉)。

还有一点需要注意的是，和 `ifstream`不同，`fstream`不能通过 `while (inf)` 来判断是否达到文件末尾。

接下来使用`fstream` 演示一下文件输入输出。下面程序会打开一个文件，读取其内容，然后将其中所有的元音字母替换为‘`#`’。

```cpp
#include <fstream>
#include <iostream>
#include <string>

int main()
{
    // Note we have to specify both in and out because we're using fstream
    std::fstream iofile{ "Sample.txt", std::ios::in | std::ios::out };

    // If we couldn't open iofile, print an error
    if (!iofile)
    {
        // Print an error and exit
        std::cerr << "Uh oh, Sample.txt could not be opened!\n";
        return 1;
    }

    char chChar{}; // we're going to do this character by character

    // While there's still data to process
    while (iofile.get(chChar))
    {
        switch (chChar)
        {
            // If we find a vowel
            case 'a':
            case 'e':
            case 'i':
            case 'o':
            case 'u':
            case 'A':
            case 'E':
            case 'I':
            case 'O':
            case 'U':

                // Back up one character
                iofile.seekg(-1, std::ios::cur);

                // Because we did a seek, we can now safely do a write, so
                // let's write a # over the vowel
                iofile << '#';

                // Now we want to go back to read mode so the next call
                // to get() will perform correctly.  We'll seekg() to the current
                // location because we don't want to move the file pointer.
                iofile.seekg(iofile.tellg(), std::ios::beg);

                std::cout << iofile.rdbuf();

                break;
        }
    }

    return 0;
}
```

运行程序，输出结果如下：

```
Th#s #s l#n# 1
Th#s #s l#n# 2
Th#s #s l#n# 3
Th#s #s l#n# 4
```

## 其他有用的文件函数

要删除文件，只需使用`remove()` 函数。

此外，如果流是打开状态，`is_open()` 函数会返回`true`，否则返回`false`。

## 关于将指针写入硬盘的警告⚠️

虽然将变量写到文件是很容易做到的，但在处理指针时，情况就变得更加复杂了。记住，指针只是保存它所指向的变量的地址。尽管可以将地址读写到磁盘，但这样做是非常危险的。这是因为变量的地址在每次执行时可能不同。因此，尽管当你将该地址写入磁盘时，变量可能位于地址**0x0012FF7C**，但当你再次读取该地址时，它可能不再位于该地址了！

例如，假设有一个名为`nValue`的整数，位于地址**0x0012FF7C**。你给`nValue`赋值5。同时，声明了一个名为`*pnValue`的指针，`它指向nValue`。`pnValue` 保存 `nValue` 的地址**0x0012FF7C**。此时，你希望将这些变量保存到文件以备将来使用，因此你将值5和地址**0x0012FF7C**写入磁盘。

几周后，再次运行该程序并从磁盘读取这些值。将值5读入另一个名为`nValue`的变量，该变量位于**0x0012FF78**。你将地址**0x0012FF7C**读入名为`*pnValue` 的指针中。因为`pnValue` 现在指向**0x0012FF7C**，而`nValue`位于**0x0012FF78**， `pnValue` 不再指向 `nValue`，试图访问 `pnValue` 将会带来麻烦。

> [!warning] "注意"
> 不要向文件写入内存地址。当你从磁盘读回这些值时，最初位于这些地址的变量可能位于不同的地址，这些地址是无效的。