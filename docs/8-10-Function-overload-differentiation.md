---
title: 8.10 - 函数重载和区分
alias: 8.10 - 函数重载和区分
origin: /function-overload-differentiation/
origin_title: "8.10 — Function overload differentiation"
time: 2022-5-31
type: translation
tags:
- overload
---

??? note "关键点速记"
	- 函数中用于区分重载函数的部分有：形参个数、形参类型、省略号。
	- 返回值类型不能被用来区分函数
	- 成员函数在上面的基础上还包括 `const`、`volatile`和引用限定符

在上一节课中 ([[8-9-Introduction-to-function-overloading|8.9 - 函数重载]])， 我们引入了函数重载的概念，使用函数重载可以创建具有相同名称的多个函数，前提是每个相同名称的函数具有不同的形参类型(或者可以用其他方式区分函数)。

在这一课中，我们将进一步了解重载函数是如何区分开来的，不能被正确区分的重载函数将导致编译器发出编译错误。

## 重载函数是如何被区分的

|函数属性	|被用于区分函数	|备注|
|---|---|---|
|形参个数	|Yes	
|形参类型	|Yes	|不包括 `typedefs`、类型别名、`const` 限定符。包括省略号(ellipses)
|返回值类型	|**No**	

注意，函数的返回类型不用于区分重载函数。我们稍后再讨论这个问题。

!!! info "扩展阅读"

	对于**成员函数**，还会考虑附加的函数级限定符:
	
	|函数级限定符	|是否用于重载|
	|---|---|
	|`const` or `volatile`|	Yes
	|[[ref-qualifier|引用限定符(Ref-qualifiers)]]	|Yes
	
	例如，`const` 成员函数可以与其他完全相同的非 `const` 成员函数区别开来(即使它们共享相同的形参集)。


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


!!! info "扩展阅读"

	我们还没有涉及到省略号，但是省略号参数被认为是一种独特的参数类型:

	```cpp
	void foo(int x, int y);
	void foo(int x, ...); // 和 foo(int, int)是不同的
	```

## 返回值类型不能被用来区分函数


A function’s return type is not considered when differentiating overloaded functions.

Consider the case where you want to write a function that returns a random number, but you need a version that will return an int, and another version that will return a double. You might be tempted to do this:

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

This makes sense. If you were the compiler, and you saw this statement:

```cpp
getRandomValue();
```


Which of the two overloaded functions would you call? It’s not clear.

!!! cite "题外话"

    This was an intentional choice, as it ensures the behavior of a function call can be determined independently from the rest of the expression, making understanding complex expressions much simpler. Put another way, we can always determine which version of a function will be called based solely on the arguments in the function call. If return values were used for differentiation, then we wouldn’t have an easy syntactic way to tell which overload of a function was being called -- we’d also have to understand how the return value was being used, which requires a lot more analysis.

The best way to address this is to give the functions different names:

```cpp
int getRandomInt();
double getRandomDouble();
```


## 类型签名

函数的 [[type-signature|类型签名(type signature)]] (通常简称为签名) is defined as the parts of the function header that are used for differentiation of the function. In C++, this includes the function name, number of parameter, parameter type, and function-level qualifiers. It notably does _not_ include the return type.

## Name mangling

!!! cite "题外话"

    When the compiler compiles a function, it performs name mangling, which means the compiled name of the function is altered (“mangled”) based on various criteria, such as the number and type of parameters, so that the linker has unique names to work with.

	For example, some function with prototype `int fcn()` might compile to name `__fcn_v`, whereas `int fcn(int)` might compile to name `__fcn_i`. So while in the source code, two overloaded functions share a name, in compiled code, the names are actually unique.

	There is no standardization on how names should be mangled, so different compilers will produce different mangled names.