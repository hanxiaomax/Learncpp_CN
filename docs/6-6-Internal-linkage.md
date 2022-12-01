---
title: 6.6 - 内部链接
alias: 6.6 - 内部链接
origin: /cpp-tutorial/internal-linkage/
origin_title: "6.6 — Internal linkage"
time: 2020-9-19
type: translation
tags:
- linkage
---

??? note "Key Takeaway"
	
	- 全局变量和函数的表示符，链接属性为 [[internal-linkage|内部链接(internal linkage)]] 或 [[external-linkage|内部链接(external linkage)]]  
	- 具有内部链接属性的标识符，在一个文件内可见可用，**但是在其他文件中不可访问**
	- `static` 可以将全局变量声明为**内部变量**，`Const` 和 `constexpr` 的全局变量则默认具有内部链接属性
	- 存储类型说明符可以同时设置变量的链接属性和存储持续时间（但不是其作用域），最常用的有`static`, `extern`, and `mutable`。
	- 定义在不同文件中的内部变量是独立的实体，因此不违反[[one-definition-rule|单一定义规则]]
	- 链接是标识符的属性（而不是变量的属性）
	- 函数标识符默认是外部链接，可以通过`static`关键字修改为内部链接，此时函数只能在文件内部使用

 
 在[[6-3-Local-variables|6.3 - 局部变量]]中我们讲过，标识符的链接属性决定了变量的多个声明是否指的是同一个对象。同时我们也介绍了局部变量的链接属性为*无链接*。

全局变量和函数的标识符的链接属性可以是 [[internal-linkage|内部链接(internal linkage)]] 或 [[external-linkage|外部链接(external linkage)]]  。本节课会针对内部链接进行详细介绍，而外部链接会放到下一节课——[[6-7-External-linkage-and-variable-forward-declarations|6.7 - 外部链接和变量前向声明]]。

具有内部链接属性的标识符，在一个文件内可见可用，但是在其他文件中不可访问（即不会暴露给链接器）。这意味着，如果两个文件中具有同名的标识符，且它们具有内部链接，这些标识符会被看做是互相独立的。

## 全局变量和内部链接

具有内部链接的全局变量，有时候也称为[[internal-variable|内部变量]]。

通过`static` 关键字，我们可以将一个非常的全局变量声明为内部变量。

```cpp
static int g_x; // non-constant globals have external linkage by default, but can be given internal linkage via the static keyword

const int g_y { 1 }; // const globals have internal linkage by default
constexpr int g_z { 2 }; // constexpr globals have internal linkage by default

int main()
{
    return 0;
}
```



Const 和 constexpr 类型的全局变量默认具有内部链接属性（因此不需要关键字 `static`，即使用了也会被忽略）。

下面的例子展示了多个文件中具有内部变量的情况：

```cpp title="a.cpp"
constexpr int g_x { 2 }; // 这个内部变量 g_x 只在 a.cpp 中可以访问
```


```cpp title="main.cpp"
#include <iostream>

static int g_x { 3 }; // 该内部变量 g_x 只在 main.cpp 中可以访问

int main()
{
    std::cout << g_x << '\n'; // uses main.cpp's g_x, prints 3

    return 0;
}
```

打印结果：

```
3
```

因为 `g_x` is internal to each file, `main.cpp` has no idea that `a.cpp` also has a variable named `g_x` (and vice versa).

!!! info "扩展阅读"

     `static` 变量是一个存储类型说明符，它可以同时设置变量的链接属性和[[storage-duration|存储持续时间]]（但不是其[[scope|作用域]]）。最常用的[[storage-class-specifier|存储类型说明符]]有`static`, `extern`, and `mutable`。存储类型说明符这个词常被用在技术文档中。

## 单一定义规则和内部链接

在 [[2-7-Forward-declarations-and-definitions|2.7 - 前向声明和定义]] 中我们介绍了 [[one-definition-rule|单一定义规则(one-definition-rule)]] ，即一个对象或者函数在一个函数或程序中不能被定义一次以上。

但是，需要注意的是，定义在不同文件中的内部对象（和函数）被看做是独立的实体（即使它们的名字和类型是相同的），因此这并不会违反单一定义规则。每个内部对象仍然只被定义了一次。

## 具有内部链接的函数

因为链接是标识符的属性（而不是变量的属性），所以函数的表示符同样具有链接属性。函数默认是[[external-linkage|外部链接]]的，但是也可以用`static`修改为内部链接：

```cpp title="add.cpp"
// 函数被声明为 static，先在它只能在这个文件中使用
// 尝试在其他文件中通过前向声明来访问该函数会导致报错
static int add(int x, int y)
{
    return x + y;
}
```


```cpp title="main.cpp"
#include <iostream>

int add(int x, int y); // 前向声明 add

int main()
{
    std::cout << add(3, 4) << '\n';

    return 0;
}
```


程序无法链接，`add`在`add.cpp`以外的地方不能被访问。

## 小结

```cpp
// 内部全局变量定义
static int g_x;          // 定义未初始化的内部全局变量（默认初始化为0）
static int g_x{ 1 };     // 定义初始化的内部全局变量

const int g_y { 2 };     // 定义初始化的内部全局 const 变量
constexpr int g_y { 3 }; // 定义初始化的内部全局 constexpr 变量

// 内部函数定义
static int foo() {};     // 定义内部函数
```


我们会在 [[6-11-Scope-duration-and-linkage-summary|6.11 - 作用域和链接小结]]中对相关内容进行更详细的总结。