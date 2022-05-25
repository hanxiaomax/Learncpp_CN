---
alias: 2.9 - 命名冲突和命名空间
origin: /naming-collisions-and-an-introduction-to-namespaces/
origin_title: "2.9 — Naming collisions and an introduction to namespaces"
time: 2022-4-22
type: translation
tags:
- namespace
---

想象一下，你第一次开车去朋友家，他给你的地址是西红市金融街245号。你在去之前，百度地图了一下这个地址，结果发现西红市竟然有两条金融街。那么你应该去那条街的245号呢？除非你还有一些其他的信息（例如你印象中他的房子靠着一条江），不然你只能打电话给朋友问个清楚了。在现实中，如果一个程序中的街和门牌号不是唯一的，那么无疑会非常令人困惑，也会降低城市的运行效率（例如快递效率）。

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

大多数命名冲突出现在一下两种情况：

1.  Two (or more) definitions for a function (or global variable) are introduced into separate files that are compiled into the same program. This will result in a linker error, as shown above.
2.  Two (or more) definitions for a function (or global variable) are introduced into the same file (often via an #include). This will result in a compiler error.

As programs get larger and use more identifiers, the odds of a naming collision being introduced increases significantly. The good news is that C++ provides plenty of mechanisms for avoiding naming collisions. Local scope, which keeps local variables defined inside functions from conflicting with each other, is one such mechanism. But local scope doesn’t work for function names. So how do we keep function names from conflicting with each other?

## What is a namespace?

Back to our address analogy for a moment, having two Front Streets was only problematic because those streets existed within the same city. On the other hand, if you had to deliver mail to two addresses, one at 209 Front Street in Mill City, and another address at 417 Front Street in Jonesville, there would be no confusion about where to go. Put another way, cities provide groupings that allow us to disambiguate addresses that might otherwise conflict with each other. Namespaces act like the cities do in this analogy.

A namespace is a region that allows you to declare names inside of it for the purpose of disambiguation. The namespace provides a scope region (called namespace scope) to the names declared inside of it -- which simply means that any name declared inside the namespace won’t be mistaken for identical names in other scopes.

Key insight

A name declared in a namespace won’t be mistaken for an identical name declared in another scope.

Within a namespace, all names must be unique, otherwise a naming collision will result.

Namespaces are often used to group related identifiers in a large project to help ensure they don’t inadvertently collide with other identifiers. For example, if you put all your math functions in a namespace called _math_, then your math functions won’t collide with identically named functions outside the _math_ namespace.

We’ll talk about how to create your own namespaces in a future lesson.

## The global namespace

In C++, any name that is not defined inside a class, function, or a namespace is considered to be part of an implicitly defined namespace called the global namespace (sometimes also called the global scope).

In the example at the top of the lesson, functions main() and both versions of myFcn() are defined inside the global namespace. The naming collision encountered in the example happens because both versions of myFcn() end up inside the global namespace, which violates the rule that all names in the namespace must be unique.

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

When C++ was originally designed, all of the identifiers in the C++ standard library (including std::cin and std::cout) were available to be used without the _std::_ prefix (they were part of the global namespace). However, this meant that any identifier in the standard library could potentially conflict with any name you picked for your own identifiers (also defined in the global namespace). Code that was working might suddenly have a naming conflict when you #included a new file from the standard library. Or worse, programs that would compile under one version of C++ might not compile under a future version of C++, as new identifiers introduced into the standard library could have a naming conflict with already written code. So C++ moved all of the functionality in the standard library into a namespace named “std” (short for standard).

It turns out that _std::cout_‘s name isn’t really _std::cout_. It’s actually just _cout_, and _std_ is the name of the namespace that identifier _cout_ is part of. Because _cout_ is defined in the _std_ namespace, the name _cout_ won’t conflict with any objects or functions named _cout_ that we create in the global namespace.

Similarly, when accessing an identifier that is defined in a namespace (e.g. _std::cout_) , you need to tell the compiler that we’re looking for an identifier defined inside the namespace (_std_).

!!! tldr "关键信息"

	When you use an identifier that is defined inside a namespace (such as the _std_ namespace), you have to tell the compiler that the identifier lives inside the namespace.



There are a few different ways to do this.

## Explicit namespace qualifier std::

The most straightforward way to tell the compiler that we want to use _cout_ from the _std_ namespace is by explicitly using the _std::_ prefix. For example:

```cpp
#include <iostream>

int main()
{
    std::cout << "Hello world!"; // when we say cout, we mean the cout defined in the std namespace
    return 0;
}
```


The :: symbol is an operator called the scope resolution operator. The identifier to the left of the :: symbol identifies the namespace that the name to the right of the :: symbol is contained within. If no identifier to the left of the :: symbol is provided, the global namespace is assumed.

So when we say _std::cout_, we’re saying “the _cout_ that lives in namespace _std_“.

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


A using directive allows us to access the names in a namespace without using a namespace prefix. So in the above example, when the compiler goes to determine what identifier _cout_ is, it will match with _std::cout_, which, because of the using directive, is accessible as just _cout_.

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

	We talk more about using statements (and how to use them responsibly) in lesson [6.12 -- Using declarations and using directives](https://www.learncpp.com/cpp-tutorial/using-declarations-and-using-directives/).

