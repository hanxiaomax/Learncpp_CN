---
alias: 2.7 - 前向声明和定义
origin: /forward-declarations/
origin_title: "2.7 — Forward declarations and definitions"
time: 2022-5-19
type: translation
tags:
- fordward declaration
---

考虑如下简单程序：

```cpp hl_lines="5"
#include <iostream>

int main()
{
    std::cout << "The sum of 3 and 4 is: " << add(3, 4) << '\n';
    return 0;
}

int add(int x, int y)
{
    return x + y;
}
```

我们期望的结果是程序有如下输出：

```
The sum of 3 and 4 is: 7
```

但实际上这个程序根本就不能被编译！Visual Studio 打印的错误信息如下：

```
add.cpp(5) : error C3861: 'add': identifier not found
```

[[编译器(compiler)]]在编译上述程序的时候会顺序编译上述代码的内容。当编译器开始要编译**第五行**的 `add` 函数时，它不知道 `add` 是什么，因为我们还没有定义 `add`（它是在第九行定义的）！因此，编译器会报告一个[[标识符(identifier)]]未找到的错误（identifier not found）。

旧版本的 Visual Studio 还会报告另外一个错误：

```
add.cpp(9) : error C2365: 'add'; : redefinition; previous definition was 'formerly unknown identifier'
```

这个错误信息可能会误导我们，因为 `add` 尚未被定义，又怎么会有重复定义(redefinition)的问题呢？抛开这个问题不谈，我们需要注意的是，编译器在报告错误的时候，的确会连带地报告一些冗余的或相关的错误或告警。

!!! success "最佳实践"

    在解决编译报错的问题时，总是先解决报告的第一个错误并重新编译。

为了处理掉这个报错信息，我们必须要解决编译器不知道 `add` 是什么这一问题。通常，有两种方法可以使用。

## 方案 1: 调整定义顺序

解决上述问题的方法之一，就是将 `add` 的定义挪到 `main` 前面：

```cpp hl_lines="3"
#include <iostream>

int add(int x, int y)
{
    return x + y;
}

int main()
{
    std::cout << "The sum of 3 and 4 is: " << add(3, 4) << '\n';
    return 0;
}
```

这一样一来，当 `main` 函数调用 `add` 的时候，编译器已经知道了 `add` 的定义。对于这样一个简单的程序来说，这么做是很容易的。但是对于大型程序来说，搞清楚函数的调用顺序并依此来调整其定义顺序是非常费力的。

不仅如此，在面对有些程序的时候，这个方法甚至是行不通的。例如，某个程序包含两个函数，A 和 B。如果函数 A 调用了函数 B，同时函数 B 又调用了函数 A，那么按照本方法来做的话，实际上是无法调整顺序使其能够编译的。如果你先定义 A，则编译器会抱怨找不到 B，如果你先定义 B，则编译器会抱怨找不到 A。

## 方案 2: 使用前向声明

解决问题的方案2，是使用[[forward-declaration|前向声明(forward declaration)]]。

使用前向声明可以在实际定义该标识符前，预先告知编译器该标识符是存在的。

对于函数来说，这么做可以在定义函数体之前，先告诉编译器函数名存在。因此，当编译器编译函数调用时，它知道该标识符表示一个函数，此时在进行函数调用，并检查函数调用是否正确，即使其上不知道该函数是如何定义、在哪里定义的。

编写前向升，我们需要使用被称为[[函数原型(function prototype)]]的声明语句。函数原型包括了函数头（即函数的返回值类型、函数名和[[parameters|形参(parameters)]]类型）并以分号结尾。函数体并不属于函数原型的一部分。

`add`函数的函数原型如下：

```cpp
// 函数原型包括返回值类型、函数名、形参和一个分号。不需要函数体！
int add(int x, int y); 
```

现在，为之前不能编译的程序添加 `add` 函数的前向声明：

```cpp hl_lines="3 8" 
#include <iostream>

int add(int x, int y); // 使用函数原型进行前向声明

int main()
{
    // 由于前向声明的存在，该行代码不再报错
    std::cout << "The sum of 3 and 4 is: " << add(3, 4) << '\n'; 
    return 0;
}

int add(int x, int y) // 即使函数体在后面才定义
{
    return x + y;
}
```

现在，当编译器到达`add`函数调用处是，它已经知道了`add`的原型（接收两个参数并返回一个整型），此时它便不会再报错了。

在函数原型中其实没必要提供参数的名字。在上面的例子中，你也可以像下面这样进行前向声明：

```cpp
int add(int, int); // valid function prototype
```

不过，我们建议还是使用实际的变量名，因为这样可以在你看到函数原型的时候，更好地理解其含义。否则，你必须再次寻找它的定义。


!!! success "最佳实践"

    在定义函数原型的时候，请保留函数名。你可以赋值粘贴函数的原型并在其后面加上一个分号来轻松地创建前向声明。
    
## 忘记函数体

新手程序员常常会问，如果仅仅对函数进行了前向声明，但是没有实际定义该函数时会发生什么？

