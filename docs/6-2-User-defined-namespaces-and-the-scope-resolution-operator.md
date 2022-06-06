---
title: 6.2 - 用户定义命名空间和作用域解析运算符
alias: 6.2 - 用户定义命名空间和作用域解析运算符
origin: /user-defined-namespaces-and-the-scope-resolution-operator/
origin_title: "6.2 — User-defined namespaces and the scope resolution operator"
time: 2021-7-4
type: translation
tags:
- namespace
- namespace aliases
- scope resolution operator
- C++17
---

??? note "关键点速记"

	- 不指定命名空间的前提下，编译器首先在当前命名空间中查找，然后按照包含关系逐层查找，直到找到全局命名空间
	- 不带前缀的作用域解析运算符表示全局命名空间中查找（`::print()`）
	- 将命名空间的声明分成多个部分放在不同的位置是合法的（多个文件、相同文件的不同位置）。所有这些声明都被认为是对应命名空间声明的一部分。
	- 命名空间可以嵌套，但是嵌套后引用内部的函数写起来很麻烦，可以使用命名空间别名为其创建一个简短的、临时的名字
	- C++17 还支持`namespace foo::goo`这种方式来创建嵌套的命名空间
	- 命名空间别名最好的一点是：如果你需要将 `foo::goo` 中的函数移动到另外的地方，那么你只需要更新一下上面例子中的 `active` 别名使其指向新的命名空间即可，而不必查找替换所有的 `foo::goo`.
	- C++ 的命名空间不是为了像 C# 或者 Java 那样创建一个层次结构，它只是一种避免命名冲突的机制，因此不要过度嵌套。
	- 自己编写的库，如果提供给他人使用，请放在自定义的命名空间中，这样可以避免命名冲突，也可以帮助编辑器的代码补全和提示进行工作

在[[2-9-Naming-collisions-and-an-introduction-to-namespaces|2.9 - 命名冲突和命名空间]]中我们介绍了命名冲突和命名空间。提醒一下，命名冲突发生在相同作用域中有两个相同名字的时候，这时编译器将不能够区分它们。这种情况下，编译器或者链接器会报告错误信息。当程序越变越大的时候，标识符的数量也会线性增长，这会使得命名冲突的可能性成指数倍增长。

让我们再回顾一下命名冲突的例子，以及如何使用命名空间解决这个问题。在下面的例子中，`foo.cpp` 和 `goo.cpp` 中包含了功能不同，但函数名完全和参数完全相同的两个函数。


```cpp title="foo.cpp"
// This doSomething() adds the value of its parameters
int doSomething(int x, int y)
{
    return x + y;
}
```


```cpp title="goo.cpp"
// This doSomething() subtracts the value of its parameters
int doSomething(int x, int y)
{
    return x - y;
}
```


```cpp title="main.cpp"
#include <iostream>

int doSomething(int x, int y); // forward declaration for doSomething

int main()
{
    std::cout << doSomething(4, 3) << '\n'; // which doSomething will we get?
    return 0;
}
```


如果程序中只包含 `foo.cpp` 或者 `goo.cpp` (但不是两个都有)，程序就可以顺利地编译和运行。不过，当把它们两个都编译到同一个程序中时，我们就向同一个作用域（全局作用域）中引入了两个名字和参数都完全相同的函数，这就会代码命名冲突，造成的后果就是链接器报错：

