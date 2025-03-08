---
title: 9.11 - 按引用返回和按地址返回
alias: 9.11 - 按引用返回和按地址返回
origin: /return-by-reference-and-return-by-address/
origin_title: "9.11 — Return by reference and return by address"
time: 2022-9-12
type: translation
tags:
- reference
- address
- return
---

??? note "Key Takeaway"

- 引用返回的对象必须存在于返回引用的函数的作用域之外，否则将导致悬空引用。永远不要通过引用返回局部变量
- 不要按引用返回非const的局部静态变量
- 如果函数返回一个引用，并且该引用用于初始化或赋值给一个非引用变量，则返回值将被复制(就像它是通过value返回的一样)。
- 如果参数通过引用传递给函数，则通过引用返回该参数是安全的



在上节课中，我们介绍过，当实参[[pass-by-value|按值传递]]时，实参的值会被**拷贝**一份到[[parameters|形参]]。 对于基本类型来说（拷贝开销小），这没有什么问题。但是对于[[class-type|类类型]]来说，拷贝开销通常会很大（例如 `std::string`)。通过[[pass-by-reference|按引用传递]]（通常为`const`）或按[[pass-by-address|按地址传递]]可以避免这种开销。

在按值返回时，我们会遇到类似的情况：返回值的副本被传递回调用者。如果函数的返回类型是类类型，则代价可能很高。

```cpp
std::string returnByValue(); // 返回 std::string 的拷贝(expensive)
```

## 按引用返回

在将类类型传递回调用者的情况下，我们可能(也可能不)希望[[return-by-reference|按引用返回]]。通过引用返回返回一个绑定到被返回对象的引用，这样就避免了对返回值进行复制。要通过引用返回，只需将函数的返回值定义为引用类型:

```cpp
std::string&       returnByReference(); // returns a reference to an existing std::string (cheap)
const std::string& returnByReferenceToConst(); // returns a const reference to an existing std::string (cheap)
```

下面例程展示了其原理：

```cpp
#include <iostream>
#include <string>

const std::string& getProgramName() // 返回const引用
{
    static const std::string s_programName { "Calculator" }; // 静态持续时间，持续到程序结束


    return s_programName;
}

int main()
{
    std::cout << "This program is named " << getProgramName();

    return 0;
}
```

程序打印：

```
This program is named Calculator
```

因为 `getProgramName()` 返回 const 引用，所以 `return s_programName` 执行时，`getProgramName()` 会返回 const 引用到 `s_programName` (避免了拷贝对象)。调用者可以使用该引用来访问 `s_programName` 的值，从而将其打印出来。

## 按引用返回的对象其持续时间必须超过函数调用本身

使用按引用返回最需要注意的事是：程序员必须确保被引用的对象比返回引用的函数寿命长。否则，返回的引用将称为[[dangling|悬垂]]引用(引用一个已被销毁的对象)，使用该引用将导致[[undefined-behavior|未定义行为]]。

在上面的 程序中，因为 `s_programName` 具有[[static-storage-duration|静态存储持续时间]]，所以它的知道程序结束才会被销毁。当`main`函数访问该返回的引用时，它实际访问的是 `s_programName`，这时是没有问题的，在这个时间点上它还没有被销毁。

接下来，修改上面的程序，看看函数返回悬垂引用的情况下会发生什么：

```cpp
#include <iostream>
#include <string>

const std::string& getProgramName()
{
    const std::string programName { "Calculator" }; // now a local variable, destroyed when function ends

    return programName;
}

int main()
{
    std::cout << "This program is named " << getProgramName();

    return 0;
}
```


该程序的运行结果是未定义的。当 `getProgramName()` 返回时，一个引用绑定到了局部变量 `programName` 。也正是因为该变量是一个局部变量，它具有[[automatic-storage-duration|自动存储持续时间]]，它会在函数末尾被销毁，所以返回的引用就是会是一个悬垂引用，在`main`函数中使用该悬垂引用会导致未定义行为。

如果试图通过引用返回局部变量，现代编译器将产生警告或错误(因此，上面的程序甚至可能无法编译)，但编译器有时在检测更复杂的情况时会遇到麻烦。


> [!warning] "注意"
> 引用返回的对象必须存在于返回引用的函数的作用域之外，否则将导致悬空引用。永远不要通过引用返回局部变量。

## 不要按引用返回非const的局部静态变量

在上面的例子中，我们按引用返回的是一个const的局部静态变量，并以此来演示按引用传递的方式。但是，按引用返回非const的静态变量并不符合习惯，通常应该避免这么做。这么做会有什么问题？请看下面的程序：

```cpp
#include <iostream>
#include <string>

const int& getNextId()
{
    static int s_x{ 0 }; // 注意: 变量是非const的
    ++s_x; // 生成下一个id
    return s_x; // 按引用返回
}

int main()
{
    const int& id1 { getNextId() }; // id1 是一个引用
    const int& id2 { getNextId() }; // id2 是一个引用

    std::cout << id1 << id2 << '\n';

    return 0;
}
```

程序打印：

```
22
```

之所以这样是因为 `id1` 和 `id2` 引用的是同一个对象(即静态变量 `s_x`)，所以任何对该变量的修改(例如 `getNextId()`)，都会影响到所有引用。通过const引用返回静态局部值的程序经常出现的另一个问题是，没有标准化的方法将`s_x` 重置回默认状态。这样的程序必须使用非惯用的解决方案(例如重置参数)，或者只能通过退出和重新启动程序来重置。

虽然上面的例子有点傻，但程序员有时会为了优化目的而尝试上面的做法，然后程序就不能按预期工作了。

> [!success] "最佳实践"
> 避免返回对非const局部静态变量的引用。

