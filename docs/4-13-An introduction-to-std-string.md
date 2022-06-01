---
title: 4.13 - std::string 简介
alias: 4.13 - std::string 简介
origin: /an-introduction-to-stdstring/
origin_title: "4.13 — An introduction to std::string"
time: 2021-10-21
type: translation
tags:
- string
- input-manipulator
---

??? note "关键点速记"
	- `std::string` 不能接收空格，为了输入一整行文本，最好是使用 `std::getline()` 函数
	- 使用输入或输出操纵器，可以修改`std::cin`或`std::cout`的行为，`std::ws` 输入操纵器告诉`std::cin`要忽略任何前置空白
 
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

## std::string

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

程序s'ho program first asks you to enter 1 or 2, and waits for you to do so. All good so far. Then it will ask you to enter your name. However, it won’t actually wait for you to enter your name! Instead, it prints the “Hello” string, and then exits. What happened?

It turns out, when you enter a value using operator>>, std::cin not only captures the value, it also captures the newline character (`'\n'`) that occurs when you hit the `enter` key. So when we type `2` and then hit `enter`, std::cin gets the string `"2\n"`. It then extracts the `2` to variable `choice`, leaving the newline character behind for later. Then, when std::getline() goes to read the name, it sees `"\n"` is already in the stream, and figures we must have previously entered an empty string! Definitely not what was intended.

We can amend the above program to use the `std::ws` input manipulator, to tell `std::getline()` to ignore any leading whitespace characters:

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

COPY

Now this program will function as intended.

```
Pick 1 or 2: 2
Now enter your name: Alex
Hello, Alex, you picked 2
```


!!! success "最佳实践"

	If using `std::getline` to read strings, use the `std::ws` `input manipulator` to ignore leading whitespace.

!!! tldr "关键信息"

	Using the extraction operator (>>) with std::cin ignores leading whitespace.  
std::getline does not ignore leading whitespace unless you use input manipulator std::ws.

## String length

If we want to know how many characters are in a std::string, we can ask the std::string for its length. The syntax for doing this is different than you’ve seen before, but is pretty straightforward:

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

COPY

This prints:

```
Alex has 4 characters
```

Note that instead of asking for the string length as `length(myName)`, we say `myName.length()`. The `length()` function isn’t a normal standalone function -- it’s a special type of function that is nested within std::string called a `member function`. Because `length()` lives within std::string, it is sometimes written as std::string::length in documentation.

We’ll cover member functions, including how to write your own, in more detail later.

Also note that std::string::length() returns an unsigned integral value (most likely size_t). If you want to assign the length to an int variable, you should static_cast it to avoid compiler warnings about signed/unsigned conversions:

```cpp
int length = static_cast<int>(myName.length());
```

COPY

## Conclusion

std::string is complex, leveraging many language features that we haven’t covered yet. Fortunately, you don’t need to understand these complexities to use std::string for simple tasks, like basic string input and output. We encourage you to start experimenting with strings now, and we’ll cover additional string capabilities later.