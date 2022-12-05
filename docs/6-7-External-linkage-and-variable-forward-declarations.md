---
title: 6.7 - 外部链接和变量前向声明
alias: 6.7 - 外部链接和变量前向声明
origin: /external-linkage-and-variable-forward-declarations/
origin_title: "6.7 — External linkage and variable forward declarations"
time: 2022-4-27
type: translation
tags:
- linkage
- declaration
---

??? note "Key Takeaway"

	- 具有外部链接的标识符，可以在定义它们的文件中被使用，也可以通过前向声明在其他文件中使用。
	- 链接是标识符的选项，而不是变量的属性，因此函数也有链接属性
	- 函数是默认外部链接的，可以用`static`修改为内部链接
	- 具有外部链接的全局变量有时候也称为外部变量。使用 `extern` 关键字可以将全局变量定义为外部变量（使其可以在其他文件中访问）。非常量的全局变量默认是外部变量。
	- 前向声明一个定义在其他文件中的外部变量，也需要使用 `extern` 关键字
	- 如果你希望定义一个未初始化的非const全局变量。请不要使用 `extern`关键字，否则 C++ 会认为你是在前向声明某个变量
	- 在C++中，**所有**全局变量都具有“文件作用域”，同时链接属性则决定了它们是否可以被其他文件使用。

在前面的课程中 ([[6-6-Internal-linkage|6.6 - 内部链接]])，我们讨论了如何使用[[internal-linkage|内部链接]]将标识符限定在一个单独的文件中。在本节课中，我们会探讨[[external-linkage|外部链接]]。

具有外部链接的标识符，可以在定义它们的文件中被使用，也可以在其他文件中被使用（通过[[forward-declaration|前向声明]]）。从这个意义上来讲，具有外部链接的变量才是真正的*”全局“变量，因为它可以在程序的任何地方被使用。

## 函数默认具体外部链接属性

在[[2-8-Programs-with-multiple-code-files|2.8 - 多文件程序]]中我们介绍过，你可以在一个文件中调用另外一个文件中的函数，这是因为函数默认具有外部链接属性。

为了能够调用其他文件中的函数，必须要在使用该函数的文件中进行前向声明。前向声明告诉编译器函数的存在，然后链接器可以将函数调用关联到实际的定义。

例如：

```cpp title="a.cpp"
#include <iostream>

void sayHi() // 函数默认具有外部链接，在其他文件中可见
{
    std::cout << "Hi!";
}
```


```cpp title="main.cpp"
void sayHi(); // 对函数进行前向声明，使该函数在这个文件中可以被访问

int main()
{
    sayHi(); // 调用其他文件中的函数，链接器会将调用关联到函数的定义

    return 0;
}
```

打印结果：

```
Hi!
```

在上面的例子中，`sayHi()` 被前向声明在 `main.cpp` 中，这使得 `main.cpp` 可以访问定义在`a.cpp` 中的 `sayHi()` 。前向声明满足了编译器的需要，而链接器也能够将函数调用关联到函数定义。

如果`sayHi()`具有内部链接属性，则链接器便不能够将函数调用关联到函数定义，会产生链接错误。


## 具有外部链接的全局变量

具有外部链接的全局变量有时候也称为[[external-variable|外部变量(external variable)]]。使用 `extern` 关键字可以将全局变量定义为外部变量（使其可以在其他文件中访问）：

```cpp
int g_x { 2 }; // 非常量的全局变量默认是外部链接

extern const int g_y { 3 }; // const 全局变量可以被定义为 extern，使其成为外部变量
extern constexpr int g_z { 3 }; // constexpr 全局变量可以被定义为 extern，使其成为外部变量 (但是没有意义)

int main()
{
    return 0;
}
```

非常量的全局变量默认是外部链接（即使使用 `extern`也会被忽略）。


## 使用 extern 关键字进行变量的前向声明

为了使用定义在其他文件中的全局[[external-variable|外部变量]]，你同样需要在使用它的文件中对其进行[[forward-declaration|前向声明]]。对于变量来说，创建前向声明还需要使用`extern`关键字（不需要初始化值）。

下面是一个前向声明的例子：

```cpp title="a.cpp"
// 全局变量定义
int g_x { 2 }; // 非常量的全局变量默认是外部链接
extern const int g_y { 3 }; // extern 为 g_y 创建外部链接
```


