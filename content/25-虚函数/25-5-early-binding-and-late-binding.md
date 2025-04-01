---
title: 25.5 - 早期绑定和后期绑定
alias: 25.5 - 早期绑定和后期绑定
origin: /early-binding-and-late-binding/
origin_title: "18.5 — Early binding and late binding"
time: 2022-5-9
type: translation
tags:
- early-binding
- late-binding
---


在本节课和下节课中，我们会仔细研究[[virtual-function|虚函数]]的实现方式。尽管这些内容对于你高效地使用虚函数来说并不是必须的，但是它真的很有意思。当然，你也可以把这些内容当做选修课。

当C++程序被执行时，它是按顺序执行的，从`main()`的顶部开始。当遇到函数调用时，执行点跳转到被调用函数的开始。CPU是怎么知道要这么做的?

编译程序时，编译器将C++程序中的每个语句转换为一行或多行机器语言。机器语言的每一行都有自己唯一的顺序地址。函数也不例外——当遇到一个函数时，它被转换成机器语言并给出下一个可用地址。因此，每个函数最终都有一个唯一的地址。

[[Binding|绑定]]指定就是将[[identifier|标识符(identifier)]]（变量名或函数名）转换为地址的过程。虽然绑定适用于变量和函数，但是在本节课中，我们会重点讨论函数的绑定。

## 早绑定 Early binding

编译器遇到的大多数函数调用都是函数直接调用。直接调用是直接调用函数的语句。例如:


```cpp
#include <iostream>

void printValue(int value)
{
    std::cout << value;
}

int main()
{
    printValue(5); // This is a direct function call
    return 0;
}
```

直接函数调用可以使用称为早期绑定的过程来解决。==[[Early-binding|早期绑定]](也称为静态绑定)意味着编译器(或链接器)能够直接将标识符名(如函数名或变量名)与机器地址关联起来==。记住，所有函数都有唯一的地址。因此，当编译器(或链接器)遇到函数调用时，它会用一个机器语言指令替换函数调用，该指令告诉CPU跳转到函数的地址。

让我们来看看一个使用早期绑定的简单计算器程序:

```cpp
#include <iostream>

int add(int x, int y)
{
    return x + y;
}

int subtract(int x, int y)
{
    return x - y;
}

int multiply(int x, int y)
{
    return x * y;
}

int main()
{
    int x{};
    std::cout << "Enter a number: ";
    std::cin >> x;

    int y{};
    std::cout << "Enter another number: ";
    std::cin >> y;

    int op{};
    do
    {
        std::cout << "Enter an operation (0=add, 1=subtract, 2=multiply): ";
        std::cin >> op;
    } while (op < 0 || op > 2);

    int result {};
    switch (op)
    {
        // call the target function directly using early binding
        case 0: result = add(x, y); break;
        case 1: result = subtract(x, y); break;
        case 2: result = multiply(x, y); break;
    }

    std::cout << "The answer is: " << result << '\n';

    return 0;
}
```


因为 `add()`、`subtract()`和 `multiply()` 都是直接函数调用，因此编译器使用[[Early-binding|早期绑定]]的方式来解析它们的调用。编译器会将 `add()` 函数的调用替换为一个指令，告诉CPU如何跳转到`add()`函数的地址。对于 `subtract()` 和 `multiply()` 也是类似的道理。

## 延迟绑定 Late Binding

在某些程序中，在[[runtime|运行时]](程序运行时)之前不可能知道将调用哪个函数。这被称为[[Late-binding|后期绑定]](或动态绑定)。在C++中，获得后期绑定的一种方法是使用[[20-1-function-pointers|函数指针]]。简单回顾一下函数指针，函数指针是一种指向函数而不是变量的指针。函数指针所指向的函数可以通过在指针上使用函数调用操作符(`()`)来调用。

例如，下面代码通过函数指针来调用`add()`函数：

```cpp
#include <iostream>

int add(int x, int y)
{
    return x + y;
}

int main()
{
    // Create a function pointer and make it point to the add function
    int (*pFcn)(int, int) { add };
    std::cout << pFcn(5, 3) << '\n'; // add 5 + 3

    return 0;
}
```

通过函数指针调用函数也称为间接函数调用。下面的计算器程序在函数上与上面的计算器示例相同，只不过它使用函数指针而不是直接的函数调用:


```cpp
#include <iostream>

int add(int x, int y)
{
    return x + y;
}

int subtract(int x, int y)
{
    return x - y;
}

int multiply(int x, int y)
{
    return x * y;
}

int main()
{
    int x{};
    std::cout << "Enter a number: ";
    std::cin >> x;

    int y{};
    std::cout << "Enter another number: ";
    std::cin >> y;

    int op{};
    do
    {
        std::cout << "Enter an operation (0=add, 1=subtract, 2=multiply): ";
        std::cin >> op;
    } while (op < 0 || op > 2);

    // Create a function pointer named pFcn (yes, the syntax is ugly)
    int (*pFcn)(int, int) { nullptr };

    // Set pFcn to point to the function the user chose
    switch (op)
    {
        case 0: pFcn = add; break;
        case 1: pFcn = subtract; break;
        case 2: pFcn = multiply; break;
    }

    // Call the function that pFcn is pointing to with x and y as parameters
    // This uses late binding
    std::cout << "The answer is: " << pFcn(x, y) << '\n';

    return 0;
}
```


在这个例子中，我们没有直接调用 `add()`、`subtract()` 或 `multiply()` ，而是让函数指针指向需要调用的函数。然后再使用该函数指针调用函数。很显然，编译器没办法通过早期绑定来解析函数调用 `pFcn(x, y)` 因为在编译时它并不知道 `pFcn` 会指向哪个函数。

后期绑定的效率略低，因为它涉及额外的间接逻辑层。使用早期绑定，CPU可以直接跳转到函数的地址。使用后期绑定，程序必须读取指针中保存的地址，然后跳转到该地址。这需要一个额外的步骤，使它稍微慢一些。但是，后期绑定的优点是它比早期绑定更灵活，因为直到运行时才需要决定调用什么函数。

在下一课中，我们将了解如何使用后期绑定来实现虚函数。