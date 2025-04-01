---
title: 9.5 - 传递左值引用
alias: 9.5 - 传递左值引用
origin: /pass-by-lvalue-reference/
origin_title: "9.5 — Pass by lvalue reference"
time: 2022-8-10
type: translation
tags:
- Lvalue
---

> [!note] "Key Takeaway"
> - 形参定义为指向非const类型的引用，它只能接收非const类型的实参，无法配合非const类型和字面量使用，极大地限制了它的作用。因此一般可以定义为const类型的引用，此时就可以配合const类型、非const类型和字面量来使用。但此时你就不能在函数内部修改实参的内容。
> - 对于拷贝开销小的对象，使用按值传递，对于拷贝开销大的对象，使用按const引用传递。如果不确定开销大还是小，则使用按const引用传递。
> - 如果对象使用内存不超过两个[[word|字长]]且没有额外的设置工作（打开文件或分配内存），则可以认为拷贝开销小
> - 拷贝开销小的类型通常有：所有基本类型、枚举类型和`std::string_view`.  
> - 拷贝开销大的类型通常有：`std::array`, `std::string`, `std::vector`, 和 `std::ostream`.


在前面的课程中，我们介绍了左值引用 ([[12-3-Lvalue-references|9.3 - 左值引用]]) 和指向const的左值引用 ([[12-4-Lvalue-references-to-const|9.4 - const类型的左值引用]])。单独来看，这两种引用看上去都没啥用——为什么我们能够直接访问变量却还要为其创建一个别名呢？

本节课我们会向你展示，为什么引用非常有用。而且从本章开始，你可以看到我们会经常使用它们。

首先，在某些场景下（回看[[2-4-Introduction-to-function-parameters-and-arguments|2.4 - 函数形参和实参]]），我们讨论过[[pass-by-value|按值传递]]，即[[arguments|实参]]在传入函数作为[[parameters|形参]]时，通过创建拷贝的方式传入。

```cpp
#include <iostream>

void printValue(int y)
{
    std::cout << y << '\n';
} // y is destroyed here

int main()
{
    int x { 2 };

    printValue(x); // x is passed by value (copied) into parameter y (inexpensive)

    return 0;
}
```


在上面的例子中，当 `printValue(x)` 被调用的时候，`x` 的值会被拷贝到形参`y`。当到达函数结尾的时候，`y`就会被销毁。

这意味着当我们调用函数的时候，我们创建了实参值的拷贝，在函数中使用后便将其销毁了！幸运地是，因为基本数据类型的拷贝开销并不大，所以这并不会带来什么问题。

## 有些对象的拷贝开销很大

标准库提供的多数数据类型都属于类(例如 `std::string`)。类类型的拷贝开销通常是很大的。如果可能，应该尽可能地避免不必要的拷贝，尤其是在这些变量用完即弃的情况下。

下面的程序正是表明了这一点：

```cpp
#include <iostream>
#include <string>

void printValue(std::string y)
{
    std::cout << y << '\n';
} // y is destroyed here

int main()
{
    std::string x { "Hello, world!" }; // x is a std::string

    printValue(x); // x is passed by value (copied) into parameter y (expensive)

    return 0;
}
```

程序会打印：

```
Hello, world!
```

尽管程序运行结果和我们想的一样，但其效率是很低的。和前面的程序一样当我们调用 `printValue()`的时候，实参 `x` 会被拷贝到形参 `y`。不过，在这个例子中，实参 `std::string` 并不像 `int` 那样，`std::string` 是一种类类型，对它的拷贝开销是非常大的，更不用说每次调用 `printValue()` 都会产生这样的开销。

我们可以做的更好。

## 按引用传递

避免函数调用时产生的拷贝开销，可通过[[pass-by-reference|按引用传递]]来代替[[pass-by-value|按值传递]]。当使用按引用传递时，我们将函数的形参声明为引用类型（或指向const的引用）而不是普通类型。当函数被调用时，每个引用类型的形参会被绑定到传入的实参。因为引用其实是实参的别名，所以并不会创建拷贝。

下面这段代码和上面的例子是一致的，不同之处在于其使用了按引用传递而不是按值出传递：

```cpp
#include <iostream>
#include <string>

void printValue(std::string& y) // type changed to std::string&
{
    std::cout << y << '\n';
} // y is destroyed here

int main()
{
    std::string x { "Hello, world!" };

    printValue(x); // x is now passed by reference into reference parameter y (inexpensive)

    return 0;
}
```


