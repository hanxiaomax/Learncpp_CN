---
title: 7.1 - 复合语句（语句块）
alias: 7.1 - 复合语句（语句块）
origin: /compound-statements-blocks/
origin_title: "6.1 — Compound statements (blocks)"
time: 2021-8-5
type: translation
tags:
- statement
---

> [!note] "Key Takeaway"
> - 函数的嵌套层数不要超过3层。如果你的函数嵌套过高，请考虑将其分解为多个子函数

复合语句（也称为语块，句块）指的是包含**零个**或多个语句的组合。同时，编译器会将它们看做是一个单独的语句。

语句块以 `{` 开头，以 `}` 结尾，需要执行的语句放在中间。任何能够使用单独语句的地方，也都可以使用语句块。在语句块的末尾不需要添加分号。

在学习函数的时候我们已经见过这样的结构了，函数体就是一个块：

```cpp
int add(int x, int y)
{ // start block
    return x + y;
} // end block (no semicolon)

int main()
{ // start block

    // multiple statements
    int value {}; // this is initialization, not a block
    add(3, 4);

    return 0;

} // end block (no semicolon)
```


## 语句块嵌套

尽管函数体内不能嵌入其他函数，但是语句块中是可以嵌入其他语句块的：

```cpp
int add(int x, int y)
{ // block
    return x + y;
} // end block

int main()
{ // outer block

    // multiple statements
    int value {};

    { // inner/nested block
        add(3, 4);
    } // end inner/nested block

    return 0;

} // end outer block
```


当语句块嵌套之后，包含其他语句块的语句块称为**外层语句块**，被包含的语句块称为**内层语句块**或者嵌套语句块。

## 使用语句块按条件执行多条语句

语句块最常用的场景是配合 if 语句来使用。默认情况下，if 语句当条件求值为真时，会执行一条语句。不过，我们可以使用语句块来替换单图语句，这样 if 就能够在求值为真时，执行多条语句。

例如：

```cpp
#include <iostream>

int main()
{ // start of outer block
    std::cout << "Enter an integer: ";
    int value {};
    std::cin >> value;

    if (value >= 0)
    { // start of nested block
        std::cout << value << " is a positive integer (or zero)\n";
        std::cout << "Double this number is " << value * 2 << '\n';
    } // end of nested block
    else
    { // start of another nested block
        std::cout << value << " is a negative integer\n";
        std::cout << "The positive of this number is " << -value << '\n';
    } // end of another nested block

    return 0;
} // end of outer block
```


如果用户输入的是 3：

```
Enter an integer: 3
3 is a positive integer (or zero)
Double this number is 6
```

如果用户输入的是 4：

```
Enter an integer: -4
-4 is a negative integer
The positive of this number is 4
```

## 语句块嵌套的层数

在语句块中嵌套语句块，再嵌套语句块也是可以的：

```cpp
int main()
{ // block 1, nesting level 1
    std::cout << "Enter an integer: ";
    int value {};
    std::cin >> value;

    if (value >  0)
    { // block 2, nesting level 2
        if ((value % 2) == 0)
        { // block 3, nesting level 3
            std::cout << value << " is positive and even\n";
        }
        else
        { // block 4, also nesting level 3
            std::cout << value << " is positive and odd\n";
        }
    }

    return 0;
}
```


函数的嵌套层数 (也称为嵌套深度) 指的是函数中嵌套语句块的最大值（包括最外层语句块）。上面的代码中，一共有4个语句块，但是嵌套层数为 3，因为在这个程序中任意位置你不可能处在大于3层的嵌套中。

C++ 标准写道，C++编译器需要支持 256 层嵌套——但是并不是所有编译器都这么做了（例如，截止到本文撰写时，Visual Studio 支持的嵌套层数在100到110之间）。

不管 C++ 在技术上支持多少层嵌套，在我们编写代码时，嵌套层数最好不要超过3。就像特别长的函数应该重构（重写为更小的函数）一样，过度嵌套的函数难以阅读，嵌套最严重的语句块也应该被重构为单独的函数。

> [!success] "最佳实践"
> 函数的嵌套层数不要超过3层。如果你的函数嵌套过高，请考虑将其分解为多个子函数
	