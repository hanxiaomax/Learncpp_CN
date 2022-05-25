---
alias: 2.9 - 命名冲突和命名空间
origin: /naming-collisions-and-an-introduction-to-namespaces/
origin_title: "2.9 — Naming collisions and an introduction to namespaces"
time: 2022-4-22
type: translation
tags:
- namespace
---

想象一下，你第一次开车去朋友家，他给你的地址是西红市金融街 245 号。你在去之前，百度地图了一下这个地址，结果发现西红市竟然有两条金融街。那么你应该去那条街的 245 号呢？除非你还有一些其他的信息（例如你印象中他的房子靠着一条江），不然你只能打电话给朋友问个清楚了。在现实中，如果一个程序中的街和门牌号不是唯一的，那么无疑会非常令人困惑，也会降低城市的运行效率（例如快递效率）。

类似的，C++需要保证其所有的标识符都是没有歧义的。如果一个程序中有两个相同的标识符，那么[[compiler|编译器(compiler)]]或者[[linker|链接]]将无法区分它们，因此必然会报告错误。这个错误通常是关于命名冲突的。

## 命名冲突实例

a.cpp:

```cpp
#include <iostream>

void myFcn(int x)
{
    std::cout << x;
}
```

COPY

main.cpp:

```cpp
#include <iostream>

void myFcn(int x)
{
    std::cout << 2 * x;
}

int main()
{
    return 0;
}
```

当编译器在编译此程序时，它会独立地编译 _a.cpp_ 和 _main.cpp_ 两个文件，并且不会有任何问题。

不过，当链接器开始工作时，它会把 _a.cpp_ 和 _main.cpp_ 中的定义关联起来，然后它就会发现  _myFcn_ 函数的定义冲突了。随后链接器便会因为报错而停止工作。注意，即使 _myFcn_ 始终没有被调用，错误仍然会发生！

大多数命名冲突由以下两种情况引起：

1.  一个函数（或局部变量）的两个（或多个）定义被定义在了不同的文件中，但被编译到了同样的程序中。这样一来就会导致链接器报错，如上面描述的那样；
2.  一个函数（或局部变量）的两个（或多个）定义被引入了同样的函数（通常是通过 `#include` 实现的）。这会导致编译器报错。

随着程序规模的增长，程序中的标识符也越来越多，发生命名冲突的概率也随之增长。好消息是，C++ 程序提供了很多的机制来避免命名冲突。局部[[scope|作用域(scope)]]可以避免定义在函数内部的局部变量与其他变量发生命名冲突，这是其中一种机制。但是，该机制不能避免函数名的冲突。那么，应该如何避免函数名冲突呢？

## 命名空间是什么?

回想一下刚才有个地址的例子，两条同名的街之所以会带来麻烦，只因为它们是同一个城市中的两条街。如果你想要把信寄到西红市的金融街209和芒果市的金融街417，那么根本不会有任何问题。换句话说，基于城市创建的分组可以避免同名街道产生的歧义。所谓的[[namespace|命名空间(namespace)]]就像这个例子中的城市一样。

为了避免歧义，我们可以选择在命名空间中声明一个变量名。命名空间可以为其中定义的名称提供一个作用域范围（称为命名空间作用域），简单来说，在一个命名空间中定义的名称，不会和其他作用域中同名的标识符产生冲突。

!!! tldr "关键信息"

	在一个命名空间中定义的名称，不会和其他作用域中同名的标识符产生冲突。

在一个命名空间中，所有的名称都必须是唯一的，否则照样会产生冲突。

命名空间通常用于在大型项目中对变量名进行分组，以此来确保[[identifier|标识符(identifier)]]不会在不经意间与其他标识符发生冲突。例如，如果你将所有的数学函数都定义在 _math_ 命名空间中，那么它们就不会和其他空间中相同名称的函数发生冲突。

我们会在后续的课程中介绍如何创建命名空间。

## 全局命名空间

在 C++ 中，任何没有被定义在类、函数或命名空间中的标识符，都属于一个隐含的命名空间，称为全局命名空间（有时候也称为全局[[scope|作用域(scope)]]）。

在 the example at the top of the lesson, functions main() and both versions of myFcn() are defined inside the global namespace. The naming collision encountered in the example happens because both versions of myFcn() end up inside the global namespace, which violates the rule that all names in the namespace must be unique.

Only declarations and definition statements can appear in the global namespace. This means we can define variables in the global namespace, though this should generally be avoided (we cover global variables in lesson [[6-4-Introduction-to-global-variables|6.4 - 全局变量]]). This also means that other types of statements (such as expression statements) cannot be placed in the global namespace (initializers for global variables being an exception):

