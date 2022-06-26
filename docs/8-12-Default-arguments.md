---
title: 8.12 - 默认参数
alias: 8.12 - 默认参数
origin: /none/
origin_title: "8.12 — Default arguments"
time: 2022-4-4
type: translation
tags:
- default
---

??? note "关键点速记"
	

A default argument is a default value provided for a function parameter. For example:

```cpp
void print(int x, int y=10) // 10 is the default argument
{
    std::cout << "x: " << x << '\n';
    std::cout << "y: " << y << '\n';
}
```

COPY

When making a function call, the caller can optionally provide an argument for any function parameter that has a default argument. If the caller provides an argument, the value of the argument in the function call is used. If the caller does not provide an argument, the value of the default argument is used.

Consider the following program:

```cpp
#include <iostream>

void print(int x, int y=4) // 4 is the default argument
{
    std::cout << "x: " << x << '\n';
    std::cout << "y: " << y << '\n';
}

int main()
{
    print(1, 2); // y will use user-supplied argument 2
    print(3); // y will use default argument 4

}
```

COPY

This program produces the following output:

```
x: 1
y: 2
x: 3
y: 4
```

In the first function call, the caller supplied explicit arguments for both parameters, so those argument values are used. In the second function call, the caller omitted the second argument, so the default value of `4` was used.

Note that you must use the equals sign to specify a default argument. Using parenthesis or brace initialization won’t work:

```cpp
void foo(int x = 5);   // ok
void goo(int x ( 5 )); // compile error
void boo(int x { 5 }); // compile error
```

COPY

## When to use default arguments

Default arguments are an excellent option when a function needs a value that has a reasonable default value, but for which you want to let the caller override if they wish.

For example, here are a couple of function prototypes for which default arguments might be commonly used:

```cpp
int rollDie(int sides=6);
void openLogFile(std::string filename="default.log");
```

COPY

Author’s note

Because the user can choose whether to supply a specific argument value or use the default value, a parameter with a default value provided is sometimes called an optional parameter. However, the term _optional parameter_ is also used to refer to several other types of parameters (including parameters passed by address, and parameters using `std::optional`), so we recommend avoiding this term.

## Multiple default arguments

A function can have multiple parameters with default arguments:

```cpp
#include <iostream>

void print(int x=10, int y=20, int z=30)
{
    std::cout << "Values: " << x << " " << y << " " << z << '\n';
}

int main()
{
    print(1, 2, 3); // all explicit arguments
    print(1, 2); // rightmost argument defaulted
    print(1); // two rightmost arguments defaulted
    print(); // all arguments defaulted

    return 0;
}
```

COPY

The following output is produced:

```
Values: 1 2 3
Values: 1 2 30
Values: 1 20 30
Values: 10 20 30
```
C++ does not (as of C++20) support a function call syntax such as `print(,,3)` (as a way to provide an explicit value for `z` while using the default arguments for `x` and `y`. This has two major consequences:

1.  Default arguments can only be supplied for the rightmost parameters. The following is not allowed:

```cpp
void print(int x=10, int y); // not allowed
```

COPY

!!! note "法则"

	Default arguments can only be provided for the rightmost parameters.

2.  If more than one default argument exists, the leftmost default argument should be the one most likely to be explicitly set by the user.

Default arguments can not be redeclared

Once declared, a default argument can not be redeclared (in the same file). That means for a function with a forward declaration and a function definition, the default argument can be declared in either the forward declaration or the function definition, but not both.

```cpp
#include <iostream>

void print(int x, int y=4); // forward declaration

void print(int x, int y=4) // error: redefinition of default argument
{
    std::cout << "x: " << x << '\n';
    std::cout << "y: " << y << '\n';
}
```

COPY

Best practice is to declare the default argument in the forward declaration and not in the function definition, as the forward declaration is more likely to be seen by other files (particularly if it’s in a header file).

in foo.h:

```cpp title="foo.h"
#ifndef FOO_H
#define FOO_H
void print(int x, int y=4);
#endif
```

COPY

in main.cpp:

```cpp title="main.cpp"
#include "foo.h"
#include <iostream>

void print(int x, int y)
{
    std::cout << "x: " << x << '\n';
    std::cout << "y: " << y << '\n';
}

int main()
{
    print(5);

    return 0;
}
```

COPY

Note that in the above example, we’re able to use the default argument for function `print()` because `main.cpp` #includes `foo.h`, which has the forward declaration that defines the default argument.

!!! success "最佳实践"

	If the function has a forward declaration (especially one in a header file), put the default argument there. Otherwise, put the default argument in the function definition.

## Default arguments and function overloading

Functions with default arguments may be overloaded. For example, the following is allowed:

```cpp
void print(std::string string)
{
}

void print(char ch=' ')
{
}

int main()
{
    print("Hello, world"); // resolves to print(std::string)
    print('a'); // resolves to print(char)
    print(); // resolves to print(char)

    return 0;
}
```

COPY

The function call to `print()` acts as if the user had explicitly called `print(' ')`, which resolves to `print(char)`.

Now consider this case:

```cpp
void print(int x);
void print(int x, int y = 10);
void print(int x, double y = 20.5);
```

COPY

Parameters with default values will differentiate a function overload (meaning the above will compile).  
However, such functions can lead to potentially ambiguous function calls. For example:

```cpp
print(1, 2); // will resolve to print(int, int)
print(1, 2.5); // will resolve to print(int, double)
print(1); // ambiguous function call
```

COPY

In the last case, the compiler is unable to tell whether `print(1)` should resolve to `print(int)` or one of the two function calls where the second parameter has a default value. The result is an ambiguous function call.

## Summary

Default arguments provide a useful mechanism to specify values for parameters that the user may or may not want to override. They are frequently used in C++, and you’ll see them a lot in future lessons.

