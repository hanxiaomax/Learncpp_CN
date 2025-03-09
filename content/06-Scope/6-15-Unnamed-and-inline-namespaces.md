---
title: 6.15 - 未命名和内联命名空间
alias: 6.15 - 未命名和内联命名空间
origin: /unnamed-and-inline-namespaces/
origin_title: "6.15 - 未命名和内联命名空间"
time: 2022-5-29
type: translation
tags:
- inline namespace
- unmanned namespace
---


> [!note] "Key Takeaway"
> - 匿名命名空间中的内容可以在父命名空间中访问，但是它们具有内部链接，只能在该文件中访问
> - 对于函数来说，把它们定义在匿名命名空间中的效果和把它们定义为`static`类型的效果是完全一样的
> - 内联命名空间常用来对特定的内容进行版本管理。和匿名命名空间类似，定义在内联命名空间中的内容都属于其父命名空间。但内联命名空间并不会给其内部定义的内容赋予[[internal-linkage|内部链接]]。

C++ 支持的命名空间中，只要有两种值得我们去了解。本课程不会建立在这些基础上，所以你可以把这节课当做选修。 

## 匿名命名空间

未命名命名空间（也叫匿名命名空间）是一种没有名字的命名空间，例如：

```cpp
#include <iostream>

namespace // 匿名命名空间
{
    void doSomething() // 只能在这个文件中被访问
    {
        std::cout << "v1\n";
    }
}

int main()
{
    doSomething(); // 不使用命名空间前缀调用 doSomething()
    return 0;
}
```

打印结果：

```
v1
```

所有在**匿名命名空间**中定义的内容，都被看做是该命名空间的父命名空间的一部分。所以即使 `doSomething` 被定义在一个匿名命名空间中，这个函数也是可以在它的父命名空间（这个例子中是全局命名空间）中被访问的，这也是为什么在`main`函数中可以不使用任何限定符就访问 `doSomething` 。

这样一来，好像匿名命名空间并没有什么用。但是匿名命名空间还有一个效果，就是将其内部的标识符看做是它的内部链接，这意味着该匿名命名空间中定义的内容不能在该文件以外的地方被访问。

对于函数来说，把它们定义在匿名命名空间中的效果和把它们定义为`static`类型的效果是完全一样的。下面的程序和上面的例程效果是一样的：
	
```cpp
#include <iostream>

static void doSomething() // 只能在该文件中访问
{
    std::cout << "v1\n";
}

int main()
{
    doSomething(); // 不使用命名空间前缀调用 doSomething()

    return 0;
}
```


在有很多内容需要被限定在给定文件中时，匿名命名空间就很有用。毕竟和将它们逐个定义为`static`相比，使用匿名命名空间要方便的多。匿名命名空间还可以把**用户定义类型**（稍后会介绍）限定在文件中，这个问题没有其他可用的方法。

## 内联命名空间

考虑下面的程序：

```cpp
#include <iostream>

void doSomething()
{
    std::cout << "v1\n";
}

int main()
{
    doSomething();

    return 0;
}
```

打印：

```
v1
```

很简单，对吧？

但是，假设你想要升级一下 `doSomething` 函数并改变它的行为。但是这样的话，仍然使用老版本 `doSomething` 函数的代码就会遭到破坏。有什么办法解决这个问题呢？

一种办法是重新定义一个名字不同的新版本的函数。但是，随着你一次次地修改函数，最终的下场就是你会拥有一堆名字几乎相同的函数（`doSomething`, `doSomething_v2`, `doSomething_v3` 等等）。

另外一种方法是使用**内联命名空间**。内联命名空间常用来对特定的内容进行版本管理。和匿名命名空间类似，定义在内联命名空间中的内容都属于其父命名空间。不过，内联命名空间并不会给其内部定义的内容赋予[[internal-linkage|内部链接]]。

定义内联命名空间，需要使用`inline`关键字：

```cpp
#include <iostream>

inline namespace v1 // 声明内联命名空间 v1
{
    void doSomething()
    {
        std::cout << "v1\n";
    }
}

namespace v2 // 声明内联命名空间 v2
{
    void doSomething()
    {
        std::cout << "v2\n";
    }
}

int main()
{
    v1::doSomething(); // calls the v1 version of doSomething()
    v2::doSomething(); // calls the v2 version of doSomething()

    doSomething(); // calls the inline version of doSomething() (which is v1)

    return 0;
}
```

打印结果：

```
v1
v2
v1
```

在上面的例子中，调用 `doSomething` 会使用 v1 版本的(内联版本)的`doSomething`。而任何想要使用新版本的地方，可以显式地调用`v2::dosomething()`。这样我们不仅可以使用新版本的函数，同时也能够保存老版本。


或者，如果我们希望推广新版本的函数：

```cpp
#include <iostream>

namespace v1 // 声明内联命名空间 v1
{
    void doSomething()
    {
        std::cout << "v1\n";
    }
}

inline namespace v2 // 声明内联命名空间 v2
{
    void doSomething()
    {
        std::cout << "v2\n";
    }
}

int main()
{
    v1::doSomething(); // calls the v1 version of doSomething()
    v2::doSomething(); // calls the v2 version of doSomething()

    doSomething(); // calls the inline version of doSomething() (which is v2)

    return 0;
}
```

打印：

```
v1
v2
v2
```

在这个例子中，所有调用 `doSomething` 的地方都会使用 v2 版本的函数（更新更好的版本）。而那些愿意使用老版本函数的人，也可以显式地调用 `v1::doSomething()` 来使用旧版本的函数。这也意味着需要使用 `v1::doSomething` 版本的地方必须要将 `doSomething` 进行替换为 `v1::doSomething` 。不过，如果命名得当的话，也并不会带来什么大麻烦。
