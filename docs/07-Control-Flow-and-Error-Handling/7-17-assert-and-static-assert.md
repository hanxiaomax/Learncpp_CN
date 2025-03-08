---
title: 7.17 - 断言和 static_assert
alias: 7.17 - 断言和 static_assert
origin: /assert-and-static_assert/
origin_title: "8.x — Chapter 8 summary and quiz"
time: 2022-8-12
type: translation
tags:
- assert
- static_assert
- C++17
---

In a function that takes parameters, the caller may be able to pass in arguments that are syntactically valid but semantically meaningless. For example, in the previous lesson ([[7-15-Detecting-and-handling-errors|7.15 - 发现错误和处理错误]]), we showed the following sample function:

```cpp
void printDivision(int x, int y)
{
    if (y != 0)
        std::cout << static_cast<double>(x) / y;
    else
        std::cerr << "Error: Could not divide by zero\n";
}
```

This function does an explicit check to see if `y` is `0`, since dividing by zero is a semantic error and will cause the program to crash if executed.

In the prior lesson, we discussed a couple of ways to deal with such problems, including halting the program, or skipping the offending statements.

Both of those options are problematic though. If a program skips statements due to an error, then it is essentially failing silently. Especially while we are writing and debugging programs, silent failures are bad, because they obscure real problems. Even if we print an error message, that error message may be lost among the other program output, and it may be non-obvious where the error message is being generated or how the conditions that triggered the error message occurred. Some functions may be called tens or hundreds of times, and if only one of those cases is generating a problem, it can be hard to know which one.

If the program terminates (via `std::exit`) then we will have lost our call stack and any debugging information that might help us isolate the problem. `std::abort` is a better option for such cases, as typically the developer will be given the option to start debugging at the point where the program aborted.


## 前置条件、不变量和后置条件

In programming, a precondition is any condition that must always be true prior to the execution of component of code. Our check of `y` is a precondition that ensures `y` has a valid value before the function continues.

It’s more common for functions with preconditions to be written like this:

```cpp
void printDivision(int x, int y)
{
    if (y == 0)
    {
        std::cerr << "Error: Could not divide by zero\n";
        return;
    }

    std::cout << static_cast<double>(x) / y;
}
```

COPY

An invariant is a condition that must be true while some component is executing.

Similarly, a postcondition is something that must be true after the execution of some component of code. Our function doesn’t have any postconditions.

## 断言

Using a conditional statement to detect an invalid parameter (or to validate some other kind of assumption), along with printing an error message and terminating the program, is such a common response to problems that C++ provides a shortcut method for doing this.

An assertion is an expression that will be true unless there is a bug in the program. If the expression evaluates to `true`, the assertion statement does nothing. If the conditional expression evaluates to `false`, an error message is displayed and the program is terminated (via `std::abort`). This error message typically contains the expression that failed as text, along with the name of the code file and the line number of the assertion. This makes it very easy to tell not only what the problem was, but where in the code the problem occurred. This can help with debugging efforts immensely.

In C++, runtime assertions are implemented via the assert preprocessor macro, which lives in the `<cassert>` header.

```cpp
#include <cassert> // for assert()
#include <cmath> // for std::sqrt
#include <iostream>

double calculateTimeUntilObjectHitsGround(double initialHeight, double gravity)
{
  assert(gravity > 0.0); // The object won't reach the ground unless there is positive gravity.

  if (initialHeight <= 0.0)
  {
    // The object is already on the ground. Or buried.
    return 0.0;
  }

  return std::sqrt((2.0 * initialHeight) / gravity);
}

int main()
{
  std::cout << "Took " << calculateTimeUntilObjectHitsGround(100.0, -9.8) << " second(s)\n";

  return 0;
}
```

COPY

When the program calls `calculateTimeUntilObjectHitsGround(100.0, -9.8)`, `assert(gravity > 0.0)` will evaluate to `false`, which will trigger the assert. That will print a message similar to this:

```
dropsimulator: src/main.cpp:6: double calculateTimeUntilObjectHitsGround(double, double): Assertion 'gravity > 0.0' failed.
```

The actual message varies depending on which compiler you use.

Although asserts are most often used to validate function parameters, they can be used anywhere you would like to validate that something is true.

Although we told you previously to avoid preprocessor macros, asserts are one of the few preprocessor macros that are considered acceptable to use. We encourage you to use assert statements liberally throughout your code.

## 使断言语句更具描述性

Sometimes assert expressions aren’t very descriptive. Consider the following statement:

