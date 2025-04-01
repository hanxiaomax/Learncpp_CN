---
title: 11.6 - 函数模板
alias: 11.6 - 函数模板
origin: /function-templates/
origin_title: "8.13 — Function templates"
time: 2021-8-30
type: translation
tags:
- Function templates
---

> [!note] "Key Takeaway"
> 

假设我们需要编写一个求两个数中哪个值较大的函数，那么此时可能会这样做：

```cpp
int max(int x, int y)
{
    return (x > y) ? x : y;
}
```

虽然调用者可以向函数传递不同的值，但形参的类型是固定的，因此调用者只能传递`int` 值。这意味着这个函数实际上只适用于整数(以及可以提升为 `int` 的类型)。

那么，当你想找到两个 `double` 值的最大值时，会发生什么呢？因为C++要求我们指定所有函数形参的类型，解决方案是创建一个新的重载版本的 `max()` ，形参类型为`double` ：

```cpp
double max(double x, double y)
{
    return (x > y) ? x: y;
}
```

注意，实现 `max()` 的 `double` 版本的代码与`max()` 的`int` 版本的代码完全相同！事实上，这个实现适用于许多不同的类型：包括 `int` 、`double`、`long`、`long double` 甚至是你自己创建的新类型(我们将在未来的课程中介绍如何做)。

必须为每一组参数类型使用相同的实现来创建重载函数，这是一个令人头痛的问题，也是错误的来源，并且明显违反了DRY(不要重复自己)原则。这里还有一个不太明显的挑战：希望使用 `max()` 函数的程序员可能希望用`max()` 的作者没有预料到的形参类型调用它(因此没有为此编写重载函数)。

我们需要的是编写单一版本的 `max()` ，它可以处理任何类型的参数(甚至是在编写 `max()` 代码时可能没有预料到的类型)。正常的功能根本无法胜任这里的任务。幸运的是，C++支持另一个专门为解决这类问题而设计的特性。

欢迎来到C++模板的世界。

## C++模板简介

在C++中，模板系统被设计用来简化创建能够处理不同数据类型的函数(或类)的过程。

我们不再是手动创建一堆几乎相同的函数或类(每一组不同类型对应一个)，而是创建一个单一的“模板”。就像普通的定义一样，模板描述函数或类的样子。与常规定义(必须指定所有类型)不同，在模板中可以使用一个或多个占位符类型。占位符类型表示在编写模板时不知道但将在后面提供的类型。

一旦定义了模板，编译器就可以根据需要，使用模板生成任意多的重载函数(或类)，每个函数使用不同的实际类型！

最终的结果是一样的——我们得到一堆几乎相同的函数或类(每一组不同的类型对应一个)。但是我们只需要创建和维护一个模板，编译器会完成所有艰难的工作。

> [!tldr] "关键信息"
> 编译器可以使用一个模板来生成一系列相关的函数或类，每个函数或类使用一组不同的类型。

> [!cite] "题外话"
> Because the concept behind templates can be hard to describe in words, let’s try an analogy.
> 
> If you were to look up the word “template” in the dictionary, you’d find a definition that was similar to the following: “a template is a model that serves as a pattern for creating similar objects”. One type of template that is very easy to understand is that of a stencil. A stencil is a thin piece of material (such as a piece of cardboard or plastic) with a shape cut out of it (e.g. a happy face). By placing the stencil on top of another object, then spraying paint through the hole, you can very quickly replicate the cut-out shape. The stencil itself only needs to be created once, and then it can be reused as many times as desired, to create the cut out shape in as many different colors as you like. Even better, the color of a shape made with the stencil doesn’t have to be determined until the stencil is actually used.
> 
> A template is essentially a stencil for creating functions or classes. We create the template (our stencil) once, and then we can use it as many times as needed, to stencil out a function or class for a specific set of actual types. Those actual types don’t need to be determined until the template is actually used.

因为只有在程序中使用模板时(而不是在编写模板时)才能确定实际类型，因此模板的作者不必尝试预测可能使用的所有实际类型。这意味着模板代码可以与编写模板时甚至不存在的类型一起使用！稍后，当开始探索C++标准库时，我们将看到这是如何派上用场的，C++标准库充满了模板代码!

> [!tldr] "关键信息"
> 模板可以使用在编写模板时甚至不存在的类型。这有助于使模板代码既灵活又经得起考验!

在本课的其余部分，我们将介绍和探索如何创建[[function-template|函数模板]]，并详细描述它们是如何工作的。我们将在介绍了什么是类之后再讨论[[class-template|类模板]]。

## 函数模板

[[function-template|函数模板]]是一种类似函数的定义，用于生成一个或多个重载函数，每个重载函数都有一组不同的实际类型。这将允许我们创建可以处理许多不同类型的函数。

在创建函数模板时，对于我们希望稍后指定的任何形参类型、返回类型或函数体中使用的类型，我们都使用占位符类型(也称为模板类型)。

函数模板最好通过示例来教授，所以让我们将上面示例中的`max(int, int)` 函数转换为函数模板。它出奇地简单，我们将解释这一过程中发生了什么。

## 创建模板化的`max`函数

下面代码是 `int` 版本的 `max()`：

```cpp
int max(int x, int y)
{
    return (x > y) ? x : y;
}
```

注意，我们在这个函数中使用了三次 `int` 类型：一次用于形参`x` ，一次用于形参 `y` ，还有一次用于函数的返回类型。

要创建一个函数模板，我们要做两件事。首先，我们将用模板类型替换特定类型。在本例中，因为我们只有一个需要替换的类型( `int` )，所以只需要一个模板类型。通常约定使用单个大写字母（从大写字母`T`开始）表示模板类型。

下面是我们使用单一模板类型的新函数：

```cpp
T max(T x, T y) // won't compile because we haven't defined T
{
    return (x > y) ? x : y;
}
```


> [!success] "最佳实践"
> 使用单个大写字母(从T开始)命名模板类型(例如 T, U, V 等…)

这是一个好的开始——然而，它不会编译，因为编译器不知道`T` 是什么！这仍然是一个普通的函数，而不是一个函数模板。

其次，我们会告诉编译器这是一个函数模板，而`T` 是一个模板类型。这是通过所谓的模板参数声明来完成的：

```cpp
template <typename T> // this is the template parameter declaration
T max(T x, T y) // this is the function template definition for max<T>
{
    return (x > y) ? x : y;
}
```

仔细观察模板参数声明。首先使用关键字 `template` 告诉编译器创建一个模板。接下来，在尖括号( `<>` )中指定模板将使用的**所有模板类型**。对于每个模板类型，我们使用关键字`typename` 或 `class` ，后面跟着模板类型的名称(例如 “T”)。

每个模板函数(或模板类)都需要声明自己的模板形参。

> [!cite] "题外话"
> 
> 在这个上下文中，`typename` 和`class` 关键字之间没有区别。你会经常看到人们使用`class` 关键字，因为它更早地被引入到语言中。然而，我们更喜欢新式的`typename` 关键字，因为它更清楚地表明模板类型可以被任何类型(例如基本类型)替换，而不仅仅是类类型。

因为这个函数模板只需要一个模板类型，称为`T`，我们称其为 `max<T>`。

> [!info] "相关内容"
> 我们会在课程[[11-8-Function-templates-with-multiple-template-types|11.8 - 具有多种类型的函数模板]]中讨论如何创建具有多种模板类型的函数模板。

搞定！简单到令人难以置信。

在下一课中，我们将学习如何使用`max<T>` 函数模板生成带有不同类型参数的`max()` 函数。