```
goo.cpp:3: multiple definition of `doSomething(int, int)'; foo.cpp:3: first defined here
```

注意，这个问题在于**重复定义** ，所以无关是否`doSomething`被调用。

解决这个问题的方法之一，是对其中一个函数重命名，这样命名就不会冲突了。但是，这么做就意味着所有调用该函数的地方的代码也要对应地修改，这不仅是一项大工程，也非常容易犯错。另一个避免命名冲突的办法，是使用自定义的命名空间。也正是这样，标准库的函数都被移动到了 `std` 命名空间中。


## 自定义命名空间

C++ 允许我们通过`namespace`关键字创建你自己的命名空间。用户为了自己的声明创建的命名空间，称为**用户自定义命名空间**。C++ 提供的命名空间（例如 `global`和`std`）并没有考虑用户自定义命名空间。

## 命名空间的标识符通常不是大写形式

我们使用命名空间重新编写了上面的几个程序：

```cpp title="foo.cpp"
namespace foo // define a namespace named foo
{
    // This doSomething() belongs to namespace foo
    int doSomething(int x, int y)
    {
        return x + y;
    }
}
```

```cpp title="goo.cpp"
namespace goo // define a namespace named goo
{
    // This doSomething() belongs to namespace goo
    int doSomething(int x, int y)
    {
        return x - y;
    }
}
```


现在 `foo.cpp` 中的 `doSomething()` 位于 `foo` 命名空间中，而`goo.cpp` 中的 `doSomething()` 则位于 `goo` 命名空间中。重新编译程序，看看会发生什么。


```cpp title="main.cpp"
int doSomething(int x, int y); // forward declaration for doSomething

int main()
{
    std::cout << doSomething(4, 3) << '\n'; // which doSomething will we get?
    return 0;
}
```


结果就是我们得到了另外的错误信息！

```
ConsoleApplication1.obj : error LNK2019: unresolved external symbol "int __cdecl doSomething(int,int)" (?doSomething@@YAHHH@Z) referenced in function _main
```

在这个例子中，编译没有问题(因为我们提供了[[forward-declaration|前向声明]])，但是链接器并不能在 global 作用域中找到 `doSomething` 的定义。这是因为这两个版本的 `doSomething`都已经不在 global 作用域中了。

告诉编译器使用哪个版本 `doSomething()` 的方法有两种，一种是[[scope-resolution-operator|作用域解析运算符]]，一种是using语句（参见:[[6-12-Using-declarations-and-using directives|6.12 - using 声明和 using 指令]]）。

在接下来的例子中，我们还是回到单文件的场景，这样看起来更加清晰。

## 通过作用域解析运算符(`::`)访问命名空间

告诉编译器在哪个命名空间中查找函数的最好的办法就是使用作用域解析运算符(`::`)。作用域解析运算符告诉编译器该运算符左面的操作数是它应该查找的命名空间。

下面的例子展示了如何使用作用域解析运算符查找编译器查找 `foo` 命名空间的 `doSomething()`：

```cpp
#include <iostream>

namespace foo // define a namespace named foo
{
    // This doSomething() belongs to namespace foo
    int doSomething(int x, int y)
    {
        return x + y;
    }
}

namespace goo // define a namespace named goo
{
    // This doSomething() belongs to namespace goo
    int doSomething(int x, int y)
    {
        return x - y;
    }
}

int main()
{
    std::cout << foo::doSomething(4, 3) << '\n'; // use the doSomething() that exists in namespace foo
    return 0;
}
```

输出结果如下：

```
7
```

如果你希望使用 `goo` 中的 `doSomething()` ，则应该这么做：

```cpp
#include <iostream>

namespace foo // define a namespace named foo
{
    // This doSomething() belongs to namespace foo
    int doSomething(int x, int y)
    {
        return x + y;
    }
}

namespace goo // define a namespace named goo
{
    // This doSomething() belongs to namespace goo
    int doSomething(int x, int y)
    {
        return x - y;
    }
}

int main()
{
    std::cout << goo::doSomething(4, 3) << '\n'; // use the doSomething() that exists in namespace goo
    return 0;
}
```

输出结果如下：

```
1
```

作用域解析运算符非常好用，它允许我们**显式地**指定一个需要查找的命名空间，不存在任何模糊的含义。我们甚至可以这么做：

```cpp
#include <iostream>

namespace foo // define a namespace named foo
{
    // This doSomething() belongs to namespace foo
    int doSomething(int x, int y)
    {
        return x + y;
    }
}

namespace goo // define a namespace named goo
{
    // This doSomething() belongs to namespace goo
    int doSomething(int x, int y)
    {
        return x - y;
    }
}

