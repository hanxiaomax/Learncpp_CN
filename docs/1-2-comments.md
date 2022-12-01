---
title: 1.2 - 注释
alias: 1.2 - 注释
origin: /comments/
origin_title: 1.2 — Comments
time: 2020-5-1
type: translation
tags:
- comments
---

注释是直接插入到程序源代码，供程序员阅读的笔记。注释被编译器忽略，仅供程序员使用。

在C++中有两种不同风格的注释，它们都有相同的目的：帮助程序员以某种方式记录代码。

## 单行注释

使用 `//` 开头可以创建单行注释，该符号告诉编译器忽略该符号之后到该行末尾的全部内容。例如：

```cpp
std::cout << "Hello world!"; // Everything from here to the end of the line is ignored
```

一般来讲，单行注释用于对某行代码进行快速注释。

```cpp
std::cout << "Hello world!\n"; // std::cout lives in the iostream library
std::cout << "It is very nice to meet you!\n"; // these comments make the code hard to read
std::cout << "Yeah!\n"; // especially when lines are different lengths
```


将注释写在代码行的右侧，会让代码和注释的可读性变差，尤其是这行比较长的情况。如果该行不长，注释就放在后面吧，通常放置在下一个制表符的位置，像这样：

```cpp
std::cout << "Hello world!\n";                 // std::cout lives in the iostream library
std::cout << "It is very nice to meet you!\n"; // this is much easier to read
std::cout << "Yeah!\n";                        // don't you think so?
```

但是，如果行很长，将注释放在右边会使这一行变得特别长。在这种情况下，单行注释通常放在它所注释的行之上：

```cpp
// std::cout lives in the iostream library
std::cout << "Hello world!\n";

// this is much easier to read
std::cout << "It is very nice to meet you!\n";

// don't you think so?
std::cout << "Yeah!\n";
```


!!! info "作者注"

	上面的语句是我们第一次遇到“代码片段”。“代码片段”不是完整的程序，所以它们不能被编译。它们的存在是为了以简洁的方式演示特定的概念。


如果你想编译上述代码片段，则需要将其转换为一个完整的程序，以便编译。通常情况下，该程序看起来像这样:

```cpp
#include <iostream>

int main()
{
    // Replace this line with the snippet of code you'd like to compile

    return 0;
}
```


## 多行注释

`/*` 和 `*/` 符号对表示C风格的多行注释。在这两个符号之间的任意内容都会被编译器忽略

```cpp
/* This is a multi-line comment.
   This line will be ignored.
   So will this one. */
```


因为符号之间的所有内容都被忽略了，你有时会看到程序员“美化”他们的多行注释：

```cpp
/* This is a multi-line comment.
 * the matching asterisks to the left
 * can make this easier to read
 */
```

多行样式的注释不能嵌套。因此，以下情况将产生意想不到的结果：

```cpp
/* This is a multi-line /* comment */ this is not inside the comment */
// The above comment ends at the first */, not the second */
```

当编译器尝试编译它时，它将忽略从第一个`/*`到第一个`*/`中的所有内容。因为“`this is not inside the comment */`”不被认为是注释的一部分，所以编译器会尝试编译它。这将不可避免地导致编译错误。

在这种情况下，语法高亮特别有用，因为注释具有特定的颜色，所以不属于注释的一部分很容易被看出来。

!!! warning "注意"

	不要在其他多行注释中使用多行注释。将单行注释封装在多行注释中是可以的。

## 正确地使用注释

通常，注释应该用于完成三件事。第一，对于一个给定的库、程序或函数，注释最好用来描述该库、程序或函数的功能。它们通常放在文件或库的顶部，或紧挨着函数的前面。例如:

```cpp
// This program calculates the student's final grade based on his test and homework scores.
```

```cpp
// This function uses Newton's method to approximate the root of a given equation.
```

```cpp
// The following lines generate a random item based on rarity, level, and a weight factor.
```

所有这些注释都可以让读者在不查看实际代码的情况下很好地了解库、程序或函数实现了什么功能。用户(可能是其他人，如果你试图重用以前编写的代码，也可能是你自己)一眼就能看出代码是否与他或她想要实现的目标相关。在团队中工作时，这一点尤其重要，因为不是每个人都熟悉所有的代码。


第二，在上面描述的库、程序或函数中，注释可以用来描述代码将如何实现它的目标。

```cpp
/* To calculate the final grade, we sum all the weighted midterm and homework scores
    and then divide by the number of scores to assign a percentage, which is
    used to calculate a letter grade. */
```

```cpp
// To generate a random item, we're going to do the following:
// 1) Put all of the items of the desired rarity on a list
// 2) Calculate a probability for each item based on level and weight factor
// 3) Choose a random number
// 4) Figure out which item that random number corresponds to
// 5) Return the appropriate item
```

这些注释让用户了解代码将如何实现其目标，而不必了解每一行代码的功能。

第三，在语句级别，注释应该被用来描述代码**为什么**做某事，而不是被用来解释该行代码是在**做什么事**。如果你编写的代码非常复杂，以至于需要注释来解释语句在做什么，你可能需要重写语句，而不是为其添加注释。

