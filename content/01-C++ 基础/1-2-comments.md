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

> [!note] "Key Takeaway"
> - 在库、程序或函数级别，使用注释来描述“是什么”。
> - 在库、程序或函数内部，使用注释来描述“怎么做”。
> - 在语句级别，使用注释来描述“为什么这么做”。

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


> [!info] "作者注"
> 上面的语句是我们第一次遇到“代码片段”。“代码片段”不是完整的程序，所以它们不能被编译。它们的存在是为了以简洁的方式演示特定的概念。


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

> [!warning] "注意"
> 不要在其他多行注释中使用多行注释。将单行注释封装在多行注释中是可以的。

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


> [!success] "最佳实践"
> 对你的代码做大量的注释，写注释时就像对一个不知道代码是做什么的人说话一样。不要以为你会记得为什么你做了特定的选择。


> [!INFO]"作者注"
> 在本系列教程的其余部分中，我们将在代码块中使用注释来让你关注特定的内容，或者帮助说明代码是如何工作的(同时确保程序能够编译)。精明的读者会注意到，按照上述标准，大多数评论都很糟糕。:)当你阅读剩下的教程时，请记住，这些注释是为教育目的服务的，而不是试图演示好的注释是什么样子的。

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

1. 你正在处理一段尚未编译的新代码，需要运行该程序。如果有编译器错误，编译器将不允许编译代码。注释掉不能编译的代码将允许程序编译，以便可以再次运行。准备好之后，就可以取消对代码的注释，并继续处理它。
2. 你已经编写了可编译但不能正常工作的新代码，并且直到以后才有时间修复它。注释掉损坏的代码将确保损坏的代码不会执行并导致问题，直到你能够修复它。
3. 找到错误的来源。如果程序没有产生预期的结果(或崩溃)，有时可以禁用部分代码，看看是否可以分离出导致程序无法正常工作的原因。如果注释掉了一行或多行代码后程序开始按预期运行(或停止崩溃)，那么错误可能位于最后注释掉的代码中。
4. 你希望用另一段代码替换一段代码，但你暂时不想删除原代码，此时可以将其先注释掉，保留在那里以供参考，直到新代码能够正常工作为止。一旦确定新代码正常工作，就可以删除注释掉的旧代码。如果你不能让你的新代码工作，你总是可以删除新代码和取消注释旧代码恢复到你以前的代码。

注释掉代码是开发过程中常见的事情，因此许多IDE都支持注释掉选中的代码部分。使用方式因 IDE 而异。

#### For Visual Studio users

你可以通过编辑菜单>高级>注释选择(或取消注释选择)来注释或取消注释选择。

#### For Code::Blocks users

你可以通过编辑菜单>注释来注释或取消注释选择。

> [!tip] "小贴士"
> 如果你只使用单行注释，那么你总是可以使用多行注释来注释掉代码而不产生冲突。反之则会比较麻烦。	
> 如果你确实需要注释掉一个包含多行注释的代码块，你也可以考虑使用`# if 0` 预处理器指令[[2-10-Introduction-to-the-preprocessor|2.10 - 预处理器简介]]

## 小结

- 在库、程序或函数级别，使用注释来描述“是什么”。
- 在库、程序或函数内部，使用注释来描述“怎么做”。
- 在语句级别，使用注释来描述“为什么这么做”。