---
title: A.4 — C++ FAQ
alias: A.4 — C++ FAQ
origin: /cpp-faq/
origin_title: "A.4 — C++ FAQ"
time: 2020-5-3
type: translation
---

??? note "Key Takeaway"
	


There are certain questions that tend to get asked over and over. This FAQ will attempt to answer the most common ones.

## Q: Why shouldn’t we use “using namespace std”? 

The statement `using namespace std;` is a using directive. Using directives import all of the identifiers from a namespace into the scope of the using directive.

You may have seen something like this:

```cpp
#include <iostream>

using namespace std;

int main()
{
    cout << "Hello world!";

    return 0;
}
```

COPY

This allows us to use names from the `std` namespace without having to explicitly type `std::` over and over. In the above program, we can just type `cout` instead of `std::cout`. Sounds great, right?

However, when the compiler encounters `using namespace std`, it will import every identifier it can find in `namespace std` into the global scope (since that’s where the using directive has been placed). This introduces 3 key challenges:

-   The chance for a naming collision between a name you’ve picked and something that already exists in the `std` namespace is massively increased.
-   New versions of the standard library may break your currently working program. These future versions could introduce names that cause new naming collisions, or in the worst case, the behavior of your program might change silently and unexpectedly!
-   The lack of std:: prefixes makes it harder for readers to understand what is a std library name and what is a user-defined name.

For this reason, we recommend avoiding `using namespace std` (or any other using directive) entirely. The small savings in typing isn’t worth the additional headaches and future risks.

!!! info "相关内容"

	See lesson[[6-12-Using-declarations-and-using directives|6.12 - using 声明和 using 指令]] for more detail and examples.

## Q: Why can I use (some feature) without including header `<XXX>`? 

Headers can `#include` other headers. So when you include one header, you also get all of the additional headers that it includes (and all of the headers that those headers include too). All of the additional headers that come along for the ride that you didn’t explicitly include are called “transitive includes”.

For example, your main.cpp file probably `#included <iostream>`, and on your compiler, `<iostream>` `#included <XXX>` (or some other header that `#included <XXX>`).

Even though this may compile on your compiler, you should not rely on this. What compiles for you may not compile on another compiler, or even on a future version of your compiler.

There is no way to warn when this happens, or prevent it from happening. The best you can do is take care to explicitly include the proper headers for all of the things you use. Compiling your program on several different compilers may help identify headers that are being transitively included on other compilers.

!!! info "相关内容"

	Covered in lesson [[2-11-Header-files|2.11 - 头文件]]

## Q: Why does (some code that produces undefined behavior) generate a certain result? 

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

## Q: I tried to compile an example that should work, but get a compile error. Why? 

The most common reason for this is that your project is being compiled using the wrong language standard.

C++ introduces many new features with each new language standard. If one of our examples uses a feature that was introduced in C++17, but your program is compiling using the C++14 language standard, then it won’t compile because the feature we’re using doesn’t exist. Try setting your language standard to the latest version your compiler supports and see if that resolves the issue.

!!! info "相关内容"

	Covered in lesson [0.12 -- Configuring your compiler: Choosing a language standard](https://www.learncpp.com/cpp-tutorial/configuring-your-compiler-choosing-a-language-standard/).

It is also possible that your compiler either doesn’t support a specific feature yet, or has a bug preventing use in some cases. In this case, try updating your compiler to the latest version available.