这个程序和上面的程序每太大区别，除了形参 `y` 的类型从`std::string` 被改为 `std::string&` (左值引用)。现在，当 `printValue(x)` 被调用的时候，左值引用类型的形参 `y` 被绑定到实参 `x`。引用的绑定开销总是很小的，它不需要创建`x`的拷贝。因为引用是被引用对象的别名，所以当 `printValue()` 使用 `y` 时，它访问的是实参`x`本身（而不是`x`的拷贝）。


> [!tldr] "关键信息"
> 按引用传递允许我们向函数传递参数而不需创建拷贝。
	
## 按引用传递允许函数修改实参的值


当一个对象通过按值传递的方式传入函数时，函数接收到的是其拷贝。这也就意味着任何对形参的修改都是对这份拷贝的修改，而不是实参本身：

```cpp
#include <iostream>

void addOne(int y) // y is a copy of x
{
    ++y; // this modifies the copy of x, not the actual object x
}

int main()
{
    int x { 5 };

    std::cout << "value = " << x << '\n';

    addOne(x);

    std::cout << "value = " << x << '\n'; // x has not been modified

    return 0;
}
```


在上面的例子中，因为形参`y` 是实参`x`的拷贝，当我们对`y`进行递增时，它只会影响到`y`，因此程序的输出为：

```
value = 5
value = 5
```

然而，由于引用来说，因为它就是被引用对象本身，当使用按引用传递时，对引用形参的任何更改都将影响实参：

```cpp
#include <iostream>

void addOne(int& y) // y is bound to the actual object x
{
    ++y; // this modifies the actual object x
}

int main()
{
    int x { 5 };

    std::cout << "value = " << x << '\n';

    addOne(x);

    std::cout << "value = " << x << '\n'; // x has been modified

    return 0;
}
```

程序输出为：

```
value = 5
value = 6
```

在上面的例子中，`x` 首先被初始化为 5。当 `addOne(x)` 被调用时，引用类型形参 `y` 会被绑定到实参 `x`。当我们在 `addOne()` 函数中对 `y` 进行递增时，它实际修改了实参`x`的值（而不是它的拷贝）。因此当`addOne()`调用结束后变量的值仍然是被修改了。

> [!tldr] "关键信息"
> 通过按值传递，我们可以在函数中修改传入的实参。
	

函数修改传入参数值的能力是很有用的。假设你编写了一个函数来判断怪物是否成功攻击了玩家。如果是这样，怪物应该对玩家的生命值造成一定的伤害。如果通过引用传递玩家对象，该函数可以直接修改传入的实际玩家对象的健康状况。如果你通过值传递玩家对象，你只能修改玩家对象副本的健康值，这就没什么用了。


## 传递指向非const类型的引用时只能接收可以修改的左值实参

因为执行非const值的引用只能绑定到一个可修改的[[lvalue|左值]]（本质上是一个非const类型变量），这也意味着按引用传递只能配合可修改左值来使用。从实用性的角度来看，这无疑极大地限制了按值传递的实用性，因为我们不能够为其传递const变量和[[literals|字面量]]：

```cpp
#include <iostream>
#include <string>

void printValue(int& y) // y only accepts modifiable lvalues
{
    std::cout << y << '\n';
}

int main()
{
    int x { 5 };
    printValue(x); // ok: x is a modifiable lvalue

    const int z { 5 };
    printValue(z); // error: z is a non-modifiable lvalue

    printValue(5); // error: 5 is an rvalue

    return 0;
}
```


幸运的是，我们有更好的办法。

## 传递指向 const 的引用

不同于指向非const的引用（只能绑定可修改左值），const类型引用可以绑定可修改左值、不可修改左值和右值。因此，如果我们把形参定义为const类型的引用，则可以将其绑定到任何类型的实参：


```cpp
#include <iostream>
#include <string>

void printValue(const int& y) // y is now a const reference
{
    std::cout << y << '\n';
}

int main()
{
    int x { 5 };
    printValue(x); // ok: x is a modifiable lvalue

    const int z { 5 };
    printValue(z); // ok: z is a non-modifiable lvalue

    printValue(5); // ok: 5 is a literal rvalue

    return 0;
}
```

按const引用传递提供了和按引用传递一样的优点（避免实参拷贝），同时还可以避免函数对实参进行修改。

下面的例子是无法进行的，因为 `ref` 是 const 的：

```cpp
void addOne(const int& ref)
{
    ++ref; // not allowed: ref is const
}
```

多数情况下，我们其实并不希望函数的实参被修改。

> [!success] "最佳实践"
> 按引用传递最好定义为const类型的引用，除非你有很好的理由（例如函数必须修改实参的值）。
	

现在，相信你已经可以了解支持const类型左值引用的动机了，如果没有它，我们就无法使用按引用传递的函数传递字面量（或其他右值）。

