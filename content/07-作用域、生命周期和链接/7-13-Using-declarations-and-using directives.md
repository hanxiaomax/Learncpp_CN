---
title: 7.13 - using 声明和 using 指令
alias: 7.13 - using 声明和 using 指令
origin: /none/
origin_title: "none"
time: 2022-4-24
type: translation
tags:
- using
---

> [!note] "Key Takeaway"
> - 函数内部使用 `using` 声明可以提高代码可读性，同时也是安全的
> - 明确指定作用域好过 `using` 语句。尽可能地避免使用 `using` 指令。在语句块中使用 `using` 声明通常是可以的。

你可能在很多教材或者教程中都看过这样的程序：

```cpp
#include <iostream>

using namespace std;

int main()
{
    cout << "Hello world!";

    return 0;
}
```

有一些古早的 IDE 甚至会自动为你新建这样的 C++ 项目（以便你可以快速开始编写代码）。

如果你看到这样的代码，千万要原谅这些课本、教程或是编译器，它们很可能已经过时了。为什么？上完这节课你就知道了。

## 历史课

在 C++ 开始支持命名空间之前，所有现在位于 `std` 命名空间中的标识符，彼时都位于全局命名空间中。这使得用户的命名很容易和标准库中的名称发生冲突。不仅如此，在某个 C++版本下可以运行的程序，当使用了新版本的 C++ 时也很可能无法工作。

命名空间的标准化是在 1995 年完成的，从那时起，所有标准库中提供的功能，都被移动到了 `std` 命名空间。这样一来，不具有 `std:: ` 前缀的代码就不能正常工作了。

维护过大型项目的人都知道，任何一点改动都有可能破坏整个程序（不论改动是多么的不起眼）。因此，为所有相关的标识符添加 `std:: ` 前缀的风险非常大。所以我们必须提供一种更加有效的方式。

时间一晃到了今天——如果你大量使用了标准库提供的功能，为每一个相关的标识符添加 `std:: ` 也是一种非常重复的工作，而且在某些情况下会让代码的可读性变差。

为此，C++ 为这些问题提供了一种解决方法，即 `using` 语句。

在继续之前，我们先来介绍两个术语

## 限定名和非限定名

一个变量名（函数名）可以是限定名（qualified）或者非限定名（unqualified）。

包含了作用域信息的名字，称为限定名。大多数情况下，使用[[scope-resolution-operator|作用域解析运算符]](`:: `)可以创建限定名。例如：

```cpp
std::cout // identifier cout is qualified by namespace std
::foo // identifier foo is qualified by the global namespace
```

> [!info] "扩展阅读"
> 结合使用作用域解析运算符和类名也可以创建限定名，或者对类对象使用成员选择操作符（`.` 或 `->`），例如：

```cpp
class C; // some class

C::s_member; // s_member is qualified by class C
obj.x; // x is qualified by class object obj
ptr->y; // y is qualified by pointer to class object ptr
```

而不具有作用域限定符的变量名，则为非限定名。例如 `cout` 和 `x` 都是非限定名，因为它们不包含任何的作用域信息。

## Using 声明

减少重复输入 `std:: ` 的一个方法是使用 `using` 声明语句。using 声明语句使我们可以将非限定名作为限定名的别名来使用。

下面这个经典的 Hello World 程序，在第五行使用了 using 声明：

```cpp hl_lines="5"
#include <iostream>

int main()
{
   using std::cout; // this using declaration tells the compiler that cout should resolve to std::cout
   cout << "Hello world!"; // so no std:: prefix is needed here!

   return 0;
} // the using declaration expires here
```

`using std:: cout;` 告诉编译器，我们要使用 `std namespace` 中的 `cout`，所以在任何使用 `cout` 的地方，编译器都会假定它等价于 `std:: cout`。如果在遇到 `std:: cout` 和其他 `cout` 矛盾的地方，则优先认为是 `std:: cout` 。因此，在第六行我们可以直接使用 `cout` 而无需使用 `std:: cout`。

从这个小例子我们很难看出 `using` 语句能够带来的收益，但是当你在函数中大量使用 `cout` 的时候，`using` 声明可以让代码的可读性变得更好。注意，对于不同的变量名，需要单独的 using 声明（例如 `std:: cout` 是一个，`std:: cin` 是另一个）。

尽管这种方法没有使用 `std:: ` 前缀那么明确，但通常也被认为是一种安全的、可接受的方法（在函数内部使用）。

## Using 指令