如果通过引用返回的局部变量的创建成本很高(因此不必每次函数调用都重新创建该变量)，则有时会返回对 const 局部静态变量的const引用。但这是罕见的。

==返回一个指向const全局变量的const引用有时也是一种用于封装对全局变量访问的方式==。我们在课程[[6-8-Why-non-const-global-variables-are-evil|6.8 - 为什么非 const 全局变量是魔鬼]]中讨论这个问题。如果有意且谨慎地使用，这也是可以的。

## 使用返回的引用来访问/初始化普通变量时会创建拷贝

如果函数返回一个引用，并且该引用用于初始化或赋值给一个非引用变量，则返回值将被复制(就像它是通过value返回的一样)。

```cpp
#include <iostream>
#include <string>

const int& getNextId()
{
    static int s_x{ 0 };
    ++s_x;
    return s_x;
}

int main()
{
    const int id1 { getNextId() }; // id1 is a normal variable now and receives a copy of the value returned by reference from getNextId()
    const int id2 { getNextId() }; // id2 is a normal variable now and receives a copy of the value returned by reference from getNextId()

    std::cout << id1 << id2 << '\n';

    return 0;
}
```

在上面的例子中，`getNextId()` 返回的是一个引用，但是 `id1` 和 `id2` 都是非引用的普通变量。这种情况下，返回的引用绑定的值会被拷贝到这个普通变量，因此程序打印：

```
12
```

当然，这也违背了通过引用返回值的目的。

还需要注意的是，如果程序返回一个悬垂引用，则该引用在复制之前一直悬空，这将导致[[undefined-behavior|未定义行为]]：

```cpp
#include <iostream>
#include <string>

const std::string& getProgramName() // will return a const reference
{
    const std::string programName{ "Calculator" };

    return programName;
}

int main()
{
    std::string name { getProgramName() }; // makes a copy of a dangling reference
    std::cout << "This program is named " << name << '\n'; // undefined behavior

    return 0;
}
```


## 按引用返回按引用传递的参数没有问题

在很多情况下，通过引用返回对象是有意义的，我们将在未来的课程中遇到许多这样的情况。不过，我们现在可以举一个有用的例子。

==如果参数通过引用传递给函数，则通过引用返回该参数是安全的==。这是有意义的：为了将参数传递给函数，参数必须存在于调用者的作用域中。当被调用的函数返回时，该对象必须仍然存在于调用者的作用域中。

下面是这样一个函数的简单示例：



```cpp
#include <iostream>
#include <string>

// Takes two std::string objects, returns the one that comes first alphabetically
const std::string& firstAlphabetical(const std::string& a, const std::string& b)
{
	return (a < b) ? a : b; // We can use operator< on std::string to determine which comes first alphabetically
}

int main()
{
	std::string hello { "Hello" };
	std::string world { "World" };

	std::cout << firstAlphabetical(hello, world) << '\n';

	return 0;
}
```

输出：

```
Hello
```

在这个例子中，调用者按引用传递了两个 `std::string` 对象，然后经过比较，两个字符串中按照字母表比较排在前面的对象被按引用(const)返回给主调函数。如果我们是按照值传递，则会导致创建`std::string`的三个拷贝（每个形参拷贝一次、返回值拷贝一次）。而使用引用传递则可以避免这些拷贝。

## 调用者可以通过引用修改值 caller can modify values through the reference

当实参按非const引用传递时，函数可以通过引用修改实参的值。

类似的，当按非const引用返回给主调函数时，调用者可以使用该引用修改返回值。

例如：

```cpp
#include <iostream>

// 接受两个整型的非const引用，返回其中较大的一个（按引用返回）
int& max(int& x, int& y)
{
    return (x > y) ? x : y;
}

int main()
{
    int a{ 5 };
    int b{ 6 };

    max(a, b) = 7; // 将a和b中较大的一个的值设置为 7

    std::cout << a << b << '\n';

    return 0;
}
```

在这个例子中， `max(a, b)` 在调用 `max()` 函数时传入`a` 和 `b` 作为实参。引用形参 `x` 绑定到实参 `a`，而引用形参 `y` 绑定到实参 `b`。随后，函数会判断 `x` (`5`) 和 `y` (`6`) 哪个比较大。本例中显然 `y` 更大，因此 `y`(仍然绑定到 `b`) 被按引用返回给主调函数。调用者随后通过返回的引用将 `b` 赋值为 7。

因此，表达式 `max(a, b) = 7` 最终解析为 `b = 7`。

程序打印：
```
57
```

## 按地址返回

[[return-by-address|按地址返回]]与[[return-by-reference|按引用返回]]的工作原理几乎相同，只不过返回的是指向对象的指针而不是对对象的引用。按地址返回有与按引用返回相同的注意事项——按地址返回的对象必须比返回地址的函数的作用域更长久，否则调用者将收到一个悬垂指针。

按地址返回比按引用返回的主要优点是，如果没有要返回的有效对象，则可以使用函数返回 `nullptr` 。例如，假设我们有一个想要搜索的学生列表。如果在列表中找到了要查找的学生，则可以返回一个指向表示匹配学生的对象的指针。如果我们没有找到任何匹配的学生对象，我们可以返回`nullptr` 来表示没有找到匹配的学生对象。

其主要缺点则是调用者必须记得在解引用返回值之前进行指针判空操作，则可能会发生空指针解引用并导致[[undefined-behavior|未定义行为]]。由于这种危险，除非需要返回“无对象”的能力，否则通过引用返回应优先于通过地址返回。

> [!success] "最佳实践"
> 首选通过引用返回而不是通过地址返回，除非返回“无对象”(使用`nullptr`)的能力很重要。