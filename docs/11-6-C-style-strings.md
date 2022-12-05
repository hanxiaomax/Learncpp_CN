---
title: 11.6 - C 语言风格字符串
alias: 11.6 - C 语言风格字符串
origin: /c-style-strings/
origin_title: "11.6 — C-style strings"
time: 2022-4-8
type: translation
tags:
- c-style
- string
---

??? note "Key Takeaway"
	- C语言字符串就是一个字符数组，最后接着一个空字符。
	- 打印字符串时，遇到空字符会停止，如果空字符被覆盖，打印函数就会一直打印直到遇到下一个0
	- 调用 `std::cin.getline(name, std::size(name));` 可以读取最多 254 个字符到 `name`（为空字符保留一个空间！）。超出的字符会被忽略掉。通过这个方法，可以避免数组溢出！
	- 操作C语言字符串的常用函数：
		- `strcpy()`  -- 将字符串拷贝到另一个字符串
		- `strncpy()`  -- 将字符串拷贝到另一个字符串(指定buffer大小)，但不能确保null结尾  
		- `strcpy_s()`，它添加了一个新参数来定义目标的大小（C++11）
		- `strcat()` -- 将一个字符串拼接到另一个字符串后面（危险操作）
		- `strncat()` -- 将一个字符串拼接到另一个字符串后面 (会检查buffer长度)  
		- `strcmp()` -- 比较两个字符串（相等返回 0）
		- `strncmp()` -- 比较两个字符串中特定格式的字符（相等返回 0）
	- 不要使用 C 语言风格的字符串

在[[4-17-an-introduction-to-std-string|4.17 - std::string 简介]]中，我们将字符定义为一系列字符的集合，例如 “Hello, world!”。字符串c++中处理文本的主要方式，而 `std::string` 可以使C++中处理字符串变得简单。

现代C++支持两种不同类型的字符串：`std::string`(作为标准库的一部分)和C语言风格的字符串(从C语言继承而来)。事实证明，`std::string` 是使用c风格字符串实现的。在这一课中，我们将进一步了解C语言风格的字符串。


## C 语言风格字符串

**C语言风格字符串**就是一个以空字符(`\0`)结尾的字符数组。**空字符**是一个特殊的字符(`'\0'`， ascii 码为 0) ，用于表示字符的结尾。所以C语言风格字符串也被称为空字符结尾的字符串。

定义C语言风格字符串，可以声明一个字符数组，然后使用字符串字面量对其进行初始化。

```cpp
char myString[]{ "string" };
```

尽管 “string” 只有6个字母，C++会自动在其末尾添加一个空字符表明结尾（不需要程序员自己操作）。这样一来，`myString` 数组的长度实际上为 7！

我们可以在下面的程序中看到这一点的证据，它打印出字符串的长度以及所有字符的ASCII值：

```cpp
#include <iostream>
#include <iterator> // for std::size

int main()
{
    char myString[]{ "string" };
    const int length{ static_cast<int>(std::size(myString)) };
//  const int length{ sizeof(myString) / sizeof(myString[0]) }; // use instead if not C++17 capable
    std::cout << myString << " has " << length << " characters.\n";

    for (int index{ 0 }; index < length; ++index)
        std::cout << static_cast<int>(myString[index]) << ' ';

    std::cout << '\n';

    return 0;
}
```

打印结果为：

```
string has 7 characters.
115 116 114 105 110 103 0
```

`0` 是添加到字符串末尾的空结束符的ASCII码。

当以这种方式声明字符串时，最好使用`[]`，并让编译器计算数组的长度。这样，如果以后需要修改字符串，就不必手动调整数组的长度。

需要注意的一点是，C风格的字符串遵循与数组相同的规则。这意味着你可以在创建时初始化字符串，但你不能在之后使用赋值操作符给它赋值!

```cpp
char myString[]{ "string" }; // ok
myString = "rope"; // not ok!
```


因为 C 风格字符串是数组，所以你可以使用下标运算符 `[]` 来改变字符串中的元素：

```cpp
#include <iostream>

int main()
{
    char myString[]{ "string" };
    myString[1] = 'p';
    std::cout << myString << '\n';

    return 0;
}
```

程序打印：

```
spring
```

在使用 C 风格字符串时，`std::cout` 会依次打印空字符。如果你不小心覆盖了字符串中的空字符（例如：给`myString[6]`赋值），那么你得到的打印结果不仅仅是完整的字符串，`std::cout`还会继续打印相邻内存中的内容，直到遇到 0。

注意，字符数组的大小比字符串大是可以的：

```cpp
#include <iostream>

int main()
{
    char name[20]{ "Alex" }; // only use 5 characters (4 letters + null terminator)
    std::cout << "My name is: " << name << '\n';

    return 0;
}
```


在这个例子中，“Alex” 会被打印出来，然后 `std::cout` 会在遇到空字符时停止打印。数组中后续内容会被忽略。 

## C 语言风格字符串和 `std::cin`

在很多情况下我们都不知道字符串会有多长。例如，考虑这样一个问题：编写一个程序，我们需要要求用户输入他们的名字。他们的名字有多长？在用户输入被读取之前，我们都不知道！

在本例中，我们声明一个比实际需要大的多的数组：

```cpp
#include <iostream>

int main()
{
    char name[255] {}; // declare array large enough to hold 254 characters + null terminator
    std::cout << "Enter your name: ";
    std::cin >> name;
    std::cout << "You entered: " << name << '\n';

    return 0;
}
```

在上面的程序中，我们为name分配了一个255个字符的数组并假设用户不会输入这么多字符。尽管这在C/C++编程中很常见，但这是一种糟糕的编程实践，因为并没有办法阻止用户输入超过254个字符(不管是无意的，还是恶意的)。

