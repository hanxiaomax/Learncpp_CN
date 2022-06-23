---
title: 8.7 - 使用 auto 关键字进行类型推断
alias: 8.7 - 使用 auto 关键字进行类型推断
origin: /type-deduction-for-objects-using-the-auto-keyword/
origin_title: "8.7 -- Type deduction for objects using the auto keyword"
time: 2022-2-6
type: translation
tags:
- type deduction
- data type
- auto
---

在下面这个简单的变量定义中，存在一个难以察觉的冗余点：

```cpp
double d{ 5.0 };
```

因为 C++ 属于强类型语言，所以我们必须为每一个对象指明其类型。因此，这里我们显式地指明了变量 `d` 的类型为 `double`。

但是，既然被用来初始化 `d` 的[[literals|字面量]]`5.0` 已经是 `double` 类型的了，难道再为 d 指定 `double` 不多于吗？

!!! info "相关内容"

    关于字面量的类型，参见[[4-15-Symbolic-constants-const-and-constexpr-variables|4.15 - 符号常量 const 和 constexpr 变量]].

如果我们希望一个变量及其初始化式具有相同的类型，那么两次提供了相同的类型信息其实是多余的。

## 变量初始化的类型转换

类型推断是一种允许编译器通过对象的初始化值推断对象类型的特性。使用 `auto` 关键字代替变量的类型就可以使用类型推断。

```cpp
int main()
{
    auto d{ 5.0 }; // 5.0 is a double literal, so d will be type double
    auto i{ 1 + 2 }; // 1 + 2 evaluates to an int, so i will be type int
    auto x { i }; // i is an int, so x will be type int too

    return 0;
}
```

在第一个例子中，因为 `5.0` 是 `double` 类型的字面量，所以编译器可以推断出变量 `d` 也应该是 `double` 类型的。在第二个例子中，表达式 `1 + 2` 会求值得到一个 `int` 类的解，因此变量 `i` 是 `int` 类型的。在第三个例子中，因为 `i` 的类型已经被推断为 `int` 类型，因此这里的 `x` 自然也会被推断为 `int` 类型。

因为函数调用也是一种合法的表达式，所以函数作为初始化值时，也可以进行类型推断：

```cpp
int add(int x, int y)
{
    return x + y;
}

int main()
{
    auto sum { add(5, 6) }; // add() returns an int, so sum's type will be deduced to int
    return 0;
}
```

`add()` 函数的返回值为 `int` ，所以编译器会将变量 `sum` 的类型推断为 `int`。

如果对象没有初始化值或使用了空的初始化值，则无法进行类型推断。下面的两个变量定义是非法的：

```cpp
int main()
{
    auto x; // The compiler is unable to deduce the type of x
    auto y{ }; // The compiler is unable to deduce the type of y

    return 0;
}
```

虽然对基本数据类型使用类型推断只能少打几个字，但在后续的课程中我们会看到，在某些情况下，类型可能会变得复杂和冗长（或者在某些情况下类型会变得难以确定）在这种情况下，使用 `auto` 可以节省大量的输入(和错别字)。

!!! info "相关内容"

指针和引用的类型推断有些复杂，我们会在 [[9-12-Type-deduction-with-pointers-references-and-const|9.12 - 指针、引用和 const 的类型推断]] 中进行介绍。

## 类型推断会丢弃 const 修饰符

大多数情况下，类型推断会丢弃 const 修饰符，例如：

```cpp
int main()
{
    const int x { 5 }; // x has type const int
    auto y { x };      // y will be type int (const is dropped)
}
```

在上面的例子中，`x` 的类型本来是 `const int`，但是当使用 `x` 作为 `y` 的初始化值是，类型推断得到的结果是 `int` 而不是 `int const`。

如果你想要一个推导的类型是 `const`，你必须自己提供 `const`。为此，只需将关键字 `const` 与 `auto` 结合使用即可：

```cpp
int main()
{
    const int x { 5 };  // x has type const int
    auto y { x };       // y will be type int (const is dropped)

    const auto z { x }; // z will be type const int (const is reapplied)
}
```

在这个例子中，使用 `x` 作为初始化值进行类型推断的结果是 `int`(`const`被丢弃了)，但是因为我们在定义变量`z`时重新添加了 `const` 修饰符，所以 `z`的类型为 `const int`。

## `string`字面量的类型推断

出于某些历史原因，字符串在 C++ 中是一个特殊的类型。因此，下面的代码可能并不能如你所愿地工作：

```cpp
auto s { "Hello, world" }; // s will be type const char*, not std::string
```

如果你希望推导出的类型为 `std:: string` 或 `std:: string_view`，你需要使用 `s` 或者 `sv` 字面量后缀 (参考：[[4-15-Symbolic-constants-const-and-constexpr-variables|4.15 - 符号常量 const 和 constexpr 变量]]):

```cpp
#include <string>
#include <string_view>

int main()
{
    using namespace std::literals; // easiest way to access the s and sv suffixes

    auto s1 { "goo"s };  // "goo"s is a std::string literal, so s1 will be deduced as a std::string
    auto s2 { "moo"sv }; // "moo"sv is a std::string_view literal, so s2 will be deduced as a std::string_view

    return 0;
}
```


## 类型推断的优缺点

Type deduction is not only convenient, but also has a number of other benefits.

First, if two or more variables are defined on sequential lines, the names of the variables will be lined up, helping to increase readability:

```cpp
// harder to read
int a { 5 };
double b { 6.7 };

// easier to read
auto c { 5 };
auto d { 6.7 };
```

COPY

Second, type deduction only works on variables that have initializers, so if you are in the habit of using type deduction, it can help avoid unintentionally uninitialized variables:

```cpp
int x; // oops, we forgot to initialize x, but the compiler may not complain
auto y; // the compiler will error out because it can't deduce a type for y
```

COPY

Third, you are guaranteed that there will be no unintended performance-impacting conversions:

```cpp
double x { 5 }; // bad: implicitly converts 5 from an int to a double
auto y { 5 }; // good: y is an int (hopefully that's what you wanted) and no conversion takes place
```

Type deduction also has a few downsides.

First, type deduction obscures an object’s type information in the code. Although a good IDE should be able to show you the deduced type (e.g. when hovering a variable), it’s still a bit easier to make type-based mistakes when using type deduction.

For example:

```cpp
auto y { 5 }; // oops, we wanted a double here but we accidentally provided an int literal
```

In the above code, if we’d explicitly specified `y` as type double, `y` would have been a double even though we accidentally provided an int literal initializer. With type deduction, `y` will be deduced to be of type int.

Here’s another example:

```cpp
#include <iostream>

int main()
{
     auto x { 3 };
     auto y { 2 };

     std::cout << x / y; // oops, we wanted floating point division here

     return 0;
}
```

COPY

In this example, it’s less clear that we’re getting an integer division rather than a floating-point division.

Second, if the type of an initializer changes, the type of a variable using type deduction will also change, perhaps unexpectedly. Consider:

```cpp
auto sum { add(5, 6) + gravity };
```

COPY

If the return type of `add` changes from int to double, or `gravity` changes from int to double, `sum` will also change types from int to double.

Overall, the modern consensus is that type deduction is generally safe to use for objects, and that doing so can help make your code more readable by de-emphasizing type information so the logic of your code stands out better.

!!! success "最佳实践"

    Use type deduction for your variables, unless you need to commit to a specific type.

!!! info "作者注"

    In future lessons, we’ll continue to use explicit types instead of type deduction when we feel showing the type information is helpful to understanding a concept or example.
