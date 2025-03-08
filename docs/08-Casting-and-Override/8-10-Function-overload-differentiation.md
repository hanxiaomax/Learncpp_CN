---
title: 8.10 - 重载函数的区分
alias: 8.10 - 重载函数的区分
origin: /function-overload-differentiation/
origin_title: "8.10 — Function overload differentiation"
time: 2022-5-31
type: translation
tags:
- overload
---

> [!note] "Key Takeaway"
> - 函数中用于区分重载函数的部分有：形参个数、形参类型、省略号。
> - 返回值类型不能被用来区分函数
> - 成员函数在上面的基础上还包括 `const`、`volatile`和引用限定符
> - 当编译器编译一个函数时，它会执行[[Name-mangling|命名修饰(Name mangling)]]，这意味着根据各种条件改变编译后的函数名称(“改写”)，例如参数的数量和类型，以便链接器有唯一的名称来处理。

在上一节课中 ([[8-9-Introduction-to-function-overloading|8.9 - 函数重载]])， 我们引入了函数重载的概念，使用函数重载可以创建具有相同名称的多个函数，前提是每个相同名称的函数具有不同的形参类型(或者可以用其他方式区分函数)。

在这一课中，我们将进一步了解重载函数是如何区分开来的，不能被正确区分的重载函数将导致编译器发出编译错误。

## 重载函数是如何被区分的

|函数属性	|被用于区分函数	|备注|
|---|---|---|
|形参个数	|Yes	
|形参类型	|Yes	|不包括 `typedefs`、类型别名、`const` 限定符。包括省略号(ellipses)
|返回值类型	|**No**	

注意，函数的返回类型不用于区分重载函数。我们稍后再讨论这个问题。

> [!info] "扩展阅读"
> 对于**成员函数**，还会考虑附加的函数级限定符:
>
>| 函数级限定符                | 是否用于重载 |     |
>| --------------------- | ------ | --- |
>| `const` or `volatile` | Yes    |     |
>| 引用限定符(ref-qualifiers) | Yes    |     |
>
> 例如，`const` 成员函数可以与其他完全相同的非 `const` 成员函数区别开来(即使它们共享相同的形参集)。


## 基于参数个数进行重载

只要每个重载函数具有不同数量的形参，就可以区分重载函数。例如:

```cpp
int add(int x, int y)
{
    return x + y;
}

int add(int x, int y, int z)
{
    return x + y + z;
}
```

编译器可以很容易地将两个整型参数的函数调用匹配到 `add(int, int)` ，而将三个整型参数的函数调用匹配到 `add(int, int, int)`。

## 基于参数类型进行重载

只要每个重载函数的形参类型列表是不同的，就可以对函数进行区分。例如，以下所有的重载函数都是可以被区分的:


```cpp
int add(int x, int y); // 整型版本
double add(double x, double y); // 浮点版本
double add(int x, double y); // 混合版本
double add(double x, int y); // 混合版本
```

因为类型别名(或 `typedefs` )并不会产生不同的类型，所以使用类型别名的重载函数与使用对应类型的重载没有区别。例如，以下所有重载都是不能被区分的(并将导致编译错误)：

```cpp
typedef int height_t; // typedef
using age_t = int; // type alias

void print(int value);
void print(age_t value); // not differentiated from print(int)
void print(height_t value); // not differentiated from print(int)
```

对于通过值传递的参数，也不考虑 `const` 限定符。因此，以下函数是不能被区分开的：

```cpp
void print(int);
void print(const int); // not differentiated from print(int)
```


> [!info] "扩展阅读"
> 我们还没有涉及到省略号，但是省略号参数被认为是一种独特的参数类型:
>
> ```cpp
> void foo(int x, int y);
> void foo(int x, ...); // 和 foo(int, int)是不同的
> ```

## 返回值类型不能被用来区分函数

在区分重载函数时，不考虑函数的返回类型。

考虑这样一种情况:您想编写一个返回随机数的函数，但是您需要一个返回整数的版本，以及另一个返回双精度数的版本。你可能会忍不住这样做:

```cpp
int getRandomValue();
double getRandomValue();
```

Visual Studio 2019 中会产生如下编译错误：

```
error C2556: 'double getRandomValue(void)': overloaded function differs only by return type from 'int getRandomValue(void)'
```

这是很显然的，假设你自己是编译器，当你看到下面的定义时：

```cpp
getRandomValue();
```

你应该调用两个函数中的哪个呢？

> [!cite] "题外话"
> 这是一个有意的选择，因为它确保了函数调用的行为可以独立于表达式的其他部分来确定，从而使理解复杂表达式更加简单。换句话说，我们总是可以仅根据函数调用中的参数来决定调用哪个版本的函数。如果返回值用于区分，那么我们就没有一个简单的语法方法来判断调用了哪个函数的重载——我们还必须理解返回值是如何被使用的，这需要更多的分析。

解决这个问题的最好方法是给函数取不同的名字：

```cpp
int getRandomInt();
double getRandomDouble();
```


## 类型签名

函数的 [[type-signature|类型签名(type signature)]] (通常简称为签名) 是函数头的一部分，被用于区分函数。在 C++ 中，签名包括函数名、参数数量、参数类型和函数级的限定符。值得注意的是，它不包括返回类型。

## 命名修饰

> [!cite] "题外话"
> 当编译器编译一个函数时，它会执行[[Name-mangling|命名修饰(Name mangling)]]，这意味着根据各种条件改变编译后的函数名称(“改写”)，例如参数的数量和类型，以便链接器有唯一的名称来处理。
> 
> 例如，一些原型为 `int fcn()` 的函数可能会被编译为 `__fcn_v` ，而 `int fcn(int)`可能会被编译为 `__fcn_i`。因此，虽然在源代码中，两个重载函数共享一个名称，但在编译代码中，它们的名称实际上是唯一的。
> 
> 标准没有规定名称应该如何被修饰，因此不同的编译器将产生不同的函数名称。