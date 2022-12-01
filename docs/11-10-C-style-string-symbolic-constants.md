---
title: 11.10 - C 风格字符串符号常量
alias: 11.10 - C 风格字符串符号常量
origin: /c-style-string-symbolic-constants/
origin_title: "11.10 — C-style string symbolic constants"
time: 2022-4-8
type: translation
tags:
- symbolic constants
---

??? note "Key Takeaway"
	- 初始化C字符串常量的两种方法——固定数组和指针
		- `char myName[]{ "Alex" }; // 固定数组`
		- `const char* myName{ "Alex" };//指向符号常量的指针`
	- 符号常量方式初始化的C风格字符串，可能会位于内存中的只读区域，并且相同的字符串变量可能会指向同一块内存，因此最好定义为const
	- 符号常量方式初始化的C风格字符串位于只读内存中时，它具有全局作用域。
	

## C 风格字符串常量

在之前的课程中，我们介绍了如何初始化一个C语言风格的字符串：

```cpp
#include <iostream>

int main()
{
    char myName[]{ "Alex" }; // 固定数组
    std::cout << myName << '\n';

    return 0;
}
```


C++ 也支持使用指针指向符号常量来创建C语言风格字符串：

```cpp
#include <iostream>

int main()
{
    const char* myName{ "Alex" }; // pointer to symbolic constant
    std::cout << myName << '\n';

    return 0;
}
```

尽管从层序运行的角度来看，上面两套代码的结果是一样的，但C++在处理上述两种代码时，其内存分配的处理细节是不同的。

对于固定长度数组的例子来说，程序会在内存中分配一个长度为5的数组，同时将内存初始化为 “`Alex\0`”，因为该内存已经被分配给该数组，所以你可以自由地修改数组的内容。这个数组会被当做一般的局部变量来对待，因此当它[[going-out-of-scope|离开作用域]]时，其所使用的内存会被释放以便其他变量使用。

而对于符号常量的例子中来说，编译器如何处理取决于具体实现。*一般*来讲，编译器会把“`Alex\0`” 放在某处只读内存，然后使用一个指针指向它。因为该内存是只读的，所以最好将该字符串设置为const。

编译器会出于性能优化的考量，将多个相同的字符串字面量合并为一个字符串值。例如：

```cpp
const char* name1{ "Alex" };
const char* name2{ "Alex" };
```


这是两个具有相同值的不同字符串字面值。编译器可以选择将它们组合成一个共享的字符串字面值，`name1` 和 `name2` 都指向相同的地址。因此，如果 `name1` 不是 `const`，那么对 `name1` 进行更改也会影响 `name2` (这可能是意料之外的)。

由于字符串字面值被存储在内存中的固定位置，因此字符串字面值具有静态持续时间，而不是自动持续时间(也就是说，它们在程序结束时销毁，而不是在定义它们的块结束时销毁)。这意味着当我们使用字符串字面量时，我们不必担心作用域问题。因此，这么做是可以的：


```cpp
const char* getName()
{
    return "Alex";
}
```


在上面的代码中，`getName()` 将返回一个指向C风格字符串`"Alex"`的指针。如果该函数按地址返回任何其他局部变量，则该变量将在`getName()` '结束时销毁，并返回一个悬空指针给调用者。但是，因为字符串字面值具有静态持续时间，所以当 `getName()` 终止时，`"Alex"`不会被销毁，因此调用者仍然可以访问它。

C风格的字符串在很多旧的或底层代码中使用，因为它们占用的内存非常小。现代代码应该更倾向于使用`std::string`和 `std::string_view` ，因为它们提供了安全且易用的字符串访问。


## `std::cout` 和字符指针

学到这一章的时候，你可能已经注意到，`std::cout` 可以处理不同类型的指针。 

例如：

```cpp
#include <iostream>

int main()
{
    int nArray[5]{ 9, 7, 5, 3, 1 };
    char cArray[]{ "Hello!" };
    const char* name{ "Alex" };

    std::cout << nArray << '\n'; // nArray will decay to type int*
    std::cout << cArray << '\n'; // cArray will decay to type char*
    std::cout << name << '\n'; // name is already type char*

    return 0;
}
```


在笔者的电脑上打印下面的信息：

```
003AF738
Hello!
Alex
```

为什么整型数组打印的就是地址，而字符数组就能打印字符串？

这是因为 `std::cout` 可以推断你的意图。如果你传入了一个非字符类型的指针，它会打印该指针的内容（指针持有的地址值）。但是，如果你传递的是一个 `char*` 或 `const char*` 类型的对象，它会假定你希望打印的是一个字符串。因此，它打印的是指针指向的字符串的值而不是指针持有的地址值。

尽管，99%的情况下都是没问题的，但是其仍有可能产生非预期的结果。考虑下面这个例子：

```cpp
#include <iostream>

int main()
{
    char c{ 'Q' }; //注意这里是一个字符
    std::cout << &c;

    return 0;
}
```

在这个例子中，程序员打算打印变量C的地址。然而，`&c`的类型是`char*`，所以`std::cout`将其作为字符串打印！

在笔者的机器上，打印结果如下：

```
Q╠╠╠╠╜╡4;¿■A
```

为什么这样呢？`std::cout`假设`&c`(类型为`char*`)是一个字符串。所以它打印了“Q”，然后继续打印接下来内存中（一堆垃圾值）。最终，它遇到了保存0值的内存中，并将其解释为空终止符。你看到的可能会不同，这取决于变量C后面的内存。

这种情况在现实生活中不太可能发生(因为您不太可能真的想打印内存地址)，但它说明了事情是如何在幕后工作的，以及程序是如何在不经意间偏离轨道的。