这个问题的答案是：具体情况具体分析。如果函数具有前向声明，但是该函数并未被实际调用，那么程序是可以正常编译和运行的。不过，如果函数被实际调用了，但程序却没有定义该函数，那么只能够保证编译是可以通过的，但[[linker|链接器(linker)]]会报错，因为它无法解析该函数调用。

考虑下面这个程序：

```cpp
#include <iostream>

int add(int x, int y); // 使用函数原型进行前向声明

int main()
{
    std::cout << "The sum of 3 and 4 is: " << add(3, 4) << '\n';
    return 0;
}

// 注意：没有对函数进行定义
```


在这个程序中，我们对`add`进行了前向声明并且调用了`add`函数。不过，我们却没有对其进行声明。如果对程序进行编译，Visual Studio 会报告如下信息：

```
Compiling...
add.cpp
Linking...
add.obj : error LNK2001: unresolved external symbol "int __cdecl add(int,int)" (?add@@YAHHH@Z)
add.exe : fatal error LNK1120: 1 unresolved externals
```

可以看到，程序是能够正确编译的，但是在[[链接(link)]]阶段却报错了，因为`int add(int, int)`没有被定义。

## 其他类型的前向声明

前向声明最常用于函数。但是，前向声明也可以用于其他的C++标识符，例如变量或用户定义类型。不过它们的前向声明方式稍有不同，我们会在后续的课程中进行介绍。

## 声明 vs. 定义

在 C++ 中，你时常会听到[[declaration|声明(declaration)]]和[[definition|定义(definition)]] 这两个词，有时候它们是可以互换的。现在，我们已经掌握了足够的知识，可以去理解它们之间的不同了。

定义实际上指的是对某个[[标识符(identifier)]]的实现（对于函数或类型来说）或实例化（对于变量来说）。下面是一些有关定义的例子：


```cpp
int add(int x, int y) // implements function add()
{
    int z{ x + y }; // instantiates variable z

    return z;
}
```

<mark class="hltr-green">定义是为了满足链接器的需要</mark> 。如果你使用了未定义的标识符，链接器就会报错。

[[one-definition-rule|单一定义规则(one-definition-rule,ODR)]] 是C++中最著名的规则之一。

1.  在一个文件中，一个函数、变量、类型或模板只能够被定义一次；
2. 在一个程序中，一个变量或普通函数只能够有一个定义。和上一条的区别在于一个程序可以由多个文件组成（后面的课程会介绍）；
3. <mark class="hltr-green">类型、模板、内联函数和内联变量可以有一样的定义，但必须位于不同的文件中</mark> 。由于我们尚未介绍这些概念，因此目前无需考虑它们。

如果违反l part 1 of the ODR will cause the compiler to issue a redefinition error. Violating ODR part 2 will likely cause the linker to issue a redefinition error. Violating ODR part 3 will cause undefined behavior.

Here’s an example of a violation of part 1:

```cpp
int add(int x, int y)
{
     return x + y;
}

int add(int x, int y) // violation of ODR, we've already defined function add
{
     return x + y;
}

int main()
{
    int x;
    int x; // violation of ODR, we've already defined x
}
```

COPY

Because the above program violates ODR part 1, this causes the Visual Studio compiler to issue the following compile errors:

```
project3.cpp(9): error C2084: function 'int add(int,int)' already has a body
project3.cpp(3): note: see previous definition of 'add'
project3.cpp(16): error C2086: 'int x': redefinition
project3.cpp(15): note: see declaration of 'x'
```

!!! info "扩展阅读"

    Functions that share an identifier but have different parameters are considered to be distinct functions. We discuss this further in lesson [8.9 -- Introduction to function overloading](https://www.learncpp.com/cpp-tutorial/introduction-to-function-overloading/)

A declaration is a statement that tells the _compiler_ about the existence of an identifier and its type information. Here are some examples of declarations:

```cpp
int add(int x, int y); // tells the compiler about a function named "add" that takes two int parameters and returns an int.  No body!
int x; // tells the compiler about an integer variable named x
```

A declaration is all that is needed to satisfy the compiler. This is why we can use a forward declaration to tell the compiler about an identifier that isn’t actually defined until later.

In C++, all definitions also serve as declarations. This is why _int x_ appears in our examples for both definitions and declarations. Since _int x_ is a definition, it’s a declaration too. In most cases, a definition serves our purposes, as it satisfies both the compiler and linker. We only need to provide an explicit declaration when we want to use an identifier before it has been defined.

While it is true that all definitions are declarations, the converse is not true: not all declarations are definitions. An example of this is the function prototype -- it satisfies the compiler, but not the linker. These declarations that aren’t definitions are called pure declarations. Other types of pure declarations include forward declarations for variables and type declarations (you will encounter these in future lessons, no need to worry about them now).

The ODR doesn’t apply to pure declarations (it’s the _one definition rule_, not the _one declaration rule_), so you can have as many pure declarations for an identifier as you desire (although having more than one is redundant).

!!! info "作者注"

    In common language, the term “declaration” is typically used to mean “a pure declaration”, and “definition” is used to mean “a definition that also serves as a declaration”. Thus, we’d typically call _int x;_ a definition, even though it is both a definition and a declaration.
