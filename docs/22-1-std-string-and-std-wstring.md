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

??? note "关键点速记"


C++标准库提供了很多有用的类，但是其中最有用的，可能非 `std::string` 莫属了。`std::string` (和 `std::wstring`) 是一个字符串类，提供了字符串相关的多种操作，包括赋值、比较和修改，在本章中，我们将会一起深入学习字符串类。

注意：我们将C语言中的字符串称为C语言风格字符串，而将 `std::string` (和 `std::wstring` 称为字符串)。

!!! info "作者注"

	注意，本章节的内容稍微有些过时，而且很可能会在将来进行更新。你可以浏览一下本章节，重点关注有关字符串的核心思想和例子。但如果是作为参考文档，专门的参考网站(例如 [cppreference](https://en.cppreference.com/w/cpp/string/basic_string)) 会使更好的选择，在那里你可以找到更新、更准确的信息。
	
## 设计字符串类的初衷

在之前的课程中，我们介绍了[[11-6-C-style-strings|C 语言风格字符串]]，它的本质就是一个字符数组，存放了组成字符串的字符。如果你曾经使用过C风格字符串，你肯定也会觉得它用起来很困难、容易出错而且不容易调试。

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

我们并不会直接使用这个类，所以暂时不要担心`trait`或`Allocator`z什么。在几乎所有可以想象到的情况下，默认值就足够了。

标准库提供了两种类型的basic_string:

You won’t be working with this class directly, so don’t worry about what traits or an Allocator is for the time being. The default values will suffice in almost every imaginable case.

There are two flavors of basic_string provided by the standard library:

```cpp
namespace std
{
    typedef basic_string<char> string;
    typedef basic_string<wchar_t> wstring;
}
```

COPY

These are the two classes that you will actually use. std::string is used for standard ascii and utf-8 strings. std::wstring is used for wide-character/unicode (utf-16) strings. There is no built-in class for utf-32 strings (though you should be able to extend your own from basic_string if you need one).

Although you will directly use std::string and std::wstring, all of the string functionality is implemented in the basic_string class. String and wstring are able to access that functionality directly by virtue of being templated. Consequently, all of the functions presented will work for both string and wstring. However, because basic_string is a templated class, it also means the compiler will produce horrible looking template errors when you do something syntactically incorrect with a string or wstring. Don’t be intimidated by these errors; they look far worse than they are!

Here’s a list of all the functions in the string class. Most of these functions have multiple flavors to handle different types of inputs, which we will cover in more depth in the next lessons.

**Creation and destruction**
|Function	|Effect|
|:--:|:--:|
|[(constructor)](https://www.learncpp.com/cpp-tutorial/17-2-ststring-construction-and-destruction/) |Create or copy a string
|[(destructor)](https://www.learncpp.com/cpp-tutorial/17-2-ststring-construction-and-destruction/)|Destroy a string

**Size and capacity**
|Function	|Effect|
|:--:|:--:|
|[capacity()](https://www.learncpp.com/cpp-tutorial/17-3-stdstring-length-and-capacity/) |Returns the number of characters that can be held without reallocation|
|[empty()](https://www.learncpp.com/cpp-tutorial/17-3-stdstring-length-and-capacity/)|Returns a boolean indicating whether the string is empty
|[length(), size()](https://www.learncpp.com/cpp-tutorial/17-3-stdstring-length-and-capacity/) |Returns the number of characters in string
|[max_size()](https://www.learncpp.com/cpp-tutorial/17-3-stdstring-length-and-capacity/) |Returns the maximum string size that can be allocated
|[reserve()](https://www.learncpp.com/cpp-tutorial/17-3-stdstring-length-and-capacity/)	|Expand or shrink the capacity of the string


**Element access**
|Function	|Effect|
|:--:|:--:|
|`[]`, `at()`	|Accesses the character at a particular index


**Modification**

|Function	|Effect|
|:--:|:--:|
|[=, assign()](https://www.learncpp.com/cpp-programming/17-5-stdstring-assignment-and-swapping/)  |Assigns a new value to the string  
|[+=, append(), push_back()](https://www.learncpp.com/uncategorized/17-6-stdstring-appending/)  |Concatenates characters to end of the string  
|[insert()](https://www.learncpp.com/cpp-tutorial/17-7-stdstring-inserting/)  |Inserts characters at an arbitrary index in string  
|`clear()`  |Delete all characters in the string  
|`erase()`  |Erase characters at an arbitrary index in string  
|`replace()`  |Replace characters at an arbitrary index with other characters  
|`resize()`  |Expand or shrink the string (truncates or adds characters at end of string)  
|[swap()](https://www.learncpp.com/cpp-programming/17-5-stdstring-assignment-and-swapping/)|Swaps the value of two strings


**Input and Output**
|Function	|Effect|
|:--:|:--:|
|`>>`, `getline()`  |Reads values from the input stream into the string  
|`<<`   |Writes string value to the output stream  
|[c_str()](https://www.learncpp.com/cpp-tutorial/17-4-stdstring-character-access-and-conversion-to-c-style-arrays/)  |Returns the contents of the string as a NULL-terminated C-style string  
|[copy()](https://www.learncpp.com/cpp-tutorial/17-4-stdstring-character-access-and-conversion-to-c-style-arrays/)  |Copies contents (not NULL-terminated) to a character array  
|[data()](https://www.learncpp.com/cpp-tutorial/17-4-stdstring-character-access-and-conversion-to-c-style-arrays/)|Same as c_str(). The non-const overload allows writing to the returned string.


**String comparison**

|Function	|Effect|
|:--:|:--:|
|`==`, `!=`  |Compares whether two strings are equal/unequal (returns bool)  
|`<`, `<=`, `>` ,`>=`  |Compares whether two strings are less than / greater than each other (returns bool)  
|`compare()`|Compares whether two strings are equal/unequal (returns -1, 0, or 1)

**Substrings and concatenation**

|Function	|Effect|
|:--:|:--:|
|`+`  |Concatenates two strings  
|`substr()`|Returns a substring

**Searching**

|Function	|Effect|
|:--:|:--:|
|`find()`|Find index of first character/substring
|`find_first_of()`|Find index of first character from a set of characters
|`find_first_not_of()`|Find index of first character not from a set of characters
|`find_last_of()`|Find index of last character from a set of characters
|`find_last_not_of()`|Find index of last character not from a set of characters
|`rfind()`	|Find index of last character/substring

**Iterator and allocator support**
|Function	|Effect|
|:--:|:--:|
|begin(), end()|Forward-direction iterator support for beginning/end of string
|get_allocator()|Returns the allocator
|rbegin(), rend()|	Reverse-direction iterator support for beginning/end of string












While the standard library string classes provide a lot of functionality, there are a few notable omissions:

-   Regular expression support
-   Constructors for creating strings from numbers
-   Capitalization / upper case / lower case functions
-   Case-insensitive comparisons
-   Tokenization / splitting string into array
-   Easy functions for getting the left or right hand portion of string
-   Whitespace trimming
-   Formatting a string sprintf style
-   Conversion from utf-8 to utf-16 or vice-versa

For most of these, you will have to either write your own functions, or convert your string to a C-style string (using c_str()) and use the C functions that offer this functionality.

In the next lessons, we will look at the various functions of the string class in more depth. Although we will use string for our examples, everything is equally applicable to wstring.