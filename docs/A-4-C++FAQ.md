---
title: A.4 — C++ FAQ
alias: A.4 — C++ FAQ
origin: /cpp-faq/
origin_title: "A.4 — C++ FAQ"
time: 2020-5-3
type: translation
---

??? note "Key Takeaway"
	


有一些问题往往被问了一遍又一遍。本FAQ将尝试回答最常见的问题。

## 问: 为什么不应该使用 “`using namespace std`”? 

语句 `using namespace std;` 使用了[[using-directive|using 指令]]——它将某个命名空间中的所有标识符都导入到当前命名空间。

你可能看过这样的代码：

```cpp
#include <iostream>

using namespace std;

int main()
{
    cout << "Hello world!";

    return 0;
}
```

这么做之后，我们就可以不必显式指明`std`的命名空间，再也不用写 `std::` 了。在上面的程序中，只需要使用 `cout` 而不需要使用 `std::cout`。听起来很不错对吧？

然而，当编译器遇到 `using namespace std` 时，它会将在 `namespace std` 中找到的每一个标识符都导入全局作用域(因为using指令就放在全局作用域中)。这带来了3个主要挑战：

- 你所选择的标识符与 `std` 名称空间中已经存在的标识符之间发生命名冲突的几率大大增加；
- 标准库的新版本可能会破坏你当前可以工作的程序。这些未来的版本可能会引入导致新的命名冲突的名称，或者在最坏的情况下，程序的行为可能会悄无声息地出乎意料地改变!
- 缺少 `std::` 前缀会使读者难以区分哪些名字属于 std 库哪些是用户定义的。

因此，我们推荐避免使用 `using namespace std` (以及其他 using 语句)。通过它节省的打字时间和可能带来的风险相比是不划算的。

!!! info "相关内容"

	参见 [[6-12-Using-declarations-and-using directives|6.12 - using 声明和 using 指令]] 获取更多信息。

## 问：为什么使用某些功能时不需要包含头文件？

头文件可以“`#include`”其他头文件。因此，当我们包含一个头文件时，同时就可以获得它包含的所有附加头文件(以及那些头文件包含的所有头文件)。所有没有显式包含的附加头文件称为“传递包含”。

比方说，`main.cpp` 中 `#included <iostream>`，同时你的编译器在 `<iostream>` 中 `#included <XXX>` (或者其他头文件 `#included <XXX>`)。

即使它可以在编译器上编译，也不应该依赖它。因为你能够编译的东西可能不能在其他编译器上编译，甚至不能在你的编译器的未来版本上编译。

没有办法在这种情况发生时发出警告，或防止它发生。我们能做的就是为所使用的所有东西显式地包括适当的头文件。在几个不同的编译器上编译你的程序可能有助于识别被其他编译器传递包含的头文件。


!!! info "相关内容"

	参见 [[2-11-Header-files|2.11 - 头文件]]

## 问：为什么（产生未定义行为的代码）有这样的结果？

当程序执行非C++标准定义的操作时，会发生[[undefined-behavior|未定义行为]]。实现未定义行为的代码可能会出现以下任何症状：

- 程序每次运行都会产生不同的结果；
- 程序始终产生相同的错误结果；
- 程序行为不一致(有时产生正确的结果，有时不)；
- 程序似乎在工作，但在程序后面产生了不正确的结果；
- 程序立即崩溃或一段时间后崩溃；
- 程序可以在一些编译器上工作，但不能在其他编译器上工作；
- 程序可以工作，但是在改变一些其他看起来不相关的代码后就不能工作了

或者你的代码可能会产生正确的结果。

Readers often ask what is happening to produce a specific result on their system. In most cases, it’s difficult to say, as the result produced may be dependent upon the current program state, your compiler settings, how the compiler implements a feature, the computer’s architecture, and/or the operating system. For example, if you print the value of an uninitialized variable, you might get garbage, or you might always get a particular value. It depends on what type of variable it is, how the compiler lays out the variable in memory, and what’s in that memory beforehand (which might be impacted by the OS or the state of the program prior to that point).

And while such an answer may be interesting mechanically, it’s rarely useful overall (and likely to change if and when anything else changes). It’s like asking, “When I put my seat belt through the steering wheel and connect it to the accelerator, why does the car pull left when I turn my head on a rainy day?” The best answer isn’t a physical explanation of what’s occurring, it’s “don’t do that”.

!!! info "相关内容"

	Undefined behavior is covered in lesson [[1-6-Uninitialized-variables-and-undefined-behavior|1.6 - 未初始化变量和未定义行为]]

## 问：我尝试编译一个例子，它本应该工作却编译报错了，为什么？


The most common reason for this is that your project is being compiled using the wrong language standard.

C++ introduces many new features with each new language standard. If one of our examples uses a feature that was introduced in C++17, but your program is compiling using the C++14 language standard, then it won’t compile because the feature we’re using doesn’t exist. Try setting your language standard to the latest version your compiler supports and see if that resolves the issue.

!!! info "相关内容"

	Covered in lesson [0.12 -- Configuring your compiler: Choosing a language standard](https://www.learncpp.com/cpp-tutorial/configuring-your-compiler-choosing-a-language-standard/).

It is also possible that your compiler either doesn’t support a specific feature yet, or has a bug preventing use in some cases. In this case, try updating your compiler to the latest version available.