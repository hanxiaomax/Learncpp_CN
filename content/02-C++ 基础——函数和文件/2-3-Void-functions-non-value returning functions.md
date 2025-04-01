---
title: 2.3 - void 函数
alias: 2.3 - void 函数
origin: /void-functions-non-value-returning-functions/
origin_title: "2.3 — Void functions (non-value returning functions"
time: 2022-1-2
type: translation
tags:
- void
---

在[[2-1-Introduction-to-functions|2.1 - 函数简介]]中，我们介绍了函数定义的语法应该像下面这样：

```bash
return-type identifier() // identifier replaced with the name of your function
{
// Your code here
}
```

尽管我们已经见过一些返回值类型为 `void` 的函数的例子了，但是课程中并未介绍该类型的具体含义。在这节课中，我们将主要研究返回值类型为 `void` 的函数。

## 返回空值

被调函数无需向主调函数返回值，而为了将该信息告知编译器，定义函数时需要使用 `void` 作为返回值类型。例如：

```cpp
#include <iostream>

// void 表示该函数无需返回值给主调函数
void printHi()
{
    std::cout << "Hi" << '\n';

    // 函数不返会只，因此也无需 return 语句
}

int main()
{
    printHi(); // okay: 函数 printHi() 被调用，无返回值

    return 0;
}
```

在上面的例子中，`printHi` 函数具有其特定的功能（打印 "Hi"），但是它不必将 任何值返回给主调函数。因此，在定义 `printHi` 函数时使用了 `void` 作为返回值类型。

当 `main` 函数调用 `printHi` 时，`printHi` 函数体中的代码会被执行，“Hi” 被打印在屏幕上。随后控制权交还给主调函数，程序继续向下执行。

不返还任何值的函数，称为无返回值函数（或空函数）。

## Void 函数无需 return 语句

空函数会在函数的末尾自动返回主调函数，无需 return 语句。

不带返回值的 return 语句可以被用在 void 函数中——该语句执行时会导致该函数返回主调函数，这和函数运行到结尾时返回的效果是一样的。因此，将一个不带返回值的 return 语句放在函数末尾是多余的：

```cpp
#include <iostream>

// void means the function does not return a value to the caller
void printHi()
{
    std::cout << "Hi" << '\n';

    return; // tell compiler to return to the caller -- this is redundant since this will happen anyway!
} // function will return to caller here

int main()
{
    printHi();

    return 0;
}
```

> [!success] "最佳实践"
> 不要在不具有返回值的函数末尾添加 return 语句。

## Void 函数不能被用在需要值的表达式

有些类型的表达式是需要一个值的，例如:

```cpp
#include <iostream>

int main()
{
    std::cout << 5; // ok: 5 is a literal value that we're sending to the console to be printed
    std::cout << ;  // compile error: no value provided

    return 0;
}
```

在上面的程序中，需要打印的内容必须位于 `std:: cout <<` 的右侧，否则程序将会报错。因此，第二处调用 `std:: cout` 由于没有可以打印的值，编译器会抛出一个错误。

考虑下面的程序：

```cpp
#include <iostream>

// void means the function does not return a value to the caller
void printHi()
{
    std::cout << "Hi" << '\n';
}

int main()
{
    printHi(); // okay: function printHi() is called, no value is returned

    std::cout << printHi(); // compile error

    return 0;
}
```

`printHi()` 第一次被调用时，其上下文不需要一个值。因此该函数不返回值是没有任何问题的。

该函数第二次被调用的时候，程序是不能正确编译的。函数 `printHi` 的返回值类型为 `void` ，也就是说该函数不具有返回值。然而，该语句尝试将 `printHi` 函数的返回值输入 `std:: cout` 并打印。`std:: cout` 不知道如何处理该情况（什么值需要被打印？），因此编译器会抛出一个错误。你必须把这一行注释掉才能正常编译该程序。

> [!tip] "小贴士"
> 有些语句需要值，而有些语句则不需要。
> 
> 当独立调用一个函数的时候（例如上例中第一次调用 `printHi()` 函数时），我们关心的是函数本身的行为（功能）而不是其返回值。在这个例子中，我们可以创建一个没有返回值的函数，也可以创建一个有返回值的函数但忽略其返回值。
> 
> 反之，如果我们在一个需要值的上下文中（例如 `std:: cout`）调用某个函数，我们只能使用具有返回值的函数。

```cpp
#include <iostream>

// Function that does not return a value
void returnNothing()
{
}

// Function that returns a value
int returnFive()
{
    return 5;
}

int main()
{
    // When calling a function by itself, no value is required
    returnNothing(); // ok: we can call a function that does not return a value
    returnFive();    // ok: we can call a function that returns a value, and ignore that return value

    // When calling a function in a context that requires a value (like std::cout)
    std::cout << returnFive();    // ok: we can call a function that returns a value, and the value will be used
    std::cout << returnNothing(); // compile error: we can't call a function that returns void in this context

    return 0;
}
```

## 从 void 函数中返回值会导致编译报错

尝试在一个不具有返回值的函数中返回一个值会导致编译报错：

```cpp
void printHi() // This function is non-value returning
{
    std::cout << "In printHi()" << '\n';

    return 5; // compile error: we're trying to return a value
}
```

## 提前返回

如果一个 return 语句出现在最后一行代码之前，则称为提前返回。该 return 语句执行时会导致程序直接返回主调函数（因为利用函数执行完毕后会从最后一行返回主调函数，所以称为“提前”）。

```cpp
#include <iostream>

void print() // note: void return type
{
    std::cout << "A";

    return; // 函数将在这行语句执行时返回主调函数(注意：没有返回值)

    std::cout << "B"; // 该行永远不会被执行
}

int main()
{
    print();

    return 0;
}
```

在上面的例子中，当 `print()` 执行时，它会首先打印 A，然后执行 return 语句并控制函数返回其主调函数 main。B 永远都不会被打印因为该行代码不会执行。

提前返回也适用于具有返回值的函数：

```cpp
#include <iostream>

int print() // note: return type of int
{
    std::cout << "A";
    return 5; // the function will return to the caller here
    std::cout << "B"; // this will never be printed
}

int main()
{
    std::cout << print(); // print() returns value 5, which will be print to the console

    return 0;
}
```

上述程序输出结果如下：

```bash
A5
```

首先, `print()` 被调用。`print()` 的第一条语句会打印 “A”。然后 return 语句被执行，返回值 5 被传递给主调函数，该值同样被打印了出来。`std:: cout << "B"` 永远不会被执行，因为在执行它之前，函数已经返回了主调函数。

历史上，提前返回是不受鼓励的行为。不过，在现代编程中，它们是可以被接受的，提前返回能够简化程序时，或在发生错误时终止函数后续的操作。

> [!info] "相关内容"
> 我们会在 [[8-11-Break-and-continue|7.10 - break 和 continue]] 中讨论有关提前返回的争论。