int main()
{
    std::cout << foo::doSomething(4, 3) << '\n'; // use the doSomething() that exists in namespace foo
    std::cout << goo::doSomething(4, 3) << '\n'; // use the doSomething() that exists in namespace goo
    return 0;
}
```

输出结果如下：

```
7
1
```

## 使用没有前缀的作用域解析运算符

作用域解析运算符也可以用在一个标识符前面，但不指定命名空间（例如 `::doSomething` ）。这种情况下，编译器会在全局命名空间中查找标识符（`doSomething`） 。

```cpp
#include <iostream>

void print() // this print lives in the global namespace
{
	std::cout << " there\n";
}

namespace foo
{
	void print() // this print lives in the foo namespace
	{
		std::cout << "Hello";
	}
}

int main()
{
	foo::print(); // call print() in foo namespace
	::print(); // call print() in global namespace (same as just calling print() in this case)

	return 0;
}
```


在上面的例子中，`::print()` 的效果和 `print()` （不进行作用域解析）是完全一样的，所以在这个例子中使用作用域解析运算符是多余的。但是，在接下来的例子中，我们能够看到这种无前缀作用域解析运算符的作用。

## 命名空间中的标识符解析

当一个标识符位于某个命名空间时，如果不指定作用域解析，则编译器首先会在相同的命名空间中进行查找。如果没有找到，则编译器会在按照包含关系，在命名空间序列中依次查找，最后才会查找 global 命名空间：

```cpp
#include <iostream>

void print() // this print lives in the global namespace
{
	std::cout << " there\n";
}

namespace foo
{
	void print() // this print lives in the foo namespace
	{
		std::cout << "Hello";
	}

	void printHelloThere()
	{
		print(); // calls print() in foo namespace
		::print(); // calls print() in global namespace
	}
}

int main()
{
	foo::printHelloThere();

	return 0;
}
```

打印结果：

```
Hello there
```

在上面的例子中，调用 `print()` 函数时并没有指定需要解析的作用域。因此在 `foo` 命名空间中调用 `print()`函数，编译器首先会查找 `foo::print()` 的定义。因为该定义存在，所以 `foo::print()` 被执行。

如果 `foo::print()` 并没有被找到，那么编译器就必须查找包含该作用域的作用域（在这个例子中是 global 作用域）以尝试找到 `print()` 。

注意，我们可以使用不带前缀的作用域解析运算符（`::print()`）明确指定编译器使用 global 命名空间中的 `print()`。

## 命名空间定义为多个块

将命名空间的声明分成多个部分放在不同的位置是合法的（多个文件、相同文件的不同位置）。所有这些声明都被认为是对应命名空间声明的一部分。


```cpp title="circle.h"
#ifndef CIRCLE_H
#define CIRCLE_H

namespace basicMath
{
    constexpr double pi{ 3.14 };
}

#endif
```


```cpp title="growth.h"
#ifndef GROWTH_H
#define GROWTH_H

namespace basicMath
{
    // the constant e is also part of namespace basicMath
    constexpr double e{ 2.7 };
}

#endif
```


```cpp title="main.cpp"
#include "circle.h" // for basicMath::pi
#include "growth.h" // for basicMath::e

#include <iostream>

int main()
{
    std::cout << basicMath::pi << '\n';
    std::cout << basicMath::e << '\n';

    return 0;
}
```

打印结果如我们所愿：

```
3.14
2.7
```

标准库大量使用了这一特性，因为每个标准库的头文件都将它声明的内容放在 `namespace std` 块中。否则，全部的标准库将必须定义在一个单独的文件中了。

注意，借助这个功能，你实际上可以把自定义的函数也放到 `std` 命名空间中。不过这么做大多数情况下会导致未定义行为的发生，因为 `std` 命名空间具有特殊的规则以便禁止用户去扩展标准库的代码。

!!! warning "注意"

	不要把自定义的功能定义在 `std` 命名空间中。
	
如果你需要把代码分散到多个文件时，你必须在头文件和源文件中使用命名空间：


```cpp title="add.h"
#ifndef ADD_H
#define ADD_H