## 同时使用按值传递和按引用传递

具有多个形参的函数，可以分别指定每个参数是按值传递还是按引用传递：

例如：
```cpp
#include <string>

void foo(int a, int& b, const std::string& c)
{
}

int main()
{
    int x { 5 };
    const std::string s { "Hello, world!" };

    foo(5, x, s);

    return 0;
}
```


在上面的例子中，第一个实参是按值传递的，而第二个参数则是按引用传递的，第三个参数则是按const引用传递的。

## 何时使用按引用传递

因为类类型的拷贝开销很大，类类型通常会按引用传递而不是按值传递以避免昂贵的拷贝开销。基本数据类型的拷贝开销是很小的，所以它们通常会按值传递。

> [!success] "最佳实践"
> 对基本数据类型使用[[pass-by-value|按值传递]]，而对于类或者结构体使用const的按值传递。

## 按值传递和按引用传递的开销比较（进阶话题）

其实，并不是所有的类类型都必须[[pass-by-value|按值传递]]。当然你可能会问，都按值传递有何不可呢？在本节中，我们会详细地分析按值传递和按引用传递的开销，并提出如何选择两种方式的最佳实践。

有两个关键点可以帮助我们理解什么时候应该按值传递，什么时候应该按引用传递：


首先，对象拷贝的开销很大程度上取决于两方面：

- 对象的大小。对象占用越多的内存，拷贝也就越费时间；
- 其他额外设置所需的时间。有些类会在实例化时进行额外的设置操作（例如打开文件或数据库、或者分配动态内存）。这些操作无疑也会在对象拷贝时占据一定的时间。

另一方面，引用的绑定总是非常快的（几乎和基本数据类型的拷贝一样快）。

其次，通过引用访问对象比直接访问对象的速度略慢。使用变量标识符，编译器可以直接访问该变量对应的内存地址以获取值。对于引用，通常有一个额外的步骤：编译器必须首先确定被引用的对象，只有这样它才能到该对象的内存地址并访问该值。此外，编译器在优化代码时，有时候针对按值传递的进行的优化会相对于按引用传递的代码更高效。也就是说，编译器生成的对象按引用传递代码通常比其生成的对象按值传递代码要慢一些。

我们现在可以回答为什么不通过引用传递所有内容的问题了:

- 对于拷贝开销不大的对象，拷贝传递的开销和引用绑定的开销可能差不多，所以应该使用按值传递，以便编译器生成更高效的代码；
- 对于拷贝开销很大的对象，拷贝开销占据了大头，所以应该使用按值传递（const）来避免拷贝。

> [!info] "作者注"
> 按引用传递允许修改值并不是原因，因为如果不希望修改值可以传递const类型的引用，更不用说const类型的引用有更好的泛用性——能配合右值使用

> [!success] "最佳实践"
> 对于拷贝开销小的对象，使用按值传递，对于拷贝开销大的对象，使用按const引用传递。如果不确定开销大还是小，则使用按const引用传递。

最后一个问题，“拷贝开销小”是如何衡量的？这个问题没有绝对的答案，这取决于编译器、使用场景和架构。但是，经验法则是这样的：如果一个对象使用的内存不超过两个[[word|字长]]（”字长“大约是内存地址的长度），而且没有额外的设置过程，则可以认为是”拷贝开销小“。

下面这段程序定义了一个可以用于判断对象使用内存是否大于两个字长（`isSmall`）。


```cpp
#include <iostream>

// 如果类型或对象使用的堆内存不超过两个字长则返回true

#define isSmall(T) (sizeof(T) <= 2 * sizeof(void*))

struct S
{
    double a, b, c;
};

int main()
{
    std::cout << std::boolalpha; // 将bool类型打印为true或false，而不是01
    std::cout << isSmall(int) << '\n'; // true
    std::cout << isSmall(double) << '\n'; // true
    std::cout << isSmall(S) << '\n'; // false

    return 0;
}
```


> [!cite] "题外话"
> 我们在这里使用了一个预处理器宏，这样就可以在类型中进行替换(普通函数不允许这样做)。


然而，很难知道类类型对象是否具有设置成本。最好假设大多数标准库类都有设置成本，除非你知道它们没有。

> [!tip] "小贴士"
> 如果`sizeof(T) <= 2 * sizeof(void*)`而且类型T没有额外的设置操作，则可以认为T的拷贝开销小。
> - 拷贝开销小的类型通常有：所有基本类型、枚举类型和`std::string_view`.  
> - 拷贝开销大的类型通常有：`std::array`, `std::string`, `std::vector`, 和 `std::ostream`.
