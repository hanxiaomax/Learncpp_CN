---
title: 8.6 - switch fallthrough属性和作用域
alias: 8.6 - switch fallthrough属性和作用域
origin: /switch-fallthrough-and-scoping/
origin_title: "7.5 — Switch fallthrough and scoping"
time: 2022-2-12
type: translation
tags:
- switch
---

> [!note] "Key Takeaway"
	


本节课继续探索switch语句。在前面的课程中（[[8-5-Switch-statement-basics|8.5 - switch 语句基础]]）我们提到每个分支标签下的语句都应该以`break `或 `return `结尾。

在这节课中，我们将探索其中的原因，并讨论一些开关作用域的问题，这些问题有时会绊倒新程序员。


## 贯穿

当一个switch表达式匹配一个case标签或可选的默认标签时，从匹配标签后面的第一个语句开始执行。然后继续执行，直到以下终止条件之一发生：

1.  到达switch末尾；
2.  遇到其他控制流语句（一般来说是`break`或者`return`）导致switch退出；
3.  其他中断导致程序的正常流程被打断(例如，操作系统停止程序、宇宙大爆炸等等)。

注意，另一个case标签的出现不是这些终止条件之一——因此，如果没有`break` 或`return` ，执行将继续执行后续的case。

例如：
```cpp
#include <iostream>

int main()
{
    switch (2)
    {
    case 1: // Does not match
        std::cout << 1 << '\n'; // 跳过
    case 2: // Match!
        std::cout << 2 << '\n'; // 从这里开始执行
    case 3:
        std::cout << 3 << '\n'; // 也会被执行
    case 4:
        std::cout << 4 << '\n'; // 也会被执行
    default:
        std::cout << 5 << '\n'; // 也会被执行
    }

    return 0;
}
```

输出结果：

```
2
3
4
5
```

这可能不是我们想要的!当执行从标签下面的语句流到后续标签下面的语句时，这称为贯穿。

> [!warning] "注意"
> 一旦case或default标签下的语句开始执行，它们默认会贯穿到后续的case中。`break`或 `return` 可以防止这种情况。

由于人们很少会主动使用贯穿特性，因此许多编译器和代码分析工具会将贯穿标记为警告。

## 贯穿 `[[fallthrough]]` 属性

通过注释告诉其他开发人员故意实现的贯穿是一种常见惯例。虽然其他开发人员可以理解，但编译器和代码分析工具不知道如何解释注释，因此它无法消除警告。

为了解决这个问题，C++17添加了一个新的属性 `[[fallthrough]]`。

属性是现代C++的一个特性，它允许程序员向编译器提供一些关于代码的附加数据。要指定属性，属性名要放在双大括号之间。属性不是语句——相反，它们几乎可以在与上下文相关的任何地方使用。

`[[fallthrough]]` 会修改一个空语句，表明有意而为之的贯穿操作（避免触发告警）：

```cpp hl_lines="12"
#include <iostream>

int main()
{
    switch (2)
    {
    case 1:
        std::cout << 1 << '\n';
        break;
    case 2:
        std::cout << 2 << '\n'; // 从这里开始执行
        [[fallthrough]]; // 有意地贯穿操作——注意分号创建的空语句
    case 3:
        std::cout << 3 << '\n'; // 同样会执行
        break;
    }

    return 0;
}
```

输出：

```
2
3
```


> [!success] "最佳实践"
> 使用 `[[fallthrough]]` 属性(和空语句)表明有意而为之的贯穿操作。
	
## 顺序分支标签

我们可以使用逻辑或运算符来连接多个测试条件：

```cpp
bool isVowel(char c)
{
    return (c=='a' || c=='e' || c=='i' || c=='o' || c=='u' ||
        c=='A' || c=='E' || c=='I' || c=='O' || c=='U');
}
```

在switch语句中也有类似的场景：c 被多次求值并测试，此时读代码的人必须确保每次被求值和比较的是c。

我们可以通过顺序排列的多个分支标签来解决这个问题：

```cpp
bool isVowel(char c)
{
    switch (c)
    {
        case 'a': // if c is 'a'
        case 'e': // or if c is 'e'
        case 'i': // or if c is 'i'
        case 'o': // or if c is 'o'
        case 'u': // or if c is 'u'
        case 'A': // or if c is 'A'
        case 'E': // or if c is 'E'
        case 'I': // or if c is 'I'
        case 'O': // or if c is 'O'
        case 'U': // or if c is 'U'
            return true;
        default:
            return false;
    }
}
```

记住，执行从匹配的case标签后的第一个语句开始。case标签不是语句(它们是标签)，所以它们不算数。

在上述程序中，能够匹配的*所有*标签后面第一个语句是 `return true` ，因此，如果任何标签匹配，函数将返回 `true` 。

因此，我们可以通过“堆叠”标签，使所有这些标签共享相同的语句。这不属于贯穿，所以不必注释或标记“`[[fallthrough]]`”。

## switch-case 作用域

对于 if 语句来说，条件后面只能有一条语句（或语句块），该语句被认为隐式地属于某个语句块：

```cpp
if (x > 10)
    std::cout << x << " is greater than 10\n"; // this line implicitly considered to be inside a block
```

但是，对于 switch 语句来说，==某个标签后面的语句都属于switch语句块，并没有创建任何的隐式语句块。==


```cpp
switch (1)
{
    case 1: // 并不会创建隐式地语句块
        foo(); // 属于switch语句块，而不是case1（的隐式语句块）
        break; // 属于switch语句块，而不是case1（的隐式语句块）
    default:
        std::cout << "default case\n";
        break;
}
```


在上面的例子中，case 1 后面的两条语句和 default 后面的语句都属于 switch 语句块。

## case 语句中声明和初始化变量

我们可以在 switch 中声明变量 (但不能初始化)，在标签的前后进行都可以：

```cpp
switch (1)
{
    int a; // okay: declaration is allowed before the case labels
    int b{ 5 }; // illegal: initialization is not allowed before the case labels

    case 1:
        int y; // okay but bad practice: declaration is allowed within a case
        y = 4; // okay: assignment is allowed
        break;

    case 2:
        int z{ 4 }; // 非法操作: 如果后续还有分支，则不允许初始化
        y = 5; // okay: y was declared above, so we can use it here too
        break;

    case 3:
        break;
}
```


尽管变量 `y` 是在 `case 1` 中声明的，但是在 `case 2` 中仍然可以使用它。因为所有的这些语句都不属于某个隐式的作用域而是属于switch语句块，所以它们都在同一个作用域中，前面定义的变量自然可以在后面使用，即使定义它的分支从没被执行过也没有问题。

换句话说，定义一个没有初始化值的变量只是告诉编译器在这个作用域内，从此时起，这个变量有定义了。这一切都发生在[[compile-time|编译时]]，它并不要该定义在[[runtime|运行时]]被实际执行。

不过，变量的初始化是必须在[[runtime|运行时]]执行才有效的。变量的初始化只能在最后一个分支进行（否则该初始化可能被跳过导致变量没有被初始化）。同时，变量的初始化也不能在第一个分支之前进行，因为这部分代码永远不会被执行。

如果case需要定义和/或初始化一个新变量，最佳做法是在case语句下面的显式块中完成:

```cpp
switch (1)
{
    case 1:
    { // note addition of explicit block here
        int x{ 4 }; // okay, variables can be initialized inside a block inside a case
        std::cout << x;
        break;
    }
    default:
        std::cout << "default case\n";
        break;
}
```

COPY

> [!success] "最佳实践"
> 如果需要定义和/或初始化一个新变量，最佳做法是在case语句下面的显式块中完成