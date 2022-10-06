---
title: 4.18 - std::string_view 简介
alias: 4.18 - std::string_view 简介
origin: /introduction-to-stdstring_view/
origin_title: "4.18 — Introduction to std:: string_view"
time: 2022-6-18
type: translation
tags:
- string_view
- C++17
---

??? note "关键点速记"
    - 当需要使用只读字符串时，使用 `std:: string_view` 而不是 `std:: string` ，尤其是函数形参。
    - `std:: string_view` 不能被隐式转换为 `std:: string` 
    - 可以使用 `static_cast` 将 `std:: string_view` 转换为 `std:: string`。 
    - `std:: string_view` 可以通过 `std:: string` 初始化
    - 创建 `std:: string_view` 类型字符串字面量，则需要在双引号字符串后面添加 `sv` 后缀。如果不添加后缀则默认是 C 语言风格字符串

考虑下面的程序：

```cpp
#include <iostream>

int main()
{
    int x { 5 };
    std::cout << x  << '\n';

    return 0;
}
```

当对 `x` 进行定义时，初始化值 5 会被拷贝到 `int` `x` 的内存地址。对于基础数据类型来说，初始化（或者拷贝）一个变量是很快的。

在看这个程序：

```cpp
#include <iostream>
#include <string>

int main()
{
    std::string s{ "Hello, world!" };
    std::cout << s << '\n';

    return 0;
}
```

当 `s` 初始化时，C 语言风格的字符串[[literals|字面量]]`"Hello, world!"` 会被拷贝到 `std:: string s` 的内存地址。和基本数据类型不同的是，初始化或者拷贝 `std:: string` 是较慢的。

在上面的程序中，将 `s` 的值打印到控制台，然后销毁 `s`。我们复制了一份“Hello, world!”，只是为了打印，然后就销毁了那个副本，相当低效。

下面这个例子也类似的情况：

```cpp
#include <iostream>
#include <string>

void printString(std::string str)
{
    std::cout << str '\n';
}

int main()
{
    std::string s{ "Hello, world!" };
    printString(s);

    return 0;
}
```

在这个例子中，C语言风格的字符串”Hello world!“ 被复制了两次。第一次是在`main()`函数中对`s`初始化的时候，另外一次是在`printString()`中初始化参数`str`的时候。为了打印一个字符串，我们需要进行很多次不必要的拷贝！

## `std:: string_view`（C++17）

为了解决 `std:: string` 初始化或拷贝开销比较大的问题，C++17 引入了 `std:: string_view`(存在于 `<string_view>` 头文件中)。`std:: string_view` 为已有的字符串(C 语言风格字符串、`std:: string` 或者字符数组) 提供一种**只读**的访问方式，而无需创建一份拷贝。

下面的程序和之前的程序效果是完全一致的，只不过我们使用 `std:: string_view` 替换了 `std:: string`。

```cpp
#include <iostream>
#include <string>
#include <string_view>

void printSV(std::string_view str) // now a std::string_view
{
    std::cout << str '\n';
}

int main()
{
    std::string_view s{ "Hello, world!" }; // now a std::string_view
    printSV(s);

    return 0;
}
```

程序的输出结果和之前是完全一样的，但这个过程中并不会创建 “Hello, world!” 的副本。

`std:: string_view s` 通过 C 语言风格字符串 `"Hello, world!"` 进行初始化。变量 `s` 为 “Hello, world!” 提供了只读的访问方式，无需创建副本。当我们将变量 `s` 传递给 `printSV()` 时，函数的形参 `str` 被初始化为 `s`。这使得我们可以通过 `str` 访问字符串 “Hello, world!”，而不需要创建该字符串的拷贝。

!!! success "最佳实践"

    当需要使用只读字符串时，使用 `std:: string_view` 而不是 `std:: string` ，尤其是函数形参。


## constexpr `std:: string_view`

和 `std:: string` 不同的是， `std:: string_view` 完全支持 `constexpr`：

```cpp
#include <iostream>
#include <string_view>

int main()
{
    constexpr std::string_view s{ "Hello, world!" };
    std::cout << s << '\n'; // s 会在编译时被替换为 "Hello, world!" 

    return 0;
}
```

## 将 `std:: string` 转换为 `std:: string_view`

`std:: string_view` 可以通过 `std:: string` 类型的初始化值创建，此时 `std:: string` 会被[[implicit-type-conversion|隐式类型转换]]为 `std:: string_view`：

```cpp
#include <iostream>
#include <string>
#include <string_view>

void printSV(std::string_view str)
{
    std::cout << str << '\n';
}

int main()
{
    std::string s{ "Hello, world" };
    std::string_view sv{ s }; // Initialize a std::string_view from a std::string
    std::cout << sv;

    printSV(s); // implicitly convert a std::string to std::string_view

    return 0;
}
```

## 将 `std:: string_view` 转换为 `std:: string`

因为 `std:: string` 会拷贝它的初始化值，所以 C++不允许将 `std:: string_view` 隐式转换为 `std:: string`。不过，我们可以显示地使用 `std:: string_view` 作为初始化值并创建 `std:: string`。或者，我们可以使用 `static_cast` 将 `std:: string_view` 转换为 `std:: string`。

```cpp
#include <iostream>
#include <string>
#include <string_view>

void printString(std::string str)
{
    std::cout << str << '\n';
}

int main()
{
  std::string_view sv{ "balloon" };

  std::string str{ sv }; // okay, 可以使用std::string_view初始化值创建std::string

  // printString(sv);   // 编译错误: std::string_view 不能隐式转换为std::string

  print(static_cast<std::string>(sv)); // okay,可以显示地将 std::string_view 转换为 std::string

  return 0;
}
```

## `std:: string_view` 字面量

双引号内的字符串字面量通常默认是 C 语言风格的字符串。如果希望创建 `std:: string_view` 类型字符串字面量，则需要在双引号字符串后面添加 `sv` 后缀。

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


!!! tip "小贴士"

    `sv` 后缀位于命名空间 `std:: literals:: string_view_literals` 中。访问字面量后缀最简单的方法是使用指令 `using namespace std:: literals` 。我们在课程[[6-12-Using-declarations-and-using directives|6.12 - using 声明和 using 指令]]中讨论了 `using` 指令。这是 `using` 整个命名空间是可以的例外情况之一。

## 不要返回 `std:: string_view` 类型的值

从函数返回 `std:: string_view` 类型的值可不是个好主意，我们会在 [[11-7-std-string-view-part-2|11.7 - std:: string_view（第二部分）]]中讨论。目前你只需要记住不要这么做就行。
