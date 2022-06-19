---
title: 6.4 - 全局变量
alias: 6.4 - 全局变量
origin: /Introduction-to-global-variables/
origin_title: "6.4 — Introduction to global variables"
time: 2021-4-20
type: translation
tags:
- global
- storage duration
---

??? note "关键点速记"

	- 考虑为全局变量添加 “g” or “g_” 前缀以区别于其他变量。
	- 全局变量具有文件作用域和静态存储持续时间
	- 全局变量在程序开始时被创建，并且在程序结束时被销毁——即[[static-storage-duration|静态存储持续时间]]
	- 具有静态存储持续时间的变量称为[[static-variables|静态变量(static variables)]] 。
	- 静态变量具有默认初始化值 0

在 [[6-3-Local-variables|6.3 - 局部变量]] 中，我们介绍了局部变量。局部变量是定义在函数中（或函数参数）的变量。局部变量具有块作用域（只在定义它的块中可见），同时具有自动持续时间（在定义时创建，在块结束时销毁）。

C++ 中，变量也可以被声明在函数**外面**。这些变量称为全局变量。

## 全局变量的声明和命名

按照惯例，全局变量会被定义在文件的开头，紧接着头文件包含的后面，但是在所有代码的前面。请看下面的例子：

```cpp
#include <iostream>

// Variables declared outside of a function are global variables
int g_x {}; // global variable g_x

void doSomething()
{
    // global variables can be seen and used everywhere in the file
    g_x = 3;
    std::cout << g_x << '\n';
}

int main()
{
    doSomething();
    std::cout << g_x << '\n';

    // global variables can be seen and used everywhere in the file
    g_x = 5;
    std::cout << g_x << '\n';

    return 0;
}
// g_x goes out of scope here
```


输出结果如下

```
3
3
5
```

一般情况下，很多程序员喜欢为全局变量添加前缀 “g” 或 “g_” 以表明它是全局的（global）。


!!! success "最佳实践"

	考虑为全局变量添加 “g” or “g_” 前缀以区别于其他变量。
	
## 全局变量具有文件作用域和静态存储持续时间

全局变量具有文件作用域（有时候也非正式地称为全局作用域或全局命名空间作用域），也就是说这类变量从声明它的文件开头，到文件结尾都是可见的。一旦声明之后，全局变量就可以在文件的任何地方使用！在上面的例子中，全局变量 `g_x` 既可以在`doSomething()` 中使用，也可以在 `main()`中使用。


因为它们被定义在函数的外面，全局变量通常被认为是属于全局命名空间。

全局变量在程序开始时被创建，并且在程序结束时被销毁——即[[static-storage-duration|静态存储持续时间]]，具有静态存储持续时间的变量称为[[static-variables|静态变量(static variables)]] 。

局部变量默认是未初始化的，静态变量则不同，它具有默认的初始值 0 。

## 全局变量初始化

非常量类型的全局变量也可以进行初始化（可选）。

```cpp
int g_x; // no explicit initializer (zero-initialized by default)
int g_y {}; // zero initialized
int g_z { 1 }; // initialized with value
```


## 常量全局变量

和局部变量一样，全局变量也可以是常量。和所有的常量一样，常量全局变量必须被初始化。

```cpp
#include <iostream>

const int g_x; // 错误：const 常量必须初始化
constexpr int g_w; // 错误：constexpr 常量必须初始化

const int g_y { 1 };  // const global variable g_y, initialized with a value
constexpr int g_z { 2 }; // constexpr global variable g_z, initialized with a value

void doSomething()
{
    // global variables can be seen and used everywhere in the file
    std::cout << g_y << '\n';
    std::cout << g_z << '\n';
}

int main()
{
    doSomething();

    // global variables can be seen and used everywhere in the file
    std::cout << g_y << '\n';
    std::cout << g_z << '\n';

    return 0;
}
// g_y and g_z goes out of scope here
```


!!! info "相关内容"

	我们会在[[6-9-Sharing-global-constants-across-multiple-files-using-inline-variables|6.9 - 使用 inline 变量共享全局常量]]详细介绍常量全局变量。

## 关于非常量类型全局变量的提醒

新手程序员通常会尝试定义很多全局变量，因为这样他们就可以不需要传参就能够使用这些变量。不过，通常应该避免使用非常量的全局变量！我们会在[[6-8-Why-non-const-global-variables-are-evil|6.8 - 为什么非 const 全局变量是魔鬼]]中进行详细介绍。

## 小结

```cpp
// 非常量全局变量
int g_x;                 // 定义未初始化的全局变量（默认初始化为0） 
int g_x {};              // 显示地定义初始化为0的全局变量
int g_x { 1 };           // 显示地初始化全局变量

// Const 全局变量
const int g_y;           // 错误：const 变量必须初始化
const int g_y { 2 };     // 定义并初始化全局常量

// Constexpr 全局变量
constexpr int g_y;       // 错误: constexpr 变量必须初始化
constexpr int g_y { 3 }; // 定义并初始化全局 const 变量
```