```cpp title="main.cpp"
#include <iostream>

extern int g_x; // 这个 extern 是变量 g_x的前向声明，g_x被定义在其他文件
extern const int g_y; // 这个 extern 是 const 变量 g_y 的前向声明，它也被定义在其他文件

int main()
{
    std::cout << g_x; // prints 2

    return 0;
}
```

在上面的例子中，`a.cpp` 和 `main.cpp` 都引用了一个相同的全局变量 `g_x`。因此，即使 `g_x` 是在 `a.cpp`中定义和初始化的，我们仍然可以在 `main.cpp` 中使用它（需要对`g_x`进行前向声明）。

注意，`extern` 关键字在不同的语境下有不同的含义。有些语境下，`extern` 表示 “为变量创建外部链接”。而在另外的语句下，`extern` 表示 “这是一个定义在其他地方的外部变量的前向声明”。的确有点绕，所以我们会在[[6-11-Scope-duration-and-linkage-summary|6.11 - 作用域和链接小结]]中对这些问题进行详细的总结。

!!! warning "注意"

	如果你希望定义一个未初始化的非const全局变量。请不要使用 `extern`关键字，否则 C++ 会认为你是在前向声明某个变量。
	

!!! warning "注意"

尽管 constexpr 变量可以通过 `extern` 关键字赋予外部链接属性，但是由于它们并不能被前向声明，所以这么做并无意义。（[[4-13-Const-variables-and-symbolic-constants|4.13 - const 变量和符号常量]]）
	
	这是因为编译器在[[compile-time|编译时]]就必须指定 constexpr 变量的值。如果该变量被定义在其他文件中，那么编译器将无法知道它的值。
	

^ce6263

注意，函数的前向声明不需要使用 `extern` 关键字——编译器可以通过是否有函数体来判断此处是在定义一个新的函数，还是在进行前向声明。变量的前向声明是需要 `extern` 关键字的，它可以帮助区分变量定义和变量前向声明（看上去可能会完全一样）：

```cpp
// 非常量
int g_x; // 变量声明也是定义 (可以初始化也可以不初始化)
extern int g_x; // 前向声明 (无初始化值)

// 常量
extern const int g_y { 1 }; // 变量定义(const必须要初始化)
extern const int g_y; // 前向声明 (无初始化值)
```


## 文件作用域 vs. 全局作用域

“文件作用域”和“全局作用域”这两个术语可能会令人感到困惑，这主要是因为在非正式场合它们的用法不够严谨。从技术上来讲，在 C++中，**所有**全局变量都具有“文件作用域”，同时链接属性则决定了它们是否可以被其他文件使用。

考虑下面程序：

```cpp title="global.cpp"
int g_x { 2 }; // 默认是外部链接
// g_x 从这里离开作用域
```


```cpp title="main.cpp"
extern int g_x; // 对 g_x 进行前向声明，从此时开始 g_x 可以被该文件使用。

int main()
{
    std::cout << g_x; // should print 2

    return 0;
}
//  g_x 的前向声明从此离开作用域
```

变量 `g_x` 具有文件作用域（`global.cpp`）—— 它可以被使用的范围从定义开始，到文件结束为止，但是它不能直接在 `global.cpp` 以外的地方被使用。

在 `main.cpp` 中，`g_x` 的前向声明具有文件作用域——它可以被使用的范围从声明开始，到文件结束为止。

不过，我们通常非正式地将“文件作用域”用来描述具有内部链接的变量，而用“全局作用域”来描具有外部链接的变量（因为这类变量可以通过前向声明在整个程序中被使用）。

## 小结

```cpp
// 外部全局变量定义
int g_x;                       // 定义外部全局变量但不初始化（默认初始化为0） 
extern const int g_x{ 1 };     // 定义初始化的 const 外部全局变量
extern constexpr int g_x{ 2 }; // 定义初始化的 constexpr 外部全局变量

// Forward declarations
extern int g_y;                // 前向声明非常数的全局变量
extern const int g_y;          // 前向声明 const 的全局变量
extern constexpr int g_y;      // 不允许这样做：constexpr 变量不能前向声明
```

我们会在 [[6-11-Scope-duration-and-linkage-summary|6.11 - 作用域和链接小结]]中对相关内容进行更详细的总结。