namespace basicMath
{
    // function add() is part of namespace basicMath
    int add(int x, int y);
}

#endif
```


```cpp title="add.cpp"
#include "add.h"

namespace basicMath
{
    // define the function add()
    int add(int x, int y)
    {
        return x + y;
    }
}
```


```cpp title="main.cpp"
#include "add.h" // for basicMath::add()

#include <iostream>

int main()
{
    std::cout << basicMath::add(4, 3) << '\n';

    return 0;
}
```


如果你在源文件中省略了命名空间，编译器将无法找到 `basicMath::add`，因为源文件只定义了 `add` (全局命名空间)。如果该命名空间在头文件中被省略，则“main.cpp” 就无法使用 `basicMath::add`，因为它只能看到 `add` 的声明 (全局命名空间)。

## 命名空间嵌套

命名空间也可以嵌套，例如：

```cpp
#include <iostream>

namespace foo
{
    namespace goo // goo is a namespace inside the foo namespace
    {
        int add(int x, int y)
        {
            return x + y;
        }
    }
}

int main()
{
    std::cout << foo::goo::add(1, 2) << '\n';
    return 0;
}
```


注意，因为命名空间 `goo` 定义在命名空间 `foo` 中，所以要访问 `add` 必须像这样 `foo::goo::add`。

从 C++17开始，嵌套命名空间也可以这样声明：

```cpp
#include <iostream>

namespace foo::goo // goo is a namespace inside the foo namespace (C++17 style)
{
  int add(int x, int y)
  {
    return x + y;
  }
}

int main()
{
    std::cout << foo::goo::add(1, 2) << '\n';
    return 0;
}
```


## 命名空间别名

在C++中完整输入嵌套命名空间的标识符是非常痛苦的一件事，所以C++允许你为命名空间创建**别名**，你可以通过别名为一个非常长的命名空间序列创建一个简短的、临时的名称：

```cpp
#include <iostream>

namespace foo::goo
{
    int add(int x, int y)
    {
        return x + y;
    }
}

int main()
{
    namespace active = foo::goo; // active now refers to foo::goo

    std::cout << active::add(1, 2) << '\n'; // This is really foo::goo::add()

    return 0;
} // The active alias ends here
```

命名空间别名最好的一点是：如果你需要将 `foo::goo` 中的函数移动到另外的地方，那么你只需要更新一下上面例子中的 `active` 别名使其指向新的命名空间即可，而不必查找替换所有的 `foo::goo`.

```cpp
#include <iostream>

namespace foo::goo
{
}

namespace v2
{
    int add(int x, int y)
    {
        return x + y;
    }
}

int main()
{
    namespace active = v2; // active now refers to v2

    std::cout << active::add(1, 2) << '\n'; // We don't have to change this

    return 0;
}
```


值得注意的是，C++的命名空间被设计出来的目的是作为一种放置命名冲突的机制，但它并不是为了实现一种信息的层次关系。这一点我们可以从标准库中看出：几乎全部的标准库都位于`std::`命名空间中（少数新的功能放置在嵌套命名空间中）。在这一点上，其他的一些语言（例如C#）和 C++ 是截然不同的。

总的来说，应当尽量避免命名空间的嵌套。

## 什么时候应该使用命名空间

在实际应用中，命名空间可以被用来分割与当前应用程序强相关的代码和那些可能在日后被重用的代码（例如数学函数）。例如，物理和数学函数可以定义在一个命名空间中(例如 `math::`)。语言和本地化的函数则可以定义在另外的命名空间中（例如`lang::`） 。

如果你编写的是库函数或用于提供给他人使用的代码，请始终把你的函数定义在一个自定义的命名空间中。如果你不遵循这项最佳实践，即你的代码没有声明在一个特定的命名空间中，那么很有可能会造成命名冲突。将你的代码放在自定义命名空间中的另外一个好处是，你的用户可以借助编辑器的自动补全和提示功能看到你库中的的内容。
