---
title: 4.17 - std::string 简介
alias: 4.17 - std::string 简介
origin: /an-introduction-to-stdstring/
origin_title: "4.17 — An introduction to std::string"
time: 2021-10-21
type: translation
tags:
- string
- input-manipulator
---

> [!note] "Key Takeaway"
> - `std::string` 不能接收空格，为了输入一整行文本，最好是使用 `std::getline()` 函数
> - 使用输入或输出操纵器，可以修改`std::cin`或`std::cout`的行为，`std::ws` 输入操纵器告诉`std::cin`要忽略任何前置空白
> - 输入字符串时，敲击回车会导致输入流中填入`\n`，它可能被提取，也可能被留在流中，这取决于接收它的变量是什么类型。如果留在流中则会导致`std::getline`认为输入已经完成
> - 使用`std::string`的成员函数`std::string::length()`获取字符串长度，它的返回值类型为`size_t`（无符号整型）
 
 你编写的第一个 C++ 程序可能是下面这样：
 
```cpp
#include <iostream>

int main()
{
    std::cout << "Hello, world!\n";
    return 0;
}
```

那么，“Hello, world!” 究竟是什么呢？“Hello, world!” 是一组字符的集合，称为字符串。在 C++ 中，我们使用字符串来表示文本，例如名字、地址、单词和句子。字符串字面量（例如 “Hello, world!\n”）被放在双引号中间，以表明它们是字符串。

因为字符串在程序中很常见，所以大多数现代编程语言都包含基础字符串数据类型。不过，在 C++ 中，字符串并不是基础数据类型（它被称为**复合类型**，并被定义在 C++ 的标准库中，而不是作为C++核心的一部分）。但是，字符串很简单也很有用，所以我们准备提早介绍它而不是等到第九章介绍复合类型时再介绍它。

## std::string 简介

为了在 C++ 中使用字符串，我们首先应当 `#include`  `<string>` 头文件以便获取`std::string`的声明。这一步完成后，我们就可以定义`std::string`类型的变量了。

```cpp
#include <string> // allows use of std::string

std::string myName {}; // empty string
```


和其他普通变量一样，你可以对字符串进行初始化和赋值：

```cpp
std::string myName{ "Alex" }; // initialize myName with string literal "Alex"
myName = "John"; // assign variable myName the string literal "John"
```


注意，字符串也可以表示数字：

```cpp
std::string myID{ "45" }; // "45" 不同于整型 45!
```


在字符串中，数字被当做文本处理，因此它们不能被当做数字来使用（例如，你不能将它们相乘）。C++并不会将字符串数字自动转换为整型或浮点型的值。

## 字符串输出

字符串可以使用 `std::cout` 输出：

```cpp
#include <iostream>
#include <string>

int main()
{
    std::string myName{ "Alex" };
    std::cout << "My name is: " << myName << '\n';

    return 0;
}
```

运行结果为：

```
My name is: Alex
```

如果是空字符串，则什么也不会打印：

```cpp
#include <iostream>
#include <string>

int main()
{
    std::string empty{ };
    std::cout << '[' << empty << ']';

    return 0;
}
```


运行结果为：

```
[]
```

## 使用 `std::cin` 输入字符串

使用`std::cin` 输入字符串可能会有一些出人意料的地方，考虑下面这个例子：

```cpp
#include <iostream>
#include <string>

int main()
{
    std::cout << "Enter your full name: ";
    std::string name{};
    std::cin >> name; // 可能并不能如愿工作，因为 std::cin 是空格分割的

    std::cout << "Enter your age: ";
    std::string age{};
    std::cin >> age;

    std::cout << "Your name is " << name << " and your age is " << age << '\n';

    return 0;
}
```

上述程序运行结果如下：

```
Enter your full name: John Doe
Enter your age: Your name is John and your age is Doe
```

完全不对嘛！为什么会这样？实际上，在使用 `operator>> ` 提取字符串到 `cin` 的时候，`operator>>` 只会返回第一个空格前的字符。其他的字符都会被留在 `std::cin` 中供下一次提取。

