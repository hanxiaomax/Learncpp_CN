---
title: 11-x-chapter-11-summary-and-quiz
aliases: 11-x-chapter-11-summary-and-quiz
origin: 
origin_title: 11-x-chapter-11-summary-and-quiz
time: 2025-04-01 
type: translation-under-construction
tags:
---
# 11.x — Chapter 11 summary and quiz

[*Alex*](https://www.learncpp.com/author/Alex/ "View all posts by Alex")

December 28, 2023, 5:30 pm PST
September 28, 2024

Nice work. Function templates may seem pretty complex, but they are a very powerful way to make your code work with objects of different types. We’ll see a lot more template stuff in future chapters, so hold on to your hat.

Chapter Review

**Function overloading** allows us to create multiple functions with the same name, so long as each identically named function has different set of parameter types (or the functions can be otherwise differentiated). Such a function is called an **overloaded function** (or **overload** for short). Return types are not considered for differentiation.

When resolving overloaded functions, if an exact match isn’t found, the compiler will favor overloaded functions that can be matched via numeric promotions over those that require numeric conversions. When a function call is made to function that has been overloaded, the compiler will try to match the function call to the appropriate overload based on the arguments used in the function call. This is called **overload resolution**.

An **ambiguous match** occurs when the compiler finds two or more functions that can match a function call to an overloaded function and can’t determine which one is best.

A **default argument** is a default value provided for a function parameter. Parameters with default arguments must always be the rightmost parameters, and they are not used to differentiate functions when resolving overloaded functions.

**Function templates** allow us to create a function-like definition that serves as a pattern for creating related functions. In a function template, we use **type template parameters** as placeholders for any types we want to be specified later. The syntax that tells the compiler we’re defining a template and declares the template types is called a **template parameter declaration**.

The process of creating functions (with specific types) from function templates (with template types) is called **function template instantiation** (or **instantiation**) for short. When this process happens due to a function call, it’s called **implicit instantiation**. An instantiated function is called a **function instance** (or **instance** for short, or sometimes a **template function**).

**Template argument deduction** allows the compiler to deduce the actual type that should be used to instantiate a function from the arguments of the function call. Template argument deduction does not do type conversion.

Template types are sometimes called **generic types**, and programming using templates is sometimes called **generic programming**.

In C++20, when the auto keyword is used as a parameter type in a normal function, the compiler will automatically convert the function into a function template with each auto parameter becoming an independent template type parameter. This method for creating a function template is called an **abbreviated function template**.

A **non-type template parameter** is a template parameter with a fixed type that serves as a placeholder for a constexpr value passed in as a template argument.

Quiz time

Question #1

1a) What is the output of this program and why?

```cpp
#include <iostream>

void print(int x)
{
    std::cout << "int " << x << '\n';
}

void print(double x)
{
    std::cout << "double " << x << '\n';
}

int main()
{
    short s { 5 };
    print(s);

    return 0;
}
```

\[Show Solution\](javascript:void(0))

The output is `int 5`. Converting a `short` to an `int` is a numeric promotion, whereas converting a `short` to a `double` is a numeric conversion. The compiler will favor the option that is a numeric promotion over the option that is a numeric conversion.

1b) Why won’t the following compile?

```cpp
#include <iostream>

void print()
{
    std::cout << "void\n";
}

void print(int x=0)
{
    std::cout << "int " << x << '\n';
}

void print(double x)
{
    std::cout << "double " << x << '\n';
}

int main()
{
    print(5.0f);
    print();

    return 0;
}
```

\[Show Solution\](javascript:void(0))

Because parameters with default arguments aren’t counted for resolving overloaded functions, the compiler can’t tell whether the call to `print()` should resolve to `print()` or `print(int x=0)`.

1c) Why won’t the following compile?

```cpp
#include <iostream>

void print(long x)
{
    std::cout << "long " << x << '\n';
}

void print(double x)
{
    std::cout << "double " << x << '\n';
}

int main()
{
    print(5);

    return 0;
}
```

\[Show Solution\](javascript:void(0))

The literal 5 is an `int`. Converting an `int` to a `long` or a `double` is a numeric conversion, and the compiler will be unable to determine which function is a better match.

Question #2

> Step #1

Write a function template named `add()` that allows the users to add 2 values of the same type. The following program should run:

```cpp
#include <iostream>

// write your add function template here

int main()
{
	std::cout << add(2, 3) << '\n';
	std::cout << add(1.2, 3.4) << '\n';

	return 0;
}
```

and produce the following output:

```cpp
5
4.6

```

\[Show Solution\](javascript:void(0))

```cpp
#include <iostream>

template <typename T>
T add(T x, T y)
{
	return x + y;
}

int main()
{
	std::cout << add(2, 3) << '\n';
	std::cout << add(1.2, 3.4) << '\n';

	return 0;
}
```

> Step #2

