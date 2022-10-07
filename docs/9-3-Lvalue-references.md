---
title: 9.3 - 左值引用
alias: 9.3 - 左值引用
origin: /lvalue-references/
origin_title: "9.3 — Lvalue references"
time: 2022-1-2
type: translation
tags:
- Lvalue
---

??? note "关键点速记"
	
	-

在 C++ 中，引用其实就是某个已存在对象的引用。一旦引用被定义，任何对引用的操作都会直接应用于被引用的对象。

!!! tldr "关键信息"

	引用在本质上和被引用的对象是一回事。
	
这意味着我们可以通过引用来读取或修改被引用的对象。尽管现在引用看上去有点傻，没啥用，甚至还很多余，但实际上在C++中我们会大量地使用引用。

你也可以创建对函数的引用，尽管这个做法并不常见。

现代C++存在两种类型的引用：[[lvalue-reference|左值引用]]和[[rvalue-reference|右值引用]]。在本章中我们会首先讨论左值引用。

!!! info "相关内容"

	因为我们在本章会讨论左值和右值，如果你需要复习一下的话，请参考[[9-2-Value-categories-lvalues-and-rvalues|9.2 - 值的分类（左值和右值）]]。

右值引用会在[[move-semantics|移动语义]]章节进行介绍 ([chapter M](https://www.learncpp.com/#ChapterM)).

## 左值引用类型

左值引用（通常简称为引用因为C++11之前只有这一种类型的引用）是一个已存在左值（例如某个变量）的别名。

声明左值类型可以在类型声明时使用`&`符号：

```cpp
int      // a normal int type
int&     // an lvalue reference to an int object
double&  // an lvalue reference to a double object
```


## 左值引用变量

左值引用类型可以用来声明一个左值引用变量。左值引用变量作为对一个左值的引用来使用（通常是另外一个变量）。

创建左值引用变量，只需要使用左值引用类型定义一个变量即可：

```cpp
int main()
{
    int x { 5 };    // x is a normal integer variable
    int& ref { x }; // ref is an lvalue reference variable that can now be used as an alias for variable x

    std::cout << x << '\n';  // print the value of x (5)
    std::cout << ref << '\n'; // print the value of x via ref (5)

    return 0;
}
```

在上面的例子中，使用 `int&` 定义`ref` 可以创建一个对`int`类型左值的引用，然后我们使用一个左值表达式 x 对其进行了初始化。从此以后，我们就可以将 `ref` 作为 `x` 的同义词来使用。程序会打印如下内容：

```
5
5
```

从编译器的角度来看，将`&`放在类型旁边(`int& ref`)还是变量旁边(`int &ref`)并没有什么区别，选择那种写法只关乎于风格。现代C++程序员通常会选择将`&`紧挨着类型关键字放置，因为这样做可以更清楚地表明引用是类型信息的一部分，而不是标识符的一部分。

!!! success "最佳实践"

	在定义引用的时候，将`&`紧挨着类型关键词放置（而不是变量名）。
	
!!! info "扩展阅读"

    对于那些已经熟悉指针的开发者来说，`&`在这里含义并不是取地址而是左值引用。
    
## 通过左值引用来修改值

在上面的例子中，我们展示了如何通过引用来获取被引用对象的值。我们还可以通过引用来修改被引用对象的值：

```cpp
#include <iostream>

int main()
{
    int x { 5 }; // normal integer variable
    int& ref { x }; // ref is now an alias for variable x

    std::cout << x << ref; // print 55

    x = 6; // x now has value 6

    std::cout << x << ref; // prints 66

    ref = 7; // the object being referenced (x) now has value 7

    std::cout << x << ref; // prints 77

    return 0;
}
```

打印结果：
```
556677
```

在上面的例子中，`ref` 是 `x` 的别名，所以我们可以通过 `x` 或者 `ref` 来修改 `x` 的值。

## 左值引用的初始化

和常量非常类似，所有的引用都必须被初始化。

```cpp
int main()
{
    int& invalidRef;   // error: references must be initialized

    int x { 5 };
    int& ref { x }; // okay: reference to int is bound to int variable

    return 0;
}
```

当使用一个对象(或函数)初始化引用时，我们说它被绑定到了那个对象(或函数)。绑定此类引用的过程称为引用绑定。被引用的对象(或函数)有时称为 referent。

作指引与必须被绑定到一个可修改左值。

```cpp
int main()
{
    int x { 5 };
    int& ref { x }; // valid: lvalue reference bound to a modifiable lvalue

    const int y { 5 };
    int& invalidRef { y };  // invalid: can't bind to a non-modifiable lvalue
    int& invalidRef2 { 0 }; // invalid: can't bind to an r-value

    return 0;
}
```

左值引用不能被绑定到一个不可修改的左值（否则你岂不是可以通过引用来修改这个值咯，这显然违背了常量的常量性）。因此，左值引用有时也称为非const变量的左值引用（简称为非const变量的引用）。

多数情况下，左值引用的类型必须和被引用对象的类型相匹配（例外的情况会在我们讨论继承时遇到）：

```cpp
int main()
{
    int x { 5 };
    int& ref { x }; // okay: reference to int is bound to int variable

    double y { 6.0 };
    int& invalidRef { y }; // invalid; reference to int cannot bind to double variable
    double& invalidRef2 { x }; // invalid: reference to double cannot bind to int variable

    return 0;
}
```

对`void`类型的左值引用是不可以的（这么做的目的又是什么呢？）

## 引用不能被重新设置(使其引用其他对象)

引用一旦被初始化，它便不能够被重新绑定到其他对象。

新手 C++ 程序员经常会尝试使用赋值运算符重新设置引用。这么做是可以编译并运行的，但是它的效果并不是我们期望的那样，考虑下面的代码：

```cpp
#include <iostream>

int main()
{
    int x { 5 };
    int y { 6 };

    int& ref { x }; // ref is now an alias for x

    ref = y; // assigns 6 (the value of y) to x (the object being referenced by ref)
    // The above line does NOT change ref into a reference to variable y!

    std::cout << x; // user is expecting this to print 5

    return 0;
}
```

结果可能出人意料：

```
6
```

当表达式中的引用进行求值时，它会解析成被引用的对象。所以 `ref = y` 并不会为 `ref` 重新设置为`y`的引用。实际情况是`ref`是`x`的引用，因此上面的表达式等价于`x = y` ，因为 `y` 的值为 6 ，所以 `x` 被赋值为 6 。

## Lvalue reference scope and duration

Reference variables follow the same scoping and duration rules that normal variables do:

```cpp
#include <iostream>

int main()
{
    int x { 5 }; // normal integer
    int& ref { x }; // reference to variable value

     return 0;
} // x and ref die here
```

COPY

## References and referents have independent lifetimes

With one exception (that we’ll cover next lesson), the lifetime of a reference and the lifetime of its referent are independent. In other words, both of the following are true:

-   A reference can be destroyed before the object it is referencing.
-   The object being referenced can be destroyed before the reference.

When a reference is destroyed before the referent, the referent is not impacted. The following program demonstrates this:

```cpp
#include <iostream>

int main()
{
    int x { 5 };

    {
        int& ref { x };   // ref is a reference to x
        std::cout << ref; // prints value of ref (5)
    } // ref is destroyed here -- x is unaware of this

    std::cout << x; // prints value of x (5)

    return 0;
} // x destroyed here
```

COPY

The above prints:

55

When `ref` dies, variable `x` carries on as normal, blissfully unaware that a reference to it has been destroyed.

## Dangling references

When an object being referenced is destroyed before a reference to it, the reference is left referencing an object that no longer exists. Such a reference is called a dangling reference. Accessing a dangling reference leads to undefined behavior.

Dangling references are fairly easy to avoid, but we’ll show a case where this can happen in practice in lesson [9.5 -- Pass by lvalue reference](https://www.learncpp.com/cpp-tutorial/pass-by-lvalue-reference/).

## References aren’t objects

Perhaps surprisingly, references are not objects in C++. A reference is not required to exist or occupy storage. If possible, the compiler will optimize references away by replacing all occurrences of a reference with the referent. However, this isn’t always possible, and in such cases, references may require storage.

This also means that the term “reference variable” is a bit of a misnomer, as variables are objects with a name, and references aren’t objects.

Because references aren’t objects, they can’t be used anywhere an object is required (e.g. you can’t have a reference to a reference, since an lvalue reference must reference an identifiable object). In cases where you need a reference that is an object or a reference that can be reseated, `std::reference_wrapper` (which we cover in lesson [16.3 -- Aggregation](https://www.learncpp.com/cpp-tutorial/aggregation/)) provides a solution.

As an aside…

Consider the following variables:

```cpp
int var{};
int& ref1{ var };  // an lvalue reference bound to var
int& ref2{ ref1 }; // an lvalue reference bound to var
```

COPY

Because `ref2` (a reference) is initialized with `ref1` (a reference), you might be tempted to conclude that `ref2` is a reference to a reference. It is not. Because `ref1` is a reference to `var`, when used in an expression (such as an initializer), `ref1` evaluates to `var`. So `ref2` is just a normal lvalue reference (as indicated by its type `int&`), bound to `var`.

A reference to a reference (to an `int`) would have syntax `int&&` -- but since C++ doesn’t support references to references, this syntax was repurposed in C++11 to indicate an rvalue reference (which we cover in lesson [M.2 -- R-value references](https://www.learncpp.com/cpp-tutorial/rvalue-references/)).