```cpp
#include <iostream> // handled by preprocessor

// All of the following statements are part of the global namespace
void foo();    // okay: function forward declaration in the global namespace
int x;         // compiles but strongly discouraged: uninitialized variable definition in the global namespace
int y { 5 };   // compiles but discouraged: variable definition with initializer in the global namespace
x = 5;         // compile error: executable statements not allowed in the global namespace

int main()     // okay: function definition in the global namespace
{
    return 0;
}

void goo();    // okay: another function forward declaration in the global namespace
```

## The std namespace

When C++ was originally designed, all of the identifiers in the C++ standard library (including std:: cin and std:: cout) were available to be used without the _std:: _ prefix (they were part of the global namespace). However, this meant that any identifier in the standard library could potentially conflict with any name you picked for your own identifiers (also defined in the global namespace). Code that was working might suddenly have a naming conflict when you #included a new file from the standard library. Or worse, programs that would compile under one version of C++ might not compile under a future version of C++, as new identifiers introduced into the standard library could have a naming conflict with already written code. So C++ moved all of the functionality in the standard library into a namespace named “std” (short for standard).

It turns out that _std:: cout_‘s name isn’t really _std:: cout_. It’s actually just _cout_, and _std_ is the name of the namespace that identifier _cout_ is part of. Because _cout_ is defined in the _std_ namespace, the name _cout_ won’t conflict with any objects or functions named _cout_ that we create in the global namespace.

Similarly, when accessing an identifier that is defined in a namespace (e.g. _std:: cout_) , you need to tell the compiler that we’re looking for an identifier defined inside the namespace (_std_).

!!! tldr "关键信息"

    When you use an identifier that is defined inside a namespace (such as the _std_ namespace), you have to tell the compiler that the identifier lives inside the namespace.

There are a few different ways to do this.

## Explicit namespace qualifier std::

The most straightforward way to tell the compiler that we want to use _cout_ from the _std_ namespace is by explicitly using the _std:: _ prefix. For example:

```cpp
#include <iostream>

int main()
{
    std::cout << "Hello world!"; // when we say cout, we mean the cout defined in the std namespace
    return 0;
}
```

The :: symbol is an operator called the scope resolution operator. The identifier to the left of the :: symbol identifies the namespace that the name to the right of the :: symbol is contained within. If no identifier to the left of the :: symbol is provided, the global namespace is assumed.

So when we say _std:: cout_, we’re saying “the _cout_ that lives in namespace _std_“.

This is the safest way to use _cout_, because there’s no ambiguity about which _cout_ we’re referencing (the one in the _std_ namespace).

!!! success "最佳实践"

    Use explicit namespace prefixes to access identifiers defined in a namespace.

## Using namespace std (and why to avoid it)

Another way to access identifiers inside a namespace is to use a _using directive_ statement. Here’s our original “Hello world” program with a _using directive_:

```cpp
#include <iostream>

using namespace std; // this is a using directive that allows us to access names in the std namespace with no namespace prefix

int main()
{
    cout << "Hello world!";
    return 0;
}
```

A using directive allows us to access the names in a namespace without using a namespace prefix. So in the above example, when the compiler goes to determine what identifier _cout_ is, it will match with _std:: cout_, which, because of the using directive, is accessible as just _cout_.

Many texts, tutorials, and even some compilers recommend or use a using-directive at the top of the program. However, used in this way, this is a bad practice, and highly discouraged.

Consider the following program:

```cpp
#include <iostream> // imports the declaration of std::cout

using namespace std; // makes std::cout accessible as "cout"

int cout() // declares our own "cout" function in the global namespace
{
    return 5;
}

int main()
{
    cout << "Hello, world!"; // Compile error!  Which cout do we want here?  The one in the std namespace or the one we defined above?

    return 0;
}
```

The above program doesn’t compile, because the compiler now can’t tell whether we want the _cout_ function that we defined, or the _cout_ that is defined inside the _std_ namespace.

When using a using-directive in this manner, _any_ identifier we define may conflict with _any_ identically named identifier in the _std_ namespace. Even worse, while an identifier name may not conflict today, it may conflict with new identifiers added to the std namespace in future language revisions. This was the whole point of moving all of the identifiers in the standard library into the _std_ namespace in the first place!

!!! warning "注意"

    Avoid using-directives (such as _using namespace std;_) at the top of your program or in header files. They violate the reason why namespaces were added in the first place.

!!! info "相关内容"

    We talk more about using statements (and how to use them responsibly) in lesson [6.12 -- Using declarations and using directives](https://www.learncpp.com/cpp-tutorial/using-declarations-and-using-directives/) .
