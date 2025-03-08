---
title: 8.14 - 函数模板的实例化
alias: 8.14 - 函数模板的实例化
origin: /function-template-instantiation/
origin_title: "8.14 — Function template instantiation"
time: 2022-3-29
type: translation
tags:
- function template
---

??? note "Key Takeaway"
	


在上节课中 ([[8-13-Function-templates|8.13 - 函数模板]])，我们介绍了[[function-template|函数模板]]以及如何将普通函数`max()`转换成`max<T>`函数模板：

```cpp
template <typename T>
T max(T x, T y)
{
    return (x > y) ? x : y;
}
```


在这节课中，我们将重点介绍如何使用函数模板。

## 使用函数模板

函数模板并不是真正的函数，其代码不能被直接编译或执行。函数模板只有一个功能：生成函数（可以被编译执行）。

为了使用 `max<T>` 函数模板，我们需要使用如下语法：

```cpp
max<actual_type>(arg1, arg2); // actual_type 是实际类型，例如 int或double
```

这看起来很像普通的函数调用——主要的区别是在尖括号中添加了类型(称为模板实参)，它指定了将用于代替模板类型“T”的实际类型。

让我们看一个简单的例子:

```cpp
#include <iostream>

template <typename T>
T max(T x, T y)
{
    return (x > y) ? x : y;
}

int main()
{
    std::cout << max<int>(1, 2) << '\n'; // instantiates and calls function max<int>(int, int)

    return 0;
}
```

当编译器遇到函数调用 `max<int>(1,2)` 时，它将确定`max<int>(int, int)` 的函数定义不存在。因此，编译器将使用 `max<T>` 函数模板来创建一个。

从函数模板(带有模板类型)创建函数(带有特定类型)的过程称为[[function-template-instantiation|函数模板实例化]](或简称实例化)。当此过程由于函数调用而发生时，称为隐式实例化。实例化的函数通常称为[[function-instance|函数实例]](简称实例)或模板函数。函数实例在所有方面都是正常的函数。

实例化函数的过程很简单：编译器基本上是克隆函数模板，并用实际类型( `int` )替换模板类型(`T` )。

因此，当我们调用`max<int>(1,2)` 时，被实例化的函数看起来像这样：

```cpp
template<> // ignore this for now
int max<int>(int x, int y) // the generated function max<int>(int, int)
{
    return (x > y) ? x : y;
}
```

下面是与上面相同的示例，显示了编译器在所有实例化完成后实际编译的内容：

```cpp
#include <iostream>

// a declaration for our function template (we don't need the definition any more)
template <typename T>
T max(T x, T y);

template<>
int max<int>(int x, int y) // the generated function max<int>(int, int)
{
    return (x > y) ? x : y;
}

int main()
{
    std::cout << max<int>(1, 2) << '\n'; // instantiates and calls function max<int>(int, int)

    return 0;
}
```

你可以自己编译它，看看它是否工作。一个已实例化的函数只在第一次调用函数时被实例化。对该函数的进一步调用被路由到已经实例化的函数。

再举一个例子：

```cpp
#include <iostream>

template <typename T>
T max(T x, T y) // function template for max(T, T)
{
    return (x > y) ? x : y;
}

int main()
{
    std::cout << max<int>(1, 2) << '\n';    // instantiates and calls function max<int>(int, int)
    std::cout << max<int>(4, 3) << '\n';    // calls already instantiated function max<int>(int, int)
    std::cout << max<double>(1, 2) << '\n'; // instantiates and calls function max<double>(double, double)

    return 0;
}
```

这与前面的例子类似，但是我们的函数模板这次将用于生成两个函数:一次将 `T` 替换为`int` ，另一次将 `T` 替换为 `double` 。在所有实例化之后，程序看起来像这样:

```cpp
#include <iostream>

// a declaration for our function template (we don't need the definition any more)
template <typename T>
T max(T x, T y);

template<>
int max<int>(int x, int y) // the generated function max<int>(int, int)
{
    return (x > y) ? x : y;
}

template<>
double max<double>(double x, double y) // the generated function max<double>(double, double)
{
    return (x > y) ? x : y;
}

int main()
{
    std::cout << max<int>(1, 2) << '\n';    // instantiates and calls function max<int>(int, int)
    std::cout << max<int>(4, 3) << '\n';    // calls already instantiated function max<int>(int, int)
    std::cout << max<double>(1, 2) << '\n'; // instantiates and calls function max<double>(double, double)

    return 0;
}
```