使用 `std::cin` 读取C风格字符串的推荐方法如下：

```cpp
#include <iostream>
#include <iterator> // for std::size

int main()
{
    char name[255] {}; // declare array large enough to hold 254 characters + null terminator
    std::cout << "Enter your name: ";
    std::cin.getline(name, std::size(name));
    std::cout << "You entered: " << name << '\n';

    return 0;
}
```

调用 `std::cin.getline(name, std::size(name));` 可以读取最多 254 个字符到 `name`（为空字符保留一个空间！）。超出的字符会被忽略掉。通过这个方法，可以避免数组溢出！


## 操作 C 语言风格字符串

C++提供了许多函数来操作C风格的字符串，它们是  `<cstring>` 头文件的一部分。常用的函数列举如下：

`strcpy()` 可以将一个字符串复制到另一个字符串。更常见的是，它被用来给一个字符串赋值:

```cpp
#include <cstring>
#include <iostream>

int main()
{
    char source[]{ "Copy this!" };
    char dest[50];
    std::strcpy(dest, source);
    std::cout << dest << '\n'; // prints "Copy this!"

    return 0;
}
```

不过，如果不小心的话，`strcpy()` 很容易导致数组的溢出。在下面的例子中，目标地址的大小不足以容纳全部字符串，这就会导致数组溢出。

```cpp
#include <cstring>
#include <iostream>

int main()
{
    char source[]{ "Copy this!" };
    char dest[5]; // note that the length of dest is only 5 chars!
    std::strcpy(dest, source); // overflow!
    std::cout << dest << '\n';

    return 0;
}
```

许多程序员建议使用 `strncpy()` ，使用它可以指定缓冲区的大小，并确保不会发生溢出。不幸的是，' `strncpy()` 不能确保字符串以空字符结尾，这仍然为数组溢出留下了隐患。

在C++ 11中，首选 `strcpy_s()`，它添加了一个新参数来定义目标的大小。然而，并不是所有的编译器都支持这个函数，要使用它，你必须定义 `STDC_WANT_LIB_EXT1` 并将其定义为 1 。


```cpp
#define __STDC_WANT_LIB_EXT1__ 1
#include <cstring> // for strcpy_s
#include <iostream>

int main()
{
    char source[]{ "Copy this!" };
    char dest[5]; // note that the length of dest is only 5 chars!
    strcpy_s(dest, 5, source); // A runtime error will occur in debug mode
    std::cout << dest << '\n';

    return 0;
}
```

因为并不是所有的编译器都支持 `strcpy_s()` ，所以 `strlcpy()` 是一个很受欢迎的选择——尽管它不是标准的，因此很多编译器都不包含它。它也有自己的一系列问题。简而言之，如果您需要复制C风格的字符串，这里没有普遍推荐的解决方案。

另一个有用的函数是 `strlen()` 函数，它返回C风格字符串的长度(没有空字符)。


```cpp
#include <iostream>
#include <cstring>
#include <iterator> // for std::size

int main()
{
    char name[20]{ "Alex" }; // only use 5 characters (4 letters + null terminator)
    std::cout << "My name is: " << name << '\n';
    std::cout << name << " has " << std::strlen(name) << " letters.\n";
    std::cout << name << " has " << std::size(name) << " characters in the array.\n"; // use sizeof(name) / sizeof(name[0]) if not C++17 capable

    return 0;
}
```

打印结果如下：
```
My name is: Alex
Alex has 4 letters.
Alex has 20 characters in the array.
```

注意辨析 `strlen()` 和 `std::size()`的区别。 `strlen()` 会返回空字符前所有字符的个数，而 `std::size` (或者`sizeof()` 技巧)则会返回整个数组的大小，不管数组内部存放了什么。

其他函数：
`strcat()` -- 将一个字符串拼接到另一个字符串后面（危险操作）
`strncat()` -- 将一个字符串拼接到另一个字符串后面 (会检查buffer长度)  
`strcmp()` -- 比较两个字符串（相等返回 0）
`strncmp()` -- 比较两个字符串中特定格式的字符（相等返回 0）

下面是一个使用本课中的一些概念编写的示例程序：

```cpp
#include <cstring>
#include <iostream>
#include <iterator> // for std::size

int main()
{
    // Ask the user to enter a string
    char buffer[255] {};
    std::cout << "Enter a string: ";
    std::cin.getline(buffer, std::size(buffer));

    int spacesFound{ 0 };
    int bufferLength{ static_cast<int>(std::strlen(buffer)) };
    // Loop through all of the characters the user entered
    for (int index{ 0 }; index < bufferLength; ++index)
    {
        // If the current character is a space, count it
        if (buffer[index] == ' ')
            ++spacesFound;
    }

    std::cout << "You typed " << spacesFound << " spaces!\n";

    return 0;
}
```


注意我们在循环外使用 `strlen(buffer)`，这样它之后计算一次，而不是每次循环都去计算。

## 不要使用 C 语言风格的字符串

了解C语言风格字符串是很重要的，因为它们在很多代码中都有使用。然而，既然已经解释了它的工作原理，建议你尽量避免使用它们！除非有特定的、令人信服的理由使用C语言风格字符串，否则请使用std::string(定义在`<string>`头文件中)类型的字符串，它更简单、更安全也更灵活。在极少数情况下，你确实需要使用固定的缓冲区大小和C风格的字符串(例如内存有限的设备)，我们建议使用一个测试良好的第三方字符串库，或 `std::string_view`，这将在下一课中讨论。

!!! note "法则"

	使用 `std::string`或 `std::string_view`来代替 C 语言风格的字符串。