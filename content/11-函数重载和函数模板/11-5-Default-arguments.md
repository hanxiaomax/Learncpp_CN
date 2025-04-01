---
title: 11.5 - 默认参数
alias: 11.5 - 默认参数
origin: /none/
origin_title: "8.12 — Default arguments"
time: 2022-4-4
type: translation
tags:
- default
---

> [!note] "Key Takeaway"
> - 默认参数：`void print(int x, int y=10) // 10 is the default argument`
> - 默认参数只能提供给最右边的形参
> - 如果函数有前向声明(特别是在头文件中)，则将默认参数放在那里。否则，将默认实参放入函数定义中。
> - 带有默认参数的函数可以重载，但是容易造成[[ambiguous-match|不明确匹配]]

默认[[arguments|实参]]是为函数[[parameters|形参]]提供的默认值。例如：

```cpp
void print(int x, int y=10) // 10 is the default argument
{
    std::cout << "x: " << x << '\n';
    std::cout << "y: " << y << '\n';
}
```

在进行函数调用时，调用方可以有选择地为任何具有默认实参的函数形参提供实参。如果调用方提供了参数，则使用函数调用中参数的值。如果调用方没有提供实参，则使用默认实参的值。

考虑以下程序:

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

这个程序产生以下输出：

```
x: 1
y: 2
x: 3
y: 4
```

在第一个函数调用中，调用者为两个形参提供了显式参数，因此使用了这些参数值。在第二个函数调用中，调用者省略了第二个参数，因此使用了默认值 `4` 。

注意，必须使用等号来指定默认参数。使用圆括号或大括号初始化不起作用:

```cpp
void foo(int x = 5);   // ok
void goo(int x ( 5 )); // compile error
void boo(int x { 5 }); // compile error
```

## 何时使用默认实参

当函数需要一个合理的默认值的值时，默认参数是一个很好的选择。同时，这种方法还允许调用者修改该值(如果他们愿意的话)。

例如，下面是一些常用默认实参的函数原型:

```cpp
int rollDie(int sides=6);
void openLogFile(std::string filename="default.log");
```
> [!info] "作者注"
> 因为用户可以选择是提供一个特定的实参值还是使用默认值，所以提供了默认值的形参有时被称为**可选形参**。但是，术语[[optional-parameter|可选参数(optional parameter)]]也用于指代其他几种类型的参数(包括通过[[pass-by-address|传地址(pass-by-address)]]方式传递的参数，以及使用 `std:: optional` 传递的参数)，所以建议避免使用这个术语。

## 多个默认参数

一个函数可以有多个带默认实参的形参:

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

上述代码输出的结果如下：

```
Values: 1 2 3
Values: 1 2 30
Values: 1 20 30
Values: 10 20 30
```

C++ 并不支持形如 `print(,,3)` 语法的函数调用——即为 `z` 提供一个值，同时使用 `x` 和 `y` 的默认值。这会带来两个问题：

1.  默认参数只能提供给最右边的形参。下面的语法是不允许的：

```cpp
void print(int x=10, int y); // not allowed
```

> [!note] "法则"
> 默认参数只能提供给最右边的形参。

2.  如果需要为函数设置多个默认参数，则最左边的默认参数应该是用户最有可能进行**主动覆盖**的参数。

## 默认实参不能被重复声明

一旦声明完成，默认实参就不能(在同一个文件中)被重新声明。也就是说，对于具有[[forward-declaration|前向声明]]和函数定义的函数，默认实参可以在前向声明或函数定义中声明，但不能同时在两者中声明。

```cpp
#include <iostream>

void print(int x, int y=4); // forward declaration

void print(int x, int y=4) // error: redefinition of default argument
{
    std::cout << "x: " << x << '\n';
    std::cout << "y: " << y << '\n';
}
```

**最佳实践**是在前向声明而不是在定义中声明默认参数，因为前向声明更容易被其他文件看到(特别是在头文件中)。

```cpp title="foo.h"
#ifndef FOO_H
#define FOO_H
void print(int x, int y=4);
#endif
```

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

注意，在上面的例子中，我们能够使用函数 `print()` 的默认实参，因为 `main.cpp`  `#include ` 了 `foo.h` ， `foo.h` 的前向声明定义了默认实参。

> [!success] "最佳实践"
> 如果函数有前向声明(特别是在头文件中)，则将默认参数放在那里。否则，将默认实参放入函数定义中。

## 默认参数和函数重载

带有默认参数的函数可以重载。例如，以下是允许的：

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

`print()` 函数的效果和用户显式调用 `print(' ')` 是一样的，它会匹配 `print(char)`。

再考虑下面的例子：

```cpp
void print(int x);
void print(int x, int y = 10);
void print(int x, double y = 20.5);
```

带有默认值的参数可以用于区分函数重载(意味着上面的代码可以编译)。然而，这样的函数可能会导致潜在的[[ambiguous-match|不明确匹配]]，例如：

```cpp
print(1, 2); // will resolve to print(int, int)
print(1, 2.5); // will resolve to print(int, double)
print(1); // ambiguous function call
```

在最后一种情况下，编译器无法判断 `print(1)` 是应该解析为 `print(int)` 还是第二个形参有默认值的两个函数（之一），导致一个不明确匹配错误。

## 小结

默认参数提供了一种有用的机制，可以为用户希望或不希望重写的参数指定默认值，这在 C++中很常见，在以后的课程中你会看到很多。
