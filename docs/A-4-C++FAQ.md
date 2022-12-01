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

然而，当编译器遇到`using namespace std` 时，它会将在 `namespace std` 中找到的每一个标识符都导入全局作用域(因为using指令就放在全局作用域中)。这带来了3个主要挑战：

- 你所选择的标识符与 `std` 名称空间中已经存在的标识符之间发生命名冲突的几率大大增加；
- 标准库的新版本可能会破坏你当前可以工作的程序。这些未来的版本可能会引入导致新的命名冲突的名称，或者在最坏的情况下，程序的行为可能会悄无声息地出乎意料地改变!

—缺少std::前缀会使读者很难理解什么是std库名，什么是用户定义的名称。

-   The chance for a naming collision between a name you’ve picked and something that already exists in the `std` namespace is massively increased.
-   New versions of the standard library may break your currently working program. These future versions could introduce names that cause new naming collisions, or in the worst case, the behavior of your program might change silently and unexpectedly!
-   The lack of std:: prefixes makes it harder for readers to understand what is a std library name and what is a user-defined name.

For this reason, we recommend avoiding `using namespace std` (or any other using directive) entirely. The small savings in typing isn’t worth the additional headaches and future risks.

!!! info "相关内容"

	See lesson[[6-12-Using-declarations-and-using directives|6.12 - using 声明和 using 指令]] for more detail and examples.

## 问：为什么使用某些功能时不需要包含头文件？

Headers can `#include` other headers. So when you include one header, you also get all of the additional headers that it includes (and all of the headers that those headers include too). All of the additional headers that come along for the ride that you didn’t explicitly include are called “transitive includes”.

For example, your main.cpp file probably `#included <iostream>`, and on your compiler, `<iostream>` `#included <XXX>` (or some other header that `#included <XXX>`).

Even though this may compile on your compiler, you should not rely on this. What compiles for you may not compile on another compiler, or even on a future version of your compiler.

There is no way to warn when this happens, or prevent it from happening. The best you can do is take care to explicitly include the proper headers for all of the things you use. Compiling your program on several different compilers may help identify headers that are being transitively included on other compilers.

!!! info "相关内容"

	Covered in lesson [[2-11-Header-files|2.11 - 头文件]]

## 问：为什么（产生未定义行为的代码）有这样的结果？

Undefined behavior occurs when you perform an operation whose behavior is not defined by the C++ language. Code implementing undefined behavior may exhibit any of the following symptoms:

-   Your program produces different results every time it is run.
-   Your program consistently produces the same incorrect result.
-   Your program behaves inconsistently (sometimes produces the correct result, sometimes not).
-   Your program seems like its working but produces incorrect results later in the program.
-   Your program crashes, either immediately or later.
-   Your program works on some compilers but not others.
-   Your program works until you change some other seemingly unrelated code.

Or your code may produce the correct result anyway.

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