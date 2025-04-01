---
title: F.1 - Constexpr 和 consteval 函数
alias: F.1 - Constexpr 和 consteval 函数
origin: /constexpr-and-consteval-functions/
origin_title: "6.14 — Constexpr and consteval functions"
time: 2022-4-12
type: translation
tags:
- constexpr
- consteval
- C++20
---

> [!note] "Key Takeaway"
> - 为了能够在编译时求值，函数必须具有 `constexpr` 类型的返回值，同时不能够调用任何非constexpr函数。不仅如此，调用该函数也必须使用`constexpr` [[arguments|实参]] (例如`constexpr` 变量或字面量)。
> - `constexpr` 函数具有隐含的内联属性，这使得它们能够免于单一定义规则的限制。因为运行时求值必须能够让编译器在函数调用处看到函数完整定义。所以它们应该被定义在头文件中且被包含到使用它们的源文件。
> - 根据 C++ 标准，如果 `constexpr` 函数**有资格**进行编译时求值， 而且它的返回值被用在常数表达式中，那么就**必须**进行编译时求值。
> - 使用满足条件的函数返回值初始化一个 constexpr 变量可以确保函数在编译时求值
> - C++20 引入了 `consteval` 关键字，它可以指定函数**必须**在编译时求值，否则将会产生编译错误。这种函数被称为[[immediate-functions|即时函数(immediate functions)]]。
> - 使用 consteval 可以让 constexpr 函数在编译时执行

在[[4-14-Compile-time-constants-constant-expressions-and-constexpr|4.14 - 编译时常量、常量表达式和 constexpr]]中我们介绍了 `constexpr` 关键字，实用它可以创建[[compile-time|编译时]]的[[symbolic-constants|符号常量]]。此外，我们还介绍了常量表达式——可以在编译时求值的表达式。

考虑下面这个程序：

```cpp
#include <iostream>

int main()
{
    constexpr int x{ 5 };
    constexpr int y{ 6 };

    std::cout << (x > y ? x : y) << " is greater!";

    return 0;
}
```

输出结果如下：

```
6 is greater!
```

因为 `x` 和 `y` 是 `constexpr`，编译器会在编译时对 `(x > y ? x : y)` 进行求值，使用 `6` 来替换该表达式。因为这个表达式无需在运行时求值，程序显然会运行地更快。

不过，在打印语句中使用这样一个复杂的表达式并不是理想的方式——最好是将该表达式封装成一个函数。下面的例子就是这样做的：


```cpp
#include <iostream>

int greater(int x, int y)
{
    return (x > y ? x : y); // 表达式在此
}

int main()
{
    constexpr int x{ 5 };
    constexpr int y{ 6 };

    std::cout << greater(x, y) << " is greater!"; // 运行时求值

    return 0;
}
```

这个程序的运行结果和前一个程序并没有区别。但是它的缺点是，将表达式封装成函数后，`greater(x, y)` 函数必须在运行时被调用。使用函数代替表达式之后，我们失去了编译时求值的能力（伤害性能）。

那么应该如何解决该问题呢？

## Constexpr 函数可以在编译时求值

`constexpr` 函数的返回值可以在编译时求值。为了将函数定义为`constexpr`类型，我们只需要在返回值类型前添加 `constexpr` 关键字即可。请见下例：


```cpp hl_lines="10 11"
#include <iostream>

constexpr int greater(int x, int y) // now a constexpr function
{
    return (x > y ? x : y);
}

int main()
{
    constexpr int x{ 5 };
    constexpr int y{ 6 };

    // We'll explain why we use variable g here later in the lesson
    constexpr int g { greater(x, y) }; // will be evaluated at compile-time

    std::cout << g << " is greater!";

    return 0;
}
```


程序的输出结果仍然是一样的， 但是 `greater()` 函数会在编译时进行求值！

为了能够有资格在编译时求值，函数必须具有 `constexpr` 类型的返回值，同时不能够调用任何非constexpr函数。不仅如此，调用该函数也必须使用`constexpr` [[arguments|实参]] (例如`constexpr` 变量或字面量)。

> [!info] "作者注"
> 我们会在后面的文章中使用“有资格在编译时求值”这个术语。

