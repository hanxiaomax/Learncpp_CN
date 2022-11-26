---
title: 10.y - 学会使用C++参考手册
alias: 10.y - 学会使用C++参考手册
origin: /using-a-language-reference/
origin_title: "10.y — Using a language reference"
time: 2022-8-25
type: translation
tags:
- summary
---

根据你学习C++所处的阶段，本网站可能是你在某个阶段学习C++的唯一资料。LearnCpp.com 以一种新手友好的方式向你介绍了C++的基本概念，但是它不可能涵盖C++的方方面面。当你开始探索本教程以外的话题时，你需要学会如何利用其他的资源来进行学习。

[Stack Overflow](https://stackoverflow.com/) 是一个问答网站，在这里你可以问问题(你可以在这里找到与你有相同问题的人并且阅读这些问题的答案)。不过，多数情况下我们还是建议你先去看看C++语言的参考手册。和教程不同，教程通常专注于某些重要话题并使用通俗的语言向你解释相关的概念，使得语言学习更容易。但是参考手册不同，它的作用是使用正式的术语，精确地描述C++中的概念。因此，参考手册通常很全面、精确，但比较难以理解。

本节课我们会向你介绍如何高效地使用 [cppreference](https://cppreference.com/)，这是一个流行的C++标准参考文档网站，本教程自始至终多次参考了该网站的内容。我们会使用三个具体的例子向你展示如何去使用该参考网站。

## 总览

Cppreference 的首页是一个[总览页面](https://en.cppreference.com/w/cpp)  其中列出了语言的核心功能和标准库：

![](https://www.learncpp.com/blog/wp-content/uploads/images/CppTutorial/cppreference/overview-min.png?ezimgfmt=rs%3Adevice%2Frscb2-1)

虽然在这个页面中，你可以看到cppreference提供的所有内容的目录，但通常使用搜索功能或搜索引擎更容易找到你需要的内容。当你完成了LearnCpp.com上的教程之后，该页面是你绝佳的下一站目的地。在这里你可以深入研究标准库，并查看C++还提供了哪些你还不知道的功能。

表的上半部分显示了C++当前的特性，而下半部分则展示了技术规范，这些特性可能会在未来的版本中添加到C++，也可能不会添加到C++，或者已经部分被语言接受。如果您想了解即将推出的新功能，这将非常有用。

从C++ 11开始，cppreference会用引入该功能的标准版本来标记对应的功能。标准版本是上面图片中一些链接旁边的绿色小数字。那些没有标记标准版本的功能，则是在 C++ 98/03 中就已经有的功能。我们不仅会在总览页面看到标准版本号，它在cppreference上随处可见，这使得我们可以确切地知道在特定的C++版本中什么功能可用，什么功能不可用。

!!! info "提醒"

	C++ 的版本有：C++98, C++03, C++11, C++14, C++17, C++20。C++23 是下一个迭代的版本号。

!!! warning "注意"

	If you use a search engine and a technical specification has just been accepted into the standard, you might get linked to a technical specification rather than the official reference, which can differ.

!!! tip "小贴士"

cppreference不仅是C++的参考，也是C的参考。因为C++和C共享一些函数(可能有所不同)，你可能会在C参考中搜索到一些东西。cppreference顶部的URL和导航栏总是会显示您正在浏览的是C还是c++引用。

## `std::string::length`

We’ll start by researching a function that you know from a previous lesson, `std::string::length`, which returns the length of a string.

On the top right of cppreference, search for “string”. Doing so shows a long list of types and functions, of which only the top is relevant for now.

![](https://www.learncpp.com/blog/wp-content/uploads/images/CppTutorial/cppreference/string-search-ddg-min.png?ezimgfmt=rs:674x555/rscb2/ng:webp/ngcb2)

We could have searched for “string length” right away, but for the purpose of showing as much as possible in this lesson, we’re taking the long route. Clicking on “Strings library” takes us to a page talking about the various kinds of strings that C++ supports.

![](https://www.learncpp.com/blog/wp-content/uploads/images/CppTutorial/cppreference/strings-lib-min.png?ezimgfmt=rs:776x357/rscb2/ng:webp/ngcb2)

If we look under the “std::basic_string” section, we can see a list of typedefs, and within that list is std::string.

Clicking on “std::string” leads to the page for [`std::basic_string`](https://en.cppreference.com/w/cpp/string/basic_string). There is no page for `std::string`, because `std::string` is a `typedef` for `std::basic_string<char>`, which again can be seen in the `typedef` list:

![](https://www.learncpp.com/blog/wp-content/uploads/images/CppTutorial/cppreference/typedef-min.png?ezimgfmt=rs:485x239/rscb2/ng:webp/ngcb2)

The `<char>` means that each character of the string is of type `char`. You’ll note that C++ offers other strings that use different character types. These can be useful when using Unicode instead of ASCII.

Further down the same page, there’s a [list of member functions](https://en.cppreference.com/w/cpp/string/basic_string#Member_functions) (the behaviors that a type has). If you want to know what you can do with a type, this list is very convenient. In this list, you’ll find a row for `length` (and `size`).

Following the link brings us to the detailed function description of [`length` and `size`](https://en.cppreference.com/w/cpp/string/basic_string/size), which both do the same thing.

The top of each page starts with a short summary of the feature and syntax, overloads, or declarations:

![](https://www.learncpp.com/blog/wp-content/uploads/images/CppTutorial/cppreference/string-length-overloads-min.png?ezimgfmt=rs:771x178/rscb2/ng:webp/ngcb2)

The title of the page shows the name of the class and function with all template parameters. We can ignore this part. Below the title, we see all of the different function overloads (different versions of the function that share the same name) and which language standard they apply to.

Below that, we can see the parameters that the function takes, and what the return value means.

Because `std::string::length` is a simple function, there’s not a lot of content on this page. Many pages show example uses of the feature they’re documenting, as does this one:

![](https://www.learncpp.com/blog/wp-content/uploads/images/CppTutorial/cppreference/string-length-example-min.png?ezimgfmt=rs:742x423/rscb2/ng:webp/ngcb2)

Until you’re done learning C++, there will be features in the examples that you haven’t seen before. If there are enough examples, you’re probably able to understand a sufficient amount of it to get an idea of how the function is used and what it does. If the example is too complicated, you can search for an example somewhere else or read the reference of the parts you don’t understand (you can click on functions and types in the examples to see what they do).

Now we know what `std::string::length` does, but we knew that before. Let’s have a look at something new!

## `std::cin.ignore`

In lesson [7.16 -- std::cin and handling invalid input](https://www.learncpp.com/cpp-tutorial/stdcin-and-handling-invalid-input/), we talked about `std::cin.ignore`, which is used to ignore everything up to a line break. One of the parameters of this function is some long and verbose value. What was that again? Can’t you just use a big number? What does this argument do anyway? Let’s figure it out!

Typing “std::cin.ignore” into the cppreference search yields the following results:

![](https://www.learncpp.com/blog/wp-content/uploads/images/CppTutorial/cppreference/ignore-ddg-min.png?ezimgfmt=rs:588x631/rscb2/ng:webp/ngcb2)

-   `std::cin, std::wcin` - We want `.ignore`, not plain `std::cin`.
-   `std::basic_istream<CharT,Traits>::ignore` - Eew, what is this? Let’s skip for now.
-   `std::ignore` - No, that’s not it.
-   `std::basic_istream` - That’s not it either.

It’s not there, what now? Let’s go to [`std::cin`](https://en.cppreference.com/w/cpp/io/cin) and work our way from there. There’s nothing immediately obvious on that page. On the top, we can see the declaration of `std::cin` and `std::wcin`, and it tells us which header we need to include to use `std::cin`:

![Declaration](https://www.learncpp.com/blog/wp-content/uploads/images/CppTutorial/cppreference/cintop-min.png?ezimgfmt=rs:777x97/rscb2/ng:webp/ngcb2)

We can see that `std::cin` is an object of type `std::istream`. Let’s follow the link to [`std::istream`](https://en.cppreference.com/w/cpp/io/basic_istream):

![basic_istream](https://www.learncpp.com/blog/wp-content/uploads/images/CppTutorial/cppreference/basic_istream-min.png?ezimgfmt=rs:777x520/rscb2/ng:webp/ngcb2)

Hold up! We’ve seen `std::basic_istream` before when we searched for “std::cin.ignore” in our search engine. It turns out that `istream` is a typedef for `basic_istream`, so maybe our search wasn’t so wrong after all.

Scrolling down on that page, we’re greeted with familiar functions:

![Member functions](https://www.learncpp.com/blog/wp-content/uploads/images/CppTutorial/cppreference/members-min.png?ezimgfmt=rs:641x828/rscb2/ng:webp/ngcb2)

We’ve used many of these functions already: `operator>>`, `get`, `getline`, `ignore`. Scroll around on that page to get an idea of what else there is in `std::cin`. Then click [`ignore`](https://en.cppreference.com/w/cpp/io/basic_istream/ignore), since that’s what we’re interested in.

![ignore](https://www.learncpp.com/blog/wp-content/uploads/images/CppTutorial/cppreference/ignore-top-min.png?ezimgfmt=rs:772x250/rscb2/ng:webp/ngcb2)

On the top of the page there’s the function signature and a description of what the function and its two parameters do. The `=` signs after the parameters indicate a default argument (we cover this in lesson [8.12 -- Default arguments](https://www.learncpp.com/cpp-tutorial/default-arguments/)). If we don’t provide an argument for a parameter that has a default value, the default value is used.

The first bullet point answers all of our questions. We can see that `std::numeric_limits<std::streamsize>::max()` has special meaning to `std::cin.ignore`, in that it disables the character count check. This means `std::cin.ignore` will continue ignoring characters until it finds the delimiter, or until it runs out of characters to look at.

Many times, you don’t need to read the entire description of a function if you already know it but forgot what the parameters or return value mean. In such situations, reading the parameter or return value description suffices.

![Parameters and return value](https://www.learncpp.com/blog/wp-content/uploads/images/CppTutorial/cppreference/parameters-return-min.png?ezimgfmt=rs:505x135/rscb2/ng:webp/ngcb2)

The parameter description is brief. It doesn’t contain the special handling of `std::numeric_limits<std::streamsize>::max()` or the other stop conditions, but serves as a good reminder.

A language grammar example

Alongside the standard library, cppreference also documents the language grammar. Here’s a valid program:

```cpp
#include <iostream>

int getUserInput()
{
  int i{};
  std::cin >> i;
  return i;
}

int main()
{
  std::cout << "How many bananas did you eat today? \n";

  if (int iBananasEaten{ getUserInput() }; iBananasEaten <= 2)
  {
    std::cout << "Yummy\n";
  }
  else
  {
    std::cout << iBananasEaten << " is a lot!\n";
  }

  return 0;
}
```

COPY

Why is there a variable definition inside the condition of the `if-statement`? Let’s use cppreference to figure out what it does by searching for “cppreference if statement” in our favorite search engine. Doing so leads us to [if statements](https://en.cppreference.com/w/cpp/language/if). At the top, there’s a syntax reference.

![](https://www.learncpp.com/blog/wp-content/uploads/images/CppTutorial/cppreference/syntax-min.png?ezimgfmt=rs:773x479/rscb2/ng:webp/ngcb2)

On the right, we can again see the version for which this syntax is relevant. Look at the version of the `if-statement` that is relevant since C++17. If you remove all of the optional parts, you get an `if-statement` that you already know. Before the `condition`, there’s an optional `init-statement`, that looks like what’s happening in the code above.

if ( init-statement condition ) statement-true
if ( init-statement condition ) statement-true else statement-false

Below the syntax reference, there’s an explanation of each part of the syntax, including the `init-statement`. It says that the `init-statement` is typically a declaration of a variable with an initializer.

Following the syntax is an explanation of `if-statements` and simple examples:

![Explanation on examples](https://www.learncpp.com/blog/wp-content/uploads/images/CppTutorial/cppreference/explanation-min.png?ezimgfmt=rs:776x843/rscb2/ng:webp/ngcb2)

We already know how `if-statements` work, and the examples don’t include an `init-statement`, so we scroll down a little to find a section dedicated to `if-statements` with initializers:

![If Statements with Initializer](https://www.learncpp.com/blog/wp-content/uploads/images/CppTutorial/cppreference/if-init-min.png?ezimgfmt=rs:828x654/rscb2/ng:webp/ngcb2)

First, it is shown how the `init-statement` can be written without actually using an `init-statement`. Now we know what the code in question is doing. It’s a normal variable declaration, just merged into the `if-statement`.

The sentence after that is interesting, because it lets us know that the names from the `init-statement` are available in _both_ statements (`statement-true` and `statement-false`). This may be surprising, since you might otherwise assume the variable is only available in the `statement-true`.

The `init-statement` examples use features and types that we haven’t covered yet. You don’t have to understand everything you see to understand how the `init-statement` works. Let’s skip everything that’s too confusing until we find something we can work with:

```cpp
// Iterators, we don't know them. Skip.
if (auto it = m.find(10); it != m.end()) { return it->second.size(); }

// [10], what's that? Skip.
if (char buf[10]; std::fgets(buf, 10, stdin)) { m[0] += buf; }

// std::lock_guard, we don't know that, but it's some type. We know what types are!
if (std::lock_guard lock(mx); shared_flag) { unsafe_ping(); shared_flag = false; }

// This is easy, that's an int!
if (int s; int count = ReadBytesWithSignal(&s)) { publish(count); raise(s); }

// Whew, no thanks!
if (auto keywords = {"if", "for", "while"};
    std::any_of(keywords.begin(), keywords.end(),
                [&s](const char* kw) { return s == kw; })) {
  std::cerr << "Token must not be a keyword\n";
}
```

COPY

The easiest example seems to be the one with an `int`. Then we look after the semicolon and there’s another definition, odd… Let’s go back to the `std::lock_guard` example.

```cpp
if (std::lock_guard lock(mx); shared_flag)
{
  unsafe_ping();
  shared_flag = false;
}
```

COPY

From this, it’s relatively easy to see how an `init-statement` works. Define some variable (`lock`), then a semicolon, then the condition. That’s exactly what happened in our example.

A warning about the accuracy of cppreference

Cppreference is not an official documentation source -- rather, it is a wiki. With wikis, anyone can add and modify content -- the content is sourced from the community. Although this means that it’s easy for someone to add wrong information, that misinformation is typically quickly caught and removed, making cppreference a reliable source.

The only official source for C++ is [the standard](https://isocpp.org/std/the-standard) (Free drafts on [github](https://github.com/cplusplus/draft/tree/master/papers)), which is a formal document and not easily usable as a reference.