Write a function template named `mult()` that allows the user to multiply one value of any type (first parameter) and an integer (second parameter). The second parameter should not be a template type. The function should return the same type as the first parameter. The following program should run:

```cpp
#include <iostream>

// write your mult function template here

int main()
{
	std::cout << mult(2, 3) << '\n';
	std::cout << mult(1.2, 3) << '\n';

	return 0;
}
```

and produce the following output:

```cpp
6
3.6

```

\[Show Solution\](javascript:void(0))

```cpp
#include <iostream>

template <typename T>
T mult(T x, int y)
{
	return x * y;
}

int main()
{
	std::cout << mult(2, 3) << '\n';
	std::cout << mult(1.2, 3) << '\n';

	return 0;
}
```

> Step #3

Write a function template named `sub()` that allows the user to subtract two values of different types. The following program should run:

```cpp
#include <iostream>

// write your sub function template here

int main()
{
	std::cout << sub(3, 2) << '\n';
	std::cout << sub(3.5, 2) << '\n';
	std::cout << sub(4, 1.5) << '\n';

	return 0;
}
```

and produce the following output:

```cpp
1
1.5
2.5

```

\[Show Solution\](javascript:void(0))

```cpp
#include <iostream>

template <typename T, typename U>
auto sub(T x, U y)
{
	return x - y;
}

/* 
//If C++20 capable, you can use an abbreviated function template instead
auto sub(auto x, auto y)
{
	return x - y;
}
*/

int main()
{
	std::cout << sub(3, 2) << '\n';
	std::cout << sub(3.5, 2) << '\n';
	std::cout << sub(4, 1.5) << '\n';

	return 0;
}
```

Question #3

What is the output of this program and why?

```cpp
#include <iostream>

template <typename T>
int count(T) // This is the same as int count(T x), except we're not giving the parameter a name since we don't use the parameter
{
    static int c { 0 };
    return ++c;
}

int main()
{
    std::cout << count(1) << '\n';
    std::cout << count(1) << '\n';
    std::cout << count(2.3) << '\n';
    std::cout << count<double>(1) << '\n';
    
    return 0;
}
```

\[Show Solution\](javascript:void(0))

```cpp
1
2
1
2

```

When `count(1)` is called, the compiler will instantiate the function `count<int>(int)` and call it. This will return value `1`.

When `count(1)` is called again, the compiler will see that `count<int>(int)` already exists, and call it again. This will return value `2`.

When `count(2.3)` is called, the compiler will instantiate the function with prototype `count<double>(double)` and call it. This is a new function with its own `static c` variable, so this will return value `1`.

When `count<double>(1)` is called, the compiler will see that we’re explicitly requesting the double version of `count()`. This function already exists due to the prior statement, so `count<double>(double)` will be called and the `int` argument will be implicitly converted to a `double`. This function will return value `2`.

Question #4

What is the output of this program?

```cpp
#include <iostream>

int foo(int n)
{
    return n + 10;
}

template <typename T>
int foo(T n)
{
    return n;
}

int main()
{
    std::cout << foo(1) << '\n'; // #1

    short s { 2 };
    std::cout << foo(s) << '\n'; // #2
    
    std::cout << foo<int>(4) << '\n'; // #3

    std::cout << foo<int>(s) << '\n'; // #4

    std::cout << foo<>(6) << '\n'; // #5
    
    return 0;
}
```

\[Show Solution\](javascript:void(0))

```cpp
11
2
4
2
6

```

In case 1, `foo(1)` matches `foo(int)` exactly, so non-template function `foo(int)` is called.

In case 2, `foo(s)` does not match non-template function `foo(int)` exactly, but the argument `s` can be converted to an `int` so `foo(int)` is a candidate. However, the compiler will prefer to use function template `foo<T>(T)` to stencil out exact match `foo<short>(short)`. So this calls `foo<short>(short)`.

In case 3, `foo<int>(4)` is an explicit call to `foo<int>`, so `foo(int)` isn’t considered. The compiler stencils out `foo<int>(int)` and calls it.

In case 4, this is also an explicit call to `foo<int>`. The compiler promotes argument `s` to an `int` to match the parameter.

In case 5, this syntax will only match function templates, so `foo(int)` is not considered. `foo<int>(int)` is called.

\[Next lesson

F.1Constexpr functions\](https://www.learncpp.com/cpp-tutorial/constexpr-functions/)
[Back to table of contents](/)
\[Previous lesson

11.10Using function templates in multiple files\](https://www.learncpp.com/cpp-tutorial/using-function-templates-in-multiple-files/)

*Previous Post*[8.15 — Global random numbers (Random.h)](https://www.learncpp.com/cpp-tutorial/global-random-numbers-random-h/)

*Next Post*[16.5 — Returning std::vector, and an introduction to move semantics](https://www.learncpp.com/cpp-tutorial/returning-stdvector-and-an-introduction-to-move-semantics/)

\[wpDiscuz\](javascript:void(0);)

Insert

You are going to send email to

Send

Move Comment

Move