> [!info] "扩展阅读"
> 还有一些其他的要求见[这里](https://en.cppreference.com/w/cpp/language/constexpr).

`greater()` 函数能够满足上述要求，所以它有资格在编译时求值。

> [!success] "最佳实践"
> 使用 `constexpr` 返回类型必须返回一个编译时常量。
	
## Constexpr 函数具有隐含内联属性

因为 constexpr 函数可能会在编译时求值，因此编译器必须能够在调用该函数的地方看到该函数的完整定义。

这也意味着 `constexpr` 函数如果多个文件中被调用，那么它的定义也必须每个文件一份——这就可能会违反[[one-definition-rule|单一定义规则(one-definition-rule)]]。为了避免这个问题，`constexpr` 函数具有隐含的内联属性，这使得它们能够免于单一定义规则的限制。

因此，`constexpr` 函数也通常定义在头文件中，因此它们可以被 `#included` 到任何 .cpp 文件以提供函数的完整定义。


## Constexpr 函数也可以在运行时求值

具有 `constexpr` 返回值类型的函数也可以在运行时求值，这种情况下它会返回非 `constexpr` 的结果，例如：

```cpp
#include <iostream>

constexpr int greater(int x, int y)
{
    return (x > y ? x : y);
}

int main()
{
    int x{ 5 }; // 非 constexpr
    int y{ 6 }; // 非 constexpr

    std::cout << greater(x, y) << " is greater!"; // will be evaluated at runtime

    return 0;
}
```


在这个例子中，因为参数 `x` 和 `y` 并非 `constexpr`类型，所以函数就不能在编译时被求值。不过，函数还是可以在[[runtime|运行时]]求值的，只不过返回的值是非 `constexpr`类型的 `int`。

> [!tldr] "关键信息"
> 使函数具有`constexpr`返回值类型即可以在编译时求值也可以在运行时求值， 因此这样的函数可以满足两种场景。如果不是这样的话，你就必须定义两个不同的函数（constexpr 版本和非 constexpr 版本），但是由于返回值类型不能用来区别函数重载，所以你就不得不为它起一个不同的名字。
	
## 那么，constexpr 函数什么时候会在编译时求值？

你可能会觉得，`constexpr` 函数如果可能的话总是会在编译时求值，但实际上并不是这样。

根据 C++ 标准，如果 `constexpr` 函数有资格进行编译时求值， 而且它的返回值被用在常数表达式中，那么就**必须**进行编译时求值。其他情况下，编译器则可以自由选择是在编译时还是运行时求值。

让我们通过下面的例子进行更进一步的解释：

```cpp
#include <iostream>

constexpr int greater(int x, int y)
{
    return (x > y ? x : y);
}

int main()
{
    constexpr int g { greater(5, 6) };            // case 1: 在编译时求值
    std::cout << g << "is greater!";

    int x{ 5 }; // not constexpr
    std::cout << greater(x, 6) << " is greater!"; // case 2: 在运行时求值

    std::cout << greater(5, 6) << " is greater!"; // case 3: 在编译时或者运行时求值都可能

    return 0;
}
```


对于 case 1，我们通过 `constexpr` 参数调用了 `greater()` 函数，因此它有资格进行编译时求值，同时，`constexpr` 变量 `g`的初始化值必须是 `constexpr`，所以函数的返回值被用在常量表达式中。因此 `greater()` 必须进行编译时求值。

在 case 2 中，我们调用 `greater()` 时所用的其中一个参数是非 `constexpr` 类型的。因此 `greater()` 并不能够在编译时被求值，只能在运行时求值。

case 3 就有意思了。`greater()`在调用时使用了 constexpr 参数，所以它是有资格进行编译时求值的。但是它的返回值并没有用在需要常数表达式的地方（`<<`总是在运行时求值），所以编译器可以自行决定 `greater()` 函数是在编译时求值函数运行时！

注意，你的编译器优化等级设置可能会影响到它对函数应该在编译时求值还是运行时求值的决定。这也意味着编译器在 debug 和 release 构建时可能会做出不同的决定（因为debug模式下通常会关闭优化）。

> [!tldr] "关键信息"
> constexpr 函数是有资格在编译时求值的，而且它只有在返回值被用在需要常量表达式的地方时，它才会在编译时求值。其他情况下是否会在编译时求值是不能保证的。
	

因此，`constexpr` 函数最好被看做是“可以被用在常量表达式”而不是“会在编译时求值”。


## 确定 constexpr 函数调用是否是在编译时求值的


在 C++20 以前，并没有标准的语言工具可以完成该任务。

在 C++20 中 `std::is_constant_evaluated()` (定义在 <type_traits> 头文件中)会返回一个 `bool` 类型的结果指示当前函数调用是否的常量上下文中执行的。 我们可以使用一个条件语句来使得函数在编译时求值和运行时求值时表现出不同的行为。

```cpp
#include <type_traits> // for std::is_constant_evaluated
constexpr int someFunction()
{
    if (std::is_constant_evaluated()) // if compile-time evaluation
        // do something
    else // runtime evaluation
        // do something else
}
```


使用得当的话，你可以你可以让函数在编译时求值时产生可以被观察到的不同行为（例如返回一个特殊的值），然后你可以通过该值来判断函数是在何时求值的，

## 强制 constexpr 函数在编译时求值

没有办法去告诉编译器 `constexpr` 函数应该在条件允许的情况下尽可能在编译时求值（即使返回值被用在非常数表达式时）。

不过，你可以通过让函数返回值使用在常数表达式中以确保具备条件的函数能够确保在编译时求值。当然，这是针对每一个函数调用而言的。

最常用的方法是使用返回值来初始化一个 `constexpr` 变量（这也是为什么在之前的例子中我们使用了 ‘g’ 这个变量）。可惜的是，这需要为程序引入一个新的变量而且这个变量只是为了确保函数是在编译时求值的，这样非常不优雅而且也会降低程序的可读性。

> [!info] "扩展阅读"
> 为了避免每次都需要引入一个新的 constexpr 变量才能确保编译时求值，很多人尝试了不少解决办法。参见[这里](https://quuxplusone.github.io/blog/2018/08/07/force-constexpr/) 和 [这里](https://artificial-mind.net/blog/2020/11/14/cpp17-consteval)。

不过，C++20 提供了更好的办法，马上我们就能看到。

## Consteval (C++20)

C++20 引入了 `consteval` 关键字，它可以指定函数**必须**在编译时求值，否则将会产生编译错误。这种函数被称为[[immediate-functions|即时函数(immediate functions)]]。

```cpp
#include <iostream>

consteval int greater(int x, int y) // 函数现在是 consteval 类型
{
    return (x > y ? x : y);
}

int main()
{
    constexpr int g { greater(5, 6) };            // ok: will evaluate at compile-time
    std::cout << greater(5, 6) << " is greater!"; // ok: will evaluate at compile-time

    int x{ 5 }; // not constexpr
    std::cout << greater(x, 6) << " is greater!"; // 错误: consteval 函数必须在编译时求值

    return 0;
}
```


在上面的例子中，前面两处 `greater()` 函数调用会在编译时求值。而 `greater(x, 6)` 并不能在编译时求值，所以会产生编译错误。

和 `constexpr` 函数一样，`consteval` 也是隐式内联的。

> [!success] "最佳实践"
> 如果你有函数出于某些原因（例如性能）而必须在编译时求值，可以使用 `consteval`。

## 使用 consteval 让 constexpr 在编译时执行(C++20)

`consteval`函数是不能够在运行时求值的，这也使其不如 `constexpr` 函数那样灵活（既能够在编译时求值也能够在运行时求值）。所以，如果能够有办法强制 `constexpr` 函数在编译时求值（即使它的返回值没有被用在常数表达式中），也是非常有用的。这样我们就可以让函数尽可能在编译时求值，如果函数不具备*资格*，则在运行时求值。

`Consteval` 函数为上面的想法提供了实现的可能，我们可以编写一个简洁的帮助函数：

```cpp
#include <iostream>

// Uses abbreviated function template (C++20) and `auto` return type to make this function work with any type of value
// See 'related content' box below for more info (you don't need to know how these work to use this function)
consteval auto compileTime(auto value)
{
    return value;
}

constexpr int greater(int x, int y) // 函数是 constexpr 类型的
{
    return (x > y ? x : y);
}

int main()
{
    std::cout << greater(5, 6);              // 可能会，也可能不会在编译时执行
    std::cout << compileTime(greater(5, 6)); // 会在编译时执行

    int x { 5 };
    std::cout << greater(x, 6);              // 仍然可以调用 constexpr 版本使其在运行时执行

    return 0;
}
```


`consteval` 函数需要常量表达式作为参数——因此，如果我们将 `constexpr` 函数作为参数传递给它，则 `constexpr` 函数就必须在编译时求值。`consteval` 函数只是把参数作为返回值返回了，因此调用者还是可以正常使用该值的。

注意，这种情况下函数是[[return-by-value|值返回]]，虽然在运行时值返回会影响性能（如果返回值的类型属于拷贝开销比较大的那种，例如`std::string`），在编译时其实不存在该问题，因为全部调用 `consteval` 函数的地方都会被替换为计算后的值。

> [!info] "相关内容"
> - 我们会在[[10-9-Type-deduction-for-functions|8.8 - 函数的类型推断]] 中介绍 `auto` 类型的返回值； 
> - 我们会在[[11-8-Function-templates-with-multiple-template-types|8.15 - 具有多种类型的函数模板]] 中介绍简写函数模板（`auto`[[parameters|形参]]）