需要注意的是：当实例化 `max<double>` 时，其[[arguments|实参]]类型为 `double`。因为我们提供的是[[arguments|实参]]是 `int` ，所以它会被[[implicit-type-conversion|隐式类型转换]]为 `double`。

## 模板参数推断

在大多数情况下，我们希望用于实例化的实际类型将与函数形参的类型匹配。例如：

```cpp
std::cout << max<int>(1, 2) << '\n'; // specifying we want to call max<int>
```

在这个函数调用中，我们已经指定我们想用`int` 替换 `T` ，但我们也调用了带有 `int` 参数的函数。

在实参的类型与我们想要的实际类型相匹配的情况下，我们不需要指定实际的类型——相反，我们可以使用模板实参推导，让编译器从函数调用中的实参类型推导出应该使用的实际类型。

例如，不用像这样调用函数：

```cpp
std::cout << max<int>(1, 2) << '\n'; // specifying we want to call max<int>
```

这么做即可：

```cpp
std::cout << max<>(1, 2) << '\n';
std::cout << max(1, 2) << '\n';
```

对于上面例子中的两个语句，编译器会发现我们没有提供实际类型，所以它会尝试从函数[[arguments|实参]]推断实际类型以使其能够生成合适的 `max()` 函数。在这个例子中，如果编译器能够通过实际类型`int`推断出模板类型并实例化函数 `max<int>(int, int)`，其所有模板形参都是(`int`)，能够匹配提供的实参类型(`int`)。

这两种情况的区别在于编译器如何解析来自一组重载函数的函数调用。在顶部的情况下(带有空尖括号)，编译器在决定调用哪个重载函数时，只会考虑`max<int>` 模板函数重载。在下面一个例子(没有尖括号)中，编译器将同时考虑`max<int>` 模板函数重载和`max` 非模板函数重载。

例子：

```cpp
#include <iostream>

template <typename T>
T max(T x, T y)
{
    std::cout << "called max<int>(int, int)\n";
    return (x > y) ? x : y;
}

int max(int x, int y)
{
    std::cout << "called max(int, int)\n";
    return (x > y) ? x : y;
}

int main()
{
    std::cout << max<int>(1, 2) << '\n'; // selects max<int>(int, int)
    std::cout << max<>(1, 2) << '\n';    // deduces max<int>(int, int) (non-template functions not considered)
    std::cout << max(1, 2) << '\n';      // calls function max(int, int)

    return 0;
}
```

请注意，最下面的写法看起来与正常的函数调用是一样的！这通常是调用函数模板时使用的首选语法(在以后的示例中，如果可行，我们将默认使用这种语法)。

> [!success] "最佳实践"
> 在使用函数模板时，使用正常的函数调用语法。

## 带有非模板参数的函数模板

可以创建同时具有模板类型和非模板类型参数的函数模板。模板形参可以匹配任何类型，非模板形参的工作方式与普通函数的形参类似。

例如:

```cpp
template <typename T>
int someFcn (T x, double y)
{
    return 5;
}

int main()
{
    someFcn(1, 3.4); // matches someFcn(int, double)
    someFcn(1, 3.4f); // matches someFcn(int, double) -- the float is promoted to a double
    someFcn(1.2, 3.4); // matches someFcn(double, double)
    someFcn(1.2f, 3.4); // matches someFcn(float, double)
    someFcn(1.2f, 3.4f); // matches someFcn(float, double) -- the float is promoted to a double

    return 0;
}
```

这个函数模板有一个模板化的第一个形参，但是第二个形参的类型是固定的`double` 。注意，返回类型也可以是任何类型。在这种情况下，我们的函数总是返回一个`int` 值。

注意，实例化的函数不保证一定能够编译。

考虑下面的例子：

```cpp
#include <iostream>

template <typename T>
T addOne(T x)
{
    return x + 1;
}

int main()
{
    std::cout << addOne(1) << '\n';
    std::cout << addOne(2.3) << '\n';

    return 0;
}
```

编译器会编译和执行下面代码：

