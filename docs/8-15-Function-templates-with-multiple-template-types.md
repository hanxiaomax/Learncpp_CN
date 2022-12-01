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

??? note "关键点速记"
	

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

This lack of type conversion is intentional for at least two reasons. First, it helps keep things simple: we either find an exact match between the function call arguments and template type parameters, or we don’t. Second, it allows us to create function templates for cases where we want to ensure that two or more parameters have the same type (as in the example above).

We’ll have to find another solution. Fortunately, we can solve this problem in (at least) three ways.

## Use static_cast to convert the arguments to matching types

The first solution is to put the burden on the caller to convert the arguments into matching types. For example:

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

COPY

Now that both arguments are of type `double`, the compiler will be able to instantiate `max(double, double)` that will satisfy this function call.

However, this solution is awkward and hard to read.

## Provide an actual type

If we had written a non-template `max(double, double)` function, then we would be able to call `max(int, double)` and let the implicit type conversion rules convert our `int` argument into a `double` so the function call could be resolved:

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

COPY

However, when the compiler is doing template argument deduction, it won’t do any type conversions. Fortunately, we don’t have to use template argument deduction if we specify an actual type to be used instead:

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

COPY

In the above example, we call `max<double>(2, 3.5)`. Because we’ve explicitly specified that `T` should be replaced with `double`, the compiler won’t use template argument deduction. Instead, it will just instantiate the function `max<double>(double, double)`, and then type convert any mismatched arguments. Our `int` parameter will be implicitly converted to a `double`.

While this is more readable than using `static_cast`, it would be even nicer if we didn’t even have to think about the types when making a function call to `max` at all.

## Functions templates with multiple template type parameters

The root of our problem is that we’ve only defined the single template type (`T`) for our function template, and then specified that both parameters must be of this same type.

The best way to solve this problem is to rewrite our function template in such a way that our parameters can resolve to different types. Rather than using one template type parameter `T`, we’ll now use two (`T` and `U`):

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

COPY

Because we’ve defined `x` with template type `T`, and `y` with template type `U`, `x` and `y` can now resolve their types independently. When we call `max(2, 3.5)`, `T` can be an `int` and `U` can be a `double`. The compiler will happily instantiate `max<int, double>(int, double)` for us.

However, the above code still has a problem: using the usual arithmetic rules ([8.4 -- Arithmetic conversions](https://www.learncpp.com/cpp-tutorial/arithmetic-conversions/)), `double` takes precedence over `int`, so our conditional operator will return a `double`. But our function is defined as returning a `T` -- in cases where `T` resolves to an `int`, our `double` return value will undergo a narrowing conversion to an `int`, which will produce a warning (and possible loss of data).

Making the return type a `U` instead doesn’t solve the problem, as we can always flip the order of the operands in the function call to flip the types of `T`and `U`.

How do we solve this? This is a good use for an `auto` return type -- we’ll let the compiler deduce what the return type should be from the return statement:

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

COPY

This version of `max` now works fine with operands of different types.

## Abbreviated function templates C++20

C++20 introduces a new use of the `auto` keyword: When the `auto` keyword is used as a parameter type in a normal function, the compiler will automatically convert the function into a function template with each auto parameter becoming an independent template type parameter. This method for creating a function template is called an abbreviated function template.

For example:

```cpp
auto max(auto x, auto y)
{
    return (x > y) ? x : y;
}
```

COPY

is shorthand in C++20 for the following:

```cpp
template <typename T, typename U>
auto max(T x, U y)
{
    return (x > y) ? x : y;
}
```

COPY

which is the same as the `max` function template we wrote above.

In cases where you want each template type parameter to be an independent type, this form is preferred as the removal of the template parameter declaration line makes your code more concise and readable.

!!! success "最佳实践"

	Feel free to use abbreviated function templates if each auto parameter should be an independent template type (and your language standard is set to C++20 or newer).