```cpp
assert(found);
```

COPY

If this assert is triggered, the assert will say:

```
Assertion failed: found, file C:\\VCProjects\\Test.cpp, line 34
```

What does this even mean? Clearly `found` was `false` (since the assert triggered), but what wasn’t found? You’d have to go look at the code to determine that.

Fortunately, there’s a little trick you can use to make your assert statements more descriptive. Simply add a string literal joined by a logical AND:

```cpp
assert(found && "Car could not be found in database");
```

COPY

Here’s why this works: A string literal always evaluates to Boolean `true`. So if `found` is `false`, `false && true` is `false`. If `found` is `true`, `true && true` is `true`. Thus, logical AND-ing a string literal doesn’t impact the evaluation of the assert.

However, when the assert triggers, the string literal will be included in the assert message:

Assertion failed: found && "Car could not be found in database", file C:\\VCProjects\\Test.cpp, line 34

That gives you some additional context as to what went wrong.

## 断言 vs 错误处理

Assertions and error handling are similar enough that their purposes can be confused, so let’s clarify:

The goal of an assertion is to catch programming errors by documenting something that should never happen. If that thing does happen, then the programmer made an error somewhere, and that error can be identified and fixed. Assertions do not allow recovery from errors (after all, if something should never happen, there’s no need to recover from it), and the program will not produce a friendly error message.

On the other hand, error handling is designed to gracefully handle cases that could happen (however rarely) in release configurations. These may or may not be recoverable, but one should always assume a user of the program may encounter them.

> [!success] "最佳实践"
> Use assertions to document cases that should be logically impossible.

Assertions are also sometimes used to document cases that were not implemented because they were not needed at the time the programmer wrote the code:

```cpp
// Assert with a message, covered in the next section
assert(moved && "Need to handle case where student was just moved to another classroom");
```

COPY

That way, if a future user of the code does encounter a situation where this case is needed, the code will fail with a useful error message, and the programmer can then determine how to implement that case.

## NDEBUG

The `assert` macro comes with a small performance cost that is incurred each time the assert condition is checked. Furthermore, asserts should (ideally) never be encountered in production code (because your code should already be thoroughly tested). Consequently, many developers prefer that asserts are only active in debug builds. C++ comes with a way to turn off asserts in production code. If the macro `NDEBUG` is defined, the assert macro gets disabled.


Some IDEs set `NDEBUG` by default as part of the project settings for release configurations. For example, in Visual Studio, the following preprocessor definitions are set at the project level: `WIN32;NDEBUG;_CONSOLE`. If you’re using Visual Studio and want your asserts to trigger in release builds, you’ll need to remove `NDEBUG` from this setting.

If you’re using an IDE or build system that doesn’t automatically define `NDEBUG` in release configuration, you will need to add it in the project or compilation settings manually.

## 断言的限制和提醒

There are a few pitfalls and limitations to asserts. First, the assert itself can have a bug. If this happens, the assert will either report an error where none exists, or fail to report a bug where one does exist.

Second, your asserts should have no side effects -- that is, the program should run the same with and without the assert. Otherwise, what you are testing in a debug configuration will not be the same as in a release configuration (assuming you ship with NDEBUG).


Also note that the `abort()` function terminates the program immediately, without a chance to do any further cleanup (e.g. close a file or database). Because of this, asserts should be used only in cases where corruption isn’t likely to occur if the program terminates unexpectedly.

## `static_assert`

C++ also has another type of assert called `static_assert`. A static_assert is an assertion that is checked at compile-time rather than at runtime, with a failing `static_assert` causing a compile error. Unlike assert, which is declared in the `<cassert>`header, static_assert is a keyword, so no header needs to be included to use it.

A `static_assert` takes the following form:

```cpp
static_assert(condition, diagnostic_message)
```

If the condition is not true, the diagnostic message is printed. Here’s an example of using static_assert to ensure types have a certain size:

```cpp
static_assert(sizeof(long) == 8, "long must be 8 bytes");
static_assert(sizeof(int) == 4, "int must be 4 bytes");

int main()
{
	return 0;
}
```

COPY

On the author’s machine, when compiled, the compiler errors:

```
1>c:\consoleapplication1\main.cpp(19): error C2338: long must be 8 bytes
```

Because `static_assert` is evaluated by the compiler, the condition must be able to be evaluated at compile time. Also, unlike normal `assert` (which is evaluated at runtime), `static_assert` can be placed anywhere in the code file (even in the global namespace).

