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

??? note "关键点速记"
	


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

从函数模板(带有模板类型)创建函数(带有特定类型)的过程称为[[function-template-instantiation|函数模板实例化]](或简称实例化)。当此过程由于函数调用而发生时，称为隐式实例化。实例化的函数通常称为函数实例(简称实例)或模板函数。函数实例在所有方面都是正常的函数。

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

请注意，最下面的写法看起来与正常的函数调用是一样的！这通常是调用函数模板时使用的首选语法(在以后的示例中，如果可选我们将默认使用这种语法，除需要这样做)。

Note how the syntax in the bottom case looks identical to a normal function call! This is usually the preferred syntax used when invoking function templates (and the one we’ll default to in future examples, unless required to do otherwise).

!!! success "最佳实践"

	Favor the normal function call syntax when using function templates.

## 带有非模板参数的函数模板

It’s possible to create function templates that have both template types and non-template type parameters. The template parameters can be matched to any type, and the non-template parameters work like the parameters of normal functions.

For example:

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

COPY

This function template has a templated first parameter, but the second parameter is fixed with type `double`. Note that the return type can also be any type. In this case, our function will always return an `int` value.

实例化的函数不一定能够编译。

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

COPY

The compiler will effectively compile and execute this:

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

COPY

which will produce the result:

```
2
3.3
```

But what if we try something like this?

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

COPY

When the compiler tries to resolve `addOne(hello)` it won’t find a non-template function match for `addOne(std::string)`, but it will find our function template for `addOne(T)`, and determine that it can generate an `addOne(std::string)` function from it. Thus, the compiler will generate and compile this:

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

COPY

However, this will generate a compile error, because `x + 1` doesn’t make sense when `x` is a `std::string`. The obvious solution here is simply not to call `addOne()` with an argument of type `std::string`.

## 在多个文件中使用函数模板

In order to instantiate a template, the compiler needs to see the full definition of the template. This means that if we want to use a function template in multiple code files, each code file needs a copy of the definition of the function template. For this reason, templates are typically written in header files, where they can be `#include` into any code file that wants to use them.

Template definitions are not subject to the one-definition rule, and functions instantiated from function templates are implicitly inline, so they are exempt from the one-definition rule.

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

COPY

In the above example, both main.cpp and foo.cpp `#include "Max.h"` so the code in both files can make use of the `max<T, T>` function template.

## 泛型编程

Because template types can be replaced with any actual type, template types are sometimes called generic types. And because templates can be written agnostically of specific types, programming with templates is sometimes called generic programming. Whereas C++ typically has a strong focus on types and type checking, in contrast, generic programming lets us focus on the logic of algorithms and design of data structures without having to worry so much about type information.

## 小结

Once you get used to writing function templates, you’ll find they actually don’t take much longer to write than functions with actual types. Function templates can significantly reduce code maintenance and errors by minimizing the amount of code that needs to be written and maintained.

Function templates do have a few drawbacks, and we would be remiss not to mention them. First, the compiler will create (and compile) a function for each function call with a unique set of argument types. So while function templates are compact to write, they can expand into a crazy amount of code, which can lead to code bloat and slow compile times. The bigger downside of function templates is that they tend to produce crazy-looking, borderline unreadable error messages that are much harder to decipher than those of regular functions. These error messages can be quite intimidating, but once you understand what they are trying to tell you, the problems they are pinpointing are often quite straightforward to resolve.

These drawbacks are fairly minor compared with the power and safety that templates bring to your programming toolkit, so use templates liberally anywhere you need type flexibility! A good rule of thumb is to create normal functions at first, and then convert them into function templates if you find you need an overload for different parameter types.

!!! success "最佳实践"

	Use function templates to write generic code that can work with a wide variety of types whenever you have the need.