下面是一些具体的例子（有好有坏）：

反面教材：

```cpp
// Set sight range to 0
sight = 0;
```


理由：看语句就知道它是在给 `sight` 赋值，无需注释。

正确示例：

```cpp
// The player just drank a potion of blindness and can not see anything
sight = 0;
```

理由：说明为什么要把 player 的 sight 设置为0。

反面教材：

```cpp
// Calculate the cost of the items
cost = quantity * 2 * storePrice;
```


理由：很显然是在计算`cost`，但是没有解释为什么要乘以2？

正确示例：

```cpp
// 我们需要将数量乘以2因为它们是成对购买的
cost = quantity * 2 * storePrice;
```


理由：这样就能理解公式的含义了。

程序员常常不得不在用一种方法解决问题，还是用另一种方法解决问题之间做出艰难的决定。注释是提醒你自己(或告诉别人)做出这个决定而不是另一个决定的原因的好方法。

正确示例：

```cpp
// We decided to use a linked list instead of an array because
// arrays do insertion too slowly.
```


```cpp
// We're going to use Newton's method to find the root of a number because
// there is no deterministic way to solve these equations.
```

最后，应该以一种对不知道代码是做什么的人来说有意义的方式编写注释。通常情况下，程序员会说:“这很明显！我不会忘记这件事的。”你猜怎么着？这并不明显，你会惊讶于自己有多健忘。你(或其他人)以后会感谢你用人类语言写下代码的内容、方式和原因。阅读一行行代码很容易，但理解其要完成的目标却不简单。


!!! success "最佳实践"

	对你的代码做大量的注释，写注释时就像对一个不知道代码是做什么的人说话一样。不要以为你会记得为什么你做了特定的选择。


!!! info "作者注"

	在本系列教程的其余部分中，我们将在代码块中使用注释来让你关注特定的内容，或者帮助说明代码是如何工作的(同时确保程序能够编译)。精明的读者会注意到，按照上述标准，大多数评论都很糟糕。:)当你阅读剩下的教程时，请记住，这些注释是为教育目的服务的，而不是试图演示好的注释是什么样子的。

## 将代码注释掉

将一行或多行代码转换为注释称为注释掉代码。这提供了一种方便的方法(临时)将部分代码排除在编译后的程序中。

要注释掉一行代码，只需使用`//`样式注释将一行代码临时变成注释:

未注释掉：

```cpp
std::cout << 1;
```

注释掉：

```cpp
//    std::cout << 1;
```


要注释掉代码块，可以在多行代码上使用`//`，或者使用`/* */` 注释将代码块临时转换为注释。

未注释掉：

```cpp
std::cout << 1;
std::cout << 2;
std::cout << 3;
```

注释掉：

```cpp
//    std::cout << 1;
//    std::cout << 2;
//    std::cout << 3;
```

或

```cpp
/*
    std::cout << 1;
    std::cout << 2;
    std::cout << 3;
*/
```


你需要这么做的原因有很多：

	1.  You’re working on a new piece of code that won’t compile yet, and you need to run the program. The compiler won’t let you compile the code if there are compiler errors. Commenting out the code that won’t compile will allow the program to compile so you can run it. When you’re ready, you can uncomment the code, and continue working on it.
1.  You’ve written new code that compiles but doesn’t work correctly, and you don’t have time to fix it until later. Commenting out the broken code will ensure the broken code doesn’t execute and cause problems until you can fix it.
2.  To find the source of an error. If a program isn’t producing the desired results (or is crashing), it can sometimes be useful to disable parts of your code to see if you can isolate what’s causing it to not work correctly. If you comment out one or more lines of code, and your program starts working as expected (or stops crashing), odds are whatever you last commented out was part of the problem. You can then investigate why those lines of code are causing the problem.
3.  You want to replace one piece of code with another piece of code. Instead of just deleting the original code, you can comment it out and leave it there for reference until you’re sure your new code works properly. Once you are sure your new code is working, you can remove the old commented out code. If you can’t get your new code to work, you can always delete the new code and uncomment the old code to revert to what you had before.

Commenting out code is a common thing to do while developing, so many IDEs provide support for commenting out a highlighted section of code. How you access this functionality varies by IDE.

For Visual Studio users

You can comment or uncomment a selection via Edit menu > Advanced > Comment Selection (or Uncomment Selection).

For Code::Blocks users

You can comment or uncomment a selection via Edit menu > Comment (or Uncomment, or Toggle comment, or any of the other comment tools).

!!! tip "小贴士"

	If you always use single line comments for your normal comments, then you can always use multi-line comments to comment out your code without conflict. If you use multi-line comments to document your code, then commenting-out code using comments can become more challenging.

	If you do need to comment out a code block that contains multi-line comments, you can also consider using the `#if 0` preprocessor directive, which we discuss in lesson [2.10 -- Introduction to the preprocessor](https://www.learncpp.com/cpp-tutorial/introduction-to-the-preprocessor/).

## Summary

-   At the library, program, or function level, use comments to describe _what_.
-   Inside the library, program, or function, use comments to describe _how_.
-   At the statement level, use comments to describe _why_.