Prior to C++17, the diagnostic message must be supplied as the second parameter. Since C++17, providing a diagnostic message is optional.


-----

在接收参数的函数中，调用者可能会传递语法上有效但语义上无意义的参数。例如，在上一课中（[[7-15-Detecting-and-handling-errors|7.15 - 发现错误和处理错误]]），我们展示了以下示例函数：

```cpp
void printDivision(int x, int y)
{
    if (y != 0)
        std::cout << static_cast(x) / y;
    else
        std::cerr << "Error: Could not divide by zero\n";
}
```

该函数显式检查`y`是否为`0`，因为除以零是语义错误，如果执行将导致程序崩溃。

在之前的课程中，我们讨论了处理此类问题的几种方法，包括停止程序或跳过有问题的语句。

但这两种选项都有问题。如果程序由于错误而跳过语句，则实际上是在默默地失败。尤其是在编写和调试程序时，静默失败是不好的，因为它们会掩盖真正的问题。即使我们打印错误消息，该错误消息也可能会在其他程序输出中丢失，并且可能不明显地生成错误消息或触发错误消息的条件在哪里。有些函数可能会被调用十次或几百次，如果只有其中一个情况生成问题，那么很难知道是哪个情况。

如果程序终止（通过`std::exit`），则我们将失去调用堆栈和任何可能帮助我们隔离问题的调试信息。`std::abort`是这种情况的更好选择，因为通常开发人员将有选择在程序中止的点开始调试。

## 前置条件、不变量和后置条件

在编程中，前置条件是指在代码组件执行之前必须始终为真的任何条件。我们对`y`的检查是确保函数继续之前`y`具有有效值的前置条件。

更常见的是，具有前置条件的函数编写如下：

```cpp
void printDivision(int x, int y)
{
    if (y == 0)
    {
        std::cerr << "Error: Could not divide by zero\n";
        return;
    }

    std::cout << static_cast(x) / y;
}
```


不变量是指某个组件执行时必须为真的条件。

类似地，后置条件是指某个代码组件执行后必须为真的条件。我们的函数没有任何后置条件。

## 断言

使用条件语句检测无效参数（或验证某种其他类型的假设），并打印错误消息并终止程序是对问题的常见响应，因此C++提供了一种快捷方法来执行此操作。

断言是一个表达式，除非程序中存在错误，否则该表达式将为真。如果表达式的值为`true`，则断言语句不执行任何操作。如果条件表达式的值为`false`，则显示错误消息并通过`std::abort`终止程序。此错误消息通常包含以文本形式失败的表达式，以及断言的代码文件的名称和行号。这使得不仅可以确定问题所在，还可以确定问题发生的代码位置。这可以极大地帮助调试工作。

在C++中，运行时断言是通过assert预处理宏实现的，该宏位于头文件中。

```cpp
#include  // for assert()
#include  // for std::sqrt
#include 

double calculateTimeUntilObjectHitsGround(double initialHeight, double gravity)
{
  assert(gravity > 0.0); // The object won't reach the ground unless there is positive gravity.

  if (initialHeight <= 0.0)
  {
    // The object is already on the ground. Or buried.
    return 0.0;
  }

  return std::sqrt((2.0 * initialHeight) / gravity);
}

int main()
{
  std::cout << "Took " << calculateTimeUntilObjectHitsGround(100.0, -9.8) << " second(s)\n";

  return 0;
}
```

COPY

当程序调用`calculateTimeUntilObjectHitsGround(100.0, -9.8)`时，`assert(gravity > 0.0)`将计算为`false`，这将触发断言。这将打印类似于以下内容的消息：

```
dropsimulator: src/main.cpp:6: double calculateTimeUntilObjectHitsGround(double, double): Assertion 'gravity > 0.0' failed.
```

实际消息因使用的编译器而异。

尽管断言最常用于验证函数参数，但它们可以用于任何您想要验证的内容。

尽管我们之前告诉过您要避免预处理宏，但断言是少数被认为可以使用的预处理宏之一。我们鼓励您在代码中大量使用assert语句。

## 使断言语句更具描述性

有时，断言表达式的描述性并不好，例如下面的语句：

```cpp
assert(found);
```

如果触发此断言，则会显示：

```
Assertion failed: found, file C:\\VCProjects\\Test.cpp, line 34
```

这是什么意思？显然，`found`是`false`（因为断言触发了），至于是什么没找到？你必须查看代码才能确定。

幸运的是，你可以使用一个小技巧使`assert`语句更具描述性。只需添加一个逻辑AND连接的字符串字面量：

