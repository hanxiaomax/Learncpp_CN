---
title: 8.15 - 具有多种类型的函数模板
alias: 8.15 - 具有多种类型的函数模板
origin: /function-templates-with-multiple-template-types/
origin_title: "8.15 — Function templates with multiple template types"
time: 2021-11-8
type: translation
tags:
- function template
- C++20
---

> [!note] "Key Takeaway"	

在 [[8-13-Function-templates|8.13 - 函数模板]] 在我们编写了计算两个值中较大值的函[[function-template|函数模板]]：

```cpp
#include <iostream>

template <typename T>
T max(T x, T y)
{
    return (x > y) ? x : y;
}

int main()
{
    std::cout << max(1, 2) << '\n';   // will instantiate max(int, int)
    std::cout << max(1.5, 2.5) << '\n'; // will instantiate max(double, double)

    return 0;
}
```

现在，考虑下面类似的程序：

```cpp hl_lines="4"
#include <iostream>

template <typename T>
T max(T x, T y) // <-- 注意这里
{
    return (x > y) ? x : y;
}

int main()
{
    std::cout << max(2, 3.5) << '\n';  // 编译错误

    return 0;
}
```

你可能会惊讶地发现这个程序无法编译。编译器会发出一堆(可能看起来很疯狂)错误消息。在Visual Studio上，笔者得到了以下内容：

```
Project3.cpp(11,18): error C2672: 'max': no matching overloaded function found
Project3.cpp(11,28): error C2782: 'T max(T,T)': template parameter 'T' is ambiguous
Project3.cpp(4): message : see declaration of 'max'
Project3.cpp(11,28): message : could be 'double'
Project3.cpp(11,28): message : or       'int'
Project3.cpp(11,28): error C2784: 'T max(T,T)': could not deduce template argument for 'T' from 'double'
Project3.cpp(4): message : see declaration of 'max'
```

当调用 `max(2, 3.5)` 时，我们实际上传入了两个不同类型的实参：`int` 和 `double`。因为我们没有使用尖括号来指定函数模板的实际类型，编译器会首先查看是否有非模板函数 `max(int, double)` 供其调用，但很遗憾没有找到。

接下来，编译器会查看是否能找到一个匹配的函数模板(使用**模板实参推断**，参见[[8-14-Function-template-instantiation|8.14 - 函数模板的实例化]])。但很遗憾，仍然无法找到，原因也非常简单：`T` 只能表示一个类型，编译器无法根据 `max<T>(T, T)` 模板生成能够接受两个不同[[parameters|形参]]类型的函数。换句话说，如果函数模板中的多个参数为相同类型`T`，则它们对应的实际类型也应该是相同的。

因为无法找到非模板函数，也无法找到合适的函数模板，所以函数解析出错，导致编译器报错。

==你可能会想，为什么编译器不能生成一个 `max<double>(double, double)` 类型的函数，然后通过[[numeric-conversions|数值转换]]将 `int` 转换为 `double` 呢？答案也很简单：类型转换只有在解析函数[[overload|重载]]时才会发生，在执行模板实参推断时并不会进行。==

不提供类型转换是有意而为之的，且至少有两个原因。首先，它有助于使事情变得简单：我们要么找到函数调用实参和模板类型形参之间的精确匹配，要么找不到。其次，它允许我们在需要确保两个或多个形参具有相同类型的情况下创建函数模板(如上例所示)。

我们得另想办法。幸运的是，我们可以用(至少)三种方法解决这个问题。

## 使用 `static_cast` 将实参转换为匹配的类型

解决方案 1：将实参转换为匹配的类型的任务交给调用者。例如:

```cpp
#include <iostream>

template <typename T>
T max(T x, T y)
{
    return (x > y) ? x : y;
}

int main()
{
    std::cout << max(static_cast<double>(2), 3.5) << '\n'; // convert our int to a double so we can call max(double, double)

    return 0;
}
```

这样一来，两个实参都是 `double` 类型了，所以编译器将会实例化 `max(double, double)` 并执行函数调用。

不过，这种方法不太自然，可读性也不佳。

## 提供实际类型

如果我们定义了一个非模板函数 `max(double, double)` ，那么是可以调用 `max(int, double)` 并通过[[implicit-type-conversion|隐式类型转换]]将 `int` 转换为 `double`并调用函数的：