```cpp
#include <iostream>

template <typename T>
T addOne(T x);

template<>
int addOne<int>(int x)
{
    return x + 1;
}

template<>
double addOne<double>(double x)
{
    return x + 1;
}

int main()
{
    std::cout << addOne(1) << '\n';   // calls addOne<int>(int)
    std::cout << addOne(2.3) << '\n'; // calls addOne<double>(double)

    return 0;
}
```

运行结果：

```
2
3.3
```

但是如果我们这么做呢？

```cpp
#include <iostream>
#include <string>

template <typename T>
T addOne(T x)
{
    return x + 1;
}

int main()
{
    std::string hello { "Hello, world!" };
    std::cout << addOne(hello) << '\n';

    return 0;
}
```

当编译器尝试解析 `addOne(hello)` 时，它无法找到一个非模板函数来匹配 `addOne(std::string)`，但是能够找到一个函数模板 `addOne(T)`，并通过该模板生成 `addOne(std::string)` 函数。因此编译器会生成并编译下面的代码：

```cpp
#include <iostream>
#include <string>

template <typename T>
T addOne(T x);

template<>
std::string addOne<std::string>(std::string x)
{
    return x + 1;
}

int main()
{
    std::string hello{ "Hello, world!" };
    std::cout << addOne(hello) << '\n';

    return 0;
}
```

显然，这会导致编译错误，因为 `x + 1` 并不适用于 `x` 为 `std::string` 类型的情况。解决办法就是不要使用`std::string`类型来调用 `addOne()`。

## 在多个文件中使用函数模板

为了实例化模板，编译器需要看到模板的完整定义。这意味着，如果我们想在多个代码文件中使用函数模板，每个代码文件都需要函数模板定义的副本。因此，==模板通常编写在头文件中，它们可以被`#include`到任何想要使用它们的代码文件中。==

模板定义并不受限于[[one-definition-rule|单一定义规则(one-definition-rule)]]，而且由于实例化的函数通常是隐式[[inline-function|内联函数]]，所以也不受限于单一定义规则。

```cpp title="Max.h"
#ifndef MAX_H
#define MAX_H

template <typename T>
T max(T x, T y)
{
    return (x > y) ? x : y;
}

#endif
```

```cpp title="Foo.cp"
#include "Max.h" // import template definition for max<T, T>()
#include <iostream>

void foo()
{
	std::cout << max(3, 2);
}
```

```cpp title="main.cpp"
#include "Max.h" // import template definition for max<T, T>()
#include <iostream>

void foo(); // forward declaration for function foo

int main()
{
    std::cout << max(3, 5);
    foo();

    return 0;
}
```


在上面的例子中，`main.cpp` 和 `foo.cpp` 都 `#include "Max.h"` ，所以这两个文件中的代码都可以使用 `max<T, T>` 函数模板。


## 泛型编程

因为模板类型可以用任何实际类型替换，所以模板类型有时被称为泛型类型。由于模板可以不受具体类型的影响而编写，因此使用模板进行编程有时被称为泛型编程。C++通常非常关注类型和类型检查，相比之下，泛型编程让我们专注于算法的逻辑和数据结构的设计，而不必过多地担心类型信息。

## 小结

一旦习惯了编写函数模板，就会发现编写函数模板所花的时间实际上并不比具有实际类型的函数长多少。函数模板通过最小化需要编写和维护的代码数量，可以显著减少代码维护和错误。

函数模板也确实有一些**缺点**，如果我们不提及它们，那就是失职了。首先，编译器将为每个函数调用创建(并编译)一个函数，该函数具有一组惟一的参数类型。因此，尽管函数模板编写起来很紧凑，但它们可能会被扩展成大量的代码，这可能导致代码膨胀和编译时间变慢。函数模板**更大的缺点**是，它们往往会产生看起来很疯狂、近乎不可读的错误消息，比常规函数的错误消息更难解读。这些错误消息可能相当吓人，但一旦你能够理解了它试图传达的信息，其指出的问题通常非常容易解决。

模板为编程工具包带来了强大功能和安全性，这些缺点可以说是瑕不掩瑜了。所以在任何需要类型灵活性的地方都可以自由使用模板！一个好的经验法则是：==首先创建普通函数，当发现需要针对不同参数类型[[overload|重载]]函数时，则将它们转换为函数模板。==

> [!success] "最佳实践"
> 使用函数模板来编写泛型代码，这些代码可以在需要时处理各种类型。