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

因为执行了整型除法，所以变量 `d`的值最终为`2.0`。那么我们应该如何告诉编译器，这里需要使用浮点数除法呢？字面量后缀并不能被用在变量上。我们需要一种能够将变量转换为浮点类型的方法，所以 We need some way to convert one (or both) of the variable operands to a floating point type, so that floating point division will be used instead.

Fortunately, C++ comes with a number of different type casting operators (more commonly called casts) that can be used by the programmer to request that the compiler perform a type conversion. Because casts are explicit requests by the programmer, this form of type conversion is often called an explicit type conversion (as opposed to implicit type conversion, where the compiler performs a type conversion automatically).

## 类型转换

C++ supports 5 different types of casts: `C-style casts`, `static casts`, `const casts`, `dynamic casts`, and `reinterpret casts`. The latter four are sometimes referred to as named casts.

We’ll cover `C-style casts` and `static casts` in this lesson.

!!! info "相关内容"

	We discuss dynamic casts in lesson [18.10 -- Dynamic casting](https://www.learncpp.com/cpp-tutorial/dynamic-casting/), after we’ve covered other prerequisite topics.

`Const casts` and `reinterpret casts` should generally be avoided because they are only useful in rare cases and can be harmful if used incorrectly.

!!! warning "注意"

	Avoid const casts and reinterpret casts unless you have a very good reason to use them.

## C语言风格的类型转换

In standard C programming, casts are done via the () operator, with the name of the type to convert the value placed inside the parenthesis. You may still see these used in code (or by programmers) that have been converted from C.

For example:

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


In the above program, we use a C-style cast to tell the compiler to convert `x` to a `double`. Because the left operand of operator/ now evaluates to a floating point value, the right operand will be converted to a floating point value as well, and the division will be done using floating point division instead of integer division!

C++ will also let you use a `C-style cast` with a more function-call like syntax:

```cpp
double d { double(x) / y }; // convert x to a double so we get floating point division
```


This performs identically to the prior example, but has the benefit of parenthesizing the value being converted (making it easier to tell what is being converted).

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