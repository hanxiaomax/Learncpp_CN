---
title: 8.5 - 显式类型转换
alias: 8.5 - 显式类型转换
origin: /explicit-type-conversion-casting-and-static-cast/
origin_title: "8.5 -- Explicit type conversion (casting) and static_cast"
time: 2022-1-2
type: translation
tags:
- explicit-type-conversion
- conversions
- static-cast
---

??? note "关键点速记"
	- C++支持 5 种类型的显示类型转换: [[C-style-casts|C风格类型转换]]、[[static-casts|静态类型转换]]、[[const-cast|const 类型转换]]、[[dynamic-casts|动态类型转换]]和[[reinterpret-casts|重新解释类型转换]]。后四种类型有时称为[[named-cast|具名名类型转换(named cast)]]。
	- 

在 [[8-1-Implicit-type-conversion-coercion|8.1 - 隐式类型转换]]中我们介绍过，编译器可以隐式地将一种类型的值转换成另外一种类型，即[[implicit-type-conversion|隐式类型转换]]。当你想要将一个数值类型通过[[numeric promotions|数值提升]]的方式转换为更宽的类型时，使用隐式类型转换是可以的。

很多新手 C++ 程序员会这样做：

```cpp
double d = 10 / 4; // 通过整型乘法，将值初始化为 2.0
```


因为 `10` 和 `4` 都是 `int`类型，所以执行的是整型除法，表达式的求值结果为 `int` 值 `2`。然后，该值在被用于初始化变量 `d` 之前被转换成了 `double` 类型的 `2.0` 。 多数情况下，程序员并不会故意这么做。

下面这个例子中，我们使用了字面量，将上面的`int`型操作数替换成了`double`操作数，这样一来就会进行浮点数除法：

```cpp
double d = 10.0 / 4.0; // does floating point division, initializes d with value 2.5
```


但是，如果你使用的是变量而非字面量呢？考虑下面的例子：

```cpp
int x { 10 };
int y { 4 };
double d = x / y; // does integer division, initializes d with value 2.0
```

因为执行了整型除法，所以变量 `d`的值最终为`2.0`。那么我们应该如何告诉编译器，这里需要使用浮点数除法呢？字面量后缀并不能被用在变量上。因此，需要一种能够将变量转换为浮点类型的方法，以便使用浮点数除法。

幸运的是，C++提供了许多不同的类型转换操作符(通常称为类型转换)，程序员可以使用它们请求编译器执行类型转换。因为类型转换是程序员的显式请求，所以这种形式的类型转换通常称为[[explicit-type-conversion|显式类型转换]](与隐式类型转换相反，隐式类型转换是编译器自动执行的类型转换)。


## 类型转换


C++支持 5 种类型的显示类型转换: [[C-style-casts|C风格类型转换]]、[[static-casts|静态类型转换]]、[[const-cast|const 类型转换]]、[[dynamic-casts|动态类型转换]]和[[reinterpret-casts|重新解释类型转换]]。后四种类型有时称为[[named-cast|具名名类型转换(named cast)]]。

在本课中，我们将介绍**C风格类型转换**和**静态类型转换**。


