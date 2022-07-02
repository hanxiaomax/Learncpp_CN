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

??? note "关键点速记"
	

在[[4-17-An introduction-to-std-string|4.17 - std::string 简介]]中，我们将字符定义为一系列字符的集合，例如 “Hello, world!”。字符串c++中处理文本的主要方式，而 `std::string` 可以使C++中处理字符串变得简单。

现代C++支持两种不同类型的字符串：`std::string`(作为标准库的一部分)和C语言风格的字符串(从C语言继承而来)。事实证明，`std::string` 是使用c风格字符串实现的。在这一课中，我们将进一步了解C语言风格的字符串。


## C 语言风格字符串

A **C-style string** is simply an array of characters that uses a null terminator. A **null terminator** is a special character (‘\0’, ascii code 0) used to indicate the end of the string. More generically, A C-style string is called a **null-terminated string**.

To define a C-style string, simply declare a char array and initialize it with a string literal:

```cpp
char myString[]{ "string" };
```

Although “string” only has 6 letters, C++ automatically adds a null terminator to the end of the string for us (we don’t need to include it ourselves). Consequently, myString is actually an array of length 7!

We can see the evidence of this in the following program, which prints out the length of the string, and then the ASCII values of all of the characters:

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

COPY

This produces the result:

```
string has 7 characters.
115 116 114 105 110 103 0
```

That 0 is the ASCII code of the null terminator that has been appended to the end of the string.

When declaring strings in this manner, it is a good idea to use [] and let the compiler calculate the length of the array. That way if you change the string later, you won’t have to manually adjust the array length.

One important point to note is that C-style strings follow _all_ the same rules as arrays. This means you can initialize the string upon creation, but you can not assign values to it using the assignment operator after that!

```cpp
char myString[]{ "string" }; // ok
myString = "rope"; // not ok!
```


Since C-style strings are arrays, you can use the [] operator to change individual characters in the string:

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

This program prints:

```
spring
```

When printing a C-style string, std::cout prints characters until it encounters the null terminator. If you accidentally overwrite the null terminator in a string (e.g. by assigning something to myString[6]), you’ll not only get all the characters in the string, but std::cout will just keep printing everything in adjacent memory slots until it happens to hit a 0!

Note that it’s fine if the array is larger than the string it contains:

```cpp
#include <iostream>

int main()
{
    char name[20]{ "Alex" }; // only use 5 characters (4 letters + null terminator)
    std::cout << "My name is: " << name << '\n';

    return 0;
}
```


In this case, the string “Alex” will be printed, and std::cout will stop at the null terminator. The rest of the characters in the array are ignored.

## C 语言风格字符串和 `std::cin`

There are many cases where we don’t know in advance how long our string is going to be. For example, consider the problem of writing a program where we need to ask the user to enter their name. How long is their name? We don’t know until they enter it!

In this case, we can declare an array larger than we need:

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

COPY

In the above program, we’ve allocated an array of 255 characters to name, guessing that the user will not enter this many characters. Although this is commonly seen in C/C++ programming, it is poor programming practice, because nothing is stopping the user from entering more than 254 characters (either unintentionally, or maliciously).

The recommended way of reading C-style strings using `std::cin` is as follows:

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

COPY

This call to `cin.getline()` will read up to 254 characters into name (leaving room for the null terminator!). Any excess characters will be discarded. In this way, we guarantee that we will not overflow the array!

## 操作 C 语言风格字符串

C++ provides many functions to manipulate C-style strings as part of the `<cstring>` header. Here are a few of the most useful:

strcpy() allows you to copy a string to another string. More commonly, this is used to assign a value to a string:

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

COPY

However, `strcpy()` can easily cause array overflows if you’re not careful! In the following program, dest isn’t big enough to hold the entire string, so array overflow results.

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

COPY

Many programmers recommend using `strncpy()` instead, which allows you to specify the size of the buffer, and ensures overflow doesn’t occur. Unfortunately, `strncpy()` doesn’t ensure strings are null terminated, which still leaves plenty of room for array overflow.

In C++11, `strcpy_s()` is preferred, which adds a new parameter to define the size of the destination. However, not all compilers support this function, and to use it, you have to define `STDC_WANT_LIB_EXT1` with integer value 1.

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

COPY

Because not all compilers support `strcpy_s()`, `strlcpy()` is a popular alternative -- even though it’s non-standard, and thus not included in a lot of compilers. It also has its own set of issues. In short, there’s no universally recommended solution here if you need to copy a C-style string.

Another useful function is the `strlen()` function, which returns the length of the C-style string (without the null terminator).

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

The above example prints:

```
My name is: Alex
Alex has 4 letters.
Alex has 20 characters in the array.
```

Note the difference between `strlen()` and `std::size()`. `strlen()` prints the number of characters before the null terminator, whereas `std::size` (or the `sizeof()` trick) returns the size of the entire array, regardless of what’s in it.

Other useful functions:  
`strcat()` -- Appends one string to another (dangerous)  
`strncat()` -- Appends one string to another (with buffer length check)  
`strcmp()` -- Compare two strings (returns 0 if equal)  
`strncmp()` -- Compare two strings up to a specific number of characters (returns 0 if equal)

Here’s an example program using some of the concepts in this lesson:

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


Note that we put `strlen(buffer)` outside the loop so that the string length is only calculated once, not every time the loop condition is checked.

## 不要使用 C 语言风格的字符串

了解C语言风格字符串是很重要的，因为它们在很多代码中都有使用。然而，既然已经解释了它的工作原理，建议你尽量避免使用它们！除非有特定的、令人信服的理由使用C语言风格字符串，否则请使用std::string(定义在`<string>`头文件中)类型的字符串，它更简单、更安全也更灵活。在极少数情况下，你确实需要使用固定的缓冲区大小和C风格的字符串(例如内存有限的设备)，我们建议使用一个测试良好的第三方字符串库，或 `std::string_view`，这将在下一课中讨论。

!!! note "法则"

	使用 `std::string`或 `std::string_view`来代替 C 语言风格的字符串。