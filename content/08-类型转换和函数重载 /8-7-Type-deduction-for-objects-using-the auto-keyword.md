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

> [!note] "Key Takeaway"
> - 类型推断必须配合变量初始化值使用，这样可以忘记初始化的变量
> - 类型推断会丢弃 `const`，必须额外添加 `const auto`
> - 如果希望字符串推断出的类型为 `std:: string` 或 `std:: string_view`，你需要使用 `s` 或者 `sv` 字面量后缀


在下面这个简单的变量定义中，存在一个难以察觉的冗余点：

```cpp
double d{ 5.0 };
```

因为 C++ 属于强类型语言，所以我们必须为每一个对象指明其类型。因此，这里我们显式地指明了变量 `d` 的类型为 `double`。

但是，既然被用来初始化 `d` 的[[literals|字面量]]`5.0` 已经是 `double` 类型的了，难道再为 d 指定 `double` 不多于吗？

> [!info] "相关内容"
> 关于字面量的类型，参见[[4-15-Literals|4.15 - 字面量]]。

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

> [!info] "相关内容"
> 指针和引用的类型推断有些复杂，我们会在 [[9-12-Type-deduction-with-pointers-references-and-const|9.12 - 指针、引用和 const 的类型推断]] 中进行介绍。

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

如果你想要一个推断的类型是 `const`，你必须自己提供 `const`。为此，只需将关键字 `const` 与 `auto` 结合使用即可：

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

如果你希望推断出的类型为 `std:: string` 或 `std:: string_view`，你需要使用 `s` 或者 `sv` 字面量后缀 (参考：[[4-13-Const-variables-and-symbolic-constants|4.13 - const 变量和符号常量]]):

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

类型推断不仅方便，还有其他一些有用的地方。

首先，在连续定义多个变量的情况下，使用类型推断可以让变量名对齐，提高代码的可读性：

```cpp
// harder to read
int a { 5 };
double b { 6.7 };

// easier to read
auto c { 5 };
auto d { 6.7 };
```


其次，类型推断只能够在具有变量初始化值是才能使用，如果我们养成了使用类型推断的习惯的话，可以很容易地避免未初始化的变量：

```cpp
int x; // oops, we forgot to initialize x, but the compiler may not complain
auto y; // the compiler will error out because it can't deduce a type for y
```

第三，通过类型推断，可以确保不发生对性能产生影响的类型转换：

```cpp
double x { 5 }; // 不好: int 被隐式转换为 double
auto y { 5 }; // 好：y 是 int 并不会发生类型转换
```

当然，类型推断也有一些缺点。

首先，类型推断模糊化了代码中的类型信息。尽管优秀的 IDE 可以显示推断后的类型（例如，当鼠标悬浮在变量上时），但是在使用类型推断时更容易发生与类型相关的错误。

例如：
```cpp
auto y { 5 }; // oops, we wanted a double here but we accidentally provided an int literal
```

在上面的代码中，如果我们显式地将 `y` 指定为 `double` 类型，那么即使我们意外地为 `y` 提供了一个 `int` 字面量的初始化值，`y` 仍然还是 `double` 类型，而如果使用类型推演，`y` 将被推演为 `int` 类型。

再看下面这个例子：

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

在这个例子中，使用类型推断就不容易看出下面进行的是整数除法而不是浮点除法。

其次，如果初始化式的类型改变，使用类型演绎的变量的类型也会改变，此时可能会发生意外的问题。例如：


```cpp
auto sum { add(5, 6) + gravity };
```


如果`add`函数的返回值类型从`int`被修改为`double`了，或者 `gravity` 的类型从`int`被修改为`double`了，那么 `sum` 的类型同样会被重新推断为`double`。

总的来说，现代 C++ 的共识是，类型演绎用于对象通常是安全的，这样做可以减少对类型信息的强调，从而更好地凸显代码的逻辑，依次来增强代码的可读性。


> [!success] "最佳实践"
> 对变量使用类型演绎，除非需要确保使用特定的类型。

> [!info] "作者注"
> 在以后的课程中，当我们认为显示类型信息有助于理解概念或示例时，我们将继续使用显式类型，而不是类型推断。
	