另外一种简化方式是使用 `using` 指令，它可以将该命名空间中的标识符都导入到使用了该 `using` 指令的作用域。

> [!info] "扩展阅读"
> 从技术角度来讲，使用 `using` 指令其实并没有将标识符导入到当前的作用域——实际上它们被导入到外层作用域（关于外层作用域的详细信息可以参考 [这里](https://quuxplusone.github.io/blog/2020/12/21/using-directive/) ）。不过，在外层作用域中并不能访问这些变量名，它们只能在使用了`using`指令的作用域中访问。

从实际效果来看，使用 `using` 指令的行为看上去就像是变量名被导入到了当前作用域。为了不把事情搞复杂，在后面的课程中我们会沿用这种简化的说法，即变量名被*导入*到了当前作用域。

再回过头看 Hello World 程序，第五行使用了 `using` 指令：

```cpp hl_lines="5"
#include <iostream>

int main()
{
   using namespace std; // this using directive tells the compiler to import all names from namespace std into the current namespace without qualification
   cout << "Hello world!"; // so no std:: prefix is needed here
   return 0;
}
```

`using namespace std;` 告诉编译器将 `std` 命名空间中的*全部*标识符导入到当前作用域（例如 `main()` 函数）。当我们使用非限定标识符 `cout` 的时候，它就会被解析为导入的  `std:: cout`。

`Using` 指令是为了那些在命名空间发明前就存在的项目而设计的。在这种古老的项目中，有了 `using` 指令之后，我们就不必逐一地将非限定名修改为限定名（这么做风险非常大），只需将 `using namespace std;` 放置在文件的开始处，那么所有的已经被移动到了 `std` 命名空间中的标识符，仍然可以以非限定名的方式来使用。

## Using 指令带来的问题 (为什么要避免使用 “using namespace std;”)

在现代 C++ 中，使用 `using` 指令通常是弊大于利的（除了能少打字以外）。因为使用 `using` 指令导入命名空间中的所有标识符会极大地提高命名冲突的可能（尤其是导入 `std`）。

通过下面这个例子，我们可以看到 `using` 指令可能带来的二义性。

```cpp
#include <iostream>

namespace a
{
    int x{ 10 };
}

namespace b
{
    int x{ 20 };
}

int main()
{
    using namespace a;
    using namespace b;

    std::cout << x << '\n';

    return 0;
}
```

在上面的例子中，编译器无法决定这里的 `main` 中的 `x` 到底指的是 `a:: x` 还是 `b:: x`。这种情况下，编译器会因为“歧义符号”错误而无法编译。解决这个问题的办法是移除其中一个 `using` 语句，使用 `using` 声明，或者直接使用显式的作用域修饰符(`a:: ` 或 `b:: `)。

再看看下面这个例子：
```cpp
#include <iostream> // imports the declaration of std::cout

int cout() // declares our own "cout" function
{
    return 5;
}

int main()
{
    using namespace std; // makes std::cout accessible as "cout"
    cout << "Hello, world!"; // uh oh!  Which cout do we want here?  The one in the std namespace or the one we defined above?

    return 0;
}
```

在上面的例子中，编译器无法确定 `cout` 到底指的是 `std:: cout` 还是我们定义的 `cout` 函数，因此编译器仍然会因为“歧义符号”错误而无法编译。如果我们使用前缀 `std:: `，像这样：

```cpp
std::cout << "Hello, world!"; // tell the compiler we mean std::cout
```

或者使用 `using` 声明而不是 `using` 指令：

```cpp
using std::cout; // tell the compiler that cout means std::cout
cout << "Hello, world!"; // so this means std::cout
```

程序将可以顺利完成编译。 虽然你很可能并不会定义一个叫做 `cout` 的函数，但是 `std` 命名空间中有成百上千的标识符可能会与你定义的标识符产生冲突，比方说“count”, “min”, “max”, “search”, “sort” 等等。

而且，即使 `using` 指令今天没有带来命名冲突，也难保不在未来导致命名冲突。例如，如果你的代码使用 `using` 导入了某个命名空间，然后某天该库更新了，添加了一些新的变量名，那没准就会和你的代码产生冲突咯。

还有其他一些阴险的问题也可能发生。当库更新之后，它定义的一些新的函数，可能不仅函数名和我们定义的函数有冲突，甚至它更符合某种某处的函数调用方式，那么编译器就可能会使用该函数来替换我们的函数，这种情况下，程序的行为将会被改变。

考虑下面的代码：

```cpp title=foolib.h""
namespace foo
{
    // pretend there is some useful code that we use here
}
```

```cpp title="main.cpp"
#include <iostream>
#include <foolib.h> // a third-party library, thus angled brackets used

int someFcn(double)
{
    return 1;
}

int main()
{
    using namespace foo; // Because we're lazy and want to access foo:: qualified names without typing the foo:: prefix
    std::cout << someFcn(0); // 字面量应当使用 0.0 但被误用为 0，这是一个很容易犯的错误。

    return 0;
}
```

程序运行后会打印 `1`。

现在，更新 foolib（使用更新的 `foolib.h`），程序编程下面这样：

```cpp title="foolib.h"
namespace foo
{
    // newly introduced function
    int someFcn(int)
    {
        return 2;
    }

    // pretend there is some useful code that we use here
}
```

```cpp title="main.cpp"
#include <iostream>
#include <foolib.h>

int someFcn(double)
{
    return 1;
}

int main()
{
    using namespace foo; // Because we're lazy and want to access foo:: qualified names without typing the foo:: prefix
    std::cout << someFcn(0); // 字面量应当使用 0.0 但被误用为 0，这是一个很容易犯的错误。

    return 0;
}
```

`main.cpp` 文件完全没有改变，但是程序却输出了 2！

当编译器遇到函数调用时，它需要确定与函数调用最匹配的函数定义是什么。当有多个定义可供编译器选择时，它一定会选择无需参数转换的那一个。因为 0 是一个整型，C++ 一定会选择更加匹配的新定义的 `someFcn(int)`(无需转换) 而不是 `someFcn(double)`(需要将 int 转换为 double)。这样就会导致程序行为被意外地改变。

但是，如果我们使用的是 `using` 声明或者作用域修饰符的话，就完全不会发生这类问题。

最后，对于程序的读者来说，如果不使用作用域修饰符的话，读者将难确定某个函数到底是自定义的，还是属于某个库。例如，如果使用 `using` 指令：

```cpp
using namespace ns;

int main()
{
    foo(); // is this foo a user-defined function, or part of the ns library?
}
```

这种情况下就很难确定 `foo()` 指的是 `ns:: foo()` 还是用户自定义的 `foo()` 函数。在使用现代 IDE 时，如果将鼠标悬浮在变量名上时，IDE 一般都可以帮我们确定标识符到底指的是什么，但是这样显然很麻烦，毕竟每个变量名都悬浮鼠标看一下是很麻烦的。

如果不是使用 `using` 指令，代码的可读性就会好很多：

```cpp
int main()
{
    ns::foo(); // clearly part of the ns library
    foo(); // likely a user-defined function
}
```

在这个版本中，`ns:: foo()` 显然是调用库函数。而 `foo()` 则是调用用户自定义函数。

## Using 声明和指令的作用域

如果在语句块中使用 `using` 声明或 `using` 指令，那对应的变量名只在该作用域中有效。这是一个很好的特性，因为它将命名冲突的风险限定在了语句块中。

如果在全局作用域中使用 `using` 声明或 `using` 指令，变量名将影响到整个文件（具有文件作用域）。

## 取消或者替换 using 语句

一旦使用了 `using`  语句，在相同的作用域中将没有办法对其进行取消或替换。

```cpp
int main()
{
    using namespace foo;

    // 没有办法取消 "using namespace foo" 的效果
    // 也没有办法使用其他 using 语句替换

    return 0;
} // using namespace foo ends here
```

如果希望限制 `using` 语句的作用范围，可以将它放在一个语句块中。

```cpp
int main()
{
    {
        using namespace foo;
        // calls to foo:: stuff here
    } // using namespace foo expires

    {
        using namespace Goo;
        // calls to Goo:: stuff here
    } // using namespace Goo expires

    return 0;
}
```

当然，使用作用域解析运算符可以一劳永逸地解决这些问题。

## using 语句的最佳实践

除非遇到非常特殊的情况，请避免使用 `using` 指令 (尤其是 `using namespace std;`)。在语句块中使用 `using` 声明通常被认为是安全的。绝对不要在头文件的全局命名空间中使用它们，在源文件的全局作用域中有限地使用它们。

> [!success] "最佳实践"
> 明确指定作用域好过 `using` 语句。尽可能地避免使用 `using` 指令。在语句块中使用 `using` 声明通常是可以的。

> [!info] "相关内容"
> `using` 关键字还可以用来定义类型别名，我们会在[[10-7-Typedefs-and-type-aliases|10.7 - typedef 和类型别名]]中详细介绍类型别名。