```cpp
assert(found && "Car could not be found in database");
```


这是为什么它有效的原因：字符串字面量始终计算为布尔值`true`。因此，如果`found`为`false`，则`false && true`为`false`。如果`found`为`true`，则`true && true`为`true`。因此，在逻辑AND字符串字面量不会影响断言的评估。

但是，当断言触发时，字符串字面量将包含在断言消息中：

`Assertion failed: found && "Car could not be found in database", file C:\\VCProjects\\Test.cpp, line 34`

这为你提供了有关出了什么问题的其他上下文。

## 断言与错误处理

断言和错误处理非常相似，以至于它们的目的可能会混淆，因此让我们澄清：

断言的目标是通过记录永远不应发生的事情来捕获编程错误。如果发生了那件事，那么程序员在某个地方犯了错误，并且可以确定并修复该错误。断言不允许从错误中恢复（毕竟，如果某件事情永远不应该发生，那么无需从中恢复），并且程序不会生成友好的错误消息。

另一方面，错误处理旨在优雅地处理在发布配置中可能发生（无论多么罕见）的情况。这些可能是可恢复的，也可能是不可恢复的，但是应始终假定程序的用户可能会遇到它们。

> [!success] "最佳实践"
> 使用断言记录应该在逻辑上不可能的情况。

断言有时也用于记录由于编写代码时不需要的情况：

```cpp
// Assert with a message, covered in the next section
assert(moved && "Need to handle case where student was just moved to another classroom");
```


这样，如果代码的后续维护者确实遇到需要这种情况的情况，代码将因为一个有用的错误信息而失败，程序员可以确定如何实现这种情况。

## NDEBUG

`assert` 宏会带来一些小的性能损失，每次检查 assert 条件时都会产生。此外，(理想情况下)asserts 不应该出现在生产代码中(因为你的代码应该已经经过彻底测试)。因此，许多开发人员希望 asserts 仅在调试版本中处于活动状态。C++ 提供了一种在生产代码中关闭 asserts 的方法。如果定义了宏 `NDEBUG`，assert 宏将被禁用。

一些 IDE 默认设置 `NDEBUG` 作为发布配置的项目设置的一部分。例如，在 Visual Studio 中，以下预处理器定义被设置为项目级别: `WIN32;NDEBUG;_CONSOLE`。如果你正在使用 Visual Studio 并希望在发布版本中触发 asserts，则需要从此设置中删除 `NDEBUG`。

如果你使用的 IDE 或构建系统在发布配置中没有自动定义 `NDEBUG`，则需要在项目或编译设置中手动添加它。

## 断言的限制和提醒

关于 asserts 有一些陷阱和限制。首先，assert 本身可能有 bug。如果发生这种情况，assert 将报告不存在的错误，或者无法报告存在的错误。

其次，你的 asserts 不应该有任何副作用——也就是说，在有 assert 和没有 assert 的情况下，程序应该运行相同。否则，在调试配置中进行测试的内容将与发布配置中进行的测试内容不同(假设你使用了 NDEBUG)。

还要注意的是，abort() 函数会立即终止程序，没有机会进行任何进一步的清理(例如关闭文件或数据库)。因此，asserts 应该仅在程序意外终止不太可能导致损坏的情况下使用。

## `static_assert`

C++ 还有另一种称为 `static_assert` 的 assert 类型。`static_assert` 是在编译时而不是运行时检查的断言，一个失败的 `static_assert` 会导致编译错误。与 assert 不同，assert 是在头文件中声明的，而 static_assert 是一个关键字，因此不需要包含头文件才能使用它。

`static_assert` 的形式如下：

```cpp
static_assert(condition, diagnostic_message)
```

如果条件不成立，就会打印出诊断信息。下面是使用 static_assert 确保类型具有特定大小的示例：

```cpp
static_assert(sizeof(long) == 8, "long must be 8 bytes");
static_assert(sizeof(int) == 4, "int must be 4 bytes");

int main()
{
    return 0;
}
```

在作者的机器上，编译时编译器会报错：

```
1>c:\consoleapplication1\main.cpp(19): error C2338: long must be 8 bytes
```

因为 `static_assert` 是由编译器评估的，所以条件必须能够在编译时进行评估。此外，与正常的 assert 不同(在运行时评估)，`static_assert` 可以放置在代码文件中的任何位置(甚至是全局命名空间中)。

在 C++17 之前，诊断消息必须作为第二个参数提供。自 C++17 以来，提供诊断消息是可选的。