```cpp
#include <iostream>

double max(double x, double y)
{
    return (x > y) ? x : y;
}

int main()
{
    std::cout << max(2, 3.5) << '\n'; // the int argument will be converted to a double

    return 0;
}
```

然而，==当编译器进行模板实参推导时，它不会进行任何类型转换==。幸运的是，如果指定要使用的实际类型，编译器就不必使用模板实参推导：

```cpp
#include <iostream>

template <typename T>
T max(T x, T y)
{
    return (x > y) ? x : y;
}

int main()
{
    std::cout << max<double>(2, 3.5) << '\n'; // we've provided actual type double, so the compiler won't use template argument deduction

    return 0;
}
```


在上面的例子中，我们调用了 `max<double>(2, 3.5)` 函数。因为显示提供了模板类型 `double`，编译器无需进行模板实参推断。它会直接实例化  `max<double>(double, double)`，然后对不匹配的参数进行类型转换。`int` 就会被隐式转换为`double`。

尽管这么做的可读性稍好于 `static_cast`，但是如果能够在调用函数`max`时不考虑类型就好了。

## 具有多个模板类型形参的函数模板

这个问题的根因是因为函数模板中只有一个模板类型 (`T`) ，所以两个参数都必须是该类型的。

解决这个问题最佳的方法是让函数模板支持多个不同的类型。为此，我们使用两个类型形参(`T` 和 `U`)：

```cpp
#include <iostream>

template <typename T, typename U> // We're using two template type parameters named T and U
T max(T x, U y) // x can resolve to type T, and y can resolve to type U
{
    return (x > y) ? x : y; // uh oh, we have a narrowing conversion problem here
}

int main()
{
    std::cout << max(2, 3.5) << '\n';

    return 0;
}
```

因为，我们使用模板类型`T`定义了`x`，使用`U`定义了`y`，所以现在两个参数可以是不同的类型了。 在调用 `max(2, 3.5)`时 `T` 被解析为 `int` 而 `U` 被解析为 `double`。编译器实例化 `max<int, double>(int, double)` 函数。

但是，上面的代码仍然有问题：在使用算数规则时([[8-4-Arithmetic-conversions|8.4 - 算术转换]])，`double`的优先级高于`int`因此条件运算符的返回值是`double`，而函数的返回值类型为 `T` —— 如果此时 `T` 被解析为了 `int`，则 `double` 类型的返回值在返回时会被[[narrowing-convertions|缩窄转换]]为`int`从而产生一个告警（通常也会导致数据丢失）。

将返回值定义为 `U` 并不能解决这个问题，因为 `T` 和 `U` 在传递时本身就可以互换。

那应该如何解决这个问题呢？一个好办法是使用 `auto` 作为返回类型——让编译器从返回语句中推断返回类型：

```cpp
#include <iostream>

template <typename T, typename U>
auto max(T x, U y)
{
    return (x > y) ? x : y;
}

int main()
{
    std::cout << max(2, 3.5) << '\n';

    return 0;
}
```

这个版本的 `max` 函数现在可以很好地配合各种参数类型工作了。

## [[abbreviated function templates|缩写函数模板]]（C++20）

C++20 为 `auto` 关键字引入了新的功能：当使用 `auto` 关键字修饰普通函数的[[parameters|形参]]时，编译器会自动将该函数转换为函数模板，且每个被`auto` 修饰的形参都是独立的模板类型形参。通过这种方法创建的函数模板称为[[abbreviated function templates|缩写函数模板]]。

例如：

```cpp
auto max(auto x, auto y)
{
    return (x > y) ? x : y;
}
```

上面代码是C++20中对下面模板定义的缩写形式：

```cpp
template <typename T, typename U>
auto max(T x, U y)
{
    return (x > y) ? x : y;
}
```

这和我们上面写的`max` 函数模板是一样的。

在希望每个模板类型形参都是独立类型的情况下，这种形式是首选的，因为删除模板形参声明行使代码更加简洁和可读。

> [!success] "最佳实践"
> 如果每个自动参数都应该是独立的模板类型(并且你的语言标准设置为C++20或更新版本)，那么可以随意使用缩写函数模板。