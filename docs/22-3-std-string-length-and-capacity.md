---
title: 22.3 - std-string 的长度和容量
alias: 22.3 - std-string 的长度和容量
origin: /stdstring-length-and-capacity/
origin_title: "22.3 — std::string length and capacity"
time: 2022-8-15
type: translation
tags:
- string
---

??? note "Key Takeaway"


一旦创建了字符串，知道它们的长度通常是很有用的。我们还将讨论将`std::string`转换回C风格字符串的各种方法，这样你就可以在将其用在期望`char*`类型字符串的函数中使用它们。

## 字符串的长度

字符串的长度非常简单——即字符串中字符的个数。有两个函数可以用于确定字符串的长度：

**`size_type string::length() const`**  
**`size_type string::size() const`**

-   这两个函数都可以返回字符串中字符的个数，包括结束符。

例子：

```cpp
std::string s { "012345678" };
std::cout << s.length() << '\n';
```

输出：

```
9
```

尽管使用 `length()` 判断字符串中是否有字符也是可行的，但是最佳的方法是使用 `empty()` 函数：

**`bool string::empty() const`**

- 如果字符串中没有字符，则返回`true`，否则返回`false`。

例子：

```cpp
std::string string1 { "Not Empty" };
std::cout << (string1.empty() ? "true" : "false") << '\n';
std::string string2; // empty
std::cout << (string2.empty() ? "true" : "false")  << '\n';
```


输出：

```
false
true
```

还有一个与大小相关的函数，虽然可能永远都用不到，但为了完整，我们决定还是将其列在这里：

**`size_type string::max_size() const`**

-   返回字符串允许的最大字符数；
-   根据操作系统和系统架构的不同，该值会有所不同。

例子：

```cpp
std::string s { "MyString" };
std::cout << s.max_size() << '\n';
```

输出：

```
4294967294
```

## 字符串的容量

字符串的容量反映了该字符串分配多少内存来保存其内容。该值用字符串表示，不包括终止符。例如，容量为8的字符串可以容纳8个字符。

**`size_type string::capacity() const`**

-   返回字符串在不重新分配的情况下可以容纳的字符数。

例子：

```cpp
std::string s { "01234567" };
std::cout << "Length: " << s.length() << '\n';
std::cout << "Capacity: " << s.capacity() << '\n';
```

输出：

```
Length: 8
Capacity: 15
```

注意，该字符串的容量大于其长度！虽然我们的字符串的长度是8，但该字符串实际上分配了足够存放15个字符的内存！为什么要这样做?

这里要注意的是，如果用户希望在字符串中放入的字符多于字符串的容量，则字符串需要重新分配更大的容量。例如，如果字符串的长度和容量都为8，那么向字符串中添加任何字符都将强制重新分配。通过使容量大于实际字符串，这为用户提供了一些缓冲空间，以便在需要进行重新分配之前能够存放一些额外的字符。

==事实证明，再分配有以下缺陷：==

首先，重新分配字符串开销较大。首先，必须分配新的内存。然后必须将字符串中的每个字符复制到新的内存中。如果字符串很大，这可能需要很长时间。最后，旧的内存必须被释放。如果你正在进行多次重新分配，这个过程会极大地拖累程序性能。

其次，==每当一个字符串被重新分配时，该字符串的内容将放置到一个新的内存地址。这意味着对字符串的所有引用、指针和迭代器都会无效！==

注意，分配给字符串的容量并不总是大于长度。考虑下面的程序：

```cpp
std::string s { "0123456789abcde" };
std::cout << "Length: " << s.length() << '\n';
std::cout << "Capacity: " << s.capacity() << '\n';
```

输出结果：

```
Length: 15
Capacity: 15
```

（实际结果根据编译器的不同也可能会不同）

接下来，在字符串中添加一个字符并观察其容量的变化:

```cpp
std::string s("0123456789abcde");
std::cout << "Length: " << s.length() << '\n';
std::cout << "Capacity: " << s.capacity() << '\n';

// Now add a new character
s += "f";
std::cout << "Length: " << s.length() << '\n';
std::cout << "Capacity: " << s.capacity() << '\n';
```

输出结果：

```
Length: 15
Capacity: 15
Length: 16
Capacity: 31
```

**`void string::reserve()`**  
**`void string::reserve(size_type unSize)`**

- 此函数的第二种形式将字符串的容量设置为至少`unSize`(可以更大)。注意，这可能需要进行重新分配。
- 如果调用函数的第一种形式，或者调用第二个味道时`unSize`小于当前容量，函数将尝试缩小容量以匹配长度。根据执行情况，可能会忽略这个缩小容量的要求。 

例子：

```cpp
std::string s { "01234567" };
std::cout << "Length: " << s.length() << '\n';
std::cout << "Capacity: " << s.capacity() << '\n';

s.reserve(200);
std::cout << "Length: " << s.length() << '\n';
std::cout << "Capacity: " << s.capacity() << '\n';

s.reserve();
std::cout << "Length: " << s.length() << '\n';
std::cout << "Capacity: " << s.capacity() << '\n';
```

输出：

```
Length: 8
Capacity: 15
Length: 8
Capacity: 207
Length: 8
Capacity: 207
```

这个例子展示了两个有趣的现象。首先，虽然我们要求的容量是200，但实际上我们得到的容量是207。容量总是保证至少与你的请求一样大，但也可能更大。然后我们请求容量更改以适应字符串。该请求被忽略，容量并没有改变。

如果你提前知道你将通过大量的字符串操作来构造一个很长字符串（这会增加字符串的大小），则应该在开始时就预留足够的容量来避免重新分配：

```cpp
#include <iostream>
#include <string>
#include <cstdlib> // for rand() and srand()
#include <ctime> // for time()

int main()
{
    std::srand(std::time(nullptr)); // seed random number generator

    std::string s{}; // length 0
    s.reserve(64); // reserve 64 characters

    // Fill string up with random lower case characters
    for (int count{ 0 }; count < 64; ++count)
        s += 'a' + std::rand() % 26;

    std::cout << s;
}
```

这个程序的结果每次都会改变，其中一次的结果为：

```
wzpzujwuaokbakgijqdawvzjqlgcipiiuuxhyfkdppxpyycvytvyxwqsbtielxpy
```

为了避免重新分配，这里我们先设置一次容量，然后填充字符串。当通过连接构造长字符串时，其性能差异是非常明显的。