因此当我们用 `operator>>` 提取字符串到 `name` 时，只有`"John"` 被提取了，而 `" Doe"` 则被留在了`std::cin` 的缓冲中。随后在使用 `operator>>` 获取 `age` 的时候，它就会提取 `"Doe"` 而不是年龄。然后程序就截止了。

## 使用 std::getline() 输入文本

为了输入一整行文本，最好是使用 `std::getline()` 函数。  `std::getline()` 可以接受两个参数，第一个是 `std::cin`，第二个则是字符串变量。

相同的程序，使用 `std::getline()` 来进行输入：

```cpp
#include <string> // For std::string and std::getline
#include <iostream>

int main()
{
    std::cout << "Enter your full name: ";
    std::string name{};
    std::getline(std::cin >> std::ws, name); // read a full line of text into name

    std::cout << "Enter your age: ";
    std::string age{};
    std::getline(std::cin >> std::ws, age); // read a full line of text into age

    std::cout << "Your name is " << name << " and your age is " << age << '\n';

    return 0;
}
```

现在，程序可以正常工作了：

```
Enter your full name: John Doe
Enter your age: 23
Your name is John Doe and your age is 23
```


## std::ws 又是什么？

在[[4-8-Floating-point-numbers|4.8 - 浮点数]]中我们讨论了[[Output-manipulators|输出操纵器(output manipulators)]] ，使用它可以改变输出的方式。当时，我们使用输出操纵函数 `std::setprecision()` 修改了`std::cout` 的输出精度。

C++ 当然也提供了[[input-manipulators|输入操纵器(input manipulators)]]  ，它可以修改输入的方式。`std::ws` 输入操纵器告诉`std::cin`要忽略任何前置空白。

通过下面的程序，让我们看看它有什么用：

```cpp
#include <string>
#include <iostream>

int main()
{
    std::cout << "Pick 1 or 2: ";
    int choice{};
    std::cin >> choice;

    std::cout << "Now enter your name: ";
    std::string name{};
    std::getline(std::cin, name); // 注意：没有使用 std::ws 

    std::cout << "Hello, " << name << ", you picked " << choice << '\n';

    return 0;
}
```

输出结果如下：

```
Pick 1 or 2: 2
Now enter your name: Hello, , you picked 2
```

程序首先提醒你输入 1 或者 2，然后等待你的输入。到目前为止都没有什么问题。然后程序又让你输入姓名，但是它并没有等待你输入就打印了"Hello"字符串，然后就退出了。 为什么会这样？

实际上，当你使用 `operator>>` 获取输入的时候，`std::cin` 并不是仅仅捕获值，它也捕获换行符`\n`（当你敲下回车的时候）。所以，在你输入 2 并敲击回车后，`std::cin`得到的输入字符串其实是 `"2\n"`。随后，2被提取到了 `choice`，而换行符就被留到了缓冲中。然后，当 `std::getline()` 开始读取姓名时，它发现 `"\n"` 已经在输入流中了，所以它输入在之前肯定已经完成（输入的是一个空字符串）！这当然并不是我们希望的。

我们可以通过 `std::ws` 修改该程序，这样`std::getline()` 就会忽略任何前置的空白字符。

```cpp
#include <string>
#include <iostream>

int main()
{
    std::cout << "Pick 1 or 2: ";
    int choice{};
    std::cin >> choice;

    std::cout << "Now enter your name: ";
    std::string name{};
    std::getline(std::cin >> std::ws, name); // note: added std::ws here

    std::cout << "Hello, " << name << ", you picked " << choice << '\n';

    return 0;
}
```

现在， 程序就可以正常工作了。

```
Pick 1 or 2: 2
Now enter your name: Alex
Hello, Alex, you picked 2
```


> [!success] "最佳实践"
> 如果使用 `std::getline` 来读取字符串，请使用`std::ws`忽略前置的空白

> [!tldr] "关键信息"
> 使用提取操作符(`>>`) 和 std::cin 来忽略前置空白。
> 除非使用`std::ws`指明，否则 `std::getline` 并不会忽略前置空白。
	
## 字符串长度