!!! info "相关内容"

	我们会在[18.10 -- Dynamic casting](https://www.learncpp.com/cpp-tutorial/dynamic-casting/)中介绍动态类型转换，但是我们首先要介绍一些前置内容。

通常应该避免使用**const 类型转换**和**重新解释类型转换**，因为只有很少的情况下会需要使用它们，而且使用不当是非常有害的。

!!! warning "注意"

	除非你有充分的理由，否则请避免使用**const 类型转换**和**重新解释类型转换**

## C语言风格的类型转换

在标准的C语言中，强制转换是通过`()`运算符完成的，括号内为需要转换的类型名。在C++中，你仍然可以在由C语言转换而来的代码中看到它们。

例如：

```cpp
#include <iostream>

int main()
{
    int x { 10 };
    int y { 4 };


    double d { (double)x / y }; // convert x to a double so we get floating point division
    std::cout << d; // prints 2.5

    return 0;
}
```


在上面的程序中，我们使用了一个C语言风格的类型转换，要求编译器将`x`转换为`double`。因为，`/`左侧的操作数被转换成了浮点数，所以操作符右侧的数同样也会被转换为浮点数（[[numeric-conversions|数值转换]]），然后表达式就会按照浮点数除法而不是整型除法求值！

C++ 允许你使用一种更加类似函数调用的语法来使用C语言风格的类型转换：

```cpp
double d { double(x) / y }; // convert x to a double so we get floating point division
```


这种方式实现的类型转换和之前一种是完全一样的，但是将需要转换的变量放在括号了，geng'roThis performs identically to the prior example, but has the benefit of parenthesizing the value being converted (making it easier to tell what is being converted).

Although a `C-style cast` appears to be a single cast, it can actually perform a variety of different conversions depending on context. This can include a `static cast`, a `const cast` or a `reinterpret cast` (the latter two of which we mentioned above you should avoid). As a result, `C-style casts`are at risk for being inadvertently misused and not producing the expected behavior, something which is easily avoidable by using the C++ casts instead.

!!! info "相关内容"

	If you’re curious, [this article](https://anteru.net/blog/2007/c-background-static-reinterpret-and-c-style-casts/) has more information on how C-style casts actually work.

!!! success "最佳实践"

	Avoid using C-style casts.

## `static_cast`

C++ introduces a casting operator called static_cast, which can be used to convert a value of one type to a value of another type.

You’ve previously seen `static_cast` used to convert a `char` into an `int` so that std::cout prints it as an integer instead of a `char`:

```cpp
#include <iostream>

int main()
{
    char c { 'a' };
    std::cout << c << ' ' << static_cast<int>(c) << '\n'; // prints a 97

    return 0;
}
```


The `static_cast` operator takes an expression as input, and returns the evaluated value converted to the type specified inside the angled brackets. `static_cast` is best used to convert one fundamental type into another.

```cpp
#include <iostream>

int main()
{
    int x { 10 };
    int y { 4 };

    // static cast x to a double so we get floating point division
    double d { static_cast<double>(x) / y };
    std::cout << d; // prints 2.5

    return 0;
}
```


The main advantage of `static_cast` is that it provides compile-time type checking, making it harder to make an inadvertent error. `static_cast` is also (intentionally) less powerful than `C-style casts`, so you can’t inadvertently remove `const` or do other things you may not have intended to do.

!!! success "最佳实践"

	Favor static_cast when you need to convert a value from one type to another type.

Using static_cast to make narrowing conversions explicit

Compilers will often issue warnings when a potentially unsafe (narrowing) implicit type conversion is performed. For example, consider the following program:

```cpp
int i { 48 };
char ch = i; // implicit narrowing conversion
```

Casting an `int` (2 or 4 bytes) to a `char` (1 byte) is potentially unsafe (as the compiler can’t tell whether the integer value will overflow the range of the `char` or not), and so the compiler will typically print a warning. If we used list initialization, the compiler would yield an error.

To get around this, we can use a static cast to explicitly convert our integer to a `char`:

```cpp
int i { 48 };

// explicit conversion from int to char, so that a char is assigned to variable ch
char ch { static_cast<char>(i) };
```



When we do this, we’re explicitly telling the compiler that this conversion is intended, and we accept responsibility for the consequences (e.g. overflowing the range of a `char` if that happens). Since the output of this `static_cast` is of type `char`, the initialization of variable `ch` doesn’t generate any type mismatches, and hence no warnings or errors.

Here’s another example where the compiler will typically complain that converting a `double` to an `int` may result in loss of data:

```cpp
int i { 100 };
i = i / 2.5;
```



To tell the compiler that we explicitly mean to do this:

```cpp
int i { 100 };
i = static_cast<int>(i / 2.5);
```