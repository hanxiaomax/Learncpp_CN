---
title: 22.1 - std::string 和 std::wstring
alias: 22.1 - std::string 和 std::wstring
origin: /stdstring-and-stdwstring/
origin_title: "22.1 — std::string and std::wstring"
time: 2022-9-16
type: translation
tags:
- string
- wstring
---




C++标准库提供了很多有用的类，但是其中最有用的，可能非 `std::string` 莫属了。`std::string` (和 `std::wstring`) 是一个字符串类，提供了字符串相关的多种操作，包括赋值、比较和修改，在本章中，我们将会一起深入学习字符串类。

注意：我们将C语言中的字符串称为C语言风格字符串，而将 `std::string` (和 `std::wstring` 称为字符串)。

> [!info] "作者注"
> 注意，本章节的内容稍微有些过时，而且很可能会在将来进行更新。你可以浏览一下本章节，重点关注有关字符串的核心思想和例子。但如果是作为参考文档，专门的参考网站(例如 [cppreference](https://en.cppreference.com/w/cpp/string/basic_string)) 会使更好的选择，在那里你可以找到更新、更准确的信息。
	
## 设计字符串类的初衷

在之前的课程中，我们介绍了[[17-10-C-style-strings|C 语言风格字符串]]，它的本质就是一个字符数组，存放了组成字符串的字符。如果你曾经使用过C风格字符串，你肯定也会觉得它用起来很困难、容易出错而且不容易调试。

C语言风格字符串有很多缺陷，这主要是因为你必须自己管理它的内存。比方说，如果你需要将字符串"hello"赋值到一个缓存中，则你必须首先分配一个长度正确的缓存：

```cpp
char* strHello { new char[7] };
```

不要忘记在计算长度时多加一个结束符的长度！

然后你需要将值拷贝到这块缓存中：

```cpp
strcpy(strHello, "hello!");
```

只有当你计算的缓存长度正确时，才不会出现缓冲区溢出。

当然，因为字符串是动态分配的，所以你还必须记得在使用完成后正确地释放它：

```cpp
delete[] strHello;
```

不要忘记使用数组delete而不是普通delete。

此外，C语言提供的许多用于处理数字的操作符，例如赋值和比较，根本无法用于处理C风格的字符串。有时，这些方法看似有效，但实际上会产生不正确的结果——例如，使用`==`比较两个C风格字符串时，实际上比较的是两个指针，而非字符串本身。使用`operator=`将一个C风格字符串赋值给另一个C风格字符串，乍一看似乎可行，但实际上是在进行指针的[[shallow-copy|浅拷贝]]，这通常不是我们想要的结果。这类事情会导致程序崩溃，而且很难发现和调试！

归根结底，使用C风格字符串需要记住许多关于安全/不安全的规则，记住一堆具有有趣名称的函数，如`strcat()`和`strcmp()`，而不是使用直观的操作符，而且还需要进行大量的手动内存管理。

幸运的是，C++和标准库提供了处理字符串的更好的方法：`std::string`和`std::wstring`类。通过使用构造函数、析构函数和操作符重载等C++概念，`std::string` 使我们可以以一种直观和安全的方式创建和操作字符串！不再需要内存管理，不再需要奇怪的函数名，也大大降低了发生问题的可能性。


## 字符串简介

所有标准库字符串函数都位于头文件中，使用时只需要包含该头文件即可：

```cpp
#include <string>
```

在字符串头文件中实际上有3个不同的字符串类。第一个是名为`basic_string`的模板基类：

```cpp
namespace std
{
    template<class charT, class traits = char_traits<charT>, class Allocator = allocator<charT> >
        class basic_string;
}
```

我们并不会直接使用这个类，所以暂时不要担心`trait`或`Allocator`这些乱七八糟的情况。在几乎所有可以想象到的情况下，默认值就足够了。

标准库提供了两种类型的 `basic_string`：

```cpp
namespace std
{
    typedef basic_string<char> string;
    typedef basic_string<wchar_t> wstring;
}
```

这是你将实际使用的两个类。`string`用于标准的ASCII和utf-8字符串。`wstring`用于宽字符/unicode (utf-16)字符串。但是并没有用于utf-32字符串的内置类(不过，如果需要的话，您应该能够从`basic_string`自己扩展)。

尽管你会直接使用的是`std::string`和`std::wstring`，但所有的字符串功能都是在`basic_string`类中实现的。`string`和`wstring`能够直接访问这些功能，因为它们是模板化的。因此，所提供的所有函数都适用于`string`和`wstring`。但是，由于`basic_string`是一个模板化类，这也意味着当你对`string`或`wstring`进行语法错误操作时，编译器将产生可怕的模板错误。不要被这些错误吓倒：它们只是看起来比较吓人罢了。

这是`string`类中所有函数的列表。这些函数中的大多数都有多种变种用于处理不同类型的输入，我们将在接下来的课程中更深入地讨它们的具体用法。

#### 构建和析构

|Function	|Effect|
|:--:|:--|
|[(constructor)](https://www.learncpp.com/cpp-tutorial/17-2-ststring-construction-and-destruction/) |创建一个字符串的拷贝
|[(destructor)](https://www.learncpp.com/cpp-tutorial/17-2-ststring-construction-and-destruction/)|销毁字符串

#### 长度和容量

|Function	|Effect|
|:--|:--|
|[capacity()](https://www.learncpp.com/cpp-tutorial/17-3-stdstring-length-and-capacity/) |在不重新分配内存情况下，能够存放的最多的字符个数
|[empty()](https://www.learncpp.com/cpp-tutorial/17-3-stdstring-length-and-capacity/)| 返回布尔值表示字符串是否为空字符串
|[length(), size()](https://www.learncpp.com/cpp-tutorial/17-3-stdstring-length-and-capacity/) |返回字符串中字符的个数
|[max_size()](https://www.learncpp.com/cpp-tutorial/17-3-stdstring-length-and-capacity/) |返回可以分配的最长的字符串大小
|[reserve()](https://www.learncpp.com/cpp-tutorial/17-3-stdstring-length-and-capacity/)	|扩大或缩小字符串的容量


#### 元素访问

|Function	|Effect|
|:--:|:--|
|`[]`, `at()`	|使用索引访问字符串中的字符


#### 修改字符串

|Function	|Effect|
|:--|:--|
|[=, assign()](https://www.learncpp.com/cpp-programming/17-5-stdstring-assignment-and-swapping/)  | 字符串赋值
|[+=, append(), push_back()](https://www.learncpp.com/uncategorized/17-6-stdstring-appending/)  | 字符串末尾添加 
|[insert()](https://www.learncpp.com/cpp-tutorial/17-7-stdstring-inserting/)  |在任意索引位置插入
|[clear()](https://en.cppreference.com/w/cpp/string/basic_string/clear)  |删除字符串中的所有字符
|[erase()](https://en.cppreference.com/w/cpp/string/basic_string/erase)  |清除字符
|[replace()](https://en.cppreference.com/w/cpp/string/basic_string/replace)  |替换字符串中的一部分
|[resize()](https://en.cppreference.com/w/cpp/string/basic_string/resize)  |调整字符串大小(在末尾截断或添加)  
|[swap()](https://www.learncpp.com/cpp-programming/17-5-stdstring-assignment-and-swapping/)| 交换两个字符串


#### 输入输出

|Function	|Effect|
|:--:|:--|
|`>>`, `getline()`  |从输入流中获取输入
|`<<`   | 将字符串输出到输出流 
|[c_str()](https://www.learncpp.com/cpp-tutorial/17-4-stdstring-character-access-and-conversion-to-c-style-arrays/)  |返回以空字符结尾的C语言风格字符串 
|[copy()](https://www.learncpp.com/cpp-tutorial/17-4-stdstring-character-access-and-conversion-to-c-style-arrays/)  |拷贝字符串内容到字符数组(不包含结束符) 
|[data()](https://www.learncpp.com/cpp-tutorial/17-4-stdstring-character-access-and-conversion-to-c-style-arrays/)|类似`c_str()`。非const重载，允许写入返回的字符串。


#### 字符串比较

|Function	|Effect|
|:--:|:--|
|`==`, `!=`  |比较两个字符串（返回布尔值）
|`<`, `<=`, `>` ,`>=`  |比较两个字符串大小关系（返回布尔值）
|`compare()`|比较两个字符串是否相等(返回 -1, 0, 或 1)

#### 子串和拼接

|Function	|Effect|
|:--:|:--|
|`+`  |连接两个字符串
|`substr()`|返回一个子串

#### 搜索

|Function	|Effect|
|:--|:--|
|[find()](https://en.cppreference.com/w/cpp/string/basic_string/find)|搜索字符、子串第一次出现的索引位置
|[find_first_of()](https://en.cppreference.com/w/cpp/string/basic_string/find_first_of)|找到字符第一次出现的索引位置
|[find_first_not_of()](https://en.cppreference.com/w/cpp/string/basic_string/find_first_not_of)|找到第一个不在字符集中的字符出现的位置
|[find_last_of()](https://en.cppreference.com/w/cpp/string/basic_string/find_last_of)|找到字符集中最后一个字符出现的索引位置
|[find_last_not_of()](https://en.cppreference.com/w/cpp/string/basic_string/find_last_not_of)|找到最后一个不在字符集中的字符出现的位置
|[rfind()](https://en.cppreference.com/w/cpp/string/basic_string/rfind)	|搜索字符、子串最后一次出现的索引位置

#### 迭代器和内存分配

|Function	|Effect|
|:--:|:--:|
|[begin()](https://en.cppreference.com/w/cpp/string/basic_string/begin), [end()](https://en.cppreference.com/w/cpp/string/basic_string/end)|正向迭代器，开头/结尾
|[get_allocator()](https://en.cppreference.com/w/cpp/string/basic_string/get_allocator)|返回分配器
|[rbegin()](https://en.cppreference.com/w/cpp/string/basic_string/rbegin), [rend()](https://en.cppreference.com/w/cpp/string/basic_string/rend)|反向迭代器，开头/结尾



虽然标准库字符串类提供了很多功能，但有一些明显的遗漏：

-   对于正则表达式的支持；
-   从数字创建字符串的构造函数；
-   大小写字母转换函数；
-   忽略大小写的字符串比较方法；
-   字符串分词(Tokenization)后存入数组；
-   获取字符串左半部分或右半部分的函数；
-   空白移除函数(trimming)；
-   `sprintf`风格的字符串格式化函数；
-   utf-8 和 utf-16 转换。

对于其中的大多数功能，你必须编写自己的函数，或者将字符串转换为C风格的字符串(使用`c_str()`)，并使用提供此功能的C函数。

在接下来的课程中，我们将更深入地研究字符串类的各种功能。尽管我们将在示例中使用`string`，但所有内容都同样适用于`wstring`。