如果想要知道 `std::string` 包含多少字符，则可以查询 `std::string` 的长度，其语法可能和之前我们接触到的不太一样，但是非常简单：

```cpp
#include <iostream>
#include <string>

int main()
{
    std::string myName{ "Alex" };
    std::cout << myName << " has " << myName.length() << " characters\n";
    return 0;
}
```

打印结果：

```
Alex has 4 characters
```

注意，并不是通过 `length(myName)` 这种形式来查询，而是 `myName.length()`。因为 `length()` 函数并不是一个普通的、独立的函数——它是一类特殊的函数，它嵌入在 `std::string`，称为[[member-function|成员函数(member function)]]。因为 `length()` 存在于 std::string 内部，因此在文档中有时会写作 `std::string::length` 。

我们会在稍后介绍如何使用和编写成员函数。

同时，还要注意到 `std::string::length()` 返回的是一个无符号整型数（很可能是`size_t`）。如果你希望将它赋值给一个`int`类型的变量，你应该使用 `static_cast`，这样才能避免 signed/unsigned 转换导致的编译器告警：

```cpp
int length = static_cast<int>(myName.length());
```


In C++20, you can also use the `std::ssize()` function to get the length of a `std::string` as a signed integer:

```cpp
#include <iostream>
#include <string>

int main()
{
    std::string name{ "Alex" };
    std::cout << name << " has " << std::ssize(name) << " characters\n";

    return 0;
}
```

COPY

`std::string` is expensive to initialize and copy

Whenever a `std::string` is initialized, a copy of the string used to initialize it is made. And whenever a `std::string` is passed by value to a `std::string` parameter, another copy is made. These copies are expensive, and should be avoided if possible.

Best practice

Do not pass `std::string` by value, as making copies of `std::string` is expensive. Prefer `std::string_view` parameters.

We’ll discuss this topic (and `std::string_view`) further in lesson [[4-18-Introduction-to-std-string_view|4.18 - std::string_view 简介]]

## Literals for `std::string`

Double-quoted string literals (like “Hello, world!”) are C-style strings by default (and thus, have a strange type).

We can create string literals with type `std::string` by using a `s` suffix after the double-quoted string literal.

```cpp
#include <iostream>
#include <string>      // for std::string
#include <string_view> // for std::string_view

int main()
{
    using namespace std::literals; // easiest way to access the s and sv suffixes

    std::cout << "foo\n";   // no suffix is a C-style string literal
    std::cout << "goo\n"s;  // s suffix is a std::string literal
    std::cout << "moo\n"sv; // sv suffix is a std::string_view literal

    return 0;
};
```


> [!tip] "小贴士"
> The “s” suffix lives in the namespace `std::literals::string_literals`. The easiest way to access the literal suffixes is via using directive `using namespace std::literals`. We discuss using directives in lesson [6.12 -- Using declarations and using directives](https://www.learncpp.com/cpp-tutorial/using-declarations-and-using-directives/). This is one of the exception cases where `using` an entire namespace is okay.

You probably won’t need to use `std::string` literals very often (as it’s fine to initialize a `std::string` object with a C-style string literal), but we’ll see a few cases in future lessons where using `std::string` literals instead of C-style string literals makes things easier.

## Constexpr strings

If you try to define a `constexpr std::string`, your compiler will probably generate an error:

```cpp
#include <iostream>
#include <string>

using namespace std::literals;

int main()
{
    constexpr std::string name{ "Alex"s }; // compile error

    std::cout << "My name is: " << name;

    return 0;
}
```


This happens because `constexpr std::string` isn’t supported in C++17 or earlier, and only has minimal support in C++20. If you need constexpr strings, use `std::string_view` instead (discussed in lesson [4.18 -- Introduction to std::string_view](https://www.learncpp.com/cpp-tutorial/introduction-to-stdstring_view/).


## 结论

`std::string` 很复杂，而且使用了我们还没有介绍到的多种语言特性。幸运的是，对于完成简单的任务来说来说，你并不需要完全理解它，比如基本的输入输出。建议你从现在开始就可以多尝试并探索z字符串的使用，我们会在后续的内